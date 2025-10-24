// /middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Importa o Model de Usuário

// Esta função irá proteger as rotas
exports.protect = async (req, res, next) => {
    let token;

    // 1. Verifica se o token existe no header 'Authorization'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 2. Pega o token (formato: "Bearer ...token...")
            token = req.headers.authorization.split(' ')[1];

            // 3. Verifica se o token é válido usando o segredo do .env
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 4. Busca o usuário do token no banco de dados e anexa ao 'req'
            // Oculta a senha do resultado
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                 return res.status(401).json({ message: 'Não autorizado, usuário não encontrado.' });
            }

            // 5. Deixa a requisição continuar para o próximo passo (o controller)
            next();
        } catch (error) {
            console.error("Erro na verificação do token:", error.message);
            res.status(401).json({ message: 'Não autorizado, token falhou.' });
        }
    }

    // Se não encontrou nenhum token
    if (!token) {
        res.status(401).json({ message: 'Não autorizado, nenhum token fornecido.' });
    }
};