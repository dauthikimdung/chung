import { server } from './configs';

import axios from 'axios';

const _makeRequest = instanceAxios => async args => {
    const _headers = args.headers ? args.headers : {};
    const body = args.body ? args.body : {};
    const defaultHeader = {};

    args = {
        ...args,
        headers: {
            ...defaultHeader,
            ..._headers,
        },
        body
    }

    console.log('args: ', args);
    const request = instanceAxios(args);
    console.log('request: ', request);
    return request
        .then(res => res.data)
        .catch(err => console.log(err))
}

const API = (options = {}) => {
    let BaseURL = server

    if (options.BaseURL)
        BaseURL = options.BaseURL

    const instance = axios.create({
        baseURL: BaseURL,
        //timeout: 30000
    })

    return {
        makeRequest: _makeRequest(instance)
    }
}

export default API;