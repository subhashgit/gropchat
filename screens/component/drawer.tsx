import React, { useEffect, useState, useContext } from "react";
import {
  Text,
  View,
  Modal,
  TouchableHighlight,
  ImageBackground,
  Switch,
  Linking,
  TouchableOpacity,
} from "react-native";
import {
  Ionicons,
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { styles } from "../css/UserHeaderStyle";
import AuthContext from '../helpers/AuthContext';

import * as SecureStore from 'expo-secure-store';

export default function Drawer({ navigation,
    modalVisible,
    setModalVisible }) {

    const { signOut } = useContext(AuthContext);
  const [state, setState] = useState({
    update: false,
    photo: "",
   
  });
  const [username, setusername] = useState('');
const [email, setemail] = useState('');
  async function getValueFor() {
    let email = await SecureStore.getItemAsync('email');
    let username = await SecureStore.getItemAsync('username');
    setemail(email);
    setusername(username);
  } 
  getValueFor();
const onpressprofile = () =>{
  navigation.navigate('ProfileScreen');
//  alert();
}
  return (

    <>
      <View style={styles.centeredView}>
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View  style={styles.imagebg}>
                <Text style={styles.modalText}>{username}</Text>
                <Text style={styles.modalTextsub}>{email} </Text>
                </View>
              <TouchableHighlight
                style={{ ...styles.openButton }}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <Ionicons style={styles.closeic} name={"ios-close"} size={60} />
              </TouchableHighlight>
              <View style={styles.listnavwrapper}>
                

            
                <TouchableOpacity style={styles.listnav} onPress={onpressprofile} >
                  <FontAwesome
                    style={styles.navicon}
                    name="user-circle"
                    size={25}
                  />
                  <Text style={styles.navicontxt}>
                    My Account {"\n"}
                    <Text style={styles.naviconsubtxt}>Your profile </Text>
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.listnav}>
                  <MaterialCommunityIcons
                    style={styles.navicon}
                    name="credit-card-outline"
                    size={30}
                  />
                  <Text style={styles.navicontxt}>
                    Feedback {"\n"}
                    <Text style={styles.naviconsubtxt}>Suggetions </Text>{" "}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={signOut} style={styles.listnav}>
                  <MaterialCommunityIcons
                    style={styles.navicon}
                    name="key"
                    size={30}
                  />
                  <Text style={styles.navicontxt}>Log Out </Text>
                </TouchableOpacity>
              </View>
              
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
};

