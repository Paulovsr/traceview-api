var logger = require('../servicos/logger.js');

module.exports = function(app){
  app.get('/maps', function(req, res){
    console.log('Recebida requisicao de teste na porta 3000.')
    res.send('OK.');    
  });

  app.get('/maps/users', function(req, res){
    
    var connection = app.persistencia.connectionFactory();
    var mapDao = new app.persistencia.MapDao(connection);

    mapDao.lista(function(erro, resultado){
      if(erro){
        console.log('erro ao consultar no banco: ' + erro);
        res.status(500).send(erro);
        return;
      }
      console.log('localizações encontrados: ' + JSON.stringify(resultado));
      res.json(resultado);
      return;
    });
  });

  app.post('/maps/location', function(req, res){
    const map = req.body; 

    var connection = app.persistencia.connectionFactory();
    var mapDao = new app.persistencia.MapDao(connection);
    
    mapDao.salva(map, function(erro, resMap){      
      if(erro){
        console.log('erro ao consultar no banco: ' + erro);
        res.status(500).send(erro);
        return;
      }
      
        if(resMap) {    
            return res.json(resMap);
        } else {
            res.status(401).json({ message: `não foi possivel cadastrar localizacao ${json.stringify(resMap)}`});  
        }      
    });
  });

  app.delete('/maps/map/:id', function(req, res){
    var map = {};
    var id = req.params.id;

    map.id = id;
    map.status = 'CANCELADO';

    var connection = app.persistencia.connectionFactory();
    var mapDao = new app.persistencia.MapDao(connection);

    mapDao.atualiza(map, function(erro){
        if (erro){
          res.status(500).send(erro);
          return;
        }
        console.log('rota cancelada');
        res.status(204).send(map);
    });
  });

  app.put('/maps/map/:id', function(req, res){

    var map = {};
    var id = req.params.id;

    map.id = id;
    map.status = 'ATUALIZADO';

    var connection = app.persistencia.connectionFactory();
    var mapDao = new app.persistencia.MapDao(connection);

    mapDao.atualiza(map, function(erro){
        if (erro){
          res.status(500).send(erro);
          return;
        }
        console.log('rota atualizada');
        res.send(map);
    });

  });

  app.post('/maps/map', function(req, res){

    req.assert("lat","latitude e obrigatorio e deve ser um decimal").notEmpty().isFloat();
    req.assert("lng","longitude e obrigatorio e deve ser um decimal").notEmpty().isFloat();   

    var erros = req.validationErrors();

    if (erros){
      console.log('Erros de validacao encontrados');
      res.status(400).send(erros);
      return;
    }

    var map = req.body;    
    console.log('processando uma requisicao de uma nova cordenada');

    map.status = 'CRIADO';
    map.data = new Date;

    var connection = app.persistencia.connectionFactory();
    var mapDao = new app.persistencia.MapDao(connection);

    mapDao.salva(map, function(erro, resultado){
      if(erro){
        console.log('Erro ao inserir no banco:' + erro);
        res.status(500).send(erro);
      } else {
      map.id = resultado.insertId;
      console.log('cordenada criada');      

      res.location('/maps/map/' + map.id);

      var response = {
        dados_do_pagamanto: map,
        links: [
          {
            href:"http://localhost:3000/maps/map/" + map.id,
            rel:"confirmar",
            method:"PUT"
          },
          {
            href:"http://localhost:3000/maps/map/"+ map.id,
            rel:"cancelar",
            method:"DELETE"
          }
        ]
      }

      res.status(201).json(response);
    }
    });

  });
}
