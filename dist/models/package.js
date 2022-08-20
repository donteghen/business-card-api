"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Package = void 0;
const mongoose_1 = require("mongoose");
const PackageSchema = new mongoose_1.Schema({
    active_delivery_id: {
        type: mongoose_1.SchemaTypes.ObjectId,
    },
    description: {
        type: String,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    width: {
        type: Number,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    depth: {
        type: Number,
        required: true
    },
    from_name: {
        type: String,
        required: true
    },
    from_address: {
        type: String,
        required: true
    },
    from_location: {
        lat: {
            type: Number,
            required: true
        },
        log: {
            type: Number,
            required: true
        }
    },
    to_name: {
        type: String,
        required: true
    },
    to_address: {
        type: String,
        required: true
    },
    to_location: {
        lat: {
            type: Number,
            required: true
        },
        log: {
            type: Number,
            required: true
        }
    }
});
const Package = (0, mongoose_1.model)('Package', PackageSchema);
exports.Package = Package;
//# sourceMappingURL=package.js.map