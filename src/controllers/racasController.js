const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const Raca = require('../models/Raca');

router.use(authMiddleware);

router.get('/', async (req, res) => {
    try{
        var filter = {usuario: req.userId};
        if(req.query.nome){
            filter.nome = {$regex: '.*' + req.query.nome + '.*' };
        }

        const racas = await Raca.find(filter).limit(req.query.limit);;

        return res.send({
                    success: true, 
                    total: await Raca.countDocuments(filter),
                    message: 'Raças listadas com sucesso!', 
                    content: racas
                });

    }catch(err){
        console.log(err);
        return res.status(400).send({success: false, message: 'Não foi possivel listas as raças.'})
    }
});

router.get('/:racaId', async (req, res) => {
    try{
        const raca = await Raca.findById(req.params.racaId);

        return res.send({
                    success: true, 
                    message: raca !== null ? 'Raça encontrada com sucesso!' : 'Raça não localizada!', 
                    content: raca
                });

    }catch(err){
        console.log(err);
        return res.status(400).send({success: false, message: 'Não foi possivel encontrar a Raça.'})
    }
});

router.post('/', async (req, res) => {
    try{
        const { nome } = req.body;

        if(await Raca.findOne({ nome, usuario: req.userId })){
            return res.status(400).send({ success:false, message: 'Esta raça já existe!'});
        }

        const raca = await Raca.create({ ...req.body, usuario: req.userId });

        return res.send({
                    success: true, 
                    message: 'Raça criada com sucesso!', 
                    content: raca
                });

    }catch(err){
        console.log(err);
        return res.status(400).send({success: false, message: 'Não foi possivel salvar a raça.'})
    }
});

router.put('/:racaId', async (req, res) => {
    try{
        const { nome } = req.body;

        if(await Raca.findOne({ nome, _id:{$ne: req.params.racaId} })){
            return res.status(400).send({ success:false, message: 'Este nome de raça já existe!'});
        }

        const raca = await Raca.findByIdAndUpdate(req.params.racaId, req.body, {new: true});

        return res.send({
                    success: true, 
                    message: 'Raça alterada com sucesso!', 
                    content: raca
                });

    }catch(err){
        console.log(err);
        return res.status(400).send({success: false, message: 'Não foi possivel salvar a raça.'})
    }
});

router.delete('/:racaId', async (req, res) => {
    try{
        await Raca.findByIdAndRemove(req.params.racaId);

        return res.send({
                    success: true, 
                    message: 'Raça removida com sucesso!'
                });

    }catch(err){
        console.log(err);
        return res.status(400).send({success: false, message: 'Não foi possivel encontrar a raça.'})
    }
});

module.exports = app => app.use('/racas', router);