const { Schema, model } = require('mongoose');

const DevSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    user: {
        type: String,
        required: true,
    },
    bio: String,
    avatar: {
        type: String,
        required: true,
    },
    likes: [{
        // atribuir um ID aleatório
        type: Schema.Types.ObjectId,
        ref: 'Dev',
    }],
    dislikes: [],
}, {
    timestamps: true,
});

module.exports = model('Dev', DevSchema);