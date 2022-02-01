import { CharacterRace, CharacterClass, Mapping } from './types'
import { Element } from './component'

interface PlayerInfo {
  name: string
  chrRace: CharacterRace
  chrClass: CharacterClass
  level: number
}

export class Container {
  protected isLoaded: boolean = false
  protected isInit: boolean = false

  public elements: Mapping = {}
  public root: WoWAPI.Frame
  public playerInfo: PlayerInfo

  constructor (protected onInit: ($: Container) => void, isDummy: boolean = false) {
    if (!isDummy) {
      this.root = CreateFrame('Frame', 'root', UIParent)
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

        this.onInit(this)
      }

      this.load()
    }
  }

  public register (element: Element<any, any>) {
    this.elements[element.name] = element
  }
}

