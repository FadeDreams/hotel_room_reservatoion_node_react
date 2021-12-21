const express = require('express');
const app = express();

const dbConfig = require('./db');  // Connect to the database
const roomRouter = require('./routes/roomRoutes');
const userRouter = require('./routes/userRoutes');
const bookingRouter = require('./routes/bookingRoutes')
const port = process.env.PORT || 5000;


app.use(express.json()); // we only get data from body 
app.use('/api/rooms', roomRouter);
app.use('/api/users', userRouter);
app.use('/api/bookings', bookingRouter)


app.listen(port, () =>{
  console.log(`Server running on port ${port} `);
});


