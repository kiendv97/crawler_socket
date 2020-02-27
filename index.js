const http = require('http');
const bodyParser = require('body-parser');
const createError = require('http-errors');
var express = require('express');
const app = express();
const httpServer = http.createServer(app)

const ioServer = require('socket.io')(httpServer);
const sendDing = require('./utils/Send_ding');
const {api_chat} = require('./utils/chat.topsim')
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
app.get('/checking-regType', async (req,res,next)=>{
    const queryField = Object.assign({},req.query);
    console.log(queryField);
    try {
        const response = await ISDNModel.findOne({ telco: queryField.telco, keyword: queryField.keyword });
        console.log(response);

        if (response) {
            res.status(200).send({
                status: 1,
                result: response
            })
        } else {
            res.status(400).send({
                status: 0,
                result: 'not existed'
            })
        }
    } catch (error) {
        res.status(500).send({
            status: 0,
            result: error
        })
    }
    
})
app.get('/getdetails', async (req, res, next) => {
    const paramsQuery = Object.assign({}, req.query, { status: 0 });
    console.log(paramsQuery);
    try {
        const response = await ISDNModel.findOne({ telco: paramsQuery.telco, status: 0 });
        console.log(response);
        
        if (response) {
            res.status(200).send({
                status: 1,
                result: response
            })
        } else {
            res.status(203).send({
                status: 0,
                result: ''
            })
        }

    } catch (error) {
        res.status(500).send({
            status: 0,
            result: error
        })
    }
});
app.post('/setinfo_viettel', async function (req, res, next) {
    try {
        
        const paramsQuery = Object.assign({}, req.body);
        console.log(paramsQuery);
        const ISDN = await ISDNModel.findOneAndUpdate({ keyword: paramsQuery.keyword }, { $set: { status: 1, reponsedAt: Date.now(), content: paramsQuery.content} });
        if (ISDN !== null) {
            res.status(200).send({
                status: 1,
                result: ISDN.content
            })
        } else {
            res.status(400).send({
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
})
app.post('/setinfo', async function (req, res, next) {
    try {
        const paramsQuery = Object.assign({}, req.body);
        const ISDN = await ISDNModel.findOneAndUpdate({ keyword: paramsQuery.keyword }, { $set: { status: 1, reponsedAt: Date.now(), content: paramsQuery.content } });
        if (ISDN !== null) {
            const finalContent = await convert_content(paramsQuery.content, paramsQuery.user)
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

app.get('/check_viettel', async (req,res,next) => {
    const paramsQuery = Object.assign({}, req.query);
     try {
        const newISDN = {
            telco: paramsQuery.telco || 'mobi',
            keyword: paramsQuery.keyword || 0,
            user: paramsQuery.user || 'admin',
            status: 0, //pending

        }
        const response = await ISDNModel.findOne({ keyword: newISDN.keyword });
        const checkRequest5Minutes = response ? new Date(Date.now() - response.updatedAt).getMinutes() : 0;
        console.log("Find keyword:" + response);
        if (response === null) {
            const result = await ISDNModel.create(newISDN);
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
})
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
        console.log("Find keyword:" + response);
        if (response === null) {
            const result = await ISDNModel.create(newISDN);
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
app.post('/check_chat_topsim', async (req, res, next) => {
    let paramsQuery = Object.assign({}, req.body);
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
        console.log("Find keyword:" + response);
        if (response === null) {
            const result = await ISDNModel.create(newISDN);
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
app.post('/setinfo-chat', async function (req, res, next) {
    try {
        const paramsQuery = Object.assign({}, req.body);
        if (Object.entries(paramsQuery.content).length !== 0) {
            const finalContent = await convert_content(paramsQuery.content, paramsQuery.user)
            await api_chat({content: finalContent, info: paramsQuery.extraInfo});
            res.status(200).send({
                status: 1,
                result: finalContent
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
app.post('/exist-keyword', async (req,res,next) => {
    try {
      const listPhone = req.body.listPhone
      const telco = req.body.telco || 'mobi'
      if(!listPhone) throw 'Phai truyen vao list so'
  
      console.log('[listPhone] ',listPhone);
      
      const listKeyword = await ISDNModel.find({keyword: {$in: listPhone}, telco: `${telco}`})
      res.status(200).send({
        status: 1,
        result: listKeyword
      })
  
    } catch (error) {
      res.status(500).send({
        status: 0,
        result: error
      })
    }
  })
