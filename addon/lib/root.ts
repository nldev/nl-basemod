let isLoading = true

function load () {
  if (isLoading) {
    const player = UnitGUID('player')

    if (player) {
      const info = GetPlayerInfoByGUID(player)

      if (info[0]) {
        isLoading = false

        init()
      }
    }
  }
}

function init () {
  console.log('loaded')
}

export const root = CreateFrame('Frame', 'root', UIParent)

root.SetScript('OnUpdate', () => {
  load()
})
