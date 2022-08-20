"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryRouter = void 0;
const express_1 = __importDefault(require("express"));
const package_1 = require("../models/package");
const delivery_1 = require("../models/delivery");
const DeliveryRouter = express_1.default.Router();
exports.DeliveryRouter = DeliveryRouter;
// get all deliveries
DeliveryRouter.get('/api/delivery', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deliveries = yield delivery_1.Delivery.find();
        if (!deliveries || deliveries.length < 1) {
            throw new Error('No deliveries found');
        }
        res.send({ ok: true, data: deliveries });
    }
    catch (error) {
        res.status(400).send({ ok: false, error: error === null || error === void 0 ? void 0 : error.message });
    }
}));
// get a single delivery by id
DeliveryRouter.get('/api/delivery/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const delivery = yield delivery_1.Delivery.findById(req.params.id);
        if (!delivery) {
            throw new Error('The requested delivery not found');
        }
        res.send({ ok: true, data: delivery });
    }
    catch (error) {
        res.status(400).send({ ok: false, error: error === null || error === void 0 ? void 0 : error.message });
    }
}));
// Create a new delivery
DeliveryRouter.post('/api/delivery', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { package_id, pickup_time, start_time, end_time, location, status } = req.body;
        const newDelivery = new delivery_1.Delivery({
            package_id,
            pickup_time,
            start_time,
            end_time,
            location,
            status,
        });
        const delivery = yield newDelivery.save();
        if (!delivery) {
            throw new Error('Delivery save operation failed!');
        }
        const relatedPackage = yield package_1.Package.findById(delivery.package_id);
        relatedPackage.active_delivery_id = delivery._id;
        yield relatedPackage.save();
        res.status(201).send({ ok: true });
    }
    catch (error) {
        if (error.name === 'ValidationError') {
            const newError = {
                name: 'DELIVERY_ENTRY_VALIDATION_ERROR',
                message: error.message
            };
            res.status(400).send({ ok: false, error: newError.message });
            return;
        }
        res.status(400).send({ ok: false, error: error === null || error === void 0 ? void 0 : error.message });
    }
}));
// Update a delivery
DeliveryRouter.patch('/api/delivery/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const delivery = yield delivery_1.Delivery.findById(req.params.id);
        if (!delivery) {
            throw new Error('The requested delivery not found!');
        }
        const entries = Object.keys(req.body);
        const updates = {};
        for (let i = 0; i < entries.length; i++) {
            updates[entries[i]] = Object.values(req.body)[i];
        }
        const updatedDelivery = yield delivery_1.Delivery.findOneAndUpdate({ _id: req.params.id }, { $set: updates }, { new: true });
        if (!updatedDelivery) {
            throw new Error('Delivery modification operation failed!');
        }
        res.send({ ok: true, data: updatedDelivery });
    }
    catch (error) {
        if (error.name === 'ValidationError') {
            const newError = {
                name: 'DELIVERY_UPDATE_ENTRY_VALIDATION_ERROR',
                message: error.message
            };
            res.status(400).send({ ok: false, error: newError.message });
            return;
        }
        res.status(400).send({ ok: false, error: error === null || error === void 0 ? void 0 : error.message });
    }
}));
// delete a package
DeliveryRouter.delete('/api/delivery/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletePackage = yield delivery_1.Delivery.findByIdAndDelete(req.params.id);
        res.send({ ok: true });
    }
    catch (error) {
        res.status(400).send({ ok: false, error: error === null || error === void 0 ? void 0 : error.message });
    }
}));
//# sourceMappingURL=delivery.js.map