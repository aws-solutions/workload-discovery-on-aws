/** @jsxImportSource @emotion/react */
import React from 'react';
import {
  Box,
  Button,
  ColumnLayout,
  Container,
  Grid,
  Header,
  Icon,
  SpaceBetween,
  Link,
} from '@awsui/components-react';
import {ACCOUNTS, DIAGRAM_MANAGEMENT, IMPORT, RESOURCES} from "../../routes";
import useLink from "../Hooks/useLink";
import { css } from '@emotion/react'
import {
  colorBackgroundHomeHeader, colorBorderDividerDefault,
  colorTextHomeHeaderDefault,
  colorTextHomeHeaderSecondary
} from "@awsui/design-tokens";

const headerStyle = css`
  background: ${colorBackgroundHomeHeader};
  
  div.header-title {
    color: ${colorTextHomeHeaderDefault}
  }
  
  .header-sub-title,
  .category {
    color: ${colorTextHomeHeaderSecondary}
  }
  
  div.header-cta {
    margin-bottom: 38px;
  }
  
  .header-title > * {
    max-width: 700px;
  }
`

const sidebarStyle = css`
  @media (min-width: 957px) {
    margin-top: -86px;
  }
`

const listStyle = css`
  list-style-type: none;
  margin: 0;
  padding: 0;

  li {
    border-top: 1px solid ${colorBorderDividerDefault};
    padding: 0.8rem 0;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    &:first-of-type {
      padding-top: 0;
      border-top: none;
    }

    &:last-of-type{
      padding-bottom: 0;
    }
  }
`

