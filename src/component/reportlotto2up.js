import React, { useState, useEffect,use } from 'react'

const ReportLotto2Up = (item) => {
    return (
        <div>
            <h1>3ตัวบน</h1>
            {/* <p>ขนาด {window.innerHeight}*{window.innerWidth}</p> */}
            <div>เลขที่ออก {item.result.number}</div>
        </div>
    )
}
export default ReportLotto2Up