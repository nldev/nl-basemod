function SetAbilities (player: TSPlayer) {
  const level = player.GetLevel()
  const playerMask = player.GetClassMask()
  const a = QueryWorld(`
    select * from __autolearn;
  `)
  while (a.GetRow()) {
    const spellId = a.GetInt32(2)
    const classMask = a.GetInt32(3)
    const requiredLevel = a.GetInt32(4)
    const isCorrectClass = (playerMask & classMask) === playerMask
    const isCorrectLevel = level >= requiredLevel
    const isAlreadyHasSpell =  player.HasSpell(spellId)
    const isShouldLearnSpell = isCorrectClass && isCorrectLevel
    if (isShouldLearnSpell)
      player.LearnSpell(spellId)
    if (!isShouldLearnSpell && isAlreadyHasSpell)
      player.RemoveSpell(spellId, false, false)
  }
}

export function Autolearn (events: TSEvents) {
  events.Player.OnLogin(player => {
    SetAbilities(player)
  })

  events.Player.OnCreateEarly(player => {
    SetAbilities(player)
  })

  events.Player.OnLevelChanged(player => {
    SetAbilities(player)
    // TODO: max rage and energy (in another file)
    // player.SetPower(player.GetMaxPower(-1), -1)
  })
}
