import React, { useState } from "react"
import moment from "moment"

const Report = () => {
    const drawDate = () => {
        if ((moment().format("DD") * 1) > 16) {
            return "16/" + moment().add(543, "years").format("MM/YYYY")
        }
        else {
            return "01/" + moment().add(543, "years").format("MM/YYYY")
        }
    }
    return (
        <div className="container">
            <div className="pt-3">
                <h3>สรุปข้อมูลงวดวันที่ {drawDate()}</h3>
            </div>
        </div>
    )
}
export default Report