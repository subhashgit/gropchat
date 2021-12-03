import React, {useEffect, useState, useContext, useRef } from "react";
import { StyleSheet, Button, View, Text, Image,TextInput,RefreshControl, ImageBackground,Dimensions, TouchableOpacity,ActivityIndicator, FlatList, SafeAreaView, ScrollView } from 'react-native';
import AuthContext from './helpers/AuthContext'
import { RootTabScreenProps } from '../types';
import { FontAwesome } from "@expo/vector-icons";
import * as SecureStore from 'expo-secure-store';
var width = Dimensions.get('window').width; 
var BASE_URL = require('./helpers/ApiBaseUrl.tsx');
var userprofileinfo = require('./helpers/Authtoken.tsx');
export default function SingleChatScreen({ navigation, route }: RootTabScreenProps<'WelcomeScreen'>) {
  const { userid, username } = route.params;
  const [state, setState] = useState();
  const [isLoading, setLoading] = useState(true);
  const [text, setText] = useState('');
const [data, setData] = useState([]);

const [email, setemail] = useState('');
const [susername, setsusername] = useState('');
const [token, settoken] = useState('');

const userprofile = async() => {  
  let result = await SecureStore.getItemAsync('token');
await userprofileinfo.UserProfie(result).then((msg) => {
  setemail(msg.email);
  setsusername(msg.username);
  settoken(result);
}).catch((msg) => {
  navigation.navigate('LoginScreen');
})
}

 userprofile();

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }


  const [track, setTrack] = useState('');

  useEffect(() => {
    let repeat;
    async function fetchData() {
      let tokent = await SecureStore.getItemAsync('token');
      let emailv = await SecureStore.getItemAsync('email');
   fetch(BASE_URL+'singlechat.php',
  {
    
      method: 'POST',
      headers: new Headers({
           'Content-Type': 'application/x-www-form-urlencoded', 
  }),
      body: JSON.stringify({ userid:userid,senderemail:emailv, token:tokent })
  })
    .then((response) => response.json())
    .then((response)=>{
      if(response.startedchat === false){return;}
     // console.log(response.message)
      setData(response.message);
    })
     
    .catch((error) => console.error(error))
    .finally(() => setLoading(false));
    repeat = setTimeout(fetchData, 1000);
}

fetchData();

  }, []);
     const msgInput = useRef();
     const scrollViewRef = useRef();

     
const onSendPressed = () => {
if( text == '' ){

  return;
}
fetch(BASE_URL+'sendmessagesingle.php',
{
    method: 'POST',
    body: JSON.stringify({ message:text,userid:userid,senderemail:email, senderusername:susername, token:token }),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
  },
   
})
  .then((response) => response.json())
    .then((response) => { console.log(response.message);  msgInput.current.clear();setText(''); })  
  .catch((error) => console.error(error))
  .finally(() => setLoading(false));

}


const [refreshing, setRefreshing] = React.useState(false);

const [offset, setOffset] = useState(1);
const onRefresh = React.useCallback(() => {
   setRefreshing(true);
  wait(2000).then(() => setRefreshing(false));
}, []);

const ItemView = ({item}) => {


  return (

    <View  style={styles.listoption}>
    <Text style={styles.usenametex}>{item.userdataname}</Text>
    <Text style={styles.msgdatetime}>{item.msgtimedate}</Text>
    
    <Text style={styles.listtxt}>{item.message}</Text>
    
  </View>
  )};

  return (
    
    <View style={styles.image}>
    <View style={styles.container}>
    <ScrollView showsHorizontalScrollIndicator={false} style={{marginTop:0,marginBottom:0 }}
     ref={scrollViewRef}
     onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: false })}
     refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
      />}
    >   
    
          <View style={styles.screen}>
  
          {isLoading ? <ActivityIndicator/> : (
                <FlatList
                data={data}
                keyExtractor={(item, index) => index.toString()}
                enableEmptySections={true}
                renderItem={ItemView}
          />
              )}
</View>
 
         </ScrollView>
         <View style={styles.viewposrtsend}>
         <TextInput
      style={{width:width-80,  borderColor: 'gray', padding:5, borderWidth: 1 }}
   onChangeText={text => setText(text)}
   ref={msgInput}
      placeholder={'Type Message ...'} 
    />
     <TouchableOpacity style={{textAlign:'center', color:'#fff', backgroundColor:'#000'}} activeOpacity={.8} 
        onPress={onSendPressed}  >
             <FontAwesome
            style={styles.sendbutton}
            name={'send'} color={'#fff'}
          />
                  </TouchableOpacity>
                  </View>
     </View>

    </View>
  
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

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
  image: {
    flex: 1,
    
  },
  imglogo:{width:120,height:120,},
  textwelcome:{fontSize:30,marginTop:50,},
  textdesc:{fontSize:14,marginTop:0,marginBottom:10,},
  listoption:{backgroundColor:'#fff',minWidth:'90%',marginVertical:5,paddingVertical:5,paddingHorizontal:5, borderRadius:8},
  listtxt:{marginLeft:0,},
  usenametex:{width:'100%',color:'#aaa',fontSize:12},
  sendbutton:{paddingVertical:15,paddingHorizontal:20,fontSize:25},
  viewposrtsend:{flexDirection:'row',marginBottom:5,},
  msgdatetime:{position:'absolute', right:5,top:5,fontSize:9,color:'#ccc'},
});
