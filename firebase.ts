
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCJcCZllarCcPx3dt_wdmAAHslUCIjhtcE",
  authDomain: "ss-notion-clone.firebaseapp.com",
  projectId: "ss-notion-clone",
  storageBucket: "ss-notion-clone.firebasestorage.app",
  messagingSenderId: "762400087511",
  appId: "1:762400087511:web:e231a62bb44ab8a7b3bf92"
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore(app)
export { db }