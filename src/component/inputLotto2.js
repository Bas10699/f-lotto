import React, { useState, useEffect, useRef } from 'react'
import moment from 'moment'
import firebase, { db } from '../firebase'
import Swal from 'sweetalert2'
import Lotto3 from './lotto3'
import PriceShowAll from './priceShowAll'
import '../App.css'

const InputLotto2 = () => {
    const messageEl = useRef(null);
    const [timeshow, setTime] = useState('')
    const [numLotto, setNumLoto] = useState('')
    const [numLottoReverse, setNumLotoReverse] = useState('')
    const [priceLotto1, setPriceLoto1] = useState('')
    const [priceLotto2, setPriceLoto2] = useState('')
    const [name, setName] = useState('')
    const [show, setShow] = useState(0)
    const [inputItem, setInputItem] = useState([])
    const [inputItemSend, setInputItemSend] = useState([])
    const [loading, setloading] = useState(false)
    const inputNumLottoUp = useRef(null)
    const inputPriceUp1 = useRef(null)
    const inputPriceUp2 = useRef(null)
    const buttonSendUp = useRef(null)
    const inputNumLotto = useRef(null)
    const inputPrice1 = useRef(null)
    const inputPrice2 = useRef(null)
    const buttonSend = useRef(null)

    const reversedNum = num => num.toString().split('').reverse().join('')

    const nextInput = nextIn => nextIn.current.focus()

    const drawDate = () => {
        if ((moment().format("DD") * 1) <= 10) {
            return "01/" + moment().format("MM/YYYY")
        }
        else if ((moment().format("DD") * 1 > 6) && (moment().format("DD") * 1 < 22)) {
            return "16/" + moment().format("MM/YYYY")
        }
        else {
            return "01/" + moment().add(1, 'months').format("MM/YYYY")
        }
        // return "01/09/2021"
    }
    const send_click = async (typeLotto) => {

        setTime(moment().format("YYYY-MM-DDTHH:mm:ss.SSS"))
        console.log(moment().format("YYYY-MM-DDTHH:mm:ss.SSS"))
        let dateNow = moment().format("DD/MM/YYYY")
        let timeNow = moment().format("HH:mm")
        // console.log(typeLotto)
        if (numLotto !== "" && priceLotto1 > 0) {
            if (priceLotto2 > 0) {
                let numLottoRev = reversedNum(numLotto)

                await db.collection("lotto").doc(moment().format("YYYYMMDDTHHmmssSSS")).set({
                    name: name,
                    numLotto: numLotto,
                    priceLotto: priceLotto1,
                    date: dateNow,
                    time: timeNow,
                    typeLotto: typeLotto,
                    drawDate: drawDate()

                })
                    .then(() => {
                        console.log("Document successfully written!");
                        db.collection("lotto").doc(moment().format("YYYYMMDDTHHmmssSSS")).set({
                            name: name,
                            numLotto: numLottoRev,
                            priceLotto: priceLotto2,
                            date: dateNow,
                            time: timeNow,
                            typeLotto: typeLotto,
                            drawDate: drawDate()
                        })
                            .then(() => {
                                console.log("Document successfully written!");
                                setNumLoto('')
                                setPriceLoto1('')
                                setPriceLoto2('')
                            })
                            .catch((error) => {
                                console.error("Error writing document: ", error);
                                Swal.fire(
                                    'เกิดข้อผิดพลาด!',
                                    'บันทึกข้อมูลไม่สำเร็จ',
                                    'error'
                                )
                            });
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
                db.collection("lotto").doc(moment().format("YYYYMMDDTHHmmssSSS")).set({
                    name: name,
                    numLotto: numLotto,
                    priceLotto: priceLotto1,
                    date: dateNow,
                    time: timeNow,
                    typeLotto: typeLotto,
                    drawDate: drawDate()
                })
                    .then(() => {
                        console.log("Document successfully written!");
                        setNumLoto('')
                        setPriceLoto1('')
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

    const send_click_2 = async () => {
        Swal.fire({
            title: 'กำลังบันทึก',
            text: 'รอแป๊ปนึงนะ...',
            didOpen: () =>  Swal.showLoading(),
            
        })
        const batch = db.batch()
        let item = inputItemSend
        console.log("lotto", item)
        item.map((element, index) => {
            let data = {
                name: element.name,
                numLotto: element.numLotto,
                priceLotto: element.priceLotto,
                date: element.date,
                time: element.time,
                typeLotto: element.typeLotto,
                drawDate: element.drawDate
            }
            console.log("data", moment().format("YYYYMMDDTHHmmssSSSSSS"))
            const docRef = db.collection("lotto").doc(); //automatically generate unique id
            batch.set(docRef, data)
        })
        batch.commit().then(() => {
            console.log("Document successfully written!");
            setInputItem([])
            setInputItemSend([])
            Swal.close()
        })


    }
    const setItem = async (typeLotto) => {
        if (numLotto.length < 2) {
            alert("กรุณากรอกข้อมูลให้ครบ")
        }
        else {
            let item = inputItem
            let dateNow = moment().format("DD/MM/YYYY")
            let timeNow = moment().format("HH:mm")
            let numLottoRev = reversedNum(numLotto)
            item.push({
                name: name,
                numLotto: numLotto,
                priceLotto1: priceLotto1,
                priceLotto2: priceLotto2,
                date: dateNow,
                time: timeNow,
                typeLotto: typeLotto,
                drawDate: drawDate()
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

            let item_send = inputItemSend
            item_send.push({
                name: name,
                numLotto: numLotto,
                priceLotto: priceLotto1,
                date: dateNow,
                time: timeNow,
                typeLotto: typeLotto,
                drawDate: drawDate()
            })
            if (priceLotto2 > 0 || priceLotto2 !== "") {
                item_send.push({
                    name: name,
                    numLotto: numLottoRev,
                    priceLotto: priceLotto2,
                    date: dateNow,
                    time: timeNow,
                    typeLotto: typeLotto,
                    drawDate: drawDate()
                })
            }
            console.log("check", item_send)
            setInputItemSend(item_send)
        }
    }

    // const removeItem = (index) => {
    //     let item = inputItem
    //     item.splice(index, 1);
    //     let itemOut = item
    //     console.log(item)
    //     setInputItem(itemOut)
    // }

    // useEffect(() => {
    //     if (messageEl) {
    //         messageEl.current.addEventListener('DOMNodeInserted', event => {
    //             const { currentTarget: target } = event;
    //             target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
    //         });
    //     }
    // }, [])

    const listLotto = () => {
        return (
            <div className="card mb-3" >
                <div className="card-header">ตรวจสอบรายการ
                    <button className="float-right btn btn-outline-success btn-sm" onClick={() => send_click_2()}>
                        บันทึก
                    </button>
                </div>
                <div className="card-body " style={{ maxHeight: '40vh', overflow: 'auto' }} ref={messageEl}>
                    {/* <ul className="list-group list-group-flush "> */}
                    {inputItem.length === 0 ? <div>ไม่มีรายการ...</div> :
                        inputItem.map((item, index) => {
                            return (
                                <div className="row py-1 border-bottom" key={index} >
                                    {/* <div className="col" >{index + 1}</div> */}
                                    {/* <div className="col" >{item.time}</div> */}
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
                    {/* </ul> */}
                </div>
                {/* <div className="card-footer bg-transparent">
                                <button className="float-right btn btn-outline-success btn-sm" onClick={() => alert("ใจเย็นนะยังไม่เสร็จ")}>
                                    บันทึก
                                </button>
                            </div> */}
            </div>
        )
    }

    return (
        <div className="container">
            <h3 className="pt-3">ระบบการจัดการตัวเลขของเอฟโอเวอร์</h3>

            <div className="bg-sacendary">งวดวันที่ {drawDate()}</div>
            <div className="row pt-3">
                <div className="col-lg-6">
                    <div className="row">
                        <div className="col-6">
                            <h4>บันทึกข้อมูล</h4>
                        </div>
                        <div className="col-6">
                            <input type="text"
                                className="form-control form-control-sm"
                                placeholder="ชื่อ"
                                onChange={(e) => setName((e.target.value))}>
                            </input>
                        </div>
                    </div>

                    <div>
                        <nav>
                            <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                <a className="nav-link active"
                                    id="nav-home-tab"
                                    data-toggle="tab"
                                    href="#nav-home"
                                    onClick={() => setShow(0)}
                                    role="tab"
                                    aria-controls="nav-home"
                                    aria-selected="true">
                                    2ตัวบน
                                </a>
                                <a className="nav-link"
                                    id="nav-profile-tab"
                                    data-toggle="tab"
                                    href="#nav-profile"
                                    onClick={() => setShow(1)}
                                    role="tab"
                                    aria-controls="nav-profile"
                                    aria-selected="false">
                                    2ตัวล่าง
                                </a>
                                <a className="nav-link"
                                    id="nav-profile-tab"
                                    data-toggle="tab"
                                    href="#nav-lotto"
                                    onClick={() => setShow(3)}
                                    role="tab"
                                    aria-controls="nav-lotto"
                                    aria-selected="false">
                                    3ตัวบน
                                </a>
                            </div>
                        </nav>
                        <div className="tab-content" id="nav-tabContent">
                            <div className="tab-pane fade show active"
                                id="nav-home"
                                role="tabpanel"
                                aria-labelledby="nav-home-tab">

                                <div className="form-row">
                                    <div className="form-group col-4">
                                        <label htmlFor="numlotto1">ตัวเลข</label>
                                        <input
                                            type="text"
                                            ref={inputNumLottoUp}
                                            maxLength="2"
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
                                                <button className="btn btn-outline-success btn-sm" ref={buttonSendUp} onClick={() => setItem(0) && nextInput(inputNumLottoUp)}>เพิ่ม</button>
                                            </div>
                                        </div>

                                    </div>

                                </div>
                                {listLotto()}
                            </div>
                            <div className="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
                                <div className="form-row">
                                    <div className="form-group col-4">
                                        <label htmlFor="numlotto2">ตัวเลข</label>
                                        <input
                                            type="text"
                                            maxLength="2"
                                            id="numlotto2"
                                            className="form-control form-control-sm"
                                            ref={inputNumLotto}
                                            onChange={(e) => setNumLoto((e.target.value))}
                                            onKeyDown={e => e.key === 'Enter' && nextInput(inputPrice1)}
                                            value={numLotto}></input>
                                    </div>
                                    <div className="form-group col-7">
                                        <label htmlFor="pricelotto2">ราคา</label>
                                        <div className="row">
                                            <div className="col-5">
                                                <input type="number"
                                                    className="form-control form-control-sm"
                                                    ref={inputPrice1}
                                                    onChange={(e) => setPriceLoto1((e.target.value) * 1)}
                                                    onKeyDown={e => e.key === 'Enter' && nextInput(inputPrice2)}
                                                    value={priceLotto1}></input>
                                            </div>
                                            x
                                            <div className="col-5">
                                                <input type="number"
                                                    className="form-control form-control-sm"
                                                    ref={inputPrice2}
                                                    onChange={(e) => setPriceLoto2((e.target.value) * 1)}
                                                    onKeyDown={e => e.key === 'Enter' && nextInput(buttonSend)}
                                                    value={priceLotto2}></input>
                                            </div>
                                            <div className="col-1">
                                                <button className="btn btn-outline-success btn-sm" ref={buttonSend} onClick={() => setItem(1) && nextInput(inputNumLotto)}>เพิ่ม</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {listLotto()}
                            </div>
                            <div className="tab-pane fade" id="nav-lotto" role="tabpanel" aria-labelledby="nav-profile-tab">
                                <Lotto3 drawDate={drawDate()} name={name} />
                            </div>
                        </div>
                    </div>

                    {/* <div>
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
                                                <div className="col" >{index + 1}</div>
                                                <div className="col" >{item.name}</div>
                                                <div className="col" >{item.numLotto}</div>
                                                <div className="col" >{item.priceLotto1}*{item.priceLotto2}</div>
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
                    </div> */}

                </div >
                <div className="col-lg-6">
                    <h4>แสดงข้อมูลรวม</h4>
                    <PriceShowAll show={show} dDate={drawDate()} />
                </div>
            </div >
        </div >
    )

}
export default InputLotto2