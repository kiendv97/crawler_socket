const axios = require('axios')
var request = require('request');
const getURL = async () => {
    let response = await axios.get('https://content.topsim.vn/getqueue.php')
    if (response.status == 200) {
        let data = JSON.parse(JSON.stringify(response.data))
        if (!data.url) return {
            status: 'error',
            message: 'Không có url'
        }
        return { status: 'success', data: { _id: data._id, url: data.url } }
    } else {
        return {
            status: 'error',
            message: 'Server not response or something wrong'
        }
    }
}
const postURL = async (data) => {
    var options = {
        'method': 'POST',
        'url': 'https://content.topsim.vn/getqueue.php',
        'headers': {
            'Content-Type': 'application/json',
            'Cookie': '__cfduid=d2dc51f0d39fb7ffc9a76a930bf7c5c101586259896'
        },
        body: JSON.stringify({ "id": `${data.id}`, "title": `${data.title}`, "content": `${data.content}` })

    };
    request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
        console.log('Thành công');
    });
}
module.exports = {
    getURL,
    postURL
}