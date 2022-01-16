import { noop } from 'nextgen-events'
import { Spell as TSSpell } from 'tswow-stdlib/Spell/Spell'
import { SpellEffect } from 'tswow-stdlib/Spell/SpellEffect'
import { Asset, AssetOptions } from '../asset'

import { CREATE_STAT_TASK } from '../constants'
import { Builder } from '../index'
import { NWSpell } from '../spell'
import { NWTask, TaskOptions, Template } from '../task'
import { Nil, School, TSText } from '../types'
import { capitalize, identity, resolveSpeed, times } from '../utils'

const STAT_BASE = 26283

export type STAT_TYPE =
  | Nil
  | 'MP5'
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

export function StatName (text: string, amount: number) {
  return `+${amount} ${text}`
}

export class CreateStat extends NWTask {
  static readonly id = CREATE_STAT_TASK

  async process (template: StatTemplate) {
    // if (template.options.type)
    //   await fn(this.builder, (template.options as Stat))
  }
}

export interface CreateStatOptions extends TaskOptions {
  id: typeof CREATE_STAT_TASK
}

export class Helper {
  constructor (public options: StatOptions, public builder: Builder) {}

  async run () {
    const { type } = this.options

    switch (type) {
      case 'HP5':
        await this.create(this.Hp5)
        break
      case 'MP5':
        await this.create(this.Mp5)
        break
      case 'SPIRIT':
        await this.create(this.Spirit)
        break
      case 'AGILITY':
        await this.create(this.Agility)
        break
      case 'STAMINA':
        await this.create(this.Stamina)
        break
      case 'STRENGTH':
        await this.create(this.Strength)
        break
      case 'INTELLECT':
        await this.create(this.Intellect)
        break
      case 'MOVESPEED':
        await this.create(this.Movespeed)
        break
      case 'SPELL-POWER':
        await this.create(this.Hp5)
        break
      case 'ATTACK-POWER':
        await this.create(this.SpellPower)
        break
      case 'ALL-RESIST':
        await this.create(this.AllResist)
        break
      case 'FIRE-DAMAGE':
        await this.create(this.FireDamage)
        break
      case 'FIRE-RESIST':
        await this.create(this.FireResist)
        break
      case 'HOLY-DAMAGE':
        await this.create(this.HolyDamage)
        break
      case 'HOLY-RESIST':
        await this.create(this.HolyResist)
        break
      case 'FROST-DAMAGE':
        await this.create(this.FrostDamage)
        break
      case 'FROST-RESIST':
        await this.create(this.FrostResist)
        break
      case 'ARCANE-DAMAGE':
        await this.create(this.ArcaneDamage)
        break
      case 'ARCANE-RESIST':
        await this.create(this.ArcaneResist)
        break
      case 'NATURE-DAMAGE':
        await this.create(this.NatureDamage)
        break
      case 'NATURE-RESIST':
        await this.create(this.NatureResist)
        break
      case 'SHADOW-DAMAGE':
        await this.create(this.ShadowDamage)
        break
      case 'SHADOW-RESIST':
        await this.create(this.ShadowResist)
        break
      case 'CRITICAL-STRIKE':
        await this.create(this.CriticalStrike)
        break
      case 'ARMOR-PENETRATION':
        await this.create(this.ArmorPenetration)
        break
      case 'SPELL-PENETRATION':
        await this.create(this.SpellPenetration)
        break
      default:
        await this.create()
        break
    }
  }

  public async create (Creator: (amount: number) => Promise<NWSpell> = this.Default) {
    // TODO: perform for loop here
    // TODO: pass fns into here (strength, criticalStrike, etc)
    for (let i of times(this.options.max)) {
      if (this.options.min && (i <= this.options.min))
        continue

      const $ = this.builder
      const id = (this.options.prefix || 'stat-') + i
      const name =  (this.options.name || { enGB: 'Stat' })

      const spell = await Creator(i)
      spell.asset.Effects.clearAll()

      return spell
    }
  }

  public async Default (amount: number) {
    const name = StatName(this.options.name || { enGB: 'Stat' }, amount)

    return await this.builder.Spell.add({
      name,
      id: (this.options.prefix || 'stat-') + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })
  }

