import { EntityOptions, NWEntity } from './entity'
import { BaseState, Writable } from './state'

export class Store extends NWEntity {}

export class StoreState extends BaseState<Store> implements Writable<Store, EntityOptions> {
  public async add (options: EntityOptions = {}) {
    // OnStoreAddBegin
    for (const hook of this.builder.Hook.list)
      await hook.onStoreAddBegin(options)

    const entity = new Store(options.id)

    this.insert(entity)

    // OnStoreAddSuccess
    for (const hook of this.builder.Hook.list)
      await hook.onStoreAddSuccess(entity)

    return entity
  }
}
