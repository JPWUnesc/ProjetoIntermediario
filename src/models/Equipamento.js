const mongoose = require('../database');

const EquipamentoSchema = new mongoose.Schema({
    nome:{
        type: String,
    },
    descricao:{
        type: String,
    },
    usuario : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    tipoEquipamento : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TipoEquipamento",
        require: true
    },
});

const Equipamento = mongoose.model('Equipamento', EquipamentoSchema);

module.exports = Equipamento;