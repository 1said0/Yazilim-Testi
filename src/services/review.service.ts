import { PrismaClient, Review, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export const createReview = async (data: Prisma.ReviewCreateInput): Promise<Review> => {
    return prisma.review.create({ data });
};

export const getReviewsByProductId = async (productId: number): Promise<Review[]> => {
    return prisma.review.findMany({
        where: { productId },
        include: {
            user: {
                select: { id: true, name: true }
            }
        }
    });
};

export const deleteReview = async (id: number): Promise<Review> => {
    return prisma.review.delete({ where: { id } });
};
