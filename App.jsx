const { useState, useEffect, useRef } = React;

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
@keyframes dragonBreath{0%{opacity:0;transform:scaleX(0)}40%{opacity:.9}100%{opacity:0;transform:scaleX(1.4)}}
@keyframes skelSwing{0%,100%{transform:rotate(0deg)}50%{transform:rotate(-18deg)}}
@keyframes eyePulse{0%,100%{transform:scale(1);opacity:.7}50%{transform:scale(1.08);opacity:1}}
@keyframes wraithWail{0%,100%{transform:scaleX(1)}50%{transform:scaleX(1.15)}}
`;


/* ─── WEAPON DATA ────────────────────────────────────────────── */
const STARTER_WEAPONS = {
  sword:   { id:"sword",   name:"Iron Sword",    emoji:"⚔️", baseDmg:12, speed:2.2, qteType:"swing_beat",  desc:"Swing in rhythm — press A and D as the dial hits each side.", classEmoji:"🛡️", className:"Knight"    },
  hammer:  { id:"hammer",  name:"War Hammer",     emoji:"🔨", baseDmg:22, speed:1.0, qteType:"hold_release",desc:"Wind up and release at the apex.",                             classEmoji:"⚒️", className:"Berserker" },
  daggers: { id:"daggers", name:"Shadow Daggers", emoji:"🗡️", baseDmg:9,  speed:3.0, qteType:"rapid_tap",  tapTarget:8, desc:"Unleash a flurry of cuts — mash SPACE rapidly.",  classEmoji:"🐍", className:"Rogue"     },
  staff:   { id:"staff",   name:"Arcane Staff",   emoji:"🪄", baseDmg:16, speed:1.8, qteType:"sequence",   seqLength:4, desc:"Channel a spell — enter the rune sequence exactly.", classEmoji:"🌙", className:"Mage"      },
  bow:     { id:"bow",     name:"Elven Bow",       emoji:"🏹", baseDmg:8,  speed:1.5, qteType:"archery",    desc:"Stop 3 moving dots — press SPACE for each. Three arrows fly.",classEmoji:"🌿", className:"Ranger"    },
};
const ALL_WEAPONS = {
  ...STARTER_WEAPONS,
  boots: { id:"boots", name:"Iron Boots", emoji:"👟", baseDmg:8,  speed:1.4, qteType:"stomp",        classEmoji:"👊", className:"Brawler"  },
  axe:   { id:"axe",   name:"Battle Axe", emoji:"🪓", baseDmg:19, speed:1.1, qteType:"hold_release", classEmoji:"🪓", className:"Warrior"  },
  spear: { id:"spear", name:"Iron Spear", emoji:"🔱", baseDmg:15, speed:1.9, qteType:"poke",         classEmoji:"🔱", className:"Lancer"   },
  wand:  { id:"wand",  name:"Chaos Wand", emoji:"✨", baseDmg:18, speed:2.0, qteType:"sequence",        seqLength:3, classEmoji:"✨", className:"Sorcerer"},
  rpg:   { id:"rpg",  name:"RPG",        emoji:"🚀", baseDmg:55, speed:1.2, qteType:"sequence_reveal", seqLength:10, classEmoji:"💥", className:"Demolisher"},
};

/* ─── ENEMY DATA ─────────────────────────────────────────────── */
const ENEMIES = {
  goblin:   { name:"Goblin Scout",     hp:22,  emoji:"👺", xp:20,  atk:5,  color:"#55bb55", desc:"A cunning little pest"      },
  skeleton: { name:"Skeleton Warrior", hp:32,  emoji:"💀", xp:30,  atk:7,  color:"#aaaaaa", desc:"Bones that refuse to rest"  },
  eye:      { name:"Void Eye",         hp:28,  emoji:"👁️", xp:35,  atk:10, color:"#9944ff", desc:"It sees into your soul"     },
  golem:    { name:"Stone Golem",      hp:65,  emoji:"🗿", xp:55,  atk:12, color:"#aa7744", desc:"Ancient earth made flesh"   },
  wraith:   { name:"Wailing Wraith",   hp:40,  emoji:"👻", xp:45,  atk:14, color:"#4488ff", desc:"A spirit of pure malice"    },
  dragon:   { name:"Ancient Dragon",   hp:150, emoji:"🐉", xp:500, atk:18, color:"#ff4422", desc:"The apex of draconic terror" },
};
const ENEMY_DIMS = {
  goblin:{w:64,h:78}, skeleton:{w:56,h:88}, eye:{w:80,h:80},
  golem:{w:84,h:88},  wraith:{w:64,h:96},   dragon:{w:110,h:88},
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
  { id:"w_rpg",   type:"weapon", label:"RPG",            emoji:"🚀", weaponId:"rpg", eliteOnly:true },
  // Potions — each can appear at most once per pick
  ...POTIONS.map(pt=>({ id:`pot_${pt.id}`, type:"potion", label:pt.name, emoji:pt.emoji, desc:pt.desc, potion:pt })),
];
const pickRewards = (held, eliteDrop=false) => {
  const pool = BASE_REWARDS.filter(r => {
    if (r.type==="weapon" && held.includes(r.weaponId)) return false;
    if (r.eliteOnly && !eliteDrop) return false;
    if (r.eliteOnly && eliteDrop && Math.random() > 0.30) return false; // 30% drop chance
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
const CLASS_COLORS = {
  Knight:{body:"#4466bb",trim:"#ddaa33"}, Berserker:{body:"#882222",trim:"#dd6622"},
  Rogue:{body:"#223344",trim:"#44aaaa"},  Mage:{body:"#442288",trim:"#aa44ff"},
  Ranger:{body:"#224422",trim:"#44bb44"}, Brawler:{body:"#664422",trim:"#ccaa44"},
  Warrior:{body:"#556677",trim:"#aabbcc"},Lancer:{body:"#334455",trim:"#4488cc"},
  Sorcerer:{body:"#331144",trim:"#cc44ff"},
};
const SKIN = "#e8c47a";

function HeroSprite({ className="Knight", scale=1, weapons=[] }) {
  const c = CLASS_COLORS[className] || CLASS_COLORS.Knight;
  const pw = weapons[0] || null;
  // Extra weapons orbiting (all except primary)
  const orbitWeapons = [...new Set(weapons.filter(w=>w&&w!==pw))];

  const WeaponRight = () => {
    switch(pw){
      case"sword":return(<g>
        <line x1="36" y1="28" x2="44" y2="40" stroke={c.body} strokeWidth="7" strokeLinecap="round"/>
        <line x1="44" y1="40" x2="47" y2="52" stroke={c.body} strokeWidth="6" strokeLinecap="round"/>
        <ellipse cx="47" cy="53" rx="3.5" ry="3" fill={c.trim}/>
        <polygon points="48,54 51,57 33,76 30,73" fill="#ccdde8"/>
        <line x1="50" y1="55" x2="31" y2="75" stroke="#eef5ff" strokeWidth="1.2" opacity=".55" strokeLinecap="round"/>
        <line x1="31" y1="68" x2="37" y2="74" stroke="#ccaa22" strokeWidth="3.5" strokeLinecap="round"/>
        <line x1="34" y1="72" x2="30" y2="78" stroke="#5a2a08" strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="29" cy="79" r="2.2" fill="#ccaa22"/>
      </g>);
      case"hammer":return(<g>
        <line x1="36" y1="28" x2="43" y2="20" stroke={c.body} strokeWidth="7" strokeLinecap="round"/>
        <line x1="43" y1="20" x2="41" y2="10" stroke={c.body} strokeWidth="6" strokeLinecap="round"/>
        <ellipse cx="40" cy="9" rx="3.5" ry="3" fill={c.trim}/>
        <line x1="40" y1="8" x2="40" y2="34" stroke="#7a4a22" strokeWidth="3.5" strokeLinecap="round"/>
        <rect x="30" y="1" width="20" height="11" rx="2.5" fill="#6a7a8a"/>
        <rect x="30" y="1" width="20" height="5" rx="2" fill="#8eaabb" opacity=".9"/>
        <line x1="50" y1="3" x2="50" y2="11" stroke="#ddeeff" strokeWidth="2" strokeLinecap="round" opacity=".8"/>
      </g>);
      case"daggers":return(<g>
        <line x1="36" y1="28" x2="45" y2="35" stroke={c.body} strokeWidth="7" strokeLinecap="round"/>
        <line x1="45" y1="35" x2="50" y2="44" stroke={c.body} strokeWidth="6" strokeLinecap="round"/>
        <ellipse cx="50" cy="45" rx="3" ry="2.5" fill={c.trim}/>
        <polygon points="51,46 53,49 43,59 41,56" fill="#ccdde8"/>
        <line x1="46" y1="48" x2="44" y2="51" stroke="#ccaa22" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="12" y1="28" x2="4" y2="35" stroke={c.body} strokeWidth="7" strokeLinecap="round"/>
        <line x1="4" y1="35" x2="0" y2="44" stroke={c.body} strokeWidth="6" strokeLinecap="round"/>
        <ellipse cx="0" cy="45" rx="3" ry="2.5" fill={c.trim}/>
        <polygon points="-1,46 -3,49 7,59 9,56" fill="#ccdde8"/>
        <line x1="4" y1="48" x2="6" y2="51" stroke="#ccaa22" strokeWidth="2.5" strokeLinecap="round"/>
      </g>);
      case"staff":return(<g>
        <line x1="36" y1="28" x2="43" y2="18" stroke={c.body} strokeWidth="7" strokeLinecap="round"/>
        <line x1="43" y1="18" x2="41" y2="8" stroke={c.body} strokeWidth="6" strokeLinecap="round"/>
        <ellipse cx="40" cy="7" rx="3.5" ry="3" fill={c.trim}/>
        <line x1="40" y1="6" x2="40" y2="82" stroke="#7a4a22" strokeWidth="3.5" strokeLinecap="round"/>
        <line x1="40" y1="6" x2="36" y2="2" stroke={c.trim} strokeWidth="2" strokeLinecap="round"/>
        <line x1="40" y1="6" x2="44" y2="2" stroke={c.trim} strokeWidth="2" strokeLinecap="round"/>
        <circle cx="40" cy="-1" r="6" fill={c.trim} opacity=".25"/>
        <circle cx="40" cy="-1" r="4.5" fill={c.trim} opacity=".9"/>
        <circle cx="38.5" cy="-2.5" r="1.8" fill="#fff" opacity=".45"/>
      </g>);
      case"bow":return(<g>
        <line x1="12" y1="28" x2="4" y2="31" stroke={c.body} strokeWidth="7" strokeLinecap="round"/>
        <line x1="4" y1="31" x2="2" y2="42" stroke={c.body} strokeWidth="6" strokeLinecap="round"/>
        <path d="M2,20 Q-4,31 2,42" stroke="#8a5a28" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
        <path d="M2,20 Q4,22 5,25" stroke="#8a5a28" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <path d="M2,42 Q4,40 5,37" stroke="#8a5a28" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <line x1="5" y1="25" x2="5" y2="37" stroke="#e8d5a3" strokeWidth="1.5" opacity=".9"/>
        <line x1="36" y1="28" x2="43" y2="32" stroke={c.body} strokeWidth="7" strokeLinecap="round"/>
        <line x1="43" y1="32" x2="46" y2="40" stroke={c.body} strokeWidth="6" strokeLinecap="round"/>
        <line x1="5" y1="31" x2="46" y2="31" stroke="#9a6a30" strokeWidth="2" strokeLinecap="round"/>
        <polygon points="5,31 10,29 9.5,31 10,33" fill="#cc3322"/>
        <polygon points="46,31 42,29 42.5,31 42,33" fill="#ccdde8"/>
      </g>);
      case"axe":return(<g>
        <line x1="36" y1="28" x2="44" y2="40" stroke={c.body} strokeWidth="7" strokeLinecap="round"/>
        <line x1="44" y1="40" x2="47" y2="53" stroke={c.body} strokeWidth="6" strokeLinecap="round"/>
        <ellipse cx="47" cy="54" rx="3.5" ry="3" fill={c.trim}/>
        <line x1="47" y1="53" x2="46" y2="76" stroke="#7a4a22" strokeWidth="3.5" strokeLinecap="round"/>
        <path d="M43,55 Q50,48 53,55 Q53,64 49,67 Q51,61 49,57 Q46,56 43,57Z" fill="#7a8a9a"/>
        <path d="M53,55 Q53,64 49,67" stroke="#ccdde8" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <polygon points="42,54 43,54 44,60 43,67 42,67 40,60" fill="#4a5a68"/>
      </g>);
      case"spear":return(<g>
        <line x1="36" y1="28" x2="44" y2="20" stroke={c.body} strokeWidth="7" strokeLinecap="round"/>
        <line x1="44" y1="20" x2="47" y2="11" stroke={c.body} strokeWidth="6" strokeLinecap="round"/>
        <ellipse cx="47" cy="10" rx="3.5" ry="3" fill={c.trim}/>
        <line x1="47" y1="9" x2="28" y2="82" stroke="#7a4a22" strokeWidth="3" strokeLinecap="round"/>
        <polygon points="47,9 45,5 50,2 53,8 50,12" fill="#ccdde8"/>
        <line x1="47" y1="9" x2="50" y2="2" stroke="#eef5ff" strokeWidth="1.2" opacity=".6" strokeLinecap="round"/>
        <line x1="45" y1="12" x2="40" y2="16" stroke="#9aaabb" strokeWidth="2.5" strokeLinecap="round"/>
      </g>);
      case"rpg":return(<g>
        <line x1="36" y1="28" x2="43" y2="22" stroke={c.body} strokeWidth="7" strokeLinecap="round"/>
        <line x1="43" y1="22" x2="48" y2="14" stroke={c.body} strokeWidth="6" strokeLinecap="round"/>
        <line x1="12" y1="28" x2="8" y2="24" stroke={c.body} strokeWidth="7" strokeLinecap="round"/>
        <line x1="8" y1="24" x2="5" y2="18" stroke={c.body} strokeWidth="6" strokeLinecap="round"/>
        <rect x="4" y="11" width="46" height="8" rx="4" fill="#44556a"/>
        <rect x="4" y="11" width="46" height="4" rx="3" fill="#5a6e84" opacity=".9"/>
        <line x1="5" y1="12.5" x2="48" y2="12.5" stroke="#7799bb" strokeWidth="1.2" strokeLinecap="round" opacity=".5"/>
        <polygon points="50,11 58,15 50,19" fill="#dd3311"/>
        <path d="M4,11 Q1,15 4,19" fill="#334455"/>
        <rect x="20" y="19" width="10" height="8" rx="1.5" fill="#334455"/>
      </g>);
      case"wand":return(<g>
        <line x1="36" y1="28" x2="46" y2="22" stroke={c.body} strokeWidth="7" strokeLinecap="round"/>
        <line x1="46" y1="22" x2="51" y2="15" stroke={c.body} strokeWidth="6" strokeLinecap="round"/>
        <ellipse cx="51" cy="14" rx="3" ry="2.5" fill={c.trim}/>
        <line x1="51" y1="13" x2="39" y2="36" stroke="#5522aa" strokeWidth="3" strokeLinecap="round"/>
        <polygon points="39,36 37,34 39,30 43,32 42,36" fill="#cc88ff"/>
        <circle cx="40" cy="32" r="3.5" fill="#aa44ff" opacity=".25"/>
        <circle cx="40" cy="32" r="1.4" fill="#fff" opacity=".65"/>
        <line x1="40" y1="28" x2="40" y2="25" stroke="#ee99ff" strokeWidth="1.2" strokeLinecap="round" opacity=".8"/>
        <line x1="43" y1="29.5" x2="45" y2="27.5" stroke="#ee99ff" strokeWidth="1.2" strokeLinecap="round" opacity=".7"/>
      </g>);
      case"boots":return(<g>
        <line x1="36" y1="28" x2="44" y2="38" stroke={c.body} strokeWidth="7" strokeLinecap="round"/>
        <line x1="44" y1="38" x2="43" y2="50" stroke={c.body} strokeWidth="6" strokeLinecap="round"/>
        <ellipse cx="43" cy="51" rx="4" ry="3.5" fill={c.trim}/>
      </g>);
      default:return(<g>
        <line x1="36" y1="28" x2="44" y2="40" stroke={c.body} strokeWidth="7" strokeLinecap="round"/>
        <line x1="44" y1="40" x2="43" y2="52" stroke={c.body} strokeWidth="6" strokeLinecap="round"/>
        <ellipse cx="43" cy="53" rx="3.5" ry="3" fill={c.trim}/>
      </g>);
    }
  };

  const LeftArm = () => {
    if(pw==="daggers"||pw==="bow"||pw==="rpg") return null;
    return(<g>
      <line x1="12" y1="28" x2="4" y2="40" stroke={c.body} strokeWidth="7" strokeLinecap="round"/>
      <line x1="4" y1="40" x2="5" y2="52" stroke={c.body} strokeWidth="6" strokeLinecap="round"/>
      <ellipse cx="5" cy="53" rx="3.5" ry="3" fill={c.trim}/>
    </g>);
  };

  return (
    <div style={{position:"relative",width:56*scale,height:86*scale,display:"inline-block"}}>
      {/* Orbiting weapons */}
      {orbitWeapons.map((wid,i)=>{
        const period = 4 + i*0.8;
        const delay  = -(period * i / Math.max(orbitWeapons.length,1));
        return (
          <div key={wid} style={{
            position:"absolute", left:"50%", top:"42%",
            width:0, height:0, pointerEvents:"none",
            "--r":`${Math.round(46*scale)}px`,
            animation:`weaponOrbit ${period}s linear infinite`,
            animationDelay:`${delay}s`,
          }}>
            <div style={{
              position:"absolute", transform:"translate(-12px,-12px)",
              animation:"weaponBob 2s ease-in-out infinite",
              filter:`drop-shadow(0 0 6px ${c.trim}aa)`,
            }}>
              <Icon type={wid} size={Math.round(22*scale)}/>
            </div>
          </div>
        );
      })}
      <svg width={56*scale} height={86*scale} viewBox="0 0 56 86" style={{display:"block",overflow:"visible"}}>
        {/* ── Shadow ── */}
        <ellipse cx="28" cy="84" rx="16" ry="3" fill="#000" opacity=".25"/>

        {/* ── Legs ── */}
        {/* Left leg */}
        <line x1="22" y1="52" x2="19" y2="67" stroke={c.body} strokeWidth="10" strokeLinecap="round"/>
        <line x1="19" y1="67" x2="17" y2="80" stroke={c.body} strokeWidth="9" strokeLinecap="round"/>
        {/* Left greave highlight */}
        <line x1="20" y1="67" x2="18" y2="80" stroke={c.trim} strokeWidth="1.2" strokeLinecap="round" opacity=".4"/>
        {/* Left boot */}
        <rect x="10" y="78" width="15" height="6" rx="2.5" fill="#3a2818"/>
        <rect x="10" y="78" width="15" height="3"  rx="2"   fill="#5a3a20" opacity=".85"/>
        <rect x="9"  y="82" width="16" height="3"  rx="1.5" fill="#2a1810"/>
        {/* Right leg */}
        <line x1="34" y1="52" x2="37" y2="67" stroke={c.body} strokeWidth="10" strokeLinecap="round"/>
        <line x1="37" y1="67" x2="39" y2="80" stroke={c.body} strokeWidth="9" strokeLinecap="round"/>
        <line x1="36" y1="67" x2="38" y2="80" stroke={c.trim} strokeWidth="1.2" strokeLinecap="round" opacity=".4"/>
        {/* Right boot */}
        <rect x="31" y="78" width="15" height="6" rx="2.5" fill="#3a2818"/>
        <rect x="31" y="78" width="15" height="3"  rx="2"   fill="#5a3a20" opacity=".85"/>
        <rect x="30" y="82" width="16" height="3"  rx="1.5" fill="#2a1810"/>
        {/* Knee caps */}
        <circle cx="19" cy="67" r="4" fill={c.trim} opacity=".55"/>
        <circle cx="37" cy="67" r="4" fill={c.trim} opacity=".55"/>

        {/* ── Left arm ── */}
        <LeftArm/>

        {/* ── Torso ── */}
        {/* Waist / hips */}
        <ellipse cx="28" cy="52" rx="14" ry="5" fill={c.body} opacity=".9" style={{animation:"heroBreath 3s ease-in-out infinite"}}/>
        {/* Belt */}
        <rect x="14" y="49" width="28" height="5" rx="1.5" fill={c.trim} opacity=".75"/>
        <rect x="25" y="49" width="6"  height="5" rx="1"   fill={c.trim}/>
        <circle cx="28" cy="51.5" r="2.5" fill="#ffeeaa"/>
        {/* Chest — broad armored plate */}
        <rect x="12" y="26" width="32" height="26" rx="4" fill={c.body}/>
        {/* Chest highlight / bevel */}
        <rect x="14" y="27" width="28" height="6" rx="3" fill={c.body} opacity=".7"/>
        <line x1="14" y1="29" x2="42" y2="29" stroke={c.trim} strokeWidth="1" opacity=".3"/>
        {/* Center line */}
        <line x1="28" y1="27" x2="28" y2="49" stroke={c.trim} strokeWidth="1.2" opacity=".3"/>
        {/* Trim arcs */}
        <path d="M16,32 Q28,38 40,32" stroke={c.trim} strokeWidth="1.5" fill="none" opacity=".5"/>
        <path d="M16,41 Q28,47 40,41" stroke={c.trim} strokeWidth="1.2" fill="none" opacity=".35"/>
        {/* Pauldrons */}
        <ellipse cx="11" cy="28" rx="6"   ry="5"   fill={c.body} stroke={c.trim} strokeWidth="1"/>
        <ellipse cx="45" cy="28" rx="6"   ry="5"   fill={c.body} stroke={c.trim} strokeWidth="1"/>
        <line x1="7"  y1="27" x2="15" y2="27" stroke={c.trim} strokeWidth=".8" opacity=".5"/>
        <line x1="41" y1="27" x2="49" y2="27" stroke={c.trim} strokeWidth=".8" opacity=".5"/>

        {/* ── Right arm + weapon ── */}
        <WeaponRight/>

        {/* ── Neck ── */}
        <rect x="24" y="21" width="8" height="7" rx="2.5" fill={SKIN}/>
        {/* Gorget / neck guard */}
        <rect x="22" y="24" width="12" height="4" rx="1.5" fill={c.body} opacity=".7"/>

        {/* ── Head ── */}
        {/* Helmet shell */}
        <ellipse cx="28" cy="11" rx="13" ry="7" fill={c.body}/>
        {/* Cheek guards */}
        <rect x="15" y="13" width="5" height="7" rx="2" fill={c.body} opacity=".9"/>
        <rect x="36" y="13" width="5" height="7" rx="2" fill={c.body} opacity=".9"/>
        {/* Helmet brow band */}
        <rect x="15" y="14" width="26" height="3" rx="1.5" fill={c.trim} opacity=".85"/>
        {/* Face */}
        <ellipse cx="28" cy="17" rx="11" ry="10" fill={SKIN}/>
        {/* Eye whites */}
        <ellipse cx="23.5" cy="15" rx="2.5" ry="2.2" fill="#fff"/>
        <ellipse cx="32.5" cy="15" rx="2.5" ry="2.2" fill="#fff"/>
        {/* Pupils */}
        <circle cx="23.5" cy="15.3" r="1.5" fill="#1a1008"/>
        <circle cx="32.5" cy="15.3" r="1.5" fill="#1a1008"/>
        {/* Catchlights */}
        <circle cx="24"   cy="14.7" r=".6"  fill="#fff" opacity=".75"/>
        <circle cx="33"   cy="14.7" r=".6"  fill="#fff" opacity=".75"/>
        {/* Eyebrows */}
        <path d="M21,12.8 Q23.5,12 26,12.8" stroke="#3a1a08" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        <path d="M30,12.8 Q32.5,12 35,12.8" stroke="#3a1a08" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        {/* Nose */}
        <path d="M27,17 Q26,19 27.5,19.5 Q29,19 28,17" stroke="#b8904a" strokeWidth=".8" fill="none" strokeLinecap="round"/>
        {/* Mouth */}
        <path d="M25,22 Q28,24 31,22" stroke="#8a4a28" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
        {/* Nasal guard */}
        <rect x="27" y="11" width="2.5" height="7" rx="1.2" fill={c.body} opacity=".6"/>
        {/* Visor slits */}
        <line x1="16" y1="16" x2="22" y2="16" stroke={c.trim} strokeWidth=".7" opacity=".45"/>
        <line x1="34" y1="16" x2="40" y2="16" stroke={c.trim} strokeWidth=".7" opacity=".45"/>
        {/* Helmet crest / plume */}
        <rect x="26" y="4" width="4" height="7" rx="2" fill={c.trim} opacity=".7"/>
      </svg>
    </div>
  );
}

function EnemySpriteSmall({ id, scale=1 }) {
  const e = ENEMIES[id] || ENEMIES.goblin;

  if (id==="goblin") return (
    <svg width={64*scale} height={78*scale} viewBox="0 0 64 78" style={{display:"block",overflow:"visible"}}>
      <ellipse cx="32" cy="76" rx="20" ry="3.5" fill="#000" opacity=".2"/>
      {/* Body */}
      <g style={{animation:"goblinBob 1.3s ease-in-out infinite",transformOrigin:"32px 50px"}}>
        {/* Legs */}
        <line x1="25" y1="58" x2="20" y2="70" stroke="#1e6a1e" strokeWidth="8" strokeLinecap="round"/>
        <line x1="39" y1="58" x2="44" y2="70" stroke="#1e6a1e" strokeWidth="8" strokeLinecap="round"/>
        {/* Feet with claws */}
        <ellipse cx="20" cy="72" rx="6" ry="4" fill="#1a5a1a"/>
        <ellipse cx="44" cy="72" rx="6" ry="4" fill="#1a5a1a"/>
        {[-3,0,3].map((dx,i)=><line key={i} x1={20+dx} y1="75" x2={19+dx} y2="78" stroke="#0a2a0a" strokeWidth="1.5" strokeLinecap="round"/>)}
        {[-3,0,3].map((dx,i)=><line key={i} x1={44+dx} y1="75" x2={45+dx} y2="78" stroke="#0a2a0a" strokeWidth="1.5" strokeLinecap="round"/>)}
        {/* Torso */}
        <ellipse cx="32" cy="48" rx="17" ry="16" fill="#1e6a1e"/>
        <ellipse cx="32" cy="46" rx="14" ry="13" fill="#2e8a2e"/>
        {/* Leather chest straps */}
        <path d="M20,40 L44,40 L44,55 L20,55 Z" fill="none" stroke="#5a3a18" strokeWidth="1.5" opacity=".5"/>
        <path d="M20,42 L44,56" stroke="#5a3a18" strokeWidth="1.5" opacity=".4" strokeLinecap="round"/>
        <path d="M44,42 L20,56" stroke="#5a3a18" strokeWidth="1.5" opacity=".4" strokeLinecap="round"/>
        {/* Loincloth */}
        <path d="M22,56 Q32,62 42,56 L40,68 Q32,72 24,68 Z" fill="#5a3a18"/>
        <rect x="20" y="54" width="24" height="4" rx="2" fill="#3a2208"/>
        <circle cx="32" cy="56" r="2" fill="#cc9922"/>
        {/* Arms */}
        <line x1="17" y1="42" x2="8"  y2="52" stroke="#2a8a2a" strokeWidth="7" strokeLinecap="round"/>
        <line x1="8"  y1="52" x2="4"  y2="62" stroke="#2a8a2a" strokeWidth="6" strokeLinecap="round"/>
        <line x1="47" y1="42" x2="56" y2="50" stroke="#2a8a2a" strokeWidth="7" strokeLinecap="round"/>
        <line x1="56" y1="50" x2="60" y2="60" stroke="#2a8a2a" strokeWidth="6" strokeLinecap="round"/>
        {/* Hands / claws */}
        <ellipse cx="4"  cy="63" rx="4" ry="3.5" fill="#1e6a1e"/>
        <ellipse cx="60" cy="61" rx="4" ry="3.5" fill="#1e6a1e"/>
        {[-2,0,2].map((dx,i)=><line key={i} x1={4+dx} y1="66" x2={3+dx} y2="70" stroke="#0a2a0a" strokeWidth="1.3" strokeLinecap="round"/>)}
        {/* Club */}
        <line x1="60" y1="60" x2="64" y2="46" stroke="#5a3a1a" strokeWidth="4" strokeLinecap="round"/>
        <ellipse cx="64.5" cy="43" rx="5" ry="3.5" fill="#4a3010" stroke="#2a1a08" strokeWidth="1"/>
        {[-2,0,2].map((dy,i)=><circle key={i} cx="66" cy={42+dy*1.5} r=".8" fill="#2a1808"/>)}
      </g>
      {/* Head */}
      <g style={{animation:"goblinBob 1.3s ease-in-out infinite .08s",transformOrigin:"32px 20px"}}>
        {/* Big bat ears */}
        <path d="M14,22 L4,10 L16,18" fill="#3a9a3a"/>
        <path d="M14,22 L6,12 L16,19" fill="#55bb55" opacity=".55"/>
        <path d="M50,22 L60,10 L48,18" fill="#3a9a3a"/>
        <path d="M50,22 L58,12 L48,19" fill="#55bb55" opacity=".55"/>
        {/* Skull */}
        <circle cx="32" cy="22" r="18" fill="#2a8a2a"/>
        <circle cx="32" cy="20" r="15" fill="#3aaa3a"/>
        {/* Forehead bumps */}
        <circle cx="26" cy="12" r="2.5" fill="#1e6a1e"/>
        <circle cx="38" cy="12" r="2"   fill="#1e6a1e"/>
        {/* Heavy brow */}
        <path d="M14,18 Q32,12 50,18" stroke="#1a5a1a" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
        {/* Eyes — big amber with slit pupils */}
        <circle cx="23" cy="21" r="6" fill="#ffaa00"/>
        <circle cx="41" cy="21" r="6" fill="#ffaa00"/>
        <circle cx="23" cy="21" r="4.5" fill="#dd8800"/>
        <circle cx="41" cy="21" r="4.5" fill="#dd8800"/>
        <g style={{animation:"goblinEye 1.8s ease-in-out infinite",transformOrigin:"23px 21px"}}>
          <ellipse cx="23" cy="21" rx="1.5" ry="3" fill="#111"/>
          <circle  cx="23.8" cy="19.5" r=".9"  fill="#fff" opacity=".6"/>
        </g>
        <g style={{animation:"goblinEye 1.8s ease-in-out infinite .25s",transformOrigin:"41px 21px"}}>
          <ellipse cx="41" cy="21" rx="1.5" ry="3" fill="#111"/>
          <circle  cx="41.8" cy="19.5" r=".9"  fill="#fff" opacity=".6"/>
        </g>
        {/* Nose — broad, flat */}
        <ellipse cx="32" cy="28" rx="4"   ry="3"   fill="#1e6a1e"/>
        <circle  cx="29.5" cy="28" r="1.2" fill="#111"/>
        <circle  cx="34.5" cy="28" r="1.2" fill="#111"/>
        {/* Jagged mouth */}
        <path d="M20,34 Q32,40 44,34" stroke="#111" strokeWidth="2" fill="none" strokeLinecap="round"/>
        {[22,26,30,34,38,42].map(x=><rect key={x} x={x-1.2} y="33" width="2.5" height="4" rx=".8" fill="#ffffee"/>)}
        <polygon points="24,35 22,40 26,37" fill="#ffffee"/>
        <polygon points="40,35 38,37 42,40" fill="#ffffee"/>
      </g>
    </svg>
  );

  if (id==="skeleton") return (
    <svg width={56*scale} height={88*scale} viewBox="0 0 56 88" style={{display:"block",overflow:"visible"}}>
      <ellipse cx="28" cy="86" rx="18" ry="3" fill="#000" opacity=".2"/>
      <g style={{animation:"skelRattle 0.85s ease-in-out infinite",transformOrigin:"28px 48px"}}>
        {/* Spine */}
        <line x1="28" y1="26" x2="28" y2="62" stroke="#d4d4aa" strokeWidth="4" strokeLinecap="round"/>
        {[30,36,42,48,54].map(y=>(
          <g key={y}>
            <path d={`M28,${y} Q14,${y+3} 12,${y+8}`} stroke="#d4d4aa" strokeWidth="3" fill="none" strokeLinecap="round"/>
            <path d={`M28,${y} Q42,${y+3} 44,${y+8}`} stroke="#d4d4aa" strokeWidth="3" fill="none" strokeLinecap="round"/>
          </g>
        ))}
        {/* Pelvis */}
        <path d="M16,62 Q28,68 40,62 L38,70 Q28,74 18,70 Z" fill="#c4c4a0"/>
        <ellipse cx="28" cy="63" rx="12" ry="5" fill="#c4c4a0"/>
        <ellipse cx="28" cy="63" rx="8"  ry="3" fill="#111"/>
        {/* Legs */}
        <line x1="22" y1="64" x2="18" y2="78" stroke="#d4d4aa" strokeWidth="5" strokeLinecap="round"/>
        <line x1="18" y1="78" x2="15" y2="88" stroke="#d4d4aa" strokeWidth="4.5" strokeLinecap="round"/>
        <ellipse cx="14" cy="88" rx="7" ry="2.5" fill="#c4c4a0"/>
        <circle  cx="18" cy="78" r="4" fill="#b4b494"/>
        <line x1="34" y1="64" x2="38" y2="78" stroke="#d4d4aa" strokeWidth="5" strokeLinecap="round"/>
        <line x1="38" y1="78" x2="41" y2="88" stroke="#d4d4aa" strokeWidth="4.5" strokeLinecap="round"/>
        <ellipse cx="42" cy="88" rx="7" ry="2.5" fill="#c4c4a0"/>
        <circle  cx="38" cy="78" r="4" fill="#b4b494"/>
        {/* Left arm */}
        <line x1="16" y1="30" x2="8"  y2="44" stroke="#d4d4aa" strokeWidth="3.5" strokeLinecap="round"/>
        <line x1="8"  y1="44" x2="4"  y2="58" stroke="#d4d4aa" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="8" cy="44" r="3.5" fill="#b4b494"/>
        <ellipse cx="4" cy="59" rx="3.5" ry="3" fill="#c4c4a0"/>
        {/* Right arm with sword */}
        <g style={{animation:"skelSwing 2s ease-in-out infinite",transformOrigin:"40px 30px"}}>
          <line x1="40" y1="30" x2="48" y2="44" stroke="#d4d4aa" strokeWidth="3.5" strokeLinecap="round"/>
          <line x1="48" y1="44" x2="52" y2="58" stroke="#d4d4aa" strokeWidth="3" strokeLinecap="round"/>
          <circle cx="48" cy="44" r="3.5" fill="#b4b494"/>
          {/* Rusty sword */}
          <polygon points="52,58 55,61 42,74 39,71" fill="#8a7a5a"/>
          <line x1="54" y1="59" x2="41" y2="73" stroke="#aa9a6a" strokeWidth="1" opacity=".55" strokeLinecap="round"/>
          <line x1="39" y1="68" x2="45" y2="74" stroke="#bb8822" strokeWidth="3" strokeLinecap="round"/>
          <line x1="42" y1="72" x2="38" y2="77" stroke="#8a6a3a" strokeWidth="2.2" strokeLinecap="round"/>
          <circle cx="37" cy="78" r="2" fill="#aa8822"/>
        </g>
        {/* Collar bones */}
        <path d="M16,26 Q28,30 40,26" stroke="#d4d4aa" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      </g>
      {/* Head */}
      <g style={{animation:"skelRattle 0.85s ease-in-out infinite .12s",transformOrigin:"28px 13px"}}>
        <circle cx="28" cy="13" r="13" fill="#c4c4a0" stroke="#a4a488" strokeWidth="1"/>
        <circle cx="28" cy="12" r="11" fill="#d8d8b8"/>
        {/* Cranium brow shelf */}
        <path d="M15,15 Q28,9 41,15" stroke="#c4c4a0" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        {/* Cracks */}
        <line x1="28" y1="4" x2="31" y2="12" stroke="#aaa" strokeWidth=".7" opacity=".5"/>
        <line x1="20" y1="6" x2="23" y2="12" stroke="#aaa" strokeWidth=".6" opacity=".4"/>
        {/* Eye sockets */}
        <ellipse cx="21" cy="13" rx="5.5" ry="5" fill="#0a0a0a"/>
        <ellipse cx="35" cy="13" rx="5.5" ry="5" fill="#0a0a0a"/>
        {/* Hellfire glow */}
        <circle cx="21" cy="13" r="3"   fill="#ff2200" opacity=".8"/>
        <circle cx="35" cy="13" r="3"   fill="#ff2200" opacity=".8"/>
        <circle cx="21" cy="13" r="1.4" fill="#ffaa00"/>
        <circle cx="35" cy="13" r="1.4" fill="#ffaa00"/>
        <circle cx="20.5" cy="12.2" r=".5" fill="#fff" opacity=".7"/>
        <circle cx="34.5" cy="12.2" r=".5" fill="#fff" opacity=".7"/>
        {/* Nose cavity */}
        <path d="M26,19 L28,23 L30,19" fill="#111"/>
        {/* Jaw */}
        <g style={{animation:"skelJaw 1.1s ease-in-out infinite",transformOrigin:"28px 26px"}}>
          <path d="M16,26 L20,31 L36,31 L40,26" fill="#c4c4a0" stroke="#a4a488" strokeWidth=".8"/>
          {[19,23,27,31,35].map(x=><rect key={x} x={x} y="27" width="3" height="4" rx="1" fill="#eeeedd"/>)}
        </g>
      </g>
    </svg>
  );

  if (id==="golem") return (
    <svg width={84*scale} height={88*scale} viewBox="0 0 84 88" style={{display:"block",overflow:"visible"}}>
      <ellipse cx="42" cy="86" rx="30" ry="5" fill="#000" opacity=".25"/>
      <g style={{animation:"golemRumble 2s ease-in-out infinite",transformOrigin:"42px 44px"}}>
        {/* Legs — thick stone pillars */}
        <rect x="14" y="64" width="22" height="22" rx="4" fill="#5a3a1a"/>
        <rect x="48" y="64" width="22" height="22" rx="4" fill="#5a3a1a"/>
        <rect x="14" y="64" width="22" height="9"  rx="3" fill="#7a5a3a"/>
        <rect x="48" y="64" width="22" height="9"  rx="3" fill="#7a5a3a"/>
        {/* Stone crack lines on legs */}
        <line x1="22" y1="66" x2="20" y2="76" stroke="#3a2810" strokeWidth="1" opacity=".6"/>
        <line x1="58" y1="66" x2="62" y2="76" stroke="#3a2810" strokeWidth="1" opacity=".6"/>
        {/* Torso — massive block */}
        <rect x="4"  y="28" width="76" height="40" rx="6" fill="#5a3a1a"/>
        <rect x="7"  y="31" width="70" height="35" rx="5" fill="#7a5a3a"/>
        <rect x="10" y="33" width="64" height="18" rx="4" fill="#9a7a5a"/>
        {/* Torso cracks */}
        <path d="M30,36 L38,50 L44,44 L50,56" stroke="#3a2810" strokeWidth="2" fill="none" opacity=".65"/>
        <path d="M52,38 L58,48" stroke="#3a2810" strokeWidth="1.5" fill="none" opacity=".5"/>
        <line x1="7"  y1="48" x2="77" y2="48" stroke="#3a2810" strokeWidth="1.2" opacity=".4"/>
        {/* Glowing magma core */}
        <ellipse cx="42" cy="48" rx="12" ry="9" fill="#ff5500" opacity=".18"/>
        <ellipse cx="42" cy="48" rx="8"  ry="6" fill="#ff7700" opacity=".35"/>
        <ellipse cx="42" cy="48" rx="4"  ry="3" fill="#ffcc00" opacity=".7"/>
        <ellipse cx="42" cy="48" rx="2"  ry="1.5" fill="#fff" opacity=".5"/>
        {/* Arms — massive rectangular */}
        <g style={{animation:"golemFist 2.4s ease-in-out infinite",transformOrigin:"4px 42px"}}>
          <rect x="-8"  y="24" width="18" height="46" rx="6" fill="#5a3a1a"/>
          <rect x="-6"  y="26" width="14" height="42" rx="5" fill="#7a5a3a"/>
          <rect x="-8"  y="60" width="18" height="14" rx="4" fill="#4a2a10"/>
          <line x1="-4" y1="30" x2="-4" y2="58" stroke="#3a2810" strokeWidth="1" opacity=".5"/>
        </g>
        <g style={{animation:"golemFist 2.4s ease-in-out infinite .5s",transformOrigin:"80px 42px"}}>
          <rect x="74" y="24" width="18" height="46" rx="6" fill="#5a3a1a"/>
          <rect x="76" y="26" width="14" height="42" rx="5" fill="#7a5a3a"/>
          <rect x="74" y="60" width="18" height="14" rx="4" fill="#4a2a10"/>
          <line x1="88" y1="30" x2="88" y2="58" stroke="#3a2810" strokeWidth="1" opacity=".5"/>
        </g>
        {/* Stone texture horizontals */}
        <line x1="7"  y1="58" x2="77" y2="58" stroke="#3a2810" strokeWidth="1" opacity=".35"/>
        {/* Head */}
        <rect x="16" y="4"  width="52" height="28" rx="6" fill="#7a5a3a"/>
        <rect x="18" y="6"  width="48" height="24" rx="5" fill="#8a6a4a"/>
        <rect x="20" y="7"  width="44" height="12" rx="4" fill="#a08060"/>
        {/* Head cracks */}
        <line x1="42" y1="7" x2="44" y2="16" stroke="#4a3020" strokeWidth="1.2" opacity=".6"/>
        {/* Eye sockets */}
        <rect x="20" y="10" width="14" height="10" rx="3" fill="#111"/>
        <rect x="50" y="10" width="14" height="10" rx="3" fill="#111"/>
        <ellipse cx="27" cy="15" rx="5"   ry="4"   fill="#ff5500" opacity=".9"/>
        <ellipse cx="57" cy="15" rx="5"   ry="4"   fill="#ff5500" opacity=".9"/>
        <ellipse cx="27" cy="15" rx="3"   ry="2.5" fill="#ffbb00" opacity=".85"/>
        <ellipse cx="57" cy="15" rx="3"   ry="2.5" fill="#ffbb00" opacity=".85"/>
        <circle  cx="27" cy="15" r="1.2"  fill="#fff" opacity=".5"/>
        <circle  cx="57" cy="15" r="1.2"  fill="#fff" opacity=".5"/>
        {/* Mouth grille */}
        <rect x="22" y="25" width="40" height="6" rx="2.5" fill="#3a2810"/>
        {[25,30,35,40,45,50,55].map(x=><rect key={x} x={x} y="25.5" width="2.5" height="5" rx=".8" fill="#4a3018" opacity=".75"/>)}
        {/* Lava seeping from mouth */}
        <ellipse cx="42" cy="31" rx="6" ry="1.5" fill="#ff6600" opacity=".4"/>
      </g>
    </svg>
  );

  if (id==="wraith") return (
    <svg width={64*scale} height={96*scale} viewBox="0 0 64 96" style={{display:"block",overflow:"visible"}}>
      <g style={{animation:"wraithDrift 2.2s ease-in-out infinite",transformOrigin:"32px 48px"}}>
        {/* Wispy tails — 3 tendrils */}
        <path d="M16,60 Q8,72 12,88 Q18,80 22,88 Q28,78 32,88 Q36,78 42,88 Q46,80 52,88 Q56,72 48,60"
          fill="#1a1a88" opacity=".5"/>
        <path d="M20,64 Q16,76 20,86" stroke="#3344cc" strokeWidth="2" fill="none" opacity=".4" strokeLinecap="round"/>
        <path d="M44,64 Q48,76 44,86" stroke="#3344cc" strokeWidth="2" fill="none" opacity=".4" strokeLinecap="round"/>
        {/* Body layers */}
        <ellipse cx="32" cy="38" rx="26" ry="32" fill="#12126a" opacity=".45"/>
        <ellipse cx="32" cy="34" rx="22" ry="27" fill="#1e1e99" opacity=".55"/>
        <ellipse cx="32" cy="30" rx="18" ry="22" fill="#2a2aaa" opacity=".65"/>
        {/* Cloak hood */}
        <path d="M8,22 Q14,8 32,6 Q50,8 56,22 L54,36 Q44,28 32,28 Q20,28 10,36 Z" fill="#0d0d44" opacity=".9"/>
        <path d="M10,24 Q18,12 32,10 Q46,12 54,24" stroke="#4455dd" strokeWidth="2" fill="none" opacity=".55"/>
        {/* Ethereal arms */}
        <g style={{animation:"wraithWail 2.6s ease-in-out infinite",transformOrigin:"10px 44px"}}>
          <path d="M10,36 Q2,44 4,54 Q8,50 10,56 Q14,50 14,44 Z" fill="#2233bb" opacity=".75"/>
          <path d="M4,54 Q2,60 5,64"  stroke="#5566cc" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity=".7"/>
          <path d="M10,56 Q9,62 12,65" stroke="#5566cc" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity=".7"/>
          <path d="M14,52 Q14,58 17,62" stroke="#5566cc" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity=".6"/>
        </g>
        <g style={{animation:"wraithWail 2.6s ease-in-out infinite .4s",transformOrigin:"54px 44px"}}>
          <path d="M54,36 Q62,44 60,54 Q56,50 54,56 Q50,50 50,44 Z" fill="#2233bb" opacity=".75"/>
          <path d="M60,54 Q62,60 59,64"  stroke="#5566cc" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity=".7"/>
          <path d="M54,56 Q55,62 52,65" stroke="#5566cc" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity=".7"/>
          <path d="M50,52 Q50,58 47,62" stroke="#5566cc" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity=".6"/>
        </g>
        {/* Face */}
        <ellipse cx="32" cy="26" rx="14" ry="16" fill="#1a1a88" opacity=".92"/>
        {/* Piercing eyes */}
        <ellipse cx="25" cy="23" rx="5"   ry="6.5" fill="#0022aa" opacity=".85"/>
        <ellipse cx="39" cy="23" rx="5"   ry="6.5" fill="#0022aa" opacity=".85"/>
        <ellipse cx="25" cy="23" rx="3.5" ry="5"   fill="#22ccff" opacity=".95"/>
        <ellipse cx="39" cy="23" rx="3.5" ry="5"   fill="#22ccff" opacity=".95"/>
        <circle  cx="25" cy="23" r="2.5"  fill="#aaeeff"/>
        <circle  cx="39" cy="23" r="2.5"  fill="#aaeeff"/>
        <circle  cx="25.8" cy="21.5" r="1.1" fill="#fff" opacity=".85"/>
        <circle  cx="39.8" cy="21.5" r="1.1" fill="#fff" opacity=".85"/>
        {/* Wailing mouth */}
        <ellipse cx="32" cy="34" rx="7"   ry="5.5" fill="#00001a"/>
        <ellipse cx="32" cy="35" rx="4.5" ry="3.5" fill="#1122aa" opacity=".6"/>
        {/* Screech lines from mouth */}
        <line x1="26" y1="38" x2="22" y2="44" stroke="#4455cc" strokeWidth="1" opacity=".4" strokeLinecap="round"/>
        <line x1="32" y1="40" x2="32" y2="46" stroke="#4455cc" strokeWidth="1" opacity=".4" strokeLinecap="round"/>
        <line x1="38" y1="38" x2="42" y2="44" stroke="#4455cc" strokeWidth="1" opacity=".4" strokeLinecap="round"/>
      </g>
    </svg>
  );

  if (id==="eye") return (
    <svg width={80*scale} height={80*scale} viewBox="0 0 80 80" style={{display:"block",overflow:"visible"}}>
      {/* Outer glow */}
      <ellipse cx="40" cy="40" rx="38" ry="32" fill="#440066" opacity=".2"/>
      {/* Long outer tentacles */}
      <g style={{animation:"eyeTendril 7s linear infinite",transformOrigin:"40px 40px"}}>
        {[0,36,72,108,144,180,216,252,288,324].map((deg,i)=>{
          const r=deg*Math.PI/180;
          return <path key={i}
            d={`M40,40 Q${40+Math.cos(r)*24},${40+Math.sin(r)*22} ${40+Math.cos(r)*38},${40+Math.sin(r)*34}`}
            stroke="#990099" strokeWidth={i%2===0?2.5:1.5} fill="none" opacity={i%2===0?.65:.4} strokeLinecap="round"/>;
        })}
      </g>
      {/* Counter-rotating short veins */}
      <g style={{animation:"eyeTendril 10s linear infinite reverse",transformOrigin:"40px 40px"}}>
        {[18,54,90,126,162,198,234,270,306,342].map((deg,i)=>{
          const r=deg*Math.PI/180;
          return <line key={i} x1="40" y1="40"
            x2={40+Math.cos(r)*22} y2={40+Math.sin(r)*20}
            stroke="#cc00cc" strokeWidth="1.2" opacity=".35"/>;
        })}
      </g>
      {/* Eyeball body */}
      <ellipse cx="40" cy="40" rx="30" ry="24" fill="#1a0030"/>
      <ellipse cx="40" cy="40" rx="26" ry="20" fill="#550077"/>
      <ellipse cx="40" cy="40" rx="22" ry="17" fill="#7700aa"/>
      {/* Iris — pulsing */}
      <g style={{animation:"eyeIris 1.6s ease-in-out infinite",transformOrigin:"40px 40px"}}>
        <circle cx="40" cy="40" r="16" fill="#bb00dd"/>
        <circle cx="40" cy="40" r="12" fill="#dd00ff"/>
        {/* Iris ring pattern */}
        {[0,45,90,135,180,225,270,315].map((deg,i)=>{
          const r=deg*Math.PI/180;
          return <line key={i} x1="40" y1="40"
            x2={40+Math.cos(r)*11} y2={40+Math.sin(r)*11}
            stroke="#ee66ff" strokeWidth=".8" opacity=".4"/>;
        })}
      </g>
      {/* Slit pupil */}
      <ellipse cx="40" cy="40" rx="4"  ry="9"  fill="#0d000d"/>
      <ellipse cx="40" cy="40" rx="2"  ry="6"  fill="#220022"/>
      {/* Highlight cluster */}
      <circle cx="34" cy="33" r="4"   fill="#ff66ff" opacity=".45"/>
      <circle cx="34" cy="33" r="2"   fill="#fff"    opacity=".4"/>
      <circle cx="46" cy="35" r="2"   fill="#fff"    opacity=".2"/>
      {/* Eyelid folds */}
      <path d="M10,40 Q24,22 40,22 Q56,22 70,40" stroke="#220033" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <path d="M10,40 Q24,58 40,58 Q56,58 70,40" stroke="#220033" strokeWidth="4" fill="none" strokeLinecap="round"/>
      {/* Flesh veins on eyelids */}
      <path d="M16,38 Q24,32 32,36" stroke="#550055" strokeWidth="1" fill="none" opacity=".5"/>
      <path d="M48,36 Q56,32 64,38" stroke="#550055" strokeWidth="1" fill="none" opacity=".5"/>
      {/* Outer glow ring */}
      <ellipse cx="40" cy="40" rx="30" ry="24" fill="none" stroke="#cc00ff" strokeWidth="1.5" opacity=".35" style={{animation:"eyePulse 2s ease-in-out infinite"}}/>
    </svg>
  );

  if (id==="dragon") return (
    <svg width={110*scale} height={88*scale} viewBox="0 0 110 88" style={{display:"block",overflow:"visible"}}>
      <ellipse cx="55" cy="86" rx="36" ry="5" fill="#000" opacity=".22"/>
      {/* Left wing */}
      <g style={{animation:"dragonWingL 1.3s ease-in-out infinite",transformOrigin:"55px 34px"}}>
        <path d="M55,34 L4,4 L22,48 Z" fill="#8a1808" opacity=".9"/>
        <path d="M55,34 L4,4 L14,28 Z" fill="#aa2210" opacity=".65"/>
        <path d="M55,34 L14,28 L22,48" fill="#7a1408" opacity=".4"/>
        <line x1="55" y1="34" x2="4"  y2="4"  stroke="#660e06" strokeWidth="2"   opacity=".6"/>
        <line x1="55" y1="34" x2="14" y2="28" stroke="#660e06" strokeWidth="1.5" opacity=".45"/>
        <line x1="55" y1="34" x2="22" y2="48" stroke="#660e06" strokeWidth="1.5" opacity=".45"/>
      </g>
      {/* Right wing */}
      <g style={{animation:"dragonWingR 1.3s ease-in-out infinite",transformOrigin:"55px 34px"}}>
        <path d="M55,34 L106,4 L88,48 Z" fill="#8a1808" opacity=".9"/>
        <path d="M55,34 L106,4 L96,28 Z" fill="#aa2210" opacity=".65"/>
        <path d="M55,34 L96,28 L88,48" fill="#7a1408" opacity=".4"/>
        <line x1="55" y1="34" x2="106" y2="4"  stroke="#660e06" strokeWidth="2"   opacity=".6"/>
        <line x1="55" y1="34" x2="96"  y2="28" stroke="#660e06" strokeWidth="1.5" opacity=".45"/>
        <line x1="55" y1="34" x2="88"  y2="48" stroke="#660e06" strokeWidth="1.5" opacity=".45"/>
      </g>
      {/* Tail */}
      <path d="M70,70 Q88,74 96,68 Q102,62 100,56" stroke="#cc2211" strokeWidth="10" fill="none" strokeLinecap="round"/>
      <path d="M100,56 L108,50 L102,60 Z" fill="#aa1808"/>
      {/* Body */}
      <ellipse cx="55" cy="58" rx="30" ry="22" fill="#bb2010"/>
      <ellipse cx="55" cy="56" rx="27" ry="19" fill="#cc2211"/>
      <ellipse cx="55" cy="55" rx="24" ry="16" fill="#dd3322"/>
      {/* Belly plates */}
      <ellipse cx="55" cy="62" rx="16" ry="10" fill="#ff9966" opacity=".45"/>
      {[55,62,68].map((y,i)=>(
        <ellipse key={y} cx="55" cy={y} rx={14-i*3} ry="3.5" fill="#ffaa55" opacity={.18+i*.08}/>
      ))}
      {/* Scale texture */}
      {[[44,52],[55,50],[66,52],[48,60],[62,60]].map(([x,y],i)=>(
        <path key={i} d={`M${x-4},${y} Q${x},${y-4} ${x+4},${y}`} stroke="#aa1a08" strokeWidth="1" fill="none" opacity=".4"/>
      ))}
      {/* Legs */}
      <path d="M38,72 L30,82 L44,86 L42,74 Z" fill="#bb2010"/>
      <path d="M72,72 L80,82 L66,86 L68,74 Z" fill="#bb2010"/>
      {/* Claws */}
      {[30,34,38].map(x=><line key={x} x1={x} y1="86" x2={x-2} y2="90" stroke="#770000" strokeWidth="2" strokeLinecap="round"/>)}
      {[72,76,80].map(x=><line key={x} x1={x} y1="86" x2={x+2} y2="90" stroke="#770000" strokeWidth="2" strokeLinecap="round"/>)}
      {/* Neck + head */}
      <g style={{animation:"dragonHead 1.8s ease-in-out infinite",transformOrigin:"55px 34px"}}>
        {/* Neck */}
        <ellipse cx="55" cy="38" rx="13" ry="20" fill="#cc2211"/>
        <ellipse cx="55" cy="37" rx="10" ry="17" fill="#dd3322"/>
        {[20,25,30,36].map(y=>(
          <ellipse key={y} cx="55" cy={y} rx="8" ry="3" fill="#ff7744" opacity=".22"/>
        ))}
        {/* Head */}
        <ellipse cx="55" cy="16" rx="22" ry="16" fill="#cc2211"/>
        <ellipse cx="55" cy="15" rx="19" ry="13" fill="#dd3322"/>
        <ellipse cx="55" cy="14" rx="16" ry="11" fill="#ee4433"/>
        {/* Horns — swept back */}
        <path d="M42,8 L32,-4 L44,9"  fill="#7a1008"/>
        <path d="M68,8 L78,-4 L66,9"  fill="#7a1008"/>
        <path d="M42,8 L33,-2 L44,10" fill="#aa2010" opacity=".6"/>
        <path d="M68,8 L77,-2 L66,10" fill="#aa2010" opacity=".6"/>
        {/* Brow spikes */}
        <polygon points="46,8 44,2 48,8" fill="#880e06"/>
        <polygon points="64,8 66,2 62,8" fill="#880e06"/>
        {/* Eyes — amber slit */}
        <ellipse cx="47" cy="14" rx="6.5" ry="5" fill="#ffcc00"/>
        <ellipse cx="63" cy="14" rx="6.5" ry="5" fill="#ffcc00"/>
        <ellipse cx="47" cy="14" rx="5"   ry="4" fill="#ff9900"/>
        <ellipse cx="63" cy="14" rx="5"   ry="4" fill="#ff9900"/>
        <ellipse cx="47" cy="14" rx="2"   ry="4" fill="#111"/>
        <ellipse cx="63" cy="14" rx="2"   ry="4" fill="#111"/>
        <circle  cx="46" cy="12.5" r="1.2" fill="#fff" opacity=".45"/>
        <circle  cx="62" cy="12.5" r="1.2" fill="#fff" opacity=".45"/>
        {/* Nostrils */}
        <ellipse cx="51" cy="22" rx="1.8" ry="1.4" fill="#991808"/>
        <ellipse cx="59" cy="22" rx="1.8" ry="1.4" fill="#991808"/>
        {/* Jaw */}
        <path d="M38,24 L42,30 L55,28 L68,30 L72,24" fill="#bb2010" stroke="#991808" strokeWidth="1"/>
        {[42,47,52,57,62,67].map(x=><polygon key={x} points={`${x},28 ${x+1.5},33 ${x+3},28`} fill="#fffff0"/>)}
        {/* Fire breath */}
        <g style={{animation:"dragonBreath 2.4s ease-in-out infinite 1s"}}>
          <ellipse cx="55" cy="34" rx="8" ry="3" fill="#ff6600" opacity=".35"/>
          <ellipse cx="55" cy="36" rx="5" ry="2" fill="#ffaa00" opacity=".3"/>
        </g>
      </g>
    </svg>
  );

  return <div style={{fontSize:60*scale,lineHeight:1,filter:`drop-shadow(0 0 12px ${e.color})`}}>{e.emoji}</div>;
}

/* ─── GAME ICONS — SVG replacements for all emoji ────────────── */
function Icon({ type, size=28, color }) {
  const s=size, c=color;
  switch(type){
    /* ── WEAPONS ── */
    case"sword":return(
      <svg width={s} height={s} viewBox="0 0 28 28" style={{display:"block"}}>
        {/* Blade — tapered steel with fuller */}
        <polygon points="24,2 26,5 10,24 7,22" fill={c||"#c8d8e8"}/>
        <line x1="23" y1="4" x2="11" y2="22" stroke="#88aabb" strokeWidth="1.3" strokeLinecap="round" opacity=".5"/>
        <line x1="25" y1="3" x2="9" y2="23" stroke="#ffffff" strokeWidth=".9" strokeLinecap="round" opacity=".55"/>
        {/* Crossguard with quillons */}
        <line x1="4" y1="18" x2="14" y2="26" stroke={c||"#bb8818"} strokeWidth="5" strokeLinecap="round"/>
        <line x1="5" y1="18" x2="13" y2="25" stroke="#ffdd55" strokeWidth="1.4" strokeLinecap="round" opacity=".45"/>
        <circle cx="3" cy="17" r="2.5" fill={c||"#ddaa22"}/>
        <circle cx="15" cy="27" r="2.5" fill={c||"#ddaa22"}/>
        {/* Grip with leather wrap */}
        <line x1="10.5" y1="23" x2="5.5" y2="27.5" stroke="#2a1005" strokeWidth="3.8" strokeLinecap="round"/>
        <line x1="9.5" y1="22.5" x2="8" y2="24" stroke="#7a3a10" strokeWidth="1.2" strokeLinecap="round" opacity=".9"/>
        <line x1="8" y1="24.5" x2="6.5" y2="26" stroke="#7a3a10" strokeWidth="1.2" strokeLinecap="round" opacity=".9"/>
        {/* Pommel */}
        <circle cx="4.5" cy="27.5" r="2.8" fill={c||"#cc9920"}/>
        <circle cx="3.8" cy="26.8" r="1.1" fill="#ffee60" opacity=".6"/>
      </svg>
    );
    case"hammer":return(
      <svg width={s} height={s} viewBox="0 0 28 28" style={{display:"block"}}>
        {/* Haft with leather wrap */}
        <line x1="4" y1="27" x2="16" y2="13" stroke={c||"#7a4a22"} strokeWidth="4" strokeLinecap="round"/>
        <line x1="5.5" y1="25.5" x2="7.5" y2="23.5" stroke="#9a6030" strokeWidth="1.3" strokeLinecap="round" opacity=".7"/>
        <line x1="8" y1="23" x2="10" y2="21" stroke="#9a6030" strokeWidth="1.3" strokeLinecap="round" opacity=".7"/>
        <line x1="10.5" y1="20.5" x2="12.5" y2="18.5" stroke="#9a6030" strokeWidth="1.3" strokeLinecap="round" opacity=".7"/>
        {/* Heavy head */}
        <rect x="13" y="4" width="14" height="12" rx="2" fill={c||"#556677"}/>
        <rect x="13.5" y="4.5" width="13" height="5" rx="1.5" fill={c||"#7a8fa8"} opacity=".85"/>
        <line x1="26.5" y1="5" x2="26.5" y2="15" stroke="#ccddee" strokeWidth="2.5" strokeLinecap="round" opacity=".7"/>
        {/* Rear spike */}
        <polygon points="13,4 13,8 10,6" fill={c||"#6a7a8a"}/>
        {/* Head collar */}
        <rect x="13" y="11" width="6" height="5" rx="1" fill={c||"#3a4a5a"}/>
        <line x1="13" y1="13" x2="19" y2="13" stroke="#556677" strokeWidth="1" opacity=".6"/>
        <circle cx="15" cy="7" r="1.1" fill="#445566" opacity=".7"/>
        <circle cx="23" cy="7" r="1.1" fill="#445566" opacity=".7"/>
      </svg>
    );
    case"daggers":return(
      <svg width={s} height={s} viewBox="0 0 28 28" style={{display:"block"}}>
        {/* Dagger A — tip top-right */}
        <polygon points="25,2 27,5 11,22 8,20" fill={c||"#c8d8e8"}/>
        <line x1="26" y1="3.5" x2="10" y2="21" stroke="#ffffff" strokeWidth=".9" strokeLinecap="round" opacity=".5"/>
        <line x1="23" y1="5" x2="13" y2="18" stroke="#8aaabb" strokeWidth="1" strokeLinecap="round" opacity=".4"/>
        <line x1="14" y1="14" x2="7" y2="20" stroke={c||"#ccaa22"} strokeWidth="3.5" strokeLinecap="round"/>
        <circle cx="6" cy="20.5" r="2" fill={c||"#ddbb33"}/>
        <circle cx="15" cy="13.5" r="2" fill={c||"#ddbb33"}/>
        <line x1="11" y1="20" x2="6" y2="25" stroke="#2a1005" strokeWidth="3.5" strokeLinecap="round"/>
        <line x1="10.5" y1="20" x2="9" y2="21.5" stroke="#7a3a10" strokeWidth="1.1" strokeLinecap="round" opacity=".8"/>
        <line x1="8.5" y1="22" x2="7" y2="23.5" stroke="#7a3a10" strokeWidth="1.1" strokeLinecap="round" opacity=".8"/>
        <circle cx="5.5" cy="25.5" r="2.2" fill={c||"#ccaa22"}/>
        {/* Dagger B — tip top-left */}
        <polygon points="3,2 1,5 17,22 20,20" fill={c||"#c8d8e8"}/>
        <line x1="2" y1="3.5" x2="18" y2="21" stroke="#ffffff" strokeWidth=".9" strokeLinecap="round" opacity=".5"/>
        <line x1="5" y1="5" x2="15" y2="18" stroke="#8aaabb" strokeWidth="1" strokeLinecap="round" opacity=".4"/>
        <line x1="14" y1="14" x2="21" y2="20" stroke={c||"#ccaa22"} strokeWidth="3.5" strokeLinecap="round"/>
        <circle cx="22" cy="20.5" r="2" fill={c||"#ddbb33"}/>
        <line x1="17" y1="20" x2="22" y2="25" stroke="#2a1005" strokeWidth="3.5" strokeLinecap="round"/>
        <line x1="17.5" y1="20" x2="19" y2="21.5" stroke="#7a3a10" strokeWidth="1.1" strokeLinecap="round" opacity=".8"/>
        <line x1="19.5" y1="22" x2="21" y2="23.5" stroke="#7a3a10" strokeWidth="1.1" strokeLinecap="round" opacity=".8"/>
        <circle cx="22.5" cy="25.5" r="2.2" fill={c||"#ccaa22"}/>
      </svg>
    );
    case"staff":return(
      <svg width={s} height={s} viewBox="0 0 28 28" style={{display:"block"}}>
        {/* Gnarled shaft */}
        <line x1="14" y1="27" x2="13" y2="11" stroke={c||"#6a3e18"} strokeWidth="4" strokeLinecap="round"/>
        <line x1="14.5" y1="26" x2="13.5" y2="12" stroke="#9a6030" strokeWidth="1.2" strokeLinecap="round" opacity=".5"/>
        <ellipse cx="13.5" cy="20" rx="2.8" ry="1.3" fill="#4a2e0a" opacity=".6"/>
        <line x1="12" y1="16" x2="15" y2="16" stroke="#7733cc" strokeWidth="1.1" opacity=".6"/>
        <line x1="13.5" y1="15" x2="13.5" y2="17" stroke="#7733cc" strokeWidth="1.1" opacity=".6"/>
        {/* Crown prongs */}
        <line x1="13" y1="11" x2="7" y2="6" stroke={c||"#6622aa"} strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="13" y1="10" x2="13" y2="5" stroke={c||"#6622aa"} strokeWidth="2" strokeLinecap="round"/>
        <line x1="13" y1="11" x2="19" y2="6" stroke={c||"#6622aa"} strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="13" y1="11" x2="8" y2="9" stroke={c||"#5511aa"} strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="13" y1="11" x2="18" y2="9" stroke={c||"#5511aa"} strokeWidth="1.8" strokeLinecap="round"/>
        {/* Orb glow + orb */}
        <circle cx="13" cy="5" r="6.5" fill={c||"#9922dd"} opacity=".2"/>
        <circle cx="13" cy="5" r="5" fill={c||"#9933ee"} opacity=".45"/>
        <circle cx="13" cy="5" r="4" fill={c||"#cc55ff"}/>
        <circle cx="11.5" cy="3.5" r="2.2" fill="#ffffff" opacity=".38"/>
        <circle cx="11" cy="3" r="1" fill="#ffffff" opacity=".65"/>
        <line x1="18" y1="1" x2="19.5" y2="0" stroke="#ee88ff" strokeWidth="1.5" strokeLinecap="round" opacity=".8"/>
        <line x1="19" y1="3" x2="21" y2="3" stroke="#ee88ff" strokeWidth="1.5" strokeLinecap="round" opacity=".7"/>
      </svg>
    );
    case"bow":return(
      <svg width={s} height={s} viewBox="0 0 28 28" style={{display:"block"}}>
        {/* Recurve bow stave */}
        <path d="M7,2 Q1,6 2,14 Q1,22 7,26" stroke={c||"#7a4a22"} strokeWidth="4" fill="none" strokeLinecap="round"/>
        <path d="M7,2 Q3,5 3,10" stroke={c||"#aa7030"} strokeWidth="2" fill="none" strokeLinecap="round" opacity=".55"/>
        <path d="M3,18 Q3,23 7,26" stroke={c||"#aa7030"} strokeWidth="2" fill="none" strokeLinecap="round" opacity=".55"/>
        {/* Recurve tip curves */}
        <path d="M7,2 Q4,1 5,3" stroke={c||"#886030"} strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M7,26 Q4,27 5,25" stroke={c||"#886030"} strokeWidth="2" fill="none" strokeLinecap="round"/>
        {/* String */}
        <line x1="7" y1="2" x2="7" y2="26" stroke={c||"#d8c888"} strokeWidth="1.5" opacity=".9"/>
        {/* Arrow shaft */}
        <line x1="7" y1="14" x2="27" y2="14" stroke={c||"#9a6a20"} strokeWidth="2" strokeLinecap="round"/>
        {/* Broadhead */}
        <polygon points="28,14 22,11 23,14 22,17" fill={c||"#b8c8d8"}/>
        <line x1="28" y1="14" x2="22" y2="11" stroke="#ddeeff" strokeWidth=".8" opacity=".7"/>
        {/* Fletching */}
        <path d="M7,14 L7,10 L12,14 Z" fill={c||"#cc2222"}/>
        <path d="M7,14 L7,18 L12,14 Z" fill={c||"#cc2222"}/>
        <path d="M8,14 L8,11 L12,14 Z" fill="#ff4433" opacity=".5"/>
        <rect x="6" y="12.5" width="2.5" height="3" rx=".5" fill={c||"#553010"}/>
      </svg>
    );
    case"boots":return(
      <svg width={s} height={s} viewBox="0 0 28 28" style={{display:"block"}}>
        {/* Armored shin plate */}
        <rect x="8" y="3" width="8" height="13" rx="2.5" fill={c||"#5a6a7a"}/>
        <rect x="8.5" y="3.5" width="7" height="6" rx="2" fill={c||"#7a8fa8"} opacity=".85"/>
        <circle cx="10" cy="7" r="1" fill="#334455" opacity=".8"/>
        <circle cx="14" cy="7" r="1" fill="#334455" opacity=".8"/>
        <circle cx="10" cy="11" r="1" fill="#334455" opacity=".8"/>
        <circle cx="14" cy="11" r="1" fill="#334455" opacity=".8"/>
        {/* Knee cap */}
        <ellipse cx="12" cy="3.5" rx="4.5" ry="2.5" fill={c||"#6a7a8a"}/>
        <ellipse cx="12" cy="3.5" rx="3.5" ry="1.5" fill={c||"#8aaabb"} opacity=".75"/>
        {/* Ankle band */}
        <rect x="7.5" y="15.5" width="9" height="3" rx="1.5" fill={c||"#4a5a6a"}/>
        <line x1="8" y1="17" x2="16" y2="17" stroke="#6a7a8a" strokeWidth=".8" opacity=".5"/>
        {/* Boot body */}
        <path d="M8,18 L8,22 Q8,25 13,25 L25,25 L25,22 Q18,22 17,19 L16,18 Z" fill={c||"#4a5a6a"}/>
        <path d="M12,24 Q10,24 9,26 L25,26 L25,24 Z" fill={c||"#6a7a8a"}/>
        <rect x="8" y="25.5" width="17" height="2.5" rx="1.2" fill="#2a3344"/>
        <line x1="14" y1="24.5" x2="20" y2="24.5" stroke="#8a9aaa" strokeWidth=".8" opacity=".5"/>
      </svg>
    );
    case"axe":return(
      <svg width={s} height={s} viewBox="0 0 28 28" style={{display:"block"}}>
        {/* Haft with binding */}
        <line x1="4" y1="27" x2="19" y2="9" stroke={c||"#7a4a22"} strokeWidth="4" strokeLinecap="round"/>
        <line x1="5" y1="26" x2="18" y2="10.5" stroke="#9a6030" strokeWidth="1.2" strokeLinecap="round" opacity=".5"/>
        <line x1="7" y1="24" x2="9" y2="22" stroke="#cc8833" strokeWidth="2" strokeLinecap="round" opacity=".7"/>
        <line x1="10" y1="21" x2="12" y2="19" stroke="#cc8833" strokeWidth="2" strokeLinecap="round" opacity=".6"/>
        {/* Large crescent blade */}
        <path d="M16,7 Q20,1 27,3 Q29,12 26,19 Q21,23 16,20 Q23,14 22,8 Q20,5 16,7 Z" fill={c||"#7a8a9a"}/>
        <path d="M27,3 Q29,12 26,19" stroke="#ccddee" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity=".8"/>
        <path d="M16,7 Q20,1 27,3" stroke="#aabbcc" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity=".6"/>
        {/* Beard hook */}
        <path d="M16,20 Q21,25 14,27 Q12,23 17,21" fill={c||"#6a7a8a"}/>
        <path d="M14,27 Q11,24 16,21" stroke="#aabbcc" strokeWidth=".8" fill="none" strokeLinecap="round" opacity=".5"/>
        {/* Blade fuller */}
        <path d="M22,6 Q26,12 24,18" stroke="#8a9aaa" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity=".4"/>
        <circle cx="17.5" cy="10.5" r="1.5" fill="#445566" opacity=".8"/>
      </svg>
    );
    case"spear":return(
      <svg width={s} height={s} viewBox="0 0 28 28" style={{display:"block"}}>
        {/* Shaft */}
        <line x1="3" y1="27" x2="21" y2="7" stroke={c||"#7a4a22"} strokeWidth="3.5" strokeLinecap="round"/>
        <line x1="4" y1="26" x2="20" y2="8" stroke="#9a6030" strokeWidth="1.1" strokeLinecap="round" opacity=".5"/>
        <line x1="8" y1="22" x2="10" y2="20" stroke="#cc8833" strokeWidth="2.5" strokeLinecap="round" opacity=".7"/>
        {/* Socket collar */}
        <line x1="17" y1="12" x2="20" y2="9" stroke={c||"#3a4a5a"} strokeWidth="4" strokeLinecap="round"/>
        {/* Broad leaf head */}
        <path d="M20,9 Q22,5 26,2 Q28,6 27,10 Q26,14 22,15 Q25,9 24,5 Q22,3 20,9 Z" fill={c||"#b8c8d8"}/>
        <line x1="26" y1="3" x2="23" y2="12" stroke="#ddeeff" strokeWidth="1.5" strokeLinecap="round" opacity=".55"/>
        <path d="M20,9 Q22,5 26,2" stroke="#ffffff" strokeWidth="1" fill="none" strokeLinecap="round" opacity=".45"/>
        {/* Cross-guard lugs */}
        <line x1="20" y1="12" x2="16" y2="15" stroke={c||"#8a9aaa"} strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="22" y1="9" x2="25" y2="6" stroke={c||"#8a9aaa"} strokeWidth="2" strokeLinecap="round" opacity=".6"/>
        {/* Butt spike */}
        <polygon points="3,27 2,25 5,25" fill={c||"#9aaabb"}/>
      </svg>
    );
    case"rpg":return(
      <svg width={s} height={s} viewBox="0 0 28 28" style={{display:"block"}}>
        {/* Tube body */}
        <rect x="2" y="9" width="18" height="8" rx="4" fill={c||"#3a4a5a"}/>
        <rect x="3" y="9.5" width="17" height="3" rx="2" fill={c||"#556677"} opacity=".8"/>
        <line x1="6" y1="9" x2="6" y2="17" stroke="#556677" strokeWidth="1.2" opacity=".5"/>
        <line x1="10" y1="9" x2="10" y2="17" stroke="#556677" strokeWidth="1.2" opacity=".5"/>
        <line x1="14" y1="9" x2="14" y2="17" stroke="#556677" strokeWidth="1.2" opacity=".5"/>
        {/* Rear exhaust cone */}
        <polygon points="2,10 2,16 0,18 0,8" fill={c||"#2a3a4a"} opacity=".9"/>
        {/* Conical warhead */}
        <polygon points="20,9 28,13 20,17" fill={c||"#dd3311"}/>
        <polygon points="20,9 28,13 24,13" fill="#ff5533" opacity=".6"/>
        <line x1="27" y1="12" x2="28" y2="13" stroke="#ffaa55" strokeWidth="1.5" strokeLinecap="round" opacity=".8"/>
        {/* Pistol grip */}
        <rect x="9" y="17" width="5" height="7" rx="1.5" fill={c||"#2a3a44"}/>
        <line x1="10" y1="18" x2="13" y2="18" stroke="#445566" strokeWidth="1" opacity=".5"/>
        {/* Optical sight */}
        <rect x="7" y="6" width="8" height="3" rx="1.2" fill={c||"#334455"}/>
        <rect x="8" y="6.5" width="6" height="2" rx=".8" fill={c||"#4a5a6a"} opacity=".8"/>
        <line x1="11" y1="6" x2="11" y2="4.5" stroke={c||"#3a4a5a"} strokeWidth="1.8" strokeLinecap="round"/>
        <circle cx="11" cy="7.5" r=".7" fill="#cc3311" opacity=".9"/>
      </svg>
    );
    case"wand":return(
      <svg width={s} height={s} viewBox="0 0 28 28" style={{display:"block"}}>
        {/* Wand body */}
        <line x1="5" y1="26" x2="18" y2="10" stroke={c||"#5522bb"} strokeWidth="4.5" strokeLinecap="round"/>
        <line x1="6" y1="25" x2="17" y2="11" stroke="#8844dd" strokeWidth="1.5" strokeLinecap="round" opacity=".5"/>
        <line x1="9" y1="22" x2="11" y2="20" stroke="#cc88ff" strokeWidth="2" strokeLinecap="round" opacity=".7"/>
        <line x1="13" y1="17" x2="15" y2="15" stroke="#cc88ff" strokeWidth="2" strokeLinecap="round" opacity=".5"/>
        {/* Crystal tip glow */}
        <circle cx="20" cy="8" r="7" fill={c||"#aa33ff"} opacity=".18"/>
        <circle cx="20" cy="8" r="5.5" fill={c||"#bb55ff"} opacity=".35"/>
        {/* Crystal cluster main */}
        <polygon points="20,7 17,5 18,2 22,3 23,7" fill={c||"#cc77ff"}/>
        <polygon points="18,2 22,3 20,1" fill="#ffffff" opacity=".5"/>
        {/* Secondary crystals */}
        <polygon points="17,9 14,7 15,5 18,6" fill={c||"#aa55ee"} opacity=".9"/>
        <polygon points="23,9 26,7 25,5 22,7" fill={c||"#aa55ee"} opacity=".9"/>
        {/* Chaos sparkles */}
        <line x1="25" y1="3" x2="27" y2="1" stroke="#ff88ff" strokeWidth="1.8" strokeLinecap="round" opacity=".9"/>
        <line x1="26" y1="6" x2="28" y2="6" stroke="#ee66ff" strokeWidth="1.8" strokeLinecap="round" opacity=".8"/>
        <line x1="24" y1="1" x2="24" y2="0" stroke="#ff99ff" strokeWidth="1.8" strokeLinecap="round" opacity=".7"/>
        <line x1="13" y1="4" x2="12" y2="2" stroke="#dd55ff" strokeWidth="1.5" strokeLinecap="round" opacity=".7"/>
      </svg>
    );
    /* ── MAP NODES ── */
    case"combat":return(
      <svg width={s} height={s} viewBox="0 0 28 28" style={{display:"block"}}>
        {/* Sword A — tip top-left, guard+handle bottom-right */}
        <polygon points="3,2 5,2 25,20 23,22" fill={c||"#c8d8e8"} opacity=".95"/>
        <line x1="4" y1="2" x2="24" y2="21" stroke="#ffffff" strokeWidth=".9" strokeLinecap="round" opacity=".45"/>
        <line x1="19" y1="16" x2="27" y2="26" stroke={c||"#ccaa22"} strokeWidth="3.8" strokeLinecap="round"/>
        <circle cx="27" cy="27" r="2" fill={c||"#ddbb33"}/>
        {/* Sword B — tip top-right, guard+handle bottom-left */}
        <polygon points="25,2 23,2 3,20 5,22" fill={c||"#c8d8e8"} opacity=".95"/>
        <line x1="24" y1="2" x2="4" y2="21" stroke="#ffffff" strokeWidth=".9" strokeLinecap="round" opacity=".45"/>
        <line x1="9" y1="16" x2="1" y2="26" stroke={c||"#ccaa22"} strokeWidth="3.8" strokeLinecap="round"/>
        <circle cx="1" cy="27" r="2" fill={c||"#ddbb33"}/>
        {/* Clash sparks at crossing ~(14,11) */}
        <circle cx="14" cy="11" r="3" fill="#ffff88" opacity=".55"/>
        <circle cx="14" cy="11" r="1.5" fill="#ffffff" opacity=".9"/>
        <line x1="14" y1="11" x2="14" y2="4" stroke="#ffee33" strokeWidth="2" strokeLinecap="round" opacity=".9"/>
        <line x1="14" y1="11" x2="20" y2="5" stroke="#ffcc22" strokeWidth="1.5" strokeLinecap="round" opacity=".8"/>
        <line x1="14" y1="11" x2="8" y2="5" stroke="#ffcc22" strokeWidth="1.5" strokeLinecap="round" opacity=".8"/>
        <line x1="14" y1="11" x2="22" y2="11" stroke="#ffaa22" strokeWidth="1.3" strokeLinecap="round" opacity=".7"/>
        <line x1="14" y1="11" x2="6" y2="11" stroke="#ffaa22" strokeWidth="1.3" strokeLinecap="round" opacity=".7"/>
        <line x1="14" y1="11" x2="20" y2="17" stroke="#ff8811" strokeWidth="1.1" strokeLinecap="round" opacity=".6"/>
        <line x1="14" y1="11" x2="8" y2="17" stroke="#ff8811" strokeWidth="1.1" strokeLinecap="round" opacity=".6"/>
      </svg>
    );
    case"elite":return(
      <svg width={s} height={s} viewBox="0 0 28 28" style={{display:"block"}}>
        {/* Left horn — sweeping curved outward */}
        <path d="M8,12 Q4,7 3,2 Q6,5 9,9 Z" fill={c||"#551188"}/>
        <path d="M8,12 Q3,8 4,1" stroke={c||"#aa44dd"} strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        <path d="M8,12 Q5,8 5,2" stroke="#cc88ff" strokeWidth="1" fill="none" strokeLinecap="round" opacity=".5"/>
        {/* Right horn */}
        <path d="M20,12 Q24,7 25,2 Q22,5 19,9 Z" fill={c||"#551188"}/>
        <path d="M20,12 Q25,8 24,1" stroke={c||"#aa44dd"} strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        <path d="M20,12 Q23,8 23,2" stroke="#cc88ff" strokeWidth="1" fill="none" strokeLinecap="round" opacity=".5"/>
        {/* Skull cranium */}
        <path d="M5,18 Q5,9 14,8 Q23,9 23,18 L23,21 L5,21 Z" fill={c||"#220033"}/>
        <path d="M5,18 Q5,9 14,8 Q23,9 23,18" fill={c||"#441166"} opacity=".7"/>
        <path d="M5,18 Q5,9 14,8 Q23,9 23,18" fill="none" stroke={c||"#8833cc"} strokeWidth="1.5"/>
        {/* Eye sockets — glowing red */}
        <ellipse cx="10" cy="15.5" rx="3" ry="2.8" fill="#110005"/>
        <ellipse cx="10" cy="15.5" rx="2" ry="1.9" fill="#cc1122" opacity=".85"/>
        <ellipse cx="9.5" cy="15" rx=".9" ry=".8" fill="#ff4433" opacity=".9"/>
        <ellipse cx="18" cy="15.5" rx="3" ry="2.8" fill="#110005"/>
        <ellipse cx="18" cy="15.5" rx="2" ry="1.9" fill="#cc1122" opacity=".85"/>
        <ellipse cx="17.5" cy="15" rx=".9" ry=".8" fill="#ff4433" opacity=".9"/>
        {/* Nose cavity */}
        <path d="M12.5,18.5 L14,20.5 L15.5,18.5 Z" fill="#110005" opacity=".8"/>
        {/* Jaw */}
        <rect x="6" y="21" width="16" height="4.5" rx="2" fill={c||"#330044"}/>
        {/* Fangs */}
        <polygon points="8.5,21 10.5,21 9.5,25.5" fill={c||"#cc88ff"}/>
        <polygon points="13,21 15,21 14,25.5" fill={c||"#cc88ff"}/>
        <polygon points="17.5,21 19.5,21 18.5,25.5" fill={c||"#cc88ff"}/>
        <ellipse cx="14" cy="15" rx="11" ry="10" fill={c||"#7722bb"} opacity=".07"/>
      </svg>
    );
    case"rest":return(
      <svg width={s} height={s} viewBox="0 0 28 28" style={{display:"block"}}>
        {/* Crossed logs */}
        <line x1="3" y1="24" x2="18" y2="19" stroke={c||"#8a4a1a"} strokeWidth="4.5" strokeLinecap="round"/>
        <line x1="4" y1="23" x2="17" y2="18.5" stroke="#cc7730" strokeWidth="1.5" strokeLinecap="round" opacity=".4"/>
        <line x1="25" y1="24" x2="10" y2="19" stroke={c||"#8a4a1a"} strokeWidth="4.5" strokeLinecap="round"/>
        <line x1="24" y1="23" x2="11" y2="18.5" stroke="#cc7730" strokeWidth="1.5" strokeLinecap="round" opacity=".4"/>
        {/* Ember glow */}
        <ellipse cx="14" cy="21" rx="6" ry="2.2" fill="#ff5500" opacity=".35"/>
        {/* Outer flame */}
        <path d="M14,19 Q9,14 11,9 Q13,13 14,13 Q15,9 17,14 Q15,19 14,19 Z" fill={c||"#ff6600"} opacity=".85"/>
        {/* Mid flame */}
        <path d="M14,18 Q11,14 12,10 Q13.5,13.5 14,13.5 Q14.5,13.5 16,10 Q17,14 14,18 Z" fill={c||"#ff9922"} opacity=".9"/>
        {/* Inner flame */}
        <path d="M14,17 Q12,14 13,11 Q13.8,13.5 14,13.5 Q14.2,13.5 15,11 Q16,14 14,17 Z" fill={c||"#ffdd44"} opacity=".95"/>
        {/* White hot tip */}
        <path d="M14,16 Q13.3,13.5 14,12 Q14.7,13.5 14,16 Z" fill="#ffffff" opacity=".7"/>
        {/* Floating embers */}
        <circle cx="10" cy="8" r="1.1" fill="#ff8833" opacity=".7"/>
        <circle cx="18" cy="6" r=".9" fill="#ffaa33" opacity=".6"/>
        <circle cx="12" cy="5" r=".8" fill="#ff6622" opacity=".5"/>
        <circle cx="17" cy="10" r=".7" fill="#ffcc44" opacity=".6"/>
      </svg>
    );
    case"boss":return(
      <svg width={s} height={s} viewBox="0 0 28 28" style={{display:"block"}}>
        {/* Fire breath */}
        <ellipse cx="25" cy="18" rx="4.5" ry="3" fill="#ff5500" opacity=".4"/>
        <path d="M22,15 Q26,11 28,13 Q26,14 28,16.5 Q26,17.5 28,20 Q25,19 22,20 Z" fill="#ff4400" opacity=".75"/>
        <path d="M23,16 Q26,13.5 27.5,15 Q26,15.5 27.5,17 Q25.5,17 23,17 Z" fill="#ffcc00" opacity=".9"/>
        <circle cx="24" cy="15.5" r=".8" fill="#ffffff" opacity=".8"/>
        {/* Dorsal bony crests */}
        <polygon points="6,9 5,4 8,8" fill={c||"#cc4411"}/>
        <polygon points="11,7 11,2 13.5,6.5" fill={c||"#cc4411"}/>
        <polygon points="16,7 17,2 19,6" fill={c||"#cc4411"}/>
        {/* Dragon skull cranium */}
        <path d="M3,14 Q4,7 11,7 Q18,7 20,12 L20,20 L3,20 Z" fill={c||"#3a1a08"}/>
        <path d="M3,14 Q4,7 11,7 Q18,7 20,12" fill={c||"#6a3010"} opacity=".75"/>
        <path d="M3,14 Q4,7 11,7 Q18,7 20,12" fill="none" stroke="#8a4018" strokeWidth="1.3" opacity=".8"/>
        {/* Snout extension */}
        <path d="M20,12 Q24,11 25,13.5 L25,20 L20,20 Z" fill={c||"#4a2010"}/>
        <path d="M20,12 Q24,11 25,13.5" stroke="#7a4020" strokeWidth="1.2" fill="none"/>
        {/* Lower jaw */}
        <path d="M3.5,20 L3.5,23 Q13,24.5 25,22 L25,20 Z" fill={c||"#3a1a08"}/>
        {/* Teeth */}
        <polygon points="7.5,20 9.5,20 8.5,23" fill={c||"#c8b888"}/>
        <polygon points="12,20 14,20 13,23" fill={c||"#c8b888"}/>
        <polygon points="16.5,20 18.5,20 17.5,23" fill={c||"#c8b888"}/>
        {/* Large fang */}
        <polygon points="21.5,20 24,20 22.5,24" fill={c||"#eeeebb"}/>
        {/* Eye socket with fire glow */}
        <ellipse cx="9" cy="13.5" rx="3.8" ry="3.3" fill="#110400"/>
        <ellipse cx="9" cy="13.5" rx="2.3" ry="2" fill="#ff3300" opacity=".75"/>
        <ellipse cx="8.5" cy="13" rx="1" ry=".9" fill="#ffaa00" opacity=".9"/>
        {/* Nasal cavity */}
        <ellipse cx="23" cy="16" rx="1.3" ry="1" fill="#220800" opacity=".9"/>
        {/* Skull highlight */}
        <path d="M6,9 Q9,8 13,8 Q11,10 8,11 Z" fill="#9a5030" opacity=".35"/>
      </svg>
    );
    /* ── POTIONS ── */
    case"bomb":return(
      <svg width={s} height={s} viewBox="0 0 28 28" style={{display:"block"}}>
        <circle cx="13" cy="17" r="9" fill={c||"#333344"} stroke={c||"#555566"} strokeWidth="1.5"/>
        <path d="M13 8 Q16 4 20 3" stroke={c||"#cc8833"} strokeWidth="2" fill="none" strokeLinecap="round"/>
        <circle cx="20" cy="3" r="2" fill={c||"#ffcc44"} opacity=".9"/>
        <circle cx="10" cy="14" r="2.5" fill="#ffffff" opacity=".15"/>
      </svg>
    );
    case"frost":return(
      <svg width={s} height={s} viewBox="0 0 28 28" style={{display:"block"}}>
        <line x1="14" y1="3" x2="14" y2="25" stroke={c||"#88ddff"} strokeWidth="2" strokeLinecap="round"/>
        <line x1="3" y1="14" x2="25" y2="14" stroke={c||"#88ddff"} strokeWidth="2" strokeLinecap="round"/>
        <line x1="6" y1="6" x2="22" y2="22" stroke={c||"#88ddff"} strokeWidth="2" strokeLinecap="round"/>
        <line x1="22" y1="6" x2="6" y2="22" stroke={c||"#88ddff"} strokeWidth="2" strokeLinecap="round"/>
        {[[14,3],[14,25],[3,14],[25,14],[6,6],[22,22],[22,6],[6,22]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="2.2" fill={c||"#aaeeff"}/>)}
        <circle cx="14" cy="14" r="3" fill={c||"#ccf0ff"} opacity=".9"/>
      </svg>
    );
    case"power":return(
      <svg width={s} height={s} viewBox="0 0 28 28" style={{display:"block"}}>
        <path d="M10 24 L10 16 Q10 14 8 13 Q5 11 6 7 Q7 3 14 3 Q21 3 22 7 Q23 11 20 13 Q18 14 18 16 L18 24 Z" fill={c||"#553388"} stroke={c||"#8844cc"} strokeWidth="1.2"/>
        <path d="M10 16 Q10 14 8 13 Q5 11 6 7 Q7 3 14 3 Q21 3 22 7 Q23 11 20 13 Q18 14 18 16" fill={c||"#aa66ff"} opacity=".7"/>
        <rect x="10" y="22" width="8" height="3" rx="1.5" fill={c||"#7733aa"}/>
        <circle cx="14" cy="10" r="3" fill="#ffffff" opacity=".3"/>
      </svg>
    );
    case"mend":return(
      <svg width={s} height={s} viewBox="0 0 28 28" style={{display:"block"}}>
        <path d="M14 22 Q6 16 6 11 Q6 6 11 6 Q13 6 14 8 Q15 6 17 6 Q22 6 22 11 Q22 16 14 22Z" fill={c||"#dd3333"} opacity=".9"/>
        <path d="M14 20 Q8 15 8 11 Q8 8 11 8 Q13 8 14 10 Q15 8 17 8 Q20 8 20 11 Q20 15 14 20Z" fill={c||"#ff6666"} opacity=".7"/>
        <line x1="14" y1="11" x2="14" y2="17" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity=".8"/>
        <line x1="11" y1="14" x2="17" y2="14" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity=".8"/>
      </svg>
    );
    /* ── REWARDS / UI ── */
    case"heal_vial":return(
      <svg width={s} height={s} viewBox="0 0 28 28" style={{display:"block"}}>
        <path d="M11 4 L11 10 Q5 14 5 20 Q5 25 14 25 Q23 25 23 20 Q23 14 17 10 L17 4 Z" fill={c||"#226633"} stroke={c||"#44aa55"} strokeWidth="1.2"/>
        <path d="M11 12 Q6 16 6 20 Q6 24 14 24 Q22 24 22 20 Q22 16 17 12" fill={c||"#44cc66"} opacity=".8"/>
        <rect x="10" y="3" width="8" height="3" rx="1.5" fill={c||"#557766"}/>
        <ellipse cx="11" cy="19" rx="2" ry="3" fill="#ffffff" opacity=".2" transform="rotate(-20,11,19)"/>
      </svg>
    );
    case"heal_potion":return(
      <svg width={s} height={s} viewBox="0 0 28 28" style={{display:"block"}}>
        <path d="M10 4 L10 10 Q3 15 3 21 Q3 26 14 26 Q25 26 25 21 Q25 15 18 10 L18 4 Z" fill={c||"#883311"} stroke={c||"#cc4422"} strokeWidth="1.2"/>
        <path d="M10 12 Q4 17 4 21 Q4 25 14 25 Q24 25 24 21 Q24 17 18 12" fill={c||"#ff5533"} opacity=".8"/>
        <rect x="10" y="3" width="8" height="3" rx="1.5" fill={c||"#664422"}/>
        <ellipse cx="10" cy="19" rx="2.5" ry="4" fill="#ffffff" opacity=".2" transform="rotate(-20,10,19)"/>
      </svg>
    );
    case"str_shard":return(
      <svg width={s} height={s} viewBox="0 0 28 28" style={{display:"block"}}>
        <polygon points="14,2 18,10 26,10 20,16 22,24 14,20 6,24 8,16 2,10 10,10" fill={c||"#dd4422"} stroke={c||"#ff6644"} strokeWidth="1" opacity=".9"/>
        <polygon points="14,6 17,12 22,12 18,15 19.5,21 14,18 8.5,21 10,15 6,12 11,12" fill={c||"#ff8855"} opacity=".7"/>
        <line x1="14" y1="8" x2="14" y2="18" stroke="#ffffff" strokeWidth="1.5" opacity=".5"/>
      </svg>
    );
    case"hp_shard":return(
      <svg width={s} height={s} viewBox="0 0 28 28" style={{display:"block"}}>
        <path d="M14 22 Q5 16 5 10 Q5 4 11 4 Q13 4 14 6 Q15 4 17 4 Q23 4 23 10 Q23 16 14 22Z" fill={c||"#dd2233"} stroke={c||"#ff4455"} strokeWidth="1" opacity=".9"/>
        <path d="M14 19 Q7 14 7 10 Q7 6 11 6 Q13 6 14 8 Q15 6 17 6 Q21 6 21 10 Q21 14 14 19Z" fill={c||"#ff5566"} opacity=".7"/>
        <polygon points="14,10 15.5,13.5 19,13.5 16.5,15.5 17.5,19 14,17 10.5,19 11.5,15.5 9,13.5 12.5,13.5" fill="#ffffff" opacity=".35" transform="scale(0.7) translate(6,6)"/>
      </svg>
    );
    case"heart":return(
      <svg width={s} height={s} viewBox="0 0 16 16" style={{display:"block"}}>
        <path d="M8 13 Q2 9 2 5 Q2 2 5 2 Q6.5 2 8 4 Q9.5 2 11 2 Q14 2 14 5 Q14 9 8 13Z" fill={c||"#ff4455"}/>
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
const FALLBACK_GAMES = [
  { id:"fallback1", title:"Another Realm", url:"https://callumhyoung.github.io/gamejam/" }
];

/* ─── AUDIO ENGINE ───────────────────────────────────────────── */
const _AC = window.AudioContext || window.webkitAudioContext;
let _actx = null;
const _ac = () => { if (!_actx) _actx = new _AC(); if (_actx.state==='suspended') _actx.resume(); return _actx; };
const sfx = (() => {
  const p = fn => { try { fn(_ac()); } catch(_e){} };
  const D = ctx => ctx.destination;
  const O = (ctx,t,f) => { const o=ctx.createOscillator(); o.type=t; o.frequency.setValueAtTime(f,ctx.currentTime); return o; };
  const G = (ctx,v)   => { const g=ctx.createGain(); g.gain.setValueAtTime(v,ctx.currentTime); return g; };
  const LP= (ctx,f)   => { const n=ctx.createBiquadFilter(); n.type='lowpass';  n.frequency.value=f; return n; };
  const BP= (ctx,f,q) => { const n=ctx.createBiquadFilter(); n.type='bandpass'; n.frequency.value=f; n.Q.value=q||1; return n; };
  const NB= ctx => {
    const buf=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*.35),ctx.sampleRate);
    const d=buf.getChannelData(0); for(let i=0;i<d.length;i++) d[i]=Math.random()*2-1;
    const s=ctx.createBufferSource(); s.buffer=buf; return s;
  };
  return {
    // ── UI / navigation ──────────────────────────────────────────
    click:()=>p(ctx=>{
      const o=O(ctx,'sine',700),g=G(ctx,.12); o.connect(g); g.connect(D(ctx));
      const t=ctx.currentTime; o.frequency.exponentialRampToValueAtTime(200,t+.07);
      g.gain.exponentialRampToValueAtTime(.0001,t+.08); o.start(t); o.stop(t+.09);
    }),
    select:()=>p(ctx=>{
      [[0,.12,440],[.07,.1,550],[.14,.12,660]].forEach(([d,v,f])=>{
        const o=O(ctx,'sine',f),g=G(ctx,0),t=ctx.currentTime+d;
        o.connect(g); g.connect(D(ctx));
        g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(v,t+.02);
        g.gain.exponentialRampToValueAtTime(.0001,t+.15); o.start(t); o.stop(t+.16);
      });
    }),
    levelUp:()=>p(ctx=>{
      [523,659,784,1047,1319].forEach((f,i)=>{
        const o=O(ctx,'sine',f),g=G(ctx,0),t=ctx.currentTime+i*.1;
        o.connect(g); g.connect(D(ctx));
        g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(.18,t+.02);
        g.gain.exponentialRampToValueAtTime(.0001,t+.22); o.start(t); o.stop(t+.23);
      });
    }),
    mapNode:()=>p(ctx=>{
      const o=O(ctx,'sine',380),g=G(ctx,.1); o.connect(g); g.connect(D(ctx));
      const t=ctx.currentTime; o.frequency.exponentialRampToValueAtTime(620,t+.06);
      g.gain.exponentialRampToValueAtTime(.0001,t+.09); o.start(t); o.stop(t+.1);
    }),
    rest:()=>p(ctx=>{
      [330,440,550].forEach((f,i)=>{
        const o=O(ctx,'sine',f),g=G(ctx,0),t=ctx.currentTime+i*.14;
        o.connect(g); g.connect(D(ctx));
        g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(.1,t+.03);
        g.gain.exponentialRampToValueAtTime(.0001,t+.3); o.start(t); o.stop(t+.31);
      });
    }),
    combatStart:()=>p(ctx=>{
      [220,277,330,415].forEach((f,i)=>{
        const o=O(ctx,'sawtooth',f),lp=LP(ctx,2000),g=G(ctx,0),t=ctx.currentTime+i*.09;
        o.connect(lp); lp.connect(g); g.connect(D(ctx));
        g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(.15,t+.04);
        g.gain.exponentialRampToValueAtTime(.0001,t+.25); o.start(t); o.stop(t+.26);
      });
    }),
    reward:()=>p(ctx=>{
      [660,784,990].forEach((f,i)=>{
        const o=O(ctx,'sine',f),g=G(ctx,0),t=ctx.currentTime+i*.07;
        o.connect(g); g.connect(D(ctx));
        g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(.14,t+.02);
        g.gain.exponentialRampToValueAtTime(.0001,t+.15); o.start(t); o.stop(t+.16);
      });
    }),
    rewardWeapon:()=>p(ctx=>{
      [392,523,659,784,1047].forEach((f,i)=>{
        const o=O(ctx,'triangle',f),g=G(ctx,0),t=ctx.currentTime+i*.08;
        o.connect(g); g.connect(D(ctx));
        g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(.17,t+.02);
        g.gain.exponentialRampToValueAtTime(.0001,t+.22); o.start(t); o.stop(t+.23);
      });
    }),
    rewardHeal:()=>p(ctx=>{
      const o=O(ctx,'sine',440),g=G(ctx,.16); o.connect(g); g.connect(D(ctx));
      const t=ctx.currentTime; o.frequency.linearRampToValueAtTime(880,t+.18);
      g.gain.exponentialRampToValueAtTime(.0001,t+.25); o.start(t); o.stop(t+.26);
      const o2=O(ctx,'sine',660),g2=G(ctx,.1); o2.connect(g2); g2.connect(D(ctx));
      o2.start(t+.1); g2.gain.exponentialRampToValueAtTime(.0001,t+.28); o2.stop(t+.29);
    }),
    rewardStat:()=>p(ctx=>{
      [[0,330],[.09,440],[.18,550],[.27,660]].forEach(([d,f])=>{
        const o=O(ctx,'sine',f),g=G(ctx,.12),t=ctx.currentTime+d;
        o.connect(g); g.connect(D(ctx));
        g.gain.setValueAtTime(.12,t); g.gain.exponentialRampToValueAtTime(.0001,t+.18);
        o.start(t); o.stop(t+.19);
      });
    }),
    victory:()=>p(ctx=>{
      [392,494,587,740,880,1174].forEach((f,i)=>{
        const o=O(ctx,'sine',f),g=G(ctx,0),t=ctx.currentTime+i*.1;
        o.connect(g); g.connect(D(ctx));
        g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(.2,t+.02);
        g.gain.exponentialRampToValueAtTime(.0001,t+.22); o.start(t); o.stop(t+.23);
      });
    }),
    gameOver:()=>p(ctx=>{
      [330,277,220,165].forEach((f,i)=>{
        const o=O(ctx,'sawtooth',f),lp=LP(ctx,1200),g=G(ctx,0),t=ctx.currentTime+i*.18;
        o.connect(lp); lp.connect(g); g.connect(D(ctx));
        g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(.22,t+.05);
        g.gain.exponentialRampToValueAtTime(.0001,t+.28); o.start(t); o.stop(t+.29);
      });
    }),
    portal:()=>p(ctx=>{
      const o=O(ctx,'sine',180),g=G(ctx,.24); o.connect(g); g.connect(D(ctx));
      const t=ctx.currentTime; o.frequency.exponentialRampToValueAtTime(2400,t+.55);
      g.gain.setValueAtTime(.24,t); g.gain.exponentialRampToValueAtTime(.0001,t+.58);
      o.start(t); o.stop(t+.6);
    }),
    enemyDie:()=>p(ctx=>{
      [440,330,220,110].forEach((f,i)=>{
        const o=O(ctx,'sawtooth',f),lp=LP(ctx,1500),g=G(ctx,.18),t=ctx.currentTime+i*.07;
        o.connect(lp); lp.connect(g); g.connect(D(ctx));
        g.gain.setValueAtTime(.18,t); g.gain.exponentialRampToValueAtTime(.0001,t+.13);
        o.start(t); o.stop(t+.14);
      });
      const n=NB(_ac()),b=BP(_ac(),800,3),g2=G(_ac(),.2); n.connect(b); b.connect(g2); g2.connect(D(_ac()));
      const t=_ac().currentTime; g2.gain.exponentialRampToValueAtTime(.0001,t+.18); n.start(t); n.stop(t+.2);
    }),
    // ── SWORD / BEAT ─────────────────────────────────────────────
    swordWalk:()=>p(ctx=>{
      const n=NB(ctx),b=BP(ctx,300,6),g=G(ctx,.06); n.connect(b); b.connect(g); g.connect(D(ctx));
      const t=ctx.currentTime; g.gain.exponentialRampToValueAtTime(.0001,t+.07); n.start(t); n.stop(t+.08);
    }),
    swordKey:(step)=>p(ctx=>{
      const fs=[200,320,520]; const f=fs[Math.min(step,2)];
      const o=O(ctx,'sawtooth',f),lp=LP(ctx,3500),g=G(ctx,.15); o.connect(lp); lp.connect(g); g.connect(D(ctx));
      const t=ctx.currentTime; o.frequency.exponentialRampToValueAtTime(f*1.6,t+.08);
      g.gain.exponentialRampToValueAtTime(.0001,t+.11); o.start(t); o.stop(t+.12);
    }),
    swordBadKey:()=>p(ctx=>{
      const o=O(ctx,'square',180),g=G(ctx,.12); o.connect(g); g.connect(D(ctx));
      const t=ctx.currentTime; o.frequency.exponentialRampToValueAtTime(75,t+.11);
      g.gain.exponentialRampToValueAtTime(.0001,t+.13); o.start(t); o.stop(t+.14);
    }),
    swordPerfect:()=>p(ctx=>{
      [220,440,880].forEach((f,i)=>{
        const o=O(ctx,'sine',f),g=G(ctx,0),t=ctx.currentTime+i*.04;
        o.connect(g); g.connect(D(ctx));
        g.gain.setValueAtTime(.18,t); g.gain.exponentialRampToValueAtTime(.0001,t+.18);
        o.start(t); o.stop(t+.19);
      });
    }),
    // ── HAMMER / CHARGE ──────────────────────────────────────────
    hammerHold:()=>{
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
    hammerPerfect:()=>p(ctx=>{
      const o=O(ctx,'sine',100),g=G(ctx,.5); o.connect(g); g.connect(D(ctx));
      const t=ctx.currentTime; o.frequency.exponentialRampToValueAtTime(26,t+.32);
      g.gain.exponentialRampToValueAtTime(.0001,t+.36); o.start(t); o.stop(t+.37);
      const n=NB(ctx),b=BP(ctx,2200,3),g2=G(ctx,.3); n.connect(b); b.connect(g2); g2.connect(D(ctx));
      g2.gain.exponentialRampToValueAtTime(.0001,t+.16); n.start(t); n.stop(t+.17);
    }),
    hammerGood:()=>p(ctx=>{
      const o=O(ctx,'sine',70),g=G(ctx,.36); o.connect(g); g.connect(D(ctx));
      const t=ctx.currentTime; o.frequency.exponentialRampToValueAtTime(22,t+.24);
      g.gain.exponentialRampToValueAtTime(.0001,t+.28); o.start(t); o.stop(t+.29);
    }),
    hammerOvercharge:()=>p(ctx=>{
      const o=O(ctx,'square',220),g=G(ctx,.2); o.connect(g); g.connect(D(ctx));
      const t=ctx.currentTime; o.frequency.exponentialRampToValueAtTime(55,t+.24);
      g.gain.exponentialRampToValueAtTime(.0001,t+.27); o.start(t); o.stop(t+.28);
    }),
    // ── DAGGERS / RAPID ──────────────────────────────────────────
    daggerTap:()=>p(ctx=>{
      const n=NB(ctx),b=BP(ctx,3800,5),g=G(ctx,.1); n.connect(b); b.connect(g); g.connect(D(ctx));
      const t=ctx.currentTime; g.gain.exponentialRampToValueAtTime(.0001,t+.04); n.start(t); n.stop(t+.05);
    }),
    daggerFlurry:()=>p(ctx=>{
      for(let i=0;i<6;i++){
        const t=ctx.currentTime+i*.03;
        const n=NB(ctx),b=BP(ctx,3000+i*340,5),g=G(ctx,.12);
        n.connect(b); b.connect(g); g.connect(D(ctx));
        g.gain.setValueAtTime(.12,t); g.gain.exponentialRampToValueAtTime(.0001,t+.04); n.start(t); n.stop(t+.05);
      }
    }),
    // ── SEQUENCE / STAFF ─────────────────────────────────────────
    runeCorrect:(idx)=>p(ctx=>{
      const baseFs=[523,659,784,880,1047,1175,1319,1047];
      const f=baseFs[idx%baseFs.length]*.5;
      const o=O(ctx,'sine',f),g=G(ctx,.12); o.connect(g); g.connect(D(ctx));
      const t=ctx.currentTime; o.frequency.exponentialRampToValueAtTime(f*2,t+.05);
      g.gain.setValueAtTime(.12,t); g.gain.exponentialRampToValueAtTime(.0001,t+.19); o.start(t); o.stop(t+.2);
    }),
    runeWrong:()=>p(ctx=>{
      const o=O(ctx,'square',200),g=G(ctx,.14); o.connect(g); g.connect(D(ctx));
      const t=ctx.currentTime; o.frequency.linearRampToValueAtTime(100,t+.13);
      g.gain.exponentialRampToValueAtTime(.0001,t+.15); o.start(t); o.stop(t+.16);
    }),
    magicBolt:(q)=>p(ctx=>{
      const o=O(ctx,'sine',280),g=G(ctx,.19); o.connect(g); g.connect(D(ctx));
      const t=ctx.currentTime; o.frequency.exponentialRampToValueAtTime(q==='perfect'?1900:950,t+.32);
      g.gain.exponentialRampToValueAtTime(.0001,t+.36); o.start(t); o.stop(t+.37);
      if(q==='perfect'){
        const o2=O(ctx,'sine',1400),g2=G(ctx,.13); o2.connect(g2); g2.connect(D(ctx));
        const t2=t+.28; g2.gain.setValueAtTime(.13,t2); g2.gain.exponentialRampToValueAtTime(.0001,t2+.14);
        o2.frequency.exponentialRampToValueAtTime(2800,t2+.12); o2.start(t2); o2.stop(t2+.15);
      }
    }),
    // ── STOMP / BOOTS ─────────────────────────────────────────────
    stompApproach:()=>p(ctx=>{
      const n=NB(ctx),lp=LP(ctx,900),g=G(ctx,.1); n.connect(lp); lp.connect(g); g.connect(D(ctx));
      const t=ctx.currentTime; lp.frequency.exponentialRampToValueAtTime(150,t+.4);
      g.gain.exponentialRampToValueAtTime(.0001,t+.44); n.start(t); n.stop(t+.45);
    }),
    stompLand:(q)=>p(ctx=>{
      const f=q==='perfect'?60:q==='good'?44:30;
      const v=q==='perfect'?.52:q==='good'?.38:.22;
      const o=O(ctx,'sine',f*2),g=G(ctx,v); o.connect(g); g.connect(D(ctx));
      const t=ctx.currentTime; o.frequency.exponentialRampToValueAtTime(f*.28,t+.26);
      g.gain.exponentialRampToValueAtTime(.0001,t+.32); o.start(t); o.stop(t+.33);
      const n=NB(ctx),b=BP(ctx,400,4),g2=G(ctx,v*.75); n.connect(b); b.connect(g2); g2.connect(D(ctx));
      g2.gain.exponentialRampToValueAtTime(.0001,t+.11); n.start(t); n.stop(t+.12);
    }),
    stompBounce:()=>p(ctx=>{
      const o=O(ctx,'sine',220),g=G(ctx,.12); o.connect(g); g.connect(D(ctx));
      const t=ctx.currentTime; o.frequency.exponentialRampToValueAtTime(440,t+.11);
      g.gain.exponentialRampToValueAtTime(.0001,t+.14); o.start(t); o.stop(t+.15);
    }),
    // ── POKE / SPEAR ─────────────────────────────────────────────
    pokeTap:(n)=>p(ctx=>{
      const f=370+(n%4)*120;
      const o=O(ctx,'sawtooth',f),lp=LP(ctx,3500),g=G(ctx,.09); o.connect(lp); lp.connect(g); g.connect(D(ctx));
      const t=ctx.currentTime; o.frequency.exponentialRampToValueAtTime(f*1.35,t+.05);
      g.gain.exponentialRampToValueAtTime(.0001,t+.07); o.start(t); o.stop(t+.08);
    }),
    // ── ARCHERY / BOW ─────────────────────────────────────────────
    bowDraw:()=>{ return ()=>{}; }, // silent — no ambient hiss during aiming
    bowRelease:()=>p(ctx=>{
      const o=O(ctx,'sawtooth',900),g=G(ctx,.2); o.connect(g); g.connect(D(ctx));
      const t=ctx.currentTime; o.frequency.exponentialRampToValueAtTime(90,t+.18);
      g.gain.exponentialRampToValueAtTime(.0001,t+.21); o.start(t); o.stop(t+.22);
    }),
    arrowFlight:()=>p(ctx=>{
      const n=NB(ctx),b=BP(ctx,2200,7),g=G(ctx,.08); n.connect(b); b.connect(g); g.connect(D(ctx));
      const t=ctx.currentTime; b.frequency.exponentialRampToValueAtTime(380,t+.29);
      g.gain.setValueAtTime(.08,t); g.gain.exponentialRampToValueAtTime(.0001,t+.31); n.start(t); n.stop(t+.32);
    }),
    arrowHit:(q)=>p(ctx=>{
      const v=q==='perfect'?.4:q==='good'?.27:.12;
      const f=q==='perfect'?130:q==='good'?90:50;
      const o=O(ctx,'sine',f*2),g=G(ctx,v); o.connect(g); g.connect(D(ctx));
      const t=ctx.currentTime; o.frequency.exponentialRampToValueAtTime(f*.3,t+.22);
      g.gain.exponentialRampToValueAtTime(.0001,t+.26); o.start(t); o.stop(t+.27);
      if(q==='perfect'){
        const o2=O(ctx,'sine',2400),g2=G(ctx,.12); o2.connect(g2); g2.connect(D(ctx));
        g2.gain.setValueAtTime(.12,t); g2.gain.exponentialRampToValueAtTime(.0001,t+.26); o2.start(t); o2.stop(t+.27);
      }
    }),
    // ── DEFEND ────────────────────────────────────────────────────
    projLaunch:()=>p(ctx=>{
      const o=O(ctx,'sine',320),g=G(ctx,.15); o.connect(g); g.connect(D(ctx));
      const t=ctx.currentTime; o.frequency.exponentialRampToValueAtTime(80,t+.35);
      g.gain.exponentialRampToValueAtTime(.0001,t+.38); o.start(t); o.stop(t+.39);
    }),
    parry:()=>p(ctx=>{
      const t=ctx.currentTime;
      // metallic clang harmonics
      [[1047,.06,.12],[1568,.05,.22],[2093,.04,.34],[2637,.03,.48],[3136,.02,.65],[523,.06,.28],[4186,.01,.18],[784,.04,.20]].forEach(([f,v,dec])=>{
        const o=O(ctx,'sine',f),g=G(ctx,0); o.connect(g); g.connect(D(ctx));
        g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(v,t+.002);
        g.gain.exponentialRampToValueAtTime(.0001,t+dec); o.start(t); o.stop(t+dec+.01);
      });
      // sub-bass thud
      const sub=O(ctx,'sine',120),gs=G(ctx,0); sub.connect(gs); gs.connect(D(ctx));
      sub.frequency.setValueAtTime(120,t); sub.frequency.exponentialRampToValueAtTime(30,t+.35);
      gs.gain.setValueAtTime(0,t); gs.gain.linearRampToValueAtTime(.08,t+.003);
      gs.gain.exponentialRampToValueAtTime(.0001,t+.40); sub.start(t); sub.stop(t+.41);
      // noise burst
      const n=NB(ctx),lp=LP(ctx,8000),gn=G(ctx,0); n.connect(lp); lp.connect(gn); gn.connect(D(ctx));
      gn.gain.setValueAtTime(0,t); gn.gain.linearRampToValueAtTime(.06,t+.002);
      gn.gain.exponentialRampToValueAtTime(.0001,t+.18); n.start(t); n.stop(t+.19);
      const n2=NB(ctx),bp=BP(ctx,3000,0.8),gn2=G(ctx,0); n2.connect(bp); bp.connect(gn2); gn2.connect(D(ctx));
      gn2.gain.setValueAtTime(0,t+.01); gn2.gain.linearRampToValueAtTime(.03,t+.015);
      gn2.gain.exponentialRampToValueAtTime(.0001,t+.22); n2.start(t+.01); n2.stop(t+.23);
      // rising power chord
      [[440,.04,2.0],[550,.03,1.8],[660,.02,1.6]].forEach(([f,v,dec],i)=>{
        const o=O(ctx,'sine',f),g=G(ctx,0); o.connect(g); g.connect(D(ctx));
        g.gain.setValueAtTime(0,t+i*.04); g.gain.linearRampToValueAtTime(v,t+i*.04+.06);
        g.gain.exponentialRampToValueAtTime(.0001,t+dec); o.start(t+i*.04); o.stop(t+dec+.01);
      });
      // crystalline bell
      const bell=O(ctx,'sine',2093),gb=G(ctx,0); bell.connect(gb); gb.connect(D(ctx));
      gb.gain.setValueAtTime(0,t); gb.gain.linearRampToValueAtTime(.04,t+.003);
      gb.gain.exponentialRampToValueAtTime(.0001,t+2.0); bell.start(t); bell.stop(t+2.01);
      // second bell
      const bell2=O(ctx,'sine',3136),gb2=G(ctx,0); bell2.connect(gb2); gb2.connect(D(ctx));
      gb2.gain.setValueAtTime(0,t+.01); gb2.gain.linearRampToValueAtTime(.03,t+.015);
      gb2.gain.exponentialRampToValueAtTime(.0001,t+1.7); bell2.start(t+.01); bell2.stop(t+1.71);
      // shimmer tails
      [[5200,.03,1.2],[2640,.04,.95],[6800,.02,.80]].forEach(([f,v,dec],i)=>{
        const o=O(ctx,'sine',f),g=G(ctx,0); o.connect(g); g.connect(D(ctx));
        const d=i*.025; g.gain.setValueAtTime(0,t+d); g.gain.linearRampToValueAtTime(v,t+d+.005);
        g.gain.exponentialRampToValueAtTime(.0001,t+dec); o.start(t+d); o.stop(t+dec+.01);
      });
    }),
    blockHit:()=>p(ctx=>{
      const n=NB(ctx),b=BP(ctx,550,3),g=G(ctx,.19); n.connect(b); b.connect(g); g.connect(D(ctx));
      const t=ctx.currentTime; g.gain.exponentialRampToValueAtTime(.0001,t+.14); n.start(t); n.stop(t+.15);
      const o=O(ctx,'sine',120),g2=G(ctx,.22); o.connect(g2); g2.connect(D(ctx));
      o.frequency.exponentialRampToValueAtTime(45,t+.2); g2.gain.exponentialRampToValueAtTime(.0001,t+.24);
      o.start(t); o.stop(t+.25);
    }),
    takeDmg:()=>p(ctx=>{
      const o=O(ctx,'square',190),g=G(ctx,.2); o.connect(g); g.connect(D(ctx));
      const t=ctx.currentTime; o.frequency.exponentialRampToValueAtTime(55,t+.2);
      g.gain.exponentialRampToValueAtTime(.0001,t+.23); o.start(t); o.stop(t+.24);
    }),
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
    el.style.cssText = "position:fixed;right:16px;top:50%;transform:translateY(-50%);z-index:9999;pointer-events:none;background:rgba(4,4,12,.85);padding:10px 16px;border-radius:6px;border:1px solid #2a2a40;display:flex;flex-direction:column;gap:6px;font-family:Cinzel,serif;font-size:11px;letter-spacing:2px;backdrop-filter:blur(4px);";
    el.innerHTML = `
      <div style="font-size:8px;letter-spacing:3px;color:#4a4a6a;margin-bottom:4px;">LEGEND</div>
      <div style="display:flex;align-items:center;gap:7px;color:#c8b888;"><span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:#c8b888;flex-shrink:0"></span>COMBAT</div>
      <div style="display:flex;align-items:center;gap:7px;color:#aa66ff;"><span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:#aa66ff;flex-shrink:0"></span>ELITE</div>
      <div style="display:flex;align-items:center;gap:7px;color:#44cc66;"><span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:#44cc66;flex-shrink:0"></span>REST</div>
      <div style="display:flex;align-items:center;gap:7px;color:#ff4422;"><span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:#ff4422;flex-shrink:0"></span>BOSS</div>
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
        setPortalTargets(others.length ? others : FALLBACK_GAMES);
      })
      .catch(()=>setPortalTargets(FALLBACK_GAMES));
  },[]);

  // ── Send player to another jam game — uses Portal.sendPlayerThroughPortal ──
  const sendThroughPortal = (targetUrl) => {
    Portal.sendPlayerThroughPortal(targetUrl, {
      username: portalName,
      color: 'e8d5a3',
      speed: 5,
    });
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

  const showHit = (text, color, big=false) => {
    setHitResult({text,color,big});
    setTimeout(()=>setHitResult(null), big?1300:950);
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
    setPlayer({hp:60,maxHp:60,str:0,level:1,xp:0,weapons:[wid],potions:[],floor:0,visited:[],class:w.className,classEmoji:w.classEmoji});
    setRunStartTime(Date.now());
    setScreen("map");
  };

  const startCombat = (node) => {
    const e = ENEMIES[node.enemy];
    const elite = node.type === "elite";
    const hp  = elite ? Math.round(e.hp  * 1.6) : e.hp;
    const atk = elite ? Math.round(e.atk * 1.3) : e.atk;
    const xp  = elite ? Math.round(e.xp  * 1.8) : e.xp;
    sfx.combatStart();
    setCs({ enemy:{...e,id:node.enemy,maxHp:hp,hp,atk,xp}, elite,
            log:[`${elite?"⚠️ ELITE — ":""}A ${e.name} materialises before you!`],
            phase:"action", nodeId:node.id, nodeFloor:node.fl });
    setEnemyFlash(false);
    setQteAnim(null);
    setScreen("combat");
  };

  /* ── Core attack resolution ──────────────────────────────── */
  const resolveAttack = (q, weapon, dmgOverride=null) => {
    const mult = q==="perfect"?1.5:q==="good"?1.0:0.3;
    const dmg  = dmgOverride!==null ? dmgOverride : Math.floor((weapon.baseDmg+(player?.str||0))*mult);
    if (q!=="miss" && dmgOverride===null) triggerImpact(q==="perfect"?2:1);
    // Particle burst at enemy position
    if (q!=="miss") triggerParticles(ENX, GNDY-40, q==="perfect"?"#44ff88":"#ffcc44", q==="perfect"?40:24);
    showHit(q==="perfect"?`PERFECT! −${dmg}`:q==="good"?`HIT −${dmg}`:`MISS −${dmg}`,
            q==="perfect"?"#44ff88":q==="good"?"#ffcc44":"#666");
    setEnemyFlash(true);
    setTimeout(()=>setEnemyFlash(false), 450);

    setCs(prev=>{
      if(!prev) return prev;
      const newHp  = Math.max(0, prev.enemy.hp - dmg);
      const logMsg = q==="perfect"?`⭐ ${weapon.name}: PERFECT for ${dmg}!`:
                     q==="good"   ?`${weapon.emoji} ${weapon.name} hits for ${dmg}.`:
                                   `${weapon.emoji} Glancing blow — ${dmg}.`;
      if (newHp <= 0) {
        sfx.enemyDie();
        setTimeout(()=>{
          setPlayer(p=>p?({...p,xp:p.xp+prev.enemy.xp,floor:p.floor+1,visited:[...p.visited,prev.nodeId]}):p);
          if (prev.enemy.name === "Ancient Dragon") { setScreen("victory"); return; }
          setPlayer(p=>{ setRewards(pickRewards(p?.weapons||[], prev.elite)); return p; });
          setScreen("reward");
        }, 1100);
        return {...prev, enemy:{...prev.enemy,hp:0}, phase:"won", log:[...prev.log,logMsg]};
      }
      setTimeout(()=>startDefendQTE(), 880);
      return {...prev, enemy:{...prev.enemy,hp:newHp}, phase:"enemy_turn", log:[...prev.log,logMsg]};
    });
  };

  const handleDefend = (q) => {
    const atk = (cs?.enemy?.atk||0) * (cs?.enemyAtkMult||1);
    const mult = q==="perfect"?0:q==="good"?.4:1.0;
    const dmg  = Math.floor(atk*mult);
    // Particle burst at hero when hit or blocked
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
          setTimeout(()=>{
            setPlayer(p=>p?({...p,xp:p.xp+prev.enemy.xp,floor:p.floor+1,visited:[...p.visited,prev.nodeId]}):p);
            if(prev.enemy.name==="Ancient Dragon"){setScreen("victory");return;}
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
    };
    setCs(prev=>prev?{...prev,phase:"attacking"}:prev);
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
  const CHARGE_MAX_MS = 480;
  const CHARGE_PERFECT_LO = 0.84;
  const CHARGE_PERFECT_HI = 0.90; // narrow 6% window, harder to hit
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
      const q = c>=CHARGE_PERFECT_LO&&c<1.0?"perfect":c>=0.60&&c<1.0?"good":"miss";
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
    setQteAnim({ type:"archery", weapon, t:0, dots:ref.dots.map(d=>({x:0,y:0})), lockedDots:[], shotsFired:0 });

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
    const start = performance.now();
    const ROCKET_DUR = 480;
    setQteAnim({ type:"rpg_rocket", weapon, t:0, q });
    const tick = () => {
      const t = Math.min(1,(performance.now()-start)/ROCKET_DUR);
      setQteAnim(prev=>prev?{...prev,t}:null);
      if (t<1) { requestAnimationFrame(tick); return; }
      // Massive multi-wave explosion
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

  // ── SEQUENCE REVEAL (RPG): 4 slots, current outlined yellow, remaining reshuffle after each hit ──
  const startRPGQTE = (weapon) => {
    const ref = qteRef.current;
    const len = weapon.seqLength || 4;
    const genKey = () => ALL_KEYS[Math.floor(Math.random()*ALL_KEYS.length)];
    const seq = Array.from({length:len}, genKey);
    ref.seq = [...seq]; ref.step = 0; ref.correctCount = 0; ref.done = false;
    ref.startMs = performance.now();
    castStartRef.current = ref.startMs;
    setCastTick(0);
    setQteAnim({ type:"sequence_reveal", weapon, t:0, seq:[...seq], step:0, correctCount:0, badKey:false });

    const onKey = (e) => {
      if (ref.done) return;
      const k = e.key.toUpperCase();
      if (!/^[A-Z]$/.test(k)) return;
      e.preventDefault();
      const currentKey = ref.seq[ref.step];
      if (k === currentKey) {
        sfx.runeCorrect(ref.step);
        ref.correctCount++;
        ref.step++;
        // Remaining slots get new random letters
        const newSeq = [...ref.seq];
        for (let i = ref.step; i < len; i++) newSeq[i] = genKey();
        ref.seq = newSeq;
        if (ref.step >= len) {
          ref.done = true;
          window.removeEventListener("keydown", onKey);
          clearTimeout(ref.rpgTimer);
          const dmg = Math.max(1, Math.floor((weapon.baseDmg+(player?.str||0))*1.5));
          fireRPGRocket("perfect", dmg, weapon);
        } else {
          setQteAnim(prev=>prev?{...prev, seq:[...newSeq], step:ref.step, correctCount:ref.correctCount, badKey:false}:null);
        }
      } else {
        sfx.runeWrong();
        setQteAnim(prev=>prev?{...prev, badKey:true}:null);
        setTimeout(()=>setQteAnim(prev=>prev?{...prev,badKey:false}:null),200);
      }
    };
    window.addEventListener("keydown", onKey);

    ref.rpgTimer = setTimeout(()=>{
      if (!ref.done) {
        ref.done = true;
        window.removeEventListener("keydown", onKey);
        const ratio = ref.correctCount / len;
        const q = ratio>=.75?"perfect":ratio>=.45?"good":"miss";
        const dmg = Math.max(1, Math.floor((weapon.baseDmg+(player?.str||0))*ratio*1.8));
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

  // ── DEFEND: enemy launches projectile — press SPACE when it hits you ──
  // Wind-up: 0→LAUNCH_T, projectile travels: LAUNCH_T→ARRIVE_T
  // Per-enemy defend timing — each feels distinctly different
  // dur=total ms, launch=windup fraction, arrive=target fraction (where to press SPACE)
  const DEFEND_PROFILES = {
    goblin:   { dur:1000, launch:0.20, arrive:0.78, projPath:"bounce"  }, // rock bounces back and forth
    skeleton: { dur:1300, launch:0.32, arrive:0.80, projPath:"zigzag"  }, // bone tumbles up-down
    eye:      { dur:1100, launch:0.14, arrive:0.88, projPath:"loop"    }, // orb spirals in a loop
    golem:    { dur:1600, launch:0.38, arrive:0.76, projPath:"straight" }, // heavy boulder, direct
    wraith:   { dur: 950, launch:0.22, arrive:0.84, projPath:"zigzag"  }, // ghost energy zips erratically
    dragon:   { dur:1400, launch:0.28, arrive:0.90, projPath:"loop"    }, // fireball loops before impact
  };
  const startDefendQTE = () => {
    const ref = qteRef.current;
    const prof = DEFEND_PROFILES[cs?.enemy?.id] || { dur:1200, launch:0.28, arrive:0.82 };
    const { dur, launch, arrive } = prof;
    ref.startMs = performance.now(); ref.pressT = null;
    ref.defendArrive = arrive; // store so showDefendCue can use it
    setCs(prev=>prev?{...prev,phase:"defending"}:prev);
    setQteAnim({ type:"defend", t:0, projFrac:0, arrive, projPath: prof.projPath||"straight" });

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

  const showDust      = qteAnim?.type==="stomp"&&Math.abs(qteAnim.t-LAND_FRAC)<.04;
  const _defArrive    = qteAnim?.arrive ?? 0.82;
  const showDefendCue = qteAnim?.type==="defend"&&qteAnim.t>=(_defArrive-.07)&&qteAnim.t<=(_defArrive+.04);

  const QTE_LABEL = { swing_beat:"BEAT", rapid_tap:"FLURRY", hold_release:"CHARGE", sequence:"CAST", stomp:"STOMP", poke:"POKE", archery:"AIM", sequence_reveal:"LAUNCH" };

  /* ─────────────────────────────────────────────────────────── */
  return (
    <div style={{minHeight:"100vh",background:"#020205",color:"#e8d5a3"}}>
      <style>{GS}</style>

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
          {particles.map((p,i)=><div key={i} style={{position:"absolute",left:p.left,top:p.top,width:p.size,height:p.size,background:"#e8d5a3",borderRadius:"50%",opacity:p.opacity,animation:`pulse ${p.dur} ${p.delay} infinite`}}/>)}
          <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 40%, #0c0518 0%, #020205 65%)"}}/>
          <div style={{position:"relative",textAlign:"center",zIndex:1,animation:"fadeIn .8s ease-out"}}>
            <div style={{marginBottom:24,display:"inline-block",animation:"float 3.5s ease-in-out infinite",filter:"drop-shadow(0 0 35px rgba(232,213,163,.45))"}}>
              <Icon type="sword" size={96} color="#e8d5a3"/>
            </div>
            <h1 style={{fontFamily:"Cinzel",fontWeight:900,fontSize:"clamp(36px,7vw,72px)",letterSpacing:10,lineHeight:1.25,background:"linear-gradient(to bottom,#fff 0%,#e8d5a3 40%,#c4a96a 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"glow 5s infinite"}}>SPIRE OF<br/>SHADOWS</h1>
            <p style={{fontFamily:"IM Fell English",fontStyle:"italic",fontSize:17,opacity:.45,margin:"26px 0 64px",letterSpacing:5}}>A dungeon of no return</p>
            <button className="btn" style={{fontSize:17,padding:"18px 60px",letterSpacing:6,borderColor:"#666"}} onClick={()=>setScreen("weapon_select")}>BEGIN</button>
            <p style={{marginTop:64,opacity:.18,fontSize:11,fontFamily:"Cinzel",letterSpacing:3}}>CONTROLS: SPACE · W · A · S · D</p>
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
          <div style={{display:"flex",gap:14,flexWrap:"wrap",justifyContent:"center",maxWidth:920,marginBottom:36}}>
            {Object.values(STARTER_WEAPONS).map(w=>{
              const sel=selectedWeapon===w.id;
              const qteLabel=QTE_LABEL[w.qteType]||"?";
              return (
                <div key={w.id} onClick={()=>setSelectedWeapon(w.id)} style={{width:166,padding:"22px 16px",textAlign:"center",cursor:"pointer",border:`2px solid ${sel?"#e8d5a3":"#2a2a3a"}`,background:sel?"#14142a":"#09090f",boxShadow:sel?"0 0 28px rgba(232,213,163,.2)":"none",transition:"all .2s"}}>
                  <div style={{width:56,height:56,margin:"0 auto 10px",filter:sel?"drop-shadow(0 0 12px #e8d5a388)":"none",transition:"filter .2s",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <Icon type={w.id} size={52} color={sel?"#e8d5a3":"#8a7a66"}/>
                  </div>
                  <div style={{fontFamily:"Cinzel",fontSize:10,letterSpacing:3,opacity:.5,marginBottom:6}}>{w.classEmoji} {w.className}</div>
                  <div style={{fontFamily:"Cinzel",fontSize:14,marginBottom:10,color:sel?"#e8d5a3":"#9a8a73"}}>{w.name}</div>
                  <div style={{fontSize:11,opacity:.5,lineHeight:1.5,marginBottom:12}}>{w.desc}</div>
                  <div style={{fontSize:10,fontFamily:"Cinzel",padding:"4px 8px",border:"1px solid #333",display:"inline-block",color:sel?"#ffcc44":"#555",borderColor:sel?"#ffcc4455":"#222"}}>{qteLabel}</div>
                  <div style={{marginTop:10,fontSize:11,opacity:.4,fontFamily:"Cinzel"}}>ATK {w.baseDmg}</div>
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
            <span style={{color:"#c8b888"}}>{player.classEmoji} {player.class} · LVL {player.level} · STR +{player.str}</span>
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
                const title = isA?(isR?"Campfire: restore 25 HP":isB?"BOSS: Ancient Dragon":isE?`ELITE ${ENEMIES[n.enemy]?.name||""}`:ENEMIES[n.enemy]?.name||""):"";
                return (
                  <button key={n.id} title={title}
                    onClick={()=>{ if(!isA)return; if(isR){setPlayer(p=>({...p,hp:Math.min(p.maxHp,p.hp+25),floor:p.floor+1,visited:[...p.visited,n.id]}));}else{startCombat(n);} }}
                    style={{position:"absolute",left:n.x-sz/2,top:n.y-sz/2,width:sz,height:sz,borderRadius:"50%",padding:0,
                      background:nodeBg,border:nodeBorder,cursor:isA?"pointer":"default",
                      color:isV?"#2a2a44":isA?nodeColor:"#2a2a44",
                      fontSize:isB?24:isE?18:17,boxShadow:nodeGlow,opacity:isF?.3:1,transition:"all .2s",
                      display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <Icon type={isR?"rest":isB?"boss":isE?"elite":"combat"} size={isB?26:isE?22:20} color={nodeColor}/>
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
                const t = portalTargets.length ? portalTargets[Math.floor(Math.random()*portalTargets.length)] : FALLBACK_GAMES[0];
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
        const eDims     = ENEMY_DIMS[cs.enemy.id]||{w:55,h:70};
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

        // Scale battlefield to fill as much vertical height as possible
        const bfZoom = Math.min(
          (window.innerHeight * 0.82) / BFH,
          window.innerWidth / BFW
        );

        return (
          <div style={{height:"100vh",display:"flex",flexDirection:"column",background:"#020205",overflow:"hidden",animation:"fadeIn .35s"}}>

            {/* ─── Slim combat HUD ─────────────────────────── */}
            <div style={{flexShrink:0,padding:"7px 20px",background:"rgba(0,0,0,.55)",backdropFilter:"blur(4px)",
              borderBottom:"1px solid #1e1e30",display:"flex",justifyContent:"space-between",alignItems:"center",
              fontFamily:"Cinzel",fontSize:14,letterSpacing:1}}>
              <span style={{color:"#c8b888",fontWeight:600}}>{player.classEmoji} {player.class} · Lv{player.level} · {player.hp}/{player.maxHp}</span>
              <span style={{color:cs.elite?"#aa66ff":enemyData.color,letterSpacing:2,fontWeight:600}}>{cs.elite?"⚡ ELITE — ":""}{enemyData.name} · {cs.enemy.hp}/{cs.enemy.maxHp}hp</span>
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
                // Meter dimensions — tall vertical bar, right of center
                const mH=190, mW=28, mL=BFW/2+80, mT=BFH/2-mH/2;
                const pct = Math.min(charge*100, 100);
                // Zone boundaries (bottom=0%, top=100%)
                const goodLo=60, perfLo=84, perfHi=90;
                const fillCol = pct>=100?"#ff3311":pct>=perfHi?"#ff3311":pct>=perfLo?"#33ff66":pct>=goodLo?"#ffaa22":"#ff5533";
                const isPerfectZone = pct>=perfLo && pct<perfHi;
                const isDanger      = pct>=perfHi;
                // pixel position of zones from bottom of meter
                const px = (v)=> mH*(1-v/100); // top offset for value v%
                return (
                  <>
                    {/* Meter track — outer shell */}
                    <div style={{position:"absolute",left:mL,top:mT,width:mW,height:mH,
                      borderRadius:6,border:`2px solid ${isDanger?"#ff4422":isPerfectZone?"#33ff66":"#2a2a44"}`,
                      background:"#080810",zIndex:9,overflow:"hidden",
                      boxShadow:isDanger?"0 0 24px #ff442288":isPerfectZone?"0 0 18px #33ff6655":"0 0 6px #000"}}>
                      {/* Zone bands — faint, drawn bottom to top: poor / good / perfect / danger */}
                      {/* Poor: 0-60% = bottom 60% */}
                      <div style={{position:"absolute",left:0,bottom:0,width:"100%",height:`${goodLo}%`,background:"rgba(180,30,0,.22)"}}/>
                      {/* Good: 60-84% */}
                      <div style={{position:"absolute",left:0,bottom:`${goodLo}%`,width:"100%",height:`${perfLo-goodLo}%`,background:"rgba(200,120,0,.25)"}}/>
                      {/* Perfect: 84-90% */}
                      <div style={{position:"absolute",left:0,bottom:`${perfLo}%`,width:"100%",height:`${perfHi-perfLo}%`,background:"rgba(0,200,80,.35)"}}/>
                      {/* Danger: 90-100% */}
                      <div style={{position:"absolute",left:0,bottom:`${perfHi}%`,width:"100%",height:`${100-perfHi}%`,background:"rgba(220,30,0,.35)"}}/>
                      {/* Fill — grows from bottom */}
                      <div style={{
                        position:"absolute",left:0,bottom:0,width:"100%",height:`${pct}%`,
                        background:fillCol,
                        boxShadow:`0 0 14px ${fillCol}`,
                        transition:"height .04s linear",
                      }}/>
                      {/* Sheen */}
                      <div style={{position:"absolute",left:0,bottom:0,width:"40%",height:`${pct}%`,
                        background:"rgba(255,255,255,.18)",transition:"height .04s linear",pointerEvents:"none"}}/>
                    </div>
                    {/* Zone tick lines + labels — drawn outside track */}
                    {[{v:goodLo,col:"#ffcc44",lbl:"GOOD"},{v:perfLo,col:"#33ff66",lbl:"PERF"},{v:perfHi,col:"#ff4422",lbl:"MAX"}].map(({v,col,lbl},i)=>(
                      <React.Fragment key={i}>
                        <div style={{position:"absolute",left:mL-2,top:mT+px(v)-1,
                          width:mW+4,height:2,background:col,zIndex:10,borderRadius:1}}/>
                        <div style={{position:"absolute",left:mL+mW+5,top:mT+px(v)-6,
                          fontFamily:"Cinzel",fontSize:8,letterSpacing:1,color:col,
                          textShadow:`0 0 6px ${col}`,zIndex:10,whiteSpace:"nowrap"}}>
                          {lbl}
                        </div>
                      </React.Fragment>
                    ))}
                    {/* Current value needle — horizontal line at exact charge position */}
                    <div style={{position:"absolute",left:mL-4,top:mT+px(pct)-2,
                      width:mW+8,height:4,background:"#ffffff",borderRadius:2,zIndex:11,
                      boxShadow:`0 0 10px #ffffff, 0 0 20px ${fillCol}`,
                      transition:"top .04s linear"}}/>
                    {/* HOLD / RELEASE label — below meter */}
                    <div style={{position:"absolute",left:mL+mW/2,top:mT+mH+12,
                      transform:"translateX(-50%)",
                      background:"#0e0e1a",border:`2px solid ${fillCol}88`,
                      borderRadius:5,padding:"3px 10px",fontFamily:"Cinzel",fontSize:10,letterSpacing:2,
                      color:fillCol,textShadow:`0 0 8px ${fillCol}`,
                      boxShadow:`0 0 10px ${fillCol}44`,zIndex:9,whiteSpace:"nowrap"}}>
                      {isDanger?"DANGER!":isPerfectZone?"RELEASE!":pct>=goodLo?"ALMOST...":"HOLD [SPC]"}
                    </div>
                    {/* Hammer icon above hero */}
                    <div style={{position:"absolute",left:(heroPos?.left||HR_L)+HSW/2-9,top:(heroPos?.top||HR_T)-30,
                      zIndex:9,animation:"float .4s ease-in-out infinite",
                      filter:isPerfectZone?"drop-shadow(0 0 10px #44ff88)":isDanger?"drop-shadow(0 0 10px #ff4422)":"none"}}>
                      <Icon type={qteAnim?.weapon?.id||"hammer"} size={18}/>
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

              {/* ── SEQUENCE REVEAL (RPG): 4 key slots, current outlined yellow ── */}
              {qteAnim?.type==="sequence_reveal"&&qteAnim.seq&&(
                <div style={{position:"absolute",top:16,left:"50%",transform:"translateX(-50%)",
                  display:"flex",gap:10,zIndex:9,alignItems:"center"}}>
                  {qteAnim.seq.map((k,i)=>{
                    const done = i<(qteAnim.step||0);
                    const cur  = i===(qteAnim.step||0);
                    const bad  = cur&&qteAnim.badKey;
                    return (
                      <div key={i} style={{
                        width:46,height:46,display:"flex",alignItems:"center",justifyContent:"center",
                        fontFamily:"Cinzel",fontWeight:700,fontSize:20,borderRadius:8,
                        border:`2.5px solid ${done?"#1e1e28":cur?(bad?"#ff4422":"#ffcc44"):"#2a2a3a"}`,
                        color:done?"#2a2a3a":cur?(bad?"#ff4422":"#ffcc44"):"#55556a",
                        background:done?"#040408":cur?(bad?"#1a0808":"#1a1400"):"#07070e",
                        boxShadow:done?"none":cur&&!bad?"0 0 22px #ffcc4466, 0 0 8px #ffcc4433":"none",
                        transform:cur&&!bad?"scale(1.2)":"scale(1)",
                        opacity:done?0.25:cur?1:0.45,
                        transition:"all .08s",
                        animation:cur&&!bad?"runeIn .1s ease-out":"none",
                      }}>
                        {done?"✓":k}
                      </div>
                    );
                  })}
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

              {/* Enemy sprite */}
              <div style={{position:"absolute",left:eLeft,top:eTop,zIndex:4,
                filter:`drop-shadow(0 0 22px ${enemyData.color}bb) drop-shadow(0 8px 4px #00000088)`,
                animation:enemyFlash?`hitFlash .35s ease-out, squish .3s ease-out`:`float ${2.8+eDims.h*.01}s ease-in-out infinite`,
                transformOrigin:"bottom center"}}>
                <EnemySpriteSmall id={cs.enemy.id} scale={eScale}/>
              </div>

              {/* ── ENEMY PROJECTILE (defend QTE) ── */}
              {qteAnim?.type==="defend"&&(qteAnim.projFrac||0)>0&&(qteAnim.projFrac||0)<1.05&&(()=>{
                const pf       = qteAnim.projFrac||0;
                const id       = cs.enemy.id;
                const projPath = qteAnim.projPath||"straight";
                const heroMidX = (heroPos?heroPos.left:HR_L) + HSW/2;
                const heroMidY = (heroPos?heroPos.top:HR_T)  + HSH/2;
                const srcX = ENX, srcY = eTop + eH*0.35;

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
                    {/* Path trail for loop/zigzag so player can read the trajectory */}
                    {projPath !== "straight" && projPath !== "bounce" && (()=>{
                      const steps = 18;
                      const pts = Array.from({length:steps+1},(_,i)=>posAt(pf*(i/steps)));
                      return <polyline points={pts.map(p=>`${p.x},${p.y}`).join(" ")}
                        fill="none" stroke={id==="dragon"?"#ff660033":id==="eye"?"#9900cc33":"#4488ff22"}
                        strokeWidth="2" strokeDasharray="4 5" opacity=".5"/>;
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
                    {id==="dragon"&&(
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
                  </svg>
                );
              })()}

              {/* ── DEFEND: block hint pill ── */}
              {qteAnim?.type==="defend"&&(()=>{
                const pf = qteAnim.projFrac||0;
                const t  = qteAnim.t||0;
                const arrive = qteAnim.arrive||0.82;
                if (pf<=0 || t>arrive+0.06) return null;
                const near = pf>0.82;
                return (
                  <div style={{position:"absolute",left:"50%",bottom:36,transform:"translateX(-50%)",
                    zIndex:30,pointerEvents:"none",
                    fontFamily:"Cinzel",fontSize:10,fontWeight:700,letterSpacing:3,
                    color:near?"#44ccff":"#e8d5a3aa",
                    background:"rgba(0,0,0,.55)",borderRadius:20,padding:"4px 14px",
                    border:`1px solid ${near?"#44aaff55":"#ffffff12"}`,
                    textShadow:near?"0 0 12px #44aaff":"none",
                    animation:near?"pulse .2s ease-in-out infinite":"none",
                    whiteSpace:"nowrap"}}>
                    TIME THE BLOCK!
                  </div>
                );
              })()}

              {/* Stomp instruction prompt */}
              {qteAnim?.type==="stomp"&&(()=>{
                const t = qteAnim.t||0;
                const bounce = qteAnim.bounce||0;
                // For contact 0: show prompt right away; for bounce: show after hero launches
                const visible = bounce===0 ? t<0.85 : t>0.08&&t<0.88;
                // Pulse brighter in the final 15% of approach (about to land)
                const nearLand = bounce===0 ? t>0.70 : t>0.75;
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
                animation:!heroPos?"float 2.4s ease-in-out infinite":"none",
                filter:qteAnim?.type==="defend"?"drop-shadow(0 0 10px #4488ff)":
                       chargeActive&&cIsPerfect?"drop-shadow(0 0 14px #44ff88)":"none"}}>
                <HeroSprite className={player.class} scale={0.85} weapons={player.weapons||[]}/>
              </div>

              {/* Battlefield status line */}
              <div style={{position:"absolute",top:qteAnim?.type==="swing_beat"||qteAnim?.type==="hold_release"||qteAnim?.type==="poke"?50:qteAnim?.type==="sequence"?30:10,left:"50%",transform:"translateX(-50%)",fontFamily:"Cinzel",fontSize:10,letterSpacing:3,zIndex:9,whiteSpace:"nowrap"}}>
                {qteAnim?.type==="rapid_tap"  ? <span style={{color:"#ff8844",animation:"pulse .15s ease-in-out infinite",fontWeight:700}}>MASH [SPACE]</span>
                :cs.phase==="enemy_turn"      ? <span style={{opacity:.25,fontSize:9}}>ENEMY INCOMING</span>
                :cs.phase==="won"             ? <span style={{color:"#44ff88",animation:"glow 1.5s infinite"}}>VICTORY!</span>
                :cs.phase==="action"          ? <span style={{opacity:.35}}>CHOOSE YOUR ATTACK</span>
                :null}
              </div>

              {/* HP bars */}
              <div style={{position:"absolute",left:8,bottom:8,width:300,zIndex:9}}>
                <div style={{fontFamily:"Cinzel",fontSize:15,color:enemyData.color,letterSpacing:2,marginBottom:6,opacity:.95,fontWeight:700,textShadow:`0 0 12px ${enemyData.color}66`}}>
                  {cs.elite&&<span style={{color:"#aa66ff"}}>⚡ </span>}{enemyData.name}
                  {cs.enemyAtkMult&&cs.enemyAtkMult<1&&<span style={{fontSize:10,color:"#88ccff",marginLeft:6,opacity:.8}}>WEAKENED</span>}
                </div>
                <CompactHP label="" current={cs.enemy.hp} max={cs.enemy.maxHp} color={enemyData.color}/>
              </div>
              <div style={{position:"absolute",right:8,bottom:8,width:300,zIndex:9}}>
                <div style={{fontFamily:"Cinzel",fontSize:15,color:"#e8d5a3",letterSpacing:2,marginBottom:6,opacity:.95,textAlign:"right",fontWeight:700}}>{player.class}</div>
                <CompactHP label="" current={player.hp} max={player.maxHp} color={player.hp<player.maxHp*.3?"#ff4444":player.hp<player.maxHp*.6?"#ffcc44":"#22cc55"} align="right"/>
              </div>
              {/* ── Action log — bottom-left corner, one line only ── */}
              {cs.log.length>0&&(
                <div style={{position:"absolute",bottom:4,left:4,maxWidth:140,zIndex:20,pointerEvents:"none"}}>
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

            {/* ── Attack buttons + potions — compact bar at bottom ── */}
            {cs.phase==="action"&&!qteAnim&&(
              <div style={{flexShrink:0,background:"rgba(0,0,0,.6)",backdropFilter:"blur(6px)",borderTop:"1px solid #1a1a2e"}}>
                {/* Potion row — only if player has potions */}
                {(player.potions||[]).length>0&&(
                  <div style={{display:"flex",gap:6,justifyContent:"center",padding:"6px 16px 2px",borderBottom:"1px solid #1a1a2e22"}}>
                    <span style={{fontFamily:"Cinzel",fontSize:9,opacity:.4,letterSpacing:2,alignSelf:"center",marginRight:4}}>POTIONS</span>
                    {(player.potions||[]).map((pt,idx)=>(
                      <button key={idx} onClick={()=>usePotion(idx)}
                        title={pt.desc}
                        style={{display:"flex",alignItems:"center",gap:5,padding:"4px 10px",
                          background:"#0a0818",border:"1px solid #553388",borderRadius:6,
                          cursor:"pointer",fontFamily:"Cinzel",fontSize:10,color:"#cc88ff",
                          boxShadow:"0 0 8px #55228855",transition:"all .15s"}}
                        onMouseEnter={e=>{e.currentTarget.style.background="#140828";e.currentTarget.style.borderColor="#8855cc";}}
                        onMouseLeave={e=>{e.currentTarget.style.background="#0a0818";e.currentTarget.style.borderColor="#553388";}}>
                        <Icon type={pt.id} size={20}/>
                        <span>{pt.name}</span>
                      </button>
                    ))}
                  </div>
                )}
                {/* Weapons row */}
                <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",padding:"8px 16px 10px"}}>
                  {player.weapons.map(wid=>{
                    const w=ALL_WEAPONS[wid]; if(!w) return null;
                    const tip = w.qteType==="stomp"?"Time it perfectly on the enemy's head":undefined;
                    return (
                      <button key={wid} className="btn" title={tip}
                        style={{display:"flex",alignItems:"center",gap:8,padding:"7px 16px"}}
                        onClick={()=>startAttack(w)}>
                        <Icon type={w.id} size={22}/>
                        <span style={{fontSize:11}}>{w.name}</span>
                        <span style={{fontSize:10,opacity:.4}}>{w.baseDmg+(player.str||0)}·{QTE_LABEL[w.qteType]||"?"}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

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
          <p style={{opacity:.5,marginBottom:10,fontStyle:"italic",letterSpacing:2}}>The Ancient Dragon falls. The Spire is yours.</p>
          {player&&<p style={{fontFamily:"Cinzel",fontSize:12,opacity:.35,marginBottom:10,letterSpacing:2}}>Lv.{player.level} {player.class} · {player.xp} XP</p>}
          {(finalTime||timerDisplay)&&<div style={{fontFamily:"Cinzel",fontSize:28,color:"#ffcc44",letterSpacing:4,marginBottom:44,textShadow:"0 0 24px #ffcc44",fontVariantNumeric:"tabular-nums",animation:"glow 2s infinite"}}>⏱ {finalTime||timerDisplay}</div>}
          <button className="btn" style={{fontSize:16,padding:"14px 44px",letterSpacing:5}} onClick={()=>window.location.reload()}>PLAY AGAIN</button>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
