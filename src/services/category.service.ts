import { PrismaClient, Category, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export const createCategory = async (data: Prisma.CategoryCreateInput): Promise<Category> => {
    return prisma.category.create({ data });
};

export const getAllCategories = async (): Promise<Category[]> => {
    return prisma.category.findMany({ include: { products: true } });
};

export const getCategoryById = async (id: number): Promise<Category | null> => {
    return prisma.category.findUnique({ where: { id }, include: { products: true } });
};

export const updateCategory = async (id: number, data: Prisma.CategoryUpdateInput): Promise<Category> => {
    return prisma.category.update({ where: { id }, data });
};

export const deleteCategory = async (id: number): Promise<Category> => {
    return prisma.category.delete({ where: { id } });
};
