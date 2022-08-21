import express, {Request, Response} from 'express'
import { Package } from '../models/package'
import { Delivery } from '../models/delivery'
import { IError } from '../models/interfaces'

const DeliveryRouter = express.Router()


// get all deliveries
DeliveryRouter.get('/api/delivery', async (req : Request, res : Response) => {
    try {
        const deliveries = await Delivery.find()
        if (!deliveries || deliveries.length < 1) {
            throw new Error('No deliveries found')
        }
        res.send({ok : true, data : deliveries})
    } catch (error) {
        res.status(400).send({ok : false, error : error?.message})
    }
})

// get a single delivery by id
DeliveryRouter.get('/api/delivery/:id', async (req : Request, res : Response) => {
    try {
        const delivery = await Delivery.findById(req.params.id)
        if (!delivery) {
            throw new Error('The requested delivery not found')
        }
        res.send({ok : true, data : delivery})
    } catch (error) {
        res.status(400).send({ok : false, error : error?.message})
    }
})

// Create a new delivery
DeliveryRouter.post('/api/delivery', async (req : Request, res : Response) => {
    try {
        const {package_id, pickup_time, start_time, end_time, location} = req.body
        const newDelivery = new Delivery ({
            package_id,
            pickup_time,
            start_time,
            end_time,
            location,
        })
        const delivery = await newDelivery.save()
        if (!delivery) {
            throw new Error('Delivery save operation failed!')
        }
        const relatedPackage = await Package.findById(delivery.package_id)
        relatedPackage.active_delivery_id = delivery._id
        await relatedPackage.save()

        res.status(201).send({ok : true})
    } catch (error) {
        if (error.name === 'ValidationError') {
            const newError : IError = {
                name: 'DELIVERY_ENTRY_VALIDATION_ERROR',
                message: error.message
            }
            res.status(400).send({ok: false, error: newError.message})
            return
        }
        res.status(400).send({ok : false, error : error?.message})
    }
})

// Update a delivery
DeliveryRouter.patch('/api/delivery/:id', async (req : Request, res : Response) => {
    try {
        const delivery = await Delivery.findById(req.params.id)
        if (!delivery) {
            throw new Error('The requested delivery not found!')
        }

        const entries = Object.keys(req.body)
        const updates : {[key: string]: any} = {}
        for (let i = 0; i < entries.length; i++) {
            updates[entries[i]] = Object.values(req.body)[i]
        }

        const updatedDelivery = await Delivery.findOneAndUpdate({_id:req.params.id}, {$set: updates}, {new:true})
        if (!updatedDelivery) {
            throw new Error('Delivery modification operation failed!')
        }
        res.send({ok : true, data : updatedDelivery})
    } catch (error) {
        if (error.name === 'ValidationError') {
            const newError : IError = {
                name: 'DELIVERY_UPDATE_ENTRY_VALIDATION_ERROR',
                message: error.message
            }
            res.status(400).send({ok: false, error: newError.message})
            return
        }
        res.status(400).send({ok : false, error : error?.message})
    }
})

// delete a package
DeliveryRouter.delete('/api/delivery/:id', async (req : Request, res : Response) => {
    try {
        const deletePackage = await Delivery.findByIdAndDelete(req.params.id)
        res.send({ok : true})
    } catch (error) {
        res.status(400).send({ok : false, error : error?.message})
    }
})

export {
    DeliveryRouter
}