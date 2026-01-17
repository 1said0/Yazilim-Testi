import { Request, Response } from 'express';
import * as orderService from '../services/order.service';

export const createOrder = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.body.userId); // Normalde Auth middleware'den gelir, şimdilik body'den alalım
        const items = req.body.items; // [{ productId: 1, quantity: 2 }]

        if (!userId || !items || items.length === 0) {
            res.status(400).json({ error: 'User ID and items are required' });
            return;
        }

        const order = await orderService.createOrder(userId, items);
        res.status(201).json(order);
    } catch (error: any) {
        if (error.message.includes('Insufficient stock') || error.message.includes('not found')) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};

export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const orders = await orderService.getAllOrders();
        res.status(200).json(orders);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getOrderById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id as string);
        const order = await orderService.getOrderById(id);

        if (!order) {
            res.status(404).json({ error: 'Order not found' });
            return;
        }

        res.status(200).json(order);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
