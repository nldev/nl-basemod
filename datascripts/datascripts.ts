import { std } from 'wow/wotlk'
import { Builder } from './lib'
import { CLASS_IDS, RACE_IDS } from './lib/constants'
import { resolveDuration } from './lib/utils'
import * as fs from 'fs'
const STATS: any = {
  1: {
    mpMax: 0,
    mpMin: 0,
    hpMax: 1689,
    hpMin: 839,
    strMax: 128,
    strMin: 98,
    agiMax: 87,
    agiMin: 68,
    staMax: 116,
    staMin: 88,
    intMax: 34,
    intMin: 30,
    spiMax: 50,
    spiMin: 40,
  },
  2: {
    mpMax: 1512,
    mpMin: 1137,
    hpMax: 1381,
    hpMin: 786,
    strMax: 109,
    strMin: 83,
    agiMax: 68,
    agiMin: 54,
    staMax: 105,
    staMin: 81,
    intMax: 75,
    intMin: 59,
    spiMax: 78,
    spiMin: 61,
  },
  3: {
    mpMax: 1720,
    mpMin: 1270,
    hpMax: 1467,
    hpMin: 842,
    strMax: 61,
    strMin: 49,
    agiMax: 133,
    agiMin: 101,
    staMax: 95,
    staMin: 73,
    intMax: 70,
    intMin: 56,
    spiMax: 74,
    spiMin: 58,
  },
  4: {
    mpMax: 0,
    mpMin: 0,
    hpMax: 1523,
    hpMin: 878,
    strMax: 84,
    strMin: 66,
    agiMax: 139,
    agiMin: 105,
    staMax: 79,
    staMin: 62,
    intMax: 39,
    intMin: 34,
    spiMax: 54,
    spiMin: 44,
  },
  5: {
    mpMax: 1376,
    mpMin: 1046,
    hpMax: 1397,
    hpMin: 792,
    strMax: 36,
    strMin: 32,
    agiMax: 45,
    agiMin: 38,
    staMax: 54,
    staMin: 44,
    intMax: 127,
    intMin: 96,
    spiMax: 133,
    spiMin: 101,
  },
  6: {
    mpMax: 1,
    mpMin: 1,
    hpMax: 1,
    hpMin: 1,
    strMax: 1,
    strMin: 1,
    agiMax: 1,
    agiMin: 1,
    staMax: 1,
    staMin: 1,
    intMax: 1,
    intMin: 1,
    spiMax: 1,
    spiMin: 1,
  },
  7: {
    mpMax: 1520,
    mpMin: 760,
    hpMax: 1423,
    hpMin: 1115,
    strMax: 92,
    strMin: 72,
    agiMax: 58,
    agiMin: 46,
    staMax: 99,
    staMin: 76,
    intMax: 93,
    intMin: 71,
    spiMax: 105,
    spiMin: 81,
  },
  8: {
    mpMax: 1213,
    mpMin: 958,
    hpMax: 1370,
    hpMin: 775,
    strMax: 31,
    strMin: 27,
    agiMax: 38,
    agiMin: 33,
    staMax: 46,
    staMin: 38,
    intMax: 132,
    intMin: 100,
    spiMax: 128,
    spiMin: 97,
  },
  9: {
    mpMax: 1373,
    mpMin: 1043,
    hpMax: 1414,
    hpMin: 799,
    strMax: 48,
    strMin: 40,
    agiMax: 51,
    agiMin: 44,
    staMax: 68,
    staMin: 54,
    intMax: 117,
    intMin: 89,
    spiMax: 116,
    spiMin: 89,
  },
  11: {
    mpMax: 1244,
    mpMin: 959,
    hpMax: 1483,
    hpMin: 858,
    strMax: 71,
    strMin: 57,
    agiMax: 66,
    agiMin: 53,
    staMax: 70,
    staMin: 57,
    intMax: 102,
    intMin: 78,
    spiMax: 113,
    spiMin: 87,
  },
}

// FIXME: move this
function CreatePlaceholderEnchants () {
  const special = std.DBC.SpellItemEnchantment.add(9999)
  special.Name.enGB.set('[special]')
  special.Flags.set(0)
  special.Effect.set([0, 0, 0, 0, 0])
  special.ItemVisual.set(0)
  for (let i = 0; i <= 99999; i++) {
    const enchant = std.DBC.SpellItemEnchantment.add(9996 + i)
    const prop = std.DBC.ItemRandomProperties.add(10000 + i)
    enchant.Name.enGB.set('[placeholder ' + i + ']')
    enchant.Flags.set(0)
    enchant.Effect.set([0, 0, 0, 0, 0])
    enchant.ItemVisual.set(0)
    prop.Name.set('')
    prop.Name2.enGB.set('')
    prop.Enchantment.set([i])
  }
}

