import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    
};
  
const app = initializeApp(firebaseConfig);
const firebase = getAuth(app);
setPersistence(firebase, browserLocalPersistence);
const db = getFirestore(app);
const storage = getStorage(app);

export { firebase, db, storage };