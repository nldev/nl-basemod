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

export type FrameClickHandler = (element: Element<any, any>, button: WoWAPI.MouseButton) => void

export type ButtonClickHandler = (element: Element<any, any>, button: WoWAPI.MouseButton, down: Boolean) => void

export interface ButtonOnClick {
  type: ClickType
  handler: ButtonClickHandler
}

export interface FrameOnClick {
  type: WoWAPI.MouseButton
  handler: FrameClickHandler
}

export type PreventDefault = () => void

export type FrameDragStartHandler = (frame: Element<any, any>, button: WoWAPI.MouseButton, preventDefault: PreventDefault) => void
export type FrameDragStopHandler = (frame: Element<any, any>, button: WoWAPI.MouseButton, preventDefault: PreventDefault) => void

export interface FrameOnDrag {
  type: WoWAPI.MouseButton
  startHandler?: FrameDragStartHandler
  stopHandler?: FrameDragStopHandler
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
  name: string
  prefix?: string
  parent?: Element<any, any>
}

export type Component<
  O extends ComponentOptions = ComponentOptions,
  T extends Element = Element,
> = (options?: O) => T

export abstract class Element<
  O extends ComponentOptions = ComponentOptions,
  T extends WoWAPI.UIObject = WoWAPI.Frame,
> {
  protected _parent: Element<any, any>
  protected isHidden: boolean

  public ref: T
  public name: string
  public inner: WoWAPI.Frame

  public children: Element<any, any>[] = []

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
    this.register()
  }

  public get parent () {
    return this._parent
  }

  protected Parent (parent: Element<any, any>) {}

  public set parent (parent: Element<any, any>) {
    this.Parent(parent)

    parent.children.push(this)

    this._parent = parent
  }

  public Show (force?: boolean) {
    if (!force)
      this.isHidden = false

    const frame = (this.ref as any) as WoWAPI.Frame

    if (frame.Show)
      frame.Show()

    this.children.forEach(child => child.Show(true))
  }

  public Hide (force?: boolean) {
    if (!force)
      this.isHidden = true

    const frame = (this.ref as any) as WoWAPI.Frame

    if (frame.Hide)
      frame.Hide()

    this.children.forEach(child => child.Hide(true))
  }

  public Toggle () {
  }

  protected register () {
    const $ = Get()

    $.register(this)
  }

  protected abstract create (name?: string, parent?: Element<any, any>): void

  public abstract setup (): void

  protected init () {}

  private mount () {
    const $ = Get()

    if (this.options.parent)
      this.parent = this.options.parent
  }
}

export interface FrameOptions extends ComponentOptions {
  point?: Point
  allPoints?: RelativeRegion
  bg?: BackdropOptions
  color?: ColorOptions
  onClick?: FrameOnClick
  onDrag?: FrameOnDrag
  size?: Size
  z?: number
  strata?: WoWAPI.FrameStrata
  padding?: number
  inner?: WoWAPI.Frame
}

export const DEFAULT_FRAME_OPTIONS = {
  bg: DEFAULT_BACKDROP,
  color: DEFAULT_COLOR,
}

export class FrameElement<O extends FrameOptions = FrameOptions> extends Element<O, WoWAPI.Frame> {
  protected height: number
  protected width: number
  protected size: Size
  protected padding: number
  protected bg: BackdropOptions
  protected color: ColorOptions
  protected point: Point
  protected allPoints: RelativeRegion
  protected strata: WoWAPI.FrameStrata
  protected z: number

  protected onClick: FrameOnClick
  protected onDrag: FrameOnDrag

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

    if (options.parent) {
      this.parent = options.parent
    } else {
      this.ref.SetParent(UIParent)
    }

    if (options.strata)
      this.Strata(options.strata)

    if (options.z)
      this.Z(options.z)

    if (options.onDrag)
      this.OnDrag(options.onDrag.type, options.onDrag.startHandler, options.onDrag.stopHandler)

    if (options.onClick)
      this.OnClick(options.onClick.type, options.onClick.handler)

    if (options.padding)
      this.Padding(options.padding)

