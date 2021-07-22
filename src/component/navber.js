import React, { useEffect } from "react";
import { auth, db } from "../firebase";

const Navber = () => {
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
        // <div>
        //     <nav className="navbar bg-dark navbar-dark">
        //         <a className="navbar-brand">F-Lotto</a>

        //         <div className="form-inline">
        //             <button className="form-control mr-sm-2 btn btn-outline-secondary" onClick={logout}>ออกจากระบบ</button>
        //         </div>

        //     </nav>
        // </div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <a className="navbar-brand" href="#">F-Lotto</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                    {/* <li className="nav-item active">
                        <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">Link</a>
                    </li> */}
                    <li className="nav-item">
                        <a className="nav-link disabled" href="#" tabIndex={-1} aria-disabled="true">รายงานสรุป</a>
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
export default Navber