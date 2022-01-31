import { Get } from './app'

export interface ComponentOptions {}

export type Component<
  O extends ComponentOptions = ComponentOptions,
  T extends WoWAPI.UIObject = WoWAPI.Frame,
> = (options?: O) => T

const DEFAULT_FRAME_OPTIONS = {}

export const Frame: Component = (options = DEFAULT_FRAME_OPTIONS) => {
  const $ = Get()

  const component = CreateFrame('Frame', null, $.root)

  return component
}

