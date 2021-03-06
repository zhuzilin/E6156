let Dao = require("../dao");
let logging = require('../../utils/logging');
let sandh = require('../../utils/salthash');

const customersCollection = {
    name: "customers",
    attribute: {
        id: {type: 'string', allowNull: false, field: 'customers_id'},
        username: {type: 'string', allowNull: false, field: "customers_username", primaryKey: true},
        email: {type: 'string', allowNull: false, field: "customers_email"},
        status: {type: 'string', allowNull: false, field: 'customers_status'},
        pw: {type: 'string', allowNull: false, field: 'customers_password'},
        tenant_id: {type: 'string', allowNull: false, field: 'tenant_id'},
        method: {type: 'string',allowNull: false, field: 'entrance_method'}
    }
};

let CustomersDAO = function() {
    const self = this;
    self.theDAO = new Dao.Dao(customersCollection);
    self.retrieveById = self.theDAO.retrieveById;

    self.retrieveByTemplate = function(template, fields) {
        logging.debug_message("template", template);
        return new Promise(function(resolve, reject) {
            self.theDAO.retrieveByTemplate(template, fields).then(
                function (result) {
                    resolve(result);
                }, function (err) { reject(err) }
            );
        })
    };

    self.create = function(data, context) {
        return new Promise(function(resolve, reject) {
            data.tenant_id = context.tenant;
            data.pw = sandh.saltAndHash(data.pw);
            let id = data.id;

            self.theDAO.create(data).then(
                function (result) {
                    if (result === undefined || result === null) {
                        result = {};
                    }
                    result.id = id;
                    resolve(result);
                },
                function (error){
                    // rejection
                    console.error(error.message);
                    reject(error);
                }

            );
        });

    };

    self.update = function(template, update, fields) {
        return new Promise(function(resolve,reject){
            self.theDAO.update(template,update,fields).then(
                function (result) {
                    if (result === undefined || result === null) {
                        result = {};
                    }
                    resolve(result);
                }
            );
        });
    };

    self.delete = function(template,fields) {
        return new Promise(function(resolve,reject){
            self.theDAO.delete(template,fields).then(
                function (result) {
                    if (result === undefined || result === null) {
                        result = {};
                    }
                    resolve(result);
                }
            );
        });
    };
};

exports.CustomersDAO = CustomersDAO;
