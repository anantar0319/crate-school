/* Crate School Books - page engine: book assembly, page frame, progress stats,
 * and the reading pages (cover, contents, chapter opener, learn, chart, practice, quiz, stickers, report...).
 * Game pages (trace, match, sort, dots, memory, pop, colour, rhyme, crate, doodle) live in games.js. */
(function(){
"use strict";
const CS = window.CS, h = CS.h, shuffle = CS.shuffle;
const PT = CS.PT = CS.PT || {};

const META = CS.META = {
  learn:{icon:"👀", en:"Look & listen", hi:"देखो, सुनो", pa:"ਵੇਖੋ, ਸੁਣੋ"},
  chart:{icon:"🔢", en:"Number chart", hi:"संख्या चार्ट", pa:"ਨੰਬਰ ਚਾਰਟ"},
  trace:{icon:"✏️", en:"Trace", hi:"लिखो", pa:"ਲਿਖੋ"},
  mcq:{icon:"🎯", en:"Practice", hi:"अभ्यास", pa:"ਅਭਿਆਸ"},
  match:{icon:"🔗", en:"Match", hi:"मिलाओ", pa:"ਮਿਲਾਓ"},
  sort:{icon:"🧺", en:"Sort", hi:"छाँटो", pa:"ਛਾਂਟੋ"},
  dots:{icon:"✨", en:"Join dots", hi:"बिंदु जोड़ो", pa:"ਬਿੰਦੂ ਜੋੜੋ"},
  memory:{icon:"🃏", en:"Memory game", hi:"याद खेल", pa:"ਯਾਦ ਖੇਡ"},
  pop:{icon:"🎈", en:"Balloon pop", hi:"गुब्बारे", pa:"ਗੁਬਾਰੇ"},
  colour:{icon:"🖍️", en:"Colour", hi:"रंग भरो", pa:"ਰੰਗ ਭਰੋ"},
  rhyme:{icon:"🎵", en:"Sing along", hi:"कविता", pa:"ਕਵਿਤਾ"},
  quiz:{icon:"⭐", en:"Check yourself", hi:"जाँच करो", pa:"ਜਾਂਚ ਕਰੋ"},
  crate:{icon:"📦", en:"Crate game", hi:"क्रेट खेल", pa:"ਕਰੇਟ ਖੇਡ"}
};
const SCORED = CS.SCORED = {trace:1, mcq:1, match:1, sort:1, dots:1, memory:1, pop:1, colour:1, quiz:1};
const FULL = {cover:1, owner:1, contents:1, opener:1, stickers:1, report:1, certificate:1, notes:1, back:1};

/* ===================== ASSEMBLY ===================== */
CS.assemble = function(book){
  if(book._pages) return book._pages;
  const P = [{type:"cover"}, {type:"owner"}, {type:"contents"}];
  book.chapters.forEach((ch, ci) => {
    ch.no = ci + 1; ch.start = P.length + 1;
    P.push({type:"opener", ch});
    ch.pages.forEach((p, pi) => P.push(Object.assign({}, p, {ch, pid:ch.id + "." + (pi + 1)})));
    ch.end = P.length;
  });
  book.extra = {stickers:P.length + 1, report:P.length + 2, certificate:P.length + 3, doodle:P.length + 4};
  P.push({type:"stickers"}, {type:"report"}, {type:"certificate"},
         {type:"doodle", pid:"doodle", title:book.lang === "hi" ? "मेरा चित्र" : book.lang === "pa" ? "ਮੇਰੀ ਤਸਵੀਰ" : "My drawing page"});
  if((P.length + 1) % 2) P.push({type:"notes"});
  P.push({type:"back"});
  P.forEach((p, i) => { p.no = i + 1; });
  book._pages = P;
  return P;
};

CS.chapterStats = function(book, ch){
  const prog = CS.store.book(book.id);
  let stars = 0, max = 0, done = 0, total = 0, quiz = null, weakest = null;
  ch.pages.forEach((p, pi) => {
    if(p.type === "crate") return;
    const r = prog.pages[ch.id + "." + (pi + 1)];
    total++; if(r && r.done) done++;
    if(SCORED[p.type]){
      max += 3; const s = (r && r.stars) || 0; stars += s;
      if(p.type === "quiz"){ if(r) quiz = Math.max(quiz || 0, r.best || 0); }
      else if(!weakest || s < weakest.s) weakest = {s, no:ch.start + 1 + pi};
    }
  });
  return {stars, max, done, total, quiz, sticker:!!prog.stickers[ch.id], weakest};
};
CS.bookStats = function(book){
  CS.assemble(book);
  let stars = 0, max = 0, stickers = 0, done = 0, total = 0;
  book.chapters.forEach(ch => {
    const c = CS.chapterStats(book, ch);
    stars += c.stars; max += c.max; stickers += c.sticker ? 1 : 0; done += c.done; total += c.total;
  });
  return {stars, max, stickers, chapters:book.chapters.length, done, total, pct:total ? Math.round(done / total * 100) : 0};
};
CS.instFor = (page, lang) => page.say || (CS.INST[lang] || CS.INST.en)[page.type] || "";

/* ===================== FRAME ===================== */
CS.renderPage = function(page, ctx, side){
  const book = ctx.book, th = book.theme || {};
  const pg = h("div", {class:"pg t-" + page.type + (side ? " side-" + side : ""), "data-lang":book.lang, "data-no":page.no});
  pg.style.setProperty("--main", th.main || "#1f6fe0");
  pg.style.setProperty("--main2", th.main2 || th.main || "#4c93ff");
  pg.style.setProperty("--accent", th.accent || "#ffb300");
  pg.style.setProperty("--soft", th.soft || "#e7f0ff");
  pg.style.setProperty("--ink2", th.ink || "#10306a");
  if(th.sky) pg.style.setProperty("--sky", th.sky);
  let body;
  try{ body = PT[page.type] ? PT[page.type](page, ctx) : h("div", {class:"oops"}, "Unknown page: " + page.type); }
  catch(e){ console.error(e); body = h("div", {class:"oops"}, "This page could not open."); }
  if(FULL[page.type]) pg.appendChild(body);
  else {
    pg.appendChild(head(page, ctx));
    pg.appendChild(h("div", {class:"pb"}, body));
    if(page.tip) pg.appendChild(h("div", {class:"tipnote"}, h("b", {}, "📝 Teacher's tip"), page.tip));
  }
  if(page.type !== "cover" && page.type !== "back") pg.appendChild(foot(page, ctx));
  return pg;
};
function head(page, ctx){
  const m = META[page.type] || {icon:"📄"}, L = ctx.lang, inst = CS.instFor(page, L);
  return h("div", {class:"ph"},
    h("div", {class:"kick"}, page.ch ? ctx.T("chapter") + " " + page.ch.no + " · " + page.ch.title : ""),
    h("h2", {}, page.title || ""),
    inst ? h("div", {class:"inst"},
      h("button", {class:"spk", type:"button", "aria-label":"Listen", onclick:e => { e.stopPropagation(); ctx.sayInst(); }}, "🔊"),
      h("span", {}, inst)) : null,
    h("div", {class:"badge"}, h("i", {}, m.icon), m[L] || m.en || ""));
}
function foot(page, ctx){
  const r = page.pid ? ctx.rec() : null;
  const st = (SCORED[page.type] && r && r.stars) ? "★".repeat(r.stars) + "☆".repeat(3 - r.stars) : (r && r.done ? "✓" : "");
  return h("div", {class:"pf"}, h("span", {class:"pnum"}, page.no),
    h("span", {class:"pfname"}, "Crate School Books · " + (ctx.book.short || ctx.book.title)),
    h("span", {class:"pfstars"}, st));
}

/* shared end-of-activity card */
CS.result = function(host, ctx, o){
  const L = ctx.lang, title = o.stars === 3 ? ctx.T("perfect") : o.stars === 2 ? ctx.T("good") : ctx.T("goodTry");
  const box = h("div", {class:"result"},
    CS.starRow(o.stars),
    h("h3", {}, title),
    o.line ? h("p", {}, o.line) : null,
    o.sticker ? h("div", {class:"stkwin"}, h("span", {class:"stk"}, ctx.page.ch.sticker), h("b", {}, ctx.T("sticker"))) : null,
    h("div", {class:"row"},
      o.again ? h("button", {class:"kbtn alt", type:"button", onclick:() => { box.remove(); o.again(); }}, "↻ " + ctx.T("again")) : null,
      h("button", {class:"kbtn", type:"button", onclick:() => ctx.next()}, ctx.T("next") + " ▶")));
  host.appendChild(box);
  CS.sfx.win();
  if(o.stars === 3 || o.sticker) CS.confetti();
  ctx.say(title + (o.sticker ? " " + ctx.T("sticker") : ""));
  return box;
};
CS.finishScore = function(host, ctx, stars, score, line, again){
  const res = ctx.record(stars, score);
  return CS.result(host, ctx, {stars, line, sticker:res.newSticker, again});
};
CS.starsByMistakes = m => m === 0 ? 3 : m <= 2 ? 2 : 1;

/* ===================== VISUALS (inside practice questions) ===================== */
CS.visEl = function(v, ctx){
  if(!v) return h("div");
  switch(v.k){
    case "pic": return h("div", {class:"v-pic"}, v.pic);
    case "big": {
      const len = CS.graphemes(String(v.t)).length;
      return h("div", {class:"v-big" + (len > 9 ? " s" : len > 4 ? " m" : "")}, v.t);
    }
    case "pics": {
      const wrap = h("div", {class:"v-pics" + (v.n > 10 ? " many" : "")});
      let count = 0;
      for(let i = 0; i < v.n; i++){
        const s = h("button", {class:"cnt" + (i >= v.n - (v.cross || 0) ? " x" : ""), type:"button"}, v.pic);
        s.addEventListener("click", () => {
          if(s.querySelector("i")) return;
          count++; s.appendChild(h("i", {}, count)); CS.sfx.tap(); ctx.say(String(count));
        });
        wrap.appendChild(s);
      }
      return wrap;
    }
    case "sum": {
      const grp = n => h("div", {class:"grp"}, Array(n).fill(v.pic).join(""));
      return h("div", {class:"v-sum"}, grp(v.a), h("b", {class:"op"}, v.op), grp(v.b));
    }
    case "sw": return h("div", {class:"v-sw", style:{background:v.hex}});
    case "shape": return CS.shapeSVG(v.shape, v.color, 190);
    case "row": return h("div", {class:"v-row" + (v.tight ? " tight" : "")},
      v.items.map(x => h("span", {class:"cell" + (x === "?" ? " q" : "") + (CS.isPic(x) ? " p" : "")}, x)));
    case "picword": return h("div", {class:"v-pw"}, h("div", {class:"v-pic sm"}, v.pic), h("div", {class:"v-big m sp"}, v.t));
    case "ear": return h("button", {class:"v-ear", type:"button", onclick:() => ctx.say(v.say || v.t)}, "🔊", v.t ? h("span", {}, v.t) : null);
  }
  return h("div");
};

/* ===================== LEARN ===================== */
const LEARN_FMT = {en:"{big} for {word}", hi:"{big} से {word}", pa:"{big} ਤੋਂ {word}"};
PT.learn = function(page, ctx){
  const L = ctx.lang, cards = page.cards, n = cards.length;
  const cols = page.cols || (n <= 6 ? 2 : 3), rows = Math.ceil(n / cols);
  const dense = rows >= 4 || cols >= 3;
  const grid = h("div", {class:"cards", style:{gridTemplateColumns:"repeat(" + cols + ",1fr)", gridTemplateRows:"repeat(" + rows + ",1fr)"}});
  const seen = new Set(), els = [];
  const sayText = c => c.say || (c.big && c.word ? CS.fmt(page.sayFmt || LEARN_FMT[L] || LEARN_FMT.en, c) : (c.word || c.big || ""));
  function hear(i){
    const c = cards[i], el = els[i];
    el.classList.remove("talk"); void el.offsetWidth; el.classList.add("talk");
    seen.add(i); el.classList.add("seen");
    if(seen.size === n && !(ctx.rec() || {}).done){ ctx.record(null, null); }
    return ctx.say(sayText(c), {seq:true});
  }
  cards.forEach((c, i) => {
    const el = h("button", {class:"card" + (dense ? " dense" : ""), type:"button", style:c.color ? {color:c.color} : null},
      c.big != null ? h("div", {class:"big", style:c.bigColor ? {color:c.bigColor} : null}, c.big) : null,
      c.sw ? h("div", {class:"csw", style:{background:c.sw}}) : null,
      c.shape ? CS.shapeSVG(c.shape, c.shapeColor, dense ? 44 : 60) : null,
      c.pic && c.n ? h("div", {class:"mini"}, Array(c.n).fill(c.pic).join("")) : c.pic ? h("div", {class:"pic"}, c.pic) : null,
      c.word ? h("div", {class:"word"}, c.word) : null,
      c.sub ? h("div", {class:"sub"}, c.sub) : null);
    el.addEventListener("click", () => { CS.stopSay(); hear(i); });
    els.push(el); grid.appendChild(el);
  });
  async function readAll(){
    const g = CS.sayGen();
    for(let i = 0; i < n; i++){
      if(CS.sayGen() !== g || !ctx.alive()) return false;
      await hear(i);
      await CS.wait(250);
    }
    return true;
  }
  const btn = h("button", {class:"kbtn sun", type:"button", onclick:() => { CS.stopSay(); readAll(); }}, "▶ " + ctx.T("listenAll"));
  ctx.onRead(readAll);
  ctx.test = {run:() => { cards.forEach((c, i) => { seen.add(i); els[i].classList.add("seen"); }); ctx.record(null, null); return true; }};
  return h("div", {style:{position:"relative", height:"100%"}}, grid, h("div", {class:"bbar"}, btn));
};

/* ===================== NUMBER CHART ===================== */
PT.chart = function(page, ctx){
  const from = page.from || 1, to = page.to || 50, step = page.step || 0;
  const grid = h("div", {class:"chart"}), cells = [];
  for(let v = from; v <= to; v++){
    const b = h("button", {class:(step && v % step === 0 ? "hl" : "") + (v % 10 === 0 ? " ten" : ""), type:"button"}, v);
    b.addEventListener("click", () => { CS.stopSay(); flash(b); ctx.say(String(v)); markDone(); });
    cells.push(b); grid.appendChild(b);
  }
  function flash(b){ b.classList.add("talk"); setTimeout(() => b.classList.remove("talk"), 600); }
  let marked = false;
  function markDone(){ if(!marked){ marked = true; ctx.record(null, null); } }
  async function readAll(){
    const g = CS.sayGen(), list = cells.filter((b, i) => !step || (from + i) % step === 0);
    for(const b of list){
      if(CS.sayGen() !== g || !ctx.alive()) return false;
      flash(b); await ctx.say(b.textContent, {seq:true, rate:1});
    }
    markDone(); return true;
  }
  ctx.onRead(readAll);
  const label = step ? (ctx.lang === "en" ? "Count in " + step + "s" : "▶") : ctx.T("listenAll");
  return h("div", {style:{position:"relative", height:"100%"}}, grid,
    h("div", {class:"bbar"}, h("button", {class:"kbtn sun", type:"button", onclick:() => { CS.stopSay(); readAll(); }}, "▶ " + label)));
};

/* ===================== PRACTICE + QUIZ ===================== */
function mcqEngine(page, ctx, quiz){
  const L = ctx.lang, rounds = page.rounds || (quiz ? 6 : 5);
  const specs = page.gens || [[page.gen, page.args || {}]];
  const order = quiz ? shuffle(CS.range(0, rounds - 1).map(i => specs[i % specs.length])) : null;
  const root = h("div", {class:"mcq" + (quiz ? " quiz" : "")});
  const dotsEl = h("div", {class:"rdots"}), dots = [];
  for(let i = 0; i < rounds; i++){ const d = h("i"); dots.push(d); dotsEl.appendChild(d); }
  const vis = h("div", {class:"vis"}), ask = h("div", {class:"qask"}), hint = h("div", {class:"hintbub", hidden:true}), grid = h("div", {class:"opts"});
  root.append(dotsEl, vis, ask, hint, grid);
  let i = 0, first = 0, q = null, wrong = 0, lock = false, lastKey = null;

  function build(){
    const spec = quiz ? order[i] : specs[i % specs.length];
    let g = null, tries = 0;
    do{ g = CS.GEN[spec[0]](spec[1] || {}, L); }while(g.key && g.key === lastKey && ++tries < 8);
    lastKey = g.key; return g;
  }
  function showHint(msg){ hint.hidden = false; hint.innerHTML = ""; hint.append(h("span", {class:"owl"}, "🦉"), h("span", {}, msg)); }
  function show(speak){
    q = build(); wrong = 0; lock = false; hint.hidden = true;
    dots.forEach((d, k) => d.classList.toggle("now", k === i));
    vis.innerHTML = ""; vis.appendChild(CS.visEl(q.vis, ctx));
    ask.textContent = q.ask;
    grid.innerHTML = "";
    grid.className = "opts" + (q.opts.length === 3 ? " c3" : "") + (q.tall ? " tall" : "");
    q.opts.forEach((o, k) => { const b = CS.itemEl(o); b.addEventListener("click", () => choose(k, b)); grid.appendChild(b); });
    if(speak) ctx.say(q.say || q.ask);
  }
  function choose(k, b){
    if(lock) return;
    CS.sfx.unlock();
    if(k === q.ans){
      lock = true; b.classList.add("ok"); CS.sfx.good(); CS.bump(b);
      dots[i].classList.add(wrong === 0 ? "ok" : "miss");
      if(wrong === 0) first++;
      ctx.say(CS.praise(L));
      setTimeout(step, 1000);
      return;
    }
    wrong++; b.classList.add("no"); b.disabled = true; CS.sfx.bad(); CS.shake(b);
    if(quiz || wrong >= 2){
      lock = true; dots[i].classList.add("miss");
      grid.children[q.ans].classList.add("ok", "glow");
      const o = q.opts[q.ans], msg = ctx.T("itIs", {a:q.reveal || o.say || o.t || ""});
      showHint(msg); ctx.say(msg);
      setTimeout(step, 2600);
    } else {
      const msg = q.hint || ctx.T("hint");
      showHint(msg); ctx.say(ctx.T("tryAgain") + " " + msg);
    }
  }
  function step(){
    if(!ctx.alive()) return;
    i++;
    if(i >= rounds) finish(); else show(true);
  }
  function finish(){
    dots.forEach(d => d.classList.remove("now"));
    const ratio = first / rounds;
    CS.finishScore(root, ctx, CS.starsFor(ratio), Math.round(ratio * 100), ctx.T("score", {a:first, b:rounds}), () => {
      i = 0; first = 0; dots.forEach(d => { d.className = ""; }); show(true);
    });
  }
  show(false);
  ctx.onEnter(() => ctx.sayInst(q && i < rounds ? (q.say || q.ask) : ""));
  ctx.test = {run(){ let guard = 0; while(i < rounds && guard++ < 50){ lock = false; wrong = 0; first++; i++; if(i < rounds) q = build(); } finish(); return true; },
              answer(){ grid.children[q.ans].click(); }, q:() => q};
  return root;
}
PT.mcq = (page, ctx) => mcqEngine(page, ctx, false);
PT.quiz = (page, ctx) => mcqEngine(page, ctx, true);

/* ===================== COVER & FRONT MATTER ===================== */
PT.cover = function(page, ctx){
  const b = ctx.book, c = b.cover || {};
  return h("div", {class:"cover"},
    h("div", {class:"hill"}), h("div", {class:"hill h2"}),
    (c.floats || []).slice(0, 3).map((t, i) => h("span", {class:"cv-float f" + i}, t)),
    h("div", {class:"cv-arch"}),
    h("div", {class:"cloud c1"}), h("div", {class:"cloud c2"}),
    h("div", {class:"cv-series"}, "CRATE SCHOOL BOOKS"),
    h("div", {class:"cv-title" + (c.script ? " ind" : "")}, c.title || b.title),
    h("div", {class:"cv-sub"}, h("span", {class:"s"}, "★ "), c.sub || "", h("span", {class:"s"}, " ★")),
    h("div", {class:"cv-badge"}, c.badge || "UKG"),
    h("div", {class:"cv-kids"},
      h("span", {class:"k1"}, (c.kids || [])[0] || "🧒🏽"),
      h("span", {class:"k2"}, c.mascot || "🐘"),
      h("span", {class:"k3"}, (c.kids || [])[1] || "👧🏽")),
    h("div", {class:"cv-blob"}, ["Play-based learning", "Read-aloud pages", "Games in every chapter", "Parent & teacher notes"].map(t => h("div", {}, "• " + t))),
    h("div", {class:"cv-ribbon"}, c.ribbon || "Early Years · UKG"),
    h("div", {class:"cv-tab"}, h("span", {class:"crate-ico"}), h("span", {}, h("b", {}, "CRATE SCHOOL"), h("small", {}, "LEARN · PLAY · GROW"))));
};
PT.owner = function(page, ctx){
  const who = CS.store.who();
  const legend = [["👀","Look & listen","Tap pictures to hear them"], ["✏️","Trace","Write with your finger"],
                  ["🎯","Practice","Choose answers, get hints"], ["🎈","Games","Match, sort, pop, colour"],
                  ["⭐","Check yourself","Win a chapter sticker"], ["🔊","Listen again","Tap any speaker button"]];
  ctx.onRead(() => ctx.say("This book belongs to " + who.name + ".", {seq:true, lang:"en"}));
  return h("div", {class:"owner"},
    h("div", {class:"own-card"}, h("div", {class:"own-av"}, who.av), h("small", {}, "This book belongs to"), h("div", {class:"own-name"}, who.name)),
    h("h3", {}, "How to use this book"),
    h("div", {class:"legend"}, legend.map(r => h("div", {}, h("i", {}, r[0]), h("span", {}, h("b", {}, r[1]), r[2])))),
    h("div", {class:"own-tip"}, h("b", {}, "👪 Grown-ups: "), "10–15 minutes a day is plenty. Sit together, read aloud, and praise effort as well as right answers. Each chapter ends with a short check — the report card at the back shows what to practise."));
};
PT.contents = function(page, ctx){
  const b = ctx.book, L = ctx.lang;
  const rows = b.chapters.map(ch => {
    const st = CS.chapterStats(b, ch);
    return h("button", {class:"ct-row", type:"button", onclick:() => ctx.go(ch.start)},
      h("span", {class:"no"}, ch.no), h("span", {class:"ic"}, ch.icon),
      h("span", {class:"tt"}, ch.title, ch.en ? h("small", {}, ch.en) : null),
      h("span", {class:"st"}, st.stars ? "★ " + st.stars + "/" + st.max : ""),
      h("span", {class:"sk" + (st.sticker ? "" : " off")}, ch.sticker),
      h("span", {class:"pn"}, ch.start));
  });
  const ex = b.extra, extra = (icon, t, no) => h("button", {class:"ct-row extra", type:"button", onclick:() => ctx.go(no)},
    h("span", {class:"ic"}, icon), h("span", {class:"tt"}, t), h("span", {class:"pn"}, no));
  ctx.onRead(async () => {
    const g = CS.sayGen();
    for(const ch of b.chapters){ if(CS.sayGen() !== g || !ctx.alive()) return false; await ctx.say(ch.no + ". " + ch.title, {seq:true}); }
    return true;
  });
  return h("div", {class:"contents"},
    h("div", {class:"ct-head"}, h("h2", {}, L === "hi" ? "विषय सूची" : L === "pa" ? "ਤਤਕਰਾ" : "Contents"), h("small", {}, b.title)),
    h("div", {class:"ct-list"}, rows,
      extra("🌟", "My stickers", ex.stickers), extra("📋", "Report card", ex.report),
      extra("🏆", "Certificate", ex.certificate), extra("🖍️", "Drawing page", ex.doodle)));
};
PT.opener = function(page, ctx){
  const ch = page.ch, st = CS.chapterStats(ctx.book, ch);
  ctx.onRead(async () => {
    const g = CS.sayGen();
    await ctx.say(ctx.T("chapter") + " " + ch.no + ". " + ch.title, {seq:true});
    if(CS.sayGen() !== g || !ctx.alive()) return false;
    await ctx.say(ctx.T("inChapter") + ". " + (ch.goalsSay || ch.goals).join(". "), {seq:true});
    return CS.sayGen() === g;
  });
  return h("div", {class:"opener"},
    h("div", {class:"op-top"},
      h("div", {class:"op-no"}, h("small", {}, ctx.T("chapter")), ch.no),
      h("div", {class:"op-icon"}, ch.icon),
      h("h1", {class:"op-title"}, ch.title),
      ch.en ? h("div", {class:"op-en"}, ch.en) : null),
    h("div", {class:"op-body"},
      h("div", {class:"op-goals"}, h("h3", {}, ctx.T("inChapter")), h("ul", {}, ch.goals.map(g => h("li", {}, g)))),
      h("div", {class:"op-prog"}, h("span", {class:"sk" + (st.sticker ? "" : " off")}, ch.sticker),
        h("span", {}, "★ " + st.stars + " / " + st.max + " stars · " + st.done + " of " + st.total + " pages done")),
      h("div", {class:"op-note"},
        h("p", {}, h("b", {}, "👪 For grown-ups: "), ch.note),
        ch.home ? h("p", {}, h("b", {}, "🏠 Try at home: "), ch.home) : null)));
};

/* ===================== BACK MATTER ===================== */
PT.stickers = function(page, ctx){
  const b = ctx.book, stats = b.chapters.map(ch => CS.chapterStats(b, ch)), got = stats.filter(s => s.sticker).length;
  return h("div", {class:"stickers"},
    h("div", {class:"sk-head"}, h("h2", {}, "My Sticker Page"), h("small", {}, got + " of " + b.chapters.length + " stickers · win one with each chapter check")),
    h("div", {class:"sk-grid", style:{gridTemplateColumns:"repeat(" + (b.chapters.length > 9 ? 4 : 3) + ",1fr)"}}, b.chapters.map((ch, i) => h("div", {class:"sk-slot" + (stats[i].sticker ? " got" : "")},
      h("span", {}, ch.sticker), h("small", {}, ch.no + ". " + ch.title)))));
};
PT.report = function(page, ctx){
  const b = ctx.book, who = CS.store.who();
  let weakest = null, totalStars = 0, totalMax = 0, started = 0;
  const rows = b.chapters.map(ch => {
    const s = CS.chapterStats(b, ch);
    totalStars += s.stars; totalMax += s.max; if(s.done) started++;
    const pct = s.quiz;
    const lvl = pct == null ? (s.done ? ["c", "Practising"] : ["d", "Not started"]) : pct >= 80 ? ["a", "Great"] : pct >= 60 ? ["b", "Good"] : ["c", "Practise"];
    if(s.done && s.weakest && s.weakest.s < 3 && (!weakest || s.weakest.s < weakest.s)) weakest = Object.assign({ch}, s.weakest);
    return h("tr", {}, h("td", {class:"ch"}, ch.no + ". " + ch.title), h("td", {class:"stars"}, "★ " + s.stars + "/" + s.max),
      h("td", {}, pct == null ? "—" : pct + "%"), h("td", {}, h("span", {class:"lvl " + lvl[0]}, lvl[1])));
  });
  return h("div", {class:"report"},
    h("div", {class:"rp-head"}, h("span", {class:"av"}, who.av), h("div", {}, h("h2", {}, "Report Card"), h("small", {}, who.name + " · " + b.title))),
    h("table", {class:"rp-table"}, h("tr", {}, h("th", {}, "Chapter"), h("th", {}, "Stars"), h("th", {}, "Check"), h("th", {}, "Level")), rows),
    h("div", {class:"rp-sum"},
      h("b", {}, "★ " + totalStars + " of " + totalMax + " stars · " + started + " of " + b.chapters.length + " chapters started"),
      h("div", {}, weakest ? "Practise next: " + weakest.ch.title + ", page " + weakest.no + "." : "Keep reading page by page. Scores appear here as chapters are checked."),
      weakest ? h("button", {class:"kbtn", type:"button", onclick:() => ctx.go(weakest.no)}, "Go to page " + weakest.no + " ▶") : null));
};
PT.certificate = function(page, ctx){
  const b = ctx.book, who = CS.store.who(), stats = b.chapters.map(ch => CS.chapterStats(b, ch));
  const got = stats.filter(s => s.sticker).length, all = got === b.chapters.length;
  if(!all) return h("div", {class:"cert locked"},
    h("div", {class:"medal"}, "🏆"), h("h2", {}, "Certificate"),
    h("p", {}, "Win all " + b.chapters.length + " chapter stickers to unlock your certificate. You have " + got + "."),
    h("div", {class:"todo"}, b.chapters.map((ch, i) => h("span", {class:stats[i].sticker ? "ok" : ""}, (stats[i].sticker ? "✓ " : "") + ch.no))));
  const date = new Date().toLocaleDateString(undefined, {day:"numeric", month:"long", year:"numeric"});
  ctx.onEnter(() => { CS.confetti(); ctx.say("Congratulations " + who.name + "!", {lang:"en"}); });
  return h("div", {class:"cert"},
    h("div", {class:"medal"}, "🏆"), h("h2", {}, "Certificate of Learning"),
    h("div", {class:"to"}, "This is to certify that"), h("div", {class:"nm"}, who.name),
    h("p", {}, "has finished every chapter of " + b.title + " and won all " + got + " stickers. Wonderful work!"),
    h("div", {class:"sign"}, h("span", {}, date), h("span", {}, "Teacher / Parent")));
};
PT.notes = () => h("div", {class:"notespg"}, h("h2", {}, "Notes for grown-ups"), h("div", {class:"lines"}));
PT.back = function(page, ctx){
  return h("div", {class:"back"},
    h("h2", {}, "More books are coming!"),
    h("p", {}, "Keep your stars and stickers growing. New books will join your bookcase soon."),
    h("div", {class:"more"}, [["🌍","EVS"], ["🧠","GK"], ["🎨","Drawing"]].map(m => h("div", {}, h("span", {}, m[0]), m[1]))),
    h("p", {}, "Made for little learners, with love."),
    h("div", {class:"cv-tab"}, h("span", {class:"crate-ico"}), h("span", {}, h("b", {}, "CRATE SCHOOL"), h("small", {}, "LEARN · PLAY · GROW"))));
};
})();
