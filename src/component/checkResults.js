import React, { useEffect, useState } from "react";
import { get } from "../const/servive";
import moment from "moment";
import { useHistory } from "react-router-dom";

const CheckResults = () => {
    let history = useHistory();
    const [drawdate, setDrawdate] = useState('')
    const [loading, setLoading] = useState(true)

    const checkLotto = async (date) => {
        console.log("date", date)
        await get(date).then((result) => {
            setLoading(true)
            if (result.code == 200) {
                console.log(result)
                setDrawdate(result.drawdate)
                setLoading(false)
            }
            else {
                console.error(result)
                history.push("/");
            }
        })
    }
    useEffect(async () => {
        checkLotto(moment().add(543, 'years').format("DDMMyyyy"))
    }, [])
    return (
        loading ?
            <div className="container pt-5">
                <div className="spinner-grow text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
                <div className="spinner-grow text-secondary" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
                <div className="spinner-grow text-success" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
                <div className="spinner-grow text-danger" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
                <div className="spinner-grow text-warning" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
                <div className="spinner-grow text-info" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
                <div className="spinner-grow text-light" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
                <div className="spinner-grow text-dark" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
            :
            <div className="container">
                <h3 className="pt-3">
                    ผลสลากกินแบ่งรัฐบาล</h3>
                งวดประจำวันที่ {drawdate}
            </div>

    )
}
export default CheckResults