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

    static createThought(req, res){
        res.render('thoughts/create')
    }

    static createThoughtSave(req, res){ //método que salva no banco de dados
        const thought = {
            title: req.body.title,
            UserId: req.session.userid
        }

        Thought.create(thought)
        .then(() => {
            req.flash('message', 'Pensamento foi criado com sucesso.') //flash acessa a memória RAM
            req. session.save(() => {
                res.redirect('/thoughts/dashboard')
            })
        })
        .catch((err) => console.log(err))
    }

    static removeThought(req, res){
        const id = req.body.id

        Thought.destroy({where: {id:id}})
        .then(() => {
            req.flash('message', 'Pensamento excluído com sucesso.')
            req.session.save(() => {
                res.redirect('/thoughts/dashboard')
            })
        })
        .cath((err) => console.log(err))
    }

    static updateThought(req, res){
        const id = req.params.id

        Thought.findOne({ where: {id:id}, raw: true})
        .then((thought) => {
            res.render('thoughts/edit', {thought})
        })
        .catch((err) => console.log(err))
    }
}