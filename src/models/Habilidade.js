const mongoose = require('../database');
const Clase = require('../models/Clase')

const HabilidadeSchema = new mongoose.Schema({
    nome : {
        type: String,
        require: true
    },
    descricao : {
        type: String,
        require: true
    },
    clase : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Clase",
        require: true
    },
    usuario : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    dano : {
        type: Number,
        require: true
    },
    tiposEquipamentos : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TipoEquipamento"
        }
    ]
});

const Habilidade = mongoose.model('Habilidade', HabilidadeSchema);

module.exports = Habilidade;