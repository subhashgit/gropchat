import React, {useEffect, useState, useContext  } from "react";
import { StyleSheet, Button, View, Text, TouchableOpacity, TextInput, ImageBackground, Image, AsyncStorage  } from 'react-native';
import { emailValidator } from './helpers/emailValidator'
import { passwordValidator } from './helpers/passwordValidator'
import SuperAlert from "react-native-super-alert";
import Spinner from 'react-native-loading-spinner-overlay';
var BASE_URL = require('./helpers/ApiBaseUrl.tsx');
import AuthContext from './helpers/AuthContext'

export default function LoginScreen({navigation}) {

  
  const { signIn } = useContext(AuthContext);
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const [Loading, setLoading] = useState(false);
  const onLoginPressed = () => {
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    const emailval = email.value; 
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      
    }
else{
  setLoading(true)
      fetch(BASE_URL+'login.php',
      {
          method: 'POST',
          body: JSON.stringify({ email: email.value, password:password.value, }),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
         
      })
        .then((response) => response.json())
        
        .then((response) => {
          if(response.status === true )
          {
            signIn({email:emailval});
              
            navigation.navigate('Root' );
          
          }
          else{
            alert(response.message);
          }
        
        })  
        .catch((error) => console.error(error))
        .finally(() => setLoading(false));

      }

  }

  const customStyle = {
    container: {
      backgroundColor: '#ffffff',
    },
    buttonConfirm: {
      backgroundColor: '#000',
    },
    title: {
      color: '#000'
    },

  }

  return (
    <ImageBackground source={require('./img/background.png')} resizeMode="repeat"  style={styles.image}>
 <Spinner
          //visibility of Overlay Loading Spinner
          visible={Loading}
          //Text with the Spinner
          textContent={'Loading...'}
          //Text style of the Spinner Text
          textStyle={styles.spinnerTextStyle}
        />
    <View style={styles.container}>
             <View>
                <SuperAlert customStyle={customStyle}/> 
            </View>
    <Image source={require('./img/logo.png')}
  style={styles.imglogo}
/>
    <Text style={styles.textwelcome}>Log In</Text>
    <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
        style={styles.textbox}
        placeholder="Email"
        
      />
      <Text  style={{color:'red'}}>{email.error}</Text>
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
        style={styles.textbox}
        placeholder="Password"
      />
      <Text  style={{color:'red'}}>{password.error}</Text>
      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ResetPasswordScreen')}
        >
          <Text style={styles.forgot}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity  onPress={onLoginPressed} style={styles.buttonStyle}>
                <Text style={styles.btntxt}>Log In</Text>
      </TouchableOpacity>
      <View style={styles.row}>
        <Text>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('RegisterScreen')}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
   

     
    </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
 
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: '#000',
  },
  link: {
    fontWeight: 'bold',
    color: '#000',
  },
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
    justifyContent: "center"
  },
  imglogo:{width:120,height:120,},
  textwelcome:{fontSize:30,marginTop:50,},
  textdesc:{fontSize:14,marginTop:0,marginBottom:60,},
  textbox:{ borderBottomColor:'#000',borderBottomWidth:2,color:'#000',width:'100%',paddingVertical:10,
  marginVertical:5,},
  spinnerTextStyle:{color:'#fff'}

})
