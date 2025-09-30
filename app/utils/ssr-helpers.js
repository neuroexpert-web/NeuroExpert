// SSR-safe helper functions

export const isBrowser = () => typeof window !== 'undefined';

export const isServer = () => typeof window === 'undefined';

export const safeLocalStorage = {
  getItem: (key) => {
    if (isBrowser()) {
      return localStorage.getItem(key);
    }
    return null;
  },
  setItem: (key, value) => {
    if (isBrowser()) {
      localStorage.setItem(key, value);
    }
  },
  removeItem: (key) => {
    if (isBrowser()) {
      localStorage.removeItem(key);
    }
  }
};

export const safeSessionStorage = {
  getItem: (key) => {
    if (isBrowser()) {
      return sessionStorage.getItem(key);
    }
    return null;
  },
  setItem: (key, value) => {
    if (isBrowser()) {
      sessionStorage.setItem(key, value);
    }
  },
  removeItem: (key) => {
    if (isBrowser()) {
      sessionStorage.removeItem(key);
    }
  }
};

export const getWindow = () => {
  if (isBrowser()) {
    return window;
  }
  return undefined;
};

export const getDocument = () => {
  if (isBrowser()) {
    return document;
  }
  return undefined;
};

export const getNavigator = () => {
  if (isBrowser()) {
    return navigator;
  }
  return undefined;
};