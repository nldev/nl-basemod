export type ComponentOptions = {
  id: string
  parent?: WoWAPI.Frame
}

export type Component<O extends ComponentOptions = ComponentOptions> = (options: O) => WoWAPI.Frame

export const Frame: Component = options => {
  return CreateFrame('Frame', options.id, options.parent || UIParent)
}

interface StyleOptions {}

export const useStyle = (options: StyleOptions) => (frame: WoWAPI.Frame) => {
  // frame.SetBackdrop({})
  // frame.SetBackdropColor()

  return frame
}

export const use = () => {}

