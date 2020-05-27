const mongoose = require('../database');

const TipoEquipamentoSchema = new mongoose.Schema({
    nome:{
        type: String,
    },
    usuario : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    descricao:{
        type: String,
    }     
});

const TipoEquipamento = mongoose.model('TipoEquipamento', TipoEquipamentoSchema);

module.exports = TipoEquipamento;