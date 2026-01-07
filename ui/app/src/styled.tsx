import styled from 'styled-components'
import { IndexStyledProps } from './models'
import { Color } from './colors'

export const LoginContainer = styled.div<IndexStyledProps>`
    padding: 0 55px;
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(0.30turn, #006B6B, #2E2E2E);
    background-image: url(${({ background }) => background});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
`

export const DefaultSection = styled.section<IndexStyledProps>`
    display: flex;
    flex-direction: column;
    width: fit-content;
    flex: 1;
    align-items: center;
    gap: 20px;
    padding: 40px 40px 20px 40px;
    height: 100vh;
    max-height: 100vh;
    background-color: ${({ theme }) => theme == 'dark' ? Color.greenTertiary : Color.whiteSecundary};
`

export const DefaultContainer = styled.section<IndexStyledProps>`
    display: flex;
    width: 100%;
    height: auto;
    background-color: ${Color.whiteSecundary};
`

export const DefaultDiv = styled.div<IndexStyledProps>`
    transition: 0.2s;
    display: flex;
    flex: ${({ flex }) => flex};
    width: ${({ width }) => width};
    max-width: ${({ maxWidth }) => maxWidth ?? 'auto'};
    min-width: ${({ minwidth }) => minwidth};
    max-height: ${({ maxheight }) => maxheight ?? 'auto'};
    height: ${({ height }) => height};
    margin: ${({ margin }) => margin};
    padding: ${({ padding }) => padding};
    gap: ${({ gap }) => gap ?? 0}px;
    justify-content: ${({ justify }) => justify};
    align-items: ${({ align }) => align};
    flex-direction: ${({ direction }) => direction ?? 'column'};
    border-radius: ${({ radius }) => radius}px;
    background-image: url(${({ background }) => background});
    background-color: ${({ color }) => color};
    &::-webkit-scrollbar {
        width: 10px;
        background-color: transparent;
    }
    &::-webkit-scrollbar-thumb {
        border-radius: 3px;
        background-color: ${Color.greenSecundary};
    }
    ${({ overflowscroll }) => overflowscroll == "true" && `overflow: auto`}
    ${({ overflowhidden }) => overflowhidden == "true" && `overflow: hidden`}
    ${({overflow, overflowY, overflowX}) => overflow == "true" &&
        `
            flex-wrap: wrap;
            overflow-wrap: anywhere;
            overflow-y: ${overflowY};
            overflow-x: ${overflowX};

            &::-webkit-scrollbar {
                display: none;
            }
        `
    }

`

export const DefaultButton = styled.button<IndexStyledProps>`
    display: flex;
    min-width: ${({ minwidth }) => minwidth};
    flex: ${({ flex }) => flex};
    width: ${({ width }) => width};
    height: ${({ height }) => height};
    margin: ${({ margin }) => margin};
    padding: ${({ padding }) => padding};
    gap: ${({ gap }) => gap ?? 0}px;
    justify-content: ${({ justify }) => justify};
    align-items: ${({ align }) => align};
    flex-direction: ${({ direction }) => direction ?? 'column'};
    border-radius: ${({ radius }) => radius}px;
    background-image: url(${({ background }) => background});
    background-color: ${({ color }) => color};

    &:hover {
        background-color: ${({ colorHover, color }) => colorHover ?? color};
    }
`

export const DefaultLink = styled.a<IndexStyledProps>`
    text-align: ${({ align }) => align};
    margin: ${({ margin }) => margin};
    padding: ${({ padding }) => padding};
    font-size: ${({ size }) => size ?? 16}px;
`

export const DefaultText = styled.text<IndexStyledProps>`
    transition: 0.2s;
    width: 100%;
    text-align: ${({ align }) => align};
    margin: ${({ margin }) => margin};
    padding: ${({ padding }) => padding};
    font-size: ${({ size }) => size ?? 16}px;
    font-weight: ${({ weight }) => weight ?? 400};
    color: ${({ color }) => color ?? 'white'};

    &:hover {
        color: ${({ colorHover, color }) => colorHover ?? color};
    }
`