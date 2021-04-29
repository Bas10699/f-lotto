import React, { useState, useEffect } from 'react'
import { sortData } from '../const/constance'
import firebase, { db } from '../firebase'
import icon from '../const/icon/list.svg'
import ModalShowNum from './modalShowNum'


const PriceShowAll = (props) => {
    const [showData, setShowData] = useState([])
    const [showTop200, setShowTop200] = useState([])
    const [showDown200, setShowDown200] = useState([])
    const [showTop, setShowTop] = useState([])
    const [showDown, setShowDown] = useState([])
    const [limitPrice, setLimitPrice] = useState(200)
    const [dataNumber, setdataNumber] = useState([])

    const numberLottoTop = (number) => {
        db.collection("lotto").where("numLotto", "==", number).onSnapshot((querySnapshot) => {
            let shData = []
            let lotto = []
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                shData.unshift(doc.data())
            

            });
            // console.log("lotto", lotto200)
            console.log("Data number", shData)
            setdataNumber(shData)
            // // setShowTop200(lottoTop200)
            // // setShowDown200(lottoDown200)
            // sortData(lottoTop, "numLotto", false)
            // sortData(lottoDown, "numLotto", false)
            // setShowTop(lottoTop)
            // setShowDown(lottoDown)

        });
    }
    useEffect(() => {

        db.collection("lotto").onSnapshot((querySnapshot) => {
            let shData = []
            let lotto = []
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
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
                    <table className="table table-sm">
                        <thead className="thead-dark">
                            <tr>
                                {/* <th scope="col">#</th> */}
                                <th scope="col">2ตัวล่าง</th>
                                <th scope="col">ราคา</th>
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

                <div className="col-sm-6">
                    <h6>รายการตัวเลขทั้งหมด</h6>
                    <table className="table table-sm">
                        <thead className="thead-dark">
                            <tr>
                                {/* <th scope="col">#</th> */}
                                <th scope="col">2ตัวล่าง</th>
                                <th scope="col">ราคา</th>
                                <th scope="col"></th>
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
                                        <td><button className="btn btn-warning btn-sm">แก้ไข</button></td>
                                        {/* <td>{element.name}</td> */}
                                    </tr>
                                )
                            })}


                        </tbody>
                    </table>
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
                    <table className="table table-sm">
                        <thead className="thead-dark">
                            <tr>
                                {/* <th scope="col">#</th> */}
                                <th scope="col">2ตัวบน</th>
                                <th scope="col">ราคา</th>
                            </tr>
                        </thead>
                        <tbody>
                            {showTop.map((element, index) => {
                                let bgColors = "table-primary"
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

                <div className="col-sm-6">
                    <h6>รายการตัวเลขทั้งหมด</h6>
                    <table className="table table-sm">
                        <thead className="thead-dark">
                            <tr>
                                {/* <th scope="col">#</th> */}
                                <th scope="col">2ตัวบน</th>
                                <th scope="col">ราคา</th>
                                <th scope="col"></th>
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
                                            onClick={() => numberLottoTop(element.numLotto)}>แก้ไข</button></td>
                                        {/* <td>{element.name}</td> */}
                                    </tr>
                                )
                            })}


                        </tbody>
                    </table>
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
                               {dataNumber.map((ele_num,index)=>{
                                   return(
                                       <div>{ele_num.numLotto} = {ele_num.priceLotto} บาท ลงวันที่ {ele_num.date} เวลา {ele_num.time} <button className="btn btn-danger" onClick={()=>alert('ยังไม่เสร็จ! ใจเย็นน้าาาาาา')}>ลบ</button></div>
                                   )
                               })}
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