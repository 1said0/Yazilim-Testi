import { Request, Response } from 'express';
import * as reviewService from '../services/review.service';

export const createReview = async (req: Request, res: Response) => {
    try {
        const review = await reviewService.createReview(req.body);
        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const getReviewsByProductId = async (req: Request, res: Response) => {
    try {
        const productId = parseInt(req.params.productId as string);
        const reviews = await reviewService.getReviewsByProductId(productId);
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const deleteReview = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string);
        await reviewService.deleteReview(id);
        res.status(204).send();
    } catch (error) {
        const err = error as any;
        if (err.code === 'P2025') {
            res.status(404).json({ error: 'Review not found' });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
};
