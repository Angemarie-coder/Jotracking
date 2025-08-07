// src/theme/index.ts

import { StyleSheet } from 'react-native';
import { DefaultTheme, useTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';

// Enhanced color palette with better accessibility and modern design
export const colors = {
  // Primary colors - Modern blue with better contrast
  primary: '#2563EB',
  primaryLight: '#3B82F6',
  primaryDark: '#1D4ED8',
  primaryContainer: '#DBEAFE',
  
  // Secondary colors
  secondary: '#10B981',
  secondaryLight: '#34D399',
  secondaryDark: '#059669',
  secondaryContainer: '#D1FAE5',
  
  // Status colors - Enhanced for better accessibility
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Neutral colors - Improved contrast ratios
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
  
  // Job status colors
  statusSaved: '#10B981',
  statusApplied: '#3B82F6',
  statusInterviewing: '#F59E0B',
  statusOffer: '#8B5CF6',
  statusRejected: '#EF4444',
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

// Enhanced typography with better hierarchy and responsive sizing
export const typography = {
  // Display text for hero sections
  display: {
    fontSize: 48,
    lineHeight: 56,
    fontWeight: 'bold' as const,
    letterSpacing: -0.5,
  },
  // Main headings
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
  // Body text
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
  // Caption and small text
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
    letterSpacing: 0.4,
  },
  // Button text
  button: {
    fontSize: 14,
    lineHeight: 16,
    fontWeight: '500' as const,
    letterSpacing: 1.25,
    textTransform: 'uppercase' as const,
  },
  // Overline text
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
  card: 16,
  button: 12,
  input: 12,
  chip: 20,
  avatar: 50,
} as const;

// Enhanced shadows with better depth perception
export const shadows = {
  none: {
    elevation: 0,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  
  sm: {
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  md: {
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  lg: {
    elevation: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
  },
  xl: {
    elevation: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
  },
};

// Responsive breakpoints for different screen sizes
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

// Enhanced makeStyles function for better theme integration
type StyleCreator<T extends StyleSheet.NamedStyles<T>> = (theme: MD3Theme) => T;

export const makeStyles = <T extends StyleSheet.NamedStyles<T>>(
  styleCreator: StyleCreator<T>
) => {
  return () => {
    const theme = useTheme();
    return StyleSheet.create(styleCreator(theme));
  };
};

// Responsive design utilities
export const responsive = {
  // Screen size helpers
  isSmallScreen: (width: number) => width < breakpoints.sm,
  isMediumScreen: (width: number) => width >= breakpoints.sm && width < breakpoints.md,
  isLargeScreen: (width: number) => width >= breakpoints.md && width < breakpoints.lg,
  isXLargeScreen: (width: number) => width >= breakpoints.lg,
  
  // Responsive spacing
  getSpacing: (baseSpacing: number, width: number) => {
    if (width < breakpoints.sm) return baseSpacing * 0.8;
    if (width >= breakpoints.lg) return baseSpacing * 1.2;
    return baseSpacing;
  },
  
  // Responsive font sizes
  getFontSize: (baseSize: number, width: number) => {
    if (width < breakpoints.sm) return baseSize * 0.9;
    if (width >= breakpoints.lg) return baseSize * 1.1;
    return baseSize;
  },
  
  // Responsive padding
  getScreenPadding: (width: number) => {
    if (width < breakpoints.sm) return 12;
    if (width >= breakpoints.lg) return 24;
    return 16;
  },
  
  // Responsive card padding
  getCardPadding: (width: number) => {
    if (width < breakpoints.sm) return 12;
    if (width >= breakpoints.lg) return 20;
    return 16;
  },
  
  // Responsive grid columns
  getGridColumns: (width: number) => {
    if (width < breakpoints.sm) return 1;
    if (width < breakpoints.md) return 2;
    if (width < breakpoints.lg) return 3;
    return 4;
  },
  
  // Responsive button sizes
  getButtonSize: (width: number) => {
    if (width < breakpoints.sm) return 'small';
    if (width >= breakpoints.lg) return 'large';
    return 'medium';
  },
  
  // Responsive icon sizes
  getIconSize: (baseSize: number, width: number) => {
    if (width < breakpoints.sm) return baseSize * 0.9;
    if (width >= breakpoints.lg) return baseSize * 1.1;
    return baseSize;
  },
};

export default theme;