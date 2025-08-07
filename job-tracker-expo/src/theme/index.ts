// src/theme/index.ts

import { StyleSheet } from 'react-native';
// MODIFICATION: Import useTheme and MD3Theme for the new makeStyles function
import { DefaultTheme, useTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';

export const colors = {
  // Primary colors - Enhanced with better contrast and accessibility
  primary: '#2563EB', // Modern blue with better contrast
  primaryLight: '#3B82F6', // Lighter blue
  primaryDark: '#1D4ED8', // Darker blue
  primaryContainer: '#DBEAFE', // Light background for primary
  
  // Secondary colors
  secondary: '#10B981', // Modern green
  secondaryLight: '#34D399', // Lighter green
  secondaryDark: '#059669', // Darker green
  secondaryContainer: '#D1FAE5', // Light background for secondary
  
  // Status colors - Enhanced for better accessibility
  success: '#10B981', // Green
  warning: '#F59E0B', // Amber
  error: '#EF4444', // Red
  info: '#3B82F6', // Blue
  
  // Grayscale - Improved contrast ratios
  white: '#FFFFFF',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  black: '#000000',
  
  // Backgrounds - Enhanced for better visual hierarchy
  background: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceVariant: '#F9FAFB',
  backdrop: 'rgba(0, 0, 0, 0.5)',
  
  // Text - Improved for better readability
  text: '#111827',
  textSecondary: '#4B5563',
  textDisabled: '#9CA3AF',
  textHint: '#6B7280',
  textOnPrimary: '#FFFFFF',
  textOnSecondary: '#000000',
  
  // Additional semantic colors
  border: '#E5E7EB',
  divider: '#F3F4F6',
  overlay: 'rgba(0, 0, 0, 0.1)',
};

export const spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
  // Responsive spacing
  screenPadding: 16,
  screenPaddingLarge: 24,
  cardPadding: 16,
  cardPaddingLarge: 24,
} as const;

export const typography = {
  // Enhanced typography with better hierarchy
  display: {
    fontSize: 48,
    lineHeight: 56,
    fontWeight: 'bold' as const,
    letterSpacing: -0.5,
  },
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: 'bold' as const,
    letterSpacing: -0.25,
  },
  h2: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: 'bold' as const,
    letterSpacing: 0,
  },
  h3: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600' as const,
    letterSpacing: 0,
  },
  h4: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600' as const,
    letterSpacing: 0.15,
  },
  h5: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600' as const,
    letterSpacing: 0.15,
  },
  body1: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
    letterSpacing: 0.5,
  },
  body2: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
    letterSpacing: 0.25,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
    letterSpacing: 0.4,
  },
  button: {
    fontSize: 14,
    lineHeight: 16,
    fontWeight: '500' as const,
    letterSpacing: 1.25,
    textTransform: 'uppercase' as const,
  },
  overline: {
    fontSize: 10,
    lineHeight: 16,
    fontWeight: '500' as const,
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
  },
};

export const borderRadius = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 24,
  pill: 1000,
  // Component-specific border radius
  card: 12,
  button: 8,
  input: 8,
  chip: 16,
} as const;

export const shadows = {
  none: {
    elevation: 0,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  
  sm: {
    elevation: 1,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  md: {
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  lg: {
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  xl: {
    elevation: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
};

// Responsive breakpoints
export const breakpoints = {
  xs: 320,
  sm: 375,
  md: 768,
  lg: 1024,
  xl: 1200,
} as const;

// Enhanced React Native Paper theme configuration
export const theme: MD3Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    primaryContainer: colors.primaryContainer,
    secondary: colors.secondary,
    secondaryContainer: colors.secondaryContainer,
    background: colors.background,
    surface: colors.surface,
    surfaceVariant: colors.surfaceVariant,
    error: colors.error,
    onPrimary: colors.textOnPrimary,
    onSecondary: colors.textOnSecondary,
    onSurface: colors.text,
    onSurfaceVariant: colors.textSecondary,
    outline: colors.border,
  },
};

// ======================================================================
//                              MODIFICATION
// ======================================================================

// This is the new, correct implementation of makeStyles.
// It creates a hook that gives you access to the theme inside your style definitions.

type StyleCreator<T extends StyleSheet.NamedStyles<T>> = (theme: MD3Theme) => T;

export const makeStyles = <T extends StyleSheet.NamedStyles<T>>(
  styleCreator: StyleCreator<T>
) => {
  // Return a hook that can be used in your component
  return () => {
    // This hook gets the theme from the nearest PaperProvider
    const theme = useTheme();
    // It calls your function to get the styles, then creates the StyleSheet
    return StyleSheet.create(styleCreator(theme));
  };
};

// ======================================================================

export default theme;