import styled from "styled-components";
import { IndexStyledProps } from "./models";
import { Color } from "../../colors";

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

export const DataTable = styled.div<IndexStyledProps>`
    margin: -5px 0 0 0;
    display: flex;
    justify-content: center;
    width: 100%;
    height: ${({ height }) => height}px;
    background-color: ${({ color }) => color};
    border-radius: 5px 5px 0 0;

    &:hover {
        border: 2px solid ${Color.whiteSecundary};
    }
`

export const LabelDataTable = styled.text<IndexStyledProps>`
    font-size: 15px;
    font-weight: 600;
    color: black;
`