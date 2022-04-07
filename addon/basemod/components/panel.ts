import { Get } from '../app'
import { Component, ComponentOptions, Frame, Element } from '../app'
import { Dropdown, DropdownItemOptions } from './dropdown'
import { BASE_BACKDROP } from '../constants'
import { Movable } from '../utils'
import { Mapping } from '../types'

// titleText.SetText('basemod v0.1.0')
//    items: [
//      {
//        id: 'dev-tools',
//        text: '[dev] General',
//      },
//      {
//        id: 'dev-equip',
//        text: '[dev] Equipment',
//      },
//      {
//        id: 'dev-consume',
//        text: '[dev] Consumables',
//      },
//      {
//        id: 'profile',
//        text: 'Profile',
//        disabled: true,
//      },
//      {
//        id: 'abilities',
//        text: 'Abilities',
//      },
//      {
//        id: 'jobs',
//        text: 'Jobs',
//        disabled: true,
//      },
//      {
//        id: 'lfg',
//        text: 'Group Finder',
//        disabled: true,
//      },
//      {
//        id: 'stash',
//        text: 'Stash',
//        disabled: true,
//      },
//      {
//        id: 'market',
//        text: 'Market',
//        disabled: true,
//      },
//      {
//        id: 'clan',
//        text: 'Clan',
//        disabled: true,
//      },
//      {
//        id: 'mail',
//        text: 'Mail',
//        disabled: true,
//      },
//      {
//        id: 'journal',
//        text: 'Journal',
//        disabled: true,
//      },
//      {
//        id: 'settings',
//        text: 'Settings',
//        disabled: true,
//      },
//      {
//        id: 'feedback',
//        text: 'Feedback',
//        disabled: true,
//      },
//      {
//        id: 'support',
//        text: 'Support',
//        disabled: true,
//      },
//    ],

// const COMPONENTS: Mapping<Component> = {
//   'dev-tools': DevTools,
//   'dev-equip': Frame,
//   'dev-consume': Frame,
//   'profile': Frame,
//   'abilities': Talents,
//   'jobs': Frame,
//   'lfg': Frame,
//   'stash': Frame,
//   'market': Frame,
//   'clan': Frame,
//   'mail': Frame,
//   'notes': Frame,
//   'settings': Frame,
//   'feedback': Frame,
//   'support': Frame,
// }
// const pages: Mapping<Element> = {}


export interface PanelOptions extends ComponentOptions {
  nav?: DropdownItemOptions[]
  pages?: Mapping<Element<any, any>>
  components?: Mapping<Component>
  defaultSelectionId?: string
  isHiddenOnEmpty?: boolean
  title?: string
}

export const Panel: Component<PanelOptions> = options => {
  const $ = Get()

  // title
  const title: Element<PanelOptions> = Frame(options) as any

  title.ref.SetSize(168, 30)
  title.ref.SetBackdrop({ ...BASE_BACKDROP, bgFile: 'Interface/Tooltips/UI-Tooltip-Background' })
  title.ref.SetBackdropColor(0, 0, 0, 1)
  title.ref.SetPoint('CENTER', 0, 0)

  const titleText = title.ref.CreateFontString(
    'talent-countertext',
    'OVERLAY',
    'GameTooltipText',
  )
  titleText.SetParent(title.ref)
  titleText.SetPoint('CENTER')
  titleText.SetFont('Fonts/FRIZQT__.TTF', 10)
  titleText.SetText(options.title)

  // panel
  const a = Frame({ name: `${title.ref.GetName()}-panel`, parent: title })

  a.ref.SetSize(340, 410)
  a.ref.SetBackdrop({ ...BASE_BACKDROP, bgFile: 'Interface/Tooltips/UI-Tooltip-Background' })
  a.ref.SetBackdropColor(0, 0, 0, 1)
  a.ref.SetPoint('TOP', title.ref, 'BOTTOMLEFT', -2, -3)

  // panel-inner
  const b = Frame({ name: `${title.ref.GetName()}-inner`, parent: a })

  b.ref.SetSize(300 - 30, 400 - 30)
  b.ref.SetPoint('CENTER')

  title.inner = b.ref

  // pages
  const components = options.components
  const pages = options.pages

  //dropdown
  const dropdown = Dropdown({
    name: `${a.ref.GetName()}-dropdown`,
    width: 168,
    defaultSelectionId: $.store.Get('CHARACTER', `${options.name}-panel-selection`, ''),
    isTriggerOnInit: true,
    items: options.nav,
    onSelect: ({ id }) => {
      $.store.Set('CHARACTER', `${options.name}-panel-selection`, id)

      for (let key of Object.keys(options.pages)) {
        const page = options.pages[key]
        page.ref.Hide()
      }

      if (!pages[id] && components[id]) {
        const page = components[id]({ parent: b })

        pages[id] = page

        page.ref.SetParent(title.inner)
        page.ref.SetPoint('CENTER')
      }

      if (pages[id])
        pages[id].ref.Show()
    },
  })

  dropdown.ref.SetParent(title.ref)
  dropdown.ref.SetPoint('RIGHT', title.ref, 'LEFT', -4, -1)

  // frame level
  a.ref.SetFrameStrata('LOW')
  dropdown.ref.SetFrameStrata('HIGH')

  // toggle visibility
  const TogglePanel = () => {
    if (dropdown.ref.IsVisible()) {
      $.store.Set('CHARACTER', `${options.name}-panel-visibility`, false)
      dropdown.ref.Hide()
      a.ref.Hide()
    } else {
      $.store.Set('CHARACTER', `${options.name}-panel-visibility`, true)
      dropdown.ref.Show()
      a.ref.Show()
    }
  }

  title.ref.HookScript('OnEnter', () => title.ref.SetBackdropColor(0.21, 0.49, 1, 1))
  title.ref.HookScript('OnLeave', () => title.ref.SetBackdropColor(0, 0, 0, 1))

  title.ref.SetScript('OnMouseDown', (frame, type: WoWAPI.MouseButton) => {
    if (type === 'LeftButton')
      TogglePanel()
  })

  if (!$.store.Get('CHARACTER', `${options.name}-panel-visibility`)) {
    dropdown.ref.Hide()
    a.ref.Hide()
  }

  // make title movable
  Movable(title)

  return title
}

