import { std } from 'wow/wotlk'
import { SkillLine } from 'wow/wotlk/std/SkillLines/SkillLine'
import { ItemQuality } from 'wow/wotlk/std/Item/ItemQuality'
import { Builder } from './basemod'
import { Mapping, SQLTable } from './basemod/types'
import { TalentOptions } from './basemod/talents'
import { Autolearn } from './basemod/autolearn'
import { Speed } from './basemod/utils'
import { MapOptions } from './basemod/maps'
import { TABLES } from './config/tables'
import { TALENTS } from './config/talents'
import { AUTOLEARN } from './config/autolearn'
import { MAPS } from './config/maps'
import { ALL_CLASSES, CLASS_IDS, RACE_IDS } from './basemod/constants'

let currency_id = 0

const SKILLS: Mapping<SkillLine> = {}
std.SkillLines.forEach(e => {
  SKILLS[e.Name.enGB.get()] = e
})

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


new Builder($ => {
  $.ProcessMany<SQLTable>(TABLES)
  $.ProcessMany<TalentOptions>(TALENTS)
  $.ProcessMany<Autolearn>(AUTOLEARN)
  $.ProcessMany<MapOptions>(MAPS)

  Settings($)
})

function RemoveUnusedStartingItems () {
  std.Items.load(6948).delete() // hearthstone
  std.Items.load(2512).delete() // arrow
  std.Items.load(2516).delete() // bullet
  std.Items.load(2101).delete() // quiver
  std.Items.load(2102).delete() // ammo pouch
}

function RemoveUnusedStartingSpells () {
  std.SQL.playercreateinfo_spell_custom.queryAll({}).forEach(c => c.delete())
  std.DBC.SkillLineAbility.queryAll({}).forEach(a => {
    if (UNUSED_STARTING_SPELLS.includes(a.Spell.get()))
      a.delete()
  })
}

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

function CreateDevMovementBoots ($: Builder) {
  for (let i = 1; i <= 10; i++) {
    const amount = i * 10
    const boots = std.Items.create($.Mod, `dev-boots-${amount}`, 20903)
    boots.Name.enGB.set(`${amount}% Movespeed Boots`)
    boots.Spells.addMod(is => {
      const spell = std.Spells.create($.Mod, `speed-${amount}`, 2836)
      spell.Levels.set(0, 0, 0)
      spell.ClassMask.set(0, 0, 0)
      spell.Effects.clearAll()
      spell.Effects.addMod(e => e
        .Type.APPLY_AURA.set()
        .Aura.MOD_INCREASE_SPEED.set()
        .PercentBase.set(amount)
        .PercentDieSides.set(0)
        .PercentPerCombo.set(0)
        .PercentPerLevel.set(0)
        .ImplicitTargetA.UNIT_CASTER.set()
      )
      is.Spell.set(spell.ID)
      is.Trigger.ON_EQUIP.set()
      is.Charges.set('UNLIMITED')
      is.Cooldown.set(0)
      is.CategoryCooldown.set(0)
      is.ProcsPerMinute.set(0)
    })
  }
}

