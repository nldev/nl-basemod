export function Opcode (prefix: string): string {
  return `${prefix}\t`
}

export function Random (max: number): number {
  return Math.floor(Math.random() * max)
}

