import '../global'
import { Root } from './root'
import { Unique } from './utils'

export interface ComponentOptions {
  type?: WoWAPI.FrameType
  parent?: WoWAPI.Frame
  name?: string
  isPrefix?: boolean
  inherits?: string
  id?: number
}

export class Component {
  public frame: WoWAPI.UIObject

  private defaultType: WoWAPI.FrameType = 'Frame'

  constructor (public root: Root, private options: ComponentOptions) {
    this.create()
    this.onCreate()
  }

  private create () {
    const { type = 'Frame', parent, name, isPrefix, inherits, id } = this.options

    this.frame = CreateFrame(type || this.defaultType, isPrefix ? Unique(name) : name, parent, inherits, id)

    return this.frame
  }

  private onCreate () {}
}
