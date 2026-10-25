'use strict';
/* =========================================================
   主語・述語・修飾語をみつけよう
   特別支援学校 中学部 国語（1段階）向け学習アプリ
   ---------------------------------------------------------
   文のデータの書き方：「ことば/役割」をスペースで区切る
     S = 主語　P = 述語　M = 修飾語
     M の後ろの数字 = くわしくしている言葉の番号（0から数える）
     a をつけると「すぐ前に置く言葉」（〜の・〜な など）
     漢字{よみ} と書くと ふりがな になる
   ========================================================= */

const ROLES = {
  S: { label: '主語', ruby: '主語{しゅご}', ask: 'だれが・なにが', cls: 's' },
  P: { label: '述語', ruby: '述語{じゅつご}', ask: 'どうする・どんなだ・なんだ', cls: 'p' },
  M: { label: '修飾語', ruby: '修飾語{しゅうしょくご}', ask: 'くわしく する ことば', cls: 'm' }
};

/* ----- ステップ1：3つのことばの文（10） ----- */
const NAME_SHORT = [
  'こたろうが/S はやく/M2 はしる。/P',
  'ここなが/S にっこり/M2 わらう。/P',
  'けんたが/S ごはんを/M2 たべる。/P',
  'はるきが/S うたを/M2 うたう。/P',
  'ひなたが/S ゆっくり/M2 あるく。/P',
  'こたろうが/S ボールを/M2 なげる。/P',
  'ここなの/M1a かみは/S ながい。/P',
  'けんたが/S げんきに/M2 あいさつする。/P',
  'はるきが/S プールで/M2 およぐ。/P',
  'ひなたの/M1a えは/S きれいだ。/P'
];

/* ----- ステップ2：ながい文（10） ----- */
const NAME_LONG = [
  'こたろうが/S こうえんで/M3 ボールを/M3 なげる。/P',
  'ここなが/S きょう/M4 としょかんで/M4 ほんを/M4 よむ。/P',
  'けんたは/S まいあさ/M3 がっこうへ/M3 いく。/P',
  'はるきが/S ともだちと/M3 たのしく/M3 あそぶ。/P',
  'ひなたが/S あかい/M2a ふうせんを/M3 もつ。/P',
  'こたろうの/M1a いぬが/S にわで/M4 げんきに/M4 はしる。/P',
  'ここなが/S おかあさんに/M3 てがみを/M3 かく。/P',
  'けんたが/S たいいくかんで/M3 ボッチャを/M3 する。/P',
  'はるきが/S おおきな/M2a こえで/M4 うたを/M4 うたう。/P',
  'ひなたが/S まいにち/M4 あさがおに/M4 みずを/M4 やる。/P'
];

/* ----- ステップ3：ものがたり ----- */
const STORIES = [
  { id: 'take', title: '竹取物語{たけとりものがたり}', lines: [
    'むかし、/M2 おじいさんが/S いました。/P',
    'おじいさんは/S まいにち/M4 山{やま}で/M4 たけを/M4 とりました。/P',
    'ある日{ひ}、/M3 一本{いっぽん}の/M2a たけが/S ひかっていました。/P',
    'たけの/M1a なかに/M4 ちいさな/M3a 女{おんな}の子{こ}が/S いました。/P',
    '女{おんな}の子{こ}は/S すくすくと/M3 大{おお}きく/M3 なりました。/P',
    '女{おんな}の子{こ}は/S かぐやひめと/M2 よばれました。/P',
    'かぐやひめは/S とても/M2a うつくしい/M3a 人{ひと}でした。/P',
    '十五夜{じゅうごや}の/M1a よる、/M4 月{つき}から/M4 むかえが/S きました。/P',
    'かぐやひめは/S 月{つき}へ/M2 かえりました。/P'
  ]},
  { id: 'momo', title: 'ももたろう', lines: [
    'おじいさんは/S 山{やま}へ/M3 しばかりに/M3 いきました。/P',
    'おばあさんは/S 川{かわ}へ/M3 せんたくに/M3 いきました。/P',
    '大{おお}きな/M1a ももが/S どんぶらこと/M3 ながれてきました。/P',
    'ももから/M3 げんきな/M2a 男{おとこ}の子{こ}が/S うまれました。/P',
    '男{おとこ}の子{こ}は/S ももたろうと/M2 なづけられました。/P',
    'ももたろうは/S きびだんごを/M2 もって/M3 でかけました。/P',
    'ももたろうたちは/S わるい/M2a おにを/M3 たいじしました。/P',
    'みんなは/S とても/M2 よろこびました。/P'
  ]},
  { id: 'usagi', title: 'うさぎと かめ', lines: [
    'うさぎが/S かめと/M3 かけっこを/M3 しました。/P',
    'うさぎは/S とても/M2a はやく/M3 はしりました。/P',
    'とちゅうで/M2 うさぎは/S ねむってしまいました。/P',
    'かめは/S やすまずに/M3 ゆっくり/M3 すすみました。/P',
    'さいごに/M2 かめが/S かちました。/P',
    'うさぎは/S とても/M2 くやしがりました。/P'
  ]},
  { id: 'kabu', title: 'おおきな かぶ', lines: [
    'おじいさんが/S はたけに/M4 かぶの/M3a たねを/M4 まきました。/P',
    'かぶは/S とても/M2a 大{おお}きく/M3 なりました。/P',
    'おじいさんは/S かぶを/M2 ひっぱりました。/P',
    'かぶは/S なかなか/M2 ぬけません。/P',
    'いぬも/S てつだいに/M2 きました。/P',
    'さいごに/M3 ねずみも/S いっしょに/M3 ひっぱりました。/P',
    'とうとう/M2 かぶが/S ぬけました。/P'
  ]}
];

