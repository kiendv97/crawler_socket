const { vinaStore } = require('../service/store_vina')

const DAOvinaStore = async(req,res) => {
    try {
        let {phoneNumber,user,info} = req.body;
        if(!phoneNumber) throw Error("Yêu cầu số điện thoại")
        if(Object.entries(user).length == 0) throw Error("Thiếu thông tin về sim")
        if(Object.entries(info).length == 0) throw Error("Không rõ NVBH")
        vinaStore(phoneNumber,info,user)
        return res.status(200).json({status: "Success vina"})

    } catch (error) {
        return res.status(500),json({status: error.message})
    }
   
}
module.exports = {
    DAOvinaStore
}