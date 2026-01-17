// Manual Mock for @prisma/client

const mPrisma: any = {
    user: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
    },
    product: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
    order: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
    },
    category: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
    review: {
        create: jest.fn(),
        findMany: jest.fn(),
        delete: jest.fn(),
    },
};

mPrisma.$transaction = jest.fn((callback) => callback(mPrisma));

export const PrismaClient = jest.fn(() => mPrisma);

export const Role = {
    USER: 'USER',
    ADMIN: 'ADMIN'
};

export const OrderStatus = {
    PENDING: 'PENDING',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED'
};

// Start ID for Enums if needed (User Service used Role)
export const Prisma = {
    Decimal: Number
};