function SetupPoisons () {
  // FIXME fix tooltip
  const mindEffect = std.Spells.load(5760)
  const mindEnchant = std.DBC.SpellItemEnchantment.query({ ID: 35 })
  const mind = std.Spells.load(5761)
  const anestheticEffect = std.Spells.load(26688)
  const anestheticEnchant = std.DBC.SpellItemEnchantment.query({ ID: 2640 })
  const anesthetic = std.Spells.load(26785)
  const cripplingEffect = std.Spells.load(3409)
  const cripplingEnchant = std.DBC.SpellItemEnchantment.query({ ID: 22 })
  const crippling = std.Spells.load(3408)
  const deadlyEffect = std.Spells.load(25349)
  const deadlyEnchant = std.DBC.SpellItemEnchantment.query({ ID: 2630 })
  const deadly = std.Spells.load(25351)
  const instantEffect = std.Spells.load(11336)
  const instantEnchant = std.DBC.SpellItemEnchantment.query({ ID: 624 })
  const instant = std.Spells.load(11339)
  const woundEffect = std.Spells.load(13224)
  const woundEnchant = std.DBC.SpellItemEnchantment.query({ ID: 706 })
  const wound = std.Spells.load(13227)

  deadly.Name.enGB.set('Deadly Poison')
  deadlyEnchant.Name.enGB.set('Deadly Poison')
  deadlyEffect.Name.enGB.set('Deadly Poison')
  instant.Name.enGB.set('Instant Poison')
  instantEnchant.Name.enGB.set('Instant Poison')
  instantEffect.Name.enGB.set('Instant Poison')
  wound.Name.enGB.set('Wound Poison')
  woundEnchant.Name.enGB.set('Wound Poison')
  woundEffect.Name.enGB.set('Wound Poison')

  mindEnchant.EffectPointsMin.set([20])
  mindEnchant.EffectPointsMax.set([20])
  anestheticEnchant.EffectPointsMin.set([30])
  anestheticEnchant.EffectPointsMax.set([30])
  cripplingEnchant.EffectPointsMin.set([30])
  cripplingEnchant.EffectPointsMax.set([30])
  deadlyEnchant.EffectPointsMin.set([30])
  deadlyEnchant.EffectPointsMax.set([30])
  instantEnchant.EffectPointsMin.set([20])
  instantEnchant.EffectPointsMax.set([20])
  woundEnchant.EffectPointsMin.set([30])
  woundEnchant.EffectPointsMax.set([30])

  const enchants = [
    mindEnchant,
    anestheticEnchant,
    cripplingEnchant,
    deadlyEnchant,
    instantEnchant,
    woundEnchant,
  ]

  const spells = [
    mind,
    anesthetic,
    crippling,
    deadly,
    instant,
    wound,
  ]

  const effects = [
    mindEffect,
    anestheticEffect,
    cripplingEffect,
    deadlyEffect,
    instantEffect,
    woundEffect,
  ]

  enchants.forEach(e => {
    e.Flags.set(0)
  })

  effects.forEach(e => e
    .Visual.getRef()
      .CastKit.getRef()
        .Animation.SPELL_CAST_DIRECTED.set()
        .RightHandEffect.set(std.Spells.load(8690).Visual.getRef().CastKit.getRef().RightHandEffect.get())
        .LeftHandEffect.set(std.Spells.load(8690).Visual.getRef().CastKit.getRef().LeftHandEffect.get())
  )

  // nerfs
  woundEffect.Effects.get(1).PointsBase.set(18)
  instantEffect.Effects.get(1).PointsBase.set(32)
  deadlyEffect.Effects.get(1).PointsBase.set(8)
}

function RecallSpell () {
  const spell = std.Spells.load(8690)
  spell.Cooldown.set(1000 * 60 * 60) // 1 hour
  spell.Name.enGB.set('Sanctuary')
  spell.Description.enGB.set('Return.')
  spell.Icon.setPath('Achievement_WorldEvent_Lunar')
}

function NormalizeSprint ($: Builder) {
  // FIXME fix tooltip
  const sprint = std.Spells.load(11305)
  sprint.Effects.get(0).PointsBase.set(Speed($.BaseSpeed, 79))
  sprint.Effects.get(0).PointsDieSides.set(Speed($.BaseSpeed, 1))
}

function KidneyShot () {
  const s = std.Spells.load(8643)
  s.Attributes.MAINHAND_REQUIRED.set(false)
  s.ItemEquips.set(-1, -1, -1)
}

function Rogue ($: Builder) {
  SetupPoisons()
  NormalizeSprint($)
  KidneyShot()
}

function InfiniteRangedWeapon ($: Builder) {
  const b = std.Items.load(2504)
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
  const g = std.Items.load(2508)
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
  std.Spells.load(46699)
    .Description.enGB.set('')
}

