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
  app.root.ref.SetScript('OnUpdate', () => {
    const f = GetMouseFocus()
    const name = f.GetName()
    if (txt !== name) {
      txt = name
      if (name === 'InterfaceOptionsControlsPanelAutoLootKeyDropDownButton')
        console.log('hello')
    }
  })
})

function test () {
}

