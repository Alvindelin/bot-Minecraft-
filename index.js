const mineflayer = require('mineflayer');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function tanya(pertanyaan) {
    return new Promise(resolve => rl.question(pertanyaan, resolve));
}

async function main() {
    console.log('\n========== BOT MINECRAFT SIMPLE ==========\n');
    
    const host = await tanya('IP Server: ');
    const port = parseInt(await tanya('Port: ')) || 25565;
    const version = await tanya('Versi (contoh: 1.21.11): ');
    const total = parseInt(await tanya('Jumlah Bot: ')) || 10;
    const delay = parseInt(await tanya('Delay antar bot (ms): ')) || 2000;
    
    rl.close();
    
    console.log(`\n🚀 Starting ${total} bots to ${host}:${port}\n`);
    
    let online = 0;
    
    for (let i = 1; i <= total; i++) {
        setTimeout(() => {
            const bot = mineflayer.createBot({
                host: host,
                port: port,
                username: `B${i}`,
                version: version,
                auth: 'offline'
            });
            
            bot.on('login', () => {
                online++;
                console.log(`✅ B${i} (${online}/${total})`);
            });
            
            bot.on('kicked', (reason) => {
                online--;
                console.log(`❌ B${i} kicked: ${reason}`);
            });
            
            bot.on('error', (err) => {
                console.log(`⚠️ B${i}: ${err.code || err.message}`);
            });
            
        }, i * delay);
    }
    
    setInterval(() => {
        console.log(`📊 Online: ${online}/${total}`);
    }, 10000);
}

main();
