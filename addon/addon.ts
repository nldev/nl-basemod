import { App, Frame, Get } from './basemod/app'
import { Talents } from './basemod/talents'
import { DevTools } from './basemod/panels/dev-tools'
import { EasyLoot } from './basemod/easy-loot'
import { Chests } from './basemod/chests'
import { AllChildren } from './basemod/utils'
import { Panel } from './basemod/components/panel'
// import { Markdown } from './basemod/components/markdown'
import { Profile } from './basemod/panels/profile'
interface SlashCmdList {
  [key: string]: (message: string) => void
}
declare const GetMouseFocus: any
declare const SlashCmdList: SlashCmdList

export const app = new App(app => {
  SlashCmdList['BASEMOD'] = msg => {
    const isShown = panel.ref.IsShown()

    if (isShown) {
      console.log('panel hidden')
      panel.ref.Hide()
    } else {
      console.log('panel shown')
      panel.ref.Show()
    }
  }
  _G['SLASH_BASEMOD1'] = '/basemod'
  EasyLoot()
  Chests()
  // Markdown()

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

