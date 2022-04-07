import { App, Frame } from './basemod/app'
import { Talents } from './basemod/talents'
import { DevTools } from './basemod/panels/dev-tools'
import { EasyLoot } from './basemod/easy-loot'
import { Chests } from './basemod/chests'
import { AllChildren } from './basemod/utils'
import { Panel } from './basemod/components/panel'
import { Dropdown } from './basemod/components/dropdown'

export const app = new App(app => {
  EasyLoot()
  Chests()
})

const panel = Panel({
  title: 'basemod v0.1.0',
  components: {
    'dev-tools': DevTools,
    'dev-equip': Frame,
    'dev-consume': Frame,
    'profile': Frame,
    'abilities': Talents,
    'jobs': Frame,
    'lfg': Frame,
    'stash': Frame,
    'market': Frame,
    'clan': Frame,
    'mail': Frame,
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
     disabled: true,
   },
   {
     id: 'abilities',
     text: 'Abilities',
   },
   {
     id: 'jobs',
     text: 'Jobs',
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
     id: 'clan',
     text: 'Clan',
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
  pages: {},
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
test()

