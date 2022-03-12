import { App } from './basemod/app'
import { Talents } from './basemod/talents'
import { EasyLoot } from './basemod/easy-loot'
import { Chests } from './basemod/chests'
import { Systems } from './basemod/systems'
import { AllChildren } from './basemod/utils'

export const app = new App(app => {
  Talents()
  EasyLoot()
  Chests()
  Systems()
  let txt = ''
  app.root.ref.SetScript('OnUpdate', () => {
    const f = GetMouseFocus()
    if (!f)
      return
    const name = f.GetName()
    if (txt !== name) {
      txt = name
      if (name === 'DropDownList1') {
        const a: WoWAPI.Frame = f as any
        AllChildren(a).forEach(c => console.log(c.GetName()))
      }
    }
  })
})

function test () {
}

