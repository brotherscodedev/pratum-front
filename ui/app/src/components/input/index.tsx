import { on } from "stream"
import { Color } from "../../colors"
import { IndexProps } from "./models"
import { Main, Text } from "./styled"

const Input: React.FC<IndexProps> = ({
    typeInput,
    type,
    text,
    textColor,
    margin,
    onChange,
    value
}) => {
//TODO erro de compilação comentando
    return (
        <>
            {typeInput == 'default' && (
                <div>
                    {text && (
                        <Text color={textColor}>
                            {text}
                        </Text>
                    )}
                    {/* <Main value={value} color={Color.greenSecundary} type={type} margin={margin} onChange={onChange}/> */}
                </div>
            )}
        </>
    )
}

export default Input