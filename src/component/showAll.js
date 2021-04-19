import React, { useEffect, useReducer, useState } from 'react'
import firebase, { db } from '../firebase'
import moment from 'moment';

const ShowAll = () => {
    const [showData, setShowData] = useState([])
    
    useEffect(() => {
        console.log(moment().format("YYYY-MM-DDTHH:mm:ss.SSS"))
        db.collection("lotto").onSnapshot((querySnapshot) => {
            let shData = []
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                shData.push(doc.data())

            });
            setShowData(shData)
        });

    }, [])
    return (
        <div>
            <h6>รายการตัวเลขทั้งหมด</h6>
            <table className="table table-sm">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">ตัวเลข</th>
                        <th scope="col">ราคา</th>
                    </tr>
                </thead>
                <tbody>
                    {showData.map((element, index) => {
                        return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{element.numLotto}</td>
                                <td>{element.priceLotto}</td>
                            </tr>
                        )
                    })}


                </tbody>
            </table>
        </div>
    )
}
export default ShowAll