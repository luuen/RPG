const { useState, useEffect, useRef } = React;

// GitHub Pages serves from /RPG/ subpath; local dev serves from root
const ASSET_BASE = window.location.hostname.includes("github.io") ? "/RPG" : "";

/* ─── GLOBAL STYLES ──────────────────────────────────────────── */
const GS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=IM+Fell+English:ital@0;1&family=MedievalSharp&display=swap');
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
@keyframes breathe{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}
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
  sword:      { id:"sword",      name:"Iron Sword",    emoji:"⚔️",  baseDmg:15, speed:2.2, qteType:"swing_beat",    tier:"basic", desc:"Press A→W→D in sequence. Hit the beat!", classEmoji:"🛡️", className:"Knight"   },
  hammer:     { id:"hammer",     name:"War Hammer",    emoji:"🔨",  baseDmg:15, speed:1.0, qteType:"hold_release",  tier:"basic", desc:"Hold SPACE to charge. Release in the GREEN zone — too long = OVERCHARGE!", classEmoji:"⚒️", className:"Berserker"},
  daggers:    { id:"daggers",    name:"Shadow Daggers",emoji:"🗡️",  baseDmg:15, speed:3.0, qteType:"rapid_tap",    tier:"basic", tapTarget:8, rapidDur:1200, desc:"Mash A and D alternately 8 times before the timer runs out!", classEmoji:"🐍", className:"Rogue"    },
  staff:      { id:"staff",      name:"Arcane Staff",  emoji:"🪄",  baseDmg:11, speed:1.8, qteType:"sequence",     tier:"basic", seqLength:8,  desc:"Type the 8-rune sequence — wrong keys reduce damage. Hit all 8 for maximum power!", classEmoji:"🌙", className:"Mage"     },
  bow:        { id:"bow",        name:"Elven Bow",     emoji:"🏹",  baseDmg:8,  speed:1.5, qteType:"archery",      tier:"basic", desc:"3 orbiting dots — press SPACE when each is in the center ring.", classEmoji:"🌿", className:"Ranger"   },
  sword_gun:  { id:"sword_gun",  name:"Sword & Gun",   emoji:"⚔🔫", baseDmg:15, speed:1.8, qteType:"dual_action",  tier:"basic", dotSpeed:1.60, centerWidth:0.22, classEmoji:"🔫", className:"Duelist",  desc:"Hold A+W+D simultaneously, then LEFT CLICK when the dot hits the center zone." },
  boots:      { id:"boots",      name:"Iron Boots",    emoji:"👟",  baseDmg:15, speed:1.4, qteType:"stomp",        tier:"basic", classEmoji:"👊", className:"Brawler", desc:"Run to the enemy and jump! Press SPACE at the moment of landing." },
};
const ALL_WEAPONS = {
  ...STARTER_WEAPONS,
  // ── BASIC (non-starter) ──
  axe:            { id:"axe",           name:"Battle Axe",      emoji:"🪓",  baseDmg:19, speed:1.1, qteType:"hold_release", tier:"basic",                                        classEmoji:"🪓",  className:"Warrior"     },
  spear:          { id:"spear",         name:"Iron Spear",      emoji:"🔱",  baseDmg:15, speed:1.9, qteType:"poke",         tier:"basic",                                        classEmoji:"🔱",  className:"Lancer",     desc:"Spam ANY keys as fast as you can — full keyboard, go wild!" },
  wand:           { id:"wand",          name:"Chaos Wand",      emoji:"✨",  baseDmg:18, speed:2.0, qteType:"sequence",     tier:"basic",  seqLength:3,                          classEmoji:"✨",  className:"Sorcerer"    },
  knife_shotgun:  { id:"knife_shotgun", name:"Knife & Shotgun", emoji:"🔪💥", baseDmg:24, speed:2.2, qteType:"dual_action", tier:"basic",  dotSpeed:2.00, centerWidth:0.25,      classEmoji:"💥",  className:"Brawgunner", desc:"Faster dot — wide zone saves you. Hold A+W+D and click." },
  // ── REFINED (elite drops only — blue) ──
  longsword:      { id:"longsword",     name:"Longsword",       emoji:"🗡️",  baseDmg:19, speed:2.0, qteType:"swing_beat",   tier:"refined", beatTimeout:1500,                                        classEmoji:"⚔️",  className:"Swordmaster", desc:"Faster combo window — A→W→D before time runs out!" },
  great_maul:     { id:"great_maul",    name:"Great Maul",      emoji:"🔨",  baseDmg:21, speed:1.0, qteType:"hold_release", tier:"refined", chargePerfectLo:0.78, chargePerfectHi:0.91,             classEmoji:"💪",  className:"Warlord",     desc:"Narrower perfect zone — hold steady and release at the peak." },
  twin_blades:    { id:"twin_blades",   name:"Twin Blades",     emoji:"⚔️",  baseDmg:17, speed:3.5, qteType:"rapid_tap",   tier:"refined", tapTarget:11, rapidDur:1500,                             classEmoji:"🌀",  className:"Bladedancer", desc:"Mash A+D 11 times in 1.5 seconds — push faster!" },
  runic_staff:    { id:"runic_staff",   name:"Runic Staff",     emoji:"🪄",  baseDmg:19, speed:1.6, qteType:"sequence",    tier:"refined", seqLength:5, seqDur:3200,                                classEmoji:"📖",  className:"Runekeeper",  desc:"5-rune sequence, tighter window — one mistake restarts!" },
  hunters_bow:    { id:"hunters_bow",   name:"Hunter's Bow",    emoji:"🏹",  baseDmg:16, speed:1.5, qteType:"archery",     tier:"refined", archDur:3200,                                            classEmoji:"🎯",  className:"Hunter",      desc:"Faster orbiting dots — time each shot carefully." },
  iron_stompers:  { id:"iron_stompers", name:"Iron Stompers",   emoji:"👢",  baseDmg:17, speed:1.4, qteType:"stomp",       tier:"refined", stompDur:650,                                            classEmoji:"🦵",  className:"Crusher",     desc:"Faster stomp — hit the timing at peak force!" },
  war_lance:      { id:"war_lance",     name:"War Lance",       emoji:"🔱",  baseDmg:18, speed:2.0, qteType:"poke",        tier:"refined", pokeDur:1800, pokeTarg:28,                               classEmoji:"⚡",  className:"Vanguard",    desc:"28 keypresses in less time — hammer the entire keyboard!" },
  axe_pistol:     { id:"axe_pistol",    name:"Axe & Pistol",   emoji:"🪓🔫", baseDmg:21, speed:1.5, qteType:"dual_action", tier:"refined", dotSpeed:2.80, centerWidth:0.16,                         classEmoji:"🪓",  className:"Gunslinger",  desc:"Noticeably faster dot — keep your eye on it. Hold A+W+D, click." },
  // ── EPIC (elite drops only — purple) ──
  obsidian_blade: { id:"obsidian_blade",name:"Obsidian Blade",  emoji:"🗡️",  baseDmg:20, speed:2.2, qteType:"swing_beat",  tier:"epic", beatTimeout:900,                                           classEmoji:"🌑",  className:"Darkblade",  desc:"Blink-fast — nail A→W→D in under a second or miss completely." },
  titan_hammer:   { id:"titan_hammer",  name:"Titan's Hammer",  emoji:"🔨",  baseDmg:24, speed:0.9, qteType:"hold_release",tier:"epic", chargePerfectLo:0.84, chargePerfectHi:0.91,               classEmoji:"⚡",  className:"Titan",      desc:"Razor-thin perfect zone — hold steady, release at the peak." },
  shadow_fangs:   { id:"shadow_fangs",  name:"Shadow Fangs",    emoji:"🗡️",  baseDmg:19, speed:4.0, qteType:"rapid_tap",  tier:"epic", tapTarget:14, rapidDur:1300,                               classEmoji:"🕷️", className:"Assassin",   desc:"Mash A+D 14 times in 1.3 seconds — pure chaos speed." },
  void_scepter:   { id:"void_scepter",  name:"Void Scepter",    emoji:"✨",  baseDmg:21, speed:1.8, qteType:"sequence",   tier:"epic", seqLength:6, seqDur:2600,                                   classEmoji:"🌌",  className:"Arcanist",   desc:"6 runes in 2.6 seconds — one mistake and you restart." },
  darkwood_bow:   { id:"darkwood_bow",  name:"Darkwood Bow",    emoji:"🏹",  baseDmg:14, speed:1.5, qteType:"archery",    tier:"epic", archDur:2500,                                               classEmoji:"🌙",  className:"Shadowshot", desc:"Fast-orbiting dots — lightning reflexes needed." },
  thunder_boots:  { id:"thunder_boots", name:"Thunder Boots",   emoji:"👟",  baseDmg:20, speed:1.4, qteType:"stomp",      tier:"epic", stompDur:530,                                               classEmoji:"⚡",  className:"Thunderfoot",desc:"Blink-fast stomp — the window is tiny." },
  dragon_lance:   { id:"dragon_lance",  name:"Dragon Lance",    emoji:"🔱",  baseDmg:22, speed:2.0, qteType:"poke",       tier:"epic", pokeDur:1400, pokeTarg:36,                                  classEmoji:"🐉",  className:"Dragoon",    desc:"36 keypresses — blazing speed, use every finger." },
  club_musket:    { id:"club_musket",   name:"Club & Musket",   emoji:"🏏💥", baseDmg:24, speed:1.0, qteType:"dual_action",tier:"epic", dotSpeed:3.60, centerWidth:0.12,                           classEmoji:"💥",  className:"Rifleman",   desc:"Blazing dot speed — react fast. Hold A+W+D, click the center." },
  sniper_spear:   { id:"sniper_spear",  name:"Sniper & Spear",  emoji:"🎯🔱", baseDmg:26, speed:1.0, qteType:"dual_action",tier:"epic", dotSpeed:4.20, centerWidth:0.10,                           classEmoji:"🎯",  className:"Deadeye",    desc:"Fastest dot — pure reflex. Nail it for massive damage. Hold A+W+D, click." },
  // ── LEGENDARY ──
  rpg:            { id:"rpg",           name:"RPG",             emoji:"🚀",  baseDmg:35, speed:1.2, qteType:"sequence_reveal", tier:"legendary", seqLength:10, classEmoji:"💥", className:"Demolisher" },
};

/* ─── ENEMY DATA ─────────────────────────────────────────────── */
// XP thresholds per level transition (non-resetting: overage carries over)
// L1→2: 35 | L2→3: 75 | L3→4: 60 | L4→5: 110 | L5→6: 160
const XP_THRESHOLDS = [35, 75, 60, 110, 160];
const xpThresholdFor = (level) => XP_THRESHOLDS[level - 1] ?? 9999;

const ENEMIES = {
  goblin_pup: { name:"Goblin Pup",     hp:22,  emoji:"👺", xp:20,  atk:3,  color:"#66cc66", desc:"A tiny, harmless pest"      },
  goblin:   { name:"Goblin Scout",     hp:30,  emoji:"👺", xp:35,  atk:5,  color:"#55bb55", desc:"A cunning little pest"      },
  skeleton: { name:"Skeleton Warrior", hp:32,  emoji:"💀", xp:40,  atk:7,  color:"#aaaaaa", desc:"Bones that refuse to rest"  },
  eye:      { name:"Void Eye",         hp:28,  emoji:"👁️", xp:45,  atk:10, color:"#9944ff", desc:"It sees into your soul"     },
  golem:    { name:"Stone Golem",      hp:65,  emoji:"🗿", xp:60,  atk:12, color:"#aa7744", desc:"Ancient earth made flesh"   },
  wraith:   { name:"Wailing Wraith",   hp:40,  emoji:"👻", xp:50,  atk:14, color:"#4488ff", desc:"A spirit of pure malice"    },
  dragon:   { name:"Demon Slime",       hp:150, emoji:"🟢", xp:160, atk:18, color:"#44dd66", desc:"A demonic mass of pure malice" },
};
const ENEMY_DIMS = {
  goblin_pup:{w:48,h:58}, goblin:{w:64,h:78}, skeleton:{w:56,h:88}, eye:{w:80,h:80},
  golem:{w:84,h:88},  wraith:{w:64,h:96},
  // Boss GIF natural frame size is 288×160 — scale to ~75% to fit battlefield
  // hitFrame/hitFps: used by startRushMeleeQTE to time the parry window on the cleave GIF
  dragon:{w:216,h:120, hitFrame:13, hitFps:12},
};

// Enemy sprite pool — 9 variants randomized per encounter (dragon excluded)
// headPad:    transparent px at top of raw frame before actual character head.
//             Used by stomp QTE to find true head contact point.
//             After cropY is applied, effective headPad in display = max(0, headPad - cropY).
// groundPad:  px to shift enemy up from ground line (raw frame has transparent bottom).
// centerOffsetX: px to shift enemy horizontally for visual centering.
// cropX/Y:    top-left corner of content region within each raw frame (px, pre-scale).
// cropW/H:    size of content region (px). DisplayW/H = cropW/H * eScale.
//             Omit (or leave undefined) for no crop — falls back to full frameW/frameH.
const ENEMY_SPRITE_POOL = [
  // cropY/cropH trim dead top-space found by pixel analysis across all animation frames
  // Gorgon: content starts at y≈38, runs to y=127 → cropY=35,cropH=93
  // Minotaur: content y≈34-127 → cropY=30,cropH=98; walk is only 71px wide so cropX=12,cropW=104
  // Werewolf: content y≈48-127 → cropY=44,cropH=84
  {variant:"Gorgon_1",  name:"Gorgon",        dir:"free-gorgon-pixel-art-character-sprite-sheets",   frameW:128,frameH:128,idleFrames:7,  headPad:22, cropY:35,cropH:93,
   attacks:[{file:"Attack_1.png",frames:16,type:"slow_proj"},{file:"Attack_2.png",frames:7,type:"projectile"},{file:"Attack_3.png",frames:10,type:"rush"}],
   hurtFile:"Hurt.png",hurtFrames:3, deadFile:"Dead.png",deadFrames:3,
   rushApproach:{file:"Run.png",frames:7,fps:10}, rushStrike:{file:"Attack_3.png",frames:10,fps:14,hitFrame:5}},
  {variant:"Gorgon_2",  name:"Gorgon",        dir:"free-gorgon-pixel-art-character-sprite-sheets",   frameW:128,frameH:128,idleFrames:7,  headPad:22, cropY:35,cropH:93,
   attacks:[{file:"Attack_1.png",frames:16,type:"slow_proj"},{file:"Attack_2.png",frames:7,type:"projectile"},{file:"Attack_3.png",frames:10,type:"rush"}],
   hurtFile:"Hurt.png",hurtFrames:3, deadFile:"Dead.png",deadFrames:3,
   rushApproach:{file:"Run.png",frames:7,fps:10}, rushStrike:{file:"Attack_3.png",frames:10,fps:14,hitFrame:5}},
  {variant:"Gorgon_3",  name:"Gorgon",        dir:"free-gorgon-pixel-art-character-sprite-sheets",   frameW:128,frameH:128,idleFrames:7,  headPad:22, cropY:35,cropH:93,
   // Attack_2/Attack_3 are swapped in Gorgon_3's sprite pack — correct frame counts here
   attacks:[{file:"Attack_1.png",frames:16,type:"slow_proj"},{file:"Attack_3.png",frames:7,type:"projectile"},{file:"Attack_2.png",frames:10,type:"rush"}],
   hurtFile:"Hurt.png",hurtFrames:3, deadFile:"Dead.png",deadFrames:3,
   rushApproach:{file:"Run.png",frames:7,fps:10}, rushStrike:{file:"Attack_2.png",frames:10,fps:14,hitFrame:5}},
  {variant:"Minotaur_1",name:"Minotaur",      dir:"free-minotaur-sprite-sheet-pixel-art-pack",       frameW:128,frameH:128,idleFrames:10, headPad:18, cropY:30,cropH:98,
   attacks:[{file:"Attack.png",frames:5,type:"rush"}],
   hurtFile:"Hurt.png",hurtFrames:3, deadFile:"Dead.png",deadFrames:5,
   rushApproach:{file:"Walk.png",frames:12,fps:8}, rushStrike:{file:"Attack.png",frames:5,fps:10,hitFrame:4}},
  {variant:"Minotaur_2",name:"Minotaur",      dir:"free-minotaur-sprite-sheet-pixel-art-pack",       frameW:128,frameH:128,idleFrames:10, headPad:18, cropY:30,cropH:98,
   attacks:[{file:"Attack.png",frames:5,type:"rush"}],
   hurtFile:"Hurt.png",hurtFrames:3, deadFile:"Dead.png",deadFrames:5,
   rushApproach:{file:"Walk.png",frames:12,fps:8}, rushStrike:{file:"Attack.png",frames:5,fps:10,hitFrame:4}},
  {variant:"Minotaur_3",name:"Minotaur",      dir:"free-minotaur-sprite-sheet-pixel-art-pack",       frameW:128,frameH:128,idleFrames:10, headPad:18, cropY:30,cropH:98,
   attacks:[{file:"Attack.png",frames:4,type:"rush",fps:10,hitFrame:3}],
   hurtFile:"Hurt.png",hurtFrames:3, deadFile:"Dead.png",deadFrames:5,
   rushApproach:{file:"Walk.png",frames:12,fps:8}},
  {variant:"Black_Werewolf",name:"Black Werewolf",dir:"free-werewolf-sprite-sheets-pixel-art",       frameW:128,frameH:128,idleFrames:8,  headPad:24,groundPad:10, cropY:44,cropH:84,
   attacks:[{file:"Attack_1.png",frames:6,type:"rush",fps:12,hitFrame:5},{file:"Attack_2.png",frames:4,type:"rush",fps:12,hitFrame:3},{file:"Attack_3.png",frames:5,type:"rush",fps:12,hitFrame:4},{file:"Run+Attack.png",frames:7,type:"rush",fps:14,hitFrame:5}],
   hurtFile:"Hurt.png",hurtFrames:2, deadFile:"Dead.png",deadFrames:2,
   rushApproach:{file:"Run.png",frames:8,fps:12},
   animCrops:{"Run.png":{x:-93,y:44,w:202,h:84,perFrame:[{x:-13,y:44,w:122,h:84},{x:-18,y:44,w:106,h:84},{x:-24,y:44,w:101,h:84},{x:-29,y:44,w:90,h:84},{x:-45,y:44,w:95,h:84},{x:-61,y:44,w:96,h:84},{x:-77,y:44,w:96,h:84},{x:-93,y:44,w:106,h:84}]}}},
  {variant:"Red_Werewolf",  name:"Red Werewolf",  dir:"free-werewolf-sprite-sheets-pixel-art",       frameW:128,frameH:128,idleFrames:8,  headPad:24,groundPad:10, cropY:44,cropH:84,
   attacks:[{file:"Attack_1.png",frames:6,type:"rush",fps:12,hitFrame:5},{file:"Attack_2.png",frames:4,type:"rush",fps:12,hitFrame:3},{file:"Attack_3.png",frames:5,type:"rush",fps:12,hitFrame:4},{file:"Run+Attack.png",frames:7,type:"rush",fps:14,hitFrame:5}],
   hurtFile:"Hurt.png",hurtFrames:2, deadFile:"Dead.png",deadFrames:2,
   rushApproach:{file:"Run.png",frames:8,fps:12},
   animCrops:{"Run.png":{x:-93,y:44,w:202,h:84,perFrame:[{x:-13,y:44,w:122,h:84},{x:-18,y:44,w:106,h:84},{x:-24,y:44,w:101,h:84},{x:-29,y:44,w:90,h:84},{x:-45,y:44,w:95,h:84},{x:-61,y:44,w:96,h:84},{x:-77,y:44,w:96,h:84},{x:-93,y:44,w:106,h:84}]}}},
  {variant:"White_Werewolf",name:"White Werewolf",dir:"free-werewolf-sprite-sheets-pixel-art",       frameW:128,frameH:128,idleFrames:8,  headPad:24,groundPad:10, cropY:44,cropH:84,
   attacks:[{file:"Attack_1.png",frames:6,type:"rush",fps:12,hitFrame:5},{file:"Attack_2.png",frames:4,type:"rush",fps:12,hitFrame:3},{file:"Attack_3.png",frames:5,type:"rush",fps:12,hitFrame:4},{file:"Run+Attack.png",frames:7,type:"rush",fps:14,hitFrame:5}],
   hurtFile:"Hurt.png",hurtFrames:2, deadFile:"Dead.png",deadFrames:2,
   rushApproach:{file:"Run.png",frames:8,fps:12},
   animCrops:{"Run.png":{x:-93,y:44,w:202,h:84,perFrame:[{x:-13,y:44,w:122,h:84},{x:-18,y:44,w:106,h:84},{x:-24,y:44,w:101,h:84},{x:-29,y:44,w:90,h:84},{x:-45,y:44,w:95,h:84},{x:-61,y:44,w:96,h:84},{x:-77,y:44,w:96,h:84},{x:-93,y:44,w:106,h:84}]}}},
];

// Restore user-applied animCrops from localStorage so edits survive page reloads.
// Accepts any entry that has perFrame data (user's manual crop edits).
try {
  const _saved = JSON.parse(localStorage.getItem('__animCrops') || '{}');
  for (const _e of ENEMY_SPRITE_POOL) {
    if (_saved[_e.variant]) {
      if (!_e.animCrops) _e.animCrops = {};
      for (const [_file, _crop] of Object.entries(_saved[_e.variant])) {
        if (!_crop || typeof _crop !== 'object') continue;
        if (!_crop.perFrame?.length && !_crop._v) continue; // skip empty/corrupt entries
        _e.animCrops[_file] = _crop;
      }
    }
  }
} catch(_) {}

// Helper: get rush strike config for a given attack index
// Uses explicit rushStrike if present, otherwise reads from attacks[atkIdx] (must be type:"rush")
// Falls back to first rush attack entry if atkIdx not specified or out of range
function getRushStrike(sp, atkIdx = null) {
  if (!sp) return null;
  // If explicit rushStrike and no per-attack setup, use it
  if (sp.rushStrike && !sp.attacks?.some(a => a.type === 'rush')) return sp.rushStrike;
  // Find the attack at atkIdx (or first rush attack)
  const atk = (atkIdx != null && sp.attacks?.[atkIdx]?.type === 'rush')
    ? sp.attacks[atkIdx]
    : sp.attacks?.find(a => a.type === 'rush');
  if (atk) return { file: atk.file, frames: atk.frames, fps: atk.fps || 12,
                    hitFrame: atk.hitFrame ?? (atk.frames - 1) };
  // Final fallback to explicit rushStrike
  return sp.rushStrike ?? null;
}

// Gandalf layered hero sprites — randomized per run
// Path helpers
const _G  = (p) => `${ASSET_BASE}/icons/sprites/GandalfHardcore Character Asset Pack/${p}`;
const _G58 = (g,p) => `${ASSET_BASE}/icons/sprites/GandalfHardcore 58x Hair/GandalfHardcore 58x Hair/${g}/${p}`;
const _G43F = (p)  => `${ASSET_BASE}/icons/sprites/GandalfHardcore 43x Female Clothing/GandalfHardcore 43x Female Clothing/${p}`;
const _G14  = (g,p)=> `${ASSET_BASE}/icons/sprites/GandalfHardcore 14x Arm Layers/GandalfHardcore Arm Layers/${g}/${p}`;

const HERO_LAYERS = {
  male: {
    skins: [1,2,3,4,5].map(i=>_G(`Character skin colors/Male Skin${i}.png`)),
    clothing: [
      _G("Male Clothing/Blue Pants.png"),    _G("Male Clothing/Blue Shirt v2.png"),
      _G("Male Clothing/Green Pants.png"),   _G("Male Clothing/Green Shirt v2.png"),
      _G("Male Clothing/Green Underwear.png"),_G("Male Clothing/Orange Pants.png"),
      _G("Male Clothing/Orange Underwear.png"),_G("Male Clothing/Pants.png"),
      _G("Male Clothing/Purple Pants.png"),  _G("Male Clothing/Purple Shirt v2.png"),
      _G("Male Clothing/Purple Underwear.png"),_G("Male Clothing/Red Underwear.png"),
      _G("Male Clothing/Shirt v2.png"),      _G("Male Clothing/Shirt.png"),
      _G("Male Clothing/Skyblue Underwear.png"),_G("Male Clothing/Underwear.png"),
      _G("Male Clothing/orange Shirt v2.png"),
    ],
    boots: [
      // Shoes.png is near-fully transparent — removed. Boots.png only.
      // bootsIdleRow:0 = idle row (same as all other layers)
      {src:_G("Male Clothing/Boots.png"), bootsIdleRow:0, bootsYOffset:8},
      {src:_G("Male Clothing/Boots.png"), bootsIdleRow:0, bootsYOffset:8},
      {src:_G("Male Clothing/Boots.png"), bootsIdleRow:0, bootsYOffset:8},
    ],
    arms: [
      null, null,  // ~22% no arms
      _G14("Male","Gloves.png"),       _G14("Male","Glove blue.png"),
      _G14("Male","Glove green.png"),  _G14("Male","Glove orange.png"),
      _G14("Male","Glove purple.png"), _G14("Male","Glove red.png"),
      _G14("Male","Glove white.png"),
    ],
    hair: [
      ...[1,2,3,4,5].map(i=>_G(`Male Hair/Male Hair${i}.png`)),
      ...[6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30].map(i=>_G58("28x Male Hair",`Male Hair${i}.png`)),
      _G58("28x Male Hair","Fancy Hair.png"),
      _G58("28x Male Hair","Queen hair.png"),
      _G58("28x Male Hair","Shield Maiden hair.png"),
    ],
    hand: [_G("Male Hand/Male Sword.png")],
    frameW:80, frameH:64, totalRows:7, cols:10,
    srcXOffset:0, srcYOffset:0, contentW:76,
    idleRow:0, idleCols:5, walkRow:1, walkCols:8,
    runRow:2,  runCols:8,  jumpRow:3, jumpCols:4,
    fallRow:4, fallCols:4, atkRow:5,  atkCols:6,
    deathRow:6,deathCols:8,
  },
  female: {
    skins: [1,2,3,4,5].map(i=>_G(`Character skin colors/Female Skin${i}.png`)),
    // G43F clothing removed — incompatible pack origin/scale with base LPC skin
    // (renders as misaligned color blocks, same root cause as G43F boots removal)
    clothing: [
      _G("Female Clothing/Blue Corset.png"),   _G("Female Clothing/Blue Corset v2.png"),
      _G("Female Clothing/Corset.png"),         _G("Female Clothing/Corset v2.png"),
      _G("Female Clothing/Green Corset.png"),   _G("Female Clothing/Green Corset v2.png"),
      _G("Female Clothing/Orange Corset.png"),  _G("Female Clothing/Orange Corset v2.png"),
      _G("Female Clothing/Purple Corset.png"),  _G("Female Clothing/Purple Corset v2.png"),
      _G("Female Clothing/Blue Panties and Bra.png"),   _G("Female Clothing/Green Panties and Bra.png"),
      _G("Female Clothing/Orange Panties and Bra.png"), _G("Female Clothing/Purple Panties and Bra.png"),
      _G("Female Clothing/Red Panties and Bra.png"),    _G("Female Clothing/Skyblue Panties and Bra.png"),
    ],
    // legs layer: sits between skin and clothing, fills hip/thigh area
    // base-pack has no pants for female — Skirt.png is best available leg coverage
    legs: [
      _G("Female Clothing/Skirt.png"),
      _G("Female Clothing/Skirt.png"),
      _G("Female Clothing/Skirt.png"),
    ],
    boots: [
      // base-pack: row 0 empty → use row 7 (standing foot Y=49-55) for idle
      {src:_G("Female Clothing/Boots.png"),        bootsIdleRow:0, bootsYOffset:0, bootsNudgeX:0},
      {src:_G("Female Clothing/Boots.png"),        bootsIdleRow:0, bootsYOffset:0, bootsNudgeX:0},
      {src:_G("Female Clothing/Socks.png"),        bootsIdleRow:0, bootsYOffset:0, bootsNudgeX:0},
      {src:_G("Female Clothing/Green Socks.png"),  bootsIdleRow:0, bootsYOffset:0, bootsNudgeX:0},
      {src:_G("Female Clothing/Orange Socks.png"), bootsIdleRow:0, bootsYOffset:0, bootsNudgeX:0},
      {src:_G("Female Clothing/Purple Socks.png"), bootsIdleRow:0, bootsYOffset:0, bootsNudgeX:0},
      {src:_G("Female Clothing/Red Socks.png"),    bootsIdleRow:0, bootsYOffset:0, bootsNudgeX:0},
      {src:_G("Female Clothing/Skyblue Socks.png"),bootsIdleRow:0, bootsYOffset:0, bootsNudgeX:0},
      // G43F thigh-high boots removed — incompatible pack origin/scale with base LPC skin
    ],
    arms: [
      null, null,  // ~22% no arms
      _G14("Female","Opera Gloves.png"),       _G14("Female","Opera Gloves blue.png"),
      _G14("Female","Opera Gloves brown.png"), _G14("Female","Opera Gloves green.png"),
      _G14("Female","Opera Gloves orange.png"),_G14("Female","Opera Gloves purple.png"),
      _G14("Female","Opera Gloves red.png"),
    ],
    hair: [
      ...[1,2,3,4,5].map(i=>_G(`Female Hair/Female Hair${i}.png`)),
      ...[6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35].map(i=>_G58("30x Female Hair",`Female Hair${i}.png`)),
    ],
    hand: [_G("Female Hand/Female Sword.png")],
    frameW:80, frameH:64, totalRows:7, cols:10,
    srcXOffset:0, srcYOffset:0, contentW:76,
    idleRow:0, idleCols:5, walkRow:1, walkCols:8,
    runRow:2,  runCols:8,  jumpRow:3, jumpCols:4,
    fallRow:4, fallCols:4, atkRow:5,  atkCols:6,
    deathRow:6,deathCols:8,
  },
};
const pick = (arr) => arr[Math.floor(Math.random()*arr.length)];
const randomHeroLooks = () => {
  const gender = Math.random()<0.5?"male":"female";
  const g = HERO_LAYERS[gender];
  const bootPick = pick(g.boots); // {src, bootsIdleRow} object
  return {
    gender,
    skin:         pick(g.skins),
    legs:         g.legs ? pick(g.legs) : null, // female only: skirt/leggings between skin + clothing
    clothing:     pick(g.clothing),
    boots:        bootPick.src,         // path string
    bootsIdleRow: bootPick.bootsIdleRow ?? 0, // which sprite row to show when idle
    bootsYOffset: bootPick.bootsYOffset  ?? 0, // translateY(px) to fine-tune boot alignment
    bootsNudgeX:  bootPick.bootsNudgeX  ?? -1, // translateX(px) per-entry override
    arms:         pick(g.arms),         // may be null → no arm layer
    hair:         pick(g.hair),
    ears:         null,
    hand:         pick(g.hand),
    frameW:       g.frameW,
    frameH:       g.frameH,
    totalRows:    g.totalRows,
    cols:         g.cols,
    srcXOffset:   g.srcXOffset ?? 0,
    srcYOffset:   g.srcYOffset ?? 0,
    contentW:     g.contentW   ?? g.frameW,
    idleRow:  g.idleRow,  idleCols:  g.idleCols,
    walkRow:  g.walkRow,  walkCols:  g.walkCols,
    runRow:   g.runRow,   runCols:   g.runCols,
    jumpRow:  g.jumpRow,  jumpCols:  g.jumpCols,
    fallRow:  g.fallRow,  fallCols:  g.fallCols,
    atkRow:   g.atkRow,   atkCols:   g.atkCols,
    deathRow: g.deathRow, deathCols: g.deathCols,
  };
};

/* ─── MAP DATA ───────────────────────────────────────────────── */
const MAP_W = 520, MAP_H = 480;

