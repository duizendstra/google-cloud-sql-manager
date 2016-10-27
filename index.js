var mysql = require('mysql');

function googleCloudSqlManager(mainSpecs) {
    "use strict";
    var pool = mysql.createPool({
        connectionLimit: 10,
        host: mainSpecs.host,
        user: mainSpecs.user,
        password: mainSpecs.password,
        database: mainSpecs.database,
        ssl: mainSpecs.ssl
    });

    function query(specs) {
        var sqlQuery = specs.sqlQuery;
        return new Promise(function (resolve, reject) {
            pool.getConnection(function (poolErr, connection) {
                if (poolErr) {
                    reject(poolErr);
                    return;
                }
                connection.query(sqlQuery, function (err, rows, fields) {
                    if (err) {
                        reject(err);
                        return;
                    }

                    resolve({
                        rows: rows,
                        fields: fields
                    });
                    connection.release();
                });
            });
        });
    }

    return {
        query: query
    };
}

module.exports = googleCloudSqlManager;