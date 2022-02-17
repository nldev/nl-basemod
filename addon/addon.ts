import * as TALENTS from './data/talents'

// utils
const names = {}

export function Unique (id: string) {
  const _id = names[id] ? names[id] : 0

  if (_id === 0) {
    names[id] = 0
  }

  names[id]++

  return `${id}-${_id}`
}

export function rgb (red: number, green: number, blue: number): Rgb {
  return [red / 255, green / 255, blue / 255]
}

// constants
export const BASE_BACKDROP = {
  bgFile: 'Interface/Tooltips/UI-Tooltip-Background',
  edgeFile: 'Interface/Tooltips/UI-Tooltip-Border',
  tile: true,
  tileSize: 16,
  edgeSize: 16,
  insets: {
    left: 4,
    right: 4,
    top: 4,
    bottom: 4,
  },
}

export const BASE_COLORS = [0, 0, 0, 1]

export const SCROLL_WIDTH = 20

// types
export interface Mapping<T = any> {
  [key: string]: T
}

export type Rgb = [number, number, number]

export const ROOT = 'ROOT'

export const HUMAN = 'HUMAN'
export const ORC = 'ORC'
export const DWARF = 'DWARF'
export const NIGHT_ELF = 'NIGHT_ELF'
export const UNDEAD = 'UNDEAD'
export const TAUREN = 'TAUREN'
export const GNOME = 'GNOME'
export const TROLL = 'TROLL'
export const BLOOD_ELF = 'BLOOD_ELF'
export const DRAENEI = 'DRAENEI'

export const WARRIOR = 'WARRIOR'
export const ROGUE = 'ROGUE'
export const DRUID = 'DRUID'
export const MAGE = 'MAGE'
export const WARLOCK = 'WARLOCK'
export const SHAMAN = 'SHAMAN'
export const PRIEST = 'PRIEST'
export const PALADIN = 'PALADIN'
export const HUNTER = 'HUNTER'

export type CharacterClass =
  | typeof WARRIOR
  | typeof ROGUE
  | typeof DRUID
  | typeof MAGE
  | typeof WARLOCK
  | typeof SHAMAN
  | typeof PRIEST
  | typeof PALADIN
  | typeof HUNTER

export type CharacterRace =
  | typeof HUMAN
  | typeof ORC
  | typeof DWARF
  | typeof NIGHT_ELF
  | typeof UNDEAD
  | typeof TAUREN
  | typeof GNOME
  | typeof TROLL
  | typeof BLOOD_ELF
  | typeof DRAENEI

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

export interface PlayerInfo {
  name: string
  chrRace: string
  chrClass: string
  level: number
}

export interface TalentInfo {
  isEnabled: boolean
  total: number
  remaining: number
  active: Mapping<boolean>
}

// app
export const Get: () => App = () => _G['app']

export class App {
  protected isLoaded: boolean = false
  protected isInit: boolean = false

  public root: Element
  public playerInfo: PlayerInfo
  public talentInfo: TalentInfo
  public frames: Mapping<WoWAPI.Frame> = {}

  constructor (protected onInit: ($: App) => void) {
    this.talentInfo = {
      isEnabled: false,
      total: 50,
      remaining: 50,
      active: {},
    }

    const root = CreateFrame('Frame', ROOT, UIParent)

    root.SetScript('OnUpdate', () => {
      if (!this.isLoaded)
        this.start(root)
    })
  }

  protected start (root: WoWAPI.Frame) {
    if (this.playerInfo)
      return

    const player = UnitGUID('player')

    if (player) {
      const info = GetPlayerInfoByGUID(player)

      if (info[0]) {
        this.playerInfo = {
          name: info[5].toLowerCase(),
          chrRace: info[2].toUpperCase() as CharacterRace,
          chrClass: info[0].toUpperCase() as CharacterClass,
          level: info[4],
        }

        _G['app'] = this

        this.root = Root(root)
        this.isLoaded = true

        return this.onInit(this)
      }
    }
  }
}

// mods
export type Mod = (frame: WoWAPI.Frame) => WoWAPI.Frame

export type Use<O = any> = (o: O) => Mod

// component
export type ElementFn = (element: Element<any, any>) => void

export interface Element<S = Mapping, F = Mapping<ElementFn>> {
  name: string
  ref: WoWAPI.Frame
  inner: WoWAPI.Frame
  parent: Element<any, any>
  state: S
  fns: F
}

export type ComponentOptions = {
  name?: string
  parent?: Element<any, any>
  mod?: Mod | Mod[]
  inherits?: string
  type?: WoWAPI.FrameType
  state?: Mapping
  fns?: Mapping<ElementFn>
}

export type Component<
  O extends ComponentOptions = ComponentOptions,
  S = Mapping,
  F = Mapping<ElementFn>,
> = (options: O) => Element<S, F>

