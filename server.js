// Import some dependencies / packages

// Express Framework used for handling HTTP requests and responses
const express = require('express');
// Create an instance of the framework
const app = express();
// DBMS Mysql
const mysql = require('mysql2')
// Cross origin resource sharing
const cors = require('cors');
// Environment variable
const dotenv = require('dotenv');

app.use(express.json());
app.use(cors());
dotenv.config();

// connecting to the database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Test the database connection

db.connect((err) => {
    if (err) {
        console.log('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to MySQL Database');
});

// 1. Retrieve all patients
app.get('/patients', (req, res) => {
    db.query('SELECT patient_id, first_name, last_name, date_of_birth FROM patients', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error retrieving patients' });
        }
        res.json(results); // Send patient data as JSON
    });
});

// 2. Retrieve all providers
app.get('/providers', (req, res) => {
    db.query('SELECT first_name, last_name, provider_specialty FROM providers', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error retrieving providers' });
        }
        res.json(results); // Send provider data as JSON
    });
});

// 3. Filter patients by First Name
app.get('/patients/first_name/:first_name', (req, res) => {
    const { first_name } = req.params;
    db.query('SELECT first_name FROM patients;', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error retrieving patients by first name' });
        }
        res.json(results); // Send filtered patient data as JSON
    });
});

// 4. Retrieve all providers by their specialty
app.get('/providers/specialty/:specialty', (req, res) => {
    const { specialty } = req.params;
    db.query('SELECT provider_specialty FROM providers;', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error retrieving providers by specialty' });
        }
        res.json(results); // Send filtered provider data as JSON
    });
});


// Listen to the server
const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


// Get all patients: http://localhost:3000/patients
// Get all providers: http://localhost:3000/providers
// Filter patients by first name: http://localhost:3000/patients/first_name/{first_name}
// Filter providers by specialty: http://localhost:3000/providers/specialty/{specialty}