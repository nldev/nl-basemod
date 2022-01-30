import '../global'
import { UI } from '.'
import { Unique } from './utils'
import { Color, Size } from './types'

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

export interface ComponentOptions<T = WoWAPI.UIObject> {
  parent?: T | 'root'
  name?: string
  isPrefix?: boolean
  inherits?: string
  id?: number
  background?: Background
  size?: Size
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

    if (this.options.background)
      this.Background(this.options.background)

    return this.frame
  }

  public Size (width: number, height: number) {
    this.frame.SetSize(width, height)
  }

  public Background (options: BackgroundOptions) {
    const background: Background = { ...DEFAULT_BACKGROUND, ...options }

    this.frame.SetBackdrop(background)
    this.frame.SetBackdropColor(...background.color)
  }
}

