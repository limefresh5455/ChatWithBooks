import LottieView from 'lottie-react-native'
import React from 'react'
import {   View ,StyleSheet} from 'react-native'

const ChatLoader = () => {
  return (
    <View >
     <LottieView
       source={require('../../../../assets/lottie/Loading2.json')} // Replace with the path to your Lottie animation file
       autoPlay
       loop
       style={styles.lottieAnimation}
     />
   </View>
  )
}
const styles = StyleSheet.create({
   
 
  lottieAnimation: {
    width: 50,
    height: 35,
  },
});
 
export default ChatLoader
