const app = document.querySelector("#app");
const toast = document.querySelector("#toast");
const STORAGE_KEY = "pixel-bahcesi-stats";
const defaultStats = { games: {}, totalScore: 0, plays: 0 };
const gameInfo = {
  snake: { title: "Yılan", icon: "🐍", color: "var(--mint)", description: "Kuyruğuna çarpmadan büyü." },
  memory: { title: "Hafıza Kartları", icon: "🃏", color: "var(--pink)", description: "Eşleşen çiftleri bul." },
  rps: { title: "Taş Kağıt Makas", icon: "✊", color: "var(--yellow)", description: "Şansını bilgisayara karşı dene." },
  reflex: { title: "Refleks Testi", icon: "⚡", color: "var(--blue)", description: "Yeşil yanınca mümkün olduğunca hızlı bas." },
  guess: { title: "Sayı Tahmini", icon: "🔢", color: "var(--purple)", description: "Gizli sayıyı en az denemeyle yakala." },
  word: { title: "Kelime Bulmaca", icon: "🔤", color: "var(--mint)", description: "Karışık harfleri doğru sıraya koy." }
};
let stats = loadStats();
let activeCleanup = () => {};

function loadStats() { try { return { ...defaultStats, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") }; } catch { return { ...defaultStats }; } }
function saveStats() { localStorage.setItem(STORAGE_KEY, JSON.stringify(stats)); }
function record(game, score) {
  stats.plays++; stats.totalScore += Math.max(0, score);
  const current = stats.games[game] || { best: 0, plays: 0, last: 0 };
  current.best = Math.max(current.best, Math.max(0, score)); current.plays++; current.last = Math.max(0, score);
  stats.games[game] = current; saveStats();
}
function showToast(text) { toast.textContent = text; toast.classList.add("show"); clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove("show"), 2600); }
function setActiveNav(route) { document.querySelectorAll("[data-route]").forEach(a => a.classList.toggle("active", a.dataset.route === route)); }
function cardMarkup(id) { const g = gameInfo[id]; return `<article class="game-card" style="--accent:${g.color}"><div><div class="game-icon">${g.icon}</div><h3>${g.title}</h3><p>${g.description}</p></div><a class="play-link" href="#game/${id}">Oyna →</a></article>`; }
function home() {
  setActiveNav("home");
  app.innerHTML = `<section class="hero"><div class="hero-copy"><div class="eyebrow">Bugünün oyun molası</div><h1>Bir oyun seç,<br><em>skorunu parlat.</em></h1><p>Pixel Bahçesi'nde kuralları öğrenmek için saniyeler, ustalaşmak için bolca tekrar yeter. Hazır mısın?</p></div><div class="hero-art" aria-hidden="true"><span class="spark one">✦</span><div class="orb"></div><span class="spark two">✦</span></div></section><section><div class="section-heading"><h2>Oyun salonu</h2><span>6 mini oyun · sonsuz tekrar</span></div><div class="game-grid">${Object.keys(gameInfo).map(cardMarkup).join("")}</div></section>`;
}
function gameFrame(id, inner, subtitle = "Hazır olduğunda başla ve en iyi skorunu geç.") {
  const g = gameInfo[id]; setActiveNav("");
  app.innerHTML = `<section class="panel"><div class="game-top"><div><div class="eyebrow">${g.icon} ${g.title}</div><h1>${g.title}</h1><p>${subtitle}</p></div><div class="game-actions"><a class="ghost-button" href="#home">← Oyunlar</a><button class="primary-button" id="restart" type="button">Yeniden başlat</button></div></div><div class="stat-row"><div class="stat-pill">En iyi <b id="best-score">${stats.games[id]?.best || 0}</b></div><div class="stat-pill">Oyun <b>${stats.games[id]?.plays || 0}</b></div><div class="stat-pill">Skor <b id="live-score">0</b></div></div><div id="game-stage" class="game-stage">${inner}</div></section>`;
}
function statsPage() {
  setActiveNav("stats"); const entries = Object.entries(gameInfo);
  app.innerHTML = `<section class="panel"><div class="eyebrow">Kişisel salonun</div><h1>İstatistikler</h1><div class="stats-grid"><div class="big-stat"><strong>${stats.plays}</strong><span>Toplam oyun</span></div><div class="big-stat"><strong>${stats.totalScore}</strong><span>Toplam skor</span></div><div class="big-stat"><strong>${Math.max(...entries.map(([id]) => stats.games[id]?.best || 0), 0)}</strong><span>En yüksek skor</span></div></div><h2>Oyun karnesi</h2><div class="score-list">${entries.map(([id, g]) => `<div class="score-item"><span>${g.icon} ${g.title}</span><b>${stats.games[id]?.best || 0} puan · ${stats.games[id]?.plays || 0} oyun</b></div>`).join("")}</div>${stats.plays ? "" : '<div class="empty-state">Henüz bir oyun oynamadın. İlk skorunu bırakmak için salona dön!</div>'}</section>`;
}
function startGame(id) {
  if (!gameInfo[id]) return home();
  ({ snake: snakeGame, memory: memoryGame, rps: rpsGame, reflex: reflexGame, guess: guessGame, word: wordGame }[id])();
}
function bindRestart(fn) { document.querySelector("#restart").addEventListener("click", fn); }
function liveScore(value) { const el = document.querySelector("#live-score"); if (el) el.textContent = value; }

function rpsGame() {
  const choices = [["rock","✊","Taş"],["paper","✋","Kağıt"],["scissors","✌️","Makas"]];
  gameFrame("rps", `<div><div class="choice-row">${choices.map(([key, icon, label]) => `<button class="choice" data-choice="${key}"><span>${icon}</span>${label}</button>`).join("")}</div><div id="result" class="message" style="margin-top:24px">Bir seçim yap; bilgisayar bekliyor.</div></div>`, "İlk iki tur ısınma, sonra seri yakalamaya çalış.");
  let score = 0; const wins = { rock: "scissors", paper: "rock", scissors: "paper" };
  document.querySelectorAll("[data-choice]").forEach(btn => btn.addEventListener("click", () => {
    const player = btn.dataset.choice, computer = choices[Math.floor(Math.random() * 3)][0];
    const result = player === computer ? "Berabere!" : wins[player] === computer ? "Kazandın!" : "Bu tur bilgisayarın.";
    if (result === "Kazandın!") score += 10; else if (result === "Berabere!") score += 3;
    liveScore(score); document.querySelector("#result").innerHTML = `<strong>${result}</strong>Sen ${choices.find(c => c[0] === player)[1]}, bilgisayar ${choices.find(c => c[0] === computer)[1]} seçti.`;
    if (score >= 50) { record("rps", score); showToast("Seri tamamlandı! Skorun kaydedildi."); }
  })); bindRestart(rpsGame);
}
function memoryGame() {
  const symbols = ["🍉","🍉","🌈","🌈","🚀","🚀","🎧","🎧"]; let open = [], matched = 0, score = 0;
  gameFrame("memory", `<div><div class="memory-grid">${symbols.sort(() => Math.random() - .5).map((s, i) => `<button class="memory-card" data-index="${i}" data-symbol="${s}" aria-label="Kapalı kart">${s}</button>`).join("")}</div><div id="result" class="message" style="margin-top:20px">Tüm çiftleri bul. Hamle sayın düşük kalsın.</div></div>`, "Kartları aç, eşleri aklında tut, mümkün olan en az hamlede bitir.");
  const cards = [...document.querySelectorAll(".memory-card")]; let moves = 0;
  cards.forEach(card => card.addEventListener("click", () => {
    if (open.length === 2 || card.classList.contains("flipped") || card.classList.contains("matched")) return;
    card.classList.add("flipped"); open.push(card);
    if (open.length === 2) { moves++; const [a,b] = open;
      if (a.dataset.symbol === b.dataset.symbol) { a.classList.add("matched"); b.classList.add("matched"); matched++; score += 20; open = []; if (matched === 4) { score += Math.max(0, 40 - moves * 2); record("memory", score); document.querySelector("#result").innerHTML = `<strong>Harika hafıza! ${moves} hamlede tamamladın.</strong>Skorun kaydedildi.`; } }
      else setTimeout(() => { a.classList.remove("flipped"); b.classList.remove("flipped"); open = []; }, 700);
      liveScore(score);
    }
  })); bindRestart(memoryGame);
}
function guessGame() {
  let target = Math.floor(Math.random() * 100) + 1, attempts = 0;
  gameFrame("guess", `<div><form class="guess-form" id="guess-form"><input class="text-input" id="guess-input" type="number" min="1" max="100" placeholder="1–100 arası" required aria-label="Tahminin"><button class="primary-button">Tahmin et</button></form><div id="result" class="message" style="margin-top:22px">1 ile 100 arasında bir sayı tuttum.</div></div>`, "İpucunu takip et; az deneme, yüksek skor demek.");
  document.querySelector("#guess-form").addEventListener("submit", e => { e.preventDefault(); const input = document.querySelector("#guess-input"), value = Number(input.value); if (value < 1 || value > 100) return showToast("Lütfen 1 ile 100 arasında bir sayı gir.");
    attempts++; const result = document.querySelector("#result"); if (value === target) { const score = Math.max(10, 110 - attempts * 10); liveScore(score); record("guess", score); result.innerHTML = `<strong>Buldun! 🎉</strong>${attempts} denemede doğru cevap. Skorun kaydedildi.`; e.target.querySelector("button").disabled = true; } else result.innerHTML = `<strong>${value < target ? "Daha büyük!" : "Daha küçük!"}</strong>${attempts}. deneme — tekrar dene.`; input.select();
  }); bindRestart(guessGame);
}
function wordGame() {
  const words = ["KEDİ", "OYUN", "RENK", "UZAY", "MÜZİK"]; let answer = words[Math.floor(Math.random() * words.length)], letters = answer.split("").sort(() => Math.random() - .5).join(""); let score = 0;
  gameFrame("word", `<div><div class="word-display" id="scramble">${letters.split("").map(l => `<span class="letter-slot">${l}</span>`).join("")}</div><form class="word-form" id="word-form"><input class="text-input" id="word-input" autocomplete="off" placeholder="Kelimeyi yaz" aria-label="Tahminin" required><button class="primary-button">Kontrol et</button></form><div id="result" class="message" style="margin-top:22px">Karışık harfleri doğru kelimeye çevir.</div></div>`, "Harfleri çöz, kelimeyi bul ve seriyi uzat.");
  document.querySelector("#word-form").addEventListener("submit", e => { e.preventDefault(); const input = document.querySelector("#word-input"); const guess = input.value.trim().toLocaleUpperCase("tr-TR"); if (guess === answer) { score = 50; liveScore(score); record("word", score); document.querySelector("#result").innerHTML = `<strong>Doğru kelime: ${answer}!</strong>Kelime ustası oldun.`; e.target.querySelector("button").disabled = true; } else { document.querySelector("#result").innerHTML = `<strong>Yaklaştın!</strong>İpucu: ${answer.length} harfli bir kelime.`; input.select(); } }); bindRestart(wordGame);
}
function reflexGame() {
  gameFrame("reflex", `<div><button id="reflex-target" class="reflex-target waiting" type="button">Hazır mısın?</button><div id="result" class="message" style="margin-top:20px">Başlatmak için butona bas.</div></div>`, "Sarıdan yeşile döndüğü anı yakala. Erken basmak turu bozar.");
  const target = document.querySelector("#reflex-target"), result = document.querySelector("#result"); let started = false, readyAt = 0, timer;
  const begin = () => { clearTimeout(timer); started = true; target.className = "reflex-target waiting"; target.textContent = "Bekle..."; result.textContent = "Yeşil olmasını bekle!"; timer = setTimeout(() => { readyAt = performance.now(); target.className = "reflex-target ready"; target.textContent = "BAS!"; }, 900 + Math.random() * 2200); };
  target.addEventListener("click", () => { if (!started) return begin(); if (!readyAt) { clearTimeout(timer); started = false; result.innerHTML = "<strong>Erken bastın!</strong>Tekrar denemek için butona bas."; target.className = "reflex-target"; target.textContent = "Tekrar"; return; } const ms = Math.round(performance.now() - readyAt), score = Math.max(1, Math.round(1000 - ms)); liveScore(score); record("reflex", score); result.innerHTML = `<strong>${ms} ms ⚡</strong>Skorun kaydedildi. Daha da hızlanabilirsin!`; started = false; readyAt = 0; target.className = "reflex-target"; target.textContent = "Tekrar"; }); bindRestart(reflexGame); activeCleanup = () => clearTimeout(timer);
}
function snakeGame() {
  gameFrame("snake", `<div class="snake-wrap"><canvas class="snake-canvas" id="snake-canvas" width="360" height="360" aria-label="Yılan oyunu"></canvas><div class="key-hint">Yön tuşları veya WASD ile hareket et · Başlamak için bir tuşa bas</div><div id="result" class="message">Yemi yakala, duvarlara ve kuyruğuna dikkat et.</div></div>`, "Klasik arcade heyecanı: mümkün olduğunca uzun yaşa.");
  const canvas = document.querySelector("#snake-canvas"), ctx = canvas.getContext("2d"), size = 18, cells = 20; let snake = [{x:10,y:10}], dir = {x:1,y:0}, next = dir, food = {x:5,y:8}, timer, score = 0, running = false;
  function draw() { ctx.fillStyle = "#10152e"; ctx.fillRect(0,0,360,360); ctx.fillStyle = "#ff78bd"; ctx.beginPath(); ctx.arc(food.x*size+9, food.y*size+9, 7, 0, Math.PI*2); ctx.fill(); snake.forEach((part,i) => { ctx.fillStyle = i ? "#58e6bd" : "#ffd166"; ctx.fillRect(part.x*size+2,part.y*size+2,size-4,size-4); }); }
  function start() { if (running) return; running = true; document.querySelector("#result").textContent = "Başladı!"; timer = setInterval(tick, 125); }
  function tick() { dir = next; const head = {x: snake[0].x + dir.x, y: snake[0].y + dir.y}; if (head.x < 0 || head.x >= cells || head.y < 0 || head.y >= cells || snake.some(p => p.x === head.x && p.y === head.y)) return end(); snake.unshift(head); if (head.x === food.x && head.y === food.y) { score += 10; liveScore(score); do { food = {x: Math.floor(Math.random()*cells),y:Math.floor(Math.random()*cells)}; } while (snake.some(p => p.x === food.x && p.y === food.y)); } else snake.pop(); draw(); }
  function end() { clearInterval(timer); running = false; record("snake", score); document.querySelector("#result").innerHTML = `<strong>Oyun bitti!</strong>${score} puan — yeniden başlatmayı dene.`; }
  const keyHandler = e => { const key = e.key.toLowerCase(), map = {arrowup:{x:0,y:-1},w:{x:0,y:-1},arrowdown:{x:0,y:1},s:{x:0,y:1},arrowleft:{x:-1,y:0},a:{x:-1,y:0},arrowright:{x:1,y:0},d:{x:1,y:0}}; if (!map[key]) return; e.preventDefault(); const candidate = map[key]; if (candidate.x !== -dir.x || candidate.y !== -dir.y) next = candidate; start(); };
  document.addEventListener("keydown", keyHandler); activeCleanup = () => { clearInterval(timer); document.removeEventListener("keydown", keyHandler); }; draw(); bindRestart(snakeGame);
}
function route() { activeCleanup(); activeCleanup = () => {}; const hash = location.hash.slice(1) || "home"; if (hash === "home") home(); else if (hash === "stats") statsPage(); else if (hash.startsWith("game/")) startGame(hash.split("/")[1]); else home(); app.focus(); }
window.addEventListener("hashchange", route); document.querySelector("#theme-toggle").addEventListener("click", () => { document.body.classList.toggle("light"); localStorage.setItem("pixel-theme", document.body.classList.contains("light") ? "light" : "dark"); });
if (localStorage.getItem("pixel-theme") === "light") document.body.classList.add("light");
route();
