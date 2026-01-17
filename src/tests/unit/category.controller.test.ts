import { Request, Response } from 'express';
import * as categoryController from '../../controllers/category.controller';
import * as categoryService from '../../services/category.service';

jest.mock('../../services/category.service');

describe('Category Controller', () => {
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

    describe('createCategory', () => {
        it('should create category and return 201', async () => {
            req.body = { name: 'Tech' };
            (categoryService.createCategory as jest.Mock).mockResolvedValue({ id: 1, name: 'Tech' });
            await categoryController.createCategory(req as Request, res as Response);
            expect(status).toHaveBeenCalledWith(201);
        });

        it('should return 400 if exists', async () => {
            const error = { code: 'P2002', message: 'Unique constraint' };
            (categoryService.createCategory as jest.Mock).mockRejectedValue(error);
            await categoryController.createCategory(req as Request, res as Response);
            expect(status).toHaveBeenCalledWith(400);
        });

        it('should return 500 on generic error', async () => {
            (categoryService.createCategory as jest.Mock).mockRejectedValue(new Error('Fail'));
            await categoryController.createCategory(req as Request, res as Response);
            expect(status).toHaveBeenCalledWith(500);
        });
    });

    describe('getAllCategories', () => {
        it('should return list', async () => {
            (categoryService.getAllCategories as jest.Mock).mockResolvedValue([]);
            await categoryController.getAllCategories(req as Request, res as Response);
            expect(status).toHaveBeenCalledWith(200);
        });
    });

    describe('getCategoryById', () => {
        it('should return category', async () => {
            req.params = { id: '1' };
            (categoryService.getCategoryById as jest.Mock).mockResolvedValue({ id: 1 });
            await categoryController.getCategoryById(req as Request, res as Response);
            expect(status).toHaveBeenCalledWith(200);
        });

        it('should return 404 if not found', async () => {
            req.params = { id: '1' };
            (categoryService.getCategoryById as jest.Mock).mockResolvedValue(null);
            await categoryController.getCategoryById(req as Request, res as Response);
            expect(status).toHaveBeenCalledWith(404);
        });
    });

    describe('updateCategory', () => {
        it('should update and return 200', async () => {
            req.params = { id: '1' };
            req.body = { name: 'Updated' };
            (categoryService.updateCategory as jest.Mock).mockResolvedValue({ id: 1 });
            await categoryController.updateCategory(req as Request, res as Response);
            expect(status).toHaveBeenCalledWith(200);
        });

        it('should return 400 if name exists', async () => {
            req.params = { id: '1' };
            const error = { code: 'P2002', message: 'Unique constraint' };
            (categoryService.updateCategory as jest.Mock).mockRejectedValue(error);
            await categoryController.updateCategory(req as Request, res as Response);
            expect(status).toHaveBeenCalledWith(400);
        });

        it('should return 404 if not found', async () => {
            req.params = { id: '1' };
            const error = { code: 'P2025', message: 'Not found' };
            (categoryService.updateCategory as jest.Mock).mockRejectedValue(error);
            await categoryController.updateCategory(req as Request, res as Response);
            expect(status).toHaveBeenCalledWith(404);
        });
    });

    describe('deleteCategory', () => {
        it('should delete and return 204', async () => {
            req.params = { id: '1' };
            (categoryService.deleteCategory as jest.Mock).mockResolvedValue({ id: 1 });
            await categoryController.deleteCategory(req as Request, res as Response);
            expect(status).toHaveBeenCalledWith(204);
        });

        it('should return 404 if not found', async () => {
            req.params = { id: '1' };
            const error = { code: 'P2025', message: 'Not found' };
            (categoryService.deleteCategory as jest.Mock).mockRejectedValue(error);
            await categoryController.deleteCategory(req as Request, res as Response);
            expect(status).toHaveBeenCalledWith(404);
        });
    });
});
