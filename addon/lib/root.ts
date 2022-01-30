import '../global'

export class Root {
  private isLoading = true

  public frame: WoWAPI.Frame

  constructor (public onLoad: () => void) {
    this.frame = CreateFrame('Frame', 'root', UIParent)
    this.frame.SetScript('OnUpdate', () => this.load())
  }

  public init () {
    this.onLoad()
  }

  public load () {
    if (this.isLoading) {
      const player = UnitGUID('player')

      if (player) {
        const info = GetPlayerInfoByGUID(player)

        if (info[0]) {
          this.isLoading = false

          this.init()
        }
      }
    }
  }
}

