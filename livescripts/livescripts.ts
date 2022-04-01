import { Store } from './basemod/store'
import { EasyLoot } from './basemod/easy-loot'
import { Talents } from './basemod/talents'
import { Rest } from './basemod/rest'
import { Chests } from './basemod/chests'
import { Autolearn } from './basemod/autolearn'
import { Combat } from './basemod/combat/combat'
import { Opcode } from './basemod/utils'

function AddComboPoints (spell: TSSpell, amount: number) {
  const c = spell.GetCaster()
  const t = spell.GetTarget()
  if (!c.IsPlayer() && t.IsUnit())
    return
  const p = c.ToPlayer()
  const u = t.ToUnit()
  p.AddComboPoints(u, amount)
}

const CHEAP_SHOT = 1833
const AMBUSH = 11267
const GARROTE = 11290

export function Main (events: TSEvents) {
  Store(events)
  EasyLoot(events)
  Talents(events)
  Rest(events)
  Chests(events)
  Autolearn(events)
  Combat(events)

  events.SpellID.OnHit(CHEAP_SHOT, s => AddComboPoints(s, 1))
  events.SpellID.OnHit(AMBUSH, s => AddComboPoints(s, 1))
  events.SpellID.OnHit(GARROTE, s => AddComboPoints(s, 1))

  events.Player.OnWhisper((sender, _, message) => {
    if (message.get() === 'water')
    if (sender.IsInWater())
      sender.SendBroadcastMessage('is in water')
  })

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

  // events.Items.OnEquip((item, player, slot, isMerge) => {
  //   player.SendBroadcastMessage(`EQUIP ${item.GetName()} ${item.GetGUIDLow()}`)
  // })
  // events.Items.OnUnequip((item, player, isSwap, result) => {
  //   player.SendBroadcastMessage(`${result.get()}`)
  //   if (result.get() === 1)
  //     player.SendBroadcastMessage(`UNEQUIP ${item.GetName()} ${item.GetGUIDLow()}`)
  // })

  events.Unit.OnCalcMeleeOutcome((attacker, victim, missChance, critChance, dodgeChance, blockChance, parryChance, attackType) => {
    missChance.set(0)
    dodgeChance.set(0)
    blockChance.set(0)
    parryChance.set(0)
  })

  events.Spells.OnCalcResist((spell, resistChance, attacker, defender) => {
    resistChance.set(0)
  })

  events.Spells.OnCalcMeleeMiss((spell, miss, attacker, victim, attackType, skillDiff) => {
    miss.set(0)
  })

  // events.Unit.OnMeleeSpellHitResult((attacker, victim, dodgeChance, parryChance, blockChance, attackType) => {
  //   dodgeChance.set(0)
  //   parryChance.set(0)
  //   blockChance.set(0)
  //   if (attacker.IsPlayer())
  //     attacker.ToPlayer().SendBroadcastMessage(`${dodgeChance.get()} ${blockChance.get()} ${parryChance.get()}`)
  // })
}

  // events.Spells.OnApply((effect, application) => {
  //   if (effect.GetID() === 8326) {
  //     const player = application.GetTarget().ToPlayer()
  //     player.AddNamedTimer('death', 20, -1, (o, t) => {
  //       const p = o.ToPlayer()
  //       if (p.IsNull())
  //         t.Stop()
  //       // const corpse = player.GetCorpse()
  //       // if (!corpse.IsNull()) {
  //         player.SendBroadcastMessage('hello')
  //         // player.Teleport(corpse.GetMapID(), corpse.GetX(), corpse.GetY(), corpse.GetZ(), corpse.GetO())
  //         t.Stop()
  //       // }
  //     })
  //   }
  // })
  // events.Player.OnChat((player, _, msg) => {
  //   if (msg.get() === 'dead') {
  //     // player.AddAura(8326, player)
  //   }
  //   if (msg.get() === 'alive') {
  //     player.ResurrectPlayer(1, false)
  //     player.RemoveAura(8326)
  //   }
  // })

