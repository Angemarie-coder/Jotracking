import React, { ReactNode } from 'react';
import { 
  TouchableOpacity, 
  StyleProp, 
  ViewStyle, 
  TextStyle, 
  ActivityIndicator, 
  View, 
  StyleSheet,
  TouchableOpacityProps 
} from 'react-native';
import { Text } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import { buttonStyles, createButtonStyles } from '../theme/buttons';
import { getResponsiveButtonSize } from '../utils/responsive';

interface ButtonProps extends Omit<TouchableOpacityProps, 'style' | 'onPress' | 'children'> {
  onPress: () => void;
  title: string;
  mode?: 'contained' | 'outlined' | 'text' | 'elevated' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium' | 'large';
  icon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  children?: ReactNode;
  ripple?: boolean;
  hapticFeedback?: boolean;
  textColor?: string;
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  mode = 'contained',
  size = 'medium',
  icon,
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
  ...rest
}) => {
  const theme = useTheme();
  const isDisabled = disabled || loading;
  const buttonSize = size === 'medium' ? getResponsiveButtonSize() : size;
  const styles = createButtonStyles(mode, buttonSize) as {
    button: ViewStyle;
    pressed: ViewStyle;
    content: ViewStyle;
    iconContainer?: ViewStyle;
    text?: TextStyle;
    textWithIcon?: TextStyle;
  };
  
  const getButtonStyle = (pressed: boolean): StyleProp<ViewStyle> => {
    const buttonStyle: ViewStyle = {
      ...styles.button,
      ...(pressed ? styles.pressed : {}),
      ...(fullWidth ? { width: '100%' } : {})
    };
  
    if (style) {
      const flattenedStyle = StyleSheet.flatten(style);
      Object.assign(buttonStyle, flattenedStyle);
    }
  
    return buttonStyle;
  };

  const textStyles = [
    styles.text,
    icon && styles.textWithIcon,
    textColor ? { color: textColor } : {},
    labelStyle,
  ].filter(Boolean) as StyleProp<TextStyle>;

  return (
<TouchableOpacity
  onPress={onPress}
  disabled={isDisabled}
  style={getButtonStyle(false)} // Pass false since TouchableOpacity handles its own pressed state
  accessibilityLabel={accessibilityLabel || title}
  testID={testID}
  activeOpacity={ripple ? 0.7 : 1}
  {...rest}
>
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator 
            color={styles.text?.color || theme.colors.onPrimary} 
            size={buttonSize === 'small' ? 16 : 20} 
          />
        ) : (
          <>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <Text 
              style={textStyles}
              numberOfLines={1}
            >
              {children || title}
            </Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default Button;