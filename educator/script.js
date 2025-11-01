(() => {
  const API = '/api/meetings';

  function authHeaders() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  function ensureEducator() {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.role !== 'EDUCATOR') {
        window.location.href = '/schedule/';
        return false;
      }
      return true;
    } catch {
      window.location.href = '/auth/login.html';
      return false;
    }
  }

  function withCb(promise, cb) { promise.then(d => cb(null, d)).catch(e => cb(e)); }

  function loadRequests() {
    withCb(
      fetch(API, { headers: authHeaders() }).then(r => r.json()),
      (err, items) => {
        const list = document.getElementById('requestsList');
        list.innerHTML = '';
        if (err || items.error) {
          list.innerHTML = '<li class="list-group-item text-danger">Failed to load requests</li>';
          return;
        }
        if (!items.length) {
          list.innerHTML = '<li class="list-group-item">No requests yet.</li>';
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
          const actions = document.createElement('div');
          if (m.status === 'PENDING') {
            const approve = document.createElement('button');
            approve.className = 'btn btn-sm btn-success me-2';
            approve.textContent = 'Approve';
            approve.addEventListener('click', () => updateStatus(m.id, 'APPROVED'));
            const reject = document.createElement('button');
            reject.className = 'btn btn-sm btn-outline-danger';
            reject.textContent = 'Reject';
            reject.addEventListener('click', () => updateStatus(m.id, 'REJECTED'));
            actions.appendChild(approve);
            actions.appendChild(reject);
          }
          li.appendChild(info);
          li.appendChild(actions);
          list.appendChild(li);
        }
      }
    );
  }

  function updateStatus(id, status) {
    withCb(
      fetch(`${API}/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ status }),
      }).then(r => r.json()),
      (err, data) => {
        if (err || data.error) { alert(data?.error || 'Update failed'); return; }
        loadRequests();
      }
    );
  }

  // Guard
  (function init(){
    if (!localStorage.getItem('token')) {
      window.location.href = '/auth/login.html';
      return;
    }
    if (!ensureEducator()) return;
    loadRequests();
  })();
})();
