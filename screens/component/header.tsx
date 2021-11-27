import React, {useEffect, useState, useContext } from "react";
import { StyleSheet, Button, View, Text, Image,TextInput, ImageBackground, TouchableOpacity,ActivityIndicator, FlatList, SafeAreaView, ScrollView } from 'react-native';
import AuthContext from '../helpers/AuthContext'
import { FontAwesome } from "@expo/vector-icons";
import * as SecureStore from 'expo-secure-store';
import Drawer from "./drawer";
export default  function Header({ navigation }) {

const [getfirstnamel, setgetfirstnamel] = useState('');
async function gettoken() {
let result = await SecureStore.getItemAsync('token');
  if (result) {
    fetch('https://naturetour.in/apps/smartchatpro/getauthname.php',
    {
        method: 'POST',
        headers: new Headers({
             'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
    }),
        body: JSON.stringify({ token: result  })
    })
      .then((response) => response.json())
       .then((response) => {SecureStore.setItemAsync('username', response.message ); 
       setgetfirstnamel(response.message.charAt(0));
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
       } 
}
gettoken();

const [modalVisible, setModalVisible] = useState(false);
  return (
      <View style={styles.containerwrapper}>
      <View style={styles.headicons}>
      <TouchableOpacity
              onPress={() => {
                setModalVisible(true);
              }}
            >
     <Text style={styles.userfletter}>{getfirstnamel}</Text>
            </TouchableOpacity>
            <FontAwesome name='bell-o' color={'#fff'} size={18}/>
</View>
    <Drawer
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        navigation={navigation}
                              
      />
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
  imglogo:{width:120,height:120,},
  listoption:{backgroundColor:'#fff',minWidth:'100%',marginVertical:5,paddingVertical:10,paddingHorizontal:20, flex:1,
  flexDirection:'row',
  alignItems:'center',
  justifyContent:'flex-start'},
  listtxt:{marginLeft:10,},
  containerwrapper:{paddingTop:40,paddingBottom:10,backgroundColor:'#000',paddingHorizontal:25,},
  headicons:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
  userfletter:{color:'#fff',height:25,width:25,lineHeight:23,borderRadius:50,textAlign:'center',borderColor:'#fff',
borderWidth:1,fontSize:12,
}
});
