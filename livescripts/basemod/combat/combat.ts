import { Random, MessageTarget, DetermineTarget, IsMeleeRange } from '../utils'

export function HasAction (unit: TSCreature): boolean {
  return unit.GetString('combat-action') !== ''
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
  const combatAction = unit.GetString('combat-action')
  const isCasting = unit.IsCasting()
  const isSilenced = IsSilenced(unit)

  if (!HasAction(unit) && !isCasting && primary) {
    if (isSilenced) {
      Melee(unit)
      return
    }
    const target = DetermineTarget(unit)
    if (!target.IsNull()) {
      const rollA = Random(secondaryDice)
      const rollB = Random(primaryDice)
      if ((rollA === 0) && secondary) {
        unit.CastSpell(target, secondary, false)
      } else {
        if (rollB === 0)
        unit.CastSpell(target, primary, false)
      }
    }
  }
}

export function Melee (unit: TSCreature) {
  const isCasting = unit.IsCasting()
  const combatAction = unit.GetString('combat-action')

  if (!HasAction(unit) && !isCasting) {
    const target = DetermineTarget(unit)
    if (!target.IsNull()) {
      unit.AttackStart(target)
      unit.MoveChase(target, 0, 0)
    }
  }
}

export function BlinkRootAndSlow (unit: TSCreature, dice: number = 0, every: number = 12000) {
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
    unit.SetString('combat-action', '')
    const target = DetermineTarget(unit)
    unit.CastSpell(target, 31589, false)
    Cast(unit)
    return
  }

  // roll
  if (!HasAction(unit) && canOccur && isRooted && !isCasting)
    unit.SetBool('combat-blink-root-enable', true)
}

export function SlowMelee (unit: TSCreature, dice: number = 0, every: number = 5000) {
  const isSilenced = IsSilenced(unit)
  const isCasting = unit.IsCasting()
  const isMoving = !unit.IsStopped()
  const current = GetCurrTime()
  const lastOccurred = unit.GetNumber('combat-slow-melee-last-occurred', 0)
  const canOccur = current >= (lastOccurred + every)
  const isEnabled = unit.GetBool('combat-slow-melee-enable', false)

  // run
  if (isEnabled) {
    const target = DetermineTarget(unit)
    if (target)
      unit.CastSpell(target, 31589, false)
    unit.SetNumber('combat-slow-melee-last-occurred', current)
    unit.SetBool('combat-slow-melee-enable', false)
    return
  }

  // roll
  if (canOccur && !isCasting && isMoving && !isSilenced)
    unit.SetBool('combat-slow-melee-enable', true)
}

export function CleanseSlow (unit: TSCreature, dice: number = 0, every: number = 2000) {
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
    return
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
    const combatAction = unit.GetString('combat-action')
    const state = unit.GetString('combat-move-to-cast-state', 'unstarted')
    const current = GetCurrTime()
    const started = unit.GetNumber('combat-move-to-cast-started', 0)
    const lastOccurred = unit.GetNumber('combat-move-to-cast-last-occurred', 0)
    const canOccur = current >= (lastOccurred + every)

    // run
    if (combatAction === 'move-to-cast') {
      if (state === 'started' && (current >= (started + 2200))) {
        unit.SetNumber('combat-move-to-cast-last-occurred', current)
        unit.SetString('combat-move-to-cast-state', 'unstarted')
        unit.SetString('combat-action', '')
      } else if ((state === 'unstarted') && !isSilenced && !isCasting) {
        const position = target.GetRelativePoint(12, 0)
        unit.MoveTo(0, position.x, position.y, position.z, true)
        unit.SetString('combat-move-to-cast-state', 'started')
        unit.SetNumber('combat-move-to-cast-started', current)
      }
      return
    }

    // roll
    if (!HasAction(unit) && canOccur && (combatAction === '') && isMeleeRange && !isMoving && !isSilenced)
      if (Random(dice) === 0)
        unit.SetString('combat-action', 'move-to-cast')
  }
}

export function FaerieDragon (events: TSEvents) {
  events.CreatureID.OnJustEnteredCombat(257, unit => {
    PrimarySpell(unit, 8417)
    SecondarySpell(unit, 30451)
    unit.AddTimer(100, -1, (owner, timer) => {
      const c = owner.ToCreature()
      if (!c) {
        timer.Stop()
        return
      }
      if (c.IsDead()) {
        timer.Stop()
        return
      }
      Cast(c)
      BlinkRootAndSlow(c)
      MoveToRanged(c)
      SlowMelee(c)
      CleanseSlow(c)
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

