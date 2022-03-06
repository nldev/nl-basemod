import { Opcode } from '../utils'

export function EasyLoot (events: TSEvents) {
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
