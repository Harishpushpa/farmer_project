const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/dbconnect')
.then(() => {
    console.log('Connected to database');
})
.catch((error) => {
    console.log('Error:', error);
})


