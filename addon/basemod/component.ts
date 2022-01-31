import { Get } from './app'

export interface ComponentOptions {}

export type Component<
  O extends ComponentOptions = ComponentOptions,
  T extends WoWAPI.UIObject = WoWAPI.Frame,
> = (options?: O) => T

const DEFAULT_FRAME_OPTIONS = {}

export const Frame: Component = (options = DEFAULT_FRAME_OPTIONS) => {
  const $ = Get()

  this.frame.SetBackdrop({
    bgFile: 'Interface/Tooltips/UI-Tooltip-Background',
    edgeFile: 'Interface/Tooltips/UI-Tooltip-Border',
    tile: true, tileSize: 16, edgeSize: 16,
    insets: { left: 4, right: 4, top: 4, bottom: 4 },
  })


  const component = CreateFrame('Frame', null, $.root)


  return component
}

interface Backdrop {
  bgFile?: string
  edgeFile?: string
  tile?: boolean
  tileSize?: number
  edgeSize?: number
  insets?: {
    left?: number
    right?: number
    top?: number
    bottom?: number
  }
}

function SetBackdrop () {
}

