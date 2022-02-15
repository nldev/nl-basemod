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

// constants
export const BASE_BACKDROP = {
  bgFile: 'Interface/Tooltips/UI-Tooltip-Background',
  edgeFile: 'Interface/Tooltips/UI-Tooltip-Border',
  tile: true, tileSize: 16, edgeSize: 16,
  insets: { left: 4, right: 4, top: 4, bottom: 4 },
}

export const BASE_COLORS = [0, 0, 0, 1]

export const SCROLL_WIDTH = 20

// types
export interface Mapping<T = any> {
  [key: string]: T
}

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

export interface PlayerInfo {
  name: string
  chrRace: string
  chrClass: string
  level: number
}

// app
export const Get: () => App = () => _G['app']

export class App {
  protected isLoaded: boolean = false
  protected isInit: boolean = false

  public root: Element
  public playerInfo: PlayerInfo
  public frames: Mapping<WoWAPI.Frame> = {}

  constructor (protected onInit: ($: App) => void) {
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
  name: string
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

// test
const SAMPLE_DATA = {
  name: 'Shadowstep',
  id: 36554,
  icon: 'Interface/Icons/Ability_Rogue_Shadowstep',
}

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

  const c = Frame({ name: 'c' })
  c.ref.SetBackdrop({
    ...BASE_BACKDROP,
    bgFile: SAMPLE_DATA.icon,
  })
  c.ref.SetBackdropColor(0, 1, 0, 1)
  c.ref.SetSize(50, 50)

  const d = Frame({ name: 'd' })
  d.ref.SetBackdrop(BASE_BACKDROP)
  d.ref.SetBackdropColor(0, 1, 0, 1)
  d.ref.SetSize(50, 50)

  const e = Frame({ name: 'e' })
  e.ref.SetBackdrop(BASE_BACKDROP)
  e.ref.SetBackdropColor(0, 1, 0, 1)
  e.ref.SetSize(50, 50)

  const f = Frame({ name: 'f' })
  f.ref.SetBackdrop(BASE_BACKDROP)
  f.ref.SetBackdropColor(0, 1, 0, 1)
  f.ref.SetSize(50, 50)

  const g = Frame({ name: 'g' })
  g.ref.SetBackdrop(BASE_BACKDROP)
  g.ref.SetBackdropColor(0, 1, 0, 1)
  g.ref.SetSize(50, 50)

  grid.fns.Attach(c)
  grid.fns.Attach(d)
  grid.fns.Attach(e)
  grid.fns.Attach(f)
  grid.fns.Attach(g)

  const { name, level, chrRace, chrClass } = app.playerInfo

  console.log(`${name} ${level} ${chrRace} ${chrClass}`)
})

