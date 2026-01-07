import { Color } from "../../colors";

export default function iDeletePoints(selected: boolean) {
    return (
        <svg width="23" height="25" viewBox="0 0 23 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.26451 24.4605H16.7729C17.7363 24.4605 18.5463 23.7553 18.655 22.8219L20.6022 6.10022H1.43579L3.38302 22.8219C3.49166 23.7553 4.30176 24.4605 5.26506 24.4605H5.26451ZM18.2254 8.04415L16.7791 22.4862H5.25837L3.81202 8.04415H18.2254Z" fill={selected ? Color.greenTertiary : "white"}/>
            <path d="M14.7845 1.33216L13.5292 0.108643H8.5082L7.25294 1.33216H0L0.435122 3.78027H21.5911L22.0369 1.33216H14.7845Z" fill={selected ? Color.greenTertiary : "white"}/>
        </svg>
    )
}