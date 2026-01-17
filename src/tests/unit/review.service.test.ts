import { createReview, getReviewsByProductId, deleteReview } from '../../services/review.service';
import { PrismaClient } from '@prisma/client';

// Define Mock Structure
jest.mock('@prisma/client', () => {
    const originalModule = jest.requireActual('@prisma/client');

    const reviewMethods = {
        create: jest.fn(),
        findMany: jest.fn(),
        delete: jest.fn(),
    };

    const mPrisma = {
        review: reviewMethods
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

describe('Review Service', () => {
    let prismaMock: any;

    beforeEach(() => {
        // Retrieve the shared mock instance
        prismaMock = (PrismaClient as any).mockInstance;
        jest.clearAllMocks();
    });

    describe('createReview', () => {
        it('should create a new review', async () => {
            const reviewInput = {
                rating: 5,
                comment: 'Great product',
                user: { connect: { id: 1 } },
                product: { connect: { id: 1 } }
            };
            const createdReview = {
                id: 1,
                rating: 5,
                comment: 'Great product',
                userId: 1,
                productId: 1,
                createdAt: new Date()
            };

            prismaMock.review.create.mockResolvedValue(createdReview);

            const result = await createReview(reviewInput);

            expect(prismaMock.review.create).toHaveBeenCalledWith({ data: reviewInput });
            expect(result).toEqual(createdReview);
        });
    });

    describe('getReviewsByProductId', () => {
        it('should return reviews for a product', async () => {
            const reviews = [
                { id: 1, userId: 1, productId: 1, rating: 5, comment: 'Great' },
                { id: 2, userId: 2, productId: 1, rating: 4, comment: 'Good' }
            ];

            prismaMock.review.findMany.mockResolvedValue(reviews);

            const result = await getReviewsByProductId(1);

            expect(prismaMock.review.findMany).toHaveBeenCalledWith({
                where: { productId: 1 },
                include: { user: { select: { id: true, name: true } } }
            });
            expect(result).toEqual(reviews);
        });
    });

    describe('deleteReview', () => {
        it('should delete a review', async () => {
            const deletedReview = { id: 1, userId: 1, productId: 1, rating: 5 };
            prismaMock.review.delete.mockResolvedValue(deletedReview);

            const result = await deleteReview(1);

            expect(prismaMock.review.delete).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(result).toEqual(deletedReview);
        });
    });
});
