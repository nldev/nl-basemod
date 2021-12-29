import { Builder } from './'
import { Entity, EntityOptions, NWEntity } from './entity'
import { Item, ItemOptions } from './item'
import { Npc, NpcOptions } from './npc'
import { Spell, SpellOptions } from './spell'
import { BaseState, Readable } from './state'
import { NWTask, Template } from './task'
import { Data } from './types'

export interface Hook {
  onInitBegin: () => Promise<void>,
  onInitSuccess: () => Promise<void>,
  onSpellAddBegin: (options: SpellOptions) => Promise<void>,
  onSpellAddSuccess: (spell: Spell) => Promise<void>,
  onItemAddBegin: (options: ItemOptions) => Promise<void>,
  onItemAddSuccess: (item: Item) => Promise<void>,
  onNpcAddBegin: (options: NpcOptions) => Promise<void>,
  onNpcAddSuccess: (npc: Npc) => Promise<void>,
  onStoreAddBegin: (options: EntityOptions) => Promise<void>,
  onStoreAddSuccess: (npc: Entity) => Promise<void>,
  onTaskProcessBegin: (task: NWTask, template: Template) => Promise<void>,
  onTaskProcessSuccess: (task: NWTask, template: Template) => Promise<void>,
}

export interface HookConstructor<O extends Data = Data> {
  readonly id: string
  new (options: HookOptions<O>, builder: Builder): NWHook<O>
}

export interface HookOptions<O extends Data = Data> {
  id: string
  options: O
}

export abstract class NWHook<O extends Data = Data> extends NWEntity implements Hook {
  public static readonly id: string

  protected options: O

  constructor (
    options: HookOptions<O>,
    protected readonly builder: Builder,
  ) {
    super(options.id)

    this.options = options.options
  }

  public async setup () {}

  public async onInitBegin () {}

  public async onInitSuccess () {}

  public async onSpellAddBegin (options: SpellOptions) {}

  public async onSpellAddSuccess (spell: Spell) {}

  public async onItemAddBegin (options: ItemOptions) {}

  public async onItemAddSuccess (item: Item) {}

  public async onNpcAddBegin (options: NpcOptions) {}

  public async onNpcAddSuccess (npc: Npc) {}

  public async onStoreAddBegin (options: EntityOptions) {}

  public async onStoreAddSuccess (entity: Entity) {}

  public async onTaskProcessBegin (task: NWTask, template: Template) {}

  public async onTaskProcessSuccess (task: NWTask, template: Template) {}
}

export class HookState extends BaseState<NWHook> implements Readable<NWHook> {}

