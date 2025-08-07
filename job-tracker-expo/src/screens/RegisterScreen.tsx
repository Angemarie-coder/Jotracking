import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  Alert,
  useWindowDimensions,
  StatusBar
} from 'react-native';
import { TextInput, Text, Card, Title, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { NavigationProps } from '../types';
import Button from '../components/Button';
import { getResponsiveLayout, getScreenPadding } from '../utils/responsive';
import { colors, spacing, typography, borderRadius, shadows } from '../theme';

const RegisterScreen = ({ navigation }: { navigation: NavigationProps }) => {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const responsiveLayout = getResponsiveLayout();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  // Check if form is valid
  const isFormValid = firstName.trim() && 
                     lastName.trim() && 
                     email.trim() && 
                     password.trim() && 
                     confirmPassword.trim() && 
                     password === confirmPassword && 
                     password.length >= 6;

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await register({ firstName, lastName, email, password });
      
      // Show success message and navigate to login
      Alert.alert(
        'Registration Successful!',
        'Please check your email to verify your account before logging in.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login')
          }
        ]
      );
    } catch (error: any) {
      Alert.alert('Registration Failed', error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />
      
      <ScrollView 
        contentContainerStyle={[
          styles.scrollContent,
          { padding: getScreenPadding() }
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Card style={[styles.card]}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.logoContainer}>
              <MaterialCommunityIcons 
                name="briefcase-account" 
                size={48} 
                color={theme.colors.primary} 
              />
              <Title style={styles.title}>Create Account</Title>
              <Text style={styles.subtitle}>Fill in your details to get started</Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.nameContainer}>
                <TextInput
                  label="First Name"
                  value={firstName}
                  onChangeText={setFirstName}
                  mode="outlined"
                  style={[styles.input, styles.nameInput]}
                  autoCapitalize="words"
                  disabled={loading}
                />
                <TextInput
                  label="Last Name"
                  value={lastName}
                  onChangeText={setLastName}
                  mode="outlined"
                  style={[styles.input, styles.nameInput]}
                  autoCapitalize="words"
                  disabled={loading}
                />
              </View>

              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                disabled={loading}
                left={<TextInput.Icon icon="email" />}
              />

              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                style={styles.input}
                secureTextEntry={!showPassword}
                disabled={loading}
                left={<TextInput.Icon icon="lock" />}
                right={
                  <TextInput.Icon 
                    icon={showPassword ? "eye-off" : "eye"} 
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />

              <TextInput
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                mode="outlined"
                style={styles.input}
                secureTextEntry={!showPassword}
                disabled={loading}
                left={<TextInput.Icon icon="lock" />}
              />

              <View style={styles.buttonContainer}>
                <Button
                  mode="contained"
                  onPress={handleRegister}
                  loading={loading}
                  disabled={!isFormValid || loading}
                  title={loading ? 'Creating Account...' : 'Create Account'}
                  style={styles.registerButton}
                />

                <View style={styles.loginContainer}>
                  <Text style={styles.loginText}>Already have an account? </Text>
                  <Button 
                    mode="text" 
                    onPress={() => navigation.navigate('Login')}
                    textColor={theme.colors.primary}
                    size="small"
                    disabled={loading}
                    title="Log In"
                  />
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    margin: 16,
    borderRadius: borderRadius.md,
    ...shadows.md,
  },
  cardContent: {
    padding: spacing.xxl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  title: {
    ...typography.h3,
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body1,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  input: {
    marginBottom: spacing.md,
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    marginTop: spacing.md,
  },
  registerButton: {
    marginTop: spacing.sm,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  loginText: {
    ...typography.body2,
    color: colors.textSecondary,
  },
});

export default RegisterScreen;