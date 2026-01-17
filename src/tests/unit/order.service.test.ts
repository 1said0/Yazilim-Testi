import { PrismaClient } from '@prisma/client';
import * as orderService from '../../services/order.service';

jest.mock('@prisma/client', () => {
    const mPrisma = {
        product: {
            findUnique: jest.fn(),
            update: jest.fn(),
        },
        order: {
            create: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
        },
        $transaction: jest.fn(),
    };
    // Mock constructor
    const MockConstructor = jest.fn(() => mPrisma);
    // Attach for access
    (MockConstructor as any).mockInstance = mPrisma;
    return {
        PrismaClient: MockConstructor,
    };
});

describe('Order Service', () => {
    let mPrisma: any;

    beforeEach(() => {
        jest.clearAllMocks();
        mPrisma = (PrismaClient as any).mockInstance;
        // Default behavior for transaction: execute the callback
        mPrisma.$transaction.mockImplementation(async (callback: any) => {
            return callback(mPrisma);
        });
    });

    describe('createOrder', () => {
        it('should create order and reduce stock', async () => {
            // Setup Product
            mPrisma.product.findUnique.mockResolvedValue({ id: 1, name: 'P1', price: 100, stock: 10 });
            mPrisma.order.create.mockResolvedValue({ id: 1, total: 100 });
            mPrisma.product.update.mockResolvedValue({});

            const result = await orderService.createOrder(1, [{ productId: 1, quantity: 1 }]);

            expect(result).toEqual({ id: 1, total: 100 });
            // Verify stock check
            expect(mPrisma.product.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
            // Verify transaction usage
            expect(mPrisma.$transaction).toHaveBeenCalled();
            // Verify stock update inside transaction
            expect(mPrisma.product.update).toHaveBeenCalledWith(expect.objectContaining({
                where: { id: 1 },
                data: { stock: { decrement: 1 } }
            }));
            // Verify order creation
            expect(mPrisma.order.create).toHaveBeenCalled();
        });

        it('should throw error if product not found', async () => {
            mPrisma.product.findUnique.mockResolvedValue(null);
            await expect(orderService.createOrder(1, [{ productId: 1, quantity: 1 }]))
                .rejects.toThrow('Product with ID 1 not found');
        });

        it('should throw error if insufficient stock', async () => {
            mPrisma.product.findUnique.mockResolvedValue({ id: 1, name: 'P1', price: 100, stock: 0 });
            await expect(orderService.createOrder(1, [{ productId: 1, quantity: 1 }]))
                .rejects.toThrow('Insufficient stock for product P1');
        });
    });

    describe('getAllOrders', () => {
        it('should return orders', async () => {
            mPrisma.order.findMany.mockResolvedValue([]);
            const res = await orderService.getAllOrders();
            expect(res).toEqual([]);
        });
    });

    describe('getOrderById', () => {
        it('should return order', async () => {
            mPrisma.order.findUnique.mockResolvedValue({ id: 1 });
            const res = await orderService.getOrderById(1);
            expect(res).toEqual({ id: 1 });
        });
    });

    describe('getOrdersByUserId', () => {
        it('should return user orders', async () => {
            mPrisma.order.findMany.mockResolvedValue([]);
            const res = await orderService.getOrdersByUserId(1);
            expect(res).toEqual([]);
        });
    });
});
