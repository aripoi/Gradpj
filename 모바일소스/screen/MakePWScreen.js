//MakePWScreen
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import {useState} from 'react';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {useRoute} from '@react-navigation/native';
const MakePWScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {userId} = route.params; // 이전 화면에서 전달받은 userId
  const [newPW, setNewPW] = useState('');

  const makePW = () => {
    if (!newPW) {
      Alert.alert('비밀번호 변경 오류', '새 비밀번호를 입력해주세요');
      return;
    }

    axios
      .post('http://ceprj.gachon.ac.kr:60005/user/makePW', {
        userId, // userId 사용
        newPW,
      })
      .then(response => {
        if (response.data.success) {
          Alert.alert(
            '비밀번호 변경 완료',
            '비밀번호가 성공적으로 변경되었습니다.',
            [
              {
                text: '확인',
                onPress: () => navigation.navigate('Login'),
              },
            ],
            {cancelable: false},
          );
        } else {
          Alert.alert(
            '변경 오류',
            response.data.message || '비밀번호 변경에 실패했습니다.',
          );
        }
      })
      .catch(error => {
        console.error('비밀번호 변경 오류: ', error);
        Alert.alert('오류', '비밀번호 변경 중 오류가 발생했습니다.');
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.container1}>
        <Text style={styles.text}>새 비밀번호</Text>
        <TextInput
          style={styles.input}
          value={newPW}
          onChangeText={text => setNewPW(text)}
          placeholder="새 비밀번호"
          placeholderTextColor="gray"
          secureTextEntry={true}
        />
      </View>
      <TouchableOpacity style={styles.btn} onPress={makePW}>
        <Text style={styles.btnTxt}>비밀번호 변경</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#000',
  },
  container1: {
    marginTop: 30,
  },
  text: {
    color: 'white',
    fontSize: 24,
  },
  input: {
    width: 300,
    height: 50,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,
    paddingLeft: 10,
    marginTop: 10,
    color: 'white',
  },
  btn: {
    marginTop: 40,
    backgroundColor: '#be289d',
    borderRadius: 10,
    height: 50,
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnTxt: {
    color: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
  },
});

export default MakePWScreen;
