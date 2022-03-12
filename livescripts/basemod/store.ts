import { Opcode } from './utils'

  // 0: player
  // 1: account

  // 0: number
  // 1: string
  // 2: boolean
  // 3: null

export function Store (events: TSEvents) {
  events.Player.OnWhisper((sender, _, message) => {
    const opcode = Opcode('store-init')
    const str = message.get()
    if (!str.includes(opcode))
     return
    const pGuid = sender.GetGUID()
    const a = QueryWorld(`
      select * from __addon_data where guid = ${pGuid};
    `)
    while (a.GetRow()) {
      const primitive = a.GetUInt8(2)
      const type = a.GetUInt8(3)
      const key = a.GetString(4)
      const value = a.GetString(5)
      sender.SendAddonMessage(
        'store-get',
        `${primitive} ${type} ${key} ${value}`,
        0,
        sender,
      )
    }
    const aGuid = sender.GetAccountID()
    const b = QueryWorld(`
      select * from __addon_data where guid = ${aGuid};
    `)
    while (b.GetRow()) {
      const primitive = a.GetUInt8(2)
      const type = a.GetUInt8(3)
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
    const primitive = ToUInt8(w[0])
    const type = ToUInt8(w[1])
    const key = w[2]
    const value = w[3]
    const pGuid = sender.GetGUID()
    const aGuid = sender.GetAccountID()
    const guid = (type === 0) ? pGuid : aGuid
    const a = QueryWorld(`
      select * from __store where guid = ${guid} and type = ${type} and storeKey = "${key}";
    `)
    let entry = -1
    while (a.GetRow()) {
      entry = a.GetUInt32(0)
      if (entry === -1) {
        QueryWorld(`
          insert into __store (guid, primitive, type, storeKey, storeValue) value (${guid}, ${primitive}, "${type}", "${key}", "${value}");
        `)
      } else {
        QueryWorld(`
          update __store set primitive = ${primitive}, type = ${type}, storeKey = "${key}", storeValue = "${value}" where entry = ${entry};
        `)
      }
    }
    sender.SendAddonMessage(
      'store-get',
      `${primitive} ${type} ${key} ${value}`,
      0,
      sender,
    )
  })
}
