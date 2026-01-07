import styled from "styled-components";
import { IndexStyledProps } from "./models";

export const Main = styled.button<IndexStyledProps>`
    margin: ${({ margin }) => margin};
    display: flex;
    transition: 0.2s;
    padding: 12px 0;
    width: 100%;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    gap: 5px;
    border-radius: 4px;
    
    ${({ border, color }) => border
        ? `border: 1px solid ${color};`
        
        : `background-color: ${color};`
    }

    &:hover {
        box-shadow: 0px 4px 10px ${({ color }) => `${color}50` ?? 'none'};
    }
`

export const Text = styled.text<IndexStyledProps>`
    font-size: ${({ size }) => size ?? 16}px;

    ${({ border, color }) => border
        ? `color: ${color}`
        : `color: black`
    }
`