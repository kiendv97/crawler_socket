const axios = require('axios')
async function sendToDingtalk(data) {
  if (data.toString().indexOf('Số còn') != -1) { 
  data = data.replace('Số còn,','');
    axios
      .post(`https://oapi.dingtalk.com/robot/send?access_token=ce54472f3e749628492a0c657f93081e9abfa9bfce83efae65a844ce73eddbe6`, {
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
      .post(`https://oapi.dingtalk.com/robot/send?access_token=91c589d960f2ac62d383474d9e6380c10fee3fb4e2ea544611c7d62b3ba96920`, {
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