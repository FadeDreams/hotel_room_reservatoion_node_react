const mongoose = require('mongoose');

let mongoConnectionURL = 'mongodb+srv://Raphael:qwertyuiop@cluster0.u1vug.mongodb.net/mern-rooms'

mongoose.connect(mongoConnectionURL, {useUnifiedTopology: true, useNewUrlParser:true});

let connection = mongoose.connection;

connection.on('connected', () => {
  console.log('MongoDB Connection Successful');
})

connection.on('error', ()=>{
  console.log('MongoDB connection Failed');
})


module.exports = mongoose;