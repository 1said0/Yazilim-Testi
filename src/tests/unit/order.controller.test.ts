import { Request, Response } from 'express';
import * as orderController from '../../controllers/order.controller';
import * as orderService from '../../services/order.service';

jest.mock('../../services/order.service');

describe('Order Controller', () => {
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

    describe('createOrder', () => {
        it('should return 400 if missing inputs', async () => {
            req.body = {};
            await orderController.createOrder(req as Request, res as Response);
            expect(status).toHaveBeenCalledWith(400);
        });

        it('should create order and return 201', async () => {
            req.body = { userId: 1, items: [{ productId: 1, quantity: 1 }] };
            (orderService.createOrder as jest.Mock).mockResolvedValue({ id: 1 });
            await orderController.createOrder(req as Request, res as Response);
            expect(status).toHaveBeenCalledWith(201);
        });

        it('should return 400 for insufficient stock', async () => {
            req.body = { userId: 1, items: [{ productId: 1, quantity: 1 }] };
            (orderService.createOrder as jest.Mock).mockRejectedValue(new Error('Insufficient stock for product'));
            await orderController.createOrder(req as Request, res as Response);
            expect(status).toHaveBeenCalledWith(400);
        });

        it('should return 500 for generic error', async () => {
            req.body = { userId: 1, items: [{ productId: 1, quantity: 1 }] };
            (orderService.createOrder as jest.Mock).mockRejectedValue(new Error('DB Error'));
            await orderController.createOrder(req as Request, res as Response);
            expect(status).toHaveBeenCalledWith(500);
        });
    });

    describe('getAllOrders', () => {
        it('should return list', async () => {
            (orderService.getAllOrders as jest.Mock).mockResolvedValue([]);
            await orderController.getAllOrders(req as Request, res as Response);
            expect(status).toHaveBeenCalledWith(200);
        });
    });

    describe('getOrderById', () => {
        it('should return order if found', async () => {
            req.params = { id: '1' };
            (orderService.getOrderById as jest.Mock).mockResolvedValue({ id: 1 });
            await orderController.getOrderById(req as Request, res as Response);
            expect(status).toHaveBeenCalledWith(200);
        });

        it('should return 404 if not found', async () => {
            req.params = { id: '1' };
            (orderService.getOrderById as jest.Mock).mockResolvedValue(null);
            await orderController.getOrderById(req as Request, res as Response);
            expect(status).toHaveBeenCalledWith(404);
        });
    });
});
