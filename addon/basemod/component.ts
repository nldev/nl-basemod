import { Unique } from './utils'
import { Get } from './app'

export interface Size {
  width?: number
  height?: number
}

export interface Color {
  red?: number
  green?: number
  blue?: number
  alpha?: number
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

export interface OnClick {
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
  prefix?: string
  parent?: WoWAPI.UIObject
}

export type Component<
  O extends ComponentOptions = ComponentOptions,
  T extends Instance = Instance,
> = (options?: O, children?: Instance[]) => T

export abstract class Instance<
  O extends ComponentOptions = ComponentOptions,
  T extends WoWAPI.UIObject = WoWAPI.Frame,
> {
  public ref: T
  public name: string
  public parent: WoWAPI.UIObject

  constructor (public options: O, public children?: Instance[]) {
    if (this.options.prefix && this.options.name)
      throw new Error('Component cannot have both a name and a prefix')

    this.name = this.options.name
      ? this.options.name
      : this.options.prefix
      ? Unique(this.options.prefix)
      : null

    this.create()
    this.prepare()
    this.setup()
    this.init()
  }

  protected abstract create (name?: string, parent?: WoWAPI.UIObject): void
  private prepare () {
    const $ = Get()

    if (this.children)
      this.children.forEach(child => child.ref.SetParent(this.ref))

    this.parent = this.options.parent || $.root
  }

  protected abstract setup (): void

  protected init () {}
}

export interface FrameOptions extends ComponentOptions {
  point?: Point
  allPoints?: RelativeRegion
  bg?: BackdropOptions
  color?: ColorOptions
  onClick?: OnClick
  size?: Size
}

export const DEFAULT_FRAME_OPTIONS = {
  bg: DEFAULT_BACKDROP,
  color: DEFAULT_COLOR,
}

export class FrameInstance<O extends FrameOptions = FrameOptions> extends Instance<O, WoWAPI.Frame> {
  protected create () {
    this.ref = CreateFrame('Frame', this.name, this.parent)
  }

  protected setup () {
    const { options } = this

    if (options.size)
      this.Size(options.size)

    if (options.bg)
      this.Backdrop(options.bg, this.options.color)

    if (options.point)
      this.Point(options.point)

    if (options.allPoints)
      this.AllPoints(options.allPoints)

    if (options.onClick)
      this.Click(options.onClick.clickType, options.onClick.handler)
  }

  Parent<T extends WoWAPI.UIObject = WoWAPI.Frame> (parent: T) {
    this.ref.SetParent(parent)

    return this
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

    return this
  }

  Point (options: Point) {
    this.ref.SetPoint(options.point, options.relativeTo, options.relativePoint, options.offsetX, options.offsetY)

    return this
  }

  AllPoints (relativeRegion?: RelativeRegion) {
    this.ref.SetAllPoints(relativeRegion)

    return this
  }

  Click (type: ClickType, handler: ClickHandler) {
    this.ref.EnableMouse(true)
    this.ref.RegisterForClicks(type)
    this.ref.SetScript('OnClick', handler)

    return this
  }

  Size (options: Size) {
    if (options.width)
      this.ref.SetWidth(options.width)

    if (options.height)
      this.ref.SetHeight(options.width)

    return this
  }
}

export const Frame: Component<FrameOptions> = (options = {}, children) =>
  new FrameInstance(options, children)

