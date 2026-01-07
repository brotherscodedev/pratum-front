'use client'
import { useState } from "react";
import iTheme from "../../assets/icons/iTheme";
import { Color } from "../../colors"
import { DefaultButton, DefaultDiv, DefaultText } from "../../styled";
import { IndexProps } from "./models"
import { BackgroundExpandUser, ButtonHeader, ExpandUser, LetterUser, Main, Tittle, UserHeader } from "./styled"
import { useRouter } from "next/navigation";

const Header: React.FC<IndexProps> = ({
    type,
    expand
}) => {
    const router = useRouter();

    const [expandUser, setExpandUser] = useState(false)

    const handleUser = () => {
        return (
            <BackgroundExpandUser
                onMouseLeave={() => setExpandUser(false)}
            >
                <ExpandUser color={Color.greenTertiary} padding="6px">
                    <DefaultDiv direction="column" margin="0 0 10px 3px">
                        <DefaultText size={15} color={Color.whiteSecundary} weight={500}>Tester</DefaultText>
                        <DefaultText size={13} color={Color.whiteSecundary} weight={300}>email@teste.com</DefaultText>
                    </DefaultDiv>

                    <DefaultDiv margin="-15px 0 0 0">
                        <DefaultButton colorHover={Color.whiteSecundary} radius={5} width="100%" padding="3px">
                            <DefaultText align="left" size={13} color={Color.whiteSecundary} colorHover={Color.greenTertiary}>Meu perfil</DefaultText>
                        </DefaultButton>
                        <DefaultButton colorHover={Color.whiteSecundary} radius={5} width="100%" padding="3px">
                            <DefaultText align="left" size={13} color={Color.whiteSecundary} colorHover={Color.greenTertiary}>Configurações</DefaultText>
                        </DefaultButton>
                    </DefaultDiv>

                    <DefaultDiv>
                        <DefaultButton colorHover={Color.lightRed} radius={5} width="100%" padding="3px" onClick={() => router.replace('/')}>
                            <DefaultText align="left" size={13} color={Color.whiteSecundary} colorHover={Color.greenTertiary}>Sair</DefaultText>
                        </DefaultButton>
                    </DefaultDiv>
                </ExpandUser>
            </BackgroundExpandUser>
        )
    }

    return (
        <>
        { expandUser && handleUser()}
        <Main >
            <Tittle>Início</Tittle>
            <UserHeader>
                <ButtonHeader size="36px">
                    {iTheme("light")}
                </ButtonHeader>
                <ButtonHeader size="54px" onClick={() => setExpandUser(true)}>
                    <LetterUser>T</LetterUser>
                </ButtonHeader>
            </UserHeader>
        </Main>
        </>
    )
}

export default Header