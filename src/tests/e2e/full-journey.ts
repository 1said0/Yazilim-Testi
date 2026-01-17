import request from 'supertest';
import app from '../../app';
import { prisma } from '../../prisma';
import assert from 'assert';

async function runFullJourney() {
    console.log('🚀 Starting E2E Full Journey Test...');
    console.log('====================================');

    // State Variables
    let categoryId: number;
    let productId: number;
    let userId: number;
    let orderId: number;

    // Constants
    const timestamp = Date.now();
    const adminEmail = `admin-${timestamp}@shop.com`;
    const userEmail = `shopper-${timestamp}@shop.com`;
    const productPrice = 250.50;
    const initialStock = 10;
    const orderQty = 2;

    try {
        await prisma.$connect();

        // --- STEP 1: ADMIN SETUP ---
        console.log('\n🏪 PHASE 1: ADMIN SETUP');

        // 1.1 Create Category
        console.log('   Create Category...');
        const catRes = await request(app).post('/api/categories').send({
            name: `E2E Category ${timestamp}`
        });
        assert.strictEqual(catRes.status, 201);
        categoryId = catRes.body.id;
        console.log('   ✅ Category Created.');

        // 1.2 Create Product
        console.log('   Create Product...');
        const prodRes = await request(app).post('/api/products').send({
            name: 'Premium E2E Widget',
            description: 'Best widget for testing',
            price: productPrice,
            stock: initialStock,
            categoryId: categoryId
        });
        assert.strictEqual(prodRes.status, 201);
        productId = prodRes.body.id;
        console.log('   ✅ Product Created.');


        // --- STEP 2: USER ONBOARDING ---
        console.log('\n👤 PHASE 2: USER ONBOARDING');

        // 2.1 Register User
        console.log('   Registering New User...');
        const userRes = await request(app).post('/api/users').send({
            email: userEmail,
            name: 'Happy Shopper',
            password: 'secretPassword'
        });
        assert.strictEqual(userRes.status, 201);
        userId = userRes.body.id;
        console.log('   ✅ User Registered.');


        // --- STEP 3: SHOPPING & ORDERING ---
        console.log('\n🛒 PHASE 3: SHOPPING FLOW');

        // 3.1 Browse Products
        console.log('   Browsing Products...');
        const listRes = await request(app).get('/api/products');
        assert.strictEqual(listRes.status, 200);
        const productFound = listRes.body.find((p: any) => p.id === productId);
        assert.ok(productFound, 'Newly created product should be visible in catalog');
        console.log('   ✅ Product found in catalog.');

        // 3.2 Place Order
        console.log('   Placing Order...');
        const orderRes = await request(app).post('/api/orders').send({
            userId: userId,
            items: [
                { productId: productId, quantity: orderQty }
            ]
        });
        assert.strictEqual(orderRes.status, 201);
        orderId = orderRes.body.id;
        const expectedTotal = productPrice * orderQty;
        assert.strictEqual(parseFloat(orderRes.body.total), expectedTotal);
        console.log(`   ✅ Order placed. Total: ${expectedTotal}`);


        // --- STEP 4: SYSTEM VERIFICATION ---
        console.log('\n🛡️ PHASE 4: VERIFICATION');

        // 4.1 Verify Stock Reduction
        console.log('   Verifying Inventory...');
        const dbProduct = await prisma.product.findUnique({ where: { id: productId } });
        assert.ok(dbProduct);
        const expectedStock = initialStock - orderQty;
        assert.strictEqual(dbProduct.stock, expectedStock);
        console.log(`   ✅ Stock updated correctly (${initialStock} -> ${dbProduct.stock}).`);

        // 4.2 Verify User Order History
        console.log('   Verifying Order History...');
        // Note: We don't have a specific endpoint for "my orders" yet, so verifying via admin endpoint or DB
        // Let's assume verifying via DB for E2E correctness guarantees data integrity
        const dbOrder = await prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true }
        });
        assert.ok(dbOrder);
        assert.strictEqual(dbOrder.userId, userId);
        assert.strictEqual(dbOrder.items.length, 1);
        console.log('   ✅ Order record saved correctly.');

        console.log('\n✨ E2E SCENARIO PASSED SUCCESSFULLY! ✨');

    } catch (error) {
        console.error('\n❌ E2E SCENARIO FAILED');
        console.error(error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

runFullJourney();
