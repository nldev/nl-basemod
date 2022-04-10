import { App, Frame, Get } from './basemod/app'
import { Talents } from './basemod/talents'
import { DevTools } from './basemod/panels/dev-tools'
import { EasyLoot } from './basemod/easy-loot'
import { Chests } from './basemod/chests'
import { AllChildren } from './basemod/utils'
import { Panel } from './basemod/components/panel'
// import { Markdown } from './basemod/components/markdown'
import { Profile } from './basemod/panels/profile'
interface SlashCommands {
  [key: string]: (message: string) => void
}
declare const SlashCmdList: SlashCommands

export const app = new App(app => {
  SlashCmdList['BASEMOD'] = msg => panel.ref.IsShown() ? panel.ref.Hide() : panel.ref.Show()
  _G['SLASH_BASEMOD1'] = '/basemod'
  EasyLoot()
  Chests()
  // Markdown()
  test()

  const panel = Panel({
    name: 'main',
    title: 'basemod v0.1.0',
    components: {
      'dev-tools': DevTools,
      'dev-equip': Frame,
      'dev-consume': Frame,
      'profile': Profile,
      'talents': Talents,
      'adventure': Frame,
      'scenarios': Frame,
      'missions': Frame,
      'lfg': Frame,
      'stash': Frame,
      'market': Frame,
      'groups': Frame,
      'mail': Frame,
      'emotes': Frame,
      'notes': Frame,
      'settings': Frame,
      'feedback': Frame,
      'support': Frame,
    },
    nav: [
      {
        id: 'dev-tools',
        text: '[dev] General',
      },
      {
        id: 'dev-equip',
        text: '[dev] Equipment',
      },
      {
        id: 'dev-consume',
        text: '[dev] Consumables',
      },
      {
        id: 'profile',
        text: 'Profile',
      },
      {
        id: 'talents',
        text: 'Talents',
      },
      {
        id: 'adventure',
        text: 'Adventure',
        disabled: true,
      },
      {
        id: 'scenarios',
        text: 'Scenarios',
        disabled: true,
      },
      {
        id: 'missions',
        text: 'Missions',
        disabled: true,
      },
      {
        id: 'lfg',
        text: 'Group Finder',
        disabled: true,
      },
      {
        id: 'stash',
        text: 'Stash',
        disabled: true,
      },
      {
        id: 'market',
        text: 'Market',
        disabled: true,
      },
      {
        id: 'groups',
        text: 'Groups',
        disabled: true,
      },
      {
        id: 'mail',
        text: 'Mail',
        disabled: true,
      },
      {
        id: 'journal',
        text: 'Journal',
        disabled: true,
      },
      {
        id: 'emotes',
        text: 'Emotes',
        disabled: true,
      },
      {
        id: 'settings',
        text: 'Settings',
        disabled: true,
      },
      {
        id: 'feedback',
        text: 'Feedback',
        disabled: true,
      },
      {
        id: 'support',
        text: 'Support',
        disabled: true,
      },
    ],
  })
})

const test = () => {
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
}

