var ObjectID = require('mongodb').ObjectID;
function ObjectId(id){
    return new ObjectID(id);
}

module.exports = [
    {
        "_id" : ObjectId("55dc852a491e454550dc2b4c"),
        "Name" : "UserA"
    }
];