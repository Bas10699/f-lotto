import React, { useState, useEffect, } from 'react'
import { sortData, swapLotto3 } from '../const/constance'
import { db } from '../firebase'

const ReportLotto3 = (item) => {
    const [lotto3, setlotto3] = useState([])
    const [lotto3todd, setlotto3todd] = useState([])
    const [reward, setreward] = useState(500)
    const [rewardtodd, setrewardtodd] = useState(100)
    const [check, setcheck] = useState(true)

    useEffect(() => {
        let swap3 = swapLotto3(item.result? item.result.number:"000")
        console.log(swap3);
        db.collection("lotto3")
            .where("drawDate", "==", item.dateDraw)
            .where("numLotto", "in", swap3)
            .get()
            .then((querySnapshot) => {
                let doc_todd = []
                let doc_data = []
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    console.log(doc.id, " => ", doc.data());
                    if (doc.data().numLotto == item.result.number) doc_data.push(doc.data())

                    doc_todd.push(doc.data())

                });
                // setdocId(doc_id)
                setlotto3(doc_data)
                setlotto3todd(doc_todd)
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
    }, [item])

    return (
        <div>
            <h1>3ตัวบน {item.result? item.result.number:""}</h1>
            {/* <p>ขนาด {window.innerHeight}*{window.innerWidth}</p> */}

            <div className="row">
                <div className="col-sm-4">
                    {/* <DoughnutChart /> */}
                </div>
                <div className="col-sm-4">
                    <div className="row pb-1">
                        <div className="col-4">
                            <h5>3ตัวตรง</h5>
                        </div>
                        <div className="col-8">
                            <div className="float-right">บาทละ &nbsp; 
                             <input onChange={(e) => setreward(e.target.value)} value={reward} type="number"
                                className="form-control form-control-sm" style={{ width: "75px", display: "inline" }} />
                            </div>
                        </div>
                    </div>
                    <table className="table table-sm " >
                        <thead className="thead-dark">
                            <tr>
                                <th style={{ cursor: "pointer" }}
                                    onClick={() => { sortData(lotto3, "name", check) && setcheck(!check) }}
                                >ชื่อ <i className="fas fa-sort"></i></th>
                                <th>2ตัวบน</th>
                                <th>ราคา</th>
                                <th>จ่าย</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lotto3.map((elem, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{elem.name}</td>
                                        <td>{elem.numLotto}</td>
                                        <td>{elem.priceLotto1}</td>
                                        <td className="text-danger">{elem.priceLotto * reward}</td>
                                    </tr>
                                )
                            })
                            }
                        </tbody>
                        <tfoot className="bg-light">
                            <tr>
                                <td colSpan="2">รวม</td>
                                <td>{lotto3.reduce((accumulator, currentValue) => accumulator + currentValue.priceLotto1, 0)}</td>
                                <td className="text-danger">{(lotto3.reduce((accumulator, currentValue) => accumulator + currentValue.priceLotto1, 0)) * reward}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <div className="col-sm-4">
                <div className="row pb-1">
                        <div className="col-4">
                            <h5>3ตัวโต๊ด</h5>
                        </div>
                        <div className="col-8">
                            <div className="float-right">บาทละ&nbsp;
                             <input onChange={(e) => setrewardtodd(e.target.value)} value={rewardtodd} type="number"
                                className="form-control form-control-sm" style={{ width: "75px", display: "inline" }} />
                            </div>
                        </div>
                    </div>
                    <table className="table table-sm " >
                        <thead className="thead-dark">
                            <tr>
                                <th style={{ cursor: "pointer" }}
                                    onClick={() => { sortData(lotto3todd, "name", check) && setcheck(!check) }}
                                >ชื่อ <i className="fas fa-sort"></i></th>
                                <th>3ตัวโต๊ด</th>
                                <th>ราคา</th>
                                <th>จ่าย</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lotto3todd.map((elem, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{elem.name}</td>
                                        <td>{elem.numLotto}</td>
                                        <td>{elem.priceLotto2}</td>
                                        <td className="text-danger">{elem.priceLotto2 * 100}</td>
                                    </tr>
                                )
                            })
                            }
                        </tbody>
                        <tfoot className="bg-light">
                            <tr>
                                <td colSpan="2">รวม</td>
                                <td>{lotto3todd.reduce((accumulator, currentValue) => accumulator + currentValue.priceLotto2, 0)}</td>
                                <td className="text-danger">{(lotto3todd.reduce((accumulator, currentValue) => accumulator + currentValue.priceLotto2, 0)) * reward}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

        </div>
    )
}
export default ReportLotto3