/* ----- ステップ4：かくれた主語（choices の 1つめが こたえ） ----- */
const HIDDEN = [
  { text: 'けんたは こうえんに いきました。そして、ブランコに のりました。', q: '「ブランコに のりました」のは だれ？', choices: ['けんた', 'こうえん', 'ブランコ'] },
  { text: 'ここなは ケーキを 見{み}ました。「おいしそう！」と いいました。', q: '「おいしそう！」と いったのは だれ？', choices: ['ここな', 'ケーキ', 'はるき'] },
  { text: 'はるきは いえに かえりました。すぐに しゅくだいを はじめました。', q: 'しゅくだいを はじめたのは だれ？', choices: ['はるき', 'いえ', 'ひなた'] },
  { text: 'こたろうが ひなたに ボールを わたしました。ひなたは うれしそうに わらいました。', q: 'わらったのは だれ？', choices: ['ひなた', 'こたろう', 'ボール'] },
  { text: 'けんたは おなかが すきました。おにぎりを みっつ たべました。', q: 'おにぎりを たべたのは だれ？', choices: ['けんた', 'おなか', 'おにぎり'] },
  { text: 'ひなたは たいいくかんに いきました。ボッチャの ボールを なげました。', q: 'ボールを なげたのは だれ？', choices: ['ひなた', 'たいいくかん', 'ボッチャ'] },
  { text: 'かぐやひめは 月{つき}を 見{み}て いました。そして、しずかに なきました。', q: 'ないたのは だれ？', choices: ['かぐやひめ', '月{つき}', 'おじいさん'] },
  { text: 'ももたろうは いぬに きびだんごを あげました。いぬは よろこんで ついて いきました。', q: 'ついて いったのは だれ？', choices: ['いぬ', 'ももたろう', 'きびだんご'] },
  { text: 'ここなは はるきに てがみを かきました。はるきは それを よんで、にっこり しました。', q: 'てがみを かいたのは だれ？', choices: ['ここな', 'はるき', 'てがみ'] },
  { text: 'こたろうは あさ はやく おきました。かおを あらって、ごはんを たべました。', q: 'かおを あらったのは だれ？', choices: ['こたろう', 'かお', 'ごはん'] }
];

const APPLY_NAMES = {
  order: 'ならべかえ', target: 'どの ことばを くわしく している？',
  hidden: 'かくれた 主語{しゅご}', blank: 'あなうめ', mix: 'ミックス'
};
const PRAISE_GREAT = ['◎ すばらしい！', '◎ かんぺき！', '◎ よく できました！', '◎ その ちょうし！'];
const PRAISE_GOOD = ['○ よく がんばったね！', '○ できたね！', '○ おしい！ つぎも がんばろう'];

/* =================== ユーティリティ =================== */
const KANJI_RUBY = /([\u3005\u4E00-\u9FFF]+)\{([^{}]+)\}/g;
function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
const rb = t => esc(t).replace(KANJI_RUBY, '<ruby>$1<rt>$2</rt></ruby>');
const yomi = t => t.replace(KANJI_RUBY, '$2');
const noPunct = t => t.replace(/[。、]$/, '');
const randItem = a => a[Math.floor(Math.random() * a.length)];
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function parseSentence(str) {
  return str.trim().split(/\s+/).map(tok => {
    const k = tok.lastIndexOf('/');
    const tag = tok.slice(k + 1);
    const m = tag.slice(1).match(/^(\d+)?(a)?$/) || [];
    return { text: tok.slice(0, k), role: tag[0], to: m[1] !== undefined ? +m[1] : null, adj: !!m[2] };
  });
}
const roleTag = r => `<span class="tag ${ROLES[r].cls}">${rb(ROLES[r].ruby)}</span>`;

