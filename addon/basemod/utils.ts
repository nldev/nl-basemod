export const noop = () => {}

export const isNil = <T>(value: T) =>
  (typeof value === 'undefined') || (value === null)

const names = {}

export function Unique (id: string) {
  const _id = names[id] ? names[id] : 0

  if (_id === 0) {
    names[id] = 0
  }

  names[id]++

  return `${id}-${_id}`
}

