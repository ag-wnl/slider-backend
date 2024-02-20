const express = require('express');
const app = express();
const cors = require('cors')

app.use((req, res, next) => {
    const allowedOrigins = ['http://localhost:3000', 'https://sliderjobs.netlify.app'];
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

const linkedinRoutes = require('./routes/linkedin');
const bigTechRoutes = require('./routes/bigTech')
const defaultRoutes = require('./routes/entryPoint')

app.use('/api/linkedin_jobs', linkedinRoutes);
app.use('/api/bigtech', bigTechRoutes);
app.use('/', defaultRoutes);



app.listen(5000, () => { 
    console.log("Server started on port: 5000");
})
// npm run dev