import LottieView from 'lottie-react-native'
import React from 'react'
import { Text, View ,StyleSheet} from 'react-native'

const BookLoading = () => {
  return (
    <View style={styles.loadingContainer}>
     <LottieView
       source={require('../../../../assets/lottie/BookLoader.json')} // Replace with the path to your Lottie animation file
       autoPlay
       loop
       style={styles.lottieAnimation}
     />
     {/* <Text style={styles.loadingText}>Please Wait..</Text> */}
   </View>
  )
}
const styles = StyleSheet.create({
loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    zIndex: 999,
  },
  lottieAnimation: {
    width: 165,
    height: 165,
  },
  loadingText: {
    fontWeight: "bold",
    fontFamily: "Gill Sans",
    color: '#fff',
    fontSize: 14,
    marginTop: 20,
  },
 
});
 
export default BookLoading
