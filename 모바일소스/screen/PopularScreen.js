import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, Image, StyleSheet} from 'react-native';
import axios from 'axios';

const PopularScreen = () => {
  const [cocktailRanking, setCocktailRanking] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCocktailRanking = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          'http://ceprj.gachon.ac.kr:60005/user/cocktailranking',
        );
        setCocktailRanking(response.data.cocktails.slice(0, 10));
      } catch (error) {
        console.error('Error fetching cocktail ranking:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCocktailRanking();
  }, []);

  const renderItem = ({item, index}) => {
    const imageUrl = item.C_IMG.startsWith('http')
      ? item.C_IMG
      : `http://ceprj.gachon.ac.kr:60005${item.C_IMG}`;
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.rank}>{index + 1}</Text>
        <Image source={{uri: imageUrl}} style={styles.image} />
        <Text style={styles.title}>{item.C_NAME}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>인기 칵테일 순위</Text>
      {isLoading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <FlatList
          data={cocktailRanking}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#000',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c1c1e',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  title: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  rank: {
    fontWeight: 'bold',
    color: '#be289d',
    fontSize: 24,
    width: 40,
    textAlign: 'center',
    marginRight: 10,
  },
  loadingText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default PopularScreen;
