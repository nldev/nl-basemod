import { Spell as TSSpell } from 'wow/wotlk/std/Spell/Spell'
import { SpellEffect } from 'wow/wotlk/std/Spell/SpellEffect'
import { Asset, AssetOptions } from '../asset'
import { noop } from '../utils'

import { CREATE_STAT_TASK } from '../constants'
import { Builder } from '../index'
import { NWSpell } from '../spell'
import { NWTask, TaskOptions, Template } from '../task'
import { Nil, TSText } from '../types'
import { resolveSpeed, times } from '../utils'

const STAT_BASE = 26283
const DEFAULT_STACKS = 255

export type STAT_TYPE =
  | Nil
  | 'MP5'
  | 'EP5'
  | 'RP5'
  | 'HP5'
  | 'SPIRIT'
  | 'AGILITY'
  | 'STAMINA'
  | 'STRENGTH'
  | 'INTELLECT'
  | 'MOVESPEED'
  | 'SPELL-POWER'
  | 'ATTACK-POWER'
  | 'ALL-RESIST'
  | 'FIRE-DAMAGE'
  | 'FIRE-RESIST'
  | 'HOLY-DAMAGE'
  | 'HOLY-RESIST'
  | 'FROST-DAMAGE'
  | 'FROST-RESIST'
  | 'ARCANE-DAMAGE'
  | 'ARCANE-RESIST'
  | 'NATURE-DAMAGE'
  | 'NATURE-RESIST'
  | 'SHADOW-DAMAGE'
  | 'SHADOW-RESIST'
  | 'CRITICAL-STRIKE'
  | 'ARMOR-PENETRATION'
  | 'SPELL-PENETRATION'
  | 'FIRE-PENETRATION'
  | 'HOLY-PENETRATION'
  | 'FROST-PENETRATION'
  | 'ARCANE-PENETRATION'
  | 'NATURE-PENETRATION'
  | 'SHADOW-PENETRATION'

export interface Stat extends Asset<TSSpell> {
  readonly prefix: string
  readonly name: TSText
  readonly spells: NWSpell[]
  readonly min: number
  readonly max: number
  readonly stacks: number
  readonly type: STAT_TYPE
  readonly isHidden: boolean
}

export type StatNameFn = (amount: number) => TSText

export type StatOptions = Exclude<AssetOptions<Stat>, 'spells'>

export interface StatTemplate extends Template {
  id: typeof CREATE_STAT_TASK
  options: StatOptions
}

export const StatName = (text: TSText, amount: number, isPercentage: boolean = false) => {
  return isPercentage
    ? `+${amount}% ${text.enGB}`
    : `+${amount} ${text.enGB}`
}

export class CreateStat extends NWTask {
  static readonly id = CREATE_STAT_TASK

  process (template: StatTemplate) {
    if (template.options && template.options.type) {
      const $ = new Helper(template.options, this.builder)

      $.run()
    }
  }
}

export interface CreateStatOptions extends TaskOptions {
  id: typeof CREATE_STAT_TASK
}

export class Helper {
  constructor (public options: StatOptions, public builder: Builder) {}

  public create (Creator: (amount: number) => NWSpell = this.Default) {
    const max = this.options.max || 1

    for (let i of times(max)) {
      const isMin = this.options.min && (i <= this.options.min)

      if (!isMin)
        (Creator(i)).asset
          .Stacks.set(this.options.stacks || DEFAULT_STACKS)
    }
  }

