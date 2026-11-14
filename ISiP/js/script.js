/* ============================================
   1. ПЕРЕКЛЮЧАТЕЛЬ ТЕМЫ
   ============================================ */
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

const savedTheme = localStorage.getItem('vibe-theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
themeToggle.textContent = savedTheme === 'dark' ? '🌙' : '☀️';

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  themeToggle.textContent = next === 'dark' ? '🌙' : '☀️';
  localStorage.setItem('vibe-theme', next);
});

/* ============================================
   2. БУРГЕР-МЕНЮ
   ============================================ */
const burger = document.getElementById('burger');
const navList = document.querySelector('.nav-list');

burger.addEventListener('click', () => {
  navList.classList.toggle('open');
});

document.querySelectorAll('.nav-list a').forEach(a =>
  a.addEventListener('click', () => navList.classList.remove('open'))
);

/* ============================================
   3. REVEAL ПРИ СКРОЛЛЕ
   ============================================ */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ============================================
   4. ФОТОГАЛЕРЕЯ
   ============================================ */
const photoInput = document.getElementById('photoInput');
const photoGallery = document.getElementById('photoGallery');
const clearPhotos = document.getElementById('clearPhotos');
const emptyPhotos = document.getElementById('emptyPhotos');

let photos = JSON.parse(localStorage.getItem('vibe-photos') || '[]');

function renderPhotos() {
  photoGallery.innerHTML = '';
  emptyPhotos.style.display = photos.length ? 'none' : 'block';

  photos.forEach((src, i) => {
    const div = document.createElement('div');
    div.className = 'photo-item';
    div.innerHTML = `
      <img src="${src}" alt="Фото ${i + 1}" />
      <button class="photo-remove" data-index="${i}" aria-label="Удалить">✕</button>
    `;
    photoGallery.appendChild(div);
  });

  photoGallery.querySelectorAll('.photo-remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      photos.splice(+btn.dataset.index, 1);
      savePhotos();
      renderPhotos();
    });
  });
}

function savePhotos() {
  try {
    localStorage.setItem('vibe-photos', JSON.stringify(photos));
  } catch (e) {
    alert('Слишком много фото для сохранения. Удали пару старых.');
  }
}

photoInput.addEventListener('change', (e) => {
  const files = Array.from(e.target.files);
  files.forEach(file => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      photos.push(ev.target.result);
      savePhotos();
      renderPhotos();
    };
    reader.readAsDataURL(file);
  });
  e.target.value = '';
});

clearPhotos.addEventListener('click', () => {
  if (photos.length && confirm('Удалить все фото?')) {
    photos = [];
    savePhotos();
    renderPhotos();
  }
});

renderPhotos();

/* ============================================
   5. МУЗЫКА
   ============================================ */
const musicForm = document.getElementById('musicForm');
const musicList = document.getElementById('musicList');
const emptyMusic = document.getElementById('emptyMusic');
const songTitle = document.getElementById('songTitle');
const songArtist = document.getElementById('songArtist');

let songs = JSON.parse(localStorage.getItem('vibe-songs') || '[]');

function renderSongs() {
  musicList.innerHTML = '';
  emptyMusic.style.display = songs.length ? 'none' : 'block';

  songs.forEach((song, i) => {
    const li = document.createElement('li');
    li.className = 'music-item';
    li.innerHTML = `
      <span class="music-num">${String(i + 1).padStart(2, '0')}</span>
      <div class="music-info">
        <div class="music-title">${escapeHtml(song.title)}</div>
        <div class="music-artist">${escapeHtml(song.artist)}</div>
      </div>
      <button class="music-remove" data-index="${i}" aria-label="Удалить">✕</button>
    `;
    musicList.appendChild(li);
  });

  musicList.querySelectorAll('.music-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      songs.splice(+btn.dataset.index, 1);
      saveSongs();
      renderSongs();
    });
  });
}

function saveSongs() {
  localStorage.setItem('vibe-songs', JSON.stringify(songs));
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

musicForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = songTitle.value.trim();
  const artist = songArtist.value.trim();
  if (!title || !artist) return;

  songs.push({ title, artist });
  saveSongs();
  renderSongs();

  songTitle.value = '';
  songArtist.value = '';
});

renderSongs();

