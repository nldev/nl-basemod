// component
export type Mod = (frame: WoWAPI.Frame) => WoWAPI.Frame

export type ComponentOptions = {
  id: string
  parent?: WoWAPI.Frame
  mod?: Mod | Mod[]
}

export type Component<O extends ComponentOptions = ComponentOptions> = (options: O) => WoWAPI.Frame

// frame
export const Frame: Component = options => {
  const frame = CreateFrame('Frame', options.id, options.parent || UIParent)

  if (typeof options.mod === 'function') {
    options.mod(frame)
  } else {
    options.mod.forEach(fn => {
      fn(frame)
    })
  }

  return frame
}

// modifiers
export type Use<O = any> = (o: O) => Mod

interface StyleOptions {}

export const useStyle = (options: StyleOptions) => (frame: WoWAPI.Frame) => {
  // frame.SetBackdrop({})
  // frame.SetBackdropColor()

  return frame
}

interface BoxOptions {}

export const useBox = (options: BoxOptions) => (frame: WoWAPI.Frame) => {
  return frame
}

// scroll

// grid

// test
const frame = Frame({
  id: 'frame',
  mod: useStyle({}),
})
