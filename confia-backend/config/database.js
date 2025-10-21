const mongoose = require('mongoose');

// Padrão GoF: Singleton
// Garante que teremos apenas UMA instância da classe Database
// e, portanto, apenas UMA conexão com o MongoDB.

class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }
    this._connected = false;
    // Pega a URI do .env ou usa a sua antiga
    this.MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://22300147:Sapinho90@confia.tneyira.mongodb.net/?retryWrites=true&w=majority&appName=Confia';
    Database.instance = this;
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  connect() {
    if (this._connected) {
      console.log('MongoDB já está conectado.');
      return;
    }

    mongoose.connect(this.MONGO_URI)
      .then(() => {
        this._connected = true;
        console.log('Conectado ao MongoDB!');
      })
      .catch((err) => {
        console.error('Erro ao conectar ao MongoDB:', err);
        this._connected = false;
      });
  }
}

// Exportamos a *instância única*
module.exports = Database.getInstance();