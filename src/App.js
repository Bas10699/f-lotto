import React, { useState, useEffect } from 'react'
import moment from 'moment';
import firebase, { db } from './firebase'
import './App.css';
import ShowAll from './component/showAll';
import Price200 from './component/price200';

function App() {
  const [timeshow, setTime] = useState('')
  const [numLotto, setNumLoto] = useState(0)
  const [numLottoReverse, setNumLotoReverse] = useState('')
  const [priceLotto1, setPriceLoto1] = useState('')
  const [priceLotto2, setPriceLoto2] = useState('')
  const [name, setName] = useState('')

  const reversedNum = num => num.toString().split('').reverse().join('')


  const send_click = async () => {
    setTime(moment().format("YYYY-MM-DDTHH:mm:ss.SSS"))
    console.log(moment().format("YYYY-MM-DDTHH:mm:ss.SSS"))

    if (priceLotto2 > 0) {
      let numLottoRev = reversedNum(numLotto)
      await db.collection("lotto").doc(moment().format("YYYYMMDDHHmmssSSS")).set({
        name: name,
        numLotto: numLotto,
        priceLotto: priceLotto1
      })
        .then(() => {
          console.log("Document successfully written!");
          db.collection("lotto").doc(moment().format("YYYYMMDDHHmmssSSS")).set({
            name: name,
            numLotto: numLottoRev,
            priceLotto: priceLotto2
          })
            .then(() => {
              console.log("Document successfully written!");
            })
            .catch((error) => {
              console.error("Error writing document: ", error);
            });
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
        });

    }
    else {
      db.collection("lotto").doc(moment().format("YYYYMMDDHHmmssSSS")).set({
        name: name,
        numLotto: numLotto,
        priceLotto: priceLotto1
      })
        .then(() => {
          console.log("Document successfully written!");
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
        });


    }

  }

  return (
    <div className="container">
      <h3 className="pt-5">ระบบการจัดการตัวเลขของเอฟโอเวอร์</h3>
      <div className="row pt-3">
        <div className="col-sm-6">
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
          <table className="table">
            <thead>
              <tr>
                <th scope="col">ตัวเลข</th>
                <th scope="col">ราคา</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><input type="text" maxLength="2" className="form-control form-control-sm" onChange={(e) => setNumLoto((e.target.value))}></input></td>
                <td>
                  <div className="row">
                    <div className="col-5">
                      <input type="number" className="form-control form-control-sm" onChange={(e) => setPriceLoto1((e.target.value) * 1)}></input>
                    </div>
                    x
                    <div className="col-5">
                      <input type="number" className="form-control form-control-sm" onChange={(e) => setPriceLoto2((e.target.value) * 1)}></input>
                    </div>
                  </div>
                </td>
                <td><button className="btn btn-outline-success btn-sm" onClick={send_click}>บันทึก</button></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="col-sm-6">
          <h4>แสดงข้อมูล</h4>
          <div className="row">
            <div className="col-sm-6">
              <Price200 />
            </div>

            <div className="col-sm-6">
              <ShowAll />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
