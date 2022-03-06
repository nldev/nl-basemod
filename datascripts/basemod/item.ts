import { ItemTemplate as TSItem } from 'wow/wotlk/std/Item/ItemTemplate'

import { Builder } from './'
import { Asset, AssetOptions, NWAsset } from './asset'
import {
    ASSET_TYPE, DEFAULT_ICON_QUERY, DEFAULT_ITEM_SPELL_TRIGGER_ID, DEFAULT_SPELL_BASE,
    DEFAULT_SPELL_NAME, MAX_ITEM_SPELL_COUNT, QUERY_ICON,
} from './constants'
import { BaseState, Writable } from './state'
import { Localization, Queryable, TSText } from './types'
import { ItemSpellCount, ItemSpellTrigger, localeify } from './utils'

export type ItemSpellSelection = {
  spell: string,
  id?: string,
  isIgnoreILevel?: boolean,
}

export type ItemSpellSelectorPartial = string | ItemSpellSelection

export type ItemSpellSelector =
  | string
  | ItemSpellSelectorPartial
  | []
  | [ItemSpellSelectorPartial]
  | [ItemSpellSelectorPartial, ItemSpellSelectorPartial]
  | [ItemSpellSelectorPartial, ItemSpellSelectorPartial, ItemSpellSelectorPartial]
  | [ItemSpellSelectorPartial, ItemSpellSelectorPartial, ItemSpellSelectorPartial, ItemSpellSelectorPartial]
  | [ItemSpellSelectorPartial, ItemSpellSelectorPartial, ItemSpellSelectorPartial, ItemSpellSelectorPartial, ItemSpellSelectorPartial]

export interface Item extends Asset<TSItem> {
  readonly id: string
  readonly icon: Queryable<string, typeof QUERY_ICON>
  readonly description: TSText
  readonly itemSpells: ItemSpellSelector
  // TODO: spells: factor in stats that require spells, cause error if overflow on budget
  // TODO: stats: use spells when necessary, cause error if overflow on budget
  // TODO: iLevel: calculated iLevel of stats + spells
  // TODO: budget: iLevel budget
  // TODO: overflow: allowed iLevel overflow
}

export type ItemOptions = AssetOptions<Item>

export class NWItem extends NWAsset<TSItem> implements Item {
  public readonly icon: string
  public readonly description: Localization
  public readonly itemSpells: ItemSpellSelector

  protected readonly loader = {
    type: ASSET_TYPE.ITEM,
    base: DEFAULT_SPELL_BASE,
    name: DEFAULT_SPELL_NAME,
    fn: (id: number) => this.builder.std.Items.load(id),
  }

  constructor (options: ItemOptions = {}, protected readonly builder: Builder) {
    super(options, builder)

    if (!options.base)
      this.clear()

    this.icon = ''
    this.icon = this.builder.query(
      options.icon || this.asset.DisplayInfo.getRef().Icon.get() || DEFAULT_ICON_QUERY
    )

    this.description = localeify(options.description || this.asset.Description)
    this.itemSpells = options.itemSpells || []

    this.build()
  }

  protected build () {
    this.asset
      .Description.set(this.description)
      .DisplayInfo.getRef().Icon.set(this.icon)

    const currentSpellCount = ItemSpellCount(this.asset)
    const isAlreadyMaxSpells = currentSpellCount === MAX_ITEM_SPELL_COUNT

    if (!isAlreadyMaxSpells && this.itemSpells && (typeof this.itemSpells === 'string')) {
      const id = DEFAULT_ITEM_SPELL_TRIGGER_ID
      const spell = this.builder.Spell.get(this.itemSpells)
      const spellItem = spell.ItemSpell(id)
      const baseId = spell.asset.ID

      this.asset.Spells.addMod(mod => {
        mod.Spell.set(baseId)

        if (spellItem.category)
          mod.Category.set(spellItem.category)

        if (spellItem.trigger)
          mod.Trigger.set(ItemSpellTrigger(spellItem.trigger))

        if (spellItem.charges)
          mod.Charges.Raw.set(spellItem.charges)

        if (spellItem.ppm)
          mod.ProcsPerMinute.set(spellItem.ppm)

        if (spellItem.cooldown)
          mod.Cooldown.set(spellItem.cooldown)

        if (spellItem.categoryCooldown)
          mod.CategoryCooldown.set(spellItem.categoryCooldown)
      })
    }

    if (!isAlreadyMaxSpells && this.itemSpells && Array.isArray(this.itemSpells)) {
      this.itemSpells.forEach((selector: ItemSpellSelectorPartial, index: number) => {
        if ((index + currentSpellCount + 1) >= MAX_ITEM_SPELL_COUNT)
          return

        let id: string = DEFAULT_ITEM_SPELL_TRIGGER_ID
        let spell: string

        if (typeof selector === 'string') {
          spell = selector
        } else {
          id = selector.id || id
          spell = selector.spell
        }

        const s = this.builder.Spell.get(spell)
        const is = s.ItemSpell(id)
        const base = s.asset.ID

        this.asset.Spells.addMod(mod => {
          mod.Spell.set(base)

          if (is.category)
            mod.Category.set(is.category)

          if (is.trigger)
            mod.Trigger.set(ItemSpellTrigger(is.trigger))

          if (is.charges)
            mod.Charges.Raw.set(is.charges)

          if (is.ppm)
            mod.ProcsPerMinute.set(is.ppm)

          if (is.cooldown)
            mod.Cooldown.set(is.cooldown)

          if (is.categoryCooldown)
            mod.CategoryCooldown.set(is.categoryCooldown)
        })
      })
    }

    if (!isAlreadyMaxSpells && this.itemSpells && !Array.isArray(this.itemSpells) && (typeof this.itemSpells === 'object')) {
      const { id = DEFAULT_ITEM_SPELL_TRIGGER_ID, spell: selection } = this.itemSpells as ItemSpellSelection
      const spell = this.builder.Spell.get(selection)

      const spellItem = spell.ItemSpell(id)
      const baseId = spell.asset.ID

      this.asset.Spells.addMod(mod => {
        mod.Spell.set(baseId)

        if (spellItem.category)
          mod.Category.set(spellItem.category)

        if (spellItem.trigger)
          mod.Trigger.set(ItemSpellTrigger(spellItem.trigger))

        if (spellItem.charges)
          mod.Charges.Raw.set(spellItem.charges)

        if (spellItem.ppm)
          mod.ProcsPerMinute.set(spellItem.ppm)

        if (spellItem.cooldown)
          mod.Cooldown.set(spellItem.cooldown)

        if (spellItem.categoryCooldown)
          mod.CategoryCooldown.set(spellItem.categoryCooldown)
      })
    }
  }

  protected create () {
    if (this.isModify)
      return this.builder.std.Items.load(this.base)

    return this.builder.std.Items.create(
      this.builder.mod,
      this.id,
      this.base,
    )
  }

  protected clear () {}
}

export class ItemState extends BaseState<NWItem> implements Writable<NWItem, ItemOptions> {
  public add (options: ItemOptions = {}) {
    // OnItemAddBegin
    for (const hook of this.builder.Hook.list)
      hook.onItemAddBegin(options)

    const item = new NWItem(options, this.builder)

    this.insert(item)

    // OnItemAddSuccess
    for (const hook of this.builder.Hook.list)
      hook.onItemAddSuccess(item)

    return item
  }
}
