import React, { useState, useEffect } from "react"
import { BrowserRouter, HashRouter, Link, NavLink } from "react-router-dom"
import moment from "moment"
import '../App.css'
import ReportLotto3 from "./reportlotto3"
import { db } from "../firebase"
import { get } from "../const/servive"
import ReportLotto2Up from "./reportlotto2up"
import ReportLotto2down from "./reportlotto2down"
import ReportLottoAll from "./reportlottoall"
import { Route, useHistory } from "react-router"
import Swal from "sweetalert2"
import ReportHome from "./reportHome"
import { drawDate, sortReversedData } from "../const/constance"

const Report = () => {
    let history = useHistory();
    const [drawdate, setDrawdate] = useState('')
    const [loading, setLoading] = useState(true)
    const [resultLotto, setresultLotto] = useState([])
    const [i, seti] = useState(0)
    const [sumPrice, setsumPrice] = useState('')
    const [docId, setdocId] = useState([])
    const [docId3, setdocId3] = useState([])
    const [docData2Up, setdocData2Up] = useState([])
    const [docData2, setdocData2] = useState([])
    const [docData3, setdocData3] = useState([])

    const drawDateShow = () => {
        if ((moment().format("DD") * 1) > 16) {
            return "16/" + moment().add(543, "years").format("MM/YYYY")
        }
        else {
            return "01/" + moment().add(543, "years").format("MM/YYYY")
        }
    }

    const drawDateFs = () => {
        if ((moment().format("DD") * 1) > 15) {
            return "16/" + moment().format("MM/YYYY")
        }
        else {
            return "01/" + moment().format("MM/YYYY")
        }
        // return "16/09/2021"
    }

    const checkLotto = async (date) => {
        console.log("date", date)
        await get("?date=" + drawDate()).then((result) => {
            setLoading(true)
            if (result[0]) {
                // console.log(result)
                // setDrawdate(result.drawdate)
                // setresultLotto(result.result)
                // setLoading(false)
                db.collection("results").doc(drawDate()).set({
                    // drawdate: drawDate(),
                    // result: result.result,
                    result2down: {
                        name: "2ตัวล่าง",
                        number: result[3][1]
                    },
                    result3: {
                        name: "3ตัวบน",
                        number: result[0][1].slice(3)
                    },
                    result2up: {
                        name: "2ตัวบน",
                        number: result[0][1].slice(4)
                    }
                })
                    .then(() => {
                        console.log("Document successfully written!");
                        getResults()
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                    });
            }
            else {
                console.error(result)
            }
        })
    }

    const getResults = () => {
        db.collection("results")
            .doc(drawDate())
            .get().then((doc) => {
                console.log(doc.exists)
                if (doc.exists) {
                    console.log("Document data:", doc.data());
                    setresultLotto(doc.data())
                    setLoading(false)
                    // doc.forEach((doc) => {
                    //     // doc.data() is never undefined for query doc snapshots
                    //     console.log(doc.id, " => ", doc.data());
                    // });
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                    checkLotto(moment().add(543, 'years').format("DDMMyyyy"))
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
    }
    const addSumData = (up, down) => {
        db.collection("sumresults").doc(drawDate()).set({
            // drawdate: drawDate(),
            // result: result.result,
            result2down: {
                name: "2ตัวล่าง",
                sumprice: down.reduce((accumulator, currentValue) => accumulator + currentValue.sumPrice, 0),
                sum500over: down.reduce((accumulator, currentValue) => accumulator + (currentValue.sumPrice - 500 > 0 ? currentValue.sumPrice - 500 : 0), 0)
            },
            // result3: {
            //     name: "3ตัวบน",
            //     number: result[0][1].slice(3)
            // },
            result2up: {
                name: "2ตัวบน",
                sumprice: up.reduce((accumulator, currentValue) => accumulator + currentValue.sumPrice, 0),
                sum500over: up.reduce((accumulator, currentValue) => accumulator + (currentValue.sumPrice - 500 > 0 ? currentValue.sumPrice - 500 : 0), 0)
            }
        })
            .then(() => {
                console.log("Document successfully written!");
                getResults()
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
    }

    const getAllData = () => {
        db.collection("lotto").where("drawDate", "==", drawDateFs())
            .get()
            .then((querySnapshot) => {
                let doc_id = []
                let doc_dataUp = []
                let doc_data = []
                let lotto = []
                let shData = []
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    // console.log(doc.id, " => ", doc.data());
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

                    if (doc.data().typeLotto === 0) {
                        doc_dataUp.push(doc.data())
                    }
                    else {
                        doc_data.push(doc.data())
                    }
                    doc_id.push(doc.id)

                });
                let lottoTop = []
                let lottoDown = []

                let lottoset = sortReversedData(lotto.sort())
                // console.log("lot", lottoset)
                lottoset.map((eleLotto) => {
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

                })

                setdocId(doc_id)
                setdocData2Up(doc_dataUp)
                setdocData2(doc_data)
                addSumData(lottoTop, lottoDown)
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
        // db.collection("lotto3").where("drawDate", "==", drawDateFs())
        //     .get()
        //     .then((querySnapshot) => {
        //         let doc_id = []
        //         let doc_data = []
        //         querySnapshot.forEach((doc) => {
        //             // doc.data() is never undefined for query doc snapshots
        //             // console.log(doc.id, " => ", doc.data());
        //             doc_id.push(doc.id)
        //             doc_data.push(doc.data())
        //         });
        //         setdocId3(doc_id)
        //         setdocData3(doc_data)
        //     })
        //     .catch((error) => {
        //         console.log("Error getting documents: ", error);
        //     });
    }
    const getSumResult = () => {
        db.collection("sumresults")
            .doc(drawDate())
            .get().then((doc) => {
                console.log(doc.exists)
                if (doc.exists) {
                    console.log("Document data:", doc.data());
                    setsumPrice(doc.data())
                    setLoading(false)
                    // doc.forEach((doc) => {
                    //     // doc.data() is never undefined for query doc snapshots
                    //     console.log(doc.id, " => ", doc.data());
                    // });
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                    getAllData()
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
    }

    useEffect(() => {
        const dd = moment().format("DD") * 1
        if (dd == 1 || dd == 16) {
            if (moment().format("HH") > 15) {
                getSumResult()
                getResults()
            }
            else {
                Swal.fire({
                    title: 'กรุณาเข้าดูหลัง 15:00',
                    text: "เพื่อป้องกันการอ่านข้อมูลเกินขีดจำกัด",
                    icon: 'warning',
                    confirmButtonColor: '#3085d6',
                }).then((result) => {
                    history.push("/")
                })
            }
        }
        else {
            getSumResult()
            getResults()
        }
    }, [])
    return (
        loading ? <div className="loading">
            <h2>F Lotto Loading...</h2>
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
        </div> :
            <div className="container-fluid">
                <BrowserRouter basename="/report">
                    <div className="p-3 sidenav">
                        <h5>สรุปข้อมูลงวดวันที่ {drawDateShow()}</h5>
                        <hr />
                        <div className="nav flex-column nav-pills">
                            <NavLink exact to="/" className="nav-link" activeClassName="active">
                                หน้าแรก
                            </NavLink>
                            <NavLink to="/Lotto3" className="nav-link" activeClassName="active">
                                3ตัวบน
                            </NavLink>
                            <NavLink to="/Lotto2Up" className="nav-link" activeClassName="active">
                                2ตัวบน
                            </NavLink>
                            <NavLink to="/Lotto2down" className="nav-link" activeClassName="active">
                                2ตัวล่าง
                            </NavLink>
                            <NavLink to="/LottoAll" className="nav-link" activeClassName="active">
                                สรุปรวม
                            </NavLink>
                        </div>
                    </div>
                    <div className="page-sh p-3">
                        {/* <ReportLotto3 result={resultLotto.result3} /> */}
                        <Route exact path="/">
                            <ReportHome sumprice={sumPrice} />
                        </Route>
                        <Route path="/Lotto3">
                            <ReportLotto3 result={resultLotto.result3} dateDraw={drawDateFs()} />
                        </Route>
                        <Route path="/Lotto2Up">
                            <ReportLotto2Up result={resultLotto.result2up } dateDraw={drawDateFs()} docData2Up={docData2Up} />
                        </Route>
                        <Route path="/Lotto2down">
                            <ReportLotto2down result={resultLotto.result2down} dateDraw={drawDateFs()} docData2={docData2} />
                        </Route>
                        <Route path="/LottoAll">
                            <ReportLottoAll
                                dateDraw={drawDateFs()}
                                docId={docId}
                                docId3={docId3}
                                docData2Up={docData2Up}
                                docData2={docData2}
                                docData3={docData3} />
                        </Route>
                    </div>
                </BrowserRouter>
            </div>

    )
}
export default Report