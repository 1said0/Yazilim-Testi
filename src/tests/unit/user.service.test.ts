import { createUser, getAllUsers, getUserById, getUserByEmail } from '../../services/user.service';
import { PrismaClient, Role } from '@prisma/client';

// Define Mock Structure
jest.mock('@prisma/client', () => {
    const originalModule = jest.requireActual('@prisma/client');

    const userMethods = {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
    };

    const mPrisma = {
        user: userMethods
    };

    // Create the Mock Constructor
    const MockConstructor = jest.fn(() => mPrisma);

    // Attach the mock instance to the constructor so we can access it in tests
    // This bypasses the hoisting limitation
    (MockConstructor as any).mockInstance = mPrisma;

    return {
        __esModule: true,
        ...originalModule,
        PrismaClient: MockConstructor,
    };
});

describe('User Service', () => {
    let prismaMock: any;

    beforeEach(() => {
        // Retrieve the shared mock instance attached to the constructor
        prismaMock = (PrismaClient as any).mockInstance;
        jest.clearAllMocks();
    });

    describe('createUser', () => {
        it('should create a new user', async () => {
            const userInput = { email: 'test@example.com', password: 'password123', name: 'Test User' };
            const createdUser = {
                id: 1,
                ...userInput,
                role: Role.USER,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            prismaMock.user.create.mockResolvedValue(createdUser);

            const result = await createUser(userInput);

            expect(prismaMock.user.create).toHaveBeenCalledWith({ data: userInput });
            expect(result).toEqual(createdUser);
        });
    });

    describe('getAllUsers', () => {
        it('should return all users', async () => {
            const users = [
                { id: 1, email: 'user1@example.com', name: 'User 1' },
                { id: 2, email: 'user2@example.com', name: 'User 2' }
            ];

            prismaMock.user.findMany.mockResolvedValue(users);

            const result = await getAllUsers();

            expect(prismaMock.user.findMany).toHaveBeenCalled();
            expect(result).toEqual(users);
        });
    });

    describe('getUserById', () => {
        it('should return a user by id', async () => {
            const user = { id: 1, email: 'test@example.com' };
            prismaMock.user.findUnique.mockResolvedValue(user);

            const result = await getUserById(1);

            expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(result).toEqual(user);
        });

        it('should return null if user not found', async () => {
            prismaMock.user.findUnique.mockResolvedValue(null);
            const result = await getUserById(999);
            expect(result).toBeNull();
        });
    });

    describe('getUserByEmail', () => {
        it('should return a user by email', async () => {
            const user = { id: 1, email: 'test@example.com' };
            prismaMock.user.findUnique.mockResolvedValue(user);

            const result = await getUserByEmail('test@example.com');

            expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
            expect(result).toEqual(user);
        });
    });
});
