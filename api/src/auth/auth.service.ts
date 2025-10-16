import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import appConfig from "../config/config";
import pgsql from "../config/database";

interface User {
  id: number;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
}

interface UserRole {
  id: number;
  name: string;
  description: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
  };
}

export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  // Find user by email
  const [user]: User[] = await pgsql`
    SELECT id, email, password_hash, first_name, last_name 
    FROM users 
    WHERE email = ${email}
  `;

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // Fetch user roles
  const userRoles: UserRole[] = await pgsql`
    SELECT r.id, r.name, r.description
    FROM roles r
    INNER JOIN user_roles ur ON r.id = ur.role_id
    WHERE ur.user_id = ${user.id}
  `;

  const roleNames = userRoles.map((role) => role.name);

  // Generate JWT token with user roles
  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      roles: roleNames,
    },
    appConfig.jwt.secret,
    { expiresIn: appConfig.jwt.expiresIn } as SignOptions
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      roles: roleNames,
    },
  };
};