const Homepage = () => {
  const { handleFollow } = useLink();

  return (
    <Box margin={{ bottom: 'l' }}>
      <div css={headerStyle}>
        <Box padding={{ vertical: 'xxxl', horizontal: 's' }}>
          <Grid
            gridDefinition={[
              { offset: { l: '2', xxs: '1' }, colspan: { l: '8', xxs: '10' } },
              {
                colspan: { xl: '6', l: '5', s: '6', xxs: '10' },
                offset: { l: '2', xxs: '1' },
              },
              {
                colspan: { xl: '2', l: '3', s: '4', xxs: '10' },
                offset: { s: '0', xxs: '1' },
              },
            ]}>
            <Box fontWeight='light' padding={{ top: 'xs' }}>
              <span className='category'>
                Management &amp; Governance
              </span>
            </Box>
            <div className='header-title'>
              <Box
                variant='h1'
                fontWeight='heavy'
                padding='n'
                fontSize='display-l'
                color='inherit'>
                Workload Discovery on AWS
              </Box>
              <Box
                fontWeight='light'
                padding={{ bottom: 's' }}
                fontSize='display-l'
                color='inherit'>
                Explore your AWS Workloads
              </Box>
              <Box variant='p' fontWeight='light'>
                <span className='header-sub-title'>
                  Workload Discovery on AWS is a tool to visualize AWS Cloud workloads.
                  Use Workload Discovery on AWS to build, customize, and share detailed
                  architecture diagrams of your workloads based on live data
                  from AWS.
                </span>
              </Box>
            </div>
            <div className="header-cta">
              <Container>
                <SpaceBetween size='xl'>
                  <Box variant='h2' padding='n'>
                    Discover Resources
                  </Box>
                  <Box variant='p' padding='n'>
                    Get started by importing regions from one or more of your
                    accounts.
                  </Box>
                  <Button onClick={() => handleFollow({
                    detail: {href: IMPORT, external: false}
                  })} variant='primary'>
                    Import
                  </Button>
                </SpaceBetween>
              </Container>
            </div>
          </Grid>
        </Box>
      </div>

      <Box padding={{ top: 'xxxl', horizontal: 's' }}>
        <Grid
          gridDefinition={[
            {
              colspan: { xl: '6', l: '5', s: '6', xxs: '10' },
              offset: { l: '2', xxs: '1' },
            },
            {
              colspan: { xl: '2', l: '3', s: '4', xxs: '10' },
              offset: { s: '0', xxs: '1' },
            },
          ]}>
          <SpaceBetween size='xxl'>
            <div>
              <Box variant="h1" tagOverride="h2" padding={{ bottom: 's', top: 'n' }}>
                How it works
              </Box>
              <Container>
                <img
                  style={{ width: '100%', height: '100%' }}
                  src={`${process.env.PUBLIC_URL}/icons/architecture-diagram.png`}
                />
              </Container>
            </div>

            <div>
              <Box variant="h1" tagOverride="h2" padding={{ bottom: 's', top: 'n' }}>
                Benefits and features
              </Box>
              <Container>
                <ColumnLayout columns={2} variant='text-grid'>
                  <div>
                    <Box variant='h3' padding={{ top: 'n' }}>
                      Build architecture diagrams
                    </Box>
                    <Box variant='p'>
                      Workload Discovery on AWS lets you build, customize, and share
                      detailed architecture diagrams. Workload Discovery on AWS
                      maintains an inventory of the AWS resources across your
                      accounts and Regions, mapping relationships between
                      them, and displaying them in a web UI.
                    </Box>
                  </div>
                  <div>
                    <Box variant='h3' padding={{ top: 'n' }}>
                      Query AWS Cost & Usage Reports (CURs)
                    </Box>
                    <Box variant='p'>
                      The cost query builder lets you locate AWS resources and
                      services that may have incurred a cost. The estimated
                      cost data is automatically calculated for the time
                      period specified and displays on your architecture
                      diagrams. You can generate a cost report for your
                      architecture diagrams that contains an overview of the
                      estimated cost and export them as CSV.
                    </Box>
                  </div>
                  <div>
                    <Box variant='h3' padding={{ top: 'n' }}>
                      Search
                    </Box>
                    <Box variant='p'>
                      The search feature lets you use basic information, such
                      as resource name, Tag name, or IP address to locate the
                      resources you are interested in.
                    </Box>
                  </div>
                  <div>
                    <Box variant='h3' padding={{ top: 'n' }}>
                      Resource directory
                    </Box>
                    <Box variant='p'>
                      Explore resources provisioned across your accounts and
                      Regions using the resource directory. It contains all
                      the resources Workload Discovery on AWS has discovered. You can
                      start building your Workload Discovery on AWS architecture
                      diagrams by selecting a resource in the web UI.
                    </Box>
                  </div>
                </ColumnLayout>
              </Container>
            </div>
          </SpaceBetween>
          <div css={sidebarStyle}>
            <SpaceBetween size='xxl'>
              <Container
                header={
                  <Header variant='h2'>
                    Getting started <Icon name='external' />
                  </Header>
                }>
                <ul aria-label="Additional resource links" css={listStyle}>
                  <li>
                    <Link href={RESOURCES} onFollow={handleFollow}>Explore Resources</Link>
                  </li>
                  <li>
                    <Link href={DIAGRAM_MANAGEMENT} onFollow={handleFollow}>Manage Diagrams</Link>
                  </li>
                  <li>
                    <Link href={ACCOUNTS} onFollow={handleFollow}>Import Accounts</Link>
                  </li>
                  <li>
                    <Link
                      external
                      externalIconAriaLabel="Opens in a new tab"
                      href="https://docs.aws.amazon.com/solutions/latest/workload-discovery-on-aws/welcome.html"
                    >Implementation Guide</Link>
                  </li>
                </ul>
              </Container>

              <Container
                header={
                  <Header variant='h2'>
                    More resources <Icon name='external' />
                  </Header>
                }>
                <ul aria-label="Additional resource links" css={listStyle}>
                  <li>
                    <Link
                      external
                      externalIconAriaLabel="Opens in a new tab"
                      href="https://github.com/awslabs/aws-perspective"
                    >GitHub repository</Link>
                  </li>
                  <li>
                    <Link
                      external
                      externalIconAriaLabel="Opens in a new tab"
                      href="https://github.com/awslabs/aws-perspective/issues/new?assignees=&labels=enhancement&template=feature_request.md&title="
                    >Feature request</Link>
                  </li>
                  <li>
                    <Link
                      external
                      externalIconAriaLabel="Opens in a new tab"
                      href="https://github.com/awslabs/aws-perspective/issues/new?assignees=&labels=bug&template=bug_report.md&title="
                    >Raise an issue</Link>
                  </li>
                </ul>
              </Container>
            </SpaceBetween>
          </div>
        </Grid>
      </Box>
    </Box>
  );
};

export default Homepage;
