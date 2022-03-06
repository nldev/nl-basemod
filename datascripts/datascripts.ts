import { std } from 'wow/wotlk'
import { Builder } from './lib'
import { CLASS_IDS, RACE_IDS, ROGUE } from './lib/constants'
import { createClassMask, createRaceMask, resolveDuration } from './lib/utils'
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

  const ALL_RACE_MASK = createRaceMask('ORC', 'DWARF', 'GNOME', 'HUMAN', 'TROLL', 'TAUREN', 'UNDEAD', 'DRAENEI', 'BLOOD_ELF', 'NIGHT_ELF')
  const ALL_CLASS_MASK = createClassMask('ROGUE', 'MAGE', 'DRUID', 'HUNTER', 'PRIEST', 'SHAMAN', 'WARLOCK', 'WARRIOR', 'PALADIN')

  $.sql.creature_classlevelstats.queryAll({}).forEach(v => v.delete())
  const npcWarriorMin = $.sql.creature_classlevelstats.query({ level: 35, class: 1 })
  const npcWarriorMax = $.sql.creature_classlevelstats.query({ level: 70, class: 1 })
  const npcPaladinMin = $.sql.creature_classlevelstats.query({ level: 35, class: 2 })
  const npcPaladinMax = $.sql.creature_classlevelstats.query({ level: 70, class: 2 })
  const npcRogueMin = $.sql.creature_classlevelstats.query({ level: 35, class: 4 })
  const npcRogueMax = $.sql.creature_classlevelstats.query({ level: 80, class: 4 })
  const npcMageMin = $.sql.creature_classlevelstats.query({ level: 35, class: 8 })
  const npcMageMax = $.sql.creature_classlevelstats.query({ level: 70, class: 8 })

  // FIXME
  // iterate through all creature templates
  // increase stat inc size every 10 levels
  // increase base damage
  // decrease base hp (and probably mp)
  // do not give mana to anything that has 0 mana
  for (let i = 0; i < 99; i++) {
    const level = i + 1
    $.sql.creature_classlevelstats.add(level, 1, {
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
    $.sql.creature_classlevelstats.add(level, 2, {
      level,
      class: 1,
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
    $.sql.creature_classlevelstats.add(level, 4, {
      level,
      class: 1,
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
    $.sql.creature_classlevelstats.add(level, 8, {
      level,
      class: 1,
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

  $.std.Classes.queryAll({}).forEach(cls => {
    if (cls.ID === 6)
      return
    cls.Stats.ParryCap.set(0)
    cls.Stats.DodgeCap.set(0)
    cls.Stats.MissCap.set(0)
    cls.Stats.CritToDodge.set(0)
    cls.Stats.DodgeBase.set(0)
    // cls.Stats.DiminishingK.set(0)
    cls.Stats.Intellect.set((o, i) => {
      const id = cls.ID
      const min = STATS[id].intMin
      const max = STATS[id].intMax
      const inc = (max - min) / 99
      const amount = min + (inc * i)
      return amount
    })
    cls.Stats.Strength.set((o, i) => {
      const id = cls.ID
      const min = STATS[id].strMin
      const max = STATS[id].strMax
      const inc = (max - min) / 99
      const amount = min + (inc * i)
      return amount
    })
    cls.Stats.Stamina.set((o, i) => {
      const id = cls.ID
      const min = STATS[id].staMin
      const max = STATS[id].staMax
      const inc = (max - min) / 99
      const amount = min + (inc * i)
      return amount
    })
    cls.Stats.Agility.set((o, i) => {
      const id = cls.ID
      const min = STATS[id].agiMin
      const max = STATS[id].agiMax
      const inc = (max - min) / 99
      const amount = min + (inc * i)
      return amount
    })
    cls.Stats.Spirit.set((o, i) => {
      const id = cls.ID
      const min = STATS[id].spiMin
      const max = STATS[id].spiMax
      const inc = (max - min) / 99
      const amount = min + (inc * i)
      return amount
    })
    cls.Stats.BaseHP.set((o, i) => {
      const id = cls.ID
      const min = STATS[id].hpMin
      const max = STATS[id].hpMax
      const inc = (max - min) / 99
      const amount = min + (inc * i)
      return amount
    })
    cls.Stats.BaseMana.set((o, i) => {
      const id = cls.ID
      const min = STATS[id].mpMin
      const max = STATS[id].mpMax
      const inc = (max - min) / 99
      const amount = min + (inc * i)
      return amount
    })
    cls.Stats.BaseSpellCrit.set(() => 0)
    cls.Stats.BaseMeleeCrit.set(() => 0)
    cls.Stats.CombatRatingsScalar.set(() => 0)
    cls.Stats.RegenHP.set(() => $.dbc.GtOCTRegenHP.getRow(560).Data.get())
    cls.Stats.RegenMP.set(() => $.dbc.GtOCTRegenMP.getRow(560).Data.get())
    cls.Stats.SpellCrit.set(() => $.dbc.GtChanceToSpellCrit.getRow(560).Data.get())
    cls.Stats.MeleeCrit.set(() => $.dbc.GtChanceToMeleeCrit.getRow(560).Data.get())
    cls.Stats.CombatRatings.set(() => $.dbc.GtCombatRatings.getRow(560).Data.get())
    cls.Stats.RegenMPPerSpt.set(() => $.dbc.GtRegenMPPerSpt.getRow(560).Data.get())
    cls.Stats.RegenHPPerSpt.set(() => $.dbc.GtRegenHPPerSpt.getRow(560).Data.get())
  })

  // dual wield
  $.std.SkillLines.load(118).Spells.forEach(s => s.AcquireMethod.set(1)).Category.set(6).RaceClassInfos.forEach(r => {
    r.ClassMask.set(createClassMask('ROGUE', 'SHAMAN', 'HUNTER', 'WARRIOR'))
    r.RaceMask.set(ALL_RACE_MASK)
    r.Flags.clearAll()
    r.row.MinLevel.set(1)
  })
  $.dbc.SkillLineAbility.queryAll({ SkillLine: 118 }).forEach(a => {
    a.MinSkillLineRank.set(0)
    a.SupercededBySpell.set(0)
    a.RaceMaskForbidden.markAll([0])
    a.ClassMaskForbidden.markAll([0])
  })
  // dagger
  $.std.SkillLines.load(173).Spells.forEach(s => s.AcquireMethod.set(1)).RaceClassInfos.forEach(r => {
    r.ClassMask.set(createClassMask('ROGUE', 'DRUID', 'HUNTER', 'MAGE', 'PRIEST', 'SHAMAN', 'WARLOCK', 'WARRIOR'))
    r.RaceMask.set(ALL_RACE_MASK)
    r.Flags.clearAll()
    r.row.MinLevel.set(1)
  })
  $.dbc.SkillLineAbility.queryAll({ SkillLine: 173 }).forEach(a => {
    a.SupercededBySpell.set(0)
    a.MinSkillLineRank.set(0)
    a.RaceMaskForbidden.markAll([0])
    a.ClassMaskForbidden.markAll([0])
  })
  // fist weapon
  $.std.SkillLines.load(473).Spells.forEach(s => s.AcquireMethod.set(1)).RaceClassInfos.forEach(r => {
    r.ClassMask.set(createClassMask('ROGUE', 'HUNTER', 'WARRIOR', 'SHAMAN', 'DRUID'))
    r.RaceMask.set(ALL_RACE_MASK)
    r.Flags.clearAll()
    r.row.MinLevel.set(1)
  })
  $.dbc.SkillLineAbility.queryAll({ SkillLine: 473 }).forEach(a => {
    a.SupercededBySpell.set(0)
    a.MinSkillLineRank.set(0)
    a.RaceMaskForbidden.markAll([0])
    a.ClassMaskForbidden.markAll([0])
  })
  // 1h sword
  $.std.SkillLines.load(43).Spells.forEach(s => s.AcquireMethod.set(1)).RaceClassInfos.forEach(r => {
    r.ClassMask.set(createClassMask('ROGUE', 'HUNTER', 'WARRIOR', 'WARLOCK', 'MAGE', 'PALADIN'))
    r.RaceMask.set(ALL_RACE_MASK)
    r.Flags.clearAll()
    r.row.MinLevel.set(1)
  })
  $.dbc.SkillLineAbility.queryAll({ SkillLine: 43 }).forEach(a => {
    a.SupercededBySpell.set(0)
    a.MinSkillLineRank.set(0)
    a.RaceMaskForbidden.markAll([0])
    a.ClassMaskForbidden.markAll([0])
  })
  // 1h axe
  $.std.SkillLines.load(44).Spells.forEach(s => s.AcquireMethod.set(1)).RaceClassInfos.forEach(r => {
    r.ClassMask.set(createClassMask('ROGUE', 'HUNTER', 'WARRIOR', 'SHAMAN'))
    r.RaceMask.set(ALL_RACE_MASK)
    r.Flags.clearAll()
    r.row.MinLevel.set(1)
  })
  $.dbc.SkillLineAbility.queryAll({ SkillLine: 44 }).forEach(a => {
    a.SupercededBySpell.set(0)
    a.MinSkillLineRank.set(0)
    a.RaceMaskForbidden.markAll([0])
    a.ClassMaskForbidden.markAll([0])
  })
  // thrown
  $.std.SkillLines.load(176).Spells.forEach(s => s.AcquireMethod.set(1)).RaceClassInfos.forEach(r => {
    r.ClassMask.set(createClassMask('ROGUE', 'HUNTER', 'WARRIOR'))
    r.RaceMask.set(ALL_RACE_MASK)
    r.Flags.clearAll()
    r.row.MinLevel.set(1)
  })
  $.dbc.SkillLineAbility.queryAll({ SkillLine: 176 }).forEach(a => {
    a.SupercededBySpell.set(0)
    a.MinSkillLineRank.set(0)
    a.RaceMaskForbidden.markAll([0])
    a.ClassMaskForbidden.markAll([0])
  })
  // wand
  $.std.SkillLines.load(228).Spells.forEach(s => s.AcquireMethod.set(1)).RaceClassInfos.forEach(r => {
    r.ClassMask.set(createClassMask('MAGE', 'WARLOCK', 'PRIEST'))
    r.RaceMask.set(ALL_RACE_MASK)
    r.Flags.clearAll()
    r.row.MinLevel.set(1)
  })
  $.dbc.SkillLineAbility.queryAll({ SkillLine: 228 }).forEach(a => {
    a.SupercededBySpell.set(0)
    a.MinSkillLineRank.set(0)
    a.RaceMaskForbidden.markAll([0])
    a.ClassMaskForbidden.markAll([0])
  })
  // staff
  $.std.SkillLines.load(136).Spells.forEach(s => s.AcquireMethod.set(1)).RaceClassInfos.forEach(r => {
    r.ClassMask.set(createClassMask('MAGE', 'WARLOCK', 'WARRIOR', 'DRUID', 'HUNTER', 'PRIEST', 'SHAMAN'))
    r.RaceMask.set(ALL_RACE_MASK)
    r.Flags.clearAll()
    r.row.MinLevel.set(1)
  })
  $.dbc.SkillLineAbility.queryAll({ SkillLine: 136 }).forEach(a => {
    a.SupercededBySpell.set(0)
    a.MinSkillLineRank.set(0)
    a.RaceMaskForbidden.markAll([0])
    a.ClassMaskForbidden.markAll([0])
  })
  // polearm
  $.std.SkillLines.load(229).Spells.forEach(s => s.AcquireMethod.set(1)).RaceClassInfos.forEach(r => {
    r.ClassMask.set(createClassMask('PALADIN', 'HUNTER', 'WARRIOR'))
    r.RaceMask.set(ALL_RACE_MASK)
    r.Flags.clearAll()
    r.row.MinLevel.set(1)
  })
  $.dbc.SkillLineAbility.queryAll({ SkillLine: 229 }).forEach(a => {
    a.SupercededBySpell.set(0)
    a.MinSkillLineRank.set(0)
    a.RaceMaskForbidden.markAll([0])
    a.ClassMaskForbidden.markAll([0])
  })
  // 2h sword
  $.std.SkillLines.load(55).Spells.forEach(s => s.AcquireMethod.set(1)).RaceClassInfos.forEach(r => {
    r.ClassMask.set(createClassMask('PALADIN', 'HUNTER', 'WARRIOR'))
    r.RaceMask.set(ALL_RACE_MASK)
    r.Flags.clearAll()
    r.row.MinLevel.set(1)
  })
  $.dbc.SkillLineAbility.queryAll({ SkillLine: 55 }).forEach(a => {
    a.SupercededBySpell.set(0)
    a.MinSkillLineRank.set(0)
    a.RaceMaskForbidden.markAll([0])
    a.ClassMaskForbidden.markAll([0])
  })
  // 2h axe
  $.std.SkillLines.load(172).Spells.forEach(s => s.AcquireMethod.set(1)).RaceClassInfos.forEach(r => {
    r.ClassMask.set(createClassMask('HUNTER', 'SHAMAN', 'WARRIOR', 'PALADIN'))
    r.RaceMask.set(ALL_RACE_MASK)
    r.Flags.clearAll()
    r.row.MinLevel.set(1)
  })
  $.dbc.SkillLineAbility.queryAll({ SkillLine: 172 }).forEach(a => {
    a.SupercededBySpell.set(0)
    a.MinSkillLineRank.set(0)
    a.RaceMaskForbidden.markAll([0])
    a.ClassMaskForbidden.markAll([0])
  })
  // 2h mace
  $.std.SkillLines.load(160).Spells.forEach(s => s.AcquireMethod.set(1)).RaceClassInfos.forEach(r => {
    r.ClassMask.set(createClassMask('PALADIN', 'SHAMAN', 'WARRIOR', 'DRUID'))
    r.RaceMask.set(ALL_RACE_MASK)
    r.Flags.clearAll()
    r.row.MinLevel.set(1)
  })
  $.dbc.SkillLineAbility.queryAll({ SkillLine: 160 }).forEach(a => {
    a.SupercededBySpell.set(0)
    a.MinSkillLineRank.set(0)
    a.RaceMaskForbidden.markAll([0])
    a.ClassMaskForbidden.markAll([0])
  })
  // shield
  $.std.SkillLines.load(433).Spells.forEach(s => s.AcquireMethod.set(1)).RaceClassInfos.forEach(r => {
    r.ClassMask.set(createClassMask('PALADIN', 'SHAMAN', 'WARRIOR'))
    r.RaceMask.set(ALL_RACE_MASK)
    r.Flags.clearAll()
    r.row.MinLevel.set(1)
  })
  $.dbc.SkillLineAbility.queryAll({ SkillLine: 433 }).forEach(a => {
    a.SupercededBySpell.set(0)
    a.MinSkillLineRank.set(0)
    a.RaceMaskForbidden.markAll([0])
    a.ClassMaskForbidden.markAll([0])
  })
  // crossbow
  $.std.SkillLines.load(226).Spells.forEach(s => s.AcquireMethod.set(1)).RaceClassInfos.forEach(r => {
    r.ClassMask.set(createClassMask('ROGUE', 'HUNTER', 'WARRIOR'))
    r.RaceMask.set(ALL_RACE_MASK)
    r.Flags.clearAll()
    r.row.MinLevel.set(1)
  })
  $.dbc.SkillLineAbility.queryAll({ SkillLine: 226 }).forEach(a => {
    a.SupercededBySpell.set(0)
    a.MinSkillLineRank.set(0)
    a.RaceMaskForbidden.markAll([0])
    a.ClassMaskForbidden.markAll([0])
  })
  // gun
  $.std.SkillLines.load(46).Spells.forEach(s => s.AcquireMethod.set(1)).RaceClassInfos.forEach(r => {
    r.ClassMask.set(createClassMask('ROGUE', 'HUNTER', 'WARRIOR'))
    r.RaceMask.set(ALL_RACE_MASK)
    r.Flags.clearAll()
    r.row.MinLevel.set(1)
  })
  $.dbc.SkillLineAbility.queryAll({ SkillLine: 46 }).forEach(a => {
    a.SupercededBySpell.set(0)
    a.MinSkillLineRank.set(0)
    a.RaceMaskForbidden.markAll([0])
    a.ClassMaskForbidden.markAll([0])
  })
  // bow
  $.std.SkillLines.load(44).Spells.forEach(s => s.AcquireMethod.set(1)).RaceClassInfos.forEach(r => {
    r.ClassMask.set(createClassMask('ROGUE', 'HUNTER', 'WARRIOR'))
    r.RaceMask.set(ALL_RACE_MASK)
    r.Flags.clearAll()
    r.row.MinLevel.set(1)
  })
  $.dbc.SkillLineAbility.queryAll({ SkillLine: 44 }).forEach(a => {
    a.SupercededBySpell.set(0)
    a.MinSkillLineRank.set(0)
    a.RaceMaskForbidden.markAll([0])
    a.ClassMaskForbidden.markAll([0])
  })
  // plate
  $.std.SkillLines.load(293).Spells.forEach(s => s.AcquireMethod.set(1)).RaceClassInfos.forEach(r => {
    r.ClassMask.set(createClassMask('PALADIN', 'WARRIOR'))
    r.RaceMask.set(ALL_RACE_MASK)
    r.Flags.clearAll()
    r.row.MinLevel.set(1)
  })
  $.dbc.SkillLineAbility.queryAll({ SkillLine: 293 }).forEach(a => {
    a.SupercededBySpell.set(0)
    a.MinSkillLineRank.set(0)
    a.RaceMaskForbidden.markAll([0])
    a.ClassMaskForbidden.markAll([0])
  })
  // mail
  $.std.SkillLines.load(413).Spells.forEach(s => s.AcquireMethod.set(1)).RaceClassInfos.forEach(r => {
    r.ClassMask.set(createClassMask('PALADIN', 'WARRIOR', 'HUNTER', 'SHAMAN'))
    r.RaceMask.set(ALL_RACE_MASK)
    r.Flags.clearAll()
    r.row.MinLevel.set(1)
  })
  $.dbc.SkillLineAbility.queryAll({ SkillLine: 413 }).forEach(a => {
    a.SupercededBySpell.set(0)
    a.MinSkillLineRank.set(0)
    a.RaceMaskForbidden.markAll([0])
    a.ClassMaskForbidden.markAll([0])
  })
  // cloth
  $.std.SkillLines.load(415).Spells.forEach(s => s.AcquireMethod.set(1)).RaceClassInfos.forEach(r => {
    r.ClassMask.set(ALL_CLASS_MASK)
    r.RaceMask.set(ALL_RACE_MASK)
    r.Flags.clearAll()
    r.row.MinLevel.set(1)
  })
  $.dbc.SkillLineAbility.queryAll({ SkillLine: 415 }).forEach(a => {
    a.MinSkillLineRank.set(0)
    a.RaceMaskForbidden.markAll([0])
    a.ClassMaskForbidden.markAll([0])
  })

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

  // $.std.CreatureTemplates.load(299).Level.Min.set(99)
  // $.std.CreatureTemplates.load(299).Level.Max.set(99)
  // $.std.CreatureTemplates.load(299).Level.set(99)
  // $.std.CreatureTemplates.load(257).Stats.DamageMod.set(2)
  // $.std.CreatureTemplates.load(257).Stats.HealthMod.set(0.9)
  // $.std.CreatureTemplates.load(257).Stats.ArmorMod.set(0.9)
  $.sql.creature_template.queryAll({}).forEach(c => {
    c.HealthModifier.set(1.3)
    c.ArmorModifier.set(1)
    c.DamageModifier.set(1.6)
  })

  $.std.Items.load(4540).Spells.get(0).Spell.getRef().Effects.get(0).PointsBase.set(1000)
  $.std.Items.load(2092).Damage.clearAll().Damage.addPhysical(10, 20)

  const rest = $.std.Spells.load(1127)
  rest.Name.enGB.set('Resting')
  rest.Description.enGB.set('Restoring 2% health and mana every 3 seconds.')
  rest.Duration.set(-1)
  const regenHp = rest.Effects.get(0).Aura.MOD_HEALTH_REGEN_PERCENT.set()
  regenHp
  regenHp.PercentBase.set(2)
  regenHp.PercentDieSides.set(0)
  regenHp.PercentPerLevel.set(0)
  regenHp.PercentPerCombo.set(0)
  const regenMp = rest.Effects.get(1).Aura.MOD_POWER_REGEN_PERCENT.set()
  regenMp.PowerType.MANA.set()
  regenMp.PowerPctBase.set(2)
  regenMp.PowerPctDieSides.set(0)
  regenMp.PowerPerLevelPct.set(0)
  regenMp.PowerPerComboPct.set(0)


  const STEALTH = 1784
  const AMBUSH = 11267
  const SINISTER_STRIKE = 11294
  const GOUGE = 1776
  const CHEAP_SHOT = 1833
  const SAFE_FALL = 1860
  const EVISCERATE = 11299
  const VANISH = 1857
  const PICK_POCKET = 921
  const MASTER_OF_DECEPTION = 13971
  const CAMOUFLAGE = 14063
  const DIRTY_TRICKS = 14094
  const KIDNEY_SHOT = 8643
  const SHIV = 5938
  const SPRINT = 11305
  const EVASION = 26669
  const SAP = 11297
  const BACKSTAB = 25300
  const GARROTE = 11290
  const RUPTURE = 11274
  const BLIND = 2094
  const KICK = 1766
  const DISARM_TRAP = 1842
  const DETECT_TRAP = 2836
  const EXPOSE_ARMOR = 8647
  const DISTRACT = 1725
  const FEINT = 25302
  const INITIATIVE = 13980
  const CRIPPLING_POISON = 3408
  const WOUND_POISON = 13227
  const MIND_NUMBING_POISON = 5761
  const DEADLY_POISON = 25351
  const INSTANT_POISON = 11339
  const ANESTHETIC_POISON = 26785

  $.std.Spells.load(SAP).Power.setEnergy(40)
  $.std.Spells.load(GARROTE).Power.setEnergy(30)
  $.std.Spells.load(CHEAP_SHOT).Power.setEnergy(40)
  $.std.Spells.load(AMBUSH).Power.setEnergy(40)
  $.std.Spells.load(RUPTURE).Power.setEnergy(25)
  $.std.Spells.load(KIDNEY_SHOT).Power.setEnergy(10)
  $.std.Spells.load(EXPOSE_ARMOR).Power.setEnergy(25)
  $.std.Spells.load(GOUGE).Power.setEnergy(35)
  $.std.Spells.load(SPRINT).Effects.get(0).PointsBase.set(130)
}

main()

const NPC_EXAMPLE = {
  combat: ['lunge-attack', '25-cold-resist'],
}

//   paladin:
//   hunter:
//   rogue:
//   priest:
//   shaman:
//   mage:
//   warlock:
//   druid:

