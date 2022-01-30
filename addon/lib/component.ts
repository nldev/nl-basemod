import '../global'
import { UI } from '.'
import { Convert, Unique } from './utils'
import { Color } from './types'

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

export interface ComponentOptions {
  type?: WoWAPI.FrameType
  parent?: WoWAPI.UIObject | 'root'
  name?: string
  isPrefix?: boolean
  inherits?: string
  id?: number
  background?: Background
}

export class Component {
  public frame: WoWAPI.UIObject

  protected defaultType: WoWAPI.FrameType

  constructor (public ui: UI, private options: ComponentOptions) {
    this.create()
    this.onCreate()
  }

  private create () {
    const { type = 'Frame', parent, name, isPrefix, inherits, id } = this.options

    const x = CreateFrame('ScrollFrame')

    this.frame = CreateFrame(
      type || this.defaultType,
      isPrefix ? Unique(name) : name,
      (parent === 'root') ? this.ui.root.frame : parent,
      inherits,
      id,
    )

    if (this.options.background)
      this.Background(this.options.background)

    return this.frame
  }

  public Background (options: BackgroundOptions = DEFAULT_BACKGROUND) {
    const background: Background = { ...DEFAULT_BACKGROUND, ...options }

    if (this.frame.GetObjectType() === 'Frame') {
      const frame = Convert<WoWAPI.Frame>(this.frame)

      frame.SetBackdrop(background)
      frame.SetBackdropColor(...background.color)
    }
  }

  protected onCreate () {}
}

