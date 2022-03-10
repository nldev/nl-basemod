import { App } from './basemod/app'
import { Talents } from './basemod/talents'
import { EasyLoot } from './basemod/easy-loot'
import { Chests } from './basemod/chests'
import { Systems } from './basemod/systems'

export const app = new App(app => {
  Talents()
  EasyLoot()
  Chests()
  Systems()
  app.root.ref.HookScript('OnUpdate', () => {
    test()
  })
})

function test () {
  const f = GetMouseFocus()
  if (f.GetName() === 'InterfaceOptionsControlsPanelAutoLootKeyDropDownButton')
    console.log('hello')
}

