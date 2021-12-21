import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DatePicker, Space } from 'antd';
import 'antd/dist/antd.css';
import moment from 'moment';
import Room from '../components/Room';
import Loader from '../components/Loader';
import Error from '../components/Error';
moment.suppressDeprecationWarnings = true;

const { RangePicker } = DatePicker;

function HomeScreen() {

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState();  // Whenever the api request is started the loading will be true and when complete loading is false
  const [error, setError] = useState();

  const [fromdate, setFromDate] = useState();
  const [todate, setToDate] = useState();
  const [duplicaterooms, setDuplicateRooms] = useState([]);

  const [searchkey, setSearchKey] = useState('');
  const [type, setType] = useState('all');


  useEffect(async () => {
    try {
      setLoading(true);
      const data = (await axios.get('/api/rooms/getAllRooms')).data;
      setRooms(data);
      setDuplicateRooms(data);
      setLoading(false);
    } catch (error) {
      setError(true);
      setLoading(false);
      console.log(error);
    }
  }, []);

  // Filter rooms by search and also select date we want to book rooms
  function filterByDate(dates) {
    //dates[0] from_date, dates[1] to_date
    if((dates[0] && dates[1]) != null){
      setFromDate(moment(dates[0]).format('DD-MM-YYYY'));
      setToDate(moment(dates[1]).format('DD-MM-YYYY'));
    }
    

    // If a user selects a date that is between booked dates that room wont be show.
    var tempRooms = [];
    var availability = false;
    for (const room of duplicaterooms) {
      if (room.currentbookings.length > 0) {
        for (const booking of room.currentbookings) {
          if (
            // First we check if the dates selected by the user are not between dates already being booked.
            !moment(moment(moment(dates[0]).format('DD-MM-YYYY')).isBetween(booking.fromdate, booking.todate))
            &&
            !moment(moment(moment(dates[1]).format('DD-MM-YYYY')).isBetween(booking.fromdate, booking.todate))
          ) {
            if (
              moment(dates[0]).format('DD-MM-YYYY') !== booking.fromdate &&
              moment(dates[0]).format('DD-MM-YYYY') !== booking.todate &&
              moment(dates[1]).format('DD-MM-YYYY') !== booking.fromdate &&
              moment(dates[1]).format('DD-MM-YYYY') !== booking.todate
            ) {
              availability = true
            }
          }

        }
      }
      if (availability == true || room.currentbookings.length == 0) {
        tempRooms.push(room)
      }
      setRooms(tempRooms)
    }

  }

  // We filter the rooms by search.
  function filterBySearch (){
    const tempRooms = duplicaterooms.filter(
       room => room.name.toLowerCase().includes(searchkey.toLowerCase()));
    setRooms(tempRooms);
  }

  // We filter the rooms by their type.
  function filterByType(e) {
    setType(e)
    if(e !== 'all'){
      const tempRooms = duplicaterooms.filter( 
        room => room.type.toLowerCase() == e.toLowerCase());
      setRooms(tempRooms);
    }else{
      setRooms(duplicaterooms); 
    }
  }


  return (
    <div className="container">

      <div className="row mt-5  bs">
        {/* This is the date picker we get from ant design */}
        <div className="col-md-3">
          <RangePicker format='DD-MM-YYYY' onChange={filterByDate} />
        </div>

        {/* This is the search bar */}
        <div className="col-md-4 ">
          <input type="text" className='form-control' placeholder='Search Rooms' value={searchkey} onChange={(e) => {setSearchKey(e.target.value)}} onKeyUp={filterBySearch}/>
        </div>

        {/* This is the selection of the type of room the user wants */}
        <div className="col-md-3">
        {/* e.target.value means the selected option */}
          <select className="form-control" value={type} 
           onChange={(e)=>{filterByType(e.target.value)}}>  
            <option value="all">All</option>
            <option value="delux">Deluxe</option>
            <option value="non-delux">Non-Deluxe</option>

          </select>
        </div>

      </div>

      <div className="row justify-content-center mt-5 ">
        {loading ? (<Loader />) : (
          rooms.map((room, i) => {
            return <div className="col-md-9 mt-2">
              <Room room={room} fromdate={fromdate} todate={todate} />
            </div>
          })
        )}
      </div>
    </div>

  )
}

export default HomeScreen;
