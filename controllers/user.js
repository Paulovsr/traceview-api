var logger = require('../servicos/logger.js');

module.exports = function(app){

  app.get('/user', function(req, res){
    console.log('Recebida requisicao de teste na porta 3000.')
    res.send('OK.');
  });

  app.post('/user/login', function(req, res){
    const { userName, password } = req.body;
    console.log('consultando usuario: ' + userName);    

    var connection = app.persistencia.connectionFactory();
    var userDao = new app.persistencia.UserDao(connection);

    userDao.login(userName,password, function(erro, user){
      if(erro){
        console.log('erro ao consultar no banco: ' + erro);
        res.status(500).send(erro);
        return;
      }
      console.log(user);
        if((typeof user !== 'undefined' && user.length > 0)) {
            console.log(`User ${userName} authenticated`);    
            return res.json(user);
        } else {
            console.log(`Authentication failed for user ${userName}`);
            res.status(401).json({ message: `Authentication failed for user ${userName}`});  
        }      
    });
  });
}  
