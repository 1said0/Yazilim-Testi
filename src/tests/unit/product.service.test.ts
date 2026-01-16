import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } from '../../services/product.service';
import { PrismaClient } from '@prisma/client';

// Mock Prisma Client
const prisma = new PrismaClient();
jest.mock('@prisma/client', () => {
    const mPrisma = {
        product: {
            create: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mPrisma) };
});

describe('Product Service', () => {
    let prismaMock: any;

    beforeEach(() => {
        prismaMock = new PrismaClient();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createProduct', () => {
        it('should create a new product', async () => {
            const productInput = { name: 'Test Product', price: 100, stock: 10, description: 'Test Desc' };
            const createdProduct = { id: 1, ...productInput, createdAt: new Date(), updatedAt: new Date() };

            // @ts-ignore
            prismaMock.product.create.mockResolvedValue(createdProduct);

            // @ts-ignore
            const result = await createProduct(productInput);

            expect(prismaMock.product.create).toHaveBeenCalledWith({ data: productInput });
            expect(result).toEqual(createdProduct);
        });
    });

    describe('getAllProducts', () => {
        it('should return all products', async () => {
            const products = [
                { id: 1, name: 'P1', price: 10, stock: 5 },
                { id: 2, name: 'P2', price: 20, stock: 10 }
            ];

            prismaMock.product.findMany.mockResolvedValue(products);

            const result = await getAllProducts();

            expect(prismaMock.product.findMany).toHaveBeenCalledWith({ include: { categories: true } });
            expect(result).toEqual(products);
        });
    });

    describe('getProductById', () => {
        it('should return a product by id', async () => {
            const product = { id: 1, name: 'P1' };
            prismaMock.product.findUnique.mockResolvedValue(product);

            const result = await getProductById(1);

            expect(prismaMock.product.findUnique).toHaveBeenCalledWith({ where: { id: 1 }, include: { categories: true } });
            expect(result).toEqual(product);
        });
    });

    describe('updateProduct', () => {
        it('should update a product', async () => {
            const updateData = { name: 'Updated P1' };
            const updatedProduct = { id: 1, name: 'Updated P1' };
            prismaMock.product.update.mockResolvedValue(updatedProduct);

            const result = await updateProduct(1, updateData);

            expect(prismaMock.product.update).toHaveBeenCalledWith({ where: { id: 1 }, data: updateData });
            expect(result).toEqual(updatedProduct);
        });
    });

    describe('deleteProduct', () => {
        it('should delete a product', async () => {
            const deletedProduct = { id: 1, name: 'Deleted P1' };
            prismaMock.product.delete.mockResolvedValue(deletedProduct);

            const result = await deleteProduct(1);

            expect(prismaMock.product.delete).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(result).toEqual(deletedProduct);
        });
    });
});
