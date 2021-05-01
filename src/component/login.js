import React, { useState } from 'react'
import firebase, { auth, db } from '../firebase'
import '../App.css'

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    

    const userTest = () => {
        localStorage.setItem("user_token", "test");
        window.location.reload();
    }

    const handleLogin = async () => {
        console.log(username, password)
        const respone = await auth.signInWithEmailAndPassword(username, password).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorMessage)
            // ...
        })
        if (respone) {
            const { user } = respone
            console.log(respone)
            localStorage.setItem("user_token", user.uid);

            window.location.reload();

            // history.push("/user");
        }
        else {
            window.location.reload();
        }

    }
    return (

        <div className="container">
            <div className="pt-5">
                <div className="form-group">
                    <label htmlFor="usr">Username:</label>
                    <input type="text" className="form-control col-sm-6" id="usr" onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="pwd">Password:</label>
                    <input type="password" className="form-control col-sm-6" id="pwd" onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="row">
                    <div className="col-sm-6">
                        <button className="btn btn-primary" onClick={handleLogin}>เข้าสู่ระบบ</button>
                        <button className="btn btn-outline-primary float-right" onClick={userTest}>ขอเข้าไปดูเฉยๆนะ</button>
                    </div>
                </div>
            </div>

        </div>


    )
}

export default Login;