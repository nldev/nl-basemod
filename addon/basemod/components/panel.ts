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
import { Counter } from './counter'
import { Textarea } from './textarea'
import { Input } from './input'
import { Grid } from './grid'

export const DevTools: Component = options => {
  const f = Frame({ name: 'devtools', ...options })
  f.ref.SetSize(290, 360)
  f.ref.SetPoint('CENTER')

  const scroll = Scroll({ name: 'devtools-scroll', parent: f, height: 300 })

  const a = Section({
    name: 'set-level',
    title: 'Set Level',
    parent: scroll,
    height: 50,
  })

  const b = Section({
    name: 'tools',
    title: 'Utilities',
    parent: scroll,
    previous: a,
    height: 160,
  })

  const c = Section({
    name: 'c-sect',
    title: 'Notes',
    parent: scroll,
    previous: b,
    height: 150,
  })

  // set level
  const onLevelAccept = (num: number) => {
    if (num !== UnitLevel('player'))
    SendChatMessage(`.char level ${num}`)
  }
  const level = Counter({
    name: 'set-level-counter',
    parent: a,
    initial: UnitLevel('player'),
    min: 1,
    max: 99,
    onAccept: n => onLevelAccept(n),
    onCancel: () => {},
  })
  level.ref.RegisterEvent('PLAYER_LEVEL_UP')
  level.ref.SetPoint('TOPLEFT')

  // utils
  const grid = Grid({ name: 'devtools-utils-grid', parent: b, rowHeight: 35, itemsPerRow: 2 })
  grid.ref.SetSize(b.inner.GetWidth(), b.inner.GetHeight())
  grid.ref.SetPoint('TOPLEFT', -2, 0)

  // recall
  const recall = Button({
    name: 'devtools-recall',
    text: 'Recall',
    width: 130,
    onClick: () => {
    },
  })
  grid.fns.Attach(recall)

  // reset bags
  const clearInventory = Button({
    name: 'devtools-clear-inventory',
    text: 'Clear Inventory',
    width: 130,
    onClick: () => {
      SendAddonMessage('dev-clear-inventory', '', 'WHISPER', Get().playerInfo.name)
    },
  })
  grid.fns.Attach(clearInventory)

  // revive
  const revive = Button({
    name: 'devtools-revive',
    text: 'Revive',
    width: 130,
    onClick: () => {
      // SendAddonMessage('dev-clear-inventory', '', 'WHISPER', Get().playerInfo.name)
      SendChatMessage(`.revive`)
    },
  })
  grid.fns.Attach(revive)

  // full power
  const fullPower = Button({
    name: 'devtools-full-power',
    text: 'Full HP / MP',
    width: 130,
    onClick: () => {
      // SendAddonMessage('dev-clear-inventory', '', 'WHISPER', Get().playerInfo.name)
      SendChatMessage(`.revive`)
    },
  })
  grid.fns.Attach(fullPower)

  // reset cooldowns
  const resetCooldowns = Button({
    name: 'devtools-reset-cooldowns',
    text: 'Reset Cooldowns',
    width: 130,
    onClick: () => {
      // SendAddonMessage('dev-clear-inventory', '', 'WHISPER', Get().playerInfo.name)
      SendChatMessage(`.cooldown`)
    },
  })
  grid.fns.Attach(resetCooldowns)

  // flight
  const flight = Button({
    name: 'devtools-toggle-flight',
    text: 'Flight On',
    width: 130,
    onClick: () => {
    },
  })
  grid.fns.Attach(flight)

  // speed
  const speed = Button({
    name: 'devtools-toggle-speed',
    text: 'Speed On',
    width: 130,
    onClick: () => {
    },
  })
  grid.fns.Attach(speed)

  // god mode
  const godMode = Button({
    name: 'devtools-toggle-god-mode',
    text: 'God Mode On',
    width: 130,
    onClick: () => {
    },
  })
  grid.fns.Attach(godMode)

  // note
  const $ = Get()
  const note = Textarea({
    name: 'devtools-note',
    parent: c,
    initial: $.store.Get('CHARACTER', 'devtools-note'),
    onAccept: note => {
      console.log(note)
      $.store.Set('CHARACTER', 'devtools-note', note)
    },
  })
  note.ref.SetPoint('TOPLEFT')

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
    'feedback': Frame,
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

