import React, { useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { GOOGLE_WEB_CLIENT_ID } from '@env';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {StatusBar, StyleSheet} from 'react-native';
import WelcomePage from './Component/Auth/WelcomePage/WelcomePage';
import Login from './Component/Auth/Login/Login';
import Register from './Component/Auth/Register/Register';
import ForgotPassword from './Component/Auth/ForgotPassword/ForgotPassword';
import OtpVerify from './Component/Auth/OtpVerify/OtpVerify';
import ResetPassword from './Component/Auth/ResetPassword/ResetPassword';
import SignUpOtpVerify from './Component/Auth/OtpVerify/SignUpOtpVerify';
import SuccessFullResetPassword from './Component/Pages/SuccessFullResetPassword/SuccessFullResetPassword';
import SuccessSignUpPage from './Component/Pages/SuccessSignUpPage/SuccessSignUpPage';
import OnBoradingScreen from './Component/Pages/OnBoradingScreen/OnBoradingScreen';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useAuth } from './Component/ContextApi/AuthContext/AuthContext';
import ProtectedRoutes from './Component/ProtectedRoutes/ProtectedRoutes';
import Logout from './Component/Pages/Logout/Logout';
import BottomTabNavigator from './Component/User/BottomTabNavigator/BottomTabNavigator';
import DisplayPdf from './Component/User/DisplayPdf/DisplayPdf';
import Chat from './Component/User/Chat/Chat';
import NetworkStatus from './Component/Pages/NetworkStatus/NetworkStatus';
 

const Stack = createStackNavigator();

function App() {
  const {users}=useAuth();
   
  useEffect(()=>{
    GoogleSignin.configure({
      webClientId:GOOGLE_WEB_CLIENT_ID,
      offlineAccess: false, 
      scopes: ['profile', 'email'],
    });
  },[])




  return (
    <>
     <StatusBar backgroundColor="#1777FF" barStyle="light-content" />
      <NavigationContainer>
      <Stack.Navigator initialRouteName={users ? 'DisplayAllBook' : 'WelcomePage'}>
       {users ? (<>
        <Stack.Screen name="BottomTabNavigator" options={{ headerShown: false }}>
            {(props) => <ProtectedRoutes {...props} component={BottomTabNavigator} />}
        </Stack.Screen>
        <Stack.Screen name="Chat" component={Chat} options={{ headerShown: false }} /> 
        <Stack.Screen name="DisplayPdf" component={DisplayPdf} options={{ headerShown: false }} />  
        <Stack.Screen name="Logout" component={Logout} options={{ headerShown: false }} />
        </>
      ) : (
        <>
            <Stack.Screen name="WelcomePage" component={WelcomePage} options={{ headerShown: false }} />
            <Stack.Screen name="OnBoradingScreen" component={OnBoradingScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
            <Stack.Screen name="SignUpOtpVerify" component={SignUpOtpVerify} options={{ headerShown: false }} />
            <Stack.Screen name="OtpVerify" component={OtpVerify} options={{ headerShown: false }} />
            <Stack.Screen name="ResetPassword" component={ResetPassword} options={{ headerShown: false }} />
            <Stack.Screen name="SuccessFullResetPassword" component={SuccessFullResetPassword} options={{ headerShown: false }} />
            <Stack.Screen name="SuccessSignUpPage" component={SuccessSignUpPage} options={{ headerShown: false }} />
        </>
       )}
      </Stack.Navigator>
      </NavigationContainer>
      <NetworkStatus />
      <Toast />
    </>
  );
}

const styles = StyleSheet.create({});

export default App;
