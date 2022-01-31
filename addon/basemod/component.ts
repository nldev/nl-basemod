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

export type RelativeRegion = string | 'root' | 'parent' | WoWAPI.Region

export type FrameClickHandler = <T extends WoWAPI.Region = WoWAPI.Frame>(frame: T, button: WoWAPI.MouseButton) => void

export type ButtonClickHandler = <T extends WoWAPI.Region = WoWAPI.Frame>(frame: T, button: WoWAPI.MouseButton, down: Boolean) => void

export interface ButtonOnClick {
  type: ClickType
  handler: ButtonClickHandler
}

export interface FrameOnClick {
  button: WoWAPI.MouseButton
  handler: FrameClickHandler
}

export interface FullPoint {
  point: WoWAPI.Point
  relativeTo?: RelativeRegion
  relativePoint?: WoWAPI.Point
  offsetX?: number
  offsetY?: number
}

export type Point = FullPoint | WoWAPI.Point

export interface ComponentOptions {
  name?: string
  prefix?: string
  parent?: WoWAPI.Frame
}

export type Component<
  O extends ComponentOptions = ComponentOptions,
  T extends Element = Element,
> = (options?: O, children?: Element[]) => T

export abstract class Element<
  O extends ComponentOptions = ComponentOptions,
  T extends WoWAPI.UIObject = WoWAPI.Frame,
> {
  public ref: T
  public name: string
  public parent: WoWAPI.Frame
  public inner: WoWAPI.Frame

  constructor (public options: O, public children: Element[] = []) {
    if (this.options.prefix && this.options.name)
      throw new Error('Component cannot have both a name and a prefix')

    const $ = Get()

    this.name = this.options.name
      ? this.options.name
      : this.options.prefix
      ? Unique(this.options.prefix)
      : null

    this.create()

    this.parent = this.options.parent || $.root

    this.setup()
    this.init()
    this.mount()
  }

  protected abstract create (name?: string, parent?: WoWAPI.Frame): void

  public abstract setup (): void

  protected init () {}

  public Children (children: Element[]) {
    this.children.forEach(child => {
      child.ref.SetParent(UIParent)
      child.ref.Hide()
    })

    this.children = children

    this.children.forEach(child => {
      child.ref.SetParent(this.inner ? this.inner : this.ref)
      child.setup()
    })

    return this
  }

  private mount () {
    const $ = Get()

    if (this.children)
      this.children.forEach(child => child.ref.SetParent(this.ref))

    this.parent = this.options.parent || $.root
  }
}

export interface FrameOptions extends ComponentOptions {
  point?: Point
  allPoints?: RelativeRegion
  bg?: BackdropOptions
  color?: ColorOptions
  onClick?: FrameOnClick
  size?: Size
  z?: number
  padding?: number
}

export const DEFAULT_FRAME_OPTIONS = {
  bg: DEFAULT_BACKDROP,
  color: DEFAULT_COLOR,
}

export class FrameElement<O extends FrameOptions = FrameOptions> extends Element<O, WoWAPI.Frame> {
  protected create () {
    this.ref = CreateFrame('Frame', this.name, this.parent)
  }

  public setup () {
    const { options } = this

    if (options.size)
      this.Size(options.size.width, options.size.height)

    if (options.bg)
      this.Backdrop(options.bg, this.options.color)

    if (options.point)
      this.Point(options.point)

    if (options.allPoints)
      this.AllPoints(options.allPoints)

    if (options.onClick)
      this.Click(options.onClick.button, options.onClick.handler)

    if (options.z)
      this.Z(options.z)

    if (options.parent)
      this.Parent(options.parent)

    if (options.padding)
      this.Padding(options.padding)
  }

  public Padding (amount: number) {
    if (amount === 0) {
      this.children.forEach(child => {
        child.ref.SetParent(this.ref)
      })

      delete this.inner

      return this
    }

    this.inner = CreateFrame('Frame', null, this.ref)

    this.inner.SetSize(this.ref.GetWidth() - amount, this.ref.GetHeight() - amount)
    this.inner.SetParent(this.ref)
    this.inner.SetPoint('CENTER', this.ref, 'CENTER')

    this.children.forEach(child => {
      child.ref.SetParent(this.inner)
    })

    return this
  }

  public Parent<T extends WoWAPI.Frame = WoWAPI.Frame> (parent: T) {
    this.ref.SetParent(parent)

    return this
  }

  public Backdrop (bgOptions: BackdropOptions = DEFAULT_BACKDROP, colorOptions: ColorOptions = DEFAULT_COLOR) {
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

  public Point (options: Point) {
    const $ = Get()

    if (typeof options === 'string') {
      this.ref.SetPoint(options)
    } else {
      let relativeTo = null

      if (options.relativeTo === 'parent')
        relativeTo = this.parent

      if (options.relativeTo === 'root')
        relativeTo = $.root

      this.ref.SetPoint(options.point, relativeTo, options.relativePoint, options.offsetX, options.offsetY)
    }

    return this
  }

  public AllPoints (relativeRegion?: RelativeRegion) {
    if (relativeRegion === 'parent')
      relativeRegion = this.parent

    this.ref.SetAllPoints(relativeRegion)

    return this
  }

  public Click (type: WoWAPI.MouseButton, handler: FrameClickHandler) {
    this.ref.EnableMouse(true)
    this.ref.SetScript('OnMouseUp', (frame, button) => {
      if (type === button)
        handler(frame, button)
    })

    return this
  }

  public Size (width: number, height: number) {
    if (width)
      this.ref.SetWidth(width)

    if (height)
      this.ref.SetHeight(width)

    return this
  }

  public Z (level: number) {
    this.ref.SetFrameLevel(level)

    return this
  }

  public Execute (fn: (frame: FrameElement) => void) {
    fn(this)

    return this
  }
}

export const Frame: Component<FrameOptions, FrameElement> = (options = {}, children) =>
  new FrameElement(options, children)

export interface ButtonOptions extends ComponentOptions {
  point?: Point
  allPoints?: RelativeRegion
  onClick?: ButtonOnClick
  size?: Size
  z?: number
}

export const DEFAULT_BUTTON_OPTIONS = {
  // bg: DEFAULT_BACKDROP,
  // color: DEFAULT_COLOR,
}

export class ButtonElement<O extends ButtonOptions = ButtonOptions> extends Element<O, WoWAPI.Button> {
  protected create () {
    this.ref = CreateFrame('Button', this.name, this.parent)
  }

  public setup () {
    const { options } = this

    // if (options.size)
    //   this.Size(options.size.width, options.size.height)

    // if (options.bg)
    //   this.Backdrop(options.bg, this.options.color)

    // if (options.point)
    //   this.Point(options.point)

    // if (options.allPoints)
    //   this.AllPoints(options.allPoints)

    if (options.onClick)
      this.Click(options.onClick.type, options.onClick.handler)

    // if (options.z)
    //   this.Z(options.z)
  }

  public Parent<T extends WoWAPI.Frame = WoWAPI.Frame> (parent: T) {
    this.ref.SetParent(parent)

    return this
  }

  public Click (type, handler: ButtonClickHandler) {
    this.ref.EnableMouse(true)
    this.ref.RegisterForClicks(type)
    this.ref.SetScript('OnClick', (frame, button, down) => handler(frame, button, down))

    return this
  }
}

export const Button: Component<ButtonOptions, ButtonElement> = (options = {}, children) =>
    new ButtonElement(options, children)


