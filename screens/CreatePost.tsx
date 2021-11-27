import React, { useState, useEffect } from 'react';
import { Button, Image, View, Platform, TextInput, StyleSheet,ImageBackground,TouchableOpacity,Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import RadioButtonRN from 'radio-buttons-react-native';
import Drawer from "./component/drawer";
import { FontAwesome } from "@expo/vector-icons";
import * as SecureStore from 'expo-secure-store';
import Header from "./component/header";
export default function CreatePost(navigation) {
  const [image, setImage] = useState(null);
  const [type, settype] = useState(null);
  const [base, setbase] = useState(null);
  
  const [description, setdescription] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [descriptiontxt, setdescriptiontxt] = useState('');
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let resultt = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64:true,
      quality: 1,
    });

console.log(resultt.base64);
    if (!resultt.cancelled) {
      setImage(resultt.uri);
      setbase(resultt.base64);
    }
  };

  const UploadImage = async () => {
    
   const useremai = await SecureStore.getItemAsync('email');
   const username = await SecureStore.getItemAsync('username');
    setLoading(true);
    
    fetch('https://naturetour.in/apps/smartchatpro/createpost.php',
    {
      
      
        method: 'POST',
        body: JSON.stringify({ base:base, email: useremai, username:username, image:image,  posttype:posttype.label, postmessage:description  }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
       
    })
      .then((response) => response.json())
      
      .then((response) => {
        setdescription('');
        alert(response.message);
      })  
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));

  }


  const UploadText = async () => {
    
    const useremai = await SecureStore.getItemAsync('email');
    const username = await SecureStore.getItemAsync('username');
     setLoading(true);
     
     fetch('https://naturetour.in/apps/smartchatpro/createpost.php',
     {
       
       
         method: 'POST',
         body: JSON.stringify({email: useremai, username:username,  posttype:posttype.label, postmessagetxt:descriptiontxt  }),
         headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json',
       },
        
     })
       .then((response) => response.json())
       
       .then((response) => {
        setdescription('');
         alert(response.message);
       })  
       .catch((error) => console.error(error))
       .finally(() => setLoading(false));
 
   }



  
  const [posttype, setposttype] = useState('Image')
  
  const data = [{label: 'Image'     },{label: 'Text'}];
  
  return (
    <ImageBackground source={require('./img/background.png')} resizeMode="repeat"  style={styles.image}>
      <Header/>
    <Drawer
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        navigation={navigation}
                              
      />
<RadioButtonRN
  data={data}
  animationTypes={['zoomIn']}
					initial={1}
  selectedBtn={(e) => setposttype(e)}
  style={styles.radiostyle}  
  textStyle={styles.radiotextwrapper}  
  boxStyle={styles.radioboxStyle}  
  circleSize={12}
  
  
/>
{posttype.label == 'Image' && 
    <View style={styles.container}>
   
      
      
      {image &&       <ImageBackground source={{ uri: image }} resizeMode="contain"  style={{height:250,width:'100%'}}/>}
      <TouchableOpacity onPress={pickImage} style={styles.buttonStyle}>
       <Text style={styles.btntxt}><FontAwesome
            size={25}
            name='cloud-upload'/> Upload</Text>
      </TouchableOpacity>

      <TextInput
        label="Description"
        value={description}
        onChangeText={(text) => setdescription(text)}
        autoCapitalize="none"
        style={styles.textbox}
        multiline={true}
        numberOfLines={4}
        placeholder="Description"
        
      />
      <TouchableOpacity onPress={UploadImage} style={styles.buttonStyle}>
                <Text style={styles.btntxt}>Post</Text></TouchableOpacity>
     
    </View>
   }
{posttype.label == 'Text' && 
    <View style={styles.container}>
   
      
      <TextInput
        label="Description"
        value={descriptiontxt}
        onChangeText={(text) => setdescriptiontxt(text)}
        autoCapitalize="none"
        style={styles.textbox}
        multiline={true}
        numberOfLines={4}
        placeholder="Description"
        
      />
     
     <TouchableOpacity onPress={UploadText} style={styles.buttonStyle}>
                <Text style={styles.btntxt}>Post</Text></TouchableOpacity>
    </View>
   }

    </ImageBackground>
  );
}


const styles = StyleSheet.create({
 
   container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',padding:15,
  },
  buttonStyle: {
    width: '100%',
    marginVertical: 10,
   
    paddingVertical: 15,borderWidth:2,borderColor:'#000',backgroundColor:'#000',
  },
  btntxt: {
    fontWeight: 'bold',
    fontSize: 15,
    width:'100%',
    color:'#fff',
    lineHeight: 26,
    textAlign:'center',
  },
  image: {
    flex: 1,
    justifyContent: "center"
  },
  textbox:{ borderColor:'#000',borderWidth:2,color:'#000',width:'100%',paddingVertical:10,
  marginVertical:5,padding:15, },
  radiotextwrapper:{marginLeft:10},
  radiostyle:{flexDirection:'row',justifyContent:'center'},
  radioboxStyle:{width:'44%', marginHorizontal:'1%'}, 

})
