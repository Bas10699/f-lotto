import React, { useState, useEffect, use } from 'react'
import { db } from '../firebase'
import DoughnutChart from './chart/price2'

const ReportLotto2down = (item) => {

    const [docData, setdocData] = useState([])
    const [reward, setreward] = useState(60)



    useEffect(() => {
        db.collection("lotto")
            .where("drawDate", "==", item.dateDraw)
            .where("numLotto", "==", item.result.number)
            .where("typeLotto", "==", 1)
            .get()
            .then((querySnapshot) => {
                let doc_id = []
                let doc_data = []
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    console.log(doc.id, " => ", doc.data());
                    doc_data.push(doc.data())
                    doc_id.push(doc.id)

                });
                // setdocId(doc_id)
                setdocData(doc_data)
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
    }, [])
    return (
        <div>
            <h1>2ตัวล่าง </h1>
            {/* <p>ขนาด {window.innerHeight}*{window.innerWidth}</p> */}
            <form className="form-inline">
                <div className="form-group mb-2">
                    <div>เลขที่ออก {item.result.number}</div>
                </div>
                <div className="form-group mx-sm-3 mb-2">
                    <div>ราคาจ่ายบาทละ</div>
                </div>
                <input onChange={(e) => setreward(e.target.value)} value={reward} type="number"
                    className="form-control" />
            </form>



            <div className="row">
                <div className="col-sm-4">
                    <DoughnutChart />
                </div>
                <div className="col-sm-4">
                    <DoughnutChart />
                </div>
                <div className="col-sm-4">
                    <h5>ข้อมูลที่ถูกรางวัล 2ตัวล่าง</h5>
                    <table className="table table-sm " >
                        <thead className="thead-dark">
                            <tr>
                                <th>ชื่อ</th>
                                <th>2ตัวล่าง</th>
                                <th>ราคา</th>
                                <th>จ่าย</th>
                            </tr>
                        </thead>
                        <tbody>
                            {docData.map((elem, index) => {
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
                                <td colspan="2">รวม</td>
                                <td>{docData.reduce((accumulator, currentValue) => accumulator + currentValue.priceLotto, 0)}</td>
                                <td className="text-danger">{(docData.reduce((accumulator, currentValue) => accumulator + currentValue.priceLotto, 0)) * reward}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

        </div>
    )
}
export default ReportLotto2down