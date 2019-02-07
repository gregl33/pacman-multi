// var sql = require('./db.js');

var mysql = require('mysql');

// let connection;
let db_config = {
  port: "3306",
  host     : '127.0.0.1',
  user     : 'root',
  password : '',
  insecureAuth : true,
  database : 'testDB'
  // socketPath: "/xampp/mysql/mysql.sock"
}

var connection = mysql.createConnection(db_config); // Recreate the connection, since

let MapObj = function() {

}

MapObj.getMapById = function (mapid, result) {

        connection.query("SELECT * FROM Persons WHERE PersonID = ? ", mapid, function (err, res) {
                if(err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                else{
                    result(null, res);

                }
            });
};




MapObj.getAllMaps = function (result) {

        connection.query("SELECT * from Persons", function (err, res) {
                if(err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                else{
                  console.log("maps: ", res);

                    result(null, res);

                }
            });
};



module.exports= MapObj;
