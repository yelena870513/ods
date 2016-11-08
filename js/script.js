(function () {

'use strict';

/*******************************  NEdb  ***********************************/

var Datastore = require('nedb');
var users = new Datastore({ filename: 'dbe.db', autoload: true });

var people = [];

var scott = {
    name: 'Scott Robinson',
    age: 28,
    twitter: '@ScottWRobinson'
};

var elon = {
    name: 'Elon Musk',
    age: 44,
    twitter: '@elonmusk'
};

var jack = {
    name: 'Jack Sparrow',
    age: 39,
    twitter: '@jack'
};

/* people.push(scott, elon, jack);

users.insert(people, function(err, docs) {
    docs.forEach(function(d) {
        console.log('Saved user:', d.name);
    });
}); */

users.find({ age: { $lt: 50 }}, function(err, docs) {
    docs.forEach(function(d) {
        console.log('Found user:', d.name);
    });
});

/*******************************  SQL JS  ***********************************/

var fs = require('fs');
var SQL = require('sql.js');
var filebuffer = fs.readFileSync('compras.db');

// Load the db
var db = new SQL.Database(filebuffer);

// Prepare a statement
var stmt = db.prepare("SELECT * FROM sqlite_sequence");

while(stmt.step()) { //
    var row = stmt.getAsObject();
    console.log(row);
}

loadPouch();


})();

/*******************************  Pouchdb  ***********************************/

function loadPouch() {
    
    var fs = require('fs');

    var db = new PouchDB('turtles');

    db.get('_local/preloaded').catch(function (err) {
        if (err.status !== 404) {
            throw err;
        }
        return db.load('data/turtles.json').then(function () {
            return db.put({ _id: '_local/preloaded' });
        });
    }).then(function () {
        return db.allDocs({ include_docs: true });
    }).then(function (res) {
        display.innerHTML = JSON.stringify(res, null, '  ');
    }).catch(console.log.bind(console));  

    var ws = fs.createWriteStream('turtles.json');

    db.dump(ws).then(function (res) {
        console.log(res);
    });

 
}
