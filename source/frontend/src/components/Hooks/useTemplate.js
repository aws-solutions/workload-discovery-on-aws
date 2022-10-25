import {useQuery} from 'react-query'
import useQueryErrorHandler from "./useQueryErrorHandler"
import {
  handleResponse,
} from '../../API/Handlers/ResourceGraphQLHandler';
import * as R from "ramda";
import {
  getGlobalTemplate,
  getRegionalTemplate,
  wrapRequest
} from "../../API/Handlers/SettingsGraphQLHandler";
import {getStatus} from "../../Utils/StatusUtils";

export const GLOBAL_TEMPLATE = "getGlobalTemplate";
export const REGIONAL_TEMPLATE = "getRegionalTemplate";

export const queryKey = "template"
export const useTemplate = (templateName, config={}) => {
  if (![GLOBAL_TEMPLATE, REGIONAL_TEMPLATE].includes(templateName)) throw new Error(`Invalid template name '${templateName}'`)
  const { handleError } = useQueryErrorHandler()
  const { isLoading, isError, data, refetch, isFetching } = useQuery(
    [queryKey, templateName],
    () =>  wrapRequest(templateName === GLOBAL_TEMPLATE ? getGlobalTemplate : getRegionalTemplate)
        .then(handleResponse)
        .then(R.pathOr([], ['body', 'data', templateName])),
    {
      onError: handleError,
      refetchInterval: false,
      ...config,
    }
  )

  return {
    data,
    isLoading,
    isError,
    refetch,
    status: getStatus(isFetching, isError)
  }
}

export default {
  useTemplate,
}
