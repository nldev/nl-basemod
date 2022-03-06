import { Store } from './basemod/modules/store'
import { EasyLoot } from './basemod/modules/easy-loot'
import { Talents } from './basemod/modules/talents'
import { Rest } from './basemod/modules/rest'
import { Chests } from './basemod/modules/chests'
import { Autolearn } from './basemod/modules/autolearn'
import { Combat } from './basemod/modules/combat/combat'

export function Main (events: TSEvents) {
  Store(events)
  EasyLoot(events)
  Talents(events)
  Rest(events)
  Chests(events)
  Autolearn(events)
}

