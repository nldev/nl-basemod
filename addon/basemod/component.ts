import { Mapping } from './types'

export type NRelativeRegion = string | NElement
export interface NFrameOnClick {
  type: WoWAPI.MouseButton
  handler: NFrameClickHandler
}
export type NFrameDragStartHandler =
  (
    frame: NElement,
    button: WoWAPI.MouseButton,
    preventDefault: () => void
  ) => void

export type NFrameDragStopHandler =
  (
    frame: NElement,
    button: WoWAPI.MouseButton,
    preventDefault: () => void
  ) => void

export type NFrameClickHandler =
  (
    element: NElement,
    button: WoWAPI.MouseButton
  ) => void

export interface NFrameOnDrag {
  type: WoWAPI.MouseButton
  startHandler?: NFrameDragStartHandler
  stopHandler?: NFrameDragStopHandler
}
export interface NStyle {
  preset?: string
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
  red?: number
  green?: number
  blue?: number
  alpha?: number
}
export const RESET_STYLE: NStyle = {
  tile: true,
  bgFile: '',
  edgeFile: '',
  edgeSize: 0,
  tileSize: 0,
  insets: { top: 0, right: 0, bottom: 0, left: 0 },
  red: 0,
  green: 0,
  blue: 0,
  alpha: 0,
}
export const BOX_FULL = 'BOX_FULL'
export const BOX_CENTER = 'BOX_CENTER'
export const BOX_POINT = 'BOX_POINT'
export type NFullBoxType = typeof BOX_FULL
export type NCenterBoxType = typeof BOX_CENTER
export type NPointBoxType = typeof BOX_POINT
export type NBoxType = NFullBoxType | NCenterBoxType | NPointBoxType
export interface NBaseBox {
  type: NBoxType
  z?: number
  strata?: WoWAPI.FrameStrata
}
export interface NSizableBox extends NBaseBox {
  width: number
  height: number
  isPercent?: boolean
}
export interface NFullBox extends NBaseBox {
  type: NFullBoxType
}
export interface NCenterBox extends NSizableBox {
  type: NCenterBoxType
}
export interface NPointBox extends NSizableBox {
  type: NPointBoxType
  point: WoWAPI.Point
  x?: number
  y?: number
}
export type NBox =
  | NCenterBox
  | NPointBox
  | NFullBox
export interface NEventHandler {
}
export interface NClickEventHandler extends NEventHandler {
}
export interface NDragEventHandler extends NEventHandler {
}
export const UPDATE_FLAG_PARENT = 'UPDATE_FLAG_PARENT'
export const UPDATE_FLAG_VISIBILITY = 'UPDATE_FLAG_VISIBILITY'
export const UPDATE_FLAG_STYLE = 'UPDATE_FLAG_STYLE'
export const UPDATE_FLAG_BOX = 'UPDATE_FLAG_BOX'
export const UPDATE_FLAG_CHILDREN = 'UPDATE_FLAG_CHILDREN'
export type UpdateParentFlag = typeof UPDATE_FLAG_PARENT
export type UpdateVisibilityFlag = typeof UPDATE_FLAG_VISIBILITY
export type UpdateStyleFlag = typeof UPDATE_FLAG_STYLE
export type UpdateBoxFlag = typeof UPDATE_FLAG_BOX
export type UpdateChildrenFlag = typeof UPDATE_FLAG_CHILDREN
export type UpdateFlag =
  | UpdateParentFlag
  | UpdateVisibilityFlag
  | UpdateStyleFlag
  | UpdateBoxFlag
  | UpdateChildrenFlag
export interface UpdateFlagMap {
  [UPDATE_FLAG_PARENT]?: boolean
  [UPDATE_FLAG_VISIBILITY]?: boolean
  [UPDATE_FLAG_STYLE]?: boolean
  [UPDATE_FLAG_BOX]?: boolean
  [UPDATE_FLAG_CHILDREN]?: boolean
}
export interface NElementOptions {
  ref?: WoWAPI.Frame,
  parent?: NElement,
  children?: NElement[],
  box?: NBox,
  style?: NStyle,
  visibility?: boolean,
  scripts?: NEventHandler[],
}
export class NElement {
  public ref: WoWAPI.Frame

