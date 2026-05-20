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
