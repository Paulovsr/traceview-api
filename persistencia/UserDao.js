function UserDao(connection) {
    this._connection = connection;
}

UserDao.prototype.login = function (userName,password,callback) {
    this._connection.query("SELECT * FROM user WHERE user_name = ? AND user_password = ?",[userName, password],callback);
}

module.exports = function(){
    return UserDao;
};
