
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
  ToastAndroid,
  BackHandler,
} from 'react-native';
import { API_URL } from '@env';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { GetAllBooks } from '../UserService/UserService';
import BookLoading from '../../Pages/Loading/BookLoading';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import Orientation from 'react-native-orientation-locker';

const { width, height } = Dimensions.get('window');



const DisplayAllBook = () => {
  const navigation = useNavigation();
  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backPressedOnce, setBackPressedOnce] = useState(false);
  
  useEffect(() => {
    Orientation.lockToPortrait();  // Locks the screen to portrait mode
  }, []);


  useEffect(() => {
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
  }, []);


 
  // Handle back button press only when this component is in focus
  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        if (backPressedOnce) {
          BackHandler.exitApp();
          return true;
        }
        setBackPressedOnce(true);
        ToastAndroid.showWithGravity(
          'Press again to close ChatWithBooks',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );

        setTimeout(() => {
          setBackPressedOnce(false);
        }, 3000); // Reset backPressedOnce after 3 seconds

        return true;
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

      return () => {
        // Remove the event listener when the component is unfocused or unmounted
        backHandler.remove();
      };
    }, [backPressedOnce])
  );

  const handleSearchPress = () => {
    navigation.navigate('DisplayBookByPagination', { focusSearch: true });
  };


  const BookCard = ({ book, onPressAdd, onPressView }) => (
    <View key={book.id} style={styles.bookCard}>
      <TouchableOpacity style={styles.bookCardNewBox} onPress={onPressView}>
        <View style={styles.imageBox}>
          <Image source={{ uri: `${API_URL}${book.image}` }} style={styles.bookImage} />
        </View>
        <Text style={styles.bookTitle} numberOfLines={2} ellipsizeMode="tail">
          {book?.name.charAt(0).toUpperCase() + book?.name.slice(1)}
        </Text>
        <Text style={styles.autherName} numberOfLines={1} ellipsizeMode="tail">
          {book?.auther_name.charAt(0).toUpperCase() + book?.auther_name.slice(1)}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.addButton} onPress={onPressAdd}>
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <TouchableOpacity style={styles.searchContainer} onPress={handleSearchPress}>
        <Icon name="search-outline" size={24} color="#000" style={styles.searchIcon} />
        <TextInput
          placeholder="Search By BookName..." 
          placeholderTextColor="#000"
          editable={false}
          style={styles.searchInput}
        />
        <Icon name="book-outline" size={24} color="#007BFF" style={styles.filterIcon} />
      </TouchableOpacity>

      {/* Main Content */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 85 }}>
        {/* Section 1 */}
        <View style={styles.header_box}>
          <Text style={styles.sectionTitle1}>Top recommendations for you</Text>
          <TouchableOpacity onPress={() => navigation.navigate('DisplayBookByPagination')}>
            <AntDesign style={styles.long_arrow_right} name="right" size={24} color="#000" />
          </TouchableOpacity>         
        </View>
        <View style={styles.sectionContainer}>
        {allBooks.recommended_books?.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {allBooks.recommended_books?.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onPressAdd={() => navigation.navigate('Subscription', { book })}
              onPressView={() => navigation.navigate('Chat', { book })}
            />
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

        {/* <View style={styles.horizontalLine} /> */}

        {/* Section 2 */}
        <View style={styles.header_box}>
          <Text style={styles.sectionTitle}>Trending books</Text>
          <TouchableOpacity onPress={() => navigation.navigate('DisplayBookByPagination')}>
            <AntDesign style={styles.long_arrow_right} name="right" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        <View style={styles.sectionContainer}>
        {allBooks.tranding_books?.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {allBooks.tranding_books?.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onPressAdd={() => navigation.navigate('Subscription', { book })}
              onPressView={() => navigation.navigate('Chat', { book })}
            />
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
        {/* <View style={styles.horizontalLine} /> */}

        {/* Section 3 */}
        <View style={styles.header_box}>
          <Text style={styles.sectionTitle}>Picks books for you</Text>
          <TouchableOpacity onPress={() => navigation.navigate('DisplayBookByPagination')}>
            <AntDesign style={styles.long_arrow_right}  name="right" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        <View style={styles.sectionContainer}>
        {allBooks.books?.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {allBooks.books?.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onPressAdd={() => navigation.navigate('Subscription', { book })}
              onPressView={() => navigation.navigate('Chat', { book })}
            />
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#dcdcdc',
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.001,
    marginHorizontal: width * 0.05,
    marginVertical: height * 0.02,
    elevation: 10,
  },
  searchIcon: {
    marginRight: width * 0.03,
  },
  searchInput: {
    flex: 1,
    fontSize: width * 0.045,
    borderLeftWidth: 1,
    borderLeftColor: "#C9C9C9",
    paddingLeft: width * 0.03,
    color: '#000',
  },
  filterIcon: {
    marginLeft: width * 0.03,
  },
  modalContainer: {
    flex: 1,
    top:90,
    alignItems:"flex-end",
    right:20,
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',  
  },
  modalContent: {
    width: width * 0.9,
    padding: height * 0.01,
    backgroundColor: 'white',
    borderRadius: 15,
    elevation: 10,
  },
  modalTitle: {
    fontSize: width * 0.06,
    fontWeight: '400',
    marginBottom: height * 0.02,
    paddingLeft:10,
    color: '#1777FF',

  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: height * 0.02,
  },
  genreButton: {
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.01,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth:1,
    fontFamily: "Mulish-Regular",
    borderColor:"#000",
    margin: width * 0.02,
  },
  selectedGenreButton: {
    borderColor: '#007BFF', 
    borderWidth:2,  
    elevation: 12,
  },
  genreText: {
    fontSize: width * 0.04,
    fontFamily:"Mulish-Bold",
    color: 'black',
  },
  selectedGenreText: {
    color: '#000',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap:10,
    marginTop: height * 0.01,
    marginBottom: height * 0.01,
  },
  cancelButtonMain:{
    backgroundColor:"#fff",
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.05,
    borderRadius:25,
    elevation:10,
  },
  cancelButton: {
    fontSize: width * 0.04,
    fontFamily: "Mulish-Regular",
    color: '#000',
  },
  applyButtonMain:{
    backgroundColor:"#1777FF",
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.05,
    borderRadius:25,
    elevation:10,
    },

  applyButton: {
    fontSize: width * 0.04,
    fontFamily: "Mulish-Regular",
    color:"#fff",
  },

  header_box:{
    justifyContent:"space-between",
    alignItems:"center",
    flexDirection:"row",
    paddingLeft:height * 0.01,
  },
  
 sectionContainer: {
    backgroundColor: "#f8f8f8",
    paddingHorizontal:width * 0.03,
    elevation:10
  },

  long_arrow_right:{
    padding:width *0.05
    },

  sectionTitle1: {
    fontSize: width * 0.055,
    fontWeight: '800',
    color: '#000',
    marginLeft: width * 0.05,
    marginVertical: height * 0.02
  },

  sectionTitle: {
    fontSize: width * 0.06,
    fontWeight: '800',
    color: '#000',
    marginLeft: width * 0.05,
    marginBottom: height * 0.025,
    marginTop: height * 0.025,
  },
 
  bookCard: {
    alignItems: 'center',
    justifyContent:"center",
    paddingVertical: height * 0.03,
    paddingHorizontal: width * 0.03,
    gap:height * 0.01
  },
  bookCardNewBox:{
    alignItems: 'center',
    justifyContent:"center",
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
    elevation:4
  },
  bookImage: {
    width: 115,
    height: 140,
    borderRadius: 10,
    resizeMode: 'Cover',
  },
  
  bookTitle: {
    fontSize: width * 0.042,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    maxWidth: width * 0.30,
    height: height * 0.06,
    overflow: 'hidden',
  },

  autherName: {
    fontSize: width * 0.036,
    color: '#8D8D8D',
    textAlign: 'center',
    maxWidth: width * 0.25, 
    height: height * 0.03,
    paddingTop: height * 0.003  ,
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
  horizontalLine: {
    borderBottomColor: '#d2d2d2',
    borderBottomWidth: 1,
    marginVertical: height * 0.02,
    marginHorizontal: width * 0.05,
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

export default DisplayAllBook;


