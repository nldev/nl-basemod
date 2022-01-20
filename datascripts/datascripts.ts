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

  zeal.asset.Effects.clearAll()

  zeal.asset.Effects.addMod(effect => {
    effect
      .Aura.MOD_INCREASE_SPEED.set()
      .PercentBase.set(70)
      .PercentDieSides.set(0)
  })

  zeal.asset.Effects.addMod(effect => {
    effect
      .Aura.MOD_SILENCE.set()
  })

  zeal.asset.Duration.set(resolveDuration([10]))
  zeal.asset.Cooldown.set(resolveDuration(30), 0, 0, 0)

  console.log(zeal.asset.objectify())
}

main()

