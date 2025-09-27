"use server"
import queryString from "query-string";

export const sendRequest = async<T>(props: IRequest) => {
    let {
        url,
        method,
        body,
        queryParams = {},
        useCredentials = false,
        headers = {},
        nextOption = {}
    } = props
    const isFormData = body instanceof FormData;
    const options = {
        method: method,
        headers: isFormData ? new Headers(headers) :
            new Headers({
                ...headers,
                "Content-Type": "application/json"
            }),
        body: body ? (isFormData ? body : JSON.stringify(body)) : null,
        ...nextOption
    }
    if (useCredentials) options.credentials = "include";
    if (queryParams) {
        url = `${url}?${queryString.stringify(queryParams)}`;
    }
    return fetch(url, options).then(
        res => {
            if (res.ok) {
                return res.json() as T
            } else {
                return res.json().then(function (json) {
                    // to be able to access error status when you catch the error 
                    return {
                        statusCode: res.status,
                        message: json?.message ?? "",
                        error: json?.error ?? ""
                    } as T;

                });
            }
        }
    )
}