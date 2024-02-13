
import React, {useEffect, useState} from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StarRating from 'react-native-star-rating';
import axios from 'axios';
const ReviewScreen = () => {
  const [myHistoryList, setMyHistoryList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [starRating, setStarRating] = useState(0);
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('userId').then(storedUserId => {
      if (storedUserId) {
        setUserId(storedUserId);
      }
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post(
          'http://ceprj.gachon.ac.kr:60005/user/history',
          {ID: userId},
        );
        setMyHistoryList(response.data.useLogs);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  //별점 매기기 모달창
  const openModal = item => {
    setSelectedItem(item);
    setStarRating(item.rating || 0);
    setModalVisible(true);
  };
  const closeModal = () => {
    setSelectedItem(null);
    setModalVisible(false);
  };
  const handleRating = async () => {
    try {
      const response = await axios.post(
        'http://ceprj.gachon.ac.kr:60005/user/horoscope',
        {
          USE_NAME: selectedItem.USE_NAME,
          RATING: starRating,
        },
      );

      // 서버 전송이 성공하면 해당 항목을 화면에서 제거
      setMyHistoryList(prevList =>
        prevList.filter(item => item.USE_ID !== selectedItem.USE_ID),
      );

      // 응답 확인 및 성공 메시지 표시
      console.log(response.data.success);
      if (response.data.success) {
        Alert.alert('성공', '리뷰가 성공적으로 업데이트되었습니다.');
      } else {
        Alert.alert('실패', '리뷰 업데이트에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      Alert.alert('오류', '리뷰 제출 중 오류가 발생했습니다.');
    } finally {
      closeModal();
    }
  };

  const renderItem = ({item}) => {
    const imageUrl = item.C_IMG.startsWith('http')
      ? item.C_IMG
      : `http://ceprj.gachon.ac.kr:60005${item.C_IMG}`;
    return (
      <View style={styles.itemContainer}>
        <Image source={{uri: imageUrl}} style={styles.imageStyle} />
        <View style={styles.textContainer}>
          <Text style={styles.itemTitle}>{item.USE_NAME}</Text>
          <Text style={styles.itemText}>{item.USE_DATE}</Text>
        </View>
        <TouchableOpacity
          style={styles.starContainer}
          onPress={() => openModal(item)}>
          <Text style={styles.starBtn}>별점</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#b3289d" />
      ) : (
        <FlatList
          data={myHistoryList}
          keyExtractor={item => item.USE_ID.toString()}
          renderItem={renderItem}
        />
      )}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>별점 매기기</Text>
            <StarRating
              disabled={false}
              maxStars={5}
              rating={starRating}
              selectedStar={rating => setStarRating(rating)}
              fullStarColor={'#be289d'}
              halfStarEnabled={true}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: 30,
              }}>
              <TouchableOpacity onPress={handleRating} style={styles.modalBtn}>
                <Text style={styles.modalText}>확인</Text>
              </TouchableOpacity>
              <View style={{marginHorizontal: 5}} />
              <TouchableOpacity onPress={closeModal} style={styles.modalBtn}>
                <Text style={styles.modalText}>취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#000',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomColor: '#ccc',
    marginVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  itemTitle: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
  },
  itemText: {
    fontSize: 14,
  },
  starContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#be289d',
    width: 40,
    height: 40,
    borderRadius: 5,
  },
  starBtn: {
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    width: 300,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#be289d',
    width: 60,
    height: 35,
    borderRadius: 5,
  },
  modalText: {color: '#fff'},
});

export default ReviewScreen;
