interface Props {
    id : string
    addClass ?: number
}


export default function IconGfontsBig({id, addClass} : Props){


    return (
        <>
            <span style={{fontSize : 60 }} className= {`material-icons`}  > {id} </span>
        </>
    )
}