// root
export const Root = (ref?: WoWAPI.Frame) => {
  const app = _G['app']
  const frame = app.frames[ROOT]
    || ref

  frame.SetAllPoints(UIParent)

  app.frames[ROOT] = frame

  return {
    name: ROOT,
    ref: frame,
    inner: frame,
    parent: null as Element,
    state: {},
    fns: {},
  }
}

// frame
export const Frame: Component = options => {
  if (!options.name)
    throw new Error('Frame requires a name')

  const app = Get()

  const parent = options.parent
  const frame: WoWAPI.Frame = app.frames[options.name]
    || CreateFrame(options.type || 'Frame', options.name, parent ? parent.inner : app.root.ref, options.inherits) as WoWAPI.Frame

  app.frames[options.name] = frame

  if (typeof options.mod === 'function') {
    options.mod(frame)
  } else if (options.mod) {
    options.mod.forEach(fn => {
      fn(frame)
    })
  }

  if (options.parent)
    frame.SetParent(options.parent.inner)

  return {
    parent,
    name: options.name,
    ref: frame,
    inner: frame,
    state: options.state || {},
    fns: options.fns || {},
  }
}

// scroll
export interface ScrollOptions extends ComponentOptions {
  scrollHeight?: number
}

export const Scroll: Component<ScrollOptions> = options => {
  const a = Frame(options)
  const frame = a.inner

  frame.SetAllPoints(frame.GetParent() as WoWAPI.Frame)

  const app = Get()

  app.frames[options.name] = frame

  const scrollframe = Frame({
    name: `${options.name}-scrollframe`,
    inherits: 'UIPanelScrollFrameTemplate',
    type: 'ScrollFrame',
    parent: a,
  })

  const ref = scrollframe.ref as WoWAPI.ScrollFrame

  const scrollchild = Frame({
    name: `${options.name}-scrollchild`,
    parent: scrollframe,
  }).ref

  const scrollbarName = ref.GetName()

  const scrollbar = _G[scrollbarName + 'ScrollBar']
  const scrollupbutton = _G[scrollbarName + 'ScrollBarScrollUpButton']
  const scrolldownbutton = _G[scrollbarName + 'ScrollBarScrollDownButton']

  scrollupbutton.ClearAllPoints()
  scrollupbutton.SetPoint('TOPRIGHT', scrollframe.ref, 'TOPRIGHT', -2, -2)

  scrolldownbutton.ClearAllPoints()
  scrolldownbutton.SetPoint('BOTTOMRIGHT', scrollframe.ref, 'BOTTOMRIGHT', -2, 2)

  scrollbar.ClearAllPoints()
  scrollbar.SetPoint('TOP', scrollupbutton, 'BOTTOM', 0, -2)
  scrollbar.SetPoint('BOTTOM', scrolldownbutton, 'TOP', 0, 2)

  // frame.SetSize(frame.GetWidth() * 0.667, frame.GetHeight() * 0.667)
  frame.SetPoint('CENTER')

  ref.SetScrollChild(scrollchild)
  ref.SetAllPoints(frame)

  scrollchild.SetSize(ref.GetWidth(), options.scrollHeight || ref.GetHeight() * 2)

  const moduleoptions = CreateFrame('Frame', 'moduleoptions', scrollchild)

  moduleoptions.SetPoint('TOPLEFT')
  moduleoptions.SetWidth(scrollchild.GetWidth() - SCROLL_WIDTH)
  moduleoptions.SetHeight(scrollchild.GetHeight())

  a.inner = moduleoptions

  return a
}

// grid
export interface GridOptions extends ComponentOptions {
  itemsPerRow: number
  rowHeight: number
}

export interface GridItemOptions extends ComponentOptions {
  item: Element
  width: number
  height: number
  x: number
  y: number
}

export interface GridState {
  itemsPerRow: number
  rowHeight: number
  itemWidth: number
  list: Element[]
  index: number
  x: number
  y: number
}

export interface GridFns {
  Attach: ElementFn
  // Show
  // Hide
}

export const GridItem: Component<GridItemOptions> = options => {
  const frame = Frame(options)

  frame.ref.SetPoint('TOPLEFT', options.x, options.y)
  frame.ref.SetSize(options.width, options.height)

  options.item.ref.SetParent(frame.ref)
  options.item.ref.SetPoint('CENTER')

  return frame
}

export const Grid: Component<GridOptions, GridState, GridFns> = options => {
  const frame: Element<GridState, GridFns>  = Frame(options) as any

  frame.state.itemsPerRow = options.itemsPerRow
  frame.state.rowHeight = options.rowHeight
  frame.state.itemWidth = frame.parent.inner.GetWidth() / options.itemsPerRow
  frame.state.list = []
  frame.state.index = 0
  frame.state.x = 0
  frame.state.y = 0

  frame.fns.Attach = child => {
    const isEndOfRow = frame.state.index === ((frame.state.itemsPerRow || 3) - 1)

    const element = GridItem({
      parent: frame,
      name: Unique(`${options.name}-griditem`),
      item: child,
      width: frame.state.itemWidth,
      height: frame.state.rowHeight,
      x: frame.state.x,
      y: frame.state.y,
    })

    if (isEndOfRow) {
      frame.state.index = 0
      frame.state.x = 0
      frame.state.y -= frame.state.rowHeight
    } else {
      frame.state.index++
      frame.state.x += frame.state.itemWidth
    }

    frame.state.list.push(element)
  }

  // onShow () {
  //   this.list.forEach(item => item.Show(true))
  // }

  // onHide () {
  //   this.list.forEach(item => item.Hide(true))
  // }

  return frame
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
  activate: () => void
  deactivate: () => void
  toggle: () => void
  // Show
  // Hide
}