  public run () {
    const { type } = this.options

    switch (type) {
      case 'HP5':
        this.create.bind(this)((this.Hp5.bind(this)))
        break
      case 'MP5':
        this.create.bind(this)((this.Mp5.bind(this)))
        break
      case 'EP5':
        this.create.bind(this)((this.Ep5.bind(this)))
        break
      case 'RP5':
        this.create.bind(this)((this.Rp5.bind(this)))
        break
      case 'SPIRIT':
        this.create.bind(this)((this.Spirit.bind(this)))
        break
      case 'AGILITY':
        this.create.bind(this)((this.Agility.bind(this)))
        break
      case 'STAMINA':
        this.create.bind(this)((this.Stamina.bind(this)))
        break
      case 'STRENGTH':
        this.create.bind(this)((this.Strength.bind(this)))
        break
      case 'INTELLECT':
        this.create.bind(this)((this.Intellect.bind(this)))
        break
      case 'MOVESPEED':
        this.create.bind(this)((this.Movespeed.bind(this)))
        break
      case 'SPELL-POWER':
        this.create.bind(this)((this.SpellPower.bind(this)))
        break
      case 'ATTACK-POWER':
        this.create.bind(this)((this.AttackPower.bind(this)))
        break
      case 'ALL-RESIST':
        this.create.bind(this)((this.AllResist.bind(this)))
        break
      case 'FIRE-DAMAGE':
        this.create.bind(this)((this.FireDamage.bind(this)))
        break
      case 'FIRE-RESIST':
        this.create.bind(this)((this.FireResist.bind(this)))
        break
      case 'HOLY-DAMAGE':
        this.create.bind(this)((this.HolyDamage.bind(this)))
        break
      case 'HOLY-RESIST':
        this.create.bind(this)((this.HolyResist.bind(this)))
        break
      case 'FROST-DAMAGE':
        this.create.bind(this)((this.FrostDamage.bind(this)))
        break
      case 'FROST-RESIST':
        this.create.bind(this)((this.FrostResist.bind(this)))
        break
      case 'ARCANE-DAMAGE':
        this.create.bind(this)((this.ArcaneDamage.bind(this)))
        break
      case 'ARCANE-RESIST':
        this.create.bind(this)((this.ArcaneResist.bind(this)))
        break
      case 'NATURE-DAMAGE':
        this.create.bind(this)((this.NatureDamage.bind(this)))
        break
      case 'NATURE-RESIST':
        this.create.bind(this)((this.NatureResist.bind(this)))
        break
      case 'SHADOW-DAMAGE':
        this.create.bind(this)((this.ShadowDamage.bind(this)))
        break
      case 'SHADOW-RESIST':
        this.create.bind(this)((this.ShadowResist.bind(this)))
        break
      case 'CRITICAL-STRIKE':
        this.create.bind(this)((this.CriticalStrike.bind(this)))
        break
      case 'ARMOR-PENETRATION':
        this.create.bind(this)((this.ArmorPenetration.bind(this)))
        break
      case 'SPELL-PENETRATION':
        this.create.bind(this)((this.SpellPenetration.bind(this)))
        break
      case 'FIRE-PENETRATION':
        this.create.bind(this)((this.FirePenetration.bind(this)))
        break
      case 'HOLY-PENETRATION':
        this.create.bind(this)((this.HolyPenetration.bind(this)))
        break
      case 'FROST-PENETRATION':
        this.create.bind(this)((this.FrostPenetration.bind(this)))
        break
      case 'ARCANE-PENETRATION':
        this.create.bind(this)((this.ArcanePenetration.bind(this)))
        break
      case 'NATURE-PENETRATION':
        this.create.bind(this)((this.NaturePenetration.bind(this)))
        break
      case 'SHADOW-PENETRATION':
        this.create.bind(this)((this.ShadowPenetration.bind(this)))
        break
      default:
        this.create.bind(this)()
        break
    }
  }

