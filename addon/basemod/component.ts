import { Unique } from './utils'
import { Get } from './app'

export interface Color {
  red: number
  green: number
  blue: number
  alpha: number
}

export type ColorOptions = Partial<Color>

export interface Backdrop {
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

export type BackdropOptions = Partial<Backdrop>

// this.frame.SetBackdrop({
//   bgFile: 'Interface/Tooltips/UI-Tooltip-Background',
//   edgeFile: 'Interface/Tooltips/UI-Tooltip-Border',
//   tile: true, tileSize: 16, edgeSize: 16,
//   insets: { left: 4, right: 4, top: 4, bottom: 4 },
// })

export const DEFAULT_BACKDROP = {
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

export const DEFAULT_COLOR = {
  red: 0,
  green: 0,
  blue: 0,
  alpha: 1,
}

export type RelativeRegion = string | WoWAPI.Region

export type ClickHandler = <T extends WoWAPI.Region = WoWAPI.Frame>(frame: T, button: WoWAPI.MouseButton, down: boolean) => void

export interface Click {
  clickType: ClickType
  handler: ClickHandler
}

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

export abstract class Component<
  O extends ComponentOptions = ComponentOptions,
  T extends WoWAPI.UIObject = WoWAPI.Frame,
> {
  public ref: T

  constructor (protected options?: O) {
    this.ready()
    this.init()
  }

  protected abstract ready (): void

  protected init () {}
}

export interface FrameOptions extends ComponentOptions {
  point?: Point
  allPoints?: RelativeRegion
  bg?: BackdropOptions
  color?: ColorOptions
  click?: Click
}

export const DEFAULT_FRAME_OPTIONS = {
  bg: DEFAULT_BACKDROP,
  color: DEFAULT_COLOR,
}

export class Frame extends Component<FrameOptions> {
  protected ready () {
    const $ = Get()
    const { options } = this

    this.ref = CreateFrame(
      'Frame',
      options.name
        ? (options.isPrefix ? Unique(options.name) : options.name)
        : null,
      $.root,
    )

    if (options.bg)
      this.Backdrop(options.bg, this.options.color)

    if (options.point)
      this.Point(options.point)

    if (options.allPoints)
      this.AllPoints(options.allPoints)

    if (options.click)
      this.Click(options.click)

  }

  Parent<T extends WoWAPI.UIObject = WoWAPI.Frame> (parent: T) {
    this.ref.SetParent(parent)
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

  Click (options: Click) {
    this.ref.RegisterForClicks(options.clickType)
    this.ref.EnableMouse(true)
    this.ref.SetScript('OnClick', options.handler)
  }
}

