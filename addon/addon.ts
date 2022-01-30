const root = CreateFrame('Frame')

Events.System.OnPlayerLogin(root, (x, y, z) => {
  console.log(x)
  console.log(y)
  console.log(z)
})

