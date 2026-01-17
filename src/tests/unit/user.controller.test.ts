import { Request, Response } from 'express';
import * as userController from '../../controllers/user.controller';
import * as userService from '../../services/user.service';

jest.mock('../../services/user.service');

describe('User Controller', () => {
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

    describe('createUser', () => {
        it('should create user and return 201', async () => {
            req.body = { email: 'test@test.com' };
            (userService.createUser as jest.Mock).mockResolvedValue({ id: 1, email: 'test@test.com' });

            await userController.createUser(req as Request, res as Response);

            expect(status).toHaveBeenCalledWith(201);
            expect(json).toHaveBeenCalledWith({ id: 1, email: 'test@test.com' });
        });

        it('should return 400 if email already exists', async () => {
            req.body = { email: 'test@test.com' };
            const error = { code: 'P2002', message: 'Unique constraint' };
            (userService.createUser as jest.Mock).mockRejectedValue(error);

            await userController.createUser(req as Request, res as Response);

            expect(status).toHaveBeenCalledWith(400);
        });

        it('should return 500 on generic error', async () => {
            (userService.createUser as jest.Mock).mockRejectedValue(new Error('Fail'));
            await userController.createUser(req as Request, res as Response);
            expect(status).toHaveBeenCalledWith(500);
        });
    });

    describe('getUserById', () => {
        it('should return user if found', async () => {
            req.params = { id: '1' };
            (userService.getUserById as jest.Mock).mockResolvedValue({ id: 1 });
            await userController.getUserById(req as Request, res as Response);
            expect(status).toHaveBeenCalledWith(200);
        });

        it('should return 404 if not found', async () => {
            req.params = { id: '1' };
            (userService.getUserById as jest.Mock).mockResolvedValue(null);
            await userController.getUserById(req as Request, res as Response);
            expect(status).toHaveBeenCalledWith(404);
        });
    });

    describe('getAllUsers', () => {
        it('should return users', async () => {
            (userService.getAllUsers as jest.Mock).mockResolvedValue([]);
            await userController.getAllUsers(req as Request, res as Response);
            expect(status).toHaveBeenCalledWith(200);
        });
    });

    describe('updateUser', () => {
        it('should return 200 if updated', async () => {
            req.params = { id: '1' };
            req.body = { name: 'New' };
            (userService.updateUser as jest.Mock).mockResolvedValue({ id: 1 });
            await userController.updateUser(req as Request, res as Response);
            expect(status).toHaveBeenCalledWith(200);
        });

        it('should return 404 if not found', async () => {
            req.params = { id: '1' };
            const error = { code: 'P2025', message: 'Not found' };
            (userService.updateUser as jest.Mock).mockRejectedValue(error);
            await userController.updateUser(req as Request, res as Response);
            expect(status).toHaveBeenCalledWith(404);
        });

        it('should return 500 on generic error', async () => {
            req.params = { id: '1' };
            (userService.updateUser as jest.Mock).mockRejectedValue(new Error('Fail'));
            await userController.updateUser(req as Request, res as Response);
            expect(status).toHaveBeenCalledWith(500);
        });
    });

    describe('deleteUser', () => {
        it('should return 204 if deleted', async () => {
            req.params = { id: '1' };
            (userService.deleteUser as jest.Mock).mockResolvedValue({ id: 1 });
            await userController.deleteUser(req as Request, res as Response);
            expect(status).toHaveBeenCalledWith(204);
            expect(send).toHaveBeenCalled();
        });

        it('should return 404 if not found', async () => {
            req.params = { id: '1' };
            const error = { code: 'P2025', message: 'Not found' };
            (userService.deleteUser as jest.Mock).mockRejectedValue(error);
            await userController.deleteUser(req as Request, res as Response);
            expect(status).toHaveBeenCalledWith(404);
        });
    });
});
