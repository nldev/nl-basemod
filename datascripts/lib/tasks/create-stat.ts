import { Spell as TSSpell } from 'tswow-stdlib/Spell/Spell'
import { SpellEffect } from 'tswow-stdlib/Spell/SpellEffect'
import { Asset, AssetOptions } from '../asset'

import { CREATE_STAT_TASK } from '../constants'
import { Builder } from '../index'
import { NWSpell } from '../spell'
import { NWTask, TaskOptions, Template } from '../task'
import { Nil, School, TSText } from '../types'
import { capitalize, resolveSpeed, times } from '../utils'

export type STAT_TYPE = Nil
  | 'MP5'
  | 'HP5'
  | 'ARMOR'
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

export type StatNameFn = (index: number) => TSText

export type StatOptions = Exclude<AssetOptions<Stat>, 'spells'>

export interface StatTemplate extends Template {
  id: typeof CREATE_STAT_TASK
  options: StatOptions
}

export function statNameFn (text: string) {
  return (i: number) => `+${i} ${text}`
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
    const { type, stacks = 255 } = this.options

    for (let i of times(stacks)) {
      switch (type) {
        case 'HP5':
          this.hp5()
          break
        case 'MP5':
          this.mp5()
          break
        case 'ARMOR':
          this.armor()
          break
        case 'SPIRIT':
          this.spirit()
          break
        case 'AGILITY':
          this.agility()
          break
        case 'STAMINA':
          this.stamina()
          break
        case 'STRENGTH':
          this.strength()
          break
        case 'INTELLECT':
          this.intellect()
          break
        case 'MOVESPEED':
          this.movespeed()
          break
        case 'SPELL-POWER':
          this.hp5()
          break
        case 'ATTACK-POWER':
          this.spellPower()
          break
        case 'ALL-RESIST':
          this.allResist()
          break
        case 'FIRE-DAMAGE':
          this.fireDamage()
          break
        case 'FIRE-RESIST':
          this.fireResist()
          break
        case 'HOLY-DAMAGE':
          this.holyDamage()
          break
        case 'HOLY-RESIST':
          this.holyResist()
          break
        case 'FROST-DAMAGE':
          this.frostDamage()
          break
        case 'FROST-RESIST':
          this.frostResist()
          break
        case 'ARCANE-DAMAGE':
          this.arcaneDamage()
          break
        case 'ARCANE-RESIST':
          this.arcaneResist()
          break
        case 'NATURE-DAMAGE':
          this.natureDamage()
          break
        case 'NATURE-RESIST':
          this.natureResist()
          break
        case 'SHADOW-DAMAGE':
          this.shadowDamage()
          break
        case 'SHADOW-RESIST':
          this.shadowResist()
          break
        case 'CRITICAL-STRIKE':
          this.criticalStrike()
          break
        case 'ARMOR-PENETRATION':
          this.armorPenetration()
          break
        case 'SPELL-PENETRATION':
          this.spellPenetration()
          break
        default:
          await this.create(0)
          break
      }
    }
  }

  public async hp5 () {
  }

  public async mp5 () {
  }

  public async armor () {
  }

  public async spirit () {
  }

  public async agility () {
  }

  public async stamina () {
  }

  public async strength () {
  }

  public async intellect () {
  }

  public async movespeed () {
  }

  public async spellPower () {
  }

  public async attackPower () {
  }

  public async allResist () {
  }

  public async fireResist () {
  }

  public async fireDamage () {
  }

  public async holyResist () {
  }

  public async holyDamage () {
  }

  public async frostResist () {
  }

  public async frostDamage () {
  }

  public async arcaneResist () {
  }

  public async arcaneDamage () {
  }

  public async natureResist () {
  }

  public async natureDamage () {
  }

  public async shadowResist () {
  }

  public async shadowDamage () {
  }

  public async criticalStrike () {
  }

  public async armorPenetration () {
  }

  public async spellPenetration () {
  }

  public async create (index: number) {
    // TODO: perform for loop here
    // TODO: pass fns into here (strength, criticalStrike, etc)
    const $ = this.builder
    const id = (this.options.prefix || 'stat-') + index
    const name =  (this.options.name || { enGB: 'Stat' })

    const spell = await $.Spell.add({
      id,
      name,
      base: 26283,
      description: name,
      auraDescription: name,
    })

    spell.asset.Effects.clearAll()
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
