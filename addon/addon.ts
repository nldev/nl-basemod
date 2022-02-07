export type Mod = (frame: WoWAPI.Frame) => WoWAPI.Frame 
export type Use<O = any> = (o: O) => Mod

export type ComponentOptions = {
  id: string
  parent?: WoWAPI.Frame
  mod?: Mod | Mod[]
}

export type Component<O extends ComponentOptions = ComponentOptions> = (options: O) => WoWAPI.Frame

export const Frame: Component = options => {
  const frame = CreateFrame('Frame', options.id, options.parent || UIParent)

  if (typeof options.mod === 'function') {
    options.mod(frame)
  } else {
    options.mod.forEach(fn => {
      fn(frame)
    })
  }

  console.log(typeof options.mod)

  return frame
}

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

const frame = Frame({
  id: 'frame',
  mod: useStyle({}),
})

