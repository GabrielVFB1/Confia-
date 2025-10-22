// /repositories/UserRepository.js
const User = require('../models/User');

class UserRepository {

    /**
     * Cria um novo usuário no banco.
     * O hashing da senha é feito automaticamente pelo hook pre-save do Model.
     * @param {object} dadosDoUsuario - { nome, email, password }
     * @returns {Promise<User>} O usuário salvo (sem a senha, idealmente).
     */
    async criar(dadosDoUsuario) {
        const novoUsuario = new User(dadosDoUsuario);
        // O .save() vai disparar o pre-save hook para hashear a senha
        return await novoUsuario.save();
    }

    /**
     * Busca um usuário pelo e-mail.
     * @param {string} email
     * @returns {Promise<User|null>} O usuário encontrado ou null.
     */
    async buscarPorEmail(email) {
        // Busca incluindo o campo password que pode estar com select: false
        return await User.findOne({ email: email.toLowerCase() })/*.select('+password')*/;
    }

    /**
     * Busca um usuário pelo ID.
     * @param {string} id
     * @returns {Promise<User|null>} O usuário encontrado ou null (sem a senha).
     */
    async buscarPorId(id) {
        return await User.findById(id); // Não retorna a senha por padrão
    }

    // Você pode adicionar outros métodos (listar, atualizar, deletar) depois
}

module.exports = new UserRepository();