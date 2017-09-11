var http = require('http');
var path = require('path');

var express = require('express');

var router = express();
var server = http.createServer(router);

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/plusone');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var ItemModel = require('./models/item');

router.use(express.bodyParser());
router.use(express.static(path.resolve(__dirname, 'static')));

router.post('/create', function (req, res) {
    var model = ItemModel();

    model.userId = req.body.userId;
    model.name = req.body.name;
    model.count = +req.body.count;
    model.save(function (err, data) {
        err && console.error(err);
        res.send(req.body);
        res.end();
    });
});

router.get('/api/items', function (req, res) {
    var userId = req.query.userId;

    if (!userId) {
        return res.send(403, []);
    }

    ItemModel.find({
        userId: userId
    }, function (err, items) {
        err && console.error(err);
        res.send(items);
    });
});

router.get('/api/items/:id', function (req, res) {
    var id = req.params.id;

    ItemModel.findById(id, function (err, item) {
        err && console.error(err);
        res.send(item);
    });
});

router.put('/api/items/:id', function (req, res) {
    var id = req.params.id;

    ItemModel.findById(id, function (err, item) {
        err && console.error(err);
        item.count = req.body.count;
        item.save(function (err, data) {
            err && console.error(err);
            res.send(data);
        });
    });
});

router.delete('/api/items/:id', function (req, res) {
    var id = req.params.id;

    ItemModel.remove({ _id: id }, function (err) {
        err && console.error(err);
        res.end();
    });
});

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();

  console.log("Listening at", addr.address + ":" + addr.port);
});
