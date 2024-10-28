  import React, {   useEffect, useState } from 'react';
  import { API_URL ,TEXT_ENVIRONMENT,PRODUCTION_ENVIRONMENT,TEXT_MERNCHANT_ID,PRODUCTION_MERNCHANT_ID,TEXT_SALT_KEY,PRODUCTION_SALT_KEY,SALT_INDEX} from '@env';
  import { Dimensions, Image, ScrollView, StyleSheet, View, Text, TouchableOpacity ,Modal ,TouchableWithoutFeedback, ToastAndroid} from 'react-native';
  import Orientation from 'react-native-orientation-locker';  
  import {   useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
  import LinearGradient from 'react-native-linear-gradient';
  import Toast from 'react-native-toast-message';
  import PhonePePaymentSDK from 'react-native-phonepe-pg' 
  import Base64 from "react-native-base64"
  import sha256 from 'sha256';
  import { GetAllBookSubscription, sendPaymentSuccess } from '../UserService/UserService';
  import BookLoading from '../../Pages/Loading/BookLoading';


  const { width, height } = Dimensions.get('window');

  const Subscription = () => {
    const navigation = useNavigation()
    const route = useRoute();
    const book = route.params?.book;
    const [selectedPlan, setSelectedPlan] = useState('monthly');
    const [isMonthlyChecked, setIsMonthlyChecked] = useState(true);
    const [isYearlyChecked, setIsYearlyChecked] = useState(false);
    const [selectedPlanExaminer, setSelectedPlanExaminer] = useState('monthly');
    const [isMonthlyCheckedExaminer, setIsMonthlyCheckedExaminer] = useState(true);
    const [isYearlyCheckedExaminer, setIsYearlyCheckedExaminer] = useState(false);
    const [bookSubscription, setBookSubscription] = useState([]);
    const [loading, setLoading] = useState(true);
 
 
    useEffect(() => {
      Orientation.lockToPortrait();  // Locks the screen to portrait mode
    }, []);

 
    useEffect(() => {
      const getAllBookSubscription = async () => {
        try {
          setLoading(true);
          const response = await GetAllBookSubscription(book.id);
          if (response.status === 200 || response.status === 201) {
            setLoading(false);
            setBookSubscription(response.data);
          }
        } catch (error) {
          setLoading(false);
          const { status } = error.response || {};
          const message = error.response?.data?.detail;
          if (status === 401) {
            Toast.show({ type: 'error', text1: 'Unauthorized',  text2: message || 'Your session has expired. Please log in again.', });
            navigation.navigate('Logout');
          }
          console.log('Error fetching getAllBookSubscription', error.response);
        }
      };
      getAllBookSubscription();
    }, [book]);



  // Get both monthly and yearly price for Learner and Examiner
  const getLearnerMonthlyPrice = () => {
    if (!bookSubscription) return null;
    const learnerMonthlyPlan = bookSubscription.plans?.find(
      (plan) => plan.plan_type === 'Learner' && plan.duration.toLowerCase() === 'monthly'
    );
    return learnerMonthlyPlan ? learnerMonthlyPlan.price : null;
  };

  const getLearnerYearlyPrice = () => {
    if (!bookSubscription) return null;
    const learnerYearlyPlan = bookSubscription.plans?.find(
      (plan) => plan.plan_type === 'Learner' && plan.duration.toLowerCase() === 'yearly'
    );
    return learnerYearlyPlan ? learnerYearlyPlan.price : null;
  };

  const getLearnerYearlyQuestion = () => {
    if (!bookSubscription) return null;
    const learnerYearlyPlan = bookSubscription.plans?.find(
      (plan) => plan.plan_type === 'Learner' && plan.duration.toLowerCase() === 'yearly'
    );
    return learnerYearlyPlan ? learnerYearlyPlan.questions_per_month : null;
  };
 

  const getLearnerMonthlyQuestion = () => {
    if (!bookSubscription) return null;
    const learnerYearlyPlan = bookSubscription.plans?.find(
      (plan) => plan.plan_type === 'Learner' && plan.duration.toLowerCase() === 'monthly'
    );
    return learnerYearlyPlan ? learnerYearlyPlan.questions_per_month : null;
  };
 

  const getExaminerMonthlyPrice = () => {
    if (!bookSubscription) return null;
    const examinerMonthlyPlan = bookSubscription.plans?.find(
      (plan) => plan.plan_type === 'Examiner' && plan.duration.toLowerCase() === 'monthly'
    );
    return examinerMonthlyPlan ? examinerMonthlyPlan.price : null;
  };

  const getExaminerYearlyPrice = () => {
    if (!bookSubscription) return null;
    const examinerYearlyPlan = bookSubscription.plans?.find(
      (plan) => plan.plan_type === 'Examiner' && plan.duration.toLowerCase() === 'yearly'
    );
    return examinerYearlyPlan ? examinerYearlyPlan.price : null;
  };


  const getExaminerYearlyQuestion = () => {
    if (!bookSubscription) return null;
    const learnerYearlyPlan = bookSubscription.plans?.find(
      (plan) => plan.plan_type === 'Examiner' && plan.duration.toLowerCase() === 'yearly'
    );
    return learnerYearlyPlan ? learnerYearlyPlan.questions_per_month : null;
  };
 

  const getExaminerMonthlyQuestion = () => {
    if (!bookSubscription) return null;
    const learnerYearlyPlan = bookSubscription.plans?.find(
      (plan) => plan.plan_type === 'Examiner' && plan.duration.toLowerCase() === 'monthly'
    );
    return learnerYearlyPlan ? learnerYearlyPlan.questions_per_month : null;
  };

    const handleMonthlySelect = () => {
      setSelectedPlan('monthly');
      setIsMonthlyChecked(true);
      setIsYearlyChecked(false);
    };

    const handleYearlySelect = () => {
      setSelectedPlan('yearly');
      setIsMonthlyChecked(false);
      setIsYearlyChecked(true);
    };

    const handleMonthlySelectExaminer = () => {
      setSelectedPlanExaminer('monthly');
      setIsMonthlyCheckedExaminer(true);
      setIsYearlyCheckedExaminer(false); 
    };

    const handleYearlySelectExaminer = () => {
      setSelectedPlanExaminer('yearly');
      setIsMonthlyCheckedExaminer(false);
      setIsYearlyCheckedExaminer(true);
    };

    const plans = [
      { title: 'Basic', description: '10 free questions and answers available per book.', description2: 'Read up to 50 pages for free per book.',gradientColors: ['#ECECEC', '#ECECEC'], color: '#0cc21e', button: "Active Plan" },
      { title: 'Learner', description: 'Choose from our two premium options: MONTHLY or YEARLY.',gradientColors: ['#ECECEC', '#ECECEC'], color: '#1777FF', button: "Click here" },
      { title: 'Examiner', description: 'Upload unlimited videos, convert them to the best images, and download unlimited images.' ,gradientColors: ['#ECECEC', '#ECECEC'],Price:1000 ,color: '#04e1ef', button: "Click here"}
    ];


    
    const [environment,setEnvironment]=useState(TEXT_ENVIRONMENT)
    const [merchantId,setMerchantId]=useState(TEXT_MERNCHANT_ID)  
    const [appId,setAppId]=useState(null)
    const [enableLogging,setEnableLogging]=useState(true)
    const [amount,setAmount]=useState(10)
    
 
    const generateTransectionId =()=>{
      const timestamp = Date.now();
      const random=Math.floor(Math.random() * 1000000);
      const merchantPrefix="MT";
      return `${merchantPrefix}${timestamp}${random}`
    }
 
  const SubmitPaymentLeaner=async()=>{
      let price=""
      const bookId = book.id 
      const  plan_type='LEARNER'
      if(selectedPlan === "monthly"){
        price =await  getLearnerMonthlyPrice()
      }else{
        price = await getLearnerYearlyPrice()
      }

      try {
       const res= await PhonePePaymentSDK.init(environment, merchantId, appId, enableLogging);
      console.log("PhonePe SDK initialized successfully",res);
      if (Platform.OS === 'android') {
        const packageSignature = await PhonePePaymentSDK.getPackageSignatureForAndroid();
        console.log('packageSignature',packageSignature)
      }
      if(res){
      
      const responseBody = {
        merchantId: merchantId,
        merchantTransactionId: generateTransectionId(),  // Ensure this function returns a valid ID
        merchantUserId: "MUID123", 
        amount: (price * 100),  // Convert to paise (if price is in rupees)
        callbackUrl: "",  // Ensure this is a valid URL
        paymentInstrument: {
          type: "PAY_PAGE"
        }
      };
      
      const salt_key = TEXT_SALT_KEY;
      const salt_Index = SALT_INDEX;
      const payload = JSON.stringify(responseBody);
      const payload_main = Base64.encode(payload);
      const string = payload_main + "/pg/v1/pay" + salt_key;
      const checksum = sha256(string) + "###" + salt_Index;
      
      console.log("Transaction ID: ", responseBody.merchantTransactionId);
      console.log("Payload: ", payload);
      console.log("Payload Main: ", payload_main);
      console.log("Checksum: ", checksum);
       
      // Start the transaction
      const response = await PhonePePaymentSDK.startTransaction(payload_main, checksum, null, null);
      console.log("Payment successful",response)
     if (response.status === "SUCCESS") {
    // On successful payment, send details to your backend
     const paymentDetails = {
      bookId,
      plan_type,
      duration:selectedPlan === "monthly" ? "MONTHLY" : "YEARLY",
      price,
      merchantTransactionId: responseBody.merchantTransactionId,
      paymentStatus: 'SUCCESS',
     };
   const response = await sendPaymentSuccess(paymentDetails);
    if (response.status === 200 || response.status === 201) {
      navigation.navigate("Library")
    }
    } else if (response.status === "CANCELLED") {
      alert("Payment was cancelled. Please try again.");
    } else if (response.status === "PENDING") {
      alert("Payment is pending. Please wait for confirmation.");
    } else {
      alert("Payment failed. Please try again.");
    }
    }
      } catch (err) {
      console.error("Payment Error: ", err);
      }
  }

 

const SubmitPaymentExaminer=async()=>{  
  let price=""
  const bookId = book.id 
  const plan_type='EXAMINER'
  if(selectedPlanExaminer === "monthly"){
    price =await  getExaminerMonthlyPrice()
  }else{
    price = await getExaminerYearlyPrice()
  }
  console.log(price,"SubmitPaymentExaminer")
  console.log(bookId,"bookId")
  console.log(plan_type,"plan_type")
  console.log(selectedPlanExaminer,"selectedPlanExaminer")
  try {
    const res= await PhonePePaymentSDK.init(environment, merchantId, appId, enableLogging);
   console.log("PhonePe SDK initialized successfully",res);
   if (Platform.OS === 'android') {
     const packageSignature = await PhonePePaymentSDK.getPackageSignatureForAndroid();
     console.log('packageSignature',packageSignature)
   }
   if(res){
   
   const responseBody = {
     merchantId: merchantId,
     merchantTransactionId: generateTransectionId(),  // Ensure this function returns a valid ID
     merchantUserId: "MUID123", 
     amount: (price * 100),  // Convert to paise (if price is in rupees)
     callbackUrl: "",  // Ensure this is a valid URL
     paymentInstrument: {
       type: "PAY_PAGE"
     }
   };

   const salt_key = TEXT_SALT_KEY;
   const salt_Index = SALT_INDEX;
   const payload = JSON.stringify(responseBody);
   const payload_main = Base64.encode(payload);
   const string = payload_main + "/pg/v1/pay" + salt_key;
   const checksum = sha256(string) + "###" + salt_Index;
   
   console.log("Transaction ID: ", responseBody.merchantTransactionId);
   console.log("Payload: ", payload);
   console.log("Payload Main: ", payload_main);
   console.log("Checksum: ", checksum);
    
   // Start the transaction
   const response = await PhonePePaymentSDK.startTransaction(payload_main, checksum, null, null);
   console.log("Payment successful ",response)
  if (response.status === "SUCCESS") {
 // On successful payment, send details to your backend
  const paymentDetails = {
   bookId,
   plan_type,
   duration:selectedPlanExaminer === "monthly" ? "MONTHLY" : "YEARLY",
   price,
   merchantTransactionId: responseBody.merchantTransactionId,
   paymentStatus: 'SUCCESS',
  };
 const response = await sendPaymentSuccess(paymentDetails);
 if (response.status === 200 || response.status === 201) {
  navigation.navigate("Library")
 }
} else if (response.status === "FAILURE") {
  alert("Payment was FAILURE. Please try again.");
} 
else if (response.status === "CANCELLED") {
  alert("Payment was cancelled. Please try again.");
}else if (response.status === "PENDING") {
  alert("Payment is pending. Please wait for confirmation.");
} else {
  alert("Payment failed. Please try again.");
}
 }
   } catch (err) {
   console.error("Payment Error: ", err);
}
}


// console.log(bookSubscription,"bookSubscription")
// console.log(selectedPlan,"selectedPlanLearner")
// console.log(selectedPlanExaminer,"selectedPlanExaminer")


    return (
      <View style={styles.container}>
      <Image source={require('../../../../assets/images/profile-background.png')} style={styles.backgroundImage} /> 
        <ScrollView contentContainerStyle={styles.scrollViewContent} >
          {/* <Text style={styles.headerText}>Find our best offer waiting for you to explore with us!</Text> */}
          {book ? ( // Check if book data is available
            <View style={styles.Newcontainer}>
              <Image
                source={{ uri: `${API_URL}${book.image}` }} // Use book image
                style={styles.image}
              />
              <View style={styles.textContainer}>
                <Text style={styles.title}>{book?.name ? book.name.charAt(0).toUpperCase() + book.name.slice(1) : 'Unknown Book'}</Text>
                <Text style={styles.subtitleHead}>Auther :<Text style={styles.subtitle}> {book?.auther_name ? book.auther_name.charAt(0).toUpperCase() + book.auther_name.slice(1) : 'Unknown Author'}</Text></Text>
              </View>
            </View>
          ) : ( 
        <>
        <Text style={styles.headerText}>Find our best offer waiting for you to explore with us!</Text>
        </>
          )}
          {plans.map((plan, index) => (
            <View key={index} style={styles.planCardContainer}>
              <View style={[styles.colorIndicator, { backgroundColor: plan.color }]} />
              <LinearGradient colors={plan.gradientColors} style={styles.planCard}>
                <Text style={styles.planTitle}>{plan.title}</Text>
                {plan.title === "Basic" && <>
                <View style={styles.plantext}>
                  <View style={[styles.planDescriptionDot, { backgroundColor: plan.color }]} />
                  <Text style={styles.planDescription}>{plan.description}</Text>
                </View>
                <View style={styles.plantext}>
                  <View style={[styles.planDescriptionDot, { backgroundColor: plan.color }]} />
                  <Text style={styles.planDescription}>{plan.description2}</Text>
                </View>
                <Text style={styles.planDescriptiontext}>
                It is a long established fact that a reader will be distracted by the readable content of a page.
                </Text>
                <TouchableOpacity  style={[styles.button, { backgroundColor: plan.color }, plan.title === 'Basic Plan' && { backgroundColor: '#1DC52D' }]}
                disabled={plan.title === 'Basic Plan'}  >
                  <Text style={styles.buttonText}>{plan.button}</Text>
                </TouchableOpacity>
                </>}
                {plan.title === "Learner" && (  
                    <>
                  <View style={styles.optionContainer}>
                    <TouchableOpacity   style={[styles.priceContainer, selectedPlan === 'monthly' && styles.selectedOptionLearner]} onPress={handleMonthlySelect}>
                    <View style={styles.MainLabelBox}>
                      <View style={[styles.learnerCircularCheckbox, isMonthlyChecked && styles.learnerChecked]}>
                        {isMonthlyChecked && <View style={styles.learnerCheckboxInner} />}
                      </View>
                      <Text style={styles.monthlyLabelText}>Monthly / ₹{getLearnerMonthlyPrice()}</Text>
                      </View>
                      <Text style={styles.planDescription}>A subscription that offers {getLearnerMonthlyQuestion()} Question & Answer.</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.priceContainer, selectedPlan === 'yearly' && styles.selectedOptionLearner]}    onPress={handleYearlySelect}  >
                    <View style={styles.MainLabelBox}>
                      <View style={[styles.learnerCircularCheckbox, isYearlyChecked && styles.learnerChecked]}>
                        {isYearlyChecked && <View style={styles.learnerCheckboxInner} />}
                      </View>
                      <Text style={styles.annualLabelText}>Yearly / ₹{getLearnerYearlyPrice()}</Text>
                      </View>
                      <Text style={styles.planDescription}>A subscription that offers {getLearnerYearlyQuestion()} Question & Answer.</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.planDescriptiontext}>
                It is a long established fact that a reader will be distracted by the readable content of a page.
                </Text>
                <TouchableOpacity  style={[styles.button, { backgroundColor: plan.color }]} onPress={SubmitPaymentLeaner} >
                  <Text style={styles.buttonText}>{plan.button}</Text>
                </TouchableOpacity>
                </>
                )}
                {plan.title === "Examiner" && (
                  <>
                  <View style={styles.optionContainer}>
                    <TouchableOpacity   style={[styles.priceContainer, selectedPlanExaminer === 'monthly' && styles.selectedOption]} onPress={handleMonthlySelectExaminer}>
                    <View style={styles.MainLabelBox}>
                      <View style={[styles.circularCheckbox, isMonthlyCheckedExaminer && styles.checked]}>
                        {isMonthlyCheckedExaminer && <View style={styles.checkboxInner} />}
                      </View>
                      <Text style={styles.monthlyLabelText}>Monthly / ₹{getExaminerMonthlyPrice()}</Text>
                      </View>
                      <Text style={styles.planDescription}>A subscription that offers {getExaminerMonthlyQuestion()} Question & Answer.</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.priceContainer, selectedPlanExaminer === 'yearly' && styles.selectedOption]}    onPress={handleYearlySelectExaminer}  >
                    <View style={styles.MainLabelBox}>
                      <View style={[styles.circularCheckbox, isYearlyCheckedExaminer && styles.checked]}>
                        {isYearlyCheckedExaminer && <View style={styles.checkboxInner} />}
                      </View>
                      <Text style={styles.annualLabelText}>Yearly / ₹{getExaminerYearlyPrice()}</Text>
                      </View>
                      <Text style={styles.planDescription}>A subscription that offers {getExaminerYearlyQuestion()} Question & Answer.</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.planDescriptiontext}>
                It is a long established fact that a reader will be distracted by the readable content of a page.
                </Text>
                <TouchableOpacity  style={[styles.button, { backgroundColor: plan.color }]} onPress={SubmitPaymentExaminer} >
                  <Text style={styles.buttonText}>{plan.button}</Text>
                </TouchableOpacity>
                </>
                )}
               
              </LinearGradient>
            </View>
          ))}
             
        </ScrollView>
        {loading && (<BookLoading/> )}      
      </View>
    );
  };

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
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
  paddingTop: height * 0.02,
  paddingHorizontal: width * 0.05,
  paddingBottom: 75 
},
headerText: {
  fontSize: width * 0.06,
  fontFamily: 'StardosStencil-Bold',
  color: '#000',
  marginBottom: height * 0.04,
},
  Newcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',  
    borderRadius: 10,
    padding: width * 0.016,  
    elevation: 10,
    marginBottom: height * 0.05,
    // marginHorizontal: width * 0.05,  
  },
  image: {
    width: width * 0.16, 
    height: height * 0.12, 
    borderRadius: 5,
    marginRight: width * 0.05,  
    elevation:10
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: width * 0.05, 
    fontFamily:'StardosStencil-Bold',
    color: '#000', 
  },
  subtitleHead:{
    fontFamily:'Mulish-Regular',
    fontWeight:"700",
    fontSize: width * 0.04,  
    color: '#000',  
  },
  subtitle: {
    fontFamily:'Mulish-Regular',
    fontSize: width * 0.04,  
    color: '#000',  
  },
  
 
  subHeaderText: {
    fontSize: width * 0.05,
    color: '#000',
    fontFamily: 'StardosStencil-Bold',
    marginBottom: height * 0.04,
  },
  planCardContainer: {
    position: 'relative',
    marginBottom: height * 0.05,
    width: width * 0.9,
  },
  colorIndicator: {
    width: '15%',
    height: width * 0.1,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    position: 'absolute',
    top: -10,
    left: -10,
    zIndex: -1,
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: width * 0.05,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 10,
  },
  planTitle: {
    fontSize: width * 0.07,
    color: '#000',
    fontFamily: 'StardosStencil-Bold',
    // marginVertical: height * 0.01,
  },
  plantext: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: height * 0.003,

  },
  planDescriptionDot: {
    height: width * 0.02,
    width: width * 0.02,
    borderRadius: width * 0.01,
    marginRight: width * 0.02,
  },
  planDescription: {
    fontSize: width * 0.04,
    color: '#000',
    // fontFamily: 'Mulish-Bold',
    alignItems: 'center',
    fontWeight: "500"
  },
 
  planDescriptiontext: {
    fontSize: width * 0.04,
    color: '#000',
    fontFamily: 'Mulish-Regular',
    marginTop: height * 0.01,
  },
  button: {
    borderRadius: 25,
    paddingVertical: width * 0.03,
    paddingHorizontal: width * 0.15,
    marginTop: height * 0.02,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Mulish-Regular',
    fontSize: width * 0.05,
   
  },

  priceContainer: {
    backgroundColor:"#fff",
    flex: 1,
    justifyContent: 'center',
    alignItems:"center",
    borderWidth: 1,
    borderRadius: 10,
    padding: width * 0.04,
    marginHorizontal: width * 0.01,
  },
  MainLabelBox:{
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems: 'center',
    paddingBottom:height * 0.01,
    padding:5,
 },
  
  
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: height * 0.01,
  },
 
  selectedOption: {
    borderColor: '#04e1ef', // Highlight selected option
    borderWidth: 2,
  },
  
  monthlyLabelText: {
    fontSize: width * 0.043,
    fontWeight: 'bold',
    color: '#000',
  },

  annualLabelText: {
    fontSize: width * 0.043,
    fontWeight: 'bold',
    color: '#000',
  },
  
  circularCheckbox: {
    width: 18,               // Outer circle width
    height: 18,              // Outer circle height
    borderRadius: 12,        // Makes it circular
    borderWidth: 2,          // Border thickness
    borderColor: '#000',     // Border color (adjust as per your design)
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,         // Space between checkbox and text
  },

  checkboxInner: {
    width: 10,               // Inner circle width
    height: 10,              // Inner circle height
    borderRadius: 6,         // Makes it circular
    backgroundColor: '#04e1ef', // Fill color when checked (adjust color as needed)
  },
  checked: {
    borderColor: '#04e1ef',  // Outer border color when checked
  },

  selectedOptionLearner: {
    borderColor: '#1777FF', // Highlight selected option
    borderWidth: 2,
  },
  learnerCircularCheckbox: {
    width: 18,               // Outer circle width
    height: 18,              // Outer circle height
    borderRadius: 12,        // Makes it circular
    borderWidth: 2,          // Border thickness
    borderColor: '#000',     // Border color (adjust as per your design)
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,         // Space between checkbox and text
  },

  learnerCheckboxInner: {
    width: 10,               // Inner circle width
    height: 10,              // Inner circle height
    borderRadius: 6,         // Makes it circular
    backgroundColor: '#1777FF', // Fill color when checked (adjust color as needed)
  },
  learnerChecked: {
    borderColor: '#1777FF',  // Outer border color when checked
  },

 
});

 
export default Subscription
 
 
 


 

