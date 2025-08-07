import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import apiService from '../services/api';
import { getApiBaseUrl } from '../config/environment';

const ApiHealthCheck: React.FC = () => {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = async () => {
    setIsChecking(true);
    setError(null);
    
    try {
      const healthy = await apiService.checkApiHealth();
      setIsHealthy(healthy);
    } catch (err) {
      setIsHealthy(false);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  if (isHealthy === null && !isChecking) {
    return null; // Don't show anything if we haven't checked yet
  }

  return (
    <Card style={[styles.container, { 
      backgroundColor: isHealthy ? '#E8F5E8' : '#FFEBEE' 
    }]}>
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <MaterialCommunityIcons 
            name={isHealthy ? 'check-circle' : 'alert-circle'} 
            size={20} 
            color={isHealthy ? '#4CAF50' : '#F44336'} 
          />
          <Text style={[styles.title, { 
            color: isHealthy ? '#4CAF50' : '#F44336' 
          }]}>
            API Connection {isHealthy ? 'OK' : 'Failed'}
          </Text>
        </View>
        
        <Text style={styles.url}>
          {getApiBaseUrl()}
        </Text>
        
        {error && (
          <Text style={styles.error}>
            Error: {error}
          </Text>
        )}
        
        <Button
          mode="outlined"
          onPress={checkHealth}
          loading={isChecking}
          style={styles.button}
        >
          Retry Connection
        </Button>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    elevation: 1,
  },
  content: {
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  url: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 8,
    fontFamily: 'monospace',
  },
  error: {
    fontSize: 12,
    color: '#F44336',
    marginBottom: 8,
  },
  button: {
    alignSelf: 'flex-start',
  },
});

export default ApiHealthCheck; 