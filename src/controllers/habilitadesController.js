const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const Habilidade = require('../models/Habilidade');

router.use(authMiddleware);

router.get('/', async (req, res) => {
    try{
        var filter = {usuario: req.userId};
        if(req.query.nome){
            filter.nome = {$regex: '.*' + req.query.nome + '.*' };
        }

        const habilidades = await Habilidade.find(filter).populate(["clase"]).limit(req.query.limit);;

        return res.send({
                    success: true, 
                    total: await Habilidade.countDocuments(filter),
                    message: 'Habilidades listadas com sucesso!', 
                    content: habilidades
                });

    }catch(err){
        console.log(err);
        return res.status(400).send({success: false, message: 'Não foi possivel listas as habilidade.'})
    }
});

router.get('/:habilidadeId', async (req, res) => {
    try{
        const habilidade = await Habilidade.findById(req.params.habilidadeId).populate(["clase"]);

        return res.send({
                    success: true, 
                    message: habilidade !== null ? 'Habilidade encontrada com sucesso!' : 'Habilidade não localizada!', 
                    content: habilidade
                });

    }catch(err){
        console.log(err);
        return res.status(400).send({success: false, message: 'Não foi possivel encontrar a habilidade.'})
    }
});

router.post('/', async (req, res) => {
    try{
        const { nome } = req.body;

        if(await Habilidade.findOne({ nome, usuario: req.userId })){
            return res.status(400).send({ success:false, message: 'Esta habilidade já existe!'});
        }

        const habilidade = await Habilidade.create({ ...req.body, usuario: req.userId });

        return res.send({
                    success: true, 
                    message: 'Habilidade criada com sucesso!', 
                    content: habilidade
                });

    }catch(err){
        console.log(err);
        return res.status(400).send({success: false, message: 'Não foi possivel salvar a habilidade.'})
    }
});

router.put('/:habilidadeId', async (req, res) => {
    try{
        const { nome } = req.body;

        if(await Habilidade.findOne({ nome, _id:{$ne: req.params.habilidadeId} })){
            return res.status(400).send({ success:false, message: 'Este nome de habilidade já existe!'});
        }

        const habilidade = await Habilidade.findByIdAndUpdate(req.params.habilidadeId, req.body, {new: true});

        return res.send({
                    success: true, 
                    message: 'Habilidade alterada com sucesso!', 
                    content: habilidade
                });

    }catch(err){
        console.log(err);
        return res.status(400).send({success: false, message: 'Não foi possivel salvar a habilidade.'})
    }
});

router.delete('/:habilidadeId', async (req, res) => {
    try{
        await Habilidade.findByIdAndRemove(req.params.habilidadeId);

        return res.send({
                    success: true, 
                    message: 'Habilidade removida com sucesso!'
                });

    }catch(err){
        console.log(err);
        return res.status(400).send({success: false, message: 'Não foi possivel encontrar a habilidade.'})
    }
});

module.exports = app => app.use('/habilidades', router);