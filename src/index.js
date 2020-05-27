const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.get('/', (req, res)=>{
    res.send('Ok');
});

require('./controllers/authController')(app);
require('./controllers/clasesController')(app);
require('./controllers/racasController')(app);
require('./controllers/habilitadesController')(app);
require('./controllers/personagemController')(app);
require('./controllers/tipoEquipamentoController')(app);
require('./controllers/equipamentoController')(app);

app.listen(3000);