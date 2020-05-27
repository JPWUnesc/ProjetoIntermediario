const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const TipoEquipamento = require('../models/TipoEquipamento');

router.use(authMiddleware);

router.get('/', async (req, res) => {
    try{
        var filter = {usuario: req.userId};
        if(req.query.nome){
            filter.nome = {$regex: '.*' + req.query.nome + '.*' };
        }

        const tiposEquipamento = await TipoEquipamento.find(filter).limit(req.query.limit);;

        return res.send({
                    success: true, 
                    total: await TipoEquipamento.countDocuments(filter),
                    message: 'Tipos de equipamento listados com sucesso!', 
                    content: tiposEquipamento
                });

    }catch(err){
        console.log(err);
        return res.status(400).send({success: false, message: 'Não foi possivel listar os tipos de equipamento.'})
    }
});

router.get('/:tipoEquipamentoId', async (req, res) => {
    try{
        const tipoEquipamento = await TipoEquipamento.findById(req.params.tipoEquipamentoId, {usuario: req.userId});

        return res.send({
                    success: true, 
                    message: tipoEquipamento !== null ? 'Tipo de equipamento encontrado com sucesso!' : 'Tipo de equipamento não localizado!', 
                    content: tipoEquipamento
                });

    }catch(err){
        console.log(err);
        return res.status(400).send({success: false, message: 'Não foi possivel encontrar o Tipo de equipamento.'})
    }
});

router.post('/', async (req, res) => {
    try{
        const { nome } = req.body;

        if(await TipoEquipamento.findOne({ nome, usuario: req.userId })){
            return res.status(400).send({ success:false, message: 'Este tipo de equipamento já existe!'});
        }

        const tipoEquipamento = await TipoEquipamento.create({ ...req.body, usuario: req.userId });

        return res.send({
                    success: true, 
                    message: 'Tipo de equipamento criado com sucesso!', 
                    content: tipoEquipamento
                });

    }catch(err){
        console.log(err);
        return res.status(400).send({success: false, message: 'Não foi possivel salvar o tipo de equipamento.'})
    }
});

router.put('/:tipoEquipamentoId', async (req, res) => {
    try{
        const { nome } = req.body;

        if(await TipoEquipamento.findOne({ nome, _id:{$ne: req.params.tipoEquipamentoId} })){
            return res.status(400).send({ success:false, message: 'Este nome de tipo de equipamento já existe!'});
        }

        const tipoEquipamento = await TipoEquipamento.findByIdAndUpdate(req.params.tipoEquipamentoId, req.body, {new: true});

        return res.send({
                    success: true, 
                    message: 'Tipo de equipamento alterado com sucesso!', 
                    content: tipoEquipamento
                });

    }catch(err){
        console.log(err);
        return res.status(400).send({success: false, message: 'Não foi possivel salvar o tipo de equipamento.'})
    }
});

router.delete('/:tipoEquipamentoId', async (req, res) => {
    try{
        await TipoEquipamento.findByIdAndRemove(req.params.tipoEquipamentoId);

        return res.send({
                    success: true, 
                    message: 'Tipo de equipamento removido com sucesso!'
                });

    }catch(err){
        console.log(err);
        return res.status(400).send({success: false, message: 'Não foi possivel encontrar o tipo de equipamento.'})
    }
});

module.exports = app => app.use('/tiposequipamento', router);