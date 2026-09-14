/* Crate School Books - core: DOM helpers, random, save data, sounds, speech, words.
 * Everything hangs off one global, CS. Load order: core.js, pages.js, books/*.js, reader.js */
(function(){
"use strict";
const CS = window.CS = window.CS || {};
CS.VERSION = "1.0.0";
if(!CS.CRATE_URL) CS.CRATE_URL = "crate.html";
CS.W = 480; CS.H = 680;            // design size of one book page, in px
CS.books = [];
CS.addBook = function(b){ CS.books.push(b); };

/* ===================== DOM ===================== */
function h(tag, attrs){
  const n = document.createElement(tag);
  if(attrs) for(const k in attrs){
    const v = attrs[k];
    if(v == null || v === false) continue;
    if(k === "class") n.className = v;
    else if(k === "text") n.textContent = v;
    else if(k === "html") n.innerHTML = v;
    else if(k === "style" && typeof v === "object") Object.assign(n.style, v);
    else if(k.slice(0,2) === "on" && typeof v === "function") n.addEventListener(k.slice(2), v);
    else n.setAttribute(k, v === true ? "" : v);
  }
  for(let i = 2; i < arguments.length; i++) add(n, arguments[i]);
  return n;
}
function add(n, kid){
  if(kid == null || kid === false) return;
  if(Array.isArray(kid)) kid.forEach(k => add(n, k));
  else n.appendChild(typeof kid === "object" ? kid : document.createTextNode(String(kid)));
}
CS.h = h;
CS.$ = (sel, root) => (root || document).querySelector(sel);
CS.$$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

/* ===================== RANDOM + LISTS ===================== */
const rnd = CS.rnd = n => Math.floor(Math.random() * n);
CS.pick = a => a[rnd(a.length)];
CS.shuffle = function(a){
  const b = a.slice();
  for(let i = b.length - 1; i > 0; i--){ const j = rnd(i + 1); const t = b[i]; b[i] = b[j]; b[j] = t; }
  return b;
};
CS.range = (a, b, step) => { const o = []; for(let i = a; i <= b; i += (step || 1)) o.push(i); return o; };
CS.chunk = (a, n) => { const o = []; for(let i = 0; i < a.length; i += n) o.push(a.slice(i, i + n)); return o; };
CS.fmt = (s, v) => String(s).replace(/\{(\w+)\}/g, (m, k) => (v && v[k] != null) ? v[k] : m);
CS.isPic = s => typeof s === "string" && /\p{Extended_Pictographic}/u.test(s);
CS.graphemes = function(s){
  try{
    if(window.Intl && Intl.Segmenter)
      return Array.from(new Intl.Segmenter(undefined, {granularity:"grapheme"}).segment(s), x => x.segment);
  }catch(e){}
  return Array.from(s);
};
CS.clamp = (v, a, b) => Math.max(a, Math.min(b, v));
CS.wait = ms => new Promise(r => setTimeout(r, ms));

/* Gurmukhi -> Devanagari, so a Hindi voice can read Punjabi when the device has no
 * Punjabi voice. The two Unicode blocks are parallel (offset 0x100); addak doubles
 * the next consonant. */
function g1(c){
  const cp = c.codePointAt(0);
  if(cp === 0x0A70) return "ं";
  if(cp === 0x0A72) return "इ";
  if(cp === 0x0A73) return "उ";
  if(cp >= 0x0A01 && cp <= 0x0A6F) return String.fromCodePoint(cp - 0x100);
  return c;
}
CS.g2d = function(s){
  const a = Array.from(String(s)); let out = "";
  for(let i = 0; i < a.length; i++){
    if(a[i].codePointAt(0) === 0x0A71){ if(a[i+1]) out += g1(a[i+1]) + "्"; continue; }
    out += g1(a[i]);
  }
  return out;
};

/* ===================== SAVE DATA ===================== */
const KEY = "crate-books-v1";
function blank(){
  return {v:1, cur:null, profiles:[], prog:{},
          set:{sound:true, helper:"off", breaks:true, notes:false}};
}
let S = blank();
try{
  const raw = localStorage.getItem(KEY);
  if(raw){
    const p = JSON.parse(raw);
    if(p && p.v === 1){ S = Object.assign(blank(), p); S.set = Object.assign(blank().set, p.set || {}); }
  }
}catch(e){}
function persist(){ try{ localStorage.setItem(KEY, JSON.stringify(S)); }catch(e){} }

const store = CS.store = {
  data: () => S,
  save: persist,
  get set(){ return S.set; },
  profiles: () => S.profiles,
  who(){ return S.profiles.find(p => p.id === S.cur) || S.profiles[0]; },
  choose(id){ S.cur = id; persist(); },
  addProfile(name, av){
    const p = {id:"r" + Date.now().toString(36) + rnd(1e4), name:String(name).slice(0,24), av:av || "🧒🏽"};
    S.profiles.push(p); S.cur = p.id; persist(); return p;
  },
  editProfile(id, name, av){
    const p = S.profiles.find(x => x.id === id); if(!p) return;
    if(name) p.name = String(name).slice(0,24);
    if(av) p.av = av;
    persist();
  },
  removeProfile(id){
    if(S.profiles.length < 2) return false;
    S.profiles = S.profiles.filter(p => p.id !== id); delete S.prog[id];
    if(S.cur === id) S.cur = S.profiles[0].id;
    persist(); return true;
  },
  book(bookId){
    const w = store.who();
    const P = S.prog[w.id] = S.prog[w.id] || {};
    return P[bookId] = P[bookId] || {pages:{}, stickers:{}, last:1, secs:0};
  },
  rec: (bookId, pid) => store.book(bookId).pages[pid] || null,
  record(bookId, pid, stars, score){
    const b = store.book(bookId);
    const r = b.pages[pid] || (b.pages[pid] = {tries:0});
    const before = r.stars || 0;
    r.tries++; r.done = true; r.at = Date.now();
    if(stars != null) r.stars = Math.max(before, stars);
    if(score != null){ r.best = Math.max(r.best || 0, score); r.lastScore = score; }
    persist();
    return {rec:r, improved:(r.stars || 0) > before};
  },
  sticker(bookId, chId){
    const b = store.book(bookId);
    if(b.stickers[chId]) return false;
    b.stickers[chId] = Date.now(); persist(); return true;
  },
  resetBook(bookId){ const w = store.who(); if(S.prog[w.id]) delete S.prog[w.id][bookId]; persist(); },
  resetWho(){ const w = store.who(); delete S.prog[w.id]; persist(); }
};
if(!S.profiles.length){ store.addProfile("Manreet", "👧🏽"); }
if(!S.cur) store.choose(S.profiles[0].id);

/* ===================== SOUND EFFECTS ===================== */
let actx = null;
function ac(){
  if(!actx){ try{ actx = new (window.AudioContext || window.webkitAudioContext)(); }catch(e){} }
  if(actx && actx.state === "suspended"){ try{ actx.resume(); }catch(e){} }
  return actx;
}
function tone(freq, dur, type, vol){
  if(!S.set.sound) return;
  const c = ac(); if(!c) return;
  try{
    const o = c.createOscillator(), g = c.createGain();
    o.type = type || "triangle"; o.frequency.value = freq;
    g.gain.setValueAtTime(vol == null ? 0.06 : vol, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
    o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime + dur + 0.02);
  }catch(e){}
}
function swoosh(){
  if(!S.set.sound) return;
  const c = ac(); if(!c) return;
  try{
    const len = Math.floor(c.sampleRate * 0.32), buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
    for(let i = 0; i < len; i++){ const t = i / len; d[i] = (Math.random() * 2 - 1) * Math.sin(Math.PI * t) * 0.5; }
    const src = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    src.buffer = buf; f.type = "bandpass"; f.frequency.value = 1400; f.Q.value = 0.7; g.gain.value = 0.22;
    src.connect(f); f.connect(g); g.connect(c.destination); src.start();
  }catch(e){}
}
CS.tone = tone;
CS.sfx = {
  tap(){ tone(760, .05, "triangle", .045); },
  good(){ tone(660, .1, "triangle", .07); setTimeout(() => tone(990, .16, "triangle", .07), 90); },
  bad(){ tone(240, .2, "sine", .09); },
  pop(){ tone(1100, .04, "square", .04); tone(320, .09, "sine", .07); },
  flip: swoosh,
  win(){ [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => tone(f, .22, "triangle", .07), i * 120)); },
  unlock: () => ac()
};

/* ===================== SPEECH ===================== */
let VOICES = [];
function loadVoices(){ try{ VOICES = speechSynthesis.getVoices() || []; }catch(e){ VOICES = []; } }
try{ loadVoices(); speechSynthesis.onvoiceschanged = () => { loadVoices(); for(const k in vcache) delete vcache[k]; }; }catch(e){}
const LANG = {en:"en-GB", hi:"hi-IN", pa:"pa-IN"};
const MALE = /daniel|arthur|oliver|george|james|rishi|\bmale|alex|fred|gordon|graham|ravi|hemant|aman|reed|rocko|eddy|grandpa/i;
const WANT = {
  "en-GB":[/google uk english female/i, /serena/i, /kate/i, /martha/i, /stephanie/i, /libby/i, /sonia/i, /shelley/i, /flo/i, /sandy/i, /female/i],
  "hi-IN":[/google हिन्दी/i, /lekha/i, /swara/i, /kalpana/i, /female/i],
  "pa-IN":[/ਪੰਜਾਬੀ/i, /punjabi/i, /female/i]
};
const vcache = {};
function pickVoice(lang){
  if(vcache[lang] !== undefined) return vcache[lang];
  if(!VOICES.length) loadVoices();
  const two = lang.slice(0,2).toLowerCase();
  const norm = v => (v.lang || "").replace("_","-").toLowerCase();
  const family = VOICES.filter(v => norm(v).indexOf(two) === 0);
  const exact = family.filter(v => norm(v) === lang.toLowerCase());
  const pool = exact.length ? exact : family;
  let hit = null;
  (WANT[lang] || []).some(rx => { hit = pool.find(v => rx.test(v.name)); return !!hit; });
  if(!hit) hit = pool.find(v => !MALE.test(v.name)) || pool[0] || null;
  if(VOICES.length) vcache[lang] = hit;
  return hit;
}
CS.hasVoice = lang => !!pickVoice(LANG[lang] || lang);

let gen = 0;       // bumps whenever something new starts talking; read-along loops watch it
CS.sayGen = () => gen;
CS.stopSay = function(){ gen++; try{ speechSynthesis.cancel(); }catch(e){} };
/* say(text, lang, {seq, rate}) -> Promise that resolves when speech ends.
 * seq:true is for read-along loops, which must not cancel themselves. */
CS.say = function(text, lang, o){
  o = o || {};
  if(!o.seq) gen++;
  return new Promise(resolve => {
    if(!S.set.sound || !text || !("speechSynthesis" in window)){ resolve(); return; }
    let done = false, timer = 0;
    const fin = () => { if(!done){ done = true; clearTimeout(timer); resolve(); } };
    try{
      speechSynthesis.cancel();
      const L = lang || "en";
      let tx = String(text), vl = LANG[L] || L;
      if(L === "pa" && !pickVoice("pa-IN")){ tx = CS.g2d(tx); vl = "hi-IN"; }
      const u = new SpeechSynthesisUtterance(tx), v = pickVoice(vl);
      if(v){ u.voice = v; u.lang = v.lang; } else u.lang = vl;
      u.rate = o.rate || (L === "en" ? 0.92 : 0.86);
      u.pitch = o.pitch || 1.1;
      u.onend = fin; u.onerror = fin;
      speechSynthesis.speak(u);
      timer = setTimeout(fin, 1800 + tx.length * 120);
    }catch(e){ fin(); }
  });
};

/* ===================== WORDS ===================== */
const WORDS = {
  en:{again:"Play again", next:"Next page", listenAll:"Listen to all", clear:"Clear", check:"Check",
      start:"Start", nextOne:"Next", chapter:"Chapter", page:"Page", inChapter:"In this chapter we will",
      grownups:"For grown-ups", atHome:"Try at home", sticker:"You won a sticker!",
      tryAgain:"Oops! Look again.", itIs:"It is {a}.", keepGoing:"Keep going! Cover all the grey.",
      stayOn:"Try to stay on the letter.", find:"Find {t}", singAlong:"Sing along", done:"Done!",
      popGoal:"Pop every {t}", popMake:"Pop balloons that make {t}", popped:"{n} of {g}",
      score:"{a} out of {b} right", learnDone:"You heard them all!", countHint:"Touch each one and count out loud.",
      hint:"Look again carefully.", perfect:"Perfect!", good:"Good work!", practise:"Let's practise once more.",
      goodTry:"Good try!", yourTurn:"Your turn to play!", colourPick:"Pick a crayon, then tap the picture.",
      wrongColour:"Hmm, not that colour. {t}", tapCard:"Tap two cards to find a pair.", moves:"Moves: {n}"},
  hi:{again:"फिर से खेलो", next:"अगला पन्ना", listenAll:"सब सुनो", clear:"मिटाओ", check:"जाँचो",
      start:"शुरू करो", nextOne:"अगला", chapter:"पाठ", page:"पन्ना", inChapter:"इस पाठ में हम सीखेंगे",
      grownups:"बड़ों के लिए", atHome:"घर पर करें", sticker:"तुम्हें स्टिकर मिला!",
      tryAgain:"ओह! फिर से देखो।", itIs:"सही उत्तर है {a}।", keepGoing:"बढ़ते रहो! पूरा अक्षर भरो।",
      stayOn:"अक्षर के ऊपर ही लिखो।", find:"{t} ढूँढो", singAlong:"साथ में गाओ", done:"हो गया!",
      popGoal:"हर {t} को फोड़ो", popMake:"वे गुब्बारे फोड़ो जो {t} बनाते हैं", popped:"{g} में से {n}",
      score:"{b} में से {a} सही", learnDone:"तुमने सब सुन लिया!", countHint:"हर एक को छूकर गिनो।",
      hint:"ध्यान से फिर देखो।", perfect:"एकदम सही!", good:"अच्छा काम!", practise:"चलो एक बार और अभ्यास करें।",
      goodTry:"अच्छी कोशिश!", yourTurn:"अब तुम्हारी बारी!", colourPick:"रंग चुनो, फिर चित्र को छुओ।",
      wrongColour:"यह रंग नहीं। {t}", tapCard:"दो पत्ते खोलो और जोड़ी ढूँढो।", moves:"चालें: {n}"},
  pa:{again:"ਫਿਰ ਖੇਡੋ", next:"ਅਗਲਾ ਸਫ਼ਾ", listenAll:"ਸਾਰੇ ਸੁਣੋ", clear:"ਮਿਟਾਓ", check:"ਜਾਂਚੋ",
      start:"ਸ਼ੁਰੂ ਕਰੋ", nextOne:"ਅਗਲਾ", chapter:"ਪਾਠ", page:"ਸਫ਼ਾ", inChapter:"ਇਸ ਪਾਠ ਵਿੱਚ ਅਸੀਂ ਸਿੱਖਾਂਗੇ",
      grownups:"ਵੱਡਿਆਂ ਲਈ", atHome:"ਘਰ ਵਿੱਚ ਕਰੋ", sticker:"ਤੁਹਾਨੂੰ ਸਟਿੱਕਰ ਮਿਲਿਆ!",
      tryAgain:"ਓਹ! ਫਿਰ ਦੇਖੋ।", itIs:"ਸਹੀ ਜਵਾਬ ਹੈ {a}।", keepGoing:"ਲਿਖਦੇ ਰਹੋ! ਸਾਰਾ ਅੱਖਰ ਭਰੋ।",
      stayOn:"ਅੱਖਰ ਦੇ ਉੱਤੇ ਹੀ ਲਿਖੋ।", find:"{t} ਲੱਭੋ", singAlong:"ਨਾਲ ਗਾਓ", done:"ਹੋ ਗਿਆ!",
      popGoal:"ਹਰ {t} ਫੋੜੋ", popMake:"ਉਹ ਗੁਬਾਰੇ ਫੋੜੋ ਜੋ {t} ਬਣਾਉਂਦੇ ਹਨ", popped:"{g} ਵਿੱਚੋਂ {n}",
      score:"{b} ਵਿੱਚੋਂ {a} ਸਹੀ", learnDone:"ਤੁਸੀਂ ਸਾਰੇ ਸੁਣ ਲਏ!", countHint:"ਹਰ ਇੱਕ ਨੂੰ ਛੂਹ ਕੇ ਗਿਣੋ।",
      hint:"ਧਿਆਨ ਨਾਲ ਫਿਰ ਦੇਖੋ।", perfect:"ਬਿਲਕੁਲ ਸਹੀ!", good:"ਵਧੀਆ ਕੰਮ!", practise:"ਆਓ ਇੱਕ ਵਾਰ ਹੋਰ ਅਭਿਆਸ ਕਰੀਏ।",
      goodTry:"ਵਧੀਆ ਕੋਸ਼ਿਸ਼!", yourTurn:"ਹੁਣ ਤੁਹਾਡੀ ਵਾਰੀ!", colourPick:"ਰੰਗ ਚੁਣੋ, ਫਿਰ ਤਸਵੀਰ ਦਬਾਓ।",
      wrongColour:"ਇਹ ਰੰਗ ਨਹੀਂ। {t}", tapCard:"ਦੋ ਪੱਤੇ ਖੋਲ੍ਹੋ ਅਤੇ ਜੋੜਾ ਲੱਭੋ।", moves:"ਚਾਲਾਂ: {n}"}
};
CS.T = (lang, key, vars) => CS.fmt((WORDS[lang] || WORDS.en)[key] || WORDS.en[key] || key, vars);

const PRAISE = {
  en:["Well done!", "Super!", "Yes, that's right!", "Brilliant!", "Great job!", "You got it!"],
  hi:["शाबाश!", "बहुत बढ़िया!", "सही जवाब!", "वाह!", "कमाल!"],
  pa:["ਸ਼ਾਬਾਸ਼!", "ਬਹੁਤ ਵਧੀਆ!", "ਸਹੀ ਜਵਾਬ!", "ਕਮਾਲ!", "ਵਾਹ!"]
};
CS.praise = lang => CS.pick(PRAISE[lang] || PRAISE.en);

/* what each kind of page asks the child to do, read aloud when the page opens */
CS.INST = {
  en:{learn:"Tap a picture to hear it.", chart:"Tap a number to hear it.", trace:"Trace it with your finger.",
      mcq:"Choose the right answer.", match:"Match the pairs.", sort:"Put each one in the right basket.",
      dots:"Join the dots in order.", memory:"Find the matching cards.", pop:"Pop the right balloons.",
      colour:"Colour the picture.", rhyme:"Listen and sing along.", quiz:"Check yourself! Choose the right answer.",
      crate:"Play the crate game.", doodle:"Draw anything you like!"},
  hi:{learn:"चित्र को छूकर सुनो।", chart:"संख्या को छूकर सुनो।", trace:"उँगली से ऊपर लिखो।",
      mcq:"सही उत्तर चुनो।", match:"सही जोड़ी मिलाओ।", sort:"हर चीज़ को सही टोकरी में डालो।",
      dots:"क्रम से बिंदु मिलाओ।", memory:"एक जैसे पत्ते ढूँढो।", pop:"सही गुब्बारे फोड़ो।",
      colour:"चित्र में रंग भरो।", rhyme:"सुनो और साथ में गाओ।", quiz:"अपनी जाँच करो! सही उत्तर चुनो।",
      crate:"क्रेट खेल खेलो।", doodle:"जो मन करे, वह बनाओ!"},
  pa:{learn:"ਸੁਣਨ ਲਈ ਤਸਵੀਰ ਦਬਾਓ।", chart:"ਸੁਣਨ ਲਈ ਨੰਬਰ ਦਬਾਓ।", trace:"ਉਂਗਲ ਨਾਲ ਉੱਤੇ ਲਿਖੋ।",
      mcq:"ਸਹੀ ਜਵਾਬ ਚੁਣੋ।", match:"ਜੋੜੇ ਮਿਲਾਓ।", sort:"ਹਰ ਚੀਜ਼ ਸਹੀ ਟੋਕਰੀ ਵਿੱਚ ਪਾਓ।",
      dots:"ਕ੍ਰਮ ਵਿੱਚ ਬਿੰਦੂ ਜੋੜੋ।", memory:"ਇੱਕੋ ਜਿਹੇ ਪੱਤੇ ਲੱਭੋ।", pop:"ਸਹੀ ਗੁਬਾਰੇ ਫੋੜੋ।",
      colour:"ਤਸਵੀਰ ਵਿੱਚ ਰੰਗ ਭਰੋ।", rhyme:"ਸੁਣੋ ਅਤੇ ਨਾਲ ਗਾਓ।", quiz:"ਆਪਣੀ ਜਾਂਚ ਕਰੋ! ਸਹੀ ਜਵਾਬ ਚੁਣੋ।",
      crate:"ਕਰੇਟ ਖੇਡ ਖੇਡੋ।", doodle:"ਜੋ ਮਰਜ਼ੀ ਬਣਾਓ!"}
};

CS.starsFor = ratio => ratio >= 0.9 ? 3 : ratio >= 0.6 ? 2 : 1;
CS.starRow = function(n, max){
  max = max || 3;
  const w = h("span", {class:"stars"});
  for(let i = 0; i < max; i++) w.appendChild(h("span", {class:"star" + (i < n ? "" : " off"), style:{animationDelay:(i * 0.15) + "s"}}, "★"));
  return w;
};

/* ===================== FX ===================== */
function fxLayer(){
  let l = document.getElementById("fx");
  if(!l){ l = h("div", {id:"fx"}); document.body.appendChild(l); }
  return l;
}
CS.confetti = function(n){
  if(matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const layer = fxLayer(), cols = ["#ffcf33","#ff5a7a","#39c46c","#3b8cff","#b76cff","#ff9a2e"];
  for(let i = 0; i < (n || 60); i++){
    const c = h("i", {class:"conf", style:{background:CS.pick(cols), left:(Math.random() * 100) + "vw"}});
    layer.appendChild(c);
    const x = (Math.random() - 0.5) * 200;
    c.animate([{transform:"translate(0,-20px) rotate(0)"},
               {transform:"translate(" + x + "px," + (innerHeight + 40) + "px) rotate(" + (rnd(900) - 450) + "deg)"}],
              {duration:1800 + rnd(1400), easing:"cubic-bezier(.25,.6,.45,1)"}).onfinish = () => c.remove();
  }
};
CS.toast = function(msg, ms){
  const layer = fxLayer(), t = h("div", {class:"toast"}, msg);
  layer.appendChild(t);
  setTimeout(() => { t.classList.add("out"); setTimeout(() => t.remove(), 400); }, ms || 2200);
};
CS.shake = el => { el.classList.remove("shake"); void el.offsetWidth; el.classList.add("shake"); };
CS.bump = el => { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); };
})();
