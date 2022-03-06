export const ROOT = 'ROOT'

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

export const WARRIOR = 'WARRIOR'
export const ROGUE = 'ROGUE'
export const DRUID = 'DRUID'
export const MAGE = 'MAGE'
export const WARLOCK = 'WARLOCK'
export const SHAMAN = 'SHAMAN'
export const PRIEST = 'PRIEST'
export const PALADIN = 'PALADIN'
export const HUNTER = 'HUNTER'

export const BASE_BACKDROP = {
  // bgFile: 'Interface/Tooltips/UI-Tooltip-Background',
  // edgeFile: "Interface/DialogFrame/UI-DialogBox-Border",
  edgeFile: 'Interface/Tooltips/UI-Tooltip-Border',
  bgFile: 'Interface/TutorialFrame/TutorialFrameBackground',
  tile: true,
  tileSize: 16,
  edgeSize: 16,
  insets: {
    left: 4,
    right: 4,
    top: 4,
    bottom: 4,
  },
}

export const BASE_COLORS = [0, 0, 0, 1]

export const REQUESTS = {
  GM: {
    SET_TALENT_POINTS: 'set-talent-points',
  },
  GET_TALENT_INFO: 'get-talent-info',
  LEARN_TALENT: 'learn-talent',
  UNLEARN_TALENT: 'unlearn-talent',
}

export const RESPONSES = {
  GM: {
    SET_TALENT_POINTS_SUCCESS: 'set-talent-points-success',
  },
  GET_TALENT_INFO_SUCCESS: 'get-talent-info-success',
  LEARN_TALENT_SUCCESS: 'learn-talent-success',
  LEARN_TALENT_FAIL: 'learn-talent-fail',
  UNLEARN_TALENT_SUCCESS: 'unlearn-talent-success',
}

