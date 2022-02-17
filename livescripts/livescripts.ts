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
  events.SpellID.OnCast(13653, spell => {
    const item = spell.GetCaster().ToPlayer().GetItemByGUID(
      spell.GetTarget().GetGUID()
    )
  })
  events.SpellID.OnCast(13653, spell => {
    const item = spell.GetTarget()
    const entry = item.GetEntry()
    const guid = item.GetGUID()
    const guidlow = item.GetGUIDLow()
    const caster = spell.GetCaster()
    if (caster.IsPlayer()) {
      const player = caster.ToPlayer()
      player.SendBroadcastMessage(`entry: ${entry}`)
      player.SendBroadcastMessage(`guid: ${guid}`)
      player.SendBroadcastMessage(`guidlow: ${guidlow}`)
      const a = player.GetItemByGUID(guid)
      const name = a.GetName()
      player.SendBroadcastMessage(`name: ${name}`)
    }
  })
  events.Player.OnSay((player, message) => {
    let text = message.get()

    if (text === '@placeholder') {
      let item = player.AddItem(2139, 1)
      item.SetEnchantment(9999, 0)
      item.SetEnchantment(1 + 10000, 2)
      item.SetEnchantment(2 + 10000, 3)
      item.SetEnchantment(3 + 10000, 4)
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




// talents
function Setup (events: TSEvents) {
}

function HandleGetTalentInfo (events: TSEvents) {
  events.Player.OnWhisper((sender, _, message) => {
    const opcode = Opcode('get-talent-info')
    const str = message.get()
    if (!str.includes(opcode))
     return
    const playerGuid = sender.GetGUID()
    const a = QueryWorld(`
      select * from __player_talents where playerGuid = ${playerGuid};
    `)
    let used: string = '0'
    let max: string = '0'
    while (a.GetRow()) {
      used = a.GetString(1)
      max = a.GetString(2)
    }
    sender.SendAddonMessage('get-talent-info-success', `${used} ${max}`, 0, sender)
    const b = QueryWorld(`
      select * from __talent_instances where playerGuid = ${playerGuid};
    `)
    while (b.GetRow()) {
      const id = b.GetString(2)
      const isActive = b.GetUInt16(3)
      if (id && isActive)
        sender.SendAddonMessage('learn-talent-success', id, 0, sender)
    }
  })
}

function HandleLearnTalent (events: TSEvents) {
  events.Player.OnWhisper((sender, _, message) => {
    const opcode = Opcode('learn-talent')
    const str = message.get()
    if (!str.includes(opcode))
     return
    const playerGuid = sender.GetGUID()
    const talentId = str.substr(opcode.length)
    if (!talentId)
      return
    // check if is valid talent
    const a = QueryWorld(`
      select * from __talents where id = "${talentId}";
    `)
    let spellId = 0
    let cost = 0
    let classMask = 0
    while (a.GetRow()) {
      spellId = a.GetUInt16(2)
      cost = a.GetUInt16(3)
      classMask = a.GetUInt16(5)
    }
    console.log(spellId)
    if (!spellId || !cost || !classMask)
      return
    // check if player has enough points
    const b = QueryWorld(`
      select * from __player_talents where playerGuid = ${playerGuid};
    `)
    let used = 0
    let max = 0
    while (b.GetRow()) {
      used = b.GetUInt16(1)
      max = b.GetUInt16(2)
    }
    if (!max)
      return
    const existingRemaining = max - used
    const remaining = existingRemaining - cost
    if (remaining < 0)
      return
    // FIXME: check if player is correct class
    // learn spell
    sender.LearnSpell(spellId)
    // update __talent_instances
    QueryWorld(`
      delete from __talent_instances where playerGuid=${playerGuid} and talentId="${talentId}"
    `)
    QueryWorld(`
      insert into __talent_instances (playerGuid, talentId, isActive) values(${playerGuid}, "${talentId}", 1) on duplicate key update
        playerGuid=${playerGuid}, talentId="${talentId}", isActive=1
    `)
    // update __player_talents
    QueryWorld(`
      insert into __player_talents (playerGuid, max, used) values(${playerGuid}, ${max}, ${max - remaining}) on duplicate key update
        max=${max}, used=${max - remaining}
    `)
    sender.SendAddonMessage('learn-talent-success', talentId, 0, sender)
    sender.SendAddonMessage('get-talent-info-success', `${max - remaining} ${max}`, 0, sender)
  })
}

function HandleUnlearnTalent (events: TSEvents) {
  events.Player.OnWhisper((sender, _, message) => {
    const opcode = Opcode('unlearn-talent')
    const str = message.get()
    if (!str.includes(opcode))
     return
    const playerGuid = sender.GetGUID()
    const talentId = str.substr(opcode.length)
    if (!talentId)
      return
    // check if is valid talent
    const a = QueryWorld(`
      select * from __talents where id = "${talentId}";
    `)
    let spellId = 0
    let cost = 0
    let classMask = 0
    while (a.GetRow()) {
      spellId = a.GetUInt16(2)
      cost = a.GetUInt16(3)
      classMask = a.GetUInt16(5)
    }
    if (!spellId || !cost || !classMask)
      return
    console.log(spellId)
    // get current talent points
    const b = QueryWorld(`
      select * from __player_talents where playerGuid = ${playerGuid};
    `)
    let used = 0
    let max = 0
    while (b.GetRow()) {
      used = b.GetUInt16(1)
      max = b.GetUInt16(2)
    }
    const existingRemaining = max - used
    const remaining = existingRemaining + cost
    // unlearn spell
    sender.RemoveSpell(spellId, true, false)
    // update __talent_instances
    QueryWorld(`
      delete from __talent_instances where playerGuid=${playerGuid} and talentId="${talentId}"
    `)
    QueryWorld(`
      insert into __talent_instances (playerGuid, talentId, isActive) values(${playerGuid}, "${talentId}", 0) on duplicate key update
        playerGuid=${playerGuid}, talentId="${talentId}", isActive=0
    `)
    // update __player_talents
    QueryWorld(`
      insert into __player_talents (playerGuid, max, used) values(${playerGuid}, ${max}, ${max - remaining}) on duplicate key update
        max=${max}, used=${max - remaining}
    `)
    sender.SendAddonMessage('unlearn-talent-success', talentId, 0, sender)
    sender.SendAddonMessage('get-talent-info-success', `${max - remaining} ${max}`, 0, sender)
  })
}

function HandleSetTalentPoints (events: TSEvents) {
  events.Player.OnWhisper((sender, _, message) => {
    const opcode = Opcode('set-talent-points')
    const str = message.get()
    if (!str.includes(opcode))
     return
    const playerGuid = sender.GetGUID()
    const max = str.substr(opcode.length)
    if (max) {
      QueryWorld(`
        insert into __player_talents (playerGuid, used, max) values(${playerGuid}, 0, ${max}) on duplicate key update
          used=0, max=${max}
      `)
      sender.SendAddonMessage('set-talent-points-success', `0 ${max}`, 0, sender)
      sender.SendAddonMessage('get-talent-info-success', `0 ${max}`, 0, sender)
    }
    // FIXME: remove all existing talents
  })
}

function GM (events: TSEvents) {
  HandleSetTalentPoints(events)
}

function TalentSystem (events: TSEvents) {
  Setup(events)
  HandleGetTalentInfo(events)
  HandleLearnTalent(events)
  HandleUnlearnTalent(events)
  GM(events)
}

function Opcode (prefix: string): string {
  return `${prefix}\t`
}

export function Main (events: TSEvents) {
  TalentSystem(events)
  // events.Player.OnWhisper((sender, _, message) => {
  //   const opcode = Opcode('learn-talent')
  //   const string = message.get()
  //   const isTestOpcode = string.includes(opcode)
  //   if (isTestOpcode) {
  //     const msg = string.substr(opcode.length)
  //     sender.SendBroadcastMessage(msg)
  //   }
  // })
  //
  // events.CustomPacketID.OnReceive('test' (opcode, packet, player))
  // packet.SendToPlayer()
  // TestCmdGetRandomPropertyOfFirstItemInBag(events)
  // TestCmdAddItemWithPlaceholderEnchant(events)
  // TestCmdChangeFactionAlliance(events)
  // TestCmdChangeFactionHorde(events)
  // EquipSystem(events)
  // LevelUp(events)
  // ResetLevel(events)
  // TestCmdSetFFA(events)
  // TestCmdUnsetFFA(events)
}

