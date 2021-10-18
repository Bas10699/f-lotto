import React, { useState, useEffect, use } from 'react'
import { sortData } from '../const/constance';
import { db } from '../firebase';
import DoughnutChart from './chart/price2';

const ReportLotto2Up = (item) => {
    const [lotto2, setlotto2] = useState([])
    const [reward, setreward] = useState(60)
    const [check, setcheck] = useState(true)

    useEffect(() => {
        let numlot = item.result ? item.result.number : ""
        console.log("gg", numlot);
        db.collection("lotto")
            .where("drawDate", "==", item.dateDraw)
            .where("numLotto", "==", numlot)
            .where("typeLotto", "==", 0)
            .get()
            .then((querySnapshot) => {
                let doc_id = []
                let doc_data = []
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    // console.log(doc.id, " => ", doc.data());
                    doc_data.push(doc.data())
                    doc_id.push(doc.id)

                });
                // setdocId(doc_id)
                setlotto2(doc_data)
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
    }, [item])

    return (
        <div>
            <h1>2ตัวบน {item.result ? item.result.number : ""}</h1>
            {/* <p>ขนาด {window.innerHeight}*{window.innerWidth}</p> */}

            <div className="row">
                <div className="col-sm-4">
                    {/* <DoughnutChart /> */}
                </div>
                <div className="col-sm-4">
                    {/* <DoughnutChart /> */}
                </div>
                <div className="col-sm-4">
                    <div className="row pb-1">
                        <div className="col-6">
                            <div>ข้อมูลที่ถูกรางวัล 2ตัวบน</div>
                        </div>
                        <div className="col-3">
                            <div className="float-right">บาทละ</div>
                        </div>
                        <div className="col-3">
                            <input onChange={(e) => setreward(e.target.value)} value={reward} type="number"
                                className="form-control form-control-sm" style={{ width: "75px" }} />

                        </div>
                    </div>
                    <table className="table table-sm " >
                        <thead className="thead-dark">
                            <tr>
                                <th style={{ cursor: "pointer" }}
                                    onClick={() => { sortData(lotto2, "name", check) && setcheck(!check) }}
                                >ชื่อ <i className="fas fa-sort"></i></th>
                                <th>2ตัวบน</th>
                                <th>ราคา</th>
                                <th>จ่าย</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lotto2.map((elem, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{elem.name}</td>
                                        <td>{elem.numLotto}</td>
                                        <td>{elem.priceLotto}</td>
                                        <td className="text-danger">{elem.priceLotto * reward}</td>
                                    </tr>
                                )
                            })
                            }
                        </tbody>
                        <tfoot className="bg-light">
                            <tr>
                                <td colSpan="2">รวม</td>
                                <td>{lotto2.reduce((accumulator, currentValue) => accumulator + currentValue.priceLotto, 0)}</td>
                                <td className="text-danger">{(lotto2.reduce((accumulator, currentValue) => accumulator + currentValue.priceLotto, 0)) * reward}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

        </div>
    )
}
export default ReportLotto2Up