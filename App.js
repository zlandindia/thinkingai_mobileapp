import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import Tts from 'react-native-tts';

const App = () => {
  const [isActive, setIsActive] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);

  const [recommendations, setRecommendations] = useState([
    { id: '1', title: 'Learn React Native', details: 'Dive into React Native for mobile app development.' },
    { id: '2', title: 'Explore Firebase', details: 'Understand how Firebase can help with your app backend.' },
    { id: '3', title: 'Build a Recommendation App', details: 'Create a recommendation system using AI.' },
  ]);

  // TTS Configuration
  Tts.setDefaultRate(0.5);
  Tts.setDefaultPitch(1.0);

  const toggleSystem = () => {
    setIsActive(!isActive);
    if (!isActive) {
      Tts.speak('Recommendation system activated. Here are your recommendations.');
    } else {
      Tts.speak('Recommendation system deactivated.');
    }
  };

  const handleRecommendationPress = (recommendation) => {
    setSelectedRecommendation(recommendation);
    setModalVisible(true);
    Tts.speak(recommendation.title + '. ' + recommendation.details);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recommendation System</Text>

      {/* Recommendations List */}
      <FlatList
        data={isActive ? recommendations : []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleRecommendationPress(item)}
          >
            <Text style={styles.cardText}>{item.title}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          !isActive && <Text style={styles.emptyText}>Activate the system to see recommendations.</Text>
        }
      />

      {/* Floating Bubble Button */}
      <TouchableOpacity
        style={[styles.floatingButton, isActive ? styles.active : styles.inactive]}
        onPress={toggleSystem}
      >
        <Text style={styles.buttonText}>{isActive ? 'Deactivate' : 'Activate'}</Text>
      </TouchableOpacity>

      {/* Popup Modal */}
      {selectedRecommendation && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>{selectedRecommendation.title}</Text>
              <Text style={styles.modalMessage}>{selectedRecommendation.details}</Text>

              <Pressable
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

// Styles for the components
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  modalMessage: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#FF5722',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    elevation: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;
