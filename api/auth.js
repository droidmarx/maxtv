const crypto = require('crypto');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { username, passwordHash } = req.body;

    if (!username || !passwordHash) {
      return res.status(400).json({ error: 'Credenciais incompletas' });
    }

    // Usuários autorizados
    const users = {
      'Gui': { hash: process.env.HASH_GUI, fullName: 'Guilherme Marques' },
      'Tayna': { hash: process.env.HASH_TAYNA, fullName: 'Tayná Ortiz' },
      'Admin': { hash: process.env.HASH_ADMIN, fullName: 'Tester' }
    };

    const user = users[username];

    // Valida usuário e hash
    if (user && user.hash === passwordHash) {
      // Gera JWT com validade de 1 hora
      const token = jwt.sign(
        { username, fullName: user.fullName },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return res.status(200).json({
        success: true,
        token,
        user: { username, fullName: user.fullName }
      });
    }

    return res.status(401).json({ success: false, error: 'Usuário ou senha inválidos' });

  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
};