const mineflayer = require('mineflayer');
const { pathfinder, Goals } = require('mineflayer-pathfinder');
const pvp = require('mineflayer-pvp');
const autoEat = require('mineflayer-auto-eat');

const SERVER = {
    host: '191.96.231.19',
    port: 10109,
    version: '1.21.11',
    auth: 'offline'
};

const TARGET_NAME = 'elestiaxd';  // GANTI DENGAN USERNAME TARGET LO
const BOT_NAME = 'HunterBot';

let targetPlayer = null;
let isFighting = false;

const bot = mineflayer.createBot({
    host: SERVER.host,
    port: SERVER.port,
    username: BOT_NAME,
    version: SERVER.version,
    auth: SERVER.auth
});

// Load plugins
bot.loadPlugin(pathfinder);
bot.loadPlugin(pvp);
bot.loadPlugin(autoEat);

bot.on('login', () => {
    console.log(`✅ ${BOT_NAME} connected!`);
});

bot.on('spawn', () => {
    console.log(`🌍 ${BOT_NAME} spawned!`);
    console.log(`🎯 Target: ${TARGET_NAME}`);
    
    // Auto eat
    bot.autoEat.options = {
        priority: 'foodPoints',
        startAt: 14,
        bannedFood: ['poisonous_potato', 'spider_eye']
    };
    
    // Ambil kit
    setTimeout(() => {
        bot.chat('/kit elestiaxd');
        console.log(`📦 Kit diambil`);
    }, 2000);
    
    // Mulai mencari target
    setTimeout(() => {
        findAndAttack();
    }, 5000);
});

// Fungsi mencari target
function findAndAttack() {
    const players = Object.values(bot.players);
    targetPlayer = players.find(p => p.username === TARGET_NAME);
    
    if (!targetPlayer) {
        console.log(`🔍 Target ${TARGET_NAME} not found, searching...`);
        setTimeout(findAndAttack, 5000);
        return;
    }
    
    if (!targetPlayer.entity) {
        console.log(`👤 Target ${TARGET_NAME} is too far, getting closer...`);
        setTimeout(findAndAttack, 3000);
        return;
    }
    
    console.log(`⚔️ Target found! Attacking ${TARGET_NAME}!`);
    attackTarget();
}

// Fungsi menyerang
function attackTarget() {
    if (!targetPlayer || !targetPlayer.entity) {
        isFighting = false;
        findAndAttack();
        return;
    }
    
    isFighting = true;
    
    // Gerak mendekati target
    const goal = new Goals.GoalFollow(targetPlayer.entity, 2);
    bot.pathfinder.setGoal(goal, true);
    
    // Serang target
    bot.pvp.attack(targetPlayer.entity);
    
    console.log(`⚔️ Fighting ${TARGET_NAME}...`);
}

// Handle ketika kalah/target mati
bot.on('playerDied', (player) => {
    if (player.username === TARGET_NAME) {
        console.log(`💀 Target ${TARGET_NAME} has been killed!`);
        isFighting = false;
        bot.pvp.stop();
        
        // Cari target lagi setelah 5 detik (respawn)
        setTimeout(() => {
            findAndAttack();
        }, 5000);
    }
});

// Handle diserang balik
bot.on('entityHurt', (entity) => {
    if (entity === bot.entity) {
        const attacker = findAttacker();
        if (attacker && !isFighting) {
            console.log(`⚠️ Attacked by ${attacker.username}, fighting back!`);
            bot.pvp.attack(attacker.entity);
        }
    }
});

// Cari siapa yang nyerang bot
function findAttacker() {
    const players = Object.values(bot.players);
    return players.find(p => p.entity && p.entity.position.distanceTo(bot.entity.position) < 5);
}

// Auto heal dan makan
bot.on('health', () => {
    if (bot.health < 14) {
        console.log(`❤️ Health low: ${bot.health}, eating...`);
        bot.autoEat.eat();
    }
});

// Reconnect jika disconnect
bot.on('end', (reason) => {
    console.log(`❌ Bot disconnected: ${reason}`);
    console.log(`🔄 Reconnecting in 10 seconds...`);
    setTimeout(() => process.exit(1), 10000);
});

bot.on('error', (err) => {
    console.log(`⚠️ Error: ${err.message}`);
});

console.log(`🚀 Starting PVP Bot...`);
console.log(`🎯 Target: ${TARGET_NAME}`);
