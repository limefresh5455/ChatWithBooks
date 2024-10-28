import React, { useEffect, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';
import Orientation from 'react-native-orientation-locker';  
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconFeather from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-crop-picker'; 
import { API_URL } from '@env';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { updateUserProfileService } from '../UserService/UserService';
import BookLoading from '../../Pages/Loading/BookLoading';
import { getUserProfileService } from '../UserService/UserService';

const { width, height } = Dimensions.get('window');

const UserProfile = () => {
  const navigation=useNavigation()
  // const [selectedImage, setSelectedImage] = useState(null);
  const [userDetails,setUserDetails]=useState({username:"",avatar:"",user_id:"",email:""})
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    Orientation.lockToPortrait();  // Locks the screen to portrait mode
  }, []);
 
  useEffect(() => {
    getUserDetails();
  }, []);
  
  const getUserDetails = async () => {
    try {
      setIsLoading(true)
      const response = await getUserProfileService();
      console.log(response.data,"profileDetails")
      if (response.status === 200) {
        setIsLoading(false)
        setUserDetails(response.data)
      }
    } catch (error) {
      setIsLoading(false)
      const { status } = error.response || {};
      const message = error.response?.data?.detail;
      if (status === 401) {
        Toast.show({ type: 'error', text1: 'Unauthorized', text2: message || 'Your session has expired. Please log in again.',});
        navigation.navigate('Logout');
      }
      console.log('Error fetching getUserProfile Details', error.response);
    }
  };

  const handleEditImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      mediaType: 'photo',
      cropperCircleOverlay: true,
      compressImageQuality: 0.7,
      includeBase64: true,   
    }).then(image => {
      // setSelectedImage(image.path);  
      handleUpdateImage(image);     
    }).catch(error => {
      console.log('Error picking image:', error);
    });
  };

  const handleUpdateImage = async (image) => {
    try {
      const formData = new FormData();
      formData.append('avatar', {
        uri: image.path,
        type: image.mime,
        name: image.filename || 'profile.jpg',
      });
      setIsLoading(true)
      const response = await updateUserProfileService(formData);
      console.log(response.data,"Update Profile Details")
      if (response.status === 200 || response.status === 201) {
        setIsLoading(false)
        setUserDetails((prev) => ({...prev, avatar: response.data?.data.avatar,}));
      }
    } catch (error) {
        setIsLoading(false)
      const { status } = error.response || {};
      const message = error.response?.data?.detail;
      if (status === 401) {
        Toast.show({ type: 'error', text1: 'Unauthorized', text2: message || 'Your session has expired. Please log in again.',});
        navigation.navigate('Logout');
      }
      console.log('Error fetching getUserProfile Details', error.response);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../../../../assets/images/profile-background.png')} style={styles.backgroundImage} /> 
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.profileSection}>
          <View style={styles.profileImageWrapper}>
            {/* <Image 
              source={selectedImage ? { uri: selectedImage } : require('../../../../assets/images/profileimage.png')} 
              style={styles.profileImage}
            /> */}
             {userDetails.avatar ? <Image source={{ uri: `${API_URL}/${userDetails.avatar}` }} style={styles.profileImage} /> : <Image source={require('../../../../assets/images/profileimage.png')} style={styles.profileImage}/> }
            {/* Edit Icon */}
            <TouchableOpacity style={styles.editIconWrapper} onPress={handleEditImage}>
              <IconFeather name="edit" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{userDetails?.username.charAt(0).toUpperCase() + userDetails?.username.slice(1)}</Text>
          {/* Full Name Label and Input */}
          <Text style={styles.inputLabel}>Full Name</Text>
          <TextInput
            placeholder="Full Name"
            placeholderTextColor="#000"
            style={styles.input}
            value={userDetails.username}
            onChangeText={(text)=>setUserDetails({...userDetails,username: text})}
            editable={false} 
          />

          {/* Email Label and Input */}
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#000"
            style={styles.input}
            value={userDetails.email}
            onChangeText={(text)=>setUserDetails({...userDetails,email: text})}
            editable={false} 
          />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate('Logout')}>
          <View style={styles.gradientButton}>
            <View style={styles.logoutContent}>
              <Text style={styles.logoutText}>LOG OUT</Text>
              <Icon name="logout" size={20} color="#000" style={styles.icon} />
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
      {isLoading && <BookLoading />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
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
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: width * 0.05,
    gap: height * 0.05
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: height * 0.05,
  },
  profileImageWrapper: {
    position: 'relative',
  },
  profileImage: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: (width * 0.3) / 2,
    // marginBottom: height * 0.01,
  },
  editIconWrapper: {
    position: 'absolute',
    bottom: height * 0.002,  
    right: width * 0.02,  
    backgroundColor: '#1777FF',
    borderRadius: width * 0.05,  
    padding: width * 0.015,  
  },
  userName: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: height * 0.03,
    marginTop: height * 0.01,
  },
  inputLabel: {
    width: width * 0.8,
    fontSize: width * 0.04,
    color: '#000',
    marginBottom: height *0.015,
    fontWeight:"700",
    alignSelf: 'flex-start',
  },
  input: {
    width: width * 0.8,
    height: height * 0.06,
    borderColor: '#ccc',
    color:"#000",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: height * 0.02,
    fontSize: width * 0.04,
    // backgroundColor: '#f9f9f9',
  },
  logoutButton: {
    width: width * 0.8,
    height: height * 0.06,
    marginTop: height * 0.03,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#1777FF",
    overflow: 'hidden',
    marginBottom: height * 0.05,
  },
  gradientButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center', // Centers the icon and text vertically
  },
  logoutText: {
    fontSize: width * 0.035,
    color: '#000',
    fontWeight: '600',
    marginRight: 8, // Adds spacing between text and icon
  },
  icon: {
    color: "#1777FF",
  },
});

export default UserProfile;
