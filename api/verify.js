const jwt = require("jsonwebtoken");

module.exports = async (req, res) => {
  // Aceita apenas requisições POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token não fornecido" });
    }

    // Extrai o token do cabeçalho
    const token = authHeader.split(" ")[1];

    // Verifica o token usando a mesma chave secreta usada no /api/auth.js
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Se chegou aqui, o token é válido
    return res.status(200).json({ message: "Token válido", user: decoded });
  } catch (err) {
    console.error("Erro na verificação do token:", err.message);
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
};