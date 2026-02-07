// Use native fetch (Node 18+)
async function run() {
    try {
        const res = await fetch('http://localhost:3000/api/debug/pump');
        console.log('Status:', res.status);
        const json = await res.json();
        console.log('Response:', JSON.stringify(json, null, 2));
    } catch (e) {
        console.error('Fetch error:', e);
    }
}

run();
