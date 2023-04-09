module.exports={
  Error : "Вкажіть будь ласка це доходи чи витрати",
  Error2 : "Ви забули надати опис до руху коштів",
  Error3 : "Ви або отримали гроші тоді сумма зі знаком \"+\"\, або витратили сумма зі знаком \-",
  Error4 : `У Вас немає записів про рух коштів`,
  Hi : "Це телеграм бот для ведення домашньої індивідуальної бухгалтерії\. Розходи та доходи, просто щоб відслідковувати рух коштів в гаманці. Для того щоб ознайомитись з правилами користування прочитайте правила в Menu",
  Month:"Оберіть місяць за який хочете отримати дані",
  del : `Всі записи про всі обороти видалено`,
  msgGood : 'Ок \, я записав\!',
  inDev : 'Ми ще працюємо над цим',
  rules : " Бот на стадії тестування. Цей Бот допоможе кожному розібратись \, куди діваються гроші\? Бот буде рости і розвиватись\. Але поки що ви можете лише записувати скільки ви отримали грошей і скільки витратили \n ВАЖЛИВО: запис має бути у форматі\: сумма зі знаком \+ чи \- \і опис руху коштів\. \n ПРИКЛАД: \-15 кава",
  buttons :{
    reply_markup: JSON.stringify({
        inline_keyboard:[
            [{text:'Доходи',callback_data:'debet'},{text:'Витрати',callback_data:'credit'} ]
        ]
    })
},
buttonsT :{
    reply_markup: JSON.stringify({
        inline_keyboard:[
            [{text:'Доходи',callback_data:'debetToday'},{text:'Витрати',callback_data:'creditToday'} ]
        ]
    })
},
buttonsM :{
    reply_markup: JSON.stringify({
        inline_keyboard:[
            [{text:'Доходи',callback_data:'debetMonth'},{text:'Витрати',callback_data:'creditMonth'} ]
        ]
    })
},
buttonsMonth :{
    reply_markup: JSON.stringify({
        inline_keyboard:[
            [{text:'Cічень',callback_data:'0'},{text:'Лютий',callback_data:'1'},{text:'Березень',callback_data:'2'},{text:'Квітень',callback_data:'3'}],
            [{text:'Травень',callback_data:'4'},{text:'Червень',callback_data:'5'},{text:'Липень',callback_data:'6'},{text:'Серпень',callback_data:'7'}],
            [{text:'Вересень',callback_data:'8'},{text:'Жовтень',callback_data:'9'},{text:'Листопад',callback_data:'10'},{text:'Грудень',callback_data:'11'}],
        ]
    })
}
}