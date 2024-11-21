const request = require('supertest');
const express = require('express');
const app = express();
app.use(express.json());
app.use('/auth', require('../routes/authRoutes')); 

describe('POST /auth/register', () => {
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({
                username: 'testuser',
                password: 'testpass',
                email: 'testuser@example.com'
            });
        expect(res.status).toBe(201);
        expect(res.body.message).toBe('User register successfully');
    });

    it('should return error if username or email already exists', async () => {
        await request(app)
            .post('/auth/register')
            .send({
                username: 'testuser',
                password: 'testpass',
                email: 'testuser@example.com'
            });

        const res = await request(app)
            .post('/auth/register')
            .send({
                username: 'testuser',
                password: 'newpassword',
                email: 'testuser@example.com'
            });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Username or Email already exists');
    });
});

describe('POST /auth/login', () => {
    it('should login successfully', async () => {
        await request(app)
            .post('/auth/register')
            .send({
                username: 'testuser',
                password: 'testpass',
                email: 'testuser@example.com'
            });

        const res = await request(app)
            .post('/auth/login')
            .send({
                email: 'testuser@example.com',
                password: 'testpass'
            });

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Login successful');
        expect(res.body.token).toBeDefined();
    });

    it('should return error if user not found', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({
                email: 'nonexistent@example.com',
                password: 'wrongpassword'
            });

        expect(res.status).toBe(404);
        expect(res.body.message).toBe('User not found');
    });

    it('should return error if password is incorrect', async () => {
        await request(app)
            .post('/auth/register')
            .send({
                username: 'testuser',
                password: 'testpass',
                email: 'testuser@example.com'
            });

        const res = await request(app)
            .post('/auth/login')
            .send({
                email: 'testuser@example.com',
                password: 'wrongpassword'
            });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Invalid username or password');
    });
});
