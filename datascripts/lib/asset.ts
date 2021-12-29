import { std } from 'tswow-stdlib'
import { Achievement as TSAchievement } from 'tswow-stdlib/Achievement/Achievement'
import { CreatureTemplate as TSNpc } from 'tswow-stdlib/Creature/CreatureTemplate'
import { ItemTemplate as TSItem } from 'tswow-stdlib/Item/ItemTemplate'
import { Spell as TSSpell } from 'tswow-stdlib/Spell/Spell'
import { loc_constructor } from 'wotlkdata/wotlkdata/primitives'

import { Builder } from './'
import {
    ACHIEVEMENT, ASSET_TYPE, DEFAULT_SPELL_BASE, DEFAULT_SPELL_NAME, ITEM, NPC, SPELL,
} from './constants'
import { Entity, NWEntity } from './entity'
import { Optional, TSText } from './types'
import { dashCaseToTitleCase, englishify, localeify, NextId, titleCaseToDashCase } from './utils'

export type AssetType = typeof SPELL | typeof ITEM | typeof NPC | typeof ACHIEVEMENT

export type TSAsset = TSSpell | TSItem | TSNpc | TSAchievement

export interface Asset<T extends TSAsset> extends Entity {
  readonly asset: T
  readonly base: number
  readonly name: TSText
  readonly isModify: boolean
  readonly isClear: boolean
}

export type AssetInitializer = Partial<
  Pick<
    Asset<TSAsset>,
    'id' | 'base' | 'name'
  >
>

export type AssetOptions<T extends Asset<TSAsset> = Asset<TSAsset>> =
  Optional<Omit<T, 'asset' | 'builder'>>

export interface AssetLoader {
  type: AssetType
  base: number
  name: string
  fn: (id: number) => TSAsset
}

export const DefaultAssetLoader: AssetLoader = {
  type: ASSET_TYPE.SPELL,
  base: DEFAULT_SPELL_BASE,
  name: DEFAULT_SPELL_NAME,
  fn: id => std.Spells.load(id),
}

export abstract class NWAsset<T extends TSAsset> extends NWEntity implements Asset<T> {
  public readonly id: string
  public readonly asset: T
  public readonly base: number
  public readonly name: loc_constructor
  public readonly isModify: boolean
  public readonly isClear: boolean

  protected readonly loader: AssetLoader = DefaultAssetLoader

  constructor (options: AssetOptions = {}, protected readonly builder: Builder) {
    super()

    if (options.isModify === true && !options.base)
      throw new Error('cannot modify base asset')

    this.isModify = !!options.isModify
    this.isClear = !!options.isClear

    const initial = {
      id: options.id,
      base: options.base,
      name: options.name,
    }

    this.id = this.Id(initial)
    this.base = this.Base(initial)
    this.name = this.Name(initial)

    this.asset = this.create()

    this.asset.Name.set(this.name)

    if (this.isClear)
      this.clear()
  }

  protected Id (initial: AssetInitializer) {
    if (initial.id)
      return initial.id

    if (initial.name)
      return titleCaseToDashCase(
        englishify(initial.name)
      )

    if (initial.base)
      return titleCaseToDashCase(
        this.loader.fn(initial.base).Name.enGB.get()
      )

    return NextId(this.loader.type)
  }

  protected Base (initial: AssetInitializer) {
    if (initial.base)
      return initial.base

    if (!this.isModify)
      return this.loader.base

    throw new Error('cannot modify an asset without a base ID')
  }

  protected Name (initial: AssetInitializer) {
    let name: TSText = this.loader.name

    if (initial.name) {
      name = initial.name
    } else {
      if (initial.id) {
        name = dashCaseToTitleCase(initial.id)
      } else if (initial.base) {
        name = this.loader.fn(initial.base).Name.enGB.get()
      }
    }

    return localeify(name)
  }

  protected abstract create (): T
  protected abstract build (): void
  protected abstract clear (): void
}
