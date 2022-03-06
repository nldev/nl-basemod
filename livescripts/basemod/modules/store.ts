import { Opcode } from '../utils'

export function Store (events: TSEvents) {
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
