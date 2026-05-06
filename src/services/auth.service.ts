import { UserRepository } from "../repositories/user.repository";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateTokens } from "../utils/jwt";
import { sendVerificationEmail } from "../utils/mailer";

const userRepository = new UserRepository();

export class AuthService {
  async signup(email: string, passwordRaw: string) {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const password = await bcrypt.hash(passwordRaw, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await userRepository.create({
      email,
      password,
      verificationToken,
    });

    await sendVerificationEmail(email, verificationToken);

    return { message: "Signup successful. Please verify your email." };
  }

  async verifyEmail(token: string) {
    const user = await userRepository.findByVerificationToken(token);
    if (!user) {
      throw new Error("Invalid or expired verification token");
    }

    await userRepository.update(user.id, {
      isVerified: true,
      verificationToken: null,
    });

    return { message: "Email successfully verified." };
  }

  async login(email: string, passwordRaw: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    if (!user.isVerified) {
      throw new Error("Please verify your email before logging in");
    }

    const isMatch = await bcrypt.compare(passwordRaw, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const { accessToken, refreshToken } = generateTokens(user.id);
    
    await userRepository.update(user.id, { refreshToken });

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email },
    };
  }
}