  public Default (amount: number) {
    const name = StatName(this.options.name || { enGB: 'Stat' }, amount)

    const spell = this.builder.Spell.add({
      name,
      id: (this.options.prefix || 'stat-') + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    spell.asset.Effects.clearAll()

    return spell
  }

  public Hp5 (amount: number) {
    const name = StatName(this.options.name || { enGB: 'health per 5 sec.' }, amount)

    const spell = this.builder.Spell.add({
      name,
      id: this.options.prefix || 'hp5-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    spell.asset.Effects.clearAll()

    spell.asset.Effects.addMod(f => f
      .Aura.MOD_HEALTH_REGEN_IN_COMBAT.set()
      .PointsPerLevel.set(0)
      .PointsPerCombo.set(0)
      .PointsBase.set(amount)
      .PointsDieSides.set(0)
    )

    return spell
  }

  public Mp5 (amount: number) {
    const name = StatName(this.options.name || { enGB: 'mana per 5 sec.' }, amount)

    const spell = this.builder.Spell.add({
      name,
      id: this.options.prefix || 'mp5-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    spell.asset.Effects.clearAll()

    spell.asset.Effects.addMod(f => f
      .Aura.MOD_POWER_REGEN.set()
      .PowerType.set('MANA')
      .PowerBase.set(amount)
      .PowerPerCombo.set(0)
      .PowerPerLevel.set(0)
      .PowerDieSides.set(0)
    )

    return spell
  }

  public Ep5 (amount: number) {
    const name = StatName(this.options.name || { enGB: 'energy per 5 sec.' }, amount)

    const spell = this.builder.Spell.add({
      name,
      id: this.options.prefix || 'ep5-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    spell.asset.Effects.clearAll()

    spell.asset.Effects.addMod(f => f
      .Aura.MOD_POWER_REGEN.set()
      .PowerType.set('ENERGY')
      .PowerBase.set(amount)
      .PowerPerCombo.set(0)
      .PowerPerLevel.set(0)
      .PowerDieSides.set(0)
    )

    return spell
  }

  public Rp5 (amount: number) {
    const name = StatName(this.options.name || { enGB: 'rage per 5 sec.' }, amount)

    const spell = this.builder.Spell.add({
      name,
      id: this.options.prefix || 'rp5-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    spell.asset.Effects.clearAll()

    spell.asset.Effects.addMod(f => f
      .Aura.MOD_POWER_REGEN.set()
      .PowerType.set('RAGE')
      .PowerBase.set(amount)
      .PowerPerCombo.set(0)
      .PowerPerLevel.set(0)
      .PowerDieSides.set(0)
    )

    return spell
  }

  public Spirit (amount: number) {
    const name = StatName(this.options.name || { enGB: 'Spirit' }, amount)

    const spell = this.builder.Spell.add({
      name,
      id: this.options.prefix || 'spirit-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    spell.asset.Effects.clearAll()

    spell.asset.Effects.addMod(f => f
      .Aura.MOD_STAT.set()
      .Stat.SPIRIT.set()
      .PointsPerLevel.set(0)
      .PointsPerCombo.set(0)
      .PointsBase.set(amount)
      .PointsDieSides.set(0)
    )

    return spell
  }

  public Agility (amount: number) {
    const name = StatName(this.options.name || { enGB: 'Agility' }, amount)

    const spell = this.builder.Spell.add({
      name,
      id: this.options.prefix || 'agility-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    spell.asset.Effects.clearAll()

    spell.asset.Effects.addMod(f => f
      .Aura.MOD_STAT.set()
      .Stat.AGILITY.set()
      .PointsPerLevel.set(0)
      .PointsPerCombo.set(0)
      .PointsBase.set(amount)
      .PointsDieSides.set(0)
    )

    return spell
  }

  public Stamina (amount: number) {
    const name = StatName(this.options.name || { enGB: 'Stamina' }, amount)

    const spell = this.builder.Spell.add({
      name,
      id: this.options.prefix || 'stamina-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    spell.asset.Effects.clearAll()

    spell.asset.Effects.addMod(f => f
      .Aura.MOD_STAT.set()
      .Stat.STAMINA.set()
      .PointsPerLevel.set(0)
      .PointsPerCombo.set(0)
      .PointsBase.set(amount)
      .PointsDieSides.set(0)
    )

    return spell
  }

  public Strength (amount: number) {
    const name = StatName(this.options.name || { enGB: 'Strength' }, amount)

    const spell = this.builder.Spell.add({
      name,
      id: this.options.prefix || 'strength-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    spell.asset.Effects.clearAll()

    spell.asset.Effects.addMod(f => f
      .Aura.MOD_STAT.set()
      .Stat.STRENGTH.set()
      .PointsPerLevel.set(0)
      .PointsPerCombo.set(0)
      .PointsBase.set(amount)
      .PointsDieSides.set(0)
    )

    return spell
  }

  public Intellect (amount: number) {
    const name = StatName(this.options.name || { enGB: 'Intellect' }, amount)

    const spell = this.builder.Spell.add({
      name,
      id: this.options.prefix || 'intellect-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    spell.asset.Effects.clearAll()

    spell.asset.Effects.addMod(f => f
      .Aura.MOD_STAT.set()
      .Stat.INTELLECT.set()
      .PointsPerLevel.set(0)
      .PointsPerCombo.set(0)
      .PointsBase.set(amount)
      .PointsDieSides.set(0)
    )

    return spell
  }

  public Movespeed (amount: number) {
    const name = StatName(this.options.name || { enGB: 'Movespeed' }, amount)

    const spell = this.builder.Spell.add({
      name,
      id: this.options.prefix || 'movespeed-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    spell.asset.Effects.clearAll()

    spell.asset.Effects.addMod(f => f
      .Aura.MOD_INCREASE_SPEED.set()
      .AsEffect.get()
      .PointsBase.set(resolveSpeed(this.builder.baseSpeed, amount))
      .PointsPerLevel.set(0)
      .PointsPerCombo.set(0)
      .PointsDieSides.set(0)
    )

    return spell
  }

  public SpellPower (amount: number) {
    const name = StatName(this.options.name || { enGB: 'Spell Power' }, amount)

    const spell = this.builder.Spell.add({
      name,
      id: this.options.prefix || 'sp-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    spell.asset.Effects.clearAll()

    spell.asset.Effects.addMod(f => f
      .Aura.MOD_DAMAGE_DONE.set()
      .School.FIRE.set(1)
      .School.HOLY.set(1)
      .School.FROST.set(1)
      .School.ARCANE.set(1)
      .School.NATURE.set(1)
      .School.SHADOW.set(1)
      .DamagePctBase.set(amount)
      .DamagePctPerLevel.set(0)
      .DamagePctDieSides.set(0)
      .DamagePctPerCombo.set(0)
    )

    return spell
  }

  public AttackPower (amount: number) {
    const name = StatName(this.options.name || { enGB: 'Attack Power' }, amount)

    const spell = this.builder.Spell.add({
      name,
      id: this.options.prefix || 'ap-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    spell.asset.Effects.clearAll()

    spell.asset.Effects.addMod(f => f
      .Aura.MOD_DAMAGE_DONE.set()
      .School.PHYSICAL.set(1)
      .DamagePctBase.set(amount)
      .DamagePctPerLevel.set(0)
      .DamagePctDieSides.set(0)
      .DamagePctPerCombo.set(0)
    )

    return spell
  }

  public AllResist (amount: number) {
    const name = StatName(this.options.name || { enGB: 'All Resist' }, amount)

    const spell = this.builder.Spell.add({
      name,
      id: this.options.prefix || 'all-resist-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    spell.asset.Effects.clearAll()

    spell.asset.Effects.addMod(f => f
      .Aura.MOD_RESISTANCE.set()
      .Resistance.FIRE.set(1)
      .Resistance.HOLY.set(1)
      .Resistance.FROST.set(1)
      .Resistance.ARCANE.set(1)
      .Resistance.NATURE.set(1)
      .Resistance.SHADOW.set(1)
      .PointsDieSides.set(0)
      .PointsBase.set(0)
      .PointsPerLevel.set(0)
      .PointsPerCombo.set(0)
    )

    return spell
  }

  public FireResist (amount: number) {
    const name = StatName(this.options.name || { enGB: 'Fire Resist' }, amount)

    const spell = this.builder.Spell.add({
      name,
      id: this.options.prefix || 'fire-resist-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    spell.asset.Effects.clearAll()

    spell.asset.Effects.addMod(f => f
      .Aura.MOD_RESISTANCE.set()
      .Resistance.FIRE.set(1)
      .PointsDieSides.set(0)
      .PointsBase.set(0)
      .PointsPerLevel.set(0)
      .PointsPerCombo.set(0)
    )

    return spell
  }

  public FireDamage (amount: number) {
    const name = StatName(this.options.name || { enGB: 'Fire Damage' }, amount)

    const spell = this.builder.Spell.add({
      name,
      id: this.options.prefix || 'stat-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    spell.asset.Effects.clearAll()

    spell.asset.Effects.addMod(f => f
      .Aura.MOD_DAMAGE_DONE.set()
      .School.FIRE.set(1)
      .DamagePctBase.set(amount)
      .DamagePctPerLevel.set(0)
      .DamagePctDieSides.set(0)
      .DamagePctPerCombo.set(0)
    )

    return spell
  }

  public HolyResist (amount: number) {
    const name = StatName(this.options.name || { enGB: 'Holy Resist' }, amount)

    const spell = this.builder.Spell.add({
      name,
      id: this.options.prefix || 'holy-resist-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    spell.asset.Effects.clearAll()

    spell.asset.Effects.addMod(f => f
      .Aura.MOD_RESISTANCE.set()
      .Resistance.HOLY.set(1)
      .PointsDieSides.set(0)
      .PointsBase.set(0)
      .PointsPerLevel.set(0)
      .PointsPerCombo.set(0)
    )

    return spell
  }

  public HolyDamage (amount: number) {
    const name = StatName(this.options.name || { enGB: 'Holy Damage' }, amount)

    const spell = this.builder.Spell.add({
      name,
      id: this.options.prefix || 'holy-damage-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    spell.asset.Effects.clearAll()

    spell.asset.Effects.addMod(f => f
      .Aura.MOD_DAMAGE_DONE.set()
      .School.HOLY.set(1)
      .DamagePctBase.set(amount)
      .DamagePctPerLevel.set(0)
      .DamagePctDieSides.set(0)
      .DamagePctPerCombo.set(0)
    )


    return spell
  }

  public FrostResist (amount: number) {
    const name = StatName(this.options.name || { enGB: 'Frost Resist' }, amount)

    const spell = this.builder.Spell.add({
      name,
      id: this.options.prefix || 'frost-resist-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    spell.asset.Effects.clearAll()

    spell.asset.Effects.addMod(f => f
      .Aura.MOD_RESISTANCE.set()
      .Resistance.FROST.set(1)
      .PointsDieSides.set(0)
      .PointsBase.set(0)
      .PointsPerLevel.set(0)
      .PointsPerCombo.set(0)
    )

    return spell
  }

  public FrostDamage (amount: number) {
    const name = StatName(this.options.name || { enGB: 'Frost Damage' }, amount)

    const spell = this.builder.Spell.add({
      name,
      id: this.options.prefix || 'frost-damage-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    spell.asset.Effects.clearAll()

    spell.asset.Effects.addMod(f => f
      .Aura.MOD_DAMAGE_DONE.set()
      .School.FROST.set(1)
      .DamagePctBase.set(amount)
      .DamagePctPerLevel.set(0)
      .DamagePctDieSides.set(0)
      .DamagePctPerCombo.set(0)
    )

    return spell
  }

  public ArcaneResist (amount: number) {
    const name = StatName(this.options.name || { enGB: 'Arcane Resist' }, amount)

    const spell = this.builder.Spell.add({
      name,
      id: this.options.prefix || 'arcane-resist-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    spell.asset.Effects.clearAll()

    spell.asset.Effects.addMod(f => f
      .Aura.MOD_RESISTANCE.set()
      .Resistance.ARCANE.set(1)
      .PointsDieSides.set(0)
      .PointsBase.set(0)
      .PointsPerLevel.set(0)
      .PointsPerCombo.set(0)
    )

    return spell
  }

  public ArcaneDamage (amount: number) {
    const name = StatName(this.options.name || { enGB: 'Arcane Damage' }, amount)

    const spell = this.builder.Spell.add({
      name,
      id: this.options.prefix || 'arcane-damage-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    spell.asset.Effects.clearAll()

    spell.asset.Effects.addMod(f => f
      .Aura.MOD_DAMAGE_DONE.set()
      .School.ARCANE.set(1)
      .DamagePctBase.set(amount)
      .DamagePctPerLevel.set(0)
      .DamagePctDieSides.set(0)
      .DamagePctPerCombo.set(0)
    )

    return spell
  }

  public NatureResist (amount: number) {
    const name = StatName(this.options.name || { enGB: 'Nature Resist' }, amount)

    const spell = this.builder.Spell.add({
      name,
      id: this.options.prefix || 'nature-resist-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    spell.asset.Effects.clearAll()

    spell.asset.Effects.addMod(f => f
      .Aura.MOD_RESISTANCE.set()
      .Resistance.NATURE.set(1)
      .PointsDieSides.set(0)
      .PointsBase.set(0)
      .PointsPerLevel.set(0)
      .PointsPerCombo.set(0)
    )

    return spell
  }

  public NatureDamage (amount: number) {
    const name = StatName(this.options.name || { enGB: 'Nature Damage' }, amount)

    const spell = this.builder.Spell.add({
      name,
      id: this.options.prefix || 'nature-damage-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    spell.asset.Effects.clearAll()

    spell.asset.Effects.addMod(f => f
      .Aura.MOD_DAMAGE_DONE.set()
      .School.NATURE.set(1)
      .DamagePctBase.set(amount)
      .DamagePctPerLevel.set(0)
      .DamagePctDieSides.set(0)
      .DamagePctPerCombo.set(0)
    )

    return spell
  }

  public ShadowResist (amount: number) {
    const name = StatName(this.options.name || { enGB: 'Shadow Resist' }, amount)

    const spell = this.builder.Spell.add({
      name,
      id: this.options.prefix || 'shadow-resist-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    spell.asset.Effects.clearAll()

    spell.asset.Effects.addMod(f => f
      .Aura.MOD_RESISTANCE.set()
      .Resistance.SHADOW.set(1)
      .PointsDieSides.set(0)
      .PointsBase.set(0)
      .PointsPerLevel.set(0)
      .PointsPerCombo.set(0)
    )

    return spell
  }

  public ShadowDamage (amount: number) {
    const name = StatName(this.options.name || { enGB: 'Shadow Damage' }, amount)

    const spell = this.builder.Spell.add({
      name,
      id: this.options.prefix || 'shadow-damage-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    spell.asset.Effects.clearAll()

    spell.asset.Effects.addMod(f => f
      .Aura.MOD_DAMAGE_DONE.set()
      .School.SHADOW.set(1)
      .DamagePctBase.set(amount)
      .DamagePctPerLevel.set(0)
      .DamagePctDieSides.set(0)
      .DamagePctPerCombo.set(0)
    )

    return spell
  }

  public CriticalStrike (amount: number) {
    const name = StatName(this.options.name || { enGB: 'Critical Strike' }, amount, true)

    const spell = this.builder.Spell.add({
      name,
      id: this.options.prefix || 'critical-strike-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    spell.asset.Effects.clearAll()

    spell.asset.Effects.addMod(f => f
      .Aura.MOD_CRIT_PCT.set()
      .PercentBase.set(amount)
      .PercentPerLevel.set(0)
      .PercentDieSides.set(0)
      .PercentPerCombo.set(0)
    )

    return spell
  }

  public ArmorPenetration (amount: number) {
    const name = StatName(this.options.name || { enGB: 'Armor Penetration' }, amount)

    const spell = this.builder.Spell.add({
      name,
      id: this.options.prefix || 'armor-penetration-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    spell.asset.Effects.clearAll()

    spell.asset.Effects.addMod(f => f
      .Aura.MOD_TARGET_ARMOR_PCT.set()
      .PercentBase.set(amount)
      .PercentPerLevel.set(0)
      .PercentDieSides.set(0)
      .PercentPerCombo.set(0)
    )

    return spell
  }

  public SpellPenetration (amount: number) {
    const name = StatName(this.options.name || { enGB: 'Spell Penetration' }, amount)

    const spell = this.builder.Spell.add({
      name,
      id: this.options.prefix || 'spell-penetration-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    spell.asset.Effects.clearAll()

    spell.asset.Effects.addMod(f => f
      .Aura.MOD_TARGET_RESISTANCE.set()
      .Schools.FIRE.set(1)
      .Schools.HOLY.set(1)
      .Schools.FROST.set(1)
      .Schools.ARCANE.set(1)
      .Schools.NATURE.set(1)
      .Schools.SHADOW.set(1)
      .PointsBase.set(amount)
      .PointsPerLevel.set(0)
      .PointsDieSides.set(0)
      .PointsPerCombo.set(0)
    )

    return spell
  }

  public FirePenetration (amount: number) {
    const name = StatName(this.options.name || { enGB: 'Fire Penetration' }, amount)

    const spell = this.builder.Spell.add({
      name,
      id: this.options.prefix || 'fire-penetration-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    spell.asset.Effects.addMod(f => f
      .Aura.MOD_TARGET_RESISTANCE.set()
      .Schools.FIRE.set(1)
      .PointsBase.set(amount)
      .PointsPerLevel.set(0)
      .PointsDieSides.set(0)
      .PointsPerCombo.set(0)
    )

    return spell
  }

  public HolyPenetration (amount: number) {
    const name = StatName(this.options.name || { enGB: 'Holy Penetration' }, amount)

    const spell = this.builder.Spell.add({
      name,
      id: this.options.prefix || 'holy-penetration-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    spell.asset.Effects.addMod(f => f
      .Aura.MOD_TARGET_RESISTANCE.set()
      .Schools.HOLY.set(1)
      .PointsBase.set(amount)
      .PointsPerLevel.set(0)
      .PointsDieSides.set(0)
      .PointsPerCombo.set(0)
    )

    return spell
  }

  public FrostPenetration (amount: number) {
    const name = StatName(this.options.name || { enGB: 'Frost Penetration' }, amount)

    const spell = this.builder.Spell.add({
      name,
      id: this.options.prefix || 'frost-penetration-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    spell.asset.Effects.addMod(f => f
      .Aura.MOD_TARGET_RESISTANCE.set()
      .Schools.FROST.set(1)
      .PointsBase.set(amount)
      .PointsPerLevel.set(0)
      .PointsDieSides.set(0)
      .PointsPerCombo.set(0)
    )

    return spell
  }

  public ArcanePenetration (amount: number) {
    const name = StatName(this.options.name || { enGB: 'Arcane Penetration' }, amount)

    const spell = this.builder.Spell.add({
      name,
      id: this.options.prefix || 'arcane-penetration-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    spell.asset.Effects.addMod(f => f
      .Aura.MOD_TARGET_RESISTANCE.set()
      .Schools.ARCANE.set(1)
      .PointsBase.set(amount)
      .PointsPerLevel.set(0)
      .PointsDieSides.set(0)
      .PointsPerCombo.set(0)
    )

    return spell
  }

  public NaturePenetration (amount: number) {
    const name = StatName(this.options.name || { enGB: 'Nature Penetration' }, amount)

    const spell = this.builder.Spell.add({
      name,
      id: this.options.prefix || 'nature-penetration-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    spell.asset.Effects.addMod(f => f
      .Aura.MOD_TARGET_RESISTANCE.set()
      .Schools.NATURE.set(1)
      .PointsBase.set(amount)
      .PointsPerLevel.set(0)
      .PointsDieSides.set(0)
      .PointsPerCombo.set(0)
    )

    return spell
  }

  public ShadowPenetration (amount: number) {
    const name = StatName(this.options.name || { enGB: 'Shadow Penetration' }, amount)

    const spell = this.builder.Spell.add({
      name,
      id: this.options.prefix || 'shadow-penetration-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    spell.asset.Effects.addMod(f => f
      .Aura.MOD_TARGET_RESISTANCE.set()
      .Schools.SHADOW.set(1)
      .PointsBase.set(amount)
      .PointsPerLevel.set(0)
      .PointsDieSides.set(0)
      .PointsPerCombo.set(0)
    )

    return spell
  }
}

// fire strike proc
// base: 16614,
// description: `+${i} Fire Strike`,
// auraDescription: `+${i} Fire Strike`,
// id: `fire-strike-proc-${i}`,
// name: 'Fire Strike',
// fn: spell =>
//   spell.asset
//     .Effects.clearAll()
//     .Range.HostileMin.set(0)
//     .Range.HostileMax.set(30)
//     .SchoolMask.clearAll()
//     .SchoolMask.Fire.mark()
//     .Effects.add()
//     .EffectType.setSchoolDamage()
//     .BaseDamage.set(i)
//     .DamagePerCombo.set(0)
//     .DamagePerLevel.set(0)
//     .RandomDamage.set(0)
//     .end
//     .Visual.clear()

// fire strike
// base: 16615,
// description: `+${i} Fire Strike`,
// auraDescription: `+${i} Fire Strike`,
// id: `fire-strike-${i}`,
// name: `+${i} Fire Strike`,
// fn: spell =>
//   spell.asset
//     .Effects.clearAll()
//     .Effects.add()
//     .EffectType.setApplyAura().end
//     .AuraType.setProcTriggerSpell.add()
//     .TriggeredSpell.add.set($.spells[`fire-strike-proc-${i}`].asset.ID)
//     .TargetA.setDestTargetEnemy()
//
