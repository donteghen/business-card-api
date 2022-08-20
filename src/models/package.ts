import { model, Schema, SchemaTypes } from "mongoose";
import { PackageDocument} from './interfaces'

const PackageSchema = new Schema({

    active_delivery_id : {
        type : SchemaTypes.ObjectId,
    },
    description : {
        type : String,
        required : true
    },
    weight : {
        type : Number,
        required : true
    },
    width : {
        type : Number,
        required : true
    },
    height : {
        type : Number,
        required : true
    },
    depth : {
        type : Number,
        required : true
    },
    from_name : {
        type : String,
        required : true
    },
    from_address : {
        type : String,
        required : true
    },
    from_location : {
        lat : {
            type : Number,
            required : true
        },
        log : {
            type : Number,
            required : true
        }
    },
    to_name : {
        type : String,
        required : true
    },
    to_address : {
        type : String,
        required : true
    },
    to_location : {
        lat : {
            type : Number,
            required : true
        },
        log : {
            type : Number,
            required : true
        }
    }
})

const Package = model<PackageDocument>('Package', PackageSchema)

export { Package }