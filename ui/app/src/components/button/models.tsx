import { TypeColor } from "../../colors"

export interface IndexProps {
    border: boolean
    typeBtn?: TypeButton
    text: string
    color: TypeColor
    margin?: string
    type?: 'submit' | 'reset' | 'button'
    disable?: boolean
    onClick: () => void
}

export type IndexStyledProps = {
    border: boolean
    size?: number
    colorHover?: string
    margin?: string
    color?: TypeColor
}

export type TypeButton = 'default'