var	mongoClient = require('mongodb').MongoClient;

mongoClient.connect('mongodb://localhost:27017/school', function(err,db) {
    if (err) throw err;

    var query = {};
    var fields = {};

    var cursor = db.collection('students').find(query, fields);

    cursor.forEach(function (doc) {
        var scores = doc.scores;
        scores.sort(function(a, b){
            var res = 0;

            res = a.type == "homework" ?
                (b.type == "homework" ? a.score-b.score : -1) :
                (b.type == "homework" ? 1 : a.score-b.score);
            return res;
        });

        doc.scores = doc.scores.splice(1);
        db.collection('students').update({
            _id : doc._id
        }, {
            "$set" : {
                "scores" : doc.scores
            }
        });

    });
});