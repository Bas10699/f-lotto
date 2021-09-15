import React, { useState, useEffect } from 'react'

const InputLotto = (props) => {
    const [inputItem, setInputItem] = useState([])

    const send_click_2 = () => {
        console.log(props.item2)
    }
    useEffect(() => {
        setInputItem(props.item2)
    }, [props.item2])
    return (
        <div className="card mb-3" >
            <div className="card-header">ตรวจสอบรายการ
                <button className="float-right btn btn-outline-success btn-sm" onClick={() => send_click_2()}>
                    บันทึก
                </button>
            </div>
            <div className="card-body " style={{ maxHeight: '40vh', overflow: 'auto' }} ref={props.messageEl}>
                {inputItem.length === 0 ? <div>ไม่มีรายการ...</div> :
                    inputItem.map((item, index) => {
                        let bg = index % 2 == 0 ? "" : "bg-secondary text-white"
                        let bt = index % 2 == 0 ? "btn-outline-danger" : "btn-danger"
                        return (
                            <div className={"row py-1 border-bottom " + bg} key={index} >
                                <div className="col" >{item.numLotto}</div>
                                <div className="col" >{item.priceLotto1}*{item.priceLotto2}</div>
                                <div className="col" >{item.name}</div>
                                <div className="col" >{item.typeLotto == 0 ? "2ตัวบน" : "2ตัวล่าง"}</div>
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
        </div>
    )
}
export default InputLotto