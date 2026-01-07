interface Props {
    id : string
    addClass ?: number
}


export default function IconGfonts({id, addClass} : Props){


    return (
        <>
            <span style={{fontSize : 20 }} className= {`material-icons`}  > {id} </span>
        </>
    )
}