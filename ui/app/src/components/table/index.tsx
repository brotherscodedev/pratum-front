import { useEffect, useRef, useState } from "react"
import { Color } from "../../colors"
import { DefaultDiv, DefaultText } from "../../styled"
import { IndexProps } from "./models"
import { DataTable, LabelDataTable, SubTittle, Tittle } from "./styled"


type Item = {
    name: string
    value: number
}
const Table: React.FC<IndexProps> = ({
}) => {
    useEffect(() => {
        getMonth()
    },[])

    const tableSizeTemp = useRef(null)
    const [tableX, setTableX] = useState<Item[]>([])
    const [hover, setHover] = useState<any>()
    const [value, setValue] = useState<{}>({max: 0, min: 0})
    const [tableSize, setTableSize] = useState({width: 0, height: 0})

    const y = ['2.000 -', '1.500 -', '1.000 -', '500 -', '0 -']
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    const yearNow = new Date().getFullYear()
    const monthNow = new Date().getMonth()
    const maxValue = 2000

    const getMonth = () => {
        const monthsTemp = []
        let yearTemp: number | string = String(yearNow - 1).substring(2,4)
        let max = 0, min = 0

        for (let i = monthNow + 1; i <= 11; i++) {
            let objetcTemp = {
                name: `${monthNames[i]}/${yearTemp}`,
                value: (((i + 4) * 100) * 360) / maxValue,
            }
            monthsTemp.push(objetcTemp)
        }
        for (let i = 0; i <= monthNow; i++) {
            let objetcTemp = {
                name: monthNames[i],
                value: (((i + 4) * 100) * 360) / maxValue,
            }
            monthsTemp.push(objetcTemp)
        }
        setTableX(monthsTemp)
        // getTalbeSize()
    }

    // function getTalbeSize() {
    //     if (tableSizeTemp.current) {
    //         const {width, height} = tableSizeTemp.current.getBoundingClientRect()
    //         setTableSize({width: width, height: height})

    //         // 2000 = height
    //         // tableX = x
    //         // alert(tableX.length)
    //         for (let i = 0; i < tableX.length; i++) {
    //             tableX[i].value = (tableX[i].value * height) / maxValue
    //             alert((tableX[i].value * height) / maxValue)
    //         }
    //     }
    // }

    return (
        <DefaultDiv ref={tableSizeTemp} flex={1} gap={60} align="center" margin="50px 0 30px 0" width="100%">
            <DefaultDiv direction="row" gap={12} width="100%" >
                <DefaultDiv height="100%" gap={60} minwidth="max-content">
                    {y.map((item,index) => (
                        <DefaultText size={16} weight={500}> {item} </DefaultText>
                    ))}
                </DefaultDiv>
                <DefaultDiv width="100%" flex={1} gap={14} direction="row" align="flex-end" margin="0 0 -17px 0">
                    {tableX.map((item,index) => (
                        <DefaultDiv align="center" flex={1} width="100%">
                            {hover === index && (
                                <DefaultDiv padding="10px 0 10px 0" width="100%" color={Color.whiteSecundary} radius={'5px 5px 0 0'}>
                                    <LabelDataTable>{item.value}</LabelDataTable>
                                </DefaultDiv>
                            )}
                            <DataTable
                                onMouseEnter={() => setHover(index) }
                                onMouseLeave={() => setHover(null)}
                                height={item.value}
                                color={
                                    item.value >= 252
                                        ? Color.greenSecundary
                                        : item.value < 252 && item.value > 170
                                            ? Color.lightBlue
                                            : item.value < 170 && item.value > 80
                                                ? Color.lightYellow
                                                : Color.lightRed
                                }
                                // radius={'5px 5px 0 0'}
                                //TODO  erro aqui
                            />
                            <DefaultText size={16} weight={500}> {item?.name} </DefaultText>
                        </DefaultDiv>
                    ))}
                </DefaultDiv>
            </DefaultDiv>

            <DefaultDiv direction="row" width="100%" justify="space-between" >
                <DefaultDiv direction="row"flex={0.5}>
                    <DefaultText>Maior: Dezembro/2023</DefaultText>
                    <DefaultText>Menor: Janeiro</DefaultText>
                </DefaultDiv>
                <DefaultDiv direction="row" gap={30} flex={0.5} justify="center" >
                    <DefaultDiv direction="row" gap={2} align="center">
                        <DefaultDiv color={Color.lightRed} width="15px" height="15px" radius={3} />
                        <DefaultText>{'<='} 500</DefaultText>
                    </DefaultDiv>
                    <DefaultDiv direction="row" gap={2} align="center">
                        <DefaultDiv color={Color.lightYellow} width="15px" height="15px" radius={3} />
                        <DefaultText>{'<='} 1.000</DefaultText>
                    </DefaultDiv>
                    <DefaultDiv direction="row" gap={2} align="center">
                        <DefaultDiv color={Color.lightBlue} width="15px" height="15px" radius={3} />
                        <DefaultText>{'<='} 1.500</DefaultText>
                    </DefaultDiv>
                    <DefaultDiv direction="row" gap={2} align="center">
                        <DefaultDiv color={Color.greenSecundary} width="15px" height="15px" radius={3} />
                        <DefaultText>{'>'} 1.500</DefaultText>
                    </DefaultDiv>
                </DefaultDiv>
            </DefaultDiv>
        </DefaultDiv>
    )
}

export default Table