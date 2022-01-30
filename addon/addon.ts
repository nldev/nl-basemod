const root = CreateFrame('Frame')

Events.System.OnPlayerEnteringWorld(root, () => {
  console.log(GetPlayerInfoByGUID(UnitGUID('player')))
})
