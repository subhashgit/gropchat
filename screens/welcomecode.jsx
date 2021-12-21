import * as React from 'react';
import { StyleSheet, Button, View,Dimensions, Text, Image, ImageBackground, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AuthContext from './helpers/AuthContext'

import Spinner from 'react-native-loading-spinner-overlay';
var BASE_URL = require('./helpers/ApiBaseUrl.tsx');
export default function WelcomeScreen({ navigation }) {
  const { signIn } = React.useContext(AuthContext);
  const [Loading, setLoading] =  React.useState(false);
  async function gettoken(key) { 
    
    let result = await SecureStore.getItemAsync(key);
    
    let emailva = await SecureStore.getItemAsync('email');
    if (result) {
      setLoading(true);
      fetch(BASE_URL+'getauthname.php',
      {
          method: 'POST',
          headers: new Headers({
               'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
      }),
    
          body: JSON.stringify({ token: result  })
      })
        .then((response) => response.json())
         .then((response) => {
            if(response.message != '') { 
              signIn({email:emailva});  
            }
            else{
              SecureStore.deleteItemAsync('token');
            SecureStore.deleteItemAsync('email');
            SecureStore.deleteItemAsync('username'); }

          
        })
        .catch((error) => console.error(error))
        .finally(() => setLoading(false));
       
  
    } 
  }
  gettoken('token');
  
  return (
    <ImageBackground source={require('./img/background.png')}  imageStyle={{ resizeMode: 'repeat' }}  style={styles.image}>
    <View style={styles.container}>
    <Spinner
          //visibility of Overlay Loading Spinner
          visible={Loading}
          //Text with the Spinner
          textContent={'Loading...'}
          //Text style of the Spinner Text
          textStyle={styles.spinnerTextStyle}
        />
    <Image source={require('./img/logo.png')}
  style={styles.imglogo}
/>
  <Text style={styles.textwelcome}>Welcome!</Text>
  <Text style={styles.textdesc}>Start Fun with Chatroom!</Text>
  
    <TouchableOpacity
  onPress={() => navigation.navigate('LoginScreen')}
  style={styles.buttonStyle}
>
  <Text style={styles.btntxt}>Log In</Text>
</TouchableOpacity>
    
<TouchableOpacity  onPress={() => navigation.navigate('RegisterScreen')}
  style={styles.buttonStyle}>
    <Text style={styles.btntxt}>Sign Up</Text>
</TouchableOpacity>
     
    </View>
    
    </ImageBackground>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',padding:15,
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
    justifyContent: "center",height:'100%'
  },
  imglogo:{width:120,height:120,},
  textwelcome:{fontSize:30,marginTop:50,},
  textdesc:{fontSize:14,marginTop:0,marginBottom:60,},
  
  spinnerTextStyle:{color:'#fff'}

});