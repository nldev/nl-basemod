import { Opcode } from './utils'

const LooterState = new TSJsonObject()

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
      // if (p.IsNull())
      //   player.ToPlayer().SendBroadcastMessage(`${state}`)
    }
  })
  events.Creatures.OnGenerateLoot((creature, player) => {
    // FIXME refactor to use GetLootRecipientGroup()
    const loot = creature.GetLoot()
    loot.SetMoney(0)
    const number = loot.GetItemCount() - 1
    if (number === -1)
      return
    const group = player.GetGroup()
    const guid = group.GetGUID()
    if (player.IsInGroup()) {
      let current = LooterState.GetNumber(`${guid}`, 0)
      const count = group.GetMembersCount()
      if (current > count) {
        current = count - 1
      } else if (!current || (current === group.GetMembersCount())) {
        current = 0
      }
      let valid = 0
      group.GetMembers().forEach((member, i) => {
        const isWithinDist = member.IsWithinDist(creature, 100, true)
        if ((i === current) && !isWithinDist) {
          current = ((current + 1) > group.GetMembersCount()) ? 0 : (current + 1)
        } else if ((i === current) && isWithinDist) {
          valid = i
        }
      })
      group.GetMembers().forEach((member, i) => {
        if ((i === valid)) {
          LooterState.SetNumber(`${guid}`, current + 1)
          const id = 0
          const timer = 100
          const mechanic = 0
          for (let i = 0; i <= number; i++) {
            const itemId = loot.GetItem(i).GetItemID()
            const amount = loot.GetItem(i).GetCount()
            member.SendItemQueryPacket(itemId)
            member.SendAddonMessage(
              'get-loot-item',
              `${id} ${itemId} ${amount} ${timer} ${mechanic}`,
              0,
              member,
            )
          }
        }
      })
    } else {
      const id = 0
      const timer = 100
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
    }
    loot.Filter(() => false)
  })
}
