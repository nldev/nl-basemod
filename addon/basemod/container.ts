interface PlayerInfo {
  name: string
}

// export class Container {
//   public root: WoWAPI.Frame
//
//   constructor () {
//     this.root = CreateFrame('Frame', 'root', UIParent)
//
//     this.root.SetScript('OnUpdate', () => this.load())
//   }
//
//   load () {
//     const player = UnitGUID('player')
//
//     if (player) {
//       const info = GetPlayerInfoByGUID(player)
//
//       if (info[0])
//         return this.ready()
//     }
//
//     return this.load()
//   }
//
//   ready () {
//     console.log('got to ready state')
//   }
// }

export class Container {
  protected isLoaded: boolean = false
  protected isInit: boolean = false

  public root: WoWAPI.Frame
  public playerInfo: PlayerInfo
  // public components: Mapping<Component>

  constructor () {
    this.root = CreateFrame('Frame')

    this.root.SetScript('OnUpdate', () => this.load())
  }

  protected load () {
    if (this.isLoaded)
      return

    const player = UnitGUID('player')

    if (player) {
      const info = GetPlayerInfoByGUID(player)

      if (info[0]) {
        console.log('hello')

        // this.playerInfo = {
        //   name: info[5].toLowerCase(),
        //   chrRace: info[2].toUpperCase() as CharacterRace,
        //   chrClass: info[0].toUpperCase() as CharacterClass,
        //   level: info[4],
        // }

        this.isLoaded = true

        console.log('loaded')
        // return this.onInit(this)
      }

      this.load()
    }
  }
}
