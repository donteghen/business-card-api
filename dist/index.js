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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const dbconfig_1 = require("./config/dbconfig");
// declering and initialing various servers
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer);
dotenv_1.default.config();
(0, dbconfig_1.connectDb)();
// routes imports
const delivery_1 = require("./routes/delivery");
const package_1 = require("./routes/package");
const delivery_2 = require("./models/delivery");
//  initial app variables and instances
const port = process.env.PORT || 8080;
// define the express app middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(delivery_1.DeliveryRouter);
app.use(package_1.PackageRouter);
app.get('/api/', (req, res) => {
    res.send('welcome to the api');
});
app.get("*", (req, res) => {
    res.redirect('/api/');
});
// socket events
io.on('connection', (socket) => {
    socket.emit('PING', 'PONG');
    // location changed listener
    socket.on('LOCATION_CHANGED', (data) => __awaiter(void 0, void 0, void 0, function* () {
        const delivery = yield delivery_2.Delivery.findOneAndUpdate({ _id: data.deliveryId }, { $set: { lat: data.location.lat, log: data.location.log } }, { new: true });
        // console.log('the delivery  for location change is: ', delivery)
        const payload = {
            event: 'DELIVERY_UPDATE',
            delivery
        };
        socket.broadcast.emit('DELIVERY_UPDATE', payload);
        // console.log('location updated with no issues')
    }));
    // status changed listener
    socket.on('STATUS_CHANGED', (data) => __awaiter(void 0, void 0, void 0, function* () {
        const delivery = yield delivery_2.Delivery.findOneAndUpdate({ _id: data.deliveryId }, { $set: { status: data.status } }, { new: true });
        // console.log('the delivery for status change is: ', delivery)
        const payload = {
            event: 'DELIVERY_UPDATE',
            delivery
        };
        socket.broadcast.emit('DELIVERY_UPDATE', payload);
        // console.log('status updated with no issues')
    }));
    socket.on('disconnect', () => {
        console.log('Connection Disconnected');
    });
});
// start the httpserver server
httpServer.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map