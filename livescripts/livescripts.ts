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

  // affects miss
  events.Spells.OnCalcMeleeMiss((spell, miss, attacker, victim, attackType, skillDiff) => {})

  // also affects miss
  // does this happen before or after onCalcMeleeMiss?
  events.Spells.OnCalcHit((spell, hitChance, attacker, defender) => {})

  events.Spells.OnCalcResist((spell, resistChance, attacker, defender) => {})
  events.Spells.OnCalcReflect((spell, reflectChance, attacker, victim) => {})
  events.Spells.OnPeriodicDamage((aura, damage) => {})
  events.Spells.OnDamageEarly((spell, damage, info, type, isCrit) => {})
  events.Spells.OnDamageLate((spell, damage, info, type, isCrit) => {})
  events.Spells.OnCalcCrit((spell, chance) => {})
  events.Spells.OnCalcAuraCrit((aura, chance) => {})
  events.Spells.OnTick(effect => {})
  events.Spells.OnDamageEarly((spell, damage, info, type, isCrit) => {})
}
