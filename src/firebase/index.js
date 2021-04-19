import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore'

import config from './config'

if(!firebase.apps.length){
    firebase.initializeApp(config)
}

export default firebase;
export const auth = firebase.auth();
export const db = firebase.firestore();