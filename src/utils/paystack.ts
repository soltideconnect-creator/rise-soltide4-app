// Paystack utility functions for Rise app

/**
 * Creates a unique payment reference
 */
export const createPaymentReference = (): string => {
  return `RISE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Unlocks premium features in localStorage
 */
export const unlockPremium = (transactionId?: string): void => {
  const premiumData = {
    unlocked: true,
    unlockedAt: new Date().toISOString(),
    transactionId: transactionId || createPaymentReference(),
    features: ['sleep_tracker', 'no_ads', 'advanced_analytics'],
    platform: 'web',
    amount: 8000,
    currency: 'NGN',
  };

  localStorage.setItem('rise_premium', JSON.stringify(premiumData));
  localStorage.setItem('streak_ads_removed', 'true');
  
  console.log('✅ Premium unlocked:', premiumData);
  
  // Dispatch event for other components to update
  window.dispatchEvent(new Event('premiumStatusChanged'));
};

/**
 * Gets premium status from localStorage
 */
export const getPremiumStatus = (): boolean => {
  const premium = localStorage.getItem('rise_premium');
  if (!premium) return false;
  
  try {
    const data = JSON.parse(premium);
    return data.unlocked === true;
  } catch {
    return false;
  }
};

/**
 * Gets premium data from localStorage
 */
export const getPremiumData = (): any => {
  const premium = localStorage.getItem('rise_premium');
  if (!premium) return null;
  
  try {
    return JSON.parse(premium);
  } catch {
    return null;
  }
};

/**
 * Clears premium status (for testing)
 */
export const clearPremium = (): void => {
  localStorage.removeItem('rise_premium');
  localStorage.removeItem('streak_ads_removed');
  window.dispatchEvent(new Event('premiumStatusChanged'));
  console.log('🔄 Premium status cleared');
};

/**
 * Formats amount in kobo to Naira
 */
export const formatAmount = (kobo: number): string => {
  const naira = kobo / 100;
  return `₦${naira.toLocaleString('en-NG')}`;
};

/**
 * Validates email format
 */
export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Gets or sets user email in localStorage
 */
export const getUserEmail = (): string => {
  return localStorage.getItem('rise_user_email') || 'soltideapps@gmail.com';
};

export const setUserEmail = (email: string): void => {
  if (isValidEmail(email)) {
    localStorage.setItem('rise_user_email', email);
    console.log('✅ Email saved:', email);
  } else {
    console.error('❌ Invalid email format:', email);
  }
};
