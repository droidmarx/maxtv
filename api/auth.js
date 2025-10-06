const crypto = require('crypto');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
  try {
    // ✅ Permitir apenas requisições POST
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Método não permitido' });
    }

    const { username, passwordHash } = req.body;

    if (!username || !passwordHash) {
      return res.status(400).json({ success: false, error: 'Usuário e senha são obrigatórios.' });
    }

    // ✅ Usuários e hashes armazenados nas variáveis de ambiente
    const users = {
      Gui: { hash: process.env.HASH_GUI, fullName: 'Guilherme Marques' },
      Tayna: { hash: process.env.HASH_TAYNA, fullName: 'Tayná Ortiz' },
      Admin: { hash: process.env.HASH_ADMIN, fullName: 'Tester' }
    };

    const user = users[username];

    // ✅ Verifica se o usuário existe e se o hash informado confere
    if (!user || user.hash !== passwordHash) {
      return res.status(401).json({ success: false, error: 'Usuário ou senha inválidos.' });
    }

    // ✅ Gera JWT com expiração de 2 horas
    const token = jwt.sign(
      {
        username,
        fullName: user.fullName,
        iat: Math.floor(Date.now() / 1000)
      },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    return res.status(200).json({
      success: true,
      token,
      user: { username, fullName: user.fullName }
    });

  } catch (error) {
    console.error('Erro no auth.js:', error.message);
    return res.status(500).json({ success: false, error: 'Erro interno no servidor.' });
  }
};
