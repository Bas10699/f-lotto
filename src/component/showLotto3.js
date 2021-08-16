import React, { useState, useEffect } from "react";
import { sortData, swapLotto3 } from '../const/constance'
import firebase, { db } from '../firebase'
import Swal from 'sweetalert2'
import ExportExcel from './exportExcel'
import '../App.css'
import printJS from "print-js";
import ExportExcel3 from "./exportExcel3";

const ShowLotto3 = (props) => {
    const [showData, setShowData] = useState([])
    const [showT3, setShowT3] = useState([])
    const [showT3S100, setShowT3S100] = useState([])
    const [limitPrice, setLimitPrice] = useState(100)
    const [dataNumber, setdataNumber] = useState([])

    // const reversedNum = num => num.toString().split('').reverse().join('')

    const LottoPintter = (item, limit) => {
        let dataPinter = []

        item.map((element, index) => {

            if (element.sumTrong - limit > 0 || element.sumTodd - limit > 0) {
                dataPinter.push({
                    numLotto: element.numLotto,
                    sumTrong: (element.sumTrong - limit) > 0 ? element.sumTrong - limit : 0,
                    sumTodd: (element.sumTodd - limit) > 0 ? element.sumTodd - limit : 0
                })

            }

        })
        return dataPinter
    }

    const deletePriceLotto = (id, lotto, price1, price2, index) => {
        let dataNum = dataNumber
        console.log("0", dataNum)

        Swal.fire({
            title: "แน่ใจนะ!",
            text: 'เลข ' + lotto + " ราคา " + price1 + "*" + price2 + ".-",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'ยกเลิก',
            confirmButtonText: 'ลบเลย'
        }).then((result) => {
            if (result.isConfirmed) {
                db.collection("lotto3").doc(id).delete().then(() => {
                    console.log("Document successfully deleted!");

                }).catch((error) => {
                    console.error("Error removing document: ", error);
                    if (error.code == "permission-denied") {
                        Swal.fire(
                            'แหนะ!',
                            'บอกแล้วใช่ไหม ดูได้อย่างเดียว',
                            'error'
                        )
                    }
                });

            }
        })


    }

    const numberLottoTop = (number) => {
        db.collection("lotto3")
            .where("numLotto", "==", number)
            .where("drawDate", "==", props.dDate).onSnapshot((querySnapshot) => {
                let shData = []
                let lotto = []
                querySnapshot.forEach((doc) => {

                    if ((doc.data().numLotto === number)) {

                        shData.unshift({ id: doc.id, ...doc.data() })
                    } else {
                        console.log("update: ", doc)
                    }




                });

                setdataNumber(shData)

            })
        // .catch((error) => {
        //     console.log("Error getting documents: ", error);
        // });
    }


    const count = (storage, typeLot) => { return storage.filter(item => item.typeLotto === typeLot).length }

    const LottosumTodd = (item) => {
        let lotto = []
        item.map((element) => {
            let sumToddAll = swapLotto3(element.numLotto).sort()[0]
            let index = lotto.findIndex((elem) => (elem.numLotto === sumToddAll))
            if (index < 0) {
                lotto.push({
                    numLotto: element.numLotto,
                    sumTrong: element.sumTrong,
                    sumTodd: 0
                })
                lotto.push({
                    numLotto: sumToddAll,
                    sumTrong: 0,
                    sumTodd: element.sumTodd
                })
            }
            else {
                lotto[index].sumTodd += element.sumTodd
                lotto.push({
                    numLotto: element.numLotto,
                    sumTrong: element.sumTrong,
                    sumTodd: 0
                })
            }
            // console.log("index", swapLotto3(element.numLotto).sort())
        })
        // console.log("lotto", lotto)
        return lotto
    }

    useEffect(() => {

        db.collection("lotto3").where("drawDate", "==", props.dDate).onSnapshot((querySnapshot) => {
            let shData = []
            let lotto = []
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                // console.log(doc.id, " => ", doc.data());

                shData.unshift(doc.data())


                let index = lotto.findIndex((elem) => elem === doc.data().numLotto)
                if (index < 0) {
                    if (doc.data().numLotto !== null && doc.data().numLotto !== undefined) {
                        // console.log(ele_data.plant)
                        lotto.push(
                            doc.data().numLotto
                        )
                    }
                }

            });
            let lottoT3 = []

            lotto.map((eleLotto) => {
                let sumTrong = 0
                let sumTodd = 0
                shData.map((eleData) => {
                    if (eleLotto === eleData.numLotto) {
                        sumTrong += eleData.priceLotto1 * 1
                        sumTodd += eleData.priceLotto2 * 1
                    }

                })



                lottoT3.push({
                    numLotto: eleLotto,
                    sumTrong: sumTrong,
                    sumTodd: sumTodd,
                })




            })

            setShowData(shData)

            sortData(lottoT3, "numLotto", false)
            setShowT3(lottoT3)
            setShowT3S100(LottosumTodd(lottoT3))

        });


    }, [])

    return (
        <div className="row">
            <div className="col-sm-6">
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="inputGroup-sizing-default">ราคารวมเกิน</span></div>
                    <select className="custom-select" onChange={(e) => setLimitPrice(e.target.value)}>
                        <option value={100}>100</option>
                        <option value={200}>200</option>
                        <option value={300}>300</option>
                        <option value={400}>400</option>
                        <option value={500}>500</option>
                    </select>
                    <div className="input-group-append">
                        <button className="btn btn-outline-info" onClick={() => printJS({
                            printable: LottoPintter(showT3S100, limitPrice),
                            type: 'json',
                            properties: [
                                { field: 'numLotto', displayName: '3ตัวบน' },
                                { field: 'sumTrong', displayName: 'ตรง' },
                                { field: 'sumTodd', displayName: 'โต๊ด' }
                            ],
                            header: '<h3 class="custom-h3">ระบบการจัดการตัวเลขของเอฟโอเวอร์</h3>',
                            style: '.custom-h3 { color: red; }',
                            font_size: '18pt',
                            documentTitle: `ราคาเกิน ${limitPrice}บาท`
                        })}>print</button>
                    </div>
                </div>

                <div style={{ overflow: "auto", maxHeight: "480px" }}>
                    <table className="table table-sm table-striped ">
                        <thead className="thead-dark headerTable">
                            <tr>
                                <th className="headerTable" scope="col">3ตัวบน</th>
                                <th className="headerTable" scope="col">ตรง</th>
                                <th className="headerTable" scope="col">โต๊ด</th>
                            </tr>
                        </thead>
                        <tbody className="bg-body-table">
                            {showT3S100.map((element, index) => {

                                if (element.sumTrong - limitPrice > 0 || element.sumTodd - limitPrice > 0) {
                                    return (
                                        <tr key={index} className="">
                                            <td>{element.numLotto}</td>
                                            <td>{(element.sumTrong - limitPrice) > 0 ? element.sumTrong - limitPrice : 0}</td>
                                            <td>{(element.sumTodd - limitPrice) > 0 ? element.sumTodd - limitPrice : 0} </td>
                                        </tr>
                                    )
                                }

                            })}


                        </tbody>
                    </table>
                </div>
            </div>

            <div className="col-sm-6">
                <ExportExcel3 data={sortData(showData, "name", false)} typeLotto={props.show} />

                <button className="btn btn-outline-info btn-sm " onClick={() => printJS({
                    printable: LottoPintter(showT3, 0),
                    type: 'json',
                    properties: [
                        { field: 'numLotto', displayName: '3ตัวบน' },
                        { field: 'sumTrong', displayName: 'ตรง' },
                        { field: 'sumTodd', displayName: 'โต๊ด' }
                    ],
                    header: '<h3 class="custom-h3">ระบบการจัดการตัวเลขของเอฟโอเวอร์</h3>',
                    style: '.custom-h3 { color: red; column-count: 2; column-gap: 40px;}',
                    font_size: '18pt',
                    // style:'column-count: 2; column-gap: 40px;',
                    documentTitle: `ราคาเกิน ${limitPrice}บาท`
                })}>print</button>

                <h6>ตัวเลขทั้งหมด {count(showData, props.show)} รายการ</h6>
                <div style={{ overflow: "auto", height: "480px" }}>
                    <table className="table table-sm table-striped">
                        <thead className="thead-dark headerTable">
                            <tr>
                                <th className="headerTable" scope="col">3ตัวบน</th>
                                <th className="headerTable" scope="col">ตรง</th>
                                <th className="headerTable" scope="col">โต๊ด</th>
                                <th className="headerTable" scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {showT3.map((element, index) => {
                                if (element.numLotto != "") {
                                    return (
                                        <tr key={index}>
                                            {/* <td>{index + 1}</td> */}
                                            <td>{element.numLotto}</td>
                                            <td>{element.sumTrong}</td>
                                            <td>{element.sumTodd}</td>
                                            <td><button className="btn btn-warning btn-sm"
                                                data-toggle="modal"
                                                data-target="#exampleModal"
                                                onClick={() => numberLottoTop(element.numLotto)}>แก้ไข</button></td>
                                            {/* <td>{element.name}</td> */}
                                        </tr>
                                    )
                                }
                                else {
                                    console.log("err lotto3",index)
                                }
                            })}


                        </tbody>
                    </table>
                </div>
            </div>

            {/* <!-- Modal --> */}
            <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">รายละเอียด 2ตัวบน </h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">ชื่อ</th>
                                        <th scope="col">2ตัวบน</th>
                                        <th scope="col">ราคา</th>
                                        <th scope="col">วันที่</th>
                                        <th scope="col">เวลา</th>
                                        <th scope="col"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataNumber.map((ele_num, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{ele_num.name}</td>
                                                <td>{ele_num.numLotto}</td>
                                                <td>{ele_num.priceLotto1} * {ele_num.priceLotto2}</td>
                                                <td>{ele_num.date}</td>
                                                <td>{ele_num.time}</td>
                                                <td><button className="btn btn-danger btn-sm"
                                                    onClick={() => deletePriceLotto(ele_num.id, ele_num.numLotto, ele_num.priceLotto1, ele_num.priceLotto2, index)}>
                                                    ลบ
                                                </button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>

        </div>

    )
}
export default ShowLotto3