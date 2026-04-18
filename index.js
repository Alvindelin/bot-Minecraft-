const mineflayer = require('mineflayer');
const fs = require('fs');

// ========== KONFIGURASI ==========
const SERVER = {
    host: '191.96.231.19',     // GANTI DENGAN IP SERVER LO
    port: 10109,                // GANTI DENGAN PORT SERVER LO
    version: '1.21.11',        // VERSI SERVER LO
    auth: 'offline'
};

const BOT_COUNT = 200;          // JUMLAH BOT (200)
const BOT_NAME_PREFIX = 'elestiaxd';

// ========== BACA PROXY ==========
let proxies = ['direct'];
try {
    const data = fs.readFileSync('proxy.txt', 'utf8');
    proxies = data.split('\n')
        .map(l => l.trim())
        .filter(l => l && !l.startsWith('#'));
    console.log(`✅ Loaded ${proxies.length} proxies`);
} catch (err) {
    console.log('⚠️ proxy.txt not found, running without proxy');
}

// ========== BUAT PROXY AGENT ==========
function getProxyAgent(proxy) {
    if (proxy === 'direct') return null;
    
    const [host, port] = proxy.split(':');
    if (!host || !port) return null;
    
    // Pake HTTP proxy agent sederhana
    const { HttpsProxyAgent } = require('https-proxy-agent');
    return new HttpsProxyAgent(`http://${host}:${port}`);
}

// ========== BUAT BOT ==========
let connected = 0;
let failed = 0;

function createBot(index) {
    const botName = `${BOT_NAME_PREFIX}${index + 1}`;
    const proxy = proxies[index % proxies.length];
    
    console.log(`[${index + 1}/${BOT_COUNT}] Creating ${botName}...`);
    
    const options = {
        host: SERVER.host,
        port: SERVER.port,
        username: botName,
        version: SERVER.version,
        auth: SERVER.auth,
        skipValidation: true,
        keepAlive: true
    };
    
    // Pake proxy kalo ada
    if (proxy !== 'direct') {
        try {
            const agent = getProxyAgent(proxy);
            if (agent) options.agent = agent;
            console.log(`   🔒 ${botName} using proxy ${proxy}`);
        } catch (err) {
            console.log(`   ⚠️ ${botName} proxy failed, using direct`);
        }
    }
    
    const bot = mineflayer.createBot(options);
    
    // ========== EVENT ==========
    bot.on('login', () => {
        connected++;
        console.log(`✅ ${botName} LOGIN (${connected}/${BOT_COUNT})`);
    });
    
    bot.on('spawn', () => {
        console.log(`🌍 ${botName} SPAWNED`);
        
        // Ambil kit otomatis
        setTimeout(() => {
            if (bot && bot.chat) {
                bot.chat('/kit elestiaxd');
                console.log(`📦 ${botName} took kit`);
            }
        }, 3000);
        
        // Chat random biar keliatan hidup
        setInterval(() => {
            if (bot && bot.chat) {
                const msgs = ['gg', 'hi', 'lol', 'ez', 'wp', 'hi all', 'letss goo'];
                const randomMsg = msgs[Math.floor(Math.random() * msgs.length)];
                bot.chat(randomMsg);
            }
        }, 45000 + Math.random() * 30000);
    });
    
    bot.on('end', (reason) => {
        connected--;
        console.log(`❌ ${botName} DC: ${reason}`);
        
        // Reconnect
        setTimeout(() => {
            if (connected + failed < BOT_COUNT) {
                createBot(index);
            }
        }, 10000);
    });
    
    bot.on('error', (err) => {
        failed++;
        console.log(`⚠️ ${botName} ERROR: ${err.message}`);
    });
    
    bot.on('kicked', (reason) => {
        connected--;
        console.log(`🚫 ${botName} KICKED: ${reason}`);
        setTimeout(() => createBot(index), 15000);
    });
    
    return bot;
}

// ========== START ==========
console.log(`\n🚀 Starting ${BOT_COUNT} bots...`);
console.log(`🎯 Target: ${SERVER.host}:${SERVER.port}`);
console.log(`📦 Version: ${SERVER.version}\n`);

for (let i = 0; i < BOT_COUNT; i++) {
    setTimeout(() => {
        createBot(i);
    }, i * 2000);  // Delay 2 detik antar bot
}

// ========== STATISTIK ==========
setInterval(() => {
    console.log(`\n📊 STATS - Online: ${connected}/${BOT_COUNT} | Failed: ${failed}\n`);
}, 30000);

// Handle exit
process.on('SIGINT', () => {
    console.log('\n🛑 Stopping...');
    process.exit(0);
});
