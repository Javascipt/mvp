require('dotenv').config();
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser')
const db = require('./db');
const config = require('./config');

const app = express();
app.use(bodyParser.json({}));

app.post('/contact-us', async (req, res) => {
    try {
        const data = req.body;

        console.log('Data received - %j', data);
        if (_.some(['name', 'phoneNumber', 'address', 'email'], key => !_.has(data, key)) || _.isEmpty(data.tasks)) {
            return res.status(400).json({
                success: false,
                error: 'Incorrect Data',
            });
        }

        await db.insert('lead', { ...data, tasks: JSON.stringify(data.tasks) });

        return res.status(200).json({ success: true });
    } catch (error) {
        console.log('Error: %j', {
            message: error.message,
            stack: error.stack,
            error
        });

        return res.status(500).json({
            success: false,
            error: 'Internal Server Error',
        });
    }
});

app.listen(config.http.port);
