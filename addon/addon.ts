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
  id: string
  parent?: WoWAPI.Frame
  mod?: Mod | Mod[]
  inherits?: string
}

export type Component<O extends ComponentOptions = ComponentOptions> =
  (options: O) => WoWAPI.Frame

// root
export const Root = () => {
  const app = App()

  const frame = app.frames['root']
    || CreateFrame('Frame', 'root', UIParent)

  app.frames['root'] = frame

  return frame
}

// frame
export const Frame: Component = options => {
  const app = App()

  const frame = app.frames[options.id]
    || CreateFrame('Frame', options.id, options.parent || UIParent)

  app.frames[options.id] = frame

  if (typeof options.mod === 'function') {
    options.mod(frame)
  } else {
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

  const app = App()

  app.frames[options.id] = frame

  if (typeof options.mod === 'function') {
    options.mod(frame)
  } else {
    options.mod.forEach(fn => {
      fn(frame)
    })
  }

  const scrollframe = Frame({
    id: `${options.id}-scrollframe`,
    inherits: 'UIPanelScrollFrameTemplate',
  }) as WoWAPI.ScrollFrame

  const scrollchild = Frame({
    id: `${options.id}-scrollchild`,
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

  frame.SetSize(frame.GetWidth() * 0.667, frame.GetHeight() * 0.667)

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
const root = Root()


const frame = Frame({
  id: 'frame',
  parent: root,
})

frame.SetPoint('CENTER')
frame.SetSize(800, 800)

const scroll = Scroll({
  id: 'scroll',
  parent: frame,
})

scroll.SetAllPoints(frame)
console.log('hello world')

