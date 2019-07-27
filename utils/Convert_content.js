const S = require('string');
const moment = require('moment')

async function convert(newMobi) {

    var infoString = 'Số TB: ' + newMobi['Số TB'].toString() + ' Công ty: ' + newMobi['Công ty'].toString() + ' Mã cửa hàng: ' + newMobi['Mã cửa hàng'].toString()
    var myDate = newMobi['Ngày thay đổi'].toString();
    myDate = myDate.split("-");
    var newDate = myDate[1] + "/" + myDate[0] + "/" + myDate[2];
    var checkChangeYear = new Date(new Date().getTime() - new Date(newDate).getTime()).getUTCFullYear() - 1970
    var checkChangeMonth = new Date(new Date().getTime() - new Date(newDate).getTime()).getMonth()
    var checkChangeDate = new Date(new Date().getTime() - new Date(newDate).getTime()).getUTCFullYear() - 1
    var finalCheck = checkChangeDate + checkChangeMonth * 30 + checkChangeYear * 365
   

    if (newMobi['Trạng thái'].toString().search('Số đang sử dụng') == 0 || newMobi['Số cấm tác động'].toString().indexOf('Không') == -1) {
        infoString += '\nSố không còn'

    } else {
        if ((newMobi['Loại TB'].toString().indexOf('Số MobiCard') == 0 || newMobi['Loại TB'].toString().indexOf('Số MobiFone') == 0) && newMobi['Loại cam kết'].toString().indexOf('KHONG_CK') == 0) {
            
           const dau =  (finalCheck <= 5)? 'chưa đấu được': '';
           infoString += '\nSố còn, trả sau thường ' + dau
        } else if (newMobi['Mã cửa hàng'].toString().indexOf('2HCMCKCN') == 0) {
            const dau =  (finalCheck <= 5)? 'chưa đấu được': '';
            infoString += '\nSố còn, trả sau ' + newMobi['Loại cam kết'].toString().split('_')[0] + dau
        } else {
            infoString += '\nSố không còn'
        }
    }
    console.log(infoString);
    return infoString
}
module.exports = convert;