const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const Clase = require('../models/Clase');

router.use(authMiddleware);

router.get('/', async (req, res) => {
    try{     
        var filter = {usuario: req.userId};
        if(req.query.nome){
            filter.nome = {$regex: '.*' + req.query.nome + '.*' };
        }   
        const clases = await Clase.find(filter)
                                        .limit(req.query.limit);

        return res.send({
                    success: true, 
                    total: await Clase.countDocuments(filter),
                    message: 'Clases listadas com sucesso!', 
                    content: clases
                });

    }catch(err){
        console.log(err);
        return res.status(400).send({success: false, message: 'Não foi possivel listas as clases.'})
    }
});

router.get('/:claseId', async (req, res) => {
    try{
        const clase = await Clase.findById(req.params.claseId, {usuario: req.userId});

        return res.send({
                    success: true, 
                    message: clase !== null ? 'Clase encontrada com sucesso!' : 'Clase não localizada!', 
                    content: clase
                });

    }catch(err){
        console.log(err);
        return res.status(400).send({success: false, message: 'Não foi possivel encontrar a clase.'})
    }
});

router.post('/', async (req, res) => {
    try{
        const { nome } = req.body;

        if(await Clase.findOne({ nome, usuario: req.userId })){
            return res.status(400).send({ success:false, message: 'Esta classe já existe!'});
        }

        const clase = await Clase.create({ ...req.body, usuario: req.userId });

        return res.send({
                    success: true, 
                    message: 'Clase criada com sucesso!', 
                    content: clase
                });

    }catch(err){
        console.log(err);
        return res.status(400).send({success: false, message: 'Não foi possivel salvar a clase.'})
    }
});

router.put('/:claseId', async (req, res) => {
    try{
        const { nome } = req.body;

        if(await Clase.findOne({ nome, _id:{$ne: req.params.claseId} })){
            return res.status(400).send({ success:false, message: 'Este nome de classe já existe!'});
        }

        const clase = await Clase.findByIdAndUpdate(req.params.claseId, req.body, {new: true});

        return res.send({
                    success: true, 
                    message: 'Clase alterada com sucesso!', 
                    content: clase
                });

    }catch(err){
        console.log(err);
        return res.status(400).send({success: false, message: 'Não foi possivel salvar a clase.'})
    }
});

router.delete('/:claseId', async (req, res) => {
    try{
        await Clase.findByIdAndRemove(req.params.claseId);

        return res.send({
                    success: true, 
                    message: 'Clase removida com sucesso!'
                });

    }catch(err){
        console.log(err);
        return res.status(400).send({success: false, message: 'Não foi possivel encontrar a clase.'})
    }
});

module.exports = app => app.use('/clases', router);