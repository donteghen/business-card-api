import { model, Schema , SchemaTypes} from "mongoose";
import { DeliveryDocument} from './interfaces'

const DeliverySchema = new Schema({
    package_id : {
        type : SchemaTypes.ObjectId,
        required : true
    },
    pickup_time : {
        type : Number,
        required : true
    },
    start_time : {
        type : Number,
        required : true
    },
    end_time : {
        type : Number,
        required : true
    },
    location : {
        lat : {
            type : Number,
            required : true
        },
        log : {
            type : Number,
            required : true
        },
    },
    status : {
        type: String,
        required : true,
        enum:['OPEN','PICKED_UP','IN_TRANSIT','DELIVERED','FAILED'],
        default:'OPEN'
    }
})

const Delivery = model<DeliveryDocument>('Delivery', DeliverySchema)

export { Delivery }