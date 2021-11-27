import React, {useEffect, useState, useContext } from "react";
import { StyleSheet, Button, View, Text, Image,TextInput, ImageBackground, TouchableOpacity,ActivityIndicator, FlatList, SafeAreaView, ScrollView } from 'react-native';
import AuthContext from './helpers/AuthContext'
import { RootTabScreenProps } from '../types';
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import * as SecureStore from 'expo-secure-store';
import Drawer from "./component/drawer";
import Header from "./component/header";
export default  function CreatePost({ navigation }) {

  const [isLoading, setLoading] = useState(true);
const [data, setData] = useState([]);

async function getValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  
  if (result) {
         setemail(result);
  } 
}
getValueFor('email');

useEffect(() => {
  fetch('https://naturetour.in/apps/smartchatpro/groups.php')
    .then((response) => response.json())
    //.then((response) => {console.log(response.message)})
    .then((json) => setData(json.message))
    .catch((error) => console.error(error))
    .finally(() => setLoading(false));
}, []);

  const [modalVisible, setModalVisible] = useState(false);

  return (
  
    <ImageBackground source={require('./img/background.png')} resizeMode="repeat"  style={styles.image}>
    
    <Header/>
    <Drawer
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        navigation={navigation}
                              
      />
      
    <View style={styles.container}>
    
    <SafeAreaView style={{marginTop:0,marginBottom:0 }}>   
   
          <View style={styles.screen}>
    {isLoading ? <ActivityIndicator/> : (
                <FlatList
                  data={data}
                  
                  keyExtractor={({ id }, index) => id}
                  renderItem={({ item }) => (

           
               <TouchableOpacity activeOpacity={.8} onPress={()=> navigation.navigate('ChatScreen',{
            groupid: item.id,
            groupname: item.groupname
          })}>
               
              <View  style={styles.listoption}>
              <FontAwesome
            style={[styles.listimg, {fontSize: 30, paddingTop: 10 }]}
            name={item.icon}
          />
              
              <Text style={styles.listtxt}>{item.groupname}</Text>
              
            </View>
            </TouchableOpacity>
           
            )}
                />
              )}
</View>
         
         </SafeAreaView>
     </View>
     
    </ImageBackground>
  
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


