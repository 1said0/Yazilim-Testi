import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } from '../../services/product.service';
import { PrismaClient } from '@prisma/client';

// Define Mock Structure
jest.mock('@prisma/client', () => {
    const originalModule = jest.requireActual('@prisma/client');

    const productMethods = {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    };

    const mPrisma = {
        product: productMethods
    };

    // Create the Mock Constructor
    const MockConstructor = jest.fn(() => mPrisma);

    // Attach the mock instance to the constructor so we can access it in tests
    (MockConstructor as any).mockInstance = mPrisma;

    return {
        __esModule: true,
        ...originalModule,
        PrismaClient: MockConstructor,
    };
});

describe('Product Service', () => {
    let prismaMock: any;

    beforeEach(() => {
        // Retrieve the shared mock instance
        prismaMock = (PrismaClient as any).mockInstance;
        jest.clearAllMocks();
    });

    describe('createProduct', () => {
        it('should create a new product', async () => {
            const productInput = { name: 'Test Product', price: 100, stock: 10, description: 'Test Desc' };
            const createdProduct = { id: 1, ...productInput, createdAt: new Date(), updatedAt: new Date() };

            prismaMock.product.create.mockResolvedValue(createdProduct);

            // Need to cast input because price type mismatch might occur in tests if not careful, 
            // but here we just pass simple object
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

            // @ts-ignore
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
