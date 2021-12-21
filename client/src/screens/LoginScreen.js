import React, { useState, useEffect } from 'react'
import axios from 'axios';

import Loader from '../components/Loader';
import Error from '../components/Error';
import Success from '../components/Success';

function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState();  // Whenever the api request is started the loading will be true and when complete loading is false
  const [error, setError] = useState();
  

  async function Login() {
    const user = {
      email,
      password,
    }
    try {
      setLoading(true);
      const result = (await axios.post('/api/users/login', user)).data
      setLoading(false);


      localStorage.setItem('currentUser', JSON.stringify(result));  // Save the current user in localstrage in string format as localstorage doesnt accept objects and arrays
      window.location.href='/home'; // Redirect the user to the homepage.
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError(true);
    }
    
  }
  return (
    <div>
      {loading && (<Loader/>)}
      <div className="row justify-content-center mt-5">
        <div className="col-md-5">
          {error && (<Error message = 'Invalid Credentials '/>)}
          <div className="bs">
            <h1>Login</h1>
            <input type="text" className="form-control" placeholder="email" value={email} onChange={(e) => { setEmail(e.target.value) }} />
            <input type="text" className="form-control" placeholder="password" value={password} onChange={(e) => { setPassword(e.target.value) }} />
            <button className="btn btn-primary mt-3" onClick={Login}>Login</button>

          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginScreen
