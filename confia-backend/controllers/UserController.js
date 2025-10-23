// /controllers/UserController.js (NOVO ARQUIVO)
const userRepository = require('../repositories/UserRepository');
const noticiaRepository = require('../repositories/NoticiaRepository');

// Controlador para buscar o perfil de um usuário (nome, etc.)
// e também as notícias que ele publicou.
exports.getPerfilUsuario = async (req, res) => {
    try {
        const userId = req.params.id; // Pega o ID da URL (ex: /api/users/12345)

        // 1. Busca os dados do usuário (sem a senha)
        const usuario = await userRepository.buscarPorId(userId);

        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        // 2. Busca todas as notícias publicadas por esse usuário
        const noticias = await noticiaRepository.buscarPorAutor(userId);

        // 3. Retorna os dados do usuário e suas notícias
        res.status(200).json({
            usuario: {
                _id: usuario._id,
                nome: usuario.nome,
                email: usuario.email, // (Opcional, se você quiser mostrar)
                dataCadastro: usuario.dataCadastro
            },
            noticias: noticias
        });

    } catch (error) {
        console.error('ERRO AO BUSCAR PERFIL:', error);
        res.status(500).json({ message: 'Erro ao buscar dados do perfil.' });
    }
};