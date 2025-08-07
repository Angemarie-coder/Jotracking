import { Dimensions, PixelRatio, Platform } from 'react-native';
import { breakpoints } from '../theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Responsive width calculation
export const wp = (percentage: number) => {
  return (screenWidth * percentage) / 100;
};

// Responsive height calculation
export const hp = (percentage: number) => {
  return (screenHeight * percentage) / 100;
};

// Responsive font size
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

// Responsive breakpoint helpers
export const isSmallScreen = () => screenWidth < breakpoints.sm;
export const isMediumScreen = () => screenWidth >= breakpoints.sm && screenWidth < breakpoints.md;
export const isLargeScreen = () => screenWidth >= breakpoints.md && screenWidth < breakpoints.lg;
export const isXLargeScreen = () => screenWidth >= breakpoints.lg;

// Responsive spacing
export const getResponsiveSpacing = (baseSpacing: number) => {
  if (isSmallScreen()) return baseSpacing * 0.8;
  if (isLargeScreen()) return baseSpacing * 1.2;
  return baseSpacing;
};

// Responsive font sizes
export const getResponsiveFontSize = (baseSize: number) => {
  if (isSmallScreen()) return baseSize * 0.9;
  if (isLargeScreen()) return baseSize * 1.1;
  return baseSize;
};

// Platform-specific adjustments
export const getPlatformValue = (iosValue: any, androidValue: any) => {
  return Platform.OS === 'ios' ? iosValue : androidValue;
};

// Responsive padding
export const getScreenPadding = () => {
  if (isSmallScreen()) return 12;
  if (isLargeScreen()) return 24;
  return 16;
};

// Responsive card padding
export const getCardPadding = () => {
  if (isSmallScreen()) return 12;
  if (isLargeScreen()) return 20;
  return 16;
};

// Responsive grid columns
export const getGridColumns = () => {
  if (isSmallScreen()) return 1;
  if (isMediumScreen()) return 2;
  if (isLargeScreen()) return 3;
  return 4;
};

// Responsive image sizes
export const getResponsiveImageSize = (baseSize: number) => {
  if (isSmallScreen()) return baseSize * 0.8;
  if (isLargeScreen()) return baseSize * 1.2;
  return baseSize;
};

// Responsive button sizes
export const getResponsiveButtonSize = () => {
  if (isSmallScreen()) return 'small';
  if (isLargeScreen()) return 'large';
  return 'medium';
};

// Responsive icon sizes
export const getResponsiveIconSize = (baseSize: number) => {
  if (isSmallScreen()) return baseSize * 0.9;
  if (isLargeScreen()) return baseSize * 1.1;
  return baseSize;
};

// Responsive layout helpers
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
  };
}; 