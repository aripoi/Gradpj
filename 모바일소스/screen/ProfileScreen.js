
import {View, Alert, Text, StyleSheet, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';

const ProfileScreen = () => {
  const navigation = useNavigation();

  const goToReviewScreen = () => {
    navigation.navigate('Review');
  };
  const goToFeedbackScreen = () => {
    navigation.navigate('Feedback');
  };
  const goToListScreen = () => {
    navigation.navigate('List');
  };
  const goToProfileEditScreen = () => {
    navigation.navigate('ProfileEdit');
  };
  const goToDeviceEditScreen = () => {
    navigation.navigate('DeviceEdit');
  };
  const handleLogout = async () => {
    Alert.alert(
      '로그아웃',
      '로그아웃을 하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '확인',
          onPress: async () => {
            try {
              const response = await axios.post(
                'http://ceprj.gachon.ac.kr:60005/user/logout',
              );

              if (response.data.success) {
                await AsyncStorage.removeItem('userSession');
                navigation.reset({
                  index: 0,
                  routes: [{name: 'Home'}],
                });
              } else {
                Alert.alert('로그아웃 오류', '로그아웃에 실패했습니다.');
              }
            } catch (error) {
              console.error('로그아웃 오류', error);
              Alert.alert(
                '로그아웃 오류',
                '로그아웃 중에 오류가 발생했습니다.',
              );
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      '회원탈퇴',
      '정말로 계정을 삭제하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '확인',
          onPress: async () => {
            try {
              const userNum = await AsyncStorage.getItem('userSession'); 
              const response = await axios.post(
                'http://ceprj.gachon.ac.kr:60005/user/delete',
                {userNum: userNum},
              );

              if (response.data.success) {
                await AsyncStorage.removeItem('userSession');
                Alert.alert('회원탈퇴 성공', '계정 정보가 삭제되었습니다.', [
                  {
                    text: '확인',
                    onPress: () => {
                      navigation.reset({
                        index: 0,
                        routes: [{name: 'Home'}],
                      });
                    },
                  },
                ]);
              } else {
                Alert.alert('회원탈퇴 오류', response.data.message);
              }
            } catch (error) {
              console.error('회원탈퇴 오류', error);
              Alert.alert(
                '회원탈퇴 오류',
                '계정 삭제 중에 오류가 발생했습니다.',
              );
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goToProfileEditScreen}>
        <Text style={styles.txt}>내 정보 수정하기</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={goToDeviceEditScreen}>
        <Text style={styles.txt}>기기 등록 수정하기</Text>
      </TouchableOpacity>
      <View
        style={{
          borderBottomWidth: 2,
          borderBottomColor: 'gray',
          marginHorizontal: 10,
        }}
      />
      <TouchableOpacity onPress={goToListScreen}>
        <Text style={styles.txt}>이용 내역</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={goToReviewScreen}>
        <Text style={styles.txt}>칵테일 리뷰</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={goToFeedbackScreen}>
        <Text style={styles.txt}>사용자 피드백</Text>
      </TouchableOpacity>
      <View
        style={{
          borderBottomWidth: 2,
          borderBottomColor: 'gray',
          marginHorizontal: 10,
        }}
      />
      <TouchableOpacity onPress={handleLogout}>
        <Text style={styles.txt}>로그아웃 </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleDeleteAccount}>
        <Text style={styles.txt}>회원탈퇴</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  nickname: {
    fontSize: 20,
    color: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
  },
  txt: {
    marginLeft: 20,
    fontSize: 25,
    color: 'white',
    marginVertical: 20,
  },
});
export default ProfileScreen;
