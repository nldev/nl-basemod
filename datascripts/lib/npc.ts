import { CreatureTemplate as TSNpc } from 'tswow-stdlib/Creature/CreatureTemplate'

import { Builder } from './'
import { Asset, AssetOptions, NWAsset } from './asset'
import { ASSET_TYPE, DEFAULT_NPC_BASE, DEFAULT_NPC_NAME } from './constants'
import { BaseState, Writable } from './state'
import { UniqueId } from './utils'

export type PetSpells =
  | [number, number, number, number]
  | [number, number, number]
  | [number, number]
  | [number]
  | []

export interface Npc extends Asset<TSNpc> {
  readonly id: string
  readonly petSpells: PetSpells
}

export type NpcOptions = AssetOptions<Npc>

export class NWNpc extends NWAsset<TSNpc> implements Npc {
  public readonly petSpells: PetSpells

  protected readonly loader = {
    type: ASSET_TYPE.NPC,
    base: DEFAULT_NPC_BASE,
    name: DEFAULT_NPC_NAME,
    fn: (id: number) => this.builder.std.CreatureTemplates.load(id),
  }

  constructor (options: NpcOptions = {}, protected readonly builder: Builder) {
    super(options, builder)

    if (!options.base)
      this.clear()

    this.petSpells = options.petSpells || []

    this.build()
  }

  protected build () {
    if (this.petSpells.length) {
      const data = this.builder.dbc.CreatureSpellData.add(50000) // FIXME: use real index
      const availability = new Array(this.petSpells.length).fill(100)

      data.Spells.set(this.petSpells)
      data.Availability.set(availability)
    }
  }

  protected create () {
    if (this.isModify)
      return this.builder.std.CreatureTemplates.load(this.base)

    return this.builder.std.CreatureTemplates.create(
      this.builder.mod,
      UniqueId('npc', this.id),
      this.base,
    )
  }

  protected clear () {}
}

export class NpcState extends BaseState<NWNpc> implements Writable<NWNpc, NpcOptions> {
  public async add (options: NpcOptions = {}) {
    // OnNpcAddBegin
    for (const hook of this.builder.Hook.list)
      await hook.onNpcAddBegin(options)

    const npc = new NWNpc(options, this.builder)

    this.insert(npc)

    // OnNpcAddSuccess
    for (const hook of this.builder.Hook.list)
      await hook.onNpcAddSuccess(npc)

    return npc
  }
}