/* ============================================
   6. РЕАКЦИИ НА МЕМЫ
   ============================================ */
let reactions = JSON.parse(localStorage.getItem('vibe-reactions') || '{}');

document.querySelectorAll('.reaction-btn').forEach((btn, i) => {
  const count = btn.querySelector('span');
  const saved = reactions[i] || 0;
  count.textContent = saved;
  if (saved > 0) btn.classList.add('active');

  btn.addEventListener('click', () => {
    reactions[i] = (reactions[i] || 0) + 1;
    count.textContent = reactions[i];
    btn.classList.add('active');
    btn.style.transform = 'scale(1.3)';
    setTimeout(() => btn.style.transform = '', 200);
    localStorage.setItem('vibe-reactions', JSON.stringify(reactions));
  });
});

/* ============================================
   7. ГЕНЕРАТОР ВАЙБА ДНЯ
   ============================================ */
const vibes = [
  { emoji: '🚀', title: 'Продуктивный', text: 'Сегодня ты свернёшь горы. Список дел не устоит.', color: 'linear-gradient(90deg,#a855f7,#06b6d4)' },
  { emoji: '🌙', title: 'Тихий', text: 'День для себя. Наушники, плед, любимый сериал.', color: 'linear-gradient(90deg,#6366f1,#8b5cf6)' },
  { emoji: '🔥', title: 'Дерзкий', text: 'Надень самое смелое. Сегодня твой день!', color: 'linear-gradient(90deg,#f472b6,#fbbf24)' },
  { emoji: '☕', title: 'Уютный', text: 'Кофе, книга, тишина. Идеально.', color: 'linear-gradient(90deg,#fbbf24,#f59e0b)' },
  { emoji: '🎉', title: 'Тусовочный', text: 'Зови друзей. Сегодня вечер будет легендарным!', color: 'linear-gradient(90deg,#ec4899,#a855f7)' },
  { emoji: '🎨', title: 'Творческий', text: 'Создай что-то новое. Идея уже ждёт тебя.', color: 'linear-gradient(90deg,#06b6d4,#10b981)' },
  { emoji: '😴', title: 'Ленивый', text: 'Ничего не делай. Ты заслужил(а).', color: 'linear-gradient(90deg,#64748b,#94a3b8)' },
  { emoji: '💪', title: 'Спортивный', text: 'Прогулка, зал, растяжка — двигайся!', color: 'linear-gradient(90deg,#10b981,#06b6d4)' },
  { emoji: '🎮', title: 'Игровой', text: 'Один матч. Ну ладно, пять. Ок, все десять.', color: 'linear-gradient(90deg,#8b5cf6,#ec4899)' },
  { emoji: '✨', title: 'Волшебный', text: 'Сегодня случится что-то хорошее. Верь.', color: 'linear-gradient(90deg,#a855f7,#f472b6)' },
];

const genBtn = document.getElementById('genBtn');
const vibeResult = document.getElementById('vibeResult');
const vibeEmoji = document.getElementById('vibeEmoji');
const vibeTitle = document.getElementById('vibeTitle');
const vibeText = document.getElementById('vibeText');
const vibeColor = document.getElementById('vibeColor');

let lastVibe = -1;

genBtn.addEventListener('click', () => {
  let idx;
  do {
    idx = Math.floor(Math.random() * vibes.length);
  } while (idx === lastVibe && vibes.length > 1);
  lastVibe = idx;

  const vibe = vibes[idx];

  vibeResult.classList.add('bump');
  vibeEmoji.textContent = vibe.emoji;
  vibeTitle.textContent = vibe.title;
  vibeText.textContent = vibe.text;
  vibeColor.style.background = vibe.color;

  setTimeout(() => vibeResult.classList.remove('bump'), 400);
});

/* ============================================
   8. КВИЗ (7 вопросов)
   ============================================ */
