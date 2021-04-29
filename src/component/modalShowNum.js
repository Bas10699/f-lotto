import React, { useState ,useEffect} from 'react'
import firebase, { db } from '../firebase'

const ModalShowNum = (props) => {
    console.log(props)
    const [dataShow, setDataShow] = useState('')

    useEffect(() => {
        console.log("lotto vv", props)

        db.collection("lotto").where("numLotto", "==", props.numberLotto).onSnapshot((querySnapshot) => {
            let shData = []
            let lotto = []
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                shData.unshift(doc.data())
            

            });
            // console.log("lotto", lotto200)
            console.log("Data number", shData)
            setDataShow(shData)
            // // setShowTop200(lottoTop200)
            // // setShowDown200(lottoDown200)
            // sortData(lottoTop, "numLotto", false)
            // sortData(lottoDown, "numLotto", false)
            // setShowTop(lottoTop)
            // setShowDown(lottoDown)

        });
    }, [])
    return (
        <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">รายละเอียด 2ตัวบน </h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
            </div>
            <div className="modal-body">
                ...
    </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary">Save changes</button>
            </div>
        </div>)
}
export default ModalShowNum