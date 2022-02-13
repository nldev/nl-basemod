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

export interface Element<T = any> {
  name: string
  ref: WoWAPI.Frame
  inner: WoWAPI.Frame
  parent: WoWAPI.Frame
  state: T
}

// app
export const Get: () => App = () => _G['app']

export class App {
  protected isLoaded: boolean = false
  protected isInit: boolean = false

  public root: WoWAPI.Frame
  // public playerInfo: PlayerInfo
  public playerInfo: any
  public frames: Mapping<WoWAPI.Frame>

  constructor (protected onInit: ($: App) => void) {
    this.root = CreateFrame('Frame')

    this.root.SetScript('OnUpdate', () => this.start())
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

        return this.onInit(this)
      }
    }
  }
}

// mods
export type Mod = (frame: WoWAPI.Frame) => WoWAPI.Frame

export type Use<O = any> = (o: O) => Mod

// component
export type ComponentOptions = {
  name: string
  parent?: WoWAPI.Frame
  mod?: Mod | Mod[]
  inherits?: string
  type?: WoWAPI.FrameType
}

export type Component<O extends ComponentOptions = ComponentOptions> =
  (options: O) => WoWAPI.Frame

// root
export const Root = () => {
  const app = _G['app']
  const frame = app.frames['root']
    || CreateFrame('Frame', 'root', UIParent)

  frame.SetScale(1)
  frame.SetAllPoints(UIParent)

  app.frames['root'] = frame

  return frame
}

// frame
export const Frame: Component = options => {
  const app = Get()

  const frame: WoWAPI.Frame = app.frames[options.name]
    || CreateFrame(options.type || 'Frame', options.name, options.parent || UIParent, options.inherits) as any

  app.frames[options.name] = frame

  if (typeof options.mod === 'function') {
    options.mod(frame)
  } else if (options.mod) {
    options.mod.forEach(fn => {
      fn(frame)
    })
  }

  if (options.parent)
    frame.SetParent(options.parent)

  return frame
}

// scroll
export interface ScrollOptions extends ComponentOptions {
  scrollHeight?: number
}

export const Scroll: Component<ScrollOptions> = options => {
  const frame = Frame(options)

  frame.SetAllPoints(frame.GetParent() as WoWAPI.Frame)

  frame.SetSize(options.parent.GetWidth(), options.parent.GetHeight()) // FIXME

  const app = Get()

  app.frames[options.name] = frame

  const scrollframe = Frame({
    name: `${options.name}-scrollframe`,
    inherits: 'UIPanelScrollFrameTemplate',
    type: 'ScrollFrame',
    parent: frame,
  }) as WoWAPI.ScrollFrame

  const scrollchild = Frame({
    name: `${options.name}-scrollchild`,
  })

  const scrollbarName = scrollframe.GetName()

  const scrollbar = _G[scrollbarName + 'ScrollBar']
  const scrollupbutton = _G[scrollbarName + 'ScrollBarScrollUpButton']
  const scrolldownbutton = _G[scrollbarName + 'ScrollBarScrollDownButton']

  scrollupbutton.ClearAllPoints()
  scrollupbutton.SetPoint('TOPRIGHT', scrollframe, 'TOPRIGHT', -2, -2)

  scrolldownbutton.ClearAllPoints()
  scrolldownbutton.SetPoint('BOTTOMRIGHT', scrollframe, 'BOTTOMRIGHT', -2, 2)

  scrollbar.ClearAllPoints()
  scrollbar.SetPoint('TOP', scrollupbutton, 'BOTTOM', 0, -2)
  scrollbar.SetPoint('BOTTOM', scrolldownbutton, 'TOP', 0, 2)

  // frame.SetSize(frame.GetWidth() * 0.667, frame.GetHeight() * 0.667)
  frame.SetPoint('CENTER')

  scrollframe.SetScrollChild(scrollchild)
  scrollframe.SetAllPoints(frame)

  scrollchild.SetSize(scrollframe.GetWidth(), options.scrollHeight || (scrollframe.GetHeight() * 2))

  const moduleoptions = CreateFrame('Frame', 'moduleoptions', scrollchild)
  moduleoptions.SetAllPoints(scrollchild)

  // scrollframe.SetScale(0.667)
  // moduleoptions.SetFrameLevel(2)

  return frame
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

  a.EnableMouse(true)
  a.SetMovable(true)
  a.RegisterForDrag('RightButton')
  a.SetScript('OnDragStart', f => f.StartMoving())
  a.SetScript('OnDragStop', f => f.StopMovingOrSizing())

  a.SetScript('OnMouseDown', (_, button) => {
    if (button === 'LeftButton')
      console.log('left click')
  })

  a.SetPoint('CENTER')
  a.SetSize(500, 500)
  a.SetBackdrop(BASE_BACKDROP)
  a.SetBackdropColor(0, 0, 0, 1)

  const b = Frame({
    name: 'b',
    parent: a,
  })

  b.SetSize(a.GetWidth() - 60, a.GetHeight() - 60)
  b.SetPoint('CENTER')

  const scroll = Scroll({
    name: 'scroll',
    parent: b,
  })
})

