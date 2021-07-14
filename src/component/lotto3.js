import React, { useState, useRef } from "react";
import Swal from 'sweetalert2'
import firebase, { db } from '../firebase'
import moment from 'moment';

const Lotto3 = (props) => {
    const [timeshow, setTime] = useState('')
    const [numLotto, setNumLoto] = useState('')
    const [numLottoReverse, setNumLotoReverse] = useState('')
    const [priceLotto1, setPriceLoto1] = useState('')
    const [priceLotto2, setPriceLoto2] = useState('')
    const inputNumLottoUp = useRef(null)
    const inputPriceUp1 = useRef(null)
    const inputPriceUp2 = useRef(null)
    const buttonSendUp = useRef(null)
    const inputNumLotto = useRef(null)
    const inputPrice1 = useRef(null)
    const inputPrice2 = useRef(null)
    const buttonSend = useRef(null)

    const nextInput = nextIn => nextIn.current.focus()

    const send_click = async () => {

        setTime(moment().format("YYYY-MM-DDTHH:mm:ss.SSS"))
        console.log(moment().format("YYYY-MM-DDTHH:mm:ss.SSS"))
        let dateNow = moment().format("DD/MM/YYYY")
        let timeNow = moment().format("HH:mm")
        // console.log(typeLotto)
        if (numLotto !== "" && priceLotto1 > 0) {
            if (priceLotto2 > 0) {
                await db.collection("lotto3").doc(moment().format("YYYYMMDDHHmmssSSS")).set({
                    name: props.name,
                    numLotto: numLotto,
                    priceLotto1: priceLotto1,
                    priceLotto2: priceLotto2,
                    date: dateNow,
                    time: timeNow,
                    drawDate: props.drawDate

                })
                    .then(() => {
                        console.log("Document successfully written!");
                        setNumLoto('')
                        setPriceLoto1('')
                        setPriceLoto2('')
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                        console.log("Error code: ", error.code);
                        if (error.code == "permission-denied") {
                            Swal.fire(
                                'แหนะ!',
                                'บอกแล้วใช่ไหม ดูได้อย่างเดียว',
                                'error'
                            )
                        }
                        else {
                            Swal.fire(
                                'เกิดข้อผิดพลาด!',
                                'บันทึกข้อมูลไม่สำเร็จ',
                                'error'
                            )
                        }
                    });

            }
            else {
                db.collection("lotto3").doc(moment().format("YYYYMMDDHHmmssSSS")).set({
                    name: props.name,
                    numLotto: numLotto,
                    priceLotto1: priceLotto1,
                    priceLotto2: 0,
                    date: dateNow,
                    time: timeNow,
                    drawDate: props.drawDate
                })
                    .then(() => {
                        console.log("Document successfully written!");
                        setNumLoto('')
                        setPriceLoto1('')
                        setPriceLoto2('')
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                        console.log("Error code: ", error.code);
                        if (error.code == "permission-denied") {
                            Swal.fire(
                                'แหนะ!',
                                'บอกแล้วใช่ไหม ดูได้อย่างเดียว',
                                'error'
                            )
                        }
                        else {
                            Swal.fire(
                                'เกิดข้อผิดพลาด!',
                                'บันทึกข้อมูลไม่สำเร็จ',
                                'error'
                            )
                        }
                    });
            }
        }
        else {
            alert("กรุณากรอกข้อมูลให้ถูกต้อง")
        }

    }

    return (
        <div>
            <div className="form-row">
                <div className="form-group col-4">
                    <label htmlFor="numlotto1">ตัวเลข</label>
                    <input
                        type="text"
                        ref={inputNumLottoUp}
                        maxLength="3"
                        // id="numlotto1"
                        className="form-control form-control-sm"
                        onKeyDown={e => e.key === 'Enter' && nextInput(inputPriceUp1)}
                        onChange={(e) => setNumLoto((e.target.value))}
                        value={numLotto}
                    ></input>
                </div>
                <div className="form-group col-7">
                    <label htmlFor="pricelotto1">ราคา</label>
                    <div className="row">
                        <div className="col-5">
                            <input type="number"
                                ref={inputPriceUp1}
                                className="form-control form-control-sm"
                                onChange={(e) => setPriceLoto1((e.target.value) * 1)}
                                onKeyDown={e => e.key === 'Enter' && nextInput(inputPriceUp2)}
                                value={priceLotto1}
                            ></input>
                        </div>
                        x
                        <div className="col-5">
                            <input type="number"
                                ref={inputPriceUp2}
                                className="form-control form-control-sm"
                                onChange={(e) => setPriceLoto2((e.target.value) * 1)}
                                onKeyDown={e => e.key === 'Enter' && nextInput(buttonSendUp)}
                                value={priceLotto2}
                            ></input>
                        </div>
                        <div className="col-1">
                            <button className="btn btn-outline-success btn-sm"
                                ref={buttonSendUp}
                                onClick={() => send_click() && nextInput(inputNumLottoUp)}
                            >บันทึก</button>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    )
}
export default Lotto3