  constructor (public readonly id: string, options: NElementOptions = {}, children: NElement[] = []) {
    this.id = id

    if (options.ref) {
      this.ref = CreateFrame('Frame', id)
    } else {
      this.ref = options.ref
    }

    if (this.id === 'root')
      this.Parent()

    if (options.parent)
      this.Parent(options.parent)

    if (options.box)
      this.Box(options.box)

    if (options.style)
      this.Style(options.style)

    if (options.visibility)
      this.Visibility(options.visibility)

    // FIXME
    if (options.scripts)
      options.scripts.forEach(s => this.Script(s))

    if (options.children)
      this.Children(options.children)

    this.Children(children)
  }

  // children
  public childMap: Mapping<NElement> = {}

  public get children () {
    return Object.keys(this.childMap).map(key => this.childMap[key])
  }

  protected _Children (list: NElement[] = this.children) {
    list.forEach(e => {
      this.childMap[e.id] = e
      e.Parent(e)
    })
  }

  public Children (list: NElement[] = this.children) {
    this._Children(list)

    return this
  }

  // internal
  protected attach (child: NElement) {
    child.Parent(this)
  }

  protected get parentRef () {
    return this.parent
      ? this.parent.ref
      : UIParent
  }

  // update
  protected _Update (toUpdate?: UpdateFlagMap, recurse?: boolean) {
    let isUpdateAll = !toUpdate

    if (isUpdateAll || toUpdate[UPDATE_FLAG_PARENT])
      this.Parent()

    if (isUpdateAll || toUpdate[UPDATE_FLAG_BOX])
      this.Box()

    if (isUpdateAll || toUpdate[UPDATE_FLAG_STYLE])
      this.Style()

    if (isUpdateAll || toUpdate[UPDATE_FLAG_VISIBILITY])
      this.Visibility()

    if (isUpdateAll || toUpdate[UPDATE_FLAG_CHILDREN])
      this.Children()

    if (recurse)
      this.children.forEach(e => e.Update(toUpdate, true))
  }

  public Update (toUpdate?: UpdateFlagMap, recurse?: boolean) {
    this._Update(toUpdate, recurse)

    return this
  }

  // visibility
  protected isVisible: boolean = true
  protected isVisibilityLocked: boolean = false

  public Visibility (bool: boolean = this.isVisible, lock: boolean = this.isVisibilityLocked, force?: boolean) {
    this.isVisibilityLocked = lock

    if (bool) {
      this.Show(force, lock)
    } else {
      this.Hide(force, lock)
    }

    return this
  }

  public Toggle (force?: boolean, overrideLock?: boolean) {
    if (this.isVisible) {
      this.Hide(force, overrideLock)
    } else {
      this.Show(force, overrideLock)
    }

    return this
  }

  protected _Show (force?: boolean, overrideLock?: boolean) {
    if (this.isVisibilityLocked && !overrideLock) {
      if (!force)
        this.isVisible = true

      this.ref.Show()

      this.children.forEach(e => e.Show(true))
    }
  }

  public Show (force?: boolean, overrideLock?: boolean) {
    this._Show(force, overrideLock)

    return this
  }

  protected _Hide (force?: boolean, overrideLock?: boolean) {
    if (this.isVisibilityLocked && !overrideLock) {
      if (!force)
        this.isVisible = false

      this.ref.Hide()

      this.children.forEach(e => e.Hide(true))
    }
  }

  public Hide (force?: boolean, overrideLock?: boolean) {
    this._Hide(force, overrideLock)

    return this
  }

  // box
  protected box: NBox = {
    type: 'BOX_CENTER',
    width: 0,
    height: 0,
  }

