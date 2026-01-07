import { Color } from "../../colors"
import { IndexProps } from "./models"
import { Main, Text } from "./styled"
import iEnter from "@/app/src/assets/icons/iEnter";

const Button: React.FC<IndexProps> = ({
    typeBtn,
    type,
    text,
    disable,
    color,
    border = false,
    margin,
    onClick
}) => {

    return (
        <>
            {typeBtn == 'default' && (
                <Main color={color} type={type} disabled={disable} onClick={onClick} margin={margin} border={border}>
                    <Text border={border} color={color}>
                        {text}
                    </Text>
                    {text == 'Entrar' && (
                        iEnter()
                    )}
                </Main>
            )}
        </>
    )
}

export default Button