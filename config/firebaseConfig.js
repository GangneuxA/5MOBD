
//@ts-ignore 
import { initializeApp } from 'firebase/app';
//@ts-ignore
import { initializeAuth, getReactNativePersistence } from '@firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  // persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const db = getFirestore(app);
const storage = getStorage(app);

export { auth as firebase, db, storage };