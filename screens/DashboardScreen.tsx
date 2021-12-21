import React, {useEffect, useState, useContext, useRef } from "react";
import Constants from 'expo-constants';

import { StyleSheet, Button,RefreshControl,Share,Platform,  View,Dimensions,Linking,Alert,PermissionsAndroid, Text,TextInput, ImageBackground,Clipboard, TouchableOpacity,ActivityIndicator, FlatList, SafeAreaView, ScrollView } from 'react-native';
import AuthContext from './helpers/AuthContext'
import { RootTabScreenProps } from '../types';
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import * as SecureStore from 'expo-secure-store';
import Header from "./component/header";
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing'; 
import * as Notifications from 'expo-notifications';
import Image from 'react-native-scalable-image';

var BASE_URL = require('./helpers/ApiBaseUrl.tsx');


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
export default  function DashboardScreen({ navigation }) {

  
  
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const [expoPushToken, setExpoPushToken] = useState('');
const [notification, setNotification] = useState(false);
const notificationListener = useRef();
const responseListener = useRef();

useEffect(() => {
  registerForPushNotificationsAsync().then(expotoken => setExpoPushToken(expotoken));

  // This listener is fired whenever a notification is received while the app is foregrounded
  notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
    setNotification(notification);
  });

  // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
  responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
    console.log(response);
  });

  return () => {
    Notifications.removeNotificationSubscription(notificationListener.current);
    Notifications.removeNotificationSubscription(responseListener.current);
  };
}, []);

async function registerForPushNotificationsAsync() {
  let expotoken;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    let expotoken = (await Notifications.getExpoPushTokenAsync()).data;

    let token = await SecureStore.getItemAsync('token');
    let email = await SecureStore.getItemAsync('email');

    fetch(BASE_URL+'expotoken.php',
    {
        method: 'POST',
        headers: new Headers({
             'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
    }),
        body: JSON.stringify({ expotoken: expotoken, token:token, email:email   })
    })
      .then((response) => response.json())
       .then((response) => {console.log(response.message)})
      .catch((error) => console.error(error))
      .finally(() => {});


  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return expotoken;
}
}

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }
  var width = Dimensions.get('window').width; 

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 20;
  return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
};



const [state, setState] = useState();
const [loading, setLoading] = useState(true);
const [dataSource, setDataSource] = useState([]);
const [offset, setOffset] = useState(1);
const [data, setData] = useState([]);


