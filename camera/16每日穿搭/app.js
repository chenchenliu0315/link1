/*
 * 风格捕手小游戏：随机穿搭任务、限时选品、连击计分、回合结算与 MediaPipe 手势交互。
 * 摄像头由玩家主动开启；手势识别不可用时，点击和方向键仍可完成整局游戏。
 */
document.addEventListener('DOMContentLoaded', () => {
  const data = window.OUTFIT_DATA;
  const slots = [
    { id: 'top', label: '上装', name: '挑选上装', type: '上装', icon: '▤' },
    { id: 'bottom', label: '下装', name: '挑选下装', type: '下装', icon: '▥' },
    { id: 'shoes', label: '鞋履', name: '挑选鞋履', type: '鞋履', icon: '⌑' },
    { id: 'accessory', label: '配饰', name: '挑选配饰', type: '配饰', icon: '✳' }
  ];
  const itemKeys = { top: 'top', bottom: 'bottom', shoes: 'shoes', accessory: 'accessory' };
  const state = { age: 'young', round: 0, score: 0, combo: 0, best: 0, seconds: 60, slotIndex: 0, target: null, choices: [], selected: null, picks: [], active: true, finished: false };
  const ui = {
    score: document.querySelector('#score-display'), timer: document.querySelector('#timer-display'), best: document.querySelector('#best-display'),
    round: document.querySelector('#round-number'), subtitle: document.querySelector('#quest-subtitle'), tags: document.querySelector('#quest-tags'),
    ageOptions: document.querySelector('#age-options'), rule: document.querySelector('#quest-rule-text'), combo: document.querySelector('#combo-display'), comboFill: document.querySelector('#combo-fill'),
    avatar: document.querySelector('#avatar-image'), stageStyle: document.querySelector('#stage-style-label'), stageWeather: document.querySelector('#stage-weather'),
    avatarMood: document.querySelector('#avatar-mood'), avatarTitle: document.querySelector('#avatar-title'), sticker: document.querySelector('#avatar-sticker'),
    equipped: document.querySelector('#equipped-items'), equippedCount: document.querySelector('#equipped-count'), title: document.querySelector('#wardrobe-title'),
    pieceCount: document.querySelector('#piece-count'), progress: document.querySelector('#piece-progress'), hint: document.querySelector('#wardrobe-hint'),
    options: document.querySelector('#wardrobe-options'), confirm: document.querySelector('#confirm-piece'), gameState: document.querySelector('#game-state-label'),
    result: document.querySelector('#result-overlay'), finalScore: document.querySelector('#final-score'), resultMessage: document.querySelector('#result-message'),
    breakdown: document.querySelector('#result-breakdown'), save: document.querySelector('#save-look'), cameraToggle: document.querySelector('#camera-toggle'),
    cameraLabel: document.querySelector('#camera-button-label'), cameraDock: document.querySelector('#camera-dock'), cameraVideo: document.querySelector('#camera-video'),
    canvas: document.querySelector('#hand-canvas'), placeholder: document.querySelector('#camera-placeholder'), cameraStatus: document.querySelector('#camera-status'),
    cameraDot: document.querySelector('#camera-status-dot'), gesture: document.querySelector('#gesture-label'), guidance: document.querySelector('#camera-guidance'),
    cursor: document.querySelector('#gesture-cursor'), toast: document.querySelector('#toast')
  };
  let timerHandle = null;
  let toastHandle = null;
  let cameraStream = null;
  let handsModel = null;
  let framePending = false;
  let lastGesture = 'none';
  let gestureSince = 0;
  let actedForGesture = false;
  let waveSamples = [];
  let lastWaveAt = 0;
  let pointTarget = null;
  let pointSince = 0;

  const imageUrl = (photo, width = 360) => `${data.imageBase}${photo}?auto=format&fit=crop&w=${width}&q=82`;
  const choose = items => items[Math.floor(Math.random() * items.length)];
  const escapeText = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
  const ageProfile = () => data.ageGroups.find(item => item.id === state.age);
  const weatherRule = () => data.weatherRules[state.target.weather.id];
  const pieceFor = (style, slot) => style[itemKeys[slot.id]];

  function showToast(message) {
    ui.toast.textContent = message;
    ui.toast.classList.add('is-visible');
    clearTimeout(toastHandle);
    toastHandle = setTimeout(() => ui.toast.classList.remove('is-visible'), 2200);
  }

  function renderAgeOptions() {
    ui.ageOptions.innerHTML = data.ageGroups.map(age => `<button class="age-chip ${age.id === state.age ? 'is-active' : ''}" type="button" data-age="${age.id}" aria-pressed="${age.id === state.age}">${escapeText(age.label)}</button>`).join('');
    ui.ageOptions.querySelectorAll('[data-age]').forEach(button => button.addEventListener('click', () => {
      state.age = button.dataset.age;
      state.target.age = ageProfile();
      renderAgeOptions();
      renderTask();
      renderWardrobe();
      renderEquipped();
      showToast(`穿搭画像切换为「${ageProfile().label}」。`);
    }));
  }

  function makeRound() {
    const style = choose(data.styles);
    state.target = {
      age: ageProfile(), weather: choose(data.weather), mood: choose(data.moods), zodiac: choose(data.zodiac),
      style, schedule: choose(data.schedule)
    };
    state.round += 1;
    state.score = 0;
    state.combo = 0;
    state.seconds = 60;
    state.slotIndex = 0;
    state.picks = [];
    state.active = true;
    state.finished = false;
    ui.result.hidden = true;
    renderTask();
    renderAgeOptions();
    renderGameStats();
    renderEquipped();
    renderWardrobe();
    ui.gameState.textContent = '挑战进行中';
    clearInterval(timerHandle);
    timerHandle = setInterval(tick, 1000);
  }

  function renderTask() {
    const target = state.target;
    const items = [
      { icon: target.weather.icon, label: target.weather.label },
      { icon: target.mood.icon, label: target.mood.label },
      { icon: '✳', label: target.zodiac.color },
      { icon: '◇', label: target.style.label },
      { icon: target.schedule.icon, label: target.schedule.label }
    ];
    ui.round.textContent = String(state.round).padStart(2, '0');
    ui.subtitle.textContent = `${target.age.label}画像 · ${target.style.label}造型 · ${target.schedule.label}日程`;
    ui.tags.innerHTML = items.map(item => `<span class="quest-tag"><i>${escapeText(item.icon)}</i>${escapeText(item.label)}</span>`).join('');
    ui.rule.textContent = `${target.age.note}；${target.weather.note}；${target.schedule.note}。四件选对，拿下风格满分。`;
    ui.avatar.src = imageUrl(target.style.photo, 1000);
    ui.avatar.alt = `${target.age.label}的${target.style.label}穿搭角色`;
    ui.stageStyle.textContent = `${target.style.label.toUpperCase()} QUEST`;
    ui.stageWeather.textContent = `${target.weather.icon} ${target.weather.temp}`;
    ui.avatarMood.textContent = `${target.mood.label} · ${target.zodiac.label}`;
    ui.avatarTitle.innerHTML = `${escapeText(target.style.mood)}<br>搭配进行中`;
    ui.sticker.innerHTML = `LOOK<br>${String(state.round).padStart(2, '0')}`;
  }

  function renderGameStats() {
    ui.score.textContent = String(state.score).padStart(3, '0');
    ui.timer.textContent = `${String(Math.floor(state.seconds / 60)).padStart(2, '0')}:${String(state.seconds % 60).padStart(2, '0')}`;
    ui.timer.classList.toggle('is-urgent', state.seconds <= 10);
    ui.combo.textContent = `× ${Math.max(1, state.combo)}`;
    ui.comboFill.style.width = `${Math.min(100, state.combo * 25)}%`;
  }

  function renderProgress() {
    ui.progress.innerHTML = slots.map((slot, index) => `<span class="progress-step ${index < state.slotIndex ? 'is-done' : ''} ${index === state.slotIndex ? 'is-current' : ''}" aria-label="${slot.label}${index < state.slotIndex ? '已完成' : index === state.slotIndex ? '当前' : ''}">${index < state.slotIndex ? '✓' : slot.icon}</span>`).join('');
    ui.pieceCount.textContent = `${String(state.slotIndex + 1).padStart(2, '0')} / 04`;
  }

  function renderEquipped() {
    ui.equippedCount.textContent = `${state.picks.length} / 4`;
    ui.equipped.innerHTML = slots.map((slot, index) => {
      const pick = state.picks[index];
      return `<div class="equipped-item ${pick ? 'has-item' : ''}" title="${pick ? escapeText(pick.item.name) : `${slot.label}待选择`}"><span class="equipped-label">${slot.label}</span>${pick ? `<img src="${imageUrl(pick.item.image, 140)}" alt=""><i>${pick.correct ? '✓' : '·'}</i>` : `<span class="equipped-empty">＋</span>`}</div>`;
    }).join('');
  }

  function choicesFor(slot) {
    const targetStyle = state.target.style;
    const ageIndex = data.ageGroups.findIndex(item => item.id === state.age);
    const weather = weatherRule();
    const contextHint = slot.id === 'top' ? weather.layer : slot.id === 'bottom' ? weather.palette : slot.id === 'shoes' ? weather.shoe : `${state.target.zodiac.color}幸运色`;
    const correctItem = { ...pieceFor(targetStyle, slot), detail: `${pieceFor(targetStyle, slot).detail} · ${contextHint} · ${targetStyle.ages[ageIndex]}`, styleId: targetStyle.id, styleLabel: targetStyle.label };
    const decoyStyles = data.styles.filter(style => style.id !== targetStyle.id).sort(() => Math.random() - .5).slice(0, 3);
    const options = [correctItem, ...decoyStyles.map(style => ({ ...pieceFor(style, slot), styleId: style.id, styleLabel: style.label }))] ;
    return options.sort(() => Math.random() - .5);
  }

  function renderWardrobe() {
    if (!state.active || state.finished) return;
    const slot = slots[state.slotIndex];
    state.choices = choicesFor(slot);
    state.selected = null;
    ui.title.textContent = slot.name;
    const ageIndex = data.ageGroups.findIndex(item => item.id === state.age);
    ui.hint.textContent = `${state.target.style.label}造型 · ${ageProfile().keywords[ageIndex % ageProfile().keywords.length]}取向 · 选择最贴合本轮任务的${slot.label}。`;
    ui.options.innerHTML = state.choices.map((choice, index) => `<button class="wardrobe-card" type="button" data-choice-index="${index}" aria-pressed="false"><img src="${imageUrl(choice.image, 300)}" alt="" loading="lazy"><span class="card-index">0${index + 1}</span><span class="wardrobe-card-copy"><strong>${escapeText(choice.name)}</strong><small>${escapeText(choice.detail)}</small></span><span class="card-check" aria-hidden="true">✓</span></button>`).join('');
    ui.options.querySelectorAll('[data-choice-index]').forEach(button => button.addEventListener('click', () => selectChoice(Number(button.dataset.choiceIndex))));
    ui.confirm.innerHTML = '确认这件 <span aria-hidden="true">→</span>';
    ui.confirm.disabled = false;
    renderProgress();
  }

  function selectChoice(index) {
    if (!state.active || !state.choices[index]) return;
    state.selected = index;
    ui.options.querySelectorAll('[data-choice-index]').forEach((button, buttonIndex) => {
      button.classList.toggle('is-selected', buttonIndex === index);
      button.setAttribute('aria-pressed', String(buttonIndex === index));
    });
    ui.confirm.innerHTML = `穿上这件 <span aria-hidden="true">→</span>`;
    ui.confirm.focus({ preventScroll: true });
  }

  function confirmChoice() {
    if (!state.active) return;
    if (state.selected === null) { selectChoice(0); showToast('先挑一件，再确认穿上。'); return; }
    const slot = slots[state.slotIndex];
    const item = state.choices[state.selected];
    const correct = item.styleId === state.target.style.id;
    let points = 5;
    if (correct) {
      state.combo += 1;
      points = 25 + (state.combo > 1 ? 5 : 0);
      state.score += points;
      showToast(state.combo > 1 ? `搭配契合！连击 ×${state.combo}` : '搭配契合！+25');
    } else {
      state.combo = 0;
      state.score += 5;
      showToast('风格有新意，但和本轮任务不太一样。');
    }
    state.picks[state.slotIndex] = { slot, item, correct, points };
    state.slotIndex += 1;
    renderGameStats();
    renderEquipped();
    if (state.slotIndex >= slots.length) finishGame(false);
    else renderWardrobe();
  }

  function tick() {
    if (!state.active) return;
    state.seconds -= 1;
    renderGameStats();
    if (state.seconds <= 0) finishGame(true);
  }

  function finishGame(timedOut) {
    if (state.finished) return;
    state.active = false;
    state.finished = true;
    clearInterval(timerHandle);
    ui.gameState.textContent = timedOut ? '时间到' : '本轮完成';
    ui.finalScore.textContent = String(state.score).padStart(3, '0');
    ui.resultMessage.textContent = timedOut ? '时间到啦，下次再把整套搭配完成。' : state.score >= 100 ? '风格拿捏得刚刚好！这一身和今日任务非常合拍。' : state.score >= 55 ? '搭配有自己的主意，再留意一下天气和场景会更出彩。' : '新风格也值得尝试，换个思路再挑战一次吧。';
    ui.breakdown.innerHTML = slots.map((slot, index) => {
      const pick = state.picks[index];
      const recommended = pieceFor(state.target.style, slot);
      return `<div class="result-piece ${pick?.correct ? 'is-correct' : 'is-missed'}"><span>${slot.label}</span><strong>${escapeText(pick?.item.name || '尚未选择')}</strong><small>${pick?.correct ? '✓ 风格契合' : `推荐：${escapeText(recommended.name)}`}</small></div>`;
    }).join('');
    const bestScore = Math.max(state.score, Number(localStorage.getItem('outfit-quest-best') || 0));
    try { localStorage.setItem('outfit-quest-best', String(bestScore)); } catch (error) { /* 无本地存储时继续显示本局分数 */ }
    ui.best.textContent = String(bestScore).padStart(3, '0');
    ui.result.hidden = false;
    ui.save.textContent = '保存本套穿搭';
    ui.save.disabled = false;
    ui.save.classList.remove('is-saved');
  }

  function saveLook() {
    const look = {
      savedAt: new Date().toISOString(), age: ageProfile().label,
      scene: { weather: state.target.weather.label, mood: state.target.mood.label, zodiac: state.target.zodiac.label, style: state.target.style.label, schedule: state.target.schedule.label },
      score: state.score, pieces: state.picks.map(pick => ({ type: pick.slot.label, name: pick.item.name, image: imageUrl(pick.item.image, 420) }))
    };
    try {
      const saved = JSON.parse(localStorage.getItem('daily-outfit-saved') || '[]');
      saved.unshift(look);
      localStorage.setItem('daily-outfit-saved', JSON.stringify(saved.slice(0, 30)));
      ui.save.textContent = '✓ 已保存';
      ui.save.disabled = true;
      ui.save.classList.add('is-saved');
      showToast('本套穿搭已保存在此设备。');
    } catch (error) { showToast('浏览器暂时无法保存，请检查本地存储权限。'); }
  }

  function cycleChoice(direction) {
    if (ui.result.hidden === false || !state.active) { makeRound(); return; }
    const selected = state.selected === null ? (direction > 0 ? -1 : 0) : state.selected;
    selectChoice((selected + direction + state.choices.length) % state.choices.length);
  }

  function handleFist() {
    if (!ui.result.hidden) { makeRound(); return; }
    if (!state.active) { makeRound(); return; }
    if (state.slotIndex > 0) {
      state.slotIndex -= 1;
      const removedPick = state.picks.pop();
      state.score = Math.max(0, state.score - (removedPick?.points || 0));
      state.combo = 0;
      for (let index = state.picks.length - 1; index >= 0 && state.picks[index].correct; index -= 1) state.combo += 1;
      renderGameStats();
      renderEquipped();
      renderWardrobe();
      showToast(`退回到${slots[state.slotIndex].label}。`);
    } else {
      renderWardrobe();
      showToast('已刷新本件单品选项。');
    }
  }

  document.querySelector('#new-round').addEventListener('click', makeRound);
  document.querySelector('#confirm-piece').addEventListener('click', confirmChoice);
  document.querySelector('#play-again').addEventListener('click', makeRound);
  document.querySelector('#result-close').addEventListener('click', () => { ui.result.hidden = true; });
  document.querySelector('#save-look').addEventListener('click', saveLook);
  ui.best.textContent = String(Number(localStorage.getItem('outfit-quest-best') || 0)).padStart(3, '0');
  window.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || !ui.result.hidden) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); cycleChoice(1); }
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); cycleChoice(-1); }
    else if (event.key === 'Enter' || event.key === ' ') { if (document.activeElement !== ui.confirm) { event.preventDefault(); confirmChoice(); } }
    else if (event.key === 'Escape') handleFist();
  });

  function classifyGesture(points) {
    const fingers = [8, 12, 16, 20].map((tip, index) => points[tip].y < points[[6, 10, 14, 18][index]].y - .015);
    const thumbOut = Math.abs(points[4].x - points[2].x) > .045;
    const count = fingers.filter(Boolean).length;
    if (count >= 4 && thumbOut) return { id: 'palm', label: '张开手掌', hint: '保持一下，确认当前单品' };
    if (fingers[0] && !fingers[1] && !fingers[2] && !fingers[3]) return { id: 'point', label: '食指指向', hint: '将指尖移到单品上停留' };
    if (count === 0 && !thumbOut) return { id: 'fist', label: '握拳', hint: '退回上一件；首件可刷新' };
    return { id: 'other', label: '识别到手部', hint: '张掌确认、握拳返回、左右挥手换选项' };
  }

  function handleGesture(gesture, points, now) {
    const wristX = points[0].x;
    waveSamples.push({ x: wristX, time: now });
    waveSamples = waveSamples.filter(sample => now - sample.time < 420);
    let waved = false;
    if (gesture === 'palm' && waveSamples.length > 3 && now - lastWaveAt > 1100) {
      const delta = wristX - waveSamples[0].x;
      if (Math.abs(delta) > .2) {
        cycleChoice(delta > 0 ? 1 : -1);
        lastWaveAt = now;
        waved = true;
        actedForGesture = true;
        showToast('单品选项已切换。');
      }
    }
    if (gesture !== lastGesture) {
      lastGesture = gesture;
      gestureSince = now;
      actedForGesture = false;
      pointTarget = null;
      pointSince = now;
    }
    if (waved) return;
    if (gesture === 'point') { pointToCard(points[8], now); return; }
    ui.cursor.classList.remove('is-active', 'is-dwell');
    if (actedForGesture || now - gestureSince < 440) return;
    if (gesture === 'palm') { actedForGesture = true; confirmChoice(); }
    else if (gesture === 'fist') { actedForGesture = true; handleFist(); }
  }

  function pointToCard(tip, now) {
    const bounds = ui.options.getBoundingClientRect();
    const x = bounds.left + (1 - tip.x) * bounds.width;
    const y = bounds.top + tip.y * bounds.height;
    const candidate = document.elementFromPoint(x, y)?.closest('.wardrobe-card');
    ui.cursor.style.left = `${x}px`;
    ui.cursor.style.top = `${y}px`;
    ui.cursor.classList.add('is-active');
    if (!candidate || !ui.options.contains(candidate)) { pointTarget = null; ui.cursor.classList.remove('is-dwell'); return; }
    if (candidate !== pointTarget) { pointTarget = candidate; pointSince = now; ui.cursor.classList.remove('is-dwell'); return; }
    ui.cursor.classList.add('is-dwell');
    if (now - pointSince > 750 && !candidate.dataset.pointed) {
      candidate.dataset.pointed = 'true';
      selectChoice(Number(candidate.dataset.choiceIndex));
      showToast(`选中${state.choices[Number(candidate.dataset.choiceIndex)].name}，张开手掌确认。`);
      setTimeout(() => { if (candidate.isConnected) delete candidate.dataset.pointed; }, 1000);
      pointSince = now + 1000;
    }
  }

  function resetGesture() {
    lastGesture = 'none';
    actedForGesture = false;
    waveSamples = [];
    pointTarget = null;
  }

  function drawHands(results) {
    const canvas = ui.canvas;
    const context = canvas.getContext('2d');
    const video = ui.cameraVideo;
    if (!video.videoWidth || !video.videoHeight) return;
    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) { canvas.width = video.videoWidth; canvas.height = video.videoHeight; }
    context.clearRect(0, 0, canvas.width, canvas.height);
    const points = results.multiHandLandmarks?.[0];
    if (!points) {
      ui.gesture.textContent = '寻找手部中';
      ui.guidance.textContent = '请将一只手放入镜头范围';
      ui.cursor.classList.remove('is-active', 'is-dwell');
      resetGesture();
      return;
    }
    const xs = points.map(point => point.x * canvas.width);
    const ys = points.map(point => point.y * canvas.height);
    context.strokeStyle = '#e7b988';
    context.lineWidth = Math.max(2, canvas.width / 160);
    context.strokeRect(Math.min(...xs) - 8, Math.min(...ys) - 8, Math.max(...xs) - Math.min(...xs) + 16, Math.max(...ys) - Math.min(...ys) + 16);
    if (window.drawConnectors && window.drawLandmarks) {
      window.drawConnectors(context, points, window.HAND_CONNECTIONS, { color: '#f4eee1', lineWidth: Math.max(2, canvas.width / 180) });
      window.drawLandmarks(context, points, { color: '#d97756', lineWidth: 1, radius: Math.max(2, canvas.width / 110) });
    }
    const gesture = classifyGesture(points);
    ui.gesture.textContent = gesture.label;
    ui.guidance.textContent = gesture.hint;
    handleGesture(gesture.id, points, performance.now());
  }

  async function processCameraFrame() {
    if (!cameraStream) return;
    if (!framePending && ui.cameraVideo.readyState >= 2 && handsModel) {
      framePending = true;
      try { await handsModel.send({ image: ui.cameraVideo }); }
      catch (error) { ui.guidance.textContent = '识别暂时中断，请检查网络后重试。'; }
      finally { framePending = false; }
    }
    if (cameraStream) requestAnimationFrame(processCameraFrame);
  }

  async function startCamera() {
    if (!navigator.mediaDevices?.getUserMedia) { showToast('摄像头需要 HTTPS 或 localhost；鼠标与键盘操作仍可正常游玩。'); return; }
    if (!window.Hands) { showToast('手势识别脚本暂不可用，请检查网络后刷新。'); return; }
    ui.cameraToggle.disabled = true;
    ui.cameraDock.hidden = false;
    ui.cameraStatus.textContent = '等待授权';
    ui.guidance.textContent = '请在浏览器提示中允许使用摄像头';
    try {
      cameraStream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } } });
      ui.cameraVideo.srcObject = cameraStream;
      await ui.cameraVideo.play();
      ui.placeholder.hidden = true;
      ui.cameraStatus.textContent = '摄像头已连接';
      ui.cameraDot.classList.add('is-on');
      ui.cameraLabel.textContent = '关闭手势';
      ui.cameraToggle.setAttribute('aria-expanded', 'true');
      handsModel = new window.Hands({ locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}` });
      handsModel.setOptions({ maxNumHands: 1, modelComplexity: 1, minDetectionConfidence: .62, minTrackingConfidence: .55 });
      handsModel.onResults(drawHands);
      framePending = false;
      requestAnimationFrame(processCameraFrame);
    } catch (error) {
      stopCamera();
      const message = error.name === 'NotAllowedError' ? '没有获得摄像头权限；可在浏览器地址栏旁重新允许。' : error.name === 'NotFoundError' ? '没有找到摄像头设备。' : '摄像头暂时无法启动，请检查权限与设备状态。';
      ui.cameraDock.hidden = false;
      ui.guidance.textContent = message;
      showToast(message);
    } finally { ui.cameraToggle.disabled = false; }
  }

  function stopCamera() {
    cameraStream?.getTracks().forEach(track => track.stop());
    cameraStream = null;
    if (handsModel) { handsModel.close(); handsModel = null; }
    ui.cameraVideo.srcObject = null;
    ui.placeholder.hidden = false;
    ui.cameraStatus.textContent = '摄像头未开启';
    ui.cameraDot.classList.remove('is-on');
    ui.cameraLabel.textContent = '手势模式';
    ui.cameraToggle.setAttribute('aria-expanded', 'false');
    ui.cameraDock.hidden = true;
    ui.cursor.classList.remove('is-active', 'is-dwell');
    const context = ui.canvas.getContext('2d');
    context.clearRect(0, 0, ui.canvas.width, ui.canvas.height);
    resetGesture();
  }

  ui.cameraToggle.addEventListener('click', () => cameraStream ? stopCamera() : startCamera());
  document.querySelector('#camera-close').addEventListener('click', stopCamera);
  window.addEventListener('pagehide', stopCamera);
  makeRound();
});