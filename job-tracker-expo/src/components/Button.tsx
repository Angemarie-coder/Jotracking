import React, { ReactNode } from 'react';
import { 
  TouchableOpacity, 
  StyleProp, 
  ViewStyle, 
  TextStyle, 
  ActivityIndicator, 
  View, 
  StyleSheet,
  TouchableOpacityProps,
  Animated,
  Platform
} from 'react-native';
import { Text } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { buttonStyles, createButtonStyles } from '../theme/buttons';
import { 
  getResponsiveButtonSize, 
  getResponsiveComponentSize,
  getResponsiveBorderRadius,
  getResponsiveElevation,
  getResponsiveSpacing
} from '../utils/responsive';
import { colors, typography, borderRadius, shadows } from '../theme';

interface ButtonProps extends Omit<TouchableOpacityProps, 'style' | 'onPress' | 'children'> {
  onPress: () => void;
  title: string;
  mode?: 'contained' | 'outlined' | 'text' | 'elevated' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium' | 'large';
  icon?: string | ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  children?: ReactNode;
  ripple?: boolean;
  hapticFeedback?: boolean;
  textColor?: string;
  variant?: 'primary' | 'secondary' | 'tertiary';
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  mode = 'contained',
  size = 'medium',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  labelStyle,
  accessibilityLabel,
  testID,
  children,
  ripple = true,
  hapticFeedback = true,
  textColor,
  variant = 'primary',
  ...rest
}) => {
  const theme = useTheme();
  const isDisabled = disabled || loading;
  const buttonSize = size === 'medium' ? getResponsiveButtonSize() : size;
  
  // Enhanced button styles with responsive design
  const getButtonStyle = (pressed: boolean): StyleProp<ViewStyle> => {
    const baseStyle: ViewStyle = {
      borderRadius: getResponsiveBorderRadius(borderRadius.button),
      paddingHorizontal: getResponsiveSpacing(16),
      paddingVertical: getResponsiveSpacing(12),
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      minHeight: getResponsiveComponentSize(48, 'button'),
      ...(fullWidth ? { width: '100%' } : {}),
      ...shadows.sm,
    };

    // Mode-specific styles
    switch (mode) {
      case 'contained':
        baseStyle.backgroundColor = variant === 'primary' ? theme.colors.primary : 
                                 variant === 'secondary' ? theme.colors.secondary : 
                                 theme.colors.surfaceVariant;
        baseStyle.borderWidth = 0;
        break;
      case 'outlined':
        baseStyle.backgroundColor = 'transparent';
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = theme.colors.outline;
        break;
      case 'text':
        baseStyle.backgroundColor = 'transparent';
        baseStyle.borderWidth = 0;
        break;
      case 'elevated':
        baseStyle.backgroundColor = theme.colors.surface;
        baseStyle.borderWidth = 0;
        baseStyle.elevation = getResponsiveElevation(4);
        break;
      case 'success':
        baseStyle.backgroundColor = colors.success;
        baseStyle.borderWidth = 0;
        break;
      case 'warning':
        baseStyle.backgroundColor = colors.warning;
        baseStyle.borderWidth = 0;
        break;
      case 'error':
        baseStyle.backgroundColor = colors.error;
        baseStyle.borderWidth = 0;
        break;
    }

    // Disabled state
    if (isDisabled) {
      baseStyle.opacity = 0.6;
      baseStyle.elevation = 0;
    }

    // Pressed state
    if (pressed && !isDisabled) {
      baseStyle.opacity = 0.8;
      baseStyle.transform = [{ scale: 0.98 }];
    }

    // Size-specific adjustments
    switch (buttonSize) {
      case 'small':
        baseStyle.paddingHorizontal = getResponsiveSpacing(12);
        baseStyle.paddingVertical = getResponsiveSpacing(8);
        baseStyle.minHeight = getResponsiveComponentSize(36, 'button');
        break;
      case 'large':
        baseStyle.paddingHorizontal = getResponsiveSpacing(24);
        baseStyle.paddingVertical = getResponsiveSpacing(16);
        baseStyle.minHeight = getResponsiveComponentSize(56, 'button');
        break;
    }

    return [baseStyle, style];
  };

  const getTextStyle = (): StyleProp<TextStyle> => {
    const baseTextStyle: TextStyle = {
      ...typography.button,
      fontWeight: '600',
      textAlign: 'center',
    };

    // Mode-specific text colors
    switch (mode) {
      case 'contained':
        baseTextStyle.color = textColor || theme.colors.onPrimary;
        break;
      case 'outlined':
      case 'text':
        baseTextStyle.color = textColor || theme.colors.primary;
        break;
      case 'elevated':
        baseTextStyle.color = textColor || theme.colors.onSurface;
        break;
      case 'success':
      case 'warning':
      case 'error':
        baseTextStyle.color = textColor || colors.white;
        break;
    }

    // Size-specific text adjustments
    switch (buttonSize) {
      case 'small':
        baseTextStyle.fontSize = getResponsiveSpacing(12);
        break;
      case 'large':
        baseTextStyle.fontSize = getResponsiveSpacing(16);
        break;
    }

    return [baseTextStyle, labelStyle];
  };

  const getIconStyle = () => {
    const iconSize = buttonSize === 'small' ? 16 : buttonSize === 'large' ? 24 : 20;
    const iconColor = getTextStyle()?.color || theme.colors.onPrimary;
    
    return {
      size: getResponsiveComponentSize(iconSize, 'button'),
      color: iconColor,
      marginHorizontal: getResponsiveSpacing(4),
    };
  };

  const renderIcon = () => {
    if (!icon || loading) return null;
    
    const iconStyle = getIconStyle();
    
    if (typeof icon === 'string') {
      return (
        <MaterialCommunityIcons 
          name={icon as any} 
          size={iconStyle.size} 
          color={iconStyle.color} 
          style={{ marginHorizontal: iconStyle.marginHorizontal }}
        />
      );
    }
    
    return icon;
  };

  const handlePress = () => {
    if (isDisabled) return;
    
    // Haptic feedback
    if (hapticFeedback && Platform.OS === 'ios') {
      // You can add haptic feedback library here
      // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    onPress();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={isDisabled}
      style={getButtonStyle(false)}
      accessibilityLabel={accessibilityLabel || title}
      testID={testID}
      activeOpacity={ripple ? 0.7 : 1}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator 
          color={getTextStyle()?.color || theme.colors.onPrimary} 
          size={buttonSize === 'small' ? 16 : 20} 
        />
      ) : (
        <>
          {iconPosition === 'left' && renderIcon()}
          <Text style={getTextStyle()} numberOfLines={1}>
            {children || title}
          </Text>
          {iconPosition === 'right' && renderIcon()}
        </>
      )}
    </TouchableOpacity>
  );
};

export default Button;