const quizData = [
  {
    q: 'Твой идеальный вечер — это…',
    options: [
      { text: '🎧 Плейлист и наушники', type: 'chill' },
      { text: '🎉 Тусовка с друзьями', type: 'party' },
      { text: '📚 Книга и плед', type: 'cozy' },
      { text: '🎮 Игры до утра', type: 'gamer' },
    ],
  },
  {
    q: 'Что ты выберешь из еды?',
    options: [
      { text: '🍜 Рамен и аниме', type: 'cozy' },
      { text: '🍕 Пицца на всю компанию', type: 'party' },
      { text: '☕ Кофе и круассан', type: 'chill' },
      { text: '🍫 Что-то сладкое в 2 часа ночи', type: 'gamer' },
    ],
  },
  {
    q: 'Твой стиль в одежде?',
    options: [
      { text: '👟 Удобно и пофиг на мнение', type: 'chill' },
      { text: '🖤 Всё чёрное и стильное', type: 'cozy' },
      { text: '🌈 Ярко и смело', type: 'party' },
      { text: '🧢 Худи и кроссовки', type: 'gamer' },
    ],
  },
  {
    q: 'Где ты чаще всего зависаешь?',
    options: [
      { text: '🏠 Дома, в своей комнате', type: 'cozy' },
      { text: '🌃 Гуляю по городу', type: 'party' },
      { text: '💻 В интернете, конечно', type: 'chill' },
      { text: '🎮 За компом или консолью', type: 'gamer' },
    ],
  },
  {
    q: 'Как ты реагируешь на проблемы?',
    options: [
      { text: '🧘 Спокойно, всё решаемо', type: 'chill' },
      { text: '🗣️ Звоню другу, чтобы выговориться', type: 'party' },
      { text: '📝 Записываю и анализирую', type: 'cozy' },
      { text: '🎮 Ухожу в игру, чтобы отвлечься', type: 'gamer' },
    ],
  },
  {
    q: 'Твой идеальный отпуск?',
    options: [
      { text: '🏔️ Горы и тишина', type: 'chill' },
      { text: '🏖️ Море и тусовки', type: 'party' },
      { text: '🏡 Домик у озера с книгой', type: 'cozy' },
      { text: '🎮 Дома, никто не трогает', type: 'gamer' },
    ],
  },
  {
    q: 'Что для тебя счастье?',
    options: [
      { text: '🌙 Побыть наедине с собой', type: 'chill' },
      { text: '🎉 Много друзей и эмоций', type: 'party' },
      { text: '☕ Уютный вечер с близкими', type: 'cozy' },
      { text: '🏆 Победа в любимой игре', type: 'gamer' },
    ],
  },
];

const results = {
  chill: { title: '🌙 Chill вайб', text: 'Ты — человек тишины и глубоких мыслей. Тебе хорошо с собой, и это суперсила. Люди тянутся к твоему спокойствию.' },
  party: { title: '🎉 Party вайб', text: 'Ты — энергия комнаты. С тобой никогда не скучно, и все это знают. Ты умеешь зажечь даже самый скучный вечер.' },
  cozy:  { title: '☕ Cozy вайб',  text: 'Ты создаёшь уют вокруг себя. Тёплый, спокойный и очень настоящий. Рядом с тобой всегда комфортно и безопасно.' },
  gamer: { title: '🎮 Gamer вайб', text: 'Ты живёшь ночью и кайфуешь от процесса. Мир — твоя игра, и ты знаешь все чит-коды. Никогда не сдаёшься.' },
};

const quizBox = document.getElementById('quizBox');
const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const resultBox = document.getElementById('result');
const resultTitle = document.getElementById('resultTitle');
const resultText = document.getElementById('resultText');
const restart = document.getElementById('restart');

let current = 0;
let scores = {};

function renderQuestion() {
  const item = quizData[current];
  questionEl.textContent = `${current + 1}/${quizData.length}. ${item.q}`;
  optionsEl.innerHTML = '';
  item.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.textContent = opt.text;
    btn.addEventListener('click', () => {
      scores[opt.type] = (scores[opt.type] || 0) + 1;
      current++;
      if (current < quizData.length) renderQuestion();
      else showResult();
    });
    optionsEl.appendChild(btn);
  });
}

function showResult() {
  quizBox.classList.add('hidden');
  resultBox.classList.remove('hidden');
  const winner = Object.keys(scores).reduce((a, b) =>
    scores[a] >= scores[b] ? a : b
  );
  resultTitle.textContent = results[winner].title;
  resultText.textContent = results[winner].text;
}

function startQuiz() {
  current = 0;
  scores = {};
  quizBox.classList.remove('hidden');
  resultBox.classList.add('hidden');
  renderQuestion();
}

restart.addEventListener('click', startQuiz);
startQuiz();