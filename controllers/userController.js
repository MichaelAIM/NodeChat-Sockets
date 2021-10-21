const {response, request} = require('express');


const userGet = (req = request, res = response) => {
    const {q, nombre = "No Name", id, page = "1", limit} = req.query;
    res.json({
        msg: 'GET api Controller',
        q,
        nombre,
        id,
        page,
        limit
    });
};

const userPost = (req, res) => {
    const {nombre,edad} = req.body;
    res.json({
        msg: 'POST api - Controller',
        nombre,
        edad
    });
};

const userPut = (req, res) => {
    const id = req.params.id;
    res.json({
        msg: 'PUT api -Controller',
        id
    });
};

const userDelete = (req, res) => {
    res.json({
        msg: 'DELETE api - Controller'
    });
};

module.exports = {
    userGet,
    userPost,
    userPut,
    userDelete
}