(() => {
  const API_BASE = '/api';

  function apiPost(path, body) {
    return fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(async (r) => {
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data.error || 'Request failed');
      return data;
    });
  }

  function saveSession({ token, user }) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  function redirectByRole(role) {
    if (role === 'EDUCATOR') window.location.href = '/educator/';
    else window.location.href = '/schedule/';
  }

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(loginForm);
      const payload = { email: fd.get('email'), password: fd.get('password') };
      try {
        const data = await apiPost('/auth/login', payload);
        saveSession(data);
        redirectByRole(data.user.role);
      } catch (err) {
        alert(err.message || 'Login failed');
      }
    });
  }

  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(signupForm);
      const payload = {
        name: fd.get('name'),
        email: fd.get('email'),
        password: fd.get('password'),
        role: fd.get('role') || 'STUDENT',
      };
      try {
        const data = await apiPost('/auth/signup', payload);
        saveSession(data);
        redirectByRole(data.user.role);
      } catch (err) {
        alert(err.message || 'Signup failed');
      }
    });
  }
})();
