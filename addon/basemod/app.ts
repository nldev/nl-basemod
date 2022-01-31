import { CharacterRace, CharacterClass } from './types'

interface PlayerInfo {
  name: string
  chrRace: CharacterRace
  chrClass: CharacterClass
  level: number
}

export class App {
  protected isLoaded: boolean = false
  protected isInit: boolean = false

  public root: WoWAPI.Frame
  public playerInfo: PlayerInfo
  // public components: Mapping<Component>

  constructor (isDummy: boolean = false) {
    if (!isDummy) {
      this.root = CreateFrame('Frame')
      this.root.SetScript('OnUpdate', () => this.load())
    }
  }

  protected load () {
    if (this.isLoaded)
      return

    const player = UnitGUID('player')

    if (player) {
      const info = GetPlayerInfoByGUID(player)

      if (info[0]) {
        this.playerInfo = {
          name: info[5].toLowerCase(),
          chrRace: info[2].toUpperCase() as CharacterRace,
          chrClass: info[0].toUpperCase() as CharacterClass,
          level: info[4],
        }

        this.isLoaded = true

        console.log(this.playerInfo.name)
        console.log(this.playerInfo.chrRace)
        console.log(this.playerInfo.chrClass)
        console.log(this.playerInfo.level)

        console.log('loaded')
        console.log('a new one')
      }

      this.load()
    }
  }

  public init () {
  }
}

