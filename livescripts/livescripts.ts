import { Store } from './basemod/store'
import { EasyLoot } from './basemod/easy-loot'
import { Talents } from './basemod/talents'
import { Rest } from './basemod/rest'
import { Chests } from './basemod/chests'
import { Autolearn } from './basemod/autolearn'
import { Combat } from './basemod/combat/combat'
import { Opcode } from './basemod/utils'

const CHEAP_SHOT = 1833
const AMBUSH = 11267
const GARROTE = 11290

function AddComboPoints (spell: TSSpell, amount: number) {
  const c = spell.GetCaster()
  const t = spell.GetTarget()
  if (!c.IsPlayer() && t.IsUnit())
    return
  const p = c.ToPlayer()
  const u = t.ToUnit()
  p.AddComboPoints(u, amount)
}

function Rogue (events: TSEvents) {
  events.SpellID.OnHit(CHEAP_SHOT, s => AddComboPoints(s, 1))
  events.SpellID.OnHit(AMBUSH, s => AddComboPoints(s, 1))
  events.SpellID.OnHit(GARROTE, s => AddComboPoints(s, 1))
}

function DevTools (events: TSEvents) {
  // clear inventory
  events.Player.OnWhisper((sender, _, message) => {
    const opcode = Opcode('dev-clear-inventory')
    const str = message.get()
    if (!str.includes(opcode))
     return
    for (let i = 0; i <= 15; i++) {
      const item = sender.GetItemByPos(255, 23 + i)
      if (!item.IsNull())
        sender.RemoveItem(item, item.GetCount())
    }
  })
}

export function Main (events: TSEvents) {
  Store(events)
  EasyLoot(events)
  Talents(events)
  Rest(events)
  Chests(events)
  Autolearn(events)
  Combat(events)
  DevTools(events)
  Rogue(events)

  EquipTest(events)
  OutcomeTest(events)
}

function EquipTest (events: TSEvents) {
  events.Items.OnEquip((item, player, slot, isMerge) => {
    player.SendBroadcastMessage(`EQUIP ${item.GetName()} ${item.GetGUIDLow()}`)
  })

  events.Items.OnUnequip((item, player, isSwap, result) => {
    player.SendBroadcastMessage(`${result.get()}`)
    if (result.get() === 1)
      player.SendBroadcastMessage(`UNEQUIP ${item.GetName()} ${item.GetGUIDLow()}`)
  })
}


export function OutcomeTest (events: TSEvents) {
  // what is immune or absorbed?
  // can melee resist?
  // what counts as 'melee'?
  // missing parry/dodge/block

  events.Unit.OnCalcMeleeOutcome((attacker, victim, missChance, critChance, dodgeChance, blockChance, parryChance, attackType) => {
    missChance.set(0)
    dodgeChance.set(0)
    blockChance.set(0)
    parryChance.set(0)

    // if has dodge-aura tag && is in front
    if (victim.HasAura(26669) && attacker.IsInFront(victim, 80))
      dodgeChance.set(100)
  })

  events.Spells.OnCalcMiss((spell, attacker, victim, effectMask, missCond) => {
    const dmgClass = spell.GetSpellInfo().GetDmgClass()

    // if doesnt have block-aura tag && is parry
    if ((missCond.get() === SpellMissInfo.PARRY)) {
      missCond.set(SpellMissInfo.NONE)
    }

    // if doesnt have block-aura tag && is block
    if (missCond.get() === SpellMissInfo.BLOCK) {
      missCond.set(SpellMissInfo.NONE)
    }

    // if doesnt have miss-aura tag && is miss
    if (missCond.get() === SpellMissInfo.MISS) {
      missCond.set(SpellMissInfo.NONE)
    }

    // if doesnt have resist-aura tag && is resist
    if (missCond.get() === SpellMissInfo.RESIST) {
      missCond.set(SpellMissInfo.NONE)
    }

    // if doesnt have dodge-aura tag && is dodge
    if ((missCond.get() === SpellMissInfo.DODGE)) {
      if (!victim.HasAura(26669))
        missCond.set(SpellMissInfo.NONE)
    }

    // if has dodge-aura tag && is hit && is melee && is in front
    if (missCond.get() === SpellMissInfo.NONE && (dmgClass === 2) && attacker.IsInFront(victim, 80))
      if (victim.HasAura(26669))
        missCond.set(SpellMissInfo.DODGE)
  })
  // also affects miss
  // does this happen before or after onCalcMeleeMiss?
  // events.Spells.OnCalcHit((spell, hitChance, attacker, defender) => {})

  // events.Spells.OnCalcResist((spell, resistChance, attacker, defender) => {})
  // events.Spells.OnCalcReflect((spell, reflectChance, attacker, victim) => {})
  // events.Spells.OnPeriodicDamage((aura, damage) => {})
  // events.Spells.OnDamageEarly((spell, damage, info, type, isCrit) => {})
  // events.Spells.OnDamageLate((spell, damage, info, type, isCrit) => {})
  // events.Spells.OnCalcCrit((spell, chance) => {})
  // events.Spells.OnCalcAuraCrit((aura, chance) => {})
  // events.Spells.OnTick(effect => {})
  // events.Spells.OnDamageEarly((spell, damage, info, type, isCrit) => {})
  // events.Unit.OnCalcMeleeOutcome
}
