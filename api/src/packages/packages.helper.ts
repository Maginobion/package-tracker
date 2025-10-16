export const generateTrackingNumber = (): string => {
  return `PKG-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
};
