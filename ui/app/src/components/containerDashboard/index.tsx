"use client";

import { useCallback, useEffect } from "react"
import iEye from "../../assets/icons/iEye"
import { Color } from "../../colors"
import { DefaultButton, DefaultDiv, DefaultText } from "../../styled"
import Table from "../table"
import { IndexProps } from "./models"
import { Main, SubTittle, Tittle } from "./styled"
import Moment from 'react-moment';
import usuarioService, { AvisoResponseType } from "@/services/usuario-service"

const ContainerDashboard: React.FC<IndexProps> = ({
    tittle,
    type,
    subtype,
    subtittle,
    warns,
    listWarn
}) => {

    const txt = [
        {msg: 'adassapofjshdopifjsdaofijsdafasfsaadassapofjshdopifjsdaofijsdafasdasdasfsaadassapofjshdopifjsdaofijsdafasfsaadassapofjshdopifjsdaofijsdafasfsa', date: String(new Date())},
        {msg: 'adassapofjshdopifjsdaofiasdasfsaadassapofjshdopifjsdaofijsdafasfsaadassapofjshdopifjsdaofijsdafasfsa', date: String(new Date())},
        {msg: 'adassapofjshdopifjsdaofiasdasfsaadassapofjshdopifjsdaofijsdafasfsaadassapofjshdopifjsdaofijsdafasfsa', date: String(new Date())},
        {msg: 'adassapofjshdopifjsdaofiasdasfsaadassapofjshdopifjsdaofijsdafasfsaadassapofjshdopifjsdaofijsdafasfsa', date: String(new Date())},
        {msg: 'adassapofjshdopifjsdaofiasdasfsaadassapofjshdopifjsdaofijsdafasfsaadassapofjshdopifjsdaofijsdafasfsa', date: String(new Date())},
        {msg: 'adassapofjshdopifjsdaofiasdasfsaadassapofjshdopifjsdaofijsdafasfsaadassapofjshdopifjsdaofijsdafasfsa', date: String(new Date())},
        {msg: 'adassapofjshdopifjsdaofiasdasfsaadassapofjshdopifjsdaofijsdafasfsaadassapofjshdopifjsdaofijsdafasfsa', date: String(new Date())},
        {msg: 'adassapofjshdopifjsdaofiasdasfsaadassapofjshdopifjsdaofijsdafasfsaadassapofjshdopifjsdaofijsdafasfsa', date: String(new Date())},
        {msg: 'adassapofjshdopifjsdaofiasdasfsaadassapofjshdopifjsdaofijsdafasfsaadassapofjshdopifjsdaofijsdafasfsa', date: String(new Date())},
        {msg: 'adassapofjshdopifjsdaofiasdasfsaadassapofjshdopifjsdaofijsdafasfsaadassapofjshdopifjsdaofijsdafasfsa', date: String(new Date())},
        {msg: 'adassapofjshdopifjsdaofijsdafasfsa', date: String(new Date())}
    ]
    
    return (
        <>
            {type == 'secundary' && (
                <Main flex={0.15} color={Color.greenTertiary}>
                    <Tittle>{tittle}</Tittle>
                    <DefaultDiv width="100%" direction="row" align="center">
                        {subtype == 'money' && (<SubTittle size={30}>R$</SubTittle>)}
                        <SubTittle>{subtittle}</SubTittle>
                    </DefaultDiv>
                </Main>
            )}
            {type == 'table' && (
                <Main color={Color.greenTertiary} flex={1}>
                    <Tittle weight={500}>{tittle}</Tittle>
                    <Table/>
                </Main>
            )}
            {type == 'warn' && (
                <Main color={Color.greenTertiary} maxheight='100%'>
                    <DefaultDiv direction="row" justify="space-between" align="center" width="100%">
                        <Tittle weight={500}>{tittle}</Tittle>
                        <DefaultDiv gap={13} direction="row" flex={1}>
                            <Tittle size={32} weight={600}>{txt.length}</Tittle>
                        </DefaultDiv>
                    </DefaultDiv>
                    <DefaultDiv maxheight="100%" overflowscroll="true">
                        {txt.map((item, index) => (
                            <DefaultDiv width="100%" padding="0 10px 0 0">
                                <DefaultDiv flex={1} overflow="true" color={Color.whiteSecundary} radius={8} direction="row" padding="12px 11px" gap={10} margin="0 0 8px 0">
                                    <DefaultDiv gap={4} flex={1} overflow="true" width="100%"> 
                                        <DefaultText size={12} color="black" weight={500}>{item.msg}</DefaultText>
                                        <Moment format="DD/MM/YYYY HH:mm:ss" style={{fontSize:12, fontWeight:500, color:'black', textAlign: 'right'}}>{item.date}</Moment>
                                    </DefaultDiv>
                                    <DefaultButton justify="center" align="center">
                                        {iEye()}
                                    </DefaultButton>
                                </DefaultDiv>
                            </DefaultDiv>
                        ))}
                    </DefaultDiv>
                </Main>
            )}
        </>
    )
}

export default ContainerDashboard