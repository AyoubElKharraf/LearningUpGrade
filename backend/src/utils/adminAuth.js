import jwt from "jsonwebtoken";

export function requireAdmin(req, res, next) {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.slice("bearer ".length).trim();
  const secret = process.env.JWT_SECRET || "dev_secret_change_me";

  try {
    const decoded = jwt.verify(token, secret);
    const role = decoded && typeof decoded === "object" ? decoded.role : undefined;
    if (role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

