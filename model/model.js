const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ISDN = new Schema({
    user: {
        type: String,
    },
    content: {
        type: Object,
    },
    keyword: {
        type: Number,
        required: true
    },
    status: {
        type: Number,
        enum: [0, 1, 2],
        default: 0 // 0 pending , 1 success, 2 error || null
    },
    telco: {
        type: String
    },
    createdAt: {
        type: Number,
        default: Date.now(),
        required: true

    },
    updatedAt: {
        type: Number,
        default: Date.now(),
        required: true

    },
    reponsedAt: {
        type: Number

    }
});

const ISDNModel = mongoose.model('isdn', ISDN);

module.exports = ISDNModel;