function SetupSkills ($: Builder) {
  // dual wield
  SKILLS['Dual Wield'].Autolearn.addMod(['ROGUE', 'SHAMAN', 'HUNTER', 'WARRIOR'], ALL_CLASSES as any, e => e.Rank.set(0))
  // dagger
  SKILLS['Daggers'].Autolearn.addMod(['ROGUE', 'DRUID', 'HUNTER', 'MAGE', 'PRIEST', 'SHAMAN', 'WARLOCK', 'WARRIOR'], ALL_CLASSES as any, e => e.Rank.set(0))
  // fist weapon
  SKILLS['Fist Weapons'].Autolearn.addMod(['ROGUE', 'HUNTER', 'WARRIOR', 'SHAMAN', 'DRUID'], ALL_CLASSES as any, e => e.Rank.set(0))
  // 1h sword
  SKILLS['Swords'].Autolearn.addMod(['ROGUE', 'HUNTER', 'WARRIOR', 'WARLOCK', 'MAGE', 'PALADIN'], ALL_CLASSES as any, e => e.Rank.set(0))
  // 1h mace
  SKILLS['Maces'].Autolearn.addMod(['ROGUE', 'WARRIOR', 'WARLOCK', 'PALADIN', 'SHAMAN', 'DRUID', 'PRIEST'], ALL_CLASSES as any, e => e.Rank.set(0))
  // 1h axe
  SKILLS['Axes'].Autolearn.addMod(['ROGUE', 'HUNTER', 'WARRIOR', 'SHAMAN'], ALL_CLASSES as any, e => e.Rank.set(0))
  // thrown
  SKILLS['Thrown'].Autolearn.addMod(['ROGUE', 'HUNTER', 'WARRIOR'], ALL_CLASSES as any, e => e.Rank.set(0))
  // wand
  SKILLS['Wands'].Autolearn.addMod(['MAGE', 'WARLOCK', 'PRIEST'], ALL_CLASSES as any, e => e.Rank.set(0))
  // staff
  SKILLS['Staves'].Autolearn.addMod(['MAGE', 'WARLOCK', 'WARRIOR', 'DRUID', 'HUNTER', 'PRIEST', 'SHAMAN'], ALL_CLASSES as any, e => e.Rank.set(0))
  // polearm
  SKILLS['Polearms'].Autolearn.addMod(['PALADIN', 'HUNTER', 'WARRIOR'], ALL_CLASSES as any, e => e.Rank.set(0))
  // 2h sword
  SKILLS['Two-Handed Swords'].Autolearn.addMod(['PALADIN', 'HUNTER', 'WARRIOR'], ALL_CLASSES as any, e => e.Rank.set(0))
  // 2h axe
  SKILLS['Two-Handed Axes'].Autolearn.addMod(['HUNTER', 'SHAMAN', 'WARRIOR', 'PALADIN'], ALL_CLASSES as any, e => e.Rank.set(0))
  // 2h mace
  SKILLS['Two-Handed Maces'].Autolearn.addMod(['PALADIN', 'SHAMAN', 'WARRIOR', 'DRUID'], ALL_CLASSES as any, e => e.Rank.set(0))
  // shield
  SKILLS['Shield'].Autolearn.addMod(['PALADIN', 'SHAMAN', 'WARRIOR'], ALL_CLASSES as any, e => e.Rank.set(0))
  // crossbow
  SKILLS['Crossbows'].Autolearn.addMod(['ROGUE', 'HUNTER', 'WARRIOR'], ALL_CLASSES as any, e => e.Rank.set(0))
  // gun
  SKILLS['Guns'].Autolearn.addMod(['ROGUE', 'HUNTER', 'WARRIOR'], ALL_CLASSES as any, e => e.Rank.set(0))
  // bow
  SKILLS['Bows'].Autolearn.addMod(['ROGUE', 'HUNTER', 'WARRIOR'], ALL_CLASSES as any, e => e.Rank.set(0))
  // plate
  SKILLS['Plate Mail'].Autolearn.addMod(['PALADIN', 'WARRIOR'], ALL_CLASSES as any, e => e.Rank.set(0))
  // mail
  SKILLS['Mail'].Autolearn.addMod(['PALADIN', 'WARRIOR', 'HUNTER', 'SHAMAN'], ALL_CLASSES as any, e => e.Rank.set(0))
}

