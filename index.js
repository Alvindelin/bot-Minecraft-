const mineflayer = require('mineflayer');

// ========== KONFIGURASI ==========
const config = {
    // Server lo
    host: '191.96.231.19',        // GANTI DENGAN IP SERVER LO
    port: 10109,                   // GANTI DENGAN PORT SERVER LO
    version: '1.21.11',             // GANTI DENGAN VERSI SERVER LO
    auth: 'offline',
    
    // JUMLAH BOT (MAX AMAN 100, JANGAN LEBIH!)
    botCount: 1000,                 // UBAH SESUAI KEKUATAN SERVER
    
    // Prefix nama bot
    botNamePrefix: 'Bot',
    
    // Delay antar koneksi (biar gak overload)
    connectionDelay: 100,          // 0.5 detik antar bot
    
    // Owner username
    ownerName: 'elestiaxd'            // GANTI DENGAN USERNAME LO
};

// ========== DAFTAR NAMA BOT ==========
const botNames = [
    'CrystalPvP1', 'CrystalPvP2', 'CrystalPvP3', 'CrystalPvP4', 'CrystalPvP5',
    'PvPMaster1', 'PvPMaster2', 'PvPMaster3', 'PvPMaster4', 'PvPMaster5',
    'TotemGod1', 'TotemGod2', 'TotemGod3', 'TotemGod4', 'TotemGod5',
    'Netherite1', 'Netherite2', 'Netherite3', 'Netherite4', 'Netherite5',
    'WindCharge1', 'WindCharge2', 'WindCharge3', 'WindCharge4', 'WindCharge5',
    'EnderPearl1', 'EnderPearl2', 'EnderPearl3', 'EnderPearl4', 'EnderPearl5',
    'CrystalKing1', 'CrystalKing2', 'CrystalKing3', 'CrystalKing4', 'CrystalKing5',
    'PvPChamp1', 'PvPChamp2', 'PvPChamp3', 'PvPChamp4', 'PvPChamp5',
    'MaceUser1', 'MaceUser2', 'MaceUser3', 'MaceUser4', 'MaceUser5',
    'SpeedRunner1', 'SpeedRunner2', 'SpeedRunner3', 'SpeedRunner4', 'SpeedRunner5',
    'PotionMaster1', 'PotionMaster2', 'PotionMaster3', 'PotionMaster4', 'PotionMaster5',
    'DragonBlade1', 'DragonBlade2', 'DragonBlade3', 'DragonBlade4', 'DragonBlade5',
    'StormBreaker1', 'StormBreaker2', 'StormBreaker3', 'StormBreaker4', 'StormBreaker5',
    'ShadowHunter1', 'ShadowHunter2', 'ShadowHunter3', 'ShadowHunter4', 'ShadowHunter5',
    'FireLord1', 'FireLord2', 'FireLord3', 'FireLord4', 'FireLord5',
    'IceKing1', 'IceKing2', 'IceKing3', 'IceKing4', 'IceKing5',
    'ThunderGod1', 'ThunderGod2', 'ThunderGod3', 'ThunderGod4', 'ThunderGod5',
    'VenomStrike1', 'VenomStrike2', 'VenomStrike3', 'VenomStrike4', 'VenomStrike5',
    'PhantomBlade1', 'PhantomBlade2', 'PhantomBlade3', 'PhantomBlade4', 'PhantomBlade5',
    'DarkKnight1', 'DarkKnight2', 'DarkKnight3', 'DarkKnight4', 'DarkKnight5'
];

// ========== VARIABEL ==========
const bots = new Map();
let connectedBots = 0;
let failedBots = 0;

