import React, { useEffect, useMemo, useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { io } from 'socket.io-client';

const socketcheck = () => {
  const [data, setdata] = useState('');
  const [room, setroom] = useState('');
  const [roomName, setroomName] = useState('');
  const [messageList, setmessageList] = useState([]);
  const [id, setid] = useState(Math.random().toFixed(2));
  const math = Math.random().toFixed(2);
  const socket = useMemo(() => io('http://192.168.29.141:8200/', {
    withCredentials: true,
  }), []);
  console.log(messageList);
  useEffect(() => {
    socket.on('connect', () => {
      console.log(math, 'connected app', socket.id);
      setid(socket.id);
    });
    // socket.on('welcoem', data => {
    //   console.log(data);
    // });
    socket.on('recived_msg', data => {
      console.log(data + ' ' + socket.id);
      setmessageList(messageList => [...messageList , data])
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <View>
      <Text>id = {id} </Text>

      <TextInput
        placeholder="Type here..."
        value={data}
        onChangeText={txt => setdata(txt)}
      />

      <TextInput
        placeholder="Enter Room name"
        value={room}
        onChangeText={txt => setroom(txt)}
      />

      <TouchableOpacity
        onPress={() => {
          socket.emit('message', {data, room});
          setdata('');
        }}>
        <Text>Click</Text>
      </TouchableOpacity>

      {messageList.map((m, i) => {
        return <Text key={i}>{m}</Text>;
      })}

      <Text>Join Room</Text>
      <TextInput
        placeholder="Room Name"
        value={roomName}
        onChangeText={txt => setroomName(txt)}
      />

      <TouchableOpacity
        onPress={() => {
          socket.emit('join_room',  roomName);
          setroomName('');
        }}>
        <Text>Join room button</Text>
      </TouchableOpacity>
    </View>
  );
};

export default socketcheck;

const styles = StyleSheet.create({});
