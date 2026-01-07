import axios from 'axios';
import { NoContentResponseType, PageRequestType } from './types';

export default axios.create();

const parseParams = (params: any): string => {
  if (!params) return "";

  const uriParams = Object.entries(params)
  .filter(([_, value]) => !!value)
  .map(([key, value]) => `${key}=${value}`)
  .join("&")

  return uriParams
}

export const handleUri = (uri: string, filters?: object, page?: PageRequestType) => {

  const newUri = uri
    .split("/")
    .filter( u => u)
    .join("/")

  const queryParams = parseParams({...page, ...filters})

  return (page || filters)
    ? `${newUri}&${queryParams}`
    : newUri;
}

export const handleNoContentResponse = (response: NoContentResponseType) => {


  if (response.success) return;

  throw new Error(`${response.code} - ${response.message}`, {
    cause: response.error
  })
}