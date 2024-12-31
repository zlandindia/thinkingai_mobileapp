import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Tts from 'react-native-tts';

const App = () => {
  const [isActive, setIsActive] = useState(false);
  const [recommendations, setRecommendations] = useState([
    { id: '1', title: 'Read React Native Docs' },
    { id: '2', title: 'Explore Firebase' },
    { id: '3', title: 'Learn about AI Recommendations' },
  ]);

  // TTS Configuration
  Tts.setDefaultRate(0.5);
  Tts.setDefaultPitch(1.0);

  const toggleSystem = () => {
    setIsActive(!isActive);
    const state = isActive ? 'deactivated' : 'activated';
    Alert.alert(`System ${state}`);
    if (!isActive) {
      Tts.speak(
        'Recommendation system activated. Here are your recommendations.',
      );
    } else {
      Tts.speak('Recommendation system deactivated.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recommendation System</Text>

      {/* Recommendations List */}
      <FlatList
        data={isActive ? recommendations : []}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardText}>{item.title}</Text>
          </View>
        )}
        ListEmptyComponent={
          !isActive && (
            <Text style={styles.emptyText}>
              Activate the system to see recommendations.
            </Text>
          )
        }
      />

      {/* Floating Bubble Button */}
      <TouchableOpacity
        style={[
          styles.floatingButton,
          isActive ? styles.active : styles.inactive,
        ]}
        onPress={toggleSystem}>
        <Text style={styles.buttonText}>
          {isActive ? 'Deactivate' : 'Activate'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
    elevation: 3,
  },
  cardText: {
    fontSize: 16,
    color: '#333',
  },
  emptyText: {
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 3,
  },
  active: {
    backgroundColor: '#4CAF50',
  },
  inactive: {
    backgroundColor: '#FF5722',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default App;
