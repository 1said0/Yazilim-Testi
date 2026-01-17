import { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory } from '../../services/category.service';
import { PrismaClient } from '@prisma/client';

// Define Mock Structure
jest.mock('@prisma/client', () => {
    const originalModule = jest.requireActual('@prisma/client');

    const categoryMethods = {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    };

    const mPrisma = {
        category: categoryMethods
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

describe('Category Service', () => {
    let prismaMock: any;

    beforeEach(() => {
        // Retrieve the shared mock instance
        prismaMock = (PrismaClient as any).mockInstance;
        jest.clearAllMocks();
    });

    describe('createCategory', () => {
        it('should create a new category', async () => {
            const categoryInput = { name: 'Electronics' };
            const createdCategory = { id: 1, ...categoryInput };

            prismaMock.category.create.mockResolvedValue(createdCategory);

            const result = await createCategory(categoryInput);

            expect(prismaMock.category.create).toHaveBeenCalledWith({ data: categoryInput });
            expect(result).toEqual(createdCategory);
        });
    });

    describe('getAllCategories', () => {
        it('should return all categories', async () => {
            const categories = [
                { id: 1, name: 'Electronics' },
                { id: 2, name: 'Books' }
            ];

            prismaMock.category.findMany.mockResolvedValue(categories);

            const result = await getAllCategories();

            expect(prismaMock.category.findMany).toHaveBeenCalledWith({ include: { products: true } });
            expect(result).toEqual(categories);
        });
    });

    describe('getCategoryById', () => {
        it('should return a category by id', async () => {
            const category = { id: 1, name: 'Electronics' };
            prismaMock.category.findUnique.mockResolvedValue(category);

            const result = await getCategoryById(1);

            expect(prismaMock.category.findUnique).toHaveBeenCalledWith({ where: { id: 1 }, include: { products: true } });
            expect(result).toEqual(category);
        });
    });

    describe('updateCategory', () => {
        it('should update a category', async () => {
            const updateData = { name: 'Updated Electronics' };
            const updatedCategory = { id: 1, name: 'Updated Electronics' };
            prismaMock.category.update.mockResolvedValue(updatedCategory);

            const result = await updateCategory(1, updateData);

            expect(prismaMock.category.update).toHaveBeenCalledWith({ where: { id: 1 }, data: updateData });
            expect(result).toEqual(updatedCategory);
        });
    });

    describe('deleteCategory', () => {
        it('should delete a category', async () => {
            const deletedCategory = { id: 1, name: 'Deleted Category' };
            prismaMock.category.delete.mockResolvedValue(deletedCategory);

            const result = await deleteCategory(1);

            expect(prismaMock.category.delete).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(result).toEqual(deletedCategory);
        });
    });
});
