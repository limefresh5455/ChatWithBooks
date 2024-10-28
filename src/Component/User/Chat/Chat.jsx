import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  Text,
  View,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import Orientation from 'react-native-orientation-locker';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {UserChatBotService} from '../UserService/UserService';
import ChatLoader from '../../Pages/Loading/ChatLoader';
import Tts from 'react-native-tts';

const {width, height} = Dimensions.get('window');

const languages = [
  'English',
  'Hindi',
  'Gujarati',
  'Marathi',
  'Bengali',
  'Telugu',
  'Tamil',
  'Kannada',
  'Odia',
  'Malayalam',
];

const questions = [
  "Would you like a summary of this book?",
  "What is your preference?",
  "Would you like to learn about the author?",,
  "Do you need help understanding a difficult section of the book?",
  "Where can I find more info?",
];

const Chat = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const book = route.params?.book;
  const capturedImage = route.params?.capturedImage;
  const currentPage = route.params?.currentPage;
  const [imageUri, setImageUri] = useState(null);
  const [currentPages, setCurrentPages] = useState("");
  const [showLanguages, setShowLanguages] = useState(false);
  const [language, setLanguage] = useState('English');
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([
    {id: 1, text: 'Hello! How can I assist you today?', sender: 'bot',isLoading: false},
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [questionsShown, setQuestionsShown] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const scrollViewRef = useRef();
  const [isSpeaking, setIsSpeaking] = useState(false);
 
    // Scroll to the bottom when messages change
    useEffect(() => {
      scrollViewRef.current.scrollToEnd({animated: true});
    }, [messages]);
  
  

    useEffect(() => {
      Orientation.lockToPortrait();  // Locks the screen to portrait mode
    }, []);
 
  

  useEffect(() => {
    if (capturedImage) {
      setImageUri(capturedImage);
    }
    if (currentPage) {
      setCurrentPages(currentPage);
    }
  }, [capturedImage, currentPage]);


  const handleImagePress = (imageUri) => {
    setSelectedImage(imageUri);
    setIsModalVisible(true);
  };


  const handleLanguageSelect = selectedLanguage => {
    setLanguage(selectedLanguage); 
    setShowLanguages(false); 
  };


  const [inputHeight, setInputHeight] = useState(55); // Initial height

  const handleContentSizeChange = (contentWidth, contentHeight) => {
    if (contentHeight <= 120) {
      setInputHeight(contentHeight); // Adjust height based on content (for up to 5 lines)
    } else {
      setInputHeight(120); // Cap the height at 5 lines
    }
  };


  

  const handleSendMessage = async () => {
 
    if (!questionsShown) {
      setQuestionsShown(true);
    }
    if (userInput.trim() || imageUri) {
      const generateUniqueId = () => {
        // Generate a unique ID using a timestamp and random number
        return Date.now() + Math.floor(Math.random() * 1000);
      };
      const newMessage = {
        id: generateUniqueId(),
        text: userInput,
        imageUri: imageUri,
        sender: 'user',
        isLoading: false,
      };
    
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setUserInput('');
      setIsSending(true);
      const formData = new FormData();
      formData.append('message', userInput);
      formData.append('book_name', book.name);
      formData.append('language', language);
    
      if (imageUri) {
        formData.append('image_path', imageUri);
        formData.append('page_no', currentPages);
        setImageUri(null);  
        setCurrentPages(null);
      }

      try {
        const botMessage = {
          id: generateUniqueId(),
          text: "",
          sender: "bot",
          language: language,
          isLoading: true, 
        };
        setMessages(prevChats => [...prevChats, botMessage]);
        const response = await UserChatBotService(formData);
        console.log(response.data,"response")
        // console.log(response,"response")
        // console.log(response.data,"response.data")
    if (response.data) {
      const lines = response.data.split("\n");
      // console.log(lines,"lines")
      lines.forEach((line) => {
        if (line.startsWith('data:')) {
          // Extract the data part and trim whitespace
          const messageChunk = line.slice(5).trim();
          if (messageChunk) {
            setMessages((prevMessages) => {
              const lastMessage = prevMessages[prevMessages.length - 1];
              const updatedLastMessage = {
                ...lastMessage,
                text:lastMessage.text+" "+messageChunk,
                sender:"bot",
                isLoading:false
              };
              return [...prevMessages.slice(0, -1), updatedLastMessage];
            });
          }
        }
      });
    }  
      } catch (error) {
        console.log("error :",error)
        const  message = error.response?.data?.error 
        setIsSending(false);
        if(error.response.status === 403){
          setMessages((prevMessages) => {
            const lastMessage = prevMessages[prevMessages.length - 1];
            const updatedLastMessage = {
              ...lastMessage,
              isLoading: false,
              text: "I am sorry, you have reached your maximum question limit. ",
              clickableText: "Click here to subscribe", 
              onClick: () => {
                // Navigate to the Subscription page when the message is clicked
                navigation.navigate('Subscription', { book });
              },
            };
            return [...prevMessages.slice(0, -1), updatedLastMessage];
          });
        }else if(error.response.status === 409){
          setMessages((prevMessages) => {
            const lastMessage = prevMessages[prevMessages.length - 1];
            const updatedLastMessage = {
              ...lastMessage,
              isLoading: false,
              text: message || "Your subscription has expired.. ",
              clickableText: "Click here to subscribe", 
              onClick: () => {
                // Navigate to the Subscription page when the message is clicked
                navigation.navigate('Subscription', { book });
              },
            };
            return [...prevMessages.slice(0, -1), updatedLastMessage];
          });
        }
      } finally {
        setIsSending(false); // Step 2: Set isSending back to false
      }
    }
  };
 

 
  
  const handleRemoveImage=()=>{
    setImageUri(null)
  }
 

  const handleQuestionPress = (question) => {
     if(question){
      handleSendMessageQuestion(question);
     }
  };

  const handleSendMessageQuestion = async (question) => {
    if (!questionsShown) {
      setQuestionsShown(true);
    }
    if (question) {
      const generateUniqueId = () => {
        return Date.now() + Math.floor(Math.random() * 1000);
      };
      const newMessage = {
        id: generateUniqueId(),
        text: question,
        imageUri: imageUri,
        sender: 'user',
        isLoading: false,
      };
    
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setUserInput('');
 
     
      const formData = new FormData();
      formData.append('message', userInput);
      formData.append('book_name', book.name);
      formData.append('language', language);
      setIsSending(true);
      if (imageUri) {
        formData.append('image_path', imageUri);
        formData.append('page_no', currentPages);
        setImageUri(null); 
        setCurrentPages(null); 
      }

      try {
        const botMessage = {
          id: generateUniqueId(),
          text: "",
          sender: "bot",
          language: language,
          isLoading: true, 
        };
        setMessages(prevChats => [...prevChats, botMessage]);
        const response = await UserChatBotService(formData);
        
    if (response.data) {
      const lines = response.data.split("\n");
      // console.log(lines,"lines")
      lines.forEach((line) => {
        if (line.startsWith('data:')) {
          // Extract the data part and trim whitespace
          const messageChunk = line.slice(5).trim();

          if (messageChunk) {
            // Update the chat in real-time by adding new chunks as they arrive
            setMessages((prevMessages) => {
              const lastMessage = prevMessages[prevMessages.length - 1];
              const updatedLastMessage = {
                ...lastMessage,
                text:lastMessage.text+" "+messageChunk,
                sender:"bot",
                isLoading:false
              };
              return [...prevMessages.slice(0, -1), updatedLastMessage];
            });
          }
        }
      });
    }  
  } catch (error) {
    console.log("error :",error)
    const  message = error.response?.data?.error 
    setIsSending(false);
    if(error.response.status === 403){
      setMessages((prevMessages) => {
        const lastMessage = prevMessages[prevMessages.length - 1];
        const updatedLastMessage = {
          ...lastMessage,
          isLoading: false,
          text: "I am sorry, you have reached your maximum question limit. ",
          clickableText: "Click here to subscribe", 
          onClick: () => {
            // Navigate to the Subscription page when the message is clicked
            navigation.navigate('Subscription', { book });
          },
        };
        return [...prevMessages.slice(0, -1), updatedLastMessage];
      });
    }else if(error.response.status === 409){
      setMessages((prevMessages) => {
        const lastMessage = prevMessages[prevMessages.length - 1];
        const updatedLastMessage = {
          ...lastMessage,
          isLoading: false,
          text: message || "Your subscription has expired.. ",
          clickableText: "Click here to subscribe", 
          onClick: () => {
            // Navigate to the Subscription page when the message is clicked
            navigation.navigate('Subscription', { book });
          },
        };
        return [...prevMessages.slice(0, -1), updatedLastMessage];
      });
    }
  } finally {
    setIsSending(false); // Step 2: Set isSending back to false
  }
    }
  };
  
  

  // Function to render each language item
  const renderLanguageItem = ({item}) => (
    <TouchableOpacity
      style={styles.languageItem}
      onPress={() => handleLanguageSelect(item)}>
      <Text style={styles.languageText}>{item}</Text>
    </TouchableOpacity>
  );

  // useEffect(() => {
  //   // Cleanup on component unmount
  //   return () => {
  //     Tts.stop();
  //   };
  // }, []);

  // const speakText = (text) => {
  //   Tts.stop(); // Stop any ongoing speech
  //   Tts.speak(text); // Speak the text
  // };

  useEffect(() => {
    // Listener for when TTS finishes speaking
    const onTtsFinish = Tts.addListener('tts-finish', () => setIsSpeaking(false));
    return () => {
      onTtsFinish.remove(); // Properly remove the listener when unmounting
      Tts.stop(); // Stop TTS when component unmounts
    };
  }, []);

  const speakText = (text) => {
    if (isSpeaking) {
      Tts.stop();
      setIsSpeaking(false);
    } else {
      Tts.speak(text);
      setIsSpeaking(true);
    }
  };
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icon name="arrow-back" size={width * 0.09} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">
          {book?.name
            ? book.name.charAt(0).toUpperCase() + book.name.slice(1)
            : 'Unknown Book'}
        </Text>
        <TouchableOpacity
          style={styles.settingsIcon}
          onPress={() => navigation.navigate('DisplayPdf', {book: book})}>
          <Image
            source={require('../../../../assets/images/Object.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      {/* Chat Bubbles */}
      <ScrollView contentContainerStyle={styles.chatContent}  ref={scrollViewRef} keyboardShouldPersistTaps="handled">
        {messages.map(message => (
          <View
            key={message.id}
            style={[
              styles.chatContainer,
              message.sender === 'user'
                ? styles.userMessage
                : styles.botMessage,
            ]}>
            {message.sender === 'bot' && (
              <Image
                source={require('../../../../assets/images/userChat.png')}
                style={styles.avatar}
              />
            )}
          <View
              style={[
                styles.messageBox,
                message.sender === 'user'
                  ? styles.userMessageBox
                  : styles.botMessageBox,
              ]}>
                {message.imageUri ? (
                  <TouchableOpacity onPress={() => handleImagePress(message.imageUri)}>
                <Image
                  source={{uri: message.imageUri}}
                  style={styles.imagePreview}
                />
                </TouchableOpacity>
              ) : null}

              {message.text ? (
                <Text style={styles.messageText}>{message.text.trim()}</Text>
              ) : null}


              {message.sender === 'bot'&& !message.isLoading && (
                <>
        {/* <TouchableOpacity onPress={() => speakText(message.text.trim())}>
          <Icon name="volume-high" size={25} color="#000" style={styles.speakerIcon} />
        </TouchableOpacity> */}
        <TouchableOpacity onPress={() => speakText(message.text.trim())} style={styles.speakerIcon}>
          <Icon name={isSpeaking ? "volume-mute" : "volume-high"} size={24} color="#000" />
        </TouchableOpacity>
        </>
               )}

              {message.clickableText && (
                  <Text
                    style={{ color: 'blue', textDecorationLine: 'underline' }}
                    onPress={message.onClick} // Call the onClick function here
                  >
                    {message.clickableText}
                  </Text>
              )}
              {message.isLoading && <ChatLoader />}
            </View>
         
          </View>
        ))}
      </ScrollView>

      {/* Input Field with Language Options */}
      <View style={styles.inputContainerBox}>   
      {!questionsShown && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.questionsScroll}  keyboardShouldPersistTaps="handled">
            {questions.map((question, index) => (
              <TouchableOpacity key={index} style={styles.questionButton} onPress={() => handleQuestionPress(question)}>
                <Text style={styles.questionText}>{question}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
        <View style={styles.languageContainer}  >
          <TouchableOpacity
            style={styles.languageButton}
            onPress={() => setShowLanguages(!showLanguages)}>
            <Text style={styles.languageText}>
              Language:{' '}
              <Text style={styles.Selectedlanguage}> {language} </Text>
            </Text>
            <Image
              source={require('../../../../assets/images/Icon.png')}
              style={styles.iconDopdown}
            />
          </TouchableOpacity>
          {showLanguages && (
            <FlatList
              data={languages}
              keyboardShouldPersistTaps="handled"
              renderItem={renderLanguageItem}
              keyExtractor={item => item}
              numColumns={3}
              columnWrapperStyle={styles.columnWrapper}
              style={styles.languageList}
            />
          )}
        </View>
        {imageUri && (
          <View style={styles.imagePreviewContainer}>
            <Image source={{uri: imageUri}} style={styles.imagePreview} />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={handleRemoveImage}>
              <Icon name="close" size={15} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Write here your text..."
            placeholderTextColor="#000"
            style={[styles.textInput, {height: Math.max(55, inputHeight)}]} 
            value={userInput}
            onChangeText={setUserInput}
            // onSubmitEditing={handleSendMessage}
            multiline={true}
            scrollEnabled={inputHeight >= 120} 
            onContentSizeChange={(e) => handleContentSizeChange(e.nativeEvent.contentSize.width, e.nativeEvent.contentSize.height)}
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            disabled={isSending}
            style={[styles.sendButton1]}
             >
            <Image
              source={require('../../../../assets/images/sendIcon1.png')}
              style={[styles.sendIcon, isSending && styles.disabledButton]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sendButton]}
            onPress={() => navigation.navigate('DisplayPdf', {book: book})}
             >
            <FontAwesome5 name="book-open" size={28} color="#007BFF" style={styles.sendIcon1} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Image Model */}
      <Modal
      visible={isModalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setIsModalVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
        <View style={styles.modalContainer}>
          {/* <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsModalVisible(false)}
          >
            <Icon name="close" size={30} color="#fff" />
          </TouchableOpacity> */}
          <Image
            source={{ uri: selectedImage }}
            style={styles.fullImage}
            resizeMode="contain"
          />
        </View>
      </TouchableWithoutFeedback>
    </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: height * 0.025,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#1777FF',
    paddingHorizontal: width * 0.03,
    elevation: 5,
  },
  backButton: {
    padding: width * 0.02,
  },
  headerTitle: {
    fontSize: width * 0.068,
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'StardosStencil-Bold',
    width: width * 0.5,
  },
  settingsIcon: {
    padding: width * 0.02,
  },
  icon: {
    width: width * 0.08,
    height: width * 0.08,
    resizeMode: 'cover',
  },
  chatContent: {
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.02,
    paddingBottom: height * 0.18,
  },
  chatContainer: {
    flexDirection: 'row',
    marginBottom: height * 0.025,
  },
  botMessage: {
    justifyContent: 'flex-start',
    // alignItems: 'center',
    flexDirection: 'row',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  avatar: {
    width: width * 0.05,
    height: width * 0.05,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: width * 0.02,
    resizeMode: 'cover',
    elevation: 5,
  },
  messageBox: {
    padding: width * 0.02,
    borderRadius: width * 0.03,
    maxWidth: width * 0.75,
  },
  botMessageBox: {
    backgroundColor: '#fff',
    elevation: 5,
  },
  userMessageBox: {
    backgroundColor: '#E8E8E8',
    elevation: 5,
  },
  messageText: {
    fontSize: width * 0.045,
    color: '#000',
  },
  inputContainerBox: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingVertical: height * 0.02,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  languageContainer: {
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.04,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.02,
    paddingBottom: height * 0.01,
  },
  languageText: {
    fontSize: width * 0.04,
    color: '#000',
  },
  Selectedlanguage: {
    color: '#1777FF',
    fontWeight: '700',
  },
  iconDopdown: {
    width: width * 0.03,
    height: width * 0.03,
    resizeMode: 'contain',
  },
  languageList: {
    marginTop: height * 0.01,
  },
  columnWrapper: {
    justifyContent: 'space-between', // Space out the items evenly
    marginBottom: height * 0.02,
  },
  languageItem: {
    flex: 1,
    alignItems: 'center',
    padding: height * 0.02,
    backgroundColor: '#f0f0f0', // Background color for language options
    borderRadius: 5,
    marginHorizontal: width * 0.01, // Margin to separate items
    elevation: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.04,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  textInput: {
    flex: 1,
    // height: height * 0.07,
    borderColor: '#ABABAB',
    borderWidth: 1,
    paddingRight:width * 0.12,
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.025,
    fontSize: width * 0.04,
    backgroundColor: '#fff',
    color: '#000',
    borderRadius: width * 0.08,
    elevation: 10,
  },
  // sendButton: {
  //   position: 'absolute',
  //   right: 15,
  //   padding: 8,
  //   borderLeftWidth: 1,
  //   borderLeftColor: '#ABABAB',
  // },

  // sendButton1: {
  //   position: 'absolute',
  //   right: 65,
  //   padding: 8,
  //   borderLeftWidth: 1,
  //   borderLeftColor: '#ABABAB',
  // },
  // sendIcon: {
  //   width: width * 0.08,
  //   height: width * 0.08,
  //   resizeMode: 'cover',
  // },

  // sendIcon1: {
  //   resizeMode: 'cover',
  //   padding:2
  // },

  sendButton: {
    position: 'absolute',
    right: '5%', // Responsive right positioning
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.02,
    borderLeftWidth: 1,
    borderLeftColor: '#e8e9eb',
  },

  sendButton1: {
    position: 'absolute',
    right: '20%', // Responsive right positioning to create spacing
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.02,
    borderLeftWidth: 1,
    borderLeftColor: '#ABABAB',
  },

  sendIcon: {
    width: width * 0.08,
    height: width * 0.08,
    resizeMode: 'cover',
  },

  sendIcon1: {
    resizeMode: 'cover',
    padding: width * 0.01, // Responsive padding
  },



  imagePreviewContainer: {
    width: '100%',
    position: 'relative',
    marginVertical: height * 0.01,
    marginBottom: height * 0.03,
    paddingHorizontal: width * 0.04,
  },
  imagePreview: {
    width: width * 0.4,
    height: width * 0.3,
    borderRadius: width * 0.02,
    borderColor: '#ABABAB',
    borderWidth: 2,
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: -width * 0.03,
    left: width * 0.4,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: width * 0.015,
    borderRadius: width * 0.05,
    alignItems: 'center',
    justifyContent: 'center',
  },
modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
    padding: width * 0.05, // Responsive padding
  },
  fullImage: {
    width: '80%',
    height: '80%',
  },
  // closeButton: {
  //   position: 'absolute',
  //   top: height * 0.17, // Adjusted for responsiveness
  //   right: width * 0.025, // Adjusted for responsiveness
  //   padding: width * 0.03, // Responsive padding
  //   zIndex: 1,
  // },
  questionsScroll: {
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.02,
    marginBottom:height * 0.01,
  },
  questionButton: {
    backgroundColor: '#f0f0f0', // adjust as needed
    padding: height * 0.013, // adjust for responsiveness
    borderRadius: 20,
    marginHorizontal: width * 0.02, // adjust for responsiveness
    borderWidth: 2,
    borderColor: "#1777FF",
  },
  questionText: {
    fontSize: width * 0.04, // responsive font size based on screen width
    color: '#000', // adjust as needed
  },
  disabledButton: {
    opacity:0.4,
    color:"white"
  },

});

export default Chat;

 









































   // const handleSendMessage = async () => {
  //   if (!questionsShown) {
  //     setQuestionsShown(true);
  //   }
  
  //   if (userInput.trim() || imageUri) {
  //     setInputHeight(55);
  
  //     const generateUniqueId = () => Date.now() + Math.floor(Math.random() * 1000);
  
  //     const newMessage = {
  //       id: generateUniqueId(),
  //       text: userInput,
  //       imageUri: imageUri,
  //       sender: 'user',
  //       isLoading: false,
  //     };
  
  //     setMessages((prevMessages) => [...prevMessages, newMessage]);
  //     setUserInput('');
  
  //     const formData = new FormData();
  //     formData.append('message', userInput);
  //     formData.append('book_name', book.name);
  //     formData.append('language', language);
  
  //     if (imageUri) {
  //       formData.append('image_path', imageUri);
  //       formData.append('page_no', currentPages);
  //       setImageUri(null);
  //       setCurrentPages("");
  //     }
  
  //     try {
  //       const botMessage = {
  //         id: generateUniqueId(),
  //         text: "",
  //         sender: "bot",
  //         isLoading: true,
  //       };
  //       setMessages((prevMessages) => [...prevMessages, botMessage]);
  
  //       const userDataJson = await AsyncStorage.getItem('user_details');
  //       const userData = JSON.parse(userDataJson);
  //       const token = userData?.access_token;
  
  //       const xhr = new XMLHttpRequest();
  //       xhr.open('POST', `${API_URL}/askpdf/api/chat/`);
  
  //       xhr.setRequestHeader('Authorization', `Bearer ${token}`);
  //       xhr.setRequestHeader('Content-Type', `multipart/form-data`);
  
  //       let messageBuffer = ''; // Buffer to accumulate message chunks
  //       let lastCompleteMessage = ''; // Keep track of complete message
    
  //       xhr.onprogress = (event) => {
  //         // Keep the remaining part of the last line in the buffer
  //      console.log("event.currentTarget1",event.currentTarget,"event.currentTarget2")
  //         const responseText = event.currentTarget._response;
  
  //         // console.log(responseText,"responseText")
  //         messageBuffer += responseText; 
  //         // Process accumulated buffer by checking for complete messages
  //         const lines = messageBuffer.split('\n');
  //         // console.log(lines,"lines")
  //         lines.forEach((line) => {
  //           if (line.startsWith('data:')) {
  //             const messageChunk = line.slice(5).trim();
  //             // console.log(messageChunk,"messageChunk")
  //             if (messageChunk && !lastCompleteMessage.includes(messageChunk)) {
  //               setMessages((prevMessages) => {
  //                 const lastMessage = prevMessages[prevMessages.length - 1];
  
  //                 if (lastMessage.sender === 'bot') {
  //                   const updatedLastMessage = {
  //                     ...lastMessage,
  //                     text: (lastMessage.text + " " + messageChunk),
  //                     isLoading: false,
  //                   };
  
  //                   lastCompleteMessage = updatedLastMessage.text;
  
  //                   return [...prevMessages.slice(0, -1), updatedLastMessage];
  //                 }
  
  //                 return prevMessages;
  //               });
  //             }
  //           }
  //         });
  
  //         // Clear the buffer to avoid reprocessing the same data
  //         if (lines[lines.length - 1] !== "") {
  //           messageBuffer = lines[lines.length - 1];
  //         } else {
  //           messageBuffer = '';
  //         }
  //       };
   

  //       xhr.onload = () => {
  //         if (xhr.status === 403) {
  //           setMessages((prevMessages) => {
  //             const lastMessage = prevMessages[prevMessages.length - 1];
  //             const updatedLastMessage = {
  //               ...lastMessage,
  //               isLoading: false,
  //               text: "I am sorry, you have reached your maximum question limit.",
  //               clickableText: "Click here to subscribe",
  //               onClick: () => {
  //                 navigation.navigate('Subscription', { book });
  //               },
  //             };
  //             return [...prevMessages.slice(0, -1), updatedLastMessage];
  //           });
  //         }
  //       };
  
  //       xhr.onerror = (error) => {
  //         console.error('Streaming error:', error);
  //       };
  
  //       xhr.send(formData);
  
  //     } catch (error) {
  //       console.log("Error:", error);
  
  //       if (error.response?.status === 403) {
  //         setMessages((prevMessages) => {
  //           const lastMessage = prevMessages[prevMessages.length - 1];
  //           const updatedLastMessage = {
  //             ...lastMessage,
  //             isLoading: false,
  //             text: "I am sorry, you have reached your maximum question limit.",
  //             clickableText: "Click here to subscribe",
  //             onClick: () => {
  //               navigation.navigate('Subscription', { book });
  //             },
  //           };
  //           return [...prevMessages.slice(0, -1), updatedLastMessage];
  //         });
  //       }
  //     }
  //   }
  // };
  
