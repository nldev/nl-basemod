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

  events.Spells.OnApply((effect, application) => {
    if (effect.GetID() === 8326) {
      const player = application.GetTarget().ToPlayer()
      const corpse = player.GetCorpse()
      player.Teleport(corpse.GetMapID(), corpse.GetX(), corpse.GetY(), corpse.GetZ(), corpse.GetO())
    }
  })
  events.Player.OnChat((player, _, msg) => {
    console.log(msg.get())
    if (msg.get() === 'dead') {
      // player.AddAura(8326, player)
    }
    if (msg.get() === 'alive') {
      player.ResurrectPlayer(1, false)
      player.RemoveAura(8326)
    }
  })
}

