const headers = {
    "Content-Type": 'application/x-www-form-urlencoded',
    "Accept-Encoding": 'gzip, deflate',
    'Connection': 'keep-alive',
    'Accept': '*/*',
    'Cache-Control': 'no-cache',
    'Cookie': 'PHPSESSID=s2~llemosumgse6kot6kmhr4qck77; YII_CSRF_TOKEN=d395db210b790403bb28b8ad8c945a31184ca010s%3A40%3A%22439c0aab2e21f20e80777559885179f8f85a81ef%22%3B; _gcl_au=1.1.1076227707.1574309505; _ga=GA1.2.2146544564.1574309506; _gid=GA1.2.1261645763.1574309506; _gat=1; _hjid=cdbd3f98-eadc-4079-9c8f-6896be10dfec; _hjIncludedInSample=1'
}
const urlFanpage = process.env.URLFANPAGE || 'http://fanpage.topsim.vn/agency/on-data-vina'
module.exports = {
    urlFanpage,
    headers
}