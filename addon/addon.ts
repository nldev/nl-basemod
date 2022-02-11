// types
export interface Mapping<T = any> {
  [key: string]: T
}

// app
const app: App = {
  frames: {},
}

export interface App {
  frames: Mapping<WoWAPI.Frame>
}

// mods
export type Mod = (frame: WoWAPI.Frame) => WoWAPI.Frame

export type Use<O = any> = (o: O) => Mod

export interface StyleOptions {}

export const useStyle = (options: StyleOptions) => (frame: WoWAPI.Frame) => {
  // frame.SetBackdrop({})
  // frame.SetBackdropColor()

  return frame
}

export interface BoxOptions {}

export const useBox = (options: BoxOptions) => (frame: WoWAPI.Frame) => {
  return frame
}

export const App = () => app

// component
export type ComponentOptions = {
  id: string
  parent?: WoWAPI.Frame
  mod?: Mod | Mod[]
}

export type Component<O extends ComponentOptions = ComponentOptions> =
  (options: O) => WoWAPI.Frame

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

  return frame
}

// scroll

// grid

// test
const frame = Frame({
  id: 'frame',
  mod: useStyle({}),
})

