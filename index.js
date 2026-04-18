const mineflayer = require('mineflayer');

// ========== KONFIGURASI ==========
const SERVER = {
    host: '191.96.231.19',
    port: 10109,
    version: '1.21.11',
    auth: 'offline'
};

const TOTAL_BOTS = 20;
const TARGET_NAME = 'elestiaxd';

// Nama-nama bot biar keliatan real
const BOT_NAMES = [
    'ShadowHunter', 'NightBlade', 'CrimsonFury', 'IronViper', 'StormBringer',
    'MoonWalker', 'DragonSlayer', 'PhantomKnight', 'SilverWolf', 'DarkEmperor',
    'FrostGiant', 'ThunderBolt', 'WildFire', 'IceQueen', 'StoneGuardian',
    'VenomStrike', 'SkyReaper', 'BloodMoon', 'GhostRider', 'SolarFlare'
];

// Pesan chat random (biar keliatan hidup)
const RANDOM_CHATS = [
    'gg', 'wp', 'nice fight', 'lol', 'ez', 'where is the target?',
    'let s go', 'good luck', 'hmm', 'interesting', 'bruh', 'no way',
    'im coming', 'get ready', 'nice', 'bruh moment', 'lets end this'
];

// ========== VARIABEL ==========
let bots = [];
let targetEntity = null;

// ========== FUNGSI RANDOM ==========
function randomDelay(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomChat() {
    return RANDOM_CHATS[Math.floor(Math.random() * RANDOM_CHATS.length)];
}

function randomMovement(bot) {
    if (!bot || !bot.entity) return;
    
    // Gerak random kayak manusia (looking around)
    const yaw = Math.random() * Math.PI * 2;
    const pitch = (Math.random() - 0.5) * Math.PI / 3;
    bot.look(yaw, pitch);
    
    // Lompat random
    if (Math.random() > 0.8) {
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 200);
    }
    
    // Jalan maju random
    if (Math.random() > 0.7) {
        bot.setControlState('forward', true);
        setTimeout(() => bot.setControlState('forward', false), randomDelay(500, 2000));
    }
}

// ========== EQUIP INVENTORY ==========
function equipBestGear(bot) {
    if (!bot || !bot.inventory) return;
    
    const items = bot.inventory.items();
    
    // Cari armor terbaik
    const helmets = items.filter(i => i.name.includes('helmet'));
    const chestplates = items.filter(i => i.name.includes('chestplate'));
    const leggings = items.filter(i => i.name.includes('leggings'));
    const boots = items.filter(i => i.name.includes('boots'));
    const swords = items.filter(i => i.name.includes('sword'));
    const axes = items.filter(i => i.name.includes('axe'));
    const food = items.filter(i => i.name === 'golden_apple' || i.name === 'cooked_beef' || i.name === 'bread');
    
    // Equip armor
    if (helmets.length) bot.equip(helmets[0], 'head');
    if (chestplates.length) bot.equip(chestplates[0], 'torso');
    if (leggings.length) bot.equip(leggings[0], 'legs');
    if (boots.length) bot.equip(boots[0], 'feet');
    
    // Equip weapon (prioritas sword > axe)
    if (swords.length) bot.equip(swords[0], 'hand');
    else if (axes.length) bot.equip(axes[0], 'hand');
    
    console.log(`[${bot.username}] ⚔️ Gear equipped | HP: ${bot.health}`);
}

// ========== COBA AMBIL KIT ==========
function takeKit(bot) {
    setTimeout(() => {
        if (bot && bot.chat) {
            bot.chat('/kit elestiaxd');
            console.log(`[${bot.username}] 📦 Taking kit...`);
            
            // Equip setelah ambil kit
            setTimeout(() => equipBestGear(bot), 1000);
        }
    }, randomDelay(2000, 5000));
}

// ========== MAKAN OTOMATIS ==========
function autoEat(bot) {
    if (!bot || bot.health >= 18) return;
    
    const food = bot.inventory.items().find(i => 
        i.name === 'golden_apple' || 
        i.name === 'cooked_beef' || 
        i.name === 'bread' ||
        i.name === 'apple'
    );
    
    if (food) {
        bot.equip(food, 'hand');
        bot.consume();
        console.log(`[${bot.username}] 🍎 Eating ${food.name}, HP: ${bot.health}`);
    }
}

// ========== CARI & SERANG TARGET ==========
function searchTarget(bot) {
    if (!bot) return null;
    
    const players = Object.values(bot.players);
    return players.find(p => p.username === TARGET_NAME && p.entity);
}

function attackTarget(bot) {
    const target = searchTarget(bot);
    
    if (!target) {
        if (Math.random() > 0.9) {
            bot.chat(`🔍 Where is ${TARGET_NAME}?`);
        }
        return false;
    }
    
    const distance = bot.entity.position.distanceTo(target.entity.position);
    
    // Gerak mendekati target
    if (distance > 4) {
        const direction = target.entity.position.minus(bot.entity.position).normalize();
        bot.setControlState('forward', true);
        
        // Look at target
        bot.lookAt(target.entity.position.offset(0, 1.5, 0));
        
        if (Math.random() > 0.95) {
            bot.chat(`🏃‍♂️ Coming for you ${TARGET_NAME}!`);
        }
    } 
    // Serang kalo dekat
    else if (distance < 4) {
        bot.attack(target.entity);
        
        if (Math.random() > 0.97) {
            bot.chat(`⚔️ Take that ${TARGET_NAME}!`);
        }
    }
    
    return true;
}

