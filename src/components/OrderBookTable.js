import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import OrderBookRow from './OrderBookRow';

const OrderBookTable = ({ bids, asks }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Order Book</Text>
      <View style={styles.tableHeader}>
        <Text style={styles.headerCell}>Price</Text>
        <Text style={styles.headerCell}>Amount</Text>
        <Text style={styles.headerCell}>Total</Text>
      </View>
      <View style={styles.asks}>
        {asks.map((ask, index) => (
          <OrderBookRow key={index} price={ask[0]} amount={ask[1]} total={ask[1]} type="ask" />
        ))}
      </View>
      <View style={styles.bids}>
        {bids.map((bid, index) => (
          <OrderBookRow key={index} price={bid[0]} amount={bid[1]} total={bid[1]} type="bid" />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#DDDDDD',
  },
  headerCell: {
    width: '33%',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  asks: {
    backgroundColor: '#FFE6E6',
  },
  bids: {
    backgroundColor: '#E6FFE6',
  },
});

export default OrderBookTable;
