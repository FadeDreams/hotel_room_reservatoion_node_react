import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import StripeCheckout from "react-stripe-checkout";
import Swal from "sweetalert2";

import Loader from "../components/Loader";
import Error from "../components/Error";

moment.suppressDeprecationWarnings = true;
function BookingScreen({ match }) {
  const [loading, setLoading] = useState(true); // Whenever the api request is started the loading will be true and when complete loading is false
  const [error, setError] = useState();
  const [room, setRoom] = useState();
  const [totalamount, setTotalAmount] = useState();

  //get params from app.js
  const roomid = match.params.roomId;
  const fromdate = moment(match.params.fromdate, "DD-MM-YYYY");
  const todate = moment(match.params.todate, "DD-MM-YYYY");

  const totaldays = moment.duration(todate.diff(fromdate)).asDays() + 1;

  useEffect(async () => {
    if (!localStorage.getItem("currentUser")) {
      window.location.reload = "/login";
    }
    try {
      setLoading(true);
      const data = (
        await axios.post("/api/rooms/getRoomById", {
          roomid: match.params.roomid,
        })
      ).data;
      setRoom(data);
      setTotalAmount(data.rentperday * totaldays);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(true);
      console.log(error);
    }
  }, []);

  async function bookRoom() {}

  async function onToken(token) {
    console.log(token);
    // Below are the details we will send to the backend
    const bookingDetails = {
      room,
      userid: JSON.parse(localStorage.getItem("currentUser"))._id,
      fromdate,
      todate,
      totalamount,
      totaldays,
      token,
    };

    try {
      setLoading(true);
      const result = await axios.post("/api/bookings/bookRoom", bookingDetails);
      setLoading(false);
      Swal.fire("Congratulations", "Your room booked Succesfully").then(
        (result) => {
          window.location.href = "/bookings";
        }
      );
    } catch (error) {
      setLoading(false);
      Swal.fire("Oops", "Something went Wrong", "error");
    }
  }

  return (
    <div className="m-5">
      {loading ? (
        <Loader />
      ) : room ? (
        <div className="row justify-content-center mt-5 bs">
          <div className="col-md-6">
            <h1>{room.name}</h1>
            <img src={room.imageurls[0]} className="bigImg" alt="" />
          </div>
          <div className="col-md-6">
            <div style={{ textAlign: "right", padding: "20px" }}>
              <h1>Booking Details</h1>
              <hr />

              <b>
                <p>
                  Name : {JSON.parse(localStorage.getItem("currentUser")).name}{" "}
                </p>
                <p>From Date : {match.params.fromdate} </p>
                <p>To Date : {match.params.todate} </p>
                <p>Max Count : {room.maxcount} </p>
              </b>
            </div>
            <div style={{ textAlign: "right" }}>
              <b>
                <h1>Amount</h1>
                <hr />
                <p>Total days : {totaldays} </p>
                <p>Rent per day: Ksh {room.rentperday}</p>
                <p>Total Amount : Ksh {totalamount}</p>
              </b>
            </div>
            <div style={{ float: "right" }}>
              <StripeCheckout
                amount={totalamount * 100}
                token={onToken}
                currency="KES"
                stripeKey="pk_test_1WtqC0mYAWKWuFfG9pOYA9aG00pYldgpw8"
              >
                <button className="btn btn-primary">Pay Now</button>
              </StripeCheckout>
            </div>
          </div>
        </div>
      ) : (
        <Error message="Ooops! Something went terribly wrong" />
      )}
    </div>
  );
}

export default BookingScreen;
