const axios = require('axios')
async function sendToDingtalk(data) {
    axios
      .post(`https://oapi.dingtalk.com/robot/send?access_token=031011ad57ec1aaf5b46b7d13663a54a8997ed6d0ba248e40b25f12f2f6159f0`, {
        "msgtype": "text",
        "text": {
          "content": data
        }
      })
      .then(responses => {
        if (responses.data.status) {
          console.log('sendToDingTalk ok');
        }
      });
  }
  module.exports = sendToDingtalk;