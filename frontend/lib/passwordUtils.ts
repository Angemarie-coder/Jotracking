export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
  score: number; // 0-100
}

export const validatePassword = (password: string): PasswordValidationResult => {
  const errors: string[] = [];
  let score = 0;

  // Length check (min 8 chars)
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  } else {
    score += 25;
  }

  // Uppercase check
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  } else {
    score += 25;
  }

  // Lowercase check
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  } else {
    score += 25;
  }

  // Number check
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  } else {
    score += 25;
  }

  // Special character check (optional, adds more security)
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    // Not adding to errors as it's optional, but we can use it for strength indicator
  } else {
    score += 25;
  }

  // Cap the score at 100
  score = Math.min(100, score);

  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  if (score >= 75) {
    strength = 'strong';
  } else if (score >= 50) {
    strength = 'medium';
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength,
    score
  };
};
