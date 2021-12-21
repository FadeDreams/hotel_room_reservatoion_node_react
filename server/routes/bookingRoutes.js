const express = require('express');
const router = express.Router();
const moment = require('moment');

const { v4: uuidv4 } = require('uuid');
const stripe = require('stripe')('sk_test_aX6nKA7MLr5YtxaeymwmnoLP000Kp1NpAW');

const Booking = require("../models/booking");
const Room = require("../models/room");


router.post('/bookRoom', async (req, res,) => {
  const { room, userid, fromdate, todate, totalamount, totaldays, token } = req.body

  // We handle the stripe payments
  // First we create the customer  making the payment
  try {
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id
    });

    // Create a charge the the user making the payment
    const payment = await stripe.charges.create(
      {
        amount: totalamount * 100,
        customer: customer.id,
        currency: 'kes',
        receipt_email: token.email
      }, {
      idempotencyKey: uuidv4(),  // We create a unique id for this so the customer isnt charged twice.
      }
    );

    if (payment) {
      const newBooking = new Booking({
        room: room.name,
        roomid: room._id,
        userid,
        fromdate: moment(fromdate).format('DD-MM-YYYY'),
        todate: moment(todate).format('DD-MM-YYYY'),
        totalamount,
        totaldays,
        transactionId: '1234'
      });
      const booking = await newBooking.save();

      const roomtemp = await Room.findOne({ _id: room._id });
      roomtemp.currentbookings.push({
        bookingid: booking._id,
        fromdate: moment(fromdate).format('DD-MM-YYYY'),
        todate: moment(todate).format('DD-MM-YYYY'),
        userid: userid,
        status: booking.status
      });
      await roomtemp.save()
      res.send('Room Booked Successfully');
    }
    res.send('Payment Successfull, Your Room is Booked')
  } catch (error) {
    res.status(400).json({ error });
  }

});

router.post("/cancelbooking", async (req, res) => {
  const {bookingid,roomid } = req.body;
  try {
    //find respective booking
    const bookingitem = await Booking.findOne({_id: bookingid}) 
    //change status
    bookingitem.status='cancelled'
    await bookingitem.save();
    //clear currentbookings from room model
    const room = await Room.findOne({_id:roomid})
    const bookings = room.currentbookings
    const temp=bookings.filter(booking=>booking.bookingid.toString()!==bookingid)
    console.log(temp);
    room.currentbookings=temp;
    await room.save()
    res.send('Booking deleted successfully')
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "something went wrong" });
  }
});

router.post("/getuserbookings", async (req, res) => {
  const { userid } = req.body;
  try {
    const bookings = await Booking.find({ userid: userid }).sort({ _id: -1 });
    res.send(bookings);
  } catch (error) {
    return res.status(400).json({ message: "Something went wrong" });
  }
});

router.get("/getallbookings", async (req, res) => {
  try {
    const bookings = await Booking.find({});
    res.send(bookings);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

module.exports = router