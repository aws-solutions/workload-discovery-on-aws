import { requestWrapper, sendPostRequest } from '../../API/APIHandler';

export const filterOnAccountAndRegion = async (filters) => {
    const filtersToApply = Array.from(filters.values()).reduce((h, obj) =>
        Object.assign(h, { [obj.accountId]: obj.region ? (h[obj.accountId] || []).concat(obj.region) : [] }), {}
    )
    const query = {
        body: {
            command: 'getAllResources',
            data: {
                accountFilter:
                    filtersToApply ? filtersToApply : undefined
            }
        },
        processor: (data) => data.results
    }
    return await requestWrapper(sendPostRequest, query);    
}

export const getAllResources = async () => {

    const query = {
        body: {
            command: 'getAllResources',
            data: {}
        },
        processor: (data) => data.results
    }

    return await requestWrapper(sendPostRequest, query);    

}

