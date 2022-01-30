import '../global'
import { UI } from '.'
import { Unique } from './utils'

export interface ComponentOptions {
  type?: WoWAPI.FrameType
  parent?: WoWAPI.Frame | 'root'
  name?: string
  isPrefix?: boolean
  inherits?: string
  id?: number
}

export class Component {
  public frame: WoWAPI.UIObject

  private defaultType: WoWAPI.FrameType = 'Frame'

  constructor (public ui: UI, private options: ComponentOptions) {
    this.create()
    this.onCreate()
  }

  private create () {
    const { type = 'Frame', parent, name, isPrefix, inherits, id } = this.options

    this.frame = CreateFrame(
      type || this.defaultType,
      isPrefix ? Unique(name) : name,
      (parent === 'root') ? this.ui.root.frame : parent,
      inherits,
      id,
    )

    return this.frame
  }

  private onCreate () {}
}
