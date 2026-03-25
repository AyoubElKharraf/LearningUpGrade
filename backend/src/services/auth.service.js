import bcrypt from "bcryptjs";
import crypto from "crypto";
import { pool } from "../db.js";

const ADMIN_EMAIL = String(process.env.ADMIN_EMAIL || "admin@learningupgrade.local")
  .trim()
  .toLowerCase();

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function inferRoleFromEmail(email) {
  return normalizeEmail(email) === ADMIN_EMAIL ? "admin" : "client";
}

function inferNameFromRole(role) {
  return role === "admin" ? "Admin" : "Client";
}

export async function getUserByEmail(email) {
  const [rows] = await pool.query(`SELECT id, email, password_hash, role, name FROM users WHERE email = ? LIMIT 1`, [
    normalizeEmail(email),
  ]);
  return rows[0] || null;
}

export async function createUser({ email, password }) {
  const normalizedEmail = normalizeEmail(email);
  const role = inferRoleFromEmail(normalizedEmail);
  const name = inferNameFromRole(role);

  const passwordHash = await bcrypt.hash(password, 10);
  const id = crypto.randomUUID();

  await pool.query(
    `INSERT INTO users (id, email, password_hash, role, name) VALUES (?, ?, ?, ?, ?)`,
    [id, normalizedEmail, passwordHash, role, name],
  );

  return { id, email: normalizedEmail, role, name };
}

export async function loginOrCreateUser({ email, password }) {
  const user = await getUserByEmail(email);
  if (!user) {
    return createUser({ email, password });
  }

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    const err = new Error("Mot de passe incorrect");
    err.statusCode = 401;
    throw err;
  }

  return { id: user.id, email: user.email, role: user.role, name: user.name };
}

export async function registerUser({ email, password }) {
  const user = await getUserByEmail(email);
  if (user) {
    const err = new Error("Compte deja existant");
    err.statusCode = 409;
    throw err;
  }

  return createUser({ email, password });
}

export async function updateUserProfile({ id, name, password }) {
  if (!id) {
    const err = new Error("Missing user id");
    err.statusCode = 400;
    throw err;
  }

  const safeName = String(name || "").trim();
  if (!safeName) {
    const err = new Error("Nom requis");
    err.statusCode = 400;
    throw err;
  }

  let passwordHashUpdate = null;
  if (typeof password === "string" && password.trim().length > 0) {
    passwordHashUpdate = await bcrypt.hash(password, 10);
  }

  if (passwordHashUpdate) {
    await pool.query(`UPDATE users SET name = ?, password_hash = ? WHERE id = ?`, [safeName, passwordHashUpdate, id]);
  } else {
    await pool.query(`UPDATE users SET name = ? WHERE id = ?`, [safeName, id]);
  }

  const [rows] = await pool.query(`SELECT id, email, role, name FROM users WHERE id = ? LIMIT 1`, [id]);
  return rows[0] || null;
}

