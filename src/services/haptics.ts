export const haptics = {
  vibrate(pattern: number | number[]): void {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  },

  light(): void {
    this.vibrate(10);
  },

  medium(): void {
    this.vibrate(20);
  },

  heavy(): void {
    this.vibrate(30);
  },

  success(): void {
    this.vibrate([10, 50, 10]);
  },

  milestone(): void {
    this.vibrate([30, 100, 30, 100, 30]);
  },
};
