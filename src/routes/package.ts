import express, {Request, Response} from 'express'
import { Package } from '../models/package'
import { IError } from '../models/interfaces'
import { Delivery } from '../models/delivery'


const PackageRouter = express.Router()


// get all packages
PackageRouter.get('/api/package', async (req : Request, res : Response) => {
    try {
        const packages = await Package.find()
        if (!packages || packages.length < 1) {
            throw new Error('No Packages found')
        }
        res.send({ok : true, data : packages})
    } catch (error) {
        console.log(error)
        res.status(400).send({ok : false, error : error?.message})
    }
})

// get a single package by id
PackageRouter.get('/api/package/:id', async (req : Request, res : Response) => {
    try {
        const _package = await Package.findById(req.params.id)
        if (!_package) {
            throw new Error('The requested package not found')
        }
        res.send({ok : true, data : _package})
    } catch (error) {
        res.status(400).send({ok : false, error : error?.message})
    }
})

// Create a new package
PackageRouter.post('/api/package', async (req : Request, res : Response) => {
    try {
        const {active_delivery_id, description, weight, width, height, depth, from_name, from_address, from_location, to_name, to_address, to_location} = req.body
        const newPackage = new Package ({
            active_delivery_id,
            description,
            weight,
            width,
            height,
            depth,
            from_name,
            from_address,
            from_location,
            to_name,
            to_address,
            to_location
        })
        const _package = await newPackage.save()
        if (!_package) {
            throw new Error('Package save operation failed!')
        }
        res.status(201).send({ok : true})
    } catch (error) {
        if (error.name === 'ValidationError') {
            const newError : IError = {
                name: 'PACKAGE_ENTRY_VALIDATION_ERROR',
                message: error.message
            }
            res.status(400).send({ok: false, error: newError.message})
            return
        }
        res.status(400).send({ok : false, error : error?.message})
    }
})

// Update a package
PackageRouter.patch('/api/package/:id', async (req : Request, res : Response) => {
    try {
        const _package = await Package.findById(req.params.id)
        if (!_package) {
            throw new Error('The requested package not found!')
        }

        const entries = Object.keys(req.body)
        const updates : {[key: string]: any} = {}
        for (let i = 0; i < entries.length; i++) {
            updates[entries[i]] = Object.values(req.body)[i]
        }

        const updatedPackage = await Package.findOneAndUpdate({_id:req.params.id}, {$set: updates}, {new:true})
        if (!updatedPackage) {
            throw new Error('Package modification operation failed!')
        }
        res.send({ok : true, data : updatedPackage})
    } catch (error) {
        if (error.name === 'ValidationError') {
            const newError : IError = {
                name: 'PACKAGE_UPDATE_ENTRY_VALIDATION_ERROR',
                message: error.message
            }
            res.status(400).send({ok: false, error: newError.message})
            return
        }
        res.status(400).send({ok : false, error : error?.message})
    }
})

// delete a package
PackageRouter.delete('/api/package/:id', async (req : Request, res : Response) => {
    try {
        const deletedPackage = await Package.findByIdAndDelete(req.params.id)
        const linkedDelivery = await Delivery.findById(deletedPackage.active_delivery_id)
        if (linkedDelivery) {
            await Delivery.deleteOne({_id : linkedDelivery._id})
        }
        res.send({ok : true})
    } catch (error) {
        res.status(400).send({ok : false, error : error?.message})
    }
})

export {
    PackageRouter
}