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

//export function ItemReloading(events: TSEvents) {
//  events.Player.OnSay((player, message) => {
//    player.SendBroadcastMessage(message.get())
//  })
//  events.Player.OnCommand((player, command, isFound) => {
//    const cmd = command.get().split(' ')
//    if(cmd[0] === 'testlink') {
//      isFound.set(true)
//      player.SendBroadcastMessage('|cffffffff|Hitem:2092:0:0:0:0:0:0:8:2|h[Worn Dagger]|h')
//    }
//  })
//  events.Player.OnWhisper((player, _, message) => {
//    const prefix = 'refresh-item\t'
//    const str = message.get()
//    if (!str.includes(prefix))
//     return
//    const id = str.substr(prefix.length)
//    const hp = player.GetHealth()
//    const mp = player.GetPower(Powers.MANA)
//    player.ApplyItemMods(ToUInt32(id))
//    //should really send this packet to all players online
//    player.SendItemQueryPacket(ToUInt32(id))
//    //rectifies the player stats
//    if (hp)
//      player.SetHealth(hp)
//    if (mp)
//      player.SetPower(Powers.MANA, mp)
//  })
//  events.World.OnStartup(()=>{
//      LoadCustomItems()
//  })
//  //possibly replace with sending a cache packet of specific itemID whenever hover an item?
//  //perhaps have an addon that checks when finally ingame, then send this only once?
//  events.Player.OnLogin((player,first)=>{
//      player.AddTimer(3000,3,0,(owner,timer)=>{
//          owner.ToPlayer().UpdateCache()
//      })
//  })
//  events.Player.OnCommand((player,command,found)=>{
//      let cmd = command.get().split(' ')
//      if(cmd[0] == 'del'){
//          found.set(true)
//          if(cmd[1])
//            player.RemoveItem(player.GetItemByEntry(ToUInt32(cmd[1])))
//      }
//      if(cmd[0] == 'cacheme'){
//          found.set(true)
//          player.UpdateCache()
//      }
//      if(cmd[0] == 'itemreload'){
//          found.set(true)
//          const hp = player.GetHealth()
//          const mp = player.GetPower(Powers.MANA)
//          player.ApplyItemMods(ToUInt32(cmd[1]))
//          //should really send this packet to all players online
//          player.SendItemQueryPacket(ToUInt32(cmd[1]))
//          //rectifies the player stats
//          if (hp)
//            player.SetHealth(hp)
//          if (mp)
//            player.SetPower(Powers.MANA, mp)
//      }
//      if(cmd[0] == 'customitemreload'){
//          const hp = player.GetHealth()
//          const mp = player.GetPower(Powers.MANA)
//          found.set(true)
//          //get a prettier way? idk. you need GetTemplateCopy off a item instance. DO NOT use GetTemplate()
//          let newItem = player.GetItemByEntry(ToUInt32(cmd[1])).GetTemplateCopy()
//          newItem.SetStatCount(2)
//          //do your manipulations here
//          newItem.SetStatType(0,7)
//          newItem.SetStatValue(0,5)
//          newItem.SetStatType(1,5)
//          newItem.SetStatValue(1,5)
//          //do the heavy lifting
//          player.ApplyCustomItemMods(newItem)
//          //save to custom table
//          newItem.SaveItemTemplate()
//          //should really send this packet to all players online
//          player.SendItemQueryPacketWithTemplate(newItem)
//          //rectifies the player bars
//          if (hp)
//            player.SetHealth(hp)
//          if (mp)
//            player.SetPower(Powers.MANA, mp)
//      }
//      if(cmd[0] == 'customitemreload2'){
//          const hp = player.GetHealth()
//          const mp = player.GetPower(Powers.MANA)
//          found.set(true)
//          //get a prettier way? idk. you need GetTemplateCopy off a item instance. DO NOT use GetTemplate()
//          let newItem = player.GetItemByEntry(ToUInt32(cmd[1])).GetTemplateCopy()
//          //do your manipulations here
//          newItem.SetStatCount(1)
//          newItem.SetStatValue(0,1)
//          //do the heavy lifting
//          player.ApplyCustomItemMods(newItem)
//          //save to custom table
//          newItem.SaveItemTemplate()
//          //should really send this packet to all players online
//          player.SendItemQueryPacketWithTemplate(newItem)
//          //rectifies the player bars
//          if (hp)
//            player.SetHealth(hp)
//          if (mp)
//            player.SetPower(Powers.MANA, mp)
//      }
//      if(cmd[0] == 'newitem'){
//          found.set(true)
//          //for when nobody has an item
//          ReloadSingleItemTemplate(cmd[1])
//      }
//      if(cmd[0] == 'totalreload'){
//          found.set(true)
//          ReloadItemTemplate()
//      }
//  })
//}

