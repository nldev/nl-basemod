import { Random } from '../utils'

export function GetInCombatWith (unit: TSUnit): TSArray<TSUnit> {
  const array: TSArray<TSUnit> = []

  const units = unit.GetUnitsInRange(45, 0, 0)
  units.forEach(u => {
    if (unit.IsInCombatWith(u))
      array.push(u)
  })

  return array
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

export function IsMeleeRange (unit: TSUnit, target: TSUnit): boolean {
  const distance = unit.GetDistance(target)
  return (distance <= 5) ? true : false
}

export function IsCastingRange (unit: TSUnit, target: TSUnit): boolean {
  const distance = unit.GetDistance(target)
  return (distance > 5) ? true : false
}

export function Melee (unit: TSCreature) {
  const combatAction = unit.GetString('combat-action', '')
  if (combatAction === '') {
    unit.AttackStart(DetermineTarget(unit))
  }
}

export function MoveToCast (unit: TSCreature, every: number = 5000, dice: number = 0) {
  const target = DetermineTarget(unit)
  const isMeleeRange = IsMeleeRange(unit, target)
  const isCasting = unit.IsCasting()
  const isMoving = !unit.IsStopped()
  const combatAction = unit.GetString('combat-action', '')
  const state = unit.GetString('combat-move-to-cast-state', 'unstarted')
  const current = GetCurrTime()
  const lastOccurred = unit.GetNumber('combat-move-to-cast-last-occurred', 0)

  // run
  if (combatAction === 'move-to-cast') {
    if (target.IsPlayer())
      target.ToPlayer().SendBroadcastMessage(`amount: ${current - lastOccurred}`)

    if ((state === 'unstarted') && !isCasting) {
      const position = target.GetRelativePoint(8, 0)
      unit.MoveTo(0, position.x, position.y, position.z, true)
      unit.SetString('combat-move-to-cast-state', 'started')
    }

    if ((state === 'started') && isMeleeRange && !isMoving) {
      unit.SetNumber('combat-move-to-cast-last-occurred', current)
      unit.SetString('combat-move-to-cast-state', 'unstarted')
      unit.SetString('combat-action', '')
    }
  }

  // roll
  if ((current >= (lastOccurred + every)) && (combatAction === ''))
    if (Random(dice) === 0)
      unit.SetString('combat-action', 'move-to-cast')
}

export function FaerieDragon (events: TSEvents) {
  events.CreatureID.OnJustEnteredCombat(257, (unit, target) => {
    unit.SetString('ai-command', '')
    unit.AddTimer(200, -1, (owner, timer) => {
      const c = owner.ToCreature()
      if (!c) {
        timer.Stop()
        return
      }
      if (c.IsDead()) {
        timer.Stop()
        return
      }

      Melee(c)
      MoveToCast(c)
      // const t = DetermineTarget(c)
      // if (!t.IsNull()) {
      //   // perform command
      //   const cmd = c.GetString('ai-command')
      //   if (cmd === 'blink' && !c.IsCasting()) {
      //     c.CastSpell(c, 1953, false)
      //   } else if (cmd === 'abolish-poison' && !c.IsCasting()) {
      //     c.CastSpell(c, 2893, false)
      //   } else if (cmd === 'slow') {
      //     c.CastSpell(t, 31589, false)
      //     const p = t.GetRelativePoint(8, 0)
      //     c.MoveTo(0, p.x, p.y, p.z, true)
      //     c.SetFacing(c.GetO())
      //   } else if (cmd === 'cast-random' && !c.IsCasting()) {
      //     const num = Random(6)
      //     t.ToPlayer().SendBroadcastMessage(`${num}`)
      //     if (num < 5)
      //       c.CastSpell(t, 8417, false)
      //     if (num === 5)
      //       c.CastSpell(t, 30451, false)
      //     // if (num === 1)
      //     //   c.CastSpell(t, 133, false)
      //     // if (num === 2)
      //     //   c.CastSpell(t, 5782, false)
      //     c.AttackStart(t)
      //   }

      //   // pick command
      //   if (c.IsRooted() && !c.IsCasting()) {
      //     c.SetString('ai-command', 'blink')
      //   } else if (c.HasAuraType(AuraType.MOD_DECREASE_SPEED) && !c.IsCasting()) {
      //     c.SetString('ai-command', 'abolish-poison')
      //   } else if (IsMeleeRange(c) && !c.IsCasting()) {
      //     c.SetString('ai-command', 'slow')
      //   } else if (IsCastingRange(c) && !c.IsCasting()) {
      //     c.SetString('ai-command', 'cast-random')
      //   }
      // }
    })
  })
}

export function CombatAI (events: TSEvents) {
  FaerieDragon(events)
}

