import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
 

const NetworkStatus = () => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleRetry = () => {
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected);
    });
  };

  if (isConnected) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <Image
          source={require('../../../../assets/images/celltower.png')} // Update this with your image path
          style={styles.image}
        />
        <Text style={styles.title}>Oops</Text>
        <Text style={styles.subtitle}>No Internet Connection.</Text>
        <Text style={styles.subtitle}>Please check your network.</Text>
        <TouchableOpacity onPress={handleRetry} style={styles.button}>
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent black background
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    height: "100%",
    width:"100%",
    borderRadius: 10,
  },
  image: {
    width: width * 0.5, // responsive width
    height: width * 0.5, // keep aspect ratio
    marginBottom: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  button: {
    marginTop: 60,
    paddingVertical: 15,
    paddingHorizontal: 40,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NetworkStatus;