function EasyLoot (events: TSEvents) {
  events.Player.OnWhisper((sender, _, message) => {
    const opcode = Opcode('loot-item')
    const str = message.get()
    if (!str.includes(opcode))
     return
    const a = str.substr(opcode.length).split(' ')
    if (!a[0])
      return
    sender.AddItem(ToUInt32(a[0]), ToUInt32(a[1]))
  })
  events.GameObjects.OnLootStateChanged((go, state, player) => {
    if (player.IsPlayer()) {
      const p = go.GetLootRecipient()
      if (p.IsNull())
        player.ToPlayer().SendBroadcastMessage(`${state}`)
    }
  })
  events.Creatures.OnGenerateLoot((creature, player) => {
    const loot = creature.GetLoot()
    const money = loot.GetMoney()

    // FIXME this shouldnt be necessary
    loot.SetGeneratesNormally(false)
    loot.RemoveLooter(0)
    loot.RemoveLooter(player.GetGUID())
    loot.SetMoney(0)

    const number = loot.GetItemCount() - 1
    if (number === -1)
      return
    const id = 0
    const timer = 60
    const mechanic = 0
    for (let i = 0; i <= number; i++) {
      const itemId = loot.GetItem(i).GetItemID()
      const amount = loot.GetItem(i).GetCount()
      player.SendItemQueryPacket(itemId)
      player.SendAddonMessage(
        'get-loot-item',
        `${id} ${itemId} ${amount} ${timer} ${mechanic}`,
        0,
        player,
      )
    }
    player.TryAddMoney(money)
    loot.Clear()
    loot.SetMoney(0)

    // FIXME this too
    loot.SetGeneratesNormally(false)
    loot.RemoveLooter(0)
  })
}

function Store (events: TSEvents) {
  events.Player.OnWhisper((sender, _, message) => {
    const opcode = Opcode('store-set')
    const str = message.get()
    if (!str.includes(opcode))
     return
    const a = str.substr(opcode.length).split(' ')
    if (!a[0])
      return
    const primitive = a[0]
    const type = a[1]
    const key = a[2]
    const value = a[3]
    sender.SendAddonMessage(
      'store-get',
      `${primitive} ${type} ${key} ${value}`,
      0,
      sender,
    )
  })
  events.Player.OnWhisper((sender, _, message) => {
    const opcode = Opcode('store-init')
    const str = message.get()
    if (!str.includes(opcode))
     return
    const playerGuid = sender.GetGUID()
    console.log(playerGuid)
    const a = QueryWorld(`
      select * from __addon_data where playerGuid = ${playerGuid};
    `)
    while (a.GetRow()) {
      const primitive = a.GetString(2)
      const type = a.GetString(3)
      const key = a.GetString(4)
      const value = a.GetString(5)
      sender.SendAddonMessage(
        'store-get',
        `${primitive} ${type} ${key} ${value}`,
        0,
        sender,
      )
    }
    sender.SendAddonMessage(
      'store-init-success',
      '',
      0,
      sender,
    )
  })

  events.Player.OnWhisper((sender, _, message) => {
    const opcode = Opcode('store-set')
    const str = message.get()
    if (!str.includes(opcode))
     return
    const w = str.substr(opcode.length).split(' ')
    const primitive = w[0]
    const type = w[1]
    const key = w[2]
    const value = w[3]
    const playerGuid = sender.GetGUID()
    const a = QueryWorld(`
      select * from __addon_data where playerGuid = ${playerGuid} and type = "${type}" and _key = "${key}";
    `)
    let entry = -1
    while (a.GetRow()) {
      entry = a.GetUInt32(0)
    }
    if (entry === -1) {
      QueryWorld(`
        insert into __addon_data (playerGuid, primitive, type, _key, value) value ("${playerGuid}", "${primitive}", "${type}", "${key}", "${value}");
      `)
    } else {
      QueryWorld(`
        update __addon_data set primitive = "${primitive}", type = "${type}", _key = "${key}", value = "${value}" where entry = ${entry};
      `)
    }
  })
}

function SetAbilities (player: TSPlayer) {
  const playerGuid = player.GetGUID()
  const a = QueryWorld(`
    select * from __player_talents where playerGuid = ${playerGuid};
  `)
  let used: string = '0'
  let max: string = '0'
  while (a.GetRow()) {
    used = a.GetString(1)
    max = a.GetString(2)
  }
}

function LevelingSystem (events: TSEvents) {
  events.Player.OnLogin(player => {
  })

  events.Player.OnLevelChanged((player, oldLevel) => {
  })
}

function Opcode (prefix: string): string {
  return `${prefix}\t`
}

export function Main (events: TSEvents) {
  EasyLoot(events)
  TalentSystem(events)
  // ItemReloading(events)
  LevelingSystem(events)
  Store(events)

  events.Player.OnLogin(player => {
    if (!player.IsPlayer())
      return
    const p = player.ToPlayer()
    p.SendBroadcastMessage('hehe')
    p.EquipItem(2152, 24)
  })
  // TODO find/request way to check if player is currently interacting with chest
  // FIXME
  // use events.GameObjects.OnUse (or whatever fires when a chest is opened)
  // on use, check for state on object
  // if no state exists, check db
  // check if update delta has expired, if so generate more items (if threshold is met)
  // randomize timer when item is generated
  // write generated item guids to db
  // send item data to player

  events.GameObjects.OnGenerateLoot((obj, player) => {
    player.SendBroadcastMessage(`${obj.GetDBTableGUIDLow()}`)
    const loot = obj.GetLoot()
    const count = loot.GetItemCount()
    for (let i = 0; i <= count; i++) {
      const id = loot.GetItem(i).GetItemID()
      if (id) {
        const info = GetItemTemplate(id)
        if (!info.IsNull()) {
          const name = info.GetName()
          player.SendBroadcastMessage(name)
        }
      }
    }
  })

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

