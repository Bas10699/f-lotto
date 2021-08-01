import React from "react";
import ReactExport from "react-data-export";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const ExportExcel3 = (porps) => {
    // function filterType(item) {
    //     if (item.typeLotto === porps.typeLotto) {
    //         return true
    //     }
    //     return false;
    // }
    return (
        <ExcelFile element={<button className="btn btn-outline-info btn-sm ">ดาวน์โหลด</button>}>
            <ExcelSheet data={porps.data} name="Employees">
                <ExcelColumn label="ชื่อ" value="name" />
                <ExcelColumn label="เลข" value="numLotto" />
                <ExcelColumn label="ตรง" value="priceLotto1" />
                <ExcelColumn label="โต๊ด" value="priceLotto2" />
            </ExcelSheet>
            {/* <ExcelSheet data={dataSet2} name="Leaves">
                <ExcelColumn label="Name" value="name" />
                <ExcelColumn label="Total Leaves" value="total" />
                <ExcelColumn label="Remaining Leaves" value="remaining" />
            </ExcelSheet> */}
        </ExcelFile>
    );
}
export default ExportExcel3