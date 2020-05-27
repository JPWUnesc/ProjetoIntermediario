const mongoose = require('../database');

const ClaseSchema = new mongoose.Schema({
    nome : {
        type: String,
        require: true
    },
    descricao : {
        type: String
    },
    usuario : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    proeficiencia: {
        type: String,
        enum : ['ATAQUE', 'MAGIA'],
        require: true
    }
});

const Clase = mongoose.model('Clase', ClaseSchema);

module.exports = Clase;