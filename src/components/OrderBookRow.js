import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const OrderBookRow = ({ price, amount, total, type }) => {
  return (
    <View style={[styles.row, type === 'ask' ? styles.askRow : styles.bidRow]}>
      <Text style={styles.price}>{price}</Text>
      <Text style={styles.amount}>{amount}</Text>
      <Text style={styles.total}>{total}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  askRow: {
    backgroundColor: '#FFE6E6',
  },
  bidRow: {
    backgroundColor: '#E6FFE6',
  },
  price: {
    width: '33%',
    textAlign: 'left',
  },
  amount: {
    width: '33%',
    textAlign: 'center',
  },
  total: {
    width: '33%',
    textAlign: 'right',
  },
});

export default OrderBookRow;