  protected _Box (box: NBox = this.box) {
    this.ref.ClearAllPoints()

    if (box.type === BOX_CENTER) {
      this.ref.SetPoint('CENTER')

      let width = box.width
      let height = box.height

      if (box.isPercent) {
        width = this.parentRef.GetWidth() * width
        height = this.parentRef.GetHeight() * height
      }

      this.ref.SetSize(width, height)
    }

    if (box.type === BOX_FULL) {
      const mount = this.parentRef
      this.ref.SetAllPoints(mount)
    }

    if (box.type === BOX_POINT) {
      let width = box.width
      let height = box.height

      if (box.isPercent) {
        width = this.parentRef.GetWidth() * width
        height = this.parentRef.GetHeight() * height
      }

      this.ref.SetSize(width, height)
      this.ref.SetPoint(box.point)
    }

    if (box.z) {
      this.ref.SetFrameLevel(box.z)
    }

    if (box.strata) {
      this.ref.SetFrameStrata(box.strata)
    }

    this.box = box

    this.children.forEach(e => e.Box())

    this.Update({ [UPDATE_FLAG_STYLE]: true })
  }

  public Box (box = this.box) {
    this.Box(box)

    return this
  }

  // parent
  protected parent: NElement = null

  protected _Parent (parent: NElement = this.parent, ref?: WoWAPI.Frame) {
    ref = ref ? ref : (parent ? parent.ref : UIParent)

    if (this.id === 'root') {
      parent = null
      ref = ref || UIParent
    }

    this.parent = parent

    this.ref.SetParent(ref)

    this.Update({ [UPDATE_FLAG_BOX]: true })
  }

  public Parent (parent: NElement = this.parent, ref?: WoWAPI.Frame) {
    this._Parent(parent, this.parent.ref)

    return this
  }

  // background
  protected style: NStyle = { ...RESET_STYLE }

  protected _Style (style: NStyle = this.style, reset?: boolean) {
    if (reset)
      this.style = RESET_STYLE as any

    const insets = {
      top: (style.insets && style.insets.top) || this.style.insets.top || 0,
      right: (style.insets && style.insets.right) || this.style.insets.right || 0,
      bottom: (style.insets && style.insets.bottom) || this.style.insets.bottom || 0,
      left: (style.insets && style.insets.left) || this.style.insets.left || 0,
    }

    style = ({
      ...RESET_STYLE,
      ...this.style,
      ...style,
      insets,
    })

    this.ref.SetBackdrop(style as any)
    this.ref.SetBackdropColor(style.red || this.style.red || 0, style.green || this.style.green || 0, style.blue || this.style.blue || 0, style.alpha || this.style.alpha || 1)

    this.style = style
  }

  public Style (style: NStyle = this.style, reset?: boolean) {
    this._Style(style, reset)

    return this
  }

  // event handlers
  protected handlers: [] = []

  // FIXME
  protected _Script (handler: NEventHandler) {}

  public Script (handler: NEventHandler) {
    this._Script(handler)

    return this
  }

  protected _Run (cb: (element: NElement) => void) {
    if (cb)
      cb(this)
  }

  public Run (cb: (element: NElement) => void) {
    this._Run(cb)

    return this
  }
}

// import { isNil, Unique } from './utils'
// import { Get } from './app'

// export interface Size {
//   width?: number
//   height?: number
// }

// export interface Color {
//   red?: number
//   green?: number
//   blue?: number
//   alpha?: number
// }

// export type ColorOptions = Partial<Color>

// export interface Backdrop {
//   bgFile: string
//   edgeFile: string
//   tile: boolean
//   tileSize: number
//   edgeSize: number
//   insets: {
//     left: number
//     right: number
//     top: number
//     bottom: number
//   },
// }

// export type BackdropOptions = Partial<Backdrop>

// // this.frame.SetBackdrop({
// //   bgFile: 'Interface/Tooltips/UI-Tooltip-Background',
// //   edgeFile: 'Interface/Tooltips/UI-Tooltip-Border',
// //   tile: true, tileSize: 16, edgeSize: 16,
// //   insets: { left: 4, right: 4, top: 4, bottom: 4 },
// // })