// ========== BUAT SATU BOT ==========
function createBot(index) {
    const botName = BOT_NAMES[index % BOT_NAMES.length];
    let lastMoveTime = Date.now();
    let lastChatTime = Date.now();
    let lastAttackTime = Date.now();
    
    const bot = mineflayer.createBot({
        host: SERVER.host,
        port: SERVER.port,
        username: botName,
        version: SERVER.version,
        auth: SERVER.auth
    });
    
    bots.push(bot);
    
    // ========== EVENT LOGIN ==========
    bot.on('login', () => {
        console.log(`✅ [${botName}] Connected (${bots.length}/${TOTAL_BOTS})`);
    });
    
    // ========== EVENT SPAWN ==========
    bot.on('spawn', () => {
        console.log(`🌍 [${botName}] Spawned at ${Math.floor(bot.entity.position.x)}, ${Math.floor(bot.entity.position.z)}`);
        
        // Ambil kit dan equip
        takeKit(bot);
        
        // Chat welcome random
        setTimeout(() => {
            bot.chat(`Hey everyone! I'm ${botName}`);
        }, randomDelay(3000, 8000));
    });
    
    // ========== LOOPING BEHAVIOR (KAYAK MANUSIA) ==========
    setInterval(() => {
        if (!bot || !bot.entity) return;
        
        const now = Date.now();
        
        // Random movement setiap 3-7 detik
        if (now - lastMoveTime > randomDelay(3000, 7000)) {
            randomMovement(bot);
            lastMoveTime = now;
        }
        
        // Random chat setiap 20-40 detik
        if (now - lastChatTime > randomDelay(20000, 40000)) {
            if (Math.random() > 0.7) {
                bot.chat(randomChat());
                lastChatTime = now;
            }
        }
        
        // Auto eat kalo perlu
        if (bot.health < 16) {
            autoEat(bot);
        }
        
        // Cari & serang target setiap 0.5 detik
        if (now - lastAttackTime > 500) {
            const targetFound = attackTarget(bot);
            lastAttackTime = now;
            
            // Kalo gak nemu target, gerak random nyari
            if (!targetFound && Math.random() > 0.8) {
                const randomYaw = Math.random() * Math.PI * 2;
                bot.look(randomYaw, 0);
                bot.setControlState('forward', true);
                setTimeout(() => bot.setControlState('forward', false), randomDelay(1000, 3000));
            }
        }
        
    }, 1000);
    
    // ========== KALO KENA SERANG ==========
    bot.on('entityHurt', (entity) => {
        if (entity === bot.entity) {
            const attacker = Object.values(bot.players).find(p => 
                p.entity && p.entity.position.distanceTo(bot.entity.position) < 6
            );
            
            if (attacker && attacker.username !== bot.username) {
                console.log(`[${bot.username}] ⚠️ Attacked by ${attacker.username}!`);
                bot.chat(`Ouch! ${attacker.username} attacked me!`);
                
                // Langsung serang balik
                if (attacker.entity) {
                    bot.attack(attacker.entity);
                }
            }
        }
    });
    
    // ========== KALO TARGET MATI ==========
    bot.on('playerDied', (player) => {
        if (player.username === TARGET_NAME) {
            console.log(`💀 [${bot.username}] ${TARGET_NAME} has been killed!`);
            bot.chat(`Got em! ${TARGET_NAME} is down!`);
        }
    });
    
    // ========== KALO BOT MATI ==========
    bot.on('death', () => {
        console.log(`💀 [${bot.username}] Died, respawning...`);
        setTimeout(() => {
            if (bot && bot.chat) {
                bot.chat(`I'm back!`);
                takeKit(bot);
            }
        }, 3000);
    });
    
    // ========== KALO KICK ==========
    bot.on('kicked', (reason) => {
        console.log(`❌ [${bot.username}] Kicked: ${reason}`);
        bots = bots.filter(b => b !== bot);
    });
    
    // ========== KALO ERROR ==========
    bot.on('error', (err) => {
        console.log(`⚠️ [${bot.username}] Error: ${err.message}`);
    });
    
    // ========== KALO DC ==========
    bot.on('end', () => {
        console.log(`❌ [${bot.username}] Disconnected`);
        bots = bots.filter(b => b !== bot);
    });
    
    return bot;
}

// ========== START SEMUA BOT ==========
console.log(`\n🚀 Starting ${TOTAL_BOTS} professional PVP bots...`);
console.log(`🎯 Target: ${TARGET_NAME}`);
console.log(`📍 Server: ${SERVER.host}:${SERVER.port}\n`);

for (let i = 0; i < TOTAL_BOTS; i++) {
    setTimeout(() => {
        createBot(i);
    }, i * 2000);
}

// ========== STATISTIK ==========
setInterval(() => {
    const alive = bots.filter(b => b && b.entity).length;
    console.log(`\n📊 Bot Status: ${alive}/${TOTAL_BOTS} online\n`);
}, 30000);

// ========== HANDLE EXIT ==========
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down all bots...');
    bots.forEach(bot => {
        if (bot && bot.end) bot.end();
    });
    setTimeout(() => process.exit(0), 2000);
});
