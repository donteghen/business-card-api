import express from "express";
import path from "path";
import dotenv from 'dotenv'
import cors from 'cors'
import {createServer} from 'http'
import {Server} from 'socket.io'

import { connectDb } from "./config/dbconfig";

// declering and initialing various servers
const app = express();
const httpServer = createServer(app)
const io = new Server(httpServer)

dotenv.config()
connectDb()

// routes imports
import { DeliveryRouter } from "./routes/delivery";
import { PackageRouter } from "./routes/package";

// model imports
import { DeliveryUpdatedPayload, Location, LocationChangedPayload, StatusChangedPayload } from "./models/interfaces";
import { Delivery } from "./models/delivery";

//  initial app variables and instances
const port = process.env.PORT || 8080;


// define the express app middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use(DeliveryRouter)
app.use(PackageRouter)


app.get('/api/', (req, res) => {
    res.send('welcome to the api')
})
app.get("*", (req, res) => {
   res.redirect('/api/')
});

// socket events
io.on('connection', (socket) => {

    socket.emit('PING', 'PONG')

    // location changed listener
    socket.on('LOCATION_CHANGED', async (data : LocationChangedPayload) => {
        const delivery = await Delivery.findOneAndUpdate(
            {_id : data.deliveryId},
            {$set : {lat : data.location.lat, log : data.location.log}},
            {new : true}
        )
        // console.log('the delivery  for location change is: ', delivery)
        const payload : DeliveryUpdatedPayload = {
            event : 'DELIVERY_UPDATE',
            delivery
        }
        socket.broadcast.emit('DELIVERY_UPDATE', payload )
        // console.log('location updated with no issues')
    })

    // status changed listener
    socket.on('STATUS_CHANGED', async (data : StatusChangedPayload) => {
        const delivery = await Delivery.findOneAndUpdate(
            {_id : data.deliveryId},
            {$set : {status : data.status}},
            {new : true}
        )
        // console.log('the delivery for status change is: ', delivery)
        const payload : DeliveryUpdatedPayload = {
            event : 'DELIVERY_UPDATE',
            delivery
        }
        socket.broadcast.emit('DELIVERY_UPDATE', payload)
        // console.log('status updated with no issues')
    })
    socket.on('disconnect', () => {
        console.log('Connection Disconnected')
    })
})

// start the httpserver server
httpServer.listen( port, () => {
    // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ port }` );
} );