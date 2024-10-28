import React, { createContext, useContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
 

export  const AuthProvider = createContext();


const AuthContext = ({ children }) => {
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true); 
 

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user_details');
        console.log("User data from AsyncStorage:", userData);
        if (userData) {
          setUsers(JSON.parse(userData));
        }
      } catch (error) {
        console.log("Failed to load user data", error);
      }finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);
  

  return (
    <AuthProvider.Provider value={{users,setUsers,loading ,setLoading}}>{ children }</AuthProvider.Provider>
  )
}

export default AuthContext

export const useAuth = () => useContext(AuthProvider);