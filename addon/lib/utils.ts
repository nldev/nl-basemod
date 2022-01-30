const names = {}

export function Convert <O, I = any>(toConvert: I): O {
  return (toConvert as any) as O
}

export function Unique (name: string) {
  const id = names[name] ? names[name] : 0

  if (id === 0) {
    names[name] = 0
  }

  names[name]++

  return `${name}-${id}`
}

