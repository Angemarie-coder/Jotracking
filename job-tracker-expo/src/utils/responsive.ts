import { Dimensions, PixelRatio, Platform } from 'react-native';
import { breakpoints, responsive as themeResponsive } from '../theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Responsive width calculation
export const wp = (percentage: number) => {
  return (screenWidth * percentage) / 100;
};

// Responsive height calculation
export const hp = (percentage: number) => {
  return (screenHeight * percentage) / 100;
};

// Responsive font size with better scaling
export const rf = (size: number) => {
  const scale = screenWidth / 375; // Base width is 375 (iPhone X)
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// Get screen dimensions
export const getScreenDimensions = () => ({
  width: screenWidth,
  height: screenHeight,
});

// Enhanced responsive breakpoint helpers using theme system
export const isSmallScreen = () => themeResponsive.isSmallScreen(screenWidth);
export const isMediumScreen = () => themeResponsive.isMediumScreen(screenWidth);
export const isLargeScreen = () => themeResponsive.isLargeScreen(screenWidth);
export const isXLargeScreen = () => themeResponsive.isXLargeScreen(screenWidth);

// Enhanced responsive spacing using theme system
export const getResponsiveSpacing = (baseSpacing: number) => {
  return themeResponsive.getSpacing(baseSpacing, screenWidth);
};

// Enhanced responsive font sizes using theme system
export const getResponsiveFontSize = (baseSize: number) => {
  return themeResponsive.getFontSize(baseSize, screenWidth);
};

// Platform-specific adjustments
export const getPlatformValue = (iosValue: any, androidValue: any) => {
  return Platform.OS === 'ios' ? iosValue : androidValue;
};

// Enhanced responsive padding using theme system
export const getScreenPadding = () => {
  return themeResponsive.getScreenPadding(screenWidth);
};

// Enhanced responsive card padding using theme system
export const getCardPadding = () => {
  return themeResponsive.getCardPadding(screenWidth);
};

// Enhanced responsive grid columns using theme system
export const getGridColumns = () => {
  return themeResponsive.getGridColumns(screenWidth);
};

// Enhanced responsive image sizes
export const getResponsiveImageSize = (baseSize: number) => {
  return themeResponsive.getIconSize(baseSize, screenWidth);
};

// Enhanced responsive button sizes using theme system
export const getResponsiveButtonSize = () => {
  return themeResponsive.getButtonSize(screenWidth);
};

// Enhanced responsive icon sizes using theme system
export const getResponsiveIconSize = (baseSize: number) => {
  return themeResponsive.getIconSize(baseSize, screenWidth);
};

// Enhanced responsive layout helpers
export const getResponsiveLayout = () => {
  return {
    isSmallScreen: isSmallScreen(),
    isMediumScreen: isMediumScreen(),
    isLargeScreen: isLargeScreen(),
    isXLargeScreen: isXLargeScreen(),
    screenPadding: getScreenPadding(),
    cardPadding: getCardPadding(),
    gridColumns: getGridColumns(),
    buttonSize: getResponsiveButtonSize(),
    screenWidth,
    screenHeight,
  };
};

// New utility functions for better responsive design

// Responsive margin/padding helper
export const getResponsiveMargin = (baseMargin: number) => {
  return themeResponsive.getSpacing(baseMargin, screenWidth);
};

// Responsive border radius helper
export const getResponsiveBorderRadius = (baseRadius: number) => {
  if (isSmallScreen()) return baseRadius * 0.8;
  if (isLargeScreen()) return baseRadius * 1.2;
  return baseRadius;
};

// Responsive elevation/shadow helper
export const getResponsiveElevation = (baseElevation: number) => {
  if (isSmallScreen()) return Math.max(0, baseElevation - 1);
  if (isLargeScreen()) return baseElevation + 1;
  return baseElevation;
};

// Responsive aspect ratio helper
export const getResponsiveAspectRatio = (baseRatio: number) => {
  if (isSmallScreen()) return baseRatio * 0.9;
  if (isLargeScreen()) return baseRatio * 1.1;
  return baseRatio;
};

// Responsive line height helper
export const getResponsiveLineHeight = (baseLineHeight: number) => {
  return themeResponsive.getFontSize(baseLineHeight, screenWidth);
};

// Device orientation helper
export const isPortrait = () => screenHeight > screenWidth;
export const isLandscape = () => screenWidth > screenHeight;

// Safe area helpers (for devices with notches)
export const getSafeAreaTop = () => {
  // This would typically use react-native-safe-area-context
  // For now, we'll use a simple calculation
  return Platform.OS === 'ios' ? 44 : 24;
};

export const getSafeAreaBottom = () => {
  return Platform.OS === 'ios' ? 34 : 0;
};

// Responsive component sizing
export const getResponsiveComponentSize = (baseSize: number, componentType: 'button' | 'card' | 'input' | 'avatar') => {
  const sizeMultiplier = {
    button: isSmallScreen() ? 0.9 : isLargeScreen() ? 1.1 : 1,
    card: isSmallScreen() ? 0.95 : isLargeScreen() ? 1.05 : 1,
    input: isSmallScreen() ? 0.9 : isLargeScreen() ? 1.1 : 1,
    avatar: isSmallScreen() ? 0.8 : isLargeScreen() ? 1.2 : 1,
  };
  
  return baseSize * sizeMultiplier[componentType];
}; 