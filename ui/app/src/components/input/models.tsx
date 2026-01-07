import { HTMLInputTypeAttribute } from "react"

export interface IndexProps {
    typeInput?: TypeButton
    type?: HTMLInputTypeAttribute
    text?: string
    textColor?: string
    margin?: string
    value?: string
    onChange?: (v: string) => void
}

export type IndexStyledProps = {
    size?: number
    color?: string
    margin?: string
}

export type TypeButton = 'default'