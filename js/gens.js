/* Crate School Books - question generators and shared item rendering.
 * A generator is GEN.name(args, lang) and returns one question:
 *   {key, ask, say, vis, opts:[{t, pic, n, sw, shape, say}], ans, hint, reveal, tall}
 * Book files pick generators by name, so the same "picWord" works for English, हिंदी and ਪੰਜਾਬੀ. */
(function(){
"use strict";
const CS = window.CS, h = CS.h, rnd = CS.rnd, pick = CS.pick, shuffle = CS.shuffle;
const GEN = CS.GEN = {};

/* ---------- shared helpers ---------- */
CS.choices = function(correct, pool, key, n){
  key = key || (x => x); n = n || 4;
  const seen = new Set([key(correct)]), out = [correct];
  for(const x of shuffle(pool)){
    if(out.length >= n) break;
    const k = key(x);
    if(!seen.has(k)){ seen.add(k); out.push(x); }
  }
  const list = shuffle(out);
  return {list, ans:list.indexOf(correct)};
};
const choices = CS.choices;
function near(ans, lo, hi, k){
  const s = new Set([ans]); let g = 0;
  while(s.size < k && g++ < 80){ const d = ans + (rnd(2) ? 1 : -1) * (1 + rnd(3)); if(d >= lo && d <= hi) s.add(d); }
  for(let x = lo; s.size < k && x <= hi + 10; x++) s.add(x);
  return shuffle([...s]);
}
CS.near = near;
/* an item can be written as "🍎", "cat", or {t, pic, n, sw, shape, say} */
CS.norm = function(x){
  if(x && typeof x === "object") return x;
  const s = String(x);
  return CS.isPic(s) && CS.graphemes(s).length <= 2 ? {pic:s} : {t:s};
};
const SHAPES = {
  circle:'<circle cx="50" cy="50" r="40"/>',
  square:'<rect x="13" y="13" width="74" height="74" rx="3"/>',
  triangle:'<path d="M50 10 L92 86 H8 Z"/>',
  rectangle:'<rect x="5" y="27" width="90" height="46" rx="3"/>',
  oval:'<ellipse cx="50" cy="50" rx="45" ry="28"/>',
  star:'<path d="M50 6 L62 38 L96 38 L68 58 L79 92 L50 71 L21 92 L32 58 L4 38 L38 38 Z"/>',
  heart:'<path d="M50 88 C20 66 6 48 6 32 C6 18 18 8 30 8 C40 8 47 14 50 22 C53 14 60 8 70 8 C82 8 94 18 94 32 C94 48 80 66 50 88Z"/>',
  diamond:'<path d="M50 6 L90 50 L50 94 L10 50Z"/>'
};
CS.shapeSVG = function(k, color, size){
  return h("span", {class:"shp", html:'<svg viewBox="0 0 100 100" width="' + size + '" height="' + size + '"><g fill="' +
    (color || "var(--main)") + '" stroke="rgba(0,0,0,.4)" stroke-width="3" stroke-linejoin="round">' + (SHAPES[k] || SHAPES.circle) + "</g></svg>"});
};
/* render an item inside a button-like element */
CS.itemEl = function(o, tag, cls){
  o = CS.norm(o);
  const b = h(tag || "button", {class:cls || "opt", type:tag === "div" ? null : "button"});
  if(o.sw) b.appendChild(h("span", {class:"osw", style:{background:o.sw}}));
  if(o.shape) b.appendChild(CS.shapeSVG(o.shape, o.color, o.size || 58));
  if(o.pic && o.n) b.appendChild(h("span", {class:"mini"}, Array(o.n).fill(o.pic).join("")));
  else if(o.pic) b.appendChild(h("span", {class:"opic"}, o.pic));
  if(o.t != null){
    const len = CS.graphemes(String(o.t)).length;
    b.appendChild(h("span", {class:"otx"}, o.t));
    if(len > 2) b.classList.add("txt");
    if(len > 8) b.classList.add("long");
  }
  return b;
};
CS.itemSay = o => { o = CS.norm(o); return o.say || (o.t != null ? String(o.t) : o.n ? String(o.n) : ""); };

/* ---------- ask text: [shown, spoken] per language ---------- */
const ASK = {
  count:{en:["How many?","How many are there?"], hi:["कितने हैं?"], pa:["ਕਿੰਨੇ ਹਨ?"]},
  more:{en:["Which group has more?"], hi:["किसमें ज़्यादा हैं?"], pa:["ਕਿਸ ਵਿੱਚ ਜ਼ਿਆਦਾ ਹਨ?"]},
  less:{en:["Which group has less?"], hi:["किसमें कम हैं?"], pa:["ਕਿਸ ਵਿੱਚ ਘੱਟ ਹਨ?"]},
  moreHint:{en:["Count both groups, then compare."], hi:["दोनों को गिनो, फिर देखो।"], pa:["ਦੋਵੇਂ ਗਿਣੋ, ਫਿਰ ਦੇਖੋ।"]},
  after:{en:["What comes just after?","What number comes just after {n}?"]},
  afterHint:{en:["Count on: say {n}, then the next number."]},
  before:{en:["What comes just before?","What number comes just before {n}?"]},
  beforeHint:{en:["Count back from {n}."]},
  between:{en:["What comes in between?","What number comes between {a} and {b}?"]},
  betweenHint:{en:["Count from {a}. What do you say next?"]},
  gap:{en:["Which number is missing?"]},
  bigger:{en:["Tap the BIGGER number","Which number is bigger?"]},
  smaller:{en:["Tap the SMALLER number","Which number is smaller?"]},
  biggerHint:{en:["Bigger numbers come later when we count."]},
  smallerHint:{en:["Smaller numbers come first when we count."]},
  symbol:{en:["Which sign goes in the box?"]},
  symbolHint:{en:["The hungry crocodile 🐊 opens its mouth to the bigger number."]},
  add:{en:["How many in all?","{x} and {y} more. How many in all?"]},
  addHint:{en:["Count all of them together."]},
  sub:{en:["How many are left?","{x} take away {y}. How many are left?"]},
  subHint:{en:["Count only the ones that are not crossed out."]},
  addNum:{en:["Add the numbers","{x} plus {y} makes?"]},
  subNum:{en:["Take away","{x} minus {y} makes?"]},
  skip:{en:["What comes next?","Count in {s}s. What comes next?"]},
  skipHint:{en:["Jump {s} more each time."]},
  table:{en:["Times tables","{x} times {y} makes?"]},
  tableHint:{en:["Count in {x}s, {y} times."]},
  numWord:{en:["Find the number name"], hi:["इस संख्या का नाम चुनो"], pa:["ਇਸ ਨੰਬਰ ਦਾ ਨਾਂ ਚੁਣੋ"]},
  wordNum:{en:["Find the number"], hi:["सही संख्या चुनो"], pa:["ਸਹੀ ਨੰਬਰ ਚੁਣੋ"]},
  shapeName:{en:["What shape is this?"]},
  shapeFind:{en:["Find the {w}"]},
  shapeReal:{en:["What shape is it like?"]},
  pattern:{en:["What comes next?"], hi:["आगे क्या आएगा?"], pa:["ਅੱਗੇ ਕੀ ਆਵੇਗਾ?"]},
  patternHint:{en:["Find the part that repeats, and say it out loud."], hi:["जो बार-बार आता है, उसे ढूँढो।"], pa:["ਜੋ ਵਾਰ-ਵਾਰ ਆਉਂਦਾ ਹੈ, ਉਹ ਲੱਭੋ।"]},
  picWord:{en:["What is this?"], hi:["यह क्या है?"], pa:["ਇਹ ਕੀ ਹੈ?"]},
  wordPic:{en:["Which picture is {w}?"], hi:["{w} कौन सा है?"], pa:["{w} ਕਿਹੜਾ ਹੈ?"]},
  firstLetter:{en:["Which letter does it start with?","{w}. Which letter does {w} start with?"],
               hi:["यह किस अक्षर से शुरू होता है?","{w}। {w} किस अक्षर से शुरू होता है?"],
               pa:["ਇਹ ਕਿਸ ਅੱਖਰ ਨਾਲ ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ?","{w}। {w} ਕਿਸ ਅੱਖਰ ਨਾਲ ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ?"]},
  firstHint:{en:["Say the word slowly: {w}."], hi:["शब्द धीरे से बोलो: {w}"], pa:["ਸ਼ਬਦ ਹੌਲੀ ਬੋਲੋ: {w}"]},
  letterPic:{en:["Which one starts with {l}?"], hi:["{l} से क्या शुरू होता है?"], pa:["{l} ਨਾਲ ਕੀ ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ?"]},
  forFmt:{en:["{l} for {w}"], hi:["{l} से {w}"], pa:["{l} ਤੋਂ {w}"]},
  seqGap:{en:["What comes in between?"], hi:["बीच में क्या आएगा?"], pa:["ਵਿਚਕਾਰ ਕੀ ਆਵੇਗਾ?"]},
  seqNext:{en:["What comes next?"], hi:["आगे क्या आएगा?"], pa:["ਅੱਗੇ ਕੀ ਆਵੇਗਾ?"]},
  seqHint:{en:["Say them in order."], hi:["क्रम से बोलो।"], pa:["ਕ੍ਰਮ ਵਿੱਚ ਬੋਲੋ।"]},
  swName:{en:["What colour is this?"], hi:["यह कौन सा रंग है?"], pa:["ਇਹ ਕਿਹੜਾ ਰੰਗ ਹੈ?"]},
  nameSw:{en:["Find {w}"], hi:["{w} रंग ढूँढो"], pa:["{w} ਰੰਗ ਲੱਭੋ"]},
  glyphName:{en:["What is this letter called?"], hi:["इस अक्षर का नाम क्या है?"], pa:["ਇਸ ਅੱਖਰ ਦਾ ਨਾਂ ਕੀ ਹੈ?"]},
  nameGlyph:{en:["Which letter is it?","{nm}. Which letter is {nm}?"], hi:["कौन सा अक्षर है?","{nm}। कौन सा अक्षर {nm} है?"],
             pa:["ਕਿਹੜਾ ਅੱਖਰ ਹੈ?","{nm}। ਕਿਹੜਾ ਅੱਖਰ {nm} ਹੈ?"]},
  caseMatch:{en:["Find the small letter","Find small {l}."]},
  caseHint:{en:["Capital {l} and small {s} have the same name."]},
  missing:{en:["Which letter is missing?","Which letter is missing in {w}?"], hi:["कौन सा अक्षर छूट गया?","{w}। कौन सा अक्षर छूट गया?"],
           pa:["ਕਿਹੜਾ ਅੱਖਰ ਗਾਇਬ ਹੈ?","{w}। ਕਿਹੜਾ ਅੱਖਰ ਗਾਇਬ ਹੈ?"]},
  missHint:{en:["Say it slowly: {w}."], hi:["धीरे से बोलो: {w}"], pa:["ਹੌਲੀ ਬੋਲੋ: {w}"]},
  rhyme:{en:["Which word rhymes with {w}?"]},
  rhymeHint:{en:["Rhyming words sound the same at the end, like cat and hat."]},
  opposite:{en:["What is the opposite of {w}?"]},
  sound:{en:["Who says {s}?"]},
  soundHint:{en:["Make the sound yourself: {s}!"]},
  famWord:{en:["Which word is in the -{e} family?","Which word is in the {e} family?"]},
  famHint:{en:["Every word in this family ends with -{e}."]},
  famPick:{en:["Which family does it belong to?","{w}. Which family does {w} belong to?"]},
  famPickHint:{en:["Listen to the end of the word: {w}."]},
  digraph:{en:["Which sound is missing?","Which sound is missing in {w}? Is it ch or sh?"]},
  digraphHint:{en:["Say it slowly and listen: {w}."]},
  nearWord:{en:["Which word is it?"]},
  nearHint:{en:["Listen to the middle sound. It is the vowel that changes."]},
  spell:{en:["Tap 🔊, then find the word","Listen. {w}. Which one says {w}?"]},
  spellHint:{en:["Tap the speaker again and say the sounds one by one."]},
  blend:{en:["Put the sounds together. Which word is it?","{s}. Which word is it?"]},
  blendHint:{en:["Say them faster and faster until they join up."]}
};
function A(key, lang, args, vars, spoken){
  if(args && args[spoken ? "sayAsk" : "ask"]) return CS.fmt(args[spoken ? "sayAsk" : "ask"], vars);
  if(spoken && args && args.ask) return CS.fmt(args.ask, vars);
  const e = ASK[key]; if(!e) return "";
  const pair = e[lang] || e.en;
  return CS.fmt(spoken && pair[1] ? pair[1] : pair[0], vars);
}
function Q(key, lang, args, vars, rest){
  return Object.assign({ask:A(key, lang, args, vars), say:A(key, lang, args, vars, true)}, rest);
}
const PICS = ["🍎","⭐","🎈","🐟","🌸","🚗","🐥","🍓","⚽","🦋","🧁","🐞"];
const numOpts = list => list.map(v => ({t:String(v)}));

/* ---------- counting & numbers ---------- */
GEN.count = (a, L) => {
  const lo = a.min || 1, hi = a.max || 10, n = lo + rnd(hi - lo + 1), pic = pick(a.pics || PICS);
  const nums = near(n, Math.max(0, lo - 1), hi + 1, 4);
  return Q("count", L, a, {}, {key:"c" + n, vis:{k:"pics", pic, n},
    opts:nums.map(v => ({t:a.labels ? a.labels[v] : String(v), say:String(v)})), ans:nums.indexOf(n),
    hint:CS.T(L, "countHint"), reveal:a.labels ? a.labels[n] : String(n)});
};
GEN.more = (a, L) => {
  const hi = a.max || 10; let x = 1 + rnd(hi), y = 1 + rnd(hi);
  while(x === y) y = 1 + rnd(hi);
  const pic = pick(PICS), ans = a.less ? (x < y ? 0 : 1) : (x > y ? 0 : 1);
  return Q(a.less ? "less" : "more", L, a, {}, {key:"m" + x + "-" + y, vis:{k:"pic", pic:a.less ? "🐜" : "🐘"},
    opts:[{pic, n:x, say:String(x)}, {pic, n:y, say:String(y)}], ans, tall:true, hint:A("moreHint", L), reveal:String(ans ? y : x)});
};
GEN.after = (a, L) => {
  const lo = a.min || 1, hi = a.max || 20, n = lo + rnd(hi - lo), ans = n + 1, o = near(ans, 0, hi + 2, 4);
  return Q("after", L, a, {n}, {key:"a" + n, vis:{k:"row", items:[String(n), "?"]}, opts:numOpts(o), ans:o.indexOf(ans),
    hint:A("afterHint", L, null, {n}), reveal:String(ans)});
};
GEN.before = (a, L) => {
  const lo = a.min || 1, hi = a.max || 20, n = lo + 1 + rnd(hi - lo), ans = n - 1, o = near(ans, 0, hi, 4);
  return Q("before", L, a, {n}, {key:"b" + n, vis:{k:"row", items:["?", String(n)]}, opts:numOpts(o), ans:o.indexOf(ans),
    hint:A("beforeHint", L, null, {n}), reveal:String(ans)});
};
GEN.between = (a, L) => {
  const lo = a.min || 1, hi = a.max || 20, n = lo + 1 + rnd(Math.max(1, hi - lo - 1)), o = near(n, 0, hi + 1, 4);
  return Q("between", L, a, {a:n - 1, b:n + 1}, {key:"w" + n, vis:{k:"row", items:[String(n - 1), "?", String(n + 1)]},
    opts:numOpts(o), ans:o.indexOf(n), hint:A("betweenHint", L, null, {a:n - 1}), reveal:String(n)});
};
GEN.gap = (a, L) => {
  const lo = a.min || 1, hi = a.max || 20, s = lo + rnd(Math.max(1, hi - lo - 2)), hide = 1 + rnd(3), ans = s + hide;
  const items = [0,1,2,3].map(i => i === hide ? "?" : String(s + i)), o = near(ans, 0, hi + 3, 4);
  return Q("gap", L, a, {}, {key:"g" + s + hide, vis:{k:"row", items}, opts:numOpts(o), ans:o.indexOf(ans),
    hint:A("seqHint", L), reveal:String(ans)});
};
GEN.compare = (a, L) => {
  const hi = a.max || 20; let x = rnd(hi + 1), y = rnd(hi + 1);
  while(x === y) y = rnd(hi + 1);
  const small = a.mode === "smaller" || (a.mode === "mix" && rnd(2) === 1), ans = small ? Math.min(x, y) : Math.max(x, y);
  const list = [x, y];
  return Q(small ? "smaller" : "bigger", L, a, {}, {key:"cp" + x + "-" + y, vis:{k:"pic", pic:small ? "🐜" : "🐘"},
    opts:numOpts(list), ans:list.indexOf(ans), hint:A(small ? "smallerHint" : "biggerHint", L), reveal:String(ans)});
};
GEN.symbol = (a, L) => {
  const hi = a.max || 10, x = rnd(hi + 1);
  const y = rnd(4) === 0 ? x : rnd(hi + 1);
  const s = x > y ? ">" : x < y ? "<" : "=", list = [">", "<", "="];
  const words = {">":"is greater than", "<":"is less than", "=":"is equal to"};
  return Q("symbol", L, a, {}, {key:"s" + x + "-" + y, vis:{k:"row", items:[String(x), "?", String(y)]},
    opts:list.map(t => ({t, say:words[t]})), ans:list.indexOf(s), hint:A("symbolHint", L), reveal:x + " " + words[s] + " " + y});
};
GEN.add = (a, L) => {
  const hi = a.max || 10, x = 1 + rnd(hi - 1), y = 1 + rnd(hi - x), ans = x + y, pic = pick(PICS), o = near(ans, 0, hi + 2, 4);
  return Q("add", L, a, {x, y}, {key:"ad" + x + "-" + y, vis:{k:"sum", pic, a:x, b:y, op:"+"}, opts:numOpts(o), ans:o.indexOf(ans),
    hint:A("addHint", L), reveal:String(ans)});
};
GEN.sub = (a, L) => {
  const hi = a.max || 10, x = 2 + rnd(hi - 1), y = 1 + rnd(x - 1), ans = x - y, pic = pick(PICS), o = near(ans, 0, hi, 4);
  return Q("sub", L, a, {x, y}, {key:"sb" + x + "-" + y, vis:{k:"pics", pic, n:x, cross:y}, opts:numOpts(o), ans:o.indexOf(ans),
    hint:A("subHint", L), reveal:String(ans)});
};
GEN.addNum = (a, L) => {
  const hi = a.max || 10, x = rnd(hi + 1), y = rnd(hi - x + 1), ans = x + y, o = near(ans, 0, hi + 2, 4);
  return Q("addNum", L, a, {x, y}, {key:"an" + x + "-" + y, vis:{k:"big", t:x + " + " + y + " = ?"}, opts:numOpts(o), ans:o.indexOf(ans),
    hint:CS.fmt("Start at {x} and count on {y}.", {x, y}), reveal:String(ans)});
};
GEN.subNum = (a, L) => {
  const hi = a.max || 10, x = 1 + rnd(hi), y = rnd(x + 1), ans = x - y, o = near(ans, 0, hi, 4);
  return Q("subNum", L, a, {x, y}, {key:"sn" + x + "-" + y, vis:{k:"big", t:x + " − " + y + " = ?"}, opts:numOpts(o), ans:o.indexOf(ans),
    hint:CS.fmt("Start at {x} and count back {y}.", {x, y}), reveal:String(ans)});
};
GEN.skip = (a, L) => {
  const s = pick([].concat(a.step || 2)), k = rnd(a.upto || 7);
  const seq = [1,2,3,4].map(i => (k + i) * s), ans = seq[3];
  const set = new Set([ans, ans + s, ans - s, ans + 1]);
  const o = shuffle([...set].filter(v => v > 0)).slice(0, 4);
  if(o.indexOf(ans) < 0) o[0] = ans;
  return Q("skip", L, a, {s}, {key:"k" + s + "-" + k, vis:{k:"row", items:[String(seq[0]), String(seq[1]), String(seq[2]), "?"]},
    opts:numOpts(o), ans:o.indexOf(ans), hint:A("skipHint", L, null, {s}), reveal:String(ans)});
};
GEN.table = (a, L) => {
  const lo = a.min || 1, hi = a.max || 5, x = lo + rnd(hi - lo + 1), y = 1 + rnd(a.upto || 10), ans = x * y;
  const set = new Set([ans]);
  [ans + x, ans - x, ans + y, ans + 1, ans + 2].forEach(v => { if(v >= 0 && set.size < 4) set.add(v); });
  const o = shuffle([...set]);
  return Q("table", L, a, {x, y}, {key:"t" + x + "-" + y, vis:{k:"big", t:x + " × " + y + " = ?"}, opts:numOpts(o), ans:o.indexOf(ans),
    hint:A("tableHint", L, null, {x, y}), reveal:String(ans)});
};
GEN.numWord = (a, L) => {
  const it = pick(a.pool), c = choices(it, a.pool, x => x.w);
  return Q("numWord", L, a, {}, {key:"nw" + it.d, vis:{k:"big", t:it.d, say:it.w}, opts:c.list.map(x => ({t:x.w})), ans:c.ans, reveal:it.w});
};
GEN.wordNum = (a, L) => {
  const it = pick(a.pool), c = choices(it, a.pool, x => x.d);
  return Q("wordNum", L, a, {}, {key:"wn" + it.d, vis:{k:"big", t:it.w}, say:it.w,
    opts:c.list.map(x => ({t:x.d, say:x.w})), ans:c.ans, reveal:it.w});
};

/* ---------- shapes & patterns ---------- */
GEN.shapeName = (a, L) => {
  const it = pick(a.pool), c = choices(it, a.pool, x => x.k);
  return Q("shapeName", L, a, {}, {key:"sh" + it.k, vis:{k:"shape", shape:it.k}, opts:c.list.map(x => ({t:x.w})), ans:c.ans, reveal:it.w});
};
GEN.shapeFind = (a, L) => {
  const it = pick(a.pool), c = choices(it, a.pool, x => x.k);
  return Q("shapeFind", L, a, {w:it.w}, {key:"sf" + it.k, vis:{k:"big", t:it.w},
    opts:c.list.map(x => ({shape:x.k, say:x.w, size:62})), ans:c.ans, reveal:it.w});
};
GEN.shapeReal = (a, L) => {
  const it = pick(a.pool.filter(x => x.real && x.real.length)), pic = pick(it.real), c = choices(it, a.pool, x => x.k);
  return Q("shapeReal", L, a, {}, {key:"sr" + pic, vis:{k:"pic", pic}, opts:c.list.map(x => ({t:x.w})), ans:c.ans, reveal:it.w});
};
GEN.pattern = (a, L) => {
  const unit = pick(a.sets), show = a.len || 5, seq = [];
  for(let i = 0; i <= show; i++) seq.push(unit[i % unit.length]);
  const ans = seq[show], set = [...new Set(unit)];
  const others = shuffle([...new Set([].concat(...a.sets))].filter(x => set.indexOf(x) < 0));
  const list = shuffle(set.concat(others.slice(0, Math.max(1, 3 - set.length))));
  return Q("pattern", L, a, {}, {key:"p" + unit.join(""), vis:{k:"row", tight:true, items:seq.slice(0, show).concat("?")},
    opts:list.map(x => CS.norm(x)), ans:list.indexOf(ans), hint:A("patternHint", L), reveal:""});
};

/* ---------- words, letters, colours ---------- */
GEN.picWord = (a, L) => {
  const it = pick(a.pool), c = choices(it, a.pool, x => x.w);
  return Q("picWord", L, a, {}, {key:"pw" + it.w, vis:{k:"pic", pic:it.pic}, opts:c.list.map(x => ({t:x.w, say:x.say})), ans:c.ans,
    reveal:it.say || it.w});
};
GEN.wordPic = (a, L) => {
  const it = pick(a.pool), c = choices(it, a.pool, x => x.pic);
  return Q("wordPic", L, a, {w:it.w}, {key:"wp" + it.w, vis:{k:"big", t:it.w}, opts:c.list.map(x => ({pic:x.pic, say:x.say || x.w})),
    ans:c.ans, reveal:it.say || it.w});
};
GEN.firstLetter = (a, L) => {
  const pool = a.pool.filter(x => x.f), it = pick(pool), c = choices(it.f, a.letters || pool.map(x => x.f));
  return Q("firstLetter", L, a, {w:it.w}, {key:"fl" + it.w, vis:{k:"pic", pic:it.pic}, opts:c.list.map(t => ({t})), ans:c.ans,
    hint:A("firstHint", L, null, {w:it.w}), reveal:A("forFmt", L, null, {l:it.f, w:it.w})});
};
GEN.letterPic = (a, L) => {
  const pool = a.pool.filter(x => x.f), it = pick(pool), c = choices(it, pool, x => x.f);
  return Q("letterPic", L, a, {l:it.f}, {key:"lp" + it.f, vis:{k:"big", t:it.f}, opts:c.list.map(x => ({pic:x.pic, say:x.w})), ans:c.ans,
    reveal:A("forFmt", L, null, {l:it.f, w:it.w})});
};
GEN.seqGap = (a, L) => {
  const s = a.seq, i = rnd(s.length - 2), ans = s[i + 1], c = choices(ans, s);
  return Q("seqGap", L, a, {}, {key:"sg" + i, vis:{k:"row", items:[s[i], "?", s[i + 2]]}, opts:c.list.map(t => ({t})), ans:c.ans,
    hint:A("seqHint", L), reveal:ans});
};
GEN.seqNext = (a, L) => {
  const s = a.seq, i = rnd(s.length - 2), ans = s[i + 2], c = choices(ans, s);
  return Q("seqNext", L, a, {}, {key:"sn" + i, vis:{k:"row", items:[s[i], s[i + 1], "?"]}, opts:c.list.map(t => ({t})), ans:c.ans,
    hint:A("seqHint", L), reveal:ans});
};
GEN.binary = (a, L) => {
  const side = rnd(2), grp = side ? a.b : a.a, it = pick(grp.items), n = CS.norm(it);
  return {key:"bi" + it, ask:a.ask, say:a.sayAsk || a.ask, vis:n.pic ? {k:"pic", pic:n.pic} : {k:"big", t:n.t},
    opts:[{t:a.a.label}, {t:a.b.label}], ans:side, hint:a.hint, reveal:grp.label};
};
GEN.swName = (a, L) => {
  const it = pick(a.pool), c = choices(it, a.pool, x => x.w);
  return Q("swName", L, a, {}, {key:"sw" + it.w, vis:{k:"sw", hex:it.hex}, opts:c.list.map(x => ({t:x.w})), ans:c.ans, reveal:it.w});
};
GEN.nameSw = (a, L) => {
  const it = pick(a.pool), c = choices(it, a.pool, x => x.w);
  return Q("nameSw", L, a, {w:it.w}, {key:"ns" + it.w, vis:{k:"big", t:it.w}, opts:c.list.map(x => ({sw:x.hex, say:x.w})), ans:c.ans,
    reveal:it.w});
};
GEN.glyphName = (a, L) => {
  const it = pick(a.pool), c = choices(it, a.from || a.pool, x => x.nm);
  return Q("glyphName", L, a, {}, {key:"gn" + it.l, vis:{k:"big", t:it.l}, opts:c.list.map(x => ({t:x.nm})), ans:c.ans, reveal:it.nm});
};
GEN.nameGlyph = (a, L) => {
  const it = pick(a.pool), c = choices(it, a.from || a.pool, x => x.l);
  return Q("nameGlyph", L, a, {nm:it.nm}, {key:"ng" + it.l, vis:{k:"ear", t:it.nm, say:it.nm}, opts:c.list.map(x => ({t:x.l, say:x.nm})),
    ans:c.ans, reveal:it.nm});
};
GEN.caseMatch = (a, L) => {
  const letters = (a.letters || "ABCDEFGHIJKLMNOPQRSTUVWXYZ").split(""), up = pick(letters), low = up.toLowerCase();
  const c = choices(low, (a.confuse && a.confuse[low]) ? a.confuse[low].concat(letters.map(x => x.toLowerCase())) : letters.map(x => x.toLowerCase()));
  return Q("caseMatch", L, a, {l:up}, {key:"cm" + up, vis:{k:"big", t:up}, opts:c.list.map(t => ({t})), ans:c.ans,
    hint:A("caseHint", L, null, {l:up, s:low}), reveal:low});
};
GEN.missing = (a, L) => {
  const it = pick(a.pool), parts = CS.graphemes(it.w), i = a.vowel ? parts.findIndex(p => /[aeiou]/.test(p)) : rnd(parts.length);
  const idx = i < 0 ? 0 : i, ans = parts[idx], c = choices(ans, a.letters);
  const shown = parts.map((p, k) => k === idx ? "_" : p).join(" ");
  return Q("missing", L, a, {w:it.w}, {key:"ms" + it.w + idx, vis:{k:"picword", pic:it.pic, t:shown}, opts:c.list.map(t => ({t})),
    ans:c.ans, hint:A("missHint", L, null, {w:it.w}), reveal:it.w});
};
GEN.rhyme = (a, L) => {
  const set = pick(a.sets), two = shuffle(set).slice(0, 2), x = two[0], ans = two[1];
  const others = shuffle([].concat(...a.sets.filter(s => s !== set))).slice(0, 3), list = shuffle([ans].concat(others));
  return Q("rhyme", L, a, {w:x}, {key:"rh" + x, vis:{k:"big", t:x}, opts:list.map(t => ({t})), ans:list.indexOf(ans),
    hint:A("rhymeHint", L), reveal:x + " and " + ans});
};
GEN.opposite = (a, L) => {
  const p = pick(a.pairs), flip = rnd(2), w = p[flip], ans = p[1 - flip], pic = p[2 + flip];
  const c = choices(ans, [].concat(...a.pairs.map(q => [q[0], q[1]])).filter(t => t !== w));
  return Q("opposite", L, a, {w}, {key:"op" + w, vis:{k:"picword", pic, t:w}, opts:c.list.map(t => ({t})), ans:c.ans, reveal:ans});
};
GEN.sound = (a, L) => {
  const it = pick(a.pool), c = choices(it, a.pool, x => x.snd);
  return Q("sound", L, a, {s:it.snd}, {key:"so" + it.w, vis:{k:"ear", t:it.snd, say:it.snd}, opts:c.list.map(x => ({pic:x.pic, say:x.w})),
    ans:c.ans, hint:A("soundHint", L, null, {s:it.snd}), reveal:"The " + it.w + " says " + it.snd});
};

/* ---------- phonics: word families, digraphs, dictation ---------- */
const VOW = ["a", "e", "i", "o", "u"];
/* bed -> bad, bid, bod, bud : swap the vowel to make near-miss spellings */
const swapVowel = w => {
  const c = w.split(""), i = c.findIndex(x => VOW.indexOf(x) >= 0);
  if(i < 0) return [];
  return VOW.filter(v => v !== c[i]).map(v => { const d = c.slice(); d[i] = v; return d.join(""); });
};
/* shell -> __ell, torch -> tor__ */
const blankOut = (w, d) => w.indexOf(d) === 0 ? "__" + w.slice(d.length)
  : w.slice(-d.length) === d ? w.slice(0, -d.length) + "__" : w.replace(d, "__");
const famWords = fams => [].concat.apply([], fams.map(f => f.words));
/* wrong spellings: the word's own near misses first, then other words of the same length */
const misspell = (it, pool) => (it.near || swapVowel(it.w))
  .concat(shuffle(pool.map(x => x.w).filter(w => w.length === it.w.length)))
  .filter(w => w !== it.w);

GEN.famWord = (a, L) => {
  const fam = pick(a.fams), ans = pick(fam.words);
  const others = shuffle(famWords(a.fams.filter(f => f !== fam))).filter(w => w !== ans).slice(0, 3);
  const list = shuffle([ans].concat(others));
  return Q("famWord", L, a, {e:fam.end}, {key:"fw" + fam.end + ans, vis:{k:"big", t:"-" + fam.end},
    opts:list.map(t => ({t})), ans:list.indexOf(ans), hint:A("famHint", L, null, {e:fam.end}), reveal:ans});
};
GEN.famPick = (a, L) => {
  const fam = pick(a.fams), w = pick(fam.words);
  const c = choices(fam, a.fams, f => f.end);
  return Q("famPick", L, a, {w}, {key:"fp" + w, vis:{k:"big", t:w}, opts:c.list.map(f => ({t:"-" + f.end})),
    ans:c.ans, hint:A("famPickHint", L, null, {w}), reveal:w + " is in the -" + fam.end + " family"});
};
GEN.digraph = (a, L) => {
  const it = pick(a.pool), c = choices(it.d, a.digraphs || ["ch", "sh", "th", "wh"]);
  return Q("digraph", L, a, {w:it.w}, {key:"dg" + it.w, vis:{k:"picword", pic:it.pic, t:blankOut(it.w, it.d)},
    opts:c.list.map(t => ({t})), ans:c.ans, hint:A("digraphHint", L, null, {w:it.w}), reveal:it.w});
};
GEN.nearWord = (a, L) => {
  const it = pick(a.pool), list = shuffle([it.w].concat(shuffle(it.near || swapVowel(it.w)).slice(0, 3)));
  return Q("nearWord", L, a, {}, {key:"nw" + it.w, vis:{k:"pic", pic:it.pic}, opts:list.map(t => ({t})),
    ans:list.indexOf(it.w), hint:A("nearHint", L), reveal:it.w});
};
GEN.spell = (a, L) => {
  const it = pick(a.pool), list = shuffle([it.w].concat(misspell(it, a.pool).slice(0, 3)));
  return Q("spell", L, a, {w:it.w}, {key:"sp" + it.w, vis:{k:"ear", say:it.w + ". " + it.w},
    opts:list.map(t => ({t})), ans:list.indexOf(it.w), hint:A("spellHint", L), reveal:it.w});
};
GEN.blend = (a, L) => {
  const it = pick(a.pool), parts = CS.graphemes(it.w), c = choices(it, a.pool, x => x.w);
  return Q("blend", L, a, {s:parts.join(" - ")}, {key:"bl" + it.w, vis:{k:"row", items:parts, tight:true},
    opts:c.list.map(x => ({t:x.w})), ans:c.ans, hint:A("blendHint", L), reveal:it.w});
};
})();
