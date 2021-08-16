import React, { useState, useEffect, useRef } from 'react'
import moment from 'moment';
import firebase, { db } from './firebase'
import './App.css';
import PriceShowAll from './component/priceShowAll';
import Login from './component/login';
import Swal from 'sweetalert2'
import PriceShowName from './component/priceShowName';
import Lotto3 from './component/lotto3';
import Navbar from './component/navbar';
import { BrowserRouter as Router, Route } from "react-router-dom";
import CheckResults from './component/checkResults';
import Report from './component/report';


function App() {
  const [timeshow, setTime] = useState('')
  const [numLotto, setNumLoto] = useState('')
  const [numLottoReverse, setNumLotoReverse] = useState('')
  const [priceLotto1, setPriceLoto1] = useState('')
  const [priceLotto2, setPriceLoto2] = useState('')
  const [name, setName] = useState('')
  const [show, setShow] = useState(0)
  const [uid, setuid] = useState('')
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
    // if ((moment().format("DD") * 1) <= 10) {
    //   return "01/" + moment().format("MM/YYYY")
    // }
    // else if ((moment().format("DD") * 1 > 10) && (moment().format("DD") * 1 < 20)) {
    //   return "16/" + moment().format("MM/YYYY")
    // }
    // else {
    //   return "01/" + moment().add(1, 'months').format("MM/YYYY")
    // }
    return "01/09/2021"
  }

  useEffect(() => {
    // console.log("token", localStorage.getItem('user_token'))
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        setuid(user.uid)
        setloading(true)
      } else {
        setuid('')
        localStorage.removeItem('user_token')
      }
    });
  }, [])



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
        db.collection("lotto").doc().set({
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
  const admin = () => {
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
                          <button className="btn btn-outline-success btn-sm" ref={buttonSendUp} onClick={() => send_click(0) && nextInput(inputNumLottoUp)}>บันทึก</button>
                        </div>
                      </div>

                    </div>

                  </div>
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
                          <button className="btn btn-outline-success btn-sm" ref={buttonSend} onClick={() => send_click(1) && nextInput(inputNumLotto)}>บันทึก</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="tab-pane fade" id="nav-lotto" role="tabpanel" aria-labelledby="nav-profile-tab">
                  <Lotto3 drawDate={drawDate()} name={name} />
                </div>
              </div>
            </div>

            <div>
              {/* <PriceShowName show={show} dDate={drawDate()} /> */}
            </div>

          </div >
          <div className="col-lg-6">
            <h4>แสดงข้อมูลรวม</h4>
            <PriceShowAll show={show} dDate={drawDate()} />
          </div>
        </div >
      </div >
    );
  }
  if (localStorage.getItem('user_token') !== null) {
    if (loading) {
      return (
        <Router>
          <div>
            <Navbar />
            <Route exact path="/">
              {admin()}
            </Route>
            <Route path="/check_result">
              <CheckResults />
            </Route>
            <Route path="/report">
              <Report />
            </Route>
          </div>
        </Router>
      )
    } else {
      return (
        <div className="loading">
          <h2>F Lotto Loading...</h2>
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      )
    }
  }
  else {
    return (
      <Login />
    )
  }
}

export default App;