function SetupNpcStats ($: Builder) {
  std.SQL.creature_classlevelstats.queryAll({}).forEach(v => v.delete())
  const npcWarriorMin = std.SQL.creature_classlevelstats.query({ level: 35, class: 1 })
  const npcWarriorMax = std.SQL.creature_classlevelstats.query({ level: 70, class: 1 })
  const npcPaladinMin = std.SQL.creature_classlevelstats.query({ level: 35, class: 2 })
  const npcPaladinMax = std.SQL.creature_classlevelstats.query({ level: 70, class: 2 })
  const npcRogueMin   = std.SQL.creature_classlevelstats.query({ level: 35, class: 4 })
  const npcRogueMax   = std.SQL.creature_classlevelstats.query({ level: 70, class: 4 })
  const npcMageMin    = std.SQL.creature_classlevelstats.query({ level: 35, class: 8 })
  const npcMageMax    = std.SQL.creature_classlevelstats.query({ level: 70, class: 8 })

  // FIXME
  // iterate through all creature templates
  // increase stat inc size every 10 levels
  // increase base damage
  // decrease base hp (and probably mp)
  // do not give mana to anything that has 0 mana
  for (let i = 0; i < 99; i++) {
    const level = i + 1
    std.SQL.creature_classlevelstats.add(level, 1, {
      level,
      class: 1,
      basehp0: Math.ceil(npcWarriorMin.basehp0.get() + (level * ((npcWarriorMax.basehp0.get() - npcWarriorMin.basehp0.get()) / 99))),
      basehp1: Math.ceil(npcWarriorMin.basehp1.get() + (level * ((npcWarriorMax.basehp1.get() - npcWarriorMin.basehp1.get()) / 99))),
      basehp2: Math.ceil(npcWarriorMin.basehp2.get() + (level * ((npcWarriorMax.basehp2.get() - npcWarriorMin.basehp2.get()) / 99))),
      basemana: Math.ceil(npcWarriorMin.basemana.get() + (level * ((npcWarriorMax.basemana.get() - npcWarriorMin.basemana.get()) / 99))),
      basearmor: Math.ceil(npcWarriorMin.basearmor.get() + (level * ((npcWarriorMax.basearmor.get() - npcWarriorMin.basearmor.get()) / 99))),
      attackpower: Math.ceil(npcWarriorMin.attackpower.get() + (level * ((npcWarriorMax.attackpower.get() - npcWarriorMin.attackpower.get()) / 99))),
      rangedattackpower: Math.ceil(npcWarriorMin.rangedattackpower.get() + (level * ((npcWarriorMax.rangedattackpower.get() - npcWarriorMin.rangedattackpower.get()) / 99))),
      damage_base: Math.ceil(npcWarriorMin.damage_base.get() + (level * ((npcWarriorMax.damage_base.get() - npcWarriorMin.damage_base.get()) / 99))),
      damage_exp1: Math.ceil(npcWarriorMin.damage_exp1.get() + (level * ((npcWarriorMax.damage_exp1.get() - npcWarriorMin.damage_exp1.get()) / 99))),
      damage_exp2: Math.ceil(npcWarriorMin.damage_exp2.get() + (level * ((npcWarriorMax.damage_exp2.get() - npcWarriorMin.damage_exp2.get()) / 99))),
      comment: 'basemod',
    })
    std.SQL.creature_classlevelstats.add(level, 2, {
      level,
      class: 2,
      basehp0: Math.ceil(npcPaladinMin.basehp0.get() + (level * ((npcPaladinMax.basehp0.get() - npcPaladinMin.basehp0.get()) / 99))),
      basehp1: Math.ceil(npcPaladinMin.basehp1.get() + (level * ((npcPaladinMax.basehp1.get() - npcPaladinMin.basehp1.get()) / 99))),
      basehp2: Math.ceil(npcPaladinMin.basehp2.get() + (level * ((npcPaladinMax.basehp2.get() - npcPaladinMin.basehp2.get()) / 99))),
      basemana: Math.ceil(npcPaladinMin.basemana.get() + (level * ((npcPaladinMax.basemana.get() - npcPaladinMin.basemana.get()) / 99))),
      basearmor: Math.ceil(npcPaladinMin.basearmor.get() + (level * ((npcPaladinMax.basearmor.get() - npcPaladinMin.basearmor.get()) / 99))),
      attackpower: Math.ceil(npcPaladinMin.attackpower.get() + (level * ((npcPaladinMax.attackpower.get() - npcPaladinMin.attackpower.get()) / 99))),
      rangedattackpower: Math.ceil(npcPaladinMin.rangedattackpower.get() + (level * ((npcPaladinMax.rangedattackpower.get() - npcPaladinMin.rangedattackpower.get()) / 99))),
      damage_base: Math.ceil(npcPaladinMin.damage_base.get() + (level * ((npcPaladinMax.damage_base.get() - npcPaladinMin.damage_base.get()) / 99))),
      damage_exp1: Math.ceil(npcPaladinMin.damage_exp1.get() + (level * ((npcPaladinMax.damage_exp1.get() - npcPaladinMin.damage_exp1.get()) / 99))),
      damage_exp2: Math.ceil(npcPaladinMin.damage_exp2.get() + (level * ((npcPaladinMax.damage_exp2.get() - npcPaladinMin.damage_exp2.get()) / 99))),
      comment: 'basemod',
    })
    std.SQL.creature_classlevelstats.add(level, 4, {
      level,
      class: 4,
      basehp0: Math.ceil(npcRogueMin.basehp0.get() + (level * ((npcRogueMax.basehp0.get() - npcRogueMin.basehp0.get()) / 99))),
      basehp1: Math.ceil(npcRogueMin.basehp1.get() + (level * ((npcRogueMax.basehp1.get() - npcRogueMin.basehp1.get()) / 99))),
      basehp2: Math.ceil(npcRogueMin.basehp2.get() + (level * ((npcRogueMax.basehp2.get() - npcRogueMin.basehp2.get()) / 99))),
      basemana: Math.ceil(npcRogueMin.basemana.get() + (level * ((npcRogueMax.basemana.get() - npcRogueMin.basemana.get()) / 99))),
      basearmor: Math.ceil(npcRogueMin.basearmor.get() + (level * ((npcRogueMax.basearmor.get() - npcRogueMin.basearmor.get()) / 99))),
      attackpower: Math.ceil(npcRogueMin.attackpower.get() + (level * ((npcRogueMax.attackpower.get() - npcRogueMin.attackpower.get()) / 99))),
      rangedattackpower: Math.ceil(npcRogueMin.rangedattackpower.get() + (level * ((npcRogueMax.rangedattackpower.get() - npcRogueMin.rangedattackpower.get()) / 99))),
      damage_base: Math.ceil(npcRogueMin.damage_base.get() + (level * ((npcRogueMax.damage_base.get() - npcRogueMin.damage_base.get()) / 99))),
      damage_exp1: Math.ceil(npcRogueMin.damage_exp1.get() + (level * ((npcRogueMax.damage_exp1.get() - npcRogueMin.damage_exp1.get()) / 99))),
      damage_exp2: Math.ceil(npcRogueMin.damage_exp2.get() + (level * ((npcRogueMax.damage_exp2.get() - npcRogueMin.damage_exp2.get()) / 99))),
      comment: 'basemod',
    })
    std.SQL.creature_classlevelstats.add(level, 8, {
      level,
      class: 8,
      basehp0: Math.ceil(npcMageMin.basehp0.get() + (level * ((npcMageMax.basehp0.get() - npcMageMin.basehp0.get()) / 99))),
      basehp1: Math.ceil(npcMageMin.basehp1.get() + (level * ((npcMageMax.basehp1.get() - npcMageMin.basehp1.get()) / 99))),
      basehp2: Math.ceil(npcMageMin.basehp2.get() + (level * ((npcMageMax.basehp2.get() - npcMageMin.basehp2.get()) / 99))),
      basemana: Math.ceil(npcMageMin.basemana.get() + (level * ((npcMageMax.basemana.get() - npcMageMin.basemana.get()) / 99))),
      basearmor: Math.ceil(npcMageMin.basearmor.get() + (level * ((npcMageMax.basearmor.get() - npcMageMin.basearmor.get()) / 99))),
      attackpower: Math.ceil(npcMageMin.attackpower.get() + (level * ((npcMageMax.attackpower.get() - npcMageMin.attackpower.get()) / 99))),
      rangedattackpower: Math.ceil(npcMageMin.rangedattackpower.get() + (level * ((npcMageMax.rangedattackpower.get() - npcMageMin.rangedattackpower.get()) / 99))),
      damage_base: Math.ceil(npcMageMin.damage_base.get() + (level * ((npcMageMax.damage_base.get() - npcMageMin.damage_base.get()) / 99))),
      damage_exp1: Math.ceil(npcMageMin.damage_exp1.get() + (level * ((npcMageMax.damage_exp1.get() - npcMageMin.damage_exp1.get()) / 99))),
      damage_exp2: Math.ceil(npcMageMin.damage_exp2.get() + (level * ((npcMageMax.damage_exp2.get() - npcMageMin.damage_exp2.get()) / 99))),
      comment: 'basemod',
    })
  }
  // $.std.CreatureTemplates.load(299).Level.Min.set(99)
  // $.std.CreatureTemplates.load(299).Level.Max.set(99)
  // $.std.CreatureTemplates.load(299).Level.set(99)
  // $.std.CreatureTemplates.load(257).Stats.DamageMod.set(2)
  // $.std.CreatureTemplates.load(257).Stats.HealthMod.set(0.9)
  // $.std.CreatureTemplates.load(257).Stats.ArmorMod.set(0.9)
  std.SQL.creature_template.queryAll({}).forEach(c => {
    if (c.type.get() !== 8) {
      c.HealthModifier.set(1.3)
      c.ArmorModifier.set(1)
      c.DamageModifier.set(1.6)
      c.ManaModifier.set(1)
      c.ExperienceModifier.set(1)
      c.RegenHealth.set(1)
      c.exp.set(0)
    }
  })
}

