function IsAbleToRest (player: TSPlayer): boolean {
  const p = player
  if (p.IsDead() || p.IsMounted() || p.IsFlying() || p.IsInWater() || p.IsFlying() || p.IsInCombat()) {
    return false
  } else {
    return true
  }
}

function EnableRest (player: TSPlayer) {
  player.AddTimer(30, -1, (owner, timer) => {
    const p = owner.ToPlayer()
    if (p.IsNull())
      timer.Stop()
    if (!IsAbleToRest(p))
      return
    const isSitting = p.GetStandState()
    if (isSitting) {
      const isMaxHealth = p.GetHealth() >= p.GetMaxHealth()
      if (isMaxHealth && p.HasAura(25221)) {
        p.RemoveAura(1127)
        return
      }
      const d = p.GetFloat('rest-timer', 0)
      const c = GetCurrTime()
      if (d === 0) {
        p.SetFloat('rest-timer', c)
      } else {
        const diff = c - d
        if (!isMaxHealth && (diff > 6000) && !p.HasAura(25221))
          p.AddAura(25221, p)
      }
    } else {
      p.SetFloat('rest-timer', 0)
      p.RemoveAura(25221)
    }
  })
}

export function Rest (events: TSEvents) {
  events.Player.OnLogin(player => {
    EnableRest(player)
    // switch (emote) {
    //   // STATE_SIT
    //   case 13:
    //   // STATE_SIT_CHAIR_LOW
    //   case 461:
    //   // STATE_SIT_CHAIR_MED
    //   case 415:
    //   // STATE_SIT_CHAIR_HIGH
    //   case 426:
    //   // STATE_KNEEL
    //   case 68:
    //   // STATE_SLEEP
    //   case 12:
    //     if (!player.HasAura(1127)) {
    //       player.SendBroadcastMessage('resting')
    //       player.AddAura(1127, player)
    //     }
    // }
  })
}

