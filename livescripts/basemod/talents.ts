import { Opcode } from './utils'

function Setup (events: TSEvents) {
}

function SetTalents(player: TSPlayer, amount: number = 0) {
  const playerGuid = player.GetGUID()
  const level = player.GetLevel()
  const a = QueryWorld(`
    select * from __player_talents where playerGuid = ${playerGuid};
  `)
  let used: number = 0
  let max: number = level + 9
  while (a.GetRow()) {
    player.SendBroadcastMessage(`1: ${a.GetUInt32(0)}`)
    player.SendBroadcastMessage(`2: ${a.GetUInt32(1)}`)
    player.SendBroadcastMessage(`3: ${a.GetUInt32(2)}`)
    used = a.GetUInt32(2)
  }
  if (used > max)
    used = max
  if (amount) {
    used = 0
    max = amount
  }
  player.SendBroadcastMessage(`amount: ${amount}`)
  player.SendBroadcastMessage(`used: ${used}`)
  player.SendBroadcastMessage(`max: ${max}`)
  player.SendBroadcastMessage(`remainder: ${max - used}`)
  QueryWorld(`
    insert into __player_talents (playerGuid, max, used) values(${playerGuid}, ${max}, ${used}) on duplicate key update
      max=${max}, used=${used}
  `)
  player.SendAddonMessage('get-talent-info-success', `${max - (max - used)} ${max}`, 0, player)
}

function ResetTalents(player: TSPlayer) {
  const playerGuid = player.GetGUID()
  const a = QueryWorld(`
    select * from __player_talents where playerGuid = ${playerGuid};
  `)
  let max: string = '0'
  while (a.GetRow()) {
    max = a.GetString(2)
  }
  QueryWorld(`
    insert into __player_talents (playerGuid, max, used) values(${playerGuid}, ${max}, 0) on duplicate key update
      max=${max}, used=0
  `)
  player.SendAddonMessage('get-talent-info-success', `${max} ${max}`, 0, player)
  player.SendAddonMessage('reset-talents', `${max}`, 0, player)
}

function ApplyTalents(player: TSPlayer) {
  const playerGuid = player.GetGUID()
  const a = QueryWorld(`
    select * from __talent_instances where playerGuid = ${playerGuid};
  `)
  while (a.GetRow()) {
    const id = a.GetString(2)
    const isActive = a.GetUInt16(3)
    if (id && isActive) {
      // FIXME: create a row if doesnt exist
      const c = QueryWorld(`
        select * from __talents where id = "${id}";
      `)
      let spellId = 0
      while (c.GetRow()) {
        spellId = c.GetUInt16(2)
        if (player.HasSpell(spellId)) {
          player.LearnSpell(spellId)
        } else {
          player.RemoveSpell(spellId, false, false)
        }
      }
    }
  }
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
    const b = QueryWorld(`
      select * from __talent_instances where playerGuid = ${playerGuid};
    `)
    while (b.GetRow()) {
      const id = b.GetString(2)
      const isActive = b.GetUInt16(3)
      if (id && isActive) {
        // FIXME: create a row if doesnt exist
        const c = QueryWorld(`
          select * from __talents where id = "${id}";
        `)
        let spellId = 0
        while (c.GetRow())
          spellId = c.GetUInt16(2)
        if (spellId && !sender.HasSpell(spellId))
          sender.LearnSpell(spellId)
        sender.SendAddonMessage('learn-talent-success', id, 0, sender)
      }
    }
    sender.SendAddonMessage('get-talent-info-success', `${used} ${max}`, 0, sender)
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
    if ((sender.GetClassMask() & classMask) === sender.GetClassMask())
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
    sender.SaveToDB()
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
    const remaining = ((existingRemaining + cost) > max) ? max : (existingRemaining + cost)
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
    sender.SaveToDB()
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

function HandleResetTalents (events: TSEvents) {
  events.Player.OnSay((p, m) => {
    if (m.get() === '@reset')
      ResetTalents(p)
  })
}

function OnLogin (events: TSEvents) {
  events.Player.OnLogin((player, isFirstLogin) => {
    SetTalents(player, isFirstLogin ? 11 : 0)
    ApplyTalents(player)
  })
}


function OnLevelup (events: TSEvents) {
  events.Player.OnLevelChanged((player, oldLevel) => {
    SetTalents(player)
    if (oldLevel > player.GetLevel()) {
      ApplyTalents(player)
    } else {
      ResetTalents(player)
    }
  })
}

function GM (events: TSEvents) {
  HandleSetTalentPoints(events)
  HandleResetTalents(events)
}

export function Talents (events: TSEvents) {
  Setup(events)
  HandleGetTalentInfo(events)
  HandleLearnTalent(events)
  HandleUnlearnTalent(events)
  OnLogin(events)
  OnLevelup(events)
  GM(events)
}

