import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import {BrowserRouter, Route, Link} from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import BookingScreen from './screens/BookingScreen';
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import ProfileScreen from './screens/ProfileScreen';
import AdminScreen from './screens/AdminScreen';

function App() {
  return (
    <div className="App">
      <Navbar/>
      <BrowserRouter>
        <Route path="/home" exact component={HomeScreen}/>
        <Route path="/book/:roomid/:fromdate/:todate" exact component={BookingScreen}/>
        <Route path="/register" exact component={RegisterScreen}/>
        <Route path="/login" exact component={LoginScreen}/>
        <Route path="/profile" exact component={ProfileScreen}/>
        <Route path="/admin" component={AdminScreen}/>
      </BrowserRouter>
    </div>
  );
}

export default App;
