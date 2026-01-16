import { PrismaClient, Order, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

// Sipariş oluşturma (Transaction ile: Sipariş + Sipariş Kalemleri)
export const createOrder = async (userId: number, items: { productId: number; quantity: number }[]) => {
    // 1. Ürün fiyatlarını al ve stok kontrolü yap
    let total = 0;
    const orderItemsData: { productId: number; quantity: number; price: Prisma.Decimal }[] = [];

    for (const item of items) {
        const product = await prisma.product.findUnique({ where: { id: item.productId } });
        if (!product) {
            throw new Error(`Product with ID ${item.productId} not found`);
        }
        if (product.stock < item.quantity) {
            throw new Error(`Insufficient stock for product ${product.name}`);
        }

        total += Number(product.price) * item.quantity;
        orderItemsData.push({
            productId: item.productId,
            quantity: item.quantity,
            price: product.price
        });
    }

    // 2. Transaction başlat: Siparişi oluştur ve stokları düş
    return await prisma.$transaction(async (tx) => {
        // Stokları güncelle
        for (const item of items) {
            await tx.product.update({
                where: { id: item.productId },
                data: { stock: { decrement: item.quantity } }
            });
        }

        // Siparişi oluştur
        const order = await tx.order.create({
            data: {
                userId,
                total,
                items: {
                    create: orderItemsData
                }
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        return order;
    });
};

// Tüm siparişleri getir
export const getAllOrders = async (): Promise<Order[]> => {
    return prisma.order.findMany({
        include: {
            user: {
                select: { id: true, name: true, email: true }
            },
            items: {
                include: { product: true }
            }
        }
    });
};

// ID'ye göre sipariş getir
export const getOrderById = async (id: number): Promise<Order | null> => {
    return prisma.order.findUnique({
        where: { id },
        include: {
            user: {
                select: { id: true, name: true, email: true }
            },
            items: {
                include: { product: true }
            }
        }
    });
};

// Kullanıcıya ait siparişleri getir
export const getOrdersByUserId = async (userId: number): Promise<Order[]> => {
    return prisma.order.findMany({
        where: { userId },
        include: {
            items: {
                include: { product: true }
            }
        }
    });
};
