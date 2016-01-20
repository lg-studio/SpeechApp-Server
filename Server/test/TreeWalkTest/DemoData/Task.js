var ObjectID = require('mongodb').ObjectID;
function ObjectId(id) {
    return new ObjectID(id);
}

module.exports = [
    {
        "_id" : ObjectId("55dc87dd491e454550dc2b4d"),
        "PlayerId" : ObjectId("55dc852a491e454550dc2b4c"),
        "Template" : {
            "CompetenceId" : ObjectId("55daeb5d491e454550dc2b3d")
        },
        "TAS" : 0.1,
        "State" : 2
    },
    {
        "_id" : ObjectId("55dc87fa491e454550dc2b4e"),
        "PlayerId" : ObjectId("55dc852a491e454550dc2b4c"),
        "Template" : {
            "CompetenceId" : ObjectId("55daeb71491e454550dc2b3e"),
        },
        "TAS" : 0.1,
        "State" : 2
    },
    {
        "_id" : ObjectId("55dc8803491e454550dc2b4f"),
        "PlayerId" : ObjectId("55dc852a491e454550dc2b4c"),
        "Template" : {
            "CompetenceId" : ObjectId("55daeb71491e454550dc2b3e"),
        },
        "TAS" : 0.3,
        "State" : 2
    },
    {
        "_id" : ObjectId("55dc880b491e454550dc2b50"),
        "PlayerId" : ObjectId("55dc852a491e454550dc2b4c"),
        "Template" : {
            "CompetenceId" : ObjectId("55daeb8a491e454550dc2b3f"),
        },
        "TAS" : 0.8,
        "State" : 2
    },
    {
        "_id" : ObjectId("55dc8814491e454550dc2b51"),
        "PlayerId" : ObjectId("55dc852a491e454550dc2b4c"),
        "Template" : {
            "CompetenceId" : ObjectId("55daeb8a491e454550dc2b3f"),
        },
        "TAS" : 0.4,
        "State" : 2
    },
    {
        "_id" : ObjectId("55dc881d491e454550dc2b52"),
        "PlayerId" : ObjectId("55dc852a491e454550dc2b4c"),
        "Template" : {
            "CompetenceId" : ObjectId("55daebb5491e454550dc2b41"),
        },
        "TAS" : 0.8,
        "State" : 2
    },
    {
        "_id" : ObjectId("55dc8824491e454550dc2b53"),
        "PlayerId" : ObjectId("55dc852a491e454550dc2b4c"),
        "Template" : {
            "CompetenceId" : ObjectId("55daebce491e454550dc2b42"),
        },
        "TAS" : 1,
        "State" : 2
    }
];