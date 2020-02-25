const axios = require('axios')

export const api_chat =  (data) => {
    axios.post('http://fanpage.topsim.vn/on-data-mobi', {data: data})
}
