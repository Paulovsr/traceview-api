function UserDao(connection) {
    this._connection = connection;
}

UserDao.prototype.login = function (userName,password,callback) {
    this._connection.query("SELECT * FROM user WHERE user_name = ? AND user_password = ?",[userName, password],callback);
}

UserDao.prototype.lista = function(callback) {
    this._connection.query('select * from user',callback);
}

module.exports = function(){
    return UserDao;
};
