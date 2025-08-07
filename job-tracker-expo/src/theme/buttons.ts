import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { colors, spacing, typography, borderRadius } from './index';

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

export const buttonStyles = StyleSheet.create<NamedStyles<{
  // Base styles
  base: ViewStyle;
  baseLabel: TextStyle;
  
  // Button variants
  contained: ViewStyle;
  containedLabel: TextStyle;
  containedPressed: ViewStyle;
  containedDisabled: ViewStyle;
  
  outlined: ViewStyle;
  outlinedLabel: TextStyle;
  outlinedPressed: ViewStyle;
  outlinedDisabled: ViewStyle;
  
  text: ViewStyle;
  textLabel: TextStyle;
  textPressed: ViewStyle;
  textDisabled: ViewStyle;
  
  // Sizes
  small: ViewStyle;
  medium: ViewStyle;
  large: ViewStyle;
  
  // Icon styles
  icon: ViewStyle;
  iconOnly: ViewStyle;
  
  // Utilities
  fullWidth: ViewStyle;
  disabled: ViewStyle;
  
  // Enhanced variants
  elevated: ViewStyle;
  elevatedLabel: TextStyle;
  elevatedPressed: ViewStyle;
  elevatedDisabled: ViewStyle;
  
  // Status variants
  success: ViewStyle;
  successLabel: TextStyle;
  successDisabled: ViewStyle;
  warning: ViewStyle;
  warningLabel: TextStyle;
  warningDisabled: ViewStyle;
  error: ViewStyle;
  errorLabel: TextStyle;
  errorDisabled: ViewStyle;
}>>({
  // Base button styles - Enhanced with better accessibility
  base: {
    borderRadius: borderRadius.button,
    minWidth: 88,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    elevation: 0,
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
  },
  baseLabel: {
    ...typography.button,
    textAlign: 'center',
    marginHorizontal: spacing.xs,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  
  // Contained button - Enhanced with better contrast
  contained: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  containedLabel: {
    color: colors.textOnPrimary,
    fontWeight: '600',
  },
  containedPressed: {
    backgroundColor: colors.primaryDark,
    elevation: 4,
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  containedDisabled: {
    backgroundColor: colors.gray300,
    elevation: 0,
    shadowOpacity: 0,
  },
  
  // Outlined button - Enhanced with better borders
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  outlinedLabel: {
    color: colors.primary,
    fontWeight: '600',
  },
  outlinedPressed: {
    backgroundColor: `${colors.primary}08`,
    borderColor: colors.primaryDark,
    elevation: 2,
  },
  outlinedDisabled: {
    borderColor: colors.gray400,
    backgroundColor: colors.gray100,
  },
  
  // Text button - Enhanced with better touch targets
  text: {
    backgroundColor: 'transparent',
    minWidth: 64,
    height: 40,
    paddingHorizontal: spacing.md,
  },
  textLabel: {
    color: colors.primary,
    fontWeight: '500',
  },
  textPressed: {
    backgroundColor: `${colors.primary}08`,
  },
  textDisabled: {
    opacity: 0.5,
  },
  
  // Elevated button variant
  elevated: {
    backgroundColor: colors.surface,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  elevatedLabel: {
    color: colors.primary,
    fontWeight: '600',
  },
  elevatedPressed: {
    elevation: 6,
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  elevatedDisabled: {
    backgroundColor: colors.gray200,
    borderColor: colors.gray400,
    elevation: 0,
    shadowOpacity: 0,
  },
  
  // Status variants
  success: {
    backgroundColor: colors.success,
  },
  successLabel: {
    color: colors.white,
    fontWeight: '600',
  },
  successDisabled: {
    backgroundColor: `${colors.success}80`,
    opacity: 1,
  },
  warning: {
    backgroundColor: colors.warning,
  },
  warningLabel: {
    color: colors.white,
    fontWeight: '600',
  },
  warningDisabled: {
    backgroundColor: `${colors.warning}80`,
    opacity: 1,
  },
  error: {
    backgroundColor: colors.error,
  },
  errorLabel: {
    color: colors.white,
    fontWeight: '600',
  },
  errorDisabled: {
    backgroundColor: `${colors.error}80`,
    opacity: 1,
  },
  
  // Sizes - Enhanced with better proportions
  small: {
    height: 36,
    paddingHorizontal: spacing.md,
    minWidth: 64,
  },
  medium: {
    height: 48,
    paddingHorizontal: spacing.lg,
    minWidth: 88,
  },
  large: {
    height: 56,
    paddingHorizontal: spacing.xl,
    minWidth: 120,
  },
  
  // Icon styles - Enhanced with better spacing
  icon: {
    marginRight: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconOnly: {
    width: 48,
    height: 48,
    padding: 0,
    minWidth: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.round,
  },
  
  // Utility styles
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.6,
  },
});

// Enhanced helper function to create button styles
export const createButtonStyles = (
  variant: 'contained' | 'outlined' | 'text' | 'elevated' | 'success' | 'warning' | 'error' = 'contained',
  size: 'small' | 'medium' | 'large' = 'medium'
) => {
  const getLabelStyle = () => {
    switch (variant) {
      case 'success':
        return buttonStyles.successLabel;
      case 'warning':
        return buttonStyles.warningLabel;
      case 'error':
        return buttonStyles.errorLabel;
      default:
        return buttonStyles[`${variant}Label`];
    }
  };

  const getPressedStyle = () => {
    const pressedStyle = buttonStyles[`${variant}Pressed` as keyof typeof buttonStyles];
    return pressedStyle || buttonStyles.containedPressed;
  };

  // Get the base styles
  const baseStyles = {
    button: {
      ...buttonStyles.base,
      ...buttonStyles[variant],
      ...buttonStyles[size],
    },
    label: {
      ...buttonStyles.baseLabel,
      ...getLabelStyle(),
    },
    pressed: {
      ...getPressedStyle(),
    },
    disabled: {
      ...buttonStyles.disabled,
      ...buttonStyles[`${variant}Disabled`],
    },
  };

  // Return the expected shape with all required properties
  return {
    button: baseStyles.button,
    pressed: baseStyles.pressed,
    content: {}, // Add empty content style as it's required
    text: baseStyles.label,
    textWithIcon: {
      ...baseStyles.label,
      // Add any specific styles for text with icon
      marginLeft: 8,
    },
    iconContainer: {
      // Add icon container styles if needed
      marginRight: 4,
    },
  };
};
