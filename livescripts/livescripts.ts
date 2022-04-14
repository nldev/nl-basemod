import { Store } from './basemod/store'
import { EasyLoot } from './basemod/easy-loot'
import { Talents } from './basemod/talents'
import { Rest } from './basemod/rest'
import { Chests } from './basemod/chests'
import { Autolearn } from './basemod/autolearn'
import { Combat } from './basemod/combat/combat'
import { Opcode } from './basemod/utils'

const MOD = 'basemod'

const HOLY_SCHOOL: uint32 = 2
const FIRE_SCHOOL: uint32 = 4
const NATURE_SCHOOL: uint32 = 8
const FROST_SCHOOL: uint32 = 16
const SHADOW_SCHOOL: uint32 = 32
const ARCANE_SCHOOL: uint32 = 64

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
  events.Unit.OnCalcMeleeOutcome((attacker, victim, missChance, critChance, dodgeChance, blockChance, parryChance, attackType) => {
    missChance.set(0)
    dodgeChance.set(0)
    blockChance.set(0)
    parryChance.set(0)

    // miss
    // const forceMissIds = GetIDTag('basemod', 'force-miss')
    // forceMissIds.forEach(id => {
    //   if (victim.HasAura(id))
    //     missChance.set(100)
    // })

    // block
    // const forceBlockIds = GetIDTag('basemod', 'force-block')
    // forceBlockIds.forEach(id => {
    //   if (victim.HasAura(id))
    //     blockChance.set(100)
    // })

    // parry
    // const forceParryIds = GetIDTag('basemod', 'force-parry')
    // forceParryIds.forEach(id => {
    //   if (victim.HasAura(id))
    //     parryChance.set(100)
    // })

    // dodge
    const forceDodgeIds = GetIDTag('basemod', 'force-dodge')
    forceDodgeIds.forEach(id => {
      if (victim.HasAura(id))
        dodgeChance.set(100)
    })
  })

  // handle reflect trap
  events.Spells.OnCalcReflect((spell, reflectChance, attacker, victim) => {
    if (attacker && !attacker.IsNull())
      victim.ToPlayer().SendBroadcastMessage('attacker exists')
      if (victim.IsUnit() && (reflectChance.get() === 100)) {
        victim.ToPlayer().SendBroadcastMessage('here')
        const caster = attacker.GetEffectiveOwner()
        // FIXME: check for gameobject spells
        if (caster.IsPlayer())
          caster.AddAura(spell.GetEntry(), caster)
      }
  })

  events.Spells.OnCalcMiss((spell, attacker, victim, effectMask, missCond) => {
    const info = spell.GetSpellInfo()
    const school = info.GetSchool()
    const dmgClass = info.GetDmgClass()
    const c1 = missCond.get()
    const isMagic = (dmgClass === 1)
      || ((HOLY_SCHOOL & school) !== 0)
      || ((FIRE_SCHOOL & school) !== 0)
      || ((NATURE_SCHOOL & school) !== 0)
      || ((FROST_SCHOOL & school) !== 0)
      || ((SHADOW_SCHOOL & school) !== 0)
      || ((ARCANE_SCHOOL & school) !== 0)

    if (c1 === SpellMissInfo.MISS)
      missCond.set(SpellMissInfo.NONE)
    if (c1 === SpellMissInfo.BLOCK)
      missCond.set(SpellMissInfo.NONE)
    if (c1 === SpellMissInfo.PARRY)
      missCond.set(SpellMissInfo.NONE)
    if (c1 === SpellMissInfo.DODGE)
      missCond.set(SpellMissInfo.NONE)
    if (c1 === SpellMissInfo.RESIST)
      missCond.set(SpellMissInfo.NONE)

    const c2 = missCond.get()

    // miss
    // if (c2 === SpellMissInfo.MISS) {
    //   const ids = GetIDTag('basemod', 'force-miss')
    //   ids.forEach(id => {
    //     if (victim.HasAura(id))
    //       missCond.set(SpellMissInfo.MISS)
    //   })
    // }

    // block
    // if (
    //   ((cond === SpellMissInfo.BLOCK) || (cond === SpellMissInfo.NONE))
    //     && ((dmgClass === 2) || (dmgClass === 3))
    //     && attacker.IsInFront(victim, 80)
    // ) {
    //   const ids = GetIDTag('basemod', 'force-block')
    //   ids.forEach(id => {
    //     if (victim.HasAura(id))
    //       missCond.set(SpellMissInfo.BLOCK)
    //   })
    // }

    // parry
    // if (
    //   ((cond === SpellMissInfo.PARRY) || (cond === SpellMissInfo.NONE))
    //     && (dmgClass === 2)
    //     && attacker.IsInFront(victim, 80)
    // ) {
    //   const ids = GetIDTag('basemod', 'force-parry')
    //   ids.forEach(id => {
    //     if (victim.HasAura(id))
    //       missCond.set(SpellMissInfo.PARRY)
    //   })
    // }

    // dodge
    if (
      ((c2 === SpellMissInfo.DODGE) || (c2 === SpellMissInfo.NONE))
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
      ((c2 === SpellMissInfo.RESIST) || (c2 === SpellMissInfo.NONE))
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
