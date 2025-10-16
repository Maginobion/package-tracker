const generateTrackingNumber = () => {
  return `PKG-${Math.random().toString(36).substring(2, 15)}-${Math.random().toString(36).substring(2, 15)}-${Math.random().toString(36).substring(2, 15)}`;
};

export { generateTrackingNumber };
