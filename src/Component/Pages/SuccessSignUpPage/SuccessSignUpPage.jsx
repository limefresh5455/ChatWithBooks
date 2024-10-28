import React, { useEffect } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, Dimensions, ScrollView  } from 'react-native';
import Orientation from 'react-native-orientation-locker';
 
const { width, height } = Dimensions.get('window');

const SuccessSignUpPage = ({ navigation }) => {
  
    
  useEffect(() => {
    Orientation.lockToPortrait();
  },[]);

  return (
    <View style={styles.container}>
      <Image source={require('../../../../assets/images/Background-Image.png')} style={styles.backgroundImage} />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.contentContainer}>
            <>
              <Image source={require('../../../../assets/images/successIcon3.png')} style={styles.successIcon} />
              <View style={styles.instruction}>
              {/* <Text style={styles.successText}>Awesome!</Text> */}
              <Text style={styles.successText1}>Your account has been verified {'\n'} successfully.</Text>
              </View>
              <TouchableOpacity style={styles.loginButton} onPress={() => navigation.replace('Login')}>
                <Text style={styles.loginButtonText}>LOGIN NOW</Text>
              </TouchableOpacity>
            </>
        </View>
      </ScrollView>
    </View>
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
      width: "100%",
      height: "100%",
      resizeMode: 'cover',
    },
    scrollViewContent: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    contentContainer: {
      alignItems: 'center',
      width: '100%',
    },
    successIcon: {
      width: width * 0.7,
      height: width * 0.7,
      resizeMode: 'cover',
      elevation: 10,
    },
    successText: {
      fontSize: 25,
      fontWeight: "bold",
      color: '#000',
      marginBottom: 10,
      textAlign: 'center',
    },
    successText1: {
      fontSize: 22,
      fontWeight: "bold",
      color: '#000',
      marginBottom: 10,
      textAlign: 'center',
      marginTop:5,
    },
    loginButton: {
      backgroundColor: '#1777FF',
      justifyContent: 'center',
      alignItems: 'center',
      width: '80%',
      height: 50,
      borderRadius: 25,
      marginTop:10,
      marginBottom: width * 0.05,
    },
    loginButton1:{
        backgroundColor: '#D82D1C',
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
        height: 50,
        borderRadius: 25,
        marginTop:10,
        marginBottom: width * 0.05,
    },
    loginButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    errorText: {
      fontSize: 25,
      fontWeight: "bold",
      color: '#fff',
      marginBottom: 10,
      textAlign: 'center',
    },
    errorText1: {
      fontSize: 18,
      fontWeight: "bold",
      color: '#fff',
      marginBottom: 10,
      textAlign: 'center',
    },
    errorText2: {
      fontSize: 14,
      color: '#fff',
      textAlign: 'center',
    },
    instruction: {
      fontSize: 18,
      color: '#000',
      marginBottom: 20,
      textAlign: 'center',
      paddingHorizontal: 20,
      lineHeight: 30,
      fontFamily: 'Mulish-Bold',
      borderRadius: 8,
      paddingVertical: 5,
    },
  });

 


export default SuccessSignUpPage