import { SetString, SetVoid } from "@/types"

export interface IndexProps {
    selected: string
}

export type ScreenType =  'dashboard' | 'updatesProjects' | 'normsResolutions' | 'deletePoints' | 'billing' | 'penalty' | 'notifications' | 'projects' | 'reports' | 'points' | 'inventory'

export type IndexStyledProps = {
    selected?: boolean
    expand?: string
    gap?: number
    size?: number
    weight?: number
    colorHover?: string
    color?: string
}