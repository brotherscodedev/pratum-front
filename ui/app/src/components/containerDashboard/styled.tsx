import styled from "styled-components";
import { IndexStyledProps } from "./models";

export const Main = styled.div<IndexStyledProps>`
    display: flex;
    flex-direction: column;
    padding: 20px 20px;
    max-height: ${({ maxheight }) => maxheight};
    flex: ${({ flex }) => flex};
    gap: ${({ gap }) => gap || 0}px;
    border-radius: 8px;
    align-items: center;
    background-color: ${({ color }) => color ?? 'transparent'};
`

export const Tittle = styled.text<IndexStyledProps>`
    width: 100%;
    font-size: ${({ size }) => size ?? 16}px;
    font-weight: ${({ weight }) => weight ?? 400};
    color: ${({ color }) => color ?? 'white'};
    text-align: left;
`

export const SubTittle = styled.text<IndexStyledProps>`
    width: 100%;
    font-size: ${({ size }) => size ?? 48}px;
    font-weight: ${({ weight }) => weight ?? 400};
    color: ${({ color }) => color ?? 'white'};
    text-align: right;
`