CreatePlaceholderEnchants()

// ability
// passive
// utility

// FIXME: move this
function StarterSpells ($: Builder) {
  const ability = $.std.DBC.SkillLine.add(9000)
  const passive = $.std.DBC.SkillLine.add(9001)
  const utility = $.std.DBC.SkillLine.add(9002)
  ability.DisplayName.enGB.set('Ability')
  passive.DisplayName.enGB.set('Passive')
  utility.DisplayName.enGB.set('Utility')
  $.std.Spells.load(5938).SkillLines.clearClass('ROGUE')
  $.std.Spells.load(5938).SkillLines.enable('ROGUE', 'GNOME')
  $.std.Spells.load(5938).SkillLines.add(9000)
  $.std.DBC.SkillLineAbility.add(90000, {
    Spell: 5938,
    RaceMask: 1791,
    ClassMask: 8,
    AcquireMethod: 2,
    SkillLine: 9000,
  })
  $.std.DBC.SkillLineAbility.queryAll({}).forEach(v => v.CharacterPoints)
  // console.log('skill line abilities')
  // $.std.DBC.SkillLineAbility.queryAll({}).forEach(v => {
  //   const spell = $.std.Spells.load(v.Spell.get())
  //   if (spell && spell.Name && spell.Name.enGB)
  //     console.log(spell.Name.enGB.get())
  // })

  // console.log('skill lines')
  // $.std.DBC.SkillLine.queryAll({}).forEach(v => console.log(v.DisplayName.enGB.get()))
}

// ---

