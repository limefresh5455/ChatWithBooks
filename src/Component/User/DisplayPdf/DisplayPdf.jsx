import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Alert, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { API_URL } from '@env';
import Pdf from 'react-native-pdf';
import BookLoading from '../../Pages/Loading/BookLoading';
import { GetAllBooks } from '../UserService/UserService';
import Toast from 'react-native-toast-message';
import { captureRef } from 'react-native-view-shot';
import ImageCropPicker from 'react-native-image-crop-picker';
import Orientation from 'react-native-orientation-locker';
import RNFS from 'react-native-fs';

const { width, height } = Dimensions.get('window');

const DisplayPdf = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const book = route.params?.book;
  const pdfUrl = `${API_URL}${book?.pdf}`;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageNumberInput, setPageNumberInput] = useState(""); 
  const [loading, setLoading] = useState(true);
  const [allBooks, setAllBooks] = useState([]);
  const pdfRef = React.useRef(null);
  const pageInputRef = React.useRef(null);

  useEffect(() => {
    Orientation.lockToPortrait();  // Locks the screen to portrait mode
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
    }, [])
  );

  useEffect(() => {
    setPageNumberInput(String(currentPage)); // Set input to current page on mount and when currentPage changes
  }, [currentPage]);

  useEffect(() => {
    const getAllBooks = async () => {
      try {
        const response = await GetAllBooks();
        if (response.status === 200 || response.status === 201) {
          setAllBooks(response.data?.subscriptions);
        }
      } catch (error) {
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

  const toggleSelection = async() => {
    try {
      const uri = await captureRef(pdfRef, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',  
      });
      console.log('Captured URI:', uri);
      const imageurl = await ImageCropPicker.openCropper({
        height: height, // Desired height for HD quality
        width: width,  // Desired width for HD quality
        path: uri,
        cropperCircleOverlay: false,
        cropping: true,
        cropperToolbarTitle: 'Crop',
        freeStyleCropEnabled: true,
        cropperToolbarColor: '#1777FF'
      });
 
      const base64Image = await RNFS.readFile(imageurl.path, 'base64'); 
      const formattedImage = `data:image/png;base64,${base64Image}`;
      navigation.navigate("Chat", { capturedImage: formattedImage, book: book, currentPage: currentPage });
    } catch (error) {
      console.log('Error capturing or cropping image:', error);
    }
  }

  const isBookSubscribed = (allBooks) => {
    if (Array.isArray(allBooks)) {
      return allBooks.some(sub => sub.book.id === book.id);
    }
    return false;
  };

  const handlePageChange = (page, numberOfPages) => {
    setCurrentPage(page);
    setTotalPages(numberOfPages);
    setPageNumberInput(String(page)); 
    
    if (page > 50 && !isBookSubscribed(allBooks)) {
      Alert.alert(
        "Page Limit Reached",
        "You can only read up to 50 pages. Please subscribe to continue reading.",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Subscribe",
            onPress: () => navigation.navigate('Subscription', { book }) // Navigate to Subscription page
          }
        ]
      );
      setCurrentPage(50); 
      pdfRef.current.setPage(50); 
      return;
    }
  };

  const handleFindPage = () => {
    pageInputRef.current.focus();
  };

  const handlePageInputChange = (text) => {
    const pageNumber = parseInt(text);
    setPageNumberInput(text); 
    if (pageNumber > totalPages) {
      Alert.alert('Invalid Page Number', `Please enter a number between 1 and ${totalPages}`);
    }
    if (!isNaN(pageNumber) && pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setLoading(true);
      pdfRef.current.setPage(pageNumber); 
    }   
  };

  return (
    <View style={styles.container}>
      {currentPage === 1 && (
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Icon name="arrow-back" size={width * 0.045} color="#fff" style={styles.icon} />
            </TouchableOpacity>
            <Text style={styles.headerText}>{book?.name ? book.name.charAt(0).toUpperCase() + book.name.slice(1) : 'Unknown Book'}</Text>
            <Text style={styles.subText}> By {book?.auther_name ? book.auther_name.charAt(0).toUpperCase() + book.auther_name.slice(1) : 'Unknown Author'}</Text>
          </View>
          <Image source={{ uri: `${API_URL}/${book.image}` }} style={styles.thumbnail} />
        </View>
      )}

      {loading && <BookLoading />}
      <View style={styles.pdfContainer}> 
        <Pdf
          ref={pdfRef}
          trustAllCerts={false}
          source={{ uri: pdfUrl, cache: true }}
          onLoadComplete={(numberOfPages) => {
            console.log(`Number of pages: ${numberOfPages}`);
            setTotalPages(numberOfPages);
            setLoading(false);
          }}
          onPageChanged={handlePageChange}
          onError={(error) => {
            console.log(error);
            setLoading(false);
          }}
          onPressLink={(uri) => {
            console.log(`Link pressed: ${uri}`);
          }}
          style={styles.pdf}
        />
      </View>

      <View style={styles.scrollIndicator}>
        <TextInput
          ref={pageInputRef} 
          style={styles.pageInput}
          keyboardType="numeric"
          value={pageNumberInput?.toString()} // Ensure the input value is a string
          onChangeText={handlePageInputChange}
          placeholder="Enter page number"
          placeholderTextColor="#999"
        />
        <Text style={styles.pageNumber}>
          / {totalPages}
        </Text>
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleFindPage}>
          <MaterialIcons name="find-in-page" size={26} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={toggleSelection}>
          <Icon name="crop" size={26} color="#fff" />
        </TouchableOpacity> 
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  actionContainer: {
    position: 'absolute',
    bottom: height * 0.04, // Adjust to position the buttons higher or lower
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05,
  },
  actionButton: {
    backgroundColor: '#1777FF',
    borderRadius: 30,
    padding: 18,
    elevation: 3,
  },
 
  scrollIndicator: {
    position: 'absolute',
    bottom: height * 0.04,
    alignSelf: 'center',
    backgroundColor: '#d2d2d2',
    paddingVertical: height * 0.006, 
    paddingHorizontal: width * 0.04, 
    borderRadius: 30,
    elevation: 8,
    flexDirection: 'row',  
    alignItems: 'center', 
    borderColor: '#1777FF',
    borderWidth: 2,
    minWidth: width * 0.3, 
    maxWidth: width * 0.9,  
  },

  pageNumber: {
    color: '#000',
    fontSize: width * 0.04, 
    fontWeight: 'bold',
    textAlign:"center"
  },

  pageInput: {
    height: height * 0.06, // Responsive height
    width: width * 0.1, // Responsive width
    borderColor: '#000',
    textAlign: "center",
    color: '#000',
    fontSize: width * 0.04, // Responsive font size
    fontWeight: 'bold',
  },

  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  container: {
    flex: 1,
    backgroundColor: '#EDEDED',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#1777FF',
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.05,
    position: 'relative',
    zIndex: 1,
    elevation: 2,
  },
  backButton: {
    width: width * 0.06,
    height: width * 0.06,
    borderRadius: width * 0.03,
    borderColor: "#fff",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    textAlign: 'center',
  },
  headerTextContainer: {
    flex: 1,
    gap:height * 0.005
  },
  headerText: {
    color: '#fff',
    fontSize: width * 0.055,
    fontWeight: '700',
    paddingTop: height * 0.005,
  },
  subText: {
    color: '#fff',
    fontSize: width * 0.035,
    fontFamily: "Mulish-Italic",
    paddingTop: height * 0.001,
  },
  thumbnail: {
    width: width * 0.2,
    height: width * 0.25,
    resizeMode: 'cover',
    borderRadius: width * 0.01,
  },
  pdfContainer: {
    // flex: 1,
    backgroundColor: '#fff',
    paddingTop: height * 0.01,
    width: "100%",
    height: "100%",
  },
  pdf: {
    width: "100%",
    height: "100%",
  },
});

