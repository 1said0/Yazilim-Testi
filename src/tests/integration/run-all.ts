import { execSync } from 'child_process';

const scripts = [
    'src/tests/integration/run-users.ts',
    'src/tests/integration/run-orders.ts'
];

console.log('🚀 Running ALL Integration Tests...');

try {
    for (const script of scripts) {
        console.log(`\n▶️  Running ${script}...`);
        execSync(`npx ts-node ${script}`, { stdio: 'inherit' });
    }
    console.log('\n✅ All Integration Tests Passed!');
} catch (error) {
    console.error('\n❌ Integration Tests Failed.');
    process.exit(1);
}
