const axios = require('axios')
async function sendToDingtalk(data) {
  if (data.toString().indexOf('Số còn') != -1) { 
  data = data.replace('Số còn,','');
    axios
      .post(`https://oapi.dingtalk.com/robot/send?access_token=0bc33e83ba5651a3c8cadc4342722641d3237abae0fc9c53626476fce40fda58`, {
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
      .post(`https://oapi.dingtalk.com/robot/send?access_token=9c756be3eaf9ee594fa24146eb72cdf1f5c9105bae8079859a30d4d45c23f33b`, {
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