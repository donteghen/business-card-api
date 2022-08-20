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
exports.PackageRouter = void 0;
const express_1 = __importDefault(require("express"));
const package_1 = require("../models/package");
const delivery_1 = require("../models/delivery");
const PackageRouter = express_1.default.Router();
exports.PackageRouter = PackageRouter;
// get all packages
PackageRouter.get('/api/package', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const packages = yield package_1.Package.find();
        if (!packages || packages.length < 1) {
            throw new Error('No Packages found');
        }
        res.send({ ok: true, data: packages });
    }
    catch (error) {
        console.log(error);
        res.status(400).send({ ok: false, error: error === null || error === void 0 ? void 0 : error.message });
    }
}));
// get a single package by id
PackageRouter.get('/api/package/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _package = yield package_1.Package.findById(req.params.id);
        if (!_package) {
            throw new Error('The requested package not found');
        }
        res.send({ ok: true, data: _package });
    }
    catch (error) {
        res.status(400).send({ ok: false, error: error === null || error === void 0 ? void 0 : error.message });
    }
}));
// Create a new package
PackageRouter.post('/api/package', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { active_delivery_id, description, weight, width, height, depth, from_name, from_address, from_location, to_name, to_address, to_location } = req.body;
        const newPackage = new package_1.Package({
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
        });
        const _package = yield newPackage.save();
        if (!_package) {
            throw new Error('Package save operation failed!');
        }
        res.status(201).send({ ok: true });
    }
    catch (error) {
        if (error.name === 'ValidationError') {
            const newError = {
                name: 'PACKAGE_ENTRY_VALIDATION_ERROR',
                message: error.message
            };
            res.status(400).send({ ok: false, error: newError.message });
            return;
        }
        res.status(400).send({ ok: false, error: error === null || error === void 0 ? void 0 : error.message });
    }
}));
// Update a package
PackageRouter.patch('/api/package/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _package = yield package_1.Package.findById(req.params.id);
        if (!_package) {
            throw new Error('The requested package not found!');
        }
        const entries = Object.keys(req.body);
        const updates = {};
        for (let i = 0; i < entries.length; i++) {
            updates[entries[i]] = Object.values(req.body)[i];
        }
        const updatedPackage = yield package_1.Package.findOneAndUpdate({ _id: req.params.id }, { $set: updates }, { new: true });
        if (!updatedPackage) {
            throw new Error('Package modification operation failed!');
        }
        res.send({ ok: true, data: updatedPackage });
    }
    catch (error) {
        if (error.name === 'ValidationError') {
            const newError = {
                name: 'PACKAGE_UPDATE_ENTRY_VALIDATION_ERROR',
                message: error.message
            };
            res.status(400).send({ ok: false, error: newError.message });
            return;
        }
        res.status(400).send({ ok: false, error: error === null || error === void 0 ? void 0 : error.message });
    }
}));
// delete a package
PackageRouter.delete('/api/package/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedPackage = yield package_1.Package.findByIdAndDelete(req.params.id);
        const linkedDelivery = yield delivery_1.Delivery.findById(deletedPackage.active_delivery_id);
        if (linkedDelivery) {
            yield delivery_1.Delivery.deleteOne({ _id: linkedDelivery._id });
        }
        res.send({ ok: true });
    }
    catch (error) {
        res.status(400).send({ ok: false, error: error === null || error === void 0 ? void 0 : error.message });
    }
}));
//# sourceMappingURL=package.js.map