import React, { useState, useEffect, useRef } from 'react'
import moment from 'moment';
import firebase, { db } from './firebase'
import './App.css';
import Login from './component/login';
import Navbar from './component/navbar';
import { BrowserRouter as Router, Route } from "react-router-dom";
import CheckResults from './component/checkResults';
import Report from './component/report';
import InputLotto2 from './component/inputLotto2';


function App() {
  const [uid, setuid] = useState('')
  const [loading, setloading] = useState(false)

  useEffect(() => {
    // console.log("token", localStorage.getItem('user_token'))
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        setuid(user.uid)
        setloading(true)
      } else {
        setuid('')
        localStorage.removeItem('user_token')
      }
    });
  }, [])

  if (localStorage.getItem('user_token') !== null) {
    if (loading) {
      return (
        <Router>
          <div>
            <Navbar />
            <Route exact path="/">
              {/* {admin()} */}
              <InputLotto2 />
            </Route>
            <Route path="/check_result">
              <CheckResults />
            </Route>
            <Route path="/report">
              <Report />
            </Route>
          </div>
        </Router>
      )
    } else {
      return (
        <div className="loading">
          <h2>F Lotto Loading...</h2>
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      )
    }
  }
  else {
    return (
      <Login />
    )
  }
}

export default App;