import React, {useEffect, useState, useContext } from "react";
import { StyleSheet, TextInput,Text, View, FlatList, TouchableOpacity } from 'react-native';

import socketIo from "socket.io-client";
let socket;

const ENDPOINT = "http://192.168.1.2:3000/";

export default function Sample() {
  const [user, setuser] = useState("Rame");
  const [id, setid] = useState("");
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')

  const submitChatMessage = () => {
      socket.emit('message', { message, id });
      setMessage('');
  }

  useEffect(() => {
    socket = socketIo(ENDPOINT, { transports: ['websocket'] });

    socket.on('connect', () => {
        alert('Connected');
        setid(socket.id);

    })
    console.log(socket);
    socket.emit('joined', { user })

    socket.on('welcome', (data) => {
        setMessages([...messages, data]);
        console.log(data.user, data.message);
    })

    socket.on('userJoined', (data) => {
        setMessages([...messages, data]);
        console.log(data.user, data.message);
    })

    socket.on('leave', (data) => {
        setMessages([...messages, data]);
        console.log(data.user, data.message)
    })

    return () => {
        socket.emit('disconnect');
        socket.off();
    }
}, [])

useEffect(() => {
    socket.on('sendMessage', (data) => {
        setMessages([...messages, data]);
        console.log(data.user, data.message, data.id);
    })
    return () => {
        socket.off();
    }
}, [messages])

return (
    <View style={styles.container}>
      
     

      <TextInput
        label="Name"
        returnKeyType="next"
        value={message}
        onChangeText={(text) => setMessage(text)}
        style={styles.textbox}
      />
      <TouchableOpacity activeOpacity={0.7} 
                         style={{ borderWidth: 2,borderColor:'#000',  top: 0}}
                    onPress={submitChatMessage} >
                      <Text>Submit</Text>
  </TouchableOpacity>       
  {messages.map((item, i) =>
   <View>  
    <Text>{item.message} </Text>
    
    </View>
    )} 
 
  </View>
  );

};
const styles = StyleSheet.create({
  container: {
    height: 400,
   marginTop:120,
    backgroundColor: '#F5FCFF',
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
  textbox:{height:50,borderColor:'#000',borderWidth:2,marginTop:50,}
});
