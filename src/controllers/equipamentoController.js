const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const Equipamento = require('../models/Equipamento');

router.use(authMiddleware);

router.get('/', async (req, res) => {
    try{
        var filter = {usuario: req.userId};
        if(req.query.nome){
            filter.nome = {$regex: '.*' + req.query.nome + '.*' };
        }

        const equipamentos = await Equipamento.find(filter)
                                                .limit(req.query.limit);

        return res.send({
                    success: true, 
                    total: await Equipamento.countDocuments(filter),
                    message: 'Equipamentos listados com sucesso!', 
                    content: equipamentos
                });

    }catch(err){
        console.log(err);
        return res.status(400).send({success: false, message: 'Não foi possivel listar os equipamentos.'})
    }
});

router.get('/:equipamentoId', async (req, res) => {
    try{
        const equipamento = await Equipamento.findById(req.params.equipamentoId);

        return res.send({
                    success: true, 
                    message: equipamento !== null ? 'Equipamento encontrado com sucesso!' : 'Equipamento não localizado!', 
                    content: equipamento
                });

    }catch(err){
        console.log(err);
        return res.status(400).send({success: false, message: 'Não foi possivel encontrar o equipamento.'})
    }
});

router.post('/', async (req, res) => {
    try{
        const { nome } = req.body;

        if(await Equipamento.findOne({ nome, usuario: req.userId })){
            return res.status(400).send({ success:false, message: 'Este equipamento já existe!'});
        }

        const equipamento = await Equipamento.create({ ...req.body, usuario: req.userId });

        return res.send({
                    success: true, 
                    message: 'Equipamento criado com sucesso!', 
                    content: equipamento
                });

    }catch(err){
        console.log(err);
        return res.status(400).send({success: false, message: 'Não foi possivel salvar o equipamento.'})
    }
});

router.put('/:equipamentoId', async (req, res) => {
    try{
        const { nome } = req.body;

        if(await Equipamento.findOne({ nome, _id:{$ne: req.params.equipamentoId} })){
            return res.status(400).send({ success:false, message: 'Este nome de equipamento já existe!'});
        }

        const equipamento = await Equipamento.findByIdAndUpdate(req.params.equipamentoId, req.body, {new: true});

        return res.send({
                    success: true, 
                    message: 'Equipamento alterado com sucesso!', 
                    content: equipamento
                });

    }catch(err){
        console.log(err);
        return res.status(400).send({success: false, message: 'Não foi possivel salvar o equipamento.'})
    }
});

router.delete('/:equipamentoId', async (req, res) => {
    try{
        await Equipamento.findByIdAndRemove(req.params.equipamentoId);

        return res.send({
                    success: true, 
                    message: 'Equipamento removido com sucesso!'
                });

    }catch(err){
        console.log(err);
        return res.status(400).send({success: false, message: 'Não foi possivel encontrar o equipamento.'})
    }
});

module.exports = app => app.use('/equipamentos', router);