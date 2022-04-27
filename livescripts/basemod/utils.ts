export function Opcode (prefix: string): string {
  return `${prefix}\t`
}

export function Random (max: number): number {
  return Math.floor(Math.random() * max)
}

export function Message (unit: TSUnit, message: string) {
  if (unit.IsPlayer())
    unit.ToPlayer().SendBroadcastMessage(message)
}

export function GetInCombatWith (unit: TSUnit): TSArray<TSUnit> {
  const array: TSArray<TSUnit> = []

  const units = unit.GetUnitsInRange(45, 0, 0)
  units.forEach(u => {
    if (unit.IsInCombatWith(u))
      array.push(u)
  })

  return array
}

export function IsMeleeRange (unit: TSUnit, target: TSUnit): boolean {
  const distance = unit.GetDistance(target)
  return (distance <= 5) ? true : false
}

export function IsCastingRange (unit: TSUnit, target: TSUnit): boolean {
  const distance = unit.GetDistance(target)
  return (distance > 5) ? true : false
}

export function GetCombatTarget (unit: TSUnit): TSUnit {
  const guid = unit.GetTarget()
  const units = GetInCombatWith(unit)
  let result: TSUnit = NULL_UNIT()

  units.forEach(u => {
    if (u.GetGUID() === guid)
      result = u
  })

  return result
}

export function DetermineTarget (unit: TSUnit): TSUnit {
  let target = GetCombatTarget(unit)
  if (!target.IsNull()) {
    const targets = GetInCombatWith(unit)
    target = targets.get(Random(targets.length - 1))
  }
  return target
}

export function MessageTarget (unit: TSUnit, message: string) {
  const target = DetermineTarget(unit)
  if (target.IsPlayer())
    target.ToPlayer().SendBroadcastMessage(message)
}

