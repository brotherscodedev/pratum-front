import { Color } from "../../colors";

export default function iIventory(selected: boolean) {
    return (
        <svg width="26" height="14" viewBox="0 0 26 14" fill="none">
            <path d="M25.3019 11.136H5.48364V13.0805H25.3019V11.136Z" fill={selected ? Color.greenTertiary : "white"}/>
            <path d="M25.3019 0H5.48364V1.94447H25.3019V0Z" fill={selected ? Color.greenTertiary : "white"}/>
            <path d="M1.266 0H3.71077V1.94447H1.266C0.743394 1.94447 0.318848 1.53047 0.318848 1.02086V0.923612C0.318848 0.413995 0.743394 0 1.266 0Z" fill={selected ? Color.greenTertiary : "white"}/>
            <path d="M1.266 5.56824H3.71077V7.51271H1.266C0.743394 7.51271 0.318848 7.09871 0.318848 6.5891V6.49185C0.318848 5.98223 0.743394 5.56824 1.266 5.56824Z" fill={selected ? Color.greenTertiary : "white"}/>
            <path d="M1.266 11.136H3.71077V13.0805H1.266C0.743394 13.0805 0.318848 12.6665 0.318848 12.1569V12.0596C0.318848 11.55 0.743394 11.136 1.266 11.136Z" fill={selected ? Color.greenTertiary : "white"}/>
            <path d="M25.3019 5.56824H5.48364V7.51271H25.3019V5.56824Z" fill={selected ? Color.greenTertiary : "white"}/>
        </svg>
    )
}