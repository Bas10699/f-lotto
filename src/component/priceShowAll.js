import React, { useState, useEffect } from 'react'
import firebase, { db } from '../firebase'


const PriceShowAll = () => {
    const [showData, setShowData] = useState([])
    const [show200, setShow200] = useState([])
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

            let lotto200 = []
            lotto.map((eleLotto) => {
                let sum = 0
                shData.map((eleData) => {
                    if (eleLotto === eleData.numLotto) {
                        sum += eleData.priceLotto
                    }
                })
                if (sum > 200) {
                    lotto200.push({
                        numLotto: eleLotto,
                        sumPrice: sum
                    })
                }


            })
            // console.log("lotto", lotto200)
            // console.log("Data", shData)
            setShowData(shData)
            setShow200(lotto200)

        });


    }, [])
    return (
        <div className="row">
            <div className="col-sm-6">
                <h6>รายการตัวเลขราคารวมเกิน 200 บาท</h6>
                <table className="table table-sm">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">ตัวเลข</th>
                            <th scope="col">ราคา</th>
                        </tr>
                    </thead>
                    <tbody>
                        {show200.map((element, index) => {
                            return (
                                <tr key={index}>
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
            </div>



        </div>
    )
}
export default PriceShowAll