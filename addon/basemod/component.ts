import { Unique } from './utils'
import { Get } from './app'

export interface ComponentOptions {
  name?: string
  isPrefix?: boolean
}

export class Component<
  O extends ComponentOptions = ComponentOptions,
  T extends WoWAPI.UIObject = WoWAPI.Frame,
> {
  public object: T

  constructor (protected options?: O) {}
}

export interface FrameOptions extends ComponentOptions {
}

const DEFAULT_FRAME_OPTIONS = {}

export class Frame extends Component {
  constructor (protected options: FrameOptions = DEFAULT_FRAME_OPTIONS) {
    super(options)

    const $ = Get()

    const component = CreateFrame(
      'Frame',
      options.name
        ? (options.isPrefix ? Unique(options.name) : options.name)
        : null,
      $.root,
    )
  }
}

interface Color {
  red: number
  green: number
  blue: number
  alpha: number
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
  },
  Color?: Color
}

// this.frame.SetBackdrop({
//   bgFile: 'Interface/Tooltips/UI-Tooltip-Background',
//   edgeFile: 'Interface/Tooltips/UI-Tooltip-Border',
//   tile: true, tileSize: 16, edgeSize: 16,
//   insets: { left: 4, right: 4, top: 4, bottom: 4 },
// })

const DEFAULT_BACKDROP = {
  bgFile: 'Interface/Tooltips/UI-Tooltip-Background',
  edgeFile: 'Interface/Tooltips/UI-Tooltip-Border',
  tile: true,
  tileSize: 16,
  edgeSize: 16,
  insets: {
    left: 4,
    right: 4,
    top: 4,
    bottom: 4,
  },
  color: { red: 0, green: 0, blue: 0, alpha: 1 },
}

function SetBackdrop (backdrop: Backdrop = DEFAULT_BACKDROP) {
  this.frame
}

