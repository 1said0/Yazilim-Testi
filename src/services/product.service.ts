import { PrismaClient, Product, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export const createProduct = async (data: Prisma.ProductCreateInput): Promise<Product> => {
    return prisma.product.create({ data });
};

export const getAllProducts = async (): Promise<Product[]> => {
    return prisma.product.findMany({ include: { categories: true } });
};

export const getProductById = async (id: number): Promise<Product | null> => {
    return prisma.product.findUnique({ where: { id }, include: { categories: true } });
};

export const updateProduct = async (id: number, data: Prisma.ProductUpdateInput): Promise<Product> => {
    return prisma.product.update({ where: { id }, data });
};

export const deleteProduct = async (id: number): Promise<Product> => {
    return prisma.product.delete({ where: { id } });
};
