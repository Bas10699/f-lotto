import moment from 'moment'
import React, { useState, useEffect } from 'react'
import { db } from '../firebase'
import "../App.css"
import Swal from 'sweetalert2'


const ReportLottoAll = (item) => {
    const [docId, setdocId] = useState([])
    const [docId3, setdocId3] = useState([])
    const [docData2Up, setdocData2Up] = useState([])
    const [docData2, setdocData2] = useState([])
    const [docData3, setdocData3] = useState([])
    const [loading, setloading] = useState(true)
    const [i, seti] = useState(0)


    // useEffect(() => {
    //     db.collection("lotto").where("drawDate", "==", item.dateDraw)
    //         .get()
    //         .then((querySnapshot) => {
    //             let doc_id = []
    //             let doc_dataUp = []
    //             let doc_data = []
    //             querySnapshot.forEach((doc) => {
    //                 // doc.data() is never undefined for query doc snapshots
    //                 // console.log(doc.id, " => ", doc.data());
    //                 if (doc.data().typeLotto === 0) {
    //                     doc_dataUp.push(doc.data())
    //                 }
    //                 else {
    //                     doc_data.push(doc.data())
    //                 }
    //                 doc_id.push(doc.id)

    //             });
    //             setdocId(doc_id)
    //             setdocData2Up(doc_dataUp)
    //             setdocData2(doc_data)
    //         })
    //         .catch((error) => {
    //             console.log("Error getting documents: ", error);
    //         });
    //     db.collection("lotto3").where("drawDate", "==", item.dateDraw)
    //         .get()
    //         .then((querySnapshot) => {
    //             let doc_id = []
    //             let doc_data = []
    //             querySnapshot.forEach((doc) => {
    //                 // doc.data() is never undefined for query doc snapshots
    //                 // console.log(doc.id, " => ", doc.data());
    //                 doc_id.push(doc.id)
    //                 doc_data.push(doc.data())
    //             });
    //             setdocId3(doc_id)
    //             setdocData3(doc_data)
    //         })
    //         .catch((error) => {
    //             console.log("Error getting documents: ", error);
    //         });

    // }, [i])

    const deleteAllItem = async () => {
        Swal.fire({
            title: 'แน่ใจนะ?',
            text: "คุณจะไม่สามารถย้อนกลับได้!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ใช่ ลบออก!',
            cancelButtonText: 'ยกเลิก'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'กำลังลบ',
                    text: 'รอแป๊ปนึงนะ...',
                    didOpen: () => Swal.showLoading(),

                })
                let writeBatch = db.batch();
                let item = docId
                item.map((elem) => {
                    let documentRef = db.collection('lotto').doc(elem);
                    writeBatch.delete(documentRef);
                })

                writeBatch.commit().then(() => {
                    console.log('Successfully executed batch.');
                    seti(i + 1)
                    Swal.close()
                });
            }
        })


    }
    const deleteAllItem3 = () => {
        Swal.fire({
            title: 'แน่ใจนะ?',
            text: "คุณจะไม่สามารถย้อนกลับได้!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ใช่ ลบออก!',
            cancelButtonText: 'ยกเลิก'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'กำลังลบ',
                    text: 'รอแป๊ปนึงนะ...',
                    didOpen: () => Swal.showLoading(),

                })
                let writeBatch = db.batch();
                let item = docId3
                item.map((elem) => {
                    let documentRef = db.collection('lotto3').doc(elem);
                    writeBatch.delete(documentRef);
                })

                writeBatch.commit().then(() => {
                    console.log('Successfully executed batch.');
                    seti(i + 1)
                    Swal.close()
                });
            }
        })
    }

    return (
        <div>
            <div className="float-right">
                <button onClick={() => deleteAllItem()} > ลบ 2ตัวทั้งหมด </button>
                <button onClick={() => deleteAllItem3()} > ลบ 3ตัวทั้งหมด </button>
            </div>
            <h1 > งวดวันที่ {item.dateDraw} </h1>


            {/* {docId.map((elem, index) => {
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
            } */}
            <div className="row">
                <div className="col-sm-4" style={{ overflow: "auto", maxHeight: "75vh" }}>
                    <table className="table" >
                        <thead className="thead-dark headerTable">
                            <tr>
                                <th className="headerTable">ชื่อ</th>
                                <th className="headerTable">3ตัวบน</th>
                                <th className="headerTable">ตรง</th>
                                <th className="headerTable">โต๊ด</th>
                            </tr>
                        </thead>
                        <tbody>
                            {item.docData3.map((elem, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{elem.name}</td>
                                        <td>{elem.numLotto}</td>
                                        <td>{elem.priceLotto1}</td>
                                        <td>{elem.priceLotto2}</td>
                                    </tr>
                                )
                            })
                            }
                        </tbody>
                        <tfoot className="bg-light fTable">
                            <tr>
                                <td className="fTable" colspan="2">รวม</td>
                                <td className="fTable">{item.docData3.reduce((accumulator, currentValue) => accumulator + currentValue.priceLotto1, 0)}</td>
                                <td className="fTable">{item.docData3.reduce((accumulator, currentValue) => accumulator + currentValue.priceLotto2, 0)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <div className="col-sm-4" style={{ overflow: "auto", maxHeight: "75vh" }}>
                    <table className="table">
                        <thead className="thead-dark headerTable">
                            <tr>
                                <th>ชื่อ</th>
                                <th>2ตัวบน</th>
                                <th>ราคา</th>
                            </tr>
                        </thead>
                        <tbody>
                            {item.docData2Up.map((elem, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{elem.name}</td>
                                        <td>{elem.numLotto}</td>
                                        <td>{elem.priceLotto}</td>
                                    </tr>
                                )
                            })
                            }
                        </tbody>
                        <tfoot className="bg-light fTable">
                            <tr>
                                <td className="fTable" colspan="2">รวม</td>
                                <td className="fTable">{item.docData2Up.reduce((accumulator, currentValue) => accumulator + currentValue.priceLotto, 0)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <div className="col-sm-4" style={{ overflow: "auto", maxHeight: "75vh" }}>
                    <table className="table">
                        <thead className="thead-dark headerTable">
                            <tr>
                                <th>ชื่อ</th>
                                <th>2ตัวล่าง</th>
                                <th>ราคา</th>
                            </tr>
                        </thead>
                        <tbody>
                            {item.docData2.map((elem, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{elem.name}</td>
                                        <td>{elem.numLotto}</td>
                                        <td>{elem.priceLotto}</td>
                                    </tr>
                                )
                            })
                            }
                        </tbody>
                        <tfoot className="bg-light fTable">
                            <tr>
                                <td className="fTable" colSpan="2">รวม</td>
                                <td className="fTable">{item.docData2.reduce((accumulator, currentValue) => accumulator + currentValue.priceLotto, 0)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    )
}
export default ReportLottoAll