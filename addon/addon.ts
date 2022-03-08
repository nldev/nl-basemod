import { App } from './basemod/app'
import { Talents } from './basemod/talents'
import { EasyLoot } from './basemod/easy-loot'
import { Chests } from './basemod/chests'

console.log('test')
export const app = new App(app => {
  console.log('my eyes')
  Talents()
  EasyLoot()
  Chests()
})

