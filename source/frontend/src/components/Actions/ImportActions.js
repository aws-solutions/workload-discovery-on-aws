import { requestWrapper, sendGetRequest, sendPostRequest } from '../../API/APIHandler'
import { processMetadata, processImportConfiguration } from '../../API/APIProcessors';


export const fetchMetadata = async () => {
    let query = {
      command: `?command=getImportMetaData`,
      processor: processMetadata
    };
    return await requestWrapper(sendGetRequest, query);
  };
  
  export const fetchImportConfiguration = async () => {
    let query = {
      command: `?command=getDiscoveryConfig`,
      processor: processImportConfiguration
    };
    return await requestWrapper(sendGetRequest, query);
  };

export const updateConfiguration = async (updatedConfiguration) => {
    
    const zoomConfiguration = updatedConfiguration;
    const query = {
        body: {
            command: 'storeDiscoveryConfig',
            data: {
                zoomConfiguration
            }
        },
        processor: (data) => data
    }
    return await requestWrapper(sendPostRequest, query);    
}

export const deleteRegionOrAccount = async (updatedConfiguration) => {
    const zoomConfiguration = updatedConfiguration.currentConfiguration;
    const query = {
        body: {
            command: 'storeDiscoveryConfig',
            data: {
                zoomConfiguration
            }
        },
        processor: (data) => data
    }
    return await requestWrapper(sendPostRequest, query);    
    
}