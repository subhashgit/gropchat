import React, {useEffect, useState, useContext } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  View,
} from 'react-native'
import { FontAwesome,  MaterialCommunityIcons
  } from "@expo/vector-icons";

  var BASE_URL = require('./helpers/ApiBaseUrl.tsx');
export default function UserProfileScreen({ navigation,route }) {
  const { username, gander, userid } = route.params;
    return (
      <View style={styles.container}>
        
        <View style={styles.cardContainer}>
        <Text style={styles.icouser}>{username.charAt(0)}</Text>
         <Text style={styles.userNameText}>{username}</Text>
            <Text style={styles.userCityText}>
               ({gander})
                </Text>
        </View>
        
  
        {<TouchableOpacity onPress={()=> navigation.navigate('SingleChatScreen',{
            userid: userid,
            username:username,          
          })} style={styles.logoutbtn}>
        <Text style={styles.btntxt}>Send Message</Text>
                  <MaterialCommunityIcons
                    style={styles.navicon}
                    name="chat-outline"
                    size={30}
                  />
                
                </TouchableOpacity>
                }
      </View>
    )
  
}
const styles = StyleSheet.create({
    cardContainer: {
      backgroundColor: '#000',
      zIndex:99,
      paddingHorizontal:20,
      paddingVertical:50,
    },

    userCityText: {
      color: '#fff',
      fontSize: 15,
      fontWeight: '600',
      textAlign: 'center',
    },
    userNameText: {
      color: '#fff',
      fontSize: 25,
      marginVertical:5,
      fontWeight: '600',
      textAlign: 'center',
    },
    icouser:{backgroundColor:'#000',height:200,width:200,color:'#fff',textAlign:'center',lineHeight:200,
borderRadius:220,borderWidth:5,borderColor:'#fff',fontSize:85,marginBottom:30,flexDirection:'row',alignItems:"center",alignSelf:'center'
},  navicon:{
  color: '#fff',},
  buttonStyle: {
    width: '100%',
    marginVertical: 10,
    paddingVertical: 15,borderWidth:2,borderColor:'#000',backgroundColor:'#000',
  },
  logoutbtn:{ width: '90%',
  marginVertical: 10,
  paddingVertical: 15,borderWidth:2,borderColor:'#000',backgroundColor:'#000',
flexDirection:'row',justifyContent:'center', alignSelf:'center'
},
  btntxt: {
    fontWeight: 'bold',
    fontSize: 15,
    marginRight:8,
    color:'#fff',
    lineHeight: 26,
    textAlign:'center',
  },
  
  })