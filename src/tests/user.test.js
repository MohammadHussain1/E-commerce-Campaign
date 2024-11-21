const request = require('supertest');
const express = require('express');
const app = express();
app.use(express.json());
app.use('/users', require('../routes/userRoutes'));
const { generateToken } = require("../utils/generateTokenUtils");

const token = generateToken(1);

describe('User API tests', () => {
    describe('POST /users', () => {
        it('should create a new user', async () => {
            const res = await request(app)
                .post('/users')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    username: 'testkruser',
                    password: 'testkruass',
                    email: 'testkruser@example.com'
                });

            expect(res.status).toBe(201);
            expect(res.body.message).toBe('User created successfully');
        });

        it('should return error if user details already exist', async () => {
            await request(app)
                .post('/users')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    username: 'testuser',
                    password: 'testpass',
                    email: 'testuser@example.com'
                });

            const res = await request(app)
                .post('/users')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    username: 'testuser',
                    password: 'testpass',
                    email: 'testuser@example.com'
                });

            expect(res.status).toBe(400);
            expect(res.body.message).toBe('User details already exist');
        });
    });

    describe('GET /users', () => {
        it('should get all users', async () => {
            const res = await request(app)
                .get('/users')
                .set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(200);
            expect(res.body).toBeInstanceOf(Array);
        });

        it('should return 404 if no users found', async () => {
            const res = await request(app)
                .get('/users')
                .set('Authorization', `Bearer ${token}`);
            if (res.body.length === 0) {
                expect(res.status).toBe(404);
                expect(res.body.message).toBe('No users found');
            } else {
                expect(res.status).toBe(200);
            }
        });
    });

    describe('GET /users/:id', () => {
        it('should get a user by ID', async () => {
            const userRes = await request(app)
                .post('/users')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    username: 'testuser',
                    password: 'testpass',
                    email: 'testuser2@example.com'
                });

            const userId = userRes.body.id;

            const res = await request(app)
                .get(`/users/${userId}`)
                .set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('username', 'testuser');
        });

        it('should return 404 if user not found', async () => {
            const res = await request(app)
                .get('/users/99999')
                .set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(404);
            expect(res.body.message).toBe('User not found');
        });
    });

    describe('PUT /users/:id', () => {
        it('should update a user by ID', async () => {
            const userRes = await request(app)
                .post('/users')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    username: 'updateuser',
                    password: 'testpass',
                    email: 'updateuser@example.com'
                });

            const userId = userRes.body.id;

            const res = await request(app)
                .put(`/users/${userId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    username: 'updateduser',
                    password: 'newpass',
                    email: 'updateuser@example.com'
                });

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('User updated successfully');
        });

        it('should return 400 if user details conflict', async () => {
            await request(app)
                .post('/users')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    username: 'conflictuser',
                    password: 'testpass',
                    email: 'conflictuser@example.com'
                });

            const userRes = await request(app)
                .post('/users')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    username: 'conflictuser2',
                    password: 'testpass',
                    email: 'conflictuser2@example.com'
                });

            const userId = userRes.body.id;

            const res = await request(app)
                .put(`/users/${userId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    username: 'conflictuser',
                    password: 'newpass',
                    email: 'conflictuser@example.com'
                });

            expect(res.status).toBe(400);
            expect(res.body.message).toBe('User details conflict');
        });
    });

    describe('DELETE /users/:id', () => {
        it('should delete a user by ID', async () => {
            const userRes = await request(app)
                .post('/users')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    username: 'deleteuser',
                    password: 'testpass',
                    email: 'deleteuser@example.com'
                });

            const userId = userRes.body.id;

            const res = await request(app)
                .delete(`/users/${userId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('User deleted successfully');
        });

        it('should return 404 if user not found', async () => {
            const res = await request(app)
                .delete('/users/99999')
                .set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(404);
            expect(res.body.message).toBe('User not found');
        });
    });
});
