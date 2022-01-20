import { std } from 'tswow-stdlib'
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

// ---

function main () {
  const $ = new Builder()

  $.init()

  const zeal = $.Spell.add({
    id: 'zeal',
    name: 'Zeal',
    base: 2983,
  })

  zeal.asset.Effects.get(0)
    .PointsBase.set(50)

  zeal.asset.Effects.addMod(effect => effect
    .Type.APPLY_AURA.set()
    .Aura.MOD_PACIFY_SILENCE.set()
    .ImplicitTargetA.UNIT_CASTER.set()
  )

  zeal.asset.Attributes.IGNORE_IMMUNE_FLAGS.set(1)
  zeal.asset.Duration.setSimple(0, 0, 0)
  zeal.asset.Cooldown.set(resolveDuration(1), 0, 0, 0)
  zeal.asset.Icon.setPath($.std.Spells.load(54154).Icon.getPath())

  const visual = zeal.asset.Visual.getRef()
  visual.StateKit.getRefCopy().clear()

  console.log(zeal.asset.objectify())
  console.log(zeal.asset.Effects.get(0).objectify())
  console.log(zeal.asset.Effects.get(1).objectify())
}

main()

