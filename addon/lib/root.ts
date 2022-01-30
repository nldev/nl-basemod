export class Root {
  private isLoading = true

  public init () {
  }

  public start () {
    if (this.isLoading) {
      const player = UnitGUID('player')

      if (player) {
        const info = GetPlayerInfoByGUID(player)

        if (info[0]) {
          this.isLoading = false

          init()
        }
      }
    }
  }
}

function load () {
}

function init () {
  console.log('loaded')
}

export const root = CreateFrame('Frame', 'root', UIParent)

root.SetScript('OnUpdate', () => {
  load()
})
