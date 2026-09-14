/* Crate School Books - bookcase, flip-book reader, toolbar, readers & grown-ups settings. */
(function(){
"use strict";
const CS = window.CS, h = CS.h, $ = id => document.getElementById(id);
const W = CS.W, H = CS.H;
const V = CS.reader = {book:null, pages:[], anchor:1, spread:false, zoom:1, scale:1, busy:false, queued:null, auto:false, autoToken:0, mounted:new Map()};
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

const I = {
  zoomIn:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21M10.5 7.5v6M7.5 10.5h6"/>',
  zoomOut:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21M7.5 10.5h6"/>',
  play:'<circle cx="12" cy="12" r="9"/><path d="M10 8.5l5.5 3.5-5.5 3.5z" fill="currentColor"/>',
  pause:'<circle cx="12" cy="12" r="9"/><path d="M10 8.5v7M14 8.5v7"/>',
  first:'<path d="M6 5v14"/><path d="M19 5l-9 7 9 7z" fill="currentColor"/>',
  prev:'<path d="M20 12H5M11 5l-7 7 7 7"/>',
  next:'<path d="M4 12h15M13 5l7 7-7 7"/>',
  last:'<path d="M18 5v14"/><path d="M5 5l9 7-9 7z" fill="currentColor"/>',
  sound:'<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/><path d="M15.5 9a4 4 0 010 6M18 6.5a7.5 7.5 0 010 11"/>',
  mute:'<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/><path d="M16 9.5l5 5M21 9.5l-5 5"/>',
  notes:'<path d="M5 3h10l4 4v14H5z"/><path d="M9 11h6M9 15h4"/>',
  list:'<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1.2" fill="currentColor"/><circle cx="4.5" cy="12" r="1.2" fill="currentColor"/><circle cx="4.5" cy="18" r="1.2" fill="currentColor"/>',
  print:'<path d="M7 9V3h10v6M7 17H4v-8h16v8h-3"/><path d="M7 14h10v7H7z"/>',
  full:'<path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5"/>'
};
const svg = k => '<svg viewBox="0 0 24 24" aria-hidden="true">' + I[k] + "</svg>";

/* ===================== BOOKCASE ===================== */
function liteCtx(book){
  const noop = () => {};
  return {book, lang:book.lang, page:{}, T:(k, v) => CS.T(book.lang, k, v), say:() => Promise.resolve(), sayInst:() => Promise.resolve(),
          record:() => ({}), rec:() => null, next:noop, go:noop, onCleanup:noop, onEnter:noop, onRead:noop, alive:() => false};
}
function paintWho(){
  const w = CS.store.who();
  document.querySelectorAll(".whochip").forEach(c => { c.querySelector(".av").textContent = w.av; c.querySelector(".nm").textContent = w.name; });
}
function renderShelf(){
  const w = CS.store.who();
  paintWho();
  $("hello").textContent = "Hi " + w.name + "! Pick a book 📚";
  const shelf = $("shelf"); shelf.innerHTML = "";
  CS.books.forEach(b => {
    CS.assemble(b);
    const st = CS.bookStats(b), prog = CS.store.book(b.id);
    const thumb = h("button", {class:"bthumb", type:"button", "aria-label":"Open " + b.title, onclick:() => openBook(b.id, prog.last || 1, true)});
    thumb.appendChild(CS.renderPage(b._pages[0], liteCtx(b), null));
    shelf.appendChild(h("div", {class:"bslot"}, thumb, h("div", {class:"binfo"},
      h("b", {}, b.title), h("div", {class:"pbar"}, h("i", {style:{width:st.pct + "%"}})),
      h("small", {}, "★ " + st.stars + " stars · " + st.stickers + "/" + st.chapters + " stickers"),
      h("small", {}, (prog.last > 1 ? "Continue on page " + prog.last : "Start reading") + " ›"))));
  });
  const shelf2 = $("shelf2"); shelf2.innerHTML = "";
  shelf2.appendChild(h("div", {class:"bslot"},
    h("a", {class:"bthumb game", href:CS.CRATE_URL, "aria-label":"Play Crate School game"}, h("div", {class:"bigcrate"}, h("span", {}, "A+")), h("b", {}, "CRATE GAME")),
    h("div", {class:"binfo"}, h("b", {}, "Crate School Game"), h("small", {}, "Timed challenge · 4 subjects"))));
  [["🌍", "EVS", "My World"], ["🧠", "GK", "Clever Me"], ["🎨", "Art", "Colour Fun"]].forEach(s => shelf2.appendChild(h("div", {class:"bslot"},
    h("div", {class:"bthumb soon"}, h("div", {class:"soon-in"}, h("span", {}, s[0]), s[2], h("em", {}, "Coming soon"))),
    h("div", {class:"binfo"}, h("b", {}, s[1] + " book"), h("small", {}, "New book on the way")))));
  requestAnimationFrame(() => shelf.querySelectorAll(".bthumb > .pg").forEach(pg => { pg.style.transform = "scale(" + (pg.parentNode.clientWidth / W) + ")"; }));
}

/* ===================== VIEWS ===================== */
const N = () => V.pages.length;
function viewOf(n){
  n = CS.clamp(n, 1, N());
  if(!V.spread) return [n];
  if(n === 1) return [null, 1];
  const L = n % 2 === 0 ? n : n - 1;
  return [L, L + 1 <= N() ? L + 1 : null];
}
const anchorOf = n => { const v = viewOf(n); return v[0] || v[1]; };
const nextAnchor = () => V.spread ? (V.anchor === 1 ? 2 : V.anchor + 2) : V.anchor + 1;
const prevAnchor = () => V.spread ? (V.anchor <= 3 ? 1 : V.anchor - 2) : V.anchor - 1;
const lastVisible = () => Math.max.apply(null, viewOf(V.anchor).filter(Boolean));

function layout(){
  const st = $("stage"), narrow = innerWidth <= 760;
  const aw = st.clientWidth - (narrow ? 12 : 170), ah = st.clientHeight - (narrow ? 12 : 26);
  const spread = !narrow && aw >= 700 && aw / ah > 1.1;
  const changed = spread !== V.spread;
  V.spread = spread;
  const pw = spread ? 2 * W : W;
  V.scale = Math.max(0.2, Math.min(aw / pw, ah / H)) * V.zoom;
  $("bookbox").style.width = (pw * V.scale) + "px";
  $("bookbox").style.height = (H * V.scale) + "px";
  applyScale();
  return changed;
}
function applyScale(){
  const v = viewOf(V.anchor), sc = $("bookscale");
  let tx = 0;
  if(V.spread){ if(!v[0]) tx = -W / 2; else if(!v[1]) tx = W / 2; }
  sc.style.width = (V.spread ? 2 * W : W) + "px"; sc.style.height = H + "px";
  sc.style.transform = "scale(" + V.scale + ") translateX(" + tx + "px)";
  $("spine").hidden = !(V.spread && v[0] && v[1]);
}

function makeCtx(page){
  const book = V.book, L = book.lang;
  const c = {book, page, lang:L, cleanups:[], enter:null, read:null, test:null,
    T:(k, v) => CS.T(L, k, v),
    say:(t, o) => CS.say(t, (o && o.lang) || L, o),
    sayInst:extra => sayInst(page, extra),
    record(stars, score){
      if(!page.pid) return {};
      const r = CS.store.record(book.id, page.pid, stars, score);
      if(page.type === "quiz" && score >= 60 && page.ch) r.newSticker = CS.store.sticker(book.id, page.ch.id);
      refreshFoot(page.no);
      return r;
    },
    rec:() => page.pid ? CS.store.rec(book.id, page.pid) : null,
    next(){
      if(viewOf(V.anchor).indexOf(page.no + 1) >= 0){
        const m = V.mounted.get(page.no + 1);
        if(m){ CS.bump(m.el); if(m.ctx.enter) m.ctx.enter(); }
      } else userGo(page.no + 1);
    },
    go:n => userGo(n),
    onCleanup:f => c.cleanups.push(f), onEnter:f => { c.enter = f; }, onRead:f => { c.read = f; },
    alive:() => { const m = V.mounted.get(page.no); return !!m && m.ctx === c && V.book === book; }
  };
  return c;
}
async function sayInst(page, extra){
  const L = V.book.lang, p = CS.say(CS.instFor(page, L), L), g = CS.sayGen();
  await p;
  if(CS.store.set.helper === "pa" && L !== "pa" && CS.INST.pa[page.type] && CS.sayGen() === g) await CS.say(CS.INST.pa[page.type], "pa", {seq:true});
  if(extra && CS.sayGen() === g) await CS.say(extra, L, {seq:true});
}
function mount(no, side){
  if(!no) return null;
  const old = V.mounted.get(no);
  if(old && old.side === side) return old;
  if(old) unmount(no);
  const page = V.pages[no - 1], ctx = makeCtx(page);
  const m = {no, side, ctx};
  V.mounted.set(no, m);
  m.el = CS.renderPage(page, ctx, side);
  return m;
}
function unmount(no){
  const m = V.mounted.get(no); if(!m) return;
  V.mounted.delete(no);
  m.ctx.cleanups.forEach(f => { try{ f(); }catch(e){} });
  m.el.remove();
}
function refreshFoot(no){
  const m = V.mounted.get(no); if(!m) return;
  const r = m.ctx.rec(), el = m.el.querySelector(".pfstars");
  if(el && r) el.textContent = CS.SCORED[m.ctx.page.type] && r.stars ? "★".repeat(r.stars) + "☆".repeat(3 - r.stars) : "✓";
}
function renderView(n){
  CS.stopSay();
  V.anchor = anchorOf(n);
  const v = viewOf(V.anchor), keep = new Set(v.filter(Boolean));
  [...V.mounted.keys()].forEach(k => { if(!keep.has(k)) unmount(k); });
  const A = $("slotA"), B = $("slotB");
  A.innerHTML = ""; B.innerHTML = "";
  A.className = "slot " + (V.spread ? "L" : "S"); B.className = "slot R";
  if(V.spread){
    const l = mount(v[0], "L"), r = mount(v[1], "R");
    if(l) A.appendChild(l.el); if(r) B.appendChild(r.el);
  } else A.appendChild(mount(v[0], "S").el);
  applyScale(); after();
}

/* ===================== PAGE TURN ===================== */
async function go(n){
  if(!V.book) return;
  n = CS.clamp(parseInt(n, 10) || 1, 1, N());
  const target = anchorOf(n);
  if(target === V.anchor) return;
  if(V.busy){ V.queued = n; return; }
  CS.stopSay();
  if(reduced()){ renderView(target); return; }
  V.busy = true; CS.sfx.flip();
  const fwd = target > V.anchor, from = viewOf(V.anchor), to = viewOf(target);
  const A = $("slotA"), B = $("slotB");
  const front = h("div", {class:"face front"}), back = h("div", {class:"face back"}), leaf = h("div", {class:"leaf"}, front, back);
  const paper = () => h("div", {class:"paper"});
  const el = m => m ? m.el : paper();
  let kf, end;
  if(V.spread){
    const toL = mount(to[0], "L"), toR = mount(to[1], "R");
    if(fwd){
      front.appendChild(el(from[1] ? V.mounted.get(from[1]) : null));
      back.appendChild(el(toL));
      B.innerHTML = ""; if(toR) B.appendChild(toR.el);
      leaf.style.left = W + "px"; leaf.style.transformOrigin = "0 50%";
      kf = [{transform:"rotateY(0deg)"}, {transform:"rotateY(-180deg)"}];
      end = () => { A.innerHTML = ""; if(toL) A.appendChild(toL.el); };
    } else {
      front.appendChild(el(from[0] ? V.mounted.get(from[0]) : null));
      back.appendChild(el(toR));
      A.innerHTML = ""; if(toL) A.appendChild(toL.el);
      leaf.style.left = "0px"; leaf.style.transformOrigin = "100% 50%";
      kf = [{transform:"rotateY(0deg)"}, {transform:"rotateY(180deg)"}];
      end = () => { B.innerHTML = ""; if(toR) B.appendChild(toR.el); };
    }
  } else {
    const cur = V.mounted.get(from[0]), nx = mount(to[0], "S");
    leaf.style.left = "0px"; leaf.style.transformOrigin = "0 50%";
    back.appendChild(paper());
    if(fwd){
      front.appendChild(cur.el);
      A.innerHTML = ""; A.appendChild(nx.el);
      kf = [{transform:"rotateY(0deg)"}, {transform:"rotateY(-180deg)"}];
      end = () => {};
    } else {
      front.appendChild(nx.el);
      kf = [{transform:"rotateY(-180deg)"}, {transform:"rotateY(0deg)"}];
      end = () => { A.innerHTML = ""; A.appendChild(nx.el); };
    }
  }
  front.appendChild(h("div", {class:"shade"})); back.appendChild(h("div", {class:"shade"}));
  $("bookscale").appendChild(leaf);
  V.anchor = target; applyScale();
  const dur = 720;
  const anim = leaf.animate(kf, {duration:dur, easing:"cubic-bezier(.35,.05,.25,1)", fill:"forwards"});
  leaf.querySelectorAll(".shade").forEach(s => s.animate([{opacity:0}, {opacity:1}, {opacity:0}], {duration:dur}));
  await Promise.race([anim.finished, CS.wait(dur + 250)]).catch(() => {});
  end(); leaf.remove();
  const keep = new Set(to.filter(Boolean));
  [...V.mounted.keys()].forEach(k => { if(!keep.has(k)) unmount(k); });
  V.busy = false;
  after();
  if(V.queued != null){ const q = V.queued; V.queued = null; go(q); }
}
CS.go = go;
function userGo(n){ setAuto(false); return go(n); }

function after(){
  const v = viewOf(V.anchor).filter(Boolean), total = N();
  $("pgIn").value = v.join("-");
  $("pgTot").textContent = "/ " + total;
  $("fPg").textContent = v.join("-") + " / " + total;
  const atStart = V.anchor === 1, atEnd = lastVisible() >= total;
  ["navPrev", "fPrev"].forEach(id => { $(id).disabled = atStart; });
  ["navNext", "fNext"].forEach(id => { $(id).disabled = atEnd; });
  const prog = CS.store.book(V.book.id);
  prog.last = V.anchor; CS.store.save();
  try{ history.replaceState(history.state, "", "#book=" + V.book.id + "&p=" + V.anchor); }catch(e){}
  const pg = V.pages[v[v.length - 1] - 1];
  $("rTitle").textContent = V.book.title + (pg && pg.ch ? " · " + pg.ch.title : "");
  if(!V.auto) enterView();
}
function enterView(){
  for(const no of viewOf(V.anchor).filter(Boolean)){
    const m = V.mounted.get(no);
    if(m && m.ctx.enter){ const f = m.ctx.enter; setTimeout(() => { if(m.ctx.alive() && !V.busy) f(); }, 380); return; }
  }
}

/* ===================== READ TO ME ===================== */
function setAuto(on){
  if(V.auto === on) return;
  V.auto = on; V.autoToken++;
  const b = $("tb-play");
  if(b){ b.setAttribute("aria-pressed", on ? "true" : "false"); b.innerHTML = svg(on ? "pause" : "play"); }
  if(on) autoLoop(); else CS.stopSay();
}
async function autoLoop(){
  const token = V.autoToken, live = () => V.auto && token === V.autoToken && V.book;
  const L = V.book.lang;
  while(live()){
    for(const no of viewOf(V.anchor).filter(Boolean)){
      if(!live()) return;
      const m = V.mounted.get(no); if(!m) continue;
      const type = m.ctx.page.type;
      if(m.ctx.read){
        const ok = await m.ctx.read();
        if(ok === false){ if(live()) setAuto(false); return; }
      } else if(type === "cover"){
        await CS.say(V.book.title + ". " + ((V.book.cover || {}).sub || ""), L, {seq:true});
      } else if(CS.SCORED[type] || type === "doodle" || type === "crate"){
        await m.ctx.sayInst();
        if(!live()) return;
        CS.toast("🎮 " + CS.T(L, "yourTurn"));
        await CS.say(CS.T(L, "yourTurn"), L, {seq:true});
        V.auto = true; setAuto(false);
        return;
      }
      await CS.wait(450);
    }
    if(!live()) return;
    if(lastVisible() >= N()){ setAuto(false); return; }
    await CS.wait(600);
    if(!live()) return;
    await go(nextAnchor());
    await CS.wait(350);
  }
}

/* ===================== OPEN / CLOSE ===================== */
function openBook(id, p, push){
  const b = CS.books.find(x => x.id === id); if(!b) return;
  CS.sfx.unlock();
  V.book = b; V.pages = CS.assemble(b); V.zoom = 1;
  $("shelfView").hidden = true; $("readerView").hidden = false;
  $("readerView").classList.toggle("notes-off", !CS.store.set.notes);
  paintTools();
  document.title = b.title + " · Crate School Books";
  if(push){ try{ history.pushState({book:id}, "", "#book=" + id + "&p=" + (p || 1)); }catch(e){} }
  layout(); renderView(p || 1);
  startTimer();
}
function closeBook(){
  setAuto(false); CS.stopSay();
  [...V.mounted.keys()].forEach(unmount);
  V.book = null; V.pages = [];
  $("readerView").hidden = true; $("shelfView").hidden = false;
  try{ history.replaceState(null, "", location.pathname + location.search); }catch(e){}
  document.title = "Crate School Books";
  stopTimer(); renderShelf();
}
CS.openBook = openBook; CS.closeBook = closeBook;

/* ===================== TOOLBAR ===================== */
function tool(id, icon, label, fn, opt){
  return h("button", {class:"tb" + (opt ? " tbx" : ""), id:"tb-" + id, type:"button", title:label, "aria-label":label, html:svg(icon), onclick:fn});
}
function buildTools(){
  const t = $("tools");
  t.append(
    tool("zin", "zoomIn", "Zoom in", () => { V.zoom = Math.min(2.5, V.zoom + 0.25); layout(); }, true),
    tool("zout", "zoomOut", "Zoom out", () => { V.zoom = Math.max(1, V.zoom - 0.25); layout(); }, true),
    tool("play", "play", "Read to me", () => setAuto(!V.auto)),
    h("span", {class:"tsep tbx"}),
    tool("first", "first", "First page", () => userGo(1), true),
    tool("prev", "prev", "Previous page", () => userGo(prevAnchor())),
    tool("next", "next", "Next page", () => userGo(nextAnchor())),
    tool("last", "last", "Last page", () => userGo(N()), true),
    h("span", {class:"tsep tbx"}),
    tool("sound", "sound", "Sound on or off", () => { CS.store.set.sound = !CS.store.set.sound; CS.store.save(); if(!CS.store.set.sound) CS.stopSay(); paintTools(); }),
    tool("notes", "notes", "Teacher tips on pages", () => { CS.store.set.notes = !CS.store.set.notes; CS.store.save(); paintTools(); }, true),
    tool("list", "list", "Contents", () => userGo(3)),
    tool("print", "print", "Print these pages", printView, true),
    document.documentElement.requestFullscreen ? tool("full", "full", "Full screen", () => {
      if(document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen().catch(() => {});
    }, true) : null);
}
function paintTools(){
  const s = $("tb-sound"); if(s){ s.innerHTML = svg(CS.store.set.sound ? "sound" : "mute"); s.setAttribute("aria-pressed", CS.store.set.sound ? "false" : "true"); }
  const n = $("tb-notes"); if(n) n.setAttribute("aria-pressed", CS.store.set.notes ? "true" : "false");
  $("readerView").classList.toggle("notes-off", !CS.store.set.notes);
}
function printView(){
  const area = $("printArea"); area.innerHTML = "";
  viewOf(V.anchor).filter(Boolean).forEach(no => {
    const m = V.mounted.get(no); if(!m) return;
    const cl = m.el.cloneNode(true), src = m.el.querySelectorAll("canvas"), dst = cl.querySelectorAll("canvas");
    src.forEach((c, i) => { try{ dst[i].getContext("2d").drawImage(c, 0, 0); }catch(e){} });
    cl.classList.remove("side-L", "side-R");
    area.appendChild(cl);
  });
  setTimeout(() => window.print(), 50);
}

/* ===================== MODALS ===================== */
function modal(build){
  const back = h("div", {class:"modal"}), sheet = h("div", {class:"sheet", role:"dialog", "aria-modal":"true"});
  back.appendChild(sheet);
  const close = () => { back.remove(); document.removeEventListener("keydown", esc); };
  const esc = e => { if(e.key === "Escape") close(); };
  back.addEventListener("click", e => { if(e.target === back) close(); });
  document.addEventListener("keydown", esc);
  build(sheet, close);
  document.body.appendChild(back);
  return close;
}
const AVATARS = ["👧🏽","🧒🏽","👦🏽","👧🏻","👦🏻","👶🏽","🦁","🐼","🦄","🐯","🐸","🦋"];
function chooseReader(){
  modal((s, close) => {
    const grid = h("div", {class:"who-grid"});
    CS.store.profiles().forEach(p => grid.appendChild(h("button", {class:"who-btn", type:"button", "aria-pressed":p.id === CS.store.who().id ? "true" : "false",
      onclick:() => { CS.store.choose(p.id); close(); onReaderChange(); }}, h("span", {class:"av"}, p.av), p.name)));
    grid.appendChild(h("button", {class:"who-btn", type:"button", onclick:() => { close(); addReader(); }}, h("span", {class:"av"}, "➕"), "Add reader"));
    s.append(h("h2", {}, "Who is reading?"), h("p", {}, "Each reader has their own stars, stickers and report card."), grid,
      h("div", {class:"srow"}, h("button", {class:"sbtn ghost", type:"button", onclick:close}, "Close")));
  });
}
function addReader(){
  modal((s, close) => {
    let av = AVATARS[0];
    const name = h("input", {class:"txt", maxlength:"24", placeholder:"Child's name", autocomplete:"off"});
    const avs = h("div", {class:"avs"});
    AVATARS.forEach((a, i) => avs.appendChild(h("button", {type:"button", "aria-pressed":i === 0 ? "true" : "false",
      onclick:e => { av = a; [...avs.children].forEach(x => x.setAttribute("aria-pressed", "false")); e.currentTarget.setAttribute("aria-pressed", "true"); }}, a)));
    const save = () => { const n = name.value.trim(); if(!n){ name.focus(); return; } CS.store.addProfile(n, av); close(); onReaderChange(); };
    name.addEventListener("keydown", e => { if(e.key === "Enter") save(); });
    s.append(h("h2", {}, "Add a reader"), h("label", {class:"fld"}, "Name", name), h("div", {class:"fld"}, "Picture", avs),
      h("div", {class:"srow"}, h("button", {class:"sbtn", type:"button", onclick:save}, "Add"), h("button", {class:"sbtn ghost", type:"button", onclick:close}, "Cancel")));
    setTimeout(() => name.focus(), 50);
  });
}
function onReaderChange(){
  paintWho();
  if(V.book){ const b = V.book.id, p = CS.store.book(b).last || 1; [...V.mounted.keys()].forEach(unmount); renderView(p); }
  else renderShelf();
}
function grownups(){
  modal((s, close) => {
    const a = 3 + CS.rnd(7), b = 3 + CS.rnd(7);
    const inp = h("input", {class:"txt", inputmode:"numeric", autocomplete:"off", "aria-label":"Answer"});
    const check = () => { if(parseInt(inp.value, 10) === a + b){ close(); settings(); } else { CS.shake(inp); inp.value = ""; } };
    inp.addEventListener("keydown", e => { if(e.key === "Enter") check(); });
    s.append(h("h2", {}, "👪 For grown-ups"), h("p", {}, "Please answer to continue."), h("div", {class:"gate-q"}, a + " + " + b + " = ?"), inp,
      h("div", {class:"srow"}, h("button", {class:"sbtn", type:"button", onclick:check}, "Continue"), h("button", {class:"sbtn ghost", type:"button", onclick:close}, "Cancel")));
    setTimeout(() => inp.focus(), 50);
  });
}
function settings(){
  modal((s, close) => {
    const set = CS.store.set;
    const tog = (label, sub, key, on, off) => {
      const btn = h("button", {class:"tog", type:"button"});
      const paint = () => { const v = key === "helper" ? set.helper === "pa" : !!set[key]; btn.setAttribute("aria-pressed", v ? "true" : "false"); btn.textContent = v ? (on || "On") : (off || "Off"); };
      btn.addEventListener("click", () => { if(key === "helper") set.helper = set.helper === "pa" ? "off" : "pa"; else set[key] = !set[key]; CS.store.save(); paint(); paintTools(); });
      paint();
      return h("div", {class:"setrow"}, h("span", {}, label, h("small", {}, sub)), btn);
    };
    const who = CS.store.who();
    const rows = CS.books.map(bk => {
      const st = CS.bookStats(bk), pr = CS.store.book(bk.id);
      return h("tr", {}, h("td", {}, bk.title), h("td", {}, "★ " + st.stars + "/" + st.max), h("td", {}, st.stickers + "/" + st.chapters),
        h("td", {}, st.pct + "%"), h("td", {}, Math.round((pr.secs || 0) / 60) + " min"));
    });
    const readers = h("div", {});
    CS.store.profiles().forEach(p => {
      const nm = h("input", {class:"txt", value:p.name, maxlength:"24", style:{flex:"1"}});
      readers.appendChild(h("div", {class:"setrow"}, h("span", {style:{fontSize:"30px"}}, p.av), nm,
        h("button", {class:"sbtn ghost", type:"button", onclick:() => { CS.store.editProfile(p.id, nm.value.trim()); paintWho(); CS.toast("Saved"); }}, "Save"),
        CS.store.profiles().length > 1 ? h("button", {class:"sbtn danger", type:"button", onclick:() => {
          if(confirm("Remove " + p.name + " and all their progress?")){ CS.store.removeProfile(p.id); close(); onReaderChange(); settings(); }
        }}, "Remove") : null));
    });
    const voiceInfo = h("p", {style:{fontSize:"13px"}});
    const paintVoices = () => {
      const r = CS.voiceReport(), f = v => v ? "found ✓" : "not found";
      voiceInfo.textContent = !r.tts ? "This browser has no read-aloud support. Open the link in Chrome (Android) or Safari (iPhone)."
        : r.voices === 0 ? "No read-aloud voices found yet. Tap “Test sound”; if you hear nothing, see the tips below."
        : "Voices on this device — English: " + f(r.en) + " · Hindi: " + f(r.hi) + " · Punjabi: " + f(r.pa) + (r.pa ? "" : " (Punjabi is read by the Hindi voice)");
    };
    paintVoices();
    s.append(
      h("h2", {}, "Grown-ups corner"),
      h("h3", {}, "Settings"),
      tog("Sound and read-aloud", "Voices, praise and sound effects", "sound"),
      tog("Punjabi helper voice", "Repeats instructions in ਪੰਜਾਬੀ in the English and Maths books", "helper"),
      tog("Brain-break reminders", "A short stretch break after 15 minutes of reading", "breaks"),
      tog("Teacher tips on pages", "Yellow sticky notes with teaching ideas", "notes", "Shown", "Hidden"),
      h("div", {class:"srow"}, h("button", {class:"sbtn", type:"button", onclick:() => testSound().then(paintVoices)}, "🔊 Test sound")),
      voiceInfo,
      soundHelp(),
      h("h3", {}, "Progress · " + who.av + " " + who.name),
      h("table", {class:"ptable"}, h("tr", {}, h("th", {}, "Book"), h("th", {}, "Stars"), h("th", {}, "Stickers"), h("th", {}, "Pages"), h("th", {}, "Time")), rows),
      h("p", {style:{fontSize:"13px"}}, "Open a book's Report Card page (near the back) to see which chapter to practise next."),
      h("div", {class:"srow"}, h("button", {class:"sbtn danger", type:"button", onclick:() => {
        if(confirm("Clear all stars and stickers for " + who.name + "?")){ CS.store.resetWho(); close(); onReaderChange(); }
      }}, "Reset " + who.name + "'s progress")),
      h("h3", {}, "Readers"), readers,
      h("div", {class:"srow"}, h("button", {class:"sbtn ghost", type:"button", onclick:() => { close(); addReader(); }}, "➕ Add reader"),
        h("button", {class:"sbtn", type:"button", onclick:close}, "Done")),
      h("p", {style:{fontSize:"12px", marginTop:"14px"}}, "Progress is saved on this device only. Crate School Books v" + CS.VERSION + "."));
  });
}

/* ===================== SOUND CHECK ===================== */
async function testSound(){
  if(!CS.store.set.sound){ CS.store.set.sound = true; CS.store.save(); paintTools(); }
  CS.sfx.unlock(); CS.sfx.good();
  CS.toast("🔊 Testing: English, हिंदी, ਪੰਜਾਬੀ");
  await CS.say("Hello! The sound is working.", "en");
  await CS.say("नमस्ते! आवाज़ आ रही है।", "hi", {seq:true});
  await CS.say("ਸਤ ਸ੍ਰੀ ਅਕਾਲ!", "pa", {seq:true});
}
CS.testSound = testSound;
function soundHelp(){
  const tips = ["Turn the volume up. On iPhone, turn Silent mode off.",
    "Tap a picture on the page first — phones only allow sound after a tap.",
    "Check the 🔊 button in the book's toolbar is not crossed out.",
    "If the link opened inside WhatsApp, use ⋮ → Open in Chrome (Android) or the compass → Open in Safari (iPhone).",
    "Android: Settings → search “Text-to-speech” → preferred engine Google → Install voice data → add English (India or UK) and Hindi, and Punjabi if listed.",
    "iPhone: Settings → Accessibility → Spoken Content → Voices → download English and Hindi voices.",
    "Then close the tab, open the link again and tap Test sound."];
  return h("details", {style:{fontSize:"13px", margin:"6px 0"}},
    h("summary", {style:{fontWeight:"800", cursor:"pointer"}}, "No sound on a phone?"),
    h("ol", {style:{paddingLeft:"20px", lineHeight:"1.5", margin:"6px 0"}}, tips.map(t => h("li", {}, t))));
}

/* ===================== BRAIN BREAK ===================== */
let timer = 0, readSecs = 0;
const BREAKS = [["🙆", "Stretch up high like a giraffe!"], ["🦘", "Jump 5 times like a kangaroo!"], ["🐢", "Touch your toes, slowly like a turtle."],
                ["👀", "Look far away and count to 10."], ["👐", "Shake your hands and wiggle your fingers!"]];
function startTimer(){
  stopTimer();
  timer = setInterval(() => {
    if(document.hidden || !V.book) return;
    readSecs += 10;
    const pr = CS.store.book(V.book.id); pr.secs = (pr.secs || 0) + 10;
    if(readSecs % 60 === 0) CS.store.save();
    if(CS.store.set.breaks && readSecs >= 15 * 60 && !document.querySelector(".modal")){ readSecs = 0; brainBreak(); }
  }, 10000);
}
function stopTimer(){ clearInterval(timer); timer = 0; }
function brainBreak(){
  setAuto(false);
  const b = CS.pick(BREAKS);
  modal((s, close) => {
    let left = 30;
    const cd = h("div", {class:"cd"}, left);
    const t = setInterval(() => { left--; cd.textContent = left > 0 ? left : "✓"; if(left <= 0) clearInterval(t); }, 1000);
    const done = () => { clearInterval(t); close(); };
    s.classList.add("brk");
    s.append(h("h2", {}, "Brain break!"), h("div", {class:"big"}, b[0]), h("p", {style:{fontSize:"20px", fontWeight:"800"}}, b[1]), cd,
      h("div", {class:"srow", style:{justifyContent:"center"}}, h("button", {class:"sbtn", type:"button", onclick:done}, "I'm back! ▶")));
    CS.say("Brain break! " + b[1], "en");
  });
}

/* ===================== WIRING ===================== */
function init(){
  buildTools();
  $("whoChip").addEventListener("click", chooseReader);
  $("rWho").addEventListener("click", chooseReader);
  $("grownBtn").addEventListener("click", grownups);
  $("soundTest").addEventListener("click", testSound);
  $("rClose").addEventListener("click", closeBook);
  $("rBack").addEventListener("click", closeBook);
  $("navPrev").innerHTML = svg("prev"); $("navNext").innerHTML = svg("next");
  $("fPrev").innerHTML = svg("prev"); $("fNext").innerHTML = svg("next");
  ["navPrev", "fPrev"].forEach(id => $(id).addEventListener("click", () => userGo(prevAnchor())));
  ["navNext", "fNext"].forEach(id => $(id).addEventListener("click", () => userGo(nextAnchor())));
  const goInput = () => { const n = parseInt($("pgIn").value, 10); if(n) userGo(n); $("pgIn").blur(); };
  $("pgGo").addEventListener("click", goInput);
  $("pgIn").addEventListener("keydown", e => { if(e.key === "Enter") goInput(); });
  $("pgIn").addEventListener("focus", e => e.target.select());
  document.addEventListener("keydown", e => {
    if(!V.book || document.querySelector(".modal") || /INPUT|TEXTAREA/.test(e.target.tagName)) return;
    if(e.key === "ArrowRight" || e.key === "PageDown"){ e.preventDefault(); userGo(nextAnchor()); }
    else if(e.key === "ArrowLeft" || e.key === "PageUp"){ e.preventDefault(); userGo(prevAnchor()); }
    else if(e.key === "Home") userGo(1);
    else if(e.key === "End") userGo(N());
    else if(e.key === "Escape") closeBook();
  });
  let sw = null;
  $("stage").addEventListener("pointerdown", e => {
    if(e.target.closest("[data-noswipe],button,a,input,canvas")){ sw = null; return; }
    sw = {x:e.clientX, y:e.clientY, t:Date.now()};
  });
  $("stage").addEventListener("pointerup", e => {
    if(!sw || V.zoom > 1) return;
    const dx = e.clientX - sw.x, dy = e.clientY - sw.y, dt = Date.now() - sw.t; sw = null;
    if(Math.abs(dx) > 60 && Math.abs(dy) < 80 && dt < 700) userGo(dx < 0 ? nextAnchor() : prevAnchor());
  });
  let rt = 0;
  addEventListener("resize", () => {
    clearTimeout(rt);
    rt = setTimeout(() => {
      if(!V.book){ renderShelf(); return; }
      if(V.busy) return;
      if(layout()) renderView(V.anchor);
    }, 140);
  });
  addEventListener("popstate", () => {
    const m = /book=([\w-]+)(?:&p=(\d+))?/.exec(location.hash);
    if(m && !V.book) openBook(m[1], +m[2] || 1, false);
    else if(!m && V.book) closeBook();
  });
  document.addEventListener("visibilitychange", () => { if(document.hidden){ setAuto(false); CS.stopSay(); } });
  renderShelf();
  const m = /book=([\w-]+)(?:&p=(\d+))?/.exec(location.hash);
  if(m) openBook(m[1], +m[2] || 1, false);
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if(!V.book) renderShelf(); });
}
if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
