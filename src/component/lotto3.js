import React, { useState, useRef } from "react";
import Swal from 'sweetalert2'
import firebase, { db } from '../firebase'
import moment from 'moment';
import { swapLotto3 } from "../const/constance";

const Lotto3 = (props) => {
    const messageEl = useRef(null);
    const [timeshow, setTime] = useState('')
    const [numLotto, setNumLoto] = useState('')
    const [numLottoReverse, setNumLotoReverse] = useState([])
    const [priceLotto1, setPriceLoto1] = useState('')
    const [priceLotto2, setPriceLoto2] = useState('')
    const [checkedSwap, setCheckedSwap] = useState(false)
    const inputNumLottoUp = useRef(null)
    const inputPriceUp1 = useRef(null)
    const inputPriceUp2 = useRef(null)
    const buttonSendUp = useRef(null)
    const [inputItem, setInputItem] = useState([])
    const [inputItemSend, setInputItemSend] = useState([])

    const nextInput = nextIn => nextIn.current.focus()


    const send_click_2 = () => {
        const batch = db.batch()
        let item = inputItemSend
        console.log("lotto3", item)
        item.map((element, index) => {
            let data = {
                name: element.name,
                numLotto: element.numLotto,
                priceLotto1: element.priceLotto1,
                priceLotto2: element.priceLotto2,
                date: element.date,
                time: element.time,
                drawDate: element.drawDate
            }
            // console.log("data", moment().format("YYYYMMDDTHHmmssSSSSSS"))
            const docRef = db.collection("lotto3").doc(); //automatically generate unique id
            batch.set(docRef, data)
        })
        batch.commit().then(() => {
            console.log("Document successfully written!");
            setInputItem([])
            setInputItemSend([])
        })
    }

    const setItem = async () => {
        if (numLotto.length < 3) {
            alert("กรุณากรอกข้อมูลให้ครบ")
        }
        else {
            let item = inputItem
            let dateNow = moment().format("DD/MM/YYYY")
            let timeNow = moment().format("HH:mm")
            item.push({
                name: props.name,
                numLotto: numLotto,
                priceLotto1: priceLotto1,
                priceLotto2: priceLotto2,
                date: dateNow,
                time: timeNow,
                drawDate: props.drawDate
            })
            setNumLoto('')
            setPriceLoto1('')
            setPriceLoto2('')
            console.log(item)
            setInputItem(item)

            if (messageEl) {
                console.log(messageEl)
                messageEl.current.addEventListener('DOMNodeInserted', event => {
                    const { currentTarget: target } = event;
                    target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
                });
            }
            let itemSend = inputItemSend
            if (checkedSwap === true) {
                swapLotto3(numLotto).map((lotto) => {
                    itemSend.push({
                        name: props.name,
                        numLotto: lotto,
                        priceLotto1: priceLotto1,
                        priceLotto2: 0,
                        date: dateNow,
                        time: timeNow,
                        drawDate: props.drawDate
                    })
                    console.log("data", itemSend)
                })
            }
            else {
                if (priceLotto2 > 0 || priceLotto2 !== "") {
                    itemSend.push({
                        name: props.name,
                        numLotto: numLotto,
                        priceLotto1: priceLotto1,
                        priceLotto2: priceLotto2,
                        date: dateNow,
                        time: timeNow,
                        drawDate: props.drawDate
                    })
                } else {
                    itemSend.push({
                        name: props.name,
                        numLotto: numLotto,
                        priceLotto1: priceLotto1,
                        priceLotto2: 0,
                        date: dateNow,
                        time: timeNow,
                        drawDate: props.drawDate
                    })
                }
                console.log("data", itemSend)
            }
            setInputItemSend(itemSend)
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
                                onClick={() => setItem() && nextInput(inputNumLottoUp)}
                            >เพิ่ม</button>
                        </div>
                    </div>

                </div>

            </div>
            {checkedSwap ? <div>{swapLotto3(numLotto).join(' __ ')}</div> : <div></div>}
            <div className="form-check">
                <input className="form-check-input" type="checkbox" defaultValue id="defaultCheck1" onChange={e => setCheckedSwap(e.target.checked)} />
                <label className="form-check-label" htmlFor="defaultCheck1">
                    3 หรือ 6 กลับ
                </label>
            </div>

            <div className="card mb-3" >
                <div className="card-header">ตรวจสอบรายการ
                    <button className="float-right btn btn-outline-success btn-sm" onClick={() => send_click_2()}>
                        บันทึก
                    </button>
                </div>
                <div className="card-body " style={{ maxHeight: '40vh', overflow: 'auto' }} ref={messageEl}>
                    {inputItem.length === 0 ? <div>ไม่มีรายการ...</div> :
                        inputItem.map((item, index) => {
                            return (
                                <div className="row py-1 border-bottom" key={index} >
                                    <div className="col" >{item.numLotto}</div>
                                    <div className="col" >{item.priceLotto1}*{item.priceLotto2}</div>
                                    <div className="col" >{item.name}</div>
                                    <div className="col" >
                                        <button className="btn btn-outline-danger btn-sm float-right"
                                            onClick={() => setInputItem(inputItem => inputItem.filter((item, i) => i !== index))}>
                                            ลบ
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                </div>
            </div>

        </div>
    )
}
export default Lotto3