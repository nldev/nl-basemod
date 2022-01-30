const root = CreateFrame('Frame')

Events.System.OnPlayerEnteringWorld(root, () => {
  const x = GetPlayerInfoByGUID(UnitGUID('player'))
  console.log(x[0])
  console.log(x[1])
  console.log(x[2])
  console.log(x[3])
  console.log(x[4])
  console.log(x[5])
})
