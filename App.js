import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Centrifuge from 'centrifuge';
import OrderBook from './src/OrderBook';

export default function App() {
  
  return (
    <View style={styles.container}>
      <OrderBook/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
