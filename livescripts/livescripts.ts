function GetLevel (obj: TSObject): uint32 {
  let level: uint32 = 0

  if (obj.IsUnit()) {
    let unit = obj.ToUnit()
    if (unit.HasAura(80900)) {
      let aura = unit.GetAura(80900)
      level = aura.GetStackAmount()
    }
  }

  return level
}

function ResetLevel (events: TSEvents) {
  events.Player.OnSay((player, message) => {
    let text = message.get()

    if (text === '@reset') {
      player.RemoveAura(80900)
      player.AddAura(80900, player)
      player.SendBroadcastMessage(`level: 1`)
    }
  })
}

function LevelUp (events: TSEvents) {
  events.SpellID.OnCast(80900, spell => {
    let target: TSObject
    if (spell.GetTarget().IsNull()) {
      target = spell.GetCaster()
    } else {
      target = spell.GetTarget()
    }
    let prev: uint32 = GetLevel(target)
    let player = target.ToPlayer()
    let level: uint32 = (prev === 99) ? 99 : (prev + 1)
    player.SendBroadcastMessage(`level: ${level}`)
  })
}

function TestCmdUnsetFFA (events: TSEvents) {
  events.Player.OnSay((player, message) => {
    let text = message.get()
    if (text === '@noffa') {
      player.SetFFA(false)
    }
  })
}

function TestCmdSetFFA (events: TSEvents) {
  events.Player.OnSay((player, message) => {
    let text = message.get()
    if (text === '@ffa') {
      player.SetFFA(true)
    }
  })
}

function TestCmdChangeFactionHorde (events: TSEvents) {
  events.Player.OnSay((player, message) => {
    let text = message.get()

    if (text === '@horde') {
      player.SetFactionForRace(8)
    }
  })
}

function TestCmdChangeFactionAlliance (events: TSEvents) {
  events.Player.OnSay((player, message) => {
    let text = message.get()

    if (text === '@alliance') {
      player.SetFactionForRace(1)
    }
  })
}

function TestCmdGetRandomPropertyOfFirstItemInBag (events: TSEvents) {
  events.Player.OnSay((player, message) => {
    let text = message.get()

    if (text === '@first') {
      let item = player.GetItemByPos(255, 23)
      if (!item.IsNull())
        player.SendBroadcastMessage(`${item.GetRandomProperty()}`)
    }
  })
}

function TestCmdAddItemWithPlaceholderEnchant (events: TSEvents) {
  events.Player.OnSay((player, message) => {
    let text = message.get()

    if (text === '@placeholder') {
      let item = player.AddItem(2139, 1)
      item.SetEnchantment(9999, 0)
      item.SetEnchantment(1 + 10000, 2)
      item.SetEnchantment(0 + 10000, 3)
      item.SetEnchantment(0 + 10000, 4)
    }
  })
}

function OnLogin (events: TSEvents) {
}

function EquipSystem (events: TSEvents) {
  events.Player.OnLogin(player => {
    player.RemoveAura(81140)
  })

  events.Player.OnUpdateArmor(player => {
    player.SendBroadcastMessage('update')
  })

  events.Items.OnUnequip((item, player) => {
    let isSpecial = item.GetEnchantmentID(0) === 9999

    if (isSpecial) {
      let a = `${item.GetEnchantmentID(4) - 10000}`
      let b = `${item.GetEnchantmentID(3) - 10000}`
      let c = `${item.GetEnchantmentID(2) - 10000}`
      let id: uint32 = ToUInt32(a + b + c)

      player.SendBroadcastMessage(`${id}`)

      if ((id === 1) && player.HasAura(81140)) {
        let aura = player.GetAura(81140)
        let stacks = aura.GetStackAmount()
        if (stacks === 1) {
          player.RemoveAura(81140)
        } else {
          aura.SetStackAmount(stacks - 1)
        }
      }
    }
  })

  events.Unit.OnMeleeDamageLate((info, damage) => {
    let dmg1 = info.GetDamage1()
    let dmg2 = info.GetDamage2()
    let attackType = info.GetAttackType()
    let attacker = info.GetAttacker()
    if (!attacker.IsPlayer())
      return
    let player = attacker.ToPlayer()
    player.SendBroadcastMessage('dmg1: ' + dmg1)
    player.SendBroadcastMessage('dmg2: ' + dmg2)
    player.SendBroadcastMessage('attackType: ' + attackType)
  })

  // events.Items.OnEquipEarly((item, player) => {
  //   let isSpecial = item.GetEnchantmentID(0) === 9999

  //   if (isSpecial) {
  //     let a = `${item.GetEnchantmentID(4) - 10000}`
  //     let b = `${item.GetEnchantmentID(3) - 10000}`
  //     let c = `${item.GetEnchantmentID(2) - 10000}`
  //     let id: uint32 = ToUInt32(a + b + c)

  //     player.SendBroadcastMessage(`${id}`)

  //     if (id === 1) {
  //       let stacks = 0
  //       let isHasAura = player.HasAura(81140)
  //       if (isHasAura) {
  //         let aura = player.GetAura(81140)
  //         stacks = aura.GetStackAmount()
  //         aura.SetStackAmount(stacks + 1)
  //       } else {
  //         player.AddAura(81140, player)
  //       }
  //     }
  //   }
  // })
}

export function Main (events: TSEvents) {
  TestCmdGetRandomPropertyOfFirstItemInBag(events)
  TestCmdAddItemWithPlaceholderEnchant(events)
  TestCmdChangeFactionAlliance(events)
  TestCmdChangeFactionHorde(events)
  EquipSystem(events)
  LevelUp(events)
  ResetLevel(events)
  TestCmdSetFFA(events)
  TestCmdUnsetFFA(events)
}

