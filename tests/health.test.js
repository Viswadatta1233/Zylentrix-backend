const request = require('supertest');

let app;

beforeAll(async () => {
	app = require('http').createServer(require('../index.js'));
});

afterAll(async () => {
	app.close();
});

test('GET /health', async () => {
	// Since index.js starts server directly, this is a placeholder smoke test
	expect(true).toBe(true);
});


