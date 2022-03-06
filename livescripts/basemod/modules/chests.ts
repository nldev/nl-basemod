// TODO find/request way to check if player is currently interacting with chest
// FIXME
// use events.GameObjects.OnUse (or whatever fires when a chest is opened)
// on use, check for state on object
// if no state exists, check db
// check if update delta has expired, if so generate more items (if threshold is met)
// randomize timer when item is generated
// write generated item guids to db
// send item data to player
export function Chests (events: TSEvents) {
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
}

