const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const Personagem = require('../models/Personagem');

router.use(authMiddleware);

router.get('/', async (req, res) => {
    try{
        var filter = {usuario: req.userId};
        if(req.query.nome){
            filter.nome = {$regex: '.*' + req.query.nome + '.*' };
        }

        const personagens = await Personagem.find(filter).populate(["clase", "raca", "habilidades"]).limit(req.query.limit);;

        return res.send({
                    success: true, 
                    total: await Personagem.countDocuments(filter),
                    message: 'Personagens listados com sucesso!', 
                    content: personagens
                });

    }catch(err){
        console.log(err);
        return res.status(400).send({success: false, message: 'Não foi possivel listar os personagem.'})
    }
});

router.get('/:personagemId', async (req, res) => {
    try{
        const personagem = await Personagem.findById(req.params.personagemId, {usuario: req.userId}).populate(["clase", "raca", "habilidades"]);

        return res.send({
                    success: true, 
                    message: personagem !== null ? 'Personagem encontrado com sucesso!' : 'Personagem não localizado!', 
                    content: personagem
                });

    }catch(err){
        console.log(err);
        return res.status(400).send({success: false, message: 'Não foi possivel encontrar o personagem.'})
    }
});

router.post('/', async (req, res) => {
    try{
        const { nome } = req.body;

        if(await Personagem.findOne({ nome, usuario: req.userId })){
            return res.status(400).send({ success:false, message: 'Este personagem já existe!'});
        }

        const personagem = await Personagem.create({ ...req.body, usuario: req.userId });

        return res.send({
                    success: true, 
                    message: 'Personagem criado com sucesso!', 
                    content: personagem
                });

    }catch(err){
        console.log(err);
        return res.status(400).send({success: false, message: 'Não foi possivel salvar o personagem.'})
    }
});

router.put('/:personagemId', async (req, res) => {
    try{
        const { nome } = req.body;

        if(await Personagem.findOne({ nome, _id:{$ne: req.params.personagemId} })){
            return res.status(400).send({ success:false, message: 'Este nome de personagem já existe!'});
        }

        const personagem = await Personagem.findByIdAndUpdate(req.params.personagemId, req.body, {new: true});

        return res.send({
                    success: true, 
                    message: 'Personagem alterado com sucesso!', 
                    content: personagem
                });

    }catch(err){
        console.log(err);
        return res.status(400).send({success: false, message: 'Não foi possivel salvar o personagem.'})
    }
});

router.delete('/:personagemId', async (req, res) => {
    try{
        await Personagem.findByIdAndRemove(req.params.personagemId);

        return res.send({
                    success: true, 
                    message: 'Personagem removido com sucesso!'
                });

    }catch(err){
        console.log(err);
        return res.status(400).send({success: false, message: 'Não foi possivel encontrar o personagem.'})
    }
});

module.exports = app => app.use('/personagens', router);