// 5 floors of choices + boss. Clean, readable, deliberate pacing.
const FLOOR_CONFIGS = [
  [{ type:"combat", enemy:"goblin_pup" }, { type:"combat", enemy:"goblin_pup" }],
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
  { id:"hp15",  type:"heal", label:"Health Vial",   emoji:"🧪", desc:"Restore 15 HP", value:15 },
  { id:"hp30",  type:"heal", label:"Health Potion", emoji:"⚗️", desc:"Restore 30 HP", value:30 },
  { id:"str1",  type:"stat", label:"Strength Shard",emoji:"💪", desc:"+1 Strength",    stat:"str",   value:1  },
  { id:"mhp10", type:"stat", label:"Vitality Shard",emoji:"❤️", desc:"+10 Max HP",     stat:"maxHp", value:10 },
  // Basic weapons (normal + elite drops)
  { id:"w_boots",        type:"weapon", label:"Iron Boots",      emoji:"👟",  weaponId:"boots"        },
  { id:"w_axe",          type:"weapon", label:"Battle Axe",      emoji:"🪓",  weaponId:"axe"          },
  { id:"w_spear",        type:"weapon", label:"Iron Spear",      emoji:"🔱",  weaponId:"spear"        },
  { id:"w_wand",         type:"weapon", label:"Chaos Wand",      emoji:"✨",  weaponId:"wand"         },
  { id:"w_knife_shotgun",type:"weapon", label:"Knife & Shotgun", emoji:"🔪💥", weaponId:"knife_shotgun"},
  // Refined weapons (elite drops only)
  { id:"w_longsword",    type:"weapon", label:"Longsword",       emoji:"🗡️",  weaponId:"longsword",    eliteOnly:true },
  { id:"w_great_maul",   type:"weapon", label:"Great Maul",      emoji:"🔨",  weaponId:"great_maul",   eliteOnly:true },
  { id:"w_twin_blades",  type:"weapon", label:"Twin Blades",     emoji:"⚔️",  weaponId:"twin_blades",  eliteOnly:true },
  { id:"w_runic_staff",  type:"weapon", label:"Runic Staff",     emoji:"🪄",  weaponId:"runic_staff",  eliteOnly:true },
  { id:"w_hunters_bow",  type:"weapon", label:"Hunter's Bow",    emoji:"🏹",  weaponId:"hunters_bow",  eliteOnly:true },
  { id:"w_iron_stompers",type:"weapon", label:"Iron Stompers",   emoji:"👢",  weaponId:"iron_stompers",eliteOnly:true },
  { id:"w_war_lance",    type:"weapon", label:"War Lance",       emoji:"🔱",  weaponId:"war_lance",    eliteOnly:true },
  { id:"w_axe_pistol",   type:"weapon", label:"Axe & Pistol",   emoji:"🪓🔫", weaponId:"axe_pistol",   eliteOnly:true },
  // Epic weapons (elite drops only, rarer weight)
  { id:"w_obsidian_blade",type:"weapon",label:"Obsidian Blade",  emoji:"🗡️",  weaponId:"obsidian_blade",eliteOnly:true, epicOnly:true },
  { id:"w_titan_hammer",  type:"weapon",label:"Titan's Hammer",  emoji:"🔨",  weaponId:"titan_hammer",  eliteOnly:true, epicOnly:true },
  { id:"w_shadow_fangs",  type:"weapon",label:"Shadow Fangs",    emoji:"🗡️",  weaponId:"shadow_fangs",  eliteOnly:true, epicOnly:true },
  { id:"w_void_scepter",  type:"weapon",label:"Void Scepter",    emoji:"✨",  weaponId:"void_scepter",  eliteOnly:true, epicOnly:true },
  { id:"w_darkwood_bow",  type:"weapon",label:"Darkwood Bow",    emoji:"🏹",  weaponId:"darkwood_bow",  eliteOnly:true, epicOnly:true },
  { id:"w_thunder_boots", type:"weapon",label:"Thunder Boots",   emoji:"👟",  weaponId:"thunder_boots", eliteOnly:true, epicOnly:true },
  { id:"w_dragon_lance",  type:"weapon",label:"Dragon Lance",    emoji:"🔱",  weaponId:"dragon_lance",  eliteOnly:true, epicOnly:true },
  { id:"w_club_musket",   type:"weapon",label:"Club & Musket",   emoji:"🏏💥", weaponId:"club_musket",   eliteOnly:true, epicOnly:true },
  { id:"w_sniper_spear",  type:"weapon",label:"Sniper & Spear",  emoji:"🎯🔱", weaponId:"sniper_spear",  eliteOnly:true, epicOnly:true },
  // RPG excluded — dragon kill only
  ...POTIONS.map(pt=>({ id:`pot_${pt.id}`, type:"potion", label:pt.name, emoji:pt.emoji, desc:pt.desc, potion:pt })),
];
const pickRewards = (held, eliteDrop=false) => {
  const pool = BASE_REWARDS.filter(r => {
    if (r.type==="weapon") {
      if (held.includes(r.weaponId)) return false;
      const newW = ALL_WEAPONS[r.weaponId];
      if (newW) {
        const sameQte = held.find(wid=>(ALL_WEAPONS[wid]?.qteType)===newW.qteType);
        if (sameQte) {
          const oldTier = TIER_ORDER[ALL_WEAPONS[sameQte]?.tier??'basic']??0;
          const newTier = TIER_ORDER[newW.tier??'basic']??0;
          if (newTier <= oldTier) return false; // useless downgrade/sidegrade
        }
      }
    }
    if (r.eliteOnly && !eliteDrop) return false;
    return true;
  });
  // Weighted pool: basic/consumable=4 copies, refined=2, epic=1
  const weighted = pool.flatMap(r => Array(r.epicOnly?1:r.eliteOnly?2:4).fill(r));
  const pickUnique = arr => {
    const seen = new Set();
    return [...arr].sort(()=>Math.random()-.5).filter(r=>{ if(seen.has(r.id)) return false; seen.add(r.id); return true; });
  };
  // Elite drops: guarantee at least 1 epic weapon (then fill remaining 2 slots normally)
  if (eliteDrop) {
    const epicWeapons = pool.filter(r=>r.type==="weapon"&&r.epicOnly);
    const otherPool   = pool.filter(r=>!(r.type==="weapon"&&r.epicOnly));
    const otherW      = pickUnique(otherPool.flatMap(r=>Array(r.eliteOnly?2:4).fill(r)));
    const potions     = otherW.filter(r=>r.type==="potion");
    const nonPotion   = otherW.filter(r=>r.type!=="potion");
    if (epicWeapons.length > 0) {
      const guaranteed = epicWeapons[Math.floor(Math.random()*epicWeapons.length)];
      const filler = potions.length>0 ? [potions[0], ...nonPotion.slice(0,1)] : nonPotion.slice(0,2);
      return [guaranteed, ...filler].sort(()=>Math.random()-.5);
    }
  }
  const potions = pickUnique(weighted.filter(r=>r.type==="potion"));
  const others  = pickUnique(weighted.filter(r=>r.type!=="potion"));
  const result = potions.length>0
    ? [potions[0], ...others.slice(0,2)]
    : others.slice(0,3);
  return result.sort(()=>Math.random()-.5);
};

/* ─── RPG DEFEND VARIANTS ────────────────────────────────────── */
// Every RPG launch picks one at random — defender sees a different pattern each time
const RPG_DEFEND_VARIANTS = [
  { dur: 660, launch:0.10, arrive:0.74, projPath:"straight"    }, // sprint  — straight fast
  { dur:1400, launch:0.28, arrive:0.88, projPath:"loop"        }, // arc     — looping high
  { dur: 880, launch:0.14, arrive:0.78, projPath:"bounce"      }, // skip    — bouncing low
  { dur: 540, launch:0.08, arrive:0.70, projPath:"ground_rush" }, // deck    — ground skim
  { dur:1200, launch:0.20, arrive:0.84, projPath:"zigzag"      }, // spiral  — zigzag weave
  { dur:1650, launch:0.38, arrive:0.92, projPath:"straight"    }, // siege   — slow heavy shot
];

/* ─── BATTLEFIELD CONSTANTS ──────────────────────────────────── */
const STOMP_DUR = 800;
const LAND_FRAC = 0.52;
const STOMP_APPROACH_DUR = Math.round(STOMP_DUR * LAND_FRAC); // contact-0 duration: approach only
const BFW = 700, BFH = 250, GNDY = 228;
const HSW = Math.round(48 * 0.85);   // ≈ 41
const HSH = Math.round(76 * 0.85);   // ≈ 65
const HRX = 560;
const HR_L = HRX - HSW / 2;          // ≈ 539
const HR_T = GNDY - HSH - 3;          // ≈ 160 — lifted 3px so feet don't clip into ground line
const ENX = 130;
const STRIKE_L = 155;                 // hero left edge when touching enemy

function easeIO(t) { return t * t * (3 - 2 * t); }

function heroStompPos(t, landLeft, landTop) {
  if (t <= LAND_FRAC) {
    const s = easeIO(t / LAND_FRAC);
    const left = HR_L + (landLeft - HR_L) * s;
    // Arc control point: midpoint between HR_T and landTop, pulled 40px above it
    const P0 = HR_T, P1 = Math.max(0, Math.min(HR_T, landTop) - 40), P2 = landTop;
    const top = (1-s)*(1-s)*P0 + 2*(1-s)*s*P1 + s*s*P2;
    return { left, top };
  } else {
    const s = easeIO((t - LAND_FRAC) / (1 - LAND_FRAC));
    const left = landLeft + (HR_L - landLeft) * s;
    const P0 = landTop, P1 = Math.min(HR_T, landTop + 60), P2 = HR_T;
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

// Bounce on enemy head — apex well above enemy head for visible arc
function heroStompBouncePos(t, landLeft, landTop) {
  const APEX = Math.max(0, landTop - 48); // 48px above enemy head, clamped ≥0
  if (t <= LAND_FRAC) {
    const s = easeIO(t / LAND_FRAC);
    return { left: landLeft, top: landTop + (APEX - landTop) * s };
  } else {
    const s = easeIO((t - LAND_FRAC) / (1 - LAND_FRAC));
    return { left: landLeft, top: APEX + (landTop - APEX) * s };
  }
}

/* ─── SVG CHARACTER SPRITES ──────────────────────────────────── */

// Weapon-orbit keyframes — injected once
if (!document.getElementById('__weaponOrbitKF')) {
  const _s = document.createElement('style');
  _s.id = '__weaponOrbitKF';
  _s.textContent = `
    @keyframes weaponOrbit        { from{transform:rotate(0deg)}   to{transform:rotate(360deg)}  }
    @keyframes weaponOrbitCounter { from{transform:rotate(0deg)}   to{transform:rotate(-360deg)} }
    @keyframes weaponOrbitPulse   { 0%,100%{opacity:.85;transform:rotate(-360deg) scale(1)}  50%{opacity:1;transform:rotate(-180deg) scale(1.2)} }
  `;
  document.head.appendChild(_s);
}

// Stomp impact burst keyframes — injected once
if (!document.getElementById('__stompImpactKF')) {
  const _si = document.createElement('style');
  _si.id = '__stompImpactKF';
  _si.textContent = `
    @keyframes siFlash  { 0%{transform:scale(0.15);opacity:1} 55%{transform:scale(1.6);opacity:.9} 100%{transform:scale(2.4);opacity:0} }
    @keyframes siSpike  { 0%{transform:scaleX(0.05);opacity:1} 60%{transform:scaleX(1);opacity:1} 100%{transform:scaleX(1.35);opacity:0} }
    @keyframes siDebris { 0%{opacity:1;transform:translate(0,0) scale(1)} 100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(0.4)} }
    @keyframes siLabel  { 0%{opacity:1;transform:translateX(-50%) scale(0.6) translateY(0px)} 40%{opacity:1;transform:translateX(-50%) scale(1.15) translateY(-10px)} 100%{opacity:0;transform:translateX(-50%) scale(1) translateY(-22px)} }
    @keyframes siRing   { 0%{transform:scale(0.1);opacity:.9;border-width:6px} 100%{transform:scale(2.8);opacity:0;border-width:1px} }
  `;
  document.head.appendChild(_si);
}

// Animates a horizontal sprite strip — JS-driven frame counter
// Per-frame canvas sprite image cache
const _spriteImgCache = {};

// AnimatedSprite — always-canvas renderer.
// Handles both per-frame ops (animCrops perFrame data) and uniform crop strips (CSS-equivalent).
// Always uses a <canvas> so phase transitions never swap element types → no flash on animation switch.
const AnimatedSprite = React.memo(function AnimatedSprite({
  src, numFrames, fps=8, displayW, displayH, flip=false,
  imgW=null, imgH=null, cropOffX=0, cropOffY=0, loop=true,
  perFrameOps=null, // [{srcX,srcY,srcW,srcH,dstX,dstY,dstW,dstH}] — per-frame canvas mode
  onComplete=null,  // fired once when loop=false animation reaches last frame
}) {
  const [frame, setFrame] = React.useState(0);
  const canvasRef = React.useRef(null);
  const [, forceUpdate] = React.useReducer(x=>x+1, 0);
  const onCompleteRef = React.useRef(onComplete);
  React.useEffect(()=>{ onCompleteRef.current = onComplete; }, [onComplete]);

  React.useEffect(()=>{
    setFrame(0);
    const iv = setInterval(()=>setFrame(f=>{
      if (!loop && f >= numFrames - 1) {
        clearInterval(iv);
        onCompleteRef.current?.();
        return numFrames - 1;
      }
      return (f + 1) % numFrames;
    }), 1000/fps);
    return ()=>clearInterval(iv);
  },[src, numFrames, fps, loop]);

  // Always load image — needed for canvas draw in both modes
  React.useEffect(()=>{
    if (_spriteImgCache[src]) { forceUpdate(); return; }
    const img = new Image();
    img.onload = ()=>{ _spriteImgCache[src] = img; forceUpdate(); };
    img.src = src;
  },[src]);

  // Canvas draw — useLayoutEffect fires before paint so changing canvas dimensions
  // (width/height attrs clear the buffer) never produce a visible blank frame.
  React.useLayoutEffect(()=>{
    const cv = canvasRef.current; if (!cv) return;
    const img = _spriteImgCache[src]; if (!img) return;
    const ctx = cv.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, displayW, displayH);
    if (perFrameOps) {
      // Per-frame ops: each frame has its own srcX/srcY/srcW/srcH crop (may include negative-x borrows)
      const op = perFrameOps[frame % perFrameOps.length];
      if (op && op.srcW > 0 && op.srcH > 0)
        ctx.drawImage(img, op.srcX, op.srcY, op.srcW, op.srcH, op.dstX, op.dstY, op.dstW, op.dstH);
    } else {
      // Uniform crop: CSS-equivalent sliding strip, computed from natural image dimensions
      const nfw    = img.naturalWidth / numFrames;      // natural pixels per frame
      const scaleX = imgW ? (img.naturalWidth  / imgW) : 1; // display→natural x ratio
      const scaleY = imgH ? (img.naturalHeight / imgH) : 1; // display→natural y ratio
      const srcX   = frame * nfw + cropOffX * scaleX;
      const srcY   = cropOffY * scaleY;
      const srcW   = displayW * scaleX;
      const srcH   = displayH * scaleY;
      if (srcW > 0 && srcH > 0)
        ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, displayW, displayH);
    }
  },[frame, src, perFrameOps, displayW, displayH, imgW, imgH, cropOffX, cropOffY, numFrames]);

  // Always canvas — no element-type switching between animation phases
  return <canvas ref={canvasRef} width={displayW} height={displayH}
    style={{display:'block', imageRendering:'pixelated',
      transform:flip?'scaleX(-1)':'none'}}/>;
});

// PerFrameCanvas — dedicated per-frame sprite renderer that reads animCrops directly.
// Bypasses AnimatedSprite / perFrameOps useMemo completely.
// Same draw logic as CropEditor preview — guaranteed to show the exact saved crops.
const _pfImgCache = {};
function PerFrameCanvas({ src, animCrops, fw=128, fps=12, scale=1, loop=true, flip=false }) {
  const pf    = animCrops?.perFrame;
  const uTop  = animCrops?.y ?? 0;
  const uH    = animCrops?.h ?? fw;
  const nf    = pf?.length || 1;
  const maxW      = pf ? Math.max(...pf.map(p => p.w)) : fw;
  const maxSrcXL  = pf ? Math.max(...pf.map((p, n) => Math.max(0, -(n * fw + p.x)))) : 0;
  const canvasW   = maxW + maxSrcXL;
  const displayW  = Math.round(canvasW * scale);
  const displayH  = Math.round(uH * scale);
  const sx        = displayW / canvasW;
  const sy        = displayH / uH;
  const fixedDstX = Math.round(maxSrcXL * sx);

  const [frame, setFrame] = React.useState(0);
  const canvasRef = React.useRef(null);
  const pfRef     = React.useRef(pf);  pfRef.current = pf;   // always latest, no stale closure
  const acRef     = React.useRef(animCrops); acRef.current = animCrops;
  const [, bump]  = React.useReducer(x => x+1, 0);

  // Animation tick
  React.useEffect(() => {
    setFrame(0);
    if (nf <= 1) return;
    const iv = setInterval(() => setFrame(f => loop ? (f+1)%nf : Math.min(f+1, nf-1)), 1000/fps);
    return () => clearInterval(iv);
  }, [src, nf, fps, loop]);

  // Image load (once per src)
  React.useEffect(() => {
    if (_pfImgCache[src]) { bump(); return; }
    const img = new Image();
    img.onload = () => { _pfImgCache[src] = img; bump(); };
    img.src = src;
  }, [src]);

  // Draw on every frame tick
  React.useEffect(() => {
    const cv = canvasRef.current; if (!cv) return;
    const img = _pfImgCache[src]; if (!img) return;
    const _pf = pfRef.current;
    const _ac = acRef.current;
    const _uTop = _ac?.y ?? 0;
    const ctx = cv.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, displayW, displayH);
    if (!_pf || !_pf.length) return;
    const fi   = frame % _pf.length;
    const p    = _pf[fi];
    const aFW = img.naturalWidth / _pf.length;  // actual frame width in image pixels
    const iSx = aFW / fw;                         // logical → image pixel scale (x only)
    // pf.y/pf.h are in image pixel coords (sy=1 for single-row sprite sheets)
    const absL = fi * aFW + p.x * iSx;
    const absR = fi * aFW + (p.x + p.w) * iSx;
    const srcX = Math.max(0, absL);
    const srcW = Math.max(0, Math.min(img.naturalWidth, absR) - srcX);
    const srcY = p.y ?? _uTop;
    const srcH = p.h ?? uH;
    const dstW = Math.round(srcW / iSx * sx);
    const dstH = Math.round(srcH * sy);
    if (srcW > 0 && srcH > 0)
      ctx.drawImage(img, srcX, srcY, srcW, srcH, fixedDstX, 0, dstW, dstH);
  }, [frame, src]);

  if (!pf || !pf.length) return null;
  return <canvas ref={canvasRef} width={displayW} height={displayH}
    style={{display:'block', imageRendering:'pixelated', transform:flip?'scaleX(-1)':'none'}}/>;
}

// Hero sprite — layered skin + clothing + hair, all same spritesheet layout.
// ── Global image cache — loaded once, reused forever ──────────────────────────
const _heroImgEl = {};
const _heroImgP  = {};
const _loadHeroImg = (src) => {
  if (!src) return Promise.resolve(null);
  if (_heroImgEl[src] !== undefined) return Promise.resolve(_heroImgEl[src]);
  if (_heroImgP[src])  return _heroImgP[src];
  return (_heroImgP[src] = new Promise(res => {
    const img = new Image();
    img.onload  = () => { _heroImgEl[src] = img;  res(img);  };
    img.onerror = () => { _heroImgEl[src] = null; res(null); };
    img.src = src;
  }));
};

// ── Baked sprite sheet cache — key → dataURL string | Promise<string> ─────────
// Composites every layer at every [row][col] into one PNG once per hero look set.
// All dress/boots special-case logic is burned in here so runtime is a plain CSS sprite.
const _bakedSheets = {};
const _bakeKey = (looks, dW, dH) =>
  `${dW}x${dH}|${[looks.skin,looks.clothing,looks.boots,looks.legs,looks.arms,looks.hair].join('|')}`;

const _bakeHeroSheet = (looks, displayW, displayH) => {
  const cols       = looks.cols       || 10;
  const totalRows  = looks.totalRows  || 7;
  const idleRow    = looks.idleRow    ?? 0;
  const frameW     = looks.frameW     || 80;
  const frameH     = looks.frameH     || 64;
  const srcXOffset = looks.srcXOffset ?? 0;
  const srcYOffset = looks.srcYOffset ?? 0;
  const contentW   = looks.contentW   ?? frameW;
  const bootsIdleRow = looks.bootsIdleRow ?? idleRow;
  const bootsYOffset = looks.bootsYOffset ?? 0;
  const bootsNudgeX  = looks.bootsNudgeX  ?? -1;
  const hasDress     = !!looks.legs;

  const vScale         = displayH / frameH;
  const scaledFW       = Math.round(frameW * vScale);
  const bgW            = cols      * scaledFW;
  const bgH            = totalRows * displayH;
  const scaledSrcX     = Math.round(srcXOffset * vScale);
  const scaledSrcY     = Math.round(srcYOffset * vScale);
  const scaledContentW = Math.round(contentW   * vScale);
  const centerCrop     = scaledSrcX + Math.round((scaledContentW - displayW) / 2);

  const layerSrcs = (hasDress
    ? [looks.skin, looks.clothing, looks.boots, looks.legs, looks.arms, looks.hair]
    : [looks.skin, looks.clothing, looks.boots, looks.arms, looks.hair]
  ).filter(Boolean);

  return Promise.all(layerSrcs.map(_loadHeroImg)).then(imgs => {
    const canvas = document.createElement('canvas');
    canvas.width  = cols * displayW;
    canvas.height = totalRows * displayH;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    for (let row = 0; row < totalRows; row++) {
      const isIdle = row === idleRow;
      for (let col = 0; col < cols; col++) {
        const cellX = col * displayW;
        const cellY = row * displayH;

        imgs.forEach((img, i) => {
          if (!img) return;
          const src = layerSrcs[i];
          const isBootsLayer = src === looks.boots;
          const isLegsLayer  = !!(looks.legs && src === looks.legs);

          const nw = img.naturalWidth, nh = img.naturalHeight;
          const nScaleY = nh / bgH;

          // Per-layer X: use each layer's own natural frame width
          const layerNFW      = Math.round(nw / cols);
          const layerScaledFW = Math.round(layerNFW * vScale);   // display-scaled frame width
          const layerBgW      = cols * layerScaledFW;
          const layerNScaleX  = nw / layerBgW;
          const layerCropX    = (layerNFW === frameW)
            ? centerCrop   // main-layer: respect srcXOffset + contentW crop
            : Math.max(0, Math.round((layerScaledFW - displayW) / 2)); // clamp: avoid negative when layer narrower than displayW

          // All layers use their own animation row — every sheet has 7 rows
          const rowForLayer = row;

          const bpX = -(layerCropX + col * layerScaledFW);
          const bpY = -(rowForLayer * displayH + scaledSrcY);
          const srcX = Math.round(-bpX * layerNScaleX);
          const srcY = Math.round(-bpY * nScaleY);
          const srcW = Math.min(Math.round(displayW * layerNScaleX), layerNFW); // don't read past layer's own frame boundary
          const srcH = Math.round(displayH * nScaleY);

          const dstX = cellX + (isBootsLayer ? bootsNudgeX : 0);
          const dstY = cellY + (isBootsLayer ? bootsYOffset : 0);

          // Clip to cell boundary — prevents offset layers bleeding into adjacent cells
          ctx.save();
          ctx.beginPath();
          ctx.rect(cellX, cellY, displayW, displayH);
          ctx.clip();
          ctx.drawImage(img, srcX, srcY, srcW, srcH, dstX, dstY, displayW, displayH);
          ctx.restore();
        });
      }
    }
    return canvas.toDataURL('image/png');
  });
};

// ── LayeredHeroSprite — bakes once, then renders as a single CSS sprite div ───
const LayeredHeroSprite = React.memo(function LayeredHeroSprite({ looks, displayW=41, displayH=65, animRow=null, animFrame=0 }) {
  const [bakedUrl, setBakedUrl] = React.useState(null);

  useEffect(() => {
    if (!looks?.skin) return;
    const key = _bakeKey(looks, displayW, displayH);
    // Already baked
    if (typeof _bakedSheets[key] === 'string') { setBakedUrl(_bakedSheets[key]); return; }
    // Already baking — wait on existing promise
    let alive = true;
    const p = _bakedSheets[key] || (_bakedSheets[key] = _bakeHeroSheet(looks, displayW, displayH));
    p.then(url => {
      _bakedSheets[key] = url; // replace promise with resolved string
      if (alive) setBakedUrl(url);
    });
    return () => { alive = false; };
  }, [looks, displayW, displayH]);

  if (!bakedUrl) return null; // invisible while baking (first render only)

  const cols      = looks.cols      || 10;
  const totalRows = looks.totalRows || 7;
  const activeRow = animRow ?? (looks.idleRow ?? 0);
  const bgW       = cols      * displayW;
  const bgH       = totalRows * displayH;
  const bpX       = -(animFrame * displayW);
  const bpY       = -(activeRow * displayH);

  return (
    <div style={{
      width: displayW, height: displayH,
      backgroundImage: `url("${bakedUrl}")`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: `${bgW}px ${bgH}px`,
      backgroundPosition: `${bpX}px ${bpY}px`,
      imageRendering: 'pixelated',
    }}/>
  );
}); // LayeredHeroSprite memo

const CLASS_COLORS = {
  // Basic
  Knight:{body:"#4466bb",trim:"#ddaa33"},   Berserker:{body:"#882222",trim:"#dd6622"},
  Rogue:{body:"#223344",trim:"#44aaaa"},    Mage:{body:"#442288",trim:"#aa44ff"},
  Ranger:{body:"#224422",trim:"#44bb44"},   Brawler:{body:"#664422",trim:"#ccaa44"},
  Warrior:{body:"#556677",trim:"#aabbcc"},  Lancer:{body:"#334455",trim:"#4488cc"},
  Sorcerer:{body:"#331144",trim:"#cc44ff"}, Duelist:{body:"#664433",trim:"#ffaa44"},
  Brawgunner:{body:"#774433",trim:"#ff7700"},
  // Refined
  Swordmaster:{body:"#334488",trim:"#88aaff"}, Warlord:{body:"#553322",trim:"#ff8844"},
  Bladedancer:{body:"#223355",trim:"#44ddff"}, Runekeeper:{body:"#2a1155",trim:"#8844ff"},
  Hunter:{body:"#1a3322",trim:"#44cc77"},      Crusher:{body:"#553322",trim:"#cc8844"},
  Vanguard:{body:"#223355",trim:"#4488ff"},    Gunslinger:{body:"#553344",trim:"#ff6688"},
  // Epic
  Darkblade:{body:"#111122",trim:"#aa22ff"},   Titan:{body:"#221133",trim:"#ff44dd"},
  Assassin:{body:"#110022",trim:"#cc00ff"},    Arcanist:{body:"#0a0022",trim:"#dd66ff"},
  Shadowshot:{body:"#110033",trim:"#9933ff"},  Thunderfoot:{body:"#001133",trim:"#44aaff"},
  Dragoon:{body:"#110022",trim:"#ff2244"},     Rifleman:{body:"#664422",trim:"#ff8844"},
  Deadeye:{body:"#334455",trim:"#88ddff"},
  // Legendary
  Demolisher:{body:"#663322",trim:"#ff5500"},
};
const TIER_COLOR = { basic:"#e8d5a3", refined:"#4488ff", epic:"#aa44ff", legendary:"#ffaa00" };
const TIER_LABEL = { basic:"", refined:"Refined", epic:"Epic", legendary:"Legendary" };
const TIER_DMG_MULT = { basic:1.0, refined:1.0, epic:1.2, legendary:1.3 };
const TIER_ORDER  = { basic:0, refined:1, epic:2, legendary:3 }; // numeric rank for comparison
// Apply tier scaling to baseDmg — refined/epic/legendary weapons hit significantly harder
const weaponDmg = (w) => Math.round((w?.baseDmg||0) * (TIER_DMG_MULT[w?.tier||"basic"]||1.0));
// Sort weapon ID list by weaponDmg descending (highest damage first)
const sortWeapons = (wids) => [...wids].sort((a,b)=>weaponDmg(ALL_WEAPONS[b]||{})-weaponDmg(ALL_WEAPONS[a]||{}));
const SKIN = "#e8c47a";

