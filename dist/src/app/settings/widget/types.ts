export type WidgetTheme = 
  | 'black'
  | 'purple'
  | 'blue'
  | 'green'
  | 'teal'
  | 'yellow'
  | 'orange'
  | 'red'
  | 'pink'
  | 'indigo'
  | 'custom'

export type WidgetPosition = 'right' | 'left'

export type WidgetTextColor = 'light' | 'dark'

export interface WidgetSettings {
  theme: WidgetTheme
  textColor: WidgetTextColor
  position: WidgetPosition
  lateralSpacing: number
  bottomSpacing: number
  displayName: string
  offHoursMessage: string
  teamDescription: string
  initialMessage: string
  showAgentAvatars?: boolean
  useCustomImage?: boolean
  customImageUrl?: string | null
  callToAction?: boolean
  showWidgetOnMobile?: boolean
  hideWidgetButton?: boolean
  enableSounds?: boolean
  restrictDomain?: boolean
  allowedDomains?: string[]
  enableWhatsAppBalloon?: boolean
  whatsAppNumber?: string | null
  whatsAppText?: string | null
  useOnlyWhatsApp?: boolean
  captureFormInfo?: boolean
  enableBusinessHours?: boolean
} 