import { App } from './main'
import { CharacterClass, CharacterRace, Component, Mapping, PlayerInfo } from './types'

export class Container {
  protected isLoaded: boolean = false
  protected isInit: boolean = false

  public root: WoWAPI.Frame
  public playerInfo: PlayerInfo
  public components: Mapping<Component>

  constructor () {
    this.root = CreateFrame('Frame')

    this.root.SetScript('OnUpdate', () => this.load())
  }

  protected load () {
    if (this.playerInfo)
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

        return this.init()
      }

      this.load()
    }
  }

  protected init () {
    App(this)
  }
}

export default new Container()

