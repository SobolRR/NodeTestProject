/**
 * Created by sobolrr on 04.07.16.
 */
var util = require('util');
var Sequelize = require('sequelize');
var events = require('events');
var async = require('async');


var sequelize = undefined;
var User = undefined;
var emitter = exports.emitter = new events.EventEmitter();


exports.connect = function (params, callback) {
    sequelize = new Sequelize(params.dbname, params.username, params.password, params.params);
    Messages = sequelize.define('Messages', {
        idTo: {type: Sequelize.INTEGER, unique: false},
        idFrom: {type: Sequelize.INTEGER, unique: false},
        message: {type: Sequelize.STRING, unique: false}
    });
    Messages.sync();

    User = sequelize.define('User', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true, unique: true
        },
        username: {type: Sequelize.STRING, unique: true},
        password: Sequelize.STRING,
        email: Sequelize.STRING
    });
    User.sync().then(function () {
        callback();
    }).error(function (err) {
        callback(err);
    });
};

exports.disconnect = function (callback) {
    callback();
};

exports.findById = function (id, callback) {
    User.find({where: {id: id}}).then(function (user) {
        if (!user) {
            callback('User' + id + ' does not exist');
        } else {
            callback(null, {
                id: user.id, username: user.username,
                password: user.password, email: user.email
            });
        }
    });
};

exports.findByUsername = function (username, callback) {
    User.find({where: {username: username}}).then(function (user) {
        if (!user) {
            callback('User' + username + ' not find');
        } else {
            callback(null, {
                id: user.id, username: user.username,
                password: user.password, email: user.email
            });
        }
    });
};

exports.create = function (id, username, password, email, callback) {
    User.create({
        id: id,
        username: username,
        password: password,
        email: email
    }).then(function (user) {
        callback();
    }).error(function (err) {
        callback(err);
    });
};

exports.update = function (id, username, password, email, callback) {
    User.find({where: {id: id}}).then(function (user) {
        user.updateAttributes({
            id: id,
            username: username,
            password: password,
            email: email
        }).then(function (user) {
            callback();
        }).error(function (err) {
            callback(err);
        });
    });
};

exports.allUsers = function (callback) {
    User.findAll().then(function (users) {
        if (users) {
            var theusers = [];
            users.forEach(function (user) {
                theusers.push({
                    id: user.id, name: user.username
                });
            });
            callback(null, theusers);
        }  else callback();
            });
        };
exports.sendMessage = function (id, from, message, callback) {
    Messages.create({
        idTo: id, idFrom: from, message: message
    }).then(function (user) {
        emitter.emit('newmessage', id);
        callback();
    }).error(function (err) {
        callback(err);
    });
};

exports.getMessages = function (id, callback) {
    Messages.findAll({
        where: { idTo: id }
    }).then(function (messages) {
        if (messages) {
            var themessages = [];
            async.eachSeries(messages,
                function (msg, done) {
                    exports.findById(msg.idFrom, function (err, userFrom) {
                        themessages.push({
                            idTo: msg.idTo,
                            idFrom: msg.idFrom,
                            fromName: userFrom.username,
                            message: msg.message
                        });
                        done();
                    });
                    
                }, function (err) {
                    if(err) callback(err);
                    else callback(null, themessages);
                });
        } else callback();
    });
};

exports.delMessage = function (id, from, message, callback) {
    Messages.find({ where: {idTo: id, idFrom:from, message: message}
    }).then(function (msg) {
        if (msg) {
            msg.destroy().then(function () {
                emitter.emit('delmessage');
                callback();
            }).error(function (err) {
                callback(err);
            });
        } else callback();
    });
};