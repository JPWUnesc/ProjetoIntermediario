const mongoose = require('../database');

const PersonagemSchema = new mongoose.Schema({
    nivel: {
        type: Number,
        require: true,
        default: 1
    },
    nome : {
        type: String,
        require: true
    },
    clase : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Clase",
        require: true
    },
    raca : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Raca",
        require: true
    },
    habilidades : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Habilidade"
        }
    ],
    usuario : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    equipamentos : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Equipamento"
        }
    ]
});

const Personagem = mongoose.model('Personagem', PersonagemSchema);

module.exports = Personagem;