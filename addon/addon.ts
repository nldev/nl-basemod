export const WARRIOR = 'WARRIOR'
export const ROGUE = 'ROGUE'
export const DRUID = 'DRUID'
export const MAGE = 'MAGE'
export const WARLOCK = 'WARLOCK'
export const SHAMAN = 'SHAMAN'
export const PRIEST = 'PRIEST'
export const PALADIN = 'PALADIN'
export const HUNTER = 'HUNTER'

export type CharacterClass =
  | typeof WARRIOR
  | typeof ROGUE
  | typeof DRUID
  | typeof MAGE
  | typeof WARLOCK
  | typeof SHAMAN
  | typeof PRIEST
  | typeof PALADIN
  | typeof HUNTER

export const HUMAN = 'HUMAN'
export const ORC = 'ORC'
export const DWARF = 'DWARF'
export const NIGHT_ELF = 'NIGHT_ELF'
export const UNDEAD = 'UNDEAD'
export const TAUREN = 'TAUREN'
export const GNOME = 'GNOME'
export const TROLL = 'TROLL'
export const BLOOD_ELF = 'BLOOD_ELF'
export const DRAENEI = 'DRAENEI'

export type CharacterRace =
  | typeof HUMAN
  | typeof ORC
  | typeof DWARF
  | typeof NIGHT_ELF
  | typeof UNDEAD
  | typeof TAUREN
  | typeof GNOME
  | typeof TROLL
  | typeof BLOOD_ELF
  | typeof DRAENEI

export interface PlayerInfo {
  name: string
  chrRace: CharacterRace
  chrClass: CharacterClass
  level: number
}

export interface Mapping<T> {
  [key: string]: T
}

export interface ComponentOptions {}

export type Component<
  O extends ComponentOptions = ComponentOptions,
  T extends WoWAPI.UIObject = WoWAPI.Frame,
> = (options: O) => T

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
    App()
  }
}

export const container = new Container()

export function App () {
  const $ = container
  const { name, level, chrRace, chrClass } = $.playerInfo

  console.log(`name: ${name}`)
  console.log(`level: ${level}`)
  console.log(`chrRace: ${chrRace}`)
  console.log(`chrClass: ${chrClass}`)
}

