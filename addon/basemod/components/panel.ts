import { Get } from '../app'
import { Component, ComponentOptions, Frame, Element } from '../app'
import { Dropdown, DropdownItemOptions } from './dropdown'
import { BASE_BACKDROP } from '../constants'
import { Movable } from '../utils'
import { Mapping } from '../types'
import { Talents } from '../talents'
import { Scroll } from './scroll'
import { Section } from './section'
import { Button } from './button'

export const DevTools: Component = options => {
  const f = Frame({ name: 'devtools', ...options })
  f.ref.SetSize(290, 360)
  f.ref.SetPoint('CENTER')

  const scroll = Scroll({ name: 'devtools-scroll', parent: f, height: 300 })

  const a = Section({
    name: 'a-sect',
    title: 'a section',
    parent: scroll,
    height: 50,
    // bg: true,
  })

  const b = Section({
    name: 'b-sect',
    title: 'b section',
    parent: scroll,
    previous: a,
    height: 100,
    bg: true,
  })

  const c = Section({
    name: 'set-level',
    title: 'set level',
    parent: scroll,
    previous: b,
    height: 30,
  })

  // reset bags
  const ci = Frame({ name: 'devtools-reset-bags', parent: a })
  ci.ref.SetPoint('TOPLEFT')
  ci.ref.SetSize(120, 30)

  const ciButton = Button({
    name: 'devtools-reset-bags-button',
    parent: ci,
    text: 'Clear Inventory',
    width: 120,
    onClick: () => {
      SendAddonMessage('dev-clear-inventory', '', 'WHISPER', Get().playerInfo.name)
    },
  })

  ciButton.ref.SetPoint('CENTER')

  // set level
  const level = Frame({
    name: 'set-level-input',
    parent: c,
  })
  level.ref.SetBackdrop({
    ...BASE_BACKDROP,
  })
  level.ref.SetBackdropColor(0, 0, 0, 1)
  level.ref.SetHeight(30)
  level.ref.SetWidth(c.inner.GetWidth() - 30)
  level.ref.SetPoint('TOPLEFT')

  const input = Frame({
    name: 'input',
    width: level.ref.GetWidth() - 16,
    height: level.ref.GetHeight(),
    parent: level,
  })
  input.ref.SetPoint('CENTER')
  const i = CreateFrame('EditBox', 'devtools-set-level', input.ref)
  i.SetAllPoints(input.ref)
  i.SetNumeric()
  i.SetNumber(UnitLevel('player'))
  i.SetPoint('CENTER')
  i.SetAutoFocus(false)
  i.SetFont('Fonts/FRIZQT__.TTF', 12)
  i.ClearFocus()
  i.SetScript('OnTextChanged', () => {
  })
  input.inner = i as any
  c.ref.EnableMouse(true)
  c.ref.SetScript('OnMouseDown', () => {
    i.SetFocus()
  })
  // FIXME: counter buttons + debounced scroll
  i.SetScript('OnTabPressed', () => {
    const current = i.GetNumber()
    i.SetNumber(current)
    if (current > 99)
      i.SetNumber(99)
    if (current < 1)
      i.SetNumber(1)
    i.ClearFocus()
    // FIXME
    SendChatMessage(`.char level ${i.GetNumber()}`)
  })
  i.SetScript('OnEnterPressed', () => {
    const current = i.GetNumber()
    i.SetNumber(current)
    if (current > 99)
      i.SetNumber(99)
    if (current < 1)
      i.SetNumber(1)
    i.ClearFocus()
    // FIXME
    SendChatMessage(`.char level ${i.GetNumber()}`)
  })
  i.SetScript('OnEscapePressed', () => {
    i.SetNumber(UnitLevel('player'))
    i.ClearFocus()
  })
  const plus = Button({
    name: 'devtools-set-level-up',
    parent: input,
    text: '+',
    width: 30,
    fontSize: 20,
    scale: 0.6,
    onClick: () => {
      SendAddonMessage('dev-clear-inventory', '', 'WHISPER', Get().playerInfo.name)
    },
  })
  const minus = Button({
    name: 'devtools-set-level-down',
    parent: input,
    text: '-',
    width: 30,
    fontSize: 20,
    scale: 0.6,
    onClick: () => {
      SendAddonMessage('dev-clear-inventory', '', 'WHISPER', Get().playerInfo.name)
    },
  })
  plus.ref.SetPoint('TOPLEFT', i, 'TOPRIGHT', 15, -5)
  minus.ref.SetPoint('BOTTOMLEFT', i, 'BOTTOMRIGHT', 15, -5)

  // FIXME test
  const bb = CreateFrame('EditBox', 'devtools-test', b.inner)
  bb.SetWidth(b.inner.GetWidth() - 10)
  bb.SetHeight(b.inner.GetHeight() - 10)
  // level.SetBackdrop(BASE_BACKDROP)
  bb.SetFont('Fonts/FRIZQT__.TTF', 12)
  bb.SetAutoFocus(false)
  bb.SetMultiLine(true)
  bb.ClearFocus()
  bb.SetJustifyH('LEFT')
  b.ref.EnableMouse(true)
  b.ref.SetScript('OnMouseDown', () => {
    bb.SetFocus()
  })
  bb.SetScript('OnTabPressed', () => {
    bb.ClearFocus()
  })
  bb.SetScript('OnEnterPressed', () => {
    const text = bb.GetText()
    console.log(text)
    bb.ClearFocus()
  })
  bb.SetScript('OnEscapePressed', () => {
    bb.ClearFocus()
  })
  bb.Insert('test')
  bb.SetPoint('TOPLEFT')
  bb.SetMaxLetters(138)

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
    'abilities': Talents,
    'jobs': Frame,
    'lfg': Frame,
    'stash': Frame,
    'market': Frame,
    'clan': Frame,
    'mail': Frame,
    'notes': Frame,
    'settings': Frame,
    'support': Frame,
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
        id: 'support',
        text: 'Support',
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

