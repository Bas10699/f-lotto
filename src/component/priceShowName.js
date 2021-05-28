import React, { useState, useEffect } from "react";
import { db } from "../firebase";

const PriceShowName = (props) => {
    const [nameSelect, setnameSelect] = useState([])

    useEffect(() => {
        db.collection("lotto").where("drawDate", "==", props.dDate).onSnapshot((querySnapshot) => {
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
    }, [])
    return (
        <div>
            แสดงข้อมูลบุคคล <select className="custom-select" >
                {nameSelect.map((element, index) => {
                    return (
                        <option key={index}>{element}</option>
                    )
                })}


            </select>
        </div>
    )
}
export default PriceShowName