import React from 'react';
import {View, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const StarRating = ({rating}) => {
  const filledStars = Math.floor(rating);
  const maxStars = Array(5 - filledStars).fill('star-o');
  const filledStarsArray = Array(filledStars).fill('star');

  return (
    <View style={styles.starRatingContainer}>
      {filledStarsArray.map((type, index) => (
        <Icon key={`filled-star-${index}`} name={type} style={styles.star} />
      ))}
      {maxStars.map((type, index) => (
        <Icon key={`unfilled-star-${index}`} name={type} style={styles.star} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  starRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    color: '#ffd700',
    fontSize: 16,
  },
});

export default StarRating;
