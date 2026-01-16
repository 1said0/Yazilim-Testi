import { Router } from 'express';
import * as reviewController from '../controllers/review.controller';

const router = Router();

router.post('/', reviewController.createReview);
router.get('/product/:productId', reviewController.getReviewsByProductId);
router.delete('/:id', reviewController.deleteReview);

export default router;
