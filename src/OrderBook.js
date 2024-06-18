import React, { useState, useEffect, useRef } from "react";
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from "react-native";
import { Centrifuge } from "centrifuge";
import OrderBookTable from "./components/OrderBookTable";

const OrderBook = () => {
  const [bids, setBids] = useState([]);
  const [asks, setAsks] = useState([]);
  const [connected, setConnected] = useState(false);
  const [expectedSequence, setExpectedSequence] = useState(null);
  const wsRef = useRef(null);

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.disconnect();
      }
    };
  }, []);

  const connectWebSocket = () => {
    const centrifuge = new Centrifuge("wss://api.prod.rabbitx.io/ws", {
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MDAwMDAwMDAwIiwiZXhwIjo2NTQ4NDg3NTY5fQ.o_qBZltZdDHBH3zHPQkcRhVBQCtejIuyq8V1yj5kYq8",
    });

    centrifuge.on("connect", () => {
      console.log("Connected to WebSocket");
      setConnected(true);
    });

    centrifuge.on("disconnect", (ctx) => {
      console.log("Disconnected from WebSocket", ctx);
      setConnected(false);
    });

    centrifuge.on("error", (ctx) => {
      console.error("WebSocket Error:", ctx);
    });

    const subscription = centrifuge.newSubscription("orderbook:BTC-USD"); // Change to your specific channel

    subscription.on("publication", (ctx) => {
      handleWebSocketData(ctx.data);
    });

    subscription.on("subscribe", (ctx) => {
      console.log("Subscribed to orderbook channel", ctx);
      requestOrderbookSnapshot(); // Request initial state when subscribing
    });

    subscription.on("error", (ctx) => {
      console.error("Subscription Error:", ctx);
    });

    subscription.subscribe();

    wsRef.current = centrifuge;
    centrifuge.connect();
  };

  const handleWebSocketData = (data) => {
    // Validate sequence number
    if (expectedSequence !== null && data.sequence_number !== expectedSequence) {
      // Sequence mismatch, request full snapshot and reconnect
      console.log('Requesting orderbook snapshot due to sequence mismatch');
      reconnectWebSocket();
      return;
    }


    // console.log("DAAAAAAAAAAAAAAAAAAAA", data);
    setExpectedSequence(data.sequence_number + 1);

    // Process incoming data and update bids and asks arrays
    if (data.bids) {
      setBids((prevBids) => mergeOrders(prevBids, data.bids));
    }
    if (data.asks) {
      setAsks((prevAsks) => mergeOrders(prevAsks, data.asks));
    }
  };

  const mergeOrders = (prevOrders, newOrders) => {
    // Implement merging logic
    const orderMap = new Map(prevOrders.map(order => [order.id, order]));

    newOrders.forEach(order => {
      if (order.size === 0) {
        orderMap.delete(order.id);
      } else {
        orderMap.set(order.id, order);
      }
    });

    return Array.from(orderMap.values()).sort((a, b) => b.price - a.price);
  };

  const reconnectWebSocket = () => {
    if (wsRef.current) {
      wsRef.current.disconnect();
    }
    setExpectedSequence(null); 
    connectWebSocket();
  };

  const requestOrderbookSnapshot = () => {
    console.log('Requesting full orderbook snapshot');
    // Implement logic to request a full snapshot from the server
    // This function should reset the orderbook and get the initial state again
  };


  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          backgroundColor: connected ? "red" : "green",
          borderRadius: 10,
        }}
      >
        <Text style={styles.status}>
          {connected ? "Connected" : "Disconnected"}
        </Text>
      </View>

      {/* <ScrollView style={styles.bids}>
        <Text style={styles.header}>Bids</Text>
        {bids.map((bid, index) => (
          <Text key={index}>{JSON.stringify(bid)}</Text>
        ))}
      </ScrollView>
      <ScrollView style={styles.asks}>
        <Text style={styles.header}>Asks</Text>
        {asks.map((ask, index) => (
          <Text key={index}>{JSON.stringify(ask)}</Text>
        ))}
      </ScrollView> */}
            <OrderBookTable bids={bids} asks={asks} />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  status: {
    fontSize: 16,
    fontWeight: "bold",

    padding: 5,
  },
  bids: {
    flex: 1,
    marginBottom: 16,
  },
  asks: {
    flex: 1,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
});

export default OrderBook;
