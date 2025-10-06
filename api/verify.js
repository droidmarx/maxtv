const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
  try {
    // ✅ Permitir apenas requisições POST
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Método não permitido' });
    }

    // ✅ Tentar obter o token do header ou do corpo
    const authHeader = req.headers.authorization;
    const token =
      (authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : req.body.token) || null;

    if (!token) {
      return res.status(401).json({ valid: false, error: 'Token não fornecido' });
    }

    // ✅ Verifica o token com a chave secreta do ambiente
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Retorna os dados decodificados
    return res.status(200).json({
      valid: true,
      username: decoded.username,
      fullName: decoded.fullName,
      exp: decoded.exp,
    });
  } catch (error) {
    console.error('Erro ao verificar token:', error.message);
    return res
      .status(401)
      .json({ valid: false, error: 'Token inválido ou expirado' });
  }
};