// export const DEFAULT_BACKDROP = {
//   bgFile: 'Interface/Tooltips/UI-Tooltip-Background',
//   edgeFile: 'Interface/Tooltips/UI-Tooltip-Border',
//   tile: true,
//   tileSize: 16,
//   edgeSize: 16,
//   insets: {
//     left: 4,
//     right: 4,
//     top: 4,
//     bottom: 4,
//   },
// }

// export const DEFAULT_COLOR = {
//   red: 0,
//   green: 0,
//   blue: 0,
//   alpha: 1,
// }

// export type RelativeRegion = string | 'root' | 'parent' | WoWAPI.Region

// export type FrameClickHandler = (element: Element<any, any>, button: WoWAPI.MouseButton) => void

// export type ButtonClickHandler = (element: Element<any, any>, button: WoWAPI.MouseButton, down: Boolean) => void

// export interface ButtonOnClick {
//   type: ClickType
//   handler: ButtonClickHandler
// }

// export interface FrameOnClick {
//   type: WoWAPI.MouseButton
//   handler: FrameClickHandler
// }

// export type PreventDefault = () => void

// export type FrameDragStartHandler = (frame: Element<any, any>, button: WoWAPI.MouseButton, preventDefault: PreventDefault) => void
// export type FrameDragStopHandler = (frame: Element<any, any>, button: WoWAPI.MouseButton, preventDefault: PreventDefault) => void

// export interface FrameOnDrag {
//   type: WoWAPI.MouseButton
//   startHandler?: FrameDragStartHandler
//   stopHandler?: FrameDragStopHandler
// }

// export interface FullPoint {
//   point: WoWAPI.Point
//   relativeTo?: RelativeRegion
//   relativePoint?: WoWAPI.Point
//   offsetX?: number
//   offsetY?: number
// }

// export type Point = FullPoint | WoWAPI.Point

// export interface ComponentOptions {
//   id: string
//   prefix?: string
//   frame?: WoWAPI.Frame
//   parent?: Element<any, any>
// }

// export type Component<
//   O extends ComponentOptions = ComponentOptions,
//   T extends Element = Element,
// > = (options?: O) => T

// export abstract class Element<
//   O extends ComponentOptions = ComponentOptions,
//   T extends WoWAPI.UIObject = WoWAPI.Frame,
// > {
//   protected _parent: Element<any, any>
//   protected isHidden: boolean

//   public ref: T
//   public id: string
//   public children: Element<any, any>[] = []

//   constructor (protected options: O, children: Element<any, any>[] = []) {
//     if (this.options.prefix && this.options.id)
//       throw new Error('Component cannot have both an id and a prefix')

//     this.id = this.options.id
//       ? this.options.id
//       : this.options.prefix
//       ? Unique(this.options.prefix)
//       : null

//     if (this.options.frame) {
//       this.ref = (this.options.frame as any)
//     } else {
//       this.create()
//     }

//     this.setup()
//     this.mount()
//     this.init()
//     this.register(children)
//   }

//   public get parent () {
//     return this._parent
//   }

//   protected Parent (parent: Element<any, any>) {}

//   public set parent (parent: Element<any, any>) {
//     this.Parent(parent)

//     parent.children.push(this)

//     this._parent = parent
//   }

//   public Show (force?: boolean) {
//     if (!force)
//       this.isHidden = false

//     const frame = (this.ref as any) as WoWAPI.Frame

//     if (frame.Show)
//       frame.Show()

//     this.children.forEach(child => child.Show(true))

//     this.onShow()

//     return this
//   }

//   protected onShow () {}

//   public Hide (force?: boolean) {
//     if (!force)
//       this.isHidden = true

//     const frame = (this.ref as any) as WoWAPI.Frame

//     if (frame.Hide)
//       frame.Hide()

//     this.children.forEach(child => child.Hide(true))

//     this.onHide()

//     return this
//   }

//   protected onHide () {}

//   public Toggle () {
//     if (this.isHidden) {
//       this.Show()
//     } else {
//       this.Hide()
//     }
//   }

//   protected register (children: Element<any, any>[]) {
//     const $ = Get()

//     $.register(this)

//     children.forEach(child => child.parent = this)
//   }

//   protected abstract create (id?: string, parent?: Element<any, any>): void

