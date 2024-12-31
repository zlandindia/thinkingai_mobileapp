import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
} from 'react-native';
import Tts from 'react-native-tts';

const App = () => {
  const [isActive, setIsActive] = useState(false);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);

  // TTS Configuration
  Tts.setDefaultRate(0.5);
  Tts.setDefaultPitch(1.0);

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://zenquotes.io/api/random');
      const data = await response.json();
      const newQuote = {
        id: Date.now().toString(),
        text: data[0].q,
        author: data[0].a,
      };

      setQuotes((prev) => [newQuote, ...prev]);
      if (isActive) {
        pronounceQuote(newQuote.text, newQuote.author);
      }
    } catch (error) {
      console.error('Error fetching quote:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const pronounceQuote = (text, author) => {
    // Split the quote into sentences and pronounce each one sequentially
    const chunks = text.split('. ');
    chunks.forEach((chunk, index) => {
      setTimeout(() => {
        Tts.speak(chunk.trim());
      }, index * 3000); // 3 seconds per sentence
    });

    // Speak the author's name after the quote
    setTimeout(() => {
      Tts.speak(`By ${author}`);
    }, chunks.length * 3000);
  };

  useEffect(() => {
    let interval;
    if (isActive) {
      fetchQuote(); // Fetch immediately on activation
      interval = setInterval(fetchQuote, 10000); // Fetch every 20 seconds
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const toggleSystem = () => {
    setIsActive(!isActive);
    if (!isActive) {
      Tts.speak('Thinking AI system activated. Started Suggesions.');
    } else {
      Tts.speak('Thinking AI system deactivated.');
    }
  };

  const handleQuotePress = (quote) => {
    setSelectedQuote(quote);
    setModalVisible(true);
    pronounceQuote(quote.text, quote.author);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ThinkingAI</Text>

      {/* Quotes List */}
      {loading && <ActivityIndicator size="large" color="#4CAF50" />}
      <FlatList
        data={quotes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleQuotePress(item)}
          >
            <Text style={styles.cardText}>{item.text}</Text>
            <Text style={styles.cardAuthor}>- {item.author}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          !loading && <Text style={styles.emptyText}>Activate to fetch quotes.</Text>
        }
      />

      {/* Floating Bubble Button */}
      <TouchableOpacity
        style={[styles.floatingButton, isActive ? styles.active : styles.inactive]}
        onPress={toggleSystem}
      >
        <Text style={styles.buttonText}>{isActive ? 'Deactivate' : 'Activate'}</Text>
      </TouchableOpacity>

      {/* Quote Details Modal */}
      {selectedQuote && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalQuote}>{selectedQuote.text}</Text>
              <Text style={styles.modalAuthor}>- {selectedQuote.author}</Text>

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

// Styles
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cardText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  cardAuthor: {
    fontSize: 14,
    color: '#888',
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
    // backgroundColor: '#4CAF50',
    backgroundColor: '#FF5722',
  },
  inactive: {
    // backgroundColor: '#FF5722',
    backgroundColor: '#4CAF50',
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
  modalQuote: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  modalAuthor: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#FF5722',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;
