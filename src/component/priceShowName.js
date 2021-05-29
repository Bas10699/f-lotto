import React, { useState, useEffect } from "react";
import { db } from "../firebase";

const PriceShowName = (props) => {
    const [nameSelect, setnameSelect] = useState([])

    useEffect(() => {
        console.log("name", props.show)
        db.collection("lotto")
            .where("drawDate", "==", props.dDate)
            .where("typeLotto", "==", props.show).onSnapshot((querySnapshot) => {
                let name = []
                querySnapshot.forEach((doc) => {
                    let index = name.findIndex((elem) => elem === doc.data().name)
                    if (index < 0) {
                        if (doc.data().name !== null && doc.data().name !== undefined) {
                            // console.log(ele_data.plant)
                            name.push(
                                doc.data().name
                            )
                        }
                    }
                })
                setnameSelect(name)
            })
    }, [props.show])
    const showName = (nameSel) => {
        console.log("name : ", nameSel)
        db.collection("lotto").where("name", "==", nameSel).onSnapshot((querySnapshot) => {
            let name = []
            querySnapshot.forEach((doc) => {

                console.log("data", doc.data())
                name.push(
                    doc.data().name
                )


            })
        })

    }
    return (
        <div className="row">
            <div className="col-6">


                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="inputGroup-sizing-default">แสดงข้อมูลของ</span></div>
                    <select className="custom-select" onChange={(e) => showName(e.target.value)}>
                        <option disabled selected hidden>เลีอก</option>
                        {nameSelect.map((element, index) => {
                            return (
                                <option key={index} value={element}>{element}</option>
                            )
                        })}
                    </select>
                </div>
            </div>
        </div>
    )
}
export default PriceShowName