import { Get } from '../app'
import { Component, ComponentOptions, Frame, Element } from '../app'
import { Dropdown, DropdownItemOptions } from './dropdown'
import { BASE_BACKDROP } from '../constants'
import { Movable } from '../utils'
import { Mapping, Rgb } from '../types'
import { Talents } from '../talents'

export interface SectionOptions extends ComponentOptions {
  parent: Element
  height: number
  previous?: Element
  y?: number
  title?: string
  border?: boolean
  color?: Rgb
}

export const Section: Component<SectionOptions> = options => {
  const f = Frame(options)

  // box
  f.ref.SetHeight(options.height)
  f.ref.SetWidth(options.parent.inner.GetWidth())

  // position based on y
  const y = options.y || 0
  f.ref.SetPoint('TOPLEFT', 0, y)

  // position based on previous
  if (options.previous)
    f.ref.SetPoint('TOPLEFT', options.previous.inner, 'BOTTOMLEFT', 0, -20)

  // title
  if (options.title) {
    const text = f.ref.CreateFontString(
      `${f.ref.GetName()}-title`,
      'OVERLAY',
      'GameTooltipText',
    )
    text.SetFont('Fonts/FRIZQT__.TTF', 10)
    text.SetText(options.title)
    text.SetPoint('TOPLEFT', 0, 10)
  }

  // color
  if (options.border || options.color) {
    f.ref.SetBackdrop({
      ...BASE_BACKDROP,
      bgFile: options.color ? BASE_BACKDROP.bgFile : '',
      edgeFile: options.border ? BASE_BACKDROP.edgeFile : '',
    })

    if (options.color)
      f.ref.SetBackdropColor(...options.color, 1)
  }

  return f
}

export const DevTools: Component = options => {
  const f = Frame({ name: 'devtools', ...options })
  f.ref.SetAllPoints(options.parent.inner)
  f.ref.SetPoint('TOPLEFT')

  const a = Section({
    name: 'a-sect',
    title: 'a section',
    height: 50,
    parent: f,
    border: true,
    color: [255, 255, 0],
  })

  const b = Section({
    name: 'b-sect',
    title: 'b section',
    previous: a,
    height: 50,
    parent: f,
    border: true,
    color: [255, 255, 0],
  })

  // reset bags
  const ci = Frame({ name: 'devtools-reset-bags', parent: f })
  ci.ref.SetPoint('TOPLEFT')
  ci.ref.SetSize(120, 30)
  const ciButton = CreateFrame('Button', 'devtools-reset-bags-button', ci.ref, 'UIPanelButtonTemplate')
  ciButton.SetSize(120, 30)
  ciButton.SetParent(ci.ref)
  ciButton.SetText('Clear Inventory')
  ciButton.SetPoint('CENTER')

  ciButton.SetScript('OnClick', frame =>
    SendAddonMessage('dev-clear-inventory', '', 'WHISPER', Get().playerInfo.name)
  )

  return f
}

export interface PanelOptions extends ComponentOptions {
  // FIXME
  nav?: DropdownItemOptions[]
  pages?: Mapping<Component>

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
  // FIXME
  titleText.SetText('basemod v0.1.0')
  titleText.SetFont('Fonts/FRIZQT__.TTF', 10)

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
  // FIXME
  const COMPONENTS: Mapping<Component> = {
    'dev-tools': DevTools,
    'dev-equip': Frame,
    'dev-consume': Frame,
    'profile': Frame,
    'talents': Talents,
    'missions': Frame,
    'lfg': Frame,
    'loadout': Frame,
    'stash': Frame,
    'market': Frame,
    'clan': Frame,
    'mail': Frame,
    'notes': Frame,
    'statistics': Frame,
    'settings': Frame,
    'help': Frame,
  }
  const pages: Mapping<Element> = {}

  //dropdown
  const dropdown = Dropdown({
    name: `${a.ref.GetName()}-dropdown`,
    width: 168,
    defaultSelectionId: $.store.Get('CHARACTER', 'test-dropdown-id', 'talents'),
    // isSelectableEmpty: false,
    isTriggerOnInit: true,
    // isTriggerOnReselect: false,
    // emptyText: 'Minimize',
    items: [
      {
        id: 'dev-tools',
        text: '[dev] Tools',
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
        id: 'talents',
        text: 'Talents',
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
        id: 'loadout',
        text: 'Loadout',
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
        id: 'statistics',
        text: 'Statistics',
        disabled: true,
      },
      {
        id: 'settings',
        text: 'Settings',
        disabled: true,
      },
      {
        id: 'help',
        text: 'Help',
        disabled: true,
      },
    ],
    onSelect: ({ id }) => {
      // FIXME
      $.store.Set('CHARACTER', 'test-dropdown-id', id)

      for (let key of Object.keys(pages)) {
        const page = pages[key]
        page.ref.Hide()
      }

      if (!pages[id] && COMPONENTS[id]) {
        const page = COMPONENTS[id]({ parent: b })

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
      $.store.Set('CHARACTER', 'test-panel-visibility', false)
      dropdown.ref.Hide()
      a.ref.Hide()
    } else {
      $.store.Set('CHARACTER', 'test-panel-visibility', true)
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

  if (!$.store.Get('CHARACTER', 'test-panel-visibility')) {
    dropdown.ref.Hide()
    a.ref.Hide()
  }

  // make title movable
  Movable(title)

  return title
}

