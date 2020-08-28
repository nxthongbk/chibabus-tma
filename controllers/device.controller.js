const Device = require('../db/models/device');
module.exports = {
    createDevice : (req, res) => {
        console.log('create device', req.body)
        const { license_plate, driver, line } = req.body;
        if(!license_plate || !driver || !line) return res.sendStatus(400);
        Device.create(req.body).then(() =>{
            res.status(200).send({status:"ok"})
        }).catch(err=>{
            console.log(err);
            res.status(400).send({status:"fail"})
        })
    },
    getDevices : (req, res) =>{
        Device.find({})
        .populate('blueprint_id')
        .then(devices=>{
            res.status(200).json(devices)
        }).catch(err =>{
            console.log(err);
            res.sendStatus(400)
        })
    },
    getDevice : (req, res) =>{
        Device.findById(req.params.id)
        .populate('blueprint_id')
        .then(device=>{
            res.status(200).json(device)
        }).catch(err =>{
            console.log(err);
            res.sendStatus(400)
        })
    },
    updateDevice : (req, res) =>{
        Device.findOneAndUpdate({_id: req.params.id},req.body).then(()=>{
            res.sendStatus(200)
        }).catch(err=>{
            console.log(err);
            res.sendStatus(400)
        })
    },
    deleteDevice : (req, res) =>{
        const {id} = req.body;
        if(!id) return res.sendStatus(400);
        
        Device.findByIdAndDelete(id).then(()=> res.sendStatus(200))
        .catch(err=>{
            res.sendStatus(400);
            throw new Error(err);
        })
    },
    test :async (req, res) =>{
        Device.aggregate([
            { $project: { license_plate:1, driver:1 } },
            { $group :  {_id : "$driver", count:{$sum:1}} }
        ]).then(aggregate=>{
            res.send(aggregate)
        });
    }
}