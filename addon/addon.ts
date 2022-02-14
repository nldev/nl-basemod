// import { CharacterClass, CharacterRace, Component, Mapping, PlayerInfo } from './types'
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

// app
export const Get: () => App = () => _G['app']

export class App {
  protected isLoaded: boolean = false
  protected isInit: boolean = false

  public root: Element
  // public playerInfo: PlayerInfo
  public playerInfo: any
  public frames: Mapping<WoWAPI.Frame> = {}

  constructor (protected onInit: ($: App) => void) {

    this.root.ref.SetScript('OnUpdate', () => this.start())
  }

  protected start () {
    if (this.playerInfo)
      return

    const player = UnitGUID('player')

    if (player) {
      const info = GetPlayerInfoByGUID(player)

      if (info[0]) {
        this.playerInfo = {
          name: info[5].toLowerCase(),
          // chrRace: info[2].toUpperCase() as CharacterRace,
          // chrClass: info[0].toUpperCase() as CharacterClass,
          chrRace: info[2].toUpperCase(),
          chrClass: info[0].toUpperCase(),
          level: info[4],
        }

        this.isLoaded = true

        _G['app'] = this

        this.root = Root()

        return this.onInit(this)
      }
    }
  }
}

// mods
export type Mod = (frame: WoWAPI.Frame) => WoWAPI.Frame

export type Use<O = any> = (o: O) => Mod

// component
export interface Element<T = any> {
  name: string
  ref: WoWAPI.Frame
  inner: WoWAPI.Frame
  parent: Element
  state: T
}

export type ComponentOptions = {
  name: string
  parent?: Element
  mod?: Mod | Mod[]
  inherits?: string
  type?: WoWAPI.FrameType
}

export type Component<O extends ComponentOptions = ComponentOptions, T = any> =
  (options: O) => Element<T>

// root
export const Root = () => {
  const app = _G['app']
  const frame = app.frames['root']
    || CreateFrame('Frame', 'root', UIParent)

  frame.SetAllPoints(UIParent)

  app.frames['root'] = frame

  return {
    name: 'root',
    ref: frame,
    inner: frame,
    parent: null as Element,
    state: {},
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
    state: {},
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

export const GridItemElement: Component<GridItemOptions> = options => {
  const frame = Frame({ name: options.name })

  return frame
}

export const GridElement: Component<GridOptions> = options => {
  const frame = Frame({ name: options.name })

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
})

