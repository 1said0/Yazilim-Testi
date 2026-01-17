import { Request, Response } from 'express';
import * as reviewController from '../../controllers/review.controller';
import * as reviewService from '../../services/review.service';

jest.mock('../../services/review.service');

describe('Review Controller', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let json: jest.Mock;
    let status: jest.Mock;
    let send: jest.Mock;

    beforeEach(() => {
        json = jest.fn();
        send = jest.fn();
        status = jest.fn().mockReturnValue({ json, send });
        req = {};
        res = { status: status as any, json: json as any, send: send as any };
        jest.clearAllMocks();
    });

    describe('createReview', () => {
        it('should create review', async () => {
            req.body = { rating: 5 };
            (reviewService.createReview as jest.Mock).mockResolvedValue({ id: 1 });
            await reviewController.createReview(req as Request, res as Response);
            expect(status).toHaveBeenCalledWith(201);
        });

        it('should return 500 on error', async () => {
            (reviewService.createReview as jest.Mock).mockRejectedValue(new Error('Fail'));
            await reviewController.createReview(req as Request, res as Response);
            expect(status).toHaveBeenCalledWith(500);
        });
    });

    describe('getReviewsByProductId', () => {
        it('should return reviews', async () => {
            req.params = { productId: '1' };
            (reviewService.getReviewsByProductId as jest.Mock).mockResolvedValue([]);
            await reviewController.getReviewsByProductId(req as Request, res as Response);
            expect(status).toHaveBeenCalledWith(200);
        });
    });

    describe('deleteReview', () => {
        it('should return 204 if deleted', async () => {
            req.params = { id: '1' };
            (reviewService.deleteReview as jest.Mock).mockResolvedValue({ id: 1 });
            await reviewController.deleteReview(req as Request, res as Response);
            expect(status).toHaveBeenCalledWith(204);
        });

        it('should return 404 if not found', async () => {
            req.params = { id: '1' };
            const error: any = new Error('P2025');
            error.code = 'P2025';
            (reviewService.deleteReview as jest.Mock).mockRejectedValue(error);
            await reviewController.deleteReview(req as Request, res as Response);
            expect(status).toHaveBeenCalledWith(404);
        });
    });
});
