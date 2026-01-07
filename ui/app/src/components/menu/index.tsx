'use client'
import { IndexProps } from "./models"
import { Button, ItemMenu, Logo, Main } from "./styled"
import iLogo1 from "@/app/src/assets/icons/iLogo1";
import iDashboard from "@/app/src/assets/icons/iDashboard";
import iUpdatesAndProjects from "../../assets/icons/iUpdatesAndProjects";
import iNormsAndRelosutions from "../../assets/icons/iNormsAndRelosutions";
import iDeletePoints from "../../assets/icons/iDeletePoints";
import iBilling from "../../assets/icons/iBilling";
import iPenalty from "../../assets/icons/iPenalty";
import iNotifications from "../../assets/icons/iNotifications";
import iProjects from "../../assets/icons/iProjects";
import iReports from "../../assets/icons/iReports";
import iPoints from "../../assets/icons/iPoints";
import iIventory from "../../assets/icons/iIventory";
import { DefaultDiv, DefaultText } from "../../styled";
import iArrow from "../../assets/icons/iArrow";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Color } from "../../colors";

const Menu: React.FC<IndexProps> = ({
    selected
}) => {
    const router = useRouter();

    const [expand, setExpand] = useState('false')

    return (
        <Main expand={expand}>
            <DefaultDiv gap={5} justify="center" align="center" width="100%">
                <Logo>
                    {iLogo1()}
                </Logo>
                <ItemMenu expand={expand} selected={selected == '/painel' ? true : false} type="button" onClick={() => "/painel" != selected && router.push("/painel")}>
                    {iDashboard(selected == '/painel' ? true : false)}
                    {expand == 'true' && <DefaultText align='left' size={15} weight={500} color={selected == '/painel' ? Color.greenTertiary : '#FFF'}>Dashboard</DefaultText>}
                </ItemMenu>
                {/* <ItemMenu expand={expand} selected={selected == '/atualizacao-projetos' ? true : false} type="button" onClick={() => "/atualizacao-projetos" != selected && router.push("/atualizacao-projetos")}>
                    {iUpdatesAndProjects(selected == '/atualizacao-projetos' ? true : false)}
                    {expand == 'true' && <DefaultText align='left' size={15} weight={500} color={selected == '/atualizacao-projetos' ? Color.greenTertiary : '#FFF'}>Atualização de Projetos</DefaultText>}
                </ItemMenu> */}
                <ItemMenu expand={expand} selected={selected == '/normas' ? true : false} onClick={() => "/normas" != selected && router.push("/normas")}>
                    {iNormsAndRelosutions(selected == '/normas' ? true : false)}
                    {expand == 'true' && <DefaultText align='left' size={15} weight={500} color={selected == '/normas' ? Color.greenTertiary : '#FFF'}>Normas e Resoluções</DefaultText>}
                </ItemMenu>
                <ItemMenu expand={expand} selected={selected == '/ocupante/excluir-pontos' ? true : false} onClick={() => "/ocupante/excluir-pontos" != selected && router.push("/ocupante/excluir-pontos")}>
                    {iDeletePoints(selected == '/ocupante/excluir-pontos' ? true : false)}
                    {expand == 'true' && <DefaultText align='left' size={15} weight={500} color={selected == '/ocupante/excluir-pontos' ? Color.greenTertiary : '#FFF'}>Exclusão de Pontos</DefaultText>}
                </ItemMenu>
                {/* <ItemMenu expand={expand} selected={selected == '/faturamento' ? true : false} onClick={() => "/faturamento" != selected && router.push("/faturamento")}>
                    {iBilling(selected == '/faturamento' ? true : false)}
                    {expand == 'true' && <DefaultText align='left' size={15} weight={500} color={selected == '/faturamento' ? Color.greenTertiary : '#FFF'}>Faturamento</DefaultText>}
                </ItemMenu> */}
                <ItemMenu expand={expand} selected={selected == '/multas' ? true : false} onClick={() => "/multas" != selected && router.push("/multas")}>
                    {iPenalty(selected == '/multas' ? true : false)}
                    {expand == 'true' && <DefaultText align='left' size={15} weight={500} color={selected == '/multas' ? Color.greenTertiary : '#FFF'}>Multas</DefaultText>}
                </ItemMenu>
                <ItemMenu expand={expand} selected={selected == '/notificações' ? true : false} onClick={() => "/notificações" != selected && router.push("/notificações")}>
                    {iNotifications(selected == '/notificações' ? true : false)}
                    {expand == 'true' && <DefaultText align='left' size={15} weight={500} color={selected == '/notificações' ? Color.greenTertiary : '#FFF'}>Notificações</DefaultText>}
                </ItemMenu>
                <ItemMenu expand={expand} selected={selected == '/projetos' ? true : false} onClick={() => "/projetos" != selected && router.push("/projetos")}>
                    {iProjects(selected == '/projetos' ? true : false)}
                    {expand == 'true' && <DefaultText align='left' size={15} weight={500} color={selected == '/projetos' ? Color.greenTertiary : '#FFF'}>Projetos</DefaultText>}
                </ItemMenu>
                <ItemMenu expand={expand} selected={selected == '/relatorios' ? true : false} onClick={() => "/relatorios" != selected && router.push("/relatorios")}>
                    {iReports(selected == '/relatorios' ? true : false)}
                    {expand == 'true' && <DefaultText align='left' size={15} weight={500} color={selected == '/relatorios' ? Color.greenTertiary : '#FFF'}>Relatórios</DefaultText>}
                </ItemMenu>
                <ItemMenu expand={expand} selected={selected == '/trasferir-pontos' ? true : false} onClick={() => "/trasferir-pontos" != selected && router.push("/trasferir-pontos")}>
                    {iPoints(selected == '/trasferir-pontos' ? true : false)}
                    {expand == 'true' && <DefaultText align='left' size={15} weight={500} color={selected == '/trasferir-pontos' ? Color.greenTertiary : '#FFF'}>Transferência de Pontos</DefaultText>}
                </ItemMenu>
                <ItemMenu expand={expand} selected={selected == '/concessionaria/inventario' ? true : false} onClick={() => "/concessionaria/inventario" != selected && router.push("/concessionaria/inventario")}>
                    {iIventory(selected == '/concessionaria/inventario' ? true : false)}
                    {expand == 'true' && <DefaultText align='left' size={15} weight={500} color={selected == '/concessionaria/inventario' ? Color.greenTertiary : '#FFF'}>Inventário de Postes</DefaultText>}
                </ItemMenu>
            </DefaultDiv>
            <Button expand={expand} onClick={() => setExpand(expand == 'true' ? 'false' : 'true')}>
                {iArrow()}
            </Button>
        </Main>
    )
}

export default Menu