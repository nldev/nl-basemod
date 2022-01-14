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
  constructor (public stat: Stat) {}

  async run () {
    const { type, stacks = 255 } = this.stat

    for (let i of times(stacks)) {
      switch (type) {
        case 'HP5':
          this.hp5(this.stat)
          break
        case 'MP5':
          this.mp5(this.stat)
          break
        case 'ARMOR':
          this.armor(this.stat)
          break
        case 'SPIRIT':
          this.spirit(this.stat)
          break
        case 'AGILITY':
          this.agility(this.stat)
          break
        case 'STAMINA':
          this.stamina(this.stat)
          break
        case 'STRENGTH':
          this.strength(this.stat)
          break
        case 'INTELLECT':
          this.intellect(this.stat)
          break
        case 'MOVESPEED':
          this.movespeed(this.stat)
          break
        case 'SPELL-POWER':
          this.hp5(this.stat)
          break
        case 'ATTACK-POWER':
          this.spellPower(this.stat)
          break
        case 'ALL-RESIST':
          this.allResist(this.stat)
          break
        case 'FIRE-DAMAGE':
          this.fireDamage(this.stat)
          break
        case 'FIRE-RESIST':
          this.fireResist(this.stat)
          break
        case 'HOLY-DAMAGE':
          this.holyDamage(this.stat)
          break
        case 'HOLY-RESIST':
          this.holyResist(this.stat)
          break
        case 'FROST-DAMAGE':
          this.frostDamage(this.stat)
          break
        case 'FROST-RESIST':
          this.frostResist(this.stat)
          break
        case 'ARCANE-DAMAGE':
          this.arcaneDamage(this.stat)
          break
        case 'ARCANE-RESIST':
          this.arcaneResist(this.stat)
          break
        case 'NATURE-DAMAGE':
          this.natureDamage(this.stat)
          break
        case 'NATURE-RESIST':
          this.natureResist(this.stat)
          break
        case 'SHADOW-DAMAGE':
          this.shadowDamage(this.stat)
          break
        case 'SHADOW-RESIST':
          this.shadowResist(this.stat)
          break
        case 'CRITICAL-STRIKE':
          this.criticalStrike(this.stat)
          break
        case 'ARMOR-PENETRATION':
          this.armorPenetration(this.stat)
          break
        case 'SPELL-PENETRATION':
          this.spellPenetration(this.stat)
          break
        default:
          this.create(this.stat)
          break
      }
    }
  }

  public create (s: Stat) {
  }

  public hp5 (s: Stat) {
  }

  public mp5 (s: Stat) {
  }

  public armor (s: Stat) {
  }

  public spirit (s: Stat) {
  }

  public agility (s: Stat) {
  }

  public stamina (s: Stat) {
  }

  public strength (s: Stat) {
  }

  public intellect (s: Stat) {
  }

  public movespeed (s: Stat) {
  }

  public spellPower (s: Stat) {
  }

  public attackPower (s: Stat) {
  }

  public allResist (s: Stat) {
  }

  public fireResist (s: Stat) {
  }

  public fireDamage (s: Stat) {
  }

  public holyResist (s: Stat) {
  }

  public holyDamage (s: Stat) {
  }

  public frostResist (s: Stat) {
  }

  public frostDamage (s: Stat) {
  }

  public arcaneResist (s: Stat) {
  }

  public arcaneDamage (s: Stat) {
  }

  public natureResist (s: Stat) {
  }

  public natureDamage (s: Stat) {
  }

  public shadowResist (s: Stat) {
  }

  public shadowDamage (s: Stat) {
  }

  public criticalStrike (s: Stat) {
  }

  public armorPenetration (s: Stat) {
  }

  public spellPenetration (s: Stat) {
  }
}

async function fn (stat: Stat) {
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
