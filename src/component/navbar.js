import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { auth, db } from "../firebase";

const Navbar = () => {
    const logout = () => {

        auth.signOut().then(() => {
            // Sign-out successful.
            localStorage.removeItem('user_token')
            // window.location.reload()
            console.log('Sign-out successful.')
        }).catch((error) => {
            // An error happened.
            console.error(error)
        });
    }
    return (
        <nav className="navbar navbar-expand-md navbar-dark bg-dark sticky-top">
            <NavLink to="/" className="navbar-brand" >F-Lotto</NavLink>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                    {/* <li className="nav-item active">
                        <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
                    </li> */}

                    <li className="nav-item">
                        <NavLink to="/report" className="nav-link disabled">รายงานสรุป</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/check_result" className="nav-link disabled" >ผลสลากกินแบ่งรัฐบาล</NavLink>
                    </li>
                </ul>
                <form className="form-inline my-2 my-lg-0">
                    {/* <input className="form-control mr-sm-2" type="search" placeholder="Search" /> */}
                    <button className="btn btn-outline-light my-2 my-sm-0" onClick={logout}>ออกจากระบบ</button>
                </form>
            </div>
        </nav>


    )
}
export default Navbar