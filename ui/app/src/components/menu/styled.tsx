import styled from "styled-components";
import { IndexStyledProps } from "./models";
import { Color } from "../../colors";

export const Main = styled.div<IndexStyledProps>`
    transition: 0.2s;
    display: flex;
    flex-direction: column;
    padding: 50px 13px 20px 13px;
    width: ${({ expand }) => expand == "true" ? '301px' : '96px'};
    height: 100vh;
    align-items: ${({ expand }) => expand == "true" ? 'flex-start' : 'center'};
    justify-content: space-between;
    background-color: black;
`

export const Logo = styled.div<IndexStyledProps>`
    margin-bottom: 40px;
    width: auto;
    height: auto;
`

export const ItemMenu = styled.button<IndexStyledProps>`
    transition: 0.2s;
    display: flex;
    width: 100%;
    height: 43px;
    border-radius: 5px;
    gap: 10px;
    padding: ${({ expand }) => expand == "true" && '0px 10px'};
    justify-content: ${({ expand }) => expand == "true" ? "flex-start" : "center"};
    align-items: center;
    background-color: ${({ selected }) => selected == true ? 'white' : 'transparent'};

    &:hover {
        background-color: ${({ selected }) => selected == false && Color.greenTertiary};
    }
`

export const Button = styled.button<IndexStyledProps>`
    width: 100%;
    height: 40px;
    display: flex;
    padding: ${({ expand }) => expand == "true" && '0 0 0 10px'};
    justify-content: ${({ expand }) => expand == "true" ? 'flex-start' : "center"};
    align-items: center;
    transform: ${({ expand }) => expand == "true" ? 'rotate(180deg)' : 'none'};
`