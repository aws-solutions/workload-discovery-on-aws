// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import { BreadcrumbGroup } from "@awsui/components-react";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { HOMEPAGE_PATH } from "../routes";

const Breadcrumbs = ({ items = [] }) => {
  const history = useHistory();

  return (
    <BreadcrumbGroup
      onFollow={(e) => {
        e.preventDefault();
        history.push(e.detail.href);
      }}
      ariaLabel="Breadcrumbs"
      items={[{ text: "Workload Discovery on AWS", href: HOMEPAGE_PATH }].concat(items)}
    />
  );
};

Breadcrumbs.propTypes = {
  items: PropTypes.array,
};

export default Breadcrumbs;