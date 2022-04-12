import { std } from 'wow/wotlk'
import $ from '.'

// guile
export const Guile = std.Spells.create($.Mod, 'guile', 24532)
Guile.Attributes.NOT_BREAK_STEALTH.set(true)
Guile.Name.enGB.set('Guile')
Guile.Icon.setPath('spell_nature_healingway')
const e = Guile.Effects.get(0)
e.PointsBase.set(60)
e.PointsPerLevel.set(0)
Guile.Cooldown.set(1000 * 60 * 2, 0, 0, 0)
Guile.Description.enGB.set('Instantly restores 60 energy.')
const v = Guile.Visual.getRefCopy()
const k = v.CastKit.getRefCopy()
k.StartAnimation.set(-1)
k.Animation.set(-1)
$.Spells['guile'] = Guile


