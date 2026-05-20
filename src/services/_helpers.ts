export const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms))

export const generateId = (prefix: string): string =>
  `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`