    if (options.inner)
      this.Inner(options.inner)
  }

  protected Parent (parent: Element<any, any>) {
    this.ref.SetParent(parent.ref)
  }

  protected Padding (amount: number) {
    if (amount === 0)
      return this

    const frame = Frame({ name: this.name  + '-padding', parent: this })

    frame.ref.SetSize(this.ref.GetWidth() - amount, this.ref.GetHeight() - amount)

    this.Inner(frame.ref)

    this.inner.SetPoint('CENTER')

    return this
  }

  public Inner (frame: WoWAPI.Frame) {
    this.inner = frame

    this.inner.SetParent(this.ref)

    const z = this.z || 0

    this.inner.SetFrameLevel(z)
    this.ref.SetFrameLevel(z - 1)

    const strata = this.strata || 'BACKGROUND'

    this.inner.SetFrameStrata(strata)
    this.ref.SetFrameStrata(strata)
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

    this.bg = backdrop
    this.color = color

    return this
  }

  protected Point (options: Point) {
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

    this.point = options

    return this
  }

  protected AllPoints (relativeRegion?: RelativeRegion) {
    if (relativeRegion === 'parent')
      relativeRegion = this.parent.ref

    this.ref.SetAllPoints(relativeRegion)

    this.allPoints = relativeRegion

    return this
  }

  protected Size (width: number, height: number) {
    if (width)
      this.ref.SetWidth(width)

    if (height)
      this.ref.SetHeight(width)

    this.size = { width: this.ref.GetWidth(), height: this.ref.GetHeight() }

    if (this.inner)
      this.Padding(this.padding)

    return this
  }

  protected Z (level: number) {
    this.ref.SetFrameLevel(level)

    if (this.inner) {
      this.inner.SetFrameLevel(level)
    }

    this.z = level

    return this
  }

  protected Strata (strata: WoWAPI.FrameStrata) {
    this.ref.SetFrameStrata(strata)

    if (this.inner)
      this.inner.SetFrameStrata(strata)

    this.strata = strata

    return this
  }

  public OnClick (type: WoWAPI.MouseButton, handler: FrameClickHandler) {
    this.ref.EnableMouse(true)
    this.ref.SetScript('OnMouseUp', (_, button) => {
      if (type === button)
        handler(this, button)
    })

    this.onClick = {
      type,
      handler,
    }

    return this
  }

  public OnDrag (type: WoWAPI.MouseButton, startHandler?: FrameDragStartHandler, stopHandler?: FrameDragStopHandler) {
    this.ref.EnableMouse(true)
    this.ref.RegisterForDrag(type)
    this.ref.SetMovable(true)

    this.ref.SetScript('OnDragStart', (_, type) => {
      const state = { preventDefault: false }

      const preventDefault = () => { state.preventDefault = true }

      if (startHandler)
        startHandler(this, type, () => preventDefault())

      if (!state.preventDefault)
        this.ref.StartMoving()
    })

    this.ref.SetScript('OnDragStop', () => {
      const state = { preventDefault: false }

      const preventDefault = () => state.preventDefault = true

      if (stopHandler)
        stopHandler(this, type, () => preventDefault())

      if (!state.preventDefault)
        this.ref.StopMovingOrSizing()
    })

    this.onDrag = {
      type,
      startHandler,
      stopHandler,
    }

    return this
  }
}

export function CreateElement<
  O extends ComponentOptions = ComponentOptions,
  E extends Element = Element,
> (options: O, component: (options: O) => E) {
  const existing = Get().elements[options.name]
  const element = existing || component(options)

  return element
}

export const Frame: Component<FrameOptions, FrameElement> = options =>
  CreateElement(options, options => new FrameElement(options))

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
    this.ref = CreateFrame('Button', this.name, this.parent.ref)
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
      this.OnClick(options.onClick.type, options.onClick.handler)

    // if (options.z)
    //   this.Z(options.z)
  }

  protected Parent (parent: Element<any, any>) {
    this.ref.SetParent(parent.ref)
  }

  public OnClick (type: ClickType, handler: ButtonClickHandler) {
    this.ref.EnableMouse(true)
    this.ref.RegisterForClicks(type)
    this.ref.SetScript('OnClick', (_, button, down) => handler(this, button, down))

    return this
  }
}

export const Button: Component<ButtonOptions, ButtonElement> = options =>
    CreateElement(options, options => new ButtonElement(options))


