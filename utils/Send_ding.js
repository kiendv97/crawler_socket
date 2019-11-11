const axios = require('axios')
async function sendToDingtalk(data) {
  if (data.toString().indexOf('Số còn') != -1) { 
  data = data.replace('Số còn,','');
    axios
      .post(`https://oapi.dingtalk.com/robot/send?access_token=49110920577c930c500559225091ca9b1f04cecf52e59f947cd05084e2fb05c0`, {
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