function main () {
  const $ = new Builder()
  // FIXME: give weapon skills
  // FIXME: set config to max weapon skills

  $.init()
  StarterSpells($)

  const b = $.std.Items.load(2504)
  b.Name.enGB.set('Bow')
  b.Damage.clearAll()
  b.Damage.addPhysical(25, 42)
  b.Delay.set(1700)
  b.ItemLevel.set(5)
  b.AmmoType.NONE.set()
  b.Durability.set(0)
  b.Spells.addMod(i => {
    i.Spell.set(46699)
    i.Trigger.ON_EQUIP.set()
    i.Charges.set('UNLIMITED')
  })
  const g = $.std.Items.load(2508)
  g.Durability.set(0)
  g.Name.enGB.set('Gun')
  g.Damage.clearAll()
  g.Damage.addPhysical(25, 42)
  g.Delay.set(1700)
  g.ItemLevel.set(5)
  g.AmmoType.NONE.set()
  g.Spells.addMod(i => {
    i.Spell.set(46699)
    i.Trigger.ON_EQUIP.set()
    i.Charges.set('UNLIMITED')
  })
  $.std.Spells.load(46699)
    .Description.enGB.set('')

  const zeal = $.Spell.add({
    id: 'zeal',
    name: 'Zeal',
    base: 2983,
  })

  zeal.asset.Effects.get(0)
    .Type.APPLY_AURA.set()
    .Aura.MOD_MINIMUM_SPEED.set()
    .PercentBase.set(300)

  zeal.asset.Effects.addMod(effect => effect
    .Type.APPLY_AURA.set()
    .Aura.MOD_PACIFY_SILENCE.set()
    .ImplicitTargetA.UNIT_CASTER.set()
  )

  zeal.asset.Attributes.IGNORE_IMMUNE_FLAGS.set(1)
  zeal.asset.Duration.setSimple(resolveDuration(0.5), 0, resolveDuration(1))
  zeal.asset.Cooldown.set(0, 0, 0, 0)

  zeal.asset.Power.setMana(0, 50, 0, 0 ,0)

  const visual = zeal.asset.Visual.getRef()
  visual.StateKit.getRef().clear()

  // TODO: hunter spell - disappear hunter + control pet + random facing corpse spawn

  const map = $.std.Maps.create($.mod, 'dev').Directory.set('dev')

  map.Expansion.set(0)
  map.Name.enGB.set('Dev')
  map.TimeofDayOverride.set(0)


  let sql = `
delete from player_levelstats;
insert into player_levelstats values `

  // const hp = Math.floor(STATS[CLASS_IDS[classId]].hpMin + (((i * STATS[CLASS_IDS[classId]].hpMax) - STATS[CLASS_IDS[classId]].hpMin)) / 99)
  // const mp = Math.floor(STATS[CLASS_IDS[classId]].mpMin + (((i * STATS[CLASS_IDS[classId]].mpMax) - STATS[CLASS_IDS[classId]].mpMin)) / 99)
  for (const raceId of Object.keys(RACE_IDS))
    for (const classId of Object.keys(CLASS_IDS))
      for (let i = 0; i < 99; i++) {
        const race = RACE_IDS[raceId]
        const cls = CLASS_IDS[classId]
        const level = i + 1
        const agi = Math.floor(STATS[CLASS_IDS[classId]].agiMin + (((i * STATS[CLASS_IDS[classId]].agiMax) - STATS[CLASS_IDS[classId]].agiMin)) / 99) || 0
        const spi = Math.floor(STATS[CLASS_IDS[classId]].spiMin + (((i * STATS[CLASS_IDS[classId]].spiMax) - STATS[CLASS_IDS[classId]].spiMin)) / 99) || 0
        const sta = Math.floor(STATS[CLASS_IDS[classId]].staMin + (((i * STATS[CLASS_IDS[classId]].staMax) - STATS[CLASS_IDS[classId]].staMin)) / 99) || 0
        const str = Math.floor(STATS[CLASS_IDS[classId]].strMin + (((i * STATS[CLASS_IDS[classId]].strMax) - STATS[CLASS_IDS[classId]].strMin)) / 99) || 0
        const int = Math.floor(STATS[CLASS_IDS[classId]].intMin + (((i * STATS[CLASS_IDS[classId]].intMax) - STATS[CLASS_IDS[classId]].intMin)) / 99) || 0
        sql = sql + `(${race}, ${cls}, ${level}, ${str}, ${agi}, ${sta}, ${int}, ${spi}),\n`
      }

  sql = sql.slice(0, -2) + ';'
  // $.sql.Databases.world_dest.write(sql)
  fs.writeFileSync('C:\\Users\\Administrator\\levelstats.sql', sql, { encoding: 'utf-8' })

  sql = `
delete from player_classlevelstats;
insert into player_classlevelstats values `

  for (const raceId of Object.keys(RACE_IDS))
    for (const classId of Object.keys(CLASS_IDS))
      for (let i = 0; i < 99; i++) {
        const race = RACE_IDS[raceId]
        const cls = CLASS_IDS[classId]
        const level = i + 1
        const hp = Math.floor(STATS[CLASS_IDS[classId]].hpMin + (((i * STATS[CLASS_IDS[classId]].hpMax) - STATS[CLASS_IDS[classId]].hpMin)) / 99) || 1
        const mp = Math.floor(STATS[CLASS_IDS[classId]].mpMin + (((i * STATS[CLASS_IDS[classId]].mpMax) - STATS[CLASS_IDS[classId]].mpMin)) / 99) || 0
        sql = sql + `(${cls}, ${level}, ${hp}, ${mp}),\n`
      }

  sql = sql.slice(0, -2) + ';'
  // $.sql.Databases.world_dest.write(sql)
  fs.writeFileSync('C:\\Users\\Administrator\\classlevelstats.sql', sql, { encoding: 'utf-8' })
  console.log(sql)
  //  insert into player_levelstats (\`race\`, \`class\`, \`level\`, \`str\`, \`agi\`, \`sta\`, \`inte\`, \`spi\`) values (2, 1, 1, 1, 1, 1, 1, 1);

  $.std.Maps.forEach(m => {
    if (m.Name.enGB.get() !== 'Outland')
      return
  })

  $.std.Areas.forEach(a => {
    // console.log(a.Name.enGB.get(), ': ', a.Light.get())
    if (a.Name.enGB.get() !== 'Nagrand')
      return

    a.Map.set(map.ID)
    a.Name.enGB.set('World')
  })

  $.std.Lights.filter({}).forEach(l => {
    if (l.row.MapID.get() === 530) {
      l.row.MapID.set(map.ID)
      l.row.LightParamsID.get().forEach(ID => {
        // console.log(ID)
        if (ID) {
          const p = $.dbc.LightParams.query({ ID })

          p.LightSkyboxID.set(553)
        }
      })
    }
  })

  for (let i = 0; i <= 3000; i++)
    $.dbc.Item.add(90000 + i, {
    })
}

main()

//   paladin:
//   hunter:
//   rogue:
//   priest:
//   shaman:
//   mage:
//   warlock:
//   druid:

