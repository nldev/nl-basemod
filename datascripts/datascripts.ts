import { std } from 'wow/wotlk'
import { Builder } from './lib'
import { resolveDuration } from './lib/utils'

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

  $.init()
  StarterSpells($)

  const n = $.std.Items.create('noworld', 'test-bow', 34334)
  const i = $.std.Items.load(34334)
  n.Class.GUN.set()
  // n.AmmoType.BULLET.set()
  n.Damage.clearAll()
  n.Damage.addPhysical(1, 5)
  n.Stats.clearAll()
  n.Durability.set(0)
  n.RequiredLevel.set(0)
  n.ItemLevel.set(1)
  n.Spells.clear(0)
  n.Spells.clear(1)
  n.Spells.clear(2)
  n.Quality.WHITE.set()
  n.Bonding.NO_BOUNDS.set()
  n.Flags.UNIQUE_EQUIPPED.set(0)
  n.Flags.clearAll()
  n.Description.clear()
  n.Name.enGB.set('Bow')
  n.DisplayInfo.set($.std.Items.load(2508).DisplayInfo.get())
  n.InventoryType.set(26)

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

  console.log($.std.Spells.load(36554).Icon.getPath())

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

