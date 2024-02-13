
import {StyleSheet, Image, View, Platform, Dimensions} from 'react-native';
const {width: screenWidth, height: screenHeight} = Dimensions.get('window'); // 화면 가로,
const LogoTitle = () => {
  return (
    <View style={styles.imgcontainer}>
      <Image
        source={require('../../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  imgcontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      android: {
        position: 'absolute',
        left: screenWidth / 2 - 40,
      },
    }),
  },
  logo: {
    width: 50,
    height: 50,
  },
});

export default LogoTitle;