const HeroSprite = React.memo(function HeroSprite({ className="Knight", scale=1, weapons=[], heroLooks=null, animRow=null, animFrame=0 }) {
  const displayW = Math.round(48 * scale);
  const displayH = Math.round(76 * scale);  // 76 base matches HSH = Math.round(76*0.85)=65
  if (heroLooks) {
    return <LayeredHeroSprite looks={heroLooks} displayW={displayW} displayH={displayH} animRow={animRow} animFrame={animFrame}/>;
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
}); // HeroSprite memo

const BOSS_GIF_BASE = ASSET_BASE+"/icons/sprites/boss/boss_demon_slime_FREE_v1.0/gifs";
// Boss GIF natural frame size is 288×160. renderW/renderH come from ENEMY_DIMS.dragon × eScale.
function DemonSlimeSprite({ renderW=238, renderH=132, enemyFlash=false, phase="action", bossAttackPattern=null, rushAnim=null }) {
  // rushAnim: "approach"|"retreat" → walk GIF, "strike" → cleave GIF
  const src = phase==="won"                              ? `${BOSS_GIF_BASE}/05_d_death.webp`
            : enemyFlash                                 ? `${BOSS_GIF_BASE}/04_d_take_hit.webp`
            : (rushAnim==="approach"||rushAnim==="retreat") ? `${BOSS_GIF_BASE}/02_d_walk.webp`
            : rushAnim==="strike"                        ? `${BOSS_GIF_BASE}/03_d_cleave.webp`
            : (phase==="enemy_turn"||phase==="defending") ? `${BOSS_GIF_BASE}/03_d_cleave.webp`
            :                                              `${BOSS_GIF_BASE}/01_d_idle.webp`;
  return (
    <div style={{position:"relative",width:renderW,height:renderH}}>
      <img key={src} src={src} width={renderW} height={renderH}
        style={{display:"block",imageRendering:"pixelated",objectFit:"fill"}}/>
      <div style={{position:"absolute",bottom:-6,left:"50%",transform:"translateX(-50%)",
        width:renderW*0.7,height:10,borderRadius:"50%",
        background:"radial-gradient(ellipse,#22dd4466 0%,transparent 70%)",
        pointerEvents:"none"}}/>
    </div>
  );
}

const EnemySpriteSmall = React.memo(function EnemySpriteSmall({ id, scale=1, sprite=null, enemyFlash=false, phase="action", bossAttackPattern=null, rushAnim=null, atkIdx=0 }) {
  // Hooks must be called unconditionally — compute perFrameOps at top level always
  const perFrameOps = React.useMemo(() => {
    if (!sprite) return null;
    const animFile = (() => {
      if (rushAnim === "approach" || rushAnim === "retreat") return sprite.rushApproach?.file;
      if (rushAnim === "strike") return getRushStrike(sprite, atkIdx)?.file;
      if (phase === "won") return sprite.deadFile;
      if (enemyFlash && sprite.hurtFile) return sprite.hurtFile;
      if (phase === "enemy_turn" || phase === "defending") {
        const atk = sprite.attacks?.[atkIdx % (sprite.attacks?.length || 1)];
        const atkType = atk?.type || null;
        // Match main code: wind-up (enemy_turn) and rush attacks always show Idle
        if (phase === "enemy_turn" || atkType === "rush") return "Idle.png";
        return atk?.file;
      }
      return "Idle.png";
    })();
    const ac = sprite.animCrops?.[animFile];
    const pf = ac?.perFrame;
    if (!pf || !pf.length) return null;
    const fw = sprite.frameW || 128;
    const frames = (() => {
      if (rushAnim === "approach" || rushAnim === "retreat") return sprite.rushApproach?.frames || 8;
      return pf.length;
    })();
    const totalStripW = fw * frames;
    const uTop = ac.y, uH = ac.h;
    const pfSlice = pf.slice(0, frames);
    const maxW = Math.max(...pfSlice.map(p => p.w));
    // maxSrcXL: largest left-overflow across all frames → fixed dstX anchor eliminates per-frame jitter
    const maxSrcXL = Math.max(...pfSlice.map((p, n) => Math.max(0, -(n * fw + p.x))));
    const canvasW  = maxW + maxSrcXL;
    const displayW = Math.round(canvasW * scale), displayH = Math.round(uH * scale);
    const sx = displayW / canvasW, sy = displayH / uH;
    const fixedDstX = Math.round(maxSrcXL * sx); // same for every frame → no horizontal jitter
    return pfSlice.map((p, n) => {
      const absLeft  = n * fw + p.x;
      const absRight = n * fw + p.x + p.w;
      const srcX  = Math.max(0, absLeft);
      const srcRight = Math.min(totalStripW, absRight);
      const srcW  = Math.max(0, srcRight - srcX);
      const srcY  = p.y ?? uTop;
      const srcH  = p.h ?? uH;
      const dstX  = fixedDstX;
      const dstY  = Math.round((srcY - uTop) * sy);
      const dstW  = Math.round(srcW * sx);
      const dstH  = Math.round(srcH * sy);
      return { srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH };
    });
  }, [sprite, rushAnim, phase, scale, atkIdx, enemyFlash]);

  const [slowProjDone, setSlowProjDone] = React.useState(false);
  React.useEffect(() => { setSlowProjDone(false); }, [sprite?.variant, atkIdx, phase]);

  if (id==="dragon") {
    const bd = ENEMY_DIMS.dragon;
    return <DemonSlimeSprite renderW={Math.round(bd.w*scale)} renderH={Math.round(bd.h*scale)} enemyFlash={enemyFlash} phase={phase} bossAttackPattern={bossAttackPattern} rushAnim={rushAnim}/>;
  }

  if (sprite) {
    const base = `${ASSET_BASE}/icons/sprites/${sprite.dir}/${sprite.variant}`;

    let src, frames, fps, atkType=null;
    const isAttacking = phase==="enemy_turn" || phase==="defending";
    // During enemy_turn (880ms wind-up before QTE fires) the enemy should look idle —
    // showing the attack animation here + the QTE firing looks like TWO attacks.
    // Only show the real attack animation once the QTE is active (phase="defending").
    const isWindup = phase==="enemy_turn";

    // Rush melee overrides normal animation selection
    if (rushAnim === "approach" && sprite.rushApproach) {
      src    = `${base}/${sprite.rushApproach.file}`;
      frames = sprite.rushApproach.frames;
      fps    = sprite.rushApproach.fps || 10;
    } else if (rushAnim === "strike" && getRushStrike(sprite, atkIdx)) {
      const _rs = getRushStrike(sprite, atkIdx);
      src    = `${base}/${_rs.file}`;
      frames = _rs.frames;
      fps    = _rs.fps || 12;
    } else if (rushAnim === "retreat" && sprite.rushApproach) {
      src    = `${base}/${sprite.rushApproach.file}`;
      frames = sprite.rushApproach.frames;
      fps    = sprite.rushApproach.fps || 10;
    } else if (phase==="won" && sprite.deadFile) {
      src    = `${base}/${sprite.deadFile}`;
      frames = sprite.deadFrames || 3;
      fps    = 9;
    } else if (enemyFlash && sprite.hurtFile) {
      src    = `${base}/${sprite.hurtFile}`;
      frames = sprite.hurtFrames || 2;
      fps    = 14;
    } else if (isAttacking && sprite.attacks?.length) {
      const atk = sprite.attacks[atkIdx % sprite.attacks.length];
      atkType = atk.type || null;
      if (isWindup || atkType === 'rush') {
        // During enemy_turn wind-up OR rush attacks: always show idle.
        // - Rush: the actual attack plays inside the rush QTE (approach/strike/retreat).
        // - Wind-up: showing the attack animation 880ms BEFORE the QTE fires looks like
        //   two separate attacks. Keep idle; the QTE is the visible attack.
        src    = `${base}/Idle.png`;
        frames = sprite.idleFrames;
        fps    = 8;
        atkType = null;
      } else {
        // defending phase — QTE is active, show real attack animation
        src    = `${base}/${atk.file}`;
        frames = atk.frames;
        fps    = 12;
        // slow_proj plays once — when done, revert to idle
        if (atkType === 'slow_proj' && slowProjDone) {
          src    = `${base}/Idle.png`;
          frames = sprite.idleFrames;
          fps    = 8;
          atkType = null;
        }
      }
    } else {
      src    = `${base}/Idle.png`;
      frames = sprite.idleFrames;
      fps    = 8;
    }

    // Per-animation crop: check animCrops[file] first, fall back to global crop
    const _animFile = src.split('/').pop();
    const _ac = sprite.animCrops?.[_animFile];
    const cropX  = _ac?.x ?? (sprite.cropX  || 0);
    const cropY  = _ac?.y ?? (sprite.cropY  || 0);
    const cropH  = _ac?.h ?? (sprite.cropH  || sprite.frameH);
    // When perFrame present, canvas = maxW + maxSrcXL (matches perFrameOps useMemo fixed-dstX logic)
    const _pf = _ac?.perFrame;
    const cropW  = _pf?.length
      ? (() => {
          const _fw2 = sprite.frameW || 128;
          const _maxW2 = Math.max(..._pf.map(p => p.w));
          const _maxSrcXL2 = Math.max(..._pf.map((p, n) => Math.max(0, -(n * _fw2 + p.x))));
          return _maxW2 + _maxSrcXL2;
        })()
      : (_ac?.w ?? (sprite.cropW  || sprite.frameW));
    const displayW = Math.round(cropW * scale);
    const displayH = Math.round(cropH * scale);
    const cropOffX = Math.round(cropX * scale);
    const cropOffY = Math.round(cropY * scale);

    const imgW = Math.round(sprite.frameW * scale) * frames;
    const imgH = Math.round(sprite.frameH * scale);
    const isDead = phase === 'won' && !!sprite.deadFile;
    const playOnce = rushAnim === 'strike' || atkType === 'slow_proj'; // strike and slow_proj play once

    return <AnimatedSprite src={src} numFrames={frames} fps={fps}
      displayW={displayW} displayH={displayH}
      imgW={imgW} imgH={imgH} cropOffX={cropOffX} cropOffY={cropOffY}
      flip={rushAnim === 'retreat'}
      perFrameOps={perFrameOps}
      loop={!isDead && !playOnce}
      onComplete={atkType === 'slow_proj' ? () => setSlowProjDone(true) : null}/>;
  }
  const dims = ENEMY_DIMS[id]||{w:64,h:78};
  return <div style={{width:dims.w*scale,height:dims.h*scale}}/>;
}); // EnemySpriteSmall memo

/* ─── GAME ICONS — SVG replacements for all emoji ────────────── */
const WEAPON_ICON_FILE = {
  // sword line
  sword:"crossed-swords", longsword:"crossed-swords", obsidian_blade:"crossed-swords",
  sword_gun:"crossed-swords",
  // hammer line
  hammer:"thor-hammer",  great_maul:"thor-hammer",  titan_hammer:"thor-hammer",
  club_musket:"thor-hammer",
  // daggers line
  daggers:"dagger-rose", twin_blades:"dagger-rose",  shadow_fangs:"dagger-rose",
  knife_shotgun:"dagger-rose",
  // staff/wand line
  staff:"crystal-wand",  runic_staff:"crystal-wand", void_scepter:"crystal-wand",
  wand:"crystal-wand",
  // bow line
  bow:"pocket-bow",      hunters_bow:"pocket-bow",   darkwood_bow:"pocket-bow",
  // axe line
  axe:"battle-axe",      axe_pistol:"battle-axe",
  // spear line
  spear:"flaming-trident", war_lance:"flaming-trident", dragon_lance:"flaming-trident",
  sniper_spear:"flaming-trident",
  // legendary
  rpg:"nuclear-bomb",
};
// PNG icons (in subfolders) — full relative path, no extension handled below
const WEAPON_ICON_PNG = {
  boots:         "boots/Icon223.png",
  iron_stompers: "boots/Icon226.png",
  thunder_boots: "boots/Icon229.png",
};
function Icon({ type, size=28, color }) {
  const s=size, c=color;
  // ── PNG weapon icons (subfoldered pack assets) ──
  if (WEAPON_ICON_PNG[type]) {
    return <img src={ASSET_BASE+"/icons/"+WEAPON_ICON_PNG[type]} width={s} height={s}
      style={{display:"block",objectFit:"contain",imageRendering:"auto",
        filter:c?`drop-shadow(0 0 4px ${c})`:"brightness(0.75) saturate(0.5)"}}/>;
  }
  // ── SVG weapon file-based icon (covers all tiers) ──
  if (WEAPON_ICON_FILE[type]) {
    return <img src={ASSET_BASE+"/icons/"+WEAPON_ICON_FILE[type]+".svg"} width={s} height={s}
      style={{display:"block",objectFit:"contain",imageRendering:"auto",
        filter:c?`drop-shadow(0 0 4px ${c})`:"brightness(0.55) saturate(0.4)"}}/>;
  }
  switch(type){

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
  const MV = 0.35;
  // Play a one-shot audio file — MV scales all volumes globally
  const pf = (url, vol=0.75) => {
    try { const a=new Audio(url); a.volume=Math.min(1,vol*MV); a.play().catch(()=>{}); } catch(_e){}
  };
  // Play random variant (1-n) of a Helton Yan sound
  const rf = (name, n=6, vol=0.75) => pf(hy(name, 1+Math.floor(Math.random()*n)), vol);
  // Lazy 4-element pool for rapid-fire sounds — created on first use, not at module load
  const mkPool = (name, vol=0.65) => {
    let pool=null, i=0;
    return ()=>{
      if(!pool) pool=[1,2,3,4].map(v=>{ const a=new Audio(hy(name,v)); a.volume=Math.min(1,vol*MV); return a; });
      const a=pool[i++%4]; a.currentTime=0; a.play().catch(()=>{});
    };
  };
  // Rune: pitch-escalating crystal tings — each correct key steps up a musical semi-tone
  // Ratios follow a pentatonic-ish ladder so keys 0→9 sound increasingly powerful
  const RUNE_RATES = [1.00,1.12,1.26,1.41,1.59,1.78,2.00,2.24,2.52,2.83];
  // Rapid-fire pools (pre-created at init)
  const _daggerPlay = mkPool("FGHTImpt_MELEE-Swish Hit_HY_PC", 0.28);
  const _pokePlay   = mkPool("WHSH_MOVEMENT-Simple Whoosh_HY_PC", 0.22);
  const _swordWalkPlay = mkPool("SWSH_MOVEMENT-Bamboo Whip_HY_PC", 0.28);
  // ── Web Audio (kept for sustained/dynamic-only effects) ──────
  const D  = ctx => ctx.destination;
  const O  = (ctx,t,f) => { const o=ctx.createOscillator(); o.type=t; o.frequency.setValueAtTime(f,ctx.currentTime); return o; };
  const G  = (ctx,v)   => { const g=ctx.createGain(); g.gain.setValueAtTime(v,ctx.currentTime); return g; };
  const LP = (ctx,f)   => { const n=ctx.createBiquadFilter(); n.type='lowpass';  n.frequency.value=f; return n; };
  const wa = fn => { try { fn(_ac()); } catch(_e){} };
  return {
    // ── UI / navigation ──────────────────────────────────────────
    click:        ()=>rf("UIClick_INTERFACE-Metallic Click_HY_PC",   6, 0.45),
    hover:        ()=>rf("SWSH_MOVEMENT-Tiny Chime_HY_PC",           6, 0.28),
    bookOpen:     ()=>rf("SWSH_MOVEMENT-Reso Swish_HY_PC",           6, 0.48),
    select:       ()=>rf("UIClick_INTERFACE-Positive Click_HY_PC",   6, 0.48),
    mapNode:      ()=>rf("UIClick_INTERFACE-Rattling Click_HY_PC",   6, 0.38),
    levelUp:      ()=>rf("DSGNSynth_BUFF-Mecha Level Up_HY_PC",      6, 0.62),
    rest:         ()=>rf("MAGAngl_BUFF-Simple Heal_HY_PC",           6, 0.52),
    reward:       ()=>rf("DSGNTonl_USABLE-Generic Item_HY_PC",       6, 0.48),
    rewardWeapon: ()=>rf("DSGNMisc_USABLE-Mecha Weapon Equip_HY_PC", 6, 0.55),
    rewardHeal:   ()=>rf("MAGAngl_BUFF-Simple Heal_HY_PC",           6, 0.52),
    rewardStat:   ()=>rf("DSGNSynth_BUFF-Stats Up_HY_PC",            6, 0.50),
    potionUse:    ()=>rf("MAGAngl_BUFF-Buff Pickup_HY_PC",           6, 0.50),
    victory:      ()=>rf("DSGNMisc_SKILL IMPACT-Dramatic Finish_HY_PC",6,0.62),
    gameOver:     ()=>rf("DSGNSynth_BUFF-Mecha Failing_HY_PC",       6, 0.58),
    portal:       ()=>rf("MAGSpel_CAST-Sphere Up_HY_PC",             6, 0.52),
    // ── Combat ───────────────────────────────────────────────────
    combatStart:  ()=>rf("DSGNTonl_MELEE-Sword Critical_HY_PC",      6, 0.52),
    bossStart:    ()=>{ rf("DSGNImpt_EXPLOSION-Mana Bomb_HY_PC",6,0.62); setTimeout(()=>rf("DSGNImpt_EXPLOSION-Eruption_HY_PC",6,0.50),250); },
    enemyDie:     ()=>rf("DSGNMisc_SKILL IMPACT-Energy Dissipate_HY_PC", 6, 0.50),
    slimeDeath:   ()=>rf("DSGNMisc_CAST-Slime Ball_HY_PC",           6, 0.58),
    // ── Sword / Beat ─────────────────────────────────────────────
    swordWalk:    ()=>_swordWalkPlay(),
    swordKey:     ()=>rf("DSGNMisc_MELEE-Sword Slash_HY_PC",         6, 0.26),
    swordBadKey:  ()=>rf("UIMisc_INTERFACE-Denied_HY_PC",            6, 0.22),
    swordPerfect: ()=>rf("DSGNMisc_SKILL IMPACT-Critical Strike_HY_PC",6,0.50),
    // ── Hammer / Charge ──────────────────────────────────────────
    // hammerHold stays synthetic — sustained ramping rumble
    hammerHold: ()=>{
      try {
        const ctx=_ac();
        const o=O(ctx,'sawtooth',55),lp=LP(ctx,500),g=G(ctx,0);
        o.connect(lp); lp.connect(g); g.connect(D(ctx)); o.start();
        const t=ctx.currentTime;
        g.gain.linearRampToValueAtTime(.025,t+.7); lp.frequency.linearRampToValueAtTime(1600,t+.7);
        return ()=>{ try{ const t2=ctx.currentTime; g.gain.setValueAtTime(g.gain.value,t2);
          g.gain.exponentialRampToValueAtTime(.0001,t2+.07); o.stop(t2+.08); }catch(_e){} };
      } catch(_e){ return ()=>{}; }
    },
    hammerPerfect:    ()=>rf("DSGNImpt_EXPLOSION-Thud_HY_PC",               6, 0.50),
    hammerGood:       ()=>rf("FGHTImpt_HIT-Strong Smack_HY_PC",             6, 0.45),
    hammerOvercharge: ()=>rf("DSGNImpt_EXPLOSION-Forced Interruption_HY_PC",6, 0.45),
    // ── Daggers / Rapid ──────────────────────────────────────────
    daggerTap:    ()=>_daggerPlay(),
    daggerFlurry: ()=>rf("DSGNMisc_SKILL RELEASE-Flying Blades_HY_PC",      6, 0.48),
    // ── Sequence / Staff ─────────────────────────────────────────
    runeCorrect: (pos=0) => {
      const rate = RUNE_RATES[Math.min(pos, RUNE_RATES.length-1)];
      // Layer 1 — crisp crystal ting, pitched up — MV applied
      try {
        const a = new Audio(hy("DSGNTonl_SKILL IMPACT-Energy Crystal_HY_PC", 1+Math.floor(Math.random()*6)));
        a.volume = Math.min(1, 0.30 * MV); a.playbackRate = rate; a.play().catch(()=>{});
      } catch(_e){}
      // Layer 2 — sparkle shimmer — MV applied
      setTimeout(()=>{
        try {
          const b = new Audio(hy("DSGNTonl_SKILL IMPACT-Magic Sparkles_HY_PC", 1+Math.floor(Math.random()*6)));
          b.volume = Math.min(1, 0.16 * MV); b.playbackRate = rate * 1.08; b.play().catch(()=>{});
        } catch(_e){}
      }, 22);
    },
    runeWrong: () => {
      rf("DSGNSynth_BUFF-Failed Buff_HY_PC", 6, 0.28);
      setTimeout(()=>rf("UIMisc_INTERFACE-Denied_HY_PC", 6, 0.22), 55);
    },
    magicBolt: (q) => {
      rf("MAGSpel_CAST-Panic Energy_HY_PC", 6, 0.55);
      if(q==="perfect") setTimeout(()=>rf("DSGNMisc_SKILL IMPACT-Critical Strike_HY_PC",6,0.50),260);
    },
    // ── Stomp / Boots ────────────────────────────────────────────
    stompApproach:()=>rf("FEETMisc_STEP-Hard Step_HY_PC",                   6, 0.26),
    stompLand:    (q)=>rf(q==="perfect"?"DSGNImpt_EXPLOSION-Thud_HY_PC":"DSGNImpt_EXPLOSION-Sand Impact_HY_PC",6, q==="perfect"?0.50:0.42),
    stompBounce:  ()=>rf("DSGNMisc_MOVEMENT-Pierce Jump_HY_PC",             6, 0.26),
    // ── Poke / Spear ─────────────────────────────────────────────
    pokeTap:      ()=>_pokePlay(),
    // ── Archery / Bow ────────────────────────────────────────────
    bowDraw:      ()=>(()=>{}),
    bowRelease:   ()=>rf("SWSH_MOVEMENT-Bamboo Whip_HY_PC",                 6, 0.28),
    arrowFlight:  ()=>rf("WHSH_MOVEMENT-Wind Shaker_HY_PC",                 6, 0.45),
    arrowHit:     (q)=>{
      rf("DSGNMisc_HIT-Gore Pierce_HY_PC", 6, q==="perfect"?0.58:0.48);
      if(q==="perfect") setTimeout(()=>rf("DSGNMisc_SKILL IMPACT-Critical Strike_HY_PC",6,0.48),110);
    },
    // ── RPG / Sequence Reveal ─────────────────────────────────────
    rpgLaunch:      ()=>rf("DSGNMisc_SKILL RELEASE-Flare Gun_HY_PC",        6, 0.62),
    rpgImpact:      ()=>{ rf("DSGNImpt_EXPLOSION-Mana Bomb_HY_PC",6,0.65); setTimeout(()=>rf("DSGNImpt_EXPLOSION-Eruption_HY_PC",6,0.55),180); },
    rpgSequenceKey: ()=>rf("MAGSpel_CAST-Energy Riser_HY_PC",               6, 0.45),
    // ── Dual Action ──────────────────────────────────────────────
    dualClick:    ()=>rf("UIClick_INTERFACE-Strong Click 1_HY_PC",          6, 0.52),
    dualGunshot:  ()=>pf(GN + ".22LR/WAV/22LR%20Single%20Isolated%20WAV.wav", 0.45),
    // ── Defend ───────────────────────────────────────────────────
    projLaunch:   ()=>rf("DSGNMisc_PROJECTILE-Laser Shot_HY_PC",            6, 0.50),
    parry:        (()=>{ let _t=0; return ()=>{ const n=performance.now(); if(n-_t<350)return; _t=n; rf("DSGNMisc_MELEE-Sword Parry_HY_PC",6,0.50); }; })(),
    blockHit:     ()=>rf("DSGNMisc_MELEE-Sword Deflect_HY_PC",              6, 0.45),
    takeDmg:      ()=>rf("FGHTImpt_HIT-Strong Punch_HY_PC",                 6, 0.45),
    // ── Weapon select hover — short metallic clink ────────────────
    metalClink: ()=>wa(ctx=>{
      const t=ctx.currentTime;
      // High-freq metal ping
      const o1=ctx.createOscillator(); o1.type="triangle"; o1.frequency.setValueAtTime(2200,t); o1.frequency.exponentialRampToValueAtTime(900,t+0.07);
      const g1=ctx.createGain(); g1.gain.setValueAtTime(0.18*MV,t); g1.gain.exponentialRampToValueAtTime(0.001,t+0.11);
      o1.connect(g1); g1.connect(ctx.destination); o1.start(t); o1.stop(t+0.11);
      // Lower harmonic body
      const o2=ctx.createOscillator(); o2.type="sawtooth"; o2.frequency.setValueAtTime(440,t); o2.frequency.exponentialRampToValueAtTime(220,t+0.05);
      const g2=ctx.createGain(); g2.gain.setValueAtTime(0.09*MV,t); g2.gain.exponentialRampToValueAtTime(0.001,t+0.07);
      o2.connect(g2); g2.connect(ctx.destination); o2.start(t); o2.stop(t+0.07);
    }),
  };
})();

/* ─── COMBAT SPRITE FRAME OVERLAY (debug) ───────────────────── */
// Canvas that draws exactly one cropped frame from a sprite sheet PNG
function CropFrameCanvas({ src, frameW, frameH, frameIdx, cropX, cropY, cropW, cropH, size }) {
  const ref = React.useRef(null);
  React.useEffect(()=>{
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext('2d');
    ctx.clearRect(0, 0, size, size);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img,
        frameIdx * frameW + cropX, cropY, cropW, cropH,  // source rect
        0, 0, size, size);                                 // dest rect
    };
    img.src = src;
  }, [src, frameIdx, cropX, cropY, cropW, cropH, size]);
  return (
    <canvas ref={ref} width={size} height={size}
      style={{display:'block', background:'#111122', border:'1px solid #2a2a4a',
        borderRadius:5, imageRendering:'pixelated'}}/>
  );
}

function CropSliderRow({ label, value, min, max, onChange }) {
  return (
    <label style={{display:'flex',gap:5,alignItems:'center',fontSize:10,color:'#aaa'}}>
      <span style={{width:14,textAlign:'right',color:'#666'}}>{label}</span>
      <input type="range" min={min} max={max} value={value} style={{width:110}}
        onChange={e => onChange(+e.target.value)}/>
      <span style={{width:28,color:'#ffcc00'}}>{value}</span>
    </label>
  );
}

const _BOSS_CROP_ENTRY = { variant:'demon_slime_boss', name:'Demon Slime', isBoss:true };
const _BOSS_GIFS = [
  {label:'IDLE',   file:'01_d_idle.webp',    frames:6},
  {label:'WALK',   file:'02_d_walk.webp',    frames:12},
  {label:'CLEAVE', file:'03_d_cleave.webp',  frames:15},
  {label:'HIT',    file:'04_d_take_hit.webp',frames:5},
  {label:'DEAD',   file:'05_d_death.webp',   frames:21},
];

