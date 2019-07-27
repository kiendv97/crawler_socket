const http = require('http');
const bodyParser = require('body-parser');
const createError = require('http-errors');
var express = require('express');
const app = express();
const httpServer = http.createServer(app)

const ioServer = require('socket.io')(httpServer);
const sendDing = require('./utils/Send_ding');
const convert_content = require('./utils/Convert_content');
const ISDNModel = require('./model/model');
httpServer.listen(3000, () => {
    console.log('Server is listening on port 3000');
})
require('./connect_mongo'); // connect mongoose
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();

});

app.post('/setinfo', async function (req, res, next) {
    try {
        const paramsQuery = Object.assign({}, req.body);
        const ISDN = await ISDNModel.findOneAndUpdate({ keyword: paramsQuery.keyword }, { $set: { status: 1, reponsedAt: Date.now(), content: paramsQuery.content } });
        if (ISDN !== null) {
            const finalContent = await convert_content(paramsQuery.content)
            await sendDing(finalContent);
            res.status(200).send({
                status: 1,
                result: ISDN.content
            })
        } else {
            res.status(200).send({
                status: 0,
                result: 'not existed'
            })
        }
    } catch (error) {
        console.log(error);

        res.status(500).send({
            status: 0,
            result: error
        })
    }
});
app.get('/check', async (req, res, next) => {
    const paramsQuery = Object.assign({}, req.query);
    ioServer.emit('send_data', paramsQuery);
    try {
        const newISDN = {
            telco: paramsQuery.telco || 'mobi',
            keyword: paramsQuery.keyword || 0,
            user: paramsQuery.user || 'admin',
            status: 0, //pending

        }
        const response = await ISDNModel.findOne({ keyword: newISDN.keyword });
        const checkRequest5Minutes = response ? new Date(Date.now() - response.updatedAt).getMinutes() : 0;
        console.log(response);
        if (response === null) {
            const result = await ISDNModel.create(newISDN);
            console.log(result + ': result');

            res.status(200).send({
                status: 1,
                result: 'create'
            })

        } else if (checkRequest5Minutes > 5) {
            await ISDNModel.updateOne({ keyword: newISDN.keyword }, { $set: { status: 0, updatedAt: Date.now() } });

            res.status(200).send({
                status: 1,
                result: 'update'
            })
        } else {
            res.status(203).send({
                status: 0,
                result: 'request must be greater 5 minute'
            })
        }
    } catch (error) {
        console.log(error);

        res.status(500).send({
            status: 0,
            result: error
        })
    }



});
// io.on('connection', (socket) => {
//     console.log('connection ' + socket);
//     socket.on('disconnect', () => {
//         console.log('[index.js][disconnect] - Disconnected from socketId: ' + socket.id);

//     })
//     socket.emit('send_data', dataVariable);

//     socket.on('receive_data', async (data) => {
//         console.log(data);

//         const ISDN = await ISDNModel.findOneAndUpdate({ keyword: data.keyword }, { $set: { status: 1, reponsedAt: Date.now(), content: data.content } })
//         if (ISDN !== null) {
//             console.log(ISDN);
//             const finalContent = await convert_content(ISDN.content)
//             await sendDing(finalContent);
//         } else {
//             console.log(ISDN);

//             socket.disconnect();
//         }
//     })
// })