import { App } from './basemod/app'
// import { Talents } from './basemod/talents'
import { EasyLoot } from './basemod/easy-loot'
import { Chests } from './basemod/chests'
import { AllChildren } from './basemod/utils'
import { Panel } from './basemod/components/panel'
import { Dropdown } from './basemod/components/dropdown'

export const app = new App(app => {
  EasyLoot()
  Chests()

  const panel = Panel({ name: 'panel', parent: app.root })

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

