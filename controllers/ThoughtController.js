const Thought = require('../models/Thought')
const User = require('../models/User')

const { Op } = require('sequelize')

module.exports = class ThoughtController{
    static async dashboard(req, res){
        const userId = req.session.userid //faz a requisição

        const user = await User.findOne({ //faz o select dentro do banco de dados
            where:{
                id:userId,
            },
            include: Thought, //pega todos os pensamentos se o ususario existir
            plain: true, 
        })

        const thoughts = user.Thought.map((result) => result.dataValues) //mapeamento

        let emptyThoughts = true //variavel booleana para ver se os pensamentos estão vazios ou não

        if(thoughts.lenght > 0){
            emptyThoughts = false
        }

        console.log(thoughts) // lista de pensamentos
        console.log(emptyThoughts) //estado da booleana

        res.render('thoughts/dashboard', {thoughts, emptyThoughts}) //renderiza
    }

    static showThougths(req, res){ //joga a informação para esse método
        console.log(req.query)

        let search = ''

        if(req.query.search){
            search = req.query.search
        }

        let order = 'DESC'

        if (req.query.order === 'old'){
            order = 'ASC'
        }else{
            order
        }
        console.log(order)
        Thought.findAll({
            include: User,
            where: {
                title:{[Op.like]:`%${search}%`},
            },
            order:[['createdAt', order]]
        }).then((data) =>{
            let thoughtsQty = data.length

            if(thoughtsQty === 0){ // compara todos os atributos
                thoughtsQty = false
            }

            const thoughts = data.map((result) => result.get({plain: true}))

            res.render('thoughts/home', {thoughts,thoughtsQty,search})
        }).catch((err) => console.error(err))
    }
}