import { Document, PopulatedDoc, Types } from "mongoose"

export type Location = {
    lat: number,
    log: number
}

export enum Status {
    OPEN = 'OPEN',
    PICKED_UP = 'PICKED_UP',
    IN_TRANSIT = 'IN_TRANSIT',
    DELIVERED = 'DELIVERED',
    FAILED = 'FAILED'
}

export interface IError {
    name : string,
    message : string
}

export interface DeliveryDocument extends Document{
    package_id : Types.ObjectId,
    pickup_time : number,
    start_time : number,
    end_time : number,
    location : Location,
    status : Status
}

export interface PackageDocument extends Document {
    active_delivery_id? : Types.ObjectId,
    description : string,
    weight : number,
    width : number,
    height : number,
    depth : number,
    from_name : string,
    from_address : string,
    from_location : Location,
    to_name : string,
    to_address : string,
    to_location : Location
}

// interface ServerToClientEvents {
//     noArg: () => void;
//     basicEmit: (a: number, b: string, c: Buffer) => void;
//     withAck: (d: string, callback: (e: number) => void) => void;
//   }

//   interface ClientToServerEvents {
//     hello: () => void;
//   }

//   interface InterServerEvents {
//     ping: () => void;
//   }

  export interface BasePayload {
    event : string
  }
  export interface LocationChangedPayload extends BasePayload{
    deliveryId : string,
    location : Location
  }
  export interface StatusChangedPayload extends BasePayload{
    deliveryId : string,
    status : Status
  }
  export interface DeliveryUpdatedPayload extends BasePayload{
    delivery : DeliveryDocument
  }