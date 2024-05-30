const schemas = require('./schemas');

const getCurrentISO = () => {
    return (new Date()).toISOString();  // this is probably wrong. Where is this function getting called in the USA?
}

const db = {};

db.create = async (userId, collection, data) => {
    data.type = collection;
    data.userId = userId;
    data.creationDate = getCurrentISO();
    const Schema = schemas[collection];
    const doc = new Schema(data);
    await doc.save();
    return {
        statusCode: 200,
        body: JSON.stringify(doc)
    }
}

db.updateById = async (userId, collection, data) => {
    const Schema = schemas[collection];
    await Schema.findByIdAndUpdate(data._id, data.changes);
    const doc = await Schema.findById(data._id);
    return {
        statusCode: 200,
        body: JSON.stringify(doc)
    }
}

db.deleteById = async (userId, collection, data) => {
    const Schema = schemas[collection];
    await Schema.findByIdAndDelete(data._id);
    const {_id} = data;
    return {
        statusCode: 200,
        body: JSON.stringify({_id})
    }
}

db.initData = async (userId) => {
    const tasks = await schemas['tasks'].find({userId});
    const tags = await schemas['tags'].find({userId});
    return {
        statusCode: 200,
        body: JSON.stringify({
            tasks,
            tags
        })
    }
}


module.exports = db;