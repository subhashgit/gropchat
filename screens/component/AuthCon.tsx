import React, { useState, useContext } from "react";
import AuthContext from '../helpers/AuthContext'
import * as SecureStore from 'expo-secure-store';

export default  function Authcon({ navigation }) {
    const [username, setusername] = useState('');
    const [email, setemail] = useState('');
    

async function gettoken() {
let result = await SecureStore.getItemAsync('token');
  if (result) {
    let emailz = await SecureStore.getItemAsync('email');
    let usernamez = await SecureStore.getItemAsync('username');
    setusername(emailz);
    setemail(usernamez);
    }
    else{
        navigation.navigate('HomeScreen');
    }

}
gettoken();


}
