import React, { useState, useEffect } from 'react'
import { addComma, drawDate } from '../const/constance';
import { db } from '../firebase';
import RptHome from './chart/rptHome';

const ReportHome = (prop) => {

    const render = () =>
        <div className="row">
            <div className="col-3">
                <RptHome name={prop.sumprice.result2up.name} sumall={prop.sumprice.result2up.sumprice} sum500={prop.sumprice.result2up.sum500over} />
                <div className="text-center" style={{ marginTop: '-25%' }}>{addComma(prop.sumprice.result2up.sumprice)} บาท</div>
            </div>
            <div className="col-3">
                <RptHome name={prop.sumprice.result2down.name} sumall={prop.sumprice.result2down.sumprice} sum500={prop.sumprice.result2down.sum500over} />
                <div className="text-center" style={{ marginTop: '-25%' }}>{addComma(prop.sumprice.result2down.sumprice)} บาท</div>
            </div>
        </div>
    return (<div className="container-fluid">
        {prop.sumprice !== '' ?
            render() : <div></div>}

    </div>)
}
export default ReportHome