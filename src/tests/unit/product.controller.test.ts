import { Request, Response } from 'express';
import * as productController from '../../controllers/product.controller';
import * as productService from '../../services/product.service';

jest.mock('../../services/product.service');

describe('Product Controller', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let json: jest.Mock;
    let status: jest.Mock;

    beforeEach(() => {
        json = jest.fn();
        status = jest.fn().mockReturnValue({ json });
        req = {};
        res = { status: status as any, json: json as any };
        jest.clearAllMocks();
    });

    describe('createProduct', () => {
        it('should create a product and return 201', async () => {
            req.body = { name: 'Test' };
            (productService.createProduct as jest.Mock).mockResolvedValue({ id: 1, name: 'Test' });

            await productController.createProduct(req as Request, res as Response);

            expect(status).toHaveBeenCalledWith(201);
            expect(json).toHaveBeenCalledWith({ id: 1, name: 'Test' });
        });

        it('should handle errors and return 500', async () => {
            req.body = { name: 'Fail' };
            (productService.createProduct as jest.Mock).mockRejectedValue(new Error('Error'));

            await productController.createProduct(req as Request, res as Response);

            expect(status).toHaveBeenCalledWith(500);
            expect(json).toHaveBeenCalledWith({ error: 'Error' });
        });
    });

    describe('getAllProducts', () => {
        it('should return list of products', async () => {
            (productService.getAllProducts as jest.Mock).mockResolvedValue([]);
            await productController.getAllProducts(req as Request, res as Response);
            expect(status).toHaveBeenCalledWith(200);
            expect(json).toHaveBeenCalledWith([]);
        });
    });
});
