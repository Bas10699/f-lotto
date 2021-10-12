import React, { useState, useEffect } from 'react'
import { drawDate } from '../const/constance';
import { db } from '../firebase';

const ReportHome = (prop) => {
    // useEffect(() => {
    //     db.collection("sumresults")
    //         .doc(drawDate())
    //         .get().then((doc) => {
    //             console.log(doc.exists)
    //             if (doc.exists) {
    //                 console.log("Document data:", doc.data());
    //                 // setresultLotto(doc.data())
    //             } else {
    //                 // doc.data() will be undefined in this case
    //                 console.log("No such document!");
    //             }
    //         }).catch((error) => {
    //             console.log("Error getting document:", error);
    //         });
    // }, [])

    return <div>
        หน้าแรก
        {prop.sumprice.result2up.name}
        รวม
        {prop.sumprice.result2up.sumprice}
        
    </div>
}
export default ReportHome