import axios from "axios"
import { API_URL } from '@env';
import axiosInstance from "../../Interceptor/Interceptor";


export const signUpService= async(userDetails)=>{
    try{
    console.log("first,",API_URL)
    const res = await axiosInstance.post(`/askpdf/api/auth/register/`,userDetails)
    return res;
} catch (error) {
    console.log('Error fetching signUpService:', error);
    throw error; 
  }
}

export const LoginWithGoogleService= async(userDetails)=>{
    try{
    const res = await axiosInstance.post(`/askpdf/api/auth/google-signin/`,userDetails)
    return res;
} catch (error) {
    console.log('Error fetching LoginWithGoogleService:', error);
    throw error; 
  }
}



export const  emailVerifyByOTPService = async (userDetails) => {
    try{
    const res = await axiosInstance.post(`/askpdf/api/auth/verify-otp/`,userDetails)
    return res;
} catch (error) {
    console.log('Error fetching emailVerifyByOTPService:', error);
    throw error; 
  }
}

export const signInService= async(userDetails)=>{
    try{    
      console.log("Second,",API_URL)
    const res = await axiosInstance.post(`/askpdf/api/auth/login/`,userDetails)
    return res;
} catch (error) {
    console.log('Error fetching signInService:', error);
    throw error; 
  }
}

export const  resendEmailService = async (details) => {
    try{
    const res = await axiosInstance.post(`/askpdf/api/auth/resend-otp/`,details)
    return res;
} catch (error) {
    console.log('Error fetching resendEmailService:', error);
    throw error; 
  }
}


export const forgotPasswordService= async(details)=>{
    try{
    const res = await axiosInstance.post(`/askpdf/api/auth/forget-password/`,details)
    return res;
} catch (error) {
    console.log('Error fetching forgotPasswordService:', error);
    throw error; 
  }
}

export const resetPasswordService= async(userDetails)=>{
    try{
    const res = await axiosInstance.post(`/askpdf/api/auth/reset-password/`,userDetails)
    return res;
} catch (error) {
    console.log('Error fetching resetPasswordService:', error);
    throw error; 
  }
}

 
