function MapDao(connection) {
    this._connection = connection;
}

MapDao.prototype.salva = function(map,callback) {    
    this._connection.query('INSERT INTO maps (lat, lng) values ( ? , ? )',
                                                [
                                                    map.latitude,
                                                    map.longitude
                                                ], callback);
}

MapDao.prototype.atualiza = function(map,callback) {
    this._connection.query('UPDATE maps SET status = ? where id = ?', [map.status, map.id], callback);
}

MapDao.prototype.lista = function(callback) {
    this._connection.query('select * from maps',callback);
}

MapDao.prototype.buscaPorId = function (id,callback) {
    this._connection.query("select * from maps where id = ?",[id],callback);
}

module.exports = function(){
    return MapDao;
};
