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

export type PreventDefault = () => void

export type FrameDragStartHandler = <T extends WoWAPI.Region = WoWAPI.Frame>(frame: T, button: WoWAPI.MouseButton, preventDefault: PreventDefault) => void
export type FrameDragStopHandler = <T extends WoWAPI.Region = WoWAPI.Frame>(frame: T, button: WoWAPI.MouseButton, preventDefault: PreventDefault) => void

export interface FrameOnDrag {
  button: WoWAPI.MouseButton
  startHandler: FrameDragStartHandler
  stopHandler: FrameDragStopHandler
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
> = (options?: O) => T

export abstract class Element<
  O extends ComponentOptions = ComponentOptions,
  T extends WoWAPI.UIObject = WoWAPI.Frame,
> {
  public ref: T
  public name: string
  public parent: WoWAPI.Frame
  public inner: WoWAPI.Frame

  constructor (public options: O) {
    if (this.options.prefix && this.options.name)
      throw new Error('Component cannot have both a name and a prefix')

    this.name = this.options.name
      ? this.options.name
      : this.options.prefix
      ? Unique(this.options.prefix)
      : null

    this.create()
    this.setup()
    this.init()
    this.mount()
  }

  protected abstract create (name?: string, parent?: WoWAPI.Frame): void

  public abstract setup (): void

  protected init () {}

  private mount () {
    const $ = Get()

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
  protected point: Point
  protected height: number
  protected width: number

  protected create () {
    this.ref = CreateFrame('Frame', this.name)
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

    if (options.parent)
      this.Parent(options.parent)

    if (options.padding)
      this.Padding(options.padding)

    if (options.z)
      this.Z(options.z)
  }

  public Padding (amount: number) {
    if (amount === 0)
      return this

    this.inner = CreateFrame('Frame', null, this.ref)

    this.inner.SetSize(this.ref.GetWidth() - amount, this.ref.GetHeight() - amount)
    this.inner.SetParent(this.ref)
    this.inner.SetPoint('CENTER')

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

      this.point = options

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

  public Drag (type: WoWAPI.MouseButton, startHandler?: FrameDragStartHandler, stopHandler?: FrameDragStopHandler) {
    this.ref.EnableMouse(true)
    console.log('here')
    this.ref.RegisterForDrag(type)
    console.log('here')
    this.ref.SetMovable(true)
    console.log('here')

    this.ref.SetScript('OnDragStart', (frame, type) => {
      console.log('start')
      const state = { preventDefault: false }
      console.log('start here')

      const preventDefault = () => { state.preventDefault = true }
      console.log('start here')

      if (startHandler)
        startHandler(frame, type, () => preventDefault())
      console.log('start here')

      console.log(type)

      if (!state.preventDefault)
        frame.StartMoving()

      console.log('start here')
    })
    console.log('here')

    this.ref.SetScript('OnDragStop', (frame) => {
      console.log('stop')
      const state = { preventDefault: false }
      console.log('stop here')

      const preventDefault = () => state.preventDefault = true
      console.log('stop here')

      if (stopHandler)
        stopHandler(frame, type, () => preventDefault())
      console.log('stop here')


      console.log(type)

      if (!state.preventDefault)
        frame.StopMovingOrSizing()

      console.log('stop here')
    })
    console.log('here')

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
    let frame = this.ref

    if (this.inner) {
      this.ref.SetFrameLevel(level - 1)

      frame = this.inner
    }

    frame.SetFrameLevel(level)

    return this
  }

  public Execute (fn: (frame: FrameElement) => void) {
    fn(this)

    return this
  }
}

export const Frame: Component<FrameOptions, FrameElement> = (options = {}) =>
  new FrameElement(options)

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
    if (this.options)
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

export const Button: Component<ButtonOptions, ButtonElement> = (options = {}) =>
    new ButtonElement(options)