//   protected abstract setup (): void

//   protected init () {}

//   private mount () {
//     const $ = Get()

//     if (this.options.parent) {
//       this.parent = this.options.parent
//     } else {
//       const frame = (this.ref as any) as WoWAPI.Frame

//       if (frame.SetParent)
//         frame.SetParent(UIParent)

//       if (this.parent) {
//         const parentRef = this.parent.ref as WoWAPI.Frame

//         if (parentRef.IsShown) {
//           const isShown = parentRef.IsShown()

//           const ref = (this.ref as any) as WoWAPI.Frame

//           if (isShown) {
//             ref.Show()
//           } else {
//             ref.Hide()
//           }
//         }
//       }
//     }
//   }
// }

// export interface FrameOptions extends ComponentOptions {
//   point?: Point
//   allPoints?: RelativeRegion
//   bg?: BackdropOptions
//   color?: ColorOptions
//   onClick?: FrameOnClick
//   onDrag?: FrameOnDrag
//   size?: Size
//   z?: number
//   strata?: WoWAPI.FrameStrata
// }

// export const DEFAULT_FRAME_OPTIONS = {
//   bg: DEFAULT_BACKDROP,
//   color: DEFAULT_COLOR,
// }

// export class FrameElement<O extends FrameOptions = FrameOptions> extends Element<O, WoWAPI.Frame> {
//   protected height: number
//   protected width: number
//   protected size: Size
//   protected bg: BackdropOptions
//   protected color: ColorOptions
//   protected point: Point
//   protected allPoints: RelativeRegion
//   protected strata: WoWAPI.FrameStrata
//   protected z: number

//   protected onClick: FrameOnClick
//   protected onDrag: FrameOnDrag

//   protected create () {
//     this.ref = CreateFrame('Frame', this.id)
//   }

//   protected setup () {
//     const { options } = this

//     if (options.size)
//       this.Size(options.size.width, options.size.height)

//     if (options.bg)
//       this.Backdrop(options.bg, this.options.color)

//     if (options.point)
//       this.Point(options.point)

//     if (options.allPoints)
//       this.AllPoints(options.allPoints)

//     if (options.strata)
//       this.Strata(options.strata)

//     if (options.z)
//       this.Z(options.z)

//     if (options.onDrag)
//       this.OnDrag(options.onDrag.type, options.onDrag.startHandler, options.onDrag.stopHandler)

//     if (options.onClick)
//       this.OnClick(options.onClick.type, options.onClick.handler)
//   }

//   protected Parent (parent: Element<any, any>) {
//     this.ref.SetParent(parent.ref)
//   }

//   public Backdrop (bgOptions: BackdropOptions = DEFAULT_BACKDROP, colorOptions: ColorOptions = DEFAULT_COLOR) {
//     const backdrop: Backdrop = {
//       ...DEFAULT_BACKDROP,
//       ...bgOptions,
//       insets: {
//       ...DEFAULT_BACKDROP.insets,
//       ...(bgOptions ? bgOptions : {}),
//       }
//     }

//     this.ref.SetBackdrop(backdrop)

//     const color: Color = {
//       ...DEFAULT_COLOR,
//       ...colorOptions,
//     }

//     this.ref.SetBackdropColor(color.red, color.green, color.blue, color.alpha)

//     this.bg = backdrop
//     this.color = color

//     return this
//   }

//   protected Point (options: Point) {
//     const $ = Get()

//     if (typeof options === 'string') {
//       this.ref.SetPoint(options)
//     } else {
//       let relativeTo = null

//       if (options.relativeTo === 'parent')
//         relativeTo = this.parent

//       if (options.relativeTo === 'root')
//         relativeTo = $.root

//       this.ref.SetPoint(options.point, relativeTo, options.relativePoint, options.offsetX, options.offsetY)
//     }

//     this.point = options

//     return this
//   }

//   protected AllPoints (relativeRegion?: RelativeRegion) {
//     if (relativeRegion === 'parent')
//       relativeRegion = this.parent.ref

//     this.ref.SetAllPoints(relativeRegion)

