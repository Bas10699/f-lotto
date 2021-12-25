import React, { useState, useEffect } from 'react'
import { addComma, sortData, sortlotto3, sortReversedData, swapLotto3 } from '../const/constance'
import firebase, { db } from '../firebase'
import icon from '../const/icon/list.svg'
import Swal from 'sweetalert2'
import ExportExcel from './exportExcel'
import printJS from "print-js";
import '../App.css'
import ExportExcel3 from './exportExcel3'


const PriceShowAll = (props) => {
    const [showData, setShowData] = useState([])
    const [showTop200, setShowTop200] = useState([])
    const [showDown200, setShowDown200] = useState([])
    const [showTop, setShowTop] = useState([])
    const [showDown, setShowDown] = useState([])
    const [limitPrice, setLimitPrice] = useState(200)
    const [dataNumber, setdataNumber] = useState([])

    const [showData3, setShowData3] = useState([])
    const [showT3, setShowT3] = useState([])
    const [showT3S100, setShowT3S100] = useState([])
    const [limitPrice3, setLimitPrice3] = useState(10)
    const [limitPrice3todd, setLimitPrice3todd] = useState(10)
    const [dataNumber3, setdataNumber3] = useState([])

    const reversedNum = num => num.toString().split('').reverse().join('')

    const sumAllPrice = (item) => {

    }

    const LottoPintter = (item) => {
        let dataPinter = []
        let sum = 0
        item.map((element, index) => {

            if (element.sumTrong - limitPrice > 0 || element.sumTodd - limitPrice > 0) {
                sum = sum + ((element.sumTrong - limitPrice) > 0 ? element.sumTrong - limitPrice : 0) + ((element.sumTodd - limitPrice) > 0 ? element.sumTodd - limitPrice : 0)
                dataPinter.push({
                    numLotto: element.numLotto,
                    sumTrong: (element.sumTrong - limitPrice) > 0 ? element.sumTrong - limitPrice : 0,
                    sumTodd: (element.sumTodd - limitPrice) > 0 ? element.sumTodd - limitPrice : 0
                })

            }

        })
        dataPinter.push({
            numLotto: "รวม",
            sumTrong: sum,
            sumTodd: "บาท"
        })


        return dataPinter
    }
    const LottoPintter3 = (item, limit, limitTodd) => {
        let dataPinter = []
        item.map((element, index) => {

            if (element.sumTrong - limit > 0 || element.sumTodd - limitTodd > 0) {
                dataPinter.push({
                    numLotto: element.numLotto,
                    sumTrong: (element.sumTrong - limit) > 0 ? element.sumTrong - limit : 0,
                    sumTodd: (element.sumTodd - limitTodd) > 0 ? element.sumTodd - limitTodd : 0
                })

            }

        })
        return dataPinter
    }

    const deletePriceLotto = (id, lotto, price1,price2, index) => {
        let dataNum = dataNumber
        console.log("0", dataNum)

        Swal.fire({
            title: "ต้องการลบ!",
            text: 'เลข ' + lotto + " ราคา " + price1+"*"+price2 + ".-",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'ยกเลิก',
            confirmButtonText: 'ลบเลย'
        }).then((result) => {
            if (result.isConfirmed) {
                db.collection("lotto").doc(id).delete().then(() => {
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
    const deletePriceLotto3 = (id, lotto, price1, price2, index) => {
        let dataNum = dataNumber3
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
    const numberLottoTop3 = (number) => {
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

                setdataNumber3(shData)

            })
        // .catch((error) => {
        //     console.log("Error getting documents: ", error);
        // });
    }

    const numberLottoTop = (number, typeLotto) => {
        db.collection("lotto")
            .where("numLotto", "in", [number, reversedNum(number)])
            .where("typeLotto", "==", typeLotto)
            .where("drawDate", "==", props.dDate).onSnapshot((querySnapshot) => {
                let shData = []
                let lotto = []
                
                querySnapshot.forEach((doc) => {
console.log("doc",doc.data())
                    if ((doc.data().numLotto === number || doc.data().numLotto === reversedNum(number)) && (doc.data().typeLotto === typeLotto)) {

                        shData.unshift({ id: doc.id, ...doc.data() })
                    } else {
                        console.log("update: ", doc)
                    }


                });
                // console.log("lotto", lotto200)
                // console.log("Data number", shData)
                setdataNumber(shData)
                // // setShowTop200(lottoTop200)
                // // setShowDown200(lottoDown200)
                // sortData(lottoTop, "numLotto", false)
                // sortData(lottoDown, "numLotto", false)
                // setShowTop(lottoTop)
                // setShowDown(lottoDown)

            })
        // .catch((error) => {
        //     console.log("Error getting documents: ", error);
        // });
    }

    const numberLottoDown = (number, typeLotto) => {
        db.collection("lotto")
            .where("numLotto", "in", [number, reversedNum(number)])
            .where("typeLotto", "==", typeLotto)
            .where("drawDate", "==", props.dDate)
            .onSnapshot((querySnapshot) => {
                let shData = []
                let lotto = []
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    // console.log("กก => ", doc.data());
                    // shData.unshift({ id: doc.id, ...doc.data() })
                    if ((doc.data().numLotto === number || doc.data().numLotto === reversedNum(number)) && (doc.data().typeLotto === typeLotto)) {
                        shData.unshift({ id: doc.id, ...doc.data() })
                    } else {
                        console.log("update: ", doc)
                    }


                });
                // console.log("lotto", lotto200)
                // console.log("Data number", shData)
                setdataNumber(shData)
                // // setShowTop200(lottoTop200)
                // // setShowDown200(lottoDown200)
                // sortData(lottoTop, "numLotto", false)
                // sortData(lottoDown, "numLotto", false)
                // setShowTop(lottoTop)
                // setShowDown(lottoDown)

            });
    }
    const count = (storage, typeLot) => { return storage.filter(item => item.typeLotto === typeLot).length }

    const sortLotto = (data) => {
        let dataOut = []
        let lotto = []

        const filterLotto = num => data.find(item => { return item.numLotto === num })

        data.map((element) => {
            let index = lotto.findIndex((elem) => (elem === element.numLotto || elem === reversedNum(element.numLotto)))
            if (index < 0) {
                if (element.numLotto !== null && element.numLotto !== undefined) {
                    // console.log(ele_data.plant)
                    lotto.push(
                        element.numLotto
                    )
                    let sumTodd = filterLotto(reversedNum(element.numLotto))
                    dataOut.push({
                        numLotto: element.numLotto,
                        sumTrong: element.sumPrice,
                        sumTodd: sumTodd ? sumTodd.sumPrice : 0
                    })

                }
            }

        })
        // console.log("lotto", dataOut)
        return dataOut
    }

    const sumPrice = (data, item, limit) => {
        data.map((ele) => {

        })
    }

    const lotto2 = () => {
        db.collection("lotto").where("drawDate", "==", props.dDate).onSnapshot((querySnapshot) => {
            let shData = []
            let lotto = []
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());

                shData.unshift({ id: doc.id, ...doc.data() })


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

            let lottoTop200 = []
            let lottoDown200 = []
            let lottoTop = []
            let lottoDown = []

            let lottoset = sortReversedData(lotto.sort())
            console.log("lot", lottoset)
            lottoset.map((eleLotto) => {
                let sumTop = 0
                let sumDown = 0
                shData.map((eleData) => {
                    if ((eleLotto === eleData.numLotto) && (eleData.typeLotto === 0)) {
                        sumTop += eleData.priceLotto1
                    }
                    else if ((eleLotto === eleData.numLotto) && (eleData.typeLotto === 1)) {
                        sumDown += eleData.priceLotto1
                    }
                    else if ((eleLotto === reversedNum(eleData.numLotto)) && (eleData.typeLotto === 0)) {
                        sumTop += eleData.priceLotto2
                    }
                    else if ((eleLotto === reversedNum(eleData.numLotto)) && (eleData.typeLotto === 1)) {
                        sumDown += eleData.priceLotto2
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
            // console.log("lotto", lotto200)
            // console.log("Data", shData)
            setShowData(shData)
            // setShowTop200(lottoTop200)
            // setShowDown200(lottoDown200)
            // sortReversedData(lottoTop, "numLotto")
            // sortData(lottoDown, "numLotto", false)

            setShowTop(lottoTop)
            setShowDown(lottoDown)

            setShowDown200(sortLotto(lottoDown))
            setShowTop200(sortLotto(lottoTop))


        });
    }

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
        sortlotto3(lotto)
        // console.log("lotto", lotto)
        return lotto
    }

    const lotto3 = () => {
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

            setShowData3(shData)

            sortData(lottoT3, "numLotto", false)
            setShowT3(lottoT3)

        });
    }

    useEffect(() => {
        lotto2()
        lotto3()


    }, [])


    if (props.show === 1) {
        return (
            <div>
                <h4>แสดงข้อมูล <div className="text-danger d-inline">รับเอง {addComma(showDown.reduce((accumulator, currentValue) => accumulator + currentValue.sumPrice, 0) - showDown.reduce((accumulator, currentValue) => accumulator + (currentValue.sumPrice - limitPrice > 0 ? currentValue.sumPrice - limitPrice : 0), 0))} บาท</div>
                </h4>

                <div className="row">
                    <div className="col-sm-6">

                        <div className="input-group input-group-sm ">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="inputGroup-sizing-default">ราคารวมเกิน</span></div>
                            <select className="custom-select" defaultValue={limitPrice} onChange={(e) => setLimitPrice(e.target.value)}>
                                <option value={200}>200</option>
                                <option value={300}>300</option>
                                <option value={400}>400</option>
                                <option value={500}>500</option>
                            </select>
                            <div className="input-group-append">
                                <button className="btn btn-outline-info" onClick={() => printJS({
                                    printable: LottoPintter(showDown200),
                                    type: 'json',
                                    properties: [
                                        { field: 'numLotto', displayName: '2ตัวล่าง' },
                                        { field: 'sumTrong', displayName: 'ตรง' },
                                        { field: 'sumTodd', displayName: 'โต๊ด' }
                                    ],
                                    style: '.custom-h3 { color: red; }',
                                    font_size: '18pt',
                                    documentTitle: `ราคาเกิน ${limitPrice}บาท`
                                })}>print</button>
                            </div>
                        </div>
                        <h6>
                            ทั้งหมด
                            <div className="float-right">
                                {addComma(showDown.reduce((accumulator, currentValue) => accumulator + (currentValue.sumPrice - limitPrice > 0 ? currentValue.sumPrice - limitPrice : 0), 0))} บาท
                            </div>
                        </h6>
                        <div style={{ overflow: "auto", maxHeight: "450px" }}>
                            <table className="table table-sm table-striped">
                                <thead className="thead-dark headerTable">
                                    <tr>
                                        {/* <th scope="col">#</th> */}
                                        <th className="headerTable" scope="col">2ตัวล่าง</th>
                                        <th className="headerTable" scope="col">ตรง</th>
                                        <th className="headerTable" scope="col">โต๊ด</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-body-table">
                                    {showDown200.map((element, index) => {

                                        if (element.sumTrong - limitPrice > 0 || element.sumTodd - limitPrice > 0) {
                                            let todd = element.sumTodd - limitPrice
                                            let trong = element.sumTrong - limitPrice
                                            return (
                                                <tr key={index} >
                                                    {/* <td>{index + 1}</td> */}
                                                    <td>{element.numLotto}</td>
                                                    <td>{trong > 0 ? trong : 0}</td>
                                                    <td>{todd > 0 ? todd : 0}</td>
                                                </tr>
                                            )
                                        }
                                    })}


                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="col-sm-6">
                        <ExportExcel data={sortData(showData, "name", false)} typeLotto={props.show} />
                        <h6>ทั้งหมด {count(showData, props.show)} รายการ  <div className="float-right">{addComma(showDown.reduce((accumulator, currentValue) => accumulator + currentValue.sumPrice, 0))} บาท</div></h6>
                        <div style={{ overflow: "auto", maxHeight: "450px" }}>
                            <table className="table table-sm table-striped">
                                <thead className="thead-dark headerTable">
                                    <tr>
                                        <th className="headerTable" scope="col">2ตัวล่าง</th>
                                        <th className="headerTable" scope="col">ตรง</th>
                                        <th className="headerTable" scope="col">โต๊ด</th>
                                        <th scope="col"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {showDown200.map((element, index) => {
                                        if (element.numLotto == reversedNum(element.numLotto)) element.sumTodd = 0
                                        return (
                                            <tr key={index}>
                                                <td>{element.numLotto}</td>
                                                <td>{element.sumTrong}</td>
                                                <td>{element.sumTodd}</td>
                                                <td><button className="btn btn-warning btn-sm"
                                                    data-toggle="modal"
                                                    data-target="#exampleModal"
                                                    onClick={() => numberLottoDown(element.numLotto, props.show)}>แก้ไข</button>
                                                </td>
                                            </tr>
                                        )
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
                                    <h5 className="modal-title" id="exampleModalLabel">รายละเอียด 2ตัวล่าง </h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">×</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th scope="col">ชื่อ</th>
                                                <th scope="col">2ตัวล่าง</th>
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
                                                        <td>{ele_num.priceLotto1+"*"+ele_num.priceLotto2}</td>
                                                        <td>{ele_num.date}</td>
                                                        <td>{ele_num.time}</td>
                                                        <td><button className="btn btn-danger btn-sm"
                                                            onClick={() => deletePriceLotto(ele_num.id, ele_num.numLotto, ele_num.priceLotto)}>
                                                            ลบ
                                                        </button>
                                                        </td>
                                                    </tr>
                                                    // <div>{ele_num.numLotto} = {ele_num.priceLotto} บาท ลงวันที่ {ele_num.date} เวลา {ele_num.time} <button className="btn btn-danger btn-sm" onClick={() => deletePriceLotto(ele_num.id, ele_num.numLotto, ele_num.priceLotto)}>ลบ</button></div>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                {/* <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary">Save changes</button>
                            </div> */}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
    else if (props.show === 0) {
        return (
            <div>
                <h4>แสดงข้อมูล <div className="text-danger d-inline">
                    รับเอง {addComma(showTop.reduce((accumulator, currentValue) => accumulator + currentValue.sumPrice, 0) - showTop.reduce((accumulator, currentValue) => accumulator + (currentValue.sumPrice - limitPrice > 0 ? currentValue.sumPrice - limitPrice : 0), 0))} บาท</div>
                </h4>
                <div className="row">
                    <div className="col-sm-6">
                        <div className="input-group input-group-sm">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="inputGroup-sizing-default">ราคารวมเกิน</span></div>
                            <select className="custom-select" defaultValue={limitPrice} onChange={(e) => setLimitPrice(e.target.value)}>
                                <option value={200}>200</option>
                                <option value={300}>300</option>
                                <option value={400}>400</option>
                                <option value={500}>500</option>
                            </select>
                            <div className="input-group-append">
                                <button className="btn btn-outline-info" onClick={() => printJS({
                                    printable: LottoPintter(showTop200),
                                    type: 'json',
                                    properties: [
                                        { field: 'numLotto', displayName: '2ตัวบน' },
                                        { field: 'sumTrong', displayName: 'ตรง' },
                                        { field: 'sumTodd', displayName: 'โต๊ด' }
                                    ],
                                    style: '.custom-h3 { color: red; }',
                                    font_size: '18pt',
                                    documentTitle: `ราคาเกิน ${limitPrice}บาท`
                                })}>print</button>
                            </div>
                        </div>
                        <h6>
                            ทั้งหมด
                            <div className="float-right">
                                {addComma(showTop.reduce((accumulator, currentValue) => accumulator + (currentValue.sumPrice - limitPrice > 0 ? currentValue.sumPrice - limitPrice : 0), 0))} บาท
                            </div>
                        </h6>
                        <div style={{ overflow: "auto", maxHeight: "450px" }}>
                            <table className="table table-sm table-striped ">
                                <thead className="thead-dark headerTable">
                                    <tr>
                                        <th className="headerTable" scope="col">2ตัวบน</th>
                                        <th className="headerTable" scope="col">ตรง</th>
                                        <th className="headerTable" scope="col">โต๊ด</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-body-table">
                                    {showTop200.map((element, index) => {

                                        if (element.sumTrong - limitPrice > 0 || element.sumTodd - limitPrice > 0) {
                                            return (
                                                <tr key={index} className="">
                                                    <td>{element.numLotto}</td>
                                                    <td>{element.sumTrong - limitPrice > 0 ? element.sumTrong - limitPrice : 0}</td>
                                                    <td>{element.sumTodd - limitPrice > 0 ? element.sumTodd - limitPrice : 0}</td>
                                                </tr>
                                            )
                                        }

                                    })}


                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="col-sm-6">
                        <ExportExcel data={sortData(showData, "name", false)} typeLotto={props.show} />
                        <h6>ทั้งหมด {count(showData, props.show)} รายการ
                            <div className="float-right">
                                {addComma(showTop.reduce((accumulator, currentValue) => accumulator + currentValue.sumPrice, 0))} บาท</div>
                        </h6>
                        <div style={{ overflow: "auto", height: "450px" }}>
                            <table className="table table-sm table-striped">
                                <thead className="thead-dark headerTable">
                                    <tr>
                                        <th className="headerTable" scope="col">2ตัวบน</th>
                                        <th className="headerTable" scope="col">ตรง</th>
                                        <th className="headerTable" scope="col">โต๊ด</th>
                                        <th className="headerTable" scope="col"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {showTop200.map((element, index) => {
                                        if (element.numLotto == reversedNum(element.numLotto)) element.sumTodd = 0
                                        return (
                                            <tr key={index}>
                                                <td>{element.numLotto}</td>
                                                <td>{element.sumTrong}</td>
                                                <td>{element.sumTodd}</td>

                                                <td><button className="btn btn-warning btn-sm"
                                                    data-toggle="modal"
                                                    data-target="#exampleModal"
                                                    onClick={() => numberLottoTop(element.numLotto, props.show)}>แก้ไข</button>
                                                </td>
                                            </tr>
                                        )
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
                                                        <td>{ele_num.priceLotto1 +"*"+ ele_num.priceLotto2}</td>
                                                        <td>{ele_num.date}</td>
                                                        <td>{ele_num.time}</td>
                                                        <td><button className="btn btn-danger btn-sm"
                                                            onClick={() => deletePriceLotto(ele_num.id, ele_num.numLotto, ele_num.priceLotto1,ele_num.priceLotto2, index)}>
                                                            ลบ
                                                        </button>
                                                        </td>
                                                    </tr>
                                                    // <div>{ele_num.numLotto} = {ele_num.priceLotto} บาท ลงวันที่ {ele_num.date} เวลา {ele_num.time} <button className="btn btn-danger btn-sm" onClick={() => deletePriceLotto(ele_num.id, ele_num.numLotto, ele_num.priceLotto)}>ลบ</button></div>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                {/* <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary">Save changes</button>
                            </div> */}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
    else {
        return (
            <div>
                <h4>แสดงข้อมูล <div className="text-danger d-inline">
                        รับเอง ตรง {addComma(showT3.reduce((accumulator, currentValue) => accumulator + currentValue.sumTrong, 0) - showT3.reduce((accumulator, currentValue) => accumulator + (currentValue.sumTrong - limitPrice3 > 0 ? currentValue.sumTrong - limitPrice3 : 0), 0))} .-
                        โต๊ด {addComma(showT3.reduce((accumulator, currentValue) => accumulator + currentValue.sumTodd, 0) - showT3.reduce((accumulator, currentValue) => accumulator + (currentValue.sumTodd - limitPrice3todd > 0 ? currentValue.sumTodd - limitPrice3todd : 0), 0))} .-
                    </div>

                </h4>

                <div className="row">
                    <div className="col-sm-6">
                        <div className="input-group mb-3 input-group-sm">
                            <select className="custom-select" hidden>
                                <option value={50}>50</option>
                            </select>
                            <div className="input-group-prepend">
                                <span className="input-group-text" >ตรง</span></div>
                            <select className="custom-select" defaultValue={limitPrice3} onChange={(e) => setLimitPrice3(e.target.value)}>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                                <option value={200}>200</option>
                                <option value={300}>300</option>
                                <option value={400}>400</option>
                                <option value={500}>500</option>
                            </select>
                            <div className="input-group-prepend">
                                <span className="input-group-text">โต๊ด</span></div>
                            <select className="custom-select" defaultValue={limitPrice3todd} onChange={(e) => setLimitPrice3todd(e.target.value)}>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={40}>40</option>
                                <option value={60}>60</option>
                                <option value={80}>80</option>
                                <option value={100}>100</option>
                            </select>

                            <div className="input-group-append">
                                <button className="btn btn-outline-info" onClick={() => printJS({
                                    printable: LottoPintter3(showT3, limitPrice3, limitPrice3todd),
                                    type: 'json',
                                    properties: [
                                        { field: 'numLotto', displayName: '3ตัวบน' },
                                        { field: 'sumTrong', displayName: 'ตรง' },
                                        { field: 'sumTodd', displayName: 'โต๊ด' }
                                    ],
                                    style: '.custom-h3 { color: red; }',
                                    font_size: '18pt',
                                    documentTitle: `ราคาเกิน ${limitPrice3}บาท`
                                })}>print</button>
                            </div>
                        </div>

                        <div style={{ overflow: "auto", maxHeight: "450px" }}>
                            <table className="table table-sm table-striped ">
                                <thead className="thead-dark headerTable">
                                    <tr>
                                        <th className="headerTable" scope="col">3ตัวบน</th>
                                        <th className="headerTable" scope="col">ตรง</th>
                                        <th className="headerTable" scope="col">โต๊ด</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-body-table">
                                    {showT3.map((element, index) => {
                                        let limitTodd = limitPrice3todd

                                        if (element.sumTrong - limitPrice3 > 0 || element.sumTodd - limitTodd > 0) {
                                            return (
                                                <tr key={index} className="">
                                                    <td>{element.numLotto}</td>
                                                    <td>{(element.sumTrong - limitPrice3) > 0 ? element.sumTrong - limitPrice3 : 0}</td>
                                                    <td>{(element.sumTodd - limitTodd) > 0 ? element.sumTodd - limitTodd : 0} </td>
                                                </tr>
                                            )
                                        }

                                    })}
                                </tbody>
                                <tfoot className="bg-light fTable">
                                    <tr>
                                        <td className="fTable">รวม</td>
                                        <td className="fTable">{showT3.reduce((accumulator, currentValue) => accumulator + ((currentValue.sumTrong - limitPrice3) > 0 ? currentValue.sumTrong - limitPrice3 : 0), 0)}</td>
                                        <td className="fTable">{showT3.reduce((accumulator, currentValue) => accumulator + ((currentValue.sumTodd - limitPrice3todd) > 0 ? currentValue.sumTodd - limitPrice3todd : 0), 0)}</td>
                                        <td></td>
                                    </tr>
                                </tfoot>

                            </table>
                        </div>
                    </div>

                    <div className="col-sm-6">
                        <ExportExcel3 data={sortData(showData3, "name", false)} typeLotto={props.show} />

                        <button className="btn btn-outline-info btn-sm " onClick={() => printJS({
                            printable: LottoPintter3(showT3, 0),
                            type: 'json',
                            properties: [
                                { field: 'numLotto', displayName: '3ตัวบน' },
                                { field: 'sumTrong', displayName: 'ตรง' },
                                { field: 'sumTodd', displayName: 'โต๊ด' }
                            ],
                            style: '.custom-h3 { color: red; column-count: 2; column-gap: 40px;}',
                            font_size: '18pt',
                            // style:'column-count: 2; column-gap: 40px;',
                            documentTitle: `ราคาเกิน ${limitPrice3}บาท`
                        })}>print</button>

                        <h6>
                            {/* ทั้งหมด {count(showData, props.show)} รายการ */}
                        </h6>
                        <div style={{ overflow: "auto", height: "450px" }}>
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
                                                        onClick={() => numberLottoTop3(element.numLotto)}>แก้ไข</button></td>
                                                    {/* <td>{element.name}</td> */}
                                                </tr>
                                            )
                                        }
                                        else {
                                            console.log("err lotto3", index)
                                        }
                                    })}


                                </tbody>
                                <tfoot className="bg-light fTable">
                                    <tr>
                                        <td className="fTable">รวม</td>
                                        <td className="fTable">{showT3.reduce((accumulator, currentValue) => accumulator + currentValue.sumTrong, 0)}</td>
                                        <td className="fTable">{showT3.reduce((accumulator, currentValue) => accumulator + currentValue.sumTodd, 0)}</td>
                                        <td></td>
                                    </tr>
                                </tfoot>
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
                                                <th scope="col">3ตัวบน</th>
                                                <th scope="col">ราคา</th>
                                                <th scope="col">วันที่</th>
                                                <th scope="col">เวลา</th>
                                                <th scope="col"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dataNumber3.map((ele_num, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{ele_num.name}</td>
                                                        <td>{ele_num.numLotto}</td>
                                                        <td>{ele_num.priceLotto1} * {ele_num.priceLotto2}</td>
                                                        <td>{ele_num.date}</td>
                                                        <td>{ele_num.time}</td>
                                                        <td><button className="btn btn-danger btn-sm"
                                                            onClick={() => deletePriceLotto3(ele_num.id, ele_num.numLotto, ele_num.priceLotto1, ele_num.priceLotto2, index)}>
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
            </div>
        )

    }

}
export default PriceShowAll