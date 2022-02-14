// constants
export const BASE_BACKDROP = {
  bgFile: 'Interface/Tooltips/UI-Tooltip-Background',
  edgeFile: 'Interface/Tooltips/UI-Tooltip-Border',
  tile: true, tileSize: 16, edgeSize: 16,
  insets: { left: 4, right: 4, top: 4, bottom: 4 },
}

export const BASE_COLORS = [0, 0, 0, 1]

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
export interface Element<S = any, M = any> {
  name: string
  ref: WoWAPI.Frame
  inner: WoWAPI.Frame
  parent: Element
  state: S
  methods: M
}

export type ComponentOptions = {
  name: string
  parent?: Element
  mod?: Mod | Mod[]
  inherits?: string
  type?: WoWAPI.FrameType
  state?: Mapping
  methods?: Mapping
}

export type Component<O extends ComponentOptions = ComponentOptions, T = any> =
  (options: O) => Element<T>

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
    methods: {},
  }
}

// frame
export const Frame: Component = options => {
  const app = Get()

  const parent = options.parent
  const frame: WoWAPI.Frame = app.frames[options.name]
    || CreateFrame(options.type || 'Frame', options.name, parent ? parent.inner : app.root.ref, (options.inherits)) as WoWAPI.Frame

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
    state: options.state,
    methods: options.methods,
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
  moduleoptions.SetAllPoints(scrollchild)

  return a
}

// grid
export interface GridOptions extends ComponentOptions {
  itemsPerRow: number
  rowHeight: number
}

export interface GridItemOptions extends ComponentOptions {
  item: Element
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

export const GridItemElement: Component<GridItemOptions> = options => {
  const frame = Frame({ name: options.name })

  return frame
}

export const GridElement: Component<GridOptions, GridState> = options => {
  const frame = Frame(options)

  frame.state = {
    itemsPerRow: options.itemsPerRow,
    rowHeight: options.rowHeight,
    itemWidth: frame.ref.GetWidth() / options.itemsPerRow,
    list: [],
    index: 0,
    x: 0,
    y: 0,
  }

  return frame
  // protected list: GridItemElement[] = []
  // protected index: number = 0
  // protected x: number = 0
  // protected y: number = 0
  // protected itemsPerRow: number = 3

  // protected itemWidth: number = 0
  // protected rowHeight: number = 0

  // protected onInit () {
  //   this.itemsPerRow = this.options.itemsPerRow
  //   this.rowHeight = this.options.rowHeight || 100
  //   this.itemWidth = this.ref.GetWidth() / this.itemsPerRow
  // }

  // public _Attach (child: Element) {
  //   if (!this.itemWidth)
  //     return

  //   const isEndOfRow = this.index === ((this.itemsPerRow || 3) - 1)

  //   const element = new GridItemElement(Unique(`${this.id}-griditem`), {
  //     item: child,
  //     box: {
  //       type: 'BOX_POINT',
  //       point: 'TOPLEFT',
  //       width: this.itemWidth,
  //       height: this.rowHeight,
  //       x: this.x,
  //       y: this.y,
  //     }
  //     // z: (this.z || 0) + 1,
  //     // strata: this.strata,
  //     // size: {
  //     //   height: this.rowHeight,
  //     //   width: this.itemWidth,
  //     // },
  //   })

  //   element.ref.SetParent(this.ref)
  //   element.Box()

  //   // const ref = item.inner || item.ref

  //   // item.ref.SetFrameStrata(this.strata)
  //   // item.ref.SetFrameLevel(this.z)

  //   // if (item.inner) {
  //   //   item.ref.SetFrameStrata(this.strata)
  //   //   item.ref.SetFrameLevel(this.z)
  //   // }

  //   // ref.SetFrameStrata(this.strata)
  //   // ref.SetFrameLevel(this.z)

  //   if (isEndOfRow) {
  //     this.index = 0
  //     this.x = 0
  //     this.y -= (this.rowHeight * 2)
  //   } else {
  //     this.index++
  //     this.x += this.itemWidth
  //   }

  //   this.list.push(element)
  // }

  // onShow () {
  //   this.list.forEach(item => item.Show(true))
  // }

  // onHide () {
  //   this.list.forEach(item => item.Hide(true))
  // }
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
  a.inner.SetSize(500, 500)
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

  const { name, level, chrRace, chrClass } = app.playerInfo

  console.log(`${name} ${level} ${chrRace} ${chrClass}`)
})

