const mineflayer = require('mineflayer');
const TOTAL = 200;
let online = 0;

for (let i = 1; i <= TOTAL; i++) {
    const bot = mineflayer.createBot({ host: '191.96.231.19', port: 10109, username: `B${i}`, version: '1.21.11', auth: 'offline' });
    bot.on('login', () => { online++; console.log(`✅ ${i} (${online}/${TOTAL})`); });
    bot.on('spawn', () => bot.chat('/kit elestiaxd'));
}

setInterval(() => console.log(`Online: ${online}/${TOTAL}`), 10000);
