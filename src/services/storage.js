export const save = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const load = (key, defaultValue) => {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const tokenStorage = {
  get: () => {
    const token = localStorage.getItem('@Medilink:token');
    return (token && token !== 'null' && token !== 'undefined') ? token : null;
  },
  set: (token) => {
    const value = typeof token === 'object' && token !== null ? token.token : token;
    localStorage.setItem('@Medilink:token', value);
  },
  remove: () => localStorage.removeItem('@Medilink:token'),
  getUser: () => {
    const user = localStorage.getItem('@Medilink:user');
    return user ? JSON.parse(user) : null;
  },
  setUser: (user) => localStorage.setItem('@Medilink:user', JSON.stringify(user)),
  clear: () => {
    localStorage.removeItem('@Medilink:token');
    localStorage.removeItem('@Medilink:user');
  }
};