import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, Dimensions, SafeAreaView, Keyboard } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DisplayAllBook from '../DisplayAllBook/DisplayAllBook';
import Subscription from '../Subscription/Subscription';
import UserLibrary from '../UserLibrary/UserLibrary';
import UserProfile from '../UserProfile/UserProfile';
import DisplayBookByPagination from '../DisplayBookByPagination/DisplayBookByPagination';
// import Chat from '../Chat/Chat';
// import DisplayPdf from '../DisplayPdf/DisplayPdf';

const homeIcon = require('../../../../assets/images/home.png');
const subscriptionIcon = require('../../../../assets/images/subscription.png');
const libraryIcon = require('../../../../assets/images/book.png');
const userIcon = require('../../../../assets/images/user.png');
const chatIcon = require('../../../../assets/images/chat.png');

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

const BottomTabNavigator = () => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);  
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);   
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: keyboardVisible ? { display: 'none' } : styles.tabBar, 
          tabBarActiveTintColor: '#FFFFFF',
          tabBarInactiveTintColor: '#000',
          tabBarLabelStyle: { display: 'none' },
        }}
      >
        <Tab.Screen
          name="DisplayAllBook"
          component={DisplayAllBook}
          options={{
            tabBarIcon: ({ focused }) => (
              <IconWrapper focused={focused}>
                <Image source={homeIcon} style={[styles.iconImage, { tintColor: focused ? '#FFFFFF' : '#000' }]} />
              </IconWrapper>
            ),
          }}
        />
       
        <Tab.Screen
          name="Library"
          component={UserLibrary}
          options={{
            tabBarIcon: ({ focused }) => (
              <IconWrapper focused={focused}>
                <Image source={libraryIcon} style={[styles.iconImage, { tintColor: focused ? '#FFFFFF' : '#000' }]} />
              </IconWrapper>
            ),
          }}
        />

       <Tab.Screen
          name="Subscription"
          component={Subscription}
          options={{
          tabBarButton: () => null, 
        }}
          // options={{
          //   tabBarIcon: ({ focused }) => (
          //     <IconWrapper focused={focused}>
          //       <Image source={subscriptionIcon} style={[styles.iconImage, { tintColor: focused ? '#FFFFFF' : '#000' }]} />
          //     </IconWrapper>
          //   ),
          // }}
        />

         <Tab.Screen
          name="DisplayBookByPagination"
          component={DisplayBookByPagination}
          options={{
          tabBarButton: () => null, 
        }}
          // options={{
          //   tabBarIcon: ({ focused }) => (
          //     <IconWrapper focused={focused}>
          //       <Image source={subscriptionIcon} style={[styles.iconImage, { tintColor: focused ? '#FFFFFF' : '#000' }]} />
          //     </IconWrapper>
          //   ),
          // }}
        />
        
        <Tab.Screen
          name="Profile"
          component={UserProfile}
          options={{
            tabBarIcon: ({ focused }) => (
              <IconWrapper focused={focused}>
                <Image source={userIcon} style={[styles.iconImage, { tintColor: focused ? '#FFFFFF' : '#000' }]} />
              </IconWrapper>
            ),
          }}
        />
        {/* <Tab.Screen
          name="Chat"
          component={Chat}
          options={{
            tabBarIcon: ({ focused }) => (
              <IconWrapper focused={focused}>
                 <Image source={chatIcon} style={[styles.iconImage, { tintColor: focused && '#FFFFFF'  }]} />
              </IconWrapper>
            ),
          }}
        />
        */}
      </Tab.Navigator>
    </SafeAreaView>
  );
};

const IconWrapper = ({ focused, children }) => {
  return (
    <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,  
  },
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  iconContainer: {
    height: width * 0.12,
    width: width * 0.12,
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
  },
  activeIconContainer: {
    backgroundColor: '#007AFF',
  },
  iconImage: {
    width: width * 0.07,
    height: width * 0.07,
    resizeMode: 'cover',
  },
});

export default BottomTabNavigator;
 


 