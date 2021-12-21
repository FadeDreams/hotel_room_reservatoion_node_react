import React, { useState, useEffect } from 'react'
import axios from 'axios';

import Loader from '../components/Loader';
import Error from '../components/Error';
import Success from '../components/Success';


function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);  // Whenever the api request is started the loading will be true and when complete loading is false
  const [error, setError] = useState();
  const [success, setSuccess] = useState();

  async function register() {
    if (password == confirmPassword) {
      const user = {
        name,
        email,
        password,
        confirmPassword
      }
      try {
        setLoading(true);
        const result = await axios.post('/api/users/register', user).data
        setLoading(false);
        setSuccess(true)
        setError(false);

        // Set the form fields to empty after successfull registration
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        window.location.href='/login'

      } catch (error) {
        console.log(error)
        setLoading(false);
        setError(true);
        
      }
    } else {
      alert('Passwords do not match');
    }
  }
  return (
    <div>
      {loading && (<Loader />)}
      <div className="row justify-content-center mt-5">

        <div className="col-md-5">
          
          {error && (<Error message="Registration Failed"/>)}
          {success && (<Success message='Registration Successful' />)}
          <div className="bs">
            <h1>Register</h1>
            <input type="text" className="form-control" placeholder="name" value={name} onChange={(e) => { setName(e.target.value) }} />
            <input type="text" className="form-control" placeholder="email" value={email} onChange={(e) => { setEmail(e.target.value) }} />
            <input type="text" className="form-control" placeholder="password" value={password} onChange={(e) => { setPassword(e.target.value) }} />
            <input type="text" className="form-control" placeholder="confirm password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value) }} />
            <button className="btn btn-primary mt-3" onClick={register}>Register</button>

          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterScreen;
