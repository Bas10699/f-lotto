import React, { useState, useEffect } from 'react'
import { sortData } from '../const/constance'
import firebase, { db } from '../firebase'



const PriceShowAll = () => {
    const [showData, setShowData] = useState([])
    const [showTop200, setShowTop200] = useState([])
    const [showDown200, setShowDown200] = useState([])
    const [showTop, setShowTop] = useState([])
    const [showDown, setShowDown] = useState([])
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
            sortData(lottoTop, "sumPrice", true)
            sortData(lottoDown, "sumPrice", true)
            setShowTop(lottoTop)
            setShowDown(lottoDown)

        });


    }, [])
    return (
        <div className="row">
            <div className="col-sm-6">
                {/* <h6>รายการตัวเลขราคารวมเกิน 200 บาท</h6> */}
                <table className="table table-sm">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">2ตัวบน</th>
                            <th scope="col">ราคา</th>
                        </tr>
                    </thead>
                    <tbody>
                        {showTop.map((element, index) => {
                            let bgColors = ""
                            if (element.sumPrice >= 500) {
                                bgColors = "table-danger"
                            }
                            else if (element.sumPrice >= 400) {
                                bgColors = "table-warning"
                            }
                            else if (element.sumPrice >= 300) {
                                bgColors = "table-success"
                            }
                            else if(element.sumPrice >= 200){
                                bgColors = "table-primary"
                            }
                            else {
                                bgColors = ""
                            }
                            return (
                                <tr key={index} className={bgColors}>
                                    <td>{index + 1}</td>
                                    <td>{element.numLotto}</td>
                                    <td>{element.sumPrice}</td>
                                </tr>
                            )
                        })}


                    </tbody>
                </table>
            </div>
            <div className="col-sm-6">
                {/* <h6>รายการตัวเลขราคารวมเกิน 200 บาท</h6> */}
                <table className="table table-sm">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">2ตัวล่าง</th>
                            <th scope="col">ราคา</th>
                        </tr>
                    </thead>
                    <tbody>
                        {showDown.map((element, index) => {
                            let bgColorsD = ""
                            if (element.sumPrice >= 500) {
                                bgColorsD = "table-danger"
                            }
                            else if (element.sumPrice >= 400) {
                                bgColorsD = "table-warning"
                            }
                            else if (element.sumPrice >= 300) {
                                bgColorsD = "table-success"
                            }
                            else if(element.sumPrice >= 200){
                                bgColorsD = "table-primary"
                            }
                            else {
                                bgColorsD = ""
                            }
                            return (
                                <tr key={index} className={bgColorsD}>
                                    <td>{index + 1}</td>
                                    <td>{element.numLotto}</td>
                                    <td>{element.sumPrice}</td>
                                </tr>
                            )
                        })}


                    </tbody>
                </table>
            </div>

            {/* <div className="col-sm-6">
                <h6>รายการตัวเลขทั้งหมด</h6>
                <table className="table table-sm">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">ตัวเลข</th>
                            <th scope="col">ราคา</th>
                            <th scope="col">ชื่อ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {showData.map((element, index) => {
                            return (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{element.numLotto}</td>
                                    <td>{element.priceLotto}</td>
                                    <td>{element.name}</td>
                                </tr>
                            )
                        })}


                    </tbody>
                </table>
            </div> */}



        </div>
    )
}
export default PriceShowAll