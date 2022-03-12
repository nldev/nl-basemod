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
  app.root.ref.HookScript('OnUpdate', () => {
    const f = GetMouseFocus()
    if (!f)
      return
    const name = f.GetName()
    if (txt !== name) {
      txt = name
      // console.log(name)
      if (name === 'InterfaceOptionsControlsPanelAutoLootKeyDropDownButton') {
        const b: WoWAPI.Button = f as any
        const t = b.GetNormalTexture()
        const h = b.GetHighlightTexture()
        const p = b.GetPushedTexture()
        const d = b.GetDisabledTexture()
        // console.log(((t as any) as WoWAPI.Texture).GetTexture())
        // console.log(((h as any) as WoWAPI.Texture).GetTexture())
        // console.log(((p as any) as WoWAPI.Texture).GetTexture())
        // console.log(((d as any) as WoWAPI.Texture).GetTexture())
      }
    }
  })
})

function test () {
}

