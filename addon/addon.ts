import { App } from './basemod/app'
import { Talents } from './basemod/talents'
import { EasyLoot } from './basemod/easy-loot'
import { Chests } from './basemod/chests'

export const app = new App(app => {
  Talents()
  EasyLoot()
  Chests()

  console.log(app.playerInfo.name)
})

