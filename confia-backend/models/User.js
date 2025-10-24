// /models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'O nome é obrigatório.'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'O e-mail é obrigatório.'],
        unique: true, // Garante que cada email seja único
        lowercase: true,
        trim: true,
        match: [/.+\@.+\..+/, 'Por favor, insira um e-mail válido.'] // Validação simples
    },
    password: {
        type: String,
        required: [true, 'A senha é obrigatória.'],
        minlength: [6, 'A senha deve ter pelo menos 6 caracteres.'] // Mínimo de 6 caracteres
        // Não seleciona a senha por padrão ao buscar usuários
        // select: false
    },
    // Você pode adicionar mais campos aqui depois (dataCadastro, isAdmin, etc.)
    dataCadastro: {
        type: Date,
        default: Date.now
    }
});

// --- Hashing de Senha ANTES de Salvar ---
// Middleware do Mongoose que roda ANTES do evento 'save'
userSchema.pre('save', async function(next) {
    // Só hasheia a senha se ela foi modificada (ou é nova)
    if (!this.isModified('password')) return next();

    try {
        // Gera um "salt" e hasheia a senha
        const salt = await bcrypt.genSalt(10); // 10 é o custo computacional (bom padrão)
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error); // Passa o erro para o Mongoose
    }
});

// --- Método para Comparar Senha (no Login) ---
// Adiciona um método à instância do usuário para comparar senhas
userSchema.methods.comparePassword = async function(candidatePassword) {
    // 'this.password' é a senha hasheada no banco
    return await bcrypt.compare(candidatePassword, this.password);
};


const User = mongoose.model('User', userSchema);
module.exports = User;