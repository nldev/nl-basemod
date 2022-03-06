import { ROOT } from './constants'
import { PlayerInfo, TalentInfo, Mapping, CharacterRace, CharacterClass } from './types'
import { Root, Element } from './frame'
import { Store } from './store'

// app
export const Get: () => App = () => _G['app']

export class App {
  protected isStarted: boolean = false

  public root: Element
  public playerInfo: PlayerInfo
  public talentInfo: TalentInfo
  public elements: Mapping<Element<any, any>> = {}
  public store: Store = new Store()

  constructor (public onInit: ($: App) => void) {
    this.talentInfo = {
      isEnabled: false,
      used: 0,
      max: 0,
      active: {},
    }

    const root = CreateFrame('Frame', ROOT, UIParent)

    root.SetScript('OnUpdate', () => {
      if (!this.isStarted) {
        this.start(root)
      } else {
        root.SetScript('OnUpdate', () => {})
      }
    })
  }

  protected start (root: WoWAPI.Frame) {
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

        _G['app'] = this

        this.root = Root(root)
        this.isStarted = true

        this.store.Init(() => this.onInit(this))
      }
    }
  }
}
