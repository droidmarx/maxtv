import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

export default function handler(req, res) {
  // Pega token do header Authorization
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send("Token ausente. Acesso negado.");
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).send("Formato de token inválido.");
  }

  const token = parts[1];

  try {
    jwt.verify(token, SECRET);
  } catch (err) {
    return res.status(403).send("Token inválido ou expirado.");
  }

  
  const page = req.query[0] || req.query.page; 
  if (!page) return res.status(400).send("sistema.html.");

  const filePath = path.join(process.cwd(), page);
  if (!fs.existsSync(filePath)) {
    return res.status(404).send("Página não encontrada.");
  }

  const html = fs.readFileSync(filePath, "utf-8");
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
