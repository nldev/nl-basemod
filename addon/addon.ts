import { App } from './basemod/app'
import { Talents } from './basemod/talents'
import { EasyLoot } from './basemod/easy-loot'
import { Chests } from './basemod/chests'

export const app = new App(app => {
  Talents()
  EasyLoot()
  Chests()
})

// utils
//
// constants

// types

// store



// scroll

// grid

// lists

// Loot

// FIXME pass in default

// FIXME organize this this
// mods
// export type Mod = (frame: WoWAPI.Frame) => WoWAPI.Frame
//
// export type Use<O = any> = (o: O) => Mod
  // const root = Root()
  // const chest = Chest()
  // const loot = Loot()

  // other
  // const list = AllChildren(UIParent)
  // list.forEach(e => {
  //   // hide loot
  //   if (e && e.GetName && (e.GetName() === 'LootFrame')) {
  //     e.SetScript('OnUpdate', () => {
  //       if (e.IsShown()) {
  //         e.SetAlpha(0)
  //         e.SetPoint('LEFT', -9999, -9999)
  //         const l = AllChildren(e)
  //         l.forEach(c => {
  //           c.Hide && c.Hide()
  //           c.EnableMouse && c.EnableMouse(false)
  //         })
  //       }
  //     })
  //   }

  //   // hide ammo
  //   if (e && e.GetName && (e.GetName() === 'CharacterAmmoSlot')) {
  //     e.SetScript('OnUpdate', () => {
  //       if (e.IsShown())
  //         e.Hide()
  //     })
  //   }
  // })

  // const aa: any = CreateFrame('Frame', 'a')
  // aa.foo = 'hello'
  // const bb: any = CreateFrame('Frame', 'a')

  // let current = ''
  // root.ref.SetScript('OnUpdate', () => {
  //   const frame = GetMouseFocus()
  //   if (!frame)
  //     return
  //   const name = frame.GetName()
  //   if (name !== current) {
  //     current = name
  //     console.log(name)
  //   }
  // })

  // Events.ChatInfo.OnChatMsgSay(app.root.ref, (text, player) => {
  //   if (player.toLowerCase() !== name)
  //     return
  //   if (text.indexOf('@@') === 0) {
  //     loot.fns.Add({
  //       id: 0,
  //       itemId: 19138,
  //       amount: 1,
  //       timer: 300,
  //     })
  //   }
  // })

  // function onSetHyperlink(tooltip: WoWAPI.GameTooltip) {
  //   const [_, link] = tooltip.GetItem()
  //   const a = link.split(':')
  //   const id = a[1]
  //   SendAddonMessage('refresh-item', id, 'WHISPER', app.playerInfo.name)
  // }
  // GameTooltip.HookScript('OnTooltipSetItem', onSetHyperlink)

  // hooksecurefunc(GameTooltip, "SetHyperlink", onSetHyperlink)
  // hooksecurefunc(ItemRefTooltip, "SetHyperlink", onSetHyperlink)
  // hooksecurefunc(ItemRefShoppingTooltip1, "SetHyperlink", onSetHyperlink)
  // hooksecurefunc(ItemRefShoppingTooltip2, "SetHyperlink", onSetHyperlink)
  // hooksecurefunc(ShoppingTooltip1, "SetHyperlink", onSetHyperlink)
  // hooksecurefunc(ShoppingTooltip2, "SetHyperlink", onSetHyperlink)

  // ItemRefTooltip.HookScript('OnTooltipSetItem', onSetHyperlink)
  // ItemRefShoppingTooltip1.HookScript('OnTooltipSetItem', onSetHyperlink)
  // ItemRefShoppingTooltip2.HookScript('OnTooltipSetItem', onSetHyperlink)
  // ShoppingTooltip1.HookScript('OnTooltipSetItem', onSetHyperlink)
  // ShoppingTooltip2.HookScript('OnTooltipSetItem', onSetHyperlink)
  // hooksecurefunc(ItemRefTooltip, "SetItemRef", onSetHyperlink)
  // hooksecurefunc(ItemRefTooltip, "SetItemRef", onSetHyperlink)
  // hooksecurefunc(ItemRefShoppingTooltip1, "SetItemRef", onSetHyperlink)
  // hooksecurefunc(ItemRefShoppingTooltip2, "SetItemRef", onSetHyperlink)
  // hooksecurefunc(ShoppingTooltip1, "SetItemRef", onSetHyperlink)
  // hooksecurefunc(ShoppingTooltip2, "SetItemRef", onSetHyperlink)
