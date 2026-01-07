import styled from "styled-components";
import { IndexStyledProps } from "./models";
import { Color } from "../../colors";

export const Main = styled.input<IndexStyledProps>`
    margin: ${({ margin }) => margin};
    transition: 0.3s;
    padding: 12px 9px;
    width: 100%;
    border-radius: 4px;
    border: 1px solid ${Color.whiteSecundary};
    background-color: transparent;

    &:focus {
        border: 1px solid ${Color.greenSecundary};
        background-color: white;
        color: black
    }
`

export const Text = styled.label<IndexStyledProps>`
    padding: 0 0 7px 9px;
    font-size: ${({ size }) => size ?? 16}px;
    color: ${({ color }) => color ?? 'black'};
`