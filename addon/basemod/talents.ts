import * as TALENTS from '../data/talents'
import { Movable, rgb } from './utils'
import { Frame, Component, ComponentOptions, Element } from './app'
import { BASE_BACKDROP, RESPONSES, REQUESTS } from './constants'
import { Get } from './app'
import { Grid } from './components/grid'
import { Scroll } from './components/scroll'

export interface ClassSelection {
  WARRIOR: boolean,
  ROGUE: boolean,
  DRUID: boolean,
  MAGE: boolean,
  WARLOCK: boolean,
  SHAMAN: boolean,
  PRIEST: boolean,
  PALADIN: boolean,
  HUNTER: boolean,
}

export interface RaceSelection {
  HUMAN: boolean,
  ORC: boolean,
  DWARF: boolean,
  NIGHT_ELF: boolean,
  UNDEAD: boolean,
  TAUREN: boolean,
  GNOME: boolean,
  TROLL: boolean,
  BLOOD_ELF: boolean,
  DRAENEI: boolean,
}

// talents
export interface TalentSpell {
  name: string
  id: string
  spellId: number
  icon: string
  cost: number
  class: ClassSelection
  classmask: number
}

export interface TalentOptions extends ComponentOptions {
  spell: TalentSpell
  onActivate?: () => void
  onDeactivate?: () => void
}

export interface TalentState {
  isActive: boolean
  isHover: boolean
}

export interface TalentFns {
  requestActivate: () => void
  requestDeactivate: () => void
  activate: () => void
  deactivate: () => void
  toggle: () => void
  // Show
  // Hide
}

