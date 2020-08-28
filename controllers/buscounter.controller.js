const BusCounter = require("../db/models/bus_counter");

module.exports = {
	createBusCounter: (req, res) => {
            const { state, lat, long, age, gender, device_id } = req.body;
            if(!state || typeof(lat) ==="undefined" 
            || typeof(long) ==="undefined"  || typeof(age)==="undefined" 
            || gender ==="undefined" || !device_id)
            return res.sendStatus(400)
            BusCounter.create({ state, image : req.file ? req.file.originalname : "unknow_image", lat, long, age, gender, device_id })
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
    },

    getCustomerOnDay : (req, res) =>{
        BusCounter.aggregate([
            {
                $project: {
                    state:1,
                    timestamp:{
                        $dateToString:{format:"%Y-%m-%d", date: "$timestamp"}
                    }
                }
            },
            {$group : {_id:"$timestamp" ,count:{$sum:1}}}
        ])
        .sort({_id:1})
        .limit(7)
        .then(data=>res.send(data))
        .catch(err=>res.send(err))
    },
    
    getCustomerOnMonth : (req, res) =>{
        BusCounter.aggregate([
            {
                $project: {
                    state:1,
                    timestamp:{
                        $dateToString:{format:"%Y-%m", date: "$timestamp"}
                    }
                }
            },
            {$group : {_id:"$timestamp" ,count:{$sum:1}}}
        ])
        .sort({_id:1})
        .limit(7)
        .then(data=>res.send(data))
        .catch(err=>res.send(err))
    },

    getBusCounterBasedMonth : async (req, res) =>{
        let year = req.params.month.split("-")[0];
        let month = req.params.month.split("-")[1];
        let data = await BusCounter.aggregate([
            {
                $project: {
                    state: 1,
                    image:1,
                    lat:1,
                    long:1,
                    age:1,
                    gender:1,
                    device_id:1, 
                    timestamp:1,
                    month: {$month: '$timestamp'},
                    year: {$year: '$timestamp'}
                }
            },
            { $match:{month:parseInt(month), year:parseInt(year)} }
        ]);
        res.json(data)
    },

    getBusCounterBasedDate : async (req, res) =>{
        let date = req.params.date;
        let data = await BusCounter.aggregate([
            {
                $project: {
                    state: 1,
                    image:1,
                    lat:1,
                    long:1,
                    age:1,
                    gender:1,
                    device_id:1, 
                    timestamp:1,
                    date: {$dateToString: {format:"%Y-%m-%d" ,date:'$timestamp'}},
                }
            },
            {$match : {date}}
        ])
        res.json(data)
    },

};
