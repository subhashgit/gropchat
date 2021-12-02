import React, {useEffect, useState, useContext } from "react";
import { StyleSheet, Button, View, Text, Image,TextInput, ImageBackground, TouchableOpacity,ActivityIndicator, FlatList, SafeAreaView, ScrollView } from 'react-native';
import AuthContext from '../helpers/AuthContext'
import { FontAwesome } from "@expo/vector-icons";
import * as SecureStore from 'expo-secure-store';
var BASE_URL = require('../helpers/ApiBaseUrl.tsx');

var userprofileinfo = require('../helpers/Authtoken.tsx');

import {
  PublisherBanner,
} from 'expo-ads-admob';
import LoginScreen from "../LoginScreen";
export default  function Header({ navigation }) {

const [userinfo, setuserinfo] = useState([]);
const [firstnamelaller, setfirstnamelaller] = useState([]);


const userprofile = async() => {  
  let result = await SecureStore.getItemAsync('token');
await userprofileinfo.UserProfie(result).then((msg) => {
  setfirstnamelaller(msg.username.charAt(0));
}).catch((msg) => {
  navigation.navigate(LoginScreen);
})
}

 userprofile();


//setfirstnamelaller(userinfo.username);
const [modalVisible, setModalVisible] = useState(false);
  return (
      <View style={styles.containerwrapper}>
      <View style={styles.headicons}>
      <Image source={require('../img/logowhite.png')}
  style={styles.imglogo}
/>
           
     <Text style={styles.userfletter}>{firstnamelaller}</Text>
           

 </View>
 <PublisherBanner
  bannerSize="fullBanner"
  adUnitID="ca-app-pub-3185366657620430/1873326666" // Test ID, Replace with your-admob-unit-id
  servePersonalizedAds // true or false
   />   
  {/* 
 <Drawer
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        navigation={navigation}
                              
      />
   */}
      </View>
 
  
  );
}

const styles = StyleSheet.create({
  container: {
   padding:15,
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
  imglogo:{width:120,height:21,},
  listoption:{backgroundColor:'#fff',minWidth:'100%',marginVertical:5,paddingVertical:10,paddingHorizontal:20, flex:1,
  flexDirection:'row',
  alignItems:'center',
  justifyContent:'flex-start'},
  listtxt:{marginLeft:10,},
  containerwrapper:{paddingTop:40,paddingBottom:0,backgroundColor:'#000',paddingHorizontal:25,},
  headicons:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:10},
  userfletter:{color:'#fff',height:25,width:25,lineHeight:23,borderRadius:50,textAlign:'center',borderColor:'#fff',
borderWidth:1,fontSize:12,
}
});
