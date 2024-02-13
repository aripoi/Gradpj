import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const MakeScreen = () => {
  const navigation = useNavigation();

  const goToGPTScreen = () => {
    navigation.navigate('GPT');
  };
  const goToMakeByMyselfScreen = () => {
    navigation.navigate('MakeByMyself');
  };
  return (
    <View style={styles.container}>
      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.btn} onPress={goToGPTScreen}>
          <Text style={styles.text1}>챗봇으로 제조하기</Text>
        </TouchableOpacity>
        <View style={{width: 10}} />
        <TouchableOpacity style={styles.btn} onPress={goToMakeByMyselfScreen}>
          <Text style={styles.text1}>직접 제조하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  btnContainer: {
    marginBottom: 120,
    flexDirection: 'row',
  },
  btn: {
    backgroundColor: '#be289d',
    width: 120,
    height: 120,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text1: {
    color: 'white',
    fontSize: 20,
  },
});

export default MakeScreen;
