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

  import AuthContext from './helpers/AuthContext';

  import * as SecureStore from 'expo-secure-store';
  import { emailValidator } from './helpers/emailValidator'
  import { passwordValidator } from './helpers/passwordValidator'
  import { nameValidator } from './helpers/nameValidator'
  import RadioButtonRN from 'radio-buttons-react-native';
  import Header from "./component/header";
export default function ProfileScreen({ navigation }) {


  const { signOut } = useContext(AuthContext);
  const [state, setState] = useState({
    update: false,
    photo: "",
   
  });
  const [username, setusername] = useState('');
  const [email, setemail] = useState('');

  const [ugander, setuGander] = useState('');
  async function getValueFor() {
    let email = await SecureStore.getItemAsync('email');
    let username = await SecureStore.getItemAsync('username');
    setemail(email);
    setusername(username);
    fetch('https://naturetour.in/apps/smartchatpro/getuserbyemail.php',
    {
        method: 'POST',
        body: JSON.stringify({ email: email}),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
       
    })
      .then((response) => response.json())
      .then((response) => {
          setuGander(response.message);
         
          
        })  
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  } 
  getValueFor();
  const [gander, setGander] = useState('');

const data =[    {label: 'Male'     },     {      label: 'Female'     },     {      label: 'Other'     }];
  const [name, setName] = useState({ value: '', error: '' });
  

  const onUpdatePressed = async () => {


    const nameError = nameValidator(name.value);

    if ( nameError) {
      
      return
    }
   else{

    fetch('https://naturetour.in/apps/smartchatpro/updateuserdetail.php',
    {
        method: 'POST',
        body: JSON.stringify({ username: name.value, email: email, gander:gander }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
       
    })
      .then((response) => response.json())
      .then((response) => {
if(response.status === true){
          alert(response.message);
          signOut();
         
        }
        else{
          alert(response.message);
        }
        })  
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
    




   }
  }


const ChangePassword = () =>
{

alert(email);

  fetch('https://naturetour.in/apps/smartchatpro/forgetpassword.php',
  {
      method: 'POST',
      body: JSON.stringify({ email: email }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
     
  })
    .then((response) => response.json())
    .then((response) => {alert(response.message);})  
    .catch((error) => console.error(error))
    .finally(() => setLoading(false));
    
  
}







    return (
      <View>
        <Header/>
      <ScrollView style={styles.scroll}>
        <View style={styles.container}>
          <View style={styles.cardContainer}>
          <View style={styles.headerContainer}>
        <View
          style={styles.headerBackgroundImage}
         
        >
          <View style={styles.headerColumn}>
           
            <Text style={styles.userNameText}>{username}</Text>
            <View style={styles.userAddressRow}>
              <View>
              <FontAwesome
                    style={styles.navicon}
                    name="user-circle"
                    size={18}

                  />
              </View>
              <View style={styles.userCityRow}>
                <Text style={styles.userCityText}>
                 {email}
                </Text>
               
                
              </View>
             
            </View>
            <Text style={styles.userCityText}>
               ({ugander})
                </Text>
          </View>
        </View>
      </View>
          </View>

<View style={styles.textwrapper}>
  
          <Text style={styles.textwelcome}>Edit Info</Text>
   <TextInput
        label="Name"
        returnKeyType="next"
        value={name.value}
        onChangeText={(text) => setName({ value: text, error: '' })}
        error={!!name.error}
        errorText={name.error}
        style={styles.textbox}
        placeholder={username}
      />

<RadioButtonRN
  data={data}
  animationTypes={['zoomIn']}
	initial={-1}
  selectedBtn={(e) => setGander(e.label)}
  style={styles.radiostyle}  
  textStyle={styles.radiotextwrapper}  
  boxStyle={styles.radioboxStyle}  
  circleSize={12}
  
  
/>
      <TouchableOpacity
        onPress={onUpdatePressed}
        style={styles.buttonStyle}>
        <Text style={styles.btntxt}>Update</Text>
        </TouchableOpacity>
    
        <TouchableOpacity onPress={ChangePassword} style={styles.logoutbtn}>
        <Text style={styles.btntxt}>Change password </Text>
                 
                
                </TouchableOpacity>
        <TouchableOpacity onPress={signOut} style={styles.logoutbtn}>
        <Text style={styles.btntxt}>Log Out </Text>
                  <MaterialCommunityIcons
                    style={styles.navicon}
                    name="logout"
                    size={30}
                  />
                
                </TouchableOpacity>
</View>

        </View>
      </ScrollView>
      </View>
    )
  
}
const styles = StyleSheet.create({
  radiotextwrapper:{marginLeft:10},
  radiostyle:{flexDirection:'row',},
  radioboxStyle:{width:'32%', marginHorizontal:'1%'}, 
    cardContainer: {
      backgroundColor: '#FFF',
      borderWidth: 0,
      flex: 1,
      margin: 0,
      padding: 0,
    },
    container: {
      flex: 1,
    },
    emailContainer: {
      backgroundColor: '#FFF',
      flex: 1,
      paddingTop: 30,
    },
    headerBackgroundImage: {
      paddingBottom: 20,
      paddingTop: 25,
      backgroundColor:'#111',
      
    },
    headerContainer: {},
    headerColumn: {
      backgroundColor: 'transparent',
      ...Platform.select({
        ios: {
          alignItems: 'center',
          elevation: 1,
          marginTop: -1,
        },
        android: {
          alignItems: 'center',
        },
      }),
    },
    placeIcon: {
      color: 'white',
      fontSize: 26,
    },
    scroll: {
      backgroundColor: '#FFF',
    },
    telContainer: {
      backgroundColor: '#FFF',
      flex: 1,
      paddingTop: 30,
    },
    userAddressRow: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    userCityRow: {
      backgroundColor: 'transparent',marginLeft:5,
    },
    userCityText: {
      color: '#fff',
      fontSize: 15,
      fontWeight: '600',
      textAlign: 'center',
    },
    userImage: {
      borderColor: '#FFF',
      borderRadius: 85,
      borderWidth: 3,
      height: 170,
      marginBottom: 15,
      width: 170,
    },
    userNameText: {
      color: '#fff',
      fontSize: 22,
      fontWeight: 'bold',
      paddingBottom: 8,
      textAlign: 'center',
    },
    navicon:{
      color: '#fff',},
      buttonStyle: {
        width: '100%',
        marginVertical: 10,
        paddingVertical: 15,borderWidth:2,borderColor:'#000',backgroundColor:'#000',
      },
      logoutbtn:{ width: '100%',
      marginVertical: 10,
      paddingVertical: 15,borderWidth:2,borderColor:'#000',backgroundColor:'#000',
    flexDirection:'row',justifyContent:'center'
    },
      btntxt: {
        fontWeight: 'bold',
        fontSize: 15,
        color:'#fff',
        lineHeight: 26,
        textAlign:'center',
      },
      
  textwelcome:{fontSize:30,marginTop:0,},
  textdesc:{fontSize:14,marginTop:0,marginBottom:60,},
  textbox:{ borderBottomColor:'#000',borderBottomWidth:2,color:'#000',width:'100%',paddingVertical:10,
  marginVertical:5,},
 textwrapper: {  alignItems: 'center',
  justifyContent: 'center',padding:15,}
  })