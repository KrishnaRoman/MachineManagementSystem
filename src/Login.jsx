import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useToken from '../components/CustomHooks/useToken';
import './styles.css';

import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

async function loginUser(credentials) {
    try {
      return axios({
          url: 'http://localhost:3000/auth/login', 
          method: 'POST',
          headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Headers': 'POST, GET, PUT, DELETE, OPTIONS, HEAD, Authorization, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Access-Control-Allow-Origin',
              'Content-Type': 'application/json',
          },
          data: JSON.stringify(credentials)
      }).then(response => {
          return response.data;
      })
    } catch (error) {
      return {}
    }
}

export const Login = () => {

    const { token, setToken } = useToken();
    let navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async e => {
        e.preventDefault();
        try {
          if(email.replace(/\s/g,'') === ''){
              setEmail('');
              throw Error("Email field is empty")
          }
          const token = await loginUser({
            email: email.replace(/\s/g,''),
            password
          });
          setToken(token);
        } catch (error) {
          Swal.fire('Login error', 'The users is not registered or it might have been deleted', 'error');
        }
    }

    useEffect(() => {
        if(token){
            return navigate("/machine-management")
        }
    }, [token])
    

    return (
    <>
        <div className="login-wrapper">
            <h1>Machine Management System</h1>
            <form onSubmit={handleSubmit}>
              <label>
                <p>Email</p>
                <input required type="text" value={email} onChange={e => setEmail(e.target.value)}/>
              </label>
              <label>
                <p>Password</p>
                <input required type="password" value={password} onChange={e => setPassword(e.target.value)}/>
              </label>
              <div>
                <button type="submit">Login</button>
              </div>
            </form>
        </div>
    </>
    )
}