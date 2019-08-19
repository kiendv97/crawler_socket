const axios = require('axios')
async function sendToDingtalk(data) {
  if (data.toString().indexOf('Số còn') != -1) {
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
  if (data.toString().indexOf('Số không còn') != -1) {
    axios
      .post(`https://oapi.dingtalk.com/robot/send?access_token=f7495de50b7616d0f8e6b76ea8686667d2fcea4f70a7f485cab5f850f2ae3203`, {
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

}
module.exports = sendToDingtalk;