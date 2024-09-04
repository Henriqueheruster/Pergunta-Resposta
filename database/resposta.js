const sequelize = require('sequelize')
const connection = require('./database')

const resposta = connection.define('resposta',{
    corpo:{
        type: sequelize.TEXT,
        allowNull: false
        //primaryKey: true,
        //autoIncrement: true
    },
    perguntaId:{
        type:sequelize.INTEGER,
        allowNull: false
    }
})

resposta.sync({force:false}).then(()=>{
    console.log("Tabela de resposta criada!")
})

module.exports = resposta