//     this.allPoints = relativeRegion

//     return this
//   }

//   protected Size (width: number, height: number) {
//     if (width)
//       this.ref.SetWidth(width)

//     if (height)
//       this.ref.SetHeight(width)

//     this.size = { width: this.ref.GetWidth(), height: this.ref.GetHeight() }

//     return this
//   }

//   protected Z (level: number) {
//     this.ref.SetFrameLevel(level)

//     this.z = level

//     return this
//   }

//   protected Strata (strata: WoWAPI.FrameStrata) {
//     this.ref.SetFrameStrata(strata)

//     this.strata = strata

//     return this
//   }

//   public OnClick (type: WoWAPI.MouseButton, handler: FrameClickHandler) {
//     this.ref.EnableMouse(true)
//     this.ref.SetScript('OnMouseUp', (_, button) => {
//       if (type === button)
//         handler(this, button)
//     })

//     this.onClick = {
//       type,
//       handler,
//     }

//     return this
//   }

//   public OnDrag (type: WoWAPI.MouseButton, startHandler?: FrameDragStartHandler, stopHandler?: FrameDragStopHandler) {
//     this.ref.EnableMouse(true)
//     this.ref.RegisterForDrag(type)
//     this.ref.SetMovable(true)

//     this.ref.SetScript('OnDragStart', (_, type) => {
//       const state = { preventDefault: false }

//       const preventDefault = () => { state.preventDefault = true }

//       if (startHandler)
//         startHandler(this, type, () => preventDefault())

//       if (!state.preventDefault)
//         this.ref.StartMoving()
//     })

//     this.ref.SetScript('OnDragStop', () => {
//       const state = { preventDefault: false }

//       const preventDefault = () => state.preventDefault = true

//       if (stopHandler)
//         stopHandler(this, type, () => preventDefault())

//       if (!state.preventDefault)
//         this.ref.StopMovingOrSizing()
//     })

//     this.onDrag = {
//       type,
//       startHandler,
//       stopHandler,
//     }

//     return this
//   }
// }

// export function CreateElement<
//   O extends ComponentOptions = ComponentOptions,
//   E extends Element = Element,
// > (options: O, component: (options: O) => E) {
//   const existing = Get().elements[options.id]
//   const element = existing || component(options)

//   return element
// }

// export const Frame: Component<FrameOptions, FrameElement> = options =>
//   CreateElement(options, options => new FrameElement(options))

// export interface ButtonOptions extends ComponentOptions {
//   point?: Point
//   allPoints?: RelativeRegion
//   onClick?: ButtonOnClick
//   size?: Size
//   z?: number
// }

// export const DEFAULT_BUTTON_OPTIONS = {
//   // bg: DEFAULT_BACKDROP,
//   // color: DEFAULT_COLOR,
// }

// export class ButtonElement<O extends ButtonOptions = ButtonOptions> extends Element<O, WoWAPI.Button> {
//   protected create () {
//     this.ref = CreateFrame('Button', this.id, this.parent.ref)
//   }

//   protected setup () {
//     const { options } = this

//     // if (options.size)
//     //   this.Size(options.size.width, options.size.height)

//     // if (options.bg)
//     //   this.Backdrop(options.bg, this.options.color)

//     // if (options.point)
//     //   this.Point(options.point)

//     // if (options.allPoints)
//     //   this.AllPoints(options.allPoints)

//     if (options.onClick)
//       this.OnClick(options.onClick.type, options.onClick.handler)

//     // if (options.z)
//     //   this.Z(options.z)
//   }

//   protected Parent (parent: Element<any, any>) {
//     this.ref.SetParent(parent.ref)
//   }

//   public OnClick (type: ClickType, handler: ButtonClickHandler) {
//     this.ref.EnableMouse(true)
//     this.ref.RegisterForClicks(type)
//     this.ref.SetScript('OnClick', (_, button, down) => handler(this, button, down))

//     return this
//   }
// }

// export const Button: Component<ButtonOptions, ButtonElement> = options =>
//     CreateElement(options, options => new ButtonElement(options))
