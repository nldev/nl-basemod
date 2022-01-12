import { std } from 'tswow-stdlib'
import { Builder } from './lib'

const MOD = 'basemod'

export function capitalize (string: string) {
  const words = string.split(' ')

  for (let i = 0; i < words.length; i++)
    words[i] = words[i][0].toUpperCase() + words[i].substr(1)

  return words.join(' ')
}

export function titleCaseToDashCase (string: string) {
  return string
    .replace(/[-|\s]+/g, '-')
    .replace(/[^-a-zA-Z0-9]/g,'')
    .toLowerCase()
}

export function dashCaseToTitleCase (string: string) {
  return capitalize(string.replace('-', ' '))
}

enum STAT {
  NONE = -1,
  STRENGTH = 0,
  AGILITY = 1,
  STAMINA = 2,
  INTELLECT = 3,
  SPIRIT = 4,
}

interface CreateStatOptions {
  id: string
  count?: number
  max?: number
  type?: STAT
  isHidden?: boolean
}

function CreatePlaceholderEnchants () {
  const special = std.DBC.SpellItemEnchantment.add(9999)
  special.Name.enGB.set('[special]')
  special.Flags.set(0)
  special.Effect.set([0, 0, 0, 0, 0])
  special.ItemVisual.set(0)
  for (let i = 0; i <= 99999; i++) {
    const enchant = std.DBC.SpellItemEnchantment.add(10000 + i)
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

function CreateStat ({ id, max = 255, count = 1, type = STAT.NONE, isHidden = true }: CreateStatOptions) {
  for (let i = 1; i <= count; i++) {
    const _id = (count === 1) ? id : (id + '-' + i)
    const stat = std.Spells.create(MOD, _id, 1459)

    stat.clear()

    stat.Name.enGB.set(dashCaseToTitleCase(_id))
    stat.Stacks.set(max)
    stat.Power.setMana(0)

    stat.Effects.addMod(effect => {
      effect.Type.APPLY_AURA.set()
      if (type === -1) {
        effect.Aura.DUMMY.set()
      } else {
        effect.Aura.MOD_STAT.set()
        effect.PointsDieSides.set(0)
        effect.PointsPerCombo.set(0)
        effect.PointsPerLevel.set(0)
        effect.PointsBase.set(i)
        effect.MiscValueA.set(type)
      }

      effect.ImplicitTargetA.UNIT_CASTER.set()
    })

    stat.CastTime.setSimple(0)
    stat.Duration.setSimple(-1)
    stat.Cooldown.set(0, 0, 0, 0)
    stat.Attributes.CANT_BE_CANCELED.set(true)
    stat.Attributes.PERSISTS_DEATH.set(true)

    if (isHidden)
      stat.Attributes.HIDE_FROM_AURA_BAR.set(true)
  }
}

CreatePlaceholderEnchants()

CreateStat({ id: 'rogue', max: 1, isHidden: false })
CreateStat({ id: 'warrior', max: 1, isHidden: false })
CreateStat({ id: 'hunter', max: 1, isHidden: false })
CreateStat({ id: 'mage', max: 1, isHidden: false })
CreateStat({ id: 'warlock', max: 1, isHidden: false })
CreateStat({ id: 'priest', max: 1, isHidden: false })
CreateStat({ id: 'druid', max: 1, isHidden: false })
CreateStat({ id: 'shaman', max: 1, isHidden: false })
CreateStat({ id: 'paladin', max: 1, isHidden: false })
CreateStat({ id: 'bard', max: 1, isHidden: false })
CreateStat({ id: 'level', max: 99, isHidden: false })
CreateStat({ id: 'strength', count: 120, type: STAT.STRENGTH, isHidden: false })
CreateStat({ id: 'agility', count: 120, type: STAT.AGILITY, isHidden: false })
CreateStat({ id: 'stamina', count: 120, type: STAT.STAMINA, isHidden: false })
CreateStat({ id: 'intellect', count: 120, type: STAT.INTELLECT, isHidden: false })
CreateStat({ id: 'spirit', count: 120, type: STAT.SPIRIT, isHidden: false })

// ---

async function main () {
  const $ = new Builder()
  
  await $.init()

  const spell = await $.Spell.add({
    id: 'test-spell',
    itemSpells: {
      'thing': {
        iLevel: 20,
      },
    },
  })

  const item = await $.Item.add({
    id: 'test-item',
    base: 1194,
    itemSpells: [{ spell: 'test-spell', id: 'thing', isIgnoreILevel: true }],
  })
}

main()

const lev = std.Spells.load(11010)

lev.Duration.setSimple(1000, 0, 0)
lev.Effects.addMod((e => {
  e.Type.APPLY_AURA.set()
  e.Aura.MOD_INCREASE_SPEED.set()
  e.PointsBase.set(120)
}))
lev.Visual.modRef(ref => {
  const s = ref.StateKit.getRef()
  const be = s.BaseEffect.getRef()
})

