import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Orientation from 'react-native-orientation-locker';
import Swiper from 'react-native-swiper';
import * as Animatable from 'react-native-animatable';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

const OnBoardingScreen = () => {
  const swiperRef = useRef(null); // Updated to null for correct useRef initialization
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    Orientation.lockToPortrait();
  },[]);

  const handleSkip = () => {
    swiperRef.current.scrollBy(2);
  };

  const handleNext = () => {
    swiperRef.current.scrollBy(1);
  };

  const handleIndexChanged = (index) => {
    setCurrentIndex(index);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Swiper
        ref={swiperRef}
        loop={false}
        paginationStyle={styles.paginationStyle}
        dotStyle={styles.dotStyle}
        activeDotStyle={styles.activeDotStyle}
        onIndexChanged={handleIndexChanged}
      >
        {/* First Slide */}
        <View style={styles.slide}>
          <Image
            source={require('../../../../assets/images/background-onBoarding.png')}
            style={styles.backgroundImage}
          />
           <Animatable.View
            animation="bounceInDown" // Change this to any animation you like
            duration={3000}
            style={styles.imageWrapper}
          >
          <Image
            source={require('../../../../assets/images/onBoarding1.0.png')}
            style={styles.image3D1}
          />
          </Animatable.View>
          <Text style={styles.title}>
            Explore Our Collection
          </Text>
        </View>

        {/* Second Slide */}
        <View style={styles.slide}>
          <Image
            source={require('../../../../assets/images/background-onBoarding.png')}
            style={styles.backgroundImage}
          />
             <Animatable.View
            animation="bounceInDown" // Change this to any animation you like
            duration={3000}
            style={styles.imageWrapper}
          >
          <Image
            source={require('../../../../assets/images/onBoarding13.png')}
            style={styles.image3D2}
          />
          </Animatable.View>
          <Text style={styles.title}>Read and Interact with the Book</Text>
         
        </View>

        {/* Third Slide */}
        <View style={styles.slide}>
          <Image
            source={require('../../../../assets/images/background-onBoarding.png')}
            style={styles.backgroundImage}
          />
          <Image
            source={require('../../../../assets/images/onBoarding12.png')}
            style={styles.image3D2}
          />
          <Text style={styles.title3}>Chat with the Book</Text>
        </View>
      </Swiper>

      {/* Navigation Buttons */}
      <Animatable.View animation="bounceInDown" duration={2000}>
        <View style={styles.buttonContainer}>
          {currentIndex < 2 && (
            <>
              <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                <Text style={styles.skipText}>SKIP</Text>
                <Icon name="long-arrow-right" size={16} color="#000" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextText}>NEXT</Text>
                <Icon name="long-arrow-right" size={16} color="#fff" />
              </TouchableOpacity>
            </>
          )}
          {currentIndex === 2 && (
            <TouchableOpacity style={styles.nextButtonNew} onPress={() => navigation.replace('Register')}>
              <Text style={styles.nextText}>GET STARTED</Text>
              <Icon name="long-arrow-right" size={20} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </Animatable.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#000',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    // opacity: 0.8,
  },
  slide: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image3D1: {
    width: width * 0.8,
    height: width * 0.8,
    resizeMode: 'cover',
    marginBottom: height * 0.02, // Responsive marginBottom
  },
  image3D: {
    width: width * 0.9,
    height: width * 0.9,
    resizeMode: 'cover',
    marginBottom: height * 0.02, // Responsive marginBottom
  },
  image3D2: {
    width: width * 0.9,
    height: width * 0.9,
    resizeMode: 'cover',
    // marginBottom: height * 0.01,  
  },
 
  title: {
    fontSize: width * 0.1, // Responsive font size
    paddingHorizontal: width * 0.05, // Responsive horizontal padding
    paddingVertical: height * 0.02, // Responsive vertical padding
    textAlign: 'center',
    fontFamily: 'StardosStencil-Bold',
    color: '#000',
    marginBottom: height * 0.1, // Responsive marginBottom
  },
  title3: {
    fontSize: width * 0.11, // Responsive font size
    paddingHorizontal: width * 0.05, // Responsive horizontal padding
    paddingVertical: height * 0.02, // Responsive vertical padding
    textAlign: 'center',
    fontFamily: 'StardosStencil-Bold',
    color: '#000',
    marginBottom: height * 0.1, // Responsive marginBottom
  },
  paginationStyle: {
    bottom: height * 0.15, // Adjust dot position above the buttons
  },
  dotStyle: {
    width: width * 0.03,
    height: width * 0.03,
    backgroundColor: '#fff',
    borderRadius: width * 0.04,
    borderWidth:2,
    borderColor:"#1777FF",
  },

  activeDotStyle: {
    width: width * 0.05,
    height: width * 0.05,
    borderRadius: width * 0.04,
    backgroundColor: '#1777FF',
    borderWidth:3,
    borderColor:"#fff",
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width * 0.8,
    position: 'absolute',
    bottom: height * 0.03,
    left: width * 0.1,
    gap: width * 0.05, // Responsive gap
  },
  skipButton: {
    flex: 1,
    height: height * 0.06, // Responsive height
    borderRadius: width * 0.09, // Responsive borderRadius
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'black',
    justifyContent: 'center',
    flexDirection:"row",
    gap:7,
    alignItems: 'center',
  },
  skipText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: width * 0.04, // Responsive font size
  },
  nextButton: {
    flex: 1,
    height: height * 0.06, // Responsive height
    borderRadius: width * 0.09, // Responsive borderRadius
    backgroundColor: '#1777FF',
    justifyContent: 'center',
    flexDirection:"row",
    gap:7,
    alignItems: 'center',
  },
  nextButtonNew: {
    flex: 1,
    height: height * 0.06, // Responsive height
    borderRadius: width * 0.09, // Responsive borderRadius
    backgroundColor: '#1777FF',
    justifyContent: 'center',
    flexDirection:"row",
    gap:10,
    alignItems: 'center',
  },
  nextText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.04, // Responsive font size
  },
});

export default OnBoardingScreen;