export default DisplayPdf;









// import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Alert, TextInput, Button } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import { API_URL } from '@env';
// import Pdf from 'react-native-pdf';
// import BookLoading from '../../Pages/Loading/BookLoading';
// import { GetAllBooks } from '../UserService/UserService';
// import Toast from 'react-native-toast-message';
// import { captureRef } from 'react-native-view-shot';
// import ImageCropPicker from 'react-native-image-crop-picker';
// import { FloatingAction } from 'react-native-floating-action';
// import Orientation from 'react-native-orientation-locker';
// import RNFS from 'react-native-fs';

// const { width, height } = Dimensions.get('window');

// const DisplayPdf = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const book = route.params?.book;
//   const pdfUrl = `${API_URL}${book?.pdf}`;
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(0);
//   const [pageNumberInput, setPageNumberInput] = useState(""); 
//   const [loading, setLoading] = useState(true);
//   const [allBooks, setAllBooks] = useState([]);
//   const pdfRef = React.useRef(null);
//   const pageInputRef = React.useRef(null);

 
//   useEffect(() => {
//     Orientation.lockToPortrait();  // Locks the screen to portrait mode
//   }, []);

//   useFocusEffect(
//     React.useCallback(() => {
//       setLoading(true);
//     }, [])
//   );

//   useEffect(() => {
//     setPageNumberInput(String(currentPage)); // Set input to current page on mount and when currentPage changes
//   }, [currentPage]);

