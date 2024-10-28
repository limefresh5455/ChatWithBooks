import {useNavigation} from '@react-navigation/native';
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
import { forgotPasswordValidation } from '../Validation/Validation';
import { forgotPasswordService } from '../Service/Service';
import { SafeAreaView } from 'react-native-safe-area-context';
import BookLoading from '../../Pages/Loading/BookLoading';
import Orientation from 'react-native-orientation-locker';

const {width, height} = Dimensions.get('window');

const ForgotPassword = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    Orientation.lockToPortrait();  // Locks the screen to portrait mode
  }, []);



  const handleForgotPassword = async() => {
    try {
      const validation= await forgotPasswordValidation(email)
      setErrors(validation);
      if(Object.keys(validation).length === 0){   
         setLoading(true)
         const details={email}
         const response= await forgotPasswordService(details);
         setLoading(false)
         if(response.status == 200 || response.status == 201){
          navigation.navigate('OtpVerify',{ email })
          setEmail('');
          setPassword('');
         } 
      }
    } catch (error) {
        console.log("error",error.response)
        setLoading(false)
  }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Image */}
      <Image
        source={require('../../../../assets/images/Background-Image.png')}
        style={styles.backgroundImage}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}  keyboardShouldPersistTaps="handled" >
        {/* Form Container */}
        <View style={styles.formContainer}>
          <Text style={styles.title}>FORGOT PASSWORD</Text>
          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Icon name="mail" size={24} color="#000" style={styles.icon} />
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
          {/* Continue Button */}
          <Animatable.View  animation="bounceInDown" duration={1500}   >
          <TouchableOpacity
            style={styles.ContinueButton}
            onPress={() => handleForgotPassword()}>
            <Text style={styles.ContinueButtonText}>CONTINUE</Text>
          </TouchableOpacity>
          </Animatable.View>
        </View>
      </ScrollView>
      {/* Back to Login at Bottom */}
      <View style={styles.signInContainer}>
        <Text style={styles.accountText}>Back to the?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.signInText}> Sign In</Text>
        </TouchableOpacity>
      </View>
      {loading && <BookLoading />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    paddingHorizontal: 20,
  },
  formContainer: {
    width: '100%',
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    fontFamily: 'Mulish-Bold',
    color: '#000',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 8,
    padding: width * 0.01,
    marginBottom: height * 0.025,
    width: '100%',
    height: 55,
    color: '#000',
    fontWeight: '700',
  },
  icon: {
    marginRight: 10,
    color: 'black',
    fontWeight: '700',
    padding: width * 0.02,
  },
  input: {
    flex: 1,
    fontSize: width * 0.05,
    lineHeight: 20,
    color: '#000',
    fontWeight: '600',
  },
  ContinueButton: {
    backgroundColor: '#1777FF',
    paddingVertical: height * 0.02,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: height * 0.025,
    width: '100%',
  },
  ContinueButtonText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: height * 0.1, // Positioned towards the bottom
  },
  accountText: {
    fontSize: 18,
    fontFamily: 'Mulish-Bold',
    fontWeight: 'bold',
    color: '#000',
  },
  signInText: {
    fontSize: 22,
    color: '#007bff',
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

export default ForgotPassword;
