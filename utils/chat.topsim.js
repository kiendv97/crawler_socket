const axios = require('axios')

 const api_chat =  (data) => {
    axios.post('http://fanpage.topsim.vn/on-data-mobi', {data: data})
}
module.exports = {
    api_chat
}
