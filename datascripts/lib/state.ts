import { Builder } from './'
import { EntityOptions, NWEntity } from './entity'
import { Map } from './types'

export interface Readable<T extends NWEntity> {
  map: Map<T>
  list: T[]
  get: (id: string) => T
}

export interface Writable<T extends NWEntity, O extends EntityOptions> extends Readable<T> {
  add: (options: O) => T
}

export abstract class NWState<T extends NWEntity> implements Readable<T> {
  constructor (
    protected readonly state: Map<T> = {},
    protected readonly builder: Builder,
  ) {}

  public abstract get map (): Map<T>
  public abstract get list (): T[]
  public abstract get (id: string): T

  protected abstract insert (entity: T): void
}

export class BaseState<T extends NWEntity> extends NWState<T> implements Readable<T> {
  public get map () {
    return this.state
  }

  public get list () {
    return Object
      .keys(this.state)
      .map(key => this.state[key])
  }

  public get (id: string) {
    return this.state[id]
  }

  protected insert (entity: T) {
    const { id } = entity

    this.state[id] = entity
  }
}
