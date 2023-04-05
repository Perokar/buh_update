const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now()
    },
    id: Number,
    status: {
        type: Number,
        default: 0
    }
});
const User = mongoose.model('User', userSchema);
const coinSchema = new mongoose.Schema({
    idUser: Number,
    debet: Number,
    credit: Number,
    description: String,
    date: Number
},{timestamps:true});
const coinModel = mongoose.model('Coins', coinSchema);
async function addCoin(dataCoin) {
    console.log(dataCoin)
    if (await User.findOne({ id: dataCoin.idUser }) != null) {
        let cent = new coinModel(dataCoin);
        await cent.save();
    }
}

async function earseCoins(Id) {
    coinModel.deleteMany({idUser:Id}, (err, result) => console.log(result))
}
async function findToday(userId) {
    let startDay = new Date().setHours(0, 0, 0, 1)
    let today = Date.now();
    let checkCoin = await coinModel.find({ idUser: userId })
    console.log(startDay+'\n'+today+'\n');
    let data = await coinModel.aggregate([
        {
            $match:
            {
                $and:
                    [{ idUser: userId },
                    {date:  {$gt: startDay, $lt: today}}  
                    ]
            }
        },
        {
            $group:
            {
                _id: userId,
                debet: { $sum: '$debet' },
                credit: { $sum: '$credit' }
            }
        }
    ]);
    return data[0]
}
async function monthData(userId,month){
    const nDate = new Date();
    const fDay = new Date (nDate.getFullYear(), month, 1);
    const lDay = new Date (nDate.getFullYear(), month+1, 0);
    if (month<=nDate.getMonth()){
        const dataMonth = await coinModel.find({idUser:userId, 
            createdAt:{$gte:fDay,$lte:lDay}});
console.log(dataMonth)
    }
    else{
        return "Цей місяць ще не настав";
    }
}
async function findAllCoins(userId){
    return  coinModel.aggregate([
        {$match:
            {
              $and:[{idUser: userId},{date:{$lt:Date.now()}}]
            }
        },
        {
            $group:
            {
                _id: userId,
                debet: { $sum: '$debet' },
                credit: { $sum: '$credit' }
            }
        }
    ])
}
async function saveDataUser(userData) {
    let check = await User.findOne({ id: userData.id });
    if (check === null) {
        const user = new User(userData);
        await user.save()
    }
    else {
        console.log(check)
        console.log('User already excist')
    }
}
async function getDebet (id, timer){
    let text=arrayCoin='';
    if (timer==='today'){
        console.log('start today')
        let startDay = new Date().setHours(0, 0, 0, 1)
        let today = Date.now();
        arrayCoin = await coinModel.find({idUser:id, date:{$gt:startDay,$lt:today}}).select({"debet":1, "description":1,"_id":0})
       
    }
    else{
        arrayCoin = await coinModel.find({idUser: id}).select({"debet":1, "description":1,"_id":0}) 
    }
    for (let key of arrayCoin){
       if (key!=undefined && key.debet!=0){
        text+= `\+${key.debet}-->${key.description}\n`
       }
    }
    return text= text.slice(0,(text.length-1))
}
async function getCredit (id, timer){
    let text2=arrayCoin='';
    if (timer==='today'){
        let startDay = new Date().setHours(0, 0, 0, 1)
        let today = Date.now();
        arrayCoin = await coinModel.find({idUser:id, date:{$gt:startDay,$lt:today}}).select({"credit":1, "description":1,"_id":0})
    }
    else {
        arrayCoin = await coinModel.find({idUser: id}).select({"credit":1, "description":1,"_id":0})
    }
    for (let key of arrayCoin){
       if (key!=undefined && key.credit!=0){
        text2+= `${key.credit}-->${key.description}\n`
        console.log(arrayCoin)
       }
    }
    console.log(text2)
    return text2= text2.slice(0,(text2.length-1))
}
module.exports = { saveDataUser, addCoin, findToday, earseCoins,findAllCoins,getDebet,getCredit,monthData }