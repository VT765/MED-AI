// Native fetch is available in Node.js 18+

const BASE_URL = 'http://localhost:3000/api/auth';

async function testAuth() {
    console.log('--- Testing Signup ---');
    const user = {
        name: "Debug User",
        email: `debug_${Date.now()}@test.com`,
        password: "password123"
    };

    try {
        const signupRes = await fetch(`${BASE_URL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });

        const signupData = await signupRes.json();
        console.log('Signup Status:', signupRes.status);
        console.log('Signup Response:', signupData);

        if (signupRes.status !== 201) {
            console.error("Signup failed, aborting login test.");
            return;
        }

        console.log('\n--- Testing Login ---');
        const loginRes = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: user.email,
                password: user.password
            })
        });

        const loginData = await loginRes.json();
        console.log('Login Status:', loginRes.status);
        console.log('Login Response:', loginData);

    } catch (err) {
        console.error('Test failed:', err);
    }
}

testAuth();
