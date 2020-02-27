const axios = require('axios')

 const api_chat =  (data) => {
    axios.post('http://fanpage.topsim.vn/agency/on-data-mobi', {...data})
}
module.exports = {
    api_chat
}
