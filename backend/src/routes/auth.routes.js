import { Router } from "express";
import jwt from "jsonwebtoken";
import { createUser, loginOrCreateUser, registerUser, updateUserProfile } from "../services/auth.service.js";

const authRouter = Router();

function signToken({ id, email, role }) {
  const secret = process.env.JWT_SECRET || "dev_secret_change_me";
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

  return jwt.sign({ role, email }, secret, { subject: id, expiresIn });
}

authRouter.post("/register", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: "email et password requis" });
    }
    const user = await registerUser({ email, password });
    const token = signToken({ id: user.id, email: user.email, role: user.role });
    res.json({ user, token });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: "email et password requis" });
    }

    const user = await loginOrCreateUser({ email, password });
    const token = signToken({ id: user.id, email: user.email, role: user.role });
    res.json({ user, token });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/logout", async (_req, res) => {
  // JWT stateless: on peut juste renvoyer success côté client.
  res.json({ status: "ok" });
});

function requireAuth(req, res, next) {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.slice("bearer ".length).trim();
  const secret = process.env.JWT_SECRET || "dev_secret_change_me";

  try {
    const decoded = jwt.verify(token, secret);
    if (!decoded || typeof decoded !== "object" || !decoded.sub) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.authUser = {
      id: String(decoded.sub),
      email: decoded.email ? String(decoded.email) : undefined,
      role: decoded.role ? String(decoded.role) : undefined,
    };
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

authRouter.put("/profile", requireAuth, async (req, res, next) => {
  try {
    const { name, password } = req.body || {};
    const updated = await updateUserProfile({ id: req.authUser.id, name, password });
    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user: updated });
  } catch (error) {
    next(error);
  }
});

export { authRouter };

