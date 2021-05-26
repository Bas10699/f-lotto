import React, { useState, useEffect } from 'react'
import { sortData } from '../const/constance'
import firebase, { db } from '../firebase'
import icon from '../const/icon/list.svg'
import Swal from 'sweetalert2'
import ExportExcel from './exportExcel'
import '../App.css'


const PriceShowAll = (props) => {
    const [showData, setShowData] = useState([])
    const [showTop200, setShowTop200] = useState([])
    const [showDown200, setShowDown200] = useState([])
    const [showTop, setShowTop] = useState([])
    const [showDown, setShowDown] = useState([])
    const [limitPrice, setLimitPrice] = useState(200)
    const [dataNumber, setdataNumber] = useState([])

    const deletePriceLotto = (id, lotto, price, index) => {
        let dataNum = dataNumber
        console.log("0", dataNum)

        Swal.fire({
            title: "แน่ใจนะ!",
            text: 'เลข ' + lotto + " ราคา " + price + ".-",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'ยกเลิก',
            confirmButtonText: 'ลบเลย'
        }).then((result) => {
            if (result.isConfirmed) {
                // let data = dataNum.splice(index, 1)
                db.collection("lotto").doc(id).delete().then(() => {
                    console.log("Document successfully deleted!");
                    // numberLottoTop(lotto, props.show)
                    // setdataNumber(data)
                    // dataNum.splice(index, 1)
                    // console.log("1", dataNum)
                    // setdataNumber(dataNum)
                    // console.log("2", dataNum)
                    // setdataNumber(data)
                    // Swal.fire(
                    //     'Deleted!',
                    //     'Your file has been deleted.',
                    //     'success'
                    // )
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

    const numberLottoTop = (number, typeLotto) => {
        db.collection("lotto").where("numLotto", "==", number).where("typeLotto", "==", typeLotto).onSnapshot((querySnapshot) => {
            let shData = []
            let lotto = []
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                // console.log(doc.id, " => ", doc.data());
                // console.log("num: ", number)
                // if (change.type === "added") {
                    if ((doc.data().numLotto === number) && (doc.data().typeLotto === typeLotto)) {
                        // console.log("num1: ", doc.data().numLotto)
                        // console.log("New city: ", doc.data());
                        shData.unshift({ id: doc.id, ...doc.data() })
                    }else{
                        console.log("update: ", doc)
                    }
                    

                // }
                // if (change.type === "modified") {
                //     console.log("Modified city: ", change.doc.data());
                //     shData.unshift({ id: change.doc.id, ...change.doc.data() })
                // }
                // if (change.type === "removed") {
                //     console.log("Removed city: ", change.doc.data());
                //     shData.unshift({ id: change.doc.id, ...change.doc.data() })
                // }
                // shData.unshift({ id: doc.id, ...doc.data() })
                // else{
                //     console.log("else : ",change)
                // }


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
        db.collection("lotto").where("numLotto", "==", number).where("typeLotto", "==", typeLotto).onSnapshot((querySnapshot) => {
            let shData = []
            let lotto = []
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                // console.log(doc.id, " => ", doc.data());
                // shData.unshift({ id: doc.id, ...doc.data() })
                if ((doc.data().numLotto === number) && (doc.data().typeLotto === typeLotto)) {
                    shData.unshift({ id: doc.id, ...doc.data() })
                }else{
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
    
    useEffect(() => {

        db.collection("lotto").onSnapshot((querySnapshot) => {
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

            let lottoTop200 = []
            let lottoDown200 = []
            let lottoTop = []
            let lottoDown = []
            lotto.map((eleLotto) => {
                let sumTop = 0
                let sumDown = 0
                shData.map((eleData) => {
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
                // if (sumTop >= 200) {
                //     lottoTop200.push({
                //         numLotto: eleLotto,
                //         sumPrice: sumTop
                //     })
                // }
                // if (sumDown >= 200) {
                //     lottoDown200.push({
                //         numLotto: eleLotto,
                //         sumPrice: sumDown
                //     })
                // }


            })
            // console.log("lotto", lotto200)
            // console.log("Data", shData)
            setShowData(shData)
            // setShowTop200(lottoTop200)
            // setShowDown200(lottoDown200)
            sortData(lottoTop, "numLotto", false)
            sortData(lottoDown, "numLotto", false)
            setShowTop(lottoTop)
            setShowDown(lottoDown)

        });


    }, [])
    if (props.show === 1) {
        return (
            <div className="row">
                <div className="col-sm-6">
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroup-sizing-default">รายการราคารวมเกิน</span></div>
                        <select className="custom-select" onChange={(e) => setLimitPrice(e.target.value)}>
                            <option value={200}>200</option>
                            <option value={300}>300</option>
                            <option value={400}>400</option>
                            <option value={500}>500</option>
                        </select>
                    </div>
                    <div style={{ overflow: "auto", height: "480px" }}>
                        <table className="table table-sm table-striped">
                            <thead className="thead-dark headerTable">
                                <tr>
                                    {/* <th scope="col">#</th> */}
                                    <th className="headerTable" scope="col">2ตัวล่าง</th>
                                    <th className="headerTable" scope="col">ราคา</th>
                                </tr>
                            </thead>
                            <tbody>
                                {showDown.map((element, index) => {
                                    let bgColors = "table-info"
                                    // if (element.sumPrice >= 500) {
                                    //     bgColors = "table-danger"
                                    // }
                                    // else if (element.sumPrice >= 400) {
                                    //     bgColors = "table-warning"
                                    // }
                                    // else if (element.sumPrice >= 300) {
                                    //     bgColors = "table-success"
                                    // }
                                    // else if (element.sumPrice >= 200) {
                                    //     bgColors = "table-primary"
                                    // }
                                    // else {
                                    //     bgColors = ""
                                    // }
                                    if (element.sumPrice - limitPrice > 0) {
                                        return (
                                            <tr key={index} className={bgColors}>
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
                    <ExportExcel data={showData} typeLotto={props.show} />
                    <h6>ตัวเลขทั้งหมด {count(showData, props.show)} รายการ</h6>
                    <div style={{ overflow: "auto", height: "480px" }}>
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
                                            <td><button className="btn btn-warning btn-sm"
                                                data-toggle="modal"
                                                data-target="#exampleModal"
                                                onClick={() => numberLottoDown(element.numLotto, props.show)}>แก้ไข</button></td>
                                            {/* <td>{element.name}</td> */}
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
                                                    <td>{ele_num.priceLotto}</td>
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
        )
    }
    else {
        return (
            <div className="row">
                <div className="col-sm-6">
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroup-sizing-default">รายการราคารวมเกิน</span></div>
                        <select className="custom-select" onChange={(e) => setLimitPrice(e.target.value)}>
                            <option value={200}>200</option>
                            <option value={300}>300</option>
                            <option value={400}>400</option>
                            <option value={500}>500</option>
                        </select>
                    </div>
                    <div style={{ overflow: "auto", height: "480px" }}>
                        <table className="table table-sm table-striped ">
                            <thead className="thead-dark headerTable">
                                <tr>
                                    {/* <th scope="col">#</th> */}
                                    <th className="headerTable" scope="col">2ตัวบน</th>
                                    <th className="headerTable" scope="col">ราคา</th>
                                </tr>
                            </thead>
                            <tbody className="bg-body-table">
                                {showTop.map((element, index) => {

                                    if (element.sumPrice - limitPrice > 0) {
                                        return (
                                            <tr key={index} className="">
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
                    <ExportExcel data={showData} typeLotto={props.show} />
                    <h6>ตัวเลขทั้งหมด {count(showData, props.show)} รายการ</h6>
                    <div style={{ overflow: "auto", height: "480px" }}>
                        <table className="table table-sm table-striped">
                            <thead className="thead-dark headerTable">
                                <tr>
                                    {/* <th scope="col">#</th> */}
                                    <th className="headerTable" scope="col">2ตัวบน</th>
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
                                            <td><button className="btn btn-warning btn-sm"
                                                data-toggle="modal"
                                                data-target="#exampleModal"
                                                onClick={() => numberLottoTop(element.numLotto, props.show)}>แก้ไข</button></td>
                                            {/* <td>{element.name}</td> */}
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
                                                    <td>{ele_num.priceLotto}</td>
                                                    <td>{ele_num.date}</td>
                                                    <td>{ele_num.time}</td>
                                                    <td><button className="btn btn-danger btn-sm"
                                                        onClick={() => deletePriceLotto(ele_num.id, ele_num.numLotto, ele_num.priceLotto, index)}>
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
        )
    }

}
export default PriceShowAll