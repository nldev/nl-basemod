import { Data, Optional } from './types'
import { RandomId } from './utils'

export interface Entity {
  readonly id: string
  readonly data: Data
}

export type EntityOptions = Optional<Entity>

export abstract class NWEntity implements Entity {
  public readonly id: string

  private _: Data = {}

  constructor (id?: string) {
    this.id = id || RandomId()
  }

  public get data () {
    return this._
  }

  public set data (update: Data) {
    // FIXME: deep merge
    this._ = {
      ...this._,
      ...update,
    }
  }
}
