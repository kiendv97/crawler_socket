// ======= Crawler Socket io============== //
const puppeteer = require('puppeteer');
const express = require('express');
const cron = require('node-cron');
const axios = require('axios');
var socketClient = require('socket.io-client').connect('https://gateway.stl.vn');
const cluster = require('cluster');
const scheduleRefesh = '*/3 * * * *';
const scheduleRefeshLogin = '0 7  * * *';
// cluster 
if (cluster.isMaster) {
    cluster.fork();

    cluster.on('exit', (worker, code, signal) => {
        console.log('Exit! Restart');

        cluster.fork();
    })
}
if (cluster.isWorker) {
    let browser;
    BrowserHandler();
    socketClient.on('send_data', async (data) => {
        console.log("DataSocket: " + data);

        const result = await searchISDN(data.keyword);
        //chat topsim
        if(data.info) {
            await setInfoChatTS({_id: data.keyword, result: result, user: data.user, infoReq: data.info})
        } else {
            await setInfo({ _id: data.keyword, result: result, user: data.user });
        }
    })
    cron.schedule(scheduleRefesh, async () => {
        console.log('refesh');
        const page = await browser.newPage()
        await page.goto(`http://10.50.8.210/1090/main.jsp`, {
            waitUntil: 'load'
        });
        await page.close();

    });
    cron.schedule(scheduleRefeshLogin, async () => {
        console.log('every day restart ');

        process.exit(1);
    }, {
            scheduled: true,
            timezone: "Asia/Bangkok"
        }
    )


    function setInfo(data) {
        console.log('send info');
        return new Promise((res, rej) => {
            axios
                .post(`https://gateway.stl.vn/setinfo`, {
                    telco: 'mobi',
                    keyword: data._id,
                    content: data.result || {},
                    user: data.user || 'admin'
                })
                .catch(error => {
                    rej(error)
                })
                .then(() => {
                    res();
                })
        })




    }

    function setInfoChatTS(data) {
        console.log('send info');
        return new Promise((res, rej) => {
            axios
                .post(`https://gateway.stl.vn/setinfo-chat`, {
                    telco: 'mobi',
                    keyword: data._id,
                    content: data.result || {},
                    user: data.user || 'admin',
                    extraInfo : data.infoReq
                })
                .catch(error => {
                    rej(error)
                })
                .then(() => {
                    res();
                })
        })




    }
    async function BrowserHandler() {
        browser = await puppeteer.launch({
            headless: false,
            // ============ DEBUG ====================//
            slowMo: 10,
            // defaultViewport: {
            //     width: 600,
            //     height: 600
            // },
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-accelerated-2d-canvas',
                '--disable-gpu'
            ],
            ignoreDefaultArgs: ['--disable-extensions']
        });

        // =========
        await login();


    }

    async function login(username, password) {
        try {
            const page = await browser.newPage();
            // file:///E:/Document%20(Project)/crawl.ISDN.sim/login.html
            await page.goto('http://10.50.8.210/1090/login.jsp', {
                waitUntil: 'domcontentloaded',
                timeout: 30000
            });
            await page.waitForSelector('input');
            await page.type('input[name="txtUserName"]', username || 'Mbf2_nganha');
            await page.type('input[name="txtPassword"]', password || 'nganha999999');
            await page.click('.button');
            await page.waitForSelector('table');

            const checkLogin = await page.evaluate(() => {
                return (document.getElementsByTagName('input').length === 0) ? true : false;
            })
            console.log("checkLogin: " + checkLogin);
            if (checkLogin) {
                await page.close();
            } else {
                await page.close();
                await login(username, password)
            }
        } catch (error) {
            process.exit(1);
            throw error;
        }
    }

    async function searchISDN(numberISDN) {
        try {
            if (!numberISDN) return;
            const page = await browser.newPage();
            // file:///E:/Document%20(Project)/crawl.ISDN.sim/crawlSDN.html
            await page.goto(`http://10.50.8.210/1090/isdn_detail.jsp?p_ISDN=${numberISDN}`, {
                waitUntil: 'load',
                timeout: 60000
            });
            await page.waitForSelector('table');
            const checkLogin = await page.evaluate(() => {
                return (document.getElementsByTagName('input').length !== 0) ? true : false;
            })
            if (checkLogin) {
                await page.close();
                return {};
            }
            try {
                let data = await page.evaluate(() => {
                    const tables = document.getElementsByTagName('table').item(1);
                    const data2 = tables.getElementsByTagName('tr');
                    let ArrObject = {};
                    for (let i = 0; i < data2.length; i++) {
                        const nameLeft = data2[i].getElementsByTagName('td').item(0).textContent.trim();
                        const valueLeft = data2[i].getElementsByTagName('td').item(1).textContent.trim();
                        const nameRight = (i < 5) ? data2[i].getElementsByTagName('td').item(2).textContent.trim() : '';
                        const valueRight = (i < 5) ? data2[i].getElementsByTagName('td').item(3).textContent.trim() : '';
                        const ObjectData = {
                            [nameLeft]: valueLeft,
                            [nameRight]: valueRight
                        }
                        ArrObject = { ...ArrObject, ...ObjectData }
                    }
                    return ArrObject
                });
                await page.close();
                return data;
            } catch (error) {
                await page.close();
                console.log(error);
                return {};
            }

        } catch (error) {
            process.exit(1);
        }
    }
}
// CRON


