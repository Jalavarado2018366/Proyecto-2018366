'use strict'
//EXPORTACIONES
var bcrypt = require('bcrypt-nodejs')
var User = require('../model/user')
var jwt = require("../services/jwt")
var path = require('path');
var fs = require("fs");

function registrar(req, res){
    var user = new User();
    var params = req.body
   

    if(params.nombre && params.password && params.email){
        user.nombre = params.nombre; 
        user.usuario = params.usuario;
        user.email = params.email;
        user.rol = 'ROLE_USUARIO';
        user.image =  null;

        User.find({ $or: [           
             {usuario: user.usuario},
             {email: user.email}
            ]}).exec((err, users) =>{
                if(err) return res.status(500).send({message: 'Error en la peticion de usuario'})
                if(users && users.length >= 1){
                    return res.status(500).send({message: 'el usuario ya existe'})
                }else{
                    bcrypt.hash(params.password, null, null,(err, hash)=>{
                        user.password = hash;

                        user.save((err, usuarioGuardado) =>{
                            if(err) return res.status(500).send({message: 'Error al guardar el usuario'})
                            if(usuarioGuardado){
                                res.status(200).send({user: usuarioGuardado})
                            }else{
                                res.status(404).send({message: 'no se a podido registrar el usuario'})
                            }
                        })
                    })
                }
            })
    }else{
        res.status(200).send({
            message: 'Rellene los datos necesarios'
        })
    }
}
function login(req, res){
    var params = req.body

    User.findOne({ email: params.email }, (err, usuario)=>{
        if(err) return res.status(500).send({message : 'Error en la peticion'})
        if (usuario){
            bcrypt.compare(params.password, usuario.password, (err, check)=>{
                if(check){
                    if(params.getToken){
                        return res.status(200).send({
                            token: jwt.createToken(usuario)
                        })
                    }else{
                        usuario.password = undefined;
                        return res.status(200).send({ user: usuario})
                    }
                }else{
                    return res.status(404).send({message : 'el Usuario no se puede identificar'})
                }
            })
        }else{
            return res.status(404).send({ message: 'el usuario no se a podido logear'})
        }
    })
} 

module.exports = {
    registrar,
    login
}