/* ならべかえの判定：まちがいがあれば ヒント文、なければ null */
function checkOrder(chunks, order) {
  const n = chunks.length;
  const pos = {};
  order.forEach((ci, k) => { pos[ci] = k; });
  if (chunks[order[n - 1]].role !== 'P') {
    const p = chunks.find(c => c.role === 'P');
    return `${roleTag('P')}「${rb(noPunct(p.text))}」は 文{ぶん}の さいごに おこう。`;
  }
  for (let i = 0; i < n; i++) {
    const c = chunks[i];
    if (c.to == null) continue;
    const a = rb(noPunct(c.text)), b = rb(noPunct(chunks[c.to].text));
    if (c.adj && pos[c.to] !== pos[i] + 1) return `「${a}」は「${b}」の すぐ まえに おこう。`;
    if (!c.adj && pos[c.to] < pos[i]) return `「${a}」は「${b}」より まえに おこう。`;
  }
  return null;
}

/* =================== せってい =================== */
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* 保存できなくても動く */ } }
};
const settings = Object.assign(
  { furigana: true, voice: true, sound: true, hint: true, count: 5, story: 'take', find: 'SP' },
  store.get('sjm-settings', {})
);
const saveSettings = () => store.set('sjm-settings', settings);

/* =================== 音・よみあげ =================== */
let actx = null;
function beep(kind) {
  if (!settings.sound) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    if (actx.state === 'suspended') actx.resume();
    const seq = { ok: [784, 1047], ng: [220, 196], great: [523, 659, 784, 1047], end: [523, 659, 784, 659, 784, 1047] }[kind] || [600];
    const t0 = actx.currentTime;
    seq.forEach((f, i) => {
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = kind === 'ng' ? 'triangle' : 'sine';
      o.frequency.value = f;
      const t = t0 + i * 0.11;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.25, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      o.connect(g); g.connect(actx.destination);
      o.start(t); o.stop(t + 0.2);
    });
  } catch (e) { /* 音が出せない環境 */ }
}
let jaVoice = null;
function pickVoice() {
  if (!('speechSynthesis' in window)) return;
  jaVoice = speechSynthesis.getVoices().find(v => /^ja/i.test(v.lang)) || null;
}
function speak(text, force) {
  if (!('speechSynthesis' in window)) return;
  if (!force && !settings.voice) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(yomi(text));
    u.lang = 'ja-JP';
    u.rate = 0.85;
    if (jaVoice) u.voice = jaVoice;
    speechSynthesis.speak(u);
  } catch (e) { /* よみあげ非対応 */ }
}
const sentenceText = chunks => chunks.map(c => c.text).join(' ');

/* =================== 画面 =================== */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
function show(id) {
  $$('.screen').forEach(s => s.classList.toggle('active', s.id === id));
  window.scrollTo(0, 0);
  if ('speechSynthesis' in window) speechSynthesis.cancel();
}
function shake(el) {
  if (!el) return;
  el.classList.remove('shake');
  void el.offsetWidth;
  el.classList.add('shake');
}
function chunkHTML(c, i, cls = '', tag = 'button') {
  const t = tag === 'button' ? ' type="button"' : '';
  return `<${tag}${t} class="chunk ${cls}" data-i="${i}"><span class="ct">${rb(c.text)}</span><span class="lab"></span></${tag}>`;
}
function markChunk(el, role) {
  el.classList.add('r-' + ROLES[role].cls);
  el.querySelector('.lab').innerHTML = rb(ROLES[role].ruby);
}
const sayBtnHTML = (id = '') => `<button type="button" class="say-btn" ${id ? `id="${id}"` : ''} aria-label="よみあげ">🔊</button>`;
function showHint(area, html) {
  const h = $('.hint-box', area);
  if (!h) return;
  h.innerHTML = html.replace(KANJI_RUBY, '<ruby>$1<rt>$2</rt></ruby>');
  h.hidden = false;
}
const hideHint = area => { const h = $('.hint-box', area); if (h) h.hidden = true; };

function summaryHTML(chunks) {
  const s = chunks.find(c => c.role === 'S'), p = chunks.find(c => c.role === 'P');
  let h = '<div class="summary">';
  if (s && p) h += `<div class="sum-line">${roleTag('S')}${rb(noPunct(s.text))} → ${roleTag('P')}${rb(noPunct(p.text))}</div>`;
  chunks.forEach(c => {
    if (c.role === 'M' && c.to != null) {
      h += `<div class="sum-line">${roleTag('M')}「${rb(noPunct(c.text))}」は「${rb(noPunct(chunks[c.to].text))}」を くわしく して いるよ</div>`;
    }
  });
  return h + '</div>';
}

