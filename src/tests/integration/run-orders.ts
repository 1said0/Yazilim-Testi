import request from 'supertest';
import app from '../../app';
import { prisma } from '../../prisma';
import assert from 'assert';

async function runOrderTests() {
    console.log('🚀 Starting Order Integration Tests (Standalone)...');

    // Variables to store created IDs
    let userId: number;
    let productId: number;
    const initialStock = 100;
    const orderQuantity = 5;

    try {
        await prisma.$connect();

        // 1. Setup Phase: Create User, Category, Product
        console.log('\n📦 1. Setup: Creating Dependencies...');

        // Create User
        const userRes = await request(app).post('/api/users').send({
            email: `order-user-${Date.now()}@test.com`,
            password: 'password123',
            name: 'Order Tester'
        });
        userId = userRes.body.id;
        assert.ok(userId, 'User ID should exist');
        console.log('   ✅ User created.');

        // Create Category
        const catRes = await request(app).post('/api/categories').send({
            name: `Order Category ${Date.now()}`
        });
        const categoryId = catRes.body.id;
        console.log('   ✅ Category created.');

        // Create Product
        const prodRes = await request(app).post('/api/products').send({
            name: 'Order Test Product',
            price: 50,
            stock: initialStock,
            description: 'For orders',
            categoryId: categoryId
        });

        if (prodRes.status !== 201) {
            console.error('❌ Failed to create product:', prodRes.body);
        }

        productId = prodRes.body.id;
        assert.ok(productId, 'Product ID should exist');
        console.log('   ✅ Product created.');


        // 2. Test Order Creation
        console.log('\n📝 2. Test: POST /api/orders - Create Order');
        const orderRes = await request(app).post('/api/orders').send({
            userId: userId,
            items: [
                { productId: productId, quantity: orderQuantity }
            ]
        });

        if (orderRes.status !== 201) {
            console.error('❌ Failed to create order:', orderRes.body);
            process.exit(1);
        }

        assert.strictEqual(orderRes.status, 201);
        assert.ok(orderRes.body.id, 'Order ID should exist');
        assert.strictEqual(parseFloat(orderRes.body.total), 50 * orderQuantity, 'Total price mismatch');
        console.log('   ✅ Order created successfully.');


        // 3. Verify Stock Reduction (Transaction Check)
        console.log('\n📝 3. Verify: Database State (Transaction Check)');
        const updatedProduct = await prisma.product.findUnique({
            where: { id: productId }
        });

        assert.ok(updatedProduct);
        assert.strictEqual(updatedProduct.stock, initialStock - orderQuantity, 'Stock was not reduced correctly!');
        console.log(`   ✅ Stock successfully reduced from ${initialStock} to ${updatedProduct.stock}.`);


        // 4. Test Insufficient Stock
        console.log('\n📝 4. Test: POST /api/orders - Insufficient Stock');
        const invalidOrderRes = await request(app).post('/api/orders').send({
            userId: userId,
            items: [
                { productId: productId, quantity: initialStock + 1 } // Request more than available
            ]
        });

        assert.strictEqual(invalidOrderRes.status, 400);
        console.log('   ✅ Insufficient stock rejected.');

    } catch (error) {
        console.error('❌ Test Execution Failed:', error);
        process.exit(1);
    } finally {
        // Cleanup could go here, but for now we rely on distinct data
        await prisma.$disconnect();
        console.log('\n🏁 Order Tests Completed.');
    }
}

runOrderTests();
