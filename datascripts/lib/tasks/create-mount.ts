import { AssetOptions } from '../asset'
import { CREATE_MOUNT_TASK, DEFAULT_MOUNT_NPC_BASE, QUERY_MOUNT_NPC } from '../constants'
import { NpcOptions } from '../npc'
import { Spell } from '../spell'
import { NWTask, TaskOptions, Template } from '../task'
import { Duration, Queryable } from '../types'
import { resolveDuration, resolveSpeed } from '../utils'

export interface MountTemplate extends Template {
  id: typeof CREATE_MOUNT_TASK
  options: MountOptions
}

export interface Mount extends Spell {
  npc: Queryable<number, typeof QUERY_MOUNT_NPC>
  npcOptions: NpcOptions
  speed: number
  flightSpeed: number
  swimSpeed: number
  duration: Duration
  isCannotUseInCombat: boolean
  isOutdoorsOnly: boolean
  isCannotUseWhileSwimming: boolean
}

export type MountOptions = AssetOptions<Mount>

export class CreateMount extends NWTask {
  static readonly id = CREATE_MOUNT_TASK

  process (template: MountTemplate) {
    const $ = this.builder

    const baseSpellNpcId = template.options.base
      && $.std.Spells.load(template.options.base).Effects.get(0).MiscValueA.get()
    const baseNpcId = $.query(template.options.npc || baseSpellNpcId, DEFAULT_MOUNT_NPC_BASE)
    const baseNpc = $.std.CreatureTemplates.load(baseNpcId)
    const name = template.options.name || baseNpc.Name.enGB.get()

    const npc = $.Npc.add(
      {
        ...(template.options.npcOptions || {}),
        name,
        base: baseNpcId,
      }
    )

    const speed = template.options.speed || 100 // FIXME
    const swimSpeed = template.options.speed || 0
    const flightSpeed = template.options.speed || 0

    const isDefaultIcon = !template.options.icon
    const isDefaultDescription = !template.options.description
    const isDefaultAuraDescription = !template.options.auraDescription

    const isGround = speed > -1
    const isSwimming = swimSpeed > -1
    const isFlying = flightSpeed > -1
    const isFasterGround = isGround && (speed > 0)
    const isFasterSwimming = isSwimming && (swimSpeed > 0)
    const isFasterFlying = isFlying && (flightSpeed > 0)

    const isNonFasterMount =
      !isFasterGround && !isFasterSwimming && !isFasterFlying
    const isNonFasterFlyingMount =
      !isFasterGround && !isFasterSwimming && !isFasterFlying
        && (flightSpeed === 0) && (swimSpeed === -1)
    const isFasterGroundMount =
      isFasterGround && !isFasterSwimming && !isFasterFlying
    const isFasterGroundFlyingMount =
      isFasterGround && !isFasterSwimming && isFasterFlying
    const isFasterFlyingMount =
      !isFasterGround && !isFasterSwimming && isFasterFlying
    const isFasterGroundSwimmingMount =
      isFasterGround && isFasterSwimming && !isFasterFlying
    const isFasterSwimmingMount =
      !isFasterGround && isFasterSwimming && !isFasterFlying

    const mount = $.Spell.add({
      ...template.options,
      base: 470,
    })
    const { asset } = mount

    asset
      .CastTime.set(resolveDuration([1.5]))
      .Attributes.IS_ABILITY.set(true)
      .Attributes.IS_HIDDEN_FROM_LOG.set(true)
      .Attributes.OUTDOORS_ONLY.set(true)
      .Attributes.NOT_SHAPESHIFTED.set(true)
      .Attributes.STOP_ATTACKING.set(true)
      .Attributes.CANNOT_USE_IN_COMBAT.set(true)
      .InterruptFlags.ON_MOVEMENT.set(true)
      .InterruptFlags.ON_INTERRUPT_CAST.set(true)
      .InterruptFlags.ON_PUSHBACK.set(true)
      .Priority.set(0)
      .PreventionType.set(0)
      .DefenseType.set(0)
      .Mechanic.set(21)
      .SchoolMask.PHYSICAL.set(true)
      .Effects.get(0).Aura.MOUNTED.set()
        .CreatureTemplate.set(npc.asset.ID)
        .ImplicitTargetA.UNIT_CASTER.set()

    if (template.options.base)
      asset.Visual.getRefCopy().cloneFromSpell(template.options.base)

    if (template.options.isCannotUseInCombat)
      asset.Attributes.CANNOT_USE_IN_COMBAT.set(true)

    if (template.options.isOutdoorsOnly)
      asset.Attributes.OUTDOORS_ONLY.set(true)

    if (template.options.isCannotUseWhileSwimming) {
      asset.Attributes.UNK78.set(true)
      asset.AuraInterruptFlags.set(128)
    }

    // FIXME: do this stuff before creating spell
    if (isDefaultIcon && typeof template.options.npc === 'object' && template.options.npc.subquery === 'spell')
      asset.Icon.set(
        typeof template.options.npc.id === 'string'
          ? $.Spell.get(template.options.npc.id).asset.Icon.get()
          : $.std.Spells.load(template.options.npc.id).Icon.get()
      )

    if (isDefaultDescription) {
      if (isNonFasterMount)
        asset.Description.enGB.set(
          `Summons and dismisses a rideable ${name}.`
        )

      if (isNonFasterFlyingMount)
        asset.Description.enGB.set(
          `Summons and dismisses a rideable ${name}. This is a flying mount.`
        )

      if (isFasterGroundMount)
        asset.Description.enGB.set(
          `Summons and dismisses a rideable ${name}, setting movespeed to ${speed}%.`
        )

      if (isFasterGroundFlyingMount)
        asset.Description.enGB.set(
          `Summons and dismisses a rideable ${name}, setting movespeed to ${speed}% and flightspeed to ${flightSpeed}%.`
        )

      if (isFasterFlyingMount)
        asset.Description.enGB.set(
          `Summons and dismisses a rideable ${name}, setting flightspeed to ${flightSpeed}%.`
        )

      if (isFasterGroundSwimmingMount)
        asset.Description.enGB.set(
          `Summons and dismisses a rideable ${name}, setting movespeed to ${speed}% and swimspeed to ${swimSpeed}%.`
        )

      if (isFasterSwimmingMount)
        asset.Description.enGB.set(
          `Summons and dismisses a rideable ${name}, setting swimspeed to ${swimSpeed}%.`
        )
    }

    if (isDefaultAuraDescription) {
      if (isNonFasterMount)
        asset.AuraDescription.enGB.set(
          'Mounted.'
        )

      if (isNonFasterFlyingMount)
        asset.AuraDescription.enGB.set(
          'Flying.'
        )

      if (isFasterGroundMount)
        asset.AuraDescription.enGB.set(
          `Movespeed set to ${speed}%.`
        )

      if (isFasterGroundFlyingMount)
        asset.AuraDescription.enGB.set(
          `Movespeed set to ${speed}%. Flightspeed set to ${flightSpeed}%.`
        )

      if (isFasterFlyingMount)
        asset.AuraDescription.enGB.set(
          `Flightspeed set to ${flightSpeed}%.`
        )

      if (isFasterGroundSwimmingMount)
        asset.AuraDescription.enGB.set(
          `Movespeed set to ${speed}%. Swimspeed set to ${swimSpeed}%.`
        )

      if (isFasterSwimmingMount)
        asset.AuraDescription.enGB.set(
          `Swimspeed set to ${swimSpeed}%.`
        )
    }

    const ground = resolveSpeed($.baseSpeed, speed)

    asset.Effects.get(1)
      .Aura.MOD_INCREASE_MOUNTED_SPEED.set()
      .PercentBase.set(Math.min(ground, 1))
      .ImplicitTargetA.UNIT_CASTER.set()

    if (isFlying) {
      const air = resolveSpeed($.baseSpeed, flightSpeed)

      asset.Effects.get(2)
        .Aura.MOD_INCREASE_MOUNTED_FLIGHT_SPEED.set()
        .PercentBase.set(Math.min(air, 1))
        .ImplicitTargetA.UNIT_CASTER.set()
    }

    if (isSwimming) {
      const water = resolveSpeed($.baseSpeed, swimSpeed)

      asset.Effects.get(2)
        .Aura.MOD_INCREASE_SWIM_SPEED.set()
        .PercentBase.set(Math.min(water, 1))
        .ImplicitTargetA.UNIT_CASTER.set()
    }

    asset.Duration.getRefCopy().set(
      resolveDuration(template.options.duration),
      0,
      resolveDuration(template.options.duration),
    )

    console.log(asset.ID)
  }
}

