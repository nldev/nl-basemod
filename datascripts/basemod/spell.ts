// import { Spell as TSSpell } from 'wow/wotlk/std/Spell/Spell'
//
// import { Builder } from './'
// import { Asset, AssetOptions, NWAsset } from './asset'
// import {
//     ASSET_TYPE, DEFAULT_ICON_SPELL_BASE, DEFAULT_SPELL_AURA_DESCRIPTION,
//     DEFAULT_SPELL_BASE, DEFAULT_SPELL_DESCRIPTION, DEFAULT_SPELL_NAME, ITEM_SPELL_TRIGGERS,
//     QUERY_ICON, DEFAULT_ICON_QUERY
// } from './constants'
// import { BaseState, Writable } from './state'
// import { AssetId, ItemSpell, ItemSpellOptions, Localization, Map, Queryable, TSText } from './types'
// import { localeify } from './utils'
//
// export interface Spell extends Asset<TSSpell> {
//   readonly icon: Queryable<string, typeof QUERY_ICON>
//   readonly description: TSText
//   readonly auraDescription: TSText
//   readonly subtext: TSText
// }
//
// export type SpellOptions = AssetOptions<Spell> & {
//   readonly itemSpells?: Map<ItemSpellOptions>
// }
//
// export class NWSpell extends NWAsset<TSSpell> implements Spell {
//   public readonly icon: string
//   public readonly description: Localization
//   public readonly auraDescription: Localization
//   public readonly subtext: Localization
//
//   protected readonly itemSpells: Map<ItemSpellOptions>
//
//   protected readonly loader = {
//     type: ASSET_TYPE.SPELL,
//     base: DEFAULT_SPELL_BASE,
//     name: DEFAULT_SPELL_NAME,
//     fn: (id: number) => this.builder.std.Spells.load(id),
//   }
//
//   constructor (options: SpellOptions = {}, protected readonly builder: Builder) {
//     super(options, builder)
//
//     if (!options.base)
//       this.clear()
//
//     // FIXME
//     this.icon = this.builder.query(
//       options.icon || this.asset.Icon.getPath() || DEFAULT_ICON_QUERY
//     )
//
//     this.description = localeify(options.description || this.asset.Description)
//     this.auraDescription = localeify(options.auraDescription || this.asset.AuraDescription)
//     this.subtext = localeify(options.subtext || this.asset.Subtext)
//     this.itemSpells = options.itemSpells || {}
//
//     this.build()
//   }
//
//   public ItemSpell (key: AssetId): ItemSpell {
//     const result = this.itemSpells[key]
//
//     if (!result)
//       throw new Error('item spell not found')
//
//     return {
//       spell: this.asset.ID,
//       trigger: ITEM_SPELL_TRIGGERS.ON_EQUIP,
//       ...result,
//     }
//   }
//
//   protected create () {
//     if (this.isModify)
//       return this.builder.std.Spells.load(this.base)
//
//     return this.builder.std.Spells.create(
//       this.builder.mod,
//       this.id,
//       this.base,
//     )
//   }
//
//   protected build () {
//     this.asset
//       .Icon.setPath(this.icon)
//       .Description.set(this.description)
//       .AuraDescription.set(this.auraDescription)
//       .Subtext.set(this.subtext)
//   }
//
//   protected clear () {
//     this.asset
//       .Description.set(localeify(DEFAULT_SPELL_DESCRIPTION))
//       .AuraDescription.set(localeify(DEFAULT_SPELL_AURA_DESCRIPTION))
//       .Cooldown.set(0, 0, 0, 0)
//       .TargetAuraSpell.Include.set(0)
//       .TargetAuraSpell.Exclude.set(0)
//       .TargetAuraState.Include.set(0)
//       .TargetAuraState.Exclude.set(0)
//       .InterruptFlags.clearAll()
//       .AuraInterruptFlags.clearAll()
//       .Icon.set(this.builder.std.Spells.load(DEFAULT_ICON_SPELL_BASE).Icon.get())
//       .Attributes.clearAll()
//       .ClassMask.A.set(0)
//       .ClassMask.B.set(0)
//       .ClassMask.C.set(0)
//       .Speed.set(0)
//       .ClassMask.Family.set(0)
//       .Levels.set(0, 0, 0)
//       .TargetType.clearAll()
//       .FacingCasterFlags.clearAll()
//       .Effects.clearAll()
//       .SchoolMask.clearAll()
//       .Priority.set(0)
//       .PreventionType.set(0)
//       .DefenseType.set(0)
//       .Mechanic.set(21)
//       .Range.set(0)
//       .Duration.getRef().clear()
//
//     this.asset.CastTime.getRef().clear()
//     this.asset.Visual.getRef().clear()
//
//     this.asset.Rank.set(0, 0)
//     this.asset.Subtext.clear()
//   }
// }
//
// export class SpellState extends BaseState<NWSpell> implements Writable<NWSpell, SpellOptions> {
//   public add (options: SpellOptions = {}) {
//     const spell = new NWSpell(options, this.builder)
//
//     this.insert(spell)
//
//     return spell
//   }
// }

