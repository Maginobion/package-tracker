import bcrypt from "bcrypt";

/**
 * Number of salt rounds for bcrypt hashing
 * Higher = more secure but slower
 */
const SALT_ROUNDS = 10;

/**
 * Hash a plain text password
 * @param password - Plain text password to hash
 * @returns Hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare a plain text password with a hashed password
 * @param password - Plain text password
 * @param hash - Hashed password from database
 * @returns True if passwords match, false otherwise
 */
export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

/**
 * Generate a hash synchronously (blocking)
 * Use this only for scripts/seeding, not in API handlers
 * @param password - Plain text password
 * @returns Hashed password
 */
export const hashPasswordSync = (password: string): string => {
  return bcrypt.hashSync(password, SALT_ROUNDS);
};

/**
 * Compare password synchronously (blocking)
 * Use this only for scripts/testing, not in API handlers
 * @param password - Plain text password
 * @param hash - Hashed password
 * @returns True if passwords match
 */
export const comparePasswordSync = (
  password: string,
  hash: string
): boolean => {
  return bcrypt.compareSync(password, hash);
};
