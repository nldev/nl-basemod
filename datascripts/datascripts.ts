import { Builder } from './basemod'
import { SQLTable } from './basemod/types'
import { TalentOptions } from './basemod/talents'
import { Autolearn } from './basemod/autolearn'
import { Map, MapOptions } from './basemod/maps'
import { TABLES } from './config/tables'
import { TALENTS } from './config/talents'
import { AUTOLEARN } from './config/autolearn'
import { MAPS } from './config/maps'
import { std } from 'wow/wotlk'

new Builder($ => {
  $.ProcessMany<SQLTable>(TABLES)
  $.ProcessMany<TalentOptions>(TALENTS)
  $.ProcessMany<Autolearn>(AUTOLEARN)
  $.ProcessMany<MapOptions>(MAPS)

  console.log(std.DBC.SpellItemEnchantment.query({ ID: 22 }).objectify())
})

const UNUSED_STARTING_SPELLS = [
  // general
  107,
  81,
  // rogue
  2098,
  1752,
  1784,
  // druid
  5185,
  1126,
  5176,
  // hunter
  // 75,
  2973,
  1494,
  // mage
  1459,
  133,
  168,
  // paladin
  465,
  635,
  20187,
  21084,
  // priest
  2050,
  1243,
  585,
  // shaman
  331,
  403,
  8017,
  // warlock
  687,
  348,
  686,
  688,
  // warrior
  6673,
  2457,
  20647,
  78,
  // human
  20599,
  59752,
  20864,
  58985,
  20597,
  20598,
  // blood elf
  28877,
  25046,
  28730,
  50613,
  822,
  // draenei
  28875,
  28880,
  59542,
  59543,
  59544,
  59545,
  59547,
  59548,
  6562,
  28878,
  59221,
  59535,
  59536,
  59538,
  59539,
  59540,
  59541,
  // dwarf
  2481,
  20596,
  20595,
  59224,
  20594,
  // gnome
  20592,
  20593,
  20589,
  20591,
  // night elf
  21009,
  20583,
  20582,
  58984,
  20585,
  // orc
  20574,
  20572,
  33697,
  33702,
  20575,
  20576,
  21563,
  54562,
  65222,
  20573,
  // tauren
  20552,
  20550,
  20551,
  20549,
  // troll
  20557,
  26297,
  26290,
  58943,
  20555,
  20558,
  // undead
  20577,
  20579,
  5227,
  7744,
]

std.SQL.playercreateinfo_spell_custom.queryAll({}).forEach(c => c.delete())
std.DBC.SkillLineAbility.queryAll({}).forEach(a => {
  if (UNUSED_STARTING_SPELLS.includes(a.Spell.get()))
    a.delete()
})

function SetStartingZone() {
  const info = std.SQL.playercreateinfo.queryAll({})
  info.forEach(i => {
    i.map.set(726)
    i.position_x.set(16138)
    i.position_y.set(15957)
    i.position_z.set(2.031755)
    i.orientation.set(1)
  })
}

function RemoveFlagDropDebuff () {
  // flag drop debuff
  std.Spells.load(42792).delete()

  // honorless target
  std.Spells.load(2479).delete()
}

function Settings () {
  RemoveFlagDropDebuff()
  SetStartingZone()
}

