const axios = require('axios')

 const api_chat =  (data) => {
    axios.post('http://178.128.18.2:81/agency/on-data-mobi', {data: data})
}
module.exports = {
    api_chat
}
