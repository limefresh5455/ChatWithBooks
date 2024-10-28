import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Image,
  FlatList,
  Modal,
  Pressable
} from 'react-native';
import { API_URL } from '@env';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { GetAllBooksByPagination } from '../UserService/UserService';
import BookLoading from '../../Pages/Loading/BookLoading';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import Orientation from 'react-native-orientation-locker';

const { width, height } = Dimensions.get('window');

const DisplayBookByPagination = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const searchInputRef = useRef(null);
  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false); 
  const [lastPageReached, setLastPageReached] = useState(false); // New state for last page
  const [page, setPage] = useState(1); 
  const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility
  const [selectedGenres, setSelectedGenres] = useState([]); 
  const [appliedGenres, setAppliedGenres] = useState([]); 
  const [search, setSearch] = useState(""); 
  const genres = [
    'Math', 'Story', 'Magic', 'Action', 'Comedy', 'Horror',
    'Psychology', 'Thriller', 'Adventure', 'Daily Life'
  ];

  useEffect(() => {
    Orientation.lockToPortrait();  // Locks the screen to portrait mode
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (route.params?.focusSearch) {
        searchInputRef.current?.focus();
      }
    }, [route.params?.focusSearch])
  );


  useFocusEffect(
    useCallback(() => {
      // setAllBooks([]);
      setPage(1);
      setLastPageReached(false);
    }, [search, appliedGenres])
  );
  
  useEffect(() => {
    if (page === 1) {
      getAllBooksByPagination();
    }
  }, [page, search, appliedGenres]);
  
  useEffect(() => {
    if (page > 1) {
      getAllBooksByPagination();
    }
  }, [page]);
  

  console.log(appliedGenres,"appliedGenres")
  console.log(selectedGenres,"selectedGenres")
  console.log(page,"page")
  console.log(allBooks.length,"allBooks.length")

 


  const getAllBooksByPagination = async () => {
    try {
      if (loadingMore || lastPageReached) return; // Prevent loading if last page is reached
      setLoadingMore(true);
      const genreQuery = selectedGenres.map(genre => `genre=${genre.toLowerCase()}`).join('&'); 
      const response = await GetAllBooksByPagination(page,search,genreQuery);
      if (response.status === 200 || response.status === 201) {
        const newBooks = response.data?.results?.books  || [];
        console.log(response.data,"response.data")
        console.log(newBooks,"newBooks")

        if (newBooks?.length === 0) {
          setLastPageReached(true); // No more pages
        } else {
          // setAllBooks(prevBooks => [...prevBooks, ...newBooks]);
          setAllBooks(prevBooks => (page === 1 ? newBooks : [...prevBooks, ...newBooks]));
        }

        setLoading(false);
      }
      setLoadingMore(false);
    } catch (error) {
      setLoading(false);
      setLoadingMore(false);
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
      console.log('Error fetching getAllBooksByPagination', error);
    }
  };

  // Function to load more books
  // const loadMoreBooks = () => {
  //   if (!loadingMore && !lastPageReached) {
  //     setPage(prevPage => prevPage + 1); // Increase page number only if more pages exist
  //   }
  // };

  const loadMoreBooks = () => {
    if (!loadingMore && !lastPageReached) {
      setPage((prevPage) => prevPage + 1); // Correctly increase page only if more pages exist
    }
  };
  

  const handleSelectGenre = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

 

    // Apply genres when 'Apply' button is clicked
    const getBooksByGenres = () => {
      setPage(1);   
      setAppliedGenres(selectedGenres);  
      setSelectedGenres([])
      setModalVisible(false); 
    };
  
 

  const renderBook = ({ item: book }) => (
    <View key={book.id} style={styles.bookCard}>
      <TouchableOpacity style={styles.bookCardNewBox} onPress={() => navigation.navigate('Chat', { book: book })}>
        <View style={styles.imageBox}>
          <Image
            source={{ uri: `${API_URL}${book.image}` }}
            style={styles.bookImage}
          />
        </View>
        <Text style={styles.bookTitle} numberOfLines={2} ellipsizeMode="tail">
          {book?.name ? book.name.charAt(0).toUpperCase() + book.name.slice(1) : 'Unknown Book'}
        </Text>
        <Text style={styles.AutherName} numberOfLines={1} ellipsizeMode="tail">
          {book?.auther_name ? book.auther_name.charAt(0).toUpperCase() + book.auther_name.slice(1) : 'Unknown Author'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('Subscription', { book: book })}>
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name="search-outline" size={24} color="#000" style={styles.searchIcon} />
        <TextInput
          ref={searchInputRef}
          placeholder="Search By BookName..."
          placeholderTextColor="#000"
          style={styles.searchInput}
          value={search}
          onChangeText={(text)=>setSearch(text)}
        />
        <Icon name="options-outline" size={24} color="#000" style={styles.filterIcon} onPress={() => setModalVisible(true)} />
      </View>
                {/* Genre Selection Modal */}
        <Modal  animationType="slide" transparent={true}visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <Pressable style={styles.modalContainer} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Genre</Text>
            <View style={styles.genreContainer}>
              {genres.map((genre) => (
                <TouchableOpacity
                  key={genre}
                  style={[
                    styles.genreButton,
                    selectedGenres.includes(genre) && styles.selectedGenreButton,
                  ]}
                  onPress={() => handleSelectGenre(genre)}
                >
                  <Text
                    style={[
                      styles.genreText,
                      selectedGenres.includes(genre) && styles.selectedGenreText,
                    ]}
                  >
                    {genre}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalActions}>
              <Pressable onPress={() => setModalVisible(false)} style={styles.cancelButtonMain}>
                <Text style={styles.cancelButton}>Cancel</Text>
              </Pressable>
              <Pressable onPress={getBooksByGenres} style={styles.applyButtonMain}>
                <Text style={styles.applyButton}>Apply</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>


      <FlatList
        data={allBooks}
        keyboardShouldPersistTaps="handled"
        renderItem={renderBook}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        numColumns={2}
        contentContainerStyle={{ paddingBottom: 90 }}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMoreBooks} // Trigger load more
        onEndReachedThreshold={0.2} // Load more when user scrolls near the end
        ListFooterComponent={loadingMore ? <BookLoading /> : null} // Show loading spinner while fetching
        ListEmptyComponent={
        !loading && (
            <View style={styles.noBooksContainer}>
              <Image
                source={require('../../../../assets/images/NoBook.png')} // Replace with a relevant image URL or local image
                style={styles.noBooksImage}
              />
            </View>
          )
        }
      />
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
    paddingHorizontal:height * 0.01
  },
  
 sectionContainer: {
    backgroundColor: "#f8f8f8",
    paddingHorizontal:width * 0.025,
  },
  sectionTitle1: {
    fontSize: width * 0.055,
    fontWeight: '800',
    color: '#000',
    marginLeft: width * 0.05,
    marginVertical: height * 0.015
  },
    long_arrow_right:{
    padding:width *0.05
    },
  sectionTitle: {
    fontSize: width * 0.06,
    fontWeight: '800',
    color: '#000',
    marginLeft: width * 0.05,
    marginBottom: height * 0.02,
    marginTop: height * 0.02,
  },
 
  bookCard: {
    flex: 1,
    margin: width * 0.025,
    alignItems: 'center' ,
    justifyContent: 'center',
    paddingVertical: height * 0.03,
    backgroundColor:"#F5F5F5BF",
    width: 230,
    height: 330,
    
  },
  
  bookCardNewBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageBox: {
    width: 170,
    height: 190,
    borderWidth: 1,
    borderColor: "#CACACA",
    justifyContent: "center",
    backgroundColor: "#fff",
    alignItems: "center",
    marginBottom: height * 0.01,
    borderRadius: 10,
    elevation:2
  },
  bookImage: {
    width: 150,
    height: 170,
    borderRadius: 10,
    resizeMode: 'Cover',
  },
  bookTitle: {
    fontSize: width * 0.042,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    maxWidth: width * 0.4,
    height: height * 0.06,
    overflow: 'hidden',
  },
  AutherName: {
    fontSize: width * 0.036,
    color: '#8D8D8D',
    textAlign: 'center',
    maxWidth: width * 0.35,
    height: height * 0.03,
    marginVertical: height * 0.005,
    overflow: 'hidden',
  },
  addButton: {
    backgroundColor: '#007BFF',
    alignItems:"center",
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 20,
    maxWidth: width * 0.4,
    paddingVertical: height * 0.006,
    paddingHorizontal: width * 0.09,
    marginTop:height * 0.01
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: width * 0.034,
  },
  noBooksContainer: {
    justifyContent:"center",
    alignItems: 'center',
    marginVertical: height * 0.02,
  },
  noBooksImage: {
    width: width * 0.9,  
    height: height * 0.4, 
    resizeMode: 'cover',
  },
  
});

 

export default DisplayBookByPagination
