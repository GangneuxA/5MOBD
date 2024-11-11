
//@ts-ignore 
import { initializeApp } from 'firebase/app';
//@ts-ignore
import { initializeAuth, getReactNativePersistence } from '@firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
apiKey: "AIzaSyC2MtR7Z6ybuua7ewi974OI2pNd314tfPI",
  authDomain: "mesbonnesadresses-f0067.firebaseapp.com",
  projectId: "mesbonnesadresses-f0067",
  storageBucket: "mesbonnesadresses-f0067.appspot.com",
  messagingSenderId: "998670254067",
  appId: "1:998670254067:web:2f280d30368235c5991c86"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  // persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const db = getFirestore(app);
const storage = getStorage(app);

export { auth as firebase, db, storage };