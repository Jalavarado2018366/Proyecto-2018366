'use strict'

var express = require("express")
var UserController = require("../controller/userController");
var md_auth = require("../middlewares/authenticated")

//SUBIR IMAGEN
var multiparty = require("connect-multiparty")
var md_subir = multiparty({ uploadDir: './src/uploads/users'})

//Rutas
var api= express.Router();
api.post('/registrar', UserController.registrar)
api.post('/login', UserController.login)

module.exports = api;