import React, { useState, useEffect } from "react"
import moment from "moment"
import '../App.css'
import ReportLotto3 from "./reportlotto3"
import { db } from "../firebase"
import { get } from "../const/servive"

const Report = () => {
    const [drawdate, setDrawdate] = useState('')
    const [loading, setLoading] = useState(true)
    const [resultLotto, setresultLotto] = useState([])

    const drawDate = () => {
        if ((moment().format("DD") * 1) > 16) {
            return "16/" + moment().add(543, "years").format("MM/YYYY")
        }
        else {
            return "01/" + moment().add(543, "years").format("MM/YYYY")
        }
    }

    const checkLotto = async (date) => {
        console.log("date", date)
        await get(date).then((result) => {
            setLoading(true)
            if (result.code == 200) {
                console.log(result)
                // setDrawdate(result.drawdate)
                // setresultLotto(result.result)
                // setLoading(false)
                db.collection("results").add({
                    drawdate: drawDate(),
                    // result: result.result,
                    result: {
                        name: result.result[3].name,
                        number: result.result[3].number
                    }
                })
                    .then((docRef) => {
                        console.log("Document written with ID: ", docRef.id);
                    })
                    .catch((error) => {
                        console.error("Error adding document: ", error);
                    });
            }
            else {
                console.error(result)
            }
        })
    }

    useEffect(() => {
        db.collection("results")
            .where("drawdate", "==", drawDate())
            .get().then((doc) => {
                console.log(doc.size)
                if (doc.size > 0) {
                    console.log("Document data:", doc);
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                    checkLotto(moment().add(543, 'years').format("DDMMyyyy"))
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
    }, [])
    return (
        <div className="container-fluid">
            <div className="sidenav  p-3">
                <h5>สรุปข้อมูลงวดวันที่ {drawDate()}</h5>
                <hr />
                <div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                    <a className="nav-link active"
                        id="v-pills-home-tab"
                        data-toggle="pill"
                        href="#v-pills-home"
                        role="tab"
                        aria-controls="v-pills-home"
                        aria-selected="true">
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
                        <ReportLotto3 />
                    </div>
                    <div className="tab-pane fade" id="v-pills-profile" role="tabpanel" aria-labelledby="v-pills-profile-tab">...</div>
                    <div className="tab-pane fade" id="v-pills-messages" role="tabpanel" aria-labelledby="v-pills-messages-tab">...</div>
                    <div className="tab-pane fade" id="v-pills-settings" role="tabpanel" aria-labelledby="v-pills-settings-tab">...</div>
                </div>
            </div>
        </div>

    )
}
export default Report