/* ── Crop Editor — modal, uses actual image dimensions for accuracy ─── */
function CropEditor({ sp: initSp, onApply, onClose }) {
  // Monster picker — defaults to whatever enemy is active but can be changed
  const pool = window.ENEMY_SPRITE_POOL || [];
  const [sp, setSp] = React.useState((initSp?.isBoss ? initSp : null) || pool[0]);

  const FW = sp.frameW || 128;
  const FH = sp.frameH || 128;
  const TOL = 8;

  const base = `${ASSET_BASE}/icons/sprites/${sp.dir}/${sp.variant}`;

  const anims = React.useMemo(() => {
    const list = [];
    list.push({label:'IDLE',   file:'Idle.png',            frames:sp.idleFrames||8});
    if (sp.rushApproach) list.push({label:'RUN',    file:sp.rushApproach.file, frames:sp.rushApproach.frames});
    const _rs = getRushStrike(sp);
    if (_rs && !sp.attacks?.some(a => a.file === _rs.file)) list.push({label:'STRIKE', file:_rs.file, frames:_rs.frames});
    (sp.attacks||[]).forEach((a,i)=>list.push({label:`ATK${i+1}`, file:a.file, frames:a.frames}));
    if (sp.hurtFile) list.push({label:'HURT', file:sp.hurtFile, frames:sp.hurtFrames||2});
    if (sp.deadFile) list.push({label:'DEAD', file:sp.deadFile, frames:sp.deadFrames||3});
    return list;
  }, [sp.variant]);

  const defaultAnim = Math.max(0, anims.findIndex(a=>a.label==='RUN'));
  const [animIdx,   setAnimIdx]   = React.useState(defaultAnim);
  const [selFrame,  setSelFrame]  = React.useState(0);   // which frame's controls are shown
  const [imgInfo,   setImgInfo]   = React.useState(null);
  const [drawTick,  setDrawTick]  = React.useState(0);
  const [applyFlash, setApplyFlash] = React.useState(null); // 'done' when flashing

  const anim = anims[Math.min(animIdx, anims.length-1)];
  const src  = `${base}/${anim.file}`;
  const NF   = anim.frames;

  // Per-frame independent lines — array of NF objects
  // file: if provided, checks sp.animCrops[file] before falling back to global crop
  const makeFrameLines = (nf, s, file) => {
    const ac = file ? s.animCrops?.[file] : null;
    // If per-frame crops saved, restore each frame individually so CropEditor shows
    // the actual saved state instead of the bounding box (which would wipe perFrame on Apply)
    if (ac?.perFrame?.length) {
      return Array.from({length: nf}, (_, i) => {
        const pf = ac.perFrame[i] ?? ac.perFrame[ac.perFrame.length - 1];
        return { top: pf.y, bottom: pf.y + pf.h, left: pf.x, right: pf.x + pf.w };
      });
    }
    const top    = ac ? ac.y           : (s.cropY ?? 0);
    const bottom = ac ? ac.y + ac.h    : (s.cropY ?? 0) + (s.cropH ?? (s.frameH||128));
    const left   = ac ? ac.x           : (s.cropX ?? 0);
    const right  = ac ? ac.x + ac.w    : (s.cropX ?? 0) + (s.cropW ?? (s.frameW||128));
    return Array.from({length: nf}, () => ({top, bottom, left, right}));
  };
  const [perFrame, setPerFrame] = React.useState(() => makeFrameLines(NF, sp, anim.file));

  // Reset when monster changes
  React.useEffect(() => {
    const da = anims.findIndex(a=>a.label==='RUN');
    const idx = Math.max(0, da);
    setAnimIdx(idx);
    setSelFrame(0);
    setPerFrame(makeFrameLines(NF, sp, anims[idx]?.file));
    infoRef.current = null;
    setImgInfo(null);
  }, [sp.variant]);

  // Resize perFrame when animation changes
  // If this anim has a saved animCrop, restore it; otherwise carry over current crop values
  React.useEffect(() => {
    setSelFrame(0);
    setPerFrame(prev => {
      const ac = sp.animCrops?.[anim.file];
      if (ac) {
        // Restore saved per-animation crop — use per-frame data if present
        if (ac.perFrame && ac.perFrame.length === NF) {
          return ac.perFrame.map(pf => ({
            top: pf.y, bottom: pf.y + pf.h,
            left: pf.x, right: pf.x + pf.w,
          }));
        }
        const line = {top: ac.y, bottom: ac.y + ac.h, left: ac.x, right: ac.x + ac.w};
        return Array.from({length: NF}, () => ({...line}));
      }
      // No saved crop — carry over current values from frame 0 as starting point
      const L = prev[0];
      const template = L ? {...L} : makeFrameLines(1, sp, anim.file)[0];
      return Array.from({length: NF}, () => ({...template}));
    });
  }, [src, NF]);

  const canvasRef    = React.useRef(null);
  const previewRef   = React.useRef(null);
  const dragRef      = React.useRef(null);
  const perFrameRef  = React.useRef(perFrame);
  const infoRef      = React.useRef(null);
  const moveHandler  = React.useRef(null);
  perFrameRef.current = perFrame;

  const doApply = () => {
    const crop = framesToCrop(perFrame);
    onApply(crop, sp, anim.file);
    setApplyFlash('done');
    setTimeout(() => setApplyFlash(null), 1400);
  };

  /* ── layout from actual image dimensions ── */
  const makeLayout = (img, nf) => {
    const iw = img.naturalWidth, ih = img.naturalHeight;
    const frameW = iw / nf;
    const zoom   = Math.min(5, Math.max(2, Math.floor((window.innerHeight * 0.55) / ih)));
    const cw = Math.round(iw * zoom), ch = Math.round(ih * zoom);
    const sx = frameW / FW, sy = ih / FH;
    return {img, iw, ih, frameW, zoom, cw, ch, sx, sy, nf};
  };

  /* ── draw — per-frame independent lines ── */
  const doDraw = (info, pf, sel) => {
    const cv = canvasRef.current; if (!cv || !info) return;
    const {img, iw, ih, frameW, zoom, cw, ch, sx, sy, nf} = info;
    const ctx = cv.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, 0, 0, iw, ih, 0, 0, cw, ch);
    const fwz = frameW * zoom;

    // Per-frame: dim + lines
    for (let f = 0; f < nf; f++) {
      const L  = pf[f] || pf[0];
      const fx = f * fwz;
      const ty = L.top    * sy * zoom,  by = L.bottom * sy * zoom;
      const lx = L.left   * sx * zoom,  rx = L.right  * sx * zoom;
      const minY = Math.min(ty, by), maxY = Math.max(ty, by);
      const minX = Math.min(lx, rx), maxX = Math.max(lx, rx);
      const isSel = f === sel;

      // Dim outside this frame's crop box
      ctx.fillStyle = 'rgba(0,0,0,0.50)';
      if (minY > 0)      ctx.fillRect(fx,          0,     fwz, minY);
      if (maxY < ch)     ctx.fillRect(fx,        maxY,    fwz, ch - maxY);
      if (minX > 0)      ctx.fillRect(fx,        minY,    minX, maxY - minY);
      if (maxX < fwz)    ctx.fillRect(fx + maxX, minY,    fwz - maxX, maxY - minY);

      // Lines — brighter for selected frame
      const alpha = isSel ? 'ff' : '88';
      ctx.lineWidth = isSel ? 2 : 1;
      ctx.strokeStyle = '#44ccff' + alpha;
      ctx.beginPath(); ctx.moveTo(fx,       ty); ctx.lineTo(fx + fwz, ty); ctx.stroke();
      ctx.strokeStyle = '#ff8844' + alpha;
      ctx.beginPath(); ctx.moveTo(fx,       by); ctx.lineTo(fx + fwz, by); ctx.stroke();
      ctx.strokeStyle = '#44ff88' + alpha;
      ctx.beginPath(); ctx.moveTo(fx + lx,  ty); ctx.lineTo(fx + lx,  by); ctx.stroke();
      ctx.strokeStyle = '#ff4488' + alpha;
      ctx.beginPath(); ctx.moveTo(fx + rx,  ty); ctx.lineTo(fx + rx,  by); ctx.stroke();
    }

    // Frame dividers on top
    ctx.strokeStyle = 'rgba(255,255,255,0.30)'; ctx.lineWidth = 1;
    for (let f = 1; f < nf; f++) {
      ctx.beginPath(); ctx.moveTo(f * fwz, 0); ctx.lineTo(f * fwz, ch); ctx.stroke();
    }
    // Selected frame highlight border
    if (sel >= 0 && sel < nf) {
      ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 2;
      ctx.strokeRect(sel * fwz + 1, 1, fwz - 2, ch - 2);
    }
  };

  // Load image
  React.useEffect(() => {
    infoRef.current = null;
    setImgInfo(null);
    const img = new Image();
    img.onload = () => {
      const info = makeLayout(img, NF);
      infoRef.current = info;
      setImgInfo(info);
      setDrawTick(t => t + 1);
    };
    img.onerror = () => console.error('[CropEditor] load fail', src);
    img.src = src;
  }, [src, NF]);

  // Post-render draw (after React commits, so canvas width/height won't be reset by React)
  React.useEffect(() => {
    const info = infoRef.current, cv = canvasRef.current;
    if (!info || !cv) return;
    cv.width = info.cw; cv.height = info.ch;
    doDraw(info, perFrameRef.current, selFrame);
  }, [drawTick]);

  React.useEffect(() => {
    if (infoRef.current) doDraw(infoRef.current, perFrame, selFrame);
  }, [perFrame, selFrame]);

  // Preview canvas — shows the SELECTED FRAME's own crop (not union) so edits are immediately visible
  React.useEffect(() => {
    const cv = previewRef.current;
    const info = infoRef.current;
    if (!cv || !info) return;
    const L = perFrameRef.current[selFrame] || perFrameRef.current[0];
    if (!L) return;
    // Use this frame's own lines directly
    const cx = Math.min(L.left,  L.right);
    const cy = Math.min(L.top,   L.bottom);
    const cw = Math.abs(L.right  - L.left);
    const ch = Math.abs(L.bottom - L.top);
    const { img, frameW, sx, sy } = info;
    const ctx = cv.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = '#06060f';
    ctx.fillRect(0, 0, cv.width, cv.height);
    if (cw > 0 && ch > 0) {
      const srcX = selFrame * frameW + cx * sx;
      const srcY = cy * sy;
      const srcW = cw * sx;
      const srcH = ch * sy;
      ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, cv.width, cv.height);
    }
  }, [perFrame, selFrame, drawTick]);

  /* ── coords ── */
  const toCanvas = (e) => {
    const r = canvasRef.current.getBoundingClientRect();
    return {x: e.clientX - r.left, y: e.clientY - r.top};
  };

  // Hit-test: returns {frameIdx, line} or null
  const getHit = (cx, cy, pf, info) => {
    if (!info) return null;
    const {frameW, zoom, sx, sy, nf} = info;
    const fwz = frameW * zoom;
    const fi = Math.max(0, Math.min(nf - 1, Math.floor(cx / fwz)));
    const L  = pf[fi] || pf[0];
    const fx = fi * fwz;
    const ty = L.top    * sy * zoom,  by = L.bottom * sy * zoom;
    const lx = L.left   * sx * zoom,  rx = L.right  * sx * zoom;
    const cxF = cx - fx;  // x within frame
    if (Math.abs(cy - ty) <= TOL) return {fi, line:'top'};
    if (Math.abs(cy - by) <= TOL) return {fi, line:'bottom'};
    if (Math.abs(cxF - lx) <= TOL) return {fi, line:'left'};
    if (Math.abs(cxF - rx) <= TOL) return {fi, line:'right'};
    return null;
  };

  /* ── global mouse handlers ── */
  moveHandler.current = (e) => {
    const cv = canvasRef.current; if (!cv) return;
    const {x, y} = toCanvas(e);
    const info = infoRef.current;
    if (!dragRef.current) {
      const hit = getHit(x, y, perFrameRef.current, info);
      cv.style.cursor = hit
        ? (hit.line==='top'||hit.line==='bottom' ? 'ns-resize' : 'ew-resize')
        : 'crosshair';
      return;
    }
    if (!info) return;
    const {fi, line, startX, startY, origVal} = dragRef.current;
    const {zoom, sx, sy} = info;
    const isVert = line === 'top' || line === 'bottom';
    const delta  = isVert ? (y - startY) / zoom / sy : (x - startX) / zoom / sx;
    const val    = Math.round(origVal + delta);
    setPerFrame(prev => prev.map((L, i) => i === fi ? {...L, [line]: val} : L));
  };

  React.useEffect(() => {
    const gMove = (e) => moveHandler.current(e);
    const gUp   = ()  => { dragRef.current = null; };
    document.addEventListener('mousemove', gMove);
    document.addEventListener('mouseup',   gUp);
    return () => {
      document.removeEventListener('mousemove', gMove);
      document.removeEventListener('mouseup',   gUp);
    };
  }, []);

  const onDown = (e) => {
    e.preventDefault();
    const {x, y} = toCanvas(e);
    const info = infoRef.current;
    const hit  = getHit(x, y, perFrameRef.current, info);
    if (hit) {
      setSelFrame(hit.fi);
      dragRef.current = {fi: hit.fi, line: hit.line, startX: x, startY: y,
        origVal: perFrameRef.current[hit.fi][hit.line]};
    } else if (info) {
      // Click in frame → select it
      const fi = Math.max(0, Math.min(NF-1, Math.floor(x / (info.frameW * info.zoom))));
      setSelFrame(fi);
    }
  };

  // Produce a single crop from all frames (bounding union)
  const framesToCrop = (pf) => {
    const tops    = pf.map(L => Math.min(L.top, L.bottom));
    const bottoms = pf.map(L => Math.max(L.top, L.bottom));
    const lefts   = pf.map(L => Math.min(L.left, L.right));
    const rights  = pf.map(L => Math.max(L.left, L.right));
    const y = Math.min(...tops), b = Math.max(...bottoms);
    const x = Math.min(...lefts), r = Math.max(...rights);
    const perFrame = pf.map((_, i) => ({
      x: lefts[i], y: tops[i], w: rights[i] - lefts[i], h: bottoms[i] - tops[i],
    }));
    return {x, y, w: r - x, h: b - y, perFrame};
  };

  const enemyBase = sp.variant.replace(/_\d+$/, '');
  const info = imgInfo;

  /* ── compact modal ── */
  return (
    <div style={{position:'fixed', inset:0, zIndex:9500,
      background:'rgba(0,0,8,0.82)', display:'flex', alignItems:'center', justifyContent:'center'}}
      onClick={(e)=>{ if(e.target===e.currentTarget) onClose(); }}>

      <div style={{background:'#040415', border:'2px solid #2a2a4a', borderRadius:8,
        width:'94vw', maxHeight:'88vh', display:'flex', flexDirection:'column', overflow:'hidden',
        boxShadow:'0 10px 50px rgba(0,0,0,0.9)'}}>

        {/* Monster picker — all variants, grouped by dir */}
        {(() => {
          // Group pool entries by dir (same sprite sheet = same group)
          const groups = [];
          const dirIdx = {};
          pool.forEach(e => {
            if (dirIdx[e.dir] === undefined) { dirIdx[e.dir] = groups.length; groups.push([]); }
            groups[dirIdx[e.dir]].push(e);
          });
          return (
            <div style={{display:'flex', gap:8, padding:'6px 12px', borderBottom:'1px solid #111130',
              flexWrap:'wrap', background:'rgba(0,0,0,0.3)', flexShrink:0, alignItems:'center'}}>
              <span style={{fontFamily:'Cinzel', fontSize:8, color:'#446', marginRight:2}}>SKIN</span>
              {groups.map((grp, gi) => (
                <div key={gi} style={{display:'flex', gap:2, alignItems:'center'}}>
                  {grp.map((e, vi) => {
                    const active = !sp?.isBoss && e.variant === sp?.variant;
                    // Derive suffix: numeric last segment (Gorgon_1→"1") or first segment (Black_Werewolf→"Black")
                    const segs = e.variant.split('_');
                    const lastSeg = segs[segs.length - 1];
                    const isNumeric = /^\d+$/.test(lastSeg);
                    const suffix = isNumeric ? lastSeg : segs[0]; // "1"/"2"/"3" or "Black"/"Red"/"White"
                    // First button in group shows full name (e.g. "Gorgon 1", "Black Werewolf")
                    const firstLabel = isNumeric ? `${e.name} ${suffix}` : e.name;
                    return (
                      <button key={vi} onClick={() => setSp(e)}
                        style={{fontFamily:'Cinzel', fontSize:8, padding:'2px 7px', cursor:'pointer', borderRadius:2,
                          background: active ? '#1a1030' : 'transparent',
                          border: `1px solid ${active ? '#9955ee' : '#222233'}`,
                          color: active ? '#cc99ff' : '#445'}}>
                        {vi === 0 ? firstLabel : suffix}
                      </button>
                    );
                  })}
                </div>
              ))}
              {/* Boss entry */}
              {(() => {
                const active = !!sp?.isBoss;
                return (
                  <button onClick={() => setSp(_BOSS_CROP_ENTRY)}
                    style={{fontFamily:'Cinzel', fontSize:8, padding:'2px 7px', cursor:'pointer', borderRadius:2,
                      background: active ? '#1a0a00' : 'transparent',
                      border: `1px solid ${active ? '#ff8844' : '#222233'}`,
                      color: active ? '#ff8844' : '#445'}}>
                    🟢 Boss
                  </button>
                );
              })()}
            </div>
          );
        })()}

        {/* Header: anim tabs + close */}
        <div style={{display:'flex', alignItems:'center', gap:8, padding:'5px 12px',
          borderBottom:'1px solid #1a1a3a', flexShrink:0, flexWrap:'wrap'}}>
          <span style={{fontFamily:'Cinzel', fontSize:10, color: sp?.isBoss ? '#ff8844' : '#ffcc00'}}>
            {sp?.isBoss ? 'Demon Slime — Boss' : (sp?.variant||'').replace(/_/g,' ')}
          </span>
          {!sp?.isBoss && info && <span style={{fontFamily:'monospace', fontSize:8, color:'#334'}}>
            {info.iw}×{info.ih}px · {NF}f · {info.zoom.toFixed(1)}×
          </span>}
          {!sp?.isBoss && <div style={{display:'flex', gap:3, flexWrap:'wrap'}}>
            {anims.map((a,i) => (
              <button key={i} onClick={()=>setAnimIdx(i)}
                style={{fontFamily:'Cinzel', fontSize:8, padding:'1px 6px', cursor:'pointer', borderRadius:2,
                  background:i===animIdx?'#18103a':'transparent',
                  border:`1px solid ${i===animIdx?'#8855cc':'#2a2a3a'}`,
                  color:i===animIdx?'#cc99ff':'#446'}}>
                {a.label}
              </button>
            ))}
          </div>}
          <div style={{flex:1}}/>
          <button onClick={onClose} style={{fontFamily:'Cinzel', fontSize:9, padding:'2px 10px',
            cursor:'pointer', background:'#1a0a0a', border:'1px solid #553333', color:'#cc5555', borderRadius:3}}>
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{display:'flex', flex:1, overflow:'hidden', minHeight:0}}>

          {/* Canvas — scrollable (or GIF viewer for boss) */}
          <div style={{flex:1, overflow:'auto', padding:10, background:'#030310'}}>
            {sp?.isBoss ? (
              /* Boss: show all 5 webp GIFs */
              <div style={{display:'flex', flexWrap:'wrap', gap:20, padding:8}}>
                {_BOSS_GIFS.map(({label, file}) => (
                  <div key={file} style={{display:'flex', flexDirection:'column', alignItems:'center', gap:6}}>
                    <div style={{fontFamily:'Cinzel', fontSize:9, color:'#ff8844', letterSpacing:2}}>{label}</div>
                    <img src={`${BOSS_GIF_BASE}/${file}`} width={216} height={120}
                      style={{imageRendering:'pixelated', border:'1px solid #2a1a0a',
                        background:'#080808', display:'block'}}/>
                    <div style={{fontFamily:'monospace', fontSize:8, color:'#555'}}>{file}</div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {!info && <div style={{fontFamily:'monospace', fontSize:10, color:'#446', padding:20}}>loading…</div>}
                <div style={{display:'inline-block', background:'#050510', border:'1px solid #1a1a3a', borderRadius:3}}>
                  <canvas ref={canvasRef}
                    style={{display:'block', imageRendering:'pixelated', cursor:'crosshair'}}
                    onMouseDown={onDown}
                  />
                </div>
                {info && <div style={{fontFamily:'monospace', fontSize:8, color:'#334', marginTop:4}}>
                  frame size in sheet: {Math.round(info.frameW)}×{info.ih}px · drag gold lines to reposition
                </div>}
              </>
            )}
          </div>

          {/* Controls — hidden for boss (GIFs need no crop) */}
          {!sp?.isBoss && <div style={{width:210, flexShrink:0, borderLeft:'1px solid #1a1a3a', padding:'10px 12px',
            display:'flex', flexDirection:'column', gap:5, overflowY:'auto', background:'rgba(0,0,10,0.5)'}}>

            {/* Frame selector */}
            <div style={{fontFamily:'Cinzel', fontSize:8, color:'#8866cc', letterSpacing:1}}>
              FRAME {selFrame+1} / {NF}
            </div>
            <div style={{display:'flex', gap:2, flexWrap:'wrap', marginBottom:2}}>
              {Array.from({length:NF},(_,i)=>(
                <button key={i} onClick={()=>setSelFrame(i)}
                  style={{fontFamily:'monospace', fontSize:8, padding:'1px 5px', cursor:'pointer',
                    borderRadius:2, background:i===selFrame?'#1a1030':'transparent',
                    border:`1px solid ${i===selFrame?'#7744cc':'#222233'}`,
                    color:i===selFrame?'#cc99ff':'#445'}}>
                  {i+1}
                </button>
              ))}
            </div>

            {/* 4 lines for selected frame */}
            {[
              ['TOP',    'top',    '#44ccff', -FH*3, FH*4],
              ['BOTTOM', 'bottom', '#ff8844', -FH*3, FH*4],
              ['LEFT',   'left',   '#44ff88', -FW*3, FW*4],
              ['RIGHT',  'right',  '#ff4488', -FW*3, FW*4],
            ].map(([lbl, key, col, mn, mx]) => (
              <label key={key} style={{display:'flex', flexDirection:'column', gap:2}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <span style={{fontFamily:'monospace', fontSize:9, color:col, fontWeight:'bold'}}>{lbl}</span>
                  <input type="number" value={perFrame[selFrame]?.[key] ?? 0}
                    onChange={e=>setPerFrame(prev=>prev.map((L,i)=>i===selFrame?{...L,[key]:+e.target.value}:L))}
                    style={{width:50, background:'#0a0a18', border:`1px solid ${col}55`, color:col,
                      fontFamily:'monospace', fontSize:10, padding:'2px 3px', borderRadius:2, textAlign:'right'}}/>
                </div>
                <input type="range" min={mn} max={mx} value={perFrame[selFrame]?.[key] ?? 0}
                  onChange={e=>setPerFrame(prev=>prev.map((L,i)=>i===selFrame?{...L,[key]:+e.target.value}:L))}
                  style={{width:'100%', accentColor:col}}/>
              </label>
            ))}

            {/* Live crop preview */}
            {(()=>{
              const c = framesToCrop(perFrame);
              return (
                <div style={{borderTop:'1px solid #1a1a2a', paddingTop:5}}>
                  <div style={{fontFamily:'monospace', fontSize:8, color:'#446', lineHeight:1.7, marginBottom:4}}>
                    union: {c.w}×{c.h} @ ({c.x},{c.y})
                  </div>
                  <div style={{fontSize:8, color:'#556', marginBottom:3, letterSpacing:1}}>FRAME {selFrame+1} PREVIEW</div>
                  <canvas ref={previewRef} width={120} height={120}
                    style={{display:'block', imageRendering:'pixelated',
                      border:'1px solid #2a2a4a', borderRadius:4, background:'#06060f'}}/>
                </div>
              );
            })()}

            <button onClick={doApply}
              style={{fontFamily:'Cinzel', fontSize:9, padding:'5px 8px', cursor:'pointer',
                borderRadius:3, transition:'background .15s,border-color .15s,color .15s',
                background: applyFlash==='done' ? '#0a3a0a' : '#0a1a0a',
                border:`1px solid ${applyFlash==='done' ? '#88ff44' : '#44aa44'}`,
                color: applyFlash==='done' ? '#88ff44' : '#44ff88'}}>
              {applyFlash==='done' ? `✓✓ ${anim.label} SAVED!` : `✓ APPLY TO ${anim.label}`}
            </button>
            <button onClick={()=>setPerFrame(makeFrameLines(NF,sp,anim.file))}
              style={{fontFamily:'Cinzel', fontSize:8, padding:'3px 8px', cursor:'pointer',
                background:'#0a0a1a', border:'1px solid #334', color:'#445', borderRadius:3}}>
              RESET
            </button>
          </div>}
        </div>
      </div>
    </div>
  );
}


function CombatSpriteOverlay({ cs, enemyFlash }) {
  const [open, setOpen] = React.useState(false);
  // Which pool entry is selected (null = follow live cs.enemySprite)
  const [overrideIdx, setOverrideIdx] = React.useState(null);
  // cropMap: { [poolIdx]: {x,y,w,h} } — per-sprite crop calibration
  const [cropMap, setCropMap] = React.useState({});
  // logText: shown in-panel after LOG ALL
  const [logText, setLogText] = React.useState('');

  function getCrop(idx) {
    if (cropMap[idx]) return cropMap[idx];
    const e = ENEMY_SPRITE_POOL[idx];
    return { x: e.cropX||0, y: e.cropY||0, w: e.cropW||e.frameW, h: e.cropH||Math.round(e.frameH*0.75) };
  }

  // Push a crop update to: local state, pool entry, AND cs.enemySprite (always by value copy)
  function applyCrop(idx, patch) {
    const next = { ...getCrop(idx), ...patch };
    const fw = ENEMY_SPRITE_POOL[idx].frameW, fh = ENEMY_SPRITE_POOL[idx].frameH;
    next.x = Math.max(0, Math.min(next.x, fw-1));
    next.y = Math.max(0, Math.min(next.y, fh-1));
    next.w = Math.max(1, Math.min(next.w, fw*2));
    next.h = Math.max(1, Math.min(next.h, fh*2));
    setCropMap(m => ({...m, [idx]: next}));
    // Mutate pool entry (persists across re-renders)
    const e = ENEMY_SPRITE_POOL[idx];
    e.cropX = next.x; e.cropY = next.y; e.cropW = next.w; e.cropH = next.h;
    // Force-push a new enemySprite object so React.memo re-renders EnemySpriteSmall
    // Use the selected pool entry regardless of reference equality
    if (window.__setCs) window.__setCs(prev => prev ? {
      ...prev, enemySprite: { ...e, cropX:next.x, cropY:next.y, cropW:next.w, cropH:next.h }
    } : prev);
  }

  // Switch the in-game sprite to a specific pool entry
  function pickSprite(idx) {
    setOverrideIdx(idx);
    const e = ENEMY_SPRITE_POOL[idx];
    const c = getCrop(idx);
    if (window.__setCs) window.__setCs(prev => prev ? {
      ...prev, enemySprite: { ...e, cropX:c.x, cropY:c.y, cropW:c.w, cropH:c.h }
    } : prev);
  }

  const activePoolIdx = overrideIdx !== null ? overrideIdx
    : Math.max(0, ENEMY_SPRITE_POOL.findIndex(e => e.variant === cs.enemySprite?.variant));
  const sp   = ENEMY_SPRITE_POOL[activePoolIdx];
  const crop = getCrop(activePoolIdx);
  const base = `${ASSET_BASE}/icons/sprites/${sp.dir}/${sp.variant}`;

  const atkIdxRef = React.useRef(0);
  const prevPhase = React.useRef(cs.phase);
  if (cs.phase==='enemy_turn' && prevPhase.current!=='enemy_turn' && sp.attacks?.length>1)
    atkIdxRef.current = (atkIdxRef.current+1) % sp.attacks.length;
  prevPhase.current = cs.phase;

  let src, numFrames, fps;
  if (cs.phase==='won' && sp.deadFile)
    { src=`${base}/${sp.deadFile}`; numFrames=sp.deadFrames||3; fps=9; }
  else if (enemyFlash && sp.hurtFile)
    { src=`${base}/${sp.hurtFile}`; numFrames=sp.hurtFrames||2; fps=14; }
  else if ((cs.phase==='enemy_turn'||cs.phase==='defending') && sp.attacks?.length) {
    const atk=sp.attacks[atkIdxRef.current%sp.attacks.length];
    src=`${base}/${atk.file}`; numFrames=atk.frames; fps=12;
  } else { src=`${base}/Idle.png`; numFrames=sp.idleFrames; fps=8; }

  const [activeFrame, setActiveFrame] = React.useState(0);
  React.useEffect(()=>{
    setActiveFrame(0);
    const iv = setInterval(()=>setActiveFrame(f=>(f+1)%numFrames), 1000/fps);
    return ()=>clearInterval(iv);
  },[src, numFrames, fps]);

  // Strip display scale
  const VW    = Math.min(window.innerWidth - 24, 860);
  const SCALE = Math.floor(VW / numFrames); // px per frame in strip
  const BIG   = Math.min(220, window.innerHeight*0.27);

  // Box on strip = crop region scaled to display
  const ratio  = SCALE / sp.frameW;          // display px per source px
  const BOX_X  = Math.round(crop.x * ratio); // offset within a frame cell
  const BOX_Y  = Math.round(crop.y * ratio);
  const BOX_W  = Math.round(crop.w * ratio);
  const BOX_H  = Math.round(crop.h * ratio);

  const GROUPS = [
    { label:'GORGON',   indices:[0,1,2] },
    { label:'MINOTAUR', indices:[3,4,5] },
    { label:'WEREWOLF', indices:[6,7,8] },
  ];

  const isBoss = cs?.enemy?.id === 'dragon';

  // ── Boss GIF frame editor — all hooks unconditional (Rules of Hooks) ──
  const [bossW,          setBossW]          = React.useState(ENEMY_DIMS.dragon?.w            || 216);
  const [bossH,          setBossH]          = React.useState(ENEMY_DIMS.dragon?.h            || 120);
  const [bossHitFrame,   setBossHitFrame]   = React.useState(ENEMY_DIMS.dragon?.hitFrame     ?? 3);
  const [bossHitFps,     setBossHitFps]     = React.useState(ENEMY_DIMS.dragon?.hitFps       ?? 12);
  const [bossAnimIdx,    setBossAnimIdx]    = React.useState(2); // 2 = CLEAVE
  const [bossLiveFrame,    setBossLiveFrame]    = React.useState(0);
  const [bossSelFrame,     setBossSelFrame]     = React.useState(null); // null = live GIF
  const [bossFrameDataUrl, setBossFrameDataUrl] = React.useState(null);
  const bossTotalFrames = _BOSS_GIFS[bossAnimIdx]?.frames ?? 1;

  // Reset selected frame when switching animations
  React.useEffect(() => {
    setBossSelFrame(null);
    setBossFrameDataUrl(null);
  }, [bossAnimIdx]);

  // Frame ticker
  React.useEffect(() => {
    if (!isBoss) return;
    setBossLiveFrame(0);
    const iv = setInterval(() => setBossLiveFrame(f => (f+1) % bossTotalFrames), 1000/bossHitFps);
    return () => clearInterval(iv);
  }, [isBoss, bossAnimIdx, bossTotalFrames, bossHitFps]);

  // Extract a single webp frame via ImageDecoder API (Chrome 94+)
  const extractBossFrame = React.useCallback(async (file, frameIdx) => {
    try {
      const url = `${BOSS_GIF_BASE}/${file}`;
      const resp = await fetch(url);
      const decoder = new ImageDecoder({ data: resp.body, type: 'image/webp' });
      await decoder.tracks.ready;
      const result = await decoder.decode({ frameIndex: frameIdx });
      const bmp = result.image;
      const cv = document.createElement('canvas');
      cv.width = bmp.displayWidth; cv.height = bmp.displayHeight;
      cv.getContext('2d').drawImage(bmp, 0, 0);
      setBossFrameDataUrl(cv.toDataURL());
      bmp.close();
    } catch(e) {
      console.warn('[extractBossFrame]', e);
      setBossFrameDataUrl(null); // fallback: show live GIF
    }
  }, []);
  const activeBossGif = (() => {
    if (cs?.phase === 'won') return '05_d_death.webp';
    if (enemyFlash)          return '04_d_take_hit.webp';
    if (cs?.phase === 'enemy_turn' || cs?.phase === 'defending') return '03_d_cleave.webp';
    return '01_d_idle.webp';
  })();

  if (!open) return (
    <button onClick={()=>setOpen(true)} style={{
      position:'fixed',bottom:8,right:8,zIndex:88888,
      fontFamily:'monospace',fontSize:10,padding:'4px 10px',cursor:'pointer',
      background:'rgba(7,7,15,0.9)',border:'1px solid #2a2a4a',borderRadius:5,color:'#555',
      boxShadow:'0 2px 8px #000'
    }}>🖼 SPRITE</button>
  );

  if (isBoss) {
    const bossAnim = _BOSS_GIFS[bossAnimIdx];
    const BIG = Math.min(220, window.innerHeight*0.27);

    return (
      <div style={{position:'fixed',bottom:0,left:0,right:0,
        background:'rgba(7,7,15,0.94)',borderTop:'2px solid #2a2a4a',
        zIndex:88888,padding:'8px 14px 12px',fontFamily:'monospace',backdropFilter:'blur(4px)'}}>

        <button onClick={()=>setOpen(false)} style={{position:'absolute',top:6,right:10,
          background:'none',border:'none',color:'#445',cursor:'pointer',fontSize:14,lineHeight:1,padding:'2px 4px'}}>✕</button>

        {/* Anim picker — same style as sprite picker row */}
        <div style={{display:'flex',gap:12,alignItems:'center',marginBottom:7,
          borderBottom:'1px solid #1e1e3a',paddingBottom:6,flexWrap:'wrap'}}>
          <span style={{fontSize:9,color:'#555',letterSpacing:'.1em'}}>SPRITE</span>
          <span style={{fontSize:9,color:'#ff8844'}}>DEMON SLIME — BOSS</span>
          {_BOSS_GIFS.map((g,i) => (
            <button key={i} onClick={()=>setBossAnimIdx(i)}
              style={{padding:'2px 8px',fontFamily:'monospace',fontSize:9,cursor:'pointer',borderRadius:3,
                background:bossAnimIdx===i?'#1a1430':'#0d0d1a',
                border:`1px solid ${bossAnimIdx===i?'#9977cc':'#2a2a3a'}`,
                color:bossAnimIdx===i?'#cc99ff':'#555'}}>
              {g.label}
            </button>
          ))}
        </div>

        <div style={{display:'flex',gap:12,alignItems:'flex-start'}}>

          {/* Big preview — isolated frame or live GIF */}
          <div style={{flexShrink:0}}>
            <div style={{fontSize:9,color:'#555',letterSpacing:'.08em',marginBottom:3}}>
              {bossSelFrame!==null ? `FRAME ${bossSelFrame} — ${bossAnim.label}` : 'IN-GAME ANIM'}
              {bossSelFrame!==null && <button onClick={()=>{setBossSelFrame(null);setBossFrameDataUrl(null);}}
                style={{marginLeft:8,fontSize:8,padding:'1px 5px',cursor:'pointer',background:'#1a0808',
                  border:'1px solid #553333',color:'#cc5555',borderRadius:2,fontFamily:'monospace'}}>✕ live</button>}
            </div>
            <img src={bossSelFrame!==null && bossFrameDataUrl ? bossFrameDataUrl : `${BOSS_GIF_BASE}/${bossAnim.file}`}
              width={BIG} height={Math.round(BIG*(bossH/bossW))}
              style={{imageRendering:'pixelated',border:`1px solid ${bossSelFrame!==null?'#ffcc4488':'#2a2a4a'}`,
                background:'#111122',display:'block',borderRadius:5}}/>
            <div style={{fontSize:9,color:'#c8a84b',textAlign:'center',marginTop:3}}>
              {bossSelFrame!==null ? `isolated · frame ${bossSelFrame}/${bossTotalFrames-1}` : `frame ${bossLiveFrame+1}/${bossTotalFrames} · ${bossAnim.label}`}
            </div>
          </div>

          {/* Frame strip — clickable frame buttons, live frame + hit frame highlighted */}
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:9,color:'#555',marginBottom:5}}>
              demon_slime_boss · {bossAnim.file} · {bossTotalFrames} frames · click frame to set hit frame
            </div>
            {/* Frame button strip */}
            <div style={{display:'flex',gap:2,flexWrap:'wrap',marginBottom:6}}>
              {Array.from({length:bossTotalFrames},(_,i) => {
                const isLive = i === bossLiveFrame;
                const isHit  = i === bossHitFrame && bossAnimIdx === 2;
                const isSel  = i === bossSelFrame;
                return (
                  <button key={i} onClick={()=>{
                    setBossSelFrame(i);
                    extractBossFrame(bossAnim.file, i);
                  }}
                    onContextMenu={e=>{ e.preventDefault();
                      if (bossAnimIdx===2) { setBossHitFrame(i); ENEMY_DIMS.dragon.hitFrame=i; }
                    }}
                    title={`Click: isolate frame ${i}${bossAnimIdx===2?' · Right-click: set hit frame':''}`}
                    style={{
                      width:36,height:36,fontSize:9,cursor:'pointer',borderRadius:3,
                      background: isSel ? '#0a2a0a' : isHit ? '#1a2a00' : isLive ? '#1a1430' : '#0d0d1a',
                      border: `2px solid ${isSel?'#44ff88':isHit?'#ffcc00':isLive?'#9977cc':'#2a2a3a'}`,
                      color: isSel?'#44ff88':isHit?'#ffcc00':isLive?'#cc99ff':'#555',
                      fontFamily:'monospace', position:'relative',
                    }}>
                    {i}
                    {isSel && <div style={{position:'absolute',bottom:1,left:0,right:0,
                      textAlign:'center',fontSize:6,color:'#44ff88'}}>📌</div>}
                    {isHit && !isSel && <div style={{position:'absolute',bottom:1,left:0,right:0,
                      textAlign:'center',fontSize:6,color:'#ffcc00'}}>HIT</div>}
                    {isLive && !isHit && !isSel && <div style={{position:'absolute',bottom:1,left:0,right:0,
                      textAlign:'center',fontSize:6,color:'#9977cc'}}>▶</div>}
                  </button>
                );
              })}
            </div>
            {/* Frame numbers row */}
            <div style={{fontSize:8,color:'#334',marginTop:2}}>
              click: isolate frame · {bossAnimIdx===2 ? `right-click: set hit frame (currently ${bossHitFrame})` : 'switch to CLEAVE to set hit frame'}
            </div>
          </div>

          {/* Controls panel — same style as crop sliders */}
          <div style={{flexShrink:0,display:'flex',flexDirection:'column',gap:6,
            background:'#0a0a16',border:'1px solid #1e1e3a',borderRadius:5,padding:'8px 10px'}}>
            <div style={{fontSize:9,color:'#555',letterSpacing:'.08em',marginBottom:2}}>BOSS — demon_slime</div>
            <CropSliderRow label="W"     value={bossW}        min={60} max={480} onChange={v=>{setBossW(v);ENEMY_DIMS.dragon.w=v;}}/>
            <CropSliderRow label="H"     value={bossH}        min={40} max={280} onChange={v=>{setBossH(v);ENEMY_DIMS.dragon.h=v;}}/>
            <CropSliderRow label="fps"   value={bossHitFps}   min={1}  max={30}  onChange={v=>{setBossHitFps(v);ENEMY_DIMS.dragon.hitFps=v;}}/>
            <CropSliderRow label="hit f" value={bossHitFrame} min={0}  max={Math.max(0,bossTotalFrames-1)} onChange={v=>{setBossHitFrame(v);ENEMY_DIMS.dragon.hitFrame=v;}}/>
            <div style={{fontSize:8,color:'#333',marginTop:2}}>
              w:{bossW} h:{bossH}<br/>
              hit f:{bossHitFrame} fps:{bossHitFps}
            </div>
            {(()=>{
              const DUR=3000,WALK_END=0.40,ATK_END=0.82;
              const hitMs=Math.min((bossHitFrame/bossHitFps)*1000,(ATK_END-WALK_END)*DUR*0.85);
              const arrive=WALK_END+hitMs/DUR;
              return <div style={{fontSize:8,color:'#c8a84b',marginTop:2}}>
                parry @ {Math.round(arrive*DUR)}ms
              </div>;
            })()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{position:'fixed',bottom:0,left:0,right:0,
      background:'rgba(7,7,15,0.94)',borderTop:'2px solid #2a2a4a',
      zIndex:88888,padding:'8px 14px 12px',fontFamily:'monospace',backdropFilter:'blur(4px)'}}>

      {/* close button */}
      <button onClick={()=>setOpen(false)} style={{
        position:'absolute',top:6,right:10,background:'none',border:'none',
        color:'#445',cursor:'pointer',fontSize:14,lineHeight:1,padding:'2px 4px'
      }}>✕</button>

      {/* ── Sprite picker ── */}
      <div style={{display:'flex',gap:12,alignItems:'center',marginBottom:7,
        borderBottom:'1px solid #1e1e3a',paddingBottom:6,flexWrap:'wrap'}}>
        <span style={{fontSize:9,color:'#555',letterSpacing:'.1em'}}>SPRITE</span>
        <button onClick={()=>{ setOverrideIdx(null); if(window.__setCs&&cs.enemySprite) window.__setCs(prev=>prev?{...prev,enemySprite:{...cs.enemySprite}}:prev); }}
          style={{padding:'2px 8px',fontFamily:'monospace',fontSize:9,cursor:'pointer',borderRadius:3,
            background:overrideIdx===null?'#2a1a00':'#0d0d1a',
            border:`1px solid ${overrideIdx===null?'#ffcc00':'#2a2a3a'}`,
            color:overrideIdx===null?'#ffcc00':'#555'}}>LIVE</button>
        {GROUPS.map(g=>(
          <div key={g.label} style={{display:'flex',alignItems:'center',gap:3}}>
            <span style={{fontSize:8,color:'#2a2a4a',letterSpacing:'.06em',marginRight:2}}>{g.label}</span>
            {g.indices.map(idx=>{
              const e = ENEMY_SPRITE_POOL[idx];
              const sel = activePoolIdx===idx;
              const label = e.variant.replace(/^(Gorgon|Minotaur)_/,'').replace(/_Werewolf/,'');
              const hasCrop = !!(cropMap[idx]);
              return (
                <button key={idx} onClick={()=>pickSprite(idx)}
                  style={{padding:'2px 8px',fontFamily:'monospace',fontSize:9,cursor:'pointer',borderRadius:3,
                    background:sel?'#1a1430':'#0d0d1a',
                    border:`1px solid ${sel?'#9977cc':hasCrop?'#445533':'#2a2a3a'}`,
                    color:sel?'#cc99ff':hasCrop?'#88aa66':'#555'}}>
                  {label}{hasCrop?' ✓':''}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div style={{display:'flex',gap:12,alignItems:'flex-start'}}>

        {/* Big frame preview — real drawImage from actual PNG */}
        <div style={{flexShrink:0}}>
          <div style={{fontSize:9,color:'#555',letterSpacing:'.08em',marginBottom:3}}>IN-GAME CROP</div>
          <CropFrameCanvas src={src} frameW={sp.frameW} frameH={sp.frameH}
            frameIdx={activeFrame} cropX={crop.x} cropY={crop.y}
            cropW={crop.w} cropH={crop.h} size={BIG}/>
          <div style={{fontSize:9,color:'#c8a84b',textAlign:'center',marginTop:3}}>
            frame {activeFrame+1}/{numFrames} · {crop.w}×{crop.h}px
          </div>
        </div>

        {/* Strip + crop box */}
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:9,color:'#555',marginBottom:5}}>
            {sp.variant} · {src.split('/').pop()} · {numFrames}f · raw {sp.frameW}px
          </div>
          {/* Sprite strip */}
          <div style={{position:'relative',display:'inline-block',
            width:SCALE*numFrames,height:SCALE,borderRadius:4,overflow:'hidden'}}>
            <img src={src} style={{position:'absolute',top:0,left:0,
              width:SCALE*numFrames,height:SCALE,imageRendering:'pixelated',display:'block'}}/>
            {/* Dim non-active frames */}
            <div style={{position:'absolute',top:0,left:0,width:activeFrame*SCALE,height:SCALE,
              background:'rgba(0,0,0,.55)',pointerEvents:'none'}}/>
            <div style={{position:'absolute',top:0,left:(activeFrame+1)*SCALE,right:0,height:SCALE,
              background:'rgba(0,0,0,.55)',pointerEvents:'none'}}/>
            {/* Crop box on every frame (green) */}
            {[...Array(numFrames)].map((_,i)=>(
              <div key={i} style={{position:'absolute',
                top:BOX_Y, left:i*SCALE+BOX_X,
                width:BOX_W, height:BOX_H,
                border:`2px solid ${i===activeFrame?'#ffcc00':'#44ff8866'}`,
                boxSizing:'border-box',pointerEvents:'none'}}>
                {i===activeFrame && <div style={{position:'absolute',bottom:1,left:0,right:0,
                  textAlign:'center',fontSize:7,color:'#ffcc00',textShadow:'0 0 3px #000'}}>ACTIVE</div>}
              </div>
            ))}
          </div>
          {/* Frame numbers */}
          <div style={{display:'flex',width:SCALE*numFrames,marginTop:2}}>
            {[...Array(numFrames)].map((_,i)=>(
              <div key={i} style={{width:SCALE,textAlign:'center',fontSize:8,
                color:i===activeFrame?'#ffcc00':'#333'}}>{i}</div>
            ))}
          </div>
        </div>

        {/* Crop sliders */}
        <div style={{flexShrink:0,display:'flex',flexDirection:'column',gap:6,
          background:'#0a0a16',border:'1px solid #1e1e3a',borderRadius:5,padding:'8px 10px'}}>
          <div style={{fontSize:9,color:'#555',letterSpacing:'.08em',marginBottom:2}}>CROP — {sp.variant}</div>
          <CropSliderRow label="X" value={crop.x} min={0}   max={sp.frameW}   onChange={v=>applyCrop(activePoolIdx,{x:v})}/>
          <CropSliderRow label="Y" value={crop.y} min={0}   max={sp.frameH}   onChange={v=>applyCrop(activePoolIdx,{y:v})}/>
          <CropSliderRow label="W" value={crop.w} min={1}   max={sp.frameW*2} onChange={v=>applyCrop(activePoolIdx,{w:v})}/>
          <CropSliderRow label="H" value={crop.h} min={1}   max={sp.frameH*2} onChange={v=>applyCrop(activePoolIdx,{h:v})}/>
          <div style={{fontSize:8,color:'#333',marginTop:2}}>
            cropX:{crop.x} cropY:{crop.y} cropW:{crop.w} cropH:{crop.h}
          </div>
          <button onClick={()=>{
            const lines = ENEMY_SPRITE_POOL.map((e,i)=>{
              const c = getCrop(i);
              return `{variant:"${e.variant}", cropX:${c.x}, cropY:${c.y}, cropW:${c.w}, cropH:${c.h}}`;
            }).join('\n');
            setLogText(lines);
          }} style={{padding:'3px 8px',background:'#0d0d1a',border:'1px solid #4a3a7a',
            color:'#9977cc',borderRadius:3,cursor:'pointer',fontSize:9}}>
            LOG ALL
          </button>
          {logText && (
            <textarea readOnly value={logText}
              style={{width:'100%',height:120,background:'#050508',border:'1px solid #2a2a4a',
                color:'#88ff88',fontSize:8,fontFamily:'monospace',borderRadius:3,padding:4,
                resize:'vertical',marginTop:4}}
              onClick={e=>e.target.select()}/>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN APP ───────────────────────────────────────────────── */
function App() {
  const [screen,         setScreen]         = useState("title");
  const [selectedWeapon, setSelectedWeapon] = useState(null);
  const [player,         setPlayer]         = useState(null);
  const [cs,             setCs]             = useState(null);
  const csRef = useRef(null); csRef.current = cs; // always-fresh cs for closures (avoids stale atk values)
  const [qteAnim,        setQteAnim]        = useState(null); // all in-scene QTE state
  React.useEffect(()=>{ window.__setQteAnim = setQteAnim; window.__setScreen = setScreen; window.__setPlayer = setPlayer; window.__setCs = setCs; window.__randomHeroLooks = randomHeroLooks; window.ENEMY_SPRITE_POOL = ENEMY_SPRITE_POOL; },[]); // dev debug hook
  // Frame ticker for sprite animation cycling (120ms per frame ≈ ~8fps sprite anim)
  const [frameTick, setFrameTick] = React.useState(0);
  React.useEffect(()=>{ const id=setInterval(()=>setFrameTick(t=>(t+1)%1000),120); return ()=>clearInterval(id); },[]);
  const [levelUpPending, setLevelUpPending] = useState(false);
  const [rewards,        setRewards]        = useState(null);
  const [enemyFlash,     setEnemyFlash]     = useState(false);
  const [hitResult,      setHitResult]      = useState(null);
  const [impactFlash,    setImpactFlash]    = useState(0); // 0=off, 1=white hit, 2=enemy hit
  const [stompImpact,    setStompImpact]    = useState(null); // {x,y,quality,id} — contact burst
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
  const [oppDiedInDungeon, setOppDiedInDungeon] = useState(false);
  const [iWonRace,   setIWonRace]  = useState(false);
  const [myWeaponLocked, setMyWeaponLocked] = useState(false); // race: true after LOCK IN pressed
  const [bookOpen,   setBookOpen]  = useState(false);
  const [bookHoverPotion, setBookHoverPotion] = useState(null);
  const [hoverWeaponId, setHoverWeaponId] = useState(null);
  const [pvpLog,     setPvpLog]    = useState([]);
  const mpRef = useRef({ peer:null, conn:null, isHost:false, syncIv:null, lastAtkTs:null, pvpIncomingDmg:0 });
  // PvP routing refs — redirect QTE results to pvp handlers when pvpMode=true
  const pvpModeRef    = useRef(false);
  const pvpAtkCbRef   = useRef(null); // (q, weapon, dmg) => void — after attack QTE
  const pvpDefCbRef   = useRef(null); // (q) => void — after defend QTE
  const titleVidRef   = useRef(null); // title background video — top-level ref (hooks must not be in IIFE)
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

  // Title background video — plays once at normal speed, freezes on last frame
  // Must live here (top-level) — hooks inside the title JSX IIFE caused "fewer hooks" crash on screen change
  useEffect(()=>{
    const v = titleVidRef.current;
    if (!v) return;
    v.playbackRate = 1;
    v.play().catch(()=>{});
    return ()=>{ v.pause(); };
  },[screen]); // re-run when screen changes so it starts playing when title mounts

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

  // Freeze timer when run ends (solo victory/gameover OR pvp winner declared OR pvp_wait)
  useEffect(()=>{
    const ended = screen==="victory"||screen==="gameover"||screen==="pvp_wait"||pvpWinner;
    if(ended&&runStartTime&&!finalTime){
      const t = fmtTime(Date.now()-runStartTime);
      setFinalTime(t);
      setTimerDisplay(t);
    }
  },[screen, pvpWinner]);

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
    const id=setInterval(()=>setCastTick(t=>t+1),50); // 20fps for timer display — was 30ms (33fps)
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

  // ── Watch opponent dungeonDied → show "noob died" win screen ──
  useEffect(()=>{
    if(gameMode!=="race") return;
    if(!oppSnap?.dungeonDied) return;
    if(cs?.pvpMode || pvpWinner) return; // already in pvp combat — irrelevant
    setOppDiedInDungeon(true);
  },[oppSnap?.dungeonDied, gameMode, cs?.pvpMode, pvpWinner]);

  // ── Watch opponent pvpMissed → flip to "mine" so I can attack ──
  useEffect(()=>{
    if(!cs?.pvpMode || pvpWinner) return;
    if(!oppSnap?.pvpMissed) return;
    setPvpTurn("mine");
    const n = oppSnap?.name||"RIVAL";
    setCs(prev=>prev?{...prev,phase:"action",
      log:[...prev.log,`${n} missed! Your turn.`].slice(-8)}:prev);
    setPvpLog(lg=>[...lg,`⚔ ${n} missed their attack — your turn!`].slice(-6));
  },[oppSnap?.pvpMissed]);

  // ── Weapon lock-in: both players locked → start simultaneously ──
  useEffect(()=>{
    if(gameMode!=="race") return;
    if(screen!=="weapon_select") return;
    if(!myWeaponLocked || !oppSnap?.weaponLocked) return;
    if(!selectedWeapon) return;
    // Brief flash so both see "BOTH READY" before transition
    setTimeout(()=>startGame(selectedWeapon), 600);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[myWeaponLocked, oppSnap?.weaponLocked, gameMode, screen]);

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

  // pvpTurnDone effect REMOVED — turns are self-managing:
  // After you ATTACK → pvpTurn="theirs" (pvpOnAttackDone)
  // After you DEFEND → pvpTurn="mine"  (pvpDefCbRef callback in pvpStartIncoming)
  // Giving the original attacker their turn back here caused BOTH players to have
  // "mine" simultaneously, leaving both books open and allowing anyone to attack freely.

  // ── Watch oppSnap.pvpHp — single source of truth for opponent HP on attacker side ──
  // Attacker never touches pvpOppHp directly; defender reports actual HP after block/parry.
  useEffect(()=>{
    if(!cs?.pvpMode||pvpWinner) return;
    if(oppSnap?.pvpHp===undefined||oppSnap?.pvpHp===null) return;
    setPvpOppHp(oppSnap.pvpHp);
    if(oppSnap.pvpHp<=0){
      setPvpWinner("me");
      pvpModeRef.current=false;
      mpRef.current.cleanEnded=true;
    }
  },[oppSnap?.pvpHp, cs?.pvpMode, pvpWinner]);

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
    if(player&&!levelUpPending&&player.level<=XP_THRESHOLDS.length) {
      const needed = xpThresholdFor(player.level);
      if(player.xp >= needed) setLevelUpPending(true);
    }
  },[player?.xp,player?.level,levelUpPending]);

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
      if (data.dragonKilled  !== undefined) next.dragonKilled  = data.dragonKilled;
      if (data.pvpReady      !== undefined) next.pvpReady      = data.pvpReady;
      if (data.weapon        !== undefined) next.weapon        = data.weapon;
      if (data.weaponLocked  !== undefined) next.weaponLocked  = data.weaponLocked;
      if (data.name         !== undefined) next.name         = data.name;
      if (data.pvpMyHp      !== undefined) next.pvpHp        = data.pvpMyHp;
      if (data.pvpAtk       !== undefined) next.pvpAtk       = data.pvpAtk;
      if (data.pvpTurnDone  !== undefined) next.pvpTurnDone  = data.pvpTurnDone;
      if (data.dungeonDied  !== undefined) next.dungeonDied  = data.dungeonDied;
      if (data.pvpMissed    !== undefined) next.pvpMissed    = data.pvpMissed;
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
          setOppDiedInDungeon(false);
          setTimeout(() => setMpDisconnected(false), 2800);
        }, 400);
      } else {
        setGameMode("solo"); setMpStatus("idle"); setMpMode(null); setOppDiedInDungeon(false);
      }
    });
    conn.on("open", () => {
      // Introduce ourselves — reset any previous lock-in state
      setMyWeaponLocked(false);
      setSelectedWeapon(null);
      mpSend({ type:"state", name: portalName, floor:0, hp:60, maxHp:60,
               weapon:"sword", dragonKilled:false, pvpReady:false, pvpMyHp:80, pvpAtk:null,
               weaponLocked:false });
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
        pvpHeroLooks: randomHeroLooks(), // gives opponent a layered sprite (same system as player)
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
      // Send attack — DO NOT update pvpOppHp here. Defender reports their HP after block/parry.
      // pvpOppHp is updated via oppSnap.pvpHp effect once defender resolves. This ensures
      // damage registers after their QTE and prevents both-win race conditions.
      // Include weapon so defender's QTE matches attacker's weapon type.
      // RPG also picks a random variant so every launch has a different projectile pattern.
      const rpgVariant = weapon.id === "rpg"
        ? Math.floor(Math.random() * RPG_DEFEND_VARIANTS.length)
        : undefined;
      mpSend({ type:"state", pvpAtk: { dmg, quality: q, ts, weaponId: weapon.id, rpgVariant } });
      setCs(prev=>prev?{...prev,phase:"enemy_turn",
        log:[...prev.log,`⚔ You launched ${dmg} at ${prev.enemy.name}…`].slice(-8)}:prev);
      setPvpLog(lg => [...lg, `⚔ You attacked ${oppSnap?.name||"RIVAL"} for ${dmg} (${q}) — awaiting block…`].slice(-6));
    } else {
      // Miss: skip to opponent's turn — no retry allowed
      mpSend({ type:"state", pvpMissed: Date.now() });
      setCs(prev=>prev?{...prev,phase:"action",
        log:[...prev.log,"⚔ Your attack missed! Opponent's turn."].slice(-8)}:prev);
      setPvpLog(lg => [...lg, "⚔ You missed! Opponent's turn now."].slice(-6));
    }
    setPvpTurn("theirs");
  };

  // Called when opponent's pvpAtk arrives (starts defend QTE)
  const pvpStartIncoming = (atkData) => {
    mpRef.current.pvpIncomingDmg = atkData.dmg;
    pvpDefCbRef.current = (q) => {
      pvpDefCbRef.current = null;
      const inDmg = mpRef.current.pvpIncomingDmg;
      const mult = q==="perfect"?0:q==="good"?0.15:1.0;
      const finalDmg = Math.floor(inDmg * mult);
      // Trail already fired at ARRIVE — only play the result sfx+particles here
      if (q==="perfect") { sfx.parry(); triggerParticles(HR_L+HSW/2, HR_T+HSH/2, "#88ddff", 52); showHit("PARRIED!", "#44aaff"); }
      else if (q==="good") { sfx.blockHit(); triggerParticles(HR_L+HSW/2, HR_T+HSH/2, "#4488ff", 28); showHit(`BLOCKED −${finalDmg}`, "#4488ff"); }
      else { sfx.takeDmg(); triggerParticles(HR_L+HSW/2, HR_T+HSH/2, "#ff4444", 36); showHit(`HIT −${finalDmg}`, "#ff4444"); }
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
    // Pass attacker's weapon so defender QTE matches the attack type (RPG also varies every use)
    startDefendQTE(null, null, atkData.weaponId ?? null, atkData.rpgVariant ?? null);
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
    const hp  = elite ? Math.round(e.hp  * 2.5) : e.hp;
    const atk = elite ? Math.round(e.atk * 1.6) : e.atk;
    const xp  = elite ? Math.round(e.xp  * 3.0) : e.xp;
    if (node.enemy==="dragon") sfx.bossStart();
    const eSprite = node.enemy!=="dragon"
      ? (window.__forcedEnemyVariant
          ? (ENEMY_SPRITE_POOL.find(e=>e.variant===window.__forcedEnemyVariant) ?? ENEMY_SPRITE_POOL[Math.floor(Math.random()*ENEMY_SPRITE_POOL.length)])
          : ENEMY_SPRITE_POOL[Math.floor(Math.random()*ENEMY_SPRITE_POOL.length)])
      : null;
    const eName = eSprite ? eSprite.name : e.name;
    setCs({ enemy:{...e,id:node.enemy,name:eName,maxHp:hp,hp,atk,xp}, elite,
            log:[`${elite?"⚠️ ELITE — ":""}A ${eName} materialises before you!`],
            phase:"action", nodeId:node.id, nodeFloor:node.fl, enemySprite:eSprite, enemyAtkIdx:-1 });
    setEnemyFlash(false);
    setQteAnim(null);
    setScreen("combat");
  };

  /* ── Core attack resolution ──────────────────────────────── */
  const resolveAttack = (q, weapon, dmgOverride=null) => {
    const mult = q==="perfect"?1.5:q==="good"?1.0:0.3;
    const dmg  = dmgOverride!==null ? dmgOverride : Math.floor((weaponDmg(weapon)+(player?.str||0))*mult);
    // PvP routing — bypass normal combat entirely
    if (pvpModeRef.current && pvpAtkCbRef.current) {
      pvpAtkCbRef.current(q, weapon, dmg);
      return;
    }
    showHit(q==="perfect"?`PERFECT! −${dmg}`:q==="good"?`HIT −${dmg}`:`MISS −${dmg}`,
            q==="perfect"?"#44ff88":q==="good"?"#ffcc44":"#666");
    if (q!=="miss") {
      setEnemyFlash(true);
      setTimeout(()=>setEnemyFlash(false), 450);
    }

    // Pick boss attack pattern now so we can close over it in setTimeout
    const bossAtk = cs?.enemy?.id === "dragon" ? "cleave" : null; // boss is melee-only
    // Compute next attack index OUTSIDE setCs — cs.enemyAtkIdx is stable during "action" phase.
    // setTimeout must NOT be inside setCs: React 18 concurrent mode re-invokes state updaters,
    // causing a second setTimeout → double attack. Keep setCs callback pure (no side effects).
    const sprite   = cs?.enemySprite;
    const nextIdx  = ((cs?.enemyAtkIdx??-1)+1) % (sprite?.attacks?.length||1);
    if (!qteRef.current.debugMode) {
      const _defDelay = cs?.enemy?.id==="dragon" ? 300 : 880;
      const atkEntry = sprite?.attacks?.[nextIdx];
      const atkType  = atkEntry?.type;
      let defendFn;
      if (cs?.enemy?.id === "dragon" && !cs?.pvpMode) {
        // Boss always walks up and melees
        defendFn = () => startRushMeleeQTE(nextIdx);
      } else if (atkType === 'rush' && sprite?.rushApproach && !cs?.pvpMode) {
        defendFn = () => startRushMeleeQTE(nextIdx);
      } else if (atkType === 'slow_proj') {
        defendFn = () => startDefendQTE(null, 'slow');
      } else if (atkType === 'projectile' || atkType) {
        defendFn = () => startDefendQTE(null);
      } else {
        const useRush = sprite?.rushApproach && !cs?.pvpMode && Math.random() < 0.5;
        defendFn = useRush ? () => startRushMeleeQTE(nextIdx) : () => startDefendQTE(null);
      }
      clearTimeout(qteRef.current.defendTimer);
      qteRef.current.defendTimer = setTimeout(defendFn, _defDelay);
    }
    setCs(prev=>{
      if(!prev) return prev;
      const newHp  = Math.max(0, prev.enemy.hp - dmg);
      const logMsg = q==="perfect"?`⭐ ${weapon.name}: PERFECT for ${dmg}!`:
                     q==="good"   ?`${weapon.emoji} ${weapon.name} hits for ${dmg}.`:
                                   `${weapon.emoji} Glancing blow — ${dmg}.`;
      if (newHp <= 0) {
        sfx.enemyDie();
        if (prev.enemy.id === "dragon") sfx.slimeDeath();
        // Cancel the defend timer — enemy is dead, no counter-attack needed
        clearTimeout(qteRef.current.defendTimer); qteRef.current.defendTimer = null;
        setTimeout(()=>{
          setPlayer(p=>p?({...p,xp:p.xp+prev.enemy.xp,floor:p.floor+1,visited:[...p.visited,prev.nodeId]}):p);
          if (prev.enemy.id === "dragon") {
            if (gameMode === "race") {
              const won = !oppSnap?.dragonKilled;
              setIWonRace(won);
              // First to kill dragon earns the RPG; second player fights with their starter
              setPlayer(p => {
                if (!p) return p;
                const newWeapons = won ? sortWeapons([...new Set([...p.weapons, "rpg"])]) : p.weapons;
                mpSend({ type:"state", dragonKilled: true, weapon: newWeapons[0] ?? "sword" });
                return {...p, weapons: newWeapons};
              });
              setMpStatus("pvp_wait");
              setScreen("pvp_wait");
            } else {
              // Solo mode: always drop the RPG on dragon kill
              setPlayer(p => p ? {...p, weapons: sortWeapons([...new Set([...p.weapons, "rpg"])])} : p);
              setScreen("victory");
            }
            return;
          }
          setPlayer(p=>{ setRewards(pickRewards(p?.weapons||[], prev.elite)); return p; });
          setScreen("reward");
        }, 1100);
        return {...prev, enemy:{...prev.enemy,hp:0}, phase:"won", log:[...prev.log,logMsg]};
      }
      // In debug mode stay in "action" so the panel can re-launch immediately
      const nextPhase = qteRef.current.debugMode ? "action" : "enemy_turn";
      const pendingAttacks = 0;
      const nextAtkIdx = qteRef.current.debugMode ? (prev.enemyAtkIdx??0) : nextIdx;
      return {...prev, enemy:{...prev.enemy,hp:newHp}, phase:nextPhase, enemyAtkIdx:nextAtkIdx, bossAttackPattern:qteRef.current.debugMode?null:bossAtk, pendingAttacks, log:[...prev.log,logMsg]};
    });
  };

  const handleDefend = (q, suppressIndicator=false, dmgOverride=null) => {
    // PvP routing
    if (pvpModeRef.current && pvpDefCbRef.current) { pvpDefCbRef.current(q); return; }
    // Use csRef.current (always fresh) — cs from closure may be stale if called from rAF/setTimeout
    const _liveCs = csRef.current;
    const atk = (_liveCs?.enemy?.atk||0) * (_liveCs?.enemyAtkMult||1);
    const mult = q==="perfect"?0:q==="good"?.15:1.0;
    // dmgOverride: use pre-computed dmg from ARRIVE frame so shown number === HP deducted
    const dmg  = dmgOverride != null ? dmgOverride : Math.floor(atk*mult);
    if (!suppressIndicator) {
      // Projectile trail enemy → hero, then burst (only when QTE didn't already play these at ARRIVE)
      triggerProjectileTrail(ENX, GNDY-40, HR_L+HSW/2, HR_T+HSH/2, q==="miss"?"#ff4444":"#4488ff");
      if (q==="miss") triggerParticles(HR_L+HSW/2, HR_T+HSH/2, "#ff4444", 36);
      else if (q==="good") triggerParticles(HR_L+HSW/2, HR_T+HSH/2, "#4488ff", 28);
      else { triggerParticles(HR_L+HSW/2, HR_T+HSH/2, "#88ddff", 52); setTimeout(()=>triggerParticles(HR_L+HSW/2, HR_T+HSH/2, "#ffffff", 24), 80); }
      if(q==="perfect") sfx.parry(); else if(q==="good") sfx.blockHit(); else sfx.takeDmg();
    }
    // Always show result text — moved outside suppressIndicator so the FINAL correct result
    // is always displayed, even when ARRIVE already played sfx/particles.
    showHit(q==="perfect"?"PARRIED!":q==="good"?`BLOCKED −${dmg}hp`:`HIT −${dmg}hp`,
            q==="perfect"?"#44aaff":q==="good"?"#4488ff":"#ff4444");
    setPlayer(p=>{
      if(!p) return p;
      const nhp = Math.max(0, p.hp-dmg);
      if (nhp <= 0) {
        setTimeout(()=>setScreen("gameover"), 650);
        // Notify opponent in race mode so they get the win screen
        if (gameMode==="race" && !pvpModeRef.current) mpSend({ type:"state", dungeonDied: true });
      }
      return {...p, hp:nhp};
    });
    setCs(prev=>{
      if(!prev) return prev;
      const logMsg = q==="perfect"?"⚡ Perfect parry! 0 damage.":
                     q==="good"   ?`Blocked — ${dmg} through.`:
                                   `${prev.enemy.name} slams for ${dmg}!`;
      return {...prev, phase:"action", pendingAttacks:0,
        log:[...prev.log, logMsg].slice(-8)};
    });
  };

  const applyReward = (r) => {
    setPlayer(p=>{
      if(!p) return p;
      const n={...p};
      n.hp = Math.min(p.maxHp, n.hp + 10); // flat +10 HP every floor clear
      if(r.type==="heal") n.hp=Math.min(p.maxHp,n.hp+r.value);
      if(r.type==="stat"){n[r.stat]=p[r.stat]+r.value;if(r.stat==="maxHp")n.hp=p.hp+r.value;}
      if(r.type==="weapon"){
        const newW=ALL_WEAPONS[r.weaponId];
        if(newW&&!p.weapons.includes(r.weaponId)){
          const sameQte=p.weapons.find(wid=>(ALL_WEAPONS[wid]?.qteType)===newW.qteType);
          if(sameQte){
            const oldTier=TIER_ORDER[ALL_WEAPONS[sameQte]?.tier??'basic']??0;
            const newTier=TIER_ORDER[newW.tier??'basic']??0;
            if(newTier>oldTier) n.weapons=sortWeapons([...p.weapons.filter(wid=>wid!==sameQte),r.weaponId]);
            // same or lower tier → don't add
          } else {
            n.weapons=sortWeapons([...p.weapons,r.weaponId]);
          }
        }
      }
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
              if(gameMode==="race"){const won=!oppSnap?.dragonKilled;setIWonRace(won);setPlayer(p=>{if(!p)return p;const nw=won?sortWeapons([...new Set([...p.weapons,"rpg"])]):p.weapons;mpSend({type:"state",dragonKilled:true,weapon:nw[0]??"sword"});return{...p,weapons:nw};});setMpStatus("pvp_wait");setScreen("pvp_wait");}else{setPlayer(p=>p?{...p,weapons:sortWeapons([...new Set([...p.weapons,"rpg"])])}:p);setScreen("victory");}return;
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
    const beatTimeout = weapon.beatTimeout ?? BEAT_TIMEOUT;
    const ref = qteRef.current;
    ref.gen = (ref.gen||0)+1; const myGen = ref.gen; // generation stamp — stale closures bail out
    ref.done         = false;
    ref.step         = 0;          // index of next expected key (0-2)
    ref.results      = [null,null,null]; // null | "hit" | "miss" per key
    ref.hadMisinput  = false;
    ref.comboStartMs = null;
    ref.qteOpenMs    = null;
    sfx.swordWalk();
    setQteAnim({ type:"swing_beat", weapon, t:0, step:0, results:[null,null,null], qteOpenMs:null });

    setTimeout(() => {
      if (ref.done || ref.gen !== myGen) return;
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
        dmg = Math.max(1, Math.floor((weaponDmg(weapon)+(player?.str||0)) * mult));
        if (q==="perfect") sfx.swordPerfect();
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
        if (ref.done || ref.gen !== myGen) { window.removeEventListener("keydown", onKey); return; }
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
        if (ref.done || ref.gen !== myGen) return;
        ref.done = true;
        window.removeEventListener("keydown", onKey);
        const dmg = Math.max(1, Math.floor((weaponDmg(weapon)+(player?.str||0))*0.30));
        showHit("TIMEOUT −"+dmg, "#666");
        setQteAnim(null);
        setTimeout(()=>resolveAttack("miss",weapon,dmg), 60);
      }, beatTimeout);
    }, BEAT_WALK_MS);

    const walkStart = performance.now();
    const BEAT_ANIM_DUR = BEAT_WALK_MS + beatTimeout;
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
  const CHARGE_MAX_MS = 700;
  const CHARGE_PERFECT_LO = 0.72;
  const CHARGE_PERFECT_HI = 0.94;
  const startChargeQTE = (weapon) => {
    const cplo = weapon.chargePerfectLo ?? CHARGE_PERFECT_LO;
    const cphi = weapon.chargePerfectHi ?? CHARGE_PERFECT_HI;
    const ref = qteRef.current;
    ref.gen = (ref.gen||0)+1; const myGen = ref.gen;
    ref.holdStart = null; ref.released = false; ref.releaseCharge = 0;
    setQteAnim({ type:"hold_release", weapon, charge:0, released:false, releaseT:0 });

    const onDown = (e) => {
      if (ref.gen !== myGen) { window.removeEventListener("keydown",onDown); window.removeEventListener("keyup",onUp); return; }
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
      const q = c>=cplo&&c<cphi?"perfect":c>=0.50&&c<1.0?"good":"miss";
      const isOvercharge = c>=1.0;
      if (isOvercharge) {
        sfx.hammerOvercharge();
        showHit("OVERCHARGE!","#cc3322");
        setQteAnim(null);
        setTimeout(()=>resolveAttack("miss",weapon),80);
        return;
      }
      if(q==="perfect") sfx.hammerPerfect(); else if(q==="good") sfx.hammerGood();
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
      if (ref.gen !== myGen) { window.removeEventListener("keydown",onDown); window.removeEventListener("keyup",onUp); return; }
      if (e.code!=="Space"||ref.holdStart===null||ref.released) return;
      resolve(Math.min(1,(performance.now()-ref.holdStart)/CHARGE_MAX_MS));
    };
    window.addEventListener("keydown",onDown);
    window.addEventListener("keyup",onUp);

    // Live bar update
    const tick = () => {
      if (ref.released || ref.gen !== myGen) { window.removeEventListener("keydown",onDown); window.removeEventListener("keyup",onUp); return; }
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
    const rapidDurEff = weapon.rapidDur ?? RAPID_DUR;
    const ref = qteRef.current;
    ref.gen = (ref.gen||0)+1; const myGen = ref.gen;
    const tapTarget = weapon.tapTarget||8;
    ref.startMs = performance.now(); ref.taps = 0; ref.done = false; ref.lastKey = null;
    setQteAnim({ type:"rapid_tap", weapon, t:0, taps:0, tapTarget });

    // A/D alternation — press A then D then A... as fast as possible
    const onKey = (e) => {
      if (ref.done || ref.gen !== myGen) { window.removeEventListener("keydown", onKey); return; }
      const k = e.code;
      if (k!=="KeyA"&&k!=="KeyD") return;
      e.preventDefault();
      // Accept any A/D press (don't require strict alternation — just mash)
      ref.taps++;
      ref.lastKey = k;
      sfx.daggerTap();
      setQteAnim(prev=>prev?{...prev,taps:ref.taps}:null);
      if (ref.taps>=tapTarget) {
        ref.done=true;
        window.removeEventListener("keydown",onKey);
        sfx.daggerFlurry();
        // 6 taps = beat-perfect (1.5x); 8 taps = +0.25x bonus = 1.75x
        const _t = ref.taps;
        const _fMult = _t>=8 ? 1.75 : _t>=6 ? 1.5+(_t-6)/2*0.25 : 0.30+_t/6*1.20;
        const _dmg = Math.max(1,Math.floor((weaponDmg(weapon)+(player?.str||0))*_fMult));
        showHit("PERFECT!", "#44ff88");
        setQteAnim(null);
        setTimeout(()=>resolveAttack("perfect",weapon,_dmg), 80);
      }
    };
    window.addEventListener("keydown",onKey);

    const tick = () => {
      if (ref.done || ref.gen !== myGen) { window.removeEventListener("keydown",onKey); return; }
      const t = Math.min(1,(performance.now()-ref.startMs)/rapidDurEff);
      setQteAnim(prev=>prev?{...prev,t}:null);
      if (t<1) { requestAnimationFrame(tick); return; }
      window.removeEventListener("keydown",onKey);
      ref.done = true;
      const taps = ref.taps;
      const q = taps>=6?"perfect":taps>=3?"good":"miss";
      // 6 taps = beat-perfect (1.5x); 8 taps = 1.75x; linear between anchors
      const fMult = taps>=8 ? 1.75
                  : taps>=6 ? 1.5+(taps-6)/2*0.25
                  : taps>=1 ? 0.30+taps/6*1.20
                  : 0.30;
      const dmg = Math.max(1,Math.floor((weaponDmg(weapon)+(player?.str||0))*fMult));
      showHit(q==="perfect"?"PERFECT!":q==="good"?`GOOD! x${taps}`:`WEAK x${taps}`,
              q==="perfect"?"#44ff88":q==="good"?"#ffcc44":"#666");
      setQteAnim(null);
      setTimeout(()=>resolveAttack(q,weapon,dmg), 80);
    };
    requestAnimationFrame(tick);
  };

  // ── POKE: charge at enemy, spam ANY key as fast as possible ──
  const POKE_DUR = 2200;
  const POKE_TARGET = 22;
  // Keys to ignore (non-character / navigation keys)
  const POKE_IGNORE = new Set(["Escape","Tab","CapsLock","Shift","Control","Alt","Meta",
    "Enter","Backspace","Delete","Insert","Home","End","PageUp","PageDown",
    "ArrowUp","ArrowDown","ArrowLeft","ArrowRight","ContextMenu","NumLock","ScrollLock","Pause"]);
  const startPokeQTE = (weapon) => {
    const pokeDurEff  = weapon.pokeDur  ?? POKE_DUR;
    const pokeTargEff = weapon.pokeTarg ?? POKE_TARGET;
    const ref = qteRef.current;
    ref.gen = (ref.gen||0)+1; const myGen = ref.gen;
    ref.startMs = performance.now();
    ref.inputs = 0; ref.done = false; ref.lastKey = null;
    setQteAnim({ type:"poke", weapon, t:0, inputs:0, tapTarget:pokeTargEff });

    const onKey = (e) => {
      if (ref.done || ref.gen !== myGen) { window.removeEventListener("keydown",onKey); return; }
      if (e.repeat) return;
      if (POKE_IGNORE.has(e.key) || e.key.startsWith("F")) return;
      e.preventDefault();
      sfx.pokeTap(ref.inputs);
      ref.inputs++;
      ref.lastKey = e.key.length === 1 ? e.key.toUpperCase() : e.code.replace("Key","");
      setQteAnim(prev=>prev?{...prev,inputs:ref.inputs,lastKey:ref.lastKey}:null);
      if (ref.inputs>=pokeTargEff) {
        ref.done=true;
        window.removeEventListener("keydown",onKey);
        clearTimeout(ref.pokeTimer);
        setQteAnim(null);
        setTimeout(()=>resolveAttack("perfect",weapon),80);
      }
    };
    window.addEventListener("keydown",onKey);

    ref.pokeTimer = setTimeout(()=>{
      if (!ref.done && ref.gen === myGen) {
        ref.done=true;
        window.removeEventListener("keydown",onKey);
        const ratio = ref.inputs/pokeTargEff;
        const q = ratio>=.85?"perfect":ratio>=.5?"good":"miss";
        const dmg = Math.max(1,Math.floor((weaponDmg(weapon)+(player?.str||0))*ratio*1.8));
        setQteAnim(null);
        setTimeout(()=>resolveAttack(q,weapon,Math.max(1,dmg)),80);
      }
    },pokeDurEff);

    const tick = ()=>{
      if (ref.done || ref.gen !== myGen) return;
      const t = Math.min(1,(performance.now()-ref.startMs)/pokeDurEff);
      setQteAnim(prev=>prev?{...prev,t}:null);
      if (t<1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  // ── ARCHERY: moving dot on target, press SPACE when near center ──
  const ARCHERY_DUR = 4500;
  const ARCHERY_DOTS = 3;
  const startArcheryQTE = (weapon) => {
    const archeryDurEff = weapon.archDur ?? ARCHERY_DUR;
    const ref = qteRef.current;
    ref.gen = (ref.gen||0)+1; const myGen = ref.gen;
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
      if (ref.done || ref.gen !== myGen) { window.removeEventListener("keydown",onKey); return; }
      if (e.code!=="Space") return;
      e.preventDefault();
      const idx = ref.shotsFired;
      if (idx >= ARCHERY_DOTS) return;
      // Lock the active dot at current position
      const d = ref.dots[idx];
      const dist = Math.sqrt(d.x*d.x+d.y*d.y);
      // Thresholds aligned with visual rings: bullseye r=R*0.16 → dist≈0.18; inner ring r=R*0.38 → dist≈0.42
      const q = dist<0.18?"perfect":dist<0.42?"good":"miss";
      const dmgMult = dist<0.18?1.6:dist<0.42?1.0:0.3;
      const dmg = Math.max(1,Math.floor((weaponDmg(weapon)+(player?.str||0))*dmgMult));
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

    let _archLastRender = 0;
    const tick = ()=>{
      if (ref.done || ref.gen !== myGen) { window.removeEventListener("keydown",onKey); return; }
      const elapsed = performance.now()-ref.startMs;
      const t = Math.min(1,elapsed/archeryDurEff);
      const tSec = elapsed/1000;
      ref.dots.forEach(d=>{
        // Radius pulses 0→1→0, so dot passes through center once per pulseFreq cycle
        const r     = (Math.sin(tSec*d.pulseFreq*Math.PI*2+d.pulsePhase)+1)*0.5;
        const angle = tSec*d.spinFreq*Math.PI*2+d.spinPhase;
        d.x = r*Math.cos(angle);
        d.y = r*Math.sin(angle);
      });
      // Throttle render updates to ~45fps — dot positions update in ref, render catches up
      const now2 = performance.now();
      if (now2-_archLastRender >= 22) {
        _archLastRender = now2;
        setQteAnim(prev=>prev?{...prev,t,dots:ref.dots.map(d=>({x:d.x,y:d.y}))}:null);
      }
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
      showHit(q==="perfect"?"PERFECT!":q==="good"?"GOOD!":"MISS!", q==="perfect"?"#44ff88":q==="good"?"#ffcc44":"#666");
      setQteAnim(null);
      setTimeout(()=>resolveAttack(q,weapon,dmg), 80);
    };
    requestAnimationFrame(tick);
  };

  // ── SEQUENCE: WASD + arrow direction keys, 8 runes, 4s, damage by correct count ──
  const SEQ_DUR = 4000;
  const ALL_KEYS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  // All wand/staff/scepter sequence QTEs use 8 directional keys — much more readable than A-Z
  const WAND_KEYS = ["W","A","S","D","↑","↓","←","→"];
  const startSequenceQTE = (weapon) => {
    const seqDurEff = weapon.seqDur ?? SEQ_DUR;
    const ref = qteRef.current;
    ref.gen = (ref.gen||0)+1; const myGen = ref.gen;
    const len = Math.max(4, weapon.seqLength||8);
    const seq = Array.from({length:len},()=>WAND_KEYS[Math.floor(Math.random()*WAND_KEYS.length)]);
    ref.seq = seq; ref.input = []; ref.correctCount = 0; ref.done = false; ref.startMs = performance.now();
    castStartRef.current = ref.startMs; // real start timestamp for accurate timer
    setCastTick(0); // drives re-renders every 30ms; elapsed computed from castStartRef
    setQteAnim({ type:"sequence", weapon, t:0, seq, input:[], correctCount:0, badKey:false });

    const onKey = (e) => {
      if (ref.done || ref.gen !== myGen) { window.removeEventListener("keydown",onKey); return; }
      // Map arrow keys to arrow symbols; accept WASD or arrows only
      const k = e.key==="ArrowUp"?"↑":e.key==="ArrowDown"?"↓":e.key==="ArrowLeft"?"←":e.key==="ArrowRight"?"→":e.key.toUpperCase();
      if (!WAND_KEYS.includes(k)) return;
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
        const c = ref.correctCount;
        const q = c>=4?"perfect":c>=2?"good":"miss";
        // 4 correct = beat-perfect (1.5x); 8 correct = +0.75x bonus = 2.25x; linear between anchors
        const seqMult = c>=8 ? 2.25
                      : c>=4 ? 1.5 + (c-4)/4*0.75
                      : c>=1 ? 0.30 + c/4*1.20
                      : 0.30;
        const dmg = Math.max(1,Math.floor((weaponDmg(weapon)+(player?.str||0))*seqMult));
        fireMagicBolt(q, dmg, weapon);
      } else {
        setQteAnim(prev=>prev?{...prev,input:ref.input,correctCount:ref.correctCount,badKey:!correct}:null);
        if (!correct) setTimeout(()=>setQteAnim(prev=>prev?{...prev,badKey:false}:null),200);
      }
    };
    window.addEventListener("keydown",onKey);

    ref.seqTimer = setTimeout(()=>{
      if (!ref.done && ref.gen === myGen) {
        ref.done=true;
        window.removeEventListener("keydown",onKey);
        const c = ref.correctCount;
        const q = c>=4?"perfect":c>=2?"good":"miss";
        const seqMult = c>=8 ? 2.25
                      : c>=4 ? 1.5 + (c-4)/4*0.75
                      : c>=1 ? 0.30 + c/4*1.20
                      : 0.30;
        const dmg = Math.max(1,Math.floor((weaponDmg(weapon)+(player?.str||0))*seqMult));
        fireMagicBolt(q, dmg, weapon);
      }
    }, seqDurEff);

    const tick = () => {
      if (ref.done || ref.gen !== myGen) return;
      const t = Math.min(1,(performance.now()-ref.startMs)/seqDurEff);
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
    const stompDurEff     = weapon.stompDur ?? STOMP_DUR;
    const stompApproachEff = Math.round(stompDurEff * LAND_FRAC);
    // Use crop dims when set (eliminates transparent padding from size calc)
    const dims = cs?.enemySprite
      ? {w:(cs.enemySprite.cropW||cs.enemySprite.frameW), h:(cs.enemySprite.cropH||cs.enemySprite.frameH)}
      : (ENEMY_DIMS[cs?.enemy?.id]||{w:55,h:70});
    const eScale = 1.1;
    const eScaledH = dims.h * eScale;
    const stompGroundPad = cs?.enemySprite?.groundPad || 0;
    // headPad: after cropY is applied the frame top moves down, shrinking effective transparent gap.
    const headPad = cs?.enemySprite
      ? (Math.max(0, (cs.enemySprite.headPad||0) - (cs.enemySprite.cropY||0)) * eScale)
      : 0;
    // landTop: hero overlaps enemy body — sinks in so models appear close together
    const STOMP_OVERLAP = 30; // px hero sinks below enemy head for visual contact
    const landTop  = Math.max(5, GNDY - eScaledH + headPad - HSH + stompGroundPad + STOMP_OVERLAP);
    const landLeft = ENX - HSW/2 + Math.round((cs?.enemySprite?.centerOffsetX||0) * eScale);
    const ref = qteRef.current;
    ref.gen = (ref.gen||0)+1; const myGen = ref.gen;
    ref.landLeft = landLeft; ref.landTop = landTop;
    let totalDmg = 0;

    const returnHome = (cb) => {
      if (ref.gen !== myGen) return;
      const start = performance.now();
      setQteAnim({ type:"stomp_return", weapon, t:0 });
      const tick = () => {
        if (ref.gen !== myGen) { setQteAnim(null); return; }
        const rt = Math.min(1,(performance.now()-start)/300);
        setQteAnim(prev=>prev?{...prev,t:rt}:null);
        if (rt<1) { requestAnimationFrame(tick); return; }
        setQteAnim(null); cb();
      };
      requestAnimationFrame(tick);
    };

    const doContact = (contactNum, onDone) => {
      if (ref.gen !== myGen) return;
      const jumpStart = performance.now();
      ref.pressMs = null; ref.flashDone = false;
      // Contact 0 = approach only (short); contact 1 = full bounce arc
      const dur = contactNum===0 ? stompApproachEff : stompDurEff;
      if(contactNum===0) sfx.stompApproach(); else sfx.stompBounce();
      setQteAnim({ type:"stomp", weapon, t:0, bounce:contactNum });

      const onKey = (e) => {
        if (ref.gen !== myGen) { window.removeEventListener("keydown",onKey); return; }
        if (e.code!=="Space"||ref.pressMs!==null) return;
        e.preventDefault(); ref.pressMs = performance.now();
      };
      window.addEventListener("keydown",onKey);

      const tick = () => {
        if (ref.gen !== myGen) { window.removeEventListener("keydown",onKey); return; }
        const t = Math.min(1,(performance.now()-jumpStart)/dur);
        setQteAnim(prev=>prev?{...prev,t,bounce:contactNum}:null);
        // Flash just before landing (t~0.92 for both contacts)
        const flashAt = 0.92;
        if (t>=flashAt&&!ref.flashDone) {
          ref.flashDone=true;
          const sid = Date.now();
          setStompImpact({ x: ENX, y: (ref.landTop||0) + HSH, quality:"hit", id: sid });
          setTimeout(()=>setStompImpact(s=>s?.id===sid?null:s), 550);
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

    const dmgFor = q => Math.floor((weaponDmg(weapon)+(player?.str||0))*(q==="perfect"?2.0:q==="good"?1.0:0.25));

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
        const sid2 = Date.now();
        setStompImpact({ x: ENX, y: (ref.landTop||0) + HSH, quality: best, id: sid2 });
        setTimeout(()=>setStompImpact(s=>s?.id===sid2?null:s), best==="perfect"?900:650);
        showHit(best==="perfect"?`PERFECT! −${totalDmg}`:`GOOD! −${totalDmg}`, best==="perfect"?"#44ff88":"#ffcc44");
        returnHome(()=>resolveAttack(best,weapon,totalDmg));
      });
    });
  };

  // ── RPG ROCKET: fires massive rocket after sequence_reveal QTE ──
  // Speed is randomized per launch — unpredictable, adds tension.
  const RPG_SPEEDS = [280, 380, 520, 680, 850, 420, 600, 320, 760, 480];
  const fireRPGRocket = (q, dmg, weapon, correctCount=0) => {
    sfx.rpgLaunch();
    const start = performance.now();
    const ROCKET_DUR = RPG_SPEEDS[Math.floor(Math.random() * RPG_SPEEDS.length)];
    const rocketLevel = correctCount<=4?0:correctCount<=7?1:correctCount<=9?2:3;
    setQteAnim({ type:"rpg_rocket", weapon, t:0, q, rocketLevel });
    const tick = () => {
      const t = Math.min(1,(performance.now()-start)/ROCKET_DUR);
      setQteAnim(prev=>prev?{...prev,t}:null);
      if (t<1) { requestAnimationFrame(tick); return; }
      sfx.rpgImpact();
      const isP = q==="perfect";
      showHit(isP?`DIRECT HIT! −${dmg}`:q==="good"?`HIT −${dmg}`:`MISS −${dmg}`,
              isP?"#ff6622":q==="good"?"#ffaa22":"#666", isP);
      setQteAnim(null);
      setTimeout(()=>resolveAttack(q,weapon,dmg),80);
    };
    requestAnimationFrame(tick);
  };

  // ── SEQUENCE REVEAL (RPG): 2×5 grid — target jumps & ALL remaining keys reshuffle on each correct press ──
  // The reshuffle prevents the player reading ahead. Max 200 dmg. -5% per miss/incomplete. Min 30%.
  const startRPGQTE = (weapon) => {
    const ref = qteRef.current;
    ref.gen = (ref.gen||0)+1; const myGen = ref.gen;
    const len = weapon.seqLength || 10;
    const SEQ_DUR_RPG = weapon.seqDur ?? SEQ_DUR;
    const genKey = () => ALL_KEYS[Math.floor(Math.random()*ALL_KEYS.length)];
    const seq = Array.from({length:len}, genKey);
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
      if (ref.done || ref.gen !== myGen) { window.removeEventListener("keydown", onKey); return; }
      const k = e.key.toUpperCase();
      if (!/^[A-Z]$/.test(k)) return;
      e.preventDefault();
      const currentKey = ref.seq[ref.targetIdx];
      if (k === currentKey) {
        sfx.rpgSequenceKey();
        ref.doneSet.add(ref.targetIdx);
        if (ref.doneSet.size >= len) {
          ref.done = true;
          window.removeEventListener("keydown", onKey);
          clearTimeout(ref.rpgTimer);
          const dmg = Math.round(200 * Math.max(0.30, 1 - ref.missCount * 0.05));
          fireRPGRocket("perfect", dmg, weapon, ref.doneSet.size);
        } else {
          // Pick new random target from remaining slots
          const remaining = [];
          for (let i=0; i<len; i++) if (!ref.doneSet.has(i)) remaining.push(i);
          ref.targetIdx = remaining[Math.floor(Math.random()*remaining.length)];
          // Reshuffle ALL remaining (non-done) slots so player can't read ahead
          for (const i of remaining) ref.seq[i] = genKey();
          // Make sure the new target's key isn't the same as whatever the player just pressed
          if (ref.seq[ref.targetIdx] === k) ref.seq[ref.targetIdx] = genKey();
          setQteAnim(prev=>prev?{...prev,
            seq:[...ref.seq], targetIdx:ref.targetIdx, doneIndices:[...ref.doneSet], badKey:false}:null);
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
      if (!ref.done && ref.gen === myGen) {
        ref.done = true;
        window.removeEventListener("keydown", onKey);
        const incomplete = len - ref.doneSet.size;
        const dmg = Math.round(200 * Math.max(0.30, 1 - (ref.missCount + incomplete) * 0.05));
        // RPG never misses — only does less damage. Minimum "good" so PvP always sends the attack.
        const q = ref.doneSet.size >= len*0.75 ? "perfect" : "good";
        fireRPGRocket(q, dmg, weapon, ref.doneSet.size);
      }
    }, SEQ_DUR_RPG);

    const tick = () => {
      if (ref.done || ref.gen !== myGen) return;
      const t = Math.min(1,(performance.now()-ref.startMs)/SEQ_DUR_RPG);
      setQteAnim(prev=>prev?{...prev,t}:null);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  // ── DUAL ACTION: hold A+W+D simultaneously, then left-click when dot centers ──
  const DUAL_DUR = 3500; // ms total window
  const startDualActionQTE = (weapon) => {
    const ref = qteRef.current;
    ref.gen = (ref.gen||0)+1; const myGen = ref.gen;
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
      // Full center zone = perfect; up to 2× zone width = good; beyond = miss
      const q = dist < half ? "perfect" : dist < half * 2.2 ? "good" : "miss";
      const base = (weapon.baseDmg + (player?.str||0)) * (q==="perfect"?2.0:q==="good"?1.0:0.3);
      const dmg  = Math.max(1, Math.floor(base * Math.max(0.3, 1 - ref.dropCount*0.18)));
      setQteAnim(null);
      resolveAttack(q, weapon, dmg);
    };

    const onKeyDown = (e) => {
      if (ref.done || ref.gen !== myGen) { window.removeEventListener("keydown",onKeyDown); window.removeEventListener("keyup",onKeyUp); return; }
      const k = {a:"a",A:"a",w:"w",W:"w",d:"d",D:"d"}[e.key];
      if (!k) return;
      e.preventDefault();
      ref.keysHeld[k] = true;
    };

    const onKeyUp = (e) => {
      if (ref.done || ref.gen !== myGen) { window.removeEventListener("keydown",onKeyDown); window.removeEventListener("keyup",onKeyUp); return; }
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
      if (e.button !== 0 || ref.done || ref.gen !== myGen) return;
      e.preventDefault();
      sfx.dualClick();
      resolve(ref.dotPos);
    };

    const tick = () => {
      if (ref.done || ref.gen !== myGen) { cleanup(); return; }
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
    gorgon_slow:   { dur:3400, launch:0.06, arrive:0.90, projPath:"zigzag"      }, // Gorgon ATK3 — cursed serpent curse, crawls across screen
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
  const startDefendQTE = (bossAtkPattern = null, variant = null, pvpWeaponId = null, pvpRpgVariant = null) => {
    const ref = qteRef.current;
    // Cancel any pending second timer the moment a QTE starts — prevents stale timers
    // from firing mid-QTE and scheduling a duplicate attack.
    clearTimeout(ref.defendTimer); ref.defendTimer = null;
    ref.gen = (ref.gen||0)+1; const myGen = ref.gen;
    const isPvp = cs?.pvpMode && cs?.enemy?.id === "pvp_opp";
    let prof, projType;
    if (variant === 'slow') {
      prof = DEFEND_PROFILES.gorgon_slow;
      projType = null;
    } else if (isPvp) {
      const oppWepId = pvpWeaponId ?? cs?.enemy?.pvpWeapons?.[0] ?? "sword";
      if (oppWepId === "rpg" && pvpRpgVariant != null) {
        // RPG: every launch uses a different pattern — use attacker-sent variant index
        prof = RPG_DEFEND_VARIANTS[pvpRpgVariant % RPG_DEFEND_VARIANTS.length];
        projType = "sequence_reveal"; // rocket sprite
      } else {
        const oppWep = ALL_WEAPONS[oppWepId] ?? ALL_WEAPONS.sword;
        projType = oppWep.qteType || "swing_beat";
        prof = PVP_PROJ_PROFILES[projType] || { dur:1100, launch:0.20, arrive:0.82 };
      }
    } else {
      const profKey = cs?.enemy?.id==="dragon" && bossAtkPattern==="charge"
        ? "dragon_charge" : cs?.enemy?.id;
      prof = DEFEND_PROFILES[profKey] || { dur:1200, launch:0.28, arrive:0.82 };
      projType = null; // use legacy enemy-id sprite
    }
    const { dur, launch, arrive } = prof;
    ref.startMs = performance.now(); ref.pressT = null; ref.done = false;
    ref.defendArrive = arrive; // store so showDefendCue can use it
    setCs(prev=>prev?{...prev,phase:"defending"}:prev);
    setQteAnim({ type:"defend", t:0, projFrac:0, arrive, projPath: prof.projPath||"straight", projType, bossAttackPattern: bossAtkPattern });
    triggerEnemyWindUp();

    ref._defArrivedShown = false; // guard: show indicator once at impact

    const onKey = (e) => {
      if (ref.gen !== myGen) { window.removeEventListener("keydown",onKey); return; }
      if (e.code!=="Space"||ref.pressT!==null) return;
      // Window closes at ARRIVE — pressing after the projectile hits always = miss
      const tNow = (performance.now()-ref.startMs)/dur;
      if (tNow >= arrive) return;
      e.preventDefault();
      ref.pressT = tNow;
      // no immediate text — result shown at arrive
    };
    window.addEventListener("keydown",onKey);

    ref.projSoundPlayed = false; ref._defLastRender = 0;
    const tick = () => {
      const now2 = performance.now();
      const t = Math.min(1,(now2-ref.startMs)/dur);
      // Resolution always runs at t=1 regardless of gen — prevents missed damage when timers
      // fire between the indicator frame (t>=arrive) and the resolution frame (t=1).
      if (t >= 1) {
        window.removeEventListener("keydown",onKey);
        if (!ref.done) {
          ref.done = true;
          const d = ref.pressT!=null ? Math.abs(ref.pressT-arrive) : 99;
          setQteAnim(null);
          handleDefend(d<.055?"perfect":d<.14?"good":"miss", true); // suppressIndicator
        }
        return;
      }
      // Gen guard only applies to animation frames — not to resolution
      if (ref.done || ref.gen !== myGen) { window.removeEventListener("keydown",onKey); return; }
      const projFrac = t < launch ? 0
        : Math.min(1,(t-launch)/(arrive-launch));
      if(t>=launch&&!ref.projSoundPlayed){ref.projSoundPlayed=true;sfx.projLaunch();}
      if (now2-ref._defLastRender >= 22) { // ~45fps cap
        ref._defLastRender = now2;
        setQteAnim(prev=>prev?{...prev,t,projFrac,arrive}:null);
      }
      // Fire damage indicator exactly when projectile arrives
      if (!ref._defArrivedShown && t >= arrive) {
        ref._defArrivedShown = true;
        const _d = ref.pressT!=null ? Math.abs(ref.pressT-arrive) : 99;
        const _q = _d<.055 ? "perfect" : _d<.14 ? "good" : "miss";
        // In PvP mode pvpDefCbRef owns all result sfx/particles — only fire the trail here
        // so the projectile visually "lands". In solo mode fire the full indicator set.
        triggerProjectileTrail(ENX, GNDY-40, HR_L+HSW/2, HR_T+HSH/2, _q==="miss"?"#ff4444":"#4488ff");
        if (!pvpModeRef.current) {
          if (_q==="miss") triggerParticles(HR_L+HSW/2, HR_T+HSH/2, "#ff4444", 36);
          else if (_q==="good") triggerParticles(HR_L+HSW/2, HR_T+HSH/2, "#4488ff", 28);
          else { triggerParticles(HR_L+HSW/2, HR_T+HSH/2, "#88ddff", 52); setTimeout(()=>triggerParticles(HR_L+HSW/2, HR_T+HSH/2, "#ffffff", 24), 80); }
          if (_q==="perfect") sfx.parry(); else if (_q==="good") sfx.blockHit(); else sfx.takeDmg();
        }
        // showHit intentionally omitted — handleDefend/pvpDefCbRef at t=1 shows the definitive result
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  /* ── Rush Melee QTE ─────────────────────────────────────── */
  // Enemy runs/walks to hero, plays strike animation, player times SPACE to block
  const startRushMeleeQTE = (atkIdx = null) => {
    if (cs?.pvpMode) { startDefendQTE(); return; }
    const isBoss = cs?.enemy?.id === "dragon";
    const sprite = cs?.enemySprite;
    if (!isBoss && !sprite?.rushApproach) { startDefendQTE(); return; } // fallback if no rush data
    const _rushAtkIdx = atkIdx ?? cs?.enemyAtkIdx ?? 0;

    const ref = qteRef.current;
    // Cancel any pending timer the moment this QTE starts — prevents duplicate attacks.
    clearTimeout(ref.defendTimer); ref.defendTimer = null;
    ref.gen = (ref.gen||0)+1; const myGen = ref.gen;

    // Timeline fractions (all over DUR ms):
    //   0 → WALK_END      : enemy approaches (walk/run anim)
    //   WALK_END → ATK_END: enemy strikes (strike anim), parry window at hit frame
    //   ATK_END → 1.0     : enemy retreats
    const DUR      = 3000; // ms total — longer gives strike anim room to breathe
    const WALK_END = 0.40;
    const ATK_END  = 0.82;
    // ARRIVE = moment the hit frame actually plays — computed from sprite data
    // Boss: use ENEMY_DIMS.dragon.hitFrame/hitFps (editable from frame editor)
    const _strikeAnim  = isBoss ? null : getRushStrike(sprite, _rushAtkIdx);
    const strikeFps    = isBoss ? (ENEMY_DIMS.dragon?.hitFps ?? 12)   : (_strikeAnim?.fps    ?? 12);
    const hitFrameIdx  = isBoss ? (ENEMY_DIMS.dragon?.hitFrame ?? 3)  : (_strikeAnim?.hitFrame ?? 3);
    const strikePhaseMs = (ATK_END - WALK_END) * DUR;         // ms allocated for strike
    const hitFrameMs   = Math.min((hitFrameIdx / strikeFps) * 1000, strikePhaseMs * 0.92);
    const ARRIVE   = WALK_END + hitFrameMs / DUR;
    const WINDOW   = 0.07; // half-window for "good" block (~210ms total window)

    ref.startMs = performance.now(); ref.pressT = null; ref.done = false; ref._rushLastRender = 0;
    setCs(prev => prev ? {...prev, phase:"defending"} : prev);
    setQteAnim({ type:"rush_melee", t:0, walkEnd:WALK_END, attackEnd:ATK_END, arrive:ARRIVE, hitWindow:WINDOW, rushPhase:"approach", atkIdx:_rushAtkIdx });

    ref._arrivedShown = false; // guard: show indicator exactly once at hit frame

    const onKey = (e) => {
      if (ref.gen !== myGen) { window.removeEventListener("keydown", onKey); return; }
      if (e.code !== "Space" || ref.pressT !== null) return;
      // Window closes at ARRIVE — pressing after the hit frame always = miss
      const tNow = (performance.now() - ref.startMs) / DUR;
      if (tNow >= ARRIVE) return;
      e.preventDefault();
      ref.pressT = tNow;
      // no immediate feedback on keypress — result shown at ARRIVE
    };
    window.addEventListener("keydown", onKey);

    const tick = () => {
      const now2 = performance.now();
      const t = Math.min(1, (now2 - ref.startMs) / DUR);
      // Resolution always runs at t=1 regardless of gen — prevents missed damage when a timer
      // fires between the indicator frame (t>=ARRIVE) and the resolution frame (t=1).
      if (t >= 1) {
        window.removeEventListener("keydown", onKey);
        if (!ref.done) {
          ref.done = true;
          const d = ref.pressT != null ? Math.abs(ref.pressT - ARRIVE) : 99;
          setQteAnim(null);
          handleDefend(d < WINDOW * 0.5 ? "perfect" : d < WINDOW ? "good" : "miss", true, ref.arrivedDmg ?? null); // suppressIndicator; pass locked dmg
        }
        return;
      }
      // Gen guard only applies to animation frames — not to the resolution block above
      if (ref.done || ref.gen !== myGen) { window.removeEventListener("keydown", onKey); return; }
      const rushPhase = t < WALK_END ? "approach" : t < ATK_END ? "strike" : "retreat";
      if (now2 - ref._rushLastRender >= 20) {
        ref._rushLastRender = now2;
        setQteAnim(prev => prev ? {...prev, t, rushPhase} : null);
      }
      // Fire damage/parry indicator exactly at the hit frame (ARRIVE)
      if (!ref._arrivedShown && t >= ARRIVE) {
        ref._arrivedShown = true;
        const _atk = (csRef.current?.enemy?.atk||0) * (csRef.current?.enemyAtkMult||1);
        const _d   = ref.pressT != null ? Math.abs(ref.pressT - ARRIVE) : 99;
        const _q   = _d < WINDOW*0.5 ? "perfect" : _d < WINDOW ? "good" : "miss";
        const _dmg = Math.floor(_atk * (_q==="perfect"?0:_q==="good"?.15:1.0));
        ref.arrivedDmg = _dmg; // lock in — t=1 resolution uses this so shown number === HP deducted
        triggerProjectileTrail(ENX, GNDY-40, HR_L+HSW/2, HR_T+HSH/2, _q==="miss"?"#ff4444":"#4488ff");
        if (!pvpModeRef.current) {
          if (_q==="miss") triggerParticles(HR_L+HSW/2, HR_T+HSH/2, "#ff4444", 36);
          else if (_q==="good") triggerParticles(HR_L+HSW/2, HR_T+HSH/2, "#4488ff", 28);
          else { triggerParticles(HR_L+HSW/2, HR_T+HSH/2, "#88ddff", 52); setTimeout(()=>triggerParticles(HR_L+HSW/2, HR_T+HSH/2, "#ffffff", 24), 80); }
          if (_q==="perfect") sfx.parry();
          else if (_q==="good") sfx.blockHit(); else sfx.takeDmg();
        }
        // showHit intentionally omitted — handleDefend/pvpDefCbRef at t=1 shows the definitive result
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  // Debug globals — updated every render so closures stay fresh
  window.__startEnemyAtk = (n) => {
    const sprite = cs?.enemySprite;
    const nAtk   = sprite?.attacks?.length || 1;
    const idx    = ((n ?? 0) % nAtk + nAtk) % nAtk;
    const atkType = sprite?.attacks?.[idx]?.type;
    setCs(prev => prev ? {...prev, enemyAtkIdx: idx} : prev);
    if (atkType === 'rush' && sprite?.rushApproach) startRushMeleeQTE();
    else if (atkType === 'slow_proj')              startDefendQTE(null, 'slow');
    else                                           startDefendQTE(null);
  };
  window.__cancelQTE = () => {
    qteRef.current.gen  = (qteRef.current.gen || 0) + 1;
    qteRef.current.done = true;
    if (qteRef.current.defendTimer) { clearTimeout(qteRef.current.defendTimer); qteRef.current.defendTimer = null; }
    setQteAnim(null);
    setCs(prev => prev ? {...prev, phase:'action'} : prev);
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
        // Paper Mario arc: full quadratic bezier from hero home → apex → enemy head
        const lL = ref.landLeft||0, lT = ref.landTop||0;
        const left = HR_L + (lL - HR_L) * easeIO(t);
        // Control point: high above midpoint for dramatic arc
        const APEX_H = 140; // px above straight-line midpoint
        const midY   = (HR_T + lT) / 2;
        const P1     = midY - APEX_H;
        // Quadratic bezier: (1-t)²·P0 + 2(1-t)t·P1 + t²·P2
        const top    = (1-t)*(1-t)*HR_T + 2*(1-t)*t*P1 + t*t*lT;
        return { left, top };
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
        // Wind-up bob during beat phase — upward only so feet never clip below ground
        const bFrac = (t-WALK_END)/(RETURN_START-WALK_END);
        const bob = Math.sin(bFrac*Math.PI*6)*(-4); // negative = upward
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
        // Phase 1 (0→0.18): run up to enemy
        const RT_APPROACH = 0.18;
        const RT_X = STRIKE_L + 8;
        if (t <= RT_APPROACH) {
          return { left: HR_L + (RT_X - HR_L) * easeIO(t / RT_APPROACH), top: HR_T };
        }
        // Phase 2: vibrate up/down at enemy — amplitude grows with tap progress
        const taps = qteAnim.taps || 0;
        const tapTarget = qteAnim.tapTarget || 8;
        const vibFrac = (t - RT_APPROACH) / (1 - RT_APPROACH);
        const amp = 2 + Math.min(taps / tapTarget, 1) * 7; // 2px → 9px as taps fill
        const vibY = Math.sin(vibFrac * Math.PI * 20) * amp;
        return { left: RT_X, top: HR_T + vibY };
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
        // Hero stays at home position — no offset to prevent snap at QTE end
        return { left: HR_L, top: HR_T };
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
  // Rush melee: enemy slides right toward hero, then retreats.
  // RUSH_DIST is per-enemy so every sprite's right edge lands at the same X (HR_L - 8),
  // giving a consistent parry position regardless of sprite width.
  const enemyRushOffset = (() => {
    if (!qteAnim || qteAnim.type !== "rush_melee") return 0;
    const { t, walkEnd=0.40, attackEnd=0.82 } = qteAnim;
    const _erW = (() => {
      if (cs?.enemy?.id === "dragon") return ENEMY_DIMS.dragon.w * 1.1;
      const _sp = cs?.enemySprite;
      if (_sp) return (_sp.cropW || _sp.frameW || 64) * 1.1;
      return (ENEMY_DIMS[cs?.enemy?.id]?.w || 64) * 1.1;
    })();
    // enemy right edge = ENX + _erW/2 + RUSH_DIST → target HR_L - 8
    const RUSH_DIST = Math.max(50, Math.round(HR_L - 8 - _erW / 2 - ENX));
    if (t < walkEnd) return RUSH_DIST * easeIO(t / walkEnd);
    if (t < attackEnd) return RUSH_DIST;
    return RUSH_DIST * (1 - easeIO((t - attackEnd) / (1 - attackEnd)));
  })();

  const showDust      = qteAnim?.type==="stomp"&&qteAnim.t>=0.90&&qteAnim.t<=1.0; // dust at actual visual landing
  const _defArrive    = qteAnim?.arrive ?? 0.82;
  const showDefendCue = qteAnim?.type==="defend"&&qteAnim.t>=(_defArrive-.07)&&qteAnim.t<=(_defArrive+.04);

  const QTE_LABEL = { swing_beat:"BEAT", rapid_tap:"FLURRY", hold_release:"CHARGE", sequence:"CAST", stomp:"STOMP", poke:"POKE", archery:"AIM", sequence_reveal:"LAUNCH", dual_action:"DUAL" };

  // ── PvP per-QTE projectile path function ──
  // Returns {x,y} in battlefield coords for projType at fraction t (0→1)
  const pvpProjPos = (projType, t, srcX, srcY, dstX, dstY) => {
    const lerp = (a,b,f) => a+(b-a)*f;
    let x, y;
    switch(projType) {
      case "swing_beat": // sword — diagonal slash arc, curves downward on approach
        x = lerp(srcX, dstX, t);
        y = lerp(srcY, dstY, t) + Math.sin(t * Math.PI) * 28;
        break;
      case "hold_release": // hammer — massive overhead parabola, slams from above
        x = lerp(srcX, dstX, t);
        y = lerp(srcY, dstY, t) - Math.sin(t * Math.PI) * 110;
        break;
      case "rapid_tap": // daggers — violent rapid zigzag, barely controllable
        x = lerp(srcX, dstX, t);
        y = lerp(srcY, dstY, t) + Math.sin(t * Math.PI * 11) * 32;
        break;
      case "sequence": // staff — slow corkscrew spiral, both axes rotate
        x = lerp(srcX, dstX, t) + Math.sin(t * Math.PI * 5) * 18;
        y = lerp(srcY, dstY, t) + Math.cos(t * Math.PI * 5) * 18;
        break;
      case "stomp": // boots — ground-skims with 3 bounces like a skipping stone
        x = lerp(srcX, dstX, t);
        y = GNDY - 6 - Math.abs(Math.sin(t * Math.PI * 3)) * 55;
        break;
      case "poke": // spear — rockets in a straight line but accelerates (ease-in)
        x = srcX + (dstX - srcX) * (t * t);
        y = srcY + (dstY - srcY) * (t * t);
        break;
      case "archery": // bow — high rainbow arc, peaks at midpoint
        x = lerp(srcX, dstX, t);
        y = lerp(srcY, dstY, t) - Math.sin(t * Math.PI) * 85;
        break;
      case "sequence_reveal": // rpg — slow wind-up then rockets (cubic ease-in)
        { const e = t * t * t;
          x = srcX + (dstX - srcX) * e;
          y = lerp(srcY, dstY, e) - Math.sin(t * Math.PI) * 20; }
        break;
      case "dual_action": // sword+gun — bullet path with damping wobble, settles straight
        x = lerp(srcX, dstX, t);
        y = lerp(srcY, dstY, t) + Math.sin(t * Math.PI * 4) * (1 - t) * 45;
        break;
      default:
        x = lerp(srcX, dstX, t);
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
    <div style={{minHeight:"100vh",minWidth:"100vw",background:"#020205",color:"#e8d5a3",overflowX:"hidden"}}>
      <style>{GS}</style>

      {/* ── OPPONENT DIED IN DUNGEON OVERLAY ── */}
      {oppDiedInDungeon&&(
        <div style={{position:"fixed",inset:0,zIndex:9100,display:"flex",
          alignItems:"center",justifyContent:"center",
          background:"rgba(2,2,8,.92)",backdropFilter:"blur(8px)"}}>
          <div style={{textAlign:"center",padding:"44px 56px",
            background:"linear-gradient(160deg,#0d0d1a,#0a1a0a)",
            border:"1px solid #44ff6644",borderRadius:16,
            boxShadow:"0 0 60px #22ff4433",maxWidth:480}}>
            <div style={{fontSize:52,marginBottom:16}}>💀</div>
            <div style={{fontFamily:"Cinzel",fontSize:22,fontWeight:900,letterSpacing:4,
              color:"#44ff88",textShadow:"0 0 24px #22ff66",marginBottom:12}}>
              YOU WIN
            </div>
            <div style={{fontFamily:"IM Fell English",fontStyle:"italic",fontSize:16,
              color:"#aaddaa",lineHeight:1.6,marginBottom:28}}>
              Your opponent died to the dungeon.<br/>
              <span style={{color:"#ffcc44"}}>What a noob.</span><br/>
              Guess you win by default.
            </div>
            <button className="btn" style={{fontSize:13,padding:"12px 36px",letterSpacing:4}}
              onClick={()=>{
                setOppDiedInDungeon(false);
                setGameMode("solo"); setMpStatus("idle"); setMpMode(null);
                setPvpWinner(null); setCs(null); setScreen("title");
              }}>
              ← HOME
            </button>
          </div>
        </div>
      )}

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

      {/* ── RACE rival — center-top fixed strip — hidden during PvP duel ── */}
      {gameMode==="race"&&oppSnap&&!cs?.pvpMode&&screen!=="pvp"&&screen!=="pvp_wait"&&screen!=="title"&&(
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
        </div>
      )}

      {/* ── Fixed timer (always top-right, foreground) ── */}
      {runStartTime&&screen!=="victory"&&screen!=="gameover"&&screen!=="pvp_wait"&&!pvpWinner&&(
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
                              color:"#5a4028",letterSpacing:.5}}>{weaponDmg(w)+(player.str||0)} ATK</div>
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
              onClick={()=>{setPlayer(p=>{if(!p)return p;const t=xpThresholdFor(p.level);return{...p,level:p.level+1,xp:Math.max(0,p.xp-t),maxHp:p.maxHp+15,hp:Math.min(p.hp+15,p.maxHp+15)};});setLevelUpPending(false);}}>❤️ +15 MAX HP</button>
            <button className="btn" style={{padding:"16px 36px",fontSize:15}}
              onClick={()=>{setPlayer(p=>{if(!p)return p;const t=xpThresholdFor(p.level);return{...p,level:p.level+1,xp:Math.max(0,p.xp-t),str:p.str+1};});setLevelUpPending(false);}}>⚔️ +1 STRENGTH</button>
          </div>
        </div>
      )}

      {/* ══ TITLE ══ */}
      {screen==="title"&&(
        <div style={{width:"100vw",height:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
          {/* Title background — plays once at normal speed, holds last frame (no loop attr) */}
          <video ref={titleVidRef} src={`${ASSET_BASE}/icons/title/title.mp4`}
            muted playsInline preload="auto"
            style={{position:"absolute",inset:0,width:"100%",height:"100%",
              objectFit:"cover",objectPosition:"50% 10%",zIndex:0,pointerEvents:"none"}}/>
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

            <h1 style={{fontFamily:"'MedievalSharp',serif",fontWeight:400,fontSize:"clamp(52px,10vw,96px)",letterSpacing:10,lineHeight:1.1,background:"linear-gradient(to bottom,#fff 0%,#ff9933 40%,#ff4400 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"glow 4s infinite"}}>R.P.G.</h1>

            {/* Tagline steps */}
            <div style={{margin:"20px 0 8px",display:"flex",alignItems:"center",justifyContent:"center",gap:12,flexWrap:"wrap"}}>
              {["RACE TO KILL THE SLIME DEMON","ACQUIRE RPG"].map((t,i,arr)=>(
                <React.Fragment key={i}>
                  <span style={{fontFamily:"Cinzel",fontSize:12,letterSpacing:3,color:i===1?"#ffcc44":"#aabbcc",textShadow:i===1?"0 0 10px #ffcc44":"none",fontWeight:700}}>
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
                <button className="btn" style={{fontSize:17,padding:"18px 60px",letterSpacing:6,borderColor:"#ff6600",color:"#ff9933",boxShadow:"0 0 24px #ff440033"}}
                  onMouseEnter={()=>sfx.hover()}
                  onClick={()=>setScreen("weapon_select")}>
                  SOLO
                </button>
                <div style={{display:"flex",gap:12}}>
                  <button className="btn" style={{fontSize:13,padding:"10px 24px",letterSpacing:3,borderColor:"#4466ff",color:"#88aaff"}}
                    onMouseEnter={()=>sfx.hover()}
                    onClick={hostGame}>
                    🖥 HOST GAME
                  </button>
                  <button className="btn" style={{fontSize:13,padding:"10px 24px",letterSpacing:3,borderColor:"#44aaff",color:"#88ccff"}}
                    onMouseEnter={()=>sfx.hover()}
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
          <div style={{display:"flex",flexDirection:"row",gap:12,marginBottom:28,flexWrap:"wrap",justifyContent:"center",zoom:Math.min(1.25,(window.innerWidth-80)/((Object.keys(STARTER_WEAPONS).length*212)-12))}}>
            {Object.values(STARTER_WEAPONS).map(w=>{
              const sel=selectedWeapon===w.id;
              const hov=hoverWeaponId===w.id&&!myWeaponLocked;
              const locked=myWeaponLocked; // freeze selection after lock-in
              const qteLabel=QTE_LABEL[w.qteType]||"?";
              return (
                <div key={w.id}
                  onClick={()=>{ if(!locked) setSelectedWeapon(w.id); }}
                  onMouseEnter={()=>{ if(!locked){setHoverWeaponId(w.id);sfx.metalClink();} }}
                  onMouseLeave={()=>setHoverWeaponId(null)}
                  style={{width:200,padding:"28px 18px",textAlign:"center",cursor:locked?"default":"pointer",
                    display:"flex",flexDirection:"column",alignItems:"center",
                    border:`2px solid ${sel?(locked?"#44ff88":"#e8d5a3"):hov?"#6677aa":"#2a2a3a"}`,
                    background:sel?"#14142a":hov?"#0c0c1e":"#09090f",
                    boxShadow:sel?(locked?"0 0 32px rgba(68,255,136,.15)":"0 0 32px rgba(232,213,163,.2)"):hov?"0 0 16px rgba(100,120,200,.15)":"none",
                    opacity:locked&&!sel?0.35:1,
                    transition:"all .2s",position:"relative"}}>
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
                        ATK {weaponDmg(w)}
                      </div>
                    </div>
                  )}
                  <div style={{fontSize:12,opacity:.55,lineHeight:1.7,marginBottom:"auto",paddingBottom:14}}>{w.desc}</div>
                  <div style={{fontSize:11,fontFamily:"Cinzel",padding:"5px 10px",border:`1px solid ${sel?"#ffcc4455":"#222"}`,color:sel?"#ffcc44":"#555",marginBottom:10}}>{qteLabel}</div>
                  <div style={{fontSize:12,opacity:.45,fontFamily:"Cinzel"}}>ATK {weaponDmg(w)}</div>
                  {/* Locked-in badge over selected card */}
                  {locked&&sel&&(
                    <div style={{position:"absolute",inset:0,display:"flex",alignItems:"flex-start",justifyContent:"flex-end",padding:8,pointerEvents:"none"}}>
                      <div style={{background:"#44ff8822",border:"1px solid #44ff8866",borderRadius:4,
                        fontFamily:"Cinzel",fontSize:9,letterSpacing:2,color:"#44ff88",padding:"3px 7px"}}>
                        LOCKED ✓
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {/* ── Solo: go straight in. Race: lock-in gate ── */}
          {gameMode!=="race" ? (
            <button className="btn" disabled={!selectedWeapon} style={{fontSize:16,padding:"15px 48px",letterSpacing:5}}
              onClick={()=>selectedWeapon&&startGame(selectedWeapon)}>ENTER THE SPIRE →</button>
          ) : (
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
              {/* Opponent status strip */}
              <div style={{display:"flex",alignItems:"center",gap:10,fontFamily:"Cinzel",fontSize:11,
                letterSpacing:2,color:oppSnap?.weaponLocked?"#44ff88":"#4466ff",
                background:"rgba(4,4,18,.7)",border:`1px solid ${oppSnap?.weaponLocked?"#44ff8844":"#4466ff44"}`,
                borderRadius:8,padding:"8px 20px",minWidth:280,justifyContent:"center",
                transition:"all .4s"}}>
                <span style={{fontSize:14}}>{oppSnap?.weaponLocked?"✅":"⏳"}</span>
                {oppSnap?.weaponLocked
                  ? <span>{(oppSnap.name||"RIVAL").toUpperCase()} LOCKED IN <span style={{opacity:.7}}>— {(ALL_WEAPONS[oppSnap.weapon]||{name:"?"}).name}</span></span>
                  : <span>{oppSnap ? `${(oppSnap.name||"RIVAL").toUpperCase()} CHOOSING…` : "WAITING FOR OPPONENT…"}</span>
                }
              </div>

              {/* Lock-in button or locked state */}
              {!myWeaponLocked ? (
                <button className="btn" disabled={!selectedWeapon} style={{fontSize:16,padding:"15px 48px",letterSpacing:5,
                  borderColor:selectedWeapon?"#ffcc44":"#333",color:selectedWeapon?"#ffcc44":"#555"}}
                  onClick={()=>{
                    if(!selectedWeapon) return;
                    mpSend({type:"state", weapon:selectedWeapon, weaponLocked:true});
                    setMyWeaponLocked(true);
                  }}>⚔ LOCK IN</button>
              ) : (
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
                  <div style={{fontFamily:"Cinzel",fontSize:16,letterSpacing:5,color:"#44ff88",
                    textShadow:"0 0 20px #44ff8888",animation:"pulse .8s infinite"}}>
                    ✅ LOCKED IN
                  </div>
                  {oppSnap?.weaponLocked
                    ? <div style={{fontFamily:"Cinzel",fontSize:13,letterSpacing:3,color:"#ffcc44",
                        animation:"pulse .4s infinite"}}>⚔ BOTH READY — STARTING…</div>
                    : <div style={{fontFamily:"Cinzel",fontSize:11,letterSpacing:2,color:"#4466ff",opacity:.7,
                        animation:"pulse 1.2s infinite"}}>WAITING FOR {(oppSnap?.name||"RIVAL").toUpperCase()}…</div>
                  }
                </div>
              )}
            </div>
          )}
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
            <div style={{height:"100%",background:"linear-gradient(to right,#6622aa,#aa44ff)",width:`${Math.min(100,(player.xp/xpThresholdFor(player.level))*100)}%`,transition:"width .5s",boxShadow:"0 0 8px #8833ff"}}/>
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
        // Use crop dims when set — otherwise full frame.  Pool sprites are 128×128 raw.
        const eDims     = cs?.enemySprite
          ? {w:(cs.enemySprite.cropW||cs.enemySprite.frameW), h:(cs.enemySprite.cropH||cs.enemySprite.frameH)}
          : (ENEMY_DIMS[cs.enemy.id]||{w:55,h:70});
        const eScale    = 1.1;
        const eW        = eDims.w*eScale, eH = eDims.h*eScale;
        const eCenterOffX = Math.round((cs.enemySprite?.centerOffsetX||0) * eScale);
        const eLeft     = ENX - eW/2 + enemyWindUp + eCenterOffX + enemyRushOffset;
        const groundPad = cs.enemySprite?.groundPad || 0; // per-sprite vertical offset
        const eTop      = GNDY - eH + groundPad;

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
            {(()=>{
              const hudWeaponId  = player.weapons?.[0]||"sword";
              const hudWeapon    = ALL_WEAPONS[hudWeaponId];
              const hudTierColor = TIER_COLOR[hudWeapon?.tier||"basic"]||"#e8d5a3";
              const hudLabel     = TIER_LABEL[hudWeapon?.tier||"basic"];
              return (
                <div style={{flexShrink:0,padding:"7px 20px",background:"rgba(0,0,0,.55)",backdropFilter:"blur(4px)",
                  borderBottom:"1px solid #1e1e30",display:"flex",justifyContent:"space-between",alignItems:"center",
                  fontFamily:"Cinzel",fontSize:14,letterSpacing:1}}>
                  {/* Left = enemy (enemy sprite is on left of battlefield) */}
                  <span style={{color:cs.pvpMode?"#ff8844":cs.elite?"#aa66ff":enemyData.color,letterSpacing:2,fontWeight:600}}>
                    {cs.pvpMode?"⚔ ":cs.elite?"⚡ ELITE — ":""}{cs.enemy.name}
                  </span>
                  {/* Right = player (hero sprite is on right of battlefield) */}
                  <span style={{display:"inline-flex",alignItems:"center",gap:6,fontWeight:600}}>
                    <Icon type={hudWeaponId} size={16} color={hudTierColor}/>
                    <span style={{color:"#c8b888"}}>{player.class} · Lv{player.level}</span>
                    {hudLabel&&<span style={{color:hudTierColor,fontSize:10,opacity:.9}}>[{hudLabel}]</span>}
                    <span style={{color:hudTierColor,fontSize:11}}>{hudWeapon?.name||hudWeaponId}</span>
                  </span>
                </div>
              );
            })()}

            {/* ─── BATTLEFIELD — fills most of screen ──────── */}
            <div style={{flex:1,display:"flex",alignItems:"flex-start",justifyContent:"center",paddingTop:12,position:"relative"}}>
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

              {/* ── CHARGE: compact power bar — tracks hero position ── */}
              {chargeActive&&(()=>{
                const mW=160, mH=14;
                const mL = (heroPos?.left??HR_L) + HSW/2 - mW/2;
                const mT = (heroPos?.top ??HR_T) - mH - 14;
                const pct = Math.min(charge*100, 100);
                // Use weapon-specific zone bounds so the visual always matches the resolve logic
                const _wcplo = qteAnim?.weapon?.chargePerfectLo ?? CHARGE_PERFECT_LO;
                const _wcphi = qteAnim?.weapon?.chargePerfectHi ?? CHARGE_PERFECT_HI;
                const goodLo=50, perfLo=_wcplo*100, perfHi=_wcphi*100;
                const fillCol = pct>=100?"#ff3311":pct>=perfHi?"#ff2200":pct>=perfLo?"#00ff66":pct>=goodLo?"#ffaa22":"#3388ff";
                const isPerfectZone = pct>=perfLo && pct<perfHi;
                const isDanger      = pct>=perfHi;
                const borderCol = isDanger?"#ff2200":isPerfectZone?"#00ff66":pct>=goodLo?"#ffaa22":"#334466";
                const outerGlow = isDanger?"0 0 22px #ff220099":isPerfectZone?"0 0 18px #00ff6699":"0 0 4px #111";
                return (
                  <>
                    {/* Track */}
                    <div style={{position:"absolute",left:mL,top:mT,width:mW,height:mH,
                      borderRadius:3,border:`1px solid ${borderCol}`,
                      background:"#060610",zIndex:9,overflow:"hidden",boxShadow:outerGlow}}>

                      {/* Zone bands */}
                      <div style={{position:"absolute",left:0,top:0,width:`${goodLo}%`,height:"100%",background:"rgba(30,60,180,.30)"}}/>
                      <div style={{position:"absolute",left:`${goodLo}%`,top:0,width:`${perfLo-goodLo}%`,height:"100%",background:"rgba(200,120,0,.28)"}}/>
                      <div style={{position:"absolute",left:`${perfLo}%`,top:0,width:`${perfHi-perfLo}%`,height:"100%",
                        background:"rgba(0,255,100,.55)",boxShadow:"inset 0 0 8px #00ff6699"}}/>
                      <div style={{position:"absolute",left:`${perfHi}%`,top:0,width:`${100-perfHi}%`,height:"100%",background:"rgba(255,30,0,.40)"}}/>

                      {/* Fill — no transition: instant update = accurate timing */}
                      <div style={{position:"absolute",left:0,top:0,height:"100%",width:`${pct}%`,
                        background:`linear-gradient(to right,${fillCol}bb,${fillCol})`,
                        boxShadow:`0 0 12px ${fillCol},inset 0 0 6px rgba(255,255,255,.12)`}}/>

                      {/* Zone dividers */}
                      {[{v:goodLo,col:"#ffcc44"},{v:perfLo,col:"#00ff66"},{v:perfHi,col:"#ff2200"}].map(({v,col},i)=>(
                        <div key={i} style={{position:"absolute",left:`${v}%`,top:0,
                          width:2,height:"100%",background:col,
                          boxShadow:`0 0 4px ${col}`,transform:"translateX(-1px)",zIndex:10}}/>
                      ))}

                      {/* Needle — no transition: must be pixel-accurate */}
                      <div style={{position:"absolute",left:`${pct}%`,top:0,
                        width:2,height:"100%",background:"#fff",borderRadius:1,zIndex:11,
                        boxShadow:`0 0 8px #fff,0 0 14px ${fillCol}`,
                        transform:"translateX(-1px)"}}/>
                    </div>

                    {/* Weapon icon above bar — also fixed */}
                    <div style={{position:"absolute",left:mL+mW/2-9,top:mT-22,
                      zIndex:9,animation:"float .4s ease-in-out infinite",
                      filter:isPerfectZone?"drop-shadow(0 0 10px #00ff66)":isDanger?"drop-shadow(0 0 10px #ff2200)":"none"}}>
                      <Icon type={qteAnim?.weapon?.id||"hammer"} size={18}/>
                    </div>
                  </>
                );
              })()}

              {/* ── CHARGE: projectile flying to enemy after release ── */}
              {qteAnim?.type==="hold_release"&&qteAnim.released&&(()=>{
                const rt  = qteAnim.releaseT||0;
                const _rc = qteAnim.charge||0;
                const _rlo = qteAnim.weapon?.chargePerfectLo ?? CHARGE_PERFECT_LO;
                const _rhi = qteAnim.weapon?.chargePerfectHi ?? CHARGE_PERFECT_HI;
                const q   = _rc>=_rlo&&_rc<_rhi?"perfect":_rc>=0.60?"good":"miss";
                const col = q==="perfect"?"#44ff88":q==="good"?"#ffcc44":"#ff5522";
                const sx  = (heroPos?.left||HR_L)+HSW/2;
                const sy  = (heroPos?.top||HR_T)+HSH/2;
                const tx  = ENX;
                const ty  = eTop + eH*0.38;
                const bx  = sx + (tx-sx)*easeIO(rt);
                const by  = sy + (ty-sy)*easeIO(rt);
                const wid2 = qteAnim.weapon?.id||"hammer";
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
                    {/* Spinning weapon icon */}
                    <foreignObject x={bx-9} y={by-9} width="18" height="18" style={{overflow:"visible",pointerEvents:"none"}}>
                      <div style={{transform:`rotate(${rt*720}deg)`,transformOrigin:"center",width:18,height:18,display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <Icon type={wid2} size={14} color="#fff"/>
                      </div>
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

              {/* ── POKE: any-key spam prompt above hero + fill bar ── */}
              {qteAnim?.type==="poke"&&qteAnim.t>=0.21&&(()=>{
                const inputs = qteAnim.inputs||0;
                const target = qteAnim.tapTarget||POKE_TARGET;
                const pct    = Math.min(1, inputs/target);
                const lk     = qteAnim.lastKey||"";
                const hL     = heroPos?.left||HR_L;
                const hT     = heroPos?.top||HR_T;
                return (
                  <>
                    {/* Last key flash + SPAM label above hero */}
                    <div style={{position:"absolute",left:hL+HSW/2,top:hT-52,
                      transform:"translateX(-50%)",zIndex:9,textAlign:"center",pointerEvents:"none"}}>
                      {lk && (
                        <div key={inputs} style={{fontFamily:"Cinzel",fontWeight:900,fontSize:18,
                          color:"#ffcc44",textShadow:"0 0 12px #ff8844",lineHeight:1,
                          animation:"actionCmd .18s ease-out forwards"}}>
                          {lk}
                        </div>
                      )}
                      <div style={{fontFamily:"Cinzel",fontSize:9,letterSpacing:2,
                        color:"#ff8844aa",marginTop:2}}>SPAM KEYS</div>
                    </div>
                    {/* Fill bar */}
                    <div style={{position:"absolute",top:12,left:BFW/2-150,width:300,height:12,
                      background:"#0a0a18",border:"1px solid #2a2a44",borderRadius:6,zIndex:9}}>
                      <div style={{height:"100%",borderRadius:6,width:`${pct*100}%`,
                        background:`linear-gradient(to right,#cc4411,${pct>0.85?"#44ff88":"#ffcc44"})`,
                        boxShadow:"0 0 8px #ff8844",transition:"width .04s"}}/>
                    </div>
                    {/* Count */}
                    <div style={{position:"absolute",top:30,left:BFW/2,transform:"translateX(-50%)",
                      fontFamily:"Cinzel",fontSize:10,color:"#ff8844aa",letterSpacing:1,zIndex:9}}>
                      {inputs}/{target}
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
                  return d<0.18?"perfect":d<0.42?"good":"miss";
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
                              fill="#6655aa" opacity=".06"/>
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
                        <g key={i} opacity=".12">
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
                // Good band: 2.2× center zone (matches resolve logic), clamped to track
                const goodW  = Math.min(trackW, centerWidth * 2.2 * trackW);
                const goodX  = trackX + (0.5 - centerWidth*2.2/2) * trackW;
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

                    {/* Good band (wider, dim) */}
                    <rect x={Math.max(trackX,goodX)} y={trackY}
                      width={Math.min(goodW, trackW-(Math.max(trackX,goodX)-trackX))} height={trackH} rx="1"
                      fill={wCol} opacity={allHeld?.18:.09}/>

                    {/* Perfect zone (full center zone, bright) */}
                    <rect x={zoneX} y={trackY} width={zoneW} height={trackH} rx="1"
                      fill={allHeld?"#ffffff":wCol} opacity={allHeld?.45:.22}/>

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

              {/* ── RAPID TAP counter — compact badge above hero head ── */}
              {qteAnim?.type==="rapid_tap"&&heroPos&&(()=>{
                const taps = qteAnim.taps||0;
                const target = qteAnim.tapTarget||8;
                const pct = Math.min(1, taps/target);
                const cx = heroPos.left + HSW/2;
                const W = 56, H = 26;
                return (
                  <div style={{position:"absolute", left:cx - W/2, top:heroPos.top - H - 6,
                    width:W, zIndex:10, pointerEvents:"none", textAlign:"center"}}>
                    <div style={{fontSize:11,fontFamily:"Cinzel",fontWeight:700,
                      color:pct>=1?"#44ff88":"#ffcc44",letterSpacing:1,lineHeight:1,
                      textShadow:"0 0 6px #ff8844",marginBottom:2}}>
                      {taps}/{target}
                    </div>
                    <div style={{height:4,background:"#111",borderRadius:2,overflow:"hidden",
                      border:"1px solid #333"}}>
                      <div style={{height:"100%",borderRadius:2,
                        width:`${pct*100}%`,
                        background:`linear-gradient(to right,#ff6622,${pct>=1?"#44ff88":"#ffcc44"})`,
                        boxShadow:"0 0 4px #ff8844",transition:"width .04s"}}/>
                    </div>
                  </div>
                );
              })()}

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
                const t    = qteAnim.t||0;
                const done = (qteAnim.doneIndices||[]).length;
                const len  = (qteAnim.seq||[]).length||10;
                return (
                  <svg style={{position:"absolute",left:0,top:0,zIndex:4,pointerEvents:"none",overflow:"visible"}} width={BFW} height={BFH}>
                    <circle cx={ENX} cy={eTop+eH*0.45} r={18+Math.sin(t*8)*3}
                      fill="none" stroke="#ff6622" strokeWidth="1.5" opacity=".55"
                      strokeDasharray="6 4"/>
                    <circle cx={ENX} cy={eTop+eH*0.45} r={8}
                      fill="none" stroke="#ffcc44" strokeWidth="1" opacity=".4"/>
                    {done>0&&<circle cx={ENX} cy={eTop+eH*0.45} r={24}
                      fill="none" stroke="#ff6622" strokeWidth="2.5"
                      strokeDasharray={`${done/len*150} 150`} opacity=".7"
                      style={{filter:"drop-shadow(0 0 6px #ff6622)"}}/>}
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

              {/* ── SEQUENCE REVEAL (RPG): 2×5 grid — all remaining keys reshuffle after each correct press ── */}
              {qteAnim?.type==="sequence_reveal"&&qteAnim.seq&&(
                <div style={{position:"absolute",top:12,left:"50%",transform:"translateX(-50%)",
                  display:"flex",flexDirection:"column",gap:7,zIndex:9,alignItems:"center"}}>
                  <div style={{fontFamily:"Cinzel",fontSize:10,letterSpacing:3,color:"#886644",
                    textShadow:"0 0 8px #886644",marginBottom:2}}>
                    🚀 RPG — PRESS THE GLOWING KEY
                  </div>
                  {[0,1].map(row=>(
                    <div key={row} style={{display:"flex",gap:7}}>
                      {[0,1,2,3,4].map(col=>{
                        const i   = row*5+col;
                        const k   = qteAnim.seq[i];
                        const done = (qteAnim.doneIndices||[]).includes(i);
                        const cur  = i===qteAnim.targetIdx;
                        const bad  = cur&&qteAnim.badKey;
                        return (
                          // key=k+i forces re-mount (and runeIn animation) whenever the letter changes
                          <div key={done?`d${i}`:`${k}${i}`} style={{
                            width:44,height:44,display:"flex",alignItems:"center",justifyContent:"center",
                            fontFamily:"Cinzel",fontWeight:700,fontSize:19,borderRadius:8,
                            border:`2.5px solid ${done?"#1a1a24":cur?(bad?"#ff4422":"#ffdd00"):"#252535"}`,
                            color:done?"#1e1e28":cur?(bad?"#ff4422":"#ffee44"):"#44445a",
                            background:done?"#030306":cur?(bad?"#1a0606":"#1a1600"):"#06060e",
                            boxShadow:done?"none":cur&&!bad?"0 0 30px #ffdd0088, 0 0 12px #ffdd0055, inset 0 0 8px #ffdd0033":"none",
                            transform:cur&&!bad?"scale(1.22)":"scale(1)",
                            opacity:done?0.20:cur?1:0.50,
                            transition:"transform .07s, box-shadow .07s, border-color .07s",
                            animation:!done?"runeIn .12s ease-out":"none",
                          }}>
                            {done?"✓":k}
                          </div>
                        );
                      })}
                    </div>
                  ))}
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
                const rl  = qteAnim.rocketLevel||0;
                const sx  = HR_L+HSW/2, sy = HR_T+HSH/2;
                const tx  = ENX, ty = eTop+eH*0.45;
                // Path function — all levels end at (tx,ty) when t=1
                const rocketXY = (tp) => {
                  if (rl===0) {
                    return { x:sx+(tx-sx)*easeIO(tp), y:sy+(ty-sy)*easeIO(tp) };
                  }
                  if (rl===1) {
                    // Sine wave, faster
                    return { x:sx+(tx-sx)*tp, y:sy+(ty-sy)*tp + Math.sin(tp*Math.PI*5)*38 };
                  }
                  if (rl===2) {
                    // 2 loops then dive
                    const LP=0.62;
                    if (tp<=LP) {
                      const p=tp/LP;
                      return { x:sx+(tx-sx)*p*0.6+Math.cos(p*Math.PI*4)*72,
                               y:sy+(ty-sy)*p*0.4+Math.sin(p*Math.PI*4)*52-p*70 };
                    } else {
                      // cos(4π)=1, sin(4π)=0 → loop-end pos:
                      const ex=sx+(tx-sx)*0.6+72, ey=sy+(ty-sy)*0.4-70;
                      const p=(tp-LP)/(1-LP);
                      return { x:ex+(tx-ex)*p, y:ey+(ty-ey)*p };
                    }
                  }
                  if (rl===3) {
                    // One visible loop in the air, then hits enemy from front (right→left)
                    const lcx=(sx+tx)/2, lcy=sy-85, R=100;
                    const entX=lcx+R, entY=lcy; // loop entry & exit point
                    if (tp<0.28) {
                      const p=tp/0.28;
                      return { x:sx+(entX-sx)*p, y:sy+(entY-sy)*p };
                    } else if (tp<0.72) {
                      const phase=(tp-0.28)/0.44; // 0→1 = full CCW loop
                      return { x:lcx+R*Math.cos(phase*Math.PI*2),
                               y:lcy-R*Math.sin(phase*Math.PI*2) };
                    } else {
                      const p=(tp-0.72)/0.28;
                      return { x:entX+(tx-entX)*easeIO(p), y:entY+(ty-entY)*easeIO(p) };
                    }
                  }
                  return { x:sx+(tx-sx)*tp, y:sy+(ty-sy)*tp };
                };
                const {x:bx,y:by}=rocketXY(t);
                // Angle from derivative
                const dt2=0.012;
                const {x:x1,y:y1}=rocketXY(Math.min(1,t+dt2));
                const {x:x0,y:y0}=rocketXY(Math.max(0,t-dt2));
                const deg=Math.atan2(y1-y0, x1-x0)*180/Math.PI;
                const hidden=bx<-100||by<-100;
                return (
                  <svg style={{position:"absolute",left:0,top:0,zIndex:12,pointerEvents:"none",overflow:"visible"}} width={BFW} height={BFH}>
                    {/* Smoke trail */}
                    {!hidden&&[...Array(7)].map((_,i)=>{
                      const {x:tx2,y:ty2}=rocketXY(Math.max(0,t-(i+1)*0.055));
                      if(tx2<-150||ty2<-150) return null;
                      return <circle key={i} cx={tx2} cy={ty2} r={7-i*0.8} fill="#666666" opacity={(1-i*0.13)*0.28}/>;
                    })}
                    {/* Fire trail */}
                    {!hidden&&[...Array(5)].map((_,i)=>{
                      const {x:tx2,y:ty2}=rocketXY(Math.max(0,t-(i+1)*0.035));
                      if(tx2<-150||ty2<-150) return null;
                      return <circle key={i} cx={tx2} cy={ty2} r={5-i*0.7} fill={i%2===0?"#ff4400":"#ffaa00"} opacity={(1-i*0.18)*0.75}/>;
                    })}
                    {/* Rocket body */}
                    {!hidden&&<g transform={`translate(${bx},${by}) rotate(${deg})`}>
                      <rect x="-22" y="-5" width="30" height="10" rx="5" fill="#556677"/>
                      <rect x="-22" y="-5" width="30" height="5" rx="3" fill="#778899" opacity=".6"/>
                      <polygon points="8,-5 18,0 8,5" fill="#ff5522"/>
                      <polygon points="-22,-5 -30,0 -22,5" fill="#ff6600" opacity=".9"/>
                      <circle cx="-16" cy="0" r="3" fill="#334455"/>
                      <rect x="-8" y="-8" width="4" height="4" rx="1" fill="#ff2200" opacity=".8"/>
                    </g>}
                    {/* Impact burst rings near end */}
                    {t>0.80&&[...Array(14)].map((_,i)=>{
                      const a=i/14*Math.PI*2;
                      const r=(t-0.80)/0.20*40;
                      return <line key={i} x1={tx} y1={ty}
                        x2={tx+Math.cos(a)*r} y2={ty+Math.sin(a)*r}
                        stroke={i%3===0?"#ffcc00":i%3===1?"#ff4400":"#ff8800"}
                        strokeWidth="3" opacity={(1-(t-0.80)/0.20)*0.95}/>;
                    })}
                  </svg>
                );
              })()}

              {/* Enemy shadow on ground */}
              <svg style={{position:"absolute",left:0,top:0,pointerEvents:"none",overflow:"visible",zIndex:3}} width={BFW} height={BFH}>
                <ellipse cx={ENX} cy={GNDY+4} rx={eW*0.42} ry={5} fill="#000" opacity=".35"/>
              </svg>

              {/* Enemy sprite — HeroSprite when PvP opponent */}
              <div style={{position:"absolute",left:eLeft,top:eTop,zIndex:4,willChange:"transform",
                filter:cs.enemy.id==="pvp_opp"
                  ?(enemyFlash?"brightness(3) drop-shadow(0 0 18px #ff4400)":"drop-shadow(0 0 14px #4466ffaa)")
                  :cs.enemy.id==="dragon"
                    ?(enemyFlash?"drop-shadow(0 0 28px #ff4400) drop-shadow(0 0 12px #ff6600)":"drop-shadow(0 0 22px #ff6600bb)")
                  :`drop-shadow(0 0 22px ${enemyData.color}bb) drop-shadow(0 8px 4px #00000088)`,
                animation:enemyFlash?`hitFlash .35s ease-out`:"none",
                transformOrigin:"bottom center",
                transform:(qteAnim?.type==="rush_melee"&&qteAnim.rushPhase==="retreat")?"scaleX(-1)":cs.enemy.id==="dragon"||cs.enemy.id==="pvp_opp"?"scaleX(-1)":"none"}}>
                {cs.enemy.id==="pvp_opp"
                  ? <HeroSprite className={cs.enemy.pvpClass??'Knight'} scale={eScale} weapons={cs.enemy.pvpWeapons??['sword']}
                      heroLooks={cs.enemy.pvpHeroLooks}
                      animRow={qteAnim?.type==="defend" ? (cs.enemy.pvpHeroLooks?.atkRow??5) : (cs.enemy.pvpHeroLooks?.idleRow??0)}
                      animFrame={frameTick%4}/>
                  : <EnemySpriteSmall id={cs.enemy.id} scale={eScale} sprite={cs?.enemySprite} enemyFlash={enemyFlash} phase={cs.phase} bossAttackPattern={cs?.bossAttackPattern} rushAnim={qteAnim?.type==="rush_melee"?qteAnim.rushPhase:null} atkIdx={cs.enemyAtkIdx??0}/>
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

              {/* Stomp impact — subtle dust puffs at enemy head contact point */}
              {stompImpact&&(()=>{
                const { x, y, id } = stompImpact;
                // 6 small dust particles drifting up and outward
                const dusts = [
                  { dx:-14, dy:-18, delay:0,   size:5 },
                  { dx: 12, dy:-16, delay:30,  size:4 },
                  { dx:-22, dy:-10, delay:15,  size:3 },
                  { dx: 20, dy:-12, delay:45,  size:4 },
                  { dx: -8, dy:-22, delay:60,  size:3 },
                  { dx: 16, dy:-20, delay:20,  size:3 },
                ];
                return (
                  <div key={id} style={{position:"absolute",left:x,top:y,width:0,height:0,zIndex:26,pointerEvents:"none"}}>
                    {dusts.map((d,i)=>(
                      <div key={i} style={{
                        position:"absolute",
                        width:d.size, height:d.size,
                        left:-d.size/2, top:-d.size/2,
                        borderRadius:"50%",
                        background:"rgba(210,190,160,0.75)",
                        "--dx":d.dx+"px", "--dy":d.dy+"px",
                        animation:`siDebris .55s ease-out ${d.delay}ms forwards`,
                      }}/>
                    ))}
                  </div>
                );
              })()}

              {/* Hero sprite — position:absolute in zoomed battlefield */}
              {(()=>{
                const looks = player?.heroLooks;
                // Compute animation row + frame based on game state
                const { aRow, aFrame } = (()=>{
                  const iRow = looks?.idleRow ?? 0;
                  const tick = frameTick;
                  // Dead
                  if ((player?.hp??1)<=0) return {aRow:looks?.deathRow??6, aFrame:tick%(looks?.deathCols??4)};
                  // No QTE → idle (cycle sprite frames)
                  if (!qteAnim) return {aRow:iRow, aFrame:tick%(looks?.idleCols??4)};
                  const type=qteAnim.type, t=qteAnim.t??0.5;
                  // Defend → idle (cycle sprite frames)
                  if (type==='defend') return {aRow:iRow, aFrame:tick%(looks?.idleCols??4)};
                  // Stomp: jump up (t<LAND_FRAC) then fall down
                  if (type==='stomp'||type==='stomp_return'){
                    if (t<LAND_FRAC) return {aRow:looks?.jumpRow??3, aFrame:tick%(looks?.jumpCols??4)};
                    return {aRow:looks?.fallRow??4, aFrame:tick%(looks?.fallCols??4)};
                  }
                  // Archery → attack animation (hero stays at home, not walking)
                  if (type==='archery') return {aRow:looks?.atkRow??5, aFrame:tick%(looks?.atkCols??4)};
                  // Past midpoint toward enemy → attack; still approaching → run
                  if (heroPos!==null) {
                    const atEnemy = heroPos.left < (HR_L + STRIKE_L) / 2;
                    if (atEnemy) return {aRow:looks?.atkRow??5, aFrame:tick%(looks?.atkCols??4)};
                    return {aRow:looks?.runRow??2, aFrame:tick%(looks?.runCols??4)};
                  }
                  return {aRow:looks?.atkRow??5, aFrame:tick%(looks?.atkCols??4)};
                })();
                return (
                  <div style={{position:"absolute",
                    left: heroPos ? heroPos.left : HR_L,
                    top:  heroPos ? heroPos.top  : HR_T,
                    zIndex:20, animation:"none", pointerEvents:"none",
                    filter: qteAnim?.type==="defend"   ? "drop-shadow(0 0 10px #4488ff)" :
                            chargeActive&&cIsPerfect   ? "drop-shadow(0 0 14px #44ff88)" : "none"}}>
                    <HeroSprite className={player.class} scale={0.85} weapons={player.weapons||[]} heroLooks={looks} animRow={aRow} animFrame={aFrame}/>
                  </div>
                );
              })()}

              {/* Orbiting weapon icons — Mega Man style, one per held weapon */}
              {(player.weapons||[]).map((wid, i, arr) => {
                const wData = ALL_WEAPONS[wid];
                if (!wData) return null;
                const ORBIT_R   = 38;          // px from hero center
                const ORBIT_DUR = 3.2;          // seconds per full revolution
                const delay     = -(i / arr.length) * ORBIT_DUR; // phase-offset each weapon evenly
                const hcx = (heroPos ? heroPos.left : HR_L) + HSW / 2; // hero center x
                const hcy = (heroPos ? heroPos.top  : HR_T) + HSH / 2; // hero center y
                return (
                  <div key={wid} style={{
                    position:"absolute", left:hcx, top:hcy,
                    width:0, height:0, zIndex:1, pointerEvents:"none",
                    animation:`weaponOrbit ${ORBIT_DUR}s linear ${delay}s infinite`,
                    transformOrigin:"0 0",
                  }}>
                    <div style={{
                      position:"absolute",
                      left: ORBIT_R - 11, top: -11,
                      width:22, height:22,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      background:"rgba(0,0,0,0.55)",
                      borderRadius:"50%",
                      border:"1px solid rgba(255,200,80,0.5)",
                      boxShadow:"0 0 6px rgba(255,180,40,0.4)",
                      animation:`weaponOrbitCounter ${ORBIT_DUR}s linear ${delay}s infinite`,
                    }}><Icon type={wid} size={16} color="#ffcc50"/></div>
                  </div>
                );
              })}

              {/* Battlefield status line */}
              <div style={{position:"absolute",top:qteAnim?.type==="swing_beat"||qteAnim?.type==="hold_release"||qteAnim?.type==="poke"?50:qteAnim?.type==="sequence"?30:10,left:"50%",transform:"translateX(-50%)",fontFamily:"Cinzel",fontSize:10,letterSpacing:3,zIndex:9,whiteSpace:"nowrap"}}>
                {qteAnim?.type==="rapid_tap"  ? <span style={{color:"#ff8844",animation:"pulse .15s ease-in-out infinite",fontWeight:700}}>MASH [A] [D]</span>
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
                // PvP: use pvpMyHp (decremented by defender's block/parry result), not player.hp
                const myHp   = cs.pvpMode ? pvpMyHp  : player.hp;
                const myMaxHp= cs.pvpMode ? pvpMaxHp : player.maxHp;
                const pPct   = Math.max(0, Math.min(100, myHp / Math.max(1,myMaxHp) * 100));
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
                        <span>{myHp}/{myMaxHp}</span>
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
              const seqDurActive = qteAnim?.weapon?.seqDur ?? SEQ_DUR;
              const elapsed   = performance.now() - castStartRef.current;
              const remaining = Math.max(0, seqDurActive - elapsed);
              const remSec    = Math.floor(remaining / 1000);
              const remMsPart = Math.floor(remaining % 1000);
              const danger    = remaining < seqDurActive * 0.35;
              const warn      = remaining < seqDurActive * 0.60;
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
              const wTier = wD?.tier ?? "basic";
              const wTierColor = TIER_COLOR[wTier];
              const wTierLabel = TIER_LABEL[wTier];
              const isPotion = r.type==="potion";
              const isWeapon = r.type==="weapon" && wTier!=="basic";
              const glowColor = isPotion?"#7733aa":isWeapon?wTierColor:null;
              const baseBorder = glowColor?`1px solid ${glowColor}88`:"1px solid #2a2a3a";
              const baseBg     = isPotion?"#0d0818":isWeapon&&wTier==="epic"?"#0a0015":isWeapon&&wTier==="refined"?"#000d1a":"#08080f";
              const hoverBorder= glowColor?`1px solid ${glowColor}`:"1px solid #e8d5a388";
              const hoverBg    = isPotion?"#180830":isWeapon?"#100020":"#10101e";
              const glowShadow = glowColor?`0 0 18px ${glowColor}66`:"none";
              return (
                <div key={i} onClick={()=>applyReward(r)}
                  style={{width:200,padding:"22px 20px 24px",textAlign:"center",cursor:"pointer",
                    border:baseBorder,background:baseBg,transition:"all .2s",borderRadius:4,
                    boxShadow:glowShadow}}
                  onMouseEnter={e=>{e.currentTarget.style.border=hoverBorder;e.currentTarget.style.background=hoverBg;e.currentTarget.style.boxShadow=glowColor?`0 0 30px ${glowColor}88`:"0 0 14px #e8d5a322";}}
                  onMouseLeave={e=>{e.currentTarget.style.border=baseBorder;e.currentTarget.style.background=baseBg;e.currentTarget.style.boxShadow=glowShadow;}}>
                  {(isPotion||wTierLabel)&&(
                    <div style={{fontFamily:"Cinzel",fontSize:9,letterSpacing:3,
                      color:isPotion?"#cc88ff":wTierColor,
                      background:isPotion?"#2a0844":wTier==="epic"?"#1a0030":wTier==="refined"?"#001433":"#1a1400",
                      padding:"2px 8px",borderRadius:2,display:"inline-block",marginBottom:10,
                      border:`1px solid ${isPotion?"#7733aa66":wTierColor+"55"}`}}>
                      {isPotion?"POTION":wTierLabel.toUpperCase()}
                    </div>
                  )}
                  <div style={{width:60,height:60,margin:"0 auto 12px",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <Icon type={r.type==="weapon"?r.weaponId:r.type==="potion"?r.potion?.id:r.id==="hp15"?"heal_vial":r.id==="hp30"?"heal_potion":r.id==="str1"?"str_shard":"hp_shard"} size={56}/>
                  </div>
                  <div style={{fontFamily:"Cinzel",fontSize:15,marginBottom:8,letterSpacing:1,
                    color:isPotion?"#dd99ff":wD?wTierColor:"#e8d5a3"}}>{r.label}</div>
                  <div style={{fontSize:12,opacity:.6,lineHeight:1.5,color:isPotion?"#bb88ee":"inherit"}}>
                    {wD?`${wD.name} (${weaponDmg(wD)} ATK · ${QTE_LABEL[wD.qteType]})`:r.desc}
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
          <div style={{marginBottom:20,animation:"float 2s infinite",filter:"drop-shadow(0 0 30px gold) drop-shadow(0 0 60px #44ff88)"}}>
            <img src={`${ASSET_BASE}/icons/sprites/map/BOSS.png`} width={80} height={80} style={{imageRendering:"pixelated",display:"block"}}/>
          </div>
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
              ? "You have won the RPG for beating the boss first, now use it carefully against your opponent, it's tricky!"
              : "Rival claimed the RPG. Survive if you can."}
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
          {oppSnap?.dungeonDied
            ? <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:14,marginTop:8}}>
                <p style={{fontFamily:"IM Fell English",fontStyle:"italic",fontSize:15,color:"#44ff88",textAlign:"center",lineHeight:1.6,margin:0}}>
                  Your opponent died to the dungeon. What a noob.<br/>
                  <span style={{color:"#ffcc44"}}>You win by default.</span>
                </p>
                <button className="btn" style={{fontSize:12,padding:"10px 32px",letterSpacing:4}}
                  onClick={()=>{
                    setOppDiedInDungeon(false);
                    setGameMode("solo"); setMpStatus("idle"); setMpMode(null);
                    setPvpWinner(null); setCs(null); setScreen("title");
                  }}>
                  ← HOME
                </button>
              </div>
            : <p style={{fontFamily:"Cinzel",fontSize:9,opacity:.25,letterSpacing:2}}>PVP ARENA LOADING ONCE RIVAL IS READY</p>
          }
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
              {(()=>{
                const looks=player?.heroLooks;
                const iRow=looks?.idleRow??0;
                const tick=frameTick;
                let aRow=iRow, aFrame=tick%(looks?.idleCols??4);
                if((player?.hp??1)<=0){aRow=looks?.deathRow??6;aFrame=tick%(looks?.deathCols??4);}
                else if(qteAnim){
                  const type=qteAnim.type,t=qteAnim.t??0.5;
                  if(type==='stomp'||type==='stomp_return'){aRow=t<LAND_FRAC?(looks?.jumpRow??3):(looks?.fallRow??4);aFrame=tick%4;}
                  else if(type==='defend'){aRow=iRow;aFrame=tick%(looks?.idleCols??4);}
                  else if(type==='archery'){aRow=looks?.atkRow??5;aFrame=tick%(looks?.atkCols??4);}
                  else if(heroPos!==null){const atEnemy=heroPos.left<(HR_L+STRIKE_L)/2;aRow=atEnemy?(looks?.atkRow??5):(looks?.runRow??2);aFrame=tick%(atEnemy?(looks?.atkCols??4):(looks?.runCols??4));}
                  else{aRow=looks?.atkRow??5;aFrame=tick%(looks?.atkCols??4);}
                }
                return(
                  <div style={{position:"absolute",left:heroPos?heroPos.left:HR_L,top:heroPos?heroPos.top:HR_T,zIndex:6,animation:"none"}}>
                    <HeroSprite className={player.class} scale={0.85} weapons={player.weapons||[]} heroLooks={looks} animRow={aRow} animFrame={aFrame}/>
                  </div>
                );
              })()}

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

      {/* ── QTE Inspector — visible at ?debug URL param ── */}
      {window.location.search.includes('debug') && (() => {
        // Auto-bootstrap combat state so QTEs render without navigating the game
        const _dbgSetup = () => {
          if (window.__qteDbgInit) return;
          window.__qteDbgInit = true;
          const heroLooks = randomHeroLooks();
          setPlayer({ name:'Debug', hp:100, maxHp:100, level:5, str:10, def:5,
            potions:[], xp:0, xpToNext:100, weapons:['sword'],
            heroLooks, class:'Knight', floor:1, visited:[], nodeId:'n0' });
          setCs({ phase:'action',
            enemy:{ ...ENEMIES.goblin, id:'goblin', hp:99999, maxHp:99999 },
            enemySprite:{ ...ENEMY_SPRITE_POOL[0] },
            hp:99999, maxHp:99999, log:[],
            elite:false, pvpMode:false, bossAttackPattern:null, nodeId:'n0' });
          setScreen('combat');
        };
        const _dbgReset = () => {
          window.__qteDbgInit = false;
          setQteAnim(null);
          _dbgSetup();
        };
        const _launchQte = (weaponId) => {
          if (!player || !cs) { _dbgSetup(); return; }
          if (weaponId === '__defend') { startDefendQTE(); return; }
          const weapon = ALL_WEAPONS[weaponId];
          if (!weapon) return;
          // Cancel ALL pending QTE timers so stale timeouts don't fire into the new QTE
          const _r = qteRef.current;
          clearTimeout(_r.defendTimer);
          clearTimeout(_r.beatTimer);
          clearTimeout(_r.pokeTimer);
          clearTimeout(_r.seqTimer);
          clearTimeout(_r.rpgTimer);
          _r.done = true;       // kills any running tick/defend animation
          _r.debugMode = true;  // tells resolveAttack to skip defend queue
          setQteAnim(null);
          // Reset cs phase to action so startAttack sees correct state
          qteRef.current.done = false; // allow new QTE to run
          setCs(prev => prev ? { ...prev, phase:'action',
            enemy:{ ...prev.enemy, hp:99999, maxHp:99999 } } : prev);
          startAttack(weapon);
        };
        const QTE_GROUPS = [
          { label:'⚔ Swing Beat',    type:'swing_beat',      ids:['sword','longsword','obsidian_blade'] },
          { label:'⚒ Hold/Release',  type:'hold_release',    ids:['hammer','axe','great_maul','titan_hammer'] },
          { label:'🗡 Rapid Tap',     type:'rapid_tap',       ids:['daggers','twin_blades','shadow_fangs'] },
          { label:'🔱 Poke',          type:'poke',            ids:['spear','war_lance','dragon_lance'] },
          { label:'🏹 Archery',       type:'archery',         ids:['bow','hunters_bow','darkwood_bow'] },
          { label:'🪄 Sequence',      type:'sequence',        ids:['staff','wand','runic_staff','void_scepter'] },
          { label:'🚀 RPG Reveal',    type:'sequence_reveal', ids:['rpg'] },
          { label:'👟 Stomp',         type:'stomp',           ids:['boots','iron_stompers','thunder_boots'] },
          { label:'⚔🔫 Dual Action', type:'dual_action',     ids:['sword_gun','knife_shotgun','axe_pistol','club_musket','sniper_spear'] },
          { label:'🛡 Defend',        type:'defend',          ids:['__defend'] },
        ];
        const activeType = qteAnim?.type;
        const activeWpn  = qteAnim?.weapon?.id;
        const [_qteOpen, _setQteOpen] = React.useState(false);
        const [_cropOpen, _setCropOpen] = React.useState(false);
        return (
          <div ref={el=>{ if(el) _dbgSetup(); }}
            style={{position:'fixed',top:8,left:8,zIndex:9999,fontFamily:'monospace',fontSize:10}}>
            {/* Collapsed pill */}
            {!_qteOpen && (
              <button onClick={()=>_setQteOpen(true)}
                style={{background:'rgba(0,0,0,.85)',border:'1px solid #556',borderRadius:6,
                  padding:'4px 10px',color:'#ffcc44',cursor:'pointer',fontFamily:'monospace',
                  fontSize:10,letterSpacing:1,boxShadow:'0 2px 8px #000'}}>
                ⚔ QTE
              </button>
            )}
            {_qteOpen && (
            <div style={{background:'rgba(0,0,0,.93)',border:'1px solid #556',borderRadius:7,
              padding:'8px 10px',boxShadow:'0 4px 20px #000',width:210,maxHeight:'94vh',overflowY:'auto'}}>
            {/* Header */}
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:7}}>
              <span style={{color:'#ffcc44',fontWeight:'bold',letterSpacing:2,fontSize:10}}>QTE INSPECTOR</span>
              <div style={{display:'flex',gap:5,alignItems:'center'}}>
                <span style={{color:player?'#44ff88':'#ff6666',fontSize:9}}>{player?'● LIVE':'○ INIT'}</span>
                <button onClick={()=>_setQteOpen(false)}
                  style={{background:'none',border:'none',color:'#667',cursor:'pointer',fontSize:12,lineHeight:1,padding:'0 2px'}}>✕</button>
              </div>
            </div>

            {/* Enemy selector */}
            <div style={{marginBottom:6}}>
              <div style={{color:'#667',fontSize:9,letterSpacing:1,marginBottom:2,
                borderBottom:'1px solid #222',paddingBottom:1}}>ENEMY</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:2}}>
                {[
                  {label:'👺 Goblin', id:'goblin', spriteIdx:0},
                  {label:'🐍 Gorgon', id:'gorgon', spriteIdx:0},
                  {label:'🐂 Mino',   id:'minotaur',spriteIdx:3},
                  {label:'🐺 Wolf',   id:'werewolf',spriteIdx:6},
                  {label:'🟢 Boss',   id:'dragon',  spriteIdx:-1},
                ].map(({label,id,spriteIdx})=>{
                  const active = cs?.enemy?.id===id;
                  return (
                    <button key={id} onClick={()=>{
                      const e = ENEMIES[id] || ENEMIES.goblin;
                      const sp = spriteIdx>=0 ? {...ENEMY_SPRITE_POOL[spriteIdx]} : null;
                      setCs(prev=>prev?{...prev,
                        enemy:{...e,id,hp:99999,maxHp:99999},
                        enemySprite:sp, enemyAtkIdx:-1,
                        bossAttackPattern: id==='dragon'?'cleave':null}:prev);
                    }}
                      style={{padding:'2px 5px',fontSize:9,
                        background:active?'#1a2240':'#111',
                        color:active?'#ffcc44':'#999',
                        border:`1px solid ${active?'#ffcc44':'#2a2a2a'}`,
                        borderRadius:3,cursor:'pointer',fontFamily:'monospace'}}>
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* QTE groups */}
            {QTE_GROUPS.map(({label,type,ids})=>(
              <div key={type} style={{marginBottom:6}}>
                <div style={{color: activeType===type ? '#ffcc44':'#667',fontSize:9,
                  letterSpacing:1,marginBottom:2,textTransform:'uppercase',
                  borderBottom:`1px solid ${activeType===type?'#ffcc4444':'#222'}`,paddingBottom:1}}>
                  {label}
                </div>
                <div style={{display:'flex',flexWrap:'wrap',gap:2}}>
                  {ids.map(wid=>{
                    const w  = ALL_WEAPONS[wid];
                    const nm = wid==='__defend' ? 'Defend' : (w?.name||wid);
                    const em = wid==='__defend' ? '🛡' : (w?.emoji||'⚔');
                    const isActive = activeType===type && (wid==='__defend' ? true : activeWpn===wid);
                    return (
                      <button key={wid} onClick={()=>_launchQte(wid)}
                        title={w?.desc||nm}
                        style={{padding:'2px 5px',fontSize:9,
                          background: isActive ? '#1a2240' : '#111',
                          color: isActive ? '#ffcc44' : '#999',
                          border:`1px solid ${isActive?'#ffcc44':'#2a2a2a'}`,
                          borderRadius:3,cursor:'pointer',fontFamily:'monospace',
                          transition:'border-color .1s,background .1s'}}>
                        {em} {nm.split(' ').slice(-1)[0]}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Controls */}
            <div style={{display:'flex',gap:4,marginTop:7}}>
              <button onClick={()=>setQteAnim(null)}
                style={{flex:1,padding:'3px 0',background:'#2a0808',color:'#ff6666',
                  border:'1px solid #661111',borderRadius:3,cursor:'pointer',fontFamily:'monospace',fontSize:9}}>
                ✕ clear
              </button>
              <button onClick={_dbgReset}
                style={{flex:1,padding:'3px 0',background:'#082a08',color:'#66ff88',
                  border:'1px solid #116611',borderRadius:3,cursor:'pointer',fontFamily:'monospace',fontSize:9}}>
                ↺ reset
              </button>
              <button onClick={()=>{ window.location.href='?debug&sheets'; }}
                style={{flex:1,padding:'3px 0',background:'#0a0a2a',color:'#88aaff',
                  border:'1px solid #224488',borderRadius:3,cursor:'pointer',fontFamily:'monospace',fontSize:9}}>
                🖼 sheets
              </button>
              <button onClick={()=>{ window.location.href='?debug&enemies'; }}
                style={{flex:1,padding:'3px 0',background:'#0a1a0a',color:'#88ff88',
                  border:'1px solid #226622',borderRadius:3,cursor:'pointer',fontFamily:'monospace',fontSize:9}}>
                👾 enemies
              </button>
              <button onClick={()=>_setCropOpen(true)}
                style={{flex:1,padding:'3px 0',background:'#1a1a0a',color:'#ffdd88',
                  border:'1px solid #444422',borderRadius:3,cursor:'pointer',fontFamily:'monospace',fontSize:9}}>
                ✏ crop
              </button>
            </div>

            {/* Crop Editor modal — CropEditor renders its own fixed overlay */}
            {_cropOpen && (
              <CropEditor
                sp={cs?.enemySprite || ENEMY_SPRITE_POOL[0]}
                onApply={(crop, spEntry, animFile) => {
                  // Persist into pool entry animCrops keyed by file
                  if (spEntry) {
                    if (!spEntry.animCrops) spEntry.animCrops = {};
                    spEntry.animCrops[animFile] = crop;
                    spEntry.cropX = crop.x; spEntry.cropY = crop.y;
                    spEntry.cropW = crop.w; spEntry.cropH = crop.h;
                    // Save to localStorage for persistence
                    try {
                      const saved = JSON.parse(localStorage.getItem('__animCrops')||'{}');
                      if (!saved[spEntry.variant]) saved[spEntry.variant] = {};
                      saved[spEntry.variant][animFile] = crop;
                      localStorage.setItem('__animCrops', JSON.stringify(saved));
                    } catch(e) {}
                  }
                  // Push live update if this is the active enemy
                  if (cs?.enemySprite?.variant === spEntry?.variant) {
                    setCs(prev => prev ? {...prev, enemySprite:{...prev.enemySprite,
                      cropX:crop.x,cropY:crop.y,cropW:crop.w,cropH:crop.h,
                      animCrops:{...prev.enemySprite?.animCrops,[animFile]:crop}}} : prev);
                  }
                }}
                onClose={()=>_setCropOpen(false)}
              />
            )}

            {/* Randomize hero looks */}
            <button onClick={()=>{
              const looks = randomHeroLooks();
              setPlayer(p => p ? {...p, heroLooks: looks} : p);
              // bust bake cache so new composite is generated
              Object.keys(_bakedSheets).forEach(k => { delete _bakedSheets[k]; });
            }}
              style={{width:'100%',marginTop:4,padding:'4px 0',background:'#1a0a2a',color:'#cc88ff',
                border:'1px solid #553388',borderRadius:3,cursor:'pointer',fontFamily:'monospace',fontSize:9,
                letterSpacing:1}}>
              🎲 randomize looks
            </button>

            {/* Active QTE state readout */}
            {qteAnim && (
              <div style={{marginTop:5,padding:'4px 6px',background:'#080818',borderRadius:3,
                color:'#88aaff',fontSize:9,lineHeight:1.5,fontFamily:'monospace'}}>
                <span style={{color:'#aaccff'}}>type</span>: {qteAnim.type}{'\n'}
                {qteAnim.weapon && <><span style={{color:'#aaccff'}}>wpn </span>: {qteAnim.weapon.name}<br/></>}
                <span style={{color:'#aaccff'}}>t   </span>: {(qteAnim.t||0).toFixed(3)}
                {qteAnim.type==='hold_release'&&<><br/><span style={{color:'#aaccff'}}>chg </span>: {(qteAnim.charge||0).toFixed(2)}</>}
                {qteAnim.type==='rapid_tap'&&<><br/><span style={{color:'#aaccff'}}>taps</span>: {qteAnim.taps||0}/{qteAnim.tapTarget||0}</>}
                {qteAnim.type==='poke'&&<><br/><span style={{color:'#aaccff'}}>hits</span>: {qteAnim.inputs||0}/{qteAnim.tapTarget||0}</>}
                {qteAnim.type==='archery'&&<><br/><span style={{color:'#aaccff'}}>shot</span>: {qteAnim.shotsFired||0}/3</>}
                {qteAnim.type==='dual_action'&&<><br/><span style={{color:'#aaccff'}}>dot </span>: {(qteAnim.dotPos||0).toFixed(2)}</>}
                {(qteAnim.type==='sequence'||qteAnim.type==='sequence_reveal')&&
                  <><br/><span style={{color:'#aaccff'}}>seq </span>: {(qteAnim.seq||[]).join(' ')}</>}
              </div>
            )}

            {/* Hero zoom canvas — live composite of sprite layers */}
            {qteAnim && <canvas id="__dbgZoom" width="1" height="1"
              ref={el=>{
                if(!el)return;
                setTimeout(()=>{
                  const layers=[...document.querySelectorAll('div')].filter(d=>
                    d.style.backgroundImage?.includes('Gandalf')&&d.clientHeight<=70
                  );
                  if(!layers.length)return;
                  const cw=layers[0].clientWidth,ch=layers[0].clientHeight;
                  const sc=4;
                  el.width=cw*sc; el.height=ch*sc;
                  el.style.cssText=`display:block;margin-top:6px;border:1px solid #334;image-rendering:pixelated;width:${cw*sc}px;height:${ch*sc}px;background:#0a0a12`;
                  const ctx=el.getContext('2d'); ctx.imageSmoothingEnabled=false;
                  layers.forEach(layer=>{
                    const lcs=window.getComputedStyle(layer);
                    const sz=lcs.backgroundSize.match(/([\d.]+)px\s+([\d.]+)px/);
                    const pos=lcs.backgroundPosition.match(/(-?[\d.]+)px\s+(-?[\d.]+)px/);
                    if(!sz||!pos)return;
                    const [,sw,sh]=[...sz].map(Number);
                    const [,bpx,bpy]=[...pos].map(Number);
                    const url=layer.style.backgroundImage.replace(/url\(["']?/,'').replace(/["']?\)/,'');
                    const img=new Image();
                    img.onload=()=>{
                      const nw=img.naturalWidth,nh=img.naturalHeight;
                      ctx.drawImage(img,
                        Math.round(-bpx*nw/sw),Math.round(-bpy*nh/sh),
                        Math.round(cw*nw/sw),Math.round(ch*nh/sh),
                        0,0,cw*sc,ch*sc);
                    };
                    img.src=url;
                  });
                },200);
              }}/>
            }
          </div>
            )}
          </div>
        );
      })()}

      {/* ── In-Combat Sprite Frame Overlay — visible at ?debug ── */}
      {window.location.search.includes('debug') && screen==='combat' && (cs?.enemySprite || cs?.enemy?.id==='dragon') && (
        <CombatSpriteOverlay cs={cs} enemyFlash={enemyFlash}/>
      )}

      {/* ── Enemy Sprite Inspector — visible at ?debug&enemies ── */}
      {window.location.search.includes('debug') && window.location.search.includes('enemies') && (() => {
        const ZOOM = 2;
        // One entry per distinct variant (all 9 shown)
        const eGroups = [
          {label:'GORGON',    entries: ENEMY_SPRITE_POOL.slice(0,3)},
          {label:'MINOTAUR',  entries: ENEMY_SPRITE_POOL.slice(3,6)},
          {label:'WEREWOLF',  entries: ENEMY_SPRITE_POOL.slice(6,9)},
        ];

        // Render one sprite sheet (idle or attack) with frame grid + optional crop box
        const SheetView = ({base, file, numFrames, sp, label}) => {
          const src      = `${base}/${file}`;
          const sheetW   = sp.frameW * numFrames * ZOOM;
          const sheetH   = sp.frameH * ZOOM;
          const cropX    = sp.cropX  || 0;
          const cropY    = sp.cropY  || 0;
          const cropW    = sp.cropW  || sp.frameW;
          const cropH    = sp.cropH  || sp.frameH;
          const hasCrop  = !!(sp.cropW || sp.cropH || sp.cropX || sp.cropY);
          return (
            <div style={{marginBottom:8}}>
              <div style={{color:'#888',fontSize:9,marginBottom:3,letterSpacing:1}}>
                {label} — {numFrames} frames · {sp.frameW}×{sp.frameH}px raw
                {hasCrop && <span style={{color:'#44ff88'}}> · crop [{cropX},{cropY},{cropW},{cropH}]</span>}
              </div>
              <div style={{position:'relative',display:'inline-block',border:'1px solid #333',background:'#111'}}>
                <img src={src} style={{imageRendering:'pixelated',display:'block',width:sheetW,height:sheetH}}/>
                <svg style={{position:'absolute',inset:0,pointerEvents:'none',overflow:'visible'}}
                  width={sheetW} height={sheetH}>
                  {/* Frame dividers */}
                  {[...Array(numFrames+1)].map((_,i)=>(
                    <line key={`v${i}`} x1={i*sp.frameW*ZOOM} y1={0} x2={i*sp.frameW*ZOOM} y2={sheetH}
                      stroke="#ffcc4422" strokeWidth="1"/>
                  ))}
                  {/* Crop box per frame (green) */}
                  {hasCrop && [...Array(numFrames)].map((_,i)=>(
                    <rect key={`c${i}`}
                      x={i*sp.frameW*ZOOM + cropX*ZOOM} y={cropY*ZOOM}
                      width={cropW*ZOOM} height={cropH*ZOOM}
                      fill="none" stroke="#44ff8877" strokeWidth="1" strokeDasharray="3,2"/>
                  ))}
                  {/* headPad line per frame (yellow) — where character head starts */}
                  {(sp.headPad||0) > 0 && [...Array(numFrames)].map((_,i)=>(
                    <line key={`hp${i}`}
                      x1={i*sp.frameW*ZOOM} y1={sp.headPad*ZOOM}
                      x2={(i+1)*sp.frameW*ZOOM} y2={sp.headPad*ZOOM}
                      stroke="#ffcc4466" strokeWidth="1" strokeDasharray="3,2"/>
                  ))}
                  {/* groundPad line — character foot baseline (red, from bottom) */}
                  {(sp.groundPad||0) > 0 && [...Array(numFrames)].map((_,i)=>(
                    <line key={`gp${i}`}
                      x1={i*sp.frameW*ZOOM} y1={sheetH - sp.groundPad*ZOOM}
                      x2={(i+1)*sp.frameW*ZOOM} y2={sheetH - sp.groundPad*ZOOM}
                      stroke="#ff443366" strokeWidth="1" strokeDasharray="3,2"/>
                  ))}
                </svg>
              </div>
            </div>
          );
        };

        // Live AnimatedSprite preview using current pool settings
        const LivePreview = ({sp, scale=1.5}) => {
          const cropW = sp.cropW || sp.frameW;
          const cropH = sp.cropH || sp.frameH;
          const dW = Math.round(cropW * scale);
          const dH = Math.round(cropH * scale);
          const iW = Math.round(sp.frameW * scale) * sp.idleFrames;
          const iH = Math.round(sp.frameH * scale);
          const cOX = Math.round((sp.cropX||0) * scale);
          const cOY = Math.round((sp.cropY||0) * scale);
          const base = `${ASSET_BASE}/icons/sprites/${sp.dir}/${sp.variant}`;
          return (
            <div style={{display:'inline-block',verticalAlign:'bottom',background:'#0a0a14',
              border:'1px solid #1e1e30',padding:'4px 8px',marginRight:12}}>
              <div style={{color:'#555',fontSize:8,marginBottom:3,letterSpacing:1,textAlign:'center'}}>
                {sp.variant}
              </div>
              <AnimatedSprite src={`${base}/Idle.png`} numFrames={sp.idleFrames} fps={8}
                displayW={dW} displayH={dH} imgW={iW} imgH={iH} cropOffX={cOX} cropOffY={cOY}/>
            </div>
          );
        };

        return (
          <div style={{position:'fixed',inset:0,background:'#020205',zIndex:99999,
            overflow:'auto',padding:'16px 20px',fontFamily:'monospace'}}>
            {/* Header */}
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
              <div>
                <span style={{fontFamily:'Cinzel',color:'#ff8844',fontSize:13,letterSpacing:2}}>
                  ENEMY SPRITE INSPECTOR
                </span>
                <span style={{color:'#555',fontSize:9,marginLeft:12}}>
                  — — <span style={{color:'#ffcc4488'}}>yellow dashes</span> = headPad
                  {'  '}<span style={{color:'#ff443388'}}>red dashes</span> = groundPad
                  {'  '}<span style={{color:'#44ff8888'}}>green dashes</span> = crop box
                </span>
              </div>
              <button onClick={()=>{ window.history.back(); }}
                style={{background:'#2a0808',color:'#ff6666',border:'1px solid #661111',
                  padding:'4px 14px',fontFamily:'Cinzel',fontSize:11,cursor:'pointer',borderRadius:3}}>
                ✕ CLOSE
              </button>
            </div>

            {eGroups.map(grp => (
              <div key={grp.label} style={{marginBottom:40}}>
                <div style={{fontFamily:'Cinzel',color:'#88aaff',fontSize:11,letterSpacing:3,
                  marginBottom:12,borderBottom:'1px solid #1a1a2a',paddingBottom:6}}>
                  {grp.label}
                </div>

                {/* Live previews — all 3 variants side by side */}
                <div style={{marginBottom:16,display:'flex',flexWrap:'wrap',gap:4,alignItems:'flex-end'}}>
                  {grp.entries.map(sp => <LivePreview key={sp.variant} sp={sp} scale={1.5}/>)}
                </div>

                {/* Sprite sheets for representative entry (index 0 of group) */}
                {(() => {
                  const sp   = grp.entries[0];
                  const base = `${ASSET_BASE}/icons/sprites/${sp.dir}/${sp.variant}`;
                  return (
                    <div>
                      <SheetView base={base} file="Idle.png" numFrames={sp.idleFrames} sp={sp} label="IDLE"/>
                      {(sp.attacks||[]).map((a,i)=><SheetView key={i} base={base} file={a.file} numFrames={a.frames} sp={sp} label={`ATK${i+1}`}/>)}
                      {sp.hurtFile&&<SheetView base={base} file={sp.hurtFile} numFrames={sp.hurtFrames} sp={sp} label="HURT"/>}
                      {sp.deadFile&&<SheetView base={base} file={sp.deadFile} numFrames={sp.deadFrames} sp={sp} label="DEAD"/>}
                      {/* Metadata table */}
                      <div style={{fontSize:9,color:'#666',marginTop:6,lineHeight:'1.6em'}}>
                        <span style={{color:'#aaa'}}>headPad</span>={sp.headPad||0}px
                        {'  '}<span style={{color:'#aaa'}}>groundPad</span>={sp.groundPad||0}px
                        {'  '}<span style={{color:'#aaa'}}>centerOffsetX</span>={sp.centerOffsetX||0}px
                        {'  '}<span style={{color:'#aaa'}}>cropX</span>={sp.cropX||0}
                        {'  '}<span style={{color:'#aaa'}}>cropY</span>={sp.cropY||0}
                        {'  '}<span style={{color:'#aaa'}}>cropW</span>={sp.cropW||sp.frameW}
                        {'  '}<span style={{color:'#aaa'}}>cropH</span>={sp.cropH||sp.frameH}
                      </div>
                    </div>
                  );
                })()}
              </div>
            ))}

            {/* ── BOSS (Demon Slime) — webp GIFs, not sprite sheets ── */}
            <div style={{marginBottom:40}}>
              <div style={{fontFamily:'Cinzel',color:'#ff8844',fontSize:11,letterSpacing:3,
                marginBottom:12,borderBottom:'1px solid #2a1a0a',paddingBottom:6}}>
                BOSS — DEMON SLIME
              </div>
              <div style={{display:'flex',flexWrap:'wrap',gap:20,alignItems:'flex-end'}}>
                {[
                  {label:'IDLE',   file:'01_d_idle.webp'},
                  {label:'WALK',   file:'02_d_walk.webp'},
                  {label:'CLEAVE', file:'03_d_cleave.webp'},
                  {label:'HIT',    file:'04_d_take_hit.webp'},
                  {label:'DEAD',   file:'05_d_death.webp'},
                ].map(({label, file}) => (
                  <div key={file} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:6}}>
                    <div style={{fontSize:9,fontFamily:'Cinzel',color:'#ff8844',letterSpacing:2}}>
                      {label}
                    </div>
                    <img
                      src={`${BOSS_GIF_BASE}/${file}`}
                      width={216} height={120}
                      style={{imageRendering:'pixelated',border:'1px solid #2a1a0a',
                        background:'#080808',display:'block'}}
                    />
                    <div style={{fontSize:8,color:'#555',fontFamily:'monospace'}}>{file}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        );
      })()}

      {/* ── Sprite Sheet Viewer — visible at ?debug&sheets ── */}
      {window.location.search.includes('debug') && window.location.search.includes('sheets') && player?.heroLooks && (() => {
        const looks    = player.heroLooks;
        const cols      = looks.cols      || 10;
        const totalRows = looks.totalRows || 7;
        // Inspector bakes at FULL source frame dimensions (no center-crop) so death
        // frames lying flat aren't clipped. Game bake uses dW=41 (cropped); here we
        // use the raw frameW×frameH so all content is visible.
        const inspDW   = looks.frameW || 80;
        const inspDH   = looks.frameH || 64;
        const ZOOM     = 2;
        const ROW_LABELS = ['IDLE','WALK','RUN','JUMP','FALL','ATK','DEATH'];
        // Bake with srcXOffset=0 / contentW=frameW so centerCrop=0 (no crop)
        const noCropLooks = {...looks, srcXOffset: 0, contentW: inspDW};
        const key     = _bakeKey(noCropLooks, inspDW, inspDH);
        const baked   = typeof _bakedSheets[key] === 'string' ? _bakedSheets[key] : null;
        // Kick off bake if not yet started (frameTick at 120ms will re-render and pick up result)
        if (!baked && !_bakedSheets[key]) {
          _bakedSheets[key] = _bakeHeroSheet(noCropLooks, inspDW, inspDH)
            .then(url => { _bakedSheets[key] = url; });
        }
        // dW/dH aliases for label below
        const dW = inspDW, dH = inspDH;
        const LAYERS  = ['skin','clothing','boots','legs','arms','hair'];

        return (
          <div style={{position:'fixed',inset:0,background:'#020205',zIndex:99999,
            overflow:'auto',padding:'16px 20px',fontFamily:'monospace'}}>
            {/* Header */}
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
              <span style={{fontFamily:'Cinzel',color:'#ffcc44',fontSize:13,letterSpacing:2}}>
                SPRITE SHEET INSPECTOR
              </span>
              <button onClick={()=>{ window.history.back(); }}
                style={{background:'#2a0808',color:'#ff6666',border:'1px solid #661111',
                  padding:'4px 14px',fontFamily:'Cinzel',fontSize:11,cursor:'pointer',borderRadius:3}}>
                ✕ CLOSE
              </button>
            </div>

            {/* ── Baked composite sheet ── */}
            <div style={{marginBottom:24}}>
              <div style={{color:'#88aaff',fontSize:10,marginBottom:6,letterSpacing:1}}>
                BAKED COMPOSITE — all layers merged, {cols}×{totalRows} cells @ {dW}×{dH}px → {ZOOM}x zoom
              </div>
              {baked ? (
                <div style={{position:'relative',display:'inline-block',border:'1px solid #333'}}>
                  <img src={baked} style={{imageRendering:'pixelated',display:'block',
                    width:cols*dW*ZOOM, height:totalRows*dH*ZOOM}}/>
                  <svg style={{position:'absolute',inset:0,pointerEvents:'none',overflow:'visible'}}
                    width={cols*dW*ZOOM} height={totalRows*dH*ZOOM}>
                    {[...Array(cols+1)].map((_,i)=>(
                      <line key={`cv${i}`} x1={i*dW*ZOOM} y1={0} x2={i*dW*ZOOM} y2={totalRows*dH*ZOOM}
                        stroke="#ffcc4455" strokeWidth="1"/>
                    ))}
                    {[...Array(totalRows)].map((_,r)=>(
                      <g key={`rr${r}`}>
                        <line x1={0} y1={r*dH*ZOOM} x2={cols*dW*ZOOM} y2={r*dH*ZOOM}
                          stroke="#ffcc4455" strokeWidth="1"/>
                        <text x={3} y={r*dH*ZOOM+9} fill="#ffcc44cc"
                          fontFamily="monospace" fontSize="8" fontWeight="bold">
                          {ROW_LABELS[r]||r}
                        </text>
                      </g>
                    ))}
                    <line x1={0} y1={totalRows*dH*ZOOM} x2={cols*dW*ZOOM} y2={totalRows*dH*ZOOM}
                      stroke="#ffcc4455" strokeWidth="1"/>
                    {[...Array(cols)].map((_,c)=>(
                      <text key={`cn${c}`} x={c*dW*ZOOM+2} y={totalRows*dH*ZOOM+10}
                        fill="#aaa" fontFamily="monospace" fontSize="7">{c}</text>
                    ))}
                  </svg>
                </div>
              ) : (
                <div style={{color:'#666',fontSize:11}}>Baking… reload if stuck.</div>
              )}
            </div>

            {/* ── Individual layer source sheets ── */}
            <div style={{color:'#88aaff',fontSize:10,marginBottom:10,letterSpacing:1}}>
              SOURCE LAYERS — raw sprite sheets with frame grid
            </div>
            {LAYERS.map(lk => {
              const src = looks[lk];
              if (!src) return null;
              const img = _heroImgEl[src];
              if (!img) return <div key={lk} style={{color:'#555',fontSize:9,marginBottom:8}}>{lk.toUpperCase()} — loading…</div>;
              const nw = img.naturalWidth, nh = img.naturalHeight;
              const fW = nw / cols, fH = nh / totalRows;
              const LZ = Math.min(3, Math.floor(900 / nw)) || 1;
              return (
                <div key={lk} style={{marginBottom:20}}>
                  <div style={{color:'#ccc',fontSize:9,marginBottom:5,letterSpacing:1}}>
                    <span style={{color:'#ffcc44'}}>{lk.toUpperCase()}</span>
                    {' — '}{src.split('/').pop()}
                    {'  '}{nw}×{nh}px · {fW}×{fH} per frame · {LZ}x zoom
                  </div>
                  <div style={{position:'relative',display:'inline-block',border:'1px solid #222'}}>
                    <img src={src} style={{imageRendering:'pixelated',display:'block',
                      width:nw*LZ, height:nh*LZ}}/>
                    <svg style={{position:'absolute',inset:0,pointerEvents:'none'}}
                      width={nw*LZ} height={nh*LZ}>
                      {[...Array(cols+1)].map((_,i)=>(
                        <line key={`lv${i}`} x1={i*fW*LZ} y1={0} x2={i*fW*LZ} y2={nh*LZ}
                          stroke="#ffcc4444" strokeWidth="1"/>
                      ))}
                      {[...Array(totalRows)].map((_,r)=>(
                        <g key={`lr${r}`}>
                          <line x1={0} y1={r*fH*LZ} x2={nw*LZ} y2={r*fH*LZ}
                            stroke="#ffcc4444" strokeWidth="1"/>
                          <text x={3} y={r*fH*LZ+10} fill="#ffcc44bb"
                            fontFamily="monospace" fontSize="9">
                            {ROW_LABELS[r]||r}
                          </text>
                        </g>
                      ))}
                      <line x1={0} y1={nh*LZ} x2={nw*LZ} y2={nh*LZ}
                        stroke="#ffcc4444" strokeWidth="1"/>
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })()}

    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