/* =================== ゲーム進行 =================== */
let G = null;

function buildQueue(mode, type) {
  const take = n => (settings.count === 0 ? n : Math.min(settings.count, n));
  if (mode === 'short' || mode === 'long') {
    const src = mode === 'short' ? NAME_SHORT : NAME_LONG;
    return shuffle(src).slice(0, take(src.length)).map(s => ({ type: 'classify', chunks: parseSentence(s) }));
  }
  if (mode === 'story') {
    const st = settings.story === 'rand' ? randItem(STORIES) : (STORIES.find(s => s.id === settings.story) || STORIES[0]);
    G.title = 'ステップ3　' + st.title;
    const roles = settings.find === 'SPM' ? ['S', 'P', 'M'] : ['S', 'P'];
    return st.lines.map((l, li) => ({ type: 'extract', story: st, li, chunks: parseSentence(l), roles }));
  }
  // おうよう
  const n = settings.count === 0 ? 10 : settings.count;
  const nameAll = NAME_SHORT.concat(NAME_LONG);
  const targetPool = [];
  nameAll.concat(STORIES.flatMap(s => s.lines)).forEach(str => {
    parseSentence(str).forEach((c, mi) => { if (c.role === 'M' && c.to != null) targetPool.push({ str, mi }); });
  });
  const decks = {};
  const draw = (t, make) => {
    if (!decks[t] || !decks[t].length) decks[t] = shuffle(make());
    return decks[t].pop();
  };
  const gen = {
    order: () => ({ type: 'order', chunks: parseSentence(draw('order', () => nameAll)) }),
    target: () => { const x = draw('target', () => targetPool); return { type: 'target', chunks: parseSentence(x.str), mi: x.mi }; },
    hidden: () => ({ type: 'hidden', item: draw('hidden', () => HIDDEN) }),
    blank: () => makeBlank(draw('blank', () => nameAll))
  };
  const types = type === 'mix' ? ['order', 'target', 'hidden', 'blank'] : [type];
  const list = [];
  for (let k = 0; k < n; k++) list.push(types[k % types.length]);
  return shuffle(list).map(t => gen[t]());
}

function makeBlank(str) {
  const chunks = parseSentence(str);
  const bi = Math.floor(Math.random() * chunks.length);
  const role = chunks[bi].role;
  const used = new Set(chunks.map(c => noPunct(c.text)));
  const pool = NAME_SHORT.concat(NAME_LONG).flatMap(parseSentence).map(c => ({ role: c.role, text: noPunct(c.text) }));
  const opts = [{ text: noPunct(chunks[bi].text), ok: true }];
  ['S', 'P', 'M'].filter(r => r !== role).forEach(r => {
    const cands = pool.filter(c => c.role === r && !used.has(c.text) && !opts.some(o => o.text === c.text));
    opts.push({ text: randItem(cands).text, ok: false });
  });
  return { type: 'blank', chunks, bi, options: shuffle(opts) };
}

function startGame(mode, type) {
  G = { mode, type, i: 0, results: [], title: '' };
  if (mode === 'short') G.title = 'ステップ1　みじかい 文{ぶん}';
  if (mode === 'long') G.title = 'ステップ2　ながい 文{ぶん}';
  if (mode === 'apply') G.title = 'ステップ4　' + APPLY_NAMES[type];
  G.queue = buildQueue(mode, type);
  G.title = rb(G.title);
  show('quiz');
  renderQ();
}

function renderStatus() {
  $('#progress').textContent = `${Math.min(G.i + 1, G.queue.length)} / ${G.queue.length} もん`;
  $('#scoreNow').textContent = '◎ ' + G.results.filter(Boolean).length;
}

function renderQ() {
  const q = G.queue[G.i];
  $('#qTitle').innerHTML = G.title;
  renderStatus();
  const area = $('#qArea');
  area.innerHTML = '';
  ({ classify: rClassify, extract: rExtract, order: rOrder, target: rTarget, hidden: rHidden, blank: rBlank })[q.type](q, area);
  window.scrollTo(0, 0);
}

