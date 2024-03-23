const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config({
    path: './.env',
});
const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'openTheBoxUser',
    password: 'openTheBoxPassword',
    database: 'openTheBox'
});

app.post('/users', async (req, res) => {
    const { name, password } = req.body;
    try {
        const result = await pool.query('INSERT INTO users (name, password) VALUES ($1, $2) RETURNING *', [name, password]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/gifts', async (req, res) => {
    const { name, description, text, image, video, music } = req.body;
    try {
        const result = await pool.query('INSERT INTO gift (name, description, text, image, video, music) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [name, description, text, image, video, music]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/signin', async (req, res) => {
    const { name, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE name = $1 AND password = $2', [name, password]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(401).json({ error: 'Invalid username or password' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(process.env.PORT, () => {
    console.log('Server is running on port ', process.env.PORT);
});