function SetupStats ($: Builder) {
  std.Classes.queryAll({}).forEach(cls => {
    if (cls.ID === 6)
      return
    cls.Stats.ParryCap.set(0)
    cls.Stats.DodgeCap.set(0)
    cls.Stats.MissCap.set(0)
    cls.Stats.CritToDodge.set(0)
    cls.Stats.DodgeBase.set(0)
    // cls.Stats.DiminishingK.set(0)
    std.SQL.player_levelstats.queryAll({}).forEach(x => x.delete())
    std.SQL.player_classlevelstats.queryAll({}).forEach(x => x.delete())

    for (let c of Object.keys(CLASS_IDS)) {
      const cid = CLASS_IDS[c]
      for (let r of Object.keys(RACE_IDS)) {
        const rid = RACE_IDS[r]
        for (let i = 1; i <= 99; i++) {
          std.SQL.player_levelstats.add(rid, cid, i, {
            agi: STATS[cid].agiMin + (((STATS[cid].agiMax - STATS[cid].agiMin) / 99) * i),
            inte: STATS[cid].intMin + (((STATS[cid].intMax - STATS[cid].intMin) / 99) * i),
            sta: STATS[cid].staMin + (((STATS[cid].staMax - STATS[cid].staMin) / 99) * i),
            str: STATS[cid].strMin + (((STATS[cid].strMax - STATS[cid].strMin) / 99) * i),
            spi: STATS[cid].spiMin + (((STATS[cid].spiMax - STATS[cid].spiMin) / 99) * i),
            level: i,
            class: cid,
            race: rid,
          })
          std.SQL.player_classlevelstats.add(cid, i, {
            class: cid,
            level: i,
            basehp: STATS[cid].hpMin + (((STATS[cid].hpMax - STATS[cid].hpMin) / 99) * i),
            basemana: STATS[cid].mpMin + (((STATS[cid].mpMax - STATS[cid].mpMin) / 99) * i),
          })
        }
      }
    }
    // cls.Stats.Intellect.set((o, r, i) => {
    //   const id = cls.ID
    //   const min = STATS[id].intMin
    //   const max = STATS[id].intMax
    //   const inc = (max - min) / 99
    //   const amount = min + (inc * i)
    //   return amount
    // })
    // cls.Stats.Strength.set((o, r, i) => {
    //   const id = cls.ID
    //   const min = STATS[id].strMin
    //   const max = STATS[id].strMax
    //   const inc = (max - min) / 99
    //   const amount = min + (inc * i)
    //   return amount
    // })
    // cls.Stats.Stamina.set((o, r, i) => {
    //   const id = cls.ID
    //   const min = STATS[id].staMin
    //   const max = STATS[id].staMax
    //   const inc = (max - min) / 99
    //   const amount = min + (inc * i)
    //   return amount
    // })
    // cls.Stats.Agility.set((o, r, i) => {
    //   const id = cls.ID
    //   const min = STATS[id].agiMin
    //   const max = STATS[id].agiMax
    //   const inc = (max - min) / 99
    //   const amount = min + (inc * i)
    //   return amount
    // })
    // cls.Stats.Spirit.set((o, r, i) => {
    //   const id = cls.ID
    //   const min = STATS[id].spiMin
    //   const max = STATS[id].spiMax
    //   const inc = (max - min) / 99
    //   const amount = min + (inc * i)
    //   return amount
    // })
    // cls.Stats.BaseHP.set((o, i) => {
    //   const id = cls.ID
    //   const min = STATS[id].hpMin
    //   const max = STATS[id].hpMax
    //   const inc = (max - min) / 99
    //   const amount = min + (inc * i)
    //   return amount
    // })
    // cls.Stats.BaseMana.set((o, i) => {
    //   const id = cls.ID
    //   const min = STATS[id].mpMin
    //   const max = STATS[id].mpMax
    //   const inc = (max - min) / 99
    //   const amount = min + (inc * i)
    //   return amount
    // })
    cls.Stats.BaseSpellCrit.set(() => 0)
    cls.Stats.BaseMeleeCrit.set(() => 0)
    cls.Stats.CombatRatingsScalar.set(() => 0)
    cls.Stats.RegenHP.set(() => std.DBC.GtOCTRegenHP.getRow(560).Data.get())
    cls.Stats.RegenMP.set(() => std.DBC.GtOCTRegenMP.getRow(560).Data.get())
    cls.Stats.SpellCrit.set(() => std.DBC.GtChanceToSpellCrit.getRow(560).Data.get())
    cls.Stats.MeleeCrit.set(() => std.DBC.GtChanceToMeleeCrit.getRow(560).Data.get())
    cls.Stats.CombatRatings.set(() => std.DBC.GtCombatRatings.getRow(560).Data.get())
    cls.Stats.RegenMPPerSpt.set(() => std.DBC.GtRegenMPPerSpt.getRow(560).Data.get())
    cls.Stats.RegenHPPerSpt.set(() => std.DBC.GtRegenHPPerSpt.getRow(560).Data.get())
  })
}

