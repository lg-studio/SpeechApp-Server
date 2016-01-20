var ObjectID = require('mongodb').ObjectID;
function ObjectId(id) {
    return new ObjectID(id);
}

module.exports = [
    {
        "_id" : ObjectId("55daf024491e454550dc2b4b"),
        "RootNodeId" : ObjectId("55daecb4491e454550dc2b43")
    }
];