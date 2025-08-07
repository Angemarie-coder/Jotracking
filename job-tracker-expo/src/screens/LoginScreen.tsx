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
import { TextInput, Text, Card, Title, Paragraph, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { NavigationProps } from '../types';
import Button from '../components/Button';
import { getResponsiveLayout, getScreenPadding, getResponsiveButtonSize } from '../utils/responsive';
import { colors, spacing, typography, borderRadius, shadows } from '../theme';

const LoginScreen = ({ navigation }: { navigation: NavigationProps }) => {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const responsiveLayout = getResponsiveLayout();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  // Check if form is valid
  const isFormValid = email.trim() && password.trim();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await login({ email, password });
    } catch (error: any) {
      Alert.alert('Login Failed', error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterPress = () => {
    navigation.navigate('Register');
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.colors.background }]} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor={theme.colors.background} 
        translucent={false}
      />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={[styles.logoContainer, { backgroundColor: theme.colors.primaryContainer }]}>
            <MaterialCommunityIcons 
              name="briefcase-search" 
              size={responsiveLayout.isSmallScreen ? 48 : 64} 
              color={theme.colors.primary} 
            />
          </View>
          
          <Title style={[styles.title, { color: theme.colors.onSurface }]}>
            Welcome Back
          </Title>
          
          <Paragraph style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            Sign in to continue tracking your job applications
          </Paragraph>
        </View>

        {/* Login Form */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content style={styles.cardContent}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: theme.colors.onSurfaceVariant }]}>
                Email Address
              </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                style={[styles.input, { backgroundColor: theme.colors.surface }]}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
                left={<TextInput.Icon icon="email" color={theme.colors.outline} />}
                outlineColor={theme.colors.outline}
                activeOutlineColor={theme.colors.primary}
                placeholder="Enter your email"
                placeholderTextColor={theme.colors.outline}
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: theme.colors.onSurfaceVariant }]}>
                Password
              </Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                style={[styles.input, { backgroundColor: theme.colors.surface }]}
                secureTextEntry={!showPassword}
                autoComplete="password"
                textContentType="password"
                left={<TextInput.Icon icon="lock" color={theme.colors.outline} />}
                right={
                  <TextInput.Icon 
                    icon={showPassword ? "eye-off" : "eye"} 
                    color={theme.colors.outline}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                outlineColor={theme.colors.outline}
                activeOutlineColor={theme.colors.primary}
                placeholder="Enter your password"
                placeholderTextColor={theme.colors.outline}
              />
            </View>

            {/* Login Button */}
            <View style={styles.buttonContainer}>
              <Button
                onPress={handleLogin}
                mode="contained"
                size={getResponsiveButtonSize() as 'small' | 'medium' | 'large'}
                title="Sign In"
                loading={loading}
                disabled={loading || !isFormValid}
                fullWidth
              />
            </View>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={[styles.divider, { backgroundColor: theme.colors.outline }]} />
              <Text style={[styles.dividerText, { color: theme.colors.onSurfaceVariant }]}>
                or
              </Text>
              <View style={[styles.divider, { backgroundColor: theme.colors.outline }]} />
            </View>

            {/* Register Link */}
            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: theme.colors.onSurfaceVariant }]}>
                Don't have an account?{' '}
              </Text>
              <Button
                onPress={handleRegisterPress}
                mode="text"
                size="small"
                title="Sign Up"
                accessibilityLabel="Navigate to registration screen"
              />
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
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: getScreenPadding(),
    paddingVertical: spacing.xl,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  title: {
    ...typography.h1,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body1,
    textAlign: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  card: {
    borderRadius: borderRadius.card,
    ...shadows.lg,
  },
  cardContent: {
    padding: spacing.lg,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    ...typography.body2,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  input: {
    fontSize: 16,
    borderRadius: borderRadius.input,
  },
  buttonContainer: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  divider: {
    flex: 1,
    height: 1,
    opacity: 0.3,
  },
  dividerText: {
    ...typography.caption,
    marginHorizontal: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  footerText: {
    ...typography.body2,
  },
});

export default LoginScreen; 