
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileEditScreen = () => {
  // 사용자 정보를 저장할 상태
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // 로그인한 사용자의 ID를 저장할 상태
  const [userId, setUserId] = useState('');

  // 컴포넌트가 마운트될 때 실행될 useEffect
  useEffect(() => {
    AsyncStorage.getItem('userId').then(storedUserId => {
      if (storedUserId) {
        setUserId(storedUserId); // AsyncStorage에서 가져온 userId로 상태 업데이트

        // 사용자 정보를 서버에서 불러오기
        axios
          .get(`http://ceprj.gachon.ac.kr:60005/user/info/${storedUserId}`)
          .then(response => {
            if (response.data.success) {
              // 서버에서 반환하는 필드 이름에 맞게 상태 업데이트
              setNickname(response.data.userInfo.U_NICKNAME);
              setEmail(response.data.userInfo.U_EMAIL);
              setPhone(response.data.userInfo.U_PHONE);
            } else {
              Alert.alert('Error', 'Could not fetch user info');
            }
          })
          .catch(error => {
            console.error('Fetch error: ', error);
            Alert.alert('Error', 'An error occurred while fetching user info');
          });
      }
    });
  }, []);

  const handleEdit = () => {
    const requestData = {
      userId,
      nickname: nickname !== '' ? nickname : undefined,
      email: email !== '' ? email : undefined,
      phone: phone !== '' ? phone : undefined,
    };
    if (password !== '') {
      requestData.password = password; 
    }
    axios
      .post('http://ceprj.gachon.ac.kr:60005/user/edit_profile', requestData)
      .then(response => {
        if (response.data.success) {
          Alert.alert('성공', '프로필 정보가 변경되었습니다.');
        } else {
          Alert.alert('오류', '프로필 변경에 실패했습니다.');
        }
      })
      .catch(error => {
        console.error('프로필 수정 오류: ', error);
        Alert.alert('오류', '프로필 변경 중 오류가 발생했습니다.');
      });
  };
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>닉네임</Text>
      <TextInput
        style={styles.input}
        value={nickname}
        onChangeText={text => setNickname(text)}
        placeholder={nickname}
        placeholderTextColor="gray"
      />
      <Text style={styles.label}>비밀번호</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={text => setPassword(text)}
        secureTextEntry
      />
      <Text style={styles.label}>이메일</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={text => setEmail(text)}
        keyboardType="email-address"
        placeholder={email}
        placeholderTextColor="gray"
      />
      <Text style={styles.label}>전화번호</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={text => setPhone(text)}
        keyboardType="numeric"
        placeholder={phone}
        placeholderTextColor="gray"
      />
      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.btn} onPress={handleEdit}>
          <Text style={styles.btnText}>정보 변경</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 20,
  },
  label: {
    color: 'white',
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: 'white',
  },
  btnContainer: {
    flex: 1,
    alignItems: 'center',
  },
  btn: {
    marginTop: 10,
    backgroundColor: '#be289d',
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 5,
    height: 50,
    width: 100,
    marginBottom: 20,
    justifyContent: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
  },
});

export default ProfileEditScreen;
