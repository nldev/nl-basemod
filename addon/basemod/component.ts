import { Unique } from './utils'
import { Get } from './app'

interface Color {
  red: number
  green: number
  blue: number
  alpha: number
}

type ColorOptions = Partial<Color>

interface Backdrop {
  bgFile: string
  edgeFile: string
  tile: boolean
  tileSize: number
  edgeSize: number
  insets: {
    left: number
    right: number
    top: number
    bottom: number
  },
}

type BackdropOptions = Partial<Backdrop>

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
}

const DEFAULT_COLOR = {
  red: 0,
  green: 0,
  blue: 0,
  alpha: 1,
}

export type RelativeRegion = string | WoWAPI.Region

export interface Point {
  point: WoWAPI.Point
  relativeTo?: RelativeRegion,
  relativePoint?: WoWAPI.Point,
  offsetX?: number
  offsetY?: number
}

export interface ComponentOptions {
  name?: string
  isPrefix?: boolean
}

export class Component<
  O extends ComponentOptions = ComponentOptions,
  T extends WoWAPI.UIObject = WoWAPI.Frame,
> {
  public ref: T

  constructor (options?: O) {}
}

export interface FrameOptions extends ComponentOptions {
  point?: Point
  allPoints?: RelativeRegion
  bgOptions?: BackdropOptions
  colorOptions?: ColorOptions
}

const DEFAULT_FRAME_OPTIONS = {
  bgOptions: DEFAULT_BACKDROP,
  colorOptions: DEFAULT_COLOR,
}

export class Frame extends Component {
  constructor (options: FrameOptions = DEFAULT_FRAME_OPTIONS) {
    super(options)

    const $ = Get()

    this.ref = CreateFrame(
      'Frame',
      options.name
        ? (options.isPrefix ? Unique(options.name) : options.name)
        : null,
      $.root,
    )

    if (options.bgOptions)
      this.Backdrop(options.bgOptions, options.colorOptions)
  }

  Backdrop (bgOptions: BackdropOptions = DEFAULT_BACKDROP, colorOptions: ColorOptions = DEFAULT_COLOR) {
    const backdrop: Backdrop = {
      ...DEFAULT_BACKDROP,
      ...bgOptions,
      insets: {
      ...DEFAULT_BACKDROP.insets,
      ...(bgOptions ? bgOptions : {}),
      }
    }
    this.ref.SetBackdrop(backdrop)

    const color: Color = {
      ...DEFAULT_COLOR,
      ...colorOptions,
    }

    this.ref.SetBackdropColor(color.red, color.green, color.blue, color.alpha)
  }

  Point (options: Point) {
    this.ref.SetPoint(options.point, options.relativeTo, options.relativePoint, options.offsetX, options.offsetY)
  }

  AllPoints (relativeRegion?: RelativeRegion) {
    this.ref.SetAllPoints(relativeRegion)
  }
}

