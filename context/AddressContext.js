import React, { createContext, useState, useEffect, useContext } from 'react';
import { firebase, db } from '../config/firebaseConfig';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import { UserContext } from './UserContext';

export const AddressContext = createContext();

export const AddressProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const [addresses, setAddresses] = useState([]);
  const [publicAddresses, setPublicAddresses] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (user) {
      fetchAddresses();
      fetchPublicAddresses();
    }
  }, [user]);

  const fetchAddresses = async () => {
    const q = query(collection(db, 'addresses'), where('userId', '==', user.uid));
    const querySnapshot = await getDocs(q);
    const userAddresses = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setAddresses(userAddresses);
  };

  const fetchPublicAddresses = async () => {
    const q = query(collection(db, 'addresses'), where('isPublic', '==', true));
    const querySnapshot = await getDocs(q);
    const publicAddresses = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setPublicAddresses(publicAddresses);
  };

  const addAddress = async (address) => {
    const docRef = await addDoc(collection(db, 'addresses'), {
      ...address,
      userId: user.uid,
    });
    setAddresses([...addresses, { id: docRef.id, ...address }]);
    if (address.isPublic) {
      setPublicAddresses([...publicAddresses, { id: docRef.id, ...address }]);
    }
  };

  const deleteAddress = async (id) => {
    await deleteDoc(doc(db, 'addresses', id));
    setAddresses(addresses.filter(address => address.id !== id));
    setPublicAddresses(publicAddresses.filter(address => address.id !== id));
  };

  const fetchComments = async (addressId) => {
    const q = query(collection(db, 'comments'), where('addressId', '==', addressId));
    const querySnapshot = await getDocs(q);
    const addressComments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setComments(addressComments);
  };

  const addComment = async (comment) => {
    const docRef = await addDoc(collection(db, 'comments'), comment);
    setComments([...comments, { id: docRef.id, ...comment }]);
  };

  return (
    <AddressContext.Provider value={{ addresses, publicAddresses, comments, addAddress, deleteAddress, fetchComments, addComment }}>
      {children}
    </AddressContext.Provider>
  );
};