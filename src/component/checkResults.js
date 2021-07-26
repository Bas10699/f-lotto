import React, { useEffect, useState, useRef } from "react";
import { get, post } from "../const/servive";
import moment from "moment";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";

const CheckResults = () => {
    let history = useHistory();
    const [drawdate, setDrawdate] = useState('')
    const [loading, setLoading] = useState(true)
    const [resultLotto, setresultLotto] = useState([])
    const lottoinput = useRef(null)
    const buttonSendUp = useRef(null)

    const nextInput = nextIn => nextIn.current.focus()

    const drawDate = () => {
        if ((moment().format("DD") * 1) > 16) {
            return "16" + moment().add(543, "years").format("MMYYYY")
        }
        else {
            return "01" + moment().add(543, "years").format("MMYYYY")
        }
        // return "16/06/2021"
    }

    const checkLotto = async (date) => {
        console.log("date", date)
        await get(date).then((result) => {
            setLoading(true)
            if (result.code == 200) {
                console.log(result)
                setDrawdate(result.drawdate)
                setresultLotto(result.result)
                setLoading(false)
            }
            else {
                console.error(result)
                history.push("/");
            }
        })
    }
    const verifyLotto = async () => {
        let timerInterval
        Swal.fire({
            title: 'กำลังตรวจสอบ',
            html: 'will be completed in <b></b> milliseconds.',
            timer: 2500,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading()
                timerInterval = setInterval(() => {
                    const content = Swal.getHtmlContainer()
                    if (content) {
                        const b = content.querySelector('b')
                        if (b) {
                            b.textContent = Swal.getTimerLeft()
                        }
                    }
                }, 100)
            },
            willClose: () => {
                clearInterval(timerInterval)
            }
        }).then((result) => {
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
                console.log('I was closed by the timer')
            }
        })
        let item = {
            date: drawDate(),
            lotto: lottoinput.current.value
        }

        await post(item, "verify").then((result) => {
            if (result.code == 200) {
                console.log(result)
                if (!result.winner) {
                    Swal.fire({
                        icon: 'error',
                        title: 'เสียใจด้วย',
                        text: 'คุณไม่ถูกรางวัล งวดหน้าเอาใหม่นะ!',
                        confirmButtonText: 'OK',
                        confirmButtonColor: 'rgb(221, 107, 85)',
                        backdrop: `
                          rgba(0,0,0,0.4)
                          url(https://media.giphy.com/media/fxZeSkds6bcWGlgevx/giphy-downsized.gif)
                          left top
                        `
                    })
                }
                else {
                    Swal.fire({
                        icon: 'success',
                        title: 'ยินดีด้วย',
                        text: result.result.map((element) => element.name),
                        confirmButtonText: 'OK',
                        backdrop: `
                          rgba(0,0,0,0.4)
                          url(https://media.giphy.com/media/3NtY188QaxDdC/giphy-downsized.gif)
                          left top
                          no-repeat
                        `
                    })
                }
            }
            else {
                console.error(result)
            }
        })
    }
    useEffect(async () => {
        checkLotto(moment().add(543, 'years').format("DDMMyyyy"))
    }, [])
    return (
        loading ?
            // <div className="container pt-5 text-center">
            //     <div className="spinner-grow text-dark" role="status">
            //         <span className="sr-only">Loading...</span>
            //     </div>
            //     <div className="spinner-grow text-light" role="status">
            //         <span className="sr-only">Loading...</span>
            //     </div>
            //     <div className="spinner-grow text-info" role="status">
            //         <span className="sr-only">Loading...</span>
            //     </div>
            //     <div className="spinner-grow text-warning" role="status">
            //         <span className="sr-only">Loading...</span>
            //     </div>
            //     <div className="spinner-grow text-danger" role="status">
            //         <span className="sr-only">Loading...</span>
            //     </div>
            //     <div className="spinner-grow text-success" role="status">
            //         <span className="sr-only">Loading...</span>
            //     </div>
            //     <div className="spinner-grow text-secondary" role="status">
            //         <span className="sr-only">Loading...</span>
            //     </div>
            //     <div className="spinner-grow text-primary" role="status">
            //         <span className="sr-only">Loading...</span>
            //     </div>
            //     <div className="spinner-grow text-secondary" role="status">
            //         <span className="sr-only">Loading...</span>
            //     </div>
            //     <div className="spinner-grow text-success" role="status">
            //         <span className="sr-only">Loading...</span>
            //     </div>
            //     <div className="spinner-grow text-danger" role="status">
            //         <span className="sr-only">Loading...</span>
            //     </div>
            //     <div className="spinner-grow text-warning" role="status">
            //         <span className="sr-only">Loading...</span>
            //     </div>
            //     <div className="spinner-grow text-info" role="status">
            //         <span className="sr-only">Loading...</span>
            //     </div>
            //     <div className="spinner-grow text-light" role="status">
            //         <span className="sr-only">Loading...</span>
            //     </div>
            //     <div className="spinner-grow text-dark" role="status">
            //         <span className="sr-only">Loading...</span>
            //     </div>
            //     <div>
            //         Loading...
            //     </div>

            // </div>
            <div>
                <div align="center" className="fond">
                    <div className="contener_general">
                        <div className="contener_mixte"><div className="ballcolor ball_1">&nbsp;</div></div>
                        <div className="contener_mixte"><div className="ballcolor ball_2">&nbsp;</div></div>
                        <div className="contener_mixte"><div className="ballcolor ball_3">&nbsp;</div></div>
                        <div className="contener_mixte"><div className="ballcolor ball_4">&nbsp;</div></div>
                    </div>
                    <div style={{ paddingTop: 35 }}>
                        <div style={{ color: '#999999', fontWeight: 300, fontSize: 30, fontFamily: '"Roboto"', paddingTop: 20 }}>PURE CSS <font style={{ fontWeight: 400 }}>LOADER</font></div>
                        <div style={{ color: '#999999', fontWeight: 300, fontSize: 20, fontFamily: '"Roboto"' }}>กำลังโหลด...</div>
                    </div></div></div>
            :
            <div className="container">
                <h3 className="pt-3">ผลสลากกินแบ่งรัฐบาล</h3>
                <div className="row">
                    <div className="col-md-8">
                        <p>งวดประจำวันที่ {drawdate}</p>
                    </div>
                    <div className="col-md-4">
                        <div className="input-group mb-3">
                            <input type="text"
                                className="form-control"
                                placeholder="กรอกเลขสลาก"
                                aria-label="กรอกเลขสลาก"
                                aria-describedby="button-addon2"
                                ref={lottoinput}
                                onKeyDown={e => e.key === 'Enter' && nextInput(buttonSendUp)}
                            />
                            <div className="input-group-append">
                                <button className="btn btn-outline-secondary"
                                    type="button"
                                    id="button-addon2"
                                    onClick={() => verifyLotto()}
                                    ref={buttonSendUp}
                                >ตรวจหวย</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row  justify-content-sm-center">
                    <div className="col">
                        <div className="card border-secondary " >
                            <div className="card-header border-secondary ">
                                {resultLotto[0].name}
                            </div>
                            <div className="card-body">
                                <h1 className="font-weight-bolder display-3 text-center">{resultLotto[0].number}</h1>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="row">
                    <div className="col-md-4 pt-3">
                        <div className="card border-secondary" >
                            <div className="card-header border-secondary ">
                                {resultLotto[1].name}
                            </div>
                            <div className="card-body">
                                <h1 className="font-weight-bolder display-4 text-center">{resultLotto[1].number.join(' ')}</h1>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 pt-3">
                        <div className="card border-secondary" >
                            <div className="card-header border-secondary ">
                                {resultLotto[2].name}
                            </div>
                            <div className="card-body">
                                <h1 className="font-weight-bolder display-4 text-center">{resultLotto[2].number.join(' ')}</h1>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 pt-3">
                        <div className="card border-secondary" >
                            <div className="card-header border-secondary ">
                                {resultLotto[3].name}
                            </div>
                            <div className="card-body">
                                <h1 className="font-weight-bolder display-4 text-center">{resultLotto[3].number}</h1>
                            </div>
                        </div>

                    </div>
                </div>

            </div>

    )
}
export default CheckResults