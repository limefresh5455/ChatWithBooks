import React, {  useEffect, useState } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import BookLoading from '../Loading/BookLoading';
import { useAuth } from '../../ContextApi/AuthContext/AuthContext';

const Logout = () => {
    const {setUsers}=useAuth()
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(true);  
    
    useEffect(() => {
        const handleLogout = async () => {
            try {
                await GoogleSignin.signOut();  
                await AsyncStorage.clear(); 
                setUsers(null);
                navigation.replace('Login'); 
            } catch (error) {
                Toast.show({ type: 'error', text1: 'Logout Error',  text2:  'An Logout error occurred.'  });
            } finally {
                setIsLoading(false);  
            }
        };
        handleLogout();
    }, []);

    if (isLoading) {
        return (
          <BookLoading/>
        );
    }
    return null;  
};

 
export default Logout;