export const Talent: Component<TalentOptions, TalentState, TalentFns> = options => {
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

  // onClick
  frame.inner.SetScript('OnMouseDown', (_, button) => {
    if (button === 'LeftButton' && !frame.state.isActive)
      frame.fns.activate()

    if (button === 'RightButton' && frame.state.isActive)
      frame.fns.deactivate()
  })

  // tooltip
  const drawTooltip = () => {
    if (frame.state.isHover) {
      GameTooltip.ClearLines()
      GameTooltip.SetOwner(UIParent, 'ANCHOR_CURSOR')
      GameTooltip.SetHyperlink(`spell:${options.spell.spellId}`)
      if (!frame.state.isActive) {
        const [red, green, blue] = rgb(102, 217, 239)
        GameTooltip.AddDoubleLine('Cost: ', `${options.spell.cost}`, red, green, blue, 1, 1, 1)
      } else {
        GameTooltip.AddLine('Learned', ...rgb(166, 226, 46))
      }
      GameTooltip.Show()
    }
  }

  const clearTooltip = () => {
    GameTooltip.ClearLines()
    GameTooltip.Hide()
  }

  frame.ref.SetScript('OnEnter', () => {
    if (options.spell.cost <= app.talentInfo.remaining)
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
    activate: () => {
      frame.state.isActive = true
      drawTooltip()
      setCostTextColor()
      SetDesaturation(texture, false)
      if (options.onActivate)
        options.onActivate()
    },
    deactivate: () => {
      frame.state.isActive = false
      drawTooltip()
      setCostTextColor()
      SetDesaturation(texture, true)
      if (options.onDeactivate)
        options.onDeactivate()
    },
    toggle: () => {
      frame.state.isActive
        ? frame.fns.deactivate()
        : frame.fns.activate()
    },
  }

  frame.fns.deactivate()

  return frame
}

// test
const app = new App(app => {
  const root = Root()

  const a = Frame({
    name: 'frame',
    parent: root,
  })

  a.inner.EnableMouse(true)
  a.inner.SetMovable(true)
  a.inner.RegisterForDrag('RightButton')
  a.inner.SetScript('OnDragStart', f => f.StartMoving())
  a.inner.SetScript('OnDragStop', f => f.StopMovingOrSizing())

  a.inner.SetScript('OnMouseDown', (_, button) => {
    if (button === 'LeftButton')
      console.log('left click')
  })

  a.inner.SetPoint('CENTER')
  a.inner.SetSize(400, 400)
  a.inner.SetBackdrop(BASE_BACKDROP)
  a.inner.SetBackdropColor(0, 0, 0, 1)

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

  const REQUESTS = {
    GET_TALENT_INFO: 'get-talent-info',
    LEARN_TALENT: 'learn-talent',
    UNLEARN_TALENT: 'unlearn-talent',
  }

  const RESPONSES = {
    GET_TALENT_INFO_SUCCESS: 'get-talent-info-success',
    LEARN_TALENT_SUCCESS: 'learn-talent-success',
    UNLEARN_TALENT_SUCCESS: 'unlearn-talent-success',
    LEARN_TALENT_FAIL: 'learn-talent-fail',
  }

  for (const key of Object.keys(TALENTS)) {
    const spell: TalentSpell = TALENTS[key]

    if (spell.class[app.playerInfo.chrClass]) {
      const talent = Talent({
        spell,
        onActivate: () => {
          // FIXME fire server event
          // app.talentInfo.active[spell.id] = true

          SendAddonMessage(REQUESTS.LEARN_TALENT, spell.id, 'WHISPER', name)
        },
        onDeactivate: () => {
          // FIXME fire server event
          // app.talentInfo.active[spell.id] = false
          SendAddonMessage(REQUESTS.UNLEARN_TALENT, spell.id, 'WHISPER', name)
        },
      })

      grid.fns.Attach(talent)
    }
  }

  const { name, level, chrRace, chrClass } = app.playerInfo

  // test
  Events.ChatInfo.OnChatMsgAddon(app.root.ref, (text, name, lang, channel, nameB, specialFlags, zoneChannelID, channelIndex, channelBaseName, unused, lineID, guid) => {
    console.log(text)
  })
  SendAddonMessage(REQUESTS.GET_TALENT_INFO, '', 'WHISPER', name)
})


