import {useNavigation, useRoute} from '@react-navigation/native';
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
import { resetPasswordValidation } from '../Validation/Validation';
import { resetPasswordService } from '../Service/Service';
import { SafeAreaView } from 'react-native-safe-area-context';
import BookLoading from '../../Pages/Loading/BookLoading';
import Orientation from 'react-native-orientation-locker';

const {width, height} = Dimensions.get('window');

const ResetPassword = () => {
  const route = useRoute();
  const {email} = route.params;
  const navigation = useNavigation();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [password, setPassword] = useState(''); 
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    Orientation.lockToPortrait();  // Locks the screen to portrait mode
  }, []);

  const handleResetPassword = async () => {
    try {
      const validation= await resetPasswordValidation(password,confirmPassword)
      setErrors(validation);
      if(Object.keys(validation).length === 0){
         const userdata={email:email,new_password:password,confirmPassword:confirmPassword}
         setLoading(true)
         const response= await resetPasswordService(userdata);
         setLoading(false)
         if(response.status == 200){
          navigation.replace('SuccessFullResetPassword')
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
      <ScrollView contentContainerStyle={styles.scrollContainer}  keyboardShouldPersistTaps="handled" >
        {/* Form Container */}
        <View style={styles.formContainer}>
          <Text style={styles.title}>RESET PASSWORD</Text>
          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Icon name="lock" size={24} color="#000" style={styles.icon} />
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
                size={28}
                color="#000"
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          {/*Confirm Password Input */}
          <View style={styles.inputContainer}>
            <Icon name="lock" size={24} color="#000" style={styles.icon} />
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
                size={28}
                color="#000"
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
          {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
          {/* Continue Button */}
          <Animatable.View  animation="fadeInUpBig"    duration={1500} >
          <TouchableOpacity style={styles.ContinueButton} onPress={handleResetPassword}>
            <Text style={styles.ContinueButtonText}>SUBMIT NOW</Text>
          </TouchableOpacity>
          </Animatable.View>
        </View>
      </ScrollView>
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

export default ResetPassword;
