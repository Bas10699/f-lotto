import React, { useState, useEffect } from "react"
import moment from "moment"
import '../App.css'
import ReportLotto3 from "./reportlotto3"
import { db } from "../firebase"
import { get } from "../const/servive"
import ReportLotto2Up from "./reportlotto2up"
import ReportLotto2down from "./reportlotto2down"
import ReportLottoAll from "./reportlottoall"
import { useHistory } from "react-router"

const Report = () => {
    let history = useHistory();
    const [drawdate, setDrawdate] = useState('')
    const [loading, setLoading] = useState(true)
    const [resultLotto, setresultLotto] = useState([])
    const [i, seti] = useState(0)

    const [docId, setdocId] = useState([])
    const [docId3, setdocId3] = useState([])
    const [docData2Up, setdocData2Up] = useState([])
    const [docData2, setdocData2] = useState([])
    const [docData3, setdocData3] = useState([])

    const drawDate = () => {
        if ((moment().format("DD") * 1) > 16) {
            return "16" + moment().add(543, "years").format("MMYYYY")
        }
        else {
            return "01" + moment().add(543, "years").format("MMYYYY")
        }
    }
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
                console.log(result)
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

    const getAllData = () => {
        db.collection("lotto").where("drawDate", "==", drawDateFs())
            .get()
            .then((querySnapshot) => {
                let doc_id = []
                let doc_dataUp = []
                let doc_data = []
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    // console.log(doc.id, " => ", doc.data());
                    if (doc.data().typeLotto === 0) {
                        doc_dataUp.push(doc.data())
                    }
                    else {
                        doc_data.push(doc.data())
                    }
                    doc_id.push(doc.id)

                });
                setdocId(doc_id)
                setdocData2Up(doc_dataUp)
                setdocData2(doc_data)
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
        db.collection("lotto3").where("drawDate", "==", drawDateFs())
            .get()
            .then((querySnapshot) => {
                let doc_id = []
                let doc_data = []
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    // console.log(doc.id, " => ", doc.data());
                    doc_id.push(doc.id)
                    doc_data.push(doc.data())
                });
                setdocId3(doc_id)
                setdocData3(doc_data)
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
    }

    useEffect(() => {
        if (moment().format("HH") > 16) {
            getAllData()
            getResults()
        }
        else {
            Swal.fire({
                title: 'กรุณาเข้าดูหลัง 15:00 น.',
                text: "เพื่อป้องกันการอ่านข้อมูลเกินขีดจำกัด",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
            }).then((result) => {
                history.push("/")
            })
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
                <div className="p-3 sidenav">
                    <h5>สรุปข้อมูลงวดวันที่ {drawDateShow()}</h5>
                    <hr />
                    <div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                        <a className="nav-link active"
                            id="v-pills-home-tab"
                            data-toggle="pill"
                            href="#v-pills-home"
                            role="tab"
                            aria-controls="v-pills-home"
                            aria-selected="true">
                            หน้าแรก
                        </a>
                        <a className="nav-link"
                            id="v-pills-lotto3-tab"
                            data-toggle="pill"
                            href="#v-pills-lotto3"
                            role="tab"
                            aria-controls="v-pills-lotto3"
                            aria-selected="false">
                            3ตัว บน
                        </a>
                        <a className="nav-link"
                            id="v-pills-profile-tab"
                            data-toggle="pill"
                            href="#v-pills-profile"
                            role="tab"
                            aria-controls="v-pills-profile"
                            aria-selected="false">
                            2ตัว บน
                        </a>
                        <a className="nav-link"
                            id="v-pills-messages-tab"
                            data-toggle="pill"
                            href="#v-pills-messages"
                            role="tab"
                            aria-controls="v-pills-messages"
                            aria-selected="false">
                            2ตัว ล่าง
                        </a>
                        <a className="nav-link"
                            id="v-pills-settings-tab"
                            data-toggle="pill"
                            href="#v-pills-settings"
                            role="tab"
                            aria-controls="v-pills-settings"
                            aria-selected="false">สรุปรวม</a>
                    </div>
                </div>
                <div className="page-sh p-3">
                    <div className="tab-content" id="v-pills-tabContent">
                        <div className="tab-pane fade show active"
                            id="v-pills-home"
                            role="tabpanel"
                            aria-labelledby="v-pills-home-tab">
                            หน้าแรก
                            {/* <ReportLotto3 result={resultLotto.result3} /> */}
                        </div>
                        <div className="tab-pane fade"
                            id="v-pills-lotto3"
                            role="tabpanel"
                            aria-labelledby="v-pills-lotto3-tab"
                        >
                            <ReportLotto3 result={resultLotto.result3} />
                        </div>
                        <div className="tab-pane fade"
                            id="v-pills-profile"
                            role="tabpanel"
                            aria-labelledby="v-pills-profile-tab">
                            <ReportLotto2Up result={resultLotto.result2up} docData2Up={docData2Up} />
                        </div>
                        <div className="tab-pane fade"
                            id="v-pills-messages"
                            role="tabpanel"
                            aria-labelledby="v-pills-messages-tab">
                            <ReportLotto2down result={resultLotto.result2down} dateDraw={drawDateFs()} docData2={docData2} />
                        </div>
                        <div className="tab-pane fade"
                            id="v-pills-settings"
                            role="tabpanel"
                            aria-labelledby="v-pills-settings-tab">
                            <ReportLottoAll
                                dateDraw={drawDateFs()}
                                docId={docId}
                                docId3={docId3}
                                docData2Up={docData2Up}
                                docData2={docData2}
                                docData3={docData3} />
                        </div>
                    </div>
                </div>
            </div>

    )
}
export default Report