//   useEffect(() => {
//     const getAllBooks = async () => {
//       try {
//         // setLoading(true);
//         const response = await GetAllBooks();
//         if (response.status === 200 || response.status === 201) {
//           // setLoading(false);
//           setAllBooks(response.data?.subscriptions);
//         }
//       } catch (error) {
//         // setLoading(false);
//         const { status } = error.response || {};
//         const message = error.response?.data?.detail;
//         if (status === 401) {
//           Toast.show({
//             type: 'error',
//             text1: 'Unauthorized',
//             text2: message || 'Your session has expired. Please log in again.',
//           });
//           navigation.navigate('Logout');
//         }
//         console.log('Error fetching getAllBooks', error.response);
//       }
//     };
//     getAllBooks();
//   }, []);


//   const toggleSelection = async() => {
//     try {
//             const uri = await captureRef(pdfRef, {
//               format: 'png',
//               quality: 1,
//               result: 'tmpfile',  
//             });
//             console.log('Captured URI:', uri);
//         const imageurl= await ImageCropPicker.openCropper({
//               height: 1480, // Desired height for HD quality
//               width: 1920,  // Desired width for HD quality
//               path: uri,
//               cropperCircleOverlay: false,
//               cropping: true,
//               cropperToolbarTitle: 'Crop',
//               freeStyleCropEnabled: true,
//                cropperToolbarColor: '#1777FF'
//             });
//             const base64Image = await RNFS.readFile(imageurl.path, 'base64'); 
//             const formattedImage = `data:image/png;base64,${base64Image}`;
//             navigation.navigate("Chat", { capturedImage: formattedImage, book: book, currentPage: currentPage });
      
//           } catch (error) {
//             console.log('Error capturing or cropping image:', error);
//           }
//     }
 



// const isBookSubscribed = (allBooks) => {
//   // Check if allBooks is an array
//   if (Array.isArray(allBooks)) {
//     return allBooks.some(sub => sub.book.id === book.id);
//   }
//   return false;
// };

 
// const handlePageChange = (page, numberOfPages) => {
//   setCurrentPage(page);
//   setTotalPages(numberOfPages);
//   setPageNumberInput(String(page)); 
  
//   if (page > 50 && !isBookSubscribed(allBooks)) {
//     Alert.alert(
//       "Page Limit Reached",
//       "You can only read up to 50 pages. Please subscribe to continue reading.",
//       [
//         {
//           text: "Cancel",
//           style: "cancel"
//         },
//         {
//           text: "Subscribe",
//           onPress: () => navigation.navigate('Subscription', { book }) // Navigate to Subscription page
//         }
//       ]
//     );
//     // Prevent navigating beyond page 50 if not subscribed
//     setCurrentPage(50); 
//     pdfRef.current.setPage(50); 
//     return;
//   }
 
// };

 

// const handleFindPage = () => {
//   pageInputRef.current.focus();
// };

// const handlePageInputChange = (text) => {
//   const pageNumber = parseInt(text);
//   setPageNumberInput(text); 
//   if(pageNumber > totalPages){
//     Alert.alert('Invalid Page Number', `Please enter a number between 1 and ${totalPages}`);
//   }
//   if (!isNaN(pageNumber) && pageNumber > 0 && pageNumber <= totalPages) {
//     setCurrentPage(pageNumber);
//     setLoading(true);
//     pdfRef.current.setPage(pageNumber); 
//   }   
// };

 

//  // Actions for FloatingAction button
//  const actions = [
//   {
//     text: 'Crop',
//     icon: <Icon name="crop" size={26} color="#fff" />,
//     name: 'bt_crop',
//     position: 1,
//     color: '#1777FF',
//     buttonSize:55
//   },
//   {
//     text: 'Find Page',
//     icon: <MaterialIcons name="find-in-page" size={26} color="#fff" />,
//     name: 'bt_find_page',
//     position: 2,
//     color: '#1777FF',
//     buttonSize:55
//   }
// ];


