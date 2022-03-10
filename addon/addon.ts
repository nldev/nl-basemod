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
  let txt = ''
  app.root.ref.HookScript('OnUpdate', () => {
    const f = GetMouseFocus()
    const name = f.GetName()
    if (txt === name)
      return
    txt = name
    if (f.GetName() === 'InterfaceOptionsControlsPanelAutoLootKeyDropDownButton')
      console.log('hello')
  })
})

function test () {
}

