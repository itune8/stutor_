(() => {
  const API = '/api/meetings';
  const USERS_API = '/api/users';

  function authHeaders() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  function withCb(promise, cb) { promise.then(d => cb(null, d)).catch(e => cb(e)); }

  const modeSelect = document.getElementById('modeSelect');
  const virtualFields = document.getElementById('virtualFields');
  const offlineFields = document.getElementById('offlineFields');
  const generateJitsi = document.getElementById('generateJitsi');

  function updateMode() {
    const mode = modeSelect.value;
    if (mode === 'virtual') {
      virtualFields.classList.remove('d-none');
      offlineFields.classList.add('d-none');
    } else {
      virtualFields.classList.add('d-none');
      offlineFields.classList.remove('d-none');
    }
  }

  if (modeSelect) {
    modeSelect.addEventListener('change', updateMode);
    updateMode();
  }

  if (generateJitsi) {
    generateJitsi.addEventListener('click', () => {
      const input = document.querySelector('input[name="link"]');
      const rand = URL.createObjectURL(new Blob()).split('/').pop();
      input.value = `https://meet.jit.si/${rand}`;
    });
  }

  const meetingForm = document.getElementById('meetingForm');
  const educatorSelect = document.getElementById('educatorSelect');

  async function loadEducators() {
    try {
      const res = await fetch(`${USERS_API}/educators`, { headers: authHeaders() });
      const list = await res.json();
      if (!Array.isArray(list)) throw new Error('Failed to load educators');
      educatorSelect.innerHTML = '<option value="">Select an educator</option>';
      const params = new URLSearchParams(window.location.search);
      const teacherName = (params.get('teacher') || '').toLowerCase();
      let preselectedId = '';
      list.forEach((t) => {
        const opt = document.createElement('option');
        opt.value = String(t.id);
        opt.textContent = `${t.name} (${t.email})`;
        educatorSelect.appendChild(opt);
        if (teacherName && t.name.toLowerCase().includes(teacherName)) preselectedId = String(t.id);
      });
      if (preselectedId) educatorSelect.value = preselectedId;
    } catch (e) {
      educatorSelect.innerHTML = '<option value="">No educators found</option>';
    }
  }
  // Prefill from query params (teacher/subject)
  (function prefill(){
    const params = new URLSearchParams(window.location.search);
    const teacher = params.get('teacher');
    const subject = params.get('subject');
    if (teacher || subject){
      const title = document.querySelector('input[name="title"]');
      const notes = document.querySelector('textarea[name="notes"]');
      if (title){ title.value = `Session with ${teacher || 'Educator'}${subject ? ' — ' + subject : ''}`.trim(); }
      if (notes){ notes.value = `Requested from ${teacher || 'Educator'}${subject ? ' (${subject})' : ''}`.trim(); }
    }
  })();
  meetingForm?.addEventListener('submit', (e) => {
    e.preventDefault();
  const fd = new FormData(meetingForm);
    const payload = Object.fromEntries(fd.entries());
  payload.educatorId = Number(payload.educatorId);
    // Ensure empty strings are passed for optional fields
    payload.link = payload.link || '';
    payload.location = payload.location || '';

    withCb(
      fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(payload),
      }).then(r => r.json()),
      (err, data) => {
        if (err || data.error) { alert(data?.error || 'Failed to save'); return; }
        meetingForm.reset();
        updateMode();
        loadMeetings();
      }
    );
  });

  function loadMeetings() {
    withCb(
      fetch(API, { headers: authHeaders() }).then(r => r.json()),
      (err, items) => {
        const list = document.getElementById('meetingsList');
        list.innerHTML = '';
        if (err || items.error) {
          list.innerHTML = '<li class="list-group-item text-danger">Failed to load meetings</li>';
          return;
        }
        if (!items.length) {
          list.innerHTML = '<li class="list-group-item">No meetings yet.</li>';
          return;
        }
        for (const m of items) {
          const li = document.createElement('li');
          li.className = 'list-group-item d-flex justify-content-between align-items-center flex-wrap gap-2';
          const info = document.createElement('div');
          info.innerHTML = `<strong>${m.title}</strong><br><small>${m.date} • ${m.time} • ${m.mode} • ${m.status}
            ${m.mode === 'virtual' && m.link ? `• <a href="${m.link}" target="_blank">Join</a>` : ''}
            ${m.mode === 'offline' && m.location ? `• ${m.location}` : ''}
          </small>`;
          const del = document.createElement('button');
          del.className = 'btn btn-sm btn-outline-danger';
          del.textContent = 'Delete';
          del.addEventListener('click', () => {
            withCb(
              fetch(`${API}/${m.id}`, { method: 'DELETE', headers: authHeaders() }).then(() => ({})),
              () => loadMeetings()
            );
          });
          li.appendChild(info);
          li.appendChild(del);
          list.appendChild(li);
        }
      }
    );
  }

  // Auth guard
  (function ensureAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/auth/login.html';
      return;
    }
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.role === 'EDUCATOR') {
        window.location.href = '/educator/';
        return;
      }
    } catch {}
    loadEducators().then(loadMeetings);
  })();
})();
