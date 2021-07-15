export const addComma = (x) => {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

export const sortData = (data, property, proviso) => {

    if (proviso === true) {
        function compare(a, b) {
            const data_idA = a[property]
            const data_idB = b[property]

            let comparison = 0;
            if (data_idA < data_idB) {
                comparison = 1;
            } else if (data_idA > data_idB) {
                comparison = -1;
            }
            return comparison;
        }
        let sort_data = data.sort(compare)
        return sort_data
    }
    else {
        function compare(a, b) {
            const data_idA = a[property]
            const data_idB = b[property]

            let comparison = 0;
            if (data_idA > data_idB) {
                comparison = 1;
            } else if (data_idA < data_idB) {
                comparison = -1;
            }
            return comparison;
        }
        let sort_data = data.sort(compare)
        return sort_data
    }

}

export const sortReversedData = (data) => {
    let mySet = new Set();

    const reversedNum = num => num.toString().split('').reverse().join('')
    // let dataset = []
    data.map((element) => {
        mySet.add(element)
        mySet.add(reversedNum(element))
        // dataset.push(element)
        // dataset.push(reversedNum(element))
    })

    // console.log("set",Array.from(mySet))
    // let sort_data = new Set(dataset)

    return Array.from(mySet)

}

export function swapLotto3(textnum) {
    // var num = 123; //ตัวเลขที่ต้องการหาโต๊ด
    // var textnum = num.toString(); //แปลงตัวเลขเป็นตัวอักษร
    var numlv1 = []; //ประกาศตัวแปลให้เป็น Array
    var numlv2 = [];
    //จัดการ level 1 โดยการสลับตัวเลข 2 หลักซ้ายสุด
    numlv1[0] = textnum.substr(0, 1) + textnum.substr(1, 1);
    numlv1[1] = textnum.substr(1, 1) + textnum.substr(0, 1);
    //จัดการ level 2
    var endnum = textnum.substr(2, 1); //จำเลขตัวสุดท้าย
    let mySet = new Set();
    // mySet.add(textnum)
    for (var i = 0; i <= 2 - 1; i++) { //วนลูปการแทรกตัวเลข ทั้ง 2 ตัวเลขจาก level 1
        numlv2[0] = numlv1[i].substr(0, 1); //แยกตัวเลข หลักแรกออกมา จากตัวเลข level 1
        numlv2[1] = numlv1[i].substr(1, 1); //แยกตัวเลข หลักที่ 2 ออกมา จากตัวเลข level 1
        //แทรกตัวเลขตัวสุดท้าย หน้า กลาง หลัง
        let str = endnum + numlv2[0] + numlv2[1] + " " + numlv2[0] + endnum + numlv2[1] + " " + numlv2[0] + numlv2[1] + endnum //แสดงผล
        let myArr = str.split(" ");
        myArr.map(element => mySet.add(element))
    }
    // console.log(mySet)
    return Array.from(mySet)
}