useEffect(() => getData(), []);
const getData = () => {
setLoading(true);
fetch(BASE_URL+'homeposts.php?page='+ offset)
  //Sending the currect offset with get request
  .then((response) => response.json())
  .then((responseJson) => {
    //Successful response
  
    if(responseJson.message === false){setLoading(false); return;}
    setOffset(offset + 1);
    //Increasing the offset for the next API call
    setDataSource([...dataSource, ...responseJson.message]);
    setLoading(false);
  })
  .catch((error) => {
    console.error(error);
  });
};
const sharetext = '';
const onShare = async (sharetext) => {
    const result = await Share.share({
      message: sharetext,
    });
};

 const [profiledata, setprofiledata] = useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {

     setRefreshing(true);
     setOffset(1);
     getData();
    wait(2000).then(() => setRefreshing(false));
  }, []);


  const renderFooter = () => {
    return (
      //Footer View with Load More button
      <View style={styles.footer}>
       
          {loading ? (
            <ActivityIndicator
              color="black"
              style={{marginLeft: 8}} />
          ) : null}
       
      </View>
    );
  };
 const ItemView = ({item}) => {
    return (
       <View  style={styles.postlist}>
          
            <TouchableOpacity style={styles.namedes} onPress={()=> navigation.navigate('UserProfileScreen',{
            useremail: item.useremail,
            username: item.username,
          })}>
          <Text style={styles.icouser}>{item.username.charAt(0)}</Text>
            <Text  style={{color:'#000'}}>{item.username}</Text>
          </TouchableOpacity>


          {item.url ?  <View>
            <Image source={{  uri: item.url,}}  width={width}  /> 
            <View style={styles.underpostfooter}>
            {item.postmessage ? <Text style={{ fontSize: 15, fontWeight:'900' }}>{item.postmessage}</Text>: null}
              <View style={{flexDirection:'row',justifyContent:'flex-end'}}>
                
                    <TouchableOpacity activeOpacity={0.7} 
                    style={{ fontSize: 22, paddingTop: 5, paddingLeft: 8, flexDirection: "row" }}
                    onPress={() => {
            const options = {
              mimeType: 'image/jpeg',
              dialogTitle: 'Share the image',
              UTI: 'image/jpeg',
            };
  
            FileSystem.downloadAsync(item.url, FileSystem.cacheDirectory + item.image)
              .then(({ uri }) => {
                setState(`Downloaded image to ${uri}`);
              })
              .catch((err) => {
                setState('Error downloading image');
                console.log(JSON.stringify(err));
              });
  
            // Sharing only allows one to share a file.
            Sharing.shareAsync( FileSystem.cacheDirectory + item.image, options)
              .then((data) => {
                setState('Shared');
              })
              .catch((err) => {
                setState('Error sharing image');
                console.log(JSON.stringify(err));
              });
          }}>
                    <FontAwesome
                      style={{ fontSize: 22, paddingTop: 5, paddingRight: 15, flexDirection: "row" }}
                       name="send-o"
                    />
                    </TouchableOpacity>
                </View>
                </View>
          </View> : 
             <View style={styles.viewsinglepost}>
                        <Text style={styles.postmessagesingle}>{item.postmessage}</Text>
                        <View style={styles.underpostfooter}>
                              <View style={{flexDirection:'row',justifyContent:'flex-end'}}>
                                  
                              <TouchableOpacity activeOpacity={0.7}     onPress={() => {onShare(item.postmessage)}}>
                              <FontAwesome
                                    style={{ fontSize: 22, paddingTop: 5, paddingLeft: 8, flexDirection: "row" }}
                                    name="send-o"
                                  />
                                    </TouchableOpacity>
                                    <TouchableOpacity    activeOpacity={0.1}  
                      onPress={() => Clipboard.setString(item.postmessage) }>
                                    <FontAwesome
                                      style={{ fontSize: 22, paddingTop: 5, paddingLeft: 8, flexDirection: "row" }}
                                      name="copy"
                                    />
                                    </TouchableOpacity>
                                </View>
                            </View>
              
              <View>
                   
                  </View>

                </View>
                 }
                
              </View>
     
    );
  };

  return (
 
    <View>

<View style={styles.outer}>
        
    <Header  navigation={navigation} setprofiledata={true}/>
</View>
      <View style={styles.screen}>
            <View  style={styles.categorieslisting}>  
         
          <ScrollView 
          style={{marginBottom:270}}
           refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />}
           showsHorizontalScrollIndicator={false} 
           showsVerticalScrollIndicator={false}
           onScroll={({nativeEvent}) => {
      if (isCloseToBottom(nativeEvent)) {
        getData();
      }
    }}
    scrollEventThrottle={400}
    >
          <SafeAreaView>
            <View>
                <FlatList
                 data={dataSource}
          keyExtractor={(item, index) => index.toString()}
         
          enableEmptySections={true}
          renderItem={ItemView}
          ListFooterComponent={renderFooter}

             
                />
                </View>
            </SafeAreaView>
          
          </ScrollView>
         
        </View>


          
  
      </View>
      <View></View>

    </View>

    

  );



}

const styles = StyleSheet.create({
  container: {
   padding:0,
  },
  screen:{width:'100%',marginTop:0},
  
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  buttonStyle: {
    width: '100%',
    marginVertical: 10,
    paddingVertical: 15,borderWidth:2,borderColor:'#000',backgroundColor:'#000',
  },
  btntxt: {
    fontWeight: 'bold',
    fontSize: 15,
    color:'#fff',
    lineHeight: 26,
    textAlign:'center',
  },
  image: { flex: 1,
  },
  imglogo:{width:120,height:120,},
  listoption:{backgroundColor:'#fff',minWidth:'100%',marginVertical:5, },
  listtxt:{marginLeft:10,},
  containerwrapper:{paddingTop:40,paddingBottom:10,backgroundColor:'#000',paddingHorizontal:25,},
  headicons:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
  userfletter:{color:'#fff',height:25,width:25,lineHeight:23,borderRadius:50,textAlign:'center',borderColor:'#fff',
borderWidth:1,fontSize:12,
},
postlist:{
  backgroundColor: 'white',
  borderRadius: 8,
  paddingVertical: 5,
  width: '100%',
  marginVertical: 5,
  shadowColor: '#171717',
  shadowOffset: {width: -2, height: 4},
  shadowOpacity: 0.2,
  shadowRadius: 3,
},
icouser:{backgroundColor:'#000',height:20,width:20,color:'#fff',textAlign:'center',lineHeight:20,
borderRadius:20,marginRight:5,
},
namedes:{flexDirection:'row',alignItems:'center',justifyContent:"flex-start",marginBottom:5,paddingHorizontal:5,},
viewsinglepost:{paddingHorizontal:15,},
postmessagesingle:{fontSize:28,},
underpostfooter:{paddingHorizontal:5,}
});
