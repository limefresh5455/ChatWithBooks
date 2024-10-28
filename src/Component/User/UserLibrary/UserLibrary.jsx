import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
} from 'react-native';
import { API_URL } from '@env';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GetAllBooks } from '../UserService/UserService';
import AntDesign from 'react-native-vector-icons/AntDesign';
import BookLoading from '../../Pages/Loading/BookLoading';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useAuth } from '../../ContextApi/AuthContext/AuthContext';
import Orientation from 'react-native-orientation-locker';

const { width, height } = Dimensions.get('window');

const UserLibrary = () => {
  const navigation = useNavigation();
  const { users } = useAuth();
  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    Orientation.lockToPortrait();  // Locks the screen to portrait mode
  }, []);

 

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<Image key={i} source={require('../../../../assets/images/fullStar.png')} style={styles.starStyle} />);
      } else if (i - rating === 0.5) {
        stars.push(<Image key={i} source={require('../../../../assets/images/halfStar.png')} style={styles.starStyle} />);
      } else {
        stars.push(<Image key={i} source={require('../../../../assets/images/emptyStar.png')} style={styles.starStyle} />);
      }
    }
    return <View style={styles.starContainer}>{stars}</View>;
  };


  useFocusEffect(
    useCallback(() => {
    const getAllBooks = async () => {
      try {
        setLoading(true);
        const response = await GetAllBooks();
        if (response.status === 200 || response.status === 201) {
          setLoading(false);
          setAllBooks(response.data);
        }
      } catch (error) {
        setLoading(false);
        const { status } = error.response || {};
        const message = error.response?.data?.detail;
        if (status === 401) {
          Toast.show({
            type: 'error',
            text1: 'Unauthorized',
            text2: message || 'Your session has expired. Please log in again.',
          });
          navigation.navigate('Logout');
        }
        console.log('Error fetching getAllBooks', error.response);
      }
    };
    getAllBooks();
  }, []));

 

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 85 }}>
        <Text style={styles.sectionTitle1}>Hi <Text style={styles.userName}>{users?.user?.name.charAt(0).toUpperCase() + users?.user?.name.slice(1)}</Text> </Text>
        {/* <Text style={styles.sectionsubTitle}>Here are your choices waiting....</Text> */}
        <Text style={styles.sectionsubTitle}>Your Purchased Books Are Available Here.</Text>
        <View style={styles.sectionContainerlaibrary}>
        {allBooks.subscriptions?.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {allBooks.subscriptions?.map((subscription) => (
                <View key={subscription.book.id} style={styles.bookCardNew}>
                <TouchableOpacity style={styles.bookCardNewBox} onPress={() => navigation.navigate('Chat', { book: subscription.book })}>
                  <View style={styles.imageBoxNew}>
                    <Image
                      source={{ uri: `${API_URL}${subscription.book.image}` }} // Assuming the image URL exists in your data
                      style={styles.bookImage1}
                    />
                  </View>
                  <Text style={styles.bookTitle} numberOfLines={2} ellipsizeMode="tail">
                    {subscription.book?.name.charAt(0).toUpperCase() + subscription.book?.name.slice(1)}
                  </Text>
                  <Text style={styles.AutherName} numberOfLines={1} ellipsizeMode="tail">
                    {subscription.book?.auther_name.charAt(0).toUpperCase() + subscription.book?.auther_name.slice(1)}
                  </Text>
                  <View>{renderStars(4)}</View>
                  </TouchableOpacity>
                </View>
              ))}
          </ScrollView>
        ) : (
        <View style={styles.noBooksContainer}>
        <Image
          source={require('../../../../assets/images/NoBook.png')} // Replace with a relevant image URL or local image
          style={styles.noBooksImage}
        />
      </View>
        )}
        </View>

     

        <View style={styles.header_box}>
          <Text style={styles.sectionTitle}>Top recommendations for you</Text>
          <TouchableOpacity  onPress={() => navigation.navigate('DisplayBookByPagination')}>
            <AntDesign style={styles.long_arrow_right} name="right" size={24} color="#000" />
          </TouchableOpacity>         
        </View>
        <View style={styles.sectionContainer}>
        {allBooks.tranding_books?.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {allBooks.tranding_books?.map((book) => (
              <View key={book.id} style={styles.bookCardNew}>
              <TouchableOpacity style={styles.bookCardNewBox} onPress={() => navigation.navigate('Chat', { book: book })}>
                <View style={styles.imageBox}>
                  <Image
                    source={{ uri: `${API_URL}${book.image}` }}
                    style={styles.bookImage1}
                  />
                </View>
                <Text style={styles.bookTitle} numberOfLines={2} ellipsizeMode="tail">{book?.name.charAt(0).toUpperCase() + book?.name.slice(1)}</Text>
                <Text style={styles.AutherName} numberOfLines={1} ellipsizeMode="tail">{book?.auther_name.charAt(0).toUpperCase() + book?.auther_name.slice(1)}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.addButton}   onPress={() => navigation.navigate('Subscription', { book: book })}>
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        ) : (
        <View style={styles.noBooksContainer}>
        <Image
          source={require('../../../../assets/images/NoBook.png')} // Replace with a relevant image URL or local image
          style={styles.noBooksImage}
        /> 
        </View>
        )}
        </View>
      </ScrollView>
      {loading && <BookLoading />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  userName: {
    color: "#007BFF",
  },
  sectionContainerlaibrary: {
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.03,
  },
  header_box:{
    justifyContent:"space-between",
    alignItems:"center",
    flexDirection:"row",
    paddingHorizontal:height * 0.01
  },
  long_arrow_right:{
    padding:width *0.01
    },
  sectionTitle1: {
    fontSize: width * 0.08,
    fontWeight: '800',
    color: '#000',
    marginLeft: width * 0.05,
    marginTop: height * 0.02
  },
  sectionContainer: {
    backgroundColor: "#f8f8f8",
    paddingHorizontal:width * 0.03,
    elevation:10
  },
  sectionsubTitle: {
    fontSize: width * 0.048,
    color: '#000',
    fontWeight:"semibold",
    marginLeft: width * 0.05,
    marginBottom: height * 0.01
  },
 
  sectionTitle: {
    fontSize: width * 0.055,
    fontWeight: '800',
    color: '#000',
    marginLeft: width * 0.05,
    marginTop: height * 0.025,
    marginBottom: height * 0.025,
  },
  bookCardNew: {
    alignItems: 'center',
    justifyContent:"center",
    paddingVertical: height * 0.03,
    paddingHorizontal: width * 0.03,
    // elevation:0.5,
  },
  bookCardNewBox:{
    alignItems: 'center',
    justifyContent:"center",
  },
  bookCard: {
    alignItems: 'center',
    paddingVertical: height * 0.03,
    paddingHorizontal: width * 0.03,
  },
  imageBoxNew: {
    width: 140,
    height: 160,
    borderWidth: 1,
    borderColor: "#CACACA",
    justifyContent: "center",
    backgroundColor: "#fff",
    alignItems: "center",
    marginBottom: height * 0.01,
    borderRadius: 10,
    elevation:6
  },
  imageBox: {
    width: 140,
    height: 160,
    borderWidth: 1,
    borderColor: "#CACACA",
    justifyContent: "center",
    backgroundColor: "#fff",
    alignItems: "center",
    marginBottom: height * 0.01,
    borderRadius: 10,
    elevation:6
  },
  
  bookImage1: {
    width: 115,
    height: 140,
    borderRadius: 10,
    resizeMode: 'Cover',
  },
   
  bookTitle: {
    fontSize: width * 0.042, // Slightly larger
    fontWeight: '700',
    color: '#000',
    textAlign:"center",
    maxWidth: width * 0.30, // Dynamic max width
    height: height * 0.06,
    overflow: 'hidden',
  },
  AutherName: {
    fontSize: width * 0.036,
    color: '#8D8D8D',
    textAlign: 'center',
    maxWidth: width * 0.25, // Dynamic max width
    height: height * 0.03,
    marginVertical: height * 0.005,
    overflow: 'hidden',
  },
  addButton: {
    backgroundColor: '#007BFF',
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 20,
    paddingVertical: height * 0.005,
    paddingHorizontal: width * 0.07,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: width * 0.034,
  },
  starStyle: {
    width: 15,
    height: 15,
    objectFit:"cover",
  },
  starContainer: {
    flexDirection: 'row',
  },
  noBooksContainer: {
    alignItems: 'center',
    marginVertical: height * 0.02,
  },
  noBooksImage: {
    width: width * 0.9,  // 50% of the screen width
    height: height * 0.3,  // 25% of the screen height
    resizeMode: 'cover',
  },
 
 
});

export default UserLibrary;
