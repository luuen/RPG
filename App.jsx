const { useState, useEffect, useRef } = React;

// GitHub Pages serves from /RPG/ subpath; local dev serves from root
const ASSET_BASE = window.location.hostname.includes("github.io") ? "/RPG" : "";

/* ─── GLOBAL STYLES ──────────────────────────────────────────── */
const GS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=IM+Fell+English:ital@0;1&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{background:#020205;overflow:hidden;user-select:none;color:#e8d5a3;font-family:'IM Fell English',serif}
.btn{background:#1a1a2a;border:1px solid #444;color:#e8d5a3;padding:12px 20px;cursor:pointer;font-family:'Cinzel';transition:.2s;text-transform:uppercase;font-size:13px;letter-spacing:1px}
.btn:hover{background:#2a2a4a;border-color:#e8d5a3;box-shadow:0 0 15px rgba(232,213,163,.25)}
.btn:disabled{opacity:.3;cursor:default;pointer-events:none}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
@keyframes glow{0%,100%{text-shadow:0 0 20px currentColor}50%{text-shadow:0 0 50px currentColor,0 0 90px currentColor}}
@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-7px)}40%{transform:translateX(7px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}
@keyframes slideUp{from{transform:translateY(24px);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes hitFlash{0%{filter:brightness(1)saturate(1)}35%{filter:brightness(5)saturate(0)}100%{filter:brightness(1)saturate(1)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes scaleIn{from{transform:scale(.92);opacity:0}to{transform:scale(1);opacity:1}}
@keyframes squish{0%{transform:scaleX(1)scaleY(1)}40%{transform:scaleX(1.45)scaleY(.55)}100%{transform:scaleX(1)scaleY(1)}}
@keyframes actionCmd{0%{transform:scale(0) translateY(8px);opacity:0}50%{transform:scale(1.3) translateY(0);opacity:1}70%{transform:scale(1) translateY(0);opacity:1}100%{transform:scale(1) translateY(0);opacity:1}}
@keyframes stompDust{0%{transform:scale(0);opacity:.7}100%{transform:scale(2.8);opacity:0}}
@keyframes beamPulse{0%,100%{opacity:.35;filter:blur(1px)}50%{opacity:.85;filter:blur(0)}}
@keyframes ringPulse{0%,100%{box-shadow:0 0 12px currentColor}50%{box-shadow:0 0 32px currentColor,0 0 60px currentColor}}
@keyframes runeIn{from{transform:scale(0) rotate(-15deg);opacity:0}to{transform:scale(1) rotate(0);opacity:1}}
@keyframes tapBar{from{opacity:.5}to{opacity:1}}
@keyframes dialPing{0%{transform:scale(1)}50%{transform:scale(1.6)}100%{transform:scale(1)}}
@keyframes dotPulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.4);opacity:.7}}
@keyframes bowPull{0%{transform:rotate(0deg)}100%{transform:rotate(-18deg)}}
@keyframes chargeBar{from{box-shadow:0 0 4px #ff8833}to{box-shadow:0 0 18px #ffcc44,0 0 40px #ff8833}}
@keyframes chargeRelease{from{transform:translateX(-50%) scale(1);opacity:1}to{transform:translateX(-50%) scale(1.18);opacity:.7}}
@keyframes parryFlash{0%{opacity:0}15%{opacity:.75}60%{opacity:.45}100%{opacity:0}}
@keyframes parryText{0%{transform:translate(-50%,-50%) scale(.5);opacity:0}20%{transform:translate(-50%,-50%) scale(1.4);opacity:1}55%{transform:translate(-50%,-50%) scale(1.1);opacity:1}100%{transform:translate(-50%,-50%) scale(1.3);opacity:0}}
@keyframes particleFly{0%{opacity:1;transform:translate(0,0) scale(1)}100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(.1)}}
@keyframes beatBar{from{opacity:.6}to{opacity:1}}
@keyframes goblinBob{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-4px) rotate(1.5deg)}}
@keyframes goblinEye{0%,100%{transform:scale(1)}50%{transform:scale(1.25)}}
@keyframes skelRattle{0%,100%{transform:rotate(0deg)}30%{transform:rotate(-2.5deg)}70%{transform:rotate(2.5deg)}}
@keyframes skelJaw{0%,100%{transform:translateY(0)}50%{transform:translateY(2px)}}
@keyframes eyeIris{0%,100%{transform:scale(1)}50%{transform:scale(1.18)}}
@keyframes eyeTendril{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
@keyframes wraithDrift{0%,100%{transform:translateY(0) scaleX(1);opacity:.85}50%{transform:translateY(-6px) scaleX(1.06);opacity:.6}}
@keyframes wraithTail{0%,100%{d:path("M14 48 Q10 60 8 72 Q14 66 20 72 Q26 66 32 72 Q38 66 44 72 Q42 60 38 48")}50%{d:path("M14 48 Q8 58 10 72 Q16 64 20 72 Q26 68 32 72 Q36 64 44 72 Q44 60 38 48")}}
@keyframes golemRumble{0%,100%{transform:rotate(0deg) translateX(0)}33%{transform:rotate(-.8deg) translateX(-1px)}66%{transform:rotate(.8deg) translateX(1px)}}
@keyframes dragonWingL{0%,100%{transform:rotate(0deg)}50%{transform:rotate(-12deg)}}
@keyframes dragonWingR{0%,100%{transform:rotate(0deg)}50%{transform:rotate(12deg)}}
@keyframes dragonHead{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
@keyframes heroBreath{0%,100%{transform:scaleY(1)}50%{transform:scaleY(1.04)}}
@keyframes weaponOrbit{from{transform:rotate(0deg) translateX(var(--r,50px)) rotate(0deg)}to{transform:rotate(360deg) translateX(var(--r,50px)) rotate(-360deg)}}
@keyframes weaponBob{0%,100%{filter:drop-shadow(0 0 4px #ffcc4488)}50%{filter:drop-shadow(0 0 12px #ffcc44cc)}}
@keyframes golemFist{0%,100%{transform:translateY(0)}50%{transform:translateY(6px)}}
@keyframes dualKeyPop{0%{transform:scale(1)}40%{transform:scale(1.35)}100%{transform:scale(1)}}
@keyframes dualDotPing{0%{transform:translate(-50%,-50%) scale(1)}50%{transform:translate(-50%,-50%) scale(1.8);opacity:.4}100%{transform:translate(-50%,-50%) scale(1);opacity:1}}
@keyframes dualTrackPulse{0%,100%{box-shadow:0 0 8px currentColor}50%{box-shadow:0 0 22px currentColor,0 0 44px currentColor}}
@keyframes bookFlipOpen{0%{transform:perspective(600px) rotateY(0deg);opacity:.9}100%{transform:perspective(600px) rotateY(-160deg);opacity:1}}
@keyframes bookPageIn{from{transform:perspective(400px) rotateY(-90deg);opacity:0}to{transform:perspective(400px) rotateY(0deg);opacity:1}}
@keyframes bookBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
@keyframes potionHint{0%,100%{opacity:.55}50%{opacity:.9}}
@keyframes dragonBreath{0%{opacity:0;transform:scaleX(0)}40%{opacity:.9}100%{opacity:0;transform:scaleX(1.4)}}
@keyframes skelSwing{0%,100%{transform:rotate(0deg)}50%{transform:rotate(-18deg)}}
@keyframes eyePulse{0%,100%{transform:scale(1);opacity:.7}50%{transform:scale(1.08);opacity:1}}
@keyframes wraithWail{0%,100%{transform:scaleX(1)}50%{transform:scaleX(1.15)}}
`;


/* ─── WEAPON DATA ────────────────────────────────────────────── */
const STARTER_WEAPONS = {
  sword:      { id:"sword",      name:"Iron Sword",    emoji:"⚔️", baseDmg:12, speed:2.2, qteType:"swing_beat",  desc:"Press A when dial hits LEFT, D when it hits RIGHT. Hit the beat!", classEmoji:"🛡️", className:"Knight"    },
  hammer:     { id:"hammer",     name:"War Hammer",    emoji:"🔨", baseDmg:22, speed:1.0, qteType:"hold_release",desc:"Hold SPACE to charge. Release in the GREEN zone — too long = OVERCHARGE!", classEmoji:"⚒️", className:"Berserker" },
  daggers:    { id:"daggers",    name:"Shadow Daggers",emoji:"🗡️", baseDmg:9,  speed:3.0, qteType:"rapid_tap",  tapTarget:8, desc:"Mash SPACE 8 times before the timer runs out. Go fast!", classEmoji:"🐍", className:"Rogue"     },
  staff:      { id:"staff",      name:"Arcane Staff",  emoji:"🪄", baseDmg:16, speed:1.8, qteType:"sequence",   seqLength:4, desc:"Type the 4-letter rune sequence shown. One wrong key = restart!", classEmoji:"🌙", className:"Mage"      },
  bow:        { id:"bow",        name:"Elven Bow",     emoji:"🏹", baseDmg:8,  speed:1.5, qteType:"archery",    desc:"3 orbiting dots — press SPACE when each is in the center ring.", classEmoji:"🌿", className:"Ranger"    },
  sword_gun:  { id:"sword_gun",  name:"Sword & Gun",   emoji:"⚔🔫", baseDmg:30, speed:1.8, qteType:"dual_action", dotSpeed:1.80, centerWidth:0.20, classEmoji:"🔫", className:"Duelist",    desc:"Hold A+W+D simultaneously, then LEFT CLICK when the dot hits the center zone." },
};
const ALL_WEAPONS = {
  ...STARTER_WEAPONS,
  boots:       { id:"boots",       name:"Iron Boots",     emoji:"👟", baseDmg:8,  speed:1.4, qteType:"stomp",        classEmoji:"👊", className:"Brawler"     },
  axe:         { id:"axe",         name:"Battle Axe",     emoji:"🪓", baseDmg:19, speed:1.1, qteType:"hold_release", classEmoji:"🪓", className:"Warrior"     },
  spear:       { id:"spear",       name:"Iron Spear",     emoji:"🔱", baseDmg:15, speed:1.9, qteType:"poke",         classEmoji:"🔱", className:"Lancer"      },
  wand:        { id:"wand",        name:"Chaos Wand",     emoji:"✨", baseDmg:18, speed:2.0, qteType:"sequence",        seqLength:3, classEmoji:"✨", className:"Sorcerer"   },
  rpg:         { id:"rpg",         name:"RPG",            emoji:"🚀", baseDmg:55, speed:1.2, qteType:"sequence_reveal", seqLength:10, classEmoji:"💥", className:"Demolisher" },
  // ── DUAL ACTION weapons: hold A+W+D, click when dot centers ──
  sword_gun:    { id:"sword_gun",    name:"Sword & Gun",    emoji:"⚔🔫", baseDmg:30, speed:1.8, qteType:"dual_action", dotSpeed:1.80, centerWidth:0.20, classEmoji:"🔫", className:"Duelist",     desc:"Hold A+W+D, then LEFT CLICK when the dot hits the center zone." },
  knife_shotgun:{ id:"knife_shotgun",name:"Knife & Shotgun",emoji:"🔪💥", baseDmg:24, speed:2.2, qteType:"dual_action", dotSpeed:2.60, centerWidth:0.30, classEmoji:"💥", className:"Brawgunner",  desc:"Fast chaotic dot — wide zone saves you. Hold A+W+D and click." },
  sniper_spear: { id:"sniper_spear", name:"Sniper & Spear", emoji:"🎯🔱", baseDmg:55, speed:1.0, qteType:"dual_action", dotSpeed:0.90, centerWidth:0.07, classEmoji:"🎯", className:"Deadeye",     desc:"Slow dot, tiny zone. Nail it for massive damage. Hold A+W+D, click center." },
  axe_pistol:   { id:"axe_pistol",   name:"Axe & Pistol",  emoji:"🪓🔫", baseDmg:36, speed:1.5, qteType:"dual_action", dotSpeed:2.10, centerWidth:0.14, classEmoji:"🪓", className:"Gunslinger",  desc:"Medium speed, punishing zone. Hold A+W+D, click the center." },
  club_musket:  { id:"club_musket",  name:"Club & Musket",  emoji:"🏏💥", baseDmg:46, speed:1.0, qteType:"dual_action", dotSpeed:0.70, centerWidth:0.10, classEmoji:"💥", className:"Rifleman",    desc:"Agonisingly slow dot, tiny zone — massive payoff. Hold A+W+D, click." },
};

/* ─── ENEMY DATA ─────────────────────────────────────────────── */
const ENEMIES = {
  goblin:   { name:"Goblin Scout",     hp:22,  emoji:"👺", xp:20,  atk:5,  color:"#55bb55", desc:"A cunning little pest"      },
  skeleton: { name:"Skeleton Warrior", hp:32,  emoji:"💀", xp:30,  atk:7,  color:"#aaaaaa", desc:"Bones that refuse to rest"  },
  eye:      { name:"Void Eye",         hp:28,  emoji:"👁️", xp:35,  atk:10, color:"#9944ff", desc:"It sees into your soul"     },
  golem:    { name:"Stone Golem",      hp:65,  emoji:"🗿", xp:55,  atk:12, color:"#aa7744", desc:"Ancient earth made flesh"   },
  wraith:   { name:"Wailing Wraith",   hp:40,  emoji:"👻", xp:45,  atk:14, color:"#4488ff", desc:"A spirit of pure malice"    },
  dragon:   { name:"Demon Slime",       hp:150, emoji:"🟢", xp:500, atk:18, color:"#44dd66", desc:"A demonic mass of pure malice" },
};
const ENEMY_DIMS = {
  goblin:{w:64,h:78}, skeleton:{w:56,h:88}, eye:{w:80,h:80},
  golem:{w:84,h:88},  wraith:{w:64,h:96},   dragon:{w:128,h:128},
};

// Enemy sprite pool — 9 variants randomized per encounter (dragon excluded)
const ENEMY_SPRITE_POOL = [
  {variant:"Gorgon_1",  name:"Gorgon",        dir:"free-gorgon-pixel-art-character-sprite-sheets",   frameW:128,frameH:128,idleFrames:7, atkFile:"Attack_1.png",atkFrames:16},
  {variant:"Gorgon_2",  name:"Gorgon",        dir:"free-gorgon-pixel-art-character-sprite-sheets",   frameW:128,frameH:128,idleFrames:7, atkFile:"Attack_1.png",atkFrames:16},
  {variant:"Gorgon_3",  name:"Gorgon",        dir:"free-gorgon-pixel-art-character-sprite-sheets",   frameW:128,frameH:128,idleFrames:7, atkFile:"Attack_1.png",atkFrames:16},
  {variant:"Minotaur_1",name:"Minotaur",      dir:"free-minotaur-sprite-sheet-pixel-art-pack",       frameW:128,frameH:128,idleFrames:10,atkFile:"Attack.png",  atkFrames:5 },
  {variant:"Minotaur_2",name:"Minotaur",      dir:"free-minotaur-sprite-sheet-pixel-art-pack",       frameW:128,frameH:128,idleFrames:10,atkFile:"Attack.png",  atkFrames:5 },
  {variant:"Minotaur_3",name:"Minotaur",      dir:"free-minotaur-sprite-sheet-pixel-art-pack",       frameW:128,frameH:128,idleFrames:10,atkFile:"Attack.png",  atkFrames:5 },
  {variant:"Black_Werewolf",name:"Black Werewolf",dir:"free-werewolf-sprite-sheets-pixel-art",       frameW:128,frameH:128,idleFrames:8, atkFile:"Attack_1.png",atkFrames:6 },
  {variant:"Red_Werewolf",  name:"Red Werewolf",  dir:"free-werewolf-sprite-sheets-pixel-art",       frameW:128,frameH:128,idleFrames:8, atkFile:"Attack_1.png",atkFrames:6 },
  {variant:"White_Werewolf",name:"White Werewolf",dir:"free-werewolf-sprite-sheets-pixel-art",       frameW:128,frameH:128,idleFrames:8, atkFile:"Attack_1.png",atkFrames:6 },
];

// Gandalf layered hero sprites — randomized per run
const BASE = ASSET_BASE+"/icons/sprites/GandalfHardcore Character Asset Pack";
const HERO_LAYERS = {
  male: {
    skins:    ["Male Skin1.png","Male Skin2.png","Male Skin3.png","Male Skin4.png","Male Skin5.png"],
    clothing: ["Blue Pants.png","Blue Shirt v2.png","Boots.png","Green Pants.png","Green Shirt v2.png",
               "Orange Pants.png","Pants.png","Purple Pants.png","Purple Shirt v2.png","Shirt.png","Shoes.png"],
    hair:     ["Male Hair1.png","Male Hair2.png","Male Hair3.png","Male Hair4.png","Male Hair5.png"],
    hand:     ["Male Sword.png"],
    skinDir:  `${BASE}/Character skin colors`,
    clothDir: `${BASE}/Male Clothing`,
    hairDir:  `${BASE}/Male Hair`,
    handDir:  `${BASE}/Male Hand`,
    frameW:100, frameH:56, totalRows:8,  // measured: 800×448, 8 cols × 8 rows
    cols:8, idleRow:0, atkRow:4,
  },
  female: {
    skins:    ["Female Skin1.png","Female Skin2.png","Female Skin3.png","Female Skin4.png","Female Skin5.png"],
    clothing: ["Blue Corset.png","Blue Corset v2.png","Boots.png","Corset.png","Green Corset.png",
               "Orange Corset.png","Purple Corset.png","Skirt.png","Socks.png"],
    hair:     ["Female Hair1.png","Female Hair2.png","Female Hair3.png","Female Hair4.png","Female Hair5.png"],
    hand:     ["Female Sword.png"],
    skinDir:  `${BASE}/Character skin colors`,
    clothDir: `${BASE}/Female Clothing`,
    hairDir:  `${BASE}/Female Hair`,
    handDir:  `${BASE}/Female Hand`,
    frameW:100, frameH:56, totalRows:8,
    cols:8, idleRow:0, atkRow:4,
  },
};
const pick = (arr) => arr[Math.floor(Math.random()*arr.length)];
const randomHeroLooks = () => {
  const gender = Math.random()<0.5?"male":"female";
  const g = HERO_LAYERS[gender];
  return {
    gender,
    skin:     `${g.skinDir}/${pick(g.skins)}`,
    clothing: `${g.clothDir}/${pick(g.clothing)}`,
    hair:     `${g.hairDir}/${pick(g.hair)}`,
    hand:     `${g.handDir}/${pick(g.hand)}`,
    frameW:   g.frameW,
    frameH:   g.frameH,
    cols:     g.cols,
    idleRow:  g.idleRow,
  };
};

/* ─── MAP DATA ───────────────────────────────────────────────── */
const MAP_W = 520, MAP_H = 480;

// 5 floors of choices + boss. Clean, readable, deliberate pacing.
const FLOOR_CONFIGS = [
  [{ type:"combat", enemy:"goblin"   }, { type:"combat",  enemy:"skeleton" }],
  [{ type:"combat", enemy:"skeleton" }, { type:"rest"                      }, { type:"combat", enemy:"eye"    }],
  [{ type:"combat", enemy:"eye"      }, { type:"elite",   enemy:"goblin"   }, { type:"combat", enemy:"golem"  }],
  [{ type:"combat", enemy:"golem"    }, { type:"rest"                      }, { type:"combat", enemy:"wraith" }],
  [{ type:"elite",  enemy:"golem"    }, { type:"combat",  enemy:"wraith"   }, { type:"elite",  enemy:"wraith" }],
];

const MAP_DATA = (() => {
  const nodes = [];
  const padX = 70, topY = 44, botY = MAP_H - 44;
  const stepY = (botY - topY) / (FLOOR_CONFIGS.length); // 5 gaps for 5 floors + boss
  FLOOR_CONFIGS.forEach((cfgs, f) => {
    const y = botY - f * stepY;
    cfgs.forEach((cfg, i) => {
      const x = cfgs.length === 1 ? MAP_W/2 : padX + (MAP_W - 2*padX) * i / (cfgs.length - 1);
      nodes.push({ id:`${f}-${i}`, fl:f, x:Math.round(x), y:Math.round(y), ...cfg });
    });
  });
  nodes.push({ id:"boss", fl:FLOOR_CONFIGS.length, x:MAP_W/2, y:topY, type:"boss", enemy:"dragon" });
  return nodes;
})();

/* ─── POTIONS ────────────────────────────────────────────────── */
const POTIONS = [
  { id:"bomb",     name:"Bomb Vial",      emoji:"💣", desc:"Hurl at enemy — deals 25 damage",       effect:"damage",    value:25 },
  { id:"frost",    name:"Frost Flask",    emoji:"🧊", desc:"Weaken enemy — −40% attack this fight",  effect:"weaken",    value:0.40 },
  { id:"power",    name:"Power Brew",     emoji:"🔮", desc:"Empower self — +6 damage this fight",    effect:"strengthen",value:6 },
  { id:"mend",     name:"Mending Draught",emoji:"💉", desc:"Restore 20 HP instantly",               effect:"heal",      value:20 },
];

/* ─── REWARDS ────────────────────────────────────────────────── */
const BASE_REWARDS = [
  { id:"hp15",    type:"heal",   label:"Health Vial",    emoji:"🧪", desc:"Restore 15 HP",  value:15 },
  { id:"hp30",    type:"heal",   label:"Health Potion",  emoji:"⚗️", desc:"Restore 30 HP",  value:30 },
  { id:"str1",    type:"stat",   label:"Strength Shard", emoji:"💪", desc:"+1 Strength",     stat:"str",   value:1  },
  { id:"mhp10",   type:"stat",   label:"Vitality Shard", emoji:"❤️", desc:"+10 Max HP",      stat:"maxHp", value:10 },
  { id:"w_boots", type:"weapon", label:"Iron Boots",     emoji:"👟", weaponId:"boots" },
  { id:"w_axe",   type:"weapon", label:"Battle Axe",     emoji:"🪓", weaponId:"axe"   },
  { id:"w_spear", type:"weapon", label:"Iron Spear",     emoji:"🔱", weaponId:"spear" },
  { id:"w_wand",  type:"weapon", label:"Chaos Wand",     emoji:"✨", weaponId:"wand"  },
  // RPG excluded from drops — dragon kill only
  // Potions — each can appear at most once per pick
  ...POTIONS.map(pt=>({ id:`pot_${pt.id}`, type:"potion", label:pt.name, emoji:pt.emoji, desc:pt.desc, potion:pt })),
];
const pickRewards = (held, eliteDrop=false) => {
  const pool = BASE_REWARDS.filter(r => {
    if (r.type==="weapon" && held.includes(r.weaponId)) return false;
    if (r.eliteOnly && !eliteDrop) return false;
    return true;
  });
  const potions  = pool.filter(r=>r.type==="potion").sort(()=>Math.random()-.5);
  const others   = pool.filter(r=>r.type!=="potion").sort(()=>Math.random()-.5);
  // Always guarantee exactly 1 potion slot if any potion available
  const result = potions.length>0
    ? [potions[0], ...others.slice(0,2)]
    : others.slice(0,3);
  return result.sort(()=>Math.random()-.5); // shuffle final order
};

/* ─── BATTLEFIELD CONSTANTS ──────────────────────────────────── */
const STOMP_DUR = 800;
const LAND_FRAC = 0.52;
const STOMP_APPROACH_DUR = Math.round(STOMP_DUR * LAND_FRAC); // contact-0 duration: approach only
const BFW = 700, BFH = 250, GNDY = 228;
const HSW = Math.round(48 * 0.85);   // ≈ 41
const HSH = Math.round(76 * 0.85);   // ≈ 65
const HRX = 560;
const HR_L = HRX - HSW / 2;          // ≈ 539
const HR_T = GNDY - HSH;             // ≈ 163
const ENX = 130;
const STRIKE_L = 155;                 // hero left edge when touching enemy

function easeIO(t) { return t * t * (3 - 2 * t); }

function heroStompPos(t, landLeft, landTop) {
  if (t <= LAND_FRAC) {
    const s = easeIO(t / LAND_FRAC);
    const left = HR_L + (landLeft - HR_L) * s;
    const P0 = HR_T, P1 = 6, P2 = landTop;
    const top = (1-s)*(1-s)*P0 + 2*(1-s)*s*P1 + s*s*P2;
    return { left, top };
  } else {
    const s = easeIO((t - LAND_FRAC) / (1 - LAND_FRAC));
    const left = landLeft + (HR_L - landLeft) * s;
    const P0 = landTop, P1 = 40, P2 = HR_T;
    const top = (1-s)*(1-s)*P0 + 2*(1-s)*s*P1 + s*s*P2;
    return { left, top };
  }
}

// After bounce — arc from enemy head back to home position
function heroReturnHomePos(t, landLeft, landTop) {
  const s = easeIO(t);
  const left = landLeft + (HR_L - landLeft) * s;
  const P0 = landTop, P1 = 40, P2 = HR_T;
  const top = (1-s)*(1-s)*P0 + 2*(1-s)*s*P1 + s*s*P2;
  return { left, top };
}

// Bounce on enemy head — apex at top, land back at same spot (pogo)
function heroStompBouncePos(t, landLeft, landTop) {
  const APEX = -35; // above battlefield
  if (t <= LAND_FRAC) {
    const s = easeIO(t / LAND_FRAC);
    return { left: landLeft, top: landTop + (APEX - landTop) * s };
  } else {
    const s = easeIO((t - LAND_FRAC) / (1 - LAND_FRAC));
    return { left: landLeft, top: APEX + (landTop - APEX) * s };
  }
}

/* ─── SVG CHARACTER SPRITES ──────────────────────────────────── */

// Animates a horizontal sprite strip — JS-driven frame counter
function AnimatedSprite({ src, numFrames, fps=8, displayW, displayH, flip=false }) {
  const [frame, setFrame] = React.useState(0);
  React.useEffect(()=>{
    const iv = setInterval(()=>setFrame(f=>(f+1)%numFrames), 1000/fps);
    return ()=>clearInterval(iv);
  },[src, numFrames, fps]);
  return (
    <div style={{width:displayW,height:displayH,overflow:"hidden",position:"relative",
      transform:flip?"scaleX(-1)":"none",imageRendering:"pixelated"}}>
      <img src={src} style={{
        position:"absolute",left:-frame*displayW,top:0,
        height:displayH,width:numFrames*displayW,
        imageRendering:"pixelated",
      }}/>
    </div>
  );
}

// Hero sprite — single skin layer, idle row only.
// Pixel-precise bg positioning: scale so frameH === displayW, center within each frame.
// Rows isolated via exact px Y offset — no bleed from other animation rows.
function LayeredHeroSprite({ looks, displayW=48, isAttacking=false }) {
  if (!looks) return null;
  const cols      = looks.cols      || 8;
  const totalRows = looks.totalRows || 8;
  const idleRow   = looks.idleRow   || 0;
  const frameW    = looks.frameW    || 100;
  const frameH    = looks.frameH    || 56;
  const fps = 8;
  const [animFrame, setAnimFrame] = React.useState(0);
  React.useEffect(()=>{
    setAnimFrame(0);
    const iv = setInterval(()=>setAnimFrame(f=>(f+1)%cols), 1000/fps);
    return ()=>clearInterval(iv);
  },[cols, fps]);
  const src = looks.skin;
  if (!src) return null;
  const url = src.replace(/\\/g,"/").replace(/ /g,"%20");
  // Scale so frame height fills container exactly — wider frames get center-cropped
  const scale    = displayW / frameH;
  const scaledFW = Math.round(frameW * scale);
  const bgW      = cols      * scaledFW;
  const bgH      = totalRows * displayW;
  const bpX      = -(animFrame * scaledFW + Math.round((scaledFW - displayW) / 2));
  const bpY      = -(idleRow * displayW);
  return (
    <div style={{
      width: displayW, height: displayW,
      backgroundImage: `url("${url}")`,
      backgroundRepeat: "no-repeat",
      backgroundSize: `${bgW}px ${bgH}px`,
      backgroundPosition: `${bpX}px ${bpY}px`,
      imageRendering: "pixelated",
      overflow: "hidden",
    }}/>
  );
}

const CLASS_COLORS = {
  Knight:{body:"#4466bb",trim:"#ddaa33"}, Berserker:{body:"#882222",trim:"#dd6622"},
  Rogue:{body:"#223344",trim:"#44aaaa"},  Mage:{body:"#442288",trim:"#aa44ff"},
  Ranger:{body:"#224422",trim:"#44bb44"}, Brawler:{body:"#664422",trim:"#ccaa44"},
  Warrior:{body:"#556677",trim:"#aabbcc"},Lancer:{body:"#334455",trim:"#4488cc"},
  Sorcerer:{body:"#331144",trim:"#cc44ff"},
};
const SKIN = "#e8c47a";

function HeroSprite({ className="Knight", scale=1, weapons=[], heroLooks=null, isAttacking=false }) {
  const displayW = Math.round(48 * scale);
  const displayH = Math.round(72 * scale);
  if (heroLooks) {
    return <LayeredHeroSprite looks={heroLooks} displayW={displayW} isAttacking={isAttacking}/>;
  }
  // Fallback SVG hero (when no heroLooks — e.g. opponent in PvP)
  const c = CLASS_COLORS[className] || CLASS_COLORS.Knight;
  const sw = displayW, sh = displayH;
  return (
    <svg width={sw} height={sh} viewBox="0 0 48 72" style={{display:"block",overflow:"visible"}}>
      {/* Body */}
      <ellipse cx="24" cy="45" rx="13" ry="14" fill={c.body}/>
      <ellipse cx="24" cy="43" rx="11" ry="11" fill={c.trim} opacity=".5"/>
      {/* Head */}
      <circle cx="24" cy="22" r="13" fill={c.body}/>
      <circle cx="24" cy="20" r="10" fill={c.trim} opacity=".4"/>
      {/* Eyes */}
      <circle cx="20" cy="21" r="2.5" fill="#fff"/>
      <circle cx="28" cy="21" r="2.5" fill="#fff"/>
      <circle cx="20.8" cy="21.5" r="1.3" fill="#222"/>
      <circle cx="28.8" cy="21.5" r="1.3" fill="#222"/>
      {/* Legs */}
      <line x1="18" y1="57" x2="14" y2="68" stroke={c.body} strokeWidth="7" strokeLinecap="round"/>
      <line x1="30" y1="57" x2="34" y2="68" stroke={c.body} strokeWidth="7" strokeLinecap="round"/>
      {/* Arms */}
      <line x1="12" y1="40" x2="4" y2="52" stroke={c.body} strokeWidth="6" strokeLinecap="round"/>
      <line x1="36" y1="40" x2="44" y2="52" stroke={c.body} strokeWidth="6" strokeLinecap="round"/>
    </svg>
  );
}

const BOSS_GIF_BASE = ASSET_BASE+"/icons/sprites/boss/boss_demon_slime_FREE_v1.0/gifs";
function DemonSlimeSprite({ scale=1, enemyFlash=false, phase="action", bossAttackPattern=null }) {
  const sz = Math.round(128 * scale);
  // Priority: dying > hit > charge-attack > cleave-attack > idle
  const src = phase==="won"                                   ? `${BOSS_GIF_BASE}/05_d_death.gif`
            : enemyFlash                                      ? `${BOSS_GIF_BASE}/04_d_take_hit.gif`
            : phase==="enemy_turn"&&bossAttackPattern==="charge" ? `${BOSS_GIF_BASE}/02_d_walk.gif`
            : phase==="enemy_turn"                            ? `${BOSS_GIF_BASE}/03_d_cleave.gif`
            : `${BOSS_GIF_BASE}/01_d_idle.gif`;
  // Key on src so browser reloads/restarts gif when animation changes
  const isCharge = phase==="enemy_turn" && bossAttackPattern==="charge";
  return (
    <div style={{position:"relative",width:sz,height:sz}}>
      <img key={src} src={src} width={sz} height={sz}
        style={{display:"block",imageRendering:"pixelated",objectFit:"contain",
          mixBlendMode:"screen"}}/>
      {/* Glow under boss — red tint during charge, green normally */}
      <div style={{position:"absolute",bottom:-6,left:"50%",transform:"translateX(-50%)",
        width:sz*0.7,height:10,borderRadius:"50%",
        background:isCharge
          ? "radial-gradient(ellipse,#dd222266 0%,transparent 70%)"
          : "radial-gradient(ellipse,#22dd4466 0%,transparent 70%)",
        transition:"background .3s",
        pointerEvents:"none"}}/>
    </div>
  );
}

function EnemySpriteSmall({ id, scale=1, sprite=null, attacking=false, enemyFlash=false, phase="action", bossAttackPattern=null }) {
  if (id==="dragon") return <DemonSlimeSprite scale={scale} enemyFlash={enemyFlash} phase={phase} bossAttackPattern={bossAttackPattern}/>;

  if (sprite) {
    const dims = ENEMY_DIMS[id]||{w:80,h:96};
    const displayW = Math.round(dims.w*scale);
    const displayH = Math.round(dims.h*scale);
    const base = `${ASSET_BASE}/icons/sprites/${sprite.dir}/${sprite.variant}`;
    const src = attacking
      ? `${base}/${sprite.atkFile}`
      : `${base}/Idle.png`;
    const frames = attacking ? sprite.atkFrames : sprite.idleFrames;
    return <AnimatedSprite src={src} numFrames={frames} fps={attacking?12:8} displayW={displayW} displayH={displayH}/>;
  }
  // Fallback — invisible placeholder (shouldn't normally reach here for non-dragon)
  const dims = ENEMY_DIMS[id]||{w:64,h:78};
  return <div style={{width:dims.w*scale,height:dims.h*scale}}/>;
}

/* ─── GAME ICONS — SVG replacements for all emoji ────────────── */
function Icon({ type, size=28, color }) {
  const s=size, c=color;
  switch(type){
    /* ── WEAPONS ── */
    case"sword": case"hammer": case"daggers": case"staff": case"bow":
    case"boots": case"axe":   case"spear":   case"rpg":   case"wand": {
      const WICO={sword:"crossed-swords",hammer:"thor-hammer",daggers:"dagger-rose",
        staff:"crystal-wand",bow:"pocket-bow",boots:"sword-spade",axe:"battle-axe",
        spear:"flaming-trident",rpg:"nuclear-bomb",wand:"crystal-wand"};
      return <img src={ASSET_BASE+"/icons/"+WICO[type]+".svg"} width={s} height={s}
        style={{display:"block",objectFit:"contain",imageRendering:"auto",
          filter:c?`drop-shadow(0 0 4px ${c})`:"brightness(0.55) saturate(0.4)"}}/>;
    };

    /* ── MAP NODES ── */
    case"combat":return(
      <svg width={s} height={s} viewBox="0 0 28 28" style={{display:"block"}}>
        {/* sword A */}
        <polygon points="2,2 4,2 26,22 24,24" fill={c||"#ccd8e4"} opacity=".95"/>
        <line x1="3" y1="2" x2="25" y2="23" stroke="#fff" strokeWidth="1" opacity=".38"/>
        <line x1="19.5" y1="17" x2="27" y2="27" stroke={c||"#ddaa22"} strokeWidth="4" strokeLinecap="round"/>
        <circle cx="27.5" cy="27.5" r="2.2" fill={c||"#f0bb33"}/>
        {/* sword B */}
        <polygon points="26,2 24,2 2,22 4,24" fill={c||"#ccd8e4"} opacity=".95"/>
        <line x1="25" y1="2" x2="3" y2="23" stroke="#fff" strokeWidth="1" opacity=".38"/>
        <line x1="8.5" y1="17" x2="1" y2="27" stroke={c||"#ddaa22"} strokeWidth="4" strokeLinecap="round"/>
        <circle cx=".5" cy="27.5" r="2.2" fill={c||"#f0bb33"}/>
        {/* clash — bright starburst center */}
        <circle cx="14" cy="12" r="4.5" fill="#ffe633" opacity=".38"/>
        <circle cx="14" cy="12" r="2.5" fill="#ffffff" opacity=".85"/>
        <line x1="14" y1="12" x2="14" y2="4" stroke="#ffee22" strokeWidth="2.5" strokeLinecap="round" opacity=".9"/>
        <line x1="14" y1="12" x2="21" y2="5" stroke="#ffcc22" strokeWidth="2" strokeLinecap="round" opacity=".8"/>
        <line x1="14" y1="12" x2="7" y2="5" stroke="#ffcc22" strokeWidth="2" strokeLinecap="round" opacity=".8"/>
        <line x1="14" y1="12" x2="22" y2="12" stroke="#ffaa22" strokeWidth="1.5" strokeLinecap="round" opacity=".7"/>
        <line x1="14" y1="12" x2="6" y2="12" stroke="#ffaa22" strokeWidth="1.5" strokeLinecap="round" opacity=".7"/>
        <line x1="14" y1="12" x2="20" y2="19" stroke="#ff8811" strokeWidth="1.3" strokeLinecap="round" opacity=".55"/>
        <line x1="14" y1="12" x2="8" y2="19" stroke="#ff8811" strokeWidth="1.3" strokeLinecap="round" opacity=".55"/>
      </svg>
    );
    case"elite":return(
      <svg width={s} height={s} viewBox="0 0 28 28" style={{display:"block"}}>
        {/* left horn — twisted */}
        <path d="M8,13 Q3,8 2,2 Q5,5 8,9 Z" fill={c||"#5a1199"}/>
        <path d="M8,13 Q3,7 3,1" stroke={c||"#bb44ee"} strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M8,13 Q5,8 5.5,2" stroke="#dd88ff" strokeWidth="1.1" fill="none" strokeLinecap="round" opacity=".5"/>
        {/* right horn */}
        <path d="M20,13 Q25,8 26,2 Q23,5 20,9 Z" fill={c||"#5a1199"}/>
        <path d="M20,13 Q25,7 25,1" stroke={c||"#bb44ee"} strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M20,13 Q23,8 22.5,2" stroke="#dd88ff" strokeWidth="1.1" fill="none" strokeLinecap="round" opacity=".5"/>
        {/* skull cranium */}
        <path d="M5,19 Q5,10 14,9 Q23,10 23,19 L23,22 L5,22 Z" fill={c||"#1e0030"}/>
        <path d="M5,19 Q5,10 14,9 Q23,10 23,19" fill={c||"#3e0866"} opacity=".75"/>
        <path d="M5,19 Q5,10 14,9 Q23,10 23,19" fill="none" stroke={c||"#9933cc"} strokeWidth="1.8"/>
        {/* eye sockets */}
        <ellipse cx="10" cy="16.5" rx="3.2" ry="3" fill="#0d0018"/>
        <ellipse cx="10" cy="16.5" rx="2.1" ry="2" fill="#dd1133" opacity=".85"/>
        <circle cx="9.5" cy="16" r="1" fill="#ff3344" opacity=".9"/>
        <ellipse cx="18" cy="16.5" rx="3.2" ry="3" fill="#0d0018"/>
        <ellipse cx="18" cy="16.5" rx="2.1" ry="2" fill="#dd1133" opacity=".85"/>
        <circle cx="17.5" cy="16" r="1" fill="#ff3344" opacity=".9"/>
        {/* nasal */}
        <path d="M12.5,19.5 L14,21.5 L15.5,19.5 Z" fill="#0d0018" opacity=".9"/>
        {/* jaw */}
        <rect x="5.5" y="22" width="17" height="4.5" rx="2.2" fill={c||"#280040"}/>
        {/* fangs — three, pointy */}
        <polygon points="8,22 10.5,22 9.2,27" fill={c||"#dd99ff"}/>
        <polygon points="12.5,22 15.5,22 14,27" fill={c||"#dd99ff"}/>
        <polygon points="17.5,22 20,22 18.7,27" fill={c||"#dd99ff"}/>
      </svg>
    );
    case"rest":return(
      <svg width={s} height={s} viewBox="0 0 28 28" style={{display:"block"}}>
        {/* ground glow */}
        <ellipse cx="14" cy="24" rx="9" ry="3" fill="#ff4400" opacity=".2"/>
        {/* log left */}
        <line x1="2" y1="25" x2="18" y2="20" stroke={c||"#8a4a18"} strokeWidth="5" strokeLinecap="round"/>
        <line x1="3" y1="24" x2="17" y2="19.5" stroke="#cc7730" strokeWidth="1.6" strokeLinecap="round" opacity=".38"/>
        {/* log right */}
        <line x1="26" y1="25" x2="10" y2="20" stroke={c||"#8a4a18"} strokeWidth="5" strokeLinecap="round"/>
        <line x1="25" y1="24" x2="11" y2="19.5" stroke="#cc7730" strokeWidth="1.6" strokeLinecap="round" opacity=".38"/>
        {/* ember bed */}
        <ellipse cx="14" cy="21.5" rx="5.5" ry="2" fill="#ff5500" opacity=".45"/>
        {/* outer flame */}
        <path d="M14,20 Q8,14 10,8 Q12.5,13 14,13 Q15.5,9 18,14 Q16,20 14,20 Z" fill={c||"#ff5500"} opacity=".82"/>
        {/* mid flame */}
        <path d="M14,19 Q10,14 11.5,9.5 Q13,13.5 14,13.5 Q15,13.5 16.5,9.5 Q18,14 14,19 Z" fill={c||"#ff9922"} opacity=".9"/>
        {/* inner flame */}
        <path d="M14,18 Q11.5,14 12.5,10.5 Q13.5,13.5 14,13.5 Q14.5,13.5 15.5,10.5 Q16.5,14 14,18 Z" fill={c||"#ffdd44"} opacity=".95"/>
        {/* white hot core */}
        <path d="M14,16.5 Q13.2,13.5 14,12 Q14.8,13.5 14,16.5 Z" fill="#ffffff" opacity=".72"/>
        {/* embers */}
        <circle cx="9" cy="8" r="1.3" fill="#ff8833" opacity=".75"/>
        <circle cx="19" cy="6" r="1.1" fill="#ffaa33" opacity=".65"/>
        <circle cx="12" cy="5" r=".9" fill="#ff6622" opacity=".55"/>
        <circle cx="18" cy="10" r=".8" fill="#ffcc44" opacity=".65"/>
        <circle cx="10" cy="11" r=".7" fill="#ff9933" opacity=".5"/>
      </svg>
    );
    case"boss":return(
      <svg width={s} height={s} viewBox="0 0 28 28" style={{display:"block"}}>
        {/* fire breath plume */}
        <ellipse cx="25.5" cy="18" rx="4" ry="3.5" fill="#ff4400" opacity=".35"/>
        <path d="M21,15 Q26,10 28,13 Q26,14 28,17 Q25,18 28,21 Q24,19 21,21 Z" fill="#ff3300" opacity=".72"/>
        <path d="M22,16 Q26,13 27.5,15 Q26,15.5 27.5,17.5 Q25,17 22,17.5 Z" fill="#ffcc00" opacity=".92"/>
        <circle cx="23.5" cy="15.5" r="1" fill="#ffffff" opacity=".8"/>
        {/* bony dorsal crests */}
        <polygon points="5,9 4,3 7.5,8" fill={c||"#c83810"}/>
        <polygon points="10,7 10,1 13,6" fill={c||"#c83810"}/>
        <polygon points="15.5,7 16.5,1 19,6" fill={c||"#c83810"}/>
        {/* cranium */}
        <path d="M2,15 Q3,7 11,7 Q19,7 20,13 L20,21 L2,21 Z" fill={c||"#301408"}/>
        <path d="M2,15 Q3,7 11,7 Q19,7 20,13" fill={c||"#6a2c10"} opacity=".72"/>
        <path d="M2,15 Q3,7 11,7 Q19,7 20,13" fill="none" stroke="#8a3e18" strokeWidth="1.5" opacity=".75"/>
        {/* snout */}
        <path d="M20,13 Q25,11 26,14 L26,21 L20,21 Z" fill={c||"#3a1808"}/>
        <path d="M20,13 Q25,11 26,14" stroke="#7a3818" strokeWidth="1.3" fill="none"/>
        {/* lower jaw */}
        <path d="M2.5,21 L2.5,24 Q13,26 26,23 L26,21 Z" fill={c||"#2a1006"}/>
        {/* teeth */}
        <polygon points="7,21 9,21 8,24.5" fill={c||"#c8b880"}/>
        <polygon points="12,21 14,21 13,24.5" fill={c||"#c8b880"}/>
        <polygon points="17,21 19,21 18,24.5" fill={c||"#c8b880"}/>
        {/* large fang */}
        <polygon points="22,21 25,21 23,26" fill={c||"#eeeeba"}/>
        {/* eye — blazing */}
        <ellipse cx="9" cy="14" rx="4" ry="3.5" fill="#0e0300"/>
        <ellipse cx="9" cy="14" rx="2.6" ry="2.2" fill="#ff2200" opacity=".75"/>
        <ellipse cx="8.5" cy="13.5" rx="1.2" ry="1" fill="#ffaa00" opacity=".9"/>
        <circle cx="8.5" cy="13.5" r=".5" fill="#ffffff" opacity=".7"/>
        {/* nostril */}
        <ellipse cx="24" cy="16.5" rx="1.4" ry="1.1" fill="#1a0800" opacity=".9"/>
      </svg>
    );
    /* ── POTIONS ── */
    case"bomb":return(
      <svg width={s} height={s} viewBox="0 0 28 28" style={{display:"block"}}>
        {/* shadow */}
        <ellipse cx="13" cy="26" rx="7" ry="1.8" fill="#000" opacity=".35"/>
        {/* bomb body */}
        <circle cx="13" cy="17" r="9.5" fill={c||"#2a2a3a"}/>
        <circle cx="13" cy="17" r="9.5" fill="none" stroke={c||"#4a4a5a"} strokeWidth="1.5"/>
        {/* sheen */}
        <ellipse cx="10" cy="13" rx="3.5" ry="2.5" fill="#ffffff" opacity=".12" transform="rotate(-20,10,13)"/>
        {/* fuse cord */}
        <path d="M13,7.5 Q17,4 21,5" stroke={c||"#aa6622"} strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        {/* fuse spark */}
        <circle cx="21" cy="5" r="2.5" fill="#ffcc22" opacity=".95"/>
        <line x1="21" y1="5" x2="24" y2="2" stroke="#ff8811" strokeWidth="1.8" strokeLinecap="round" opacity=".9"/>
        <line x1="21" y1="5" x2="24" y2="6" stroke="#ffcc22" strokeWidth="1.5" strokeLinecap="round" opacity=".8"/>
        <line x1="21" y1="5" x2="22" y2="1" stroke="#ffee44" strokeWidth="1.3" strokeLinecap="round" opacity=".75"/>
      </svg>
    );
    case"frost":return(
      <svg width={s} height={s} viewBox="0 0 28 28" style={{display:"block"}}>
        {/* main 6-arm crystal */}
        {[0,60,120,180,240,300].map((deg,i)=>{
          const r=deg*Math.PI/180;
          return <g key={i}>
            <line x1={14} y1={14} x2={14+Math.cos(r)*11} y2={14+Math.sin(r)*11}
              stroke={c||"#66ccff"} strokeWidth="2.2" strokeLinecap="round"/>
            <line x1={14+Math.cos(r)*5} y1={14+Math.sin(r)*5}
              x2={14+Math.cos(r)*5+Math.cos(r+1.2)*3.5} y2={14+Math.sin(r)*5+Math.sin(r+1.2)*3.5}
              stroke={c||"#88ddff"} strokeWidth="1.4" strokeLinecap="round" opacity=".8"/>
            <line x1={14+Math.cos(r)*5} y1={14+Math.sin(r)*5}
              x2={14+Math.cos(r)*5+Math.cos(r-1.2)*3.5} y2={14+Math.sin(r)*5+Math.sin(r-1.2)*3.5}
              stroke={c||"#88ddff"} strokeWidth="1.4" strokeLinecap="round" opacity=".8"/>
            <circle cx={14+Math.cos(r)*11} cy={14+Math.sin(r)*11} r="2.4" fill={c||"#aaeeff"}/>
          </g>;
        })}
        {/* center */}
        <circle cx="14" cy="14" r="3.5" fill={c||"#ccf4ff"} opacity=".95"/>
        <circle cx="14" cy="14" r="2" fill="#ffffff" opacity=".6"/>
      </svg>
    );
    case"power":return(
      <svg width={s} height={s} viewBox="0 0 28 28" style={{display:"block"}}>
        {/* glowing flask silhouette */}
        <path d="M11,3 L11,10 Q4,15 4,21 Q4,27 14,27 Q24,27 24,21 Q24,15 17,10 L17,3 Z"
          fill={c||"#441177"} stroke={c||"#9944cc"} strokeWidth="1.3"/>
        {/* liquid fill */}
        <path d="M11,13 Q5,17 5,21 Q5,26 14,26 Q23,26 23,21 Q23,17 17,13 Z" fill={c||"#9933ff"} opacity=".75"/>
        {/* bubbles */}
        <circle cx="11" cy="20" r="1.8" fill="#cc66ff" opacity=".6"/>
        <circle cx="16" cy="22" r="1.2" fill="#dd88ff" opacity=".55"/>
        <circle cx="13" cy="17" r="1" fill="#cc55ff" opacity=".5"/>
        {/* neck */}
        <rect x="10" y="2" width="8" height="3.5" rx="1.8" fill={c||"#552288"}/>
        {/* cork */}
        <rect x="11" y="1" width="6" height="2.5" rx="1.2" fill="#c8a050"/>
        {/* lightning bolt inside */}
        <polygon points="15,13 12,19 14.5,19 13,24 17,17 14,17" fill="#ffffff" opacity=".5"/>
      </svg>
    );
    case"mend":return(
      <svg width={s} height={s} viewBox="0 0 28 28" style={{display:"block"}}>
        {/* heart body */}
        <path d="M14,23 Q4,17 4,11 Q4,5 10,5 Q12.5,5 14,8 Q15.5,5 18,5 Q24,5 24,11 Q24,17 14,23 Z"
          fill={c||"#dd2233"} opacity=".92"/>
        {/* heart shine */}
        <path d="M14,21 Q6,16 6,11 Q6,8 10,7 Q12.5,7 14,10 Q15.5,7 18,7 Q22,7 22,11 Q22,16 14,21 Z"
          fill={c||"#ff5566"} opacity=".65"/>
        {/* cross */}
        <line x1="14" y1="10" x2="14" y2="18" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity=".85"/>
        <line x1="10" y1="14" x2="18" y2="14" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity=".85"/>
        {/* sparkles */}
        <line x1="24" y1="5" x2="26" y2="3" stroke="#ff88aa" strokeWidth="1.5" strokeLinecap="round" opacity=".8"/>
        <line x1="25" y1="7" x2="27" y2="7" stroke="#ff88aa" strokeWidth="1.5" strokeLinecap="round" opacity=".7"/>
      </svg>
    );
    /* ── REWARDS / UI ── */
    case"heal_vial":return(
      <svg width={s} height={s} viewBox="0 0 28 28" style={{display:"block"}}>
        {/* glass vial body */}
        <path d="M11,4 L11,11 Q5,15 5,21 Q5,26 14,26 Q23,26 23,21 Q23,15 17,11 L17,4 Z"
          fill={c||"#1a5530"} stroke={c||"#33aa55"} strokeWidth="1.3"/>
        {/* liquid */}
        <path d="M11,14 Q6,18 6,21 Q6,25 14,25 Q22,25 22,21 Q22,18 17,14 Z" fill={c||"#33cc66"} opacity=".8"/>
        {/* bubbles */}
        <circle cx="11" cy="21" r="1.5" fill="#66ee88" opacity=".55"/>
        <circle cx="16" cy="23" r="1" fill="#88ffaa" opacity=".5"/>
        {/* cork neck */}
        <rect x="10" y="2.5" width="8" height="3" rx="1.5" fill={c||"#3a6644"}/>
        <rect x="11" y="1" width="6" height="2.5" rx="1.2" fill="#c8a050"/>
        {/* glass shine */}
        <ellipse cx="10.5" cy="20" rx="1.5" ry="3.5" fill="#ffffff" opacity=".18" transform="rotate(-15,10.5,20)"/>
      </svg>
    );
    case"heal_potion":return(
      <svg width={s} height={s} viewBox="0 0 28 28" style={{display:"block"}}>
        {/* big round bottle */}
        <path d="M10,4 L10,11 Q3,16 3,22 Q3,27 14,27 Q25,27 25,22 Q25,16 18,11 L18,4 Z"
          fill={c||"#7a1e0e"} stroke={c||"#cc3322"} strokeWidth="1.3"/>
        {/* liquid */}
        <path d="M10,13 Q4,18 4,22 Q4,26 14,26 Q24,26 24,22 Q24,18 18,13 Z" fill={c||"#ee3311"} opacity=".8"/>
        {/* bubbles */}
        <circle cx="10" cy="22" r="2" fill="#ff6644" opacity=".55"/>
        <circle cx="17" cy="24" r="1.3" fill="#ff8866" opacity=".5"/>
        <circle cx="13" cy="18" r="1" fill="#ff5533" opacity=".45"/>
        {/* neck */}
        <rect x="10" y="2.5" width="8" height="3.5" rx="1.8" fill={c||"#550e06"}/>
        {/* cork */}
        <rect x="11" y="1" width="6" height="2.5" rx="1.2" fill="#c8a050"/>
        {/* glass shine */}
        <ellipse cx="9.5" cy="20" rx="2" ry="4.5" fill="#ffffff" opacity=".15" transform="rotate(-15,9.5,20)"/>
        {/* heart symbol */}
        <path d="M14,21 Q10,18 10,15 Q10,12 13,12 Q13.8,12 14,13.2 Q14.2,12 15,12 Q18,12 18,15 Q18,18 14,21 Z"
          fill="#ffffff" opacity=".35"/>
      </svg>
    );
    case"str_shard":return(
      <svg width={s} height={s} viewBox="0 0 28 28" style={{display:"block"}}>
        {/* glow */}
        <circle cx="14" cy="14" r="13" fill={c||"#dd3311"} opacity=".18"/>
        {/* 8-point star */}
        <polygon points="14,1 16.5,10 25,10 18.5,15.5 21,24 14,19 7,24 9.5,15.5 3,10 11.5,10"
          fill={c||"#dd3311"} stroke={c||"#ff5533"} strokeWidth=".8" opacity=".92"/>
        <polygon points="14,5 16,11 22,11 17.5,14.5 19,20 14,17 9,20 10.5,14.5 6,11 12,11"
          fill={c||"#ff6633"} opacity=".7"/>
        {/* center gem */}
        <polygon points="14,10 17,14 14,18 11,14" fill="#ffffff" opacity=".35"/>
        <circle cx="14" cy="14" r="2.5" fill="#ffaa77" opacity=".5"/>
      </svg>
    );
    case"hp_shard":return(
      <svg width={s} height={s} viewBox="0 0 28 28" style={{display:"block"}}>
        {/* outer glow */}
        <path d="M14,24 Q3,17 3,10 Q3,3 10,3 Q12.5,3 14,6 Q15.5,3 18,3 Q25,3 25,10 Q25,17 14,24 Z"
          fill={c||"#bb1122"} opacity=".3"/>
        {/* main heart */}
        <path d="M14,23 Q4,16 4,10 Q4,4 10,4 Q12.5,4 14,7 Q15.5,4 18,4 Q24,4 24,10 Q24,16 14,23 Z"
          fill={c||"#cc1122"} stroke={c||"#ff3344"} strokeWidth=".8" opacity=".92"/>
        {/* shine */}
        <path d="M14,21 Q6,15 6,10 Q6,6 10,6 Q12.5,6 14,9 Q15.5,6 18,6 Q22,6 22,10 Q22,15 14,21 Z"
          fill={c||"#ff4455"} opacity=".65"/>
        {/* star highlight */}
        <polygon points="14,9 15,12 18,12 15.8,13.8 16.5,17 14,15.5 11.5,17 12.2,13.8 10,12 13,12"
          fill="#ffffff" opacity=".38"/>
      </svg>
    );
    case"sword_gun": case"knife_shotgun": case"sniper_spear": case"axe_pistol": case"club_musket": {
      const PVPICO={sword_gun:"saber-and-pistol",knife_shotgun:"bayonet",
        sniper_spear:"high-shot",axe_pistol:"gun-rose",club_musket:"all-for-one"};
      return <img src={ASSET_BASE+"/icons/"+PVPICO[type]+".svg"} width={s} height={s}
        style={{display:"block",objectFit:"contain",imageRendering:"auto",
          filter:c?`drop-shadow(0 0 4px ${c})`:"brightness(0.55) saturate(0.4)"}}/>;
    }
    case"heart":return(
      <svg width={s} height={s} viewBox="0 0 16 16" style={{display:"block"}}>
        <path d="M8 13 Q2 9 2 5 Q2 2 5 2 Q6.5 2 8 4 Q9.5 2 11 2 Q14 2 14 5 Q14 9 8 13Z" fill={c||"#ff4455"}/>
        <path d="M8 11 Q4 8 4 5.5 Q4 4 5.5 4 Q6.5 4 8 6 Q9.5 4 10.5 4 Q12 4 12 5.5 Q12 8 8 11 Z" fill="#ff7788" opacity=".6"/>
      </svg>
    );
    default:return null;
  }
}

/* ─── COMPACT HP BAR ─────────────────────────────────────────── */
function CompactHP({ label, current, max, color, align="left" }) {
  const pct = Math.max(0, (current/max)*100);
  return (
    <div style={{textAlign:align}}>
      <div style={{fontFamily:"Cinzel",fontSize:16,opacity:.9,letterSpacing:2,marginBottom:6,fontWeight:700,
        textShadow:`0 0 10px ${color}66`}}>{label}{label?" · ":""}{current}/{max}</div>
      <div style={{height:18,background:"#050508",border:`2px solid ${color}88`,borderRadius:6,overflow:"hidden",
        boxShadow:`0 0 12px ${color}44, inset 0 1px 3px rgba(0,0,0,.6)`}}>
        <div style={{height:"100%",background:`linear-gradient(to right,${color}88,${color})`,width:`${pct}%`,
          boxShadow:`0 0 14px ${color}cc`,transition:"width .4s"}}/>
      </div>
    </div>
  );
}

/* ─── SEQUENCE KEY COLOURS ───────────────────────────────────── */
const SKEYS = ["W","A","S","D"];
const SCOLS = { W:"#44ff88", A:"#ff5555", S:"#4499ff", D:"#ffcc44" };

/* ─── PORTAL PROTOCOL ────────────────────────────────────────── */
// Portal.* provided by portal.js (jam contract — do not inline)
// APP_FALLBACK_GAMES — local fallback if portal registry unreachable
const APP_FALLBACK_GAMES = [
  { id:"fallback1", title:"Another Realm", url:"https://callumhyoung.github.io/gamejam/" }
];

/* ─── AUDIO ENGINE ───────────────────────────────────────────── */
const _AC = window.AudioContext || window.webkitAudioContext;
let _actx = null;
const _ac = () => { if (!_actx) _actx = new _AC(); if (_actx.state==='suspended') _actx.resume(); return _actx; };

const sfx = (() => {
  // ── File-based playback helpers ──────────────────────────────
  const HY = ASSET_BASE+"/sfx/Helton%20Yan's%20Pixel%20Combat%20-%20Single%20Files/";
  const GN = ASSET_BASE+"/sfx/Snake's%20Authentic%20Gun%20Sounds%20And%20More/Snake's%20Authentic%20Gun%20Sounds/Isolated/";
  // Encode spaces in filenames
  const enc = s => s.replace(/ /g, "%20");
  // Build path: HY folder + base name + variant suffix
  const hy = (name, v) => HY + enc(name) + `-00${v}.wav`;
  // Master volume multiplier — scale all sounds down uniformly
  const MV = 0.68;
  // Play a one-shot audio file — MV scales all volumes globally
  const pf = (url, vol=0.75) => {
    try { const a=new Audio(url); a.volume=Math.min(1,vol*MV); a.play().catch(()=>{}); } catch(_e){}
  };
  // Play random variant (1-n) of a Helton Yan sound
  const rf = (name, n=6, vol=0.75) => pf(hy(name, 1+Math.floor(Math.random()*n)), vol);
  // Preloaded 4-element pool for rapid-fire sounds — each slot a different variant
  const mkPool = (name, vol=0.65) => {
    const pool = [1,2,3,4].map(v=>{ const a=new Audio(hy(name,v)); a.volume=vol; return a; });
    let i=0; return ()=>{ const a=pool[i++%4]; a.currentTime=0; a.play().catch(()=>{}); };
  };
  // Rune: pitch-escalating crystal tings — each correct key steps up a musical semi-tone
  // Ratios follow a pentatonic-ish ladder so keys 0→9 sound increasingly powerful
  const RUNE_RATES = [1.00,1.12,1.26,1.41,1.59,1.78,2.00,2.24,2.52,2.83];
  // Rapid-fire pools (pre-created at init)
  const _daggerPlay = mkPool("FGHTImpt_MELEE-Swish Hit_HY_PC", 0.5);
  const _pokePlay   = mkPool("WHSH_MOVEMENT-Simple Whoosh_HY_PC", 0.38);
  const _swordWalkPlay = mkPool("SWSH_MOVEMENT-Bamboo Whip_HY_PC", 0.28);
  // ── Web Audio (kept for sustained/dynamic-only effects) ──────
  const D  = ctx => ctx.destination;
  const O  = (ctx,t,f) => { const o=ctx.createOscillator(); o.type=t; o.frequency.setValueAtTime(f,ctx.currentTime); return o; };
  const G  = (ctx,v)   => { const g=ctx.createGain(); g.gain.setValueAtTime(v,ctx.currentTime); return g; };
  const LP = (ctx,f)   => { const n=ctx.createBiquadFilter(); n.type='lowpass';  n.frequency.value=f; return n; };
  const wa = fn => { try { fn(_ac()); } catch(_e){} };
  return {
    // ── UI / navigation ──────────────────────────────────────────
    click:        ()=>rf("UIClick_INTERFACE-Metallic Click_HY_PC",   6, 0.50),
    bookOpen:     ()=>rf("SWSH_MOVEMENT-Reso Swish_HY_PC",           6, 0.60),
    select:       ()=>rf("UIClick_INTERFACE-Positive Click_HY_PC",   6, 0.60),
    mapNode:      ()=>rf("UIClick_INTERFACE-Rattling Click_HY_PC",   6, 0.40),
    levelUp:      ()=>rf("DSGNSynth_BUFF-Mecha Level Up_HY_PC",      6, 0.80),
    rest:         ()=>rf("MAGAngl_BUFF-Simple Heal_HY_PC",           6, 0.70),
    reward:       ()=>rf("DSGNTonl_USABLE-Generic Item_HY_PC",       6, 0.60),
    rewardWeapon: ()=>rf("DSGNMisc_USABLE-Mecha Weapon Equip_HY_PC", 6, 0.72),
    rewardHeal:   ()=>rf("MAGAngl_BUFF-Simple Heal_HY_PC",           6, 0.70),
    rewardStat:   ()=>rf("DSGNSynth_BUFF-Stats Up_HY_PC",            6, 0.65),
    potionUse:    ()=>rf("MAGAngl_BUFF-Buff Pickup_HY_PC",           6, 0.65),
    victory:      ()=>rf("DSGNMisc_SKILL IMPACT-Dramatic Finish_HY_PC",6,0.85),
    gameOver:     ()=>rf("DSGNSynth_BUFF-Mecha Failing_HY_PC",       6, 0.75),
    portal:       ()=>rf("MAGSpel_CAST-Sphere Up_HY_PC",             6, 0.70),
    // ── Combat ───────────────────────────────────────────────────
    combatStart:  ()=>rf("DSGNTonl_MELEE-Sword Critical_HY_PC",      6, 0.62),
    bossStart:    ()=>{ rf("DSGNImpt_EXPLOSION-Mana Bomb_HY_PC",6,0.90); setTimeout(()=>rf("DSGNImpt_EXPLOSION-Eruption_HY_PC",6,0.65),250); },
    enemyDie:     ()=>rf("DSGNMisc_SKILL IMPACT-Energy Dissipate_HY_PC", 6, 0.82),
    slimeDeath:   ()=>rf("DSGNMisc_CAST-Slime Ball_HY_PC",           6, 0.82),
    // ── Sword / Beat ─────────────────────────────────────────────
    swordWalk:    ()=>_swordWalkPlay(),
    swordKey:     ()=>rf("DSGNMisc_MELEE-Sword Slash_HY_PC",         6, 0.65),
    swordBadKey:  ()=>rf("UIMisc_INTERFACE-Denied_HY_PC",            6, 0.50),
    swordPerfect: ()=>rf("DSGNMisc_SKILL IMPACT-Critical Strike_HY_PC",6,0.80),
    // ── Hammer / Charge ──────────────────────────────────────────
    // hammerHold stays synthetic — it's a sustained ramping rumble impossible to replicate with a short file
    hammerHold: ()=>{
      try {
        const ctx=_ac();
        const o=O(ctx,'sawtooth',55),lp=LP(ctx,500),g=G(ctx,0);
        o.connect(lp); lp.connect(g); g.connect(D(ctx)); o.start();
        const t=ctx.currentTime;
        g.gain.linearRampToValueAtTime(.15,t+.7); lp.frequency.linearRampToValueAtTime(1600,t+.7);
        return ()=>{ try{ const t2=ctx.currentTime; g.gain.setValueAtTime(g.gain.value,t2);
          g.gain.exponentialRampToValueAtTime(.0001,t2+.07); o.stop(t2+.08); }catch(_e){} };
      } catch(_e){ return ()=>{}; }
    },
    hammerPerfect:    ()=>rf("DSGNImpt_EXPLOSION-Thud_HY_PC",               6, 0.92),
    hammerGood:       ()=>rf("FGHTImpt_HIT-Strong Smack_HY_PC",             6, 0.72),
    hammerOvercharge: ()=>rf("DSGNImpt_EXPLOSION-Forced Interruption_HY_PC",6, 0.70),
    // ── Daggers / Rapid ──────────────────────────────────────────
    daggerTap:    ()=>_daggerPlay(),
    daggerFlurry: ()=>rf("DSGNMisc_SKILL RELEASE-Flying Blades_HY_PC",      6, 0.72),
    // ── Sequence / Staff ─────────────────────────────────────────
    // Each correct rune key plays a crystal ting pitched higher per position in sequence
    runeCorrect: (pos=0) => {
      const rate = RUNE_RATES[Math.min(pos, RUNE_RATES.length-1)];
      // Layer 1 — crisp crystal ting, pitched up
      try {
        const a = new Audio(hy("DSGNTonl_SKILL IMPACT-Energy Crystal_HY_PC", 1+Math.floor(Math.random()*6)));
        a.volume = 0.78; a.playbackRate = rate; a.play().catch(()=>{});
      } catch(_e){}
      // Layer 2 — sparkle shimmer slightly offset, adds magic shimmer
      setTimeout(()=>{
        try {
          const b = new Audio(hy("DSGNTonl_SKILL IMPACT-Magic Sparkles_HY_PC", 1+Math.floor(Math.random()*6)));
          b.volume = 0.42; b.playbackRate = rate * 1.08; b.play().catch(()=>{});
        } catch(_e){}
      }, 22);
    },
    runeWrong: () => {
      // Punchy two-layer failure: synth thud then UI deny
      rf("DSGNSynth_BUFF-Failed Buff_HY_PC", 6, 0.72);
      setTimeout(()=>rf("UIMisc_INTERFACE-Denied_HY_PC", 6, 0.50), 55);
    },
    magicBolt: (q) => {
      rf("MAGSpel_CAST-Panic Energy_HY_PC", 6, 0.72);
      if(q==="perfect") setTimeout(()=>rf("DSGNMisc_SKILL IMPACT-Critical Strike_HY_PC",6,0.60),260);
    },
    // ── Stomp / Boots ────────────────────────────────────────────
    stompApproach:()=>rf("FEETMisc_STEP-Hard Step_HY_PC",                   6, 0.50),
    stompLand:    (q)=>rf(q==="perfect"?"DSGNImpt_EXPLOSION-Thud_HY_PC":"DSGNImpt_EXPLOSION-Sand Impact_HY_PC",6, q==="perfect"?0.92:0.72),
    stompBounce:  ()=>rf("DSGNMisc_MOVEMENT-Pierce Jump_HY_PC",             6, 0.48),
    // ── Poke / Spear ─────────────────────────────────────────────
    pokeTap:      ()=>_pokePlay(),
    // ── Archery / Bow ────────────────────────────────────────────
    bowDraw:      ()=>(()=>{}),
    bowRelease:   ()=>rf("SWSH_MOVEMENT-Bamboo Whip_HY_PC",                 6, 0.62),
    arrowFlight:  ()=>rf("WHSH_MOVEMENT-Wind Shaker_HY_PC",                 6, 0.50),
    arrowHit:     (q)=>{
      rf("DSGNMisc_HIT-Gore Pierce_HY_PC", 6, q==="perfect"?0.85:0.65);
      if(q==="perfect") setTimeout(()=>rf("DSGNMisc_SKILL IMPACT-Critical Strike_HY_PC",6,0.50),110);
    },
    // ── RPG / Sequence Reveal ─────────────────────────────────────
    rpgLaunch:      ()=>rf("DSGNMisc_SKILL RELEASE-Flare Gun_HY_PC",        6, 0.88),
    rpgImpact:      ()=>{ rf("DSGNImpt_EXPLOSION-Mana Bomb_HY_PC",6,0.95); setTimeout(()=>rf("DSGNImpt_EXPLOSION-Eruption_HY_PC",6,0.80),180); },
    rpgSequenceKey: ()=>rf("MAGSpel_CAST-Energy Riser_HY_PC",               6, 0.48),
    // ── Dual Action ──────────────────────────────────────────────
    dualClick:    ()=>rf("UIClick_INTERFACE-Strong Click 1_HY_PC",          6, 0.70),
    dualGunshot:  ()=>pf(GN + ".22LR/WAV/22LR%20Single%20Isolated%20WAV.wav", 0.55),
    // ── Defend ───────────────────────────────────────────────────
    projLaunch:   ()=>rf("DSGNMisc_PROJECTILE-Laser Shot_HY_PC",            6, 0.60),
    parry:        ()=>rf("DSGNMisc_MELEE-Sword Parry_HY_PC",                6, 0.88),
    blockHit:     ()=>rf("DSGNMisc_MELEE-Sword Deflect_HY_PC",              6, 0.72),
    takeDmg:      ()=>rf("FGHTImpt_HIT-Strong Punch_HY_PC",                 6, 0.72),
  };
})();

/* ─── MAIN APP ───────────────────────────────────────────────── */
function App() {
  const [screen,         setScreen]         = useState("title");
  const [selectedWeapon, setSelectedWeapon] = useState(null);
  const [player,         setPlayer]         = useState(null);
  const [cs,             setCs]             = useState(null);
  const [qteAnim,        setQteAnim]        = useState(null); // all in-scene QTE state
  const [levelUpPending, setLevelUpPending] = useState(false);
  const [rewards,        setRewards]        = useState(null);
  const [enemyFlash,     setEnemyFlash]     = useState(false);
  const [hitResult,      setHitResult]      = useState(null);
  const [impactFlash,    setImpactFlash]    = useState(0); // 0=off, 1=white hit, 2=enemy hit
  const [parryFlash,     setParryFlash]     = useState(false); // perfect parry screen flash
  const [castTick,       setCastTick]       = useState(0);    // interval counter to drive CAST timer

  // ── Portal state ──────────────────────────────────────────────
  const [portalName,    setPortalName]    = useState("Hero");
  const [portalRef,     setPortalRef]     = useState(null);   // URL of referring game
  const [portalRefTitle,setPortalRefTitle]= useState(null);
  const [portalTargets, setPortalTargets] = useState([]);
  const [arrivedViaPortal, setArrivedViaPortal] = useState(false);

  // Mutable QTE data — lives in a ref so rAF closures always see current values
  const qteRef = useRef({});
  // Particle anchor — used to find battlefield screen coords via getBoundingClientRect
  const particleContainerRef = useRef(null);
  // Cast timer start — useRef so render always reads real performance.now() delta
  const castStartRef = useRef(null);

  // ── MULTIPLAYER (PeerJS P2P) ──────────────────────────────────
  const [gameMode,   setGameMode]   = useState("solo");   // "solo" | "race"
  const [mpStatus,   setMpStatus]   = useState("idle");   // "idle"|"connecting"|"racing"|"pvp_wait"|"pvp"
  const [oppSnap,    setOppSnap]    = useState(null);     // opponent's synced state
  const [pvpMyHp,    setPvpMyHp]   = useState(80);
  const [pvpOppHp,   setPvpOppHp]  = useState(80);
  const [pvpMaxHp,   setPvpMaxHp]  = useState(80);
  const [pvpTurn,    setPvpTurn]   = useState("mine");    // "mine" | "theirs"
  const [pvpWinner,  setPvpWinner] = useState(null);      // null | "me" | "them"
  const [mpDisconnected, setMpDisconnected] = useState(false);
  const [iWonRace,   setIWonRace]  = useState(false);
  const [bookOpen,   setBookOpen]  = useState(false);
  const [bookHoverPotion, setBookHoverPotion] = useState(null);
  const [hoverWeaponId, setHoverWeaponId] = useState(null);
  const [pvpLog,     setPvpLog]    = useState([]);
  const mpRef = useRef({ peer:null, conn:null, isHost:false, syncIv:null, lastAtkTs:null, pvpIncomingDmg:0 });
  // PvP routing refs — redirect QTE results to pvp handlers when pvpMode=true
  const pvpModeRef    = useRef(false);
  const pvpAtkCbRef   = useRef(null); // (q, weapon, dmg) => void — after attack QTE
  const pvpDefCbRef   = useRef(null); // (q) => void — after defend QTE
  // Multiplayer UI state
  const [mpRoomCode,  setMpRoomCode]  = useState("");
  const [mpJoinInput, setMpJoinInput] = useState("");
  const [mpMode,      setMpMode]      = useState(null); // null | "hosting" | "join_input" | "joining"

  // Screen-transition sounds
  useEffect(()=>{
    if(screen==="victory") sfx.victory();
    if(screen==="gameover") sfx.gameOver();
    // reward screen has no sound — keep focus on combat
  },[screen]);

  const [runStartTime,   setRunStartTime]   = useState(null);
  const [finalTime,      setFinalTime]      = useState(null); // locked when run ends
  const [timerDisplay,   setTimerDisplay]   = useState("0:00.00");

  const fmtTime = (ms) => {
    const totalMs = Math.floor(ms);
    const min  = Math.floor(totalMs / 60000);
    const sec  = Math.floor((totalMs % 60000) / 1000);
    const cent = Math.floor((totalMs % 1000) / 10);
    return `${min}:${String(sec).padStart(2,"0")}.${String(cent).padStart(2,"0")}`;
  };

  useEffect(()=>{
    if(!runStartTime) return;
    const id = setInterval(()=>{
      setTimerDisplay(fmtTime(Date.now()-runStartTime));
    },47);
    return ()=>clearInterval(id);
  },[runStartTime]);

  // Freeze timer when run ends
  useEffect(()=>{
    if((screen==="victory"||screen==="gameover")&&runStartTime&&!finalTime){
      const t = fmtTime(Date.now()-runStartTime);
      setFinalTime(t);
      setTimerDisplay(t);
    }
  },[screen]);

  // Map legend — injected onto document.body, position:fixed mid-right, screen==="map" only
  useEffect(()=>{
    if(screen!=="map") return;
    const el = document.createElement("div");
    el.id = "map-legend";
    el.style.cssText = "position:fixed;right:16px;top:50%;transform:translateY(-50%);z-index:9999;pointer-events:none;background:rgba(4,4,12,.88);padding:14px 20px;border-radius:8px;border:1px solid #2a2a40;display:flex;flex-direction:column;gap:10px;font-family:Cinzel,serif;font-size:13px;letter-spacing:2px;backdrop-filter:blur(4px);";
    el.innerHTML = `
      <div style="font-size:9px;letter-spacing:3px;color:#4a4a6a;margin-bottom:2px;">LEGEND</div>
      <div style="display:flex;align-items:center;gap:10px;color:#c8b888;"><img src="${ASSET_BASE}/icons/sprites/map/COMBAT.png" width="32" height="32" style="image-rendering:pixelated;flex-shrink:0"/>COMBAT</div>
      <div style="display:flex;align-items:center;gap:10px;color:#aa66ff;"><img src="${ASSET_BASE}/icons/sprites/map/ELITE.png"  width="32" height="32" style="image-rendering:pixelated;flex-shrink:0"/>ELITE</div>
      <div style="display:flex;align-items:center;gap:10px;color:#44cc66;"><img src="${ASSET_BASE}/icons/sprites/map/REST.png"   width="32" height="32" style="image-rendering:pixelated;flex-shrink:0"/>REST</div>
      <div style="display:flex;align-items:center;gap:10px;color:#ff4422;"><img src="${ASSET_BASE}/icons/sprites/map/BOSS.png"   width="32" height="32" style="image-rendering:pixelated;flex-shrink:0"/>BOSS</div>
    `;
    document.body.appendChild(el);
    return ()=>{ const x=document.getElementById("map-legend"); if(x) x.remove(); };
  },[screen]);

  // Drive CAST/LAUNCH timer re-renders every 30ms while sequence QTE active
  useEffect(()=>{
    if(qteAnim?.type!=="sequence"&&qteAnim?.type!=="sequence_reveal") return;
    const id=setInterval(()=>setCastTick(t=>t+1),30);
    return ()=>clearInterval(id);
  },[qteAnim?.type]);

  // ── Race state sync — push my state to opponent every 600ms ──
  useEffect(()=>{
    if(gameMode!=="race"||mpStatus==="idle") return;
    const iv = setInterval(mpSync, 600);
    return ()=>clearInterval(iv);
  },[gameMode, mpStatus, player]);

  // ── Watch opponent dragonKilled → enter PvP when both ready ──
  useEffect(()=>{
    if(gameMode!=="race") return;
    if(screen==="pvp_wait" && oppSnap?.dragonKilled) {
      setTimeout(()=>enterPvp(iWonRace), 400);
    }
  },[oppSnap?.dragonKilled, screen]);

  // ── Watch opponent pvpAtk in PvP → start defend QTE ──
  useEffect(()=>{
    if(pvpWinner) return;
    if(screen!=="combat"||!cs?.pvpMode||!oppSnap?.pvpAtk) return;
    const atk = oppSnap.pvpAtk;
    if(!atk||atk.ts===mpRef.current.lastAtkTs) return;
    mpRef.current.lastAtkTs = atk.ts;
    // Small delay to ensure cs/pvpTurn state has settled before triggering defend
    setTimeout(()=>{ if(!pvpModeRef.current) return; pvpStartIncoming(atk); }, 500);
  },[oppSnap?.pvpAtk?.ts, screen, cs?.pvpMode]);

  // ── Watch pvpTurnDone → attacker's turn flips back to "mine" ──
  useEffect(()=>{
    if(pvpWinner) return;
    if(screen!=="combat"||!cs?.pvpMode||pvpTurn!=="mine"||!oppSnap?.pvpTurnDone) return;
    if(oppSnap.pvpTurnDone===mpRef.current.lastTurnDoneTs) return;
    mpRef.current.lastTurnDoneTs = oppSnap.pvpTurnDone;
    // Defender has resolved — re-enable attacker's action phase
    setCs(prev=>prev?{...prev,phase:"action"}:prev);
  },[oppSnap?.pvpTurnDone, screen, pvpTurn, cs?.pvpMode, pvpWinner]);

  // ── PvP winner check — sync final HP to opponent ──
  useEffect(()=>{
    if(pvpWinner) {
      pvpModeRef.current = false;
      pvpAtkCbRef.current = null;
      pvpDefCbRef.current = null;
    }
  },[pvpWinner]);

  const [particles] = useState(()=>Array.from({length:28},(_,i)=>({
    left:`${(i*41+11)%100}%`,top:`${(i*61+7)%100}%`,size:i%3===0?3:2,
    opacity:.06+(i%5)*.05,dur:`${2.5+i%4}s`,delay:`${(i*.4)%3}s`
  })));

  useEffect(()=>{
    if(player&&player.xp>=player.level*40&&!levelUpPending) setLevelUpPending(true);
  },[player?.xp,player?.level]);

  // ── Portal bootstrap — parse URL params + fetch registry on mount ──
  useEffect(()=>{
    // Use portal.js contract: Portal.readPortalParams()
    const pp = Portal.readPortalParams();
    const name = pp.username || 'Hero';
    const ref  = pp.ref || null;
    setPortalName(name);
    setPortalRef(ref);
    if (pp.fromPortal) { setArrivedViaPortal(true); setScreen('weapon_select'); }

    // Extract readable title from ref URL if possible
    if (ref) {
      try {
        const host = new URL(ref).hostname.replace(/^www\./,'');
        setPortalRefTitle(host);
      } catch(_) { setPortalRefTitle('the last world'); }
    }

    // Fetch jam registry via Portal.fetchJamRegistry()
    Portal.fetchJamRegistry()
      .then(games=>{
        const mine = window.location.href.split('?')[0].replace(/\/$/,'');
        const others = games.filter(g=>g.url && !g.url.replace(/\/$/,'').startsWith(mine));
        setPortalTargets(others.length ? others : APP_FALLBACK_GAMES);
      })
      .catch(()=>setPortalTargets(APP_FALLBACK_GAMES));
  },[]);

  // ── Send player to another jam game — uses Portal.sendPlayerThroughPortal ──
  const sendThroughPortal = (targetUrl) => {
    Portal.sendPlayerThroughPortal(targetUrl, {
      username: portalName,
      color: 'e8d5a3',
      speed: 5,
    });
  };

  // ── MULTIPLAYER FUNCTIONS ──────────────────────────────────────

  // ── PeerJS helpers ────────────────────────────────────────────
  // mpRef holds: { peer, conn, isHost, syncIv, lastAtkTs, pvpIncomingDmg }
  // All state sync uses conn.send({ type:"state", ...fields })

  const mpSend = (data) => {
    const conn = mpRef.current.conn;
    if (conn?.open) conn.send(data);
  };

  const mpSync = (extra={}) => {
    // Only send race progress fields — dragonKilled/pvpReady sent separately on events
    setPlayer(p => {
      const payload = {
        type:   "state",
        floor:  p?.floor          ?? 0,
        hp:     p?.hp             ?? 0,
        maxHp:  p?.maxHp          ?? 60,
        weapon: p?.weapons?.[0]   ?? "sword",
        name:   portalName,
        ...extra,
      };
      mpSend(payload);
      return p;
    });
  };

  const onPeerData = (data) => {
    if (!data || data.type !== "state") return;
    // Merge — only update fields present in packet (undefined = keep previous)
    setOppSnap(prev => {
      const next = { ...(prev ?? {}) };
      if (data.floor        !== undefined) next.floor        = data.floor;
      if (data.hp           !== undefined) next.hp           = data.hp;
      if (data.maxHp        !== undefined) next.maxHp        = data.maxHp;
      if (data.dragonKilled !== undefined) next.dragonKilled = data.dragonKilled;
      if (data.pvpReady     !== undefined) next.pvpReady     = data.pvpReady;
      if (data.weapon       !== undefined) next.weapon       = data.weapon;
      if (data.name         !== undefined) next.name         = data.name;
      if (data.pvpMyHp      !== undefined) next.pvpHp        = data.pvpMyHp;
      if (data.pvpAtk       !== undefined) next.pvpAtk       = data.pvpAtk;
      if (data.pvpTurnDone  !== undefined) next.pvpTurnDone  = data.pvpTurnDone;
      return next;
    });
  };

  const setupConn = (conn) => {
    mpRef.current.conn = conn;
    mpRef.current.cleanEnded = false; // set true when pvpWinner resolves normally
    conn.on("data", onPeerData);
    conn.on("close", () => {
      mpRef.current.conn = null;
      const wasActive = !mpRef.current.cleanEnded;
      setOppSnap(null);
      if (wasActive) {
        setMpDisconnected(true);
        // Brief pause so message is visible, then full reset to title
        setTimeout(() => {
          setGameMode("solo"); setMpStatus("idle");
          setMpMode(null); setPvpWinner(null);
          setCs(null); setScreen("title");
          setTimeout(() => setMpDisconnected(false), 2800);
        }, 400);
      } else {
        setGameMode("solo"); setMpStatus("idle"); setMpMode(null);
      }
    });
    conn.on("open", () => {
      // Introduce ourselves
      mpSend({ type:"state", name: portalName, floor:0, hp:60, maxHp:60,
               weapon:"sword", dragonKilled:false, pvpReady:false, pvpMyHp:80, pvpAtk:null });
      setGameMode("race");
      setMpStatus("racing");
      setScreen("weapon_select");
    });
  };

  const hostGame = () => {
    if (!window.Peer) { alert("PeerJS not loaded — check internet connection."); return; }
    const code = Math.random().toString(36).slice(2,7).toUpperCase();
    const peerId = "rpg2p-" + code;
    setMpRoomCode(code);
    setMpMode("hosting");
    setMpStatus("connecting");
    const peer = new window.Peer(peerId);
    mpRef.current.peer = peer;
    mpRef.current.isHost = true;
    peer.on("error", e => { console.error("PeerJS host error:", e); setMpStatus("idle"); setMpMode(null); });
    peer.on("connection", conn => {
      setupConn(conn);
    });
  };

  const joinGame = () => {
    const code = mpJoinInput.trim().toUpperCase();
    if (!code) return;
    if (!window.Peer) { alert("PeerJS not loaded — check internet connection."); return; }
    const peerId = "rpg2p-" + Math.random().toString(36).slice(2,7).toUpperCase();
    setMpMode("joining");
    setMpStatus("connecting");
    const peer = new window.Peer(peerId);
    mpRef.current.peer = peer;
    mpRef.current.isHost = false;
    peer.on("open", () => {
      const conn = peer.connect("rpg2p-" + code);
      setupConn(conn);
    });
    peer.on("error", e => { console.error("PeerJS join error:", e); setMpStatus("idle"); setMpMode(null); });
  };

  // Start PvP after both kill dragon. iWon=true means I killed dragon first (I go first).
  // Routes through screen="combat" with synthetic cs so all QTE overlays work automatically.
  const enterPvp = (iWon) => {
    const oppW = iWon ? (ALL_WEAPONS[oppSnap?.weapon] ?? ALL_WEAPONS.sword) : ALL_WEAPONS.rpg;
    const startHp = 80;
    // Restore player to full health for PvP
    setPlayer(p => p ? {...p, hp: p.maxHp} : p);
    setPvpMyHp(startHp);
    setPvpOppHp(startHp);
    setPvpMaxHp(startHp);
    setPvpTurn(iWon ? "mine" : "theirs");
    setPvpWinner(null);
    setPvpLog([`⚔ PvP begins! ${iWon ? "YOU GO FIRST 🚀" : (oppSnap?.name||"RIVAL")+" GOES FIRST 🚀"}`]);
    pvpModeRef.current = true;
    mpSend({ type:"state", pvpReady: true, pvpMyHp: startHp });
    // Synthetic enemy = opponent rendered as HeroSprite via special id "pvp_opp"
    setCs({
      enemy: {
        id: "pvp_opp", name: oppSnap?.name ?? "RIVAL",
        hp: startHp, maxHp: startHp, atk: oppW.baseDmg, xp: 0,
        color: "#4466ff",
        pvpClass: iWon ? (oppW.className ?? "Knight") : "Demolisher",
        pvpWeapons: [oppW.id],
      },
      phase: iWon ? "action" : "enemy_turn",
      log: [`⚔ PvP! ${iWon ? "You won the race — attack first!" : "Rival won the race — defend!"}`],
      nodeId: "pvp", nodeFloor: 999, pvpMode: true,
    });
    setMpStatus("pvp");
    setScreen("combat");  // use combat screen — gets all QTE rendering for free
  };

  // Called after my attack QTE resolves in PvP
  const pvpOnAttackDone = (q, weapon, dmg) => {
    pvpAtkCbRef.current = null;
    const ts = Date.now();
    triggerProjectileTrail(HR_L+HSW/2, HR_T+HSH/2, ENX, GNDY-40, q==="perfect"?"#ff4400":"#ffcc44");
    triggerParticles(ENX, GNDY-40, q==="perfect"?"#ff4400":"#ffcc44", q==="perfect"?50:28);
    setEnemyFlash(true); setTimeout(()=>setEnemyFlash(false), 450);
    showHit(q==="miss"?`MISS!`:`LAUNCHING −${dmg}`, q==="miss"?"#666":"#ff6600");
    if (q !== "miss") {
      mpSend({ type:"state", pvpAtk: { dmg, quality: q, ts } });
      setPvpOppHp(h => {
        const nh = Math.max(0, h - dmg);
        if (nh <= 0) { setPvpWinner("me"); pvpModeRef.current = false; mpRef.current.cleanEnded = true; }
        return nh;
      });
      setCs(prev=>prev?{...prev,phase:"enemy_turn",
        log:[...prev.log,`⚔ You hit ${prev.enemy.name} for ${dmg}!`].slice(-8)}:prev);
      setPvpLog(lg => [...lg, `⚔ You hit ${oppSnap?.name||"RIVAL"} for ${dmg} (${q})!`].slice(-6));
    } else {
      setCs(prev=>prev?{...prev,phase:"enemy_turn",
        log:[...prev.log,"⚔ Your attack missed!"].slice(-8)}:prev);
      setPvpLog(lg => [...lg, "⚔ Your attack missed!"].slice(-6));
    }
    setPvpTurn("theirs");
  };

  // Called when opponent's pvpAtk arrives (starts defend QTE)
  const pvpStartIncoming = (atkData) => {
    mpRef.current.pvpIncomingDmg = atkData.dmg;
    pvpDefCbRef.current = (q) => {
      pvpDefCbRef.current = null;
      const inDmg = mpRef.current.pvpIncomingDmg;
      const mult = q==="perfect"?0:q==="good"?0.4:1.0;
      const finalDmg = Math.floor(inDmg * mult);
      triggerProjectileTrail(ENX, GNDY-40, HR_L+HSW/2, HR_T+HSH/2, q==="miss"?"#ff4444":"#4488ff");
      if (q==="perfect") { showHit("PARRIED!", "#44aaff"); setParryFlash(true); setTimeout(()=>setParryFlash(false),900); }
      else showHit(q==="good"?`BLOCKED −${finalDmg}`:`HIT −${finalDmg}`, q==="good"?"#4488ff":"#ff4444");
      setPvpMyHp(h => {
        const nh = Math.max(0, h - finalDmg);
        mpSend({ type:"state", pvpMyHp: nh, pvpTurnDone: Date.now() });
        if (nh <= 0) { setPvpWinner("them"); pvpModeRef.current = false; mpRef.current.cleanEnded = true; }
        return nh;
      });
      setPvpLog(lg => [...lg, q==="perfect"?`⚡ You parried ${oppSnap?.name||"RIVAL"}'s attack!`:
        q==="good"?`🛡 Blocked — ${finalDmg} through.`:
        `💥 ${oppSnap?.name||"RIVAL"} hit you for ${finalDmg}!`].slice(-6));
      setCs(prev=>prev?{...prev,phase:"action",
        log:[...prev.log, q==="perfect"?"⚡ Perfect parry!":q==="good"?`Blocked ${finalDmg}.`:`Hit for ${finalDmg}!`].slice(-8)}:prev);
      setPvpTurn("mine");
    };
    // Put cs into defending phase so defend QTE prompt shows
    setCs(prev=>prev?{...prev,phase:"defending"}:prev);
    startDefendQTE();
  };

  // Burst particles — position:fixed on document.body, screen coords via getBoundingClientRect.
  const triggerParticles = (bfX, bfY, color, count=32) => {
    const anchor = particleContainerRef.current;
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    const zoom = rect.width / BFW;
    const sx = rect.left + bfX * zoom;
    const sy = rect.top  + bfY * zoom;

    // ── Central flash ring ──
    const ring = document.createElement("div");
    const rSz = 60 * zoom;
    ring.style.cssText = `position:fixed;left:${sx}px;top:${sy}px;width:${rSz*2}px;height:${rSz*2}px;border-radius:50%;border:3px solid ${color};pointer-events:none;transform:translate(-50%,-50%) scale(0);z-index:9998;box-shadow:0 0 20px ${color},inset 0 0 20px ${color}44;`;
    document.body.appendChild(ring);
    ring.animate([
      {transform:"translate(-50%,-50%) scale(0)",opacity:1},
      {transform:"translate(-50%,-50%) scale(1.8)",opacity:0},
    ],{duration:400,easing:"ease-out",fill:"forwards"});
    setTimeout(()=>ring.remove(),420);

    // ── Central bright flash ──
    const flash = document.createElement("div");
    const fSz = 22 * zoom;
    flash.style.cssText = `position:fixed;left:${sx}px;top:${sy}px;width:${fSz*2}px;height:${fSz*2}px;border-radius:50%;background:${color};pointer-events:none;transform:translate(-50%,-50%);z-index:10000;box-shadow:0 0 30px ${color},0 0 60px ${color};`;
    document.body.appendChild(flash);
    flash.animate([{opacity:1,transform:"translate(-50%,-50%) scale(1)"},{opacity:0,transform:"translate(-50%,-50%) scale(2.2)"}],{duration:200,easing:"ease-out",fill:"forwards"});
    setTimeout(()=>flash.remove(),220);

    // ── Particle burst ──
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.9;
      const speed = (80 + Math.random() * 140) * zoom;
      const dx = Math.cos(angle) * speed;
      const dy = Math.sin(angle) * speed;
      const size = (3 + Math.random() * 7) * zoom;
      // alternate between main color and white/bright variant for richness
      const col = i % 4 === 0 ? "#ffffff" : color;
      const dur = 500 + Math.random() * 250;
      const d = document.createElement("div");
      d.style.cssText = `position:fixed;left:${sx}px;top:${sy}px;width:${size*2}px;height:${size*2}px;border-radius:50%;background:${col};pointer-events:none;box-shadow:0 0 ${size*4}px ${color};transform:translate(-50%,-50%);z-index:9999;`;
      document.body.appendChild(d);
      d.animate(
        [{opacity:1,transform:`translate(-50%,-50%) scale(1)`},
         {opacity:0,transform:`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(0.05)`}],
        {duration:dur,easing:"ease-out",fill:"forwards"}
      );
      setTimeout(()=>d.remove(), dur+30);
    }
  };

  // Dotted projectile trail from one battlefield point to another
  const triggerProjectileTrail = (bfX1, bfY1, bfX2, bfY2, color, steps=14) => {
    const anchor = particleContainerRef.current;
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    const zoom = rect.width / BFW;
    const sx1 = rect.left + bfX1 * zoom;
    const sy1 = rect.top  + bfY1 * zoom;
    const sx2 = rect.left + bfX2 * zoom;
    const sy2 = rect.top  + bfY2 * zoom;
    for (let i = 0; i <= steps; i++) {
      const frac = i / steps;
      const x = sx1 + (sx2 - sx1) * frac;
      const y = sy1 + (sy2 - sy1) * frac;
      const delay = frac * 180;
      const sz = (3 + Math.random() * 3) * zoom;
      const d = document.createElement("div");
      d.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:${sz*2}px;height:${sz*2}px;border-radius:50%;background:${color};pointer-events:none;transform:translate(-50%,-50%);z-index:9995;box-shadow:0 0 ${sz*4}px ${color};opacity:0;`;
      document.body.appendChild(d);
      d.animate(
        [{opacity:0},{opacity:.9},{opacity:.9},{opacity:0}],
        {duration:380, delay, easing:"ease-in-out", fill:"forwards"}
      );
      setTimeout(()=>d.remove(), delay + 420);
    }
  };

  const showHit = (text, color, big=false) => {
    setHitResult({text,color,big});
    setTimeout(()=>setHitResult(null), big?1300:950);
  };

  // Weapon-specific color palette for swing particles
  const WEAPON_PART_COL = {
    sword:"#88ccff", hammer:"#ff9933", daggers:"#eecc22", staff:"#cc55ff",
    bow:"#44dd88",   boots:"#ffaa33",  axe:"#ff6622",    spear:"#88ddff",
    wand:"#ff66ff",  rpg:"#ff4411",    default:"#e8d5a3",
  };

  // Directional weapon swing — fans out from hero toward enemy, weapon-colored
  const triggerWeaponSwing = (weapon) => {
    const anchor = particleContainerRef.current;
    if (!anchor) return;
    const rect  = anchor.getBoundingClientRect();
    const zoom  = rect.width / BFW;
    const hx    = rect.left + (HR_L + HSW/2) * zoom;
    const hy    = rect.top  + (HR_T + HSH/2) * zoom;
    const ex    = rect.left + ENX * zoom;
    const ey    = rect.top  + (GNDY - 40) * zoom;
    const baseA = Math.atan2(ey - hy, ex - hx); // angle toward enemy
    const col   = WEAPON_PART_COL[weapon?.id] || WEAPON_PART_COL.default;
    const count = 22;

    // Fan of particles aimed roughly at the enemy
    for (let i = 0; i < count; i++) {
      const spread = (Math.random() - 0.5) * 1.4; // ±0.7 rad fan
      const angle  = baseA + spread;
      const speed  = (60 + Math.random() * 120) * zoom;
      const dx     = Math.cos(angle) * speed;
      const dy     = Math.sin(angle) * speed;
      const sz     = (2.5 + Math.random() * 5) * zoom;
      const dur    = 320 + Math.random() * 180;
      const delay  = i * 10;
      const bright = i % 5 === 0 ? "#ffffff" : col;
      const d = document.createElement("div");
      d.style.cssText = `position:fixed;left:${hx}px;top:${hy}px;width:${sz*2}px;height:${sz*2}px;border-radius:50%;background:${bright};pointer-events:none;box-shadow:0 0 ${sz*3}px ${col};transform:translate(-50%,-50%);z-index:9997;opacity:0;`;
      document.body.appendChild(d);
      d.animate(
        [{opacity:0,transform:"translate(-50%,-50%) scale(.5)"},
         {opacity:.9,transform:"translate(-50%,-50%) scale(1)",offset:.12},
         {opacity:0,transform:`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(.05)`}],
        {duration:dur, delay, easing:"ease-out", fill:"forwards"}
      );
      setTimeout(()=>d.remove(), delay + dur + 30);
    }

    // Slash arc — thin bright line swept across hero center
    for (let i = 0; i < 6; i++) {
      const arcA = baseA - 0.55 + (i/5)*1.1;
      const len  = (28 + Math.random()*20) * zoom;
      const x2   = hx + Math.cos(arcA)*len;
      const y2   = hy + Math.sin(arcA)*len;
      const slash = document.createElement("div");
      slash.style.cssText = `position:fixed;left:${hx}px;top:${hy}px;width:2px;height:${len}px;background:linear-gradient(to bottom,transparent,${col},white);pointer-events:none;transform-origin:top center;transform:translate(-50%,0) rotate(${arcA*180/Math.PI+90}deg);z-index:9998;opacity:0;border-radius:2px;`;
      document.body.appendChild(slash);
      slash.animate(
        [{opacity:0},{opacity:.85,offset:.1},{opacity:0}],
        {duration:220, delay: i*18, easing:"ease-out", fill:"forwards"}
      );
      setTimeout(()=>slash.remove(), i*18 + 260);
    }
  };

  // Enemy wind-up — ominous burst of dark/red embers from enemy position
  const triggerEnemyWindUp = () => {
    const anchor = particleContainerRef.current;
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    const zoom = rect.width / BFW;
    const ex   = rect.left + ENX * zoom;
    const ey   = rect.top  + (GNDY - 50) * zoom;
    const cols = ["#ff2200","#ff6600","#ff0044","#cc0000","#ff8800"];
    const count = 28;

    // Inward swirl then explode outward
    for (let i = 0; i < count; i++) {
      const angle  = (i/count)*Math.PI*2 + Math.random()*0.4;
      const startR = (55 + Math.random()*30) * zoom;
      const sx     = ex + Math.cos(angle)*startR;
      const sy     = ey + Math.sin(angle)*startR;
      const col    = cols[i % cols.length];
      const sz     = (2 + Math.random()*4.5) * zoom;
      const dur    = 380 + Math.random()*200;
      const delay  = Math.floor(i/count*160);
      const d = document.createElement("div");
      d.style.cssText = `position:fixed;left:${sx}px;top:${sy}px;width:${sz*2}px;height:${sz*2}px;border-radius:50%;background:${col};pointer-events:none;box-shadow:0 0 ${sz*4}px ${col};transform:translate(-50%,-50%);z-index:9996;opacity:0;`;
      document.body.appendChild(d);
      // Travel inward to enemy center, then flare
      d.animate(
        [{opacity:0,transform:"translate(-50%,-50%) scale(1.5)"},
         {opacity:.9,transform:`translate(calc(-50% + ${ex-sx}px),calc(-50% + ${ey-sy}px)) scale(.8)`,offset:.6},
         {opacity:0,transform:`translate(calc(-50% + ${ex-sx}px),calc(-50% + ${ey-sy}px)) scale(2)`}],
        {duration:dur, delay, easing:"ease-in", fill:"forwards"}
      );
      setTimeout(()=>d.remove(), delay + dur + 30);
    }

    // Central pulse ring
    const ring = document.createElement("div");
    const rSz = 40 * zoom;
    ring.style.cssText = `position:fixed;left:${ex}px;top:${ey}px;width:${rSz*2}px;height:${rSz*2}px;border-radius:50%;border:2px solid #ff3300;pointer-events:none;transform:translate(-50%,-50%) scale(0);z-index:9997;box-shadow:0 0 18px #ff3300,inset 0 0 12px #ff330055;`;
    document.body.appendChild(ring);
    ring.animate(
      [{transform:"translate(-50%,-50%) scale(0)",opacity:.9},
       {transform:"translate(-50%,-50%) scale(1.6)",opacity:0}],
      {duration:500, delay:100, easing:"ease-out", fill:"forwards"}
    );
    setTimeout(()=>ring.remove(), 640);
  };

  // Impact frames — white screen flash + enhanced enemy shake on attack landing
  const triggerImpact = (strength=1) => {
    setImpactFlash(strength);
    setTimeout(()=>setImpactFlash(0), strength===2 ? 120 : 80);
    setEnemyFlash(true);
    setTimeout(()=>setEnemyFlash(false), strength===2 ? 280 : 200);
  };

  /* ── Game flow ────────────────────────────────────────────── */
  const startGame = (wid) => {
    const w = ALL_WEAPONS[wid];
    setPlayer({hp:60,maxHp:60,str:0,level:1,xp:0,weapons:[wid],potions:[],floor:0,visited:[],class:w.className,classEmoji:w.classEmoji,heroLooks:randomHeroLooks()});
    setRunStartTime(Date.now());
    setScreen("map");
  };

  const startCombat = (node) => {
    const e = ENEMIES[node.enemy];
    const elite = node.type === "elite";
    const hp  = elite ? Math.round(e.hp  * 1.6) : e.hp;
    const atk = elite ? Math.round(e.atk * 1.3) : e.atk;
    const xp  = elite ? Math.round(e.xp  * 1.8) : e.xp;
    if (node.enemy==="dragon") sfx.bossStart(); else sfx.combatStart();
    const eSprite = node.enemy!=="dragon" ? ENEMY_SPRITE_POOL[Math.floor(Math.random()*ENEMY_SPRITE_POOL.length)] : null;
    const eName = eSprite ? eSprite.name : e.name;
    setCs({ enemy:{...e,id:node.enemy,name:eName,maxHp:hp,hp,atk,xp}, elite,
            log:[`${elite?"⚠️ ELITE — ":""}A ${eName} materialises before you!`],
            phase:"action", nodeId:node.id, nodeFloor:node.fl, enemySprite:eSprite });
    setEnemyFlash(false);
    setQteAnim(null);
    setScreen("combat");
  };

  /* ── Core attack resolution ──────────────────────────────── */
  const resolveAttack = (q, weapon, dmgOverride=null) => {
    const mult = q==="perfect"?1.5:q==="good"?1.0:0.3;
    const dmg  = dmgOverride!==null ? dmgOverride : Math.floor((weapon.baseDmg+(player?.str||0))*mult);
    // PvP routing — bypass normal combat entirely
    if (pvpModeRef.current && pvpAtkCbRef.current) {
      pvpAtkCbRef.current(q, weapon, dmg);
      return;
    }
    if (q!=="miss" && dmgOverride===null) triggerImpact(q==="perfect"?2:1);
    // Weapon-colored burst at enemy on hit, plus impact trail
    const wCol = WEAPON_PART_COL[weapon?.id] || WEAPON_PART_COL.default;
    if (q!=="miss") {
      triggerProjectileTrail(HR_L+HSW/2, HR_T+HSH/2, ENX, GNDY-40, wCol);
      triggerParticles(ENX, GNDY-40, wCol, q==="perfect"?48:28);
      if (q==="perfect") setTimeout(()=>triggerParticles(ENX, GNDY-40, "#ffffff", 18), 60);
    }
    showHit(q==="perfect"?`PERFECT! −${dmg}`:q==="good"?`HIT −${dmg}`:`MISS −${dmg}`,
            q==="perfect"?"#44ff88":q==="good"?"#ffcc44":"#666");
    setEnemyFlash(true);
    setTimeout(()=>setEnemyFlash(false), 450);

    // Pick boss attack pattern now so we can close over it in setCs + setTimeout
    const bossAtk = cs?.enemy?.id === "dragon" ? (Math.random() < 0.5 ? "cleave" : "charge") : null;
    setCs(prev=>{
      if(!prev) return prev;
      const newHp  = Math.max(0, prev.enemy.hp - dmg);
      const logMsg = q==="perfect"?`⭐ ${weapon.name}: PERFECT for ${dmg}!`:
                     q==="good"   ?`${weapon.emoji} ${weapon.name} hits for ${dmg}.`:
                                   `${weapon.emoji} Glancing blow — ${dmg}.`;
      if (newHp <= 0) {
        sfx.enemyDie();
        if (prev.enemy.id === "dragon") sfx.slimeDeath();
        setTimeout(()=>{
          setPlayer(p=>p?({...p,xp:p.xp+prev.enemy.xp,floor:p.floor+1,visited:[...p.visited,prev.nodeId]}):p);
          if (prev.enemy.id === "dragon") {
            if (gameMode === "race") {
              const won = !oppSnap?.dragonKilled;
              setIWonRace(won);
              // Winner of race gets opponent to drop RPG; loser gets RPG guaranteed
              setPlayer(p => {
                if (!p) return p;
                const newWeapons = won ? p.weapons : [...new Set([...p.weapons, "rpg"])];
                mpSend({ type:"state", dragonKilled: true, weapon: newWeapons[0] ?? "sword" });
                return {...p, weapons: newWeapons};
              });
              setMpStatus("pvp_wait");
              setScreen("pvp_wait");
            } else {
              // Solo mode: always drop the RPG on dragon kill
              setPlayer(p => p ? {...p, weapons: [...new Set([...p.weapons, "rpg"])]} : p);
              setScreen("victory");
            }
            return;
          }
          setPlayer(p=>{ setRewards(pickRewards(p?.weapons||[], prev.elite)); return p; });
          setScreen("reward");
        }, 1100);
        return {...prev, enemy:{...prev.enemy,hp:0}, phase:"won", log:[...prev.log,logMsg]};
      }
      setTimeout(()=>startDefendQTE(bossAtk), cs?.enemy?.id==="dragon" ? 300 : 880);
      return {...prev, enemy:{...prev.enemy,hp:newHp}, phase:"enemy_turn", bossAttackPattern:bossAtk, log:[...prev.log,logMsg]};
    });
  };

  const handleDefend = (q) => {
    // PvP routing
    if (pvpModeRef.current && pvpDefCbRef.current) { pvpDefCbRef.current(q); return; }
    const atk = (cs?.enemy?.atk||0) * (cs?.enemyAtkMult||1);
    const mult = q==="perfect"?0:q==="good"?.4:1.0;
    const dmg  = Math.floor(atk*mult);
    // Projectile trail enemy → hero, then burst
    triggerProjectileTrail(ENX, GNDY-40, HR_L+HSW/2, HR_T+HSH/2, q==="miss"?"#ff4444":"#4488ff");
    if (q==="miss") triggerParticles(HR_L+HSW/2, HR_T+HSH/2, "#ff4444", 36);
    else if (q==="good") triggerParticles(HR_L+HSW/2, HR_T+HSH/2, "#4488ff", 28);
    else { triggerParticles(HR_L+HSW/2, HR_T+HSH/2, "#88ddff", 52); setTimeout(()=>triggerParticles(HR_L+HSW/2, HR_T+HSH/2, "#ffffff", 24), 80); }
    if(q==="perfect") sfx.parry(); else if(q==="good") sfx.blockHit(); else sfx.takeDmg();
    showHit(q==="perfect"?"PARRIED!":q==="good"?`BLOCKED −${dmg}hp`:`HIT −${dmg}hp`,
            q==="perfect"?"#44aaff":q==="good"?"#4488ff":"#ff4444");
    setPlayer(p=>{
      if(!p) return p;
      const nhp = Math.max(0, p.hp-dmg);
      if (nhp <= 0) setTimeout(()=>setScreen("gameover"), 650);
      return {...p, hp:nhp};
    });
    setCs(prev=>prev?({...prev,phase:"action",
      log:[...prev.log, q==="perfect"?"⚡ Perfect parry! 0 damage.":
                        q==="good"   ?`Blocked — ${dmg} through.`:
                                      `${prev.enemy.name} slams for ${dmg}!`]}):prev);
  };

  const applyReward = (r) => {
    setPlayer(p=>{
      if(!p) return p;
      const n={...p};
      if(r.type==="heal") n.hp=Math.min(p.maxHp,p.hp+r.value);
      if(r.type==="stat"){n[r.stat]=p[r.stat]+r.value;if(r.stat==="maxHp")n.hp=p.hp+r.value;}
      if(r.type==="weapon"&&!p.weapons.includes(r.weaponId)) n.weapons=[...p.weapons,r.weaponId];
      if(r.type==="potion") n.potions=[...(p.potions||[]),r.potion];
      return n;
    });
    setRewards(null); setScreen("map");
  };

  const usePotion = (idx) => {
    const potion = player?.potions?.[idx];
    if (!potion) return;
    sfx.potionUse();
    setPlayer(p=>p?({...p,potions:p.potions.filter((_,i)=>i!==idx)}):p);
    if (potion.effect==="damage") {
      const dmg = potion.value;
      triggerParticles(ENX, GNDY - 40, "#ff8822");
      showHit(`💣 BOMB −${dmg}`, "#ff8844");
      setCs(prev=>{
        if(!prev) return prev;
        const newHp=Math.max(0,prev.enemy.hp-dmg);
        const log=[...prev.log,`💣 Bomb deals ${dmg} damage!`];
        if(newHp<=0){
          sfx.enemyDie();
          if(prev.enemy.id==="dragon") sfx.slimeDeath();
          setTimeout(()=>{
            setPlayer(p=>p?({...p,xp:p.xp+prev.enemy.xp,floor:p.floor+1,visited:[...p.visited,prev.nodeId]}):p);
            if(prev.enemy.id==="dragon"){
              if(gameMode==="race"){const won=!oppSnap?.dragonKilled;setIWonRace(won);setPlayer(p=>{if(!p)return p;const nw=won?p.weapons:[...new Set([...p.weapons,"rpg"])];mpSend({type:"state",dragonKilled:true,weapon:nw[0]??"sword"});return{...p,weapons:nw};});setMpStatus("pvp_wait");setScreen("pvp_wait");}else{setPlayer(p=>p?{...p,weapons:[...new Set([...p.weapons,"rpg"])]}:p);setScreen("victory");}return;
            }
            setPlayer(p=>{setRewards(pickRewards(p?.weapons||[], prev.elite));return p;});
            setScreen("reward");
          },800);
          return {...prev,enemy:{...prev.enemy,hp:0},phase:"won",log};
        }
        return {...prev,enemy:{...prev.enemy,hp:newHp},log};
      });
    } else if (potion.effect==="weaken") {
      triggerParticles(ENX, GNDY-50, "#88ccff");
      showHit("🧊 WEAKENED!", "#88ccff");
      setCs(prev=>prev?({...prev,enemyAtkMult:(prev.enemyAtkMult||1)*(1-potion.value),
        log:[...prev.log,`🧊 Enemy weakened — ATK −${Math.round(potion.value*100)}%!`]}):prev);
    } else if (potion.effect==="strengthen") {
      triggerParticles(HR_L+HSW/2, HR_T+HSH/2, "#ffcc44");
      showHit(`🔮 +${potion.value} ATK!`, "#ffcc44");
      setPlayer(p=>p?({...p,str:(p.str||0)+potion.value}):p);
    } else if (potion.effect==="heal") {
      triggerParticles(HR_L+HSW/2, HR_T+HSH/2, "#44ff88");
      showHit(`💉 +${potion.value} HP`, "#44ff88");
      setPlayer(p=>p?({...p,hp:Math.min(p.maxHp,p.hp+potion.value)}):p);
    }
  };

  /* ── QTE STARTERS ─────────────────────────────────────────── */

  const startAttack = (weapon) => {
    const starters = {
      swing_beat:      ()=>startSwingBeatQTE(weapon),
      hold_release:    ()=>startChargeQTE(weapon),
      rapid_tap:       ()=>startRapidTapQTE(weapon),
      sequence:        ()=>startSequenceQTE(weapon),
      sequence_reveal: ()=>startRPGQTE(weapon),
      stomp:           ()=>startStompQTE(weapon),
      poke:            ()=>startPokeQTE(weapon),
      archery:         ()=>startArcheryQTE(weapon),
      dual_action:     ()=>startDualActionQTE(weapon),
    };
    setCs(prev=>prev?{...prev,phase:"attacking"}:prev);
    triggerWeaponSwing(weapon);
    (starters[weapon.qteType] || starters.swing_beat)();
  };

  // ── SWING BEAT: A → W → D combo ──
  // Misinput: cross off that key, advance to next. Any misinput = 50% damage cap.
  // All correct = damage scales with speed (perfect/good). 3 correct inputs max.
  const BEAT_WALK_MS  = 320;
  const BEAT_TIMEOUT  = 2200;
  const BEAT_COMBO    = ["A","W","D"];
  const startSwingBeatQTE = (weapon) => {
    const ref = qteRef.current;
    ref.done         = false;
    ref.step         = 0;          // index of next expected key (0-2)
    ref.results      = [null,null,null]; // null | "hit" | "miss" per key
    ref.hadMisinput  = false;
    ref.comboStartMs = null;
    ref.qteOpenMs    = null;
    sfx.swordWalk();
    setQteAnim({ type:"swing_beat", weapon, t:0, step:0, results:[null,null,null], qteOpenMs:null });

    setTimeout(() => {
      if (ref.done) return;
      ref.qteOpenMs = performance.now();

      const finishCombo = () => {
        ref.done = true;
        window.removeEventListener("keydown", onKey);
        clearTimeout(ref.beatTimer);
        const hits = ref.results.filter(r=>r==="hit").length; // 0-3
        let mult, q, dmg;
        if (ref.hadMisinput) {
          // Any misinput → locked at 50%
          mult = 0.50; q = "good";
        } else {
          // All correct — speed-based: fast = perfect, slow = good
          const elapsed = performance.now() - ref.comboStartMs;
          mult = elapsed < 500 ? 1.5 : elapsed < 900 ? 1.0 : 0.75;
          q    = elapsed < 500 ? "perfect" : "good";
        }
        dmg = Math.max(1, Math.floor((weapon.baseDmg+(player?.str||0)) * mult));
        if (q==="perfect") sfx.swordPerfect();
        triggerImpact(q==="perfect"?2:1);
        const hitsLabel = `${hits}/3`;
        showHit(
          q==="perfect" ? `PERFECT! ${hitsLabel} −${dmg}`
          : ref.hadMisinput ? `PARTIAL ${hitsLabel} −${dmg}`
          : `GOOD! ${hitsLabel} −${dmg}`,
          q==="perfect"?"#44ff88":ref.hadMisinput?"#ffaa22":"#ffcc44"
        );
        setQteAnim(null);
        setTimeout(()=>resolveAttack(q,weapon,dmg), 60);
      };

      const onKey = (e) => {
        if (ref.done) return;
        const k = e.key.toUpperCase();
        // Only react to the 3 combo keys
        if (!["A","W","D"].includes(k)) return;
        e.preventDefault();
        if (ref.step === 0 && ref.comboStartMs === null) ref.comboStartMs = performance.now();
        const expected = BEAT_COMBO[ref.step];
        if (k === expected) {
          sfx.swordKey(ref.step);
          ref.results[ref.step] = "hit";
        } else {
          // Wrong key — cross off current slot, advance
          sfx.swordBadKey();
          ref.results[ref.step] = "miss";
          ref.hadMisinput = true;
        }
        ref.step++;
        setQteAnim(prev=>prev?{...prev, step:ref.step, results:[...ref.results], hadMisinput:ref.hadMisinput}:null);
        if (ref.step >= BEAT_COMBO.length) finishCombo();
      };
      window.addEventListener("keydown", onKey);

      ref.beatTimer = setTimeout(()=>{
        if (ref.done) return;
        ref.done = true;
        window.removeEventListener("keydown", onKey);
        const dmg = Math.max(1, Math.floor((weapon.baseDmg+(player?.str||0))*0.30));
        showHit("TIMEOUT −"+dmg, "#666");
        setQteAnim(null);
        setTimeout(()=>resolveAttack("miss",weapon,dmg), 60);
      }, BEAT_TIMEOUT);
    }, BEAT_WALK_MS);

    const walkStart = performance.now();
    const BEAT_ANIM_DUR = BEAT_WALK_MS + BEAT_TIMEOUT;
    const tick = () => {
      if (ref.done) return;
      const t = Math.min(1,(performance.now()-walkStart)/BEAT_ANIM_DUR);
      setQteAnim(prev=>prev?{...prev, t, step:ref.step,
        results:[...ref.results], hadMisinput:ref.hadMisinput,
        qteOpenMs:ref.qteOpenMs, comboStartMs:ref.comboStartMs}:null);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  // ── HOLD-RELEASE: charge up the weapon, release in the green zone ──
  // Bar fills 0→100% over CHARGE_MAX_MS. At 100% = auto overcharge (miss).
  // Perfect zone: 78-95% of bar. Good zone: 60-78%.
  const CHARGE_MAX_MS = 2500;
  const CHARGE_PERFECT_LO = 0.72;
  const CHARGE_PERFECT_HI = 0.94; // 22% window = ~550ms
  const startChargeQTE = (weapon) => {
    const ref = qteRef.current;
    ref.holdStart = null; ref.released = false; ref.releaseCharge = 0;
    setQteAnim({ type:"hold_release", weapon, charge:0, released:false, releaseT:0 });

    const onDown = (e) => {
      if (e.code!=="Space"||ref.holdStart!==null||ref.released) return;
      e.preventDefault(); ref.holdStart = performance.now();
      ref.sfxStopHammer = sfx.hammerHold();
    };
    const resolve = (c) => {
      ref.released = true;
      ref.releaseCharge = c;
      if(ref.sfxStopHammer){ref.sfxStopHammer();ref.sfxStopHammer=null;}
      window.removeEventListener("keydown",onDown);
      window.removeEventListener("keyup",onUp);
      clearTimeout(ref.autoTimer);
      const q = c>=CHARGE_PERFECT_LO&&c<1.0?"perfect":c>=0.50&&c<1.0?"good":"miss";
      const isOvercharge = c>=1.0;
      if (isOvercharge) {
        sfx.hammerOvercharge();
        showHit("OVERCHARGE!","#cc3322");
        setQteAnim(null);
        setTimeout(()=>resolveAttack("miss",weapon),80);
        return;
      }
      if(q==="perfect") sfx.hammerPerfect(); else if(q==="good") sfx.hammerGood();
      if (q!=="miss") triggerImpact(q==="perfect"?2:1);
      showHit(q==="perfect"?"PERFECT!":q==="good"?"GOOD!":"MISS!",
              q==="perfect"?"#44ff88":q==="good"?"#ffcc44":"#666");
      const t0 = performance.now();
      const RDUR = 180;
      const lunge = () => {
        const rt = Math.min(1,(performance.now()-t0)/RDUR);
        setQteAnim(prev=>prev?{...prev,charge:c,released:true,releaseT:rt}:null);
        if (rt<1) requestAnimationFrame(lunge);
        else { setQteAnim(null); resolveAttack(q,weapon); }
      };
      requestAnimationFrame(lunge);
    };
    const onUp = (e) => {
      if (e.code!=="Space"||ref.holdStart===null||ref.released) return;
      resolve(Math.min(1,(performance.now()-ref.holdStart)/CHARGE_MAX_MS));
    };
    window.addEventListener("keydown",onDown);
    window.addEventListener("keyup",onUp);

    // Live bar update
    const tick = () => {
      if (ref.released) return;
      const charge = ref.holdStart ? Math.min(1,(performance.now()-ref.holdStart)/CHARGE_MAX_MS) : 0;
      setQteAnim(prev=>prev?{...prev,charge}:null);
      if (charge >= 1) { resolve(1); return; } // auto overcharge
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  // ── RAPID TAP: mash SPACE — hero oscillates toward enemy ──
  const RAPID_DUR = 1800;
  const startRapidTapQTE = (weapon) => {
    const ref = qteRef.current;
    const tapTarget = weapon.tapTarget||8;
    ref.startMs = performance.now(); ref.taps = 0; ref.done = false;
    setQteAnim({ type:"rapid_tap", weapon, t:0, taps:0, tapTarget });

    const onKey = (e) => {
      if (e.code!=="Space"||ref.done) return;
      e.preventDefault();
      ref.taps++;
      sfx.daggerTap();
      setQteAnim(prev=>prev?{...prev,taps:ref.taps}:null);
      if (ref.taps>=tapTarget) {
        ref.done=true;
        window.removeEventListener("keydown",onKey);
        sfx.daggerFlurry();
        showHit("PERFECT!", "#44ff88");
        setQteAnim(null);
        setTimeout(()=>resolveAttack("perfect",weapon), 80);
      }
    };
    window.addEventListener("keydown",onKey);

    const tick = () => {
      if (ref.done) return;
      const t = Math.min(1,(performance.now()-ref.startMs)/RAPID_DUR);
      setQteAnim(prev=>prev?{...prev,t}:null);
      if (t<1) { requestAnimationFrame(tick); return; }
      window.removeEventListener("keydown",onKey);
      ref.done = true;
      const ratio = Math.min(1,ref.taps/tapTarget);
      const q = ratio>=.85?"perfect":ratio>=.5?"good":"miss";
      showHit(q==="perfect"?"PERFECT!":q==="good"?`GOOD! x${ref.taps}`:`WEAK x${ref.taps}`,
              q==="perfect"?"#44ff88":q==="good"?"#ffcc44":"#666");
      setQteAnim(null);
      setTimeout(()=>resolveAttack(q,weapon), 80);
    };
    requestAnimationFrame(tick);
  };

  // ── POKE: charge at enemy, alternate A/D rapidly ──
  const POKE_DUR = 2200;
  const POKE_TARGET = 14;
  const startPokeQTE = (weapon) => {
    const ref = qteRef.current;
    ref.startMs = performance.now();
    ref.inputs = 0; ref.done = false; ref.lastKey = null;
    setQteAnim({ type:"poke", weapon, t:0, inputs:0, tapTarget:POKE_TARGET });

    const onKey = (e) => {
      if (ref.done) return;
      const k = e.key.toUpperCase();
      if (k!=="A"&&k!=="D") return;
      e.preventDefault();
      if (k!==ref.lastKey) { // must alternate
        sfx.pokeTap(ref.inputs);
        ref.inputs++;
        ref.lastKey=k;
        setQteAnim(prev=>prev?{...prev,inputs:ref.inputs,lastKey:k}:null);
        if (ref.inputs>=POKE_TARGET) {
          ref.done=true;
          window.removeEventListener("keydown",onKey);
          clearTimeout(ref.pokeTimer);
          showHit("PERFECT!", "#44ff88");
          setQteAnim(null);
          setTimeout(()=>resolveAttack("perfect",weapon),80);
        }
      }
    };
    window.addEventListener("keydown",onKey);

    ref.pokeTimer = setTimeout(()=>{
      if (!ref.done) {
        ref.done=true;
        window.removeEventListener("keydown",onKey);
        const ratio = ref.inputs/POKE_TARGET;
        const q = ratio>=.85?"perfect":ratio>=.5?"good":"miss";
        const dmg = Math.max(1,Math.floor((weapon.baseDmg+(player?.str||0))*ratio*1.8));
        showHit(q==="perfect"?"PERFECT!":q==="good"?`GOOD! ${ref.inputs}/${POKE_TARGET}`:`WEAK! ${ref.inputs}/${POKE_TARGET}`,
                q==="perfect"?"#44ff88":q==="good"?"#ffcc44":"#666");
        setQteAnim(null);
        setTimeout(()=>resolveAttack(q,weapon,Math.max(1,dmg)),80);
      }
    },POKE_DUR);

    const tick = ()=>{
      if (ref.done) return;
      const t = Math.min(1,(performance.now()-ref.startMs)/POKE_DUR);
      setQteAnim(prev=>prev?{...prev,t}:null);
      if (t<1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  // ── ARCHERY: moving dot on target, press SPACE when near center ──
  const ARCHERY_DUR = 4500;
  const ARCHERY_DOTS = 3;
  const startArcheryQTE = (weapon) => {
    const ref = qteRef.current;
    ref.startMs = performance.now();
    ref.shotsFired = 0; // how many SPACE presses done (0-3)
    ref.lockedDots = []; // [{x,y,q,dmg}] per locked dot
    ref.done = false;
    // Pulse-through-center motion: dot spirals in/out so it reliably crosses bullseye
    // spinFreq controls orbit speed, pulseFreq controls how often it hits center
    // Fixed stagger — each dot hits center at 1/3 period offsets, guaranteed async
    const DOT_PARAMS = [
      { spinFreq:2.2, pulseFreq:1.1,  spinPhase:0,               pulsePhase:0 },
      { spinFreq:2.9, pulseFreq:1.35, spinPhase:Math.PI*2*0.37,  pulsePhase:Math.PI*2/3 },
      { spinFreq:1.7, pulseFreq:1.6,  spinPhase:Math.PI*2*0.71,  pulsePhase:Math.PI*4/3 },
    ];
    ref.dots = Array.from({length:ARCHERY_DOTS},(_,i)=>({
      spinFreq:  DOT_PARAMS[i].spinFreq,
      pulseFreq: DOT_PARAMS[i].pulseFreq,
      spinPhase:  DOT_PARAMS[i].spinPhase,
      pulsePhase: DOT_PARAMS[i].pulsePhase,
      x:0, y:0,
    }));
    ref.sfxStopBow = sfx.bowDraw();
    setQteAnim({ type:"archery", weapon, t:0, dots:ref.dots.map(d=>({x:0,y:0})), lockedDots:[], shotsFired:0, dotParams:DOT_PARAMS.map(p=>({...p})) });

    const onKey = (e) => {
      if (e.code!=="Space"||ref.done) return;
      e.preventDefault();
      const idx = ref.shotsFired;
      if (idx >= ARCHERY_DOTS) return;
      // Lock the active dot at current position
      const d = ref.dots[idx];
      const dist = Math.sqrt(d.x*d.x+d.y*d.y);
      const q = dist<0.20?"perfect":dist<0.56?"good":"miss";
      const dmgMult = dist<0.20?1.6:dist<0.56?1.0:0.3;
      const dmg = Math.max(1,Math.floor((weapon.baseDmg+(player?.str||0))*dmgMult));
      ref.lockedDots.push({x:d.x,y:d.y,q,dmg});
      ref.shotsFired++;
      sfx.bowRelease();
      setQteAnim(prev=>prev?{...prev,shotsFired:ref.shotsFired,lockedDots:[...ref.lockedDots]}:null);

      if (ref.shotsFired >= ARCHERY_DOTS) {
        // All dots locked — fire 3 arrows sequentially
        ref.done = true;
        if(ref.sfxStopBow){ref.sfxStopBow();ref.sfxStopBow=null;}
        window.removeEventListener("keydown",onKey);
        const locked = [...ref.lockedDots];
        let totalDmg = locked.reduce((s,ld)=>s+ld.dmg,0);
        const scores = locked.map(ld=>ld.q);
        const bestQ = scores.includes("perfect")?"perfect":scores.includes("good")?"good":"miss";
        // Fire arrows one by one with 200ms stagger
        setQteAnim(prev=>prev?{...prev,firingArrows:true,arrows:[],lockedDots:locked}:null);
        const ARROW_DUR = 260;
        locked.forEach((ld,arrowIdx)=>{
          setTimeout(()=>{
            sfx.arrowFlight();
            const arrowStart = performance.now();
            const arrowTick = ()=>{
              const af = Math.min(1,(performance.now()-arrowStart)/ARROW_DUR);
              setQteAnim(prev=>prev?{...prev,arrows:(prev.arrows||[]).map((a,i)=>i===arrowIdx?{...a,frac:af}:a)}:null);
              if(af<1){requestAnimationFrame(arrowTick);return;}
              sfx.arrowHit(ld.q);
              if(ld.q!=="miss"){
                triggerImpact(ld.q==="perfect"?2:1);
                const eDims2=ENEMY_DIMS[cs?.enemy?.id]||{h:70};
                triggerParticles(ENX, GNDY-eDims2.h*1.1*0.5, ld.q==="perfect"?"#ffee44":"#ffbb33", ld.q==="perfect"?36:22);
              }
              // After last arrow
              if(arrowIdx===locked.length-1){
                const hitCount = scores.filter(s=>s!=="miss").length;
                showHit(hitCount===3?"TRIPLE HIT!":hitCount>0?`HIT x${hitCount}`:"MISSED!",
                        bestQ==="perfect"?"#44ff88":bestQ==="good"?"#ffcc44":"#666");
                setTimeout(()=>{ setQteAnim(null); resolveAttack(bestQ,weapon,totalDmg); },280);
              }
            };
            requestAnimationFrame(arrowTick);
            setQteAnim(prev=>prev?{...prev,arrows:[...(prev.arrows||[]),{idx:arrowIdx,frac:0,x:ld.x,y:ld.y,q:ld.q}]}:null);
          }, arrowIdx*220);
        });
      }
    };
    window.addEventListener("keydown",onKey);

    const tick = ()=>{
      if (ref.done) return;
      const elapsed = performance.now()-ref.startMs;
      const t = Math.min(1,elapsed/ARCHERY_DUR);
      const tSec = elapsed/1000;
      ref.dots.forEach(d=>{
        // Radius pulses 0→1→0, so dot passes through center once per pulseFreq cycle
        const r     = (Math.sin(tSec*d.pulseFreq*Math.PI*2+d.pulsePhase)+1)*0.5;
        const angle = tSec*d.spinFreq*Math.PI*2+d.spinPhase;
        d.x = r*Math.cos(angle);
        d.y = r*Math.sin(angle);
      });
      setQteAnim(prev=>prev?{...prev,t,dots:ref.dots.map(d=>({x:d.x,y:d.y}))}:null);
      if (t<1) { requestAnimationFrame(tick); return; }
      // Time ran out — lock remaining dots as misses and fire
      while(ref.shotsFired<ARCHERY_DOTS){
        const d=ref.dots[ref.shotsFired];
        ref.lockedDots.push({x:d.x,y:d.y,q:"miss",dmg:0});
        ref.shotsFired++;
      }
      ref.done=true;
      if(ref.sfxStopBow){ref.sfxStopBow();ref.sfxStopBow=null;}
      window.removeEventListener("keydown",onKey);
      showHit("TOO SLOW!","#666");
      setQteAnim(null);
      setTimeout(()=>resolveAttack("miss",weapon,0),80);
    };
    requestAnimationFrame(tick);
  };

  // ── Magic bolt: fires from hero to enemy after sequence completes ──
  const fireMagicBolt = (q, dmg, weapon) => {
    sfx.magicBolt(q);
    const start = performance.now();
    const BOLT_DUR = 380;
    setQteAnim({ type:"magic_bolt", weapon, t:0, q });
    const tick = () => {
      const t = Math.min(1,(performance.now()-start)/BOLT_DUR);
      setQteAnim(prev=>prev?{...prev,t}:null);
      if (t<1) { requestAnimationFrame(tick); return; }
      triggerImpact(q==="perfect"?2:1);
      // Particle burst at enemy on bolt impact
      const bCol = q==="perfect"?"#cc44ff":q==="good"?"#8833ff":"#444466";
      const _bDims = ENEMY_DIMS[cs?.enemy?.id]||{h:70};
      const _bTop  = GNDY - _bDims.h*1.1;
      triggerParticles(ENX, _bTop+_bDims.h*0.4, bCol, q==="perfect"?44:28);
      showHit(q==="perfect"?"PERFECT!":q==="good"?"GOOD!":"MISS!", q==="perfect"?"#44ff88":q==="good"?"#ffcc44":"#666");
      setQteAnim(null);
      setTimeout(()=>resolveAttack(q,weapon,dmg), 80);
    };
    requestAnimationFrame(tick);
  };

  // ── SEQUENCE: all A-Z keys, 8 runes, 3.5s, damage by correct count ──
  const SEQ_DUR = 4000;
  const ALL_KEYS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const startSequenceQTE = (weapon) => {
    const ref = qteRef.current;
    const len = Math.max(8, weapon.seqLength||8);
    const seq = Array.from({length:len},()=>ALL_KEYS[Math.floor(Math.random()*ALL_KEYS.length)]);
    ref.seq = seq; ref.input = []; ref.correctCount = 0; ref.done = false; ref.startMs = performance.now();
    castStartRef.current = ref.startMs; // real start timestamp for accurate timer
    setCastTick(0); // drives re-renders every 30ms; elapsed computed from castStartRef
    setQteAnim({ type:"sequence", weapon, t:0, seq, input:[], correctCount:0, badKey:false });

    const onKey = (e) => {
      if (ref.done) return;
      const k = e.key.toUpperCase();
      if (!/^[A-Z]$/.test(k)) return;
      e.preventDefault();
      const pos = ref.input.length;
      if (pos >= seq.length) return;
      const correct = k === seq[pos];
      if (correct) { sfx.runeCorrect(pos); ref.correctCount++; } else sfx.runeWrong();
      ref.input = [...ref.input, k];
      if (ref.input.length >= seq.length) {
        ref.done = true;
        window.removeEventListener("keydown",onKey);
        clearTimeout(ref.seqTimer);
        const ratio = ref.correctCount / seq.length;
        const q = ratio>=.75?"perfect":ratio>=.45?"good":"miss";
        const dmg = Math.max(1,Math.floor((weapon.baseDmg+(player?.str||0))*ratio*2.2));
        fireMagicBolt(q, dmg, weapon);
      } else {
        setQteAnim(prev=>prev?{...prev,input:ref.input,correctCount:ref.correctCount,badKey:!correct}:null);
        if (!correct) setTimeout(()=>setQteAnim(prev=>prev?{...prev,badKey:false}:null),200);
      }
    };
    window.addEventListener("keydown",onKey);

    ref.seqTimer = setTimeout(()=>{
      if (!ref.done) {
        ref.done=true;
        window.removeEventListener("keydown",onKey);
        const ratio = ref.correctCount / seq.length;
        const q = ratio>=.75?"perfect":ratio>=.45?"good":"miss";
        const dmg = Math.max(1,Math.floor((weapon.baseDmg+(player?.str||0))*ratio*2.2));
        fireMagicBolt(q, dmg, weapon);
      }
    }, SEQ_DUR);

    const tick = () => {
      if (ref.done) return;
      const t = Math.min(1,(performance.now()-ref.startMs)/SEQ_DUR);
      setQteAnim(prev=>prev?{...prev,t}:null);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  // ── STOMP ──────────────────────────────────────────────────────
  // Contact 0: hero arcs FROM home TO enemy head (approach only).
  //   Miss → return home immediately.
  //   Hit  → hero stays on enemy head, contact 1 begins.
  // Contact 1: hero bounces UP from enemy head and lands back on it.
  //   After landing → return home, then resolve.
  const startStompQTE = (weapon) => {
    const dims = ENEMY_DIMS[cs?.enemy?.id]||{w:55,h:70};
    const eScaledH = dims.h*1.1;
    const landTop  = GNDY - eScaledH - HSH;
    const landLeft = ENX - HSW/2;
    const ref = qteRef.current;
    ref.landLeft = landLeft; ref.landTop = landTop;
    let totalDmg = 0;

    const returnHome = (cb) => {
      const start = performance.now();
      setQteAnim({ type:"stomp_return", weapon, t:0 });
      const tick = () => {
        const rt = Math.min(1,(performance.now()-start)/300);
        setQteAnim(prev=>prev?{...prev,t:rt}:null);
        if (rt<1) { requestAnimationFrame(tick); return; }
        setQteAnim(null); cb();
      };
      requestAnimationFrame(tick);
    };

    const doContact = (contactNum, onDone) => {
      const jumpStart = performance.now();
      ref.pressMs = null; ref.flashDone = false;
      // Contact 0 = approach only (short); contact 1 = full bounce arc
      const dur = contactNum===0 ? STOMP_APPROACH_DUR : STOMP_DUR;
      if(contactNum===0) sfx.stompApproach(); else sfx.stompBounce();
      setQteAnim({ type:"stomp", weapon, t:0, bounce:contactNum });

      const onKey = (e) => {
        if (e.code!=="Space"||ref.pressMs!==null) return;
        e.preventDefault(); ref.pressMs = performance.now();
      };
      window.addEventListener("keydown",onKey);

      const tick = () => {
        const t = Math.min(1,(performance.now()-jumpStart)/dur);
        setQteAnim(prev=>prev?{...prev,t,bounce:contactNum}:null);
        // Flash just before landing (t~0.92 for both contacts)
        const flashAt = 0.92;
        if (t>=flashAt&&!ref.flashDone) {
          ref.flashDone=true;
          triggerImpact(1);
        }
        if (t<1) { requestAnimationFrame(tick); return; }
        window.removeEventListener("keydown",onKey);
        // Target moment: end of animation when hero visually lands on enemy
        const targetMs = jumpStart + dur;
        const diff = ref.pressMs!=null ? Math.abs(ref.pressMs-targetMs) : 99999;
        onDone(diff<110?"perfect":diff<270?"good":"miss");
      };
      requestAnimationFrame(tick);
    };

    const dmgFor = q => Math.floor((weapon.baseDmg+(player?.str||0))*(q==="perfect"?1.5:q==="good"?1.0:0.25));

    doContact(0, q1 => {
      sfx.stompLand(q1);
      totalDmg += dmgFor(q1);
      if (q1==="miss") {
        showHit("MISS!", "#666");
        returnHome(()=>resolveAttack("miss",weapon,totalDmg));
        return;
      }
      // Hit — stay on enemy, do bounce QTE
      doContact(1, q2 => {
        sfx.stompLand(q2);
        totalDmg += dmgFor(q2);
        const best = [q1,q2].includes("perfect")?"perfect":"good";
        triggerImpact(best==="perfect"?2:1);
        showHit(best==="perfect"?`PERFECT! −${totalDmg}`:`GOOD! −${totalDmg}`, best==="perfect"?"#44ff88":"#ffcc44");
        returnHome(()=>resolveAttack(best,weapon,totalDmg));
      });
    });
  };

  // ── RPG ROCKET: fires massive rocket after sequence_reveal QTE ──
  const fireRPGRocket = (q, dmg, weapon) => {
    sfx.rpgLaunch();
    const start = performance.now();
    const ROCKET_DUR = 480;
    setQteAnim({ type:"rpg_rocket", weapon, t:0, q });
    const tick = () => {
      const t = Math.min(1,(performance.now()-start)/ROCKET_DUR);
      setQteAnim(prev=>prev?{...prev,t}:null);
      if (t<1) { requestAnimationFrame(tick); return; }
      // Massive multi-wave explosion
      sfx.rpgImpact();
      triggerImpact(2);
      triggerParticles(ENX, GNDY-50, "#ff4400", 52);
      setTimeout(()=>triggerParticles(ENX, GNDY-35, "#ffcc00", 36),90);
      setTimeout(()=>triggerParticles(ENX, GNDY-60, "#ff8800", 28),190);
      const isP = q==="perfect";
      showHit(isP?`DIRECT HIT! −${dmg}`:q==="good"?`HIT −${dmg}`:`MISS −${dmg}`,
              isP?"#ff6622":q==="good"?"#ffaa22":"#666", isP);
      setQteAnim(null);
      setTimeout(()=>resolveAttack(q,weapon,dmg),80);
    };
    requestAnimationFrame(tick);
  };

  // ── SEQUENCE REVEAL (RPG): 10 slots, yellow outline jumps randomly after each correct press ──
  // Max 200 dmg. -5% per wrong press or incomplete slot. Min 30% (60 dmg floor).
  const startRPGQTE = (weapon) => {
    const ref = qteRef.current;
    const len = weapon.seqLength || 10;
    const genKey = () => ALL_KEYS[Math.floor(Math.random()*ALL_KEYS.length)];
    const seq = Array.from({length:len}, genKey);
    // Pick random starting target
    const firstTarget = Math.floor(Math.random()*len);
    ref.seq = [...seq];
    ref.done = false;
    ref.doneSet = new Set();
    ref.targetIdx = firstTarget;
    ref.missCount = 0;
    ref.startMs = performance.now();
    castStartRef.current = ref.startMs;
    setCastTick(0);
    setQteAnim({ type:"sequence_reveal", weapon, t:0, seq:[...seq], targetIdx:firstTarget, doneIndices:[], missCount:0, badKey:false });

    const onKey = (e) => {
      if (ref.done) return;
      const k = e.key.toUpperCase();
      if (!/^[A-Z]$/.test(k)) return;
      e.preventDefault();
      const currentKey = ref.seq[ref.targetIdx];
      if (k === currentKey) {
        sfx.rpgSequenceKey();
        ref.doneSet.add(ref.targetIdx);
        if (ref.doneSet.size >= len) {
          // All done — perfect
          ref.done = true;
          window.removeEventListener("keydown", onKey);
          clearTimeout(ref.rpgTimer);
          const dmg = Math.round(200 * Math.max(0.30, 1 - ref.missCount * 0.05));
          fireRPGRocket("perfect", dmg, weapon);
        } else {
          // Jump to a random remaining (undone) slot
          const remaining = [];
          for (let i=0; i<len; i++) if (!ref.doneSet.has(i)) remaining.push(i);
          ref.targetIdx = remaining[Math.floor(Math.random()*remaining.length)];
          setQteAnim(prev=>prev?{...prev, targetIdx:ref.targetIdx, doneIndices:[...ref.doneSet], badKey:false}:null);
        }
      } else {
        sfx.runeWrong();
        ref.missCount++;
        setQteAnim(prev=>prev?{...prev, missCount:ref.missCount, badKey:true}:null);
        setTimeout(()=>setQteAnim(prev=>prev?{...prev,badKey:false}:null),200);
      }
    };
    window.addEventListener("keydown", onKey);

    ref.rpgTimer = setTimeout(()=>{
      if (!ref.done) {
        ref.done = true;
        window.removeEventListener("keydown", onKey);
        const incomplete = len - ref.doneSet.size;
        const dmg = Math.round(200 * Math.max(0.30, 1 - (ref.missCount + incomplete) * 0.05));
        const q = ref.doneSet.size >= len*0.75 ? "perfect" : ref.doneSet.size >= len*0.45 ? "good" : "miss";
        fireRPGRocket(q, dmg, weapon);
      }
    }, SEQ_DUR);

    const tick = () => {
      if (ref.done) return;
      const t = Math.min(1,(performance.now()-ref.startMs)/SEQ_DUR);
      setQteAnim(prev=>prev?{...prev,t}:null);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  // ── DUAL ACTION: hold A+W+D simultaneously, then left-click when dot centers ──
  const DUAL_DUR = 3500; // ms total window
  const startDualActionQTE = (weapon) => {
    const ref = qteRef.current;
    ref.done = false;
    ref.keysHeld = { a:false, w:false, d:false };
    ref.dotPos   = 0;          // 0–1, left→right
    ref.dotDir   = 1;
    ref.allHeld  = false;
    ref.dropCount = 0;         // how many times keys were dropped mid-hold
    ref.startMs  = performance.now();
    const dotSpeed   = weapon.dotSpeed   ?? 0.55;  // fraction/sec
    const centerW    = weapon.centerWidth ?? 0.18;

    let lastNow = performance.now();

    const cleanup = () => {
      window.removeEventListener("keydown",  onKeyDown);
      window.removeEventListener("keyup",    onKeyUp);
      window.removeEventListener("mousedown",onClick);
    };

    const resolve = (clickPos) => {
      if (ref.done) return;
      ref.done = true;
      cleanup();
      // Delay gunshot ~110ms so it fires as the projectile visually travels, not on click
      setTimeout(()=>sfx.dualGunshot(), 110);
      const dist = Math.abs(clickPos - 0.5);
      const half = centerW / 2;
      const q = dist < half*0.32 ? "perfect" : dist < half ? "good" : "miss";
      const base = (weapon.baseDmg + (player?.str||0)) * (q==="perfect"?1.5:q==="good"?1.0:0.3);
      const dmg  = Math.max(1, Math.floor(base * Math.max(0.3, 1 - ref.dropCount*0.18)));
      setQteAnim(null);
      resolveAttack(q, weapon, dmg);
    };

    const onKeyDown = (e) => {
      if (ref.done) return;
      const k = {a:"a",A:"a",w:"w",W:"w",d:"d",D:"d"}[e.key];
      if (!k) return;
      e.preventDefault();
      ref.keysHeld[k] = true;
    };

    const onKeyUp = (e) => {
      if (ref.done) return;
      const k = {a:"a",A:"a",w:"w",W:"w",d:"d",D:"d"}[e.key];
      if (!k) return;
      const wasAllHeld = ref.keysHeld.a && ref.keysHeld.w && ref.keysHeld.d;
      ref.keysHeld[k] = false;
      if (wasAllHeld) {
        // dropped a key while all were held → penalty, reset dot to nearest edge
        ref.dropCount++;
        ref.dotPos = ref.dotPos < 0.5 ? 0 : 1;
        ref.dotDir = ref.dotPos === 0 ? 1 : -1;
        sfx.runeWrong();
      }
    };

    const onClick = (e) => {
      if (e.button !== 0 || ref.done) return;
      e.preventDefault();
      sfx.dualClick();
      resolve(ref.dotPos);
    };

    const tick = () => {
      if (ref.done) return;
      const now = performance.now();
      const dt  = (now - lastNow) / 1000;
      lastNow = now;
      const t = Math.min(1, (now - ref.startMs) / DUAL_DUR);

      ref.allHeld = ref.keysHeld.a && ref.keysHeld.w && ref.keysHeld.d;
      if (ref.allHeld) {
        ref.dotPos += ref.dotDir * dotSpeed * dt;
        if (ref.dotPos >= 1) { ref.dotPos = 1; ref.dotDir = -1; }
        if (ref.dotPos <= 0) { ref.dotPos = 0; ref.dotDir =  1; }
      }

      // Ping SFX when dot crosses perfect center (within 2%)
      const inCenter = Math.abs(ref.dotPos - 0.5) < centerW * 0.32 * 0.5;

      setQteAnim(prev => prev ? {
        ...prev, t,
        dotPos:    ref.dotPos,
        dotDir:    ref.dotDir,
        allHeld:   ref.allHeld,
        keysHeld:  { ...ref.keysHeld },
        dropCount: ref.dropCount,
        inCenter,
      } : null);

      if (t < 1) requestAnimationFrame(tick);
      else { ref.done=true; cleanup(); resolveAttack("miss", weapon); }
    };

    setQteAnim({ type:"dual_action", weapon, t:0, dotPos:0, dotDir:1, allHeld:false,
      keysHeld:{a:false,w:false,d:false}, centerWidth:centerW, dropCount:0, inCenter:false });

    window.addEventListener("keydown",  onKeyDown);
    window.addEventListener("keyup",    onKeyUp);
    window.addEventListener("mousedown", onClick);
    requestAnimationFrame(tick);
  };

  // ── DEFEND: enemy launches projectile — press SPACE when it hits you ──
  // Wind-up: 0→LAUNCH_T, projectile travels: LAUNCH_T→ARRIVE_T
  // Per-enemy defend timing — each feels distinctly different
  // dur=total ms, launch=windup fraction, arrive=target fraction (where to press SPACE)
  const DEFEND_PROFILES = {
    goblin:        { dur:1000, launch:0.20, arrive:0.78, projPath:"bounce"      }, // rock bounces back and forth
    skeleton:      { dur:1300, launch:0.32, arrive:0.80, projPath:"zigzag"      }, // bone tumbles up-down
    eye:           { dur:1100, launch:0.14, arrive:0.88, projPath:"loop"        }, // orb spirals in a loop
    golem:         { dur:1600, launch:0.38, arrive:0.76, projPath:"straight"    }, // heavy boulder, direct
    wraith:        { dur: 950, launch:0.22, arrive:0.84, projPath:"zigzag"      }, // ghost energy zips erratically
    dragon:        { dur:1800, launch:0.72, arrive:0.95, projPath:"loop"        }, // fireball released after cleave animation peaks
    dragon_charge: { dur:1300, launch:0.68, arrive:0.94, projPath:"ground_rush" }, // surge released after charge winds up
    pvp_opp:       { dur:1100, launch:0.20, arrive:0.82, projPath:"straight"    }, // pvp opponent attack
  };
  // Per-QTE-type defend timing (for PvP projectile variety)
  const PVP_PROJ_PROFILES = {
    swing_beat:      { dur: 700, launch:0.18, arrive:0.80 },
    hold_release:    { dur:1800, launch:0.30, arrive:0.82 },
    rapid_tap:       { dur: 800, launch:0.20, arrive:0.82 },
    sequence:        { dur:1200, launch:0.24, arrive:0.82 },
    stomp:           { dur:1300, launch:0.26, arrive:0.80 },
    poke:            { dur: 650, launch:0.18, arrive:0.80 },
    archery:         { dur:1000, launch:0.22, arrive:0.80 },
    sequence_reveal: { dur:1500, launch:0.28, arrive:0.82 },
    dual_action:     { dur: 500, launch:0.16, arrive:0.80 },
  };
  const startDefendQTE = (bossAtkPattern = null) => {
    const ref = qteRef.current;
    const isPvp = cs?.pvpMode && cs?.enemy?.id === "pvp_opp";
    let prof, projType;
    if (isPvp) {
      const oppWepId = cs?.enemy?.pvpWeapons?.[0] ?? "sword";
      const oppWep = ALL_WEAPONS[oppWepId] ?? ALL_WEAPONS.sword;
      projType = oppWep.qteType || "swing_beat";
      prof = PVP_PROJ_PROFILES[projType] || { dur:1100, launch:0.20, arrive:0.82 };
    } else {
      const profKey = cs?.enemy?.id==="dragon" && bossAtkPattern==="charge"
        ? "dragon_charge" : cs?.enemy?.id;
      prof = DEFEND_PROFILES[profKey] || { dur:1200, launch:0.28, arrive:0.82 };
      projType = null; // use legacy enemy-id sprite
    }
    const { dur, launch, arrive } = prof;
    ref.startMs = performance.now(); ref.pressT = null;
    ref.defendArrive = arrive; // store so showDefendCue can use it
    setCs(prev=>prev?{...prev,phase:"defending"}:prev);
    setQteAnim({ type:"defend", t:0, projFrac:0, arrive, projPath: prof.projPath||"straight", projType, bossAttackPattern: bossAtkPattern });
    triggerEnemyWindUp();

    const onKey = (e) => {
      if (e.code!=="Space"||ref.pressT!==null) return;
      e.preventDefault();
      ref.pressT = (performance.now()-ref.startMs)/dur;
      const d = Math.abs(ref.pressT - arrive);
      if (d<.055)     { showHit("PARRIED!",  "#44aaff"); setParryFlash(true); setTimeout(()=>setParryFlash(false),900); }
      else if (d<.14) showHit("BLOCKED!",  "#4488ff");
    };
    window.addEventListener("keydown",onKey);

    ref.projSoundPlayed = false;
    const tick = () => {
      const t = Math.min(1,(performance.now()-ref.startMs)/dur);
      const projFrac = t < launch ? 0
        : Math.min(1,(t-launch)/(arrive-launch));
      if(t>=launch&&!ref.projSoundPlayed){ref.projSoundPlayed=true;sfx.projLaunch();}
      setQteAnim(prev=>prev?{...prev,t,projFrac,arrive}:null);
      if (t<1) { requestAnimationFrame(tick); return; }
      window.removeEventListener("keydown",onKey);
      const d = ref.pressT!=null ? Math.abs(ref.pressT-arrive) : 99;
      setQteAnim(null);
      handleDefend(d<.055?"perfect":d<.14?"good":"miss");
    };
    requestAnimationFrame(tick);
  };

  /* ── Compute hero & enemy positions from qteAnim ─────────── */
  const heroPos = (() => {
    if (!qteAnim) return null;
    const { type, t } = qteAnim;
    switch (type) {
      case "stomp": {
        const ref = qteRef.current;
        if ((qteAnim.bounce||0) > 0)
          return heroStompBouncePos(t, ref.landLeft||0, ref.landTop||0);
        // Contact 0: approach only — t=0→1 maps to home→enemy (first half of full arc)
        return heroStompPos(t * LAND_FRAC, ref.landLeft||0, ref.landTop||0);
      }
      case "stomp_return": {
        const ref = qteRef.current;
        return heroReturnHomePos(t, ref.landLeft||0, ref.landTop||0);
      }
      case "swing_beat": {
        // Walk to enemy 0-0.14, stay near enemy 0.14-0.86, return 0.86-1
        const WALK_END = 0.14, RETURN_START = 0.86;
        const BEAT_L = STRIKE_L + 30; // slightly further than touch
        if (t <= WALK_END)       return { left: HR_L+(BEAT_L-HR_L)*easeIO(t/WALK_END), top:HR_T };
        if (t >= RETURN_START)   return { left: BEAT_L+(HR_L-BEAT_L)*easeIO((t-RETURN_START)/(1-RETURN_START)), top:HR_T };
        // Wind-up bob during beat phase
        const bFrac = (t-WALK_END)/(RETURN_START-WALK_END);
        const bob = Math.sin(bFrac*Math.PI*6)*5;
        return { left:BEAT_L, top:HR_T+bob };
      }
      case "hold_release": {
        if (!qteAnim.released) {
          // Hero walks to enemy first (0-0.25), then backs up as charge builds
          const WALK_T = 0.25;
          const c = Math.min(qteAnim.charge||0, 1);
          if (c < WALK_T) return { left: HR_L+(STRIKE_L-HR_L)*easeIO(c/WALK_T), top:HR_T };
          // At enemy, then wind-up: back up slightly
          return { left: STRIKE_L - (c-WALK_T)/(1-WALK_T)*28, top:HR_T };
        } else {
          const rt = qteAnim.releaseT||0;
          const startL = STRIKE_L - Math.max(0,Math.min(qteAnim.charge||0,1)-0.25)/0.75*28;
          const left = rt<=0.4
            ? startL + (STRIKE_L-startL)*easeIO(rt/0.4)
            : STRIKE_L + (HR_L-STRIKE_L)*easeIO((rt-0.4)/0.6);
          return { left, top:HR_T };
        }
      }
      case "rapid_tap": {
        const cycles = 5;
        const lunge = (1-Math.cos(t*Math.PI*cycles*2))/2;
        return { left:HR_L+(STRIKE_L-HR_L)*lunge, top:HR_T };
      }
      case "poke": {
        // Hero starts far right (HR_L), charges to close range, then oscillates rapidly
        const CHARGE_T = 0.22;
        const POKE_L = STRIKE_L + 60; // poke range
        if (t <= CHARGE_T) return { left: HR_L+(POKE_L-HR_L)*easeIO(t/CHARGE_T), top:HR_T };
        const pokeFrac = (t-CHARGE_T)/(1-CHARGE_T);
        // Rapid back-and-forth stabs
        const stab = Math.abs(Math.sin(pokeFrac*Math.PI*12));
        return { left: POKE_L - stab*55, top:HR_T };
      }
      case "archery":
        // Hero stays in place, winds up bow (slight pull-back)
        return { left: HR_L + 8, top: HR_T };
      case "sequence":
        return { left:HR_L, top:HR_T - Math.sin(t*Math.PI*6)*4 };
      case "sequence_reveal":
        return { left:HR_L, top:HR_T - Math.sin(t*Math.PI*4)*5 };
      case "rpg_rocket":
        return { left:HR_L - 6, top:HR_T - Math.sin(t*Math.PI)*10 };
      case "magic_bolt":
        // Hero holds staff raised — slight forward lean
        return { left:HR_L - 6, top:HR_T - Math.sin(t*Math.PI)*8 };
      case "defend":
        return { left:HR_L, top:HR_T };
      default:
        return null;
    }
  })();

  // Enemy shakes (wind-up) before launching projectile — uses dynamic launch fraction
  const enemyWindUp = (() => {
    if (!qteAnim||qteAnim.type!=="defend") return 0;
    const t = qteAnim.t;
    const prof = DEFEND_PROFILES[cs?.enemy?.id] || { launch:0.28 };
    if (t >= prof.launch) return 0;
    return Math.sin(t * Math.PI * 14) * 5;
  })();

  const showDust      = qteAnim?.type==="stomp"&&qteAnim.t>=0.90&&qteAnim.t<=1.0; // dust at actual visual landing
  const _defArrive    = qteAnim?.arrive ?? 0.82;
  const showDefendCue = qteAnim?.type==="defend"&&qteAnim.t>=(_defArrive-.07)&&qteAnim.t<=(_defArrive+.04);

  const QTE_LABEL = { swing_beat:"BEAT", rapid_tap:"FLURRY", hold_release:"CHARGE", sequence:"CAST", stomp:"STOMP", poke:"POKE", archery:"AIM", sequence_reveal:"LAUNCH", dual_action:"DUAL" };

  // ── PvP per-QTE projectile path function ──
  // Returns {x,y} in battlefield coords for projType at fraction t (0→1)
  const pvpProjPos = (projType, t, srcX, srcY, dstX, dstY) => {
    const lerp = (a,b,f) => a+(b-a)*f;
    const x = lerp(srcX, dstX, t);
    let y;
    switch(projType) {
      case "swing_beat":
        y = lerp(srcY, dstY, t);
        break;
      case "hold_release":
        y = GNDY - 10 + Math.sin(t*Math.PI)*(-5);
        break;
      case "rapid_tap":
        y = lerp(srcY, dstY, t) + Math.sin(t * Math.PI * 8) * 22;
        break;
      case "sequence":
        y = lerp(srcY, dstY, t) + Math.sin(t * Math.PI * 2) * 35;
        break;
      case "stomp":
        y = GNDY - 8 + Math.abs(Math.sin(t*Math.PI)) * (-20);
        break;
      case "poke":
        y = lerp(srcY, dstY, t);
        break;
      case "archery":
        y = lerp(srcY, dstY, t) - Math.sin(t * Math.PI) * 30;
        break;
      case "sequence_reveal":
        y = lerp(srcY, dstY, t) + Math.sin(t * Math.PI * 1.5) * 15;
        break;
      case "dual_action":
        y = lerp(srcY, dstY, t);
        break;
      default:
        y = lerp(srcY, dstY, t);
    }
    return { x, y };
  };

  // ── PvP per-QTE projectile SVG sprite ──
  const PvpProjectileSVG = ({ projType, cx, cy }) => {
    switch(projType) {
      case "swing_beat": return (
        <g transform={`translate(${cx},${cy})`}>
          <path d="M-14,0 Q-4,-14 10,-6 Q0,0 10,6 Q-4,14 -14,0 Z" fill="#ff8800" opacity=".92"
            style={{filter:"drop-shadow(0 0 6px #ff6600)"}}/>
          <path d="M-10,0 Q0,-8 8,-3" stroke="#ffcc44" strokeWidth="2" fill="none" strokeLinecap="round" opacity=".8"/>
          <path d="M-10,0 Q0,8 8,3" stroke="#ff4400" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity=".6"/>
        </g>
      );
      case "hold_release": return (
        <g transform={`translate(${cx},${cy})`}>
          <circle r="11" fill="#8B5E3C" stroke="#5a3a18" strokeWidth="2"/>
          <circle r="8" fill="#a07040"/>
          <line x1="-5" y1="-5" x2="2" y2="3" stroke="#5a3010" strokeWidth="1.8"/>
          <line x1="3" y1="-4" x2="-2" y2="4" stroke="#5a3010" strokeWidth="1.8"/>
          <line x1="-6" y1="2" x2="5" y2="0" stroke="#5a3010" strokeWidth="1.2"/>
          <ellipse cx="0" cy="11" rx="9" ry="2.5" fill="#00000022"/>
        </g>
      );
      case "rapid_tap": return (
        <g transform={`translate(${cx},${cy})`}>
          <polygon points="0,-10 8,8 -8,8" fill="#ccccdd" stroke="#aaaacc" strokeWidth="1.5"
            style={{filter:"drop-shadow(0 0 5px #8888ff)"}}/>
          <line x1="0" y1="-6" x2="0" y2="4" stroke="#ffffff" strokeWidth="1" opacity=".6"/>
        </g>
      );
      case "sequence": return (
        <g transform={`translate(${cx},${cy})`}>
          <circle r="10" fill="#7700cc" style={{filter:"drop-shadow(0 0 10px #cc44ff)"}}/>
          <circle r="7" fill="#9922ee"/>
          <circle r="4" fill="#cc66ff"/>
          <circle r="2" fill="#ffffff" opacity=".9"/>
          <circle r="1" cx="-1" cy="-1" fill="#ffffff" opacity=".7"/>
        </g>
      );
      case "stomp": return (
        <g transform={`translate(${cx},${cy})`}>
          <path d="M-14,2 Q-8,-4 0,-2 Q8,-4 14,2" stroke="#ffcc00" strokeWidth="3" fill="none" strokeLinecap="round"
            style={{filter:"drop-shadow(0 0 6px #ffaa00)"}}/>
          <path d="M-10,5 Q-4,0 4,0 Q10,0 12,5" stroke="#ff8800" strokeWidth="2" fill="none" strokeLinecap="round" opacity=".7"/>
          <line x1="-6" y1="-6" x2="-4" y2="-1" stroke="#ffdd44" strokeWidth="1.5" opacity=".8"/>
          <line x1="0" y1="-8" x2="0" y2="-3" stroke="#ffdd44" strokeWidth="1.5" opacity=".8"/>
          <line x1="6" y1="-6" x2="4" y2="-1" stroke="#ffdd44" strokeWidth="1.5" opacity=".8"/>
        </g>
      );
      case "poke": return (
        <g transform={`translate(${cx},${cy})`}>
          <ellipse rx="14" ry="5" fill="#00ccee" stroke="#0099bb" strokeWidth="1.5"
            style={{filter:"drop-shadow(0 0 5px #00aadd)"}}/>
          <ellipse rx="10" ry="3.5" fill="#44ddff" opacity=".7"/>
          <ellipse rx="5" ry="2" fill="#aaf0ff" opacity=".8"/>
          <polygon points="14,-4 22,0 14,4" fill="#00aacc"/>
        </g>
      );
      case "archery": return (
        <g transform={`translate(${cx},${cy})`}>
          <line x1="-14" y1="0" x2="12" y2="0" stroke="#33aa44" strokeWidth="2.5" strokeLinecap="round"
            style={{filter:"drop-shadow(0 0 4px #44cc55)"}}/>
          <polygon points="12,-4 20,0 12,4" fill="#44cc55"/>
          <line x1="-14" y1="0" x2="-10" y2="-3" stroke="#33aa44" strokeWidth="1.5" opacity=".8"/>
          <line x1="-14" y1="0" x2="-10" y2="3" stroke="#33aa44" strokeWidth="1.5" opacity=".8"/>
        </g>
      );
      case "sequence_reveal": return (
        <g transform={`translate(${cx},${cy})`}>
          <rect x="-10" y="-5" width="20" height="14" rx="3" fill="#cc4411"/>
          <rect x="-10" y="-5" width="20" height="7" rx="3" fill="#ee6622" opacity=".7"/>
          <polygon points="10,-5 18,0 10,8" fill="#ff6600"/>
          <polygon points="-10,-5 -18,2 -10,8" fill="#ff4400" opacity=".8"/>
          <ellipse cx="-4" cy="2" rx="3" ry="3" fill="#334455"/>
          <ellipse cx="4" cy="2" rx="2" ry="2" fill="#ff2200" opacity=".9"/>
        </g>
      );
      case "dual_action": return (
        <g transform={`translate(${cx},${cy})`}>
          <circle r="6" fill="#888899" stroke="#aaaacc" strokeWidth="1.5"
            style={{filter:"drop-shadow(0 0 4px #aaaaee)"}}/>
          <circle r="4" fill="#aaaacc"/>
          <circle r="2" fill="#ffffff" opacity=".7"/>
        </g>
      );
      default: return (
        <circle cx={cx} cy={cy} r="7" fill="#ff4444" style={{filter:"drop-shadow(0 0 6px #ff2222)"}}/>
      );
    }
  };

  /* ─────────────────────────────────────────────────────────── */
  return (
    <div style={{minHeight:"100vh",background:"#020205",color:"#e8d5a3"}}>
      <style>{GS}</style>

      {/* ── OPPONENT DISCONNECTED OVERLAY ── */}
      {mpDisconnected&&(
        <div style={{position:"fixed",inset:0,zIndex:9000,display:"flex",
          alignItems:"center",justifyContent:"center",
          background:"rgba(2,2,8,.88)",backdropFilter:"blur(6px)"}}>
          <div style={{textAlign:"center",padding:"40px 52px",
            background:"linear-gradient(160deg,#0d0d1a,#1a0a0a)",
            border:"1px solid #cc222244",borderRadius:16,
            boxShadow:"0 0 60px #cc000033"}}>
            <div style={{fontSize:48,marginBottom:16}}>📡</div>
            <div style={{fontFamily:"Cinzel",fontSize:22,fontWeight:700,letterSpacing:4,
              color:"#ff4444",textShadow:"0 0 20px #ff2222",marginBottom:8}}>
              CONNECTION LOST
            </div>
            <div style={{fontFamily:"Cinzel",fontSize:11,letterSpacing:2,color:"#aa6655",marginBottom:24}}>
              Opponent disconnected
            </div>
            <div style={{fontFamily:"Cinzel",fontSize:10,letterSpacing:3,color:"#555566",
              animation:"pulse .8s ease-in-out infinite"}}>
              RETURNING TO TITLE…
            </div>
          </div>
        </div>
      )}

      {/* ── PVP HP OVERLAY — fixed top-center during PvP combat ── */}
      {cs?.pvpMode&&screen==="combat"&&(
        <div style={{position:"fixed",top:0,left:0,right:0,zIndex:4000,pointerEvents:"none",
          background:"linear-gradient(to bottom,rgba(4,4,18,.95),rgba(4,4,18,.7))",
          borderBottom:"1px solid #4466ff33",padding:"10px 24px",
          display:"flex",alignItems:"center",gap:16}}>
          {/* My HP */}
          <div style={{flex:1}}>
            <div style={{fontFamily:"Cinzel",fontSize:8,letterSpacing:2,color:"#44dd66",marginBottom:3}}>YOU · {(player?.weapons?.includes("rpg")?ALL_WEAPONS.rpg:ALL_WEAPONS[player?.weapons?.[0]])?.name||"?"}</div>
            <div style={{height:8,background:"#0a1a0a",borderRadius:4,border:"1px solid #22441a"}}>
              <div style={{height:"100%",borderRadius:4,transition:"width .3s",
                background:pvpMyHp<pvpMaxHp*.3?"#ff4444":pvpMyHp<pvpMaxHp*.6?"#ffcc44":"#44dd66",
                width:`${Math.max(0,pvpMyHp/pvpMaxHp*100)}%`,boxShadow:"0 0 8px currentColor"}}/>
            </div>
            <div style={{fontFamily:"Cinzel",fontSize:9,color:"#44dd66",marginTop:1}}>{pvpMyHp}/{pvpMaxHp} HP</div>
          </div>
          {/* VS */}
          <div style={{fontFamily:"Cinzel",fontWeight:900,fontSize:18,color:"#ff4400",textShadow:"0 0 16px #ff4400",padding:"0 8px"}}>VS</div>
          {/* Opponent HP */}
          <div style={{flex:1,textAlign:"right"}}>
            <div style={{fontFamily:"Cinzel",fontSize:8,letterSpacing:2,color:"#ff8844",marginBottom:3}}>{(cs?.enemy?.pvpWeapons?.[0]?ALL_WEAPONS[cs.enemy.pvpWeapons[0]]?.name:"?")??""} · {cs?.enemy?.name||"RIVAL"}</div>
            <div style={{height:8,background:"#1a0a0a",borderRadius:4,border:"1px solid #441a1a"}}>
              <div style={{height:"100%",borderRadius:4,transition:"width .3s",marginLeft:"auto",
                background:pvpOppHp<pvpMaxHp*.3?"#ff2222":"#ff6644",
                width:`${Math.max(0,pvpOppHp/pvpMaxHp*100)}%`,boxShadow:"0 0 8px #ff4422"}}/>
            </div>
            <div style={{fontFamily:"Cinzel",fontSize:9,color:"#ff8844",marginTop:1}}>{pvpOppHp}/{pvpMaxHp} HP</div>
          </div>
        </div>
      )}

      {/* ── PVP TURN BADGE — fixed bottom-left ── */}
      {cs?.pvpMode&&screen==="combat"&&!pvpWinner&&(
        <div style={{position:"fixed",bottom:24,left:24,zIndex:4000,pointerEvents:"none",
          fontFamily:"Cinzel",fontSize:11,letterSpacing:3,
          color:pvpTurn==="mine"?"#00ff88":"#ff8844",
          textShadow:pvpTurn==="mine"?"0 0 16px #00ff88":"0 0 10px #ff8844",
          background:"rgba(4,4,18,.8)",borderRadius:6,padding:"6px 14px",
          border:`1px solid ${pvpTurn==="mine"?"#00ff8844":"#ff884444"}`,
          animation:pvpTurn==="theirs"?"pulse .7s ease-in-out infinite":"none"}}>
          {pvpTurn==="mine"?"⚔ YOUR TURN — ATTACK!":pvpTurn==="theirs"?`${cs?.enemy?.name||"RIVAL"} IS ATTACKING…`:""}
        </div>
      )}

      {/* ── PVP WINNER OVERLAY ── */}
      {pvpWinner&&screen==="combat"&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.88)",zIndex:5000,
          display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",animation:"fadeIn .5s"}}>
          {pvpWinner==="me"
            ? <>
                <div style={{fontSize:72,marginBottom:16,animation:"float 1.5s infinite"}}>🏆</div>
                <h1 style={{fontFamily:"Cinzel",fontWeight:900,fontSize:"clamp(32px,6vw,60px)",color:"#ffcc44",letterSpacing:8,textShadow:"0 0 40px #ffcc44",animation:"glow 1.5s infinite",marginBottom:8}}>YOU WIN!</h1>
                <p style={{fontFamily:"IM Fell English",fontStyle:"italic",fontSize:16,opacity:.5,marginBottom:40,letterSpacing:3}}>You destroyed {cs?.enemy?.name||"your rival"}. Champion of R.P.G.</p>
              </>
            : <>
                <div style={{fontSize:72,marginBottom:16,opacity:.5}}>💀</div>
                <h1 style={{fontFamily:"Cinzel",fontWeight:900,fontSize:"clamp(32px,6vw,60px)",color:"#cc2222",letterSpacing:8,textShadow:"0 0 40px #cc2222",marginBottom:8}}>ELIMINATED</h1>
                <p style={{fontFamily:"IM Fell English",fontStyle:"italic",fontSize:16,opacity:.5,marginBottom:40,letterSpacing:3}}>{cs?.enemy?.name||"Rival"} wins. Get wrecked.</p>
              </>
          }
          {(finalTime||timerDisplay)&&<div style={{fontFamily:"Cinzel",fontSize:22,color:"#ffcc44",letterSpacing:4,marginBottom:32,opacity:.7}}>⏱ {finalTime||timerDisplay}</div>}
          <button className="btn" style={{fontSize:16,padding:"14px 44px",letterSpacing:5}} onClick={()=>window.location.reload()}>PLAY AGAIN</button>
        </div>
      )}

      {/* ── RACE rival — center-top fixed strip ── */}
      {gameMode==="race"&&oppSnap&&screen!=="pvp"&&screen!=="pvp_wait"&&screen!=="title"&&(
        <div style={{position:"fixed",top:12,left:"50%",transform:"translateX(-50%)",zIndex:9990,
          background:"rgba(4,4,18,.92)",backdropFilter:"blur(8px)",
          border:"1px solid #4466ff66",borderRadius:12,padding:"10px 26px",
          display:"flex",alignItems:"center",gap:22,pointerEvents:"none",whiteSpace:"nowrap"}}>
          {/* Label */}
          <div style={{fontFamily:"Cinzel",fontSize:11,letterSpacing:3,color:"#4466ffcc"}}>
            ⚔ RIVAL
          </div>
          {/* Name */}
          <div style={{fontFamily:"Cinzel",fontSize:15,fontWeight:700,color:"#88aaff",letterSpacing:1}}>
            {(oppSnap.name||"?").toUpperCase()}
          </div>
          {/* Divider */}
          <div style={{width:1,height:32,background:"#4466ff33"}}/>
          {/* Floor bar */}
          <div style={{display:"flex",flexDirection:"column",gap:4,alignItems:"center"}}>
            <div style={{fontFamily:"Cinzel",fontSize:10,color:"#6677aa",letterSpacing:1}}>FLOOR {oppSnap.floor}/{FLOOR_CONFIGS.length}</div>
            <div style={{width:110,height:6,background:"#111122",borderRadius:3,overflow:"hidden"}}>
              <div style={{height:"100%",background:"#4466ff",borderRadius:3,
                width:`${Math.min(100,(oppSnap.floor/FLOOR_CONFIGS.length)*100)}%`,
                boxShadow:"0 0 6px #4466ff",transition:"width .5s"}}/>
            </div>
          </div>
          {/* HP bar */}
          <div style={{display:"flex",flexDirection:"column",gap:4,alignItems:"center"}}>
            <div style={{fontFamily:"Cinzel",fontSize:10,color:"#6677aa",letterSpacing:1}}>HP {oppSnap.hp}/{oppSnap.maxHp}</div>
            <div style={{width:100,height:6,background:"#111122",borderRadius:3,overflow:"hidden"}}>
              <div style={{height:"100%",borderRadius:3,
                background:oppSnap.hp<oppSnap.maxHp*.3?"#ff4444":oppSnap.hp<oppSnap.maxHp*.6?"#ffcc44":"#44dd66",
                width:`${Math.min(100,(oppSnap.hp/Math.max(1,oppSnap.maxHp))*100)}%`,
                transition:"width .5s"}}/>
            </div>
          </div>
          {oppSnap.dragonKilled&&(
            <>
              <div style={{width:1,height:32,background:"#ff442233"}}/>
              <div style={{fontFamily:"Cinzel",fontSize:12,letterSpacing:2,color:"#ff4422",
                textShadow:"0 0 8px #ff4422",animation:"pulse .5s ease-in-out infinite"}}>
                🟢 SLIME SLAIN!
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Fixed timer (always top-right, foreground) ── */}
      {runStartTime&&screen!=="victory"&&screen!=="gameover"&&(
        <div style={{position:"fixed",bottom:20,right:20,zIndex:9999,pointerEvents:"none",
          fontFamily:"Cinzel",fontSize:22,fontWeight:900,letterSpacing:4,
          color:"#ffcc44",textShadow:"0 0 16px #ff8800, 0 0 40px #ff440088",
          fontVariantNumeric:"tabular-nums",
          background:"rgba(0,0,0,.78)",borderRadius:8,padding:"8px 18px",
          border:"1px solid rgba(255,180,60,.4)"}}>
          ⏱ {timerDisplay}
        </div>
      )}

      {/* potions moved into action book widget below */}

      {/* ── ACTION BOOK — bottom-center during action phase ── */}
      {screen==="combat"&&cs&&player&&cs.phase==="action"&&!qteAnim&&(!cs.pvpMode||pvpTurn==="mine")&&!pvpWinner&&(()=>{
        const pvp = cs.pvpMode;
        const potions = (!pvp&&player.potions)||[];
        const accentCol = pvp?"#ff8833":"#c8a050";
        const spineTxt = pvp?"COMBAT":"ACTIONS";

        return (
          <div style={{position:"fixed",bottom:18,left:"50%",transform:"translateX(-50%)",zIndex:3100,userSelect:"none"}}>
            {!bookOpen?(
              /* ── CLOSED BOOK ── */
              <div onClick={()=>{sfx.bookOpen();setBookOpen(true);}}
                style={{cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",
                  animation:"bookBounce 2.2s ease-in-out infinite"}}>
                {/* Spine + cover */}
                <div style={{
                  width:220,height:240,
                  background:`linear-gradient(135deg,#1e1208 0%,#2e1e0c 40%,#3a2510 60%,#2a1a08 100%)`,
                  border:`2px solid ${accentCol}88`,borderRadius:"8px 8px 4px 4px",
                  boxShadow:`0 6px 32px rgba(0,0,0,.75), 0 0 22px ${accentCol}22, inset 0 1px 0 ${accentCol}33`,
                  display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6,
                  position:"relative",overflow:"hidden"}}>
                  {/* Gold corner ornaments */}
                  <div style={{position:"absolute",top:6,left:8,width:14,height:14,border:`1px solid ${accentCol}88`,borderRight:"none",borderBottom:"none"}}/>
                  <div style={{position:"absolute",top:6,right:8,width:14,height:14,border:`1px solid ${accentCol}88`,borderLeft:"none",borderBottom:"none"}}/>
                  <div style={{position:"absolute",bottom:6,left:8,width:14,height:14,border:`1px solid ${accentCol}88`,borderRight:"none",borderTop:"none"}}/>
                  <div style={{position:"absolute",bottom:6,right:8,width:14,height:14,border:`1px solid ${accentCol}88`,borderLeft:"none",borderTop:"none"}}/>
                  {/* Center emblem line */}
                  <div style={{position:"absolute",top:"50%",left:28,right:28,height:1,
                    background:`linear-gradient(to right,transparent,${accentCol}44,transparent)`,
                    transform:"translateY(-50%)"}}/>
                  {/* Title */}
                  <div style={{fontFamily:"Cinzel",fontWeight:900,fontSize:17,letterSpacing:5,
                    color:accentCol,textShadow:`0 0 14px ${accentCol}88`}}>{spineTxt}</div>
                  <div style={{fontFamily:"Cinzel",fontSize:8,opacity:.4,letterSpacing:3,color:"#c8b880"}}>
                    CLICK TO OPEN
                  </div>
                  {/* Spine shadow bar on left */}
                  <div style={{position:"absolute",left:0,top:0,bottom:0,width:14,
                    background:"linear-gradient(to right,rgba(0,0,0,.55),transparent)"}}/>
                </div>
                {/* Book bottom pages illusion — stacked page edges */}
                <div style={{width:218,height:10,background:"linear-gradient(to bottom,#d4c8a8,#b0a888)",
                  borderRadius:"0 0 5px 5px",marginTop:-1,boxShadow:"0 4px 12px rgba(0,0,0,.55)"}}/>
              </div>
            ):(
              /* ── OPEN BOOK ── */
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",animation:"bookPageIn .28s ease-out"}}>

                {/* Dismiss label */}
                <div style={{fontFamily:"Cinzel",fontSize:7,opacity:.3,letterSpacing:3,
                  color:"#c8b880",marginBottom:6,cursor:"pointer"}}
                  onClick={()=>setBookOpen(false)}>▼ CLOSE</div>

                {/* Two-page spread */}
                <div style={{display:"flex",gap:0,
                  boxShadow:"0 8px 40px rgba(0,0,0,.85), 0 0 20px rgba(200,160,80,.12)",
                  borderRadius:8}}>

                  {/* ── LEFT PAGE — Potions ── */}
                  <div style={{
                    width:200,minHeight:280,
                    background:"linear-gradient(160deg,#f5edd8 0%,#e8dcc0 60%,#ddd0aa 100%)",
                    borderRadius:"8px 0 0 8px",
                    border:`2px solid ${accentCol}66`,borderRight:"none",
                    padding:"16px 14px 14px",
                    boxShadow:"inset -6px 0 18px rgba(0,0,0,.25), inset 2px 0 8px rgba(200,160,80,.1)",
                    position:"relative",overflow:"visible"}}>
                    {/* Page lines */}
                    {[0,1,2,3,4,5,6,7,8].map(i=><div key={i} style={{position:"absolute",left:20,right:14,
                      top:46+i*26,height:1,background:"rgba(0,0,0,.08)"}}/>)}
                    {/* Title */}
                    <div style={{fontFamily:"Cinzel",fontWeight:700,fontSize:10,letterSpacing:3,
                      color:"#5a3a10",textAlign:"center",marginBottom:12,
                      borderBottom:"1px solid rgba(90,58,16,.25)",paddingBottom:8}}>
                      POTION LIST
                    </div>
                    {potions.length===0?(
                      <div style={{fontFamily:"Cinzel",fontSize:9,opacity:.35,
                        color:"#5a4a28",textAlign:"center",marginTop:20,letterSpacing:2}}>
                        NO POTIONS
                      </div>
                    ):potions.map((pt,idx)=>(
                      <div key={idx} style={{position:"relative"}}>
                        <button
                          onClick={()=>{usePotion(idx);setBookOpen(false);}}
                          onMouseEnter={()=>setBookHoverPotion(idx)}
                          onMouseLeave={()=>setBookHoverPotion(null)}
                          style={{display:"flex",alignItems:"center",gap:9,width:"100%",
                            padding:"7px 8px",marginBottom:6,
                            background:bookHoverPotion===idx?"rgba(90,58,16,.14)":"transparent",
                            border:"none",borderRadius:5,cursor:"pointer",textAlign:"left",
                            transition:"background .12s"}}>
                          <Icon type={pt.id} size={26}/>
                          <div style={{flex:1}}>
                            <div style={{fontFamily:"Cinzel",fontSize:10,fontWeight:700,
                              color:"#3a2008",letterSpacing:1}}>{pt.name}</div>
                          </div>
                        </button>
                        {/* Hover tooltip */}
                        {bookHoverPotion===idx&&(
                          <div style={{position:"absolute",left:0,bottom:"110%",zIndex:500,
                            background:"#1a1208",border:"1px solid #c8a05066",borderRadius:6,
                            padding:"8px 12px",minWidth:170,pointerEvents:"none",
                            boxShadow:"0 4px 16px rgba(0,0,0,.7)"}}>
                            <div style={{fontFamily:"Cinzel",fontSize:9,color:"#e8d5a3",letterSpacing:.5,lineHeight:1.6}}>
                              {pt.desc}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* ── SPINE (binding) ── */}
                  <div style={{width:14,
                    background:"linear-gradient(to right,#1a0e04,#3a2008,#1a0e04)",
                    boxShadow:"inset 0 0 8px rgba(0,0,0,.8)",
                    display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <div style={{width:2,height:"60%",
                      background:`linear-gradient(to bottom,transparent,${accentCol}66,transparent)`}}/>
                  </div>

                  {/* ── RIGHT PAGE — Weapons ── */}
                  <div style={{
                    width:220,minHeight:280,
                    background:"linear-gradient(160deg,#f0e8d0 0%,#e4d8b8 60%,#d8caa8 100%)",
                    borderRadius:"0 8px 8px 0",
                    border:`2px solid ${accentCol}66`,borderLeft:"none",
                    padding:"16px 14px 14px",
                    boxShadow:"inset 6px 0 18px rgba(0,0,0,.18)",
                    position:"relative",overflow:"visible"}}>
                    {/* Page lines */}
                    {[0,1,2,3,4,5,6,7,8].map(i=><div key={i} style={{position:"absolute",left:14,right:20,
                      top:46+i*26,height:1,background:"rgba(0,0,0,.08)"}}/>)}
                    {/* Title */}
                    <div style={{fontFamily:"Cinzel",fontWeight:700,fontSize:10,letterSpacing:3,
                      color:pvp?"#6a1a00":"#3a200a",textAlign:"center",marginBottom:12,
                      borderBottom:"1px solid rgba(90,58,16,.25)",paddingBottom:8}}>
                      {pvp?"ATTACK":"WEAPONS"}
                    </div>
                    {/* Weapon list */}
                    {player.weapons.map(wid=>{
                      const w=ALL_WEAPONS[wid]; if(!w) return null;
                      return (
                        <button key={wid}
                          onClick={()=>{
                            setBookOpen(false);
                            if(pvp){pvpAtkCbRef.current=pvpOnAttackDone;pvpModeRef.current=true;}
                            startAttack(w);
                          }}
                          onMouseEnter={e=>{e.currentTarget.style.background="rgba(90,58,16,.16)";}}
                          onMouseLeave={e=>{e.currentTarget.style.background="transparent";}}
                          style={{display:"flex",alignItems:"center",gap:10,width:"100%",
                            padding:"7px 8px",marginBottom:6,
                            background:"transparent",border:"none",borderRadius:5,
                            cursor:"pointer",textAlign:"left",transition:"background .12s"}}>
                          <Icon type={w.id} size={26} color={pvp?"#8a2200":"#5a3010"}/>
                          <div style={{flex:1}}>
                            <div style={{fontFamily:"Cinzel",fontSize:10,fontWeight:700,
                              color:pvp?"#5a1a00":"#2a1408",letterSpacing:1}}>{w.name}</div>
                            <div style={{fontFamily:"Cinzel",fontSize:8,opacity:.45,
                              color:"#5a4028",letterSpacing:.5}}>{w.baseDmg+(player.str||0)} ATK</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Page bottom illusion */}
                <div style={{width:434,height:7,
                  background:"linear-gradient(to bottom,#d4c8a8,#b0a888)",
                  borderRadius:"0 0 6px 6px",marginTop:-2,
                  boxShadow:"0 4px 14px rgba(0,0,0,.55)"}}/>
              </div>
            )}
          </div>
        );
      })()}

      {/* ── Impact flash overlay ── */}
      {impactFlash>0&&(
        <div style={{position:"fixed",inset:0,zIndex:9000,pointerEvents:"none",
          background:impactFlash===2?"rgba(255,255,255,0.22)":"rgba(255,255,255,0.12)",
          animation:"hitFlash .12s ease-out forwards"}}/>
      )}

      {hitResult&&(
        <div style={{position:"fixed",top:"22%",left:"50%",transform:"translateX(-50%)",zIndex:5000,
          fontFamily:"Cinzel",fontSize:hitResult.big?52:30,fontWeight:900,color:hitResult.color,
          textShadow:`0 0 ${hitResult.big?60:30}px ${hitResult.color}, 0 0 ${hitResult.big?120:0}px ${hitResult.color}`,
          letterSpacing:hitResult.big?6:1,
          animation:hitResult.big?"slideUp .2s ease-out":"slideUp .3s ease-out",
          pointerEvents:"none",whiteSpace:"nowrap"}}>{hitResult.text}</div>
      )}

      {levelUpPending&&player&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.97)",zIndex:2000,
          display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",animation:"fadeIn .3s"}}>
          <div style={{fontSize:70,marginBottom:10,animation:"float 2s infinite"}}>✨</div>
          <h1 style={{fontFamily:"Cinzel",fontSize:54,color:"#44ff88",letterSpacing:5,animation:"glow 2s infinite"}}>LEVEL UP!</h1>
          <p style={{opacity:.45,marginBottom:40,letterSpacing:3,fontFamily:"Cinzel",fontSize:13}}>LEVEL {player.level} → {player.level+1}</p>
          <div style={{display:"flex",gap:24}}>
            <button className="btn" style={{padding:"16px 36px",fontSize:15}}
              onClick={()=>{setPlayer(p=>p?({...p,level:p.level+1,xp:0,maxHp:p.maxHp+15,hp:Math.min(p.hp+15,p.maxHp+15)}):p);setLevelUpPending(false);}}>❤️ +15 MAX HP</button>
            <button className="btn" style={{padding:"16px 36px",fontSize:15}}
              onClick={()=>{setPlayer(p=>p?({...p,level:p.level+1,xp:0,str:p.str+3}):p);setLevelUpPending(false);}}>⚔️ +3 STRENGTH</button>
          </div>
        </div>
      )}

      {/* ══ TITLE ══ */}
      {screen==="title"&&(
        <div style={{height:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
          {/* Title background image — anchored toward top so knights' heads stay in frame */}
          <img src={`${ASSET_BASE}/icons/title/title.png`} alt=""
            style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"50% 10%",zIndex:0,pointerEvents:"none"}}/>
          {/* Dark vignette overlay */}
          <div style={{position:"absolute",inset:0,zIndex:0,
            background:"radial-gradient(ellipse at 50% 45%, rgba(2,2,8,.10) 0%, rgba(2,2,8,.68) 100%)"}}/>
          {/* Bottom fade */}
          <div style={{position:"absolute",bottom:0,left:0,right:0,height:"40%",zIndex:0,
            background:"linear-gradient(to top,rgba(2,2,8,.95) 0%,transparent 100%)"}}/>
          <div style={{position:"relative",textAlign:"center",zIndex:1,animation:"fadeIn .8s ease-out"}}>

            {/* Text backdrop panel */}
            <div style={{
              display:"inline-block",
              background:"rgba(2,2,10,0.72)",
              border:"1px solid rgba(255,100,20,0.18)",
              borderRadius:14,
              padding:"28px 52px 36px",
              backdropFilter:"blur(10px)",
              WebkitBackdropFilter:"blur(10px)",
              boxShadow:"0 8px 48px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,120,30,0.08)",
            }}>

            <h1 style={{fontFamily:"Cinzel",fontWeight:900,fontSize:"clamp(48px,9vw,88px)",letterSpacing:14,lineHeight:1.1,background:"linear-gradient(to bottom,#fff 0%,#ff9933 40%,#ff4400 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"glow 4s infinite"}}>R.P.G.</h1>

            {/* Tagline steps */}
            <div style={{margin:"20px 0 8px",display:"flex",alignItems:"center",justifyContent:"center",gap:12,flexWrap:"wrap"}}>
              {["SLAY THE SLIME","USE RPG","SHOOT DUMBASS ON THE OTHER END"].map((t,i,arr)=>(
                <React.Fragment key={i}>
                  <span style={{fontFamily:"Cinzel",fontSize:12,letterSpacing:3,color:i===2?"#ff4422":i===1?"#ffcc44":"#aabbcc",textShadow:i===2?"0 0 12px #ff4422":i===1?"0 0 10px #ffcc44":"none",fontWeight:700}}>
                    {t}
                  </span>
                  {i<arr.length-1&&<span style={{color:"#444466",fontSize:16}}>›</span>}
                </React.Fragment>
              ))}
            </div>

            <p style={{fontFamily:"IM Fell English",fontStyle:"italic",fontSize:13,opacity:.35,marginBottom:44,letterSpacing:3}}>a dungeon. a demon. a rocket launcher.</p>

            {/* Solo button */}
            {!mpMode&&(
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:14}}>
                <button className="btn" style={{fontSize:17,padding:"18px 60px",letterSpacing:6,borderColor:"#ff6600",color:"#ff9933",boxShadow:"0 0 24px #ff440033"}} onClick={()=>setScreen("weapon_select")}>
                  SOLO
                </button>
                <div style={{display:"flex",gap:12}}>
                  <button className="btn" style={{fontSize:13,padding:"10px 24px",letterSpacing:3,borderColor:"#4466ff",color:"#88aaff"}}
                    onClick={hostGame}>
                    🖥 HOST GAME
                  </button>
                  <button className="btn" style={{fontSize:13,padding:"10px 24px",letterSpacing:3,borderColor:"#44aaff",color:"#88ccff"}}
                    onClick={()=>setMpMode("join_input")}>
                    🎮 JOIN GAME
                  </button>
                </div>
              </div>
            )}

            {/* Host: show room code */}
            {mpMode==="hosting"&&(
              <div style={{textAlign:"center"}}>
                <div style={{fontFamily:"Cinzel",fontSize:11,color:"#4466ff",letterSpacing:3,marginBottom:12}}>
                  YOUR ROOM CODE — SHARE WITH RIVAL:
                </div>
                <div style={{fontFamily:"Cinzel",fontWeight:900,fontSize:52,letterSpacing:12,
                  color:"#fff",textShadow:"0 0 30px #4466ff, 0 0 60px #4466ff",
                  background:"rgba(10,10,30,.8)",borderRadius:10,padding:"12px 28px",
                  border:"2px solid #4466ff",marginBottom:16}}>
                  {mpRoomCode}
                </div>
                <div style={{fontFamily:"Cinzel",fontSize:10,color:"#4466ff",letterSpacing:2,
                  animation:"pulse .8s ease-in-out infinite"}}>
                  WAITING FOR OPPONENT TO JOIN…
                </div>
                <button className="btn" style={{marginTop:16,fontSize:10,padding:"6px 18px",opacity:.4}}
                  onClick={()=>{mpRef.current.peer?.destroy();setMpMode(null);setMpStatus("idle");}}>
                  CANCEL
                </button>
              </div>
            )}

            {/* Join: enter code */}
            {mpMode==="join_input"&&(
              <div style={{textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
                <div style={{fontFamily:"Cinzel",fontSize:11,color:"#44aaff",letterSpacing:3}}>
                  ENTER RIVAL'S ROOM CODE:
                </div>
                <input
                  value={mpJoinInput}
                  onChange={e=>setMpJoinInput(e.target.value.toUpperCase().slice(0,5))}
                  onKeyDown={e=>e.key==="Enter"&&joinGame()}
                  placeholder="XXXXX"
                  maxLength={5}
                  style={{fontFamily:"Cinzel",fontWeight:900,fontSize:36,letterSpacing:10,
                    textAlign:"center",width:220,background:"#0a0a1e",
                    border:"2px solid #44aaff",borderRadius:8,padding:"10px 16px",
                    color:"#fff",outline:"none"}}
                  autoFocus
                />
                <div style={{display:"flex",gap:10}}>
                  <button className="btn" style={{fontSize:13,padding:"10px 24px",letterSpacing:3,borderColor:"#44aaff",color:"#88ccff"}}
                    onClick={joinGame} disabled={mpJoinInput.length<4}>
                    CONNECT
                  </button>
                  <button className="btn" style={{fontSize:10,padding:"6px 14px",opacity:.4}}
                    onClick={()=>setMpMode(null)}>
                    BACK
                  </button>
                </div>
                {mpStatus==="connecting"&&(
                  <div style={{fontFamily:"Cinzel",fontSize:10,color:"#44aaff",letterSpacing:2,animation:"pulse .8s ease-in-out infinite"}}>
                    CONNECTING…
                  </div>
                )}
              </div>
            )}

            {/* Joining in progress */}
            {mpMode==="joining"&&mpStatus==="connecting"&&(
              <div style={{fontFamily:"Cinzel",fontSize:11,color:"#44aaff",letterSpacing:3,animation:"pulse .8s ease-in-out infinite"}}>
                CONNECTING TO HOST…
              </div>
            )}
            </div>{/* end text backdrop panel */}
          </div>
        </div>
      )}

      {/* ══ WEAPON SELECT ══ */}
      {screen==="weapon_select"&&(
        <div style={{height:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"20px 40px",animation:"fadeIn .4s"}}>
          {arrivedViaPortal&&(
            <div style={{position:"fixed",top:0,left:0,right:0,padding:"10px 24px",background:"linear-gradient(to right,#0a0a20,#1a0a40,#0a0a20)",borderBottom:"1px solid #6644ff88",display:"flex",alignItems:"center",gap:12,zIndex:100}}>
              <span style={{fontSize:20}}>🌀</span>
              <span style={{fontFamily:"Cinzel",fontSize:11,letterSpacing:2,color:"#aa88ff"}}>
                YOU ARRIVED VIA PORTAL{portalRefTitle?` FROM ${portalRefTitle.toUpperCase()}`:""} — WELCOME, {portalName.toUpperCase()}
              </span>
            </div>
          )}
          <h2 style={{fontFamily:"Cinzel",fontSize:30,letterSpacing:5,marginBottom:6}}>CHOOSE YOUR PATH</h2>
          <p style={{opacity:.4,marginBottom:36,fontStyle:"italic",letterSpacing:2}}>Your weapon shapes your destiny</p>
          <div style={{display:"flex",flexDirection:"row",gap:12,marginBottom:28,flexWrap:"nowrap",zoom:1.35}}>
            {Object.values(STARTER_WEAPONS).map(w=>{
              const sel=selectedWeapon===w.id;
              const hov=hoverWeaponId===w.id;
              const qteLabel=QTE_LABEL[w.qteType]||"?";
              return (
                <div key={w.id}
                  onClick={()=>setSelectedWeapon(w.id)}
                  onMouseEnter={()=>setHoverWeaponId(w.id)}
                  onMouseLeave={()=>setHoverWeaponId(null)}
                  style={{width:200,padding:"28px 18px",textAlign:"center",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",border:`2px solid ${sel?"#e8d5a3":hov?"#6677aa":"#2a2a3a"}`,background:sel?"#14142a":hov?"#0c0c1e":"#09090f",boxShadow:sel?"0 0 32px rgba(232,213,163,.2)":hov?"0 0 16px rgba(100,120,200,.15)":"none",transition:"all .2s",position:"relative"}}>
                  <div style={{width:80,height:80,marginBottom:16,display:"flex",alignItems:"center",justifyContent:"center",filter:sel?"drop-shadow(0 0 14px #e8d5a388)":hov?"drop-shadow(0 0 10px #6677aaaa)":"none",transition:"filter .2s"}}>
                    <Icon type={w.id} size={74} color={sel?"#e8d5a3":hov?"#9aabcc":"#8a7a66"}/>
                  </div>
                  <div style={{fontFamily:"Cinzel",fontSize:11,letterSpacing:2,opacity:.5,marginBottom:8,display:"flex",alignItems:"center",justifyContent:"center",gap:5}}><Icon type={w.id} size={14} color={sel?"#c8b888":"#666"}/> {w.className}</div>
                  <div style={{fontFamily:"Cinzel",fontSize:16,marginBottom:12,color:sel?"#e8d5a3":"#9a8a73",lineHeight:1.3}}>{w.name}</div>
                  {/* Hover tooltip overlay — shows QTE label + desc in larger font */}
                  {hov&&(
                    <div style={{position:"absolute",top:"100%",left:"50%",transform:"translateX(-50%)",marginTop:8,zIndex:200,
                      background:"rgba(8,8,22,.97)",border:"1px solid #4466aa88",borderRadius:8,
                      padding:"14px 16px",width:220,textAlign:"center",
                      boxShadow:"0 8px 32px rgba(0,0,0,.8), 0 0 20px rgba(68,102,170,.2)",
                      pointerEvents:"none"}}>
                      <div style={{fontFamily:"Cinzel",fontSize:13,fontWeight:700,letterSpacing:3,
                        color:"#ffcc44",marginBottom:8,textShadow:"0 0 12px #ffcc4444"}}>
                        {qteLabel}
                      </div>
                      <div style={{fontSize:11,lineHeight:1.7,color:"#c8b888",opacity:.85}}>
                        {w.desc}
                      </div>
                      <div style={{marginTop:8,fontSize:10,fontFamily:"Cinzel",color:"#6688aa",letterSpacing:1}}>
                        ATK {w.baseDmg}
                      </div>
                    </div>
                  )}
                  <div style={{fontSize:12,opacity:.55,lineHeight:1.7,marginBottom:"auto",paddingBottom:14}}>{w.desc}</div>
                  <div style={{fontSize:11,fontFamily:"Cinzel",padding:"5px 10px",border:`1px solid ${sel?"#ffcc4455":"#222"}`,color:sel?"#ffcc44":"#555",marginBottom:10}}>{qteLabel}</div>
                  <div style={{fontSize:12,opacity:.45,fontFamily:"Cinzel"}}>ATK {w.baseDmg}</div>
                </div>
              );
            })}
          </div>
          <button className="btn" disabled={!selectedWeapon} style={{fontSize:16,padding:"15px 48px",letterSpacing:5}}
            onClick={()=>selectedWeapon&&startGame(selectedWeapon)}>ENTER THE SPIRE →</button>
        </div>
      )}

      {/* ══ MAP ══ */}
      {screen==="map"&&player&&(
        <div style={{height:"100vh",display:"flex",flexDirection:"column",background:"radial-gradient(ellipse at 50% 0%, #1e1240 0%, #0e0e24 45%, #080c18 100%)"}}>
          {/* Header */}
          <div style={{padding:"14px 24px",background:"rgba(0,0,0,.35)",backdropFilter:"blur(4px)",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid #2a2a44",fontFamily:"Cinzel",fontSize:12,letterSpacing:1,flexShrink:0}}>
            <span style={{color:"#c8b888",display:"inline-flex",alignItems:"center",gap:6}}><Icon type={player.weapons?.[0]||"sword"} size={16} color="#c8b888"/>{player.class} · LVL {player.level} · STR +{player.str}</span>
            <span style={{color:"#7a6aaa",letterSpacing:3}}>FLOOR {player.floor} / {FLOOR_CONFIGS.length}</span>
            <span style={{color:player.hp<player.maxHp*.3?"#ff6666":player.hp<player.maxHp*.6?"#ffcc44":"#55dd77"}}>{player.hp}/{player.maxHp}</span>
          </div>
          {/* XP bar */}
          <div style={{height:3,background:"#0a0a14",flexShrink:0}}>
            <div style={{height:"100%",background:"linear-gradient(to right,#6622aa,#aa44ff)",width:`${Math.min(100,(player.xp/(player.level*40))*100)}%`,transition:"width .5s",boxShadow:"0 0 8px #8833ff"}}/>
          </div>
          {/* Map */}
          <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",padding:8}}>
            {(()=>{
              const mzoom = Math.min((window.innerWidth-16)/MAP_W, (window.innerHeight-70)/MAP_H);
              return (
            <div style={{position:"relative",width:MAP_W,height:MAP_H,zoom:mzoom,flexShrink:0}}>
              {/* Background grid dots */}
              <svg style={{position:"absolute",inset:0,pointerEvents:"none"}} width={MAP_W} height={MAP_H}>
                {Array.from({length:7},(_,row)=>Array.from({length:6},(_,col)=>(
                  <circle key={`${row}-${col}`} cx={col*90+30} cy={row*70+20} r="1.2" fill="#2a2a44" opacity=".5"/>
                )))}
                {/* Floor connector lines */}
                {MAP_DATA.map(n=>MAP_DATA.filter(c=>c.fl===n.fl+1).map(c=>{
                  const vis=player.visited.includes(n.id)&&player.visited.includes(c.id);
                  const avail=n.fl===player.floor-1||n.fl===player.floor;
                  return <line key={`${n.id}-${c.id}`} x1={n.x} y1={n.y} x2={c.x} y2={c.y}
                    stroke={vis?"#5544aa":avail?"#3a3a5a":"#1e1e2e"}
                    strokeWidth={vis?2:1.5} strokeDasharray="6 5"
                    opacity={player.floor>n.fl?.9:player.floor===n.fl?.5:.2}/>;
                }))}
                {/* Floor labels */}
                {Array.from({length:FLOOR_CONFIGS.length+1},(_,f)=>{
                  const nd=MAP_DATA.filter(n=>n.fl===f); if(!nd.length) return null;
                  return <text key={f} x="22" y={nd[0].y+4} fontSize="10" fill="#4a4a6a"
                    fontFamily="Cinzel" textAnchor="middle" opacity=".9">{f===FLOOR_CONFIGS.length?"BOSS":`F${f+1}`}</text>;
                })}
              </svg>

              {/* Map nodes */}
              {MAP_DATA.map(n=>{
                const isA=n.fl===player.floor, isV=player.visited.includes(n.id);
                const isF=n.fl>player.floor, isB=n.type==="boss", isR=n.type==="rest", isE=n.type==="elite";
                const nodeColor = isB?"#ff4422":isE?"#aa44ff":isR?"#44cc66":"#e8d5a3";
                const nodeBg    = isV?"#0e0e1a":isA?(isB?"#1e0808":isE?"#0e0820":isR?"#081808":"#0e0e18"):"#080814";
                const nodeBorder= isV?`1px solid #2a2a40`:isA?`2px solid ${nodeColor}99`:`1px solid #1e1e2e`;
                const nodeGlow  = isA?`0 0 20px ${nodeColor}44`:"none";
                const sz = isB?54:isE?46:42;
                const title = isA?(isR?"Campfire: restore 25 HP":isB?"BOSS: Demon Slime":isE?`ELITE ${ENEMIES[n.enemy]?.name||""}`:ENEMIES[n.enemy]?.name||""):"";
                return (
                  <button key={n.id} title={title}
                    onClick={()=>{ if(!isA)return; if(isR){setPlayer(p=>({...p,hp:Math.min(p.maxHp,p.hp+25),floor:p.floor+1,visited:[...p.visited,n.id]}));}else{startCombat(n);} }}
                    style={{position:"absolute",left:n.x-sz/2,top:n.y-sz/2,width:sz,height:sz,borderRadius:"50%",padding:0,
                      background:nodeBg,border:nodeBorder,cursor:isA?"pointer":"default",
                      color:isV?"#2a2a44":isA?nodeColor:"#2a2a44",
                      fontSize:isB?24:isE?18:17,boxShadow:nodeGlow,opacity:isF?.3:1,transition:"all .2s",
                      display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <img src={`${ASSET_BASE}/icons/sprites/map/${isR?"REST":isB?"BOSS":isE?"ELITE":"COMBAT"}.png`}
                      width={isB?32:isE?26:24} height={isB?32:isE?26:24}
                      style={{imageRendering:"pixelated",display:"block",
                        filter:isV?"brightness(0.35) saturate(0.2)":isA?`drop-shadow(0 0 6px ${nodeColor}bb)`:"brightness(0.5) saturate(0.5)"}}/>
                  </button>
                );
              })}

            </div>
            ); // end mzoom IIFE return
            })()}
          </div>

          {/* ── OUTGOING PORTAL ── fixed bottom-left, outside scaled map */}
          <div style={{position:"fixed",bottom:20,left:20,display:"flex",flexDirection:"column",gap:8,zIndex:200}}>
            {portalRef&&(
              <button onClick={()=>sendThroughPortal(portalRef)}
                style={{display:"flex",alignItems:"center",gap:10,background:"#0a0820",
                  border:"1px solid #6644ffaa",borderRadius:8,padding:"10px 18px",cursor:"pointer",
                  fontFamily:"Cinzel",fontSize:13,letterSpacing:2,color:"#aa88ff",
                  boxShadow:"0 0 18px #6644ff55",animation:"ringPulse 2s infinite",minWidth:220}}>
                <span style={{fontSize:20}}>🌀</span>
                <span>RETURN{portalRefTitle?` TO ${portalRefTitle.toUpperCase()}`:""}</span>
              </button>
            )}
            <button onClick={()=>{
                const t = portalTargets.length ? portalTargets[Math.floor(Math.random()*portalTargets.length)] : APP_FALLBACK_GAMES[0];
                sendThroughPortal(t.url);
              }}
              style={{display:"flex",alignItems:"center",gap:10,background:"#080820",
                border:"1px solid #4433aa88",borderRadius:8,padding:"10px 18px",cursor:"pointer",
                fontFamily:"Cinzel",fontSize:13,letterSpacing:2,color:"#9977dd",
                boxShadow:"0 0 12px #4433aa44",minWidth:220}}>
              <span style={{fontSize:20}}>🌀</span>
              <span>TRAVEL TO ANOTHER WORLD</span>
            </button>
          </div>
        </div>
      )}

      {/* ══ COMBAT ══ */}
      {screen==="combat"&&cs&&player&&(()=>{
        const enemyData = ENEMIES[cs.enemy.id]||ENEMIES.goblin;
        // Use sprite pool frame dims if available — pool sprites are all 128×128, not ENEMY_DIMS
        const eDims     = cs?.enemySprite
          ? {w:cs.enemySprite.frameW, h:cs.enemySprite.frameH}
          : (ENEMY_DIMS[cs.enemy.id]||{w:55,h:70});
        const eScale    = 1.1;
        const eW        = eDims.w*eScale, eH = eDims.h*eScale;
        const eLeft     = ENX - eW/2 + enemyWindUp;
        const eTop      = GNDY - eH;

        const charge = qteAnim?.type==="hold_release"&&!qteAnim.released ? (qteAnim.charge||0) : 0;
        const chargeActive = qteAnim?.type==="hold_release"&&!qteAnim.released;
        const cIsPerfect = charge>=CHARGE_PERFECT_LO && charge<1.0;
        const cIsOvercharge = charge>=CHARGE_PERFECT_HI;
        const cIsGood    = charge>=.60;
        const heroCenterX = (heroPos?heroPos.left:HR_L)+HSW/2;
        const heroCenterY = (heroPos?heroPos.top:HR_T)+HSH/2;

        // Scale battlefield — leave room at bottom for action book widget
        const bfZoom = Math.min(
          (window.innerHeight * 0.75) / BFH,
          window.innerWidth / BFW
        );

        return (
          <div style={{height:"100vh",display:"flex",flexDirection:"column",background:"#020205",overflow:"hidden",animation:"fadeIn .35s"}}>

            {/* ─── Slim combat HUD ─────────────────────────── */}
            <div style={{flexShrink:0,padding:"7px 20px",background:"rgba(0,0,0,.55)",backdropFilter:"blur(4px)",
              borderBottom:"1px solid #1e1e30",display:"flex",justifyContent:"space-between",alignItems:"center",
              fontFamily:"Cinzel",fontSize:14,letterSpacing:1}}>
              <span style={{color:"#c8b888",fontWeight:600,display:"inline-flex",alignItems:"center",gap:6}}><Icon type={player.weapons?.[0]||"sword"} size={16} color="#c8b888"/>{player.class} · Lv{player.level} · {player.hp}/{player.maxHp}</span>
              <span style={{color:cs.pvpMode?"#ff8844":cs.elite?"#aa66ff":enemyData.color,letterSpacing:2,fontWeight:600}}>
                {cs.pvpMode?"⚔ ":cs.elite?"⚡ ELITE — ":""}{cs.enemy.name} · {cs.pvpMode?pvpOppHp:cs.enemy.hp}/{cs.pvpMode?pvpMaxHp:cs.enemy.maxHp}hp
              </span>
            </div>

            {/* ─── BATTLEFIELD — fills most of screen ──────── */}
            <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
            <div style={{position:"relative",width:BFW,height:BFH,flexShrink:0,overflow:"visible",zoom:bfZoom}}>

              {/* Sky */}
              <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,#03030e 0%,#080818 60%,#0d0d1e 100%)",borderRadius:4,overflow:"hidden"}}>
                {[...Array(22)].map((_,i)=>{
                  const sz = i%5===0?2:1;
                  return <div key={i} style={{position:"absolute",left:`${(i*73+11)%100}%`,top:`${(i*47+8)%85}%`,
                    width:sz,height:sz,background:"#e8d5a3",borderRadius:"50%",
                    opacity:.05+i%4*.04,animation:`pulse ${2+i%3}s ${(i*.3)%2}s infinite`}}/>;
                })}
                {/* Subtle vignette */}
                <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,.55) 100%)"}}/>
              </div>

              {/* Particle container — DOM-injected divs via Web Animations API */}
              <div ref={particleContainerRef} style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:30,overflow:"visible"}}/>

              {/* Ground */}
              <div style={{position:"absolute",left:0,right:0,top:GNDY,height:2,background:"linear-gradient(to right,transparent,#2a2a40,#2a2a40,transparent)",zIndex:3}}/>
              <div style={{position:"absolute",left:0,right:0,top:GNDY+2,height:20,background:"linear-gradient(to bottom,#12121e,transparent)",zIndex:3}}/>

              {/* ── SWING BEAT: A → W → D combo keys + live timers ── */}
              {qteAnim?.type==="swing_beat"&&(()=>{
                const step        = qteAnim.step||0;
                const bad         = qteAnim.badKey;
                const keys        = BEAT_COMBO;
                const colors      = ["#44aaff","#ffcc44","#ff6644"];
                const now         = performance.now();
                const qteOpenMs   = qteAnim.qteOpenMs;
                const comboStartMs= qteAnim.comboStartMs;
                // Countdown: time remaining in QTE window (only after walk, before A pressed)
                const countdownMs = qteOpenMs && !comboStartMs
                  ? Math.max(0, BEAT_TIMEOUT - (now - qteOpenMs)) : null;
                // Combo elapsed: time since A was pressed
                const comboElapsedMs = comboStartMs ? (now - comboStartMs) : null;
                // Damage preview based on current elapsed
                const previewMult = comboElapsedMs != null
                  ? Math.max(0.20, 1.75 * Math.pow(0.85, comboElapsedMs / 25)) : null;
                return (
                  <div style={{position:"absolute",left:"50%",transform:"translateX(-50%)",top:6,
                    display:"flex",flexDirection:"column",gap:4,zIndex:9,alignItems:"center"}}>
                    {/* Key boxes */}
                    <div style={{display:"flex",gap:10,alignItems:"center"}}>
                      {keys.map((k,i)=>{
                        const done    = i < step;
                        const current = i === step;
                        const col     = colors[i];
                        return (
                          <div key={k} style={{
                            width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",
                            fontFamily:"Cinzel",fontWeight:700,fontSize:16,borderRadius:6,
                            background: done?"#0a1a0a":current?"#1a1a2a":"#0a0a10",
                            border:`2px solid ${done?"#44ff88":current?(bad?"#ff4422":col):"#2a2a3a"}`,
                            color: done?"#44ff88":current?(bad?"#ff4422":col):"#333",
                            boxShadow: done?"0 0 10px #44ff8866":current&&!bad?`0 0 16px ${col}88`:"none",
                            transform: current&&!bad?"scale(1.18)":"scale(1)",
                            transition:"all .07s",
                            opacity: done?0.6:1,
                          }}>{done?"✓":k}</div>
                        );
                      })}
                    </div>
                    {/* timers moved to position:fixed overlay below battlefield */}
                    {!qteOpenMs&&(
                      <span style={{fontFamily:"Cinzel",color:"#4a4a6a",fontSize:10,letterSpacing:2}}>GET READY</span>
                    )}
                  </div>
                );
              })()}

              {/* ── CHARGE: vertical power meter ── */}
              {chargeActive&&(()=>{
                // Meter dimensions — big vertical bar, right of center
                const mH=230, mW=46, mL=BFW/2+70, mT=BFH/2-mH/2;
                const pct = Math.min(charge*100, 100);
                // Zone boundaries (bottom=0%, top=100%)
                const goodLo=50, perfLo=CHARGE_PERFECT_LO*100, perfHi=CHARGE_PERFECT_HI*100;
                const fillCol = pct>=100?"#ff3311":pct>=perfHi?"#ff2200":pct>=perfLo?"#00ff66":pct>=goodLo?"#ffaa22":"#3388ff";
                const isPerfectZone = pct>=perfLo && pct<perfHi;
                const isDanger      = pct>=perfHi;
                // pixel position of zones from bottom of meter
                const px = (v)=> mH*(1-v/100); // top offset for value v%
                const borderCol = isDanger?"#ff2200":isPerfectZone?"#00ff66":pct>=goodLo?"#ffaa22":"#334466";
                const outerGlow = isDanger?"0 0 40px #ff220099, 0 0 18px #ff220066":isPerfectZone?"0 0 40px #00ff6699, 0 0 18px #00ff6666":"0 0 8px #111";
                return (
                  <>
                    {/* HOLD instruction — above meter */}
                    <div style={{position:"absolute",left:mL+mW/2,top:mT-32,
                      transform:"translateX(-50%)",fontFamily:"Cinzel",fontSize:11,letterSpacing:2,
                      color:"#6677aa",textShadow:"0 0 6px #334488",zIndex:9,whiteSpace:"nowrap"}}>
                      HOLD SPACE
                    </div>
                    {/* Meter track — outer shell */}
                    <div style={{position:"absolute",left:mL,top:mT,width:mW,height:mH,
                      borderRadius:8,border:`3px solid ${borderCol}`,
                      background:"#060610",zIndex:9,overflow:"hidden",
                      boxShadow:outerGlow}}>
                      {/* Zone bands */}
                      <div style={{position:"absolute",left:0,bottom:0,width:"100%",height:`${goodLo}%`,background:"rgba(30,60,180,.30)"}}/>
                      <div style={{position:"absolute",left:0,bottom:`${goodLo}%`,width:"100%",height:`${perfLo-goodLo}%`,background:"rgba(200,120,0,.28)"}}/>
                      {/* Perfect zone — bright green band */}
                      <div style={{position:"absolute",left:0,bottom:`${perfLo}%`,width:"100%",height:`${perfHi-perfLo}%`,
                        background:"rgba(0,255,100,.55)",boxShadow:"inset 0 0 12px #00ff6699"}}/>
                      {/* Danger: 90-100% */}
                      <div style={{position:"absolute",left:0,bottom:`${perfHi}%`,width:"100%",height:`${100-perfHi}%`,background:"rgba(255,30,0,.40)"}}/>
                      {/* Fill — grows from bottom */}
                      <div style={{
                        position:"absolute",left:0,bottom:0,width:"100%",height:`${pct}%`,
                        background:`linear-gradient(to top, ${fillCol}cc, ${fillCol})`,
                        boxShadow:`0 0 24px ${fillCol}, inset 0 0 10px rgba(255,255,255,.2)`,
                        transition:"height .03s linear",
                      }}/>
                      {/* Sheen highlight */}
                      <div style={{position:"absolute",left:"8%",bottom:0,width:"28%",height:`${pct}%`,
                        background:"rgba(255,255,255,.22)",transition:"height .03s linear",
                        borderRadius:"0 0 4px 4px",pointerEvents:"none"}}/>
                    </div>
                    {/* Zone tick lines + labels — outside track */}
                    {[{v:goodLo,col:"#ffcc44",lbl:"GOOD"},{v:perfLo,col:"#00ff66",lbl:"★ RELEASE"},{v:perfHi,col:"#ff2200",lbl:"DANGER"}].map(({v,col,lbl},i)=>(
                      <React.Fragment key={i}>
                        <div style={{position:"absolute",left:mL-3,top:mT+px(v)-1.5,
                          width:mW+6,height:3,background:col,zIndex:10,borderRadius:2,
                          boxShadow:`0 0 8px ${col}`}}/>
                        <div style={{position:"absolute",left:mL-6,top:mT+px(v)-8,
                          transform:"translateX(-100%)",
                          fontFamily:"Cinzel",fontSize:9,letterSpacing:1,color:col,
                          textShadow:`0 0 8px ${col}`,zIndex:10,whiteSpace:"nowrap",fontWeight:700}}>
                          {lbl}
                        </div>
                      </React.Fragment>
                    ))}
                    {/* Current value needle */}
                    <div style={{position:"absolute",left:mL-6,top:mT+px(pct)-3,
                      width:mW+12,height:6,background:"#ffffff",borderRadius:3,zIndex:11,
                      boxShadow:`0 0 16px #fff, 0 0 32px ${fillCol}, 0 0 6px #fff`,
                      transition:"top .03s linear"}}/>
                    {/* BIG RELEASE flash label — appears only in perfect zone */}
                    {isPerfectZone&&(
                      <div style={{position:"absolute",left:mL+mW/2,top:mT+px(perfLo)-40,
                        transform:"translateX(-50%)",
                        fontFamily:"Cinzel",fontWeight:900,fontSize:18,letterSpacing:3,
                        color:"#00ff66",textShadow:"0 0 20px #00ff66, 0 0 40px #00ff66",
                        zIndex:12,whiteSpace:"nowrap",animation:"chargeRelease .25s ease-in-out infinite alternate"}}>
                        ▼ NOW!
                      </div>
                    )}
                    {/* Status label — below meter */}
                    <div style={{position:"absolute",left:mL+mW/2,top:mT+mH+14,
                      transform:"translateX(-50%)",
                      background:"#08081a",border:`2px solid ${fillCol}`,
                      borderRadius:6,padding:"5px 12px",fontFamily:"Cinzel",
                      fontSize:isDanger||isPerfectZone?13:11,letterSpacing:2,fontWeight:700,
                      color:fillCol,textShadow:`0 0 12px ${fillCol}`,
                      boxShadow:`0 0 16px ${fillCol}66`,zIndex:9,whiteSpace:"nowrap"}}>
                      {isDanger?"⚠ OVERCHARGE!":isPerfectZone?"★ RELEASE NOW!":pct>=goodLo?"ALMOST...":"HOLD [SPC]"}
                    </div>
                    {/* Hammer icon above hero */}
                    <div style={{position:"absolute",left:(heroPos?.left||HR_L)+HSW/2-9,top:(heroPos?.top||HR_T)-30,
                      zIndex:9,animation:"float .4s ease-in-out infinite",
                      filter:isPerfectZone?"drop-shadow(0 0 14px #00ff66)":isDanger?"drop-shadow(0 0 14px #ff2200)":"none"}}>
                      <Icon type={qteAnim?.weapon?.id||"hammer"} size={20}/>
                    </div>
                  </>
                );
              })()}

              {/* ── CHARGE: projectile flying to enemy after release ── */}
              {qteAnim?.type==="hold_release"&&qteAnim.released&&(()=>{
                const rt  = qteAnim.releaseT||0;
                const q   = (qteAnim.charge||0)>=CHARGE_PERFECT_LO?"perfect":(qteAnim.charge||0)>=0.60?"good":"miss";
                const col = q==="perfect"?"#44ff88":q==="good"?"#ffcc44":"#ff5522";
                const sx  = (heroPos?.left||HR_L)+HSW/2;
                const sy  = (heroPos?.top||HR_T)+HSH/2;
                const tx  = ENX;
                const ty  = eTop + eH*0.38;
                const bx  = sx + (tx-sx)*easeIO(rt);
                const by  = sy + (ty-sy)*easeIO(rt);
                const wEmoji = qteAnim.weapon?.emoji||"⚔️";
                return (
                  <svg style={{position:"absolute",left:0,top:0,zIndex:12,pointerEvents:"none",overflow:"visible"}} width={BFW} height={BFH}>
                    {/* Trail */}
                    {[...Array(5)].map((_,i)=>{
                      const tp=Math.max(0,rt-(i+1)*0.07);
                      const tx2=sx+(tx-sx)*easeIO(tp), ty2=sy+(ty-sy)*easeIO(tp);
                      return <circle key={i} cx={tx2} cy={ty2} r={9-i*1.5} fill={col} opacity={(1-i*0.2)*0.45}
                        style={{filter:`drop-shadow(0 0 ${6-i}px ${col})`}}/>;
                    })}
                    {/* Main orb */}
                    <circle cx={bx} cy={by} r="11" fill={col} style={{filter:`drop-shadow(0 0 16px ${col})`}}/>
                    <circle cx={bx} cy={by} r="5.5" fill="#fff" opacity=".9"/>
                    {/* Spinning weapon emoji */}
                    <foreignObject x={bx-10} y={by-10} width="20" height="20" style={{overflow:"visible",pointerEvents:"none"}}>
                      <div style={{fontSize:14,lineHeight:1,textAlign:"center",transform:`rotate(${rt*720}deg)`,transformOrigin:"center"}}>{wEmoji}</div>
                    </foreignObject>
                    {/* Impact burst at end */}
                    {rt>0.85&&[...Array(8)].map((_,i)=>{
                      const a=i/8*Math.PI*2, r2=(rt-0.85)/0.15*22;
                      return <line key={i} x1={tx} y1={ty} x2={tx+Math.cos(a)*r2} y2={ty+Math.sin(a)*r2}
                        stroke={col} strokeWidth="2" opacity={(1-(rt-0.85)/0.15)*0.85}/>;
                    })}
                  </svg>
                );
              })()}

              {/* ── POKE: A/D keys above hero + fill bar ── */}
              {qteAnim?.type==="poke"&&qteAnim.t>=0.21&&(()=>{
                const inputs = qteAnim.inputs||0;
                const target = qteAnim.tapTarget||POKE_TARGET;
                const lk = qteAnim.lastKey; // last pressed key
                const nextKey = lk==="A"?"D":"A"; // next expected
                const hL = heroPos?.left||HR_L;
                const hT = heroPos?.top||HR_T;
                return (
                  <>
                    {/* A/D keys above hero head */}
                    <div style={{position:"absolute",left:hL+HSW/2-26,top:hT-44,display:"flex",gap:6,zIndex:9}}>
                      {["A","D"].map(k=>(
                        <div key={k} style={{width:24,height:24,display:"flex",alignItems:"center",justifyContent:"center",
                          fontFamily:"Cinzel",fontWeight:700,fontSize:13,borderRadius:4,
                          background:nextKey===k?"#1a1a2a":"#0a0a12",
                          border:`2px solid ${nextKey===k?"#ffcc44":"#2a2a3a"}`,
                          color:nextKey===k?"#ffcc44":"#333",
                          boxShadow:nextKey===k?"0 0 10px #ffcc4488":"none",
                          transform:nextKey===k?"scale(1.2)":"scale(1)",transition:"all .06s"}}>{k}</div>
                      ))}
                    </div>
                    {/* Fill bar */}
                    <div style={{position:"absolute",top:12,left:BFW/2-150,width:300,height:12,background:"#0a0a18",border:"1px solid #2a2a44",borderRadius:6,zIndex:9}}>
                      <div style={{height:"100%",borderRadius:6,width:`${(inputs/target)*100}%`,
                        background:"linear-gradient(to right,#cc4411,#ffcc44)",
                        boxShadow:"0 0 8px #ff8844",transition:"width .04s"}}/>
                    </div>
                  </>
                );
              })()}

              {/* ── ARCHERY: target board + 3 always-moving dots ── */}
              {qteAnim?.type==="archery"&&!qteAnim.firingArrows&&(()=>{
                const R  = 62;
                const cx = BFW/2, cy = BFH/2 - 8;
                const activeDotIdx = qteAnim.shotsFired||0;
                const dots = qteAnim.dots||[];
                const locked = qteAnim.lockedDots||[];
                const timeLeft = 1-(qteAnim.t||0);
                // Quality by normalized Lissajous dist (matches QTE logic thresholds)
                const dotQ = (lx,ly) => {
                  const d=Math.sqrt(lx*lx+ly*ly);
                  return d<0.20?"perfect":d<0.56?"good":"miss";
                };
                const qColor = q => q==="perfect"?"#44ff88":q==="good"?"#ffcc44":"#ff5544";
                // Active dot current position
                const activeDot = dots[activeDotIdx];
                const adlx = activeDot?.x||0, adly = activeDot?.y||0;
                const aq = dotQ(adlx,adly);
                const adx = adlx*R*0.90, ady = adly*R*0.90;
                // Timer bar params
                const barX = cx+R+14, barH = R*2, barY = cy-barH/2;
                const barFill = timeLeft>0.4?"#44ff88":timeLeft>0.2?"#ffcc44":"#ff4422";
                return (
                  <svg style={{position:"absolute",left:0,top:0,zIndex:9,pointerEvents:"none"}} width={BFW} height={BFH}>
                    {/* Board background */}
                    <circle cx={cx} cy={cy} r={R+4} fill="#050510" opacity=".9"/>
                    {/* Rings — outer → inner */}
                    <circle cx={cx} cy={cy} r={R}     fill="none" stroke="#551111" strokeWidth="10" opacity=".7"/>
                    <circle cx={cx} cy={cy} r={R*.66} fill="none" stroke="#333311" strokeWidth="10" opacity=".7"/>
                    <circle cx={cx} cy={cy} r={R*.38} fill="none" stroke="#113322" strokeWidth="10" opacity=".8"/>
                    <circle cx={cx} cy={cy} r={R*.16} fill="#1a5533" stroke="#44ff88" strokeWidth="2"
                      style={{filter:"drop-shadow(0 0 6px #44ff8866)"}}/>
                    {/* Crosshairs */}
                    <line x1={cx-R-4} y1={cy} x2={cx+R+4} y2={cy} stroke="#ffffff08" strokeWidth="1"/>
                    <line x1={cx} y1={cy-R-4} x2={cx} y2={cy+R+4} stroke="#ffffff08" strokeWidth="1"/>

                    {/* ── Dot path trails ── */}
                    {(()=>{
                      const dp = qteAnim.dotParams||[];
                      const elapsed = (qteAnim.t||0) * 4.5; // seconds (ARCHERY_DUR/1000)
                      const TRAIL_STEPS = 48;
                      const TRAIL_SECS  = 1.4;
                      return dots.map((dd,i)=>{
                        const params = dp[i]; if(!params) return null;
                        const isActive = i === (qteAnim.shotsFired||0);
                        const isLocked = i < (qteAnim.shotsFired||0);
                        if(isLocked) return null;
                        const pts=[];
                        if(isActive){
                          // Recent trail behind active dot
                          for(let s=0;s<=TRAIL_STEPS;s++){
                            const tAgo=(TRAIL_STEPS-s)/TRAIL_STEPS*Math.min(elapsed,TRAIL_SECS);
                            const tSec=Math.max(0,elapsed-tAgo);
                            const r=(Math.sin(tSec*params.pulseFreq*Math.PI*2+params.pulsePhase)+1)*0.5;
                            const a=tSec*params.spinFreq*Math.PI*2+params.spinPhase;
                            pts.push({x:r*Math.cos(a)*R*0.90, y:r*Math.sin(a)*R*0.90, op:(s/TRAIL_STEPS)*0.7});
                          }
                          return (<g key={i}>{pts.map((pt,si)=>(
                            <circle key={si} cx={cx+pt.x} cy={cy+pt.y} r={si%3===0?2.2:1.2}
                              fill={si%3===0?"#ffffff":"#88ccff"} opacity={pt.op}/>
                          ))}</g>);
                        } else {
                          // Future dot — show ghost orbit path
                          const fullSteps=60;
                          for(let s=0;s<=fullSteps;s++){
                            const tSec=elapsed+(s/fullSteps)*1.2;
                            const r=(Math.sin(tSec*params.pulseFreq*Math.PI*2+params.pulsePhase)+1)*0.5;
                            const a=tSec*params.spinFreq*Math.PI*2+params.spinPhase;
                            pts.push({x:r*Math.cos(a)*R*0.90, y:r*Math.sin(a)*R*0.90});
                          }
                          return (<g key={i}>{pts.map((pt,si)=>si%4===0?(
                            <circle key={si} cx={cx+pt.x} cy={cy+pt.y} r="1"
                              fill="#6655aa" opacity=".2"/>
                          ):null)}</g>);
                        }
                      });
                    })()}

                    {/* ── All 3 dots: active=bright, future=dim, locked=result ── */}
                    {dots.map((dd,i)=>{
                      const isActive  = i===activeDotIdx;
                      const isLocked  = i<activeDotIdx;
                      if(isLocked){
                        const ld=locked[i];
                        if(!ld) return null;
                        const col=qColor(ld.q);
                        const lx=ld.x*R*0.90, ly=ld.y*R*0.90;
                        return (
                          <g key={i} opacity=".45">
                            <circle cx={cx+lx} cy={cy+ly} r="6" fill={col}/>
                            <circle cx={cx+lx} cy={cy+ly} r="2.5" fill="#fff" opacity=".8"/>
                            <text x={cx+lx} y={cy+ly-10} textAnchor="middle" fontFamily="Cinzel"
                              fontSize="7" fill={col}>{ld.q==="perfect"?"✓✓":ld.q==="good"?"✓":"✗"}</text>
                          </g>
                        );
                      }
                      const px=dd.x*R*0.90, py=dd.y*R*0.90;
                      const q=dotQ(dd.x,dd.y);
                      const col=qColor(q);
                      if(isActive){
                        return (
                          <g key={i}>
                            {q==="perfect"&&<circle cx={cx+px} cy={cy+py} r={R*.16+4} fill="none"
                              stroke="#44ff88" strokeWidth="1.5" opacity=".6" style={{animation:"ringPulse .4s infinite"}}/>}
                            <line x1={cx+px-9} y1={cy+py} x2={cx+px+9} y2={cy+py} stroke={col} strokeWidth="1.2" opacity=".7"/>
                            <line x1={cx+px} y1={cy+py-9} x2={cx+px} y2={cy+py+9} stroke={col} strokeWidth="1.2" opacity=".7"/>
                            <circle cx={cx+px} cy={cy+py} r="9" fill={col} opacity=".95"
                              style={{filter:`drop-shadow(0 0 16px ${col})`}}/>
                            <circle cx={cx+px} cy={cy+py} r="4" fill="#fff" opacity=".98"/>
                          </g>
                        );
                      }
                      // Future dot: always moving but very dim, no label
                      return (
                        <g key={i} opacity=".28">
                          <circle cx={cx+px} cy={cy+py} r="6" fill="#aaaacc"/>
                          <circle cx={cx+px} cy={cy+py} r="2.5" fill="#ccccee" opacity=".6"/>
                        </g>
                      );
                    })}

                    {/* Timer bar (right side of board) */}
                    <rect x={barX} y={barY} width={7} height={barH} fill="#0a0a18" rx="3" opacity=".9"/>
                    <rect x={barX} y={barY+barH*(1-timeLeft)} width={7} height={barH*timeLeft}
                      fill={barFill} rx="3" style={{filter:`drop-shadow(0 0 4px ${barFill})`}}/>
                    <text x={barX+3} y={barY-6} textAnchor="middle" fontFamily="Cinzel" fontSize="7"
                      fill="#e8d5a355">T</text>

                    {/* SPACE prompt */}
                    <text x={cx} y={cy+R+20} textAnchor="middle" fontFamily="Cinzel" fontSize="10"
                      fill={aq==="perfect"?"#44ff88":"#e8d5a366"} letterSpacing="3"
                      style={aq==="perfect"?{animation:"pulse .3s infinite"}:{}}>[ SPACE ] — {activeDotIdx+1} / 3</text>
                  </svg>
                );
              })()}
              {/* ── 3 arrows in flight after firing ── */}
              {qteAnim?.type==="archery"&&qteAnim.firingArrows&&(()=>{
                const hx = HR_L+HSW/2, hy = HR_T+HSH/2;
                // Arrows always fly to the enemy, spread slightly per arrow index
                const enemyCX = ENX;
                const enemyCY = eTop + eH*0.35;
                const arrows = qteAnim.arrows||[];
                const qColor = q => q==="perfect"?"#44ff88":q==="good"?"#ffcc44":"#cc4422";
                return (
                  <svg style={{position:"absolute",left:0,top:0,zIndex:12,pointerEvents:"none",overflow:"visible"}} width={BFW} height={BFH}>
                    {arrows.map((arw,idx)=>{
                      const af  = arw.frac||0;
                      const col = qColor(arw.q);
                      // Spread arrows slightly so they don't all overlap
                      const spread = (idx-1)*10;
                      const tx  = enemyCX + spread;
                      const ty  = enemyCY + spread*0.3;
                      const ax  = hx + (tx-hx)*af;
                      const ay  = hy + (ty-hy)*af;
                      const ang = Math.atan2(ty-hy, tx-hx);
                      const tipX  = ax, tipY  = ay;
                      const tailX = ax - Math.cos(ang)*22, tailY = ay - Math.sin(ang)*22;
                      return (
                        <g key={idx}>
                          {/* Shaft */}
                          <line x1={tailX} y1={tailY} x2={tipX} y2={tipY} stroke={col} strokeWidth="2.5"
                            opacity={af<1?1:0.45} style={{filter:`drop-shadow(0 0 5px ${col})`}}/>
                          {/* Fletching */}
                          <line x1={tailX} y1={tailY} x2={tailX+Math.cos(ang+0.5)*10} y2={tailY+Math.sin(ang+0.5)*10} stroke={col} strokeWidth="1.5" opacity=".7"/>
                          <line x1={tailX} y1={tailY} x2={tailX+Math.cos(ang-0.5)*10} y2={tailY+Math.sin(ang-0.5)*10} stroke={col} strokeWidth="1.5" opacity=".7"/>
                          {/* Head */}
                          <polygon points={`${tipX},${tipY} ${tipX-Math.cos(ang-0.4)*10},${tipY-Math.sin(ang-0.4)*10} ${tipX-Math.cos(ang+0.4)*10},${tipY-Math.sin(ang+0.4)*10}`}
                            fill={col} style={{filter:`drop-shadow(0 0 6px ${col})`}}/>
                          {/* Trail sparks */}
                          {af<1&&[...Array(4)].map((_,i)=>{
                            const tp = Math.max(0,af-(i+1)*0.09);
                            return <circle key={i} cx={hx+(tx-hx)*tp} cy={hy+(ty-hy)*tp} r={2.2-i*0.4}
                              fill={col} opacity={(1-i*0.25)*0.5}/>;
                          })}
                          {/* Impact burst */}
                          {af>=1&&[...Array(8)].map((_,i)=>{
                            const a = i/8*Math.PI*2;
                            return <line key={i} x1={tx} y1={ty} x2={tx+Math.cos(a)*14} y2={ty+Math.sin(a)*14}
                              stroke={col} strokeWidth="1.5" opacity=".7"/>;
                          })}
                        </g>
                      );
                    })}
                  </svg>
                );
              })()}

              {/* ── DUAL ACTION: hold A+W+D, click when dot centers ── */}
              {qteAnim?.type==="dual_action"&&(()=>{
                const { dotPos=0, allHeld=false, keysHeld={}, centerWidth=0.18,
                        dropCount=0, inCenter=false, t=0 } = qteAnim;
                const trackW = BFW * 0.28;
                const trackX = (BFW - trackW) / 2;
                const trackY = BFH / 2 - 12;
                const trackH = 9;
                const dotX   = trackX + dotPos * trackW;
                const zoneX  = trackX + (0.5 - centerWidth/2) * trackW;
                const zoneW  = centerWidth * trackW;
                const perfW  = zoneW * 0.32;          // inner perfect strip
                const perfX  = trackX + (0.5 - centerWidth*0.32/2) * trackW;
                const wCol   = WEAPON_PART_COL[qteAnim.weapon?.id] || "#e8d5a3";
                const timeLeft = 1 - t;
                const timerCol = timeLeft > 0.4 ? "#44ff88" : timeLeft > 0.2 ? "#ffcc44" : "#ff4422";
                const KEY_DEFS = [
                  { k:"a", label:"A", held: keysHeld.a },
                  { k:"w", label:"W", held: keysHeld.w },
                  { k:"d", label:"D", held: keysHeld.d },
                ];
                return (
                  <svg style={{position:"absolute",left:0,top:0,zIndex:9,pointerEvents:"none",overflow:"visible"}}
                    width={BFW} height={BFH}>

                    {/* Timer bar */}
                    <rect x={trackX} y={trackY-14} width={trackW} height={4} rx="1" fill="#08080f"/>
                    <rect x={trackX} y={trackY-14} width={trackW*timeLeft} height={4} rx="1" fill={timerCol}/>

                    {/* Track background */}
                    <rect x={trackX} y={trackY} width={trackW} height={trackH} rx="2" fill="#08080e"/>

                    {/* Good zone */}
                    <rect x={zoneX} y={trackY} width={zoneW} height={trackH} rx="1"
                      fill={wCol} opacity={allHeld?.28:.14}/>

                    {/* Perfect zone */}
                    <rect x={perfX} y={trackY} width={perfW} height={trackH} rx="1"
                      fill={allHeld?"#ffffff":wCol} opacity={allHeld?.42:.20}/>

                    {/* Center tick */}
                    <line x1={trackX+trackW/2} y1={trackY-3} x2={trackX+trackW/2} y2={trackY+trackH+3}
                      stroke={wCol} strokeWidth="1" opacity={allHeld?.8:.35}/>

                    {/* Moving indicator */}
                    {allHeld&&(
                      <>
                        {/* Trail */}
                        {[1,2,3].map(i=>{
                          const tx2 = dotX - qteAnim.dotDir*(i*6);
                          if (tx2 < trackX || tx2 > trackX+trackW) return null;
                          const tw = Math.max(1, 5-i*1.2);
                          return <rect key={i} x={tx2-tw/2} y={trackY+1} width={tw} height={trackH-2} rx="1"
                            fill={wCol} opacity={0.28-i*0.07}/>;
                        })}
                        {/* Core bar */}
                        <rect x={dotX-4} y={trackY} width={8} height={trackH} rx="1"
                          fill={inCenter?"#ffffff":wCol}
                          opacity={inCenter?1:.9}/>
                      </>
                    )}

                    {/* Placeholder when keys not held */}
                    {!allHeld&&(
                      <rect x={dotX-3} y={trackY+1} width={6} height={trackH-2} rx="1" fill="#3a3a4a" opacity=".5"/>
                    )}

                    {/* Track border */}
                    <rect x={trackX} y={trackY} width={trackW} height={trackH} rx="2"
                      fill="none" stroke={allHeld?wCol:"#2a2a3a"} strokeWidth={allHeld?1.5:1}
                      opacity={allHeld?.8:.35}/>

                    {/* Key indicators */}
                    {KEY_DEFS.map((kd,i)=>{
                      const kx = BFW/2 - 44 + i*44;
                      const ky = trackY + trackH + 18;
                      const held = kd.held;
                      return (
                        <g key={kd.k}>
                          <rect x={kx-14} y={ky} width={28} height={28} rx="5"
                            fill={held?"#1a1208":"#0a0a14"}
                            stroke={held?wCol:"#2a2a3a"} strokeWidth={held?2:1}
                            style={{filter:held?`drop-shadow(0 0 8px ${wCol})`:"none",
                              animation:held?"dualKeyPop .15s ease-out":"none"}}/>
                          <text x={kx} y={ky+18} textAnchor="middle"
                            fontFamily="Cinzel" fontWeight="700" fontSize="13"
                            fill={held?wCol:"#3a3a5a"}
                            style={{filter:held?`drop-shadow(0 0 6px ${wCol})`:"none"}}>
                            {kd.label}
                          </text>
                        </g>
                      );
                    })}

                    {/* Instruction label */}
                    <text x={BFW/2} y={trackY+trackH+68} textAnchor="middle"
                      fontFamily="Cinzel" fontSize="10" letterSpacing="3"
                      fill={allHeld?"#ffffff":wCol} opacity={allHeld?1:.65}
                      style={{filter:allHeld?`drop-shadow(0 0 8px #ffffff)`:"none"}}>
                      {allHeld
                        ? inCenter ? "★ CLICK NOW! ★" : "← DUAL — CLICK WHEN CENTERED →"
                        : "DUAL — HOLD  A + W + D"}
                    </text>

                    {/* Drop penalty indicator */}
                    {dropCount>0&&(
                      <text x={BFW/2} y={trackY-28} textAnchor="middle"
                        fontFamily="Cinzel" fontSize="9" fill="#ff4422"
                        style={{filter:"drop-shadow(0 0 6px #ff4422)"}}>
                        ✗ KEY DROPPED ×{dropCount}  −{dropCount*18}% DMG
                      </text>
                    )}
                  </svg>
                );
              })()}

              {/* ── RAPID TAP bar (daggers) ── */}
              {qteAnim?.type==="rapid_tap"&&(
                <div style={{position:"absolute",top:6,left:BFW/2-150,width:300,height:10,background:"#0a0a1a",borderRadius:5,zIndex:9,border:"1px solid #2a2a3a"}}>
                  <div style={{height:"100%",borderRadius:5,width:`${((qteAnim.taps||0)/(qteAnim.tapTarget||8))*100}%`,background:"linear-gradient(to right,#ff8844,#ffcc44)",boxShadow:"0 0 8px #ff8844",transition:"width .04s"}}/>
                </div>
              )}

              {/* ── SEQUENCE: swirling orbs beam + runes + timer bar ── */}
              {qteAnim?.type==="sequence"&&(()=>{
                const t = qteAnim.t||0;
                const progress = (qteAnim.input||[]).length / (qteAnim.seq||[1]).length;
                const beamCol = cs.enemy?.color||"#aa44ff";
                return (
                  <svg style={{position:"absolute",left:0,top:0,zIndex:4,pointerEvents:"none",overflow:"visible"}} width={BFW} height={BFH}>
                    {/* Pulsing beam from enemy to hero */}
                    <line x1={ENX} y1={HR_T+HSH/2} x2={HR_L+HSW/2} y2={HR_T+HSH/2}
                      stroke={beamCol} strokeWidth="3" opacity=".18" strokeDasharray="8 5"
                      style={{animation:"beamPulse .4s infinite"}}/>
                    {/* Rune orbs flowing along beam proportional to progress */}
                    {[...Array(4)].map((_,i)=>{
                      const frac = ((t*2 + i*0.25)%1);
                      const ox = HR_L+HSW/2 + (ENX - (HR_L+HSW/2))*frac;
                      const oy = HR_T+HSH/2 + Math.sin(frac*Math.PI*3+i)*8;
                      const opcity = progress>0 ? 0.7 : 0.3;
                      return <circle key={i} cx={ox} cy={oy} r="4" fill="#cc66ff" opacity={opcity}
                        style={{filter:"drop-shadow(0 0 4px #cc66ff)"}}/>;
                    })}
                  </svg>
                );
              })()}
              {/* ── SEQUENCE REVEAL beam (RPG targeting lock) ── */}
              {qteAnim?.type==="sequence_reveal"&&(()=>{
                const t = qteAnim.t||0;
                const step = qteAnim.step||0;
                const len  = (qteAnim.seq||[]).length;
                return (
                  <svg style={{position:"absolute",left:0,top:0,zIndex:4,pointerEvents:"none",overflow:"visible"}} width={BFW} height={BFH}>
                    {/* Lock reticle at enemy */}
                    <circle cx={ENX} cy={eTop+eH*0.45} r={18+Math.sin(t*8)*3}
                      fill="none" stroke="#ff6622" strokeWidth="1.5" opacity=".55"
                      strokeDasharray="6 4"/>
                    <circle cx={ENX} cy={eTop+eH*0.45} r={8}
                      fill="none" stroke="#ffcc44" strokeWidth="1" opacity=".4"/>
                    {/* Progress arcs showing sequence progress */}
                    {step>0&&<circle cx={ENX} cy={eTop+eH*0.45} r={24}
                      fill="none" stroke="#ff6622" strokeWidth="2.5"
                      strokeDasharray={`${step/len*150} 150`} opacity=".7"
                      style={{filter:"drop-shadow(0 0 6px #ff6622)"}}/>}
                    {/* Targeting line */}
                    <line x1={HR_L+HSW/2} y1={HR_T+HSH/2} x2={ENX} y2={eTop+eH*0.45}
                      stroke="#ff6622" strokeWidth="1.5" opacity=".12" strokeDasharray="8 6"/>
                  </svg>
                );
              })()}
              {/* cast timer moved to fixed overlay below — see after battlefield flex centerer */}
              {/* Rune keys */}
              {qteAnim?.type==="sequence"&&qteAnim.seq&&(
                <div style={{position:"absolute",top:16,left:"50%",transform:"translateX(-50%)",display:"flex",gap:4,zIndex:9,flexWrap:"wrap",maxWidth:BFW-10,justifyContent:"center"}}>
                  {qteAnim.seq.map((k,i)=>{
                    const done=i<(qteAnim.input||[]).length;
                    const cur=i===(qteAnim.input||[]).length;
                    const bad=cur&&qteAnim.badKey;
                    const inputtedKey=(qteAnim.input||[])[i];
                    const wasCorrect=done&&inputtedKey===k;
                    const hue = (k.charCodeAt(0)*37)%360;
                    return (
                      <div key={i} style={{width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",
                        fontFamily:"Cinzel",fontWeight:700,fontSize:14,borderRadius:4,
                        border:`2px solid ${done?(wasCorrect?"#44ff8866":"#ff444466"):bad?"#ff3333":cur?`hsl(${hue},80%,65%)`:"#1e1e2e"}`,
                        color:done?(wasCorrect?"#44ff8844":"#ff444444"):bad?"#ff4444":cur?`hsl(${hue},90%,75%)`:"#2a2a3a",
                        background:done?(wasCorrect?"#0a1a0a":"#1a0808"):cur?"#0d0a1a":"#050510",
                        boxShadow:cur&&!bad?`0 0 16px hsl(${hue},80%,50%)88`:"none",
                        transform:cur?"scale(1.15)":"scale(1)",transition:"all .07s",
                        animation:cur?"runeIn .1s ease-out":"none"}}>
                        {done?(wasCorrect?"✓":"✗"):k}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ── MAGIC BOLT (fired after sequence completes) ── */}
              {qteAnim?.type==="magic_bolt"&&(()=>{
                const t   = qteAnim.t||0;
                const sx  = HR_L+HSW/2, sy = HR_T+HSH/2;
                const tx  = ENX, ty = eTop + eH*0.35;
                const bx  = sx + (tx-sx)*easeIO(t);
                const by  = sy + (ty-sy)*easeIO(t);
                const q   = qteAnim.q;
                const col = q==="perfect"?"#cc44ff":q==="good"?"#8844ff":"#444466";
                return (
                  <svg style={{position:"absolute",left:0,top:0,zIndex:12,pointerEvents:"none",overflow:"visible"}} width={BFW} height={BFH}>
                    {/* Trailing orbs */}
                    {[...Array(5)].map((_,i)=>{
                      const tp = Math.max(0,t-(i+1)*0.06);
                      const tx2 = sx+(tx-sx)*easeIO(tp), ty2 = sy+(ty-sy)*easeIO(tp);
                      return <circle key={i} cx={tx2} cy={ty2} r={8-i*1.2} fill={col} opacity={(1-i*0.18)*0.6}
                        style={{filter:`drop-shadow(0 0 ${6-i}px ${col})`}}/>;
                    })}
                    {/* Main bolt */}
                    <circle cx={bx} cy={by} r="10" fill={col} style={{filter:`drop-shadow(0 0 14px ${col})`}}/>
                    <circle cx={bx} cy={by} r="5"  fill="#fff" opacity=".85"/>
                    {/* Spiral rune rings around bolt */}
                    {[...Array(3)].map((_,i)=>{
                      const a = t*Math.PI*6+i*2.1;
                      const rx = bx+Math.cos(a)*(14+i*5), ry = by+Math.sin(a)*(14+i*5);
                      return <circle key={i} cx={rx} cy={ry} r="2.5" fill={col} opacity=".7"/>;
                    })}
                    {/* Impact burst at end */}
                    {t>0.85&&[...Array(10)].map((_,i)=>{
                      const a = i/10*Math.PI*2;
                      const r = (t-0.85)/0.15*20;
                      return <line key={i} x1={tx} y1={ty} x2={tx+Math.cos(a)*r} y2={ty+Math.sin(a)*r}
                        stroke={col} strokeWidth="2" opacity={(1-(t-0.85)/0.15)*0.9}/>;
                    })}
                  </svg>
                );
              })()}

              {/* ── SEQUENCE REVEAL (RPG): 2×5 grid, yellow outline jumps randomly ── */}
              {qteAnim?.type==="sequence_reveal"&&qteAnim.seq&&(
                <div style={{position:"absolute",top:12,left:"50%",transform:"translateX(-50%)",
                  display:"flex",flexDirection:"column",gap:7,zIndex:9,alignItems:"center"}}>
                  {/* Title */}
                  <div style={{fontFamily:"Cinzel",fontSize:10,letterSpacing:3,color:"#886644",
                    textShadow:"0 0 8px #886644",marginBottom:2}}>
                    🚀 RPG — PRESS THE GLOWING KEY
                  </div>
                  {/* 2 rows × 5 cols */}
                  {[0,1].map(row=>(
                    <div key={row} style={{display:"flex",gap:7}}>
                      {[0,1,2,3,4].map(col=>{
                        const i = row*5+col;
                        const k = qteAnim.seq[i];
                        const done = (qteAnim.doneIndices||[]).includes(i);
                        const cur  = i===qteAnim.targetIdx;
                        const bad  = cur&&qteAnim.badKey;
                        return (
                          <div key={i} style={{
                            width:44,height:44,display:"flex",alignItems:"center",justifyContent:"center",
                            fontFamily:"Cinzel",fontWeight:700,fontSize:19,borderRadius:8,
                            border:`2.5px solid ${done?"#1a1a24":cur?(bad?"#ff4422":"#ffdd00"):"#252535"}`,
                            color:done?"#1e1e28":cur?(bad?"#ff4422":"#ffee44"):"#44445a",
                            background:done?"#030306":cur?(bad?"#1a0606":"#1a1600"):"#06060e",
                            boxShadow:done?"none":cur&&!bad?"0 0 30px #ffdd0088, 0 0 12px #ffdd0055, inset 0 0 8px #ffdd0033":"none",
                            transform:cur&&!bad?"scale(1.22)":"scale(1)",
                            opacity:done?0.20:cur?1:0.50,
                            transition:"transform .07s, box-shadow .07s, border-color .07s",
                            animation:cur&&!bad?"runeIn .12s ease-out":"none",
                          }}>
                            {done?"✓":k}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                  {/* Miss / damage preview */}
                  <div style={{display:"flex",gap:14,marginTop:2,fontFamily:"Cinzel",fontSize:9,letterSpacing:1}}>
                    {(qteAnim.missCount||0)>0&&(
                      <span style={{color:"#ff4422",textShadow:"0 0 8px #ff4422"}}>
                        ✗ {qteAnim.missCount} MISS (-{(qteAnim.missCount||0)*5}%)
                      </span>
                    )}
                    <span style={{color:"#aaaacc"}}>
                      DMG: {Math.round(200*Math.max(0.30,1-(qteAnim.missCount||0)*0.05))}
                    </span>
                    <span style={{color:"#556677"}}>
                      {(qteAnim.doneIndices||[]).length}/10
                    </span>
                  </div>
                </div>
              )}

              {/* ── RPG ROCKET (fired after sequence_reveal) ── */}
              {qteAnim?.type==="rpg_rocket"&&(()=>{
                const t   = qteAnim.t||0;
                const sx  = HR_L+HSW/2, sy = HR_T+HSH/2;
                const tx  = ENX, ty = eTop+eH*0.45;
                const bx  = sx+(tx-sx)*easeIO(t);
                const by  = sy+(ty-sy)*easeIO(t);
                const ang = Math.atan2(ty-sy, tx-sx);
                const deg = ang*180/Math.PI;
                return (
                  <svg style={{position:"absolute",left:0,top:0,zIndex:12,pointerEvents:"none",overflow:"visible"}} width={BFW} height={BFH}>
                    {/* Smoke trail */}
                    {[...Array(7)].map((_,i)=>{
                      const tp=Math.max(0,t-(i+1)*0.055);
                      const tx2=sx+(tx-sx)*easeIO(tp), ty2=sy+(ty-sy)*easeIO(tp);
                      return <circle key={i} cx={tx2} cy={ty2} r={7-i*0.8} fill="#666666" opacity={(1-i*0.13)*0.28}/>;
                    })}
                    {/* Fire trail */}
                    {[...Array(5)].map((_,i)=>{
                      const tp=Math.max(0,t-(i+1)*0.035);
                      const tx2=sx+(tx-sx)*easeIO(tp), ty2=sy+(ty-sy)*easeIO(tp);
                      return <circle key={i} cx={tx2} cy={ty2} r={5-i*0.7} fill={i%2===0?"#ff4400":"#ffaa00"} opacity={(1-i*0.18)*0.75}/>;
                    })}
                    {/* Rocket body */}
                    <g transform={`translate(${bx},${by}) rotate(${deg})`}>
                      <rect x="-22" y="-5" width="30" height="10" rx="5" fill="#556677"/>
                      <rect x="-22" y="-5" width="30" height="5" rx="3" fill="#778899" opacity=".6"/>
                      <polygon points="8,-5 18,0 8,5" fill="#ff5522"/>
                      <polygon points="-22,-5 -30,0 -22,5" fill="#ff6600" opacity=".9"/>
                      <circle cx="-16" cy="0" r="3" fill="#334455"/>
                      <rect x="-8" y="-8" width="4" height="4" rx="1" fill="#ff2200" opacity=".8"/>
                    </g>
                    {/* Impact burst rings at t>0.78 */}
                    {t>0.78&&[...Array(14)].map((_,i)=>{
                      const a=i/14*Math.PI*2;
                      const r=(t-0.78)/0.22*40;
                      return <line key={i} x1={tx} y1={ty}
                        x2={tx+Math.cos(a)*r} y2={ty+Math.sin(a)*r}
                        stroke={i%3===0?"#ffcc00":i%3===1?"#ff4400":"#ff8800"}
                        strokeWidth="3" opacity={(1-(t-0.78)/0.22)*0.95}/>;
                    })}
                  </svg>
                );
              })()}

              {/* Enemy shadow on ground */}
              <ellipse cx={ENX} cy={GNDY+4} rx={eW*0.42} ry={5} fill="#000" opacity=".35"
                style={{position:"absolute"}} transform={`translate(0,0)`}/>
              <svg style={{position:"absolute",left:0,top:0,pointerEvents:"none",overflow:"visible",zIndex:3}} width={BFW} height={BFH}>
                <ellipse cx={ENX} cy={GNDY+4} rx={eW*0.42} ry={5} fill="#000" opacity=".35"/>
              </svg>

              {/* Enemy sprite — HeroSprite when PvP opponent */}
              <div style={{position:"absolute",left:eLeft,top:eTop,zIndex:4,
                filter:cs.enemy.id==="pvp_opp"
                  ?(enemyFlash?"brightness(3) drop-shadow(0 0 18px #ff4400)":"drop-shadow(0 0 14px #4466ffaa)")
                  :`drop-shadow(0 0 22px ${enemyData.color}bb) drop-shadow(0 8px 4px #00000088)`,
                animation:enemyFlash?`hitFlash .35s ease-out, squish .3s ease-out`:"none",
                transformOrigin:"bottom center",
                transform:cs.enemy.id==="dragon"?"scaleX(-1)":"none"}}>
                {cs.enemy.id==="pvp_opp"
                  ? <HeroSprite className={cs.enemy.pvpClass??'Knight'} scale={eScale} weapons={cs.enemy.pvpWeapons??['sword']}/>
                  : <EnemySpriteSmall id={cs.enemy.id} scale={eScale} sprite={cs?.enemySprite} enemyFlash={enemyFlash} phase={cs.phase} bossAttackPattern={cs?.bossAttackPattern}/>
                }
              </div>

              {/* ── ENEMY PROJECTILE (defend QTE) ── */}
              {qteAnim?.type==="defend"&&(qteAnim.projFrac||0)>0&&(qteAnim.projFrac||0)<1.05&&(()=>{
                const pf       = qteAnim.projFrac||0;
                const id       = cs.enemy.id;
                const projPath = qteAnim.projPath||"straight";
                const projType = qteAnim.projType||null; // set for PvP, null for regular enemies
                const heroMidX = (heroPos?heroPos.left:HR_L) + HSW/2;
                const heroMidY = (heroPos?heroPos.top:HR_T)  + HSH/2;
                const srcX = ENX, srcY = eTop + eH*0.35;

                // ── PvP: use per-QTE-type path and sprite ──
                if (projType) {
                  const { x: pvpX, y: pvpY } = pvpProjPos(projType, pf, srcX, srcY, heroMidX, heroMidY);
                  // Trail dots
                  const trailSteps = 6;
                  const trailDots = Array.from({length:trailSteps},(_,i)=>{
                    const tf = Math.max(0, pf - (i+1)*0.05);
                    return pvpProjPos(projType, tf, srcX, srcY, heroMidX, heroMidY);
                  });
                  return (
                    <svg style={{position:"absolute",left:0,top:0,zIndex:11,pointerEvents:"none",overflow:"visible"}} width={BFW} height={BFH}>
                      {trailDots.map((p,i)=>(
                        <circle key={i} cx={p.x} cy={p.y} r={4-i*0.5} fill="#4488ff" opacity={(1-i*0.15)*0.35}/>
                      ))}
                      {PvpProjectileSVG({ projType, cx:pvpX, cy:pvpY })}
                    </svg>
                  );
                }

                // Path offset helper — 0 at pf=0, 0 at pf=1, varies between
                const pathOff = (f) => {
                  const env = Math.sin(f * Math.PI); // envelope: 0→1→0
                  if (projPath === "loop") {
                    // Spiral loop: rotates 2.5 times, growing then shrinking
                    const angle = f * Math.PI * 5;
                    const r = env * 58;
                    return { ox: Math.sin(angle) * r, oy: -Math.abs(Math.cos(angle)) * r * 0.7 };
                  }
                  if (projPath === "bounce") {
                    // Bounces back toward enemy then lurches forward
                    const b = Math.sin(f * Math.PI * 3) * (1 - f) * 0.55;
                    return { ox: b * (srcX - heroMidX), oy: env * 12 };
                  }
                  if (projPath === "zigzag") {
                    // Snappy vertical zig-zag that calms near impact
                    return { ox: 0, oy: Math.sin(f * Math.PI * 7) * env * 36 };
                  }
                  if (projPath === "ground_rush") {
                    // Phase 1 (0–0.18): drop fast to ground level
                    // Phase 2 (0.18–0.75): roll along ground with small bounce + lateral wobble
                    // Phase 3 (0.75–1.0): surge sharply upward to hit hero
                    const lineY = srcY + (heroMidY - srcY) * f;
                    let targetY;
                    if (f < 0.18) {
                      targetY = srcY + (GNDY - srcY) * (f / 0.18);
                    } else if (f < 0.75) {
                      const t2 = (f - 0.18) / 0.57;
                      targetY = GNDY + Math.sin(t2 * Math.PI * 7) * 7; // small ground bounce
                    } else {
                      const t3 = (f - 0.75) / 0.25;
                      targetY = GNDY + (heroMidY - GNDY) * (t3 * t3); // ease-in surge
                    }
                    const wobble = f > 0.15 && f < 0.78
                      ? Math.sin(f * Math.PI * 14) * (1 - f * 0.9) * 12 : 0;
                    return { ox: wobble, oy: targetY - lineY };
                  }
                  return { ox: 0, oy: 0 }; // straight
                };

                // Position at any pf value (used for trail particles too)
                const posAt = (f) => {
                  const { ox, oy } = pathOff(f);
                  return {
                    x: srcX + (heroMidX - srcX) * easeIO(f) + ox,
                    y: srcY + (heroMidY - srcY) * easeIO(f) + oy,
                  };
                };

                const { x: projX, y: projY } = posAt(pf);
                const spin = pf * 720;

                return (
                  <svg style={{position:"absolute",left:0,top:0,zIndex:11,pointerEvents:"none",overflow:"visible"}} width={BFW} height={BFH}>
                    {/* Path trail for loop/zigzag/ground_rush so player can read the trajectory */}
                    {projPath !== "straight" && projPath !== "bounce" && (()=>{
                      const steps = 18;
                      const pts = Array.from({length:steps+1},(_,i)=>posAt(pf*(i/steps)));
                      const trailCol = id==="dragon"
                        ? (qteAnim?.bossAttackPattern==="charge" ? "#22dd4444" : "#ff660033")
                        : id==="eye" ? "#9900cc33" : "#4488ff22";
                      return <polyline points={pts.map(p=>`${p.x},${p.y}`).join(" ")}
                        fill="none" stroke={trailCol}
                        strokeWidth={projPath==="ground_rush"?3:2} strokeDasharray="4 5" opacity=".6"/>;
                    })()}

                    {id==="goblin"&&(
                      <g transform={`translate(${projX},${projY})`}>
                        <circle r="7" fill="#7a6040" stroke="#aa8855" strokeWidth="1.5"/>
                        <circle r="3" cx="2" cy="-2" fill="#5a4030" opacity=".6"/>
                        <ellipse rx="7" ry="3" fill="none" stroke="#aa885544" strokeWidth="1" transform={`rotate(${spin})`}/>
                        {/* Bounce path dots */}
                        {[0.25,0.5,0.75].map((f,i)=>{
                          const {x,y}=posAt(f); return <circle key={i} cx={x-projX} cy={y-projY} r="2" fill="#aa885533" opacity=".5"/>;
                        })}
                      </g>
                    )}
                    {id==="skeleton"&&(
                      <g transform={`translate(${projX},${projY}) rotate(${spin})`}>
                        <line x1="-12" y1="0" x2="12" y2="0" stroke="#ddddc8" strokeWidth="4" strokeLinecap="round"/>
                        <circle cx="-12" cy="0" r="5" fill="#ddddc8"/>
                        <circle cx="12"  cy="0" r="5" fill="#ddddc8"/>
                        <circle cx="-12" cy="0" r="2" fill="#aaa"/>
                        <circle cx="12"  cy="0" r="2" fill="#aaa"/>
                      </g>
                    )}
                    {id==="eye"&&(
                      <>
                        {/* Loop trail */}
                        {[0.14,0.09,0.05].map((lag,i)=>{
                          const {x,y}=posAt(Math.max(0,pf-lag));
                          return <circle key={i} cx={x} cy={y} r={5-i*1.5} fill="#9900cc" opacity={0.3-i*0.08}/>;
                        })}
                        <circle cx={projX} cy={projY} r={9+Math.sin(pf*20)*2} fill="#7700bb"
                          style={{filter:"drop-shadow(0 0 14px #cc00ff)"}}/>
                        <circle cx={projX} cy={projY} r="4" fill="#ff44ff" opacity=".9"/>
                        <circle cx={projX-2} cy={projY-2} r="1.5" fill="#fff" opacity=".7"/>
                        {[0,1,2,3].map(i=>{
                          const a=pf*Math.PI*4+i*Math.PI/2;
                          return <circle key={i} cx={projX+Math.cos(a)*14} cy={projY+Math.sin(a)*14}
                            r="2.5" fill="#9900cc" opacity=".6"/>;
                        })}
                      </>
                    )}
                    {id==="golem"&&(
                      <g transform={`translate(${projX},${projY+4})`}>
                        <circle r="13" fill="#7a5a3a" stroke="#5a3a1a" strokeWidth="2"/>
                        <circle r="10" fill="#8a6a4a"/>
                        <line x1="-4" y1="-6" x2="2"  y2="2"  stroke="#5a3a1a" strokeWidth="1.5"/>
                        <line x1="3"  y1="-4" x2="-2" y2="5"  stroke="#5a3a1a" strokeWidth="1.5"/>
                        <line x1="-7" y1="2"  x2="6"  y2="4"  stroke="#5a3a1a" strokeWidth="1"/>
                        <ellipse cx="0" cy="13" rx={13*(1-pf*0.3)} ry="3" fill="#00000033"/>
                      </g>
                    )}
                    {id==="wraith"&&(
                      <>
                        {[0.18,0.12,0.06].map((lag,i)=>{
                          const {x,y}=posAt(Math.max(0,pf-lag));
                          return <circle key={i} cx={x} cy={y} r={7-i*2}
                            fill="#2244dd" opacity={0.35-i*0.08}
                            style={{filter:"blur(2px)"}}/>;
                        })}
                        <circle cx={projX} cy={projY} r="9" fill="#3355ee" opacity=".85"
                          style={{filter:"drop-shadow(0 0 14px #88aaff)"}}/>
                        <circle cx={projX} cy={projY} r="4" fill="#88ccff"/>
                        <circle cx={projX-2} cy={projY-2} r="1.5" fill="#fff" opacity=".8"/>
                      </>
                    )}
                    {/* Dragon — CLEAVE: looping fireball orb */}
                    {id==="dragon"&&qteAnim?.bossAttackPattern!=="charge"&&(
                      <>
                        {[0.1,0.06,0.02].map((lag,i)=>{
                          const {x,y}=posAt(Math.max(0,pf-lag));
                          const r=14-i*3;
                          return <circle key={i} cx={x} cy={y} r={r}
                            fill={i===0?"#ff6600":i===1?"#ff9900":"#ffcc00"}
                            opacity={1-i*0.2}
                            style={{filter:i===0?"drop-shadow(0 0 16px #ff4400)":"none"}}/>;
                        })}
                        <circle cx={projX} cy={projY} r="6" fill="#fff" opacity=".8"/>
                      </>
                    )}
                    {/* Dragon — CHARGE: fast flat rolling slime blob */}
                    {id==="dragon"&&qteAnim?.bossAttackPattern==="charge"&&(
                      <>
                        {/* Slime smear trail */}
                        {[0.13,0.08,0.04].map((lag,i)=>{
                          const {x,y}=posAt(Math.max(0,pf-lag));
                          return <ellipse key={i} cx={x} cy={y} rx={11-i*2.5} ry={5-i}
                            fill={i===0?"#33ee55":i===1?"#22cc44":"#11aa33"}
                            opacity={0.55-i*0.15}/>;
                        })}
                        {/* Main blob — squished ellipse */}
                        <ellipse cx={projX} cy={projY} rx={16} ry={9}
                          fill="#33ee55" stroke="#66ff88" strokeWidth="1.5"
                          style={{filter:"drop-shadow(0 0 14px #00ff5577)"}}/>
                        {/* Angry eyes */}
                        <circle cx={projX+5} cy={projY-2} r={2.2} fill="#004411"/>
                        <circle cx={projX-3} cy={projY-2} r={2.2} fill="#004411"/>
                        {/* Slime splash drops trailing behind during ground phase */}
                        {pf>0.18&&pf<0.78&&[-13,-8,-18].map((dx,i)=>(
                          <ellipse key={i} cx={projX+dx} cy={projY+5} rx={3-i*0.4} ry={2}
                            fill="#22bb44" opacity={0.45-i*0.1}/>
                        ))}
                      </>
                    )}
                  </svg>
                );
              })()}

              {/* ── DEFEND: block hint pill ── */}
              {qteAnim?.type==="defend"&&(()=>{
                const pf     = qteAnim.projFrac||0;
                const t      = qteAnim.t||0;
                const arrive = qteAnim.arrive||0.82;
                if (pf<=0 || t>arrive+0.06) return null;
                const near    = pf>0.82;
                const isCharge = qteAnim.bossAttackPattern==="charge";
                const nearCol  = isCharge ? "#44ff88" : "#44ccff";
                const nearGlow = isCharge ? "0 0 12px #22ff66" : "0 0 12px #44aaff";
                const nearBdr  = isCharge ? "#22ff6655" : "#44aaff55";
                return (
                  <div style={{position:"absolute",left:"50%",bottom:36,transform:"translateX(-50%)",
                    zIndex:30,pointerEvents:"none",
                    fontFamily:"Cinzel",fontSize:10,fontWeight:700,letterSpacing:3,
                    color:near?nearCol:"#e8d5a3aa",
                    background:"rgba(0,0,0,.55)",borderRadius:20,padding:"4px 14px",
                    border:`1px solid ${near?nearBdr:"#ffffff12"}`,
                    textShadow:near?nearGlow:"none",
                    animation:near?"pulse .2s ease-in-out infinite":"none",
                    whiteSpace:"nowrap"}}>
                    {isCharge ? "DODGE THE RUSH!" : "TIME THE BLOCK!"}
                  </div>
                );
              })()}

              {/* Stomp instruction prompt */}
              {qteAnim?.type==="stomp"&&(()=>{
                const t = qteAnim.t||0;
                const bounce = qteAnim.bounce||0;
                // For contact 0: show prompt right away; for bounce: show after hero launches
                const visible = bounce===0 ? t<0.94 : t>0.08&&t<0.94;
                // Pulse brighter in the final 20% (about to land at t=1)
                const nearLand = t>0.80;
                const col = nearLand?"#ffcc44":"#e8d5a3";
                const glow = nearLand?"0 0 18px #ffcc44":"0 0 8px #00000088";
                if(!visible) return null;
                return (
                  <div style={{
                    position:"absolute",
                    left:BFW/2, top: BFH-36,
                    transform:"translateX(-50%)",
                    zIndex:30, pointerEvents:"none",
                    textAlign:"center",
                    animation: nearLand?"pulse .25s ease-in-out infinite":"none",
                  }}>
                    <div style={{
                      fontFamily:"Cinzel", fontSize:11, fontWeight:700,
                      letterSpacing:3, color:col,
                      textShadow:glow,
                      background:"rgba(0,0,0,.55)", borderRadius:5,
                      padding:"4px 12px",
                      border:`1px solid ${nearLand?"#ffcc4466":"#ffffff18"}`,
                    }}>
                      PRESS [SPACE] ON LANDING
                    </div>
                  </div>
                );
              })()}

              {/* Stomp dust */}
              {showDust&&(
                <div style={{position:"absolute",left:ENX-30,top:eTop+eH-20,width:60,height:24,borderRadius:"50%",border:"2px solid #ffaa3388",animation:"stompDust .4s ease-out forwards",zIndex:8,pointerEvents:"none"}}/>
              )}

              {/* Hero sprite */}
              <div style={{position:"absolute",
                left:heroPos?heroPos.left:HR_L,
                top:heroPos?heroPos.top:HR_T,
                zIndex:6,
                transform:"scaleX(-1)",
                animation:"none",
                filter:qteAnim?.type==="defend"?"drop-shadow(0 0 10px #4488ff)":
                       chargeActive&&cIsPerfect?"drop-shadow(0 0 14px #44ff88)":"none"}}>
                <HeroSprite className={player.class} scale={0.85} weapons={player.weapons||[]} heroLooks={player?.heroLooks} isAttacking={cs?.phase==="attacking"}/>
              </div>

              {/* Battlefield status line */}
              <div style={{position:"absolute",top:qteAnim?.type==="swing_beat"||qteAnim?.type==="hold_release"||qteAnim?.type==="poke"?50:qteAnim?.type==="sequence"?30:10,left:"50%",transform:"translateX(-50%)",fontFamily:"Cinzel",fontSize:10,letterSpacing:3,zIndex:9,whiteSpace:"nowrap"}}>
                {qteAnim?.type==="rapid_tap"  ? <span style={{color:"#ff8844",animation:"pulse .15s ease-in-out infinite",fontWeight:700}}>MASH [SPACE]</span>
                :cs.phase==="enemy_turn"      ? <span style={{opacity:.25,fontSize:9}}>ENEMY INCOMING</span>
                :cs.phase==="won"             ? <span style={{color:"#44ff88",animation:"glow 1.5s infinite"}}>VICTORY!</span>
                :cs.phase==="action"          ? <span style={{opacity:.35}}>CHOOSE YOUR ATTACK</span>
                :null}
              </div>

              {/* ── HP BARS — overlaid on battlefield above each combatant ── */}
              {(()=>{
                const eHp    = cs.pvpMode ? pvpOppHp : cs.enemy.hp;
                const eMaxHp = cs.pvpMode ? pvpMaxHp : cs.enemy.maxHp;
                const ePct   = Math.max(0, Math.min(100, eHp / Math.max(1,eMaxHp) * 100));
                const eCol   = ePct<30?"#ff4444":ePct<60?"#ffcc44":enemyData.color||"#cc4444";
                const pPct   = Math.max(0, Math.min(100, player.hp / Math.max(1,player.maxHp) * 100));
                const pCol   = pPct<30?"#ff4444":pPct<60?"#ffcc44":"#44dd88";
                const barH   = 7;
                const barW   = 130;
                return (
                  <>
                    {/* Enemy HP bar — above enemy sprite */}
                    <div style={{position:"absolute",left:ENX-barW/2,top:Math.max(4,eTop-28),
                      width:barW,zIndex:10,pointerEvents:"none"}}>
                      <div style={{display:"flex",justifyContent:"space-between",
                        fontFamily:"Cinzel",fontSize:7,letterSpacing:.5,marginBottom:2,color:eCol,
                        textShadow:`0 0 6px ${eCol}88`}}>
                        <span style={{opacity:.8}}>{cs.enemy.name}</span>
                        <span>{eHp}/{eMaxHp}</span>
                      </div>
                      <div style={{height:barH,background:"#0a0a14",border:"1px solid #2a2a3a",borderRadius:3,overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${ePct}%`,borderRadius:3,
                          background:`linear-gradient(to right,${eCol}99,${eCol})`,
                          boxShadow:`0 0 6px ${eCol}66`,transition:"width .35s"}}/>
                      </div>
                    </div>
                    {/* Player HP bar — above hero sprite */}
                    <div style={{position:"absolute",left:HRX-barW/2,top:Math.max(4,HR_T-28),
                      width:barW,zIndex:10,pointerEvents:"none"}}>
                      <div style={{display:"flex",justifyContent:"space-between",
                        fontFamily:"Cinzel",fontSize:7,letterSpacing:.5,marginBottom:2,color:pCol,
                        textShadow:`0 0 6px ${pCol}88`}}>
                        <span style={{opacity:.8}}>{player.class}</span>
                        <span>{player.hp}/{player.maxHp}</span>
                      </div>
                      <div style={{height:barH,background:"#0a0a14",border:"1px solid #2a2a3a",borderRadius:3,overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${pPct}%`,borderRadius:3,
                          background:`linear-gradient(to right,${pCol}99,${pCol})`,
                          boxShadow:`0 0 6px ${pCol}66`,transition:"width .35s"}}/>
                      </div>
                    </div>
                  </>
                );
              })()}
              {/* ── Action log — top-left corner, one line only ── */}
              {cs.log.length>0&&(
                <div style={{position:"absolute",top:4,left:4,maxWidth:140,zIndex:20,pointerEvents:"none"}}>
                  <div style={{fontSize:7,lineHeight:1.3,letterSpacing:.3,
                    color:"#d4c89a",opacity:.6,textShadow:"0 1px 3px #000",
                    whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                    {cs.log[cs.log.length-1]}
                  </div>
                </div>
              )}

              {/* particles injected via particleContainerRef (DOM/Web Animations API) */}

            </div>{/* ─── END BATTLEFIELD (zoom wrapper) ── */}
            </div>{/* ─── END BATTLEFIELD (flex centerer) ── */}

            {/* ── BEAT TIMER — fixed overlay ── */}
            {qteAnim?.type==="swing_beat"&&(()=>{
              const now2         = performance.now();
              const qteOpenMs2   = qteAnim.qteOpenMs;
              const comboStart2  = qteAnim.comboStartMs;
              const countdownMs2 = qteOpenMs2&&!comboStart2 ? Math.max(0, BEAT_TIMEOUT-(now2-qteOpenMs2)) : null;
              const comboMs2     = comboStart2 ? (now2-comboStart2) : null;
              if (!qteOpenMs2) return null; // walk-up phase — no timer yet
              if (countdownMs2!=null) {
                const frac2   = countdownMs2/BEAT_TIMEOUT;
                const danger2 = countdownMs2<600;
                const col2    = danger2?"#ff3333":countdownMs2<1000?"#ffaa22":"#4499ff";
                return (
                  <div style={{position:"fixed",top:52,left:"50%",transform:"translateX(-50%)",
                    width:"min(380px,72vw)",zIndex:3000,pointerEvents:"none"}}>
                    <div style={{height:12,background:"#04040c",borderRadius:6,
                      border:`2px solid ${col2}99`,overflow:"hidden",
                      boxShadow:danger2?`0 0 20px ${col2}99`:`0 0 8px ${col2}44`}}>
                      <div style={{height:"100%",width:`${frac2*100}%`,borderRadius:6,
                        background:`linear-gradient(to right,${col2}bb,${col2})`,
                        boxShadow:`0 0 10px ${col2}`,transition:"background-color .2s",
                        animation:danger2?"beatBar .25s ease-in-out infinite alternate":"none"}}/>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",marginTop:3,
                      fontFamily:"Cinzel",fontSize:10,fontWeight:700,letterSpacing:1.5,color:col2,opacity:.9}}>
                      <span>BEAT WINDOW</span>
                      <span style={{fontSize:13,textShadow:danger2?`0 0 12px ${col2}`:"none",
                        animation:danger2?"pulse .25s infinite":"none"}}>{(countdownMs2/1000).toFixed(2)}s</span>
                    </div>
                  </div>
                );
              }
              if (comboMs2!=null) {
                const MAX2  = 600;
                const frac2 = Math.min(1, comboMs2/MAX2);
                const mult2 = Math.max(0.20, 1.75*Math.pow(0.85, comboMs2/25));
                const col2  = mult2>1.4?"#44ff88":mult2>0.8?"#ffcc44":"#ff6644";
                return (
                  <div style={{position:"fixed",top:52,left:"50%",transform:"translateX(-50%)",
                    width:"min(380px,72vw)",zIndex:3000,pointerEvents:"none"}}>
                    <div style={{height:12,background:"#04040c",borderRadius:6,
                      border:`2px solid ${col2}99`,overflow:"hidden",
                      boxShadow:`0 0 12px ${col2}55`}}>
                      <div style={{height:"100%",width:`${frac2*100}%`,borderRadius:6,
                        background:`linear-gradient(to right,#44ff8877,${col2})`,
                        boxShadow:`0 0 10px ${col2}`}}/>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",marginTop:3,
                      fontFamily:"Cinzel",fontSize:10,fontWeight:700,letterSpacing:1.5,opacity:.9}}>
                      <span style={{color:col2}}>×{mult2.toFixed(2)} DMG</span>
                      <span style={{color:"#8888aa"}}>{comboMs2.toFixed(0)}ms</span>
                    </div>
                  </div>
                );
              }
              return null;
            })()}

            {/* ── CAST/LAUNCH TIMER — numeric ms countdown, position:fixed ── */}
            {(qteAnim?.type==="sequence"||qteAnim?.type==="sequence_reveal")&&castStartRef.current&&(()=>{
              const elapsed   = performance.now() - castStartRef.current;
              const remaining = Math.max(0, SEQ_DUR - elapsed);
              const remSec    = Math.floor(remaining / 1000);
              const remMsPart = Math.floor(remaining % 1000);
              const danger    = remaining < SEQ_DUR * 0.35;
              const warn      = remaining < SEQ_DUR * 0.60;
              const col       = danger ? "#ff3333" : warn ? "#ffaa22" : "#aa44ff";
              return (
                <div style={{position:"fixed",top:46,left:"50%",transform:"translateX(-50%)",
                  zIndex:3000,pointerEvents:"none",textAlign:"center",
                  fontFamily:"Cinzel",fontWeight:900,letterSpacing:1,
                  color:col,fontVariantNumeric:"tabular-nums",
                  textShadow:`0 0 24px ${col}bb, 0 0 60px ${col}44`,
                  animation:danger?"pulse .25s infinite":"none",
                  display:"flex",alignItems:"baseline",gap:2}}>
                  <span style={{fontSize:64}}>{remSec}</span>
                  <span style={{fontSize:36,opacity:.75}}>.</span>
                  <span style={{fontSize:36}}>{String(remMsPart).padStart(3,"0")}</span>
                </div>
              );
            })()}

            {/* ── Perfect Parry screen flash overlay ── */}
            {parryFlash&&(
              <>
                <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999,
                  background:"radial-gradient(ellipse at 50% 50%, #88ccff 0%, #2255aa 40%, transparent 75%)",
                  animation:"parryFlash .9s ease-out forwards"}}/>
                <div style={{position:"fixed",left:"50%",top:"40%",pointerEvents:"none",zIndex:10000,
                  fontFamily:"Cinzel",fontWeight:900,fontSize:48,letterSpacing:8,
                  color:"#ffffff",textShadow:"0 0 30px #44aaff, 0 0 80px #0088ff, 0 0 120px #0044ff",
                  animation:"parryText .9s ease-out forwards",whiteSpace:"nowrap"}}>
                  ⚡ PERFECT PARRY ⚡
                </div>
              </>
            )}

            {/* bottom bar removed — actions now in fixed side panel */}

          </div>
        );
      })()}

      {/* ══ REWARD ══ */}
      {screen==="reward"&&rewards&&player&&(
        <div style={{height:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:40,animation:"fadeIn .4s"}}>
          <div style={{marginBottom:14,animation:"float 2s infinite"}}><Icon type="combat" size={56} color="#ffcc44"/></div>
          <h2 style={{fontFamily:"Cinzel",fontSize:30,letterSpacing:5,color:"#ffcc44",marginBottom:6}}>SPOILS OF BATTLE</h2>
          <p style={{opacity:.4,marginBottom:44,letterSpacing:2,fontStyle:"italic"}}>Choose one reward to carry forward</p>
          <div style={{display:"flex",gap:20,flexWrap:"wrap",justifyContent:"center"}}>
            {rewards.map((r,i)=>{
              const wD=r.type==="weapon"?ALL_WEAPONS[r.weaponId]:null;
              const isPotion = r.type==="potion";
              const baseBorder = isPotion?"1px solid #7733aa":"1px solid #2a2a3a";
              const baseBg     = isPotion?"#0d0818":"#08080f";
              const hoverBorder= isPotion?"1px solid #cc66ff":"1px solid #e8d5a388";
              const hoverBg    = isPotion?"#180830":"#10101e";
              return (
                <div key={i} onClick={()=>applyReward(r)}
                  style={{width:200,padding:"22px 20px 24px",textAlign:"center",cursor:"pointer",
                    border:baseBorder,background:baseBg,transition:"all .2s",borderRadius:4,
                    boxShadow:isPotion?"0 0 18px #7733aa66":"none"}}
                  onMouseEnter={e=>{e.currentTarget.style.border=hoverBorder;e.currentTarget.style.background=hoverBg;e.currentTarget.style.boxShadow=isPotion?"0 0 30px #aa44ff88":"0 0 14px #e8d5a322";}}
                  onMouseLeave={e=>{e.currentTarget.style.border=baseBorder;e.currentTarget.style.background=baseBg;e.currentTarget.style.boxShadow=isPotion?"0 0 18px #7733aa66":"none";}}>
                  {isPotion&&(
                    <div style={{fontFamily:"Cinzel",fontSize:9,letterSpacing:3,color:"#cc88ff",
                      background:"#2a0844",padding:"2px 8px",borderRadius:2,
                      display:"inline-block",marginBottom:10,border:"1px solid #7733aa66"}}>
                      POTION
                    </div>
                  )}
                  <div style={{width:60,height:60,margin:"0 auto 12px",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <Icon type={r.type==="weapon"?r.weaponId:r.type==="potion"?r.potion?.id:r.id==="hp15"?"heal_vial":r.id==="hp30"?"heal_potion":r.id==="str1"?"str_shard":"hp_shard"} size={56}/>
                  </div>
                  <div style={{fontFamily:"Cinzel",fontSize:15,marginBottom:8,letterSpacing:1,
                    color:isPotion?"#dd99ff":"#e8d5a3"}}>{r.label}</div>
                  <div style={{fontSize:12,opacity:.6,lineHeight:1.5,color:isPotion?"#bb88ee":"inherit"}}>
                    {wD?`${wD.name} (${wD.baseDmg} ATK · ${QTE_LABEL[wD.qteType]})`:r.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══ GAME OVER ══ */}
      {screen==="gameover"&&(
        <div style={{height:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#000",animation:"fadeIn .6s"}}>
          <div style={{marginBottom:20,filter:"drop-shadow(0 0 20px #cc2222)"}}><Icon type="combat" size={80} color="#cc2222"/></div>
          <h1 style={{color:"#cc2222",fontSize:"clamp(36px,7vw,64px)",fontFamily:"Cinzel",letterSpacing:6,textShadow:"0 0 40px #cc2222",marginBottom:10}}>YOU PERISHED</h1>
          <p style={{opacity:.4,marginBottom:16,fontStyle:"italic",letterSpacing:2}}>The Spire claims another soul…</p>
          {player&&<p style={{fontFamily:"Cinzel",fontSize:12,opacity:.3,marginBottom:12,letterSpacing:2}}>{player.class} · Level {player.level} · Floor {player.floor}</p>}
          {(finalTime||timerDisplay)&&<div style={{fontFamily:"Cinzel",fontSize:22,color:"#cc4444",letterSpacing:4,marginBottom:40,textShadow:"0 0 20px #cc2222",fontVariantNumeric:"tabular-nums"}}>⏱ {finalTime||timerDisplay}</div>}
          <button className="btn" style={{fontSize:16,padding:"14px 44px",letterSpacing:5}} onClick={()=>window.location.reload()}>TRY AGAIN</button>
        </div>
      )}

      {/* ══ VICTORY ══ */}
      {screen==="victory"&&(
        <div style={{height:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",animation:"fadeIn .6s"}}>
          <div style={{marginBottom:20,animation:"float 2s infinite",filter:"drop-shadow(0 0 30px gold)"}}><Icon type="boss" size={80} color="#ffcc44"/></div>
          <h1 style={{fontFamily:"Cinzel",fontSize:"clamp(32px,7vw,60px)",color:"#ffcc44",letterSpacing:6,animation:"glow 2s infinite",marginBottom:10}}>VICTORIOUS!</h1>
          <p style={{opacity:.5,marginBottom:10,fontStyle:"italic",letterSpacing:2}}>The Demon Slime is vanquished. The Spire is yours.</p>
          {player&&<p style={{fontFamily:"Cinzel",fontSize:12,opacity:.35,marginBottom:10,letterSpacing:2}}>Lv.{player.level} {player.class} · {player.xp} XP</p>}
          {(finalTime||timerDisplay)&&<div style={{fontFamily:"Cinzel",fontSize:28,color:"#ffcc44",letterSpacing:4,marginBottom:44,textShadow:"0 0 24px #ffcc44",fontVariantNumeric:"tabular-nums",animation:"glow 2s infinite"}}>⏱ {finalTime||timerDisplay}</div>}
          <button className="btn" style={{fontSize:16,padding:"14px 44px",letterSpacing:5}} onClick={()=>window.location.reload()}>PLAY AGAIN</button>
        </div>
      )}

      {/* ══ PVP WAIT — killed dragon, waiting for opponent ══ */}
      {screen==="pvp_wait"&&(
        <div style={{height:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",animation:"fadeIn .5s",background:"radial-gradient(ellipse at 50% 40%,#1a0a00,#020205)"}}>
          <div style={{marginBottom:24,animation:"float 2s ease-in-out infinite",filter:"drop-shadow(0 0 30px #ff4400)"}}>
            <Icon type="boss" size={80} color="#ff6600"/>
          </div>
          <h1 style={{fontFamily:"Cinzel",fontWeight:900,fontSize:"clamp(28px,5vw,52px)",letterSpacing:8,color:"#ff6600",textShadow:"0 0 40px #ff4400",animation:"glow 2s infinite",marginBottom:10}}>
            {iWonRace?"🏆 SLIME SLAIN FIRST!":"💀 DEMON DEFEATED"}
          </h1>
          <p style={{fontFamily:"IM Fell English",fontStyle:"italic",opacity:.5,fontSize:16,marginBottom:30,letterSpacing:3}}>
            {iWonRace
              ? "You won the race. Waiting for your rival to finish..."
              : "You got the RPG. Now take down the winner."}
          </p>
          {/* Opponent progress while waiting */}
          {oppSnap&&(
            <div style={{background:"#0a0814",border:"1px solid #4466ff44",borderRadius:10,padding:"16px 28px",marginBottom:30,minWidth:260}}>
              <div style={{fontFamily:"Cinzel",fontSize:11,letterSpacing:3,color:"#4466ff",marginBottom:12,textAlign:"center"}}>
                ⚔ RIVAL: {(oppSnap.name||"?").toUpperCase()}
              </div>
              {oppSnap.dragonKilled
                ? <div style={{fontFamily:"Cinzel",fontSize:14,color:"#ff4422",textShadow:"0 0 12px #ff4422",textAlign:"center",animation:"pulse .6s infinite"}}>🟢 SLIME SLAIN — HEADING TO FIGHT!</div>
                : <>
                    <div style={{fontFamily:"Cinzel",fontSize:9,color:"#555577",letterSpacing:2,marginBottom:4}}>FLOOR {oppSnap.floor}/{FLOOR_CONFIGS.length}</div>
                    <div style={{height:6,background:"#111122",borderRadius:3,marginBottom:10}}>
                      <div style={{height:"100%",background:"#4466ff",borderRadius:3,boxShadow:"0 0 8px #4466ff",
                        width:`${Math.min(100,(oppSnap.floor/FLOOR_CONFIGS.length)*100)}%`,transition:"width .8s"}}/>
                    </div>
                    <div style={{fontFamily:"Cinzel",fontSize:9,color:"#555577",letterSpacing:2,marginBottom:4}}>HP {oppSnap.hp}/{oppSnap.maxHp}</div>
                    <div style={{height:6,background:"#111122",borderRadius:3}}>
                      <div style={{height:"100%",borderRadius:3,background:oppSnap.hp<oppSnap.maxHp*.3?"#ff4444":oppSnap.hp<oppSnap.maxHp*.6?"#ffcc44":"#44dd66",
                        width:`${Math.min(100,(oppSnap.hp/Math.max(1,oppSnap.maxHp))*100)}%`,transition:"width .8s"}}/>
                    </div>
                  </>
              }
            </div>
          )}
          {!oppSnap&&(
            <p style={{fontFamily:"Cinzel",fontSize:10,color:"#4466ff",letterSpacing:2,animation:"pulse .8s infinite",marginBottom:30}}>
              CONNECTING TO OPPONENT…
            </p>
          )}
          <p style={{fontFamily:"Cinzel",fontSize:9,opacity:.25,letterSpacing:2}}>PVP ARENA LOADING ONCE RIVAL IS READY</p>
        </div>
      )}

      {/* pvp screen = combat screen + fixed overlays above — see pvpMode overlays */}
      {screen==="pvp_unused"&&player&&(()=>{
        const myWeaponObj = player.weapons?.includes("rpg") ? ALL_WEAPONS.rpg : ALL_WEAPONS[player.weapons?.[0]] ?? ALL_WEAPONS.sword;
        const oppWeaponObj = iWonRace ? (ALL_WEAPONS[oppSnap?.weapon] ?? ALL_WEAPONS.sword) : ALL_WEAPONS.rpg;
        const oppName = oppSnap?.name ?? "RIVAL";
        const myHpPct  = Math.max(0, pvpMyHp  / pvpMaxHp * 100);
        const oppHpPct = Math.max(0, pvpOppHp / pvpMaxHp * 100);
        const isMyTurn = pvpTurn === "mine" && !pvpWinner;
        const isTheirTurn = pvpTurn === "theirs" && !pvpWinner;

        const doAttack = () => {
          if (!isMyTurn || qteAnim) return;
          pvpAtkCbRef.current = pvpOnAttackDone;
          pvpModeRef.current = true;
          const startQTE = {
            swing_beat:  ()=>startSwingBeatQTE(myWeaponObj),
            hold_release:()=>startChargeQTE(myWeaponObj),
            rapid_tap:   ()=>startRapidTapQTE(myWeaponObj),
            sequence:    ()=>startSequenceQTE(myWeaponObj),
            stomp:       ()=>startStompQTE(myWeaponObj),
            poke:        ()=>startPokeQTE(myWeaponObj),
            archery:     ()=>startArcheryQTE(myWeaponObj),
            sequence_reveal: ()=>startRPGQTE(myWeaponObj),
          }[myWeaponObj.qteType] || (()=>startSwingBeatQTE(myWeaponObj));
          startQTE();
        };

        return (
          <div style={{height:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
            background:"radial-gradient(ellipse at 50% 30%,#1a0818 0%,#06040e 70%)",animation:"fadeIn .4s",position:"relative",overflow:"hidden"}}>
            {/* Background particle field */}
            {particles.map((p,i)=><div key={i} style={{position:"absolute",left:p.left,top:p.top,width:p.size,height:p.size,background:"#4466ff",borderRadius:"50%",opacity:p.opacity*.8,animation:`pulse ${p.dur} ${p.delay} infinite`}}/>)}

            {/* Title */}
            <div style={{fontFamily:"Cinzel",fontWeight:900,fontSize:"clamp(18px,3vw,28px)",letterSpacing:8,
              color:"#ff4400",textShadow:"0 0 30px #ff4400",marginBottom:20,zIndex:1}}>
              ⚔ FINAL SHOWDOWN ⚔
            </div>

            {/* HP bars */}
            <div style={{display:"flex",gap:40,alignItems:"center",marginBottom:18,zIndex:1,width:"min(700px,90vw)"}}>
              {/* My HP */}
              <div style={{flex:1}}>
                <div style={{fontFamily:"Cinzel",fontSize:9,letterSpacing:2,color:"#44dd66",marginBottom:4}}>
                  YOU · {myWeaponObj.emoji} {myWeaponObj.name}
                </div>
                <div style={{height:12,background:"#0a1a0a",borderRadius:6,border:"1px solid #22441a"}}>
                  <div style={{height:"100%",borderRadius:6,transition:"width .4s",
                    background:pvpMyHp<pvpMaxHp*.3?"#ff4444":pvpMyHp<pvpMaxHp*.6?"#ffcc44":"#44dd66",
                    width:`${myHpPct}%`,boxShadow:`0 0 10px ${pvpMyHp<pvpMaxHp*.3?"#ff4444":"#44dd66"}`}}/>
                </div>
                <div style={{fontFamily:"Cinzel",fontSize:10,color:"#44dd66",marginTop:2}}>{pvpMyHp}/{pvpMaxHp}</div>
              </div>
              <div style={{fontFamily:"Cinzel",fontSize:20,color:"#ff4400",textShadow:"0 0 12px #ff4400"}}>VS</div>
              {/* Opponent HP */}
              <div style={{flex:1,textAlign:"right"}}>
                <div style={{fontFamily:"Cinzel",fontSize:9,letterSpacing:2,color:"#ff6644",marginBottom:4}}>
                  {oppWeaponObj.emoji} {oppWeaponObj.name} · {oppName.toUpperCase()}
                </div>
                <div style={{height:12,background:"#1a0a0a",borderRadius:6,border:"1px solid #441a1a"}}>
                  <div style={{height:"100%",borderRadius:6,transition:"width .4s",marginLeft:"auto",
                    background:pvpOppHp<pvpMaxHp*.3?"#ff4444":"#ff8844",
                    width:`${oppHpPct}%`,boxShadow:"0 0 10px #ff4444"}}/>
                </div>
                <div style={{fontFamily:"Cinzel",fontSize:10,color:"#ff8844",marginTop:2}}>{pvpOppHp}/{pvpMaxHp}</div>
              </div>
            </div>

            {/* Battle viewport (reuses existing QTE rendering) */}
            <div ref={particleContainerRef}
              style={{position:"relative",width:BFW,height:BFH,zoom:Math.min((window.innerWidth-40)/BFW,(window.innerHeight-280)/BFH),
                background:"linear-gradient(to bottom,#0c0820 0%,#14102a 55%,#0a0818 100%)",
                borderRadius:8,border:"1px solid #4466ff22",overflow:"hidden",zIndex:1,flexShrink:0}}>

              {/* Impact flash */}
              {impactFlash>0&&(
                <div style={{position:"absolute",inset:0,background:impactFlash===2?"rgba(255,100,0,.35)":"rgba(255,80,0,.2)",zIndex:50,pointerEvents:"none",borderRadius:8}}/>
              )}

              {/* Parry flash */}
              {parryFlash&&(
                <div style={{position:"absolute",inset:0,background:"rgba(68,150,255,.18)",zIndex:49,pointerEvents:"none",animation:"parryFlash .9s ease-out forwards"}}/>
              )}

              {/* Hit result */}
              {hitResult&&(
                <div style={{position:"absolute",top:"22%",left:"50%",transform:"translateX(-50%)",
                  fontFamily:"Cinzel",fontWeight:900,fontSize:hitResult.big?28:20,
                  color:hitResult.color,textShadow:`0 0 20px ${hitResult.color}`,
                  zIndex:30,whiteSpace:"nowrap",animation:"slideUp .35s ease-out",pointerEvents:"none"}}>
                  {hitResult.text}
                </div>
              )}

              {/* Ground */}
              <div style={{position:"absolute",bottom:0,left:0,right:0,height:28,
                background:"linear-gradient(to bottom,transparent,#1a1530 40%,#12102a)",borderTop:"1px solid #2a2460"}}/>

              {/* Opponent (left side, flipped) */}
              <div style={{position:"absolute",left:ENX-HSW/2,top:HR_T,zIndex:6,
                filter:enemyFlash?"drop-shadow(0 0 18px #ff6600) brightness(2.5)":"none",transition:"filter .1s"}}>
                <HeroSprite className={iWonRace?(ALL_WEAPONS[oppSnap?.weapon]?.className??'Knight'):'Demolisher'} scale={0.85} weapons={[oppWeaponObj.id]}/>
              </div>

              {/* My hero (right side) */}
              <div style={{position:"absolute",
                left:heroPos?heroPos.left:HR_L, top:heroPos?heroPos.top:HR_T,
                zIndex:6,transform:"scaleX(-1)",
                animation:"none"}}>
                <HeroSprite className={player.class} scale={0.85} weapons={player.weapons||[]} heroLooks={player?.heroLooks} isAttacking={cs?.phase==="attacking"}/>
              </div>

              {/* All existing QTE overlays render here via existing render code — they check qteAnim type */}
              {/* Turn indicator */}
              {!qteAnim&&!pvpWinner&&(
                <div style={{position:"absolute",top:10,left:"50%",transform:"translateX(-50%)",
                  fontFamily:"Cinzel",fontSize:isMyTurn?14:10,letterSpacing:3,
                  color:isMyTurn?"#00ff88":"#ff8844",
                  textShadow:isMyTurn?"0 0 16px #00ff88":"0 0 10px #ff8844",
                  animation:isTheirTurn?"pulse .6s ease-in-out infinite":"none",zIndex:9}}>
                  {isMyTurn?"⚔ YOUR TURN":isTheirTurn?`${oppName.toUpperCase()} ATTACKING...`:""}
                </div>
              )}

            </div>

            {/* PvP log */}
            <div style={{marginTop:12,zIndex:1,width:"min(500px,90vw)",maxHeight:56,overflow:"hidden"}}>
              {pvpLog.slice(-3).map((l,i)=>(
                <div key={i} style={{fontFamily:"IM Fell English",fontSize:11,opacity:0.3+i*0.25,color:"#e8d5a3",
                  textAlign:"center",letterSpacing:1,fontStyle:"italic"}}>{l}</div>
              ))}
            </div>

            {/* Attack button / status */}
            {!pvpWinner&&(
              <div style={{marginTop:14,zIndex:1}}>
                {isMyTurn&&!qteAnim&&(
                  <button className="btn" onClick={doAttack}
                    style={{fontSize:15,padding:"12px 40px",letterSpacing:4,
                      borderColor:"#ff6600",color:"#ff9933",boxShadow:"0 0 20px #ff440044"}}>
                    {myWeaponObj.emoji} ATTACK [{QTE_LABEL[myWeaponObj.qteType]||"QTE"}]
                  </button>
                )}
                {isTheirTurn&&!qteAnim&&(
                  <div style={{fontFamily:"Cinzel",fontSize:10,color:"#4466ff",letterSpacing:3,
                    animation:"pulse .6s ease-in-out infinite"}}>
                    WAITING FOR {oppName.toUpperCase()}'S ATTACK…
                  </div>
                )}
                {qteAnim&&(
                  <div style={{fontFamily:"Cinzel",fontSize:10,color:"#ffcc44",letterSpacing:3,
                    animation:"pulse .4s ease-in-out infinite"}}>
                    QTE IN PROGRESS…
                  </div>
                )}
              </div>
            )}

            {/* Winner overlay */}
            {pvpWinner&&(
              <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.85)",zIndex:200,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",animation:"fadeIn .5s"}}>
                {pvpWinner==="me"
                  ? <>
                      <div style={{fontSize:72,marginBottom:16,animation:"float 1.5s infinite"}}>🏆</div>
                      <h1 style={{fontFamily:"Cinzel",fontWeight:900,fontSize:"clamp(32px,6vw,60px)",color:"#ffcc44",letterSpacing:8,textShadow:"0 0 40px #ffcc44",animation:"glow 1.5s infinite",marginBottom:8}}>YOU WIN!</h1>
                      <p style={{fontFamily:"IM Fell English",fontStyle:"italic",fontSize:16,opacity:.5,marginBottom:40,letterSpacing:3}}>You destroyed {oppName}. Champion of R.P.G.</p>
                    </>
                  : <>
                      <div style={{fontSize:72,marginBottom:16,opacity:.5}}>💀</div>
                      <h1 style={{fontFamily:"Cinzel",fontWeight:900,fontSize:"clamp(32px,6vw,60px)",color:"#cc2222",letterSpacing:8,textShadow:"0 0 40px #cc2222",marginBottom:8}}>ELIMINATED</h1>
                      <p style={{fontFamily:"IM Fell English",fontStyle:"italic",fontSize:16,opacity:.5,marginBottom:40,letterSpacing:3}}>{oppName} wins this time. Get wrecked.</p>
                    </>
                }
                {(finalTime||timerDisplay)&&<div style={{fontFamily:"Cinzel",fontSize:22,color:"#ffcc44",letterSpacing:4,marginBottom:32,opacity:.7}}>⏱ {finalTime||timerDisplay}</div>}
                <button className="btn" style={{fontSize:16,padding:"14px 44px",letterSpacing:5}} onClick={()=>window.location.reload()}>PLAY AGAIN</button>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