//   return (
//     <View style={styles.container}>
//       {currentPage === 1 && (
//         <View style={styles.header}>
//           <View style={styles.headerTextContainer}>
//             <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//               <Icon name="arrow-back" size={width * 0.045} color="#fff" style={styles.icon} />
//             </TouchableOpacity>
//             <Text style={styles.headerText}>{book?.name ? book.name.charAt(0).toUpperCase() + book.name.slice(1) : 'Unknown Book'}</Text>
//             <Text style={styles.subText}> By {book?.auther_name ? book.auther_name.charAt(0).toUpperCase() + book.auther_name.slice(1) : 'Unknown Author'}</Text>
//           </View>
//           <Image source={{ uri: `${API_URL}/${book.image}` }} style={styles.thumbnail} />
//         </View>
//       )}

//       {loading && <BookLoading />}
//       <View style={styles.pdfContainer} > 
//         <Pdf
//           ref={pdfRef}
//           trustAllCerts={false}
//           source={{ uri: pdfUrl, cache: true }}
//           onLoadComplete={(numberOfPages) => {
//             console.log(`Number of pages: ${numberOfPages}`);
//             setTotalPages(numberOfPages)
//             setLoading(false);
//           }}
//           onPageChanged={handlePageChange}
//           onError={(error) => {
//             console.log(error);
//             setLoading(false);
//           }}
//           onPressLink={(uri) => {
//             console.log(`Link pressed: ${uri}`);
//           }}
        
//           style={styles.pdf}
//         />
//       </View>


//       <View style={styles.scrollIndicator}>
//         <TextInput
//          ref={pageInputRef} 
//           style={styles.pageInput}
//           keyboardType="numeric"
//           value={pageNumberInput?.toString()} // Ensure the input value is a string
//           onChangeText={handlePageInputChange}
//           placeholder="Enter page number"
//           placeholderTextColor="#999"
//         />
//         <Text style={styles.pageNumber}>
//           /  {totalPages}
//         </Text>
//       </View>

//       <FloatingAction
//         actions={actions}
//         color="#1777FF"
//         buttonSize={65}
//         iconHeight={26}
//         iconWidth={26}
//         onPressItem={(name) => {
//           if (name === 'bt_crop') {
//             toggleSelection();
//           } else if (name === 'bt_find_page') {
//             handleFindPage();
//           }
//         }}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
 
  // scrollIndicator: {
  //   position: 'absolute',
  //   bottom: height * 0.04,
  //   alignSelf: 'center',
  //   backgroundColor: '#d2d2d2',
  //   paddingVertical: height * 0.006, 
  //   paddingHorizontal: width * 0.04, 
  //   borderRadius: 30,
  //   elevation: 8,
  //   flexDirection: 'row',  
  //   alignItems: 'center', 
  //   borderColor: '#1777FF',
  //   borderWidth: 2,
  //   minWidth: width * 0.3, 
  //   maxWidth: width * 0.9,  
  // },

  // pageNumber: {
  //   color: '#000',
  //   fontSize: width * 0.04, 
  //   fontWeight: 'bold',
  //   textAlign:"center"
  // },

  // pageInput: {
  //   height: height * 0.06, // Responsive height
  //   width: width * 0.1, // Responsive width
  //   borderColor: '#000',
  //   textAlign: "center",
  //   color: '#000',
  //   fontSize: width * 0.04, // Responsive font size
  //   fontWeight: 'bold',
  // },

 
//   container: {
//     flex: 1,
//     backgroundColor: '#EDEDED',
//   },
//   header: {
//     flexDirection: 'row',
//     backgroundColor: '#1777FF',
//     paddingVertical: height * 0.02,
//     paddingHorizontal: width * 0.05,
//     position: 'relative',
//     zIndex: 1,
//     elevation: 2,
//   },
//   backButton: {
//     width: width * 0.06,
//     height: width * 0.06,
//     borderRadius: width * 0.03,
//     borderColor: "#fff",
//     borderWidth: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   icon: {
//     textAlign: 'center',
//   },
//   headerTextContainer: {
//     flex: 1,
//     gap:height * 0.005
//   },
//   headerText: {
//     color: '#fff',
//     fontSize: width * 0.055,
//     fontWeight: '700',
//     paddingTop: height * 0.005,
//   },
//   subText: {
//     color: '#fff',
//     fontSize: width * 0.035,
//     fontFamily: "Mulish-Italic",
//     paddingTop: height * 0.001,
//   },
//   thumbnail: {
//     width: width * 0.2,
//     height: width * 0.25,
//     resizeMode: 'cover',
//     borderRadius: width * 0.01,
//   },
//   pdfContainer: {
//     // flex: 1,
//     backgroundColor: '#fff',
//     paddingTop: height * 0.01,
//     width: "100%",
//     height: "100%",
//   },
//   pdf: {
//     width: "100%",
//     height: "100%",
//   },
// });

// export default DisplayPdf;


 