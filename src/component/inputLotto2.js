import React, { useState, useEffect, useRef } from 'react'
import moment from 'moment'
import firebase, { db } from '../firebase'
import Swal from 'sweetalert2'
import Lotto3 from './lotto3'
import PriceShowAll from './priceShowAll'
import '../App.css'
import { swapLotto3 } from '../const/constance'

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
    const [typeName, settypeName] = useState(2)
    const inputNumLottoUp = useRef(null)
    const inputPriceUp1 = useRef(null)
    const inputPriceUp2 = useRef(null)
    const buttonSendUp = useRef(null)
    const inputNumLotto = useRef(null)
    const inputPrice1 = useRef(null)
    const inputPrice2 = useRef(null)
    const buttonSend = useRef(null)

    const [checkedSwap, setCheckedSwap] = useState(false)
    const inputNumLottoUp3 = useRef(null)
    const inputPriceUp13 = useRef(null)
    const inputPriceUp23 = useRef(null)
    const buttonSendUp3 = useRef(null)

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
        // return "01/12/2021"
    }
    const send_click = async (typeLotto) => {

        setTime(moment().format("YYYY-MM-DDTHH:mm:ss.SSS"))
        // console.log(moment().format("YYYY-MM-DDTHH:mm:ss.SSS"))
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
            didOpen: () => Swal.showLoading(),

        })
        const batch = db.batch()
        let item = inputItem
        // console.log("lotto", item)
        item.map((element, index) => {
            if (element.numLotto.length > 2) {
                let data = {
                    name: element.name,
                    numLotto: element.numLotto,
                    priceLotto1: element.priceLotto1,
                    priceLotto2: element.priceLotto2,
                    date: element.date,
                    time: element.time,
                    drawDate: element.drawDate,
                    typeName: typeName
                }
                // console.log("data", moment().format("YYYYMMDDTHHmmssSSSSSS"))
                const docRef = db.collection("lotto3").doc(); //automatically generate unique id
                batch.set(docRef, data)
            }
            else {
                // let numLottoRev = reversedNum(element.numLotto)
                let data = {
                    name: element.name,
                    numLotto: element.numLotto,
                    priceLotto1: element.priceLotto1,
                    priceLotto2: element.priceLotto2,
                    date: element.date,
                    time: element.time,
                    typeLotto: element.typeLotto,
                    drawDate: element.drawDate,
                    typeName: typeName
                }
                const docRef = db.collection("lotto").doc(); //automatically generate unique id
                batch.set(docRef, data)
                // if (element.priceLotto2 > 0 || element.priceLotto2 !== "") {
                //     let data = {
                //         name: element.name,
                //         numLotto: numLottoRev,
                //         priceLotto: element.priceLotto2,
                //         date: element.date,
                //         time: element.time,
                //         typeLotto: element.typeLotto,
                //         drawDate: element.drawDate,
                //         typeName: typeName
                //     }
                //     const docRef = db.collection("lotto").doc(); //automatically generate unique id
                //     batch.set(docRef, data)
                // }
            }

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
            item.unshift({
                name: name,
                numLotto: numLotto,
                priceLotto1: priceLotto1 * 1,
                priceLotto2: priceLotto2 * 1,
                date: dateNow,
                time: timeNow,
                typeLotto: typeLotto,
                drawDate: drawDate()
            })
            setNumLoto('')
            setPriceLoto1('')
            setPriceLoto2('')
            // console.log(item)
            setInputItem(item)

            // if (messageEl) {
            //     messageEl.current.addEventListener('DOMNodeInserted', event => {
            //         const { currentTarget: target } = event;
            //         target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
            //     });
            // }
        }
    }

    const setItem3 = async () => {
        if (numLotto.length < 3 || priceLotto1 < 1) {
            alert("กรุณากรอกข้อมูลให้ครบ")
        }
        else {
            let item = inputItem
            let dateNow = moment().format("DD/MM/YYYY")
            let timeNow = moment().format("HH:mm")
            if (checkedSwap === true) {
                swapLotto3(numLotto).map((lotto) => {
                    item.unshift({
                        name: name,
                        numLotto: lotto,
                        priceLotto1: priceLotto1,
                        priceLotto2: priceLotto2,
                        date: dateNow,
                        time: timeNow,
                        drawDate: drawDate()
                    })
                })
            }
            else {
                item.unshift({
                    name: name,
                    numLotto: numLotto,
                    priceLotto1: priceLotto1 * 1,
                    priceLotto2: priceLotto2 * 1,
                    date: dateNow,
                    time: timeNow,
                    drawDate: drawDate()
                })
            }

            setNumLoto('')
            setPriceLoto1('')
            setPriceLoto2('')
            // console.log(item)
            setInputItem(item)

            // if (messageEl) {
            //     console.log(messageEl)
            //     messageEl.current.addEventListener('DOMNodeInserted', event => {
            //         const { currentTarget: target } = event;
            //         target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
            //     });
            // }
        }
    }

    const listLotto = () => {
        return (
            <div className="card mb-3" >
                <div className="card-header">ตรวจสอบรายการ
                    <button className="float-right btn btn-outline-success btn-sm" onClick={() => send_click_2()}>
                        บันทึก
                    </button>
                </div>
                <div className="card-body " style={{ maxHeight: '40vh', overflow: 'auto' }} ref={messageEl}>
                    {inputItem.length === 0 ? <div>ไม่มีรายการ...</div> :
                        <div>
                            {inputItem.map((item, index) => {
                                let bg = index % 2 == 0 ? "" : "alert-info"
                                let bt = index % 2 == 0 ? "btn-outline-danger" : "btn-danger"
                                let typelot = ""
                                if (item.typeLotto == 0) {
                                    typelot = "2ตัวบน"
                                }
                                else if (item.typeLotto == 1) {
                                    typelot = "2ตัวล่าง"
                                }
                                else {
                                    typelot = ""
                                }
                                return (
                                    <div className={"row py-1 border-bottom " + bg} key={index} >
                                        <div className="col" >{item.numLotto}</div>
                                        <div className="col" >{item.priceLotto1}*{item.priceLotto2}</div>
                                        <div className="col" >{item.name}</div>
                                        <div className="col" >{typelot}</div>
                                        <div className="col" >
                                            <button className={"btn btn-sm float-right " + bt}
                                                onClick={() => setInputItem(inputItem => inputItem.filter((item, i) => i !== index))}>
                                                ลบ
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}



                        </div>
                    }

                </div>
                <div className='card-footer'> <div className='row'>
                    <div className="col" >รวม</div>
                    <div className="col" >{inputItem.reduce((accumulator, currentValue) => accumulator + currentValue.priceLotto1, 0)}*
                        {inputItem.reduce((accumulator, currentValue) => accumulator + currentValue.priceLotto2, 0)}</div>
                    <div className="col" >เป็นเงิน</div>
                    <div className="col" >{inputItem.reduce((accumulator, currentValue) => accumulator + currentValue.priceLotto1, 0) +
                        inputItem.reduce((accumulator, currentValue) => accumulator + currentValue.priceLotto2, 0)}</div>
                    <div className="col" >บาท</div>
                </div></div>
            </div>
        )
    }

    const clickshow0 = () => {
        setTimeout(() => {
            nextInput(inputNumLottoUp)
        }, 300);
        setShow(0)
    }
    const clickshow1 = () => {
        setTimeout(() => {
            nextInput(inputNumLotto)
        }, 300);
        setShow(1)
    }
    const clickshow3 = () => {
        setTimeout(() => {
            nextInput(inputNumLottoUp3)
        }, 300);
        setShow(3)
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

                    <div className="pb-3 float-right">
                        <div className="form-check form-check-inline">
                            <input className="form-check-input"
                                type="radio"
                                name="inlineRadioOptions"
                                id="inlineRadio1"
                                defaultValue="0"
                                checked={typeName === 0}
                                onChange={() => settypeName(0)} />
                            <label className="form-check-label" htmlFor="inlineRadio1">พ่อ</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input"
                                type="radio" name="inlineRadioOptions"
                                id="inlineRadio2"
                                defaultValue="1"
                                checked={typeName === 1}
                                onChange={() => settypeName(1)} />
                            <label className="form-check-label" htmlFor="inlineRadio2">แม่</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input"
                                type="radio"
                                name="inlineRadioOptions"
                                id="inlineRadio3"
                                defaultValue="2"
                                checked={typeName === 2}
                                onChange={() => settypeName(2)} />
                            <label className="form-check-label" htmlFor="inlineRadio3">อื่นๆ</label>
                        </div>
                    </div>


                    <div>
                        <nav>
                            <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                <a className="nav-link active"
                                    id="nav-home-tab"
                                    data-toggle="tab"
                                    href="#nav-home"
                                    onClick={() => clickshow0()}
                                    role="tab"
                                    aria-controls="nav-home"
                                    aria-selected="true">
                                    2ตัวบน
                                </a>
                                <a className="nav-link"
                                    id="nav-profile-tab"
                                    data-toggle="tab"
                                    href="#nav-lotto"
                                    onClick={() => clickshow3()}
                                    role="tab"
                                    aria-controls="nav-lotto"
                                    aria-selected="false">
                                    3ตัวบน
                                </a>
                                <a className="nav-link"
                                    id="nav-profile-tab"
                                    data-toggle="tab"
                                    href="#nav-profile"
                                    onClick={() => clickshow1()}
                                    role="tab"
                                    aria-controls="nav-profile"
                                    aria-selected="false">
                                    2ตัวล่าง
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
                                            autoFocus
                                            type="text"
                                            ref={inputNumLottoUp}
                                            maxLength="2"
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
                                {/* <Lotto3 drawDate={drawDate()} name={name} /> */}
                                <div>
                                    <div className="form-row">
                                        <div className="form-group col-4">
                                            <label htmlFor="numlotto1">ตัวเลข</label>
                                            <input
                                                type="text"
                                                ref={inputNumLottoUp3}
                                                maxLength="3"
                                                className="form-control form-control-sm"
                                                onKeyDown={e => e.key === 'Enter' && nextInput(inputPriceUp13)}
                                                onChange={(e) => setNumLoto((e.target.value))}
                                                value={numLotto}
                                            ></input>
                                        </div>
                                        <div className="form-group col-7">
                                            <label htmlFor="pricelotto1">ราคา</label>
                                            <div className="row">
                                                <div className="col-5">
                                                    <input type="number"
                                                        ref={inputPriceUp13}
                                                        className="form-control form-control-sm"
                                                        onChange={(e) => setPriceLoto1((e.target.value) * 1)}
                                                        onKeyDown={e => e.key === 'Enter' && nextInput(inputPriceUp23)}
                                                        value={priceLotto1}
                                                    ></input>
                                                </div>
                                                x
                                                <div className="col-5">
                                                    <input type="number"
                                                        ref={inputPriceUp23}
                                                        className="form-control form-control-sm"
                                                        onChange={(e) => setPriceLoto2((e.target.value) * 1)}
                                                        onKeyDown={e => e.key === 'Enter' && nextInput(buttonSendUp3)}
                                                        value={priceLotto2}
                                                    ></input>
                                                </div>
                                                <div className="col-1">
                                                    <button className="btn btn-outline-success btn-sm"
                                                        ref={buttonSendUp3}
                                                        onClick={() => setItem3() && nextInput(inputNumLottoUp3)}
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
                                    {listLotto()}
                                </div>
                            </div>
                        </div>
                    </div>

                </div >
                <div className="col-lg-6">
                    {/* <h4>แสดงข้อมูลรวม</h4> */}
                    <PriceShowAll show={show} dDate={drawDate()} />
                </div>
            </div >
        </div >
    )

}
export default InputLotto2