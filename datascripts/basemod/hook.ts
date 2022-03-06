import { Builder } from './'
import { Entity, EntityOptions, NWEntity } from './entity'
import { Item, ItemOptions } from './item'
import { Npc, NpcOptions } from './npc'
import { Spell, SpellOptions } from './spell'
import { BaseState, Readable } from './state'
import { NWTask, Template } from './task'
import { Data } from './types'

export interface Hook {
  onInitBegin: () => void,
  onInitSuccess: () => void,
  onSpellAddBegin: (options: SpellOptions) => void,
  onSpellAddSuccess: (spell: Spell) => void,
  onItemAddBegin: (options: ItemOptions) => void,
  onItemAddSuccess: (item: Item) => void,
  onNpcAddBegin: (options: NpcOptions) => void,
  onNpcAddSuccess: (npc: Npc) => void,
  onStoreAddBegin: (options: EntityOptions) => void,
  onStoreAddSuccess: (npc: Entity) => void,
  onTaskProcessBegin: (task: NWTask, template: Template) => void,
  onTaskProcessSuccess: (task: NWTask, template: Template) => void,
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

  public setup () {}

  public onInitBegin () {}

  public onInitSuccess () {}

  public onSpellAddBegin (options: SpellOptions) {}

  public onSpellAddSuccess (spell: Spell) {}

  public onItemAddBegin (options: ItemOptions) {}

  public onItemAddSuccess (item: Item) {}

  public onNpcAddBegin (options: NpcOptions) {}

  public onNpcAddSuccess (npc: Npc) {}

  public onStoreAddBegin (options: EntityOptions) {}

  public onStoreAddSuccess (entity: Entity) {}

  public onTaskProcessBegin (task: NWTask, template: Template) {}

  public onTaskProcessSuccess (task: NWTask, template: Template) {}
}

export class HookState extends BaseState<NWHook> implements Readable<NWHook> {}

