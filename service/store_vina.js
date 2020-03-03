const axios = require('axios').default;
const qs = require('qs');
const cheerio = require('cheerio');
const urlFree = 'https://freedoo.vnpt.vn';
const APIKey2Capcha = 'c795d3f82f20290ba3ffd03a617b9e9d';
const { headers, urlFanpage } = require('../config/index')
let instance = axios.create({
    baseURL: urlFree,
    headers: {
        ...headers
    }
});

async function vinaStore(phoneNumber, info, user) {
    try {
        let result = [];
        let count = 0;
        let simString = '';
        do {
            count++ 
            result = await getTokenGGCapchaFinal('toanquoc', cutStart(phoneNumber), cutEnd(phoneNumber)) 
        } while ((result.length == 0 || result.length > 3 ) && count < 4);

        if(result.length !== 0) {
            result.forEach(item => {
                simString += `${item.stb} - ${item.ltb} -${item.ttck} -${item.cck}\n`
            })
        } else {
            simString = 'Không có kết quả trả về'
        }
        await sendingResult(simString, info, user, phoneNumber)
        console.log("DONE ", phoneNumber);
    } catch (error) {
        throw Error(error.message)
    }
}
async function sendingResult(result, info, user,phoneNumber) {
    try {
        let res = await axios.post(`${urlFanpage}`, {
            content: result ? result : [],
            info: info,
            user: user,
            phoneNumber: phoneNumber
        })
    } catch (error) {
        throw Error(error.message)
    }
}
//// Searching
function cutStart(searchingNumber) {
    return searchingNumber.padStart(10, "0").slice(0, 3).slice(-2).padStart(4, "84")
}
function cutEnd(searchingNumber) {
    return searchingNumber.slice(-7)
}

async function CSRF(HTMCrawl) {
    const $ = cheerio.load(HTMCrawl);
    const YII_CSRF_TOKEN = $('form').find('input').eq(0).attr('value');
    console.log('YII_CSRF_TOKEN: ' + YII_CSRF_TOKEN);
    return YII_CSRF_TOKEN;

}
async function getKeyCapchaGG(HTMCrawl) {
    let keyGGCC;
    const $ = cheerio.load(HTMCrawl);
    keyGGCC = $('#captcha_place_holder').attr('data-sitekey').trim();

    return keyGGCC;
}
async function getIDCapcha(keyGG) {
    let keyGGcc;
    let respone = await instance.get(`http://2captcha.com/in.php?key=${APIKey2Capcha}&method=userrecaptcha&googlekey=${keyGG}&pageurl=${urlFree}/sim-so.html`)

    console.log("getIDCapcha ", respone.data.split('|')[1]);
    keyGGcc = respone.data.split('|')[1]
    return keyGGcc;

}
//POst
async function postAjaxAndGet(YII_CSRF_TOKEN, recaptcha, source, prefix_msisdn, suffix_msisdn) {
    try {
        await instance.post(`/sim/searchAjax.html`, qs.stringify({
            YII_CSRF_TOKEN, "g-recaptcha-response": recaptcha, "SearchForm[source]": source, "SearchForm[prefix_msisdn]": prefix_msisdn, "SearchForm[suffix_msisdn]": suffix_msisdn
        }))
        let data = await getAllPage()
        return data
    } catch (error) {
        throw Error(error.message)
    }


}
/// Crawler
async function crawlData(HTMCrawl) {

    try {
        let ArrSim = [];
        const $ = cheerio.load(HTMCrawl, {
            withDomLvl1: true,
            normalizeWhitespace: false,
            xmlMode: false,
            decodeEntities: true
        });

        if ($('tr').length >= 2) {
            $('tr').each((a, ele) => {
                if (a !== 0) {
                    let stb = $('tr').eq(a).children('td').eq(0).text().split('-').shift().trim();
                    let ltb = $('tr').eq(a).children('td').eq(1).text().trim();
                    let gia = $('tr').eq(a).children('td').eq(2).text().trim();
                    let ttck = $('tr').eq(a).children('td').eq(3).text().trim();
                    let cck = $('tr').eq(a).children('td').eq(4).text().trim();
                    let ObjectSim = {
                        "Số thuê bao: ": stb,
                        "Loại thuê bao: ": ltb,
                        "Giá: ": gia,
                        "Thời gian cam kết:": ttck,
                        "Cước cam kết": cck
                    }
                    if(stb !== 'Không có dữ liệu')  ArrSim = [...ArrSim, Object.assign({}, ObjectSim)];
                }
            });
            return ArrSim 
        } else {
            return []
        }
    } catch (error) {
        throw Error(error.message)
    }

}
async function getAllPage() {
    let response = await instance.get('/sim/searchajax.html?ajax=msisdn-grid&page=1')
    let dataCrawl = await crawlData(response.data);
    return dataCrawl

}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function getTokenGGCapchaFinal(source, preffix, suffix) {
    try {
        let Response = await instance.get('/sim-so.html')
        const csrf = await CSRF(Response.data)
        const keyCapcha = await getKeyCapchaGG(Response.data);
        const Id = await getIDCapcha(keyCapcha);
        let check = 0
        while (check <= 20) {
            let token;
            const respone = await instance.get(`http://2captcha.com/res.php?key=${APIKey2Capcha}&action=get&id=${Id}`).catch(err => { throw Error("2capcha Get fail") });

            if (!respone.data.startsWith('OK')) {
                console.log('Refresh getToken function');
                await sleep(2000)
                await instance.get(`http://2captcha.com/res.php?key=${APIKey2Capcha}&action=get&id=${Id}`)
                check++
            } else {
                //////////////////// SUCCESS ///////////////
                token = respone.data.split('|')[1];
                console.log('TOKEN:', token);
                let data = await postAjaxAndGet(csrf, token, source, preffix, suffix);
                return data
            }
        }
        if (check > 20) await getTokenGGCapchaFinal('toanquoc', preffix, suffix);
    } catch (error) {
        throw Error(error.message)
    }

}
module.exports = {
    vinaStore
}
