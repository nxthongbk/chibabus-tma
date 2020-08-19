const BusCounter = require("../db/models/bus_counter");
module.exports = {
	createBusCounter: (req, res) => {
        const { state, image, lat, long, age, gender, device_id } = req.body;

        if(!state || !image || typeof(lat) ==="undefined" 
        || typeof(long) ==="undefined"  || typeof(age)==="undefined" || gender ==="undefined" || !device_id)
        return res.sendStatus(400)

		BusCounter.create({ state, image, lat, long, age, gender, device_id })
			.then(() => res.sendStatus(200))
			.catch((err) => {
                res.sendStatus(400);
                throw new Error(err)
			});
    },
    getBusCounters : (req, res) => {
        BusCounter.find({})
            .populate("device_id")
            .then(buscounters=>{
                res.status(200).json(buscounters)
            }).catch(err =>{
                console.log(err);
                res.sendStatus(400)
            })
    },
    getBusCounter : (req, res) => {
        BusCounter.findById(req.params.id)
            .populate("device_id")
            .then(buscounters=>{
                res.status(200).json(buscounters)
            }).catch(err =>{
                console.log(err);
                res.sendStatus(400)
            })
    },
    getBusCounterBasedDevice : (req, res) => {
        BusCounter.find({device_id: req.params.id})
            .populate("device_id")
            .then(buscounters=>{
                res.status(200).json(buscounters)
            }).catch(err =>{
                res.sendStatus(400)
                throw new Error(err)
            })
    },
    updateBusCounter : (req, res) =>{
        BusCounter.findOneAndUpdate({_id: req.params.id}, req.body)
        .then(()=>res.sendStatus(200))
        .catch(err=>{
            res.sendStatus(400);
            throw new Error(err)
        })
    },
    deleteBusCounter  : (req, res) =>{
        const {id} = req.body;
        if(!id) return res.sendStatus(400);
        
        BusCounter.findByIdAndDelete(id).then(()=> res.sendStatus(200))
        .catch(err=>{
            res.sendStatus(400);
            throw new Error(err);
        })
    }
};
