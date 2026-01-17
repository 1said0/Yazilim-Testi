import request from 'supertest';
import app from '../../app';
import { prisma } from '../../prisma';
import assert from 'assert';

async function runTests() {
    console.log('🚀 Starting User Integration Tests (Standalone)...');

    try {
        await prisma.$connect();
        console.log('✅ Database connected.');

        // Test 1: Create User
        console.log('\n📝 Test 1: POST /api/users - Create User');
        const email = `integ-${Date.now()}@test.com`;
        const res1 = await request(app).post('/api/users').send({
            email,
            password: 'password123',
            name: 'Integration User'
        });

        if (res1.status !== 201) {
            console.error('❌ Failed to create user:', res1.body);
            process.exit(1);
        }
        assert.strictEqual(res1.status, 201, 'Status should be 201');
        assert.strictEqual(res1.body.email, email);
        console.log('✅ User created successfully.');

        // Test 2: Duplicate Email
        console.log('\n📝 Test 2: POST /api/users - Duplicate Email');
        const res2 = await request(app).post('/api/users').send({
            email,
            password: 'password123',
            name: 'Integration User'
        });

        assert.strictEqual(res2.status, 400, 'Status should be 400 for duplicate');
        console.log('✅ Duplicate email handled correctly.');

        // Test 3: Get Users
        console.log('\n📝 Test 3: GET /api/users - List Users');
        const res3 = await request(app).get('/api/users');
        assert.strictEqual(res3.status, 200);
        assert.ok(Array.isArray(res3.body));
        assert.ok(res3.body.length > 0);
        console.log(`✅ Retrieved ${res3.body.length} users.`);

    } catch (error) {
        console.error('❌ Test Execution Failed:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
        console.log('\n🏁 Tests Completed.');
    }
}

runTests();
