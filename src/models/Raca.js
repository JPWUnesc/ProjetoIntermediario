const mongoose = require('../database');

const RacaSchema = new mongoose.Schema({
    nome : {
        type: String,
        require: true
    },
    descricao : {
        type: String,
        require: true
    },
    vida: {
        type: Number,
        require: true
    },
    forca: {
        type: Number,
        require: true
    },
    usuario : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    mana: {
        type: Number,
        require: true
    }
});

const Raca = mongoose.model('Raca', RacaSchema);

module.exports = Raca;