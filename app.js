const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const { saveDataUser, addCoin, findToday, earseCoins, findAllCoins, getDebet, getCredit, monthData } = require('./dataShems')
require('dotenv').config();
const parametr = require('./message');
const message = require('./message');
token = process.env.TOKEN;
dataBase = process.env.DATABASE
const bot = new TelegramBot(token, { polling: true });
conn().catch(err => { console.log(`Mongoose connect error ${err}`) });
async function conn() {
    await mongoose.connect(dataBase)
}
bot.setMyCommands([
    {command: '/rules', description: 'Правила роботи з ботом' },
    {command:'/check', description:'Перевірка балансу на сьогодні'},
    {command:'/totaly', description:'Перевірка руху коштів за весь час'},
    {command:'/month',description:'Перевірка руху коштів за місяць'},
    {command:'/del', description:'Видалити всі записи про рух моїх коштів'}
]);

bot.on('message', async (msg) => {
    if (msg.text === "\/check") {
        let balans = await findToday(await msg.from.id);
        if (balans != undefined) {
            return bot.sendMessage(msg.from.id, `За сьогодні Ви\:\n витратили\:${balans.credit} \n заробили\:${balans.debet}\n загальний баланс за сьогодні складає \: ${(balans.debet + balans.credit)} \n Переглянути детально ?`, parametr.buttonsT)
        }
        else {
            return bot.sendMessage(msg.from.id, parametr.Error4)
        }
    }
    if (msg.text === '/del') {
        earseCoins(await msg.from.id)
        return bot.sendMessage(msg.from.id, parametr.del);
    }
    if (msg.text === '/totaly') {
        let [allCoins] = await findAllCoins(await msg.from.id);
        if (allCoins != undefined) {
            return bot.sendMessage(msg.from.id, `За весь час Ви\:\n витратили\: ${allCoins.credit} \n заробили\: ${allCoins.debet} \n загальний баланс за сьогодні складає \: ${(allCoins.debet + allCoins.credit)} \n Переглянути детально ?`  , parametr.buttons)
        }
        else {
            return bot.sendMessage(msg.from.id, parametr.Error4)
        }
        // return bot.sendMessage(msg.from.id, inDev);
    }
    if(msg.text==='/month'){
        monthData(await msg.from.id,3);
        return false;
    }
    if (msg.text === '/rules') {
        return bot.sendMessage(msg.from.id, parametr.rules);
    }
    if (msg.text === "\/start") {
        bot.sendMessage(msg.from.id, parametr.Hi)
        return saveDataUser({ 'id': await msg.from.id });
    } else {
        lightBuh(msg.text, msg.from.id);
    }

})

async function lightBuh(someText, id) {
    let debet = credit = 0;
    let coins = (someText.match(/\+\d+/g) != null) ? someText.match(/\+\d+/g)[0] :
        (someText.match(/\-\d+/g) != null) ? someText.match(/\-\d+/g)[0] : "Error";
    if (coins === "Error") {
        return answerBot(parametr.Error, id);
    }
    switch (coins[0]) {
        case ('-'):
            credit = +coins;
            console.log("credit" + credit)
            break;
        case ('+'):
            debet = +coins;
            console.log("debet " + debet);
            break;
    }
    // coins[0] === '-' ? credit = +coins : debet = +coins;
    // if (coins[0]==='='){
    //     return answerBot()
    // }
    let description = someText.match(/[A-ZА-Яії ]+/gi) != null ? someText.match(/[A-ZА-Яії ]+/gi)[0] : (answerBot(parametr.Error2, id), 0);
    let newOrder = {
        'idUser': id,
        'debet': await debet,
        'credit': await credit,
        'description': await description,
        'date': Date.now()
    }
    if ((newOrder[debet] != 0 || newOrder[credit] != 0) && description != 0) {
        console.log(`Good order ${newOrder}`)
        addCoin(newOrder)
        return bot.sendMessage(id, parametr.msgGood)

    } else {
        console.log((newOrder[debet] != 0 || newOrder[credit] > 0));
        console.log(newOrder)
    }

}
function answerBot(message, id) {
    return bot.sendMessage(id, message)
}

bot.on('callback_query', async (callback)=>{
    const isEmpty = val => val === null || !(Object.keys(val) || val).length;
    switch (callback.data){
        case ('debet'): msgAnswer = await getDebet (await callback.from.id);
        break;
        case ('credit'): msgAnswer = await getCredit (await callback.from.id);
        break;
        case ('debetToday'): msgAnswer = await getDebet (await callback.from.id,"today")
        break;
        case ('creditToday'): msgAnswer = await getCredit (await callback.from.id,"today")
        break;
    }
    if (isEmpty(msgAnswer)){
        return answerBot(parametr.Error4, await callback.from.id)
    }  
    else{
        return answerBot(msgAnswer, await callback.from.id)
    }
});
