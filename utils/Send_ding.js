const axios = require('axios')
async function sendToDingtalk(data) {
  if (data.toString().indexOf('Số còn') != -1) { 
  data = data.replace('Số còn,','');
    axios
      .post(`https://oapi.dingtalk.com/robot/send?access_token=dea7a78c5d8e0cb10d969f8c508da06ef30256f4d0b97ed5e1e2c9125a2d2663`, {
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
    data = data.replace('Số không còn','');
    axios
      .post(`https://oapi.dingtalk.com/robot/send?access_token=6a00ab3e0cf635cef448dd752ef254baa885b90bc249f38639cdb3c23e96e454`, {
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