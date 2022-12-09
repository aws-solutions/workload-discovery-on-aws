// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { getStateInformation } from '../../../Utils/Resources/ResourceStateParser';

test('node comes through with Available state uppercase', () => {
  const state = getStateInformation('Available');
  expect(state).toEqual({
    status: 'status-available',
    text: 'available',
    color: '#1D8102'
  });
});

test('node comes through with available state lowercase', () => {
  const state = getStateInformation('available');
  expect(state).toEqual({
    status: 'status-available',
    text: 'available',
    color: '#1D8102'
  });
});

test('node comes through with running state lowercase', () => {
  const state = getStateInformation('running');
  expect(state).toEqual({
    status: 'status-available',
    text: 'running',
    color: '#1D8102'
  });
});

test('node comes through with running state uppercase', () => {
  const state = getStateInformation('Running');
  expect(state).toEqual({
    status: 'status-available',
    text: 'running',
    color: '#1D8102'
  });
});

test('node comes through with in-use state uppercase', () => {
  const state = getStateInformation('In-Use');
  expect(state).toEqual({
    status: 'status-available',
    text: 'in-use',
    color: '#1D8102'
  });
});

test('node comes through with in-use state lowercase', () => {
  const state = getStateInformation('in-use');
  expect(state).toEqual({
    status: 'status-available',
    text: 'in-use',
    color: '#1D8102'
  });
});

test('node comes through with active state uppercase', () => {
  const state = getStateInformation('Active');
  expect(state).toEqual({
    status: 'status-available',
    text: 'active',
    color: '#1D8102'
  });
});

test('node comes through with active state lowercase', () => {
  const state = getStateInformation('active');
  expect(state).toEqual({
    status: 'status-available',
    text: 'active',
    color: '#1D8102'
  });
});

test('node comes through with Stopped state uppercase', () => {
  const state = getStateInformation('Stopped');
  expect(state).toEqual({
    status: 'status-negative',
    text: 'stopped',
    color: '#D13212'
  });
});

test('node comes through with stopped state lowercase', () => {
  const state = getStateInformation('stopped');
  expect(state).toEqual({
    status: 'status-negative',
    text: 'stopped',
    color: '#D13212'
  });
});

test('node comes through with stopping state uppercase', () => {
  const state = getStateInformation('Stopping');
  expect(state).toEqual({
    status: 'status-negative',
    text: 'stopping',
    color: '#D13212'
  });
});

test('node comes through with stopping state lowercase', () => {
  const state = getStateInformation('stopping');
  expect(state).toEqual({
    status: 'status-negative',
    text: 'stopping',
    color: '#D13212'
  });
});

test('node comes through with shutting-down state uppercase', () => {
  const state = getStateInformation('Shutting-Down');
  expect(state).toEqual({
    status: 'status-negative',
    text: 'shutting-down',
    color: '#D13212'
  });
});

test('node comes through with shutting-down state lowercase', () => {
  const state = getStateInformation('shutting-down');
  expect(state).toEqual({
    status: 'status-negative',
    text: 'shutting-down',
    color: '#D13212'
  });
});

test('node comes through with terminated state uppercase', () => {
  const state = getStateInformation('Terminated');
  expect(state).toEqual({
    status: 'status-negative',
    text: 'terminated',
    color: '#D13212'
  });
});

test('node comes through with terminated state lowercase', () => {
  const state = getStateInformation('terminated');
  expect(state).toEqual({
    status: 'status-negative',
    text: 'terminated',
    color: '#D13212'
  });
});

test('node comes through with deleted state uppercase', () => {
  const state = getStateInformation('Deleted');
  expect(state).toEqual({
    status: 'status-negative',
    text: 'deleted',
    color: '#D13212'
  });
});

test('node comes through with deleted state lowercase', () => {
  const state = getStateInformation('deleted');
  expect(state).toEqual({
    status: 'status-negative',
    text: 'deleted',
    color: '#D13212'
  });
});

test('node comes through with failed state uppercase', () => {
  const state = getStateInformation('Failed');
  expect(state).toEqual({
    status: 'status-negative',
    text: 'failed',
    color: '#D13212'
  });
});

test('node comes through with failed state lowercase', () => {
  const state = getStateInformation('failed');
  expect(state).toEqual({
    status: 'status-negative',
    text: 'failed',
    color: '#D13212'
  });
});

test('node comes through with pending state uppercase', () => {
  const state = getStateInformation('Pending');
  expect(state).toEqual({
    status: 'status-warning',
    text: 'pending',
    color: '#FF9900'
  });
});

test('node comes through with pending state lowercase', () => {
  const state = getStateInformation('pending');
  expect(state).toEqual({
    status: 'status-warning',
    text: 'pending',
    color: '#FF9900'
  });
});

test('node comes through with provisioning state uppercase', () => {
  const state = getStateInformation('Provisioning');
  expect(state).toEqual({
    status: 'status-warning',
    text: 'provisioning',
    color: '#FF9900'
  });
});

test('node comes through with provisioning state lowercase', () => {
  const state = getStateInformation('provisioning');
  expect(state).toEqual({
    status: 'status-warning',
    text: 'provisioning',
    color: '#FF9900'
  });
});

test('node comes through with undefined state', () => {
  const state = getStateInformation(undefined);
  expect(state).toEqual({
    status: 'status-warning',
    text: 'no state data',
    color: '#FF9900'
  });
});

test('node comes through with non-supported state', () => {
  const state = getStateInformation('flapping');
  expect(state).toEqual({
    status: 'status-warning',
    text: 'no state data',
    color: '#FF9900'
  });
});

test('node comes through with null', () => {
  const state = getStateInformation(null);
  expect(state).toEqual({
    status: 'status-warning',
    text: 'no state data',
    color: '#FF9900'
  });
});
