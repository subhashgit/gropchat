import React, { useState,useContext  } from 'react'
import { StyleSheet, Button, View, Text, TouchableOpacity, TextInput, ImageBackground, Image  } from 'react-native';
import { emailValidator } from './helpers/emailValidator'
import { passwordValidator } from './helpers/passwordValidator'
import { nameValidator } from './helpers/nameValidator'
import RadioButtonRN from 'radio-buttons-react-native';
import AuthContext from './helpers/AuthContext'

export default function RegisterScreen({navigation}) {
  
  const { signIn } = useContext(AuthContext);
  
  const [name, setName] = useState({ value: '', error: '' })
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const [gander, setGander] = useState('Male')
  
  const data = [
    {label: 'Male'     },     {      label: 'Female'     },     {      label: 'Other'     }
    ];
  const onSignUpPressed = () => {
   
    const nameError = nameValidator(name.value)
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    if (emailError || passwordError || nameError) {
      setName({ ...name, error: nameError })
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    }
   else{

      fetch('https://naturetour.in/apps/smartchatpro/signup.php',
      {
          method: 'POST',
          body: JSON.stringify({ username: name.value, email: email.value, password:password.value,gander:gander.label }),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
         
      })
        .then((response) => response.json())
        .then((response) => {
          
          if(response.message == 'true'){
            alert(email.value);
            signIn({email:email.value});
          //signIn({email:email});
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
  return (
    <ImageBackground source={require('./img/background.png')} resizeMode="repeat"  style={styles.image}>
    <View style={styles.container}>
    <Image source={require('./img/logo.png')}
  style={styles.imglogo}
/>
    <Text style={styles.textwelcome}>Sign Up</Text>
   <TextInput
        label="Name"
        returnKeyType="next"
        value={name.value}
        onChangeText={(text) => setName({ value: text, error: '' })}
        error={!!name.error}
        errorText={name.error}
        style={styles.textbox}
        placeholder="Name"
      />
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

<RadioButtonRN
  data={data}
  animationTypes={['zoomIn']}
					initial={1}
     
  selectedBtn={(e) => setGander(e)}
  style={styles.radiostyle}  
  textStyle={styles.radiotextwrapper}  
  boxStyle={styles.radioboxStyle}  
  circleSize={12}
  
  
/>
      <TouchableOpacity
        onPress={onSignUpPressed}
        style={styles.buttonStyle}>
        <Text style={styles.btntxt}>Sign Up</Text>
        </TouchableOpacity>
    
      <View style={styles.row}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('LoginScreen')}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
     
    </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }, link: {
    fontWeight: 'bold',
    color: '#000',
  },
   row: {
    display: 'flex',
    flexDirection:'row',
    marginTop: 4,
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
  radiotextwrapper:{marginLeft:10},
  radiostyle:{flexDirection:'row',},
  radioboxStyle:{width:'32%', marginHorizontal:'1%'}, 
  
  
});