function finishQ(perfect, summary = '') {
  G.results.push(perfect);
  renderStatus();
  beep(perfect ? 'great' : 'ok');
  const last = G.i + 1 >= G.queue.length;
  const box = document.createElement('div');
  box.className = 'done-box ' + (perfect ? 'great' : 'good');
  box.innerHTML = `<div class="praise">${randItem(perfect ? PRAISE_GREAT : PRAISE_GOOD)}</div>${summary}
    <div><button type="button" class="next-btn">${last ? 'けっかを みる ▶' : 'つぎへ ▶'}</button></div>`;
  $('#qArea').appendChild(box);
  $('.next-btn', box).onclick = next;
  setTimeout(() => box.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
}

function next() {
  G.i++;
  if (G.i >= G.queue.length) showResult();
  else renderQ();
}

/* ---------- ステップ1・2：なかまわけ ---------- */
function rClassify(q, area) {
  const n = q.chunks.length;
  let pos = 0, miss = 0, perfect = true;
  area.innerHTML = `
    <p class="prompt">ひかって いる ことばは どれかな？ ボタンを おそう。</p>
    <div class="sentence-wrap"><div class="sentence">${q.chunks.map((c, i) => chunkHTML(c, i, '', 'span')).join('')}</div>${sayBtnHTML()}</div>
    <div class="hint-box" hidden></div>
    <div class="role-btns">${['S', 'P', 'M'].map(r =>
      `<button type="button" class="role-btn ${ROLES[r].cls}" data-role="${r}"><span>${rb(ROLES[r].ruby)}</span><small>${ROLES[r].ask}</small></button>`).join('')}</div>`;
  const els = $$('.chunk', area);
  const btns = $$('.role-btn', area);
  $('.say-btn', area).onclick = () => speak(sentenceText(q.chunks), true);
  speak(sentenceText(q.chunks));

  const setCur = () => els.forEach((el, i) => el.classList.toggle('current', i === pos));
  const advance = () => {
    pos++; miss = 0; setCur();
    if (pos >= n) {
      btns.forEach(b => { b.disabled = true; });
      finishQ(perfect, summaryHTML(q.chunks));
    }
  };
  const hintFor = c => {
    if (c.role === 'S') return 'ヒント：「だれが」「なにが」に あたる ことばかな？';
    if (c.role === 'P') return 'ヒント：文{ぶん}の さいごに ある「どうする」「どんなだ」「なんだ」の ことばかな？';
    return `ヒント：「${noPunct(q.chunks[c.to].text)}」を くわしく して いる ことばかな？`;
  };
  setCur();
  btns.forEach(btn => {
    btn.onclick = () => {
      if (pos >= n) return;
      const c = q.chunks[pos];
      if (btn.dataset.role === c.role) {
        beep('ok'); markChunk(els[pos], c.role); hideHint(area); advance();
      } else {
        beep('ng'); perfect = false; miss++;
        shake(els[pos]); shake(btn);
        if (miss >= 2) {
          els[pos].classList.add('revealed'); markChunk(els[pos], c.role);
          showHint(area, `「${noPunct(c.text)}」は ${roleTag(c.role)} だよ。`);
          advance();
        } else if (settings.hint) {
          showHint(area, hintFor(c));
        }
      }
    };
  });
}

/* ---------- ステップ3：ものがたりから ぬきだす ---------- */
function rExtract(q, area) {
  const st = q.story;
  const storyLines = st.lines.map(l => parseSentence(l).map(c => c.text).join(''));
  area.innerHTML = `
    <div class="story-box">
      <div class="story-title">📚 ${rb(st.title)} ${sayBtnHTML('storySay')}</div>
      <div class="story-text">${storyLines.map((l, li) =>
        `<span class="sline ${li === q.li ? 'now' : (li < q.li ? 'past' : '')}">${rb(l)}</span>`).join('')}</div>
    </div>
    <p class="prompt" id="exPrompt"></p>
    <div class="sentence-wrap"><div class="sentence tap">${q.chunks.map((c, i) => chunkHTML(c, i)).join('')}</div>${sayBtnHTML('sentSay')}</div>
    <div class="hint-box" hidden></div>`;
  $('#storySay', area).onclick = () => speak(storyLines.join(''), true);
  $('#sentSay', area).onclick = () => speak(sentenceText(q.chunks), true);
  speak(sentenceText(q.chunks));

  const els = $$('.chunk', area);
  const steps = q.roles.filter(r => q.chunks.some(c => c.role === r));
  let si = 0, miss = 0, perfect = true;
  const remaining = r => q.chunks.filter((c, i) => c.role === r && !els[i].classList.contains('found')).length;
  const setPrompt = () => {
    const r = steps[si];
    $('#exPrompt', area).innerHTML = `${roleTag(r)}を ${r === 'M' ? 'ぜんぶ ' : ''}タッチしよう<br><small>（${ROLES[r].ask}）</small>` +
      (r === 'M' ? `<span class="rest">あと ${remaining(r)}こ</span>` : '');
  };
  const roleHint = r => ({
    S: 'ヒント：「〜が」「〜は」「〜も」が ついて いる ことが おおいよ。',
    P: 'ヒント：文{ぶん}の いちばん さいごを みて みよう。',
    M: 'ヒント：ほかの ことばを くわしく して いる ことばだよ。「いつ」「どこで」「なにを」「どんな」を かんがえよう。'
  }[r]);
  const nextStep = () => {
    si++; miss = 0;
    if (si >= steps.length) {
      $('#exPrompt', area).innerHTML = 'みつけられたね！';
      finishQ(perfect, summaryHTML(q.chunks));
    } else setPrompt();
  };
  setPrompt();
  els.forEach((el, i) => {
    el.onclick = () => {
      if (si >= steps.length || el.classList.contains('found')) return;
      const r = steps[si];
      if (q.chunks[i].role === r) {
        beep('ok'); el.classList.add('found'); markChunk(el, r); hideHint(area); miss = 0;
        if (remaining(r) === 0) nextStep(); else setPrompt();
      } else {
        beep('ng'); perfect = false; miss++; shake(el);
        if (miss >= 3) {
          els.forEach((e, j) => {
            if (q.chunks[j].role === r && !e.classList.contains('found')) { e.classList.add('found', 'revealed'); markChunk(e, r); }
          });
          showHint(area, `こたえを たしかめよう。いろが ついた ことばが ${roleTag(r)} だよ。`);
          nextStep();
        } else if (settings.hint) {
          showHint(area, roleHint(r));
        }
      }
    };
  });
}

/* ---------- ステップ4：ならべかえ ---------- */
function rOrder(q, area) {
  const n = q.chunks.length;
  let pool = shuffle([...Array(n).keys()]);
  while (pool.every((v, k) => v === k)) pool = shuffle(pool);
  let order = [], tries = 0, perfect = true, done = false;
  area.innerHTML = `
    <p class="prompt">ことばを タッチして ならべかえ、ただしい ${rb('文{ぶん}')}を つくろう。</p>
    <div class="ans-row" id="ans"></div>
    <div class="pool-row" id="pool"></div>
    <div class="hint-box" hidden></div>
    <div class="ctrl"><button type="button" class="sub-btn" id="resetBtn">やりなおす</button><button type="button" class="main-btn" id="checkBtn" disabled>こたえあわせ</button></div>`;
  const cHTML = ci => `<button type="button" class="chunk" data-ci="${ci}"><span class="ct">${rb(noPunct(q.chunks[ci].text))}</span><span class="lab"></span></button>`;
  const drawRows = () => {
    $('#ans', area).innerHTML = order.length ? order.map(cHTML).join('') + '<span class="period">。</span>' : '<span class="placeholder">ここに ならぶよ</span>';
    $('#pool', area).innerHTML = pool.filter(ci => !order.includes(ci)).map(cHTML).join('');
    $$('#pool .chunk', area).forEach(el => el.onclick = () => {
      if (done) return;
      order.push(+el.dataset.ci); speak(q.chunks[+el.dataset.ci].text); drawRows();
    });
    $$('#ans .chunk', area).forEach(el => el.onclick = () => {
      if (done) return;
      order = order.filter(ci => ci !== +el.dataset.ci); drawRows();
    });
    $('#checkBtn', area).disabled = done || order.length < n;
  };
  const finish = () => {
    done = true;
    $$('#ans .chunk', area).forEach(el => markChunk(el, q.chunks[+el.dataset.ci].role));
    $('#checkBtn', area).disabled = true; $('#resetBtn', area).disabled = true;
    speak(order.map(ci => q.chunks[ci].text).join(' '));
    finishQ(perfect, summaryHTML(q.chunks));
  };
  $('#resetBtn', area).onclick = () => { if (!done) { order = []; hideHint(area); drawRows(); } };
  $('#checkBtn', area).onclick = () => {
    if (done) return;
    const err = checkOrder(q.chunks, order);
    if (!err) { beep('ok'); hideHint(area); finish(); return; }
    beep('ng'); perfect = false; tries++; shake($('#ans', area));
    if (tries >= 2) {
      order = [...Array(n).keys()];
      drawRows();
      showHint(area, 'こたえの れいを みて みよう。');
      finish();
    } else {
      showHint(area, settings.hint ? 'ヒント：' + err : 'もういちど かんがえよう。');
    }
  };
  drawRows();
}

/* ---------- ステップ4：どのことばを くわしく している？ ---------- */
function rTarget(q, area) {
  const m = q.chunks[q.mi];
  let miss = 0, perfect = true, done = false;
  area.innerHTML = `
    <p class="prompt">${roleTag('M')}「${rb(noPunct(m.text))}」は<br>どの ことばを くわしく して いるかな？</p>
    <div class="sentence-wrap"><div class="sentence tap">${q.chunks.map((c, i) => chunkHTML(c, i)).join('')}</div>${sayBtnHTML()}</div>
    <div class="hint-box" hidden></div>`;
  const els = $$('.chunk', area);
  markChunk(els[q.mi], 'M');
  $('.say-btn', area).onclick = () => speak(sentenceText(q.chunks), true);
  speak(sentenceText(q.chunks));
  const result = () => {
    done = true;
    els[m.to].classList.add('target-ok');
    finishQ(perfect, `<div class="summary">「${rb(noPunct(m.text))}」→「${rb(noPunct(q.chunks[m.to].text))}」<br>つなげて よむと「${rb(noPunct(m.text))} ${rb(noPunct(q.chunks[m.to].text))}」</div>`);
  };
  els.forEach((el, i) => {
    el.onclick = () => {
      if (done || i === q.mi) return;
      if (i === m.to) { beep('ok'); hideHint(area); result(); return; }
      beep('ng'); perfect = false; miss++; shake(el);
      if (miss >= 2) { showHint(area, 'こたえを たしかめよう。'); result(); }
      else if (settings.hint) showHint(area, `ヒント：「${noPunct(m.text)}」の あとに つづけて よんで みよう。いみが つながるのは どれかな？`);
    };
  });
}

/* ---------- ステップ4：かくれた主語 ---------- */
function rHidden(q, area) {
  const it = q.item;
  const answer = it.choices[0];
  let miss = 0, perfect = true, done = false;
  area.innerHTML = `
    <p class="prompt">おはなしを よんで こたえよう。</p>
    <div class="story-box"><div class="story-text big">${rb(it.text)}</div>${sayBtnHTML()}</div>
    <p class="question">${rb(it.q)}</p>
    <div class="choice-grid">${shuffle(it.choices).map(c => `<button type="button" class="choice" data-v="${esc(c)}">${rb(c)}</button>`).join('')}</div>
    <div class="hint-box" hidden></div>`;
  $('.say-btn', area).onclick = () => speak(it.text + '。' + it.q, true);
  speak(it.text + '。' + it.q);
  const result = () => {
    done = true;
    $$('.choice', area).forEach(b => { if (b.dataset.v === answer) b.classList.add('ok'); else b.disabled = true; });
    finishQ(perfect, `<div class="summary">${roleTag('S')}は「${rb(answer)}」だよ。<br>${rb('文{ぶん}')}の なかで ${roleTag('S')}が かくれて いたね。</div>`);
  };
  $$('.choice', area).forEach(b => {
    b.onclick = () => {
      if (done) return;
      if (b.dataset.v === answer) { beep('ok'); hideHint(area); result(); return; }
      beep('ng'); perfect = false; miss++; shake(b); b.disabled = true;
      if (miss >= 2) result();
      else if (settings.hint) showHint(area, 'ヒント：まえの 文{ぶん}を みて みよう。「〜は」「〜が」の ついた ひと（いきもの）が いるかな？');
    };
  });
}

/* ---------- ステップ4：あなうめ ---------- */
function rBlank(q, area) {
  const role = q.chunks[q.bi].role;
  let perfect = true, done = false;
  area.innerHTML = `
    <p class="prompt">（　）に はいる ことばを えらぼう。</p>
    <div class="sentence-wrap"><div class="sentence">${q.chunks.map((c, i) => i === q.bi
      ? '<span class="chunk blank"><span class="ct">（　）</span><span class="lab"></span></span>'
      : chunkHTML({ text: noPunct(c.text) }, i, '', 'span')).join('')}<span class="period">。</span></div></div>
    ${settings.hint ? `<p class="role-hint">ヒント：（　）には ${roleTag(role)}（${ROLES[role].ask}）が はいるよ。</p>` : ''}
    <div class="choice-grid">${q.options.map((o, k) => `<button type="button" class="choice" data-k="${k}">${rb(o.text)}</button>`).join('')}</div>`;
  $$('.choice', area).forEach(b => {
    b.onclick = () => {
      if (done) return;
      const o = q.options[+b.dataset.k];
      if (o.ok) {
        done = true; beep('ok');
        const bl = $('.chunk.blank', area);
        bl.classList.remove('blank');
        $('.ct', bl).innerHTML = rb(o.text);
        markChunk(bl, role);
        b.classList.add('ok');
        $$('.choice', area).forEach(x => { if (x !== b) x.disabled = true; });
        speak(sentenceText(q.chunks));
        finishQ(perfect, summaryHTML(q.chunks));
      } else {
        beep('ng'); perfect = false; shake(b); b.disabled = true;
      }
    };
  });
}

/* ---------- けっか ---------- */
function showResult() {
  const total = G.results.length;
  const ok = G.results.filter(Boolean).length;
  const ratio = total ? ok / total : 0;
  const stars = ratio >= 0.9 ? 3 : ratio >= 0.6 ? 2 : 1;
  const msg = stars === 3 ? 'すばらしい！ ことばの やくわりが よく わかって いるね！'
    : stars === 2 ? 'よく がんばったね！ もう すこしで かんぺき！'
    : 'さいごまで がんばったね！ もういちど やって みよう！';
  $('#resultBody').innerHTML = `
    <div class="res-stars">${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>
    <div class="res-score">◎ <span>${ok}</span> / ${total}</div>
    <p class="res-msg">${msg}</p>
    <div class="res-list">${G.results.map((r, i) => `<span class="${r ? 'o' : ''}">${i + 1}<br>${r ? '◎' : '○'}</span>`).join('')}</div>
    <p class="res-legend">◎ …いっかいで せいかい　○ …がんばって せいかい</p>`;
  show('result');
  beep('end');
}

/* =================== はじめの じゅんび =================== */
function syncSeg(id, value) {
  $$(`#${id} button`).forEach(b => b.classList.toggle('on', b.dataset.v === String(value)));
}
function applySettings() {
  document.body.classList.toggle('no-furi', !settings.furigana);
  $('#tgFuri').checked = settings.furigana;
  $('#tgVoice').checked = settings.voice;
  $('#tgSound').checked = settings.sound;
  $('#tgHint').checked = settings.hint;
  syncSeg('countSeg', settings.count);
  syncSeg('storySeg', settings.story);
  syncSeg('findSeg', settings.find);
}

function init() {
  $('#storySeg').innerHTML = STORIES.map(s => `<button type="button" data-v="${s.id}">${rb(s.title)}</button>`).join('') +
    '<button type="button" data-v="rand">🎲 ランダム</button>';

  [['countSeg', 'count', Number], ['storySeg', 'story', String], ['findSeg', 'find', String]].forEach(([id, key, conv]) => {
    $$(`#${id} button`).forEach(b => b.addEventListener('click', () => {
      settings[key] = conv(b.dataset.v); saveSettings(); syncSeg(id, settings[key]);
    }));
  });
  [['tgFuri', 'furigana'], ['tgVoice', 'voice'], ['tgSound', 'sound'], ['tgHint', 'hint']].forEach(([id, key]) => {
    $('#' + id).addEventListener('change', e => { settings[key] = e.target.checked; saveSettings(); applySettings(); });
  });

  $$('.start').forEach(b => b.addEventListener('click', () => startGame(b.dataset.mode)));
  $$('.apply-btn').forEach(b => b.addEventListener('click', () => startGame('apply', b.dataset.type)));
  $$('[data-go]').forEach(b => b.addEventListener('click', () => show(b.dataset.go)));
  $$('[data-say]').forEach(b => b.addEventListener('click', () => speak(b.dataset.say, true)));

  $('#quitBtn').addEventListener('click', () => { if (confirm('おわりに しますか？')) show('home'); });
  $('#homeBtn').addEventListener('click', () => show('home'));
  $('#retryBtn').addEventListener('click', () => startGame(G.mode, G.type));

  if ('speechSynthesis' in window) {
    pickVoice();
    speechSynthesis.onvoiceschanged = pickVoice;
  }
  applySettings();
  setupOffline();
}

/* =================== オフライン対応 =================== */
function setupOffline() {
  const el = $('#offlineStatus');
  const set = (txt, ok) => { if (el) { el.textContent = txt; el.classList.toggle('ok', !!ok); } };
  if (!('serviceWorker' in navigator) || location.protocol === 'file:') {
    set('※ オフラインで つかうには、GitHub Pages の ページを ひらいてください。');
    return;
  }
  navigator.serviceWorker.register('sw.js')
    .then(() => navigator.serviceWorker.ready)
    .then(() => set('✅ オフラインでも つかえます（ホームがめんに ついか すると べんり）', true))
    .catch(() => set('※ オフラインの じゅんびが できませんでした。ネットに つないで ひらきなおしてください。'));
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', init);
}
if (typeof module !== 'undefined') {
  module.exports = { parseSentence, checkOrder, NAME_SHORT, NAME_LONG, STORIES, HIDDEN, makeBlank, rb, yomi };
}
