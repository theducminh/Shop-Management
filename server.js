require('dotenv').config();
const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const employeesRoutes = require('./routes/employees');
const productsRoutes = require('./routes/products');


const app = express();
const port = process.env.PORT || 3000;

//Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

//Connect SQL Server
const config ={
   user: process.env.DB_USER,
   password: process.env.DB_PASSWORD,
   server: process.env.DB_SERVER,
   port: parseInt(process.env.DB_PORT, 10),
   database: process.env.DB_NAME,
   options:{
    encrypt: true,
    trustServerCertificate: true
   }

}

//Use pool to connect to database

let pool;
const connectToDatabase = async() => {
    try{
       pool = await sql.connect(config);
    }
    catch(err){
       console.error('Error to connect to SQL Server!', err.message);
       setTimeout(connectToDatabase, 3000); // Run conncectToDatabase after 2 seconds
    }
}

connectToDatabase();

// Match pool into response to use routes
app.use((req, res, next) => {
    if(!pool){
        return res.status(500).json({error: 'Can not connect to database'});
    }
    req.pool = pool;
    next();
});

//Call Routes
app.use('/employees', employeesRoutes);
app.use('/products', productsRoutes);

//Starting server

app.listen(port, () => {
    console.log(`Server is running in port ${port}`);
});

