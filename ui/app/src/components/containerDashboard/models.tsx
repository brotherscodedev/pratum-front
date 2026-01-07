import { AvisoResponseType } from "@/services/usuario-service"

export interface IndexProps {
    tittle: string
    subtittle?: string
    type?: TypeContainerDashboard
    subtype ?: SubtypeContainerDashboard
    warns?: []
    listWarn?: (warn: AvisoResponseType) => void
}

export type IndexStyledProps = {
    type?: TypeContainerDashboard
    flex?: number
    gap?: number
    size?: number
    weight?: number
    maxheight?: string
    height?: string
    colorHover?: string
    color?: string
}

export type TypeContainerDashboard = 'default' | 'secundary' | 'table' | 'warn'
export type SubtypeContainerDashboard = 'money'