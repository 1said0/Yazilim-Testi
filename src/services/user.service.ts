import { PrismaClient, User, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export const createUser = async (data: Prisma.UserCreateInput): Promise<User> => {
    return prisma.user.create({ data });
};

export const getAllUsers = async (): Promise<User[]> => {
    return prisma.user.findMany();
};

export const getUserById = async (id: number): Promise<User | null> => {
    return prisma.user.findUnique({ where: { id } });
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
    return prisma.user.findUnique({ where: { email } });
};

export const updateUser = async (id: number, data: Prisma.UserUpdateInput): Promise<User> => {
    return prisma.user.update({
        where: { id },
        data
    });
};

export const deleteUser = async (id: number): Promise<User> => {
    return prisma.user.delete({
        where: { id }
    });
};
