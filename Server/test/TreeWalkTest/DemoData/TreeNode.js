var ObjectID = require('mongodb').ObjectID;
function ObjectId(id) {
    return new ObjectID(id);
}

module.exports = [
    {
        "_id" : ObjectId("55daecb4491e454550dc2b43"),
        "ParentId" : null,
        "Type" : "Competence",
        "ResourceId" : ObjectId("55daea56491e454550dc2b3b"),
        "TreeStructureId" : ObjectId("55daf024491e454550dc2b4b")
    },
    {
        "_id" : ObjectId("55daecb9491e454550dc2b44"),
        "ParentId" : ObjectId("55daecb4491e454550dc2b43"),
        "Type" : "Competence",
        "ResourceId" : ObjectId("55daeac5491e454550dc2b3c"),
        "TreeStructureId" : ObjectId("55daf024491e454550dc2b4b")
    },
    {
        "_id" : ObjectId("55daecc3491e454550dc2b46"),
        "ParentId" : ObjectId("55daecb9491e454550dc2b44"),
        "Type" : "Competence",
        "ResourceId" : ObjectId("55daeb71491e454550dc2b3e"),
        "TreeStructureId" : ObjectId("55daf024491e454550dc2b4b")
    },
    {
        "_id" : ObjectId("55daeccb491e454550dc2b48"),
        "ParentId" : ObjectId("55daecb4491e454550dc2b43"),
        "Type" : "Competence",
        "ResourceId" : ObjectId("55daeba0491e454550dc2b40"),
        "TreeStructureId" : ObjectId("55daf024491e454550dc2b4b")
    },
    {
        "_id" : ObjectId("55daecd2491e454550dc2b4a"),
        "ParentId" : ObjectId("55daeccb491e454550dc2b48"),
        "Type" : "Competence",
        "ResourceId" : ObjectId("55daebce491e454550dc2b42"),
        "TreeStructureId" : ObjectId("55daf024491e454550dc2b4b")
    },
    {
        "_id" : ObjectId("55daecbe491e454550dc2b45"),
        "ParentId" : ObjectId("55daecb9491e454550dc2b44"),
        "Type" : "Competence",
        "ResourceId" : ObjectId("55daeb5d491e454550dc2b3d"),
        "TreeStructureId" : ObjectId("55daf024491e454550dc2b4b")
    },
    {
        "_id" : ObjectId("55daecc7491e454550dc2b47"),
        "ParentId" : ObjectId("55daecb9491e454550dc2b44"),
        "Type" : "Competence",
        "ResourceId" : ObjectId("55daeb8a491e454550dc2b3f"),
        "TreeStructureId" : ObjectId("55daf024491e454550dc2b4b")
    },
    {
        "_id" : ObjectId("55daeccf491e454550dc2b49"),
        "ParentId" : ObjectId("55daeccb491e454550dc2b48"),
        "Type" : "Competence",
        "ResourceId" : ObjectId("55daebb5491e454550dc2b41"),
        "TreeStructureId" : ObjectId("55daf024491e454550dc2b4b")
    }
];