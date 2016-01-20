var ObjectID = require('mongodb').ObjectID;
function ObjectId(id) {
    return new ObjectID(id);
}

module.exports = [
    {
        "_id" : ObjectId("55daea56491e454550dc2b3b"),
        "Name" : "A",
        "Description" : "1 Description"
    },
    {
        "_id" : ObjectId("55daeac5491e454550dc2b3c"),
        "Name" : "B",
        "Description" : "1 - 2 Description"
    },
    {
        "_id" : ObjectId("55daeb5d491e454550dc2b3d"),
        "Name" : "C",
        "Description" : "2 - 3 Description"
    },
    {
        "_id" : ObjectId("55daeb71491e454550dc2b3e"),
        "Name" : "D",
        "Description" : "2 - 4 Description"
    },
    {
        "_id" : ObjectId("55daeb8a491e454550dc2b3f"),
        "Name" : "E",
        "Description" : "2 - 5 Description"
    },
    {
        "_id" : ObjectId("55daeba0491e454550dc2b40"),
        "Name" : "F",
        "Description" : "1 - 6 Description"
    },
    {
        "_id" : ObjectId("55daebb5491e454550dc2b41"),
        "Name" : "G",
        "Description" : "6 - 7 Description"
    },
    {
        "_id" : ObjectId("55daebce491e454550dc2b42"),
        "Name" : "H",
        "Description" : "6 - 8 Description"
    }
];