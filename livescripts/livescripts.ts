import { Store } from './basemod/store'
import { EasyLoot } from './basemod/easy-loot'
import { Talents } from './basemod/talents'
import { Rest } from './basemod/rest'
import { Chests } from './basemod/chests'
import { Autolearn } from './basemod/autolearn'
import { Combat } from './basemod/combat/combat'
import { Opcode } from './basemod/utils'

const MOD = 'basemod'

const HOLY_SCHOOL = 2
const FIRE_SCHOOL = 4
const NATURE_SCHOOL = 8
const FROST_SCHOOL = 16
const SHADOW_SCHOOL = 32
const ARCANE_SCHOOL = 64

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

    // if has dodge-aura tag && is does not have cannot-be-dodged tag && is in front
    if (victim.HasAura(26669) && attacker.IsInFront(victim, 80))
      dodgeChance.set(100)
  })

  events.Spells.OnCalcMiss((spell, attacker, victim, effectMask, missCond) => {
    const info = spell.GetSpellInfo()
    const school = info.GetSchool()
    const dmgClass = info.GetDmgClass()
    const cond = missCond.get()
    const isMagic = (dmgClass === 1)
      || ((HOLY_SCHOOL & school) != 0)
      || ((FIRE_SCHOOL & school) != 0)
      || ((NATURE_SCHOOL & school) != 0)
      || ((FROST_SCHOOL & school) != 0)
      || ((SHADOW_SCHOOL & school) != 0)
      || ((ARCANE_SCHOOL & school) != 0)

    if (cond === SpellMissInfo.PARRY)
      missCond.set(SpellMissInfo.NONE)
    if (cond === SpellMissInfo.BLOCK)
      missCond.set(SpellMissInfo.NONE)
    if (cond === SpellMissInfo.MISS)
      missCond.set(SpellMissInfo.NONE)
    if (cond === SpellMissInfo.RESIST)
      missCond.set(SpellMissInfo.NONE)
    if (cond === SpellMissInfo.DODGE)
      missCond.set(SpellMissInfo.NONE)

    // block
    if (
      ((cond === SpellMissInfo.BLOCK) || (cond === SpellMissInfo.NONE))
        && ((dmgClass === 2) || (dmgClass === 3))
        && attacker.IsInFront(victim, 80)
    ) {
      const ids = GetIDTag('basemod', 'force-block')
      ids.forEach(id => {
        if (victim.HasAura(id))
          missCond.set(SpellMissInfo.BLOCK)
      })
    }

    // parry
    if (
      ((cond === SpellMissInfo.PARRY) || (cond === SpellMissInfo.NONE))
        && (dmgClass === 2)
        && attacker.IsInFront(victim, 80)
    ) {
      const ids = GetIDTag('basemod', 'force-parry')
      ids.forEach(id => {
        if (victim.HasAura(id))
          missCond.set(SpellMissInfo.PARRY)
      })
    }

    // dodge
    if (
      ((cond === SpellMissInfo.DODGE) || (cond === SpellMissInfo.NONE))
        && (dmgClass === 2)
        && attacker.IsInFront(victim, 80)
    ) {
      const ids = GetIDTag('basemod', 'force-dodge')
      ids.forEach(id => {
        if (victim.HasAura(id))
          missCond.set(SpellMissInfo.DODGE)
      })
    }

    // resist
    if (
      ((cond === SpellMissInfo.RESIST) || (cond === SpellMissInfo.NONE))
        && isMagic
    ) {
      const ids = GetIDTag('basemod', 'force-resist')
      ids.forEach(id => {
        if (victim.HasAura(id))
          missCond.set(SpellMissInfo.RESIST)
      })
    }
  })
}
