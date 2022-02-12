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
export const App = () => app

const app: App = {
  frames: {},
}

export interface App {
  frames: Mapping<WoWAPI.Frame>
}

// mods
export type Mod = (frame: WoWAPI.Frame) => WoWAPI.Frame

export type Use<O = any> = (o: O) => Mod

// a.EnableMouse(true)
// a.RegisterForDrag('RightButton')
// a.SetMovable(true)
// a.SetScript('OnDragStart', f => f.StartMoving())
// a.SetScript('OnDragStop', f => f.StopMovingOrSizing())

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
  const app = App()

  const frame = app.frames['root']
    || CreateFrame('Frame', 'root', UIParent)

  frame.SetScale(1)
  frame.SetAllPoints(UIParent)

  app.frames['root'] = frame

  return frame
}

// frame
export const Frame: Component = options => {
  const app = App()

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
  frame.SetSize(500, 500)

  const app = App()

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

// test

// import { CharacterClass, CharacterRace, Component, Mapping, PlayerInfo } from './types'
export class Container {
  protected isLoaded: boolean = false
  protected isInit: boolean = false

  public root: WoWAPI.Frame
  // public playerInfo: PlayerInfo
  public playerInfo: any
  public components: Mapping<Component>

  constructor (protected onInit: ($: Container) => void) {
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

        return this.init()
      }
    }
  }

  private init () {
    this.onInit(this)
  }
}

const container = new Container(app => {
  const root = Root()

  const frame = Frame({
    name: 'frame',
    parent: root,
  })

  frame.SetPoint('CENTER')
  frame.SetSize(800, 800)
  frame.SetBackdrop(BASE_BACKDROP)
  frame.SetBackdropColor(0, 0, 0, 1)

  const scroll = Scroll({
    name: 'scroll',
    parent: frame,
  })

  scroll.SetAllPoints(frame)
  console.log('hello world')
})

