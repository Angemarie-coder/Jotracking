import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import { Card, Text, Button, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NavigationProps } from '../types';
import { environment } from '../config/environment';

const EmailVerificationScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute();
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const params = route.params as any;
    if (params?.token && params?.email) {
      verifyEmail(params.token, params.email);
    }
  }, [route.params]);

  const verifyEmail = async (token: string, email: string) => {
    try {
      const response = await fetch(`${environment.apiBaseUrl}/auth/verify-email?token=${token}&email=${email}`);
      
      if (response.ok) {
        setVerificationStatus('success');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Verification failed');
        setVerificationStatus('error');
      }
    } catch (error) {
      setErrorMessage('Network error. Please try again.');
      setVerificationStatus('error');
    }
  };

  const handleResendEmail = () => {
    // TODO: Implement resend verification email
    navigation.navigate('Login');
  };

  const handleGoToLogin = () => {
    navigation.navigate('Login');
  };

  if (verificationStatus === 'pending') {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Card style={styles.card}>
          <Card.Content style={styles.content}>
            <MaterialCommunityIcons 
              name="email-check" 
              size={64} 
              color={theme.colors.primary} 
              style={styles.icon}
            />
            <Text style={[styles.title, { color: theme.colors.onSurface }]}>
              Verifying Email...
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
              Please wait while we verify your email address.
            </Text>
          </Card.Content>
        </Card>
      </View>
    );
  }

  if (verificationStatus === 'success') {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Card style={styles.card}>
          <Card.Content style={styles.content}>
            <MaterialCommunityIcons 
              name="check-circle" 
              size={64} 
              color="#4CAF50" 
              style={styles.icon}
            />
            <Text style={[styles.title, { color: theme.colors.onSurface }]}>
              Email Verified!
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
              Your email has been successfully verified. You can now log in to your account.
            </Text>
            <Button
              mode="contained"
              onPress={handleGoToLogin}
              style={styles.button}
            >
              Go to Login
            </Button>
          </Card.Content>
        </Card>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          <MaterialCommunityIcons 
            name="alert-circle" 
            size={64} 
            color={theme.colors.error} 
            style={styles.icon}
          />
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>
            Verification Failed
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            {errorMessage || 'Unable to verify your email. The link may be expired or invalid.'}
          </Text>
          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={handleResendEmail}
              style={styles.button}
            >
              Resend Email
            </Button>
            <Button
              mode="contained"
              onPress={handleGoToLogin}
              style={styles.button}
            >
              Go to Login
            </Button>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    elevation: 4,
  },
  content: {
    alignItems: 'center',
    padding: 24,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    minWidth: 120,
  },
});

export default EmailVerificationScreen;