  public async Hp5 (amount: number) {
    const name = StatName(this.options.name || { enGB: 'health per 5 sec.' }, amount)

    const spell = await this.builder.Spell.add({
      name,
      id: this.options.prefix || 'hp5-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    spell.asset.Effects.get(0)
      .Aura.MOD_HEALTH_REGEN_IN_COMBAT.set()
      .PointsPerLevel.set(0)
      .PointsPerCombo.set(0)
      .PointsBase.set(amount)

    return spell
  }

  public async Mp5 (amount: number) {
    const name = StatName(this.options.name || { enGB: 'mana per 5 sec.' }, amount)

    const spell = await this.builder.Spell.add({
      name,
      id: this.options.prefix || 'mp5-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    spell.asset.Effects.get(0)
      .Aura.MOD_POWER_REGEN.set()
      .PowerType.set('MANA')
      .PowerBase.set(amount)
      .PowerPerCombo.set(0)
      .PowerPerLevel.set(0)

    return spell
  }

  public async Ep5 (amount: number) {
    const name = StatName(this.options.name || { enGB: 'energy per 5 sec.' }, amount)

    const spell = await this.builder.Spell.add({
      name,
      id: this.options.prefix || 'ep5-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    spell.asset.Effects.get(0)
      .Aura.MOD_POWER_REGEN.set()
      .PowerType.set('ENERGY')
      .PowerBase.set(amount)
      .PowerPerCombo.set(0)
      .PowerPerLevel.set(0)

    return spell
  }

  public async Rp5 (amount: number) {
    const name = StatName(this.options.name || { enGB: 'rage per 5 sec.' }, amount)

    const spell = await this.builder.Spell.add({
      name,
      id: this.options.prefix || 'rp5-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    spell.asset.Effects.get(0)
      .Aura.MOD_POWER_REGEN.set()
      .PowerType.set('RAGE')
      .PowerBase.set(amount)
      .PowerPerCombo.set(0)
      .PowerPerLevel.set(0)

    return spell
  }

  public async Spirit (amount: number) {
    const name = StatName(this.options.name || { enGB: 'Spirit' }, amount)

    const spell = await this.builder.Spell.add({
      name,
      id: this.options.prefix || 'spirit-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    return spell
  }

  public async Agility (amount: number) {
    const name = StatName(this.options.name || { enGB: 'Agility' }, amount)

    const spell = await this.builder.Spell.add({
      name,
      id: this.options.prefix || 'agility-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    return spell
  }

  public async Stamina (amount: number) {
    const name = StatName(this.options.name || { enGB: 'Stamina' }, amount)

    const spell = await this.builder.Spell.add({
      name,
      id: this.options.prefix || 'stamina-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    return spell
  }

  public async Strength (amount: number) {
    const name = StatName(this.options.name || { enGB: 'Strength' }, amount)

    const spell = await this.builder.Spell.add({
      name,
      id: this.options.prefix || 'strength-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    return spell
  }

  public async Intellect (amount: number) {
    const name = StatName(this.options.name || { enGB: 'Intellect' }, amount)

    const spell = await this.builder.Spell.add({
      name,
      id: this.options.prefix || 'intellect-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    return spell
  }

  public async Movespeed (amount: number) {
    const name = StatName(this.options.name || { enGB: 'Movespeed' }, amount)

    const spell = await this.builder.Spell.add({
      name,
      id: this.options.prefix || 'movespeed-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    return spell
  }

  public async SpellPower (amount: number) {
    const name = StatName(this.options.name || { enGB: 'Spell Power' }, amount)

    const spell = await this.builder.Spell.add({
      name,
      id: this.options.prefix || 'sp-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    return spell
  }

  public async AttackPower (amount: number) {
    const name = StatName(this.options.name || { enGB: 'Attack Power' }, amount)

    const spell = await this.builder.Spell.add({
      name,
      id: this.options.prefix || 'ap-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    return spell
  }

  public async AllResist (amount: number) {
    const name = StatName(this.options.name || { enGB: 'All Resist' }, amount)

    const spell = await this.builder.Spell.add({
      name,
      id: this.options.prefix || 'all-resist-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    return spell
  }

  public async FireResist (amount: number) {
    const name = StatName(this.options.name || { enGB: 'Fire Resist' }, amount)

    const spell = await this.builder.Spell.add({
      name,
      id: this.options.prefix || 'fire-resist-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    return spell
  }

  public async FireDamage (amount: number) {
    const name = StatName(this.options.name || { enGB: 'Fire Damage' }, amount)

    const spell = await this.builder.Spell.add({
      name,
      id: this.options.prefix || 'stat-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    return spell
  }

  public async HolyResist (amount: number) {
    const name = StatName(this.options.name || { enGB: 'Holy Resist' }, amount)

    const spell = await this.builder.Spell.add({
      name,
      id: this.options.prefix || 'holy-resist-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    return spell
  }

  public async HolyDamage (amount: number) {
    const name = StatName(this.options.name || { enGB: 'Holy Damage' }, amount)

    const spell = await this.builder.Spell.add({
      name,
      id: this.options.prefix || 'holy-damage-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    return spell
  }

  public async FrostResist (amount: number) {
    const name = StatName(this.options.name || { enGB: 'Frost Resist' }, amount)

    const spell = await this.builder.Spell.add({
      name,
      id: this.options.prefix || 'frost-resist-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    return spell
  }

  public async FrostDamage (amount: number) {
    const name = StatName(this.options.name || { enGB: 'Frost Damage' }, amount)

    const spell = await this.builder.Spell.add({
      name,
      id: this.options.prefix || 'frost-damage-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    return spell
  }

  public async ArcaneResist (amount: number) {
    const name = StatName(this.options.name || { enGB: 'Arcane Resist' }, amount)

    const spell = await this.builder.Spell.add({
      name,
      id: this.options.prefix || 'arcane-resist-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    return spell
  }

  public async ArcaneDamage (amount: number) {
    const name = StatName(this.options.name || { enGB: 'Arcane Damage' }, amount)

    const spell = await this.builder.Spell.add({
      name,
      id: this.options.prefix || 'arcane-damage-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    return spell
  }

  public async NatureResist (amount: number) {
    const name = StatName(this.options.name || { enGB: 'Nature Resist' }, amount)

    const spell = await this.builder.Spell.add({
      name,
      id: this.options.prefix || 'nature-resist-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    return spell
  }

  public async NatureDamage (amount: number) {
    const name = StatName(this.options.name || { enGB: 'Nature Damage' }, amount)

    const spell = await this.builder.Spell.add({
      name,
      id: this.options.prefix || 'nature-damage-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    return spell
  }

  public async ShadowResist (amount: number) {
    const name = StatName(this.options.name || { enGB: 'Shadow Resist' }, amount)

    const spell = await this.builder.Spell.add({
      name,
      id: this.options.prefix || 'shadow-resist-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    return spell
  }

  public async ShadowDamage (amount: number) {
    const name = StatName(this.options.name || { enGB: 'Shadow Damage' }, amount)

    const spell = await this.builder.Spell.add({
      name,
      id: this.options.prefix || 'shadow-damage-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    return spell
  }

  public async CriticalStrike (amount: number) {
    const name = StatName(this.options.name || { enGB: '% Critical Strike' }, amount)

    const spell = await this.builder.Spell.add({
      name,
      id: this.options.prefix || 'critical-strike-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    return spell
  }

  public async ArmorPenetration (amount: number) {
    const name = StatName(this.options.name || { enGB: 'Armor Penetration' }, amount)

    const spell = await this.builder.Spell.add({
      name,
      id: this.options.prefix || 'armor-penetration-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    return spell
  }

  public async SpellPenetration (amount: number) {
    const name = StatName(this.options.name || { enGB: 'Spell Penetration' }, amount)

    const spell = await this.builder.Spell.add({
      name,
      id: this.options.prefix || 'spell-penetration-' + amount,
      base: STAT_BASE,
      description: name,
      auraDescription: name,
    })

    return spell
  }
}

// async function fn ($: Builder, stat: Stat) {
//   const { type } = stat

//   const min = stat.min || 1
//   const max = stat.max || 0

//   let spell: NWSpell
//   let name: TSText
//   let prefix: string
//   let id: string
//   let effect: SpellEffect

//   for (let i = min; i <= max; i++) {
//     switch (type) {
//       case 'spell-pen':
//         name = (stat.nameFn || statNameFn('Spell Penetration'))(i)
//         prefix = stat.prefix || 'spell-pen-'
//         id = prefix + i

//         spell = await $.Spell.add({
//           id,
//           name,
//           base: 26283,
//           description: name,
//           auraDescription: name,
//         })

//         spell.asset.Effects.clearAll()

//         spell.asset.Effects.get(spell.asset.Effects.length - 1)
//           .Aura.MOD_TARGET_RESISTANCE.set()
//           .PointsPerLevel.set(0)
//           .PointsPerCombo.set(0)
//           .PointsBase.set(i)

//         break
//       case 'hp5':
//         name = (stat.nameFn || statNameFn('health per 5 sec.'))(i)
//         prefix = stat.prefix || 'hp5-'
//         id = prefix + i

//         spell = await $.Spell.add({
//           id,
//           name,
//           base: 32703,
//           description: name,
//           auraDescription: name,
//         })

//         spell.asset.Effects.clearAll()

//         spell.asset.Effects.get(0)
//           .Aura.MOD_HEALTH_REGEN_IN_COMBAT.set()
//           .PointsPerLevel.set(0)
//           .PointsPerCombo.set(0)
//           .PointsBase.set(i)
//         break
//       case 'movespeed':
//         name = (stat.nameFn || statNameFn('Movespeed'))(i)
//         prefix = stat.prefix || 'movepseed-'
//         id = prefix + i

//         spell = await $.Spell.add({
//           id,
//           name,
//           base: 24090,
//           description: name,
//           auraDescription: name,
//         })

//         spell.asset.Effects.clearAll()

//         spell.asset.Effects.get(0)
//           .Aura.MOD_INCREASE_SPEED.set()
//           .AsEffect.get()
//           .PointsBase.set(resolveSpeed($.baseSpeed, i))
//           .PointsPerLevel.set(0)
//           .PointsPerCombo.set(0)

//         break
//       case 'spell-dmg':
//         const school = stat.school || 'fire'

//         name = (stat.nameFn || statNameFn(`${capitalize(school)} Spell Damage`))(i)
//         prefix = stat.prefix || `${school}-dmg-`
//         id = prefix + i

//         spell = await $.Spell.add({
//           id,
//           name,
//           base: 7684,
//           description: name,
//           auraDescription: name,
//         })

//         spell.asset.Effects.clearAll()

//         effect = spell.asset.Effects.get(0)

//         effect
//           .PointsPerLevel.set(0)
//           .PointsPerCombo.set(0)
//           .PointsBase.set(i)

//         const mask = effect
//           .Aura.MOD_DAMAGE_DONE.set()
//           .School

//         switch (school) {
//           case 'fire':
//             mask.FIRE.set(true)
//             break;
//           case 'frost':
//             mask.FROST.set(true)
//             break;
//           case 'nature':
//             mask.NATURE.set(true)
//             break;
//           case 'Shadow':
//             mask.SHADOW.set(true)
//             break;
//           case 'Holy':
//             mask.HOLY.set(true)
//             break;
//           case 'Arcane':
//             mask.ARCANE.set(true)
//             break;
//         }

//         break
//       case 'spell':
//         name = (stat.nameFn || statNameFn('Spell Penetration'))(i)
//         prefix = stat.prefix || 'spell-pen-'
//         id = prefix + i

//         spell = await $.Spell.add({
//           id,
//           name,
//           base: 26283,
//           description: name,
//           auraDescription: name,
//         })

//         spell.asset.Effects.clearAll()

//         effect = spell.asset.Effects.get(0)

//         // FIXME

//         break
//       case 'proc':
//         name = (stat.nameFn || statNameFn('Spell Penetration'))(i)
//         prefix = stat.prefix || 'spell-pen-'
//         id = prefix + i

//         spell = await $.Spell.add({
//           id,
//           name,
//           base: 16615,
//           description: name,
//           auraDescription: name,
//         })

//         spell.asset.Effects.clearAll()

//         effect = spell.asset.Effects.get(0)

//         // FIXME

//         break
//     }
//   }
// }

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
