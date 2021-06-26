import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { sortData } from '../const/constance'
import ExportExcel from './exportExcel'
import '../App.css'

const PriceShowName = (props) => {
    const [nameSelect, setnameSelect] = useState([])
    const [dataShowAll, setdataShowAll] = useState([])
    const [showTop, setShowTop] = useState([])
    const [showDown, setShowDown] = useState([])
    const [limitPrice, setLimitPrice] = useState(200)
    const [namename, setnamename] = useState("")

    const count = (storage, typeLot) => { return storage.filter(item => item.typeLotto === typeLot).length }

    useEffect(() => {
        console.log("name", props.show)
        db.collection("lotto")
            .where("drawDate", "==", props.dDate)
            .where("typeLotto", "==", props.show).onSnapshot((querySnapshot) => {
                let name = []
                querySnapshot.forEach((doc) => {
                    let index = name.findIndex((elem) => elem === doc.data().name)
                    if (index < 0) {
                        if (doc.data().name !== null && doc.data().name !== undefined) {
                            // console.log(ele_data.plant)
                            name.push(doc.data().name)
                        }
                    }
                })
                setnameSelect(name)
            })
    }, [props.show])
    const showName = (nameSel) => {
        setnamename(nameSel)
        console.log("name : ", nameSel)
        db.collection("lotto")
            .where("name", "==", nameSel)
            // .where("typeLotto", "==", props.show)
            .where("drawDate", "==", props.dDate)
            .onSnapshot((querySnapshot) => {
                let dataAll = []
                let lotto = []
                querySnapshot.forEach((doc) => {

                    if ((doc.data().name === nameSel)) {
                        // console.log("num1: ", doc.data().numLotto)
                        // console.log("New city: ", doc.data());
                        // shData.unshift({ id: doc.id, ...doc.data() })
                        dataAll.push(doc.data())

                        let index = lotto.findIndex((elem) => elem === doc.data().numLotto)
                        if (index < 0) {
                            if (doc.data().numLotto !== null && doc.data().numLotto !== undefined) {
                                // console.log(ele_data.plant)
                                lotto.push(
                                    doc.data().numLotto
                                )
                            }
                        }
                    } else {
                        console.log("update: ", doc)
                    }

                    // console.log("data", doc.data())

                })
                let lottoTop = []
                let lottoDown = []
                lotto.map((eleLotto) => {
                    let sumTop = 0
                    let sumDown = 0
                    dataAll.map((eleData) => {
                        if ((eleLotto === eleData.numLotto) && (eleData.typeLotto === 0)) {
                            sumTop += eleData.priceLotto
                        }
                        else if ((eleLotto === eleData.numLotto) && (eleData.typeLotto === 1)) {
                            sumDown += eleData.priceLotto
                        }
                    })
                    if (sumTop > 0) {
                        lottoTop.push({
                            numLotto: eleLotto,
                            sumPrice: sumTop
                        })
                    }
                    if (sumDown > 0) {
                        lottoDown.push({
                            numLotto: eleLotto,
                            sumPrice: sumDown
                        })
                    }

                })

                sortData(lottoTop, "numLotto", false)
                sortData(lottoDown, "numLotto", false)
                setShowTop(lottoTop)
                setShowDown(lottoDown)
                setdataShowAll(dataAll)
            })

    }

    if (props.show === 1) {
        return (
            <div>
                <div className="row">
                    <div className="col-6">

                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="inputGroup-sizing-default">แสดงข้อมูลของ</span></div>
                            <select className="custom-select" value={namename} onChange={(e) => showName(e.target.value)}>
                                <option selected hidden>เลีอก</option>
                                {nameSelect.map((element, index) => {
                                    return (
                                        <option key={index} value={element}>{element}</option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="col-6">

                    </div>




                </div>
                <div className="row">
                    <div className="col-sm-6">
                        <h6>ชื่อ: {namename} </h6>
                        {/* <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroup-sizing-default">รายการราคารวมเกิน</span></div>
                        <select className="custom-select" onChange={(e) => setLimitPrice(e.target.value)}>
                            <option value={200}>200</option>
                            <option value={300}>300</option>
                            <option value={400}>400</option>
                            <option value={500}>500</option>
                        </select>
                    </div> */}
                        <div style={{ overflow: "auto", maxHeight: "480px" }}>
                            <table className="table table-sm table-striped">
                                <thead className="thead-dark headerTable">
                                    <tr>
                                        {/* <th scope="col">#</th> */}
                                        <th className="headerTable" scope="col">2ตัวล่าง</th>
                                        <th className="headerTable" scope="col">ราคา &gt;{limitPrice}</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-body-table">
                                    {showDown.map((element, index) => {

                                        if (element.sumPrice - limitPrice > 0) {
                                            return (
                                                <tr key={index} >
                                                    {/* <td>{index + 1}</td> */}
                                                    <td>{element.numLotto}</td>
                                                    <td>{element.sumPrice - limitPrice}</td>
                                                </tr>
                                            )
                                        }
                                    })}


                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="col-sm-6">
                        {/* <ExportExcel data={dataShowAll} typeLotto={props.show} /> */}
                        <h6>ทั้งหมด {count(dataShowAll, props.show)} รายการ</h6>
                        <div style={{ overflow: "auto", maxHeight: "480px" }}>
                            <table className="table table-sm table-striped">
                                <thead className="thead-dark headerTable">
                                    <tr>
                                        {/* <th scope="col">#</th> */}
                                        <th className="headerTable" scope="col">2ตัวล่าง</th>
                                        <th className="headerTable" scope="col">ราคา</th>
                                        <th className="headerTable" scope="col"></th>
                                        {/* <th scope="col">ชื่อ</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {showDown.map((element, index) => {
                                        return (
                                            <tr key={index}>
                                                {/* <td>{index + 1}</td> */}
                                                <td>{element.numLotto}</td>
                                                <td>{element.sumPrice}</td>
                                                {/* <td><button className="btn btn-warning btn-sm"
                                                data-toggle="modal"
                                                data-target="#exampleModal"
                                                onClick={() => numberLottoDown(element.numLotto, props.show)}>แก้ไข</button></td> */}
                                                {/* <td>{element.name}</td> */}
                                            </tr>
                                        )
                                    })}


                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* <!-- Modal --> */}
                </div>
            </div>
        )

    }
    else {
        return (
            <div>
                <div className="row">
                    <div className="col-6">


                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="inputGroup-sizing-default">แสดงข้อมูลของ</span></div>
                            <select className="custom-select" value={namename} onChange={(e) => showName(e.target.value)}>
                                <option selected hidden>เลีอก</option>
                                {nameSelect.map((element, index) => {
                                    return (
                                        <option key={index} value={element}>{element}</option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="col-6">

                    </div>




                </div>
                <div className="row">
                    <div className="col-sm-6">
                        <h6>ชื่อ: {namename} </h6>
                        {/* <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="inputGroup-sizing-default">รายการราคารวมเกิน</span></div>
                    <select className="custom-select" onChange={(e) => setLimitPrice(e.target.value)}>
                        <option value={200}>200</option>
                        <option value={300}>300</option>
                        <option value={400}>400</option>
                        <option value={500}>500</option>
                    </select>
                </div> */}
                        <div style={{ overflow: "auto", maxHeight: "480px" }}>
                            <table className="table table-sm table-striped">
                                <thead className="thead-dark headerTable">
                                    <tr>
                                        {/* <th scope="col">#</th> */}
                                        <th className="headerTable" scope="col">2ตัวล่าง</th>
                                        <th className="headerTable" scope="col">ราคา &gt;{limitPrice}</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-body-table">
                                    {showTop.map((element, index) => {

                                        if (element.sumPrice - limitPrice > 0) {
                                            return (
                                                <tr key={index} >
                                                    {/* <td>{index + 1}</td> */}
                                                    <td>{element.numLotto}</td>
                                                    <td>{element.sumPrice - limitPrice}</td>
                                                </tr>
                                            )
                                        }
                                    })}


                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="col-sm-6">
                        {/* <ExportExcel data={dataShowAll} typeLotto={props.show} /> */}
                        <h6>ตัวเลขทั้งหมด {count(dataShowAll, props.show)} รายการ</h6>
                        <div style={{ overflow: "auto", maxHeight: "480px" }}>
                            <table className="table table-sm table-striped">
                                <thead className="thead-dark headerTable">
                                    <tr>
                                        {/* <th scope="col">#</th> */}
                                        <th className="headerTable" scope="col">2ตัวล่าง</th>
                                        <th className="headerTable" scope="col">ราคา</th>
                                        <th className="headerTable" scope="col"></th>
                                        {/* <th scope="col">ชื่อ</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {showTop.map((element, index) => {
                                        return (
                                            <tr key={index}>
                                                {/* <td>{index + 1}</td> */}
                                                <td>{element.numLotto}</td>
                                                <td>{element.sumPrice}</td>
                                                {/* <td><button className="btn btn-warning btn-sm"
                                            data-toggle="modal"
                                            data-target="#exampleModal"
                                            onClick={() => numberLottoDown(element.numLotto, props.show)}>แก้ไข</button></td> */}
                                                {/* <td>{element.name}</td> */}
                                            </tr>
                                        )
                                    })}


                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* <!-- Modal --> */}
                </div>
            </div>
        )
    }


}
export default PriceShowName