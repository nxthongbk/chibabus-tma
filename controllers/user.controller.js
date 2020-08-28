const User = require('../db/models/user');
const bcrypt = require('bcryptjs');
module.exports = {
    createUser : (req, res) =>{
        const {email, password} = req.body;
        if(!email || !password) return res.sendStatus(400)
        User.create(req.body).then(result=>{
            res.status(200).send({
                status: "ok"
            })
        }).catch(err=>{
            console.log(err)
            res.status(400).send({
                status:"fail"
            })
        })
    },
    login: async (req, res) =>{
        const { email, password } = req.body;
        console.log(req.body)
        if(!email || !password) return res.status(400).send({
            'error':"require email and password"
        })
        const user = await User.findByCredentials(email, password)
        if (!user) {
            return res.status(401).send({ error: 'Login failed! Check authentication credentials' });
        }
        const token = await user.generateAuthToken();
        res.status(200).send({ auth: true, token: token });
    },
    deleteUser : (req, res) =>{
        const { user_id } = req.body;
        if(!user_id) return res.sendStatus(400)
        User.findByIdAndDelete(user_id)
            .then(()=> res.sendStatus(200))
            .catch(err=>{
                res.sendStatus(401);
                throw new Error(err);
            })
    },
    getUsers:(req, res) =>{
        User.find({})
            .then((users)=> res.status(200).json(users))
            .catch(err=>{
                res.sendStatus(400);
                throw new Error(err);
            })
    },
    getUser:(req, res) =>{
        User.findById(req.params.id)
            .then((users)=> res.status(200).json(users))
            .catch(err=>{
                res.sendStatus(400);
                throw new Error(err);
            })
    },
    updateUser :async (req, res) =>{
        let data = {...req.body};
        if(data.email) delete data["email"];
        if(data._id) delete data["_id"];
        if(data.password) data.password = await bcrypt.hash(data.password,8);
        await User.findById(req.params.id)
        .then(user=>{
            data.email = user.email;
        }).catch(err=>{
            res.sendStatus(400);
            throw new Error(err);
        })
        User.findByIdAndUpdate(req.params.id, data)
        .then(()=>res.sendStatus(200))
        .catch(err=>{
            res.sendStatus(400);
            throw new Error(err);
        })
    
    }
}