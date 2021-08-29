import moment from 'moment'
import React, { useState, useEffect } from 'react'
import { db } from '../firebase'
import "../App.css"


const ReportLottoAll = () => {
    const [docId, setdocId] = useState([])
    const [docId3, setdocId3] = useState([])
    const [loading, setloading] = useState(true)
    const [i, seti] = useState(0)

    const drawDate = () => {
        // if ((moment().format("DD") * 1) > 16) {
        //     return "16/" + moment().add(543, "years").format("MM/YYYY")
        // }
        // else {
        //     return "01/" + moment().add(543, "years").format("MM/YYYY")
        // }
        return "01/09/2021"
    }


    useEffect(() => {
        db.collection("lotto").where("drawDate", "==", drawDate())
            .get()
            .then((querySnapshot) => {
                let doc_id = []
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    console.log(doc.id, " => ", doc.data());
                    doc_id.push(doc.id)
                });
                setdocId(doc_id)
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
        db.collection("lotto3").where("drawDate", "==", drawDate())
            .get()
            .then((querySnapshot) => {
                let doc_id = []
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    console.log(doc.id, " => ", doc.data());
                    doc_id.push(doc.id)
                });
                setdocId3(doc_id)
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });

    }, [i])

    const deleteAllItem = () => {
        let item = docId
        item.map((elem) => {
            db.collection("lotto").doc(elem).delete().then(() => {
                console.log("Document successfully deleted!");
            }).catch((error) => {
                console.error("Error removing document: ", error);
            });
        })
        seti(i + 1)
    }
    const deleteAllItem3 = () => {
        let item = docId3
        item.map((elem) => {
            db.collection("lotto3").doc(elem).delete().then(() => {
                console.log("Document successfully deleted!");
            }).catch((error) => {
                console.error("Error removing document: ", error);
            });
        })
        seti(i + 1)
    }

    return (
        <div>
            <h1 > งวดวันที่ {drawDate()} </h1>
            <button onClick={() => deleteAllItem()} > ลบ 2ตัวทั้งหมด </button>
            <button onClick={() => deleteAllItem3()} > ลบ 3ตัวทั้งหมด </button>
            {docId.map((elem, index) => {
                return (
                    <div key={index} > {elem} </div>
                )
            })
            }
            {docId3.map((elem, index) => {
                return (
                    <div key={index} > {elem} </div>
                )
            })
            }
        </div>
    )
}
export default ReportLottoAll