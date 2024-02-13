import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MakeByMyselfScreen = ({navigation}) => {
  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [num3, setNum3] = useState('');
  const [num4, setNum4] = useState('');
  const [first, setFirst] = useState('');
  const [second, setSecond] = useState('');
  const [third, setThird] = useState('');
  const [fourth, setFourth] = useState('');

  const Number1 = [
    {label: '선택하세요', value: '선택하세요'},
    {label: 'Anejo Cuatro Rum', value: 'Anejo Cuatro Rum'},
    {label: 'Apple Cider', value: 'Apple Cider'},
    {label: 'Apple Juice', value: 'Apple Juice'},
    {label: 'Apricot Brandy', value: 'Apricot Brandy'},
    {label: 'Banana Liqueur', value: 'Banana Liqueur'},
    {
      label: 'Black Raspberry Liqueur',
      value: 'Black Raspberry Liqueur',
    },
    {label: 'Black Rum', value: 'Black Rum'},
    {label: 'Blanco Tequila', value: 'Blanco Tequila'},
    {
      label: 'Blood Orange Juice',
      value: 'Blood Orange Juice',
    },
    {label: 'Blood Orange Soda', value: 'Blood Orange Soda'},
    {label: 'Blue Curacao', value: 'Blue Curacao'},
    {
      label: 'Blue Curacao Liqueur',
      value: 'Blue Curacao Liqueur',
    },
    {label: 'Bourbon Whiskey', value: 'Bourbon Whiskey'},
    {label: 'Canadian Whiskey', value: 'Canadian Whiskey'},
    {label: 'Champagne', value: 'Champagne'},
    {
      label: 'Chartreuse Green Liqueur',
      value: 'Chartreuse Green Liqueur',
    },
    {label: 'Cherry Brandy', value: 'Cherry Brandy'},
    {label: 'Citrus Syrup', value: 'Citrus Syrup'},
    {label: 'Citrus Vodka', value: 'Citrus Vodka'},
    {label: 'Club Soda', value: 'Club Soda'},
    {label: 'Coconut Rum', value: 'Coconut Rum'},
    {label: 'Coconut Water', value: 'Coconut Water'},
    {
      label: 'Coffee Flavored Liqueur',
      value: 'Coffee Flavored Liqueur',
    },
    {label: 'Coffee Liqueur', value: 'Coffee Liqueur'},
    {label: 'Cola', value: 'Cola'},
    {label: 'Cranberry Juice', value: 'Cranberry Juice'},
    {label: 'Cream of Coconut', value: 'Cream of Coconut'},
    {label: 'Diet Cola', value: 'Diet Cola'},
    {label: 'Dry Gin', value: 'Dry Gin'},
    {label: 'Dry Vermouth', value: 'Dry Vermouth'},
    {
      label: 'Elderflower Liqueur',
      value: 'Elderflower Liqueur',
    },
    {label: 'Espresso', value: 'Espresso'},
    {label: 'Gin', value: 'Gin'},
    {label: 'Gin Based Liqueur', value: 'Gin Based Liqueur'},
    {label: 'Ginger Ale', value: 'Ginger Ale'},
    {label: 'Ginger Beer', value: 'Ginger Beer'},

    {label: 'Ginger Simple Syrup', value: 'Ginger Simple Syrup'},

    {label: 'Gold Rum', value: 'Gold Rum'},
    {label: 'Grand Marnier', value: 'Grand Marnier'},
    {label: 'Grapefruit Juice', value: 'Grapefruit Juice'},
    {label: 'Grenadine Syrup', value: 'Grenadine Syrup'},
    {label: 'Honey', value: 'Honey'},

    {label: 'Honey Ginger Syrup', value: 'Honey Ginger Syrup'},
    {label: 'Honey Syrup', value: 'Honey Syrup'},
    {label: 'Irish Whiskey', value: 'Irish Whiskey'},
    {label: 'Jamaican Rum', value: 'Jamaican Rum'},

    {label: 'Lemon Flavored Liqueur', value: 'Lemon Flavored Liqueur'},
    {label: 'Lemon Juice', value: 'Lemon Juice'},
    {label: 'Lime Flavored Rum', value: 'Lime Flavored Rum'},
    {label: 'Lime Juice', value: 'Lime Juice'},

    {label: 'Limon Flavored Rum', value: 'Limon Flavored Rum'},
    {label: 'Orange Juice', value: 'Orange Juice'},
    {label: 'Original Vodka', value: 'Original Vodka'},

    {label: 'Peach Flavored Schnapps', value: 'Peach Flavored Schnapps'},
    {label: 'Pineapple Juice', value: 'Pineapple Juice'},

    {label: 'Raspberry Flavored Liqueur', value: 'Raspberry Flavored Liqueur'},
    {label: 'Red Burgundy Wine', value: 'Red Burgundy Wine'},
    {label: 'Rum', value: 'Rum'},
    {label: 'Rum Cream Liqueur', value: 'Rum Cream Liqueur'},
    {label: 'Scotch Whiskey', value: 'Scotch Whiskey'},
    {label: 'Simple Syrup', value: 'Simple Syrup'},
    {label: 'Soda Water', value: 'Soda Water'},
    {label: 'Sour Mix', value: 'Sour Mix'},
    {label: 'Strawberry Syrup', value: 'Strawberry Syrup'},
    {label: 'Sweet Vermouth', value: 'Sweet Vermouth'},
    {label: 'Tennessee Whiskey', value: 'Tennessee Whiskey'},
    {label: 'Toffee Syrup', value: 'Toffee Syrup'},
    {label: 'Tomato Juice', value: 'Tomato Juice'},
    {label: 'Tonic Water', value: 'Tonic Water'},
    {label: 'Triple Sec', value: 'Triple Sec'},
    {label: 'Vermouth', value: 'Vermouth'},
    {label: 'Vodka', value: 'Vodka'},

    {
      label: 'Whiskey Fruit Spice Liqueur',
      value: 'Whiskey Fruit Spice Liqueur',
    },

    {label: 'White Rum', value: 'White Rum'},
  ];
  const Volume1 = [
    {label: '선택하세요', value: '선택하세요'},
    {label: '0ml', value: 1},
    {label: '15ml', value: 15},
    {label: '30ml', value: 30},
    {label: '45ml', value: 45},
    {label: '60ml', value: 60},
    {label: '75ml', value: 75},
    {label: '90ml', value: 90},
  ];
  const [userId, setUserId] = useState('');
  useEffect(() => {
    // AsyncStorage에서 사용자 ID 가져오기
    AsyncStorage.getItem('userId').then(storedUserId => {
      if (storedUserId) {
        setUserId(storedUserId); // AsyncStorage에서 가져온 userId로 상태 업데이트
      }
    });
  }, []);
  const customCocktail = async () => {
    try {
      // 1. 사용자의 Raspberry Pi IP 주소 요청
      const ipResponse = await axios.post(
        'http://ceprj.gachon.ac.kr:60005/user/req_ip',
        {
          id: userId,
        },
      );

      if (!ipResponse.data.success) {
        throw new Error('Raspberry Pi IP 주소를 가져오는데 실패했습니다.');
      }

      const raspberryPiIp = ipResponse.data.raspberryPiIp;
      const Response2 = await axios.post(
        'http://ceprj.gachon.ac.kr:60005/user/device_status',
        {
          id: userId,
        },
      );
      if (Response2.data.devstatus !== 'inprogress') {
        // 2. 칵테일 제조 요청 데이터
        const requestData = {
          UserID: userId,
          recipeTitle: 'Custom Cocktail',
          first: first === '' ? 1 : first,
          second: second === '' ? 1 : second,
          third: third === '' ? 1 : third,
          fourth: fourth === '' ? 1 : fourth,
        };

        // 3. 칵테일 제조 요청
        console.log(raspberryPiIp);
        console.log(requestData);
        const makeResponse = await axios.post(
          `http://${raspberryPiIp}:10000/make_cocktail`,
          requestData,
        );

        console.log('Success', makeResponse.data.success);
        Alert.alert(
          '제조 완료',
          '칵테일을 제조가 완료 되었습니다.',
          [
            {
              text: '확인',
              onPress: () => {
                navigation.navigate('List', {responseData: makeResponse.data});
              },
            },
          ],
          {cancelable: false},
        );
      } else {
        Alert.alert(
          '제조 요청',
          '메이커가 제조 중입니다. 잠시 후 시도해 주세요.',
          [
            {
              text: '확인',
              onPress: () => {
                navigation.navigate('List', {responseData: makeResponse.data});
              },
            },
          ],
          {cancelable: false},
        );
      }
    } catch (error) {
      console.error('Error', error);
      Alert.alert('오류', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.excontainer}>
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>1번: </Text>
          <Picker
            selectedValue={num1}
            onValueChange={(itemValue, itemIndex) => setNum1(itemValue)}
            style={styles.picker}>
            {Number1.map(number1 => (
              <Picker.Item
                key={number1.value}
                label={number1.label}
                value={number1.value}
              />
            ))}
          </Picker>
        </View>
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>용량: </Text>
          <Picker
            selectedValue={first}
            onValueChange={(itemValue, itemIndex) => setFirst(itemValue)}
            style={styles.picker}>
            {Volume1.map(volume1 => (
              <Picker.Item
                key={volume1.value}
                label={volume1.label}
                value={volume1.value}
              />
            ))}
          </Picker>
        </View>
      </View>
      <View style={styles.excontainer}>
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>2번: </Text>
          <Picker
            selectedValue={num2}
            onValueChange={(itemValue, itemIndex) => setNum2(itemValue)}
            style={styles.picker}>
            {Number1.map(number2 => (
              <Picker.Item
                key={number2.value}
                label={number2.label}
                value={number2.value}
              />
            ))}
          </Picker>
        </View>
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>용량: </Text>
          <Picker
            selectedValue={second}
            onValueChange={(itemValue, itemIndex) => setSecond(itemValue)}
            style={styles.picker}>
            {Volume1.map(volume2 => (
              <Picker.Item
                key={volume2.value}
                label={volume2.label}
                value={volume2.value}
              />
            ))}
          </Picker>
        </View>
      </View>
      <View style={styles.excontainer}>
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>3번: </Text>
          <Picker
            selectedValue={num3}
            onValueChange={(itemValue, itemIndex) => setNum3(itemValue)}
            style={styles.picker}>
            {Number1.map(number3 => (
              <Picker.Item
                key={number3.value}
                label={number3.label}
                value={number3.value}
              />
            ))}
          </Picker>
        </View>
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>용량: </Text>
          <Picker
            selectedValue={third}
            onValueChange={(itemValue, itemIndex) => setThird(itemValue)}
            style={styles.picker}>
            {Volume1.map(volume3 => (
              <Picker.Item
                key={volume3.value}
                label={volume3.label}
                value={volume3.value}
              />
            ))}
          </Picker>
        </View>
      </View>
      <View style={styles.excontainer}>
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>4번: </Text>
          <Picker
            selectedValue={num4}
            onValueChange={(itemValue, itemIndex) => setNum4(itemValue)}
            style={styles.picker}>
            {Number1.map(number4 => (
              <Picker.Item
                key={number4.value}
                label={number4.label}
                value={number4.value}
              />
            ))}
          </Picker>
        </View>
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>용량: </Text>
          <Picker
            selectedValue={fourth}
            onValueChange={(itemValue, itemIndex) => setFourth(itemValue)}
            style={styles.picker}>
            {Volume1.map(volume4 => (
              <Picker.Item
                key={volume4.value}
                label={volume4.label}
                value={volume4.value}
              />
            ))}
          </Picker>
        </View>
      </View>
      <TouchableOpacity style={styles.makeBtn} onPress={customCocktail}>
        <Text style={styles.makeBtnTxt}>제조하기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  excontainer: {
    flexDirection: 'row',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    marginRight: 10,
  },
  picker: {
    width: Dimensions.get('window').width / 3, // 조절 가능한 폭
  },
  selectedText: {
    fontSize: 16,
    marginTop: 10,
  },
  makeBtn: {
    backgroundColor: '#be289d',
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 5,
    height: 60,
    width: 120,
    marginBottom: 20,
    marginTop: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  makeBtnTxt: {fontSize: 25, color: 'white'},
});

export default MakeByMyselfScreen;
