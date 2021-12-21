/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { AntDesign } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Pressable } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ModalScreen from '../screens/ModalScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import DashboardScreen from '../screens/DashboardScreen';
import RoomsChatScreen from '../screens/RoomsChatScreen';
import SingleChatScreen from '../screens/SingleChatScreen';
import RoomsList from '../screens/RoomsList';
import UsersList from '../screens/UsersList';
import ChatList from '../screens/ChatList';

import CreatePost from '../screens/CreatePost';
import MyPosts from '../screens/MyPosts';
import UserProfileScreen from '../screens/UserProfileScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AddImage from '../screens/AddImage';
import Feedback from '../screens/Feedback';
import SearchScreen from '../screens/SearchScreen';
import Notification from '../screens/Notification';

import Sample from '../screens/Sample';



import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import AuthContext from '../screens/helpers/AuthContext';

var BASE_URL = require('../screens/helpers/ApiBaseUrl.tsx');
export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
       
        // Restore token stored in `SecureStore` or any other encrypted storage
         //userToken = await SecureStore.getItemAsync('token');
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
        // In the example, we'll use a dummy token
        


          fetch(BASE_URL+'signin.php',
          {
              method: 'POST',
              headers: new Headers({
                   'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
          }),
              body: JSON.stringify({ email:data.email })
          })
            .then((response) => response.json())
             .then((response) => {
              SecureStore.setItemAsync('token', response.message );
             SecureStore.setItemAsync('email', data.email);
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
          


        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
      signOut: async() =>{ 
        SecureStore.deleteItemAsync('token');
        SecureStore.deleteItemAsync('email');
        dispatch({ type: 'SIGN_OUT' });
    },


      signUp: async (data) => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
        // In the example, we'll use a dummy token
        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
    }),
    []
  );



  return (
    <AuthContext.Provider value={authContext}>
    <Stack.Navigator>
    {state.userToken == null ? 
      <Stack.Screen name="Root" component={WelcomeScreen}    options={{ headerShown: false }} />
       : 
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }}/>
    }
      {state.userToken == null ? null :
      <Stack.Screen name="ProfileScreen" component={ProfileScreen}  options={{ headerShown: true, title:'My profile' }} />
      }    
      <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
       <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="RoomsChatScreen" component={RoomsChatScreen}  options={({ route }) => ({ title: route.params.groupname })}/>
      <Stack.Screen name="SingleChatScreen" component={SingleChatScreen}  options={({ route }) => ({ title: route.params.username })}/>
      <Stack.Screen name="UserProfileScreen" component={UserProfileScreen} options={({ route }) => ({ title: route.params.username })} />
      <Stack.Screen name="RoomsList" component={RoomsList}  options={{ headerShown: true, title:'Chat Rooms' }} />
      <Stack.Screen name="AddImage" component={AddImage}  options={{ headerShown: true, title:'Upload Image' }} />
      <Stack.Screen name="Feedback" component={Feedback}  options={{ headerShown: true, title:'Feedback & Suggetions' }} />
      <Stack.Screen name="Notification" component={Notification}  options={{ headerShown: true, title:'Notifications' }} />      
    </Stack.Navigator>
    </AuthContext.Provider>
  );
}




/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="DashboardScreen"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}>
     
      <BottomTab.Screen
        name="DashboardScreen"
        component={DashboardScreen}
        options={{
          headerShown: false,
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />
        }}
      />
         <BottomTab.Screen
        name="Users"
        component={SearchScreen}
        options={{
          headerShown: false,
          title: 'Users',
          tabBarIcon: ({ color }) => <TabBarIcon name="addusergroup" color={color} />
        }}
      />
  
       <BottomTab.Screen
        name="AddImage"
        component={AddImage}
        options={{
          headerShown: false,
          title: 'New Post',
          tabBarIcon: ({ color }) => <TabBarIcon name="pluscircleo" color={color} />
        }}
      />
         <BottomTab.Screen
        name="Chat"
        component={ChatList}
        options={{
          headerShown: false,
          title: 'Chat',
         // tabBarBadge: '',
          tabBarIcon: ({ color }) => <TabBarIcon name="message1" color={color} />
          
        }}
      />
        <BottomTab.Screen
        name="MyPosts"
        component={MyPosts}
        options={{
          headerShown: false,
          title: 'MyPosts',
          tabBarIcon: ({ color }) => <TabBarIcon name="picture" color={color} />
        }}
      />
 
      
       
     
    </BottomTab.Navigator>
    
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof AntDesign>['name'];
  color: '#000';
}) {
  return <AntDesign size={30} style={{ marginBottom: -3 }} {...props} />;
}