// ========== LOG FUNCTION ==========
function log(message, type = 'INFO') {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] [${type}] ${message}`);
}

// ========== DAPATKAN NAMA BOT ==========
function getBotName(index) {
    if (index < botNames.length) {
        return botNames[index];
    }
    return `${config.botNamePrefix}${index + 1}`;
}

// ========== TAMPILKAN STATISTIK ==========
function showStats() {
    console.log('\n========== BOT STATISTICS ==========');
    console.log(`✅ Connected: ${connectedBots}`);
    console.log(`❌ Failed: ${failedBots}`);
    console.log(`📊 Target: ${config.botCount}`);
    console.log(`🟢 Online: ${bots.size}`);
    console.log('=====================================\n');
}

// ========== AMBIL KIT UNTUK SEMUA BOT ==========
function allBotsTakeKit(kitName) {
    bots.forEach((bot, id) => {
        setTimeout(() => {
            if (bot && bot.chat) {
                bot.chat(`/kit ${kitName}`);
            }
        }, id * 100);
    });
    log(`Semua bot (${bots.size}) mengambil kit: ${kitName}`, 'MASS');
}

// ========== TELEPORT SEMUA BOT ==========
function allBotsTeleport(x, y, z) {
    bots.forEach((bot, id) => {
        setTimeout(() => {
            if (bot && bot.chat) {
                bot.chat(`/tp ${bot.username} ${x} ${y} ${z}`);
            }
        }, id * 50);
    });
    log(`Teleport semua bot ke ${x},${y},${z}`, 'MASS');
}

// ========== SURUH SEMUA BOT NGOMONG ==========
function allBotsSay(message) {
    bots.forEach((bot, id) => {
        setTimeout(() => {
            if (bot && bot.chat) {
                bot.chat(message);
            }
        }, id * 200);
    });
    log(`Semua bot ngomong: ${message}`, 'MASS');
}

// ========== BUAT BOT ==========
function createBot(index) {
    const botId = index + 1;
    const botName = getBotName(index);
    
    log(`Membuat bot ${botName} (${botId}/${config.botCount})...`, 'CREATE');
    
    const bot = mineflayer.createBot({
        host: config.host,
        port: config.port,
        username: botName,
        version: config.version,
        auth: config.auth,
        viewDistance: 'short',
        disableChatSigning: true
    });
    
    bots.set(botId, bot);
    
    // ========== EVENT ==========
    
    bot.on('login', () => {
        log(`✅ ${botName} login!`, 'SUCCESS');
    });
    
    bot.on('spawn', () => {
        connectedBots++;
        log(`✅ ${botName} spawn! (${connectedBots}/${config.botCount})`, 'SUCCESS');
        
        // Auto chat biar keliatan hidup
        setTimeout(() => {
            if (bot && bot.chat) {
                bot.chat('🤖 Bot siap PVP!');
            }
        }, 3000);
    });
    
    // Handle chat command dari owner
    bot.on('chat', (username, message) => {
        if (username === config.ownerName && message.startsWith('!')) {
            const args = message.slice(1).split(' ');
            const cmd = args[0].toLowerCase();
            
            if (cmd === 'allkit' && args[1]) {
                allBotsTakeKit(args[1]);
                bot.chat(`✅ Semua bot mengambil kit ${args[1]}`);
            }
            else if (cmd === 'alltp' && args[1] && args[2] && args[3]) {
                allBotsTeleport(parseInt(args[1]), parseInt(args[2]), parseInt(args[3]));
                bot.chat(`✅ Semua bot teleport ke ${args[1]} ${args[2]} ${args[3]}`);
            }
            else if (cmd === 'allsay') {
                const msg = args.slice(1).join(' ');
                if (msg) {
                    allBotsSay(msg);
                    bot.chat(`✅ Semua bot ngomong: ${msg}`);
                }
            }
            else if (cmd === 'stats') {
                showStats();
                bot.chat(`✅ ${connectedBots}/${config.botCount} bot online`);
            }
            else if (cmd === 'help') {
                bot.chat(`📋 Command: !allkit <nama> | !alltp x y z | !allsay <pesan> | !stats`);
            }
        }
    });
    
    // Auto respon biar keliatan hidup
    bot.on('chat', (username, message) => {
        if (username === bot.username) return;
        
        const msg = message.toLowerCase();
        
        if (msg.includes(`hi ${bot.username.toLowerCase()}`) || msg.includes(`halo ${bot.username.toLowerCase()}`)) {
            setTimeout(() => {
                if (bot && bot.chat) bot.chat(`@${username} Halo!`);
            }, 500);
        }
    });
    
    // Auto reconnect
    bot.on('end', (reason) => {
        connectedBots--;
        bots.delete(botId);
        log(`❌ ${botName} disconnect: ${reason}`, 'ERROR');
        
        // Reconnect setelah 5 detik
        setTimeout(() => {
            if (bots.size < config.botCount) {
                log(`🔄 Reconnect ${botName}...`, 'RECONNECT');
                createBot(index);
            }
        }, 5000);
    });
    
    bot.on('error', (err) => {
        failedBots++;
        log(`⚠️ ${botName} error: ${err.message}`, 'ERROR');
    });
    
    bot.on('kicked', (reason) => {
        connectedBots--;
        bots.delete(botId);
        log(`🚫 ${botName} di-kick: ${reason}`, 'ERROR');
    });
    
    return bot;
}

// ========== START SEMUA BOT ==========
function startAllBots() {
    log(`Memulai ${config.botCount} bot...`, 'START');
    log(`Target: ${config.host}:${config.port}`, 'INFO');
    
    for (let i = 0; i < config.botCount; i++) {
        setTimeout(() => {
            createBot(i);
        }, i * config.connectionDelay);
    }
    
    // Tampilkan stats tiap 30 detik
    setInterval(() => {
        showStats();
    }, 30000);
}

// ========== MULAI ==========
startAllBots();

// Handle exit
process.on('SIGINT', () => {
    console.log('\n🛑 Mematikan semua bot...');
    bots.forEach((bot) => {
        if (bot && bot.end) bot.end();
    });
    setTimeout(() => process.exit(0), 2000);
});
