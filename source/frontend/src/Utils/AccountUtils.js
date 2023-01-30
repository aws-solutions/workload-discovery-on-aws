import {AWS_ORGANIZATIONS} from "../config/constants.js";

export const isUsingOrganizations = () => window.perspectiveMetadata.crossAccountDiscovery === AWS_ORGANIZATIONS;
