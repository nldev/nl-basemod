import { Store } from './basemod/store'
import { EasyLoot } from './basemod/easy-loot'
import { Talents } from './basemod/talents'
import { Rest } from './basemod/rest'
import { Chests } from './basemod/chests'
import { Autolearn } from './basemod/autolearn'
import { Combat } from './basemod/combat/combat'

export function Main (events: TSEvents) {
  Store(events)
  EasyLoot(events)
  Talents(events)
  Rest(events)
  Chests(events)
  Autolearn(events)
  Combat(events)

  events.Items.OnEquip((item, player, slot, isMerge) => {
    player.SendBroadcastMessage(`EQUIP ${item.GetName()} ${item.GetGUIDLow()}`)
  })
  events.Items.OnUnequip((item, player, isSwap, result) => {
    if (result.get())
      player.SendBroadcastMessage(`UNEQUIP ${item.GetName()} ${item.GetGUIDLow()}`)
  })
  events.Player.OnSay((p, m) => {
    if (m.get() === 'x') {
      p.Teleport(47, 1944, 1550, 82.2, 1.3)
    }
  })

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

