// /controllers/AuthController.js
const userRepository = require('../repositories/UserRepository');
const jwt = require('jsonwebtoken');

// Função auxiliar para gerar token JWT
const gerarToken = (userId) => {
    return jwt.sign(
        { id: userId }, // Payload: informações que você quer guardar no token
        process.env.JWT_SECRET, // Chave secreta do seu .env
        { expiresIn: '1d' } // Opções: token expira em 1 dia ('1h', '7d', etc.)
    );
};

// --- Função de Cadastro (Signup) ---
exports.signup = async (req, res) => {
    try {
        const { nome, email, password } = req.body;

        // Validação básica (poderia ser mais robusta)
        if (!nome || !email || !password) {
            return res.status(400).json({ message: 'Nome, e-mail e senha são obrigatórios.' });
        }

        // Verifica se o e-mail já existe
        const usuarioExistente = await userRepository.buscarPorEmail(email);
        if (usuarioExistente) {
            return res.status(400).json({ message: 'Este e-mail já está cadastrado.' });
        }

        // Cria o novo usuário (o repository chama o save que hasheia a senha)
        const novoUsuario = await userRepository.criar({ nome, email, password });

        // Retorna sucesso (não retorna a senha)
        res.status(201).json({
            message: 'Usuário cadastrado com sucesso!',
            user: {
                id: novoUsuario._id,
                nome: novoUsuario.nome,
                email: novoUsuario.email
            }
        });

    } catch (error) {
        console.error('ERRO NO CADASTRO:', error);
        // Trata erros de validação do Mongoose
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join('. ') });
        }
        res.status(500).json({ message: 'Erro interno ao cadastrar usuário.' });
    }
};

// --- Função de Login ---
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
        }

        // Busca o usuário pelo e-mail
        const user = await userRepository.buscarPorEmail(email);

        // Verifica se o usuário existe E se a senha está correta
        if (!user || !(await user.comparePassword(password))) {
             // Mensagem genérica para não informar se o email existe ou não
            return res.status(401).json({ message: 'E-mail ou senha inválidos.' });
        }

        // Se chegou aqui, o login é válido! Gera o token.
        const token = gerarToken(user._id);

        // Retorna o token e dados básicos do usuário (sem senha)
        res.status(200).json({
            token,
            user: {
                id: user._id,
                nome: user.nome,
                email: user.email
            }
        });

    } catch (error) {
        console.error('ERRO NO LOGIN:', error);
        res.status(500).json({ message: 'Erro interno ao tentar fazer login.' });
    }
};