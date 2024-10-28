import {useRoute} from '@react-navigation/native';
import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { emailVerifyByOTPService, resendEmailService } from '../Service/Service';
import Timer from 'react-native-background-timer-android';
import * as Animatable from 'react-native-animatable'; 
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import BookLoading from '../../Pages/Loading/BookLoading';
import Orientation from 'react-native-orientation-locker';
 
const {width, height} = Dimensions.get('window');

const SignUpOtpVerify = ({navigation}) => {
  const route = useRoute();
  const {email} = route.params;
  const [otp, setOtp] = useState(new Array(4).fill(''));
  const [inputError, setInputError] = useState(false);
  const [invalidOtp, setInvalidOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timers, setTimer] = useState(300);
  const inputRefs = useRef([]);
 
  useEffect(() => {
    Orientation.lockToPortrait();  // Locks the screen to portrait mode
  }, []);

    useEffect(() => {
      const countdown = Timer.setInterval(() => {
        setTimer(prevTimer => (prevTimer > 0 ? prevTimer - 1 : 0));
      }, 1000);
      return () => Timer.clearInterval(countdown);
    }, []);

    const handleChange = (value, index) => {
      if (/^\d?$/.test(value)) {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setInputError(false);
        setInvalidOtp(false);
        if (value !== '' && index < inputRefs.current.length - 1) {
          inputRefs.current[index + 1].focus();
        } else if (value === '' && index > 0) {
          inputRefs.current[index - 1].focus();
        }
      }
    };
 
  

  const formatTime = time => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  const handleVerify = async () => {
    if (otp.includes('')) {
      setInputError(true);
      return;
    }
    try {
      const otpNumber = Number(otp.join(''));
      const userDetails = { email: email,otp_code: otpNumber};
      const response = await emailVerifyByOTPService(userDetails);
      if(response.status == 200 || response.status == 201){
        navigation.replace('SuccessSignUpPage');
      } else {
        setInvalidOtp(true);
      }
    } catch (error) {
        console.log(error.response)
        setInvalidOtp(true);
    }
  };

  const handleResendOtp = async () => {
    try {
      setLoading(true);
      const details = {email};
      const response = await resendEmailService(details);
      const {message} = response.data;
      console.log(message)
      if(response.status == 200 || response.status == 201){
        setTimer(300);
        setLoading(false);
        Toast.show({  type: 'success',  text1: 'OTP Sent',  text2: 'Your OTP has been sent successfully. Please check your email.', });   
      }
    } catch (error) {
        console.log(error.response);
        setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../../../../assets/images/Background-Image.png')}
        style={styles.backgroundImage}
      />
      <ScrollView contentContainerStyle={styles.scrollViewContent}  keyboardShouldPersistTaps="handled" >
        <View style={styles.contentContainer}>
          <Image
            source={require('../../../../assets/images/forgot-password.png')}
            style={styles.icon}
          />
          <Text style={styles.instruction}>
            An otp has been sent to your email enter the otp to activate your
            account.
          </Text>
          {invalidOtp && <Text style={styles.errorMessage}>Invalid OTP</Text>}
          <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
              <TextInput
                key={index}
                style={[
                  styles.otpInput,
                  (inputError && !otp[index]) || invalidOtp
                    ? styles.errorBorder
                    : null,
                ]}
                keyboardType="numeric"
                maxLength={1}
                value={digit}
                onChangeText={value => handleChange(value, index)}
                ref={ref => (inputRefs.current[index] = ref)}
                onKeyPress={({nativeEvent}) => {
                  if (nativeEvent.key === 'Backspace' && otp[index] === '') {
                    if (index > 0) {
                      inputRefs.current[index - 1].focus();
                    }
                  }
                }}
              />
            ))}
          </View>
          <Text style={styles.timerText}>{formatTime(timers)}</Text>
          <Animatable.View  animation="shake" duration={1500}   >
          <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
            <Ionicons name="arrow-forward" size={30} color="#fff" />
          </TouchableOpacity>
          </Animatable.View>
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Did not receive OTP?</Text>
            <TouchableOpacity onPress={handleResendOtp} disabled={timers !== 0}>
              <Text
                style={[
                  styles.resendButton,
                  {opacity: timers === 0 ? 1 : 0.5},
                ]}>
                RESEND OTP
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {loading && <BookLoading />}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: height * 0.05,
    paddingHorizontal: width * 0.05,
  },
  contentContainer: {
    alignItems: 'center',
    width: '100%',
    // backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // elevation: 5,
    marginBottom: height * 0.01,
  },
  icon: {
    width: width * 0.4,
    height: height * 0.2,
    marginBottom: 10,
  },

  instruction: {
    fontSize: 18,
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 30,
    fontFamily: 'Mulish-Bold',
    backgroundColor: '#FFE3B9CC',
    borderRadius: 8,
    paddingVertical: 10,
  },
  
  errorMessage: {
    color: 'red',
    marginBottom: 10,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.01,
  },
  otpInput: {
    width: width * 0.12,
    height: width * 0.12,
    backgroundColor: '#fff',
    color: 'blue',
    fontWeight: 'bold',
    borderRadius: 10,
    borderColor: '#000',
    borderWidth: 1,
    textAlign: 'center',
    fontSize: width * 0.05,
    marginHorizontal: width * 0.02,
  },
  errorBorder: {
    borderColor: 'red',
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  resendText: {
    fontSize: 14,
    color: '#000',
  },
  resendButton: {
    fontSize: 18,
    color: '#007bff',
    fontWeight: '800',
    marginLeft: 10,
  },
  verifyButton: {
    width: width * 0.15,
    height: width * 0.15,
    backgroundColor: '#1777FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: width * 0.075,
    marginBottom: height * 0.03,
  },
  timerText: {
    fontSize: 18,
    color: '#BE272A',
    paddingHorizontal: width * 0.13,
    // marginBottom: height * 0.01,
    alignSelf: 'flex-end',
  },
});

export default SignUpOtpVerify;
