import { std } from 'wow/wotlk'
import { Builder } from './lib'
import { CLASS_IDS, RACE_IDS } from './lib/constants'
import { resolveDuration } from './lib/utils'
// warrior:
const STATS: any = {
  1: {
    strMax: 128,
    strMin: 74,
    strInc: 2.133,
    agiMax: 87,
    agiMin: 50,
    agiInc: 1.45,
    staMax: 116,
    staMin: 68,
    staInc: 1.933,
    intMax: 34,
    intMin: 20,
    intInc: 0.566,
    spiMax: 50,
    spiMin: 29,
    spiInc: 0.833,
  },
  2: {
    strMax: 109,
    strMin: 63,
    strInc: 1.816,
    agiMax: 68,
    agiMin: 40,
    agiInc: 1.133,
    staMax: 105,
    staMin: 61,
    staInc: 1.75,
    intMax: 75,
    intMin: 44,
    intInc: 1.25,
    spiMax: 78,
    spiMin: 46,
    spiInc: 1.3,
  },
  3: {
    strMax: 61,
    strMin: 35,
    strInc: 1.016,
    agiMax: 133,
    agiMin: 78,
    agiInc: 2.216,
    staMax: 95,
    staMin: 55,
    staInc: 1.583,
    intMax: 70,
    intMin: 25,
    intInc: 0.7,
    spiMax: 74,
    spiMin: 43,
    spiInc: 1.233,
  },
  4: {
    strMax: 84,
    strMin: 49,
    strInc: 1.4,
    agiMax: 139,
    agiMin: 81,
    agiInc: 2.316,
    staMax: 79,
    staMin: 46,
    staInc: 1.316,
    intMax: 39,
    intMin: 23,
    intInc: 0.65,
    spiMax: 54,
    spiMin: 32,
    spiInc: 0.9,
  },
  5: {
    strMax: 36,
    strMin: 21,
    strInc: 0.6,
    agiMax: 45,
    agiMin: 26,
    agiInc: 0.75,
    staMax: 54,
    staMin: 32,
    staInc: 0.9,
    intMax: 127,
    intMin: 70,
    intInc: 2.116,
    spiMax: 133,
    spiMin: 78,
    spiInc: 2.216,
  },
  7: {
    strMax: 92,
    strMin: 54,
    strInc: 1.533,
    agiMax: 58,
    agiMin: 34,
    agiInc: 0.966,
    staMax: 99,
    staMin: 58,
    staInc: 1.65,
    intMax: 93,
    intMin: 54,
    intInc: 1.55,
    spiMax: 105,
    spiMin: 61,
    spiInc: 1.75,
  },
  8: {
    strMax: 31,
    strMin: 18,
    strInc: 0.516,
    agiMax: 38,
    agiMin: 22,
    agiInc: 0.633,
    staMax: 46,
    staMin: 27,
    staInc: 0.766,
    intMax: 132,
    intMin: 77,
    intInc: 2.2,
    spiMax: 128,
    spiMin: 75,
    spiInc: 2.133,
  },
  9: {
    strMax: 48,
    strMin: 28,
    strInc: 0.8,
    agiMax: 51,
    agiMin: 30,
    agiInc: 0.85,
    staMax: 68,
    staMin: 40,
    staInc: 1.133,
    intMax: 117,
    intMin: 68,
    intInc: 1.95,
    spiMax: 116,
    spiMin: 68,
    spiInc: 1.933,
  },
  11: {
    strMax: 71,
    strMin: 41,
    strInc: 1.183,
    agiMax: 66,
    agiMin: 38,
    agiInc: 1.1,
    staMax: 70,
    staMin: 41,
    staInc: 1.166,
    intMax: 102,
    intMin: 60,
    intInc: 1.7,
    spiMax: 113,
    spiMin: 66,
    spiInc: 1.883,
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

  $.sql.player_levelstats.queryAll({}).forEach(c => c.delete())

  for (const raceId of Object.keys(RACE_IDS))
    for (const classId of Object.keys(CLASS_IDS))
      for (let i = 0; i < 99; i++) {
        const result = $.sql.player_levelstats.add(RACE_IDS[raceId], CLASS_IDS[classId], i + i, {
          agi: Math.floor(STATS[CLASS_IDS[classId]].agiMin + (i * STATS[CLASS_IDS[classId]].agiInc)),
          spi: Math.floor(STATS[CLASS_IDS[classId]].spiMin + (i * STATS[CLASS_IDS[classId]].spiInc)),
          sta: Math.floor(STATS[CLASS_IDS[classId]].staMin + (i * STATS[CLASS_IDS[classId]].staInc)),
          str: Math.floor(STATS[CLASS_IDS[classId]].strMin + (i * STATS[CLASS_IDS[classId]].strInc)),
          inte: Math.floor(STATS[CLASS_IDS[classId]].intMin + (i * STATS[CLASS_IDS[classId]].intInc)),
          // race: RACE_IDS[raceId],
          // class: CLASS_IDS[classId],
          // level: i + 1,
        })





      }

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

