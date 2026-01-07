import styled from "styled-components";
import { IndexStyledProps } from "./models";
import { Color } from "../../colors";

export const Main = styled.div<IndexStyledProps>`
    z-index: 999;
    margin-bottom: 30px;
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 40px;
    justify-content: space-between;
    align-items: center;
`

export const Tittle = styled.text<IndexStyledProps>`
    font-size: 50px;
    font-weight: 600;
    color: black;
`

export const UserHeader = styled.div<IndexStyledProps>`
    display: flex;
    flex-direction: row;
    gap: 10px;
`

export const ButtonHeader = styled.button<IndexStyledProps>`
    display: flex;
    border-radius: 8px;
    height: ${({ size }) => size};
    width: ${({ size }) => size};
    justify-content: center;
    align-items: center;
    background-color: ${Color.greenTertiary};
`

export const LetterUser = styled.text`
    font-size: 30px;
    color: white;
`

export const BackgroundExpandUser = styled.div<IndexStyledProps>`
    z-index: 998;
    position: absolute;
    display: flex;
    top: 60px;
    right: 5px;
    padding: 35px;
    justify-content: center;
    align-items: center;
`

export const ExpandUser = styled.div<IndexStyledProps>`
    display: flex;
    flex-direction: column;
    top: 99px;
    right: 40px;
    border-radius: 6px;
    height: 170px;
    width: 200px;
    justify-content: space-between;
    padding: ${({ padding }) => padding};
    margin: ${({ margin }) => margin};
    background-color: ${({ color }) => color};
`