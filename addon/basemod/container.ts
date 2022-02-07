import { CharacterRace, CharacterClass, Mapping } from './types'
import { Style, Element } from './component'

interface PlayerInfo {
  name: string
  chrRace: CharacterRace
  chrClass: CharacterClass
  level: number
}

export class Container {
  protected isLoaded: boolean = false
  protected isInit: boolean = false

  public styles: Mapping<Style> = {
    'reset': {
      bgFile: 'Interface/Tooltips/UI-Tooltip-Background',
      edgeFile: 'Interface/Tooltips/UI-Tooltip-Border',
      edgeSize: 16,
      tile: true,
      tileSize: 16,
      insets: {
        left: 4,
        right: 4,
        top: 4,
        bottom: 4,
      },
      red: 0,
      blue: 0,
      green: 0,
      alpha: 1,
    },
    'border': {
      bgFile: 'Interface/Tooltips/UI-Tooltip-Background',
      edgeFile: 'Interface/Tooltips/UI-Tooltip-Border',
      edgeSize: 16,
      tile: true,
      tileSize: 16,
      insets: {
        left: 4,
        right: 4,
        top: 4,
        bottom: 4,
      },
      red: 0,
      blue: 0,
      green: 0,
      alpha: 0,
    },
    'background': {
      bgFile: 'Interface/Tooltips/UI-Tooltip-Background',
      edgeFile: 'Interface/Tooltips/UI-Tooltip-Border',
      edgeSize: 16,
      tile: true,
      tileSize: 16,
      insets: {
        left: 4,
        right: 4,
        top: 4,
        bottom: 4,
      },
      red: 0,
      blue: 0,
      green: 0,
      alpha: 1,
    }
  }
  public elements: Mapping<Element> = {
  }
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
    }
  }
}

