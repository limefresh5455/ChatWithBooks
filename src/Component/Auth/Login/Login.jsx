import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
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
import Icon from 'react-native-vector-icons/Feather';
import * as Animatable from 'react-native-animatable'; 
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { signInValidation } from '../Validation/Validation';
import { LoginWithGoogleService, signInService } from '../Service/Service';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import BookLoading from '../../Pages/Loading/BookLoading';
import { useAuth } from '../../ContextApi/AuthContext/AuthContext';
import Orientation from 'react-native-orientation-locker';

const {width, height} = Dimensions.get('window');

const Login = () => {
  const navigation = useNavigation();
  const {  setUsers } = useAuth();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    Orientation.lockToPortrait();  // Locks the screen to portrait mode
  }, []);


 const handleSubmitsignIn = async () => {
    try {
      const userDeatils = { email,password}
      const validation= await signInValidation(userDeatils)
      setErrors(validation);
      if(Object.keys(validation).length === 0){
         const userdata={email,password}
         setLoading(true)
         const response= await signInService(userdata);
         const { access_token, refresh, user } = response.data;
         setLoading(false)
         if(response.status == 200){
          const combinedData = { access_token, refresh, user: user };
          await AsyncStorage.setItem('user_details', JSON.stringify(combinedData));
          setUsers(combinedData)
          console.log("Login  user",combinedData)
          navigation.replace("BottomTabNavigator")
          setEmail('');
          setPassword('');
         } 
      }
    } catch (error) { 
        setLoading(false)
        console.log(error.response)
  }
}

const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    // console.log("userDetails SinuP",userInfo)
    const { user } = userInfo.data;
    const userDetails={ sub: user.id , name: user.name,  email: user.email}  
    setLoading(true)
    const response = await LoginWithGoogleService(userDetails)
    console.log("Login with google",response.data)
    if(response.status == 200){
      setLoading(false)
      const { access_token, refresh, user } = response.data;
        const combinedData = { access_token, refresh, user: user };
        await AsyncStorage.setItem('user_details', JSON.stringify(combinedData));
        setUsers(combinedData)
        navigation.replace("BottomTabNavigator")
    }
  } catch (error) {
    setLoading(false)
    console.log("Error response data:", error);
  
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      // Show toast for sign-in cancellation
      Toast.show({ type: 'info', text1: 'Cancelled', text2: 'Google Sign-In was cancelled.' });
    } else if (error.code === statusCodes.IN_PROGRESS) {
      // Show toast for sign-in in progress
      Toast.show({ type: 'info', text1: 'In Progress', text2: 'Google Sign-In is in progress.' });
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      // Show toast for Play services not available
      Toast.show({ type: 'error', text1: 'Error', text2: 'Play services not available.' });
    } else {
      // Show toast for generic sign-in error
      Toast.show({ type: 'error', text1: 'Error', text2: 'An error occurred during Google Sign-In. Please try again later.' });
    }
  }
};


 
  return (
    <SafeAreaView style={styles.container}>
      {/* Background Image */}
      <Image
        source={require('../../../../assets/images/Background-Image.png')}
        style={styles.backgroundImage}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled" 
        style={{flex: 1}}>
        {/* Form Container */}
        <View style={styles.formContainer}>
          <Text style={styles.title}>LOGIN</Text>

          {/* main Input */}
          <View style={styles.inputContainer}>
            <Icon name="mail" size={22} color="#000" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              placeholderTextColor="#413d3e"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (text) {
                  setErrors((prevErrors) => ({ ...prevErrors, email: null }));
                }
              }}
            />
          </View>
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Icon name="lock" size={22} color="#000" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry={!passwordVisible} // Toggle visibility
              placeholderTextColor="#413d3e"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (text) {
                  setErrors(prevErrors => ({ ...prevErrors, password: null }));
                }
              }}
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}>
              <Icon
                name={passwordVisible ? 'eye-off' : 'eye'}
                size={24}
                color="#000"
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          {/* Forgot Password */}
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.forgotPasswordText}>Forget password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
      
           <Animatable.View 
            animation="fadeInDown" // Apply the bounce animation
            duration={1500} // Duration of the animation
          >
            <TouchableOpacity style={styles.loginButton} onPress={handleSubmitsignIn}>
              <Text style={styles.loginButtonText}>LOGIN NOW</Text>
            </TouchableOpacity>
          </Animatable.View>

          <Text style={styles.orText}>Or</Text>

          {/* Google Login Button */}
          <TouchableOpacity style={styles.googleButton}  onPress={signInWithGoogle}>
            <Image
              source={require('../../../../assets/images/google.png')}
              style={styles.googleIcon}
            />
            <Text style={styles.googleButtonText}>Login with Google</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {loading && <BookLoading />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
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
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: height * 0.03,
  },
  formContainer: {
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.03,
    marginHorizontal: width * 0.05,
    width: '100%',
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    fontFamily: 'Mulish-Bold',
    paddingTop: width * 0.04,
    marginBottom: height * 0.02,
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 8,
    marginBottom: height * 0.025,
    width: '100%',
    height: 55,
    color: '000',
    fontWeight: '700',
  },
  icon: {
    marginRight: 10,
    color: 'black',
    fontWeight: '700',
    fontFamily: 'Mulish-Bold',
    padding: width * 0.02,
  },
  input: {
    flex: 1,
    fontSize: width * 0.05,
    lineHeight: 20,
    color: '#000',
    fontWeight: '600',
  },
  forgotPasswordText: {
    alignSelf: 'flex-end',
    fontSize: width * 0.05,
    fontFamily: 'Mulish-Bold',
    color: '#000',
    fontWeight: '800',
    marginBottom: height * 0.03,
  },
  loginButton: {
    backgroundColor: '#1777FF',
    paddingVertical: height * 0.02,
    borderRadius: 50,
    alignItems: 'center',
    marginBottom: height * 0.02,
    width: '100%',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  orText: {
    marginVertical: height * 0.04,
    textAlign: 'center',
    fontSize: width * 0.04,
    color: '#000',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#000',
    paddingHorizontal: width * 0.05,
    borderRadius: 50,
    width: '100%',
    // paddingVertical: height * 0.015,
    // backgroundColor: '#fff',
  },
  googleIcon: {
    width: 50,
    height: 50,
  },
  googleButtonText: {
    color: '#000',
    fontSize: width * 0.047,
    fontFamily: 'Mulish-Bold',
    fontWeight: 'bold',
  },
  
  errorText: {
    color: 'red',
    alignSelf: 'flex-start',
    fontWeight:"bold",
    fontSize:15,
    paddingTop:2,
    marginLeft: width * 0.02,
    marginTop: -18,
    marginBottom:12,
  },
  errorBorder: {
    borderColor: 'white',
  },
});

export default Login;
