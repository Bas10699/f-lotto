import React, { useState, useEffect, use } from 'react'
import { sortData } from '../const/constance';
import DoughnutChart from './chart/price2';

const ReportLotto2Up = (item) => {
    const [lotto2, setlotto2] = useState([])
    const [reward, setreward] = useState(60)
    const [check, setcheck] = useState(true)

    const filterLotto = () => {
        let updatedList = item.docData2Up;
        let number = item.result.number
        updatedList = updatedList.filter(function (item) {
            return item.numLotto.search(number) !== -1;
        });
        setlotto2(updatedList)
    }
    useEffect(() => {

        filterLotto()

    }, [])

    return (
        <div>
            <h1>2ตัวบน {item.result.number}</h1>
            {/* <p>ขนาด {window.innerHeight}*{window.innerWidth}</p> */}

            <div className="row">
                <div className="col-sm-4">
                    <DoughnutChart />
                </div>
                <div className="col-sm-4">
                    <DoughnutChart />
                </div>
                <div className="col-sm-4">
                    <h5>ข้อมูลที่ถูกรางวัล 2ตัวบน</h5>
                    <table className="table table-sm " >
                        <thead className="thead-dark">
                            <tr>
                                <th style={{cursor:"pointer"}}
                                    onClick={() => { sortData(lotto2, "name", check) && setcheck(!check) }}
                                >ชื่อ <i class="fas fa-sort"></i></th>
                                <th>2ตัวบน</th>
                                <th>ราคา</th>
                                <th>จ่าย</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lotto2.map((elem, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{elem.name}</td>
                                        <td>{elem.numLotto}</td>
                                        <td>{elem.priceLotto}</td>
                                        <td className="text-danger">{elem.priceLotto * reward}</td>
                                    </tr>
                                )
                            })
                            }
                        </tbody>
                        <tfoot className="bg-light">
                            <tr>
                                <td colSpan="2">รวม</td>
                                <td>{lotto2.reduce((accumulator, currentValue) => accumulator + currentValue.priceLotto, 0)}</td>
                                <td className="text-danger">{(lotto2.reduce((accumulator, currentValue) => accumulator + currentValue.priceLotto, 0)) * reward}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

        </div>
    )
}
export default ReportLotto2Up