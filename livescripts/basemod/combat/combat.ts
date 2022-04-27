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

export function IsSilenced (unit: TSCreature): boolean {
  return unit.HasSpellCooldown(unit.GetNumber('combat-primary-spell') || 0)
}

export function PrimarySpell (unit: TSUnit, spell: number = 133, dice: number = 0) {
  unit.SetNumber('combat-primary-spell', spell)
  unit.SetNumber('combat-primary-dice', dice)
}

export function SecondarySpell (unit: TSUnit, spell: number = 133, dice: number = 10) {
  unit.SetNumber('combat-secondary-spell', spell)
  unit.SetNumber('combat-secondary-dice', dice)
}

export function Cast (unit: TSCreature) {
  const primary = unit.GetNumber('combat-primary-spell')
  const secondary = unit.GetNumber('combat-secondary-spell')
  const primaryDice = unit.GetNumber('combat-primary-dice')
  const secondaryDice = unit.GetNumber('combat-secondary-dice', 0)
  const combatAction = unit.GetString('combat-action', '')
  const isCasting = unit.IsCasting()

  if (combatAction === '' && !isCasting) {
    const target = DetermineTarget(unit)
    if (!target.IsNull()) {
      const rollA = Random(secondaryDice)
      const rollB = Random(primaryDice)
      if (rollA === 0)
        unit.CastSpell(target, secondary, false)
      if (secondary) {
        if (rollB === 0)
        unit.CastSpell(target, primary, false)
      }
    }
  }
}

export function Melee (unit: TSCreature) {
  const combatAction = unit.GetString('combat-action', '')
  if (combatAction === '') {
    const target = DetermineTarget(unit)
    if (!target.IsNull()) {
      unit.AttackStart(target)
      unit.MoveChase(target, 0, 0)
    }
  }
}

export function BlinkRoot (unit: TSCreature, dice: number = 0, every: number = 12000) {
  const isCasting = unit.IsCasting()
  const isRooted = unit.IsRooted()
  const current = GetCurrTime()
  const lastOccurred = unit.GetNumber('combat-blink-last-occurred', 0)
  const canOccur = current >= (lastOccurred + every)
  const isEnabled = unit.GetBool('combat-blink-root-enable', false)

  // run
  if (isEnabled) {
    unit.CastSpell(unit, 1953, false)
    unit.SetNumber('combat-blink-last-occurred', current)
    unit.SetBool('combat-blink-root-enable', false)
  }

  // roll
  if (canOccur && isRooted && !isCasting)
    unit.SetBool('combat-blink-root-enable', true)
}

export function SlowMelee (unit: TSCreature, dice: number = 0, every: number = 5000) {
}

export function CleanseSlow (unit: TSCreature, dice: number = 0, every: number = 5000) {
  const isSilenced = IsSilenced(unit)
  const isCasting = unit.IsCasting()
  const isMoving = !unit.IsStopped()
  const isSlowed = unit.HasAuraType(AuraType.MOD_DECREASE_SPEED)
  const current = GetCurrTime()
  const lastOccurred = unit.GetNumber('combat-cleanse-slow-last-occurred', 0)
  const canOccur = current >= (lastOccurred + every)
  const isEnabled = unit.GetBool('combat-cleanse-slow-enable', false)

  // run
  if (isEnabled) {
    unit.CastSpell(unit, 4987, false)
    unit.SetNumber('combat-cleanse-slow-last-occurred', current)
    unit.SetBool('combat-cleanse-slow-enable', false)
  }

  // roll
  if (canOccur && isSlowed && !isCasting && isMoving && !isSilenced)
    unit.SetBool('combat-cleanse-slow-enable', true)
}

export function MoveToRanged (unit: TSCreature, every: number = 5000, dice: number = 0) {
  const target = DetermineTarget(unit)
  if (!target.IsNull()) {
    const isSilenced = IsSilenced(unit)
    const isMeleeRange = IsMeleeRange(unit, target)
    const isCasting = unit.IsCasting()
    const isMoving = !unit.IsStopped()
    const combatAction = unit.GetString('combat-action', '')
    const state = unit.GetString('combat-move-to-cast-state', 'unstarted')
    const current = GetCurrTime()
    const lastOccurred = unit.GetNumber('combat-move-to-cast-last-occurred', 0)
    const canOccur = current >= (lastOccurred + every)

    // run
    if (combatAction === 'move-to-cast') {
      if (target.IsPlayer())
        target.ToPlayer().SendBroadcastMessage(`amount: ${current - lastOccurred}`)

      if ((state === 'unstarted') && !isCasting && !isSilenced) {
        const position = target.GetRelativePoint(8, 0)
        unit.MoveTo(0, position.x, position.y, position.z, true)
        unit.SetString('combat-move-to-cast-state', 'started')
      }

      if ((state === 'started') && !isMoving) {
        unit.SetNumber('combat-move-to-cast-last-occurred', current)
        unit.SetString('combat-move-to-cast-state', 'unstarted')
        unit.SetString('combat-action', '')
        Cast(unit)
      }
    }

    // roll
    if (canOccur && (combatAction === '') && isMeleeRange && !isSilenced)
      if (Random(dice) === 0)
        unit.SetString('combat-action', 'move-to-cast')
  }
}

export function FaerieDragon (events: TSEvents) {
  events.CreatureID.OnJustEnteredCombat(257, (unit, target) => {
    PrimarySpell(unit, 8417)
    SecondarySpell(unit, 30451)
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
      BlinkRoot(c)
      CleanseSlow(c)
      MoveToRanged(c)
      Cast(c)
      Melee(c)
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

