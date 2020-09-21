import React from 'react';
import ResourceState from '../DetailsDialog/ResourceState';
import ResourceItem from '../DetailsDialog/ResourceItem';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  divider: {
    marginTop: '2vh',
    marginBottom: '2vh'
  }
}));

const resourceItemTitleStyle = {
  color: '#535B63',
  fontSize: '1rem',
  lineHeight: '2rem',
  marginBottom: '.5rem',
  fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
};
const resourceItemValueStyle = { fontSize: '0.75rem', marginLeft: '.5vw', fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif', };

export default ({ node }) => {
  const classes = useStyles();
  return (
    <div className='hoverOverPanel'>
      <div>
        <dl>
          <dd>
            <ResourceItem
              title='Type'
              resource={
                node.data('resource') ? `${node.data('resource').type}` : '...'
              }
              titleStyle={resourceItemTitleStyle}
              valueStyle={resourceItemValueStyle}
            />
          </dd>
          <Divider className={classes.divider} />
          <dd>
            <ResourceItem
              title='Name'
              resource={node.data('title') ? `${node.data('title')}` : '...'}
              titleStyle={resourceItemTitleStyle}
              valueStyle={resourceItemValueStyle}
            />
          </dd>
          <Divider className={classes.divider} />
          <dd>
            <ResourceItem
              title='Cost'
              resource={node.data('cost') ? `$${node.data('cost').toFixed(2)}` : '...'}
              titleStyle={resourceItemTitleStyle}
              valueStyle={resourceItemValueStyle}
            />
          </dd>
          {node.data('state') && (
            <dd>
              <Divider className={classes.divider} />
              <ResourceState title='Status' state={node.data('state')} />
            </dd>
          )}
          <Divider className={classes.divider} />
          {node.data('properties') && (
            <div>
              <dd>
                <ResourceItem
                  title='Last Updated'
                  resource={
                    node.data('properties').configurationItemCaptureTime
                      ? `${
                          node.data('properties').configurationItemCaptureTime
                        }`
                      : '...'
                  }
                  titleStyle={resourceItemTitleStyle}
                  valueStyle={resourceItemValueStyle}
                />
              </dd>
              <Divider className={classes.divider} />
            </div>
          )}
          <dd>{node.data('hoverComponent') && node.data('hoverComponent')}</dd>
        </dl>
      </div>
    </div>
  );
};
