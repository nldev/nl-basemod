import '../global'
import { UI } from '.'
import { Unique } from './utils'
import { Color, Size } from './types'
import { ROOT, PARENT } from './constants'

type RelativeTo = WoWAPI.Region | typeof ROOT | typeof PARENT | string

interface Point {
  point: WoWAPI.Point
  relativeTo?: RelativeTo
  relativePoint?: WoWAPI.Point
  offsetX?: number
  offsetY?: number
}

export interface Background {
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
  }
  color: Color
}

export type BackgroundOptions = Partial<Background>

export const DEFAULT_BACKGROUND: Background = {
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
  color: [0, 0, 0, 1],
}

export interface ComponentOptions<T = WoWAPI.Region> {
  size: Size
  parent?: T | 'root'
  name?: string
  isPrefix?: boolean
  inherits?: string
  id?: number
  background?: Background
  point?: Point
  setAllPoints?: RelativeTo
}

export abstract class Component<T, O extends ComponentOptions = ComponentOptions> {
  public frame: T
  public size: Size

  constructor (public ui: UI, protected options: O) {
    this.size = this.options.size

    this.create()
    this.onCreate()
  }

  protected abstract create (): T

  protected onCreate () {}
}

export class Frame<O extends ComponentOptions = ComponentOptions> extends Component<WoWAPI.Frame, O> {
  protected create () {
    const { parent, name, isPrefix, inherits, id } = this.options

    this.frame = CreateFrame(
      'Frame',
      isPrefix ? Unique(name) : name,
      (parent === 'root') ? this.ui.root.frame : parent,
      inherits,
      id,
    )

    if (this.options.size)
      this.Size(...this.options.size)

    if (this.options.point)
      this.Point(this.options.point)

    if (this.options.background)
      this.Background(this.options.background)

    if (this.options.setAllPoints)

    return this.frame
  }

  public SetAllPoints (relativeTo: RelativeTo) {
    if (relativeTo === ROOT) {
      this.frame.SetAllPoints(this.ui.root.frame)
    } else if (relativeTo === PARENT) {
      this.frame.SetAllPoints(this.options.parent)
    } else {
      this.frame.SetAllPoints(relativeTo)
    }
  }

  public Point ({ point, relativeTo, relativePoint, offsetX, offsetY }: Point) {
    this.frame.SetPoint(point, relativeTo, relativePoint, offsetX, offsetY)
  }

  public Size (width: number, height: number) {
    this.frame.SetSize(width, height)
  }

  public Background (options: BackgroundOptions = DEFAULT_BACKGROUND) {
    // FIXME: use fallbacks from ui
    const background: Background = { ...DEFAULT_BACKGROUND, ...options }

    this.frame.SetBackdrop(background)
    this.frame.SetBackdropColor(...background.color)
  }
}

