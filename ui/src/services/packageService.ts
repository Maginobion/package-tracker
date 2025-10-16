export const getPackage = async (
  trackingNumber: string,
  signal: AbortSignal
) => {
  const response = await fetch(
    `http://localhost:3000/packages/${trackingNumber}`,
    { signal }
  );
  return response.json();
};
