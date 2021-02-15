const express   = require("express");
const app       = express();
const connectDB = require('./config/db');

// Connect database (MongoDB)
connectDB();

// Init Middleware 
// This middleware gives us oportunity to 
// read req.body data in more comfortable json object
app.use(express.json({ extended: false }));

// Checking if http (and server) works
app.get('/', (req, res) => res.send('API running'));

// Define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/auth', require('./routes/api/auth'));

// Init port
const PORT = process.env.PORT ?? 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})