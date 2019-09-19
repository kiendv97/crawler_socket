const axios = require('axios')
async function sendToDingtalk(data) {
  if (data.toString().indexOf('Số còn') != -1) { 
  data = data.replace('Số còn,','');
    axios
      .post(`https://oapi.dingtalk.com/robot/send?access_token=49dded8f78a76c8fd1c9040cc62f1223663d66525d5c1667720efd9cc9060f95`, {
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
      .post(`https://oapi.dingtalk.com/robot/send?access_token=90ad6701b49972ff984d462ca783f190de2c84e9b70044225cffa5cee9e1d212`, {
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