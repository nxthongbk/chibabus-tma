const Blueprint = require("../db/models/blueprint")
module.exports ={
    getBlueprints : (req, res) => {
        Blueprint.find({})
            .then((blueprints)=> res.json(blueprints))
            .catch(err=>{
                res.sendStatus(400);
                throw new Error(err)
            })
    },
    getBlueprint : (req, res) => {
        Blueprint.findById(req.params.id)
            .then((blueprint)=> res.json(blueprint))
            .catch(err=>{
                res.sendStatus(400);
                throw new Error(err)
            })
    },
    getBlueprintBasedOnUser : (req, res) => {
        Blueprint.find({user_id: req.params.id})
            .then((blueprints)=> res.json(blueprints))
            .catch(err=>{
                res.sendStatus(400);
                throw new Error(err)
            })
    },
    createBlueprint : (req, res) => {
        const {name, data} = req.body
        if(!name || !data || !data.media || !data.redirect_link || !data.restricted_domain 
            || !data.restricted_service || typeof(data.max_clients)==="undefined" || 
            typeof(data.session_timeout)==="undefined" ||  typeof(data.auth_idle_timeout)==="undefined")
        return res.sendStatus(400);
        let blueprint = {...req.body};
        blueprint.user_id = req.user.id;

        Blueprint.create(blueprint)
            .then(()=> res.sendStatus(200))
            .catch(err=>{
                res.sendStatus(400);
                throw new Error(err)
            })
    },
    updateBlueprint : (req, res) =>{
        Blueprint.findOneAndUpdate({_id: req.params.id}, req.body)
        .then(()=>res.sendStatus(200))
        .catch(err=>{
            res.sendStatus(400);
            throw new Error(err)
        })
    },
    deleteBlueprint : (req, res) =>{
        const {id} = req.body;
        if(!id) return res.sendStatus(400);
        
        Blueprint.findByIdAndDelete(id).then(()=> res.sendStatus(200))
        .catch(err=>{
            res.sendStatus(400);
            throw new Error(err);
        })
    }
}