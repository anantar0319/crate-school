/* Crate School Books - game pages: trace, match, sort, dots, memory, balloon pop, colour, rhyme, crate link, doodle. */
(function(){
"use strict";
const CS = window.CS, h = CS.h, rnd = CS.rnd, pick = CS.pick, shuffle = CS.shuffle;
const PT = CS.PT;
const NS = "http://www.w3.org/2000/svg";
const svgEl = (tag, attrs) => { const e = document.createElementNS(NS, tag); for(const k in attrs) e.setAttribute(k, attrs[k]); return e; };
const mainColour = el => (getComputedStyle(el).getPropertyValue("--main") || "#1f6fe0").trim();

/* ===================== TRACE ===================== */
PT.trace = function(page, ctx){
  const L = ctx.lang, SZ = 600, PEN = 40, WIDE = 76;
  const items = page.glyphs.map(g => typeof g === "string" ? {g} : g);
  const font = page.font || (L === "hi" ? "'Baloo 2'" : L === "pa" ? "'Baloo Paaji 2'" : "Andika");
  const weight = L === "en" ? "400" : "600";
  const mk = () => { const c = document.createElement("canvas"); c.width = c.height = SZ; return c; };
  const guide = mk(), ink = mk(), mask = mk(), zone = mk(), wide = mk();
  guide.className = "tguide"; ink.className = "tink";
  const g = guide.getContext("2d"), k = ink.getContext("2d"), m = mask.getContext("2d"),
        z = zone.getContext("2d", {willReadFrequently:true}), w = wide.getContext("2d", {willReadFrequently:true});
  const model = h("div", {class:"tmodel"});
  const stage = h("div", {class:"tstage", "data-noswipe":""}, guide, ink, model);
  const tabs = h("div", {class:"ttabs"}), msg = h("div", {class:"tmsg"});
  const scores = items.map(() => 0);
  let gi = 0, drawing = false, last = null, passed = false, colour = null;

  items.forEach((it, j) => tabs.appendChild(h("button", {type:"button", onclick:() => select(j, true)}, it.g)));
  const clearBtn = h("button", {class:"kbtn alt", type:"button", onclick:() => { clearInk(); msg.textContent = ""; }}, "↺ " + ctx.T("clear"));
  const checkBtn = h("button", {class:"kbtn", type:"button", onclick:() => check(true)}, "✓ " + ctx.T("check"));
  const nextBtn = h("button", {class:"kbtn sun", type:"button", onclick:() => select((gi + 1) % items.length, true)}, ctx.T("nextOne") + " ▶");

  function place(){
    const t = items[gi].g;
    g.font = weight + " 400px " + font + ", sans-serif";
    let mt = g.measureText(t);
    const wd = (mt.actualBoundingBoxLeft + mt.actualBoundingBoxRight) || mt.width || 300;
    const ht = (mt.actualBoundingBoxAscent + mt.actualBoundingBoxDescent) || 300;
    const fs = Math.floor(400 * Math.min(SZ * 0.72 / wd, SZ * 0.7 / ht));
    g.font = weight + " " + fs + "px " + font + ", sans-serif";
    mt = g.measureText(t);
    const x = (SZ - (mt.actualBoundingBoxLeft + mt.actualBoundingBoxRight)) / 2 + mt.actualBoundingBoxLeft;
    const y = (SZ - (mt.actualBoundingBoxAscent + mt.actualBoundingBoxDescent)) / 2 + mt.actualBoundingBoxAscent;
    return {t, x, y, top:y - mt.actualBoundingBoxAscent, fs};
  }
  function drawGuide(){
    [g, m, z].forEach(c => c.clearRect(0, 0, SZ, SZ));
    const p = place();
    m.font = z.font = g.font;
    if(L === "en"){
      g.strokeStyle = "#d6e3fb"; g.lineWidth = 3;
      [p.y, p.top, (p.y + p.top) / 2].forEach((yy, i) => { g.setLineDash(i === 2 ? [12, 10] : []); g.beginPath(); g.moveTo(20, yy); g.lineTo(SZ - 20, yy); g.stroke(); });
      g.setLineDash([]);
    }
    g.fillStyle = "#e7edfb"; g.fillText(p.t, p.x, p.y);
    g.setLineDash([16, 12]); g.lineWidth = 5; g.strokeStyle = "#8ea4dc"; g.strokeText(p.t, p.x, p.y); g.setLineDash([]);
    m.fillStyle = "#000"; m.fillText(p.t, p.x, p.y);
    z.fillStyle = "#000"; z.fillText(p.t, p.x, p.y);
    z.lineJoin = "round"; z.lineWidth = PEN * 1.7; z.strokeStyle = "#000"; z.strokeText(p.t, p.x, p.y);
  }
  function clearInk(){ k.clearRect(0, 0, SZ, SZ); w.clearRect(0, 0, SZ, SZ); passed = false; stage.classList.remove("win"); }
  function select(j, speak){
    gi = j; clearInk(); msg.textContent = "";
    [...tabs.children].forEach((b, i) => { b.classList.toggle("on", i === gi); b.classList.toggle("ok", scores[i] > 0); });
    const it = items[gi];
    model.innerHTML = "";
    if(it.pic || it.word){ model.append(h("span", {class:"p"}, it.pic || ""), h("span", {}, it.word || "")); model.hidden = false; }
    else model.hidden = true;
    drawGuide();
    if(speak) ctx.say(it.say || it.g);
  }
  function pt(e){ const r = ink.getBoundingClientRect(); return {x:(e.clientX - r.left) * SZ / r.width, y:(e.clientY - r.top) * SZ / r.height}; }
  function seg(a, b){
    [[k, PEN, colour], [w, WIDE, "#000"]].forEach(([c, lw, col]) => {
      c.lineCap = "round"; c.lineJoin = "round"; c.lineWidth = lw; c.strokeStyle = col;
      c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x + 0.01, b.y); c.stroke();
    });
  }
  ink.addEventListener("pointerdown", e => {
    if(passed) return;
    e.preventDefault(); CS.sfx.unlock();
    if(!colour) colour = mainColour(stage);
    try{ ink.setPointerCapture(e.pointerId); }catch(_){}
    drawing = true; last = pt(e); seg(last, last);
  });
  ink.addEventListener("pointermove", e => { if(!drawing) return; const p = pt(e); seg(last, p); last = p; });
  const end = () => { if(!drawing) return; drawing = false; check(false); };
  ink.addEventListener("pointerup", end); ink.addEventListener("pointercancel", end);

  function measure(){
    const A = m.getImageData(0, 0, SZ, SZ).data, Z = z.getImageData(0, 0, SZ, SZ).data,
          I = k.getImageData(0, 0, SZ, SZ).data, W = w.getImageData(0, 0, SZ, SZ).data;
    let gt = 0, gc = 0, it = 0, ii = 0;
    for(let y = 0; y < SZ; y += 5) for(let x = 0; x < SZ; x += 5){
      const p = (y * SZ + x) * 4 + 3;
      if(A[p] > 100){ gt++; if(W[p] > 0) gc++; }
      if(I[p] > 0){ it++; if(Z[p] > 0) ii++; }
    }
    return {cov:gt ? gc / gt : 0, acc:it ? ii / it : 0, ink:it};
  }
  function check(manual){
    const s = measure();
    if(s.cov >= 0.72 && s.acc >= 0.7) return win(s);
    if(!manual) return;
    const t = s.cov < 0.72 ? ctx.T("keepGoing") : ctx.T("stayOn");
    msg.textContent = t; ctx.say(t);
    if(s.acc < 0.7) setTimeout(clearInk, 900);
  }
  function win(s){
    passed = true; stage.classList.add("win");
    const stars = (s.cov >= 0.85 && s.acc >= 0.85) ? 3 : (s.cov >= 0.78 && s.acc >= 0.78) ? 2 : 1;
    scores[gi] = Math.max(scores[gi], stars);
    tabs.children[gi].classList.add("ok");
    CS.sfx.good(); msg.textContent = CS.praise(L) + " " + "★".repeat(stars); ctx.say(CS.praise(L));
    const nextOpen = scores.findIndex((v, j) => v === 0 && j !== gi);
    if(nextOpen < 0){
      const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      setTimeout(() => { if(ctx.alive()) CS.finishScore(root, ctx, avg, Math.round(avg / 3 * 100), "", () => { scores.fill(0); select(0, true); }); }, 1100);
    } else setTimeout(() => { if(ctx.alive() && passed) select(nextOpen, true); }, 1400);
  }
  const root = h("div", {class:"trace"}, tabs, stage, msg, h("div", {class:"tbar"}, clearBtn, checkBtn, nextBtn));
  select(0, false);
  if(document.fonts && document.fonts.load){
    document.fonts.load(weight + " 100px " + font, items.map(i => i.g).join("")).then(() => { if(!passed) drawGuide(); }).catch(() => {});
  }
  ctx.onEnter(() => ctx.sayInst(items[gi].say || items[gi].g));
  ctx.test = {run(){ scores.fill(0); items.forEach((it, j) => { select(j, false); k.drawImage(mask, 0, 0); w.drawImage(zone, 0, 0); const s = measure(); if(s.cov >= .72 && s.acc >= .7) scores[j] = 3; }); return scores.every(v => v === 3); }};
  return root;
};

/* ===================== MATCH ===================== */
const LINE_COLS = ["#35b25a", "#ff8a1f", "#8a5cf6", "#e83e8c", "#1f9bd1"];
PT.match = function(page, ctx){
  const pairs = shuffle(page.pairs).slice(0, page.n || 4).map((p, i) => ({a:CS.norm(p[0]), b:CS.norm(p[1]), i}));
  const svg = svgEl("svg", {class:"mlines"});
  const colL = h("div", {class:"mcol l"}), colR = h("div", {class:"mcol r"});
  const root = h("div", {class:"match", "data-noswipe":""}, svg, colL, colR);
  let sel = null, done = 0, mistakes = 0;
  const say = o => { const t = CS.itemSay(o); if(t) ctx.say(t); };
  function card(side, p){
    const o = side === "l" ? p.a : p.b, b = CS.itemEl(o, "button", "mcard");
    b.addEventListener("click", () => tap(side, p, b, o));
    return b;
  }
  shuffle(pairs).forEach(p => colL.appendChild(card("l", p)));
  shuffle(pairs).forEach(p => colR.appendChild(card("r", p)));
  function tap(side, p, b, o){
    if(b.classList.contains("done")) return;
    CS.sfx.unlock(); say(o);
    if(!sel || sel.side === side){
      if(sel) sel.b.classList.remove("sel");
      sel = {side, p, b}; b.classList.add("sel"); CS.sfx.tap(); return;
    }
    if(sel.p.i === p.i){
      const lb = side === "l" ? b : sel.b, rb = side === "r" ? b : sel.b, col = LINE_COLS[done % LINE_COLS.length];
      [lb, rb].forEach(x => { x.classList.remove("sel"); x.classList.add("done"); x.style.setProperty("--mc", col); });
      svg.appendChild(svgEl("line", {x1:lb.offsetLeft + lb.offsetWidth, y1:lb.offsetTop + lb.offsetHeight / 2,
        x2:rb.offsetLeft, y2:rb.offsetTop + rb.offsetHeight / 2, stroke:col, "stroke-width":6, "stroke-linecap":"round"}));
      done++; sel = null; CS.sfx.good();
      if(done === pairs.length) setTimeout(finish, 700);
    } else {
      mistakes++; CS.sfx.bad(); CS.shake(b); CS.shake(sel.b); sel.b.classList.remove("sel"); sel = null;
    }
  }
  function finish(){
    if(!ctx.alive()) return;
    CS.finishScore(root, ctx, CS.starsByMistakes(mistakes), Math.max(0, 100 - mistakes * 15), "", () => {
      svg.innerHTML = ""; mistakes = 0; done = 0;
      [...colL.children, ...colR.children].forEach(x => { x.classList.remove("done"); x.style.removeProperty("--mc"); });
    });
  }
  ctx.test = {run(){ finish(); return true; }};
  return root;
};

/* ===================== SORT ===================== */
PT.sort = function(page, ctx){
  const bins = page.bins.map(CS.norm);
  const items = shuffle(page.items).slice(0, page.n || 8).map(t => Object.assign({}, CS.norm(t[0]), {bin:t[1], say:t[2]}));
  const tray = h("div", {class:"tray"}), binsEl = h("div", {class:"bins"});
  const root = h("div", {class:"sort", "data-noswipe":""}, tray, binsEl);
  let sel = null, left = items.length, mistakes = 0;
  items.forEach(it => {
    const c = CS.itemEl(it, "button", "chipi");
    c.addEventListener("click", () => {
      CS.sfx.unlock();
      if(sel) sel.el.classList.remove("sel");
      sel = {it, el:c}; c.classList.add("sel"); CS.sfx.tap();
      const t = CS.itemSay(it); if(t) ctx.say(t);
    });
    tray.appendChild(c);
  });
  const ins = bins.map((b, j) => {
    const inner = h("div", {class:"in"});
    const el = h("button", {class:"bin", type:"button"}, h("b", {}, (b.pic ? b.pic + " " : "") + (b.t || "")), inner);
    el.addEventListener("click", () => {
      if(!sel){ ctx.say(b.say || b.t || ""); return; }
      if(sel.it.bin === j){
        sel.el.remove();
        inner.appendChild(h("span", {class:sel.it.pic ? "" : "t"}, sel.it.pic || sel.it.t));
        CS.sfx.good(); CS.bump(el); sel = null; left--;
        if(left === 0) setTimeout(finish, 600);
      } else {
        mistakes++; CS.sfx.bad(); CS.shake(el);
        ctx.say(ctx.T("tryAgain"));
      }
    });
    binsEl.appendChild(el);
    return inner;
  });
  function finish(){
    if(!ctx.alive()) return;
    CS.finishScore(root, ctx, CS.starsByMistakes(mistakes), Math.max(0, 100 - mistakes * 12), "", null);
  }
  ctx.test = {run(){ finish(); return ins.length === bins.length; }};
  return root;
};

/* ===================== JOIN THE DOTS ===================== */
const POLY = {
  star:CS.range(0, 9).map(i => { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 0.4 : 1; return [0.5 + 0.5 * r * Math.cos(a), 0.53 + 0.5 * r * Math.sin(a)]; }),
  house:[[.5,.04],[.94,.42],[.94,.96],[.06,.96],[.06,.42]],
  fish:[[.02,.5],[.2,.28],[.46,.18],[.7,.28],[.82,.42],[.98,.22],[.98,.78],[.82,.58],[.7,.72],[.46,.82],[.2,.72]],
  kite:[[.5,.02],[.92,.4],[.5,.98],[.08,.4]],
  heart:CS.range(0, 23).map(i => { const t = Math.PI * 2 * i / 24;
    return [0.5 + 16 * Math.pow(Math.sin(t), 3) / 34, 0.46 - (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 34]; }),
  tree:[[.5,.02],[.88,.62],[.6,.62],[.6,.98],[.4,.98],[.4,.62],[.12,.62]],
  circle:CS.range(0, 23).map(i => [0.5 + 0.5 * Math.cos(-Math.PI / 2 + i * Math.PI / 12), 0.5 + 0.5 * Math.sin(-Math.PI / 2 + i * Math.PI / 12)])
};
function resample(poly, n){
  const segs = []; let tot = 0;
  poly.forEach((a, i) => { const b = poly[(i + 1) % poly.length], l = Math.hypot(b[0] - a[0], b[1] - a[1]); segs.push([a, b, l]); tot += l; });
  const out = [];
  for(let q = 0; q < n; q++){
    let d = tot * q / n, done = false;
    for(const [a, b, l] of segs){
      if(d <= l + 1e-9){ const t = l ? d / l : 0; out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); done = true; break; }
      d -= l;
    }
    if(!done) out.push(poly[poly.length - 1]);
  }
  return out;
}
PT.dots = function(page, ctx){
  const seq = page.seq.map(String), n = seq.length, S = 436, M = 40;
  const pts = resample(POLY[page.shape] || POLY.star, n).map(p => ({x:M + p[0] * (S - 2 * M), y:M + p[1] * (S - 2 * M)}));
  const svg = svgEl("svg", {viewBox:"0 0 " + S + " " + S});
  const board = h("div", {class:"dots", "data-noswipe":""}, svg);
  const tip = h("div", {class:"dtip"});
  const root = h("div", {style:{position:"relative", height:"100%"}}, board, tip);
  const btns = [];
  let next = 0, miss = 0;
  const say = t => ctx.say(t);
  pts.forEach((p, j) => {
    const b = h("button", {class:"dot", type:"button", style:{left:p.x + "px", top:p.y + "px"}}, seq[j]);
    b.addEventListener("click", () => tap(j, b));
    btns.push(b); board.appendChild(b);
  });
  tip.textContent = ctx.T("find", {t:seq[0]});
  function line(a, b, col){ svg.appendChild(svgEl("line", {x1:a.x, y1:a.y, x2:b.x, y2:b.y, stroke:col, "stroke-width":7, "stroke-linecap":"round"})); }
  function tap(j, b){
    if(next >= n || b.classList.contains("on")) return;
    CS.sfx.unlock();
    if(j !== next){
      miss++; CS.sfx.bad(); CS.shake(b);
      if(miss % 2 === 0) btns[next].classList.add("hintme");
      say(ctx.T("find", {t:seq[next]})); return;
    }
    const col = mainColour(board);
    b.classList.add("on"); b.classList.remove("hintme"); CS.sfx.tap(); say(seq[j]);
    if(j > 0) line(pts[j - 1], pts[j], col);
    next++;
    if(next < n){ tip.textContent = ctx.T("find", {t:seq[next]}); return; }
    line(pts[n - 1], pts[0], col);
    const poly = svgEl("polygon", {points:pts.map(p => p.x + "," + p.y).join(" "), fill:col, opacity:"0.18"});
    svg.insertBefore(poly, svg.firstChild);
    board.appendChild(h("div", {class:"reveal"}, page.pic || "⭐"));
    tip.textContent = ctx.T("done");
    CS.sfx.good();
    setTimeout(finish, 1300);
  }
  function finish(){
    if(!ctx.alive()) return;
    CS.finishScore(root, ctx, CS.starsByMistakes(miss), Math.max(0, 100 - miss * 10), "", () => {
      next = 0; miss = 0; svg.innerHTML = ""; btns.forEach(x => x.classList.remove("on", "hintme"));
      const r = board.querySelector(".reveal"); if(r) r.remove();
      tip.textContent = ctx.T("find", {t:seq[0]});
    });
  }
  ctx.onEnter(() => ctx.sayInst(ctx.T("find", {t:seq[0]})));
  ctx.test = {run(){ btns.forEach((b, j) => tap(j, b)); return next === n; }};
  return root;
};

/* ===================== MEMORY ===================== */
PT.memory = function(page, ctx){
  const pairs = shuffle(page.pairs).slice(0, page.n || 4);
  const deck = shuffle(pairs.flatMap((p, i) => [{o:CS.norm(p[0]), i}, {o:CS.norm(p[1]), i}]));
  const gridEl = h("div", {class:"mgrid"}), stat = h("div", {class:"mstat"}, ctx.T("tapCard"));
  const root = h("div", {class:"memory", "data-noswipe":""}, gridEl, stat);
  let open = [], found = 0, moves = 0, lock = false;
  const cards = deck.map(c => {
    const face = CS.itemEl(c.o, "div", "bk");
    const el = h("button", {class:"mem", type:"button"}, h("div", {class:"in"}, h("div", {class:"fr"}, "❓"), face));
    el.addEventListener("click", () => flip(c, el));
    gridEl.appendChild(el);
    return el;
  });
  function flip(c, el){
    if(lock || el.classList.contains("open") || el.classList.contains("done")) return;
    CS.sfx.unlock(); CS.sfx.tap();
    el.classList.add("open"); open.push({c, el});
    const t = CS.itemSay(c.o); if(t) ctx.say(t);
    if(open.length < 2) return;
    moves++; stat.textContent = ctx.T("moves", {n:moves});
    const [a, b] = open; open = [];
    if(a.c.i === b.c.i){
      setTimeout(() => { a.el.classList.add("done"); b.el.classList.add("done"); CS.sfx.good(); }, 350);
      found++;
      if(found === pairs.length) setTimeout(finish, 1000);
    } else {
      lock = true;
      setTimeout(() => { a.el.classList.remove("open"); b.el.classList.remove("open"); lock = false; }, 1100);
    }
  }
  function finish(){
    if(!ctx.alive()) return;
    const n = pairs.length, stars = moves <= n + 2 ? 3 : moves <= n * 2 + 1 ? 2 : 1;
    CS.finishScore(root, ctx, stars, Math.round(Math.min(1, n / Math.max(moves, 1)) * 100), ctx.T("moves", {n:moves}), null);
  }
  ctx.test = {run(){ moves = pairs.length; finish(); return cards.length === pairs.length * 2; }};
  return root;
};

/* ===================== BALLOON POP ===================== */
const BCOL = ["#ff5a7a", "#3b8cff", "#39c46c", "#ff9a2e", "#b76cff", "#f5c518", "#1fb5c9"];
PT.pop = function(page, ctx){
  const goal = page.goal || 6, targets = (page.targets || [page.target]).map(String), pool = page.pool.map(String);
  const banner = page.make ? ctx.T("popMake", {t:page.make}) : ctx.T("popGoal", {t:targets[0]});
  const spoken = page.make ? ctx.T("popMake", {t:page.makeSay || page.make}) : banner;
  const counter = h("em", {}, ctx.T("popped", {n:0, g:goal}));
  const field = h("div", {class:"popfield"});
  const start = h("div", {class:"popstart"}, h("div", {class:"big"}, "🎈"), h("p", {}, banner),
    h("button", {class:"kbtn sun", type:"button", onclick:() => begin()}, "▶ " + ctx.T("start")));
  const root = h("div", {class:"popgame", "data-noswipe":""},
    h("div", {class:"popbar"}, h("b", {}, banner), counter), field, start);
  let running = false, raf = 0, lastT = 0, spawnAcc = 0, got = 0, wrong = 0, balloons = [];
  const W = 436, H = 458;
  function spawn(){
    const hit = Math.random() < 0.45, label = hit ? pick(targets) : pick(pool);
    const el = h("button", {class:"balloon", type:"button"}, h("span", {class:"bb" + (CS.graphemes(label).length > 3 ? " sm" : ""), style:{background:pick(BCOL)}}, label));
    const b = {el, label, x:10 + rnd(W - 100), y:H + 10, v:62 + rnd(38), wob:Math.random() * 6};
    el.addEventListener("pointerdown", e => { e.preventDefault(); hitBalloon(b); });
    field.appendChild(el); balloons.push(b);
  }
  function hitBalloon(b){
    if(!running || b.gone) return;
    if(targets.indexOf(b.label) >= 0){
      b.gone = true; got++;
      const burst = h("div", {class:"burst", style:{left:(b.x + 10) + "px", top:(b.y + 10) + "px"}}, "💥");
      field.appendChild(burst); setTimeout(() => burst.remove(), 500);
      b.el.remove(); CS.sfx.pop();
      counter.textContent = ctx.T("popped", {n:got, g:goal});
      if(got >= goal) end();
    } else {
      wrong++; b.el.classList.remove("nope"); void b.el.offsetWidth; b.el.classList.add("nope");
      CS.sfx.bad(); ctx.say(page.make ? ctx.T("tryAgain") : ctx.T("find", {t:targets[0]}));
    }
  }
  function frame(t){
    if(!running) return;
    if(!root.isConnected){ stop(); return; }
    const dt = Math.min(0.05, (t - (lastT || t)) / 1000); lastT = t;
    spawnAcc += dt;
    if(spawnAcc > 0.9){ spawnAcc = 0; spawn(); }
    balloons = balloons.filter(b => {
      if(b.gone) return false;
      b.y -= b.v * dt; b.wob += dt * 2;
      if(b.y < -140){ b.el.remove(); return false; }
      b.el.style.transform = "translate(" + (b.x + Math.sin(b.wob) * 6) + "px," + b.y + "px)";
      return true;
    });
    raf = requestAnimationFrame(frame);
  }
  function begin(){
    CS.sfx.unlock(); start.hidden = true; got = 0; wrong = 0; counter.textContent = ctx.T("popped", {n:0, g:goal});
    running = true; lastT = 0; spawnAcc = 0.6; raf = requestAnimationFrame(frame);
    ctx.say(spoken);
  }
  function stop(){ running = false; cancelAnimationFrame(raf); balloons.forEach(b => b.el.remove()); balloons = []; }
  function end(){
    stop();
    CS.finishScore(root, ctx, CS.starsByMistakes(wrong), Math.max(0, 100 - wrong * 10), "", () => { start.hidden = false; });
  }
  ctx.onCleanup(stop);
  ctx.test = {run(){ begin(); spawn(); const b = balloons[0]; b.label = targets[0]; got = goal - 1; hitBalloon(b); return !running; }};
  return root;
};

/* ===================== COLOUR ===================== */
const SCENES = {
  fruits:{want:{apple:"red", leaf:"green", banana:"yellow", grapes:"purple", orange:"orange"},
    svg:'<path data-r="apple" d="M100 62 C72 40 28 54 30 102 C32 152 70 186 100 176 C130 186 168 152 170 102 C172 54 128 40 100 62Z"/>' +
        '<path d="M100 62 C100 46 104 36 112 28" fill="none"/>' +
        '<path data-r="leaf" d="M106 50 C116 24 146 22 154 32 C144 56 118 62 106 50Z"/>' +
        '<path data-r="banana" d="M228 60 C236 150 318 180 382 118 C388 110 380 100 370 106 C322 142 268 128 254 58 C252 44 230 44 228 60Z"/>' +
        '<g data-r="grapes"><circle cx="58" cy="252" r="22"/><circle cx="100" cy="252" r="22"/><circle cx="142" cy="252" r="22"/>' +
        '<circle cx="79" cy="290" r="22"/><circle cx="121" cy="290" r="22"/><circle cx="100" cy="328" r="22"/></g>' +
        '<path d="M100 230 L100 212 M100 216 C110 204 122 204 130 208" fill="none"/>' +
        '<circle data-r="orange" cx="300" cy="300" r="72"/><path d="M300 228 C306 216 318 212 328 214" fill="none"/>'},
  shapes:{want:{circle:"red", square:"blue", triangle:"yellow", star:"green"},
    svg:'<circle data-r="circle" cx="100" cy="100" r="72"/>' +
        '<rect data-r="square" x="230" y="30" width="140" height="140" rx="4"/>' +
        '<path data-r="triangle" d="M100 226 L178 368 H22 Z"/>' +
        '<path data-r="star" d="M300 222 L318 272 L372 272 L328 304 L345 356 L300 325 L255 356 L272 304 L228 272 L282 272 Z"/>'},
  garden:{want:{sun:"yellow", tree:"green", trunk:"brown", kite:"pink"},
    svg:'<path d="M80 12 V32 M80 128 V148 M12 80 H32 M128 80 H148 M32 32 L46 46 M114 114 L128 128 M128 32 L114 46 M46 114 L32 128" fill="none"/>' +
        '<circle data-r="sun" cx="80" cy="80" r="44"/>' +
        '<rect data-r="trunk" x="278" y="230" width="44" height="140" rx="6"/>' +
        '<circle data-r="tree" cx="300" cy="170" r="92"/>' +
        '<path data-r="kite" d="M110 200 L170 270 L110 360 L50 270 Z"/><path d="M110 360 C100 378 124 384 112 398" fill="none"/>'}
};
const CRAYONS = {red:"#e53935", blue:"#1e88e5", green:"#43a047", yellow:"#fdd835", orange:"#fb8c00", purple:"#8e24aa", pink:"#f06292", brown:"#8d5524"};
PT.colour = function(page, ctx){
  const scene = SCENES[page.scene || "fruits"], names = page.names || {}, cnames = page.colours || {};
  const want = scene.want, regions = Object.keys(want);
  const art = h("div", {class:"cart", "data-noswipe":"", html:'<svg viewBox="0 0 400 400"><g fill="#fff" stroke="#3a3a3a" stroke-width="5" stroke-linejoin="round" stroke-linecap="round">' + scene.svg + "</g></svg>"});
  const prompt = h("div", {class:"cprompt"});
  const pal = h("div", {class:"crayons"});
  const root = h("div", {class:"colour"}, prompt, art, pal);
  const filled = {};
  let cur = null, mistakes = 0;
  const cn = k => cnames[k] || k, on = k => names[k] || k;
  const line = r => CS.fmt(page.fmt || (ctx.lang === "hi" ? "{o} में {c} रंग भरो" : ctx.lang === "pa" ? "{o} ਵਿੱਚ {c} ਰੰਗ ਭਰੋ" : "Colour the {o} {c}"), {o:on(r), c:cn(want[r])});
  function showNext(speak){
    const r = regions.find(x => !filled[x]);
    prompt.innerHTML = "";
    if(!r){ prompt.textContent = ctx.T("done"); return; }
    prompt.append(h("i", {style:{background:CRAYONS[want[r]]}}), h("span", {}, line(r)));
    if(speak) ctx.say(line(r));
  }
  const colourKeys = page.crayons || Object.keys(CRAYONS);
  colourKeys.forEach(k => {
    const c = h("button", {class:"crayon", type:"button", "aria-label":cn(k), style:{background:CRAYONS[k], "--c":CRAYONS[k]}});
    c.addEventListener("click", () => { CS.sfx.unlock(); [...pal.children].forEach(x => x.classList.remove("sel")); c.classList.add("sel"); cur = k; ctx.say(cn(k)); });
    pal.appendChild(c);
  });
  art.querySelectorAll("[data-r]").forEach(el => {
    el.addEventListener("click", () => {
      const r = el.getAttribute("data-r");
      if(filled[r]) return;
      if(!cur){ ctx.say(ctx.T("colourPick") + " " + line(r)); return; }
      if(!page.free && cur !== want[r]){
        mistakes++; CS.sfx.bad(); ctx.say(ctx.T("wrongColour", {t:line(r)})); return;
      }
      el.style.fill = CRAYONS[cur]; el.classList.add("filled"); filled[r] = true; CS.sfx.good();
      if(regions.every(x => filled[x])){ showNext(false); setTimeout(finish, 800); }
      else showNext(true);
    });
  });
  function finish(){
    if(!ctx.alive()) return;
    CS.finishScore(root, ctx, CS.starsByMistakes(mistakes), Math.max(0, 100 - mistakes * 12), "", () => {
      regions.forEach(r => { filled[r] = false; }); mistakes = 0;
      art.querySelectorAll("[data-r]").forEach(el => { el.style.fill = ""; el.classList.remove("filled"); });
      showNext(true);
    });
  }
  showNext(false);
  ctx.onEnter(() => { const r = regions.find(x => !filled[x]); ctx.sayInst(r ? line(r) : ""); });
  ctx.test = {run(){ finish(); return art.querySelectorAll("[data-r]").length === regions.length; }};
  return root;
};

/* ===================== RHYME ===================== */
PT.rhyme = function(page, ctx){
  const lines = page.lines.map(l => typeof l === "string" ? {t:l} : l);
  const els = lines.map(l => h("button", {class:"rline", type:"button"}, l.t));
  els.forEach((el, i) => el.addEventListener("click", () => { CS.stopSay(); sing(i, i + 1); }));
  async function sing(a, b){
    const g = CS.sayGen();
    for(let i = a; i < b; i++){
      if(CS.sayGen() !== g || !ctx.alive()) return false;
      els.forEach(e => e.classList.remove("talk")); els[i].classList.add("talk");
      await ctx.say(lines[i].say || lines[i].t, {seq:true, rate:0.82});
    }
    els.forEach(e => e.classList.remove("talk"));
    if(b === lines.length && a === 0) ctx.record(null, null);
    return true;
  }
  ctx.onRead(() => sing(0, lines.length));
  ctx.test = {run(){ ctx.record(null, null); return true; }};
  return h("div", {class:"rhyme"},
    page.pics ? h("div", {class:"rpics"}, page.pics) : null,
    h("div", {class:"rlines"}, els),
    h("div", {style:{display:"flex", justifyContent:"center", flex:"none", paddingBottom:"4px"}},
      h("button", {class:"kbtn sun", type:"button", onclick:() => { CS.stopSay(); sing(0, lines.length); }}, "▶ " + ctx.T("singAlong"))));
};

/* ===================== WORD BUILDER =====================
 * Change the first letter to make new words: b+at, c+at, h+at.
 * page.fams = [{end:"at", onsets:["b","c","h","z"], words:{bat:"🦇", cat:"🐱", hat:"🎩"}}]
 * Onsets that are not in `words` are real letters that do NOT make a word - that is the point. */
PT.build = function(page, ctx){
  const fams = page.fams.map(f => ({end:f.end, onsets:f.onsets.slice(), words:f.words, keys:Object.keys(f.words)}));
  const total = fams.reduce((n, f) => n + f.keys.length, 0);
  const found = new Set();
  let fi = 0, mistakes = 0, done = false;

  const tabs = h("div", {class:"wbtabs"});
  const slotOn = h("span", {class:"wbon"}, "?"), slotEnd = h("span", {class:"wbend"}, "");
  const word = h("div", {class:"wbword"}, slotOn, slotEnd);
  const pic = h("div", {class:"wbpic"}, "");
  const keys = h("div", {class:"wbkeys"});
  const shelf = h("div", {class:"wbshelf"});
  const counter = h("em", {}, "0 / " + total);
  const root = h("div", {class:"wordbuild", "data-noswipe":""},
    h("div", {class:"wbbar"}, tabs, counter), h("div", {class:"wbstage"}, pic, word), keys, shelf);

  fams.forEach((f, j) => {
    const b = h("button", {class:"wbtab" + (j === 0 ? " on" : ""), type:"button"}, "-" + f.end);
    b.addEventListener("click", () => { CS.sfx.tap(); select(j); });
    tabs.appendChild(b);
  });
  if(fams.length < 2) tabs.style.visibility = "hidden";

  function select(j){
    fi = j;
    [...tabs.children].forEach((b, k) => b.classList.toggle("on", k === j));
    slotOn.textContent = "?"; slotOn.className = "wbon"; pic.textContent = "";
    slotEnd.textContent = fams[j].end;
    drawKeys(); drawShelf();
  }
  function drawKeys(){
    const f = fams[fi];
    keys.innerHTML = "";
    f.onsets.forEach(o => {
      const made = o + f.end, got = found.has(made);
      const b = h("button", {class:"wbkey" + (got ? " got" : ""), type:"button"}, o);
      b.addEventListener("click", () => tap(o, b));
      keys.appendChild(b);
    });
  }
  function drawShelf(){
    const f = fams[fi];
    shelf.innerHTML = "";
    f.keys.forEach(w => {
      const got = found.has(w);
      shelf.appendChild(h("span", {class:"wbslot" + (got ? " got" : "")},
        got ? (f.words[w] ? f.words[w] + " " : "") + w : "?"));
    });
  }
  function tap(o, btn){
    if(done) return;
    CS.sfx.unlock();
    const f = fams[fi], made = o + f.end, real = f.keys.indexOf(made) >= 0;
    slotOn.textContent = o;
    slotOn.className = "wbon" + (real ? " ok" : " no");
    pic.textContent = real ? (f.words[made] || "") : "";
    if(real){
      if(!found.has(made)){
        found.add(made); CS.sfx.good(); CS.bump(btn);
        btn.classList.add("got"); drawShelf();
        counter.textContent = found.size + " / " + total;
      }
      ctx.say(o + "... " + f.end + ". " + made + "!");
      if(found.size >= total) setTimeout(finish, 1100);
    } else {
      mistakes++; CS.sfx.bad(); CS.shake(btn);
      ctx.say(o + "... " + f.end + ". " + made + ". That is not a word. Try another letter.");
    }
  }
  function finish(){
    if(!ctx.alive() || done) return;
    done = true;
    CS.finishScore(root, ctx, CS.starsByMistakes(mistakes), Math.max(0, 100 - mistakes * 8), found.size + " / " + total, () => {
      found.clear(); mistakes = 0; done = false;
      counter.textContent = "0 / " + total; select(0);
    });
  }
  select(0);
  ctx.test = {run(){ fams.forEach(f => f.keys.forEach(w => found.add(w))); finish(); return true; }};
  return root;
};

/* ===================== CRATE GAME LINK ===================== */
PT.crate = function(page, ctx){
  const url = CS.CRATE_URL + "#subject=" + encodeURIComponent(page.subject) + "&level=" + page.level;
  return h("div", {class:"cratepg"},
    h("div", {class:"bigcrate"}, h("span", {}, page.face || "?")),
    h("p", {}, page.text || "Ready for a speed challenge? Open the crates before the timer runs out!"),
    h("a", {class:"kbtn sun", href:url, onclick:() => CS.stopSay()}, "📦 Play level " + page.level),
    h("p", {class:"small"}, "Timed extra practice. Use the back button to come back to this page."));
};

/* ===================== DOODLE ===================== */
PT.doodle = function(page, ctx){
  const cv = document.createElement("canvas"); cv.width = 872; cv.height = 660;
  const c = cv.getContext("2d"), box = h("div", {class:"dcanvas", "data-noswipe":""}, cv);
  let col = "#e53935", drawing = false, last = null, marked = false;
  const pal = h("div", {class:"crayons"});
  Object.keys(CRAYONS).concat(["black"]).forEach((k, i) => {
    const hex = CRAYONS[k] || "#222";
    const b = h("button", {class:"crayon" + (i === 0 ? " sel" : ""), type:"button", style:{background:hex, "--c":hex}});
    b.addEventListener("click", () => { [...pal.children].forEach(x => x.classList.remove("sel")); b.classList.add("sel"); col = hex; CS.sfx.tap(); });
    pal.appendChild(b);
  });
  const pt = e => { const r = cv.getBoundingClientRect(); return {x:(e.clientX - r.left) * cv.width / r.width, y:(e.clientY - r.top) * cv.height / r.height}; };
  cv.addEventListener("pointerdown", e => { e.preventDefault(); try{ cv.setPointerCapture(e.pointerId); }catch(_){} drawing = true; last = pt(e); draw(last); });
  cv.addEventListener("pointermove", e => { if(drawing){ draw(pt(e)); } });
  const end = () => { if(drawing && !marked){ marked = true; ctx.record(null, null); } drawing = false; };
  cv.addEventListener("pointerup", end); cv.addEventListener("pointercancel", end);
  function draw(p){ c.lineCap = "round"; c.lineJoin = "round"; c.lineWidth = 18; c.strokeStyle = col; c.beginPath(); c.moveTo(last.x, last.y); c.lineTo(p.x + 0.01, p.y); c.stroke(); last = p; }
  return h("div", {class:"doodle"}, box, pal,
    h("button", {class:"kbtn alt", type:"button", onclick:() => c.clearRect(0, 0, cv.width, cv.height)}, "↺ " + ctx.T("clear")));
};
})();
