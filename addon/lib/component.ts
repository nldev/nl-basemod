import '../global'
import { UI } from '.'
import { Unique } from './utils'
import { Color, Size } from './types'

type RelativeTo = WoWAPI.Region | string

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
  parent?: T | 'root'
  name?: string
  isPrefix?: boolean
  inherits?: string
  id?: number
  background?: Background
  size?: Size
  point?: Point
}

export abstract class Component<T> {
  public frame: T

  constructor (public ui: UI, protected options: ComponentOptions) {
    this.create()
    this.onCreate()
  }

  protected abstract create (): T

  protected onCreate () {}
}

export class Frame extends Component<WoWAPI.Frame> {
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

    return this.frame
  }

  public SetAllPoints (relativeTo: RelativeTo) {
    this.frame.SetAllPoints()
  }

  public Point ({ point, relativeTo, relativePoint, offsetX, offsetY }: Point) {
    this.frame.SetPoint(point, relativeTo, relativePoint, offsetX, offsetY)
  }

  public Size (width: number, height: number) {
    this.frame.SetSize(width, height)
  }

  public Background (options: BackgroundOptions = DEFAULT_BACKGROUND) {
    const background: Background = { ...DEFAULT_BACKGROUND, ...options }

    this.frame.SetBackdrop(background)
    this.frame.SetBackdropColor(...background.color)
  }
}

