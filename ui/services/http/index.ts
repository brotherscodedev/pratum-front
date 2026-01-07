import http, { handleUri, handleNoContentResponse } from "./http";
import { 
  BasicResponseType,
  NoContentResponseType,
  PageRequestType,
  PagedResponseType
} from "./types";

export default http;

export { handleUri, handleNoContentResponse }

export type {
  PageRequestType,
  PagedResponseType,
  BasicResponseType,
  NoContentResponseType
}