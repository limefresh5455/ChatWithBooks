import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import Video from 'react-native-video'; // Import Video from react-native-video
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Orientation from 'react-native-orientation-locker';

const {width, height} = Dimensions.get('window');

const WelcomePage = () => {
  const navigation = useNavigation(); // Initialize navigation

  useEffect(() => {
    Orientation.lockToPortrait();  // Locks the screen to portrait mode
  }, []);


  return (
    <SafeAreaView style={styles.container}>
      <Video
        source={require('../../../../assets/videos/back-Videos.mp4')} // Replace with your video path
        style={styles.backgroundVideo}
        resizeMode="cover"
        repeat={true} // To make the video loop
        muted={true} // To mute the video
      />
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Text style={styles.title}>
            Escape into the pages of timeless tales
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('OnBoradingScreen')}>
            <Text style={styles.buttonText}>
              LET'S START{' '}
              <Icon name="long-arrow-right" size={18} color="#fff" />
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // Fill the parent container
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent black
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: width * 0.11,
    lineHeight: width * 0.14,
    fontFamily: 'StardosStencil-Bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: height * 0.04,
  },
  button: {
    backgroundColor: '#1777FF',
    textAlign: 'center',
    alignItems: 'center',
    width: '100%',
    paddingVertical: height * 0.02,
    borderRadius: 50,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontFamily: 'Mulish-Bold',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default WelcomePage;
