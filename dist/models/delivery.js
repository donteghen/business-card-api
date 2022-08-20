"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Delivery = void 0;
const mongoose_1 = require("mongoose");
const DeliverySchema = new mongoose_1.Schema({
    package_id: {
        type: mongoose_1.SchemaTypes.ObjectId,
        required: true
    },
    pickup_time: {
        type: Number,
    },
    start_time: {
        type: Number,
    },
    end_time: {
        type: Number,
    },
    location: {
        lat: {
            type: Number,
            required: true
        },
        log: {
            type: Number,
            required: true
        },
    },
    status: {
        type: String,
        required: true,
        enum: ['OPEN', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'FAILED']
    }
});
const Delivery = (0, mongoose_1.model)('Delivery', DeliverySchema);
exports.Delivery = Delivery;
//# sourceMappingURL=delivery.js.map