interface CurrencyOptions {
  id: string
  name: string
  icon: number
  quality?: ItemQuality
  category?: string
}

function Currency ($: Builder, options: CurrencyOptions) {
  const c = std.Items.create($.Mod, options.id, 29434)
  c.Name.enGB.set(options.name)
  c.Bonding.NO_BOUNDS.set()
  c.DisplayInfo.getRefCopy().Icon.set(std.Items.load(options.icon).DisplayInfo.getRef().Icon.get())
  c.Quality.set(options.quality || 'WHITE')
  c.RequiredLevel.set(0)
  c.ItemLevel.set(1)
  currency_id += 1
  const t = std.DBC.CurrencyTypes.add(50000 + currency_id)
  t.CategoryID.set(1)
  t.BitIndex.set(currency_id)
  t.ItemID.set(c.ID)
  return c
}

function CreateCurrencies ($: Builder) {
  std.DBC.CurrencyTypes.queryAll({}).forEach(c => c.delete())

  const linen = Currency($, {
    id: 'linen-cloth',
    name: 'Linen Cloth',
    icon: 2589,
  })

  const wool = Currency($, {
    id: 'wool-cloth',
    name: 'Wool Cloth',
    icon: 2592,
  })

  const silk = Currency($, {
    id: 'silk-cloth',
    name: 'Silk Cloth',
    icon: 4306,
  })

  std.Spells.load(3275).CastTime.set(0).Reagents.clearAll().Reagents.add(linen.ID, 1)
  std.Spells.load(3276).CastTime.set(0).Reagents.clearAll().Reagents.add(linen.ID, 2)
  std.Spells.load(3277).CastTime.set(0).Reagents.clearAll().Reagents.add(wool.ID, 1)
  std.Spells.load(3278).CastTime.set(0).Reagents.clearAll().Reagents.add(wool.ID, 2)
  std.Spells.load(7928).CastTime.set(0).Reagents.clearAll().Reagents.add(silk.ID, 1)
  std.Spells.load(7929).CastTime.set(0).Reagents.clearAll().Reagents.add(silk.ID, 2)
}

function Settings ($: Builder) {
  const recover = std.Spells.create($.Mod, 'recover', 9512)
  recover.Name.enGB.set('Coffee')
  recover.Icon.setPath('inv_drink_15')
  recover.Cooldown.StartCategory.set(0)
  recover.Cooldown.CategoryTime.set(0)
  recover.Cooldown.StartTime.set(1000 * 60 * 3)
  RecallSpell()
  RemoveFlagDropDebuff()
  RemoveUnusedStartingSpells()
  RemoveUnusedStartingItems()
  SetStartingZone()
  InfiniteRangedWeapon($)
  SetupStats($)
  SetupSkills($)
  SetupNpcStats($)
  CreateCurrencies($)
  CreateDevMovementBoots($)
  Rogue($)
}

