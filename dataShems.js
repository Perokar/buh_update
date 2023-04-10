const mongoose = require('mongoose');
const monthNumber =[0,1,2,3,4,5,6,7,8,9,10,11];
// Схема для збеоеження користувача
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
// модель користувача
const User = mongoose.model('User', userSchema);
// Схема коштів
const coinSchema = new mongoose.Schema({
    idUser: Number,
    debet: Number,
    credit: Number,
    description: String,
    date: Number
}, {
    timestamps: true
});
const coinModel = mongoose.model('Coins', coinSchema);
//Запис руху в базу
async function addCoin(dataCoin) {
    if (await User.findOne({
            id: dataCoin.idUser
        }) != null) {
        let cent = new coinModel(dataCoin);
        await cent.save();
    }
}

async function earseCoins(Id) {
    coinModel.deleteMany({
        idUser: Id
    }, (err, result) => console.log(result))
}
async function findToday(userId) {
    let startDay = new Date().setHours(0, 0, 0, 1)
    let today = Date.now();
    let checkCoin = await coinModel.find({
        idUser: userId
    })
    console.log(startDay + '\n' + today + '\n');
    let [data] = await coinModel.aggregate([{
            $match: {
                $and: [{
                        idUser: userId
                    },
                    {
                        date: {
                            $gt: startDay,
                            $lt: today
                        }
                    }
                ]
            }
        },
        {
            $group: {
                _id: userId,
                debet: {
                    $sum: '$debet'
                },
                credit: {
                    $sum: '$credit'
                }
            }
        }
    ]);

    return data;
}
async function getMonth(userId, month) {
    const nDate = new Date();
    const fDay = new Date(nDate.getFullYear(), month, 1);
    const lDay = new Date(nDate.getFullYear(), month + 1, 0);
    const [coinMonth] = await coinModel.aggregate([{
            $match: {
                $and: [{
                    idUser: userId
                }, {
                    createdAt: {
                        $gte: fDay,
                        $lte: lDay
                    }
                }]
            }
        },
        {
            $group: {
                _id: userId,
                debet: {
                    $sum: '$debet'
                },
                credit: {
                    $sum: '$credit'
                }
            }
        }
    ]);
    if (coinMonth === undefined || coinMonth === null) {
        return false
    } else {
        return `За весь час Ви\:\n витратили\: ${coinMonth.credit} \n заробили\: ${coinMonth.debet} \n загальний баланс за сьогодні складає \: ${(coinMonth.debet + coinMonth.credit)} \n Переглянути детально ?`;
    }
}
async function findAllCoins(userId) {
    return coinModel.aggregate([{
            $match: {
                $and: [{
                    idUser: userId
                }, {
                    date: {
                        $lt: Date.now()
                    }
                }]
            }
        },
        {
            $group: {
                _id: userId,
                debet: {
                    $sum: '$debet'
                },
                credit: {
                    $sum: '$credit'
                }
            }
        }
    ])
}
async function saveDataUser(userData) {
    let check = await User.findOne({
        id: userData.id
    });
    if (check === null) {
        const user = new User(userData);
        await user.save()
    } else {
        console.log(check)
        console.log('User already excist')
    }
}
// Функція отримання дебету детально
async function getDebet(id, timer) {
    let text = arrayCoin = '';
    
    if (timer === 'today') {
        let startDay = new Date().setHours(0, 0, 0, 1);
        let today = Date.now();
        arrayCoin = await coinModel.find({
            idUser: id,
            date: {
                $gt: startDay,
                $lt: today
            }
        }).select({
            "debet": 1,
            "description": 1,
            "_id": 0
        })

    } else {
        arrayCoin = await coinModel.find({
            idUser: id
        }).select({
            "debet": 1,
            "description": 1,
            "_id": 0
        })
    }
    for (let key of arrayCoin) {
        if (key != undefined && key.debet != 0) {
            text += `\+${key.debet}-->${key.description}\n`
        }
    }
    return text = text.slice(0, (text.length - 1))
}
//Функція отримання кредиту детально
async function getCredit(id, timer) {
    console.log(timer)
    // Фільтровка за день 
    let text2 = arrayCoin = '';
    if (timer === 'today') {
        let startDay = new Date().setHours(0, 0, 0, 1)
        let today = Date.now();
        arrayCoin = await coinModel.find({
            idUser: id,
            date: {
                $gt: startDay,
                $lt: today
            }
        }).select({
            "credit": 1,
            "description": 1,
            "_id": 0
        })
    } 
    // Фільтровка за місяць
    else if(monthNumber.includes(+timer)){
        console.log(+timer)
        const nDate = new Date();
        const fDay = new Date(nDate.getFullYear(), +timer, 1);
        const lDay = new Date(nDate.getFullYear(), +timer + 1, 0);
        arrayCoin = await coinModel.find({
            idUser: id,
            date: {
                $gte: fDay,
                $lte: lDay
            }
        }).select({
            "credit": 1,
            "description": 1,
            "_id": 0
        });
    }
    // Фільтровка за весь час
    else {
        console.log("all")
        arrayCoin = await coinModel.find({
            idUser: id
        }).select({
            "credit": 1,
            "description": 1,
            "_id": 0
        })
    }
    // Формування строки виводу
    for (let key of arrayCoin) {
        if (key != undefined && key.credit != 0) {
            text2 += `${key.credit}-->${key.description}\n`
            console.log(arrayCoin)
        }
    }
    return text2 = text2.slice(0, (text2.length - 1))
}
module.exports = {
    saveDataUser,
    addCoin,
    findToday,
    earseCoins,
    findAllCoins,
    getDebet,
    getCredit,
    getMonth
}