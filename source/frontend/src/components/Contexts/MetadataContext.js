import React from 'react'

const MetadataContext = React.createContext({})

export const MetadataProvider = MetadataContext.Provider
export const MetadataConsumer = MetadataContext.Consumer
export default MetadataContext