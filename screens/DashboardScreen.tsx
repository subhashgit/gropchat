import React, {useEffect, useState, useContext } from "react";
import { StyleSheet, Button,RefreshControl,Image, View,Dimensions,Linking,Alert,PermissionsAndroid, Text,TextInput, ImageBackground,Clipboard, TouchableOpacity,ActivityIndicator, FlatList, SafeAreaView, ScrollView } from 'react-native';
import AuthContext from './helpers/AuthContext'
import { RootTabScreenProps } from '../types';
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import * as SecureStore from 'expo-secure-store';
import Drawer from "./component/drawer";
import Header from "./component/header";
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';


export default  function DashboardScreen({ navigation }) {
 


  async function hasAndroidPermission() {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
  
    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }
  
    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  }
  
const  requestCameraPermission = async (photo: string) => {
 
    if (Platform.OS === "android" && !(await hasAndroidPermission())) {
      return;
    }
  
//    CameraRoll.save(tag, { type, album })
var uri = 'https://naturetour.in/apps/smartchatpro/upload/677436693_1637874716.jpg';

const localuri = await FileSystem.downloadAsync(uri, FileSystem.documentDirectory + '123677436693_1637874716.jpg')
const asset = await MediaLibrary.createAssetAsync(photo);
 await MediaLibrary.createAlbumAsync("Down", asset);


  };



























  

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }
  var width = Dimensions.get('window').width; 

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 20;
  return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
};




const [state, setState] = useState(1);
const [loading, setLoading] = useState(true);
const [dataSource, setDataSource] = useState([]);
const [offset, setOffset] = useState(1);
const [data, setData] = useState([]);
const [getfirstnamel, setgetfirstnamel] = useState('');
const [getfullfirstnamel, setfullfirstnamel] = useState('');
async function getValueFor() {
  let username = await SecureStore.getItemAsync('username');
  setfullfirstnamel(username);
  setgetfirstnamel(username.charAt(0));
} 
getValueFor();

useEffect(() => getData(), []);
const getData = () => {
  
setLoading(true);
fetch('https://naturetour.in/apps/smartchatpro/homeposts.php?page='+ offset)
  //Sending the currect offset with get request
  .then((response) => response.json())
  .then((responseJson) => {
    //Successful response
    setOffset(offset + 1);
    //Increasing the offset for the next API call
    setDataSource([...dataSource, ...responseJson.message]);
    setLoading(false);
  })
  .catch((error) => {
    console.error(error);
  });
};



 const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {

     setRefreshing(true);
     getData();
    wait(2000).then(() => setRefreshing(false));
  }, []);


  const renderFooter = () => {
    return (
      //Footer View with Load More button
      <View style={styles.footer}>
       
          {loading ? (
            <ActivityIndicator
              color="black"
              style={{marginLeft: 8}} />
          ) : null}
       
      </View>
    );
  };
 const ItemView = ({item}) => {
    return (
       <View  style={styles.postlist}>
          <View style={styles.namedes}>
          <Text style={styles.icouser}>{item.username.charAt(0)}</Text>
            <Text  style={{color:'#000'}}>{item.username}</Text>
          </View>
          {item.url ?  <View>
            <Image source={{  uri: item.url,}}  style={{ width: width ,aspectRatio: 1,}}  resizeMode={'cover'} /> 
            <View style={styles.underpostfooter}>
            {item.postmessage ? <Text style={{ fontSize: 15, fontWeight:'900' }}>{item.postmessage}</Text>: null}
              <View style={{flexDirection:'row',justifyContent:'flex-end'}}>
                  <FontAwesome
                      style={{ fontSize: 22, paddingTop: 5, paddingLeft: 5, flexDirection: "row" }}
                      name="whatsapp"
                    />
                    <TouchableOpacity activeOpacity={0.7}    onPress={ requestCameraPermission} >
                    <AntDesign
                      style={{ fontSize: 22, paddingTop: 5, paddingLeft: 8, flexDirection: "row" }}
                      name="download"
                    />
                    </TouchableOpacity>
                </View>
                </View>
          </View> : 
             <View style={styles.viewsinglepost}>
                        <Text style={styles.postmessagesingle}>{item.postmessage}</Text>
                        <View style={styles.underpostfooter}>
                              <View style={{flexDirection:'row',justifyContent:'flex-end'}}>
                                  
                              <TouchableOpacity activeOpacity={0.7}    onPress={()=> Linking.openURL('whatsapp://send?text='+item.postmessage)}>
            <FontAwesome
                                      style={{ fontSize: 22, paddingTop: 5, paddingLeft: 5, flexDirection: "row" }}
                                      name="whatsapp"
                                    />
                                    </TouchableOpacity>
                                    <TouchableOpacity    activeOpacity={0.1}  
                      onPress={() => Clipboard.setString(item.postmessage) }>
                                    <FontAwesome
                                      style={{ fontSize: 22, paddingTop: 5, paddingLeft: 8, flexDirection: "row" }}
                                      name="copy"
                                    />
                                    </TouchableOpacity>
                                </View>
                            </View>
              
              <View>
                   
                  </View>

                </View>
                 }
                
              </View>
     
    );
  };

  return (
 
    <View>

<View style={styles.outer}>
        
    <Header/>
    <Drawer
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        navigation={navigation}
                              
      />
</View>
      <View style={styles.screen}>
            <View  style={styles.categorieslisting}>     
          <ScrollView 
           refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />}
           showsHorizontalScrollIndicator={false} onScroll={({nativeEvent}) => {
      if (isCloseToBottom(nativeEvent)) {
        getData();
      }
    }}
    scrollEventThrottle={400}
    
    >
          <SafeAreaView>
                <FlatList
                 data={dataSource}
          keyExtractor={(item, index) => index.toString()}
         
          enableEmptySections={true}
          renderItem={ItemView}
          ListFooterComponent={renderFooter}

             
                />
            </SafeAreaView>
          </ScrollView>
          
        </View>


          
  
      </View>
      <View></View>

    </View>

    

  );



}

const styles = StyleSheet.create({
  container: {
   padding:0,
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
  listoption:{backgroundColor:'#fff',minWidth:'100%',marginVertical:5, },
  listtxt:{marginLeft:10,},
  containerwrapper:{paddingTop:40,paddingBottom:10,backgroundColor:'#000',paddingHorizontal:25,},
  headicons:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
  userfletter:{color:'#fff',height:25,width:25,lineHeight:23,borderRadius:50,textAlign:'center',borderColor:'#fff',
borderWidth:1,fontSize:12,
},
postlist:{
  backgroundColor: 'white',
  borderRadius: 8,
  paddingVertical: 5,
  width: '100%',
  marginVertical: 5,
  shadowColor: '#171717',
  shadowOffset: {width: -2, height: 4},
  shadowOpacity: 0.2,
  shadowRadius: 3,
},
icouser:{backgroundColor:'#000',height:20,width:20,color:'#fff',textAlign:'center',lineHeight:20,
borderRadius:20,marginRight:5,
},
namedes:{flexDirection:'row',alignItems:'center',justifyContent:"flex-start",marginBottom:5,paddingHorizontal:5,},
viewsinglepost:{paddingHorizontal:15,},
postmessagesingle:{fontSize:28,},
underpostfooter:{paddingHorizontal:5,}
});
