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
import { signUpValidation } from '../Validation/Validation';
import { signUpService } from '../Service/Service';
import { SafeAreaView } from 'react-native-safe-area-context';
import BookLoading from '../../Pages/Loading/BookLoading';
import Orientation from 'react-native-orientation-locker';

const {width, height} = Dimensions.get('window');

const Register = () => {
  const navigation = useNavigation();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [name, setName] = useState(''); 
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    Orientation.lockToPortrait();   
  }, []);

  const handleSubmitsignUp = async () => {
    try {
      const userDeatils = {name,email,password,confirmPassword}
      const validation= await signUpValidation(userDeatils)
      setErrors(validation);
      if(Object.keys(validation).length === 0){
         const userdata={username:name,email,password}
         setLoading(true)
         const response= await signUpService(userdata);
         console.log("signUpResponse",response.data)
         setLoading(false)
         if(response.status == 200 || response.status == 201){
          navigation.navigate('SignUpOtpVerify',{ email:email })
          setName('');
          setEmail('');
          setPassword('');
          setConfirmPassword('');
         } 
      }
    } catch (error) {
        console.log(error.response)
        setLoading(false)
  }
}

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
          <Text style={styles.title}>SIGN UP</Text>

          {/* Full Name Input */}
          <View style={styles.inputContainer}>
            <Icon name="user" size={24} color="#000" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#413d3e"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (text) {
                  setErrors(prevErrors => ({ ...prevErrors, name: null }));
                }
              }}
            />
          </View>
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>} 
         
          {/* Email Input */}
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
          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <Icon name="lock" size={22} color="#000" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry={!confirmPasswordVisible} // Toggle visibility
              placeholderTextColor="#413d3e"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (text) {
                  setErrors(prevErrors => ({ ...prevErrors, confirmPassword: null }));
                }
              }}
            />
            <TouchableOpacity
              onPress={() =>
                setConfirmPasswordVisible(!confirmPasswordVisible)
              }>
              <Icon
                name={confirmPasswordVisible ? 'eye-off' : 'eye'}
                size={24}
                color="#000"
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
          {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

          {/* Sign Up Button */}
          <Animatable.View 
             animation="fadeInDown"  // Apply the bounce animation
            duration={1500} // Duration of the animation
          >
          <TouchableOpacity style={styles.SignUpButton} onPress={handleSubmitsignUp}>
            <Text style={styles.SignUpButtonText}>SIGN UP</Text>
          </TouchableOpacity>
          </Animatable.View>
        </View>
              {/* Already have an account */}
            <View style={styles.SignUpContainer}>
            <Text style={styles.accountText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.SignUpText}> Sign In</Text>
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
    paddingVertical: height * 0.02,
    // gap:30
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
    // padding: width * 0.01,
    marginBottom: height * 0.025,
    width: '100%',
    height: height * 0.07,
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
    fontSize: width * 0.045,
    lineHeight: 20,
    color: '#000',
    fontWeight: '600',
  },
  SignUpButton: {
    backgroundColor: '#1777FF',
    paddingVertical: height * 0.02,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: height * 0.025,
    marginBottom: height * 0.02,
    width: '100%',
  },
  SignUpButtonText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  SignUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.08,
    marginBottom: height * 0.01,
  },
  accountText: {
    fontSize: width * 0.04,
    fontFamily: 'Mulish-Bold',
    fontWeight: 'bold',
    color: '#000',
  },
  SignUpText: {
    fontSize: width * 0.056,
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

export default Register;
