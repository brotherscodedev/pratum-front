import { Color } from "../../colors";

export default function iProjects(selected: boolean) {
    return (
        <svg width="30" height="25" viewBox="0 0 30 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.7286 0.0282722V0.0239258H1.36875C0.753097 0.0239258 0.253906 0.510724 0.253906 1.11107V22.9382C0.253906 23.5385 0.753097 24.0253 1.36875 24.0253H19.7312V4.89245L14.7286 0.0282722ZM13.8605 1.93472L17.7717 5.55147H13.8605V1.93472ZM2.21339 22.1145V1.93472H11.9005V7.46226H17.7717V22.1145H2.21339Z"fill={selected ? Color.greenTertiary : "white"}/>
            <path fillRule="evenodd" clipRule="evenodd" d="M27.6399 12.5232V11.5675H23.1956V3.12461H27.1496V2.16895H23.1956H22.2161V3.12461V11.5675H17.7717V12.5232H22.2161V21.1796V22.1195V22.1353H27.1496V21.1796H23.1956V12.5232H27.6399Z"fill={selected ? Color.greenTertiary : "white"}/>
            <path d="M29.9999 0.481445H25.2798V5.08429H29.9999V0.481445Z"fill={selected ? Color.greenTertiary : "white"}/>
            <path d="M29.9999 9.85071H25.2798V14.4536H29.9999V9.85071Z"fill={selected ? Color.greenTertiary : "white"}/>
            <path d="M29.9999 19.3557H25.2798V23.9586H29.9999V19.3557Z"fill={selected ? Color.greenTertiary : "white"}/>
            <path d="M14.9219 10.3912H5.06372V11.3469H14.9219V10.3912Z"fill={selected ? Color.greenTertiary : "white"}/>
            <path d="M14.9219 13.8042H5.06372V14.7599H14.9219V13.8042Z"fill={selected ? Color.greenTertiary : "white"}/>
            <path d="M14.9219 17.2178H5.06372V18.1734H14.9219V17.2178Z"fill={selected ? Color.greenTertiary : "white"}/>
        </svg>
    )
}