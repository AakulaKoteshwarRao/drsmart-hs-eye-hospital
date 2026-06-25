'use client'
import {
  MapPin, Clock, Phone, GraduationCap, Trophy, ShieldCheck,
  CurrencyDollar, CreditCard, Info, Translate, Hospital,
  Heartbeat, Warning, ArrowLeft, ArrowRight, ArrowUpRight,
  CaretDown, CaretUp, CaretRight, X, List, Play,
  WhatsappLogo, CalendarBlank, GoogleLogo, FacebookLogo,
  InstagramLogo, YoutubeLogo, Star, Check, CheckCircle,
  File, MagnifyingGlass, Briefcase, Lightning, Drop,
  User, ChatCircle, House, ArrowSquareOut, Certificate,
  Medal, Stethoscope, FirstAid, Siren, Eye, Brain,
  Bandaids, Pill, Leaf, Scales, Buildings,
  Clock as ClockIcon, Envelope, Globe, MapTrifold,
} from '@phosphor-icons/react'
import type { Icon as PhosphorIcon } from '@phosphor-icons/react'

export type IconName =
  | 'location' | 'clock' | 'phone' | 'education' | 'award'
  | 'shield' | 'dollar' | 'credit-card' | 'info' | 'language'
  | 'hospital' | 'pulse' | 'alert' | 'NMC' | 'star'
  | 'arrow-left' | 'arrow-right' | 'arrow-up-right'
  | 'chevron-down' | 'chevron-up' | 'chevron-right'
  | 'close' | 'menu' | 'play' | 'map-pin'
  | 'whatsapp' | 'calendar' | 'google' | 'facebook'
  | 'instagram' | 'youtube' | 'check' | 'check-circle'
  | 'file' | 'search' | 'briefcase' | 'zap' | 'droplet'
  | 'user' | 'message' | 'home' | 'external-link'
  | 'certificate' | 'stethoscope' | 'first-aid' | 'eye'
  | 'brain' | 'pill' | 'leaf' | 'buildings' | 'envelope'
  | 'globe' | 'map'

export const ICON_MAP: Record<string, any> = {
  // Config-driven semantic icons
  'location':     MapPin,
  'clock':        Clock,
  'phone':        Phone,
  'education':    GraduationCap,
  'award':        Trophy,
  'shield':       ShieldCheck,
  'dollar':       CurrencyDollar,
  'credit-card':  CreditCard,
  'info':         Info,
  'language':     Translate,
  'hospital':     Hospital,
  'pulse':        Heartbeat,
  'alert':        Warning,
  'NMC':          Certificate,
  '*****':        Star,

  // UI icons
  'arrow-left':     ArrowLeft,
  'arrow-right':    ArrowRight,
  'arrow-up-right': ArrowUpRight,
  'chevron-down':   CaretDown,
  'chevron-up':     CaretUp,
  'chevron-right':  CaretRight,
  'close':          X,
  'menu':           List,
  'play':           Play,
  'map-pin':        MapPin,
  'whatsapp':       WhatsappLogo,
  'calendar':       CalendarBlank,
  'google':         GoogleLogo,
  'facebook':       FacebookLogo,
  'instagram':      InstagramLogo,
  'youtube':        YoutubeLogo,
  'star':           Star,
  'check':          Check,
  'check-circle':   CheckCircle,
  'file':           File,
  'search':         MagnifyingGlass,
  'briefcase':      Briefcase,
  'zap':            Lightning,
  'droplet':        Drop,
  'user':           User,
  'message':        ChatCircle,
  'home':           House,
  'external-link':  ArrowSquareOut,

  // Medical semantic icons
  'certificate':  Certificate,
  'stethoscope':  Stethoscope,
  'first-aid':    FirstAid,
  'eye':          Eye,
  'brain':        Brain,
  'pill':         Pill,
  'leaf':         Leaf,
  'buildings':    Buildings,
  'envelope':     Envelope,
  'globe':        Globe,
  'map':          MapTrifold,
  'activity':     Heartbeat,
  'box':          Briefcase,
  'tool':         Stethoscope,
}

export type IconWeight = 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone'

interface IconProps {
  name: string
  size?: number
  weight?: IconWeight
  color?: string
  className?: string
  style?: React.CSSProperties
}

export function Icon({
  name,
  size = 20,
  weight = 'regular',
  color,
  className,
  style,
}: IconProps) {
  const PhIcon = ICON_MAP[name]
  if (!PhIcon) {
    console.warn(`Icon not found: ${name}`)
    return null
  }
  return (
    <PhIcon
      size={size}
      weight={weight}
      color={color}
      className={className}
      style={style}
    />
  )
}

export default Icon