export const Talent: Component<TalentOptions, TalentState, TalentFns> = options => {
  const app = Get()

  // frame
  const frame: Element<TalentState, TalentFns> =
    Frame({ name: `talent-${options.spell.id}` }) as any

  frame.ref.SetSize(40, 40)

  // cost
  const cost = Frame({ name: `talent-${options.spell.id}-cost`, parent: frame })

  cost.ref.SetSize(43, 20)
  cost.ref.SetPoint('BOTTOM', 0, -20)
  cost.ref.SetBackdrop(BASE_BACKDROP)
  cost.ref.SetBackdropColor(0, 0, 0, 1)

  const costText = frame.ref.CreateFontString(
    `talent-${options.spell.id}-costtext`,
    'OVERLAY',
    'GameTooltipText',
  )
  costText.SetParent(cost.ref)
  costText.SetPoint('CENTER')
  costText.SetText(`${options.spell.cost}`)
  costText.SetFont('Fonts/FRIZQT__.TTF', 10)

  // active: blue
  // unactive - nohover: white
  // unactive - hover: green

  const setCostTextColor = () => {
    const [red, green, blue] = frame.state.isActive
      ? [1, 1, 1]
      : [0.75, 0.75, 0.75]

    costText.SetTextColor(red, green, blue)
  }

  // style
  frame.ref.SetBackdrop({
    // bgFile: 'Interface/Tooltips/UI-Tooltip-Background',
    edgeFile: 'Interface/Tooltips/UI-Tooltip-Border',
    tile: true,
    tileSize: 16,
    insets: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
  })

  frame.ref.SetBackdropColor(0, 0, 0, 1)

  const texture = frame.ref.CreateTexture()

  texture.SetTexture(options.spell.icon)
  texture.SetAllPoints()

  // mouse
  frame.ref.EnableMouse(true)

  // can afford
  const CanAfford = () => {
    const remainder = app.talentInfo.max - app.talentInfo.used
    return options.spell.cost <= remainder
  }

  // onClick
  frame.inner.SetScript('OnMouseDown', (_, button) => {
    const remainder = app.talentInfo.max - app.talentInfo.used
    if (button === 'LeftButton' && !frame.state.isActive && (CanAfford()))
      frame.fns.requestActivate()

    if (button === 'RightButton' && frame.state.isActive)
      frame.fns.requestDeactivate()
  })

  // tooltip
  const drawTooltip = (isOverride?: boolean) => {
    if (frame.state.isHover && GetMouseFocus().GetName() === frame.ref.GetName()) {

      GameTooltip.ClearLines()
      GameTooltip.SetOwner(UIParent, 'ANCHOR_CURSOR')
      GameTooltip.SetHyperlink(`spell:${options.spell.spellId}`)
      if (!frame.state.isActive) {
        const [red, green, blue] = rgb(102, 217, 239)
        GameTooltip.AddDoubleLine('Cost: ', `${options.spell.cost}`, red, green, blue, 1, 1, 1)
        if (CanAfford() || isOverride) {
          GameTooltip.AddLine('Left click to learn', ...rgb(253, 151, 31))
        } else {
          GameTooltip.AddLine('Insufficient talent points', ...rgb(249, 38, 114))
        }
      } else {
        GameTooltip.AddLine('Learned', ...rgb(166, 226, 46))
        GameTooltip.AddLine('Right click to remove', ...rgb(102, 217, 239))
      }
      GameTooltip.Show()
    }
  }

  const clearTooltip = () => {
    GameTooltip.ClearLines()
    GameTooltip.Hide()
  }

  frame.ref.SetScript('OnEnter', () => {
    const remainder = app.talentInfo.max - app.talentInfo.used
    if (options.spell.cost <= remainder)
      SetDesaturation(texture, false)
    frame.state.isHover = true
    drawTooltip()
  })

  frame.ref.SetScript('OnLeave', () => {
    if (!frame.state.isActive)
      SetDesaturation(texture, true)
    frame.state.isHover = true
    clearTooltip()
  })

  // export
  frame.state = {
    isHover: false,
    isActive: false,
  }

  frame.fns = {
    requestActivate: () => {
      if (!frame.state.isActive)
        SendAddonMessage(REQUESTS.LEARN_TALENT, options.spell.id, 'WHISPER', app.playerInfo.name)
    },
    requestDeactivate: () => {
      if (frame.state.isActive)
       SendAddonMessage(REQUESTS.UNLEARN_TALENT, options.spell.id, 'WHISPER', app.playerInfo.name)
    },
    activate: () => {
      frame.state.isActive = true
      setCostTextColor()
      SetDesaturation(texture, false)
      if (options.onActivate)
        options.onActivate()
      drawTooltip()
    },
    deactivate: () => {
      frame.state.isActive = false
      setCostTextColor()
      SetDesaturation(texture, true)
      if (options.onDeactivate)
        options.onDeactivate()
      drawTooltip(true)
    },
    toggle: () => {
      frame.state.isActive
        ? frame.fns.deactivate()
        : frame.fns.activate()
    },
  }

  frame.state.isActive = false
  drawTooltip()
  setCostTextColor()
  SetDesaturation(texture, true)

  return frame
}
export const Talents: Component = options => {
  const app = Get()
  const a = Frame({
    name: 'talents',
  })

  a.ref.SetSize(350, 420)
  a.ref.SetPoint('CENTER')

  const b = Frame({
    name: 'b',
    parent: a,
  })

  b.inner.SetSize(a.inner.GetWidth() - 60, a.inner.GetHeight() - 60)
  b.inner.SetPoint('CENTER')

  const scroll = Scroll({
    name: 'scroll',
    parent: b,
  })

  const grid = Grid({
    name: 'grid',
    itemsPerRow: 4,
    rowHeight: 80,
    parent: scroll,
  })

  grid.ref.SetAllPoints(scroll.inner)

  // counterText
  const counter = Frame({ name: 'talent-counter', parent: a })
  counter.ref.SetSize(80, 30)
  counter.ref.SetBackdrop(BASE_BACKDROP)
  counter.ref.SetBackdropColor(0, 0, 0, 1)
  counter.ref.SetPoint('BOTTOMLEFT', 5, -27)
  const counterText = b.ref.CreateFontString(
    'talent-countertext',
    'OVERLAY',
    'GameTooltipText',
  )
  counterText.SetParent(counter.ref)
  counterText.SetPoint('CENTER')
  counterText.SetText(`${app.talentInfo.max - app.talentInfo.used} / ${app.talentInfo.max}`)
  counterText.SetFont('Fonts/FRIZQT__.TTF', 10)
  // costText.SetTextColor(red, green, blue)

  // create talent buttons
  const list: Element<TalentState, TalentFns>[] = []

  const talents: TalentSpell[] = [
    ...Object.keys(TALENTS).map(key => TALENTS[key])
  ].sort((a, b) => {
    if (a.cost > b.cost)
      return -1
    if (a.cost < b.cost)
      return 1
    return 0
  })

  talents.forEach(spell => {
    if (spell.class[app.playerInfo.chrClass]) {
      const talent = Talent({
        spell,
        onActivate: () => {
          // console.log(`${spell.id} activated`)
        },
        onDeactivate: () => {
          // console.log(`${spell.id} deactivated`)
        },
      })

      list.push(talent)
      grid.fns.Attach(talent)
    }
  })

  // reset button
  const button = CreateFrame('Button', 'talent-reset-button', a.ref, 'UIPanelButtonTemplate')

  button.SetText('Reset')
  button.EnableMouse(true)
  button.SetSize(90, 30)
  button.SetPoint('BOTTOMRIGHT', -5, -26)
  button.SetFrameStrata('HIGH')
  button.SetScript(('OnClick'), () => {
    SendAddonMessage('reset-talents-request', '', 'WHISPER', name)
  }
  )
  button.Enable()

  // event handlers
  const { name, level, chrRace, chrClass } = app.playerInfo

  Events.ChatInfo.OnChatMsgAddon(app.root.ref, (prefix, text) => {
    if (prefix !== RESPONSES.GET_TALENT_INFO_SUCCESS)
      return
    if (!text)
      return
    const [a, b] = text.split(' ')
    const used = Number(a)
    const max = Number(b)
    if (used && max) {
      app.talentInfo.isEnabled = true
      app.talentInfo.used = used
      app.talentInfo.max = max
      counterText.SetText(`${app.talentInfo.max - app.talentInfo.used} / ${app.talentInfo.max}`)
    }
  })

  Events.ChatInfo.OnChatMsgAddon(app.root.ref, (prefix, talentId) => {
    if (prefix !== RESPONSES.LEARN_TALENT_SUCCESS)
      return
    if (!talentId)
      return
    const ele = app.elements[`talent-${talentId}`] as Element<TalentState, TalentFns>
    if (ele && !ele.state.isActive)
      ele.fns.activate()
  })

  Events.ChatInfo.OnChatMsgAddon(app.root.ref, (prefix, talentId) => {
    if (prefix !== RESPONSES.UNLEARN_TALENT_SUCCESS)
      return
    if (!talentId)
      return
    const ele = app.elements[`talent-${talentId}`] as Element<TalentState, TalentFns>
    if (ele && ele.state.isActive)
      ele.fns.deactivate()
  })

  Events.ChatInfo.OnChatMsgAddon(app.root.ref, (prefix, text) => {
    if (prefix !== RESPONSES.GM.SET_TALENT_POINTS_SUCCESS)
      return
    if (!text)
      return
  })

  Events.ChatInfo.OnChatMsgAddon(app.root.ref, (prefix, text) => {
    if (prefix !== 'reset-talents-success')
      return
    list.forEach(e => e.fns.deactivate())
  })

  SendAddonMessage(REQUESTS.GET_TALENT_INFO, '', 'WHISPER', name)

  Events.ChatInfo.OnChatMsgSay(app.root.ref, (text, player) => {
    if (player.toLowerCase() !== name)
      return
    if (text.indexOf('@talents ') === 0) {
      const amount = text.replace('@talents ', '')
      SendAddonMessage(REQUESTS.GM.SET_TALENT_POINTS, amount, 'WHISPER', name)
    }
  })

  return a
}
