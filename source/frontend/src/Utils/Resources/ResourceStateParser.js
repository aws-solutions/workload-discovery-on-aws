const getGreenState = state => {
  return new RegExp(
    ['available', 'running', 'in-use', 'active'].join('|')
  ).exec(state);
};

const getRedState = state => {
  return new RegExp(
    [
      'stopped',
      'deleted',
      'shutting-down',
      'terminated',
      'stopping',
      'failed'
    ].join('|')
  ).exec(state);
};

const getAmberState = state => {
  return new RegExp(['pending', 'provisioning'].join('|')).exec(state);
};

export const getStateInformation = state => {
  try {
    const greenState = getGreenState(state.toLowerCase());
    if (greenState)
      return {
        status: 'status-available',
        text: greenState[0],
        color: '#1D8102'
      };

    const amberState = getAmberState(state.toLowerCase());
    if (amberState)
      return {
        status: 'status-warning',
        text: amberState[0],
        color: '#FF9900'
      };

    const redState = getRedState(state.toLowerCase());
    if (redState)
      return {
        status: 'status-negative',
        text: redState[0],
        color: '#D13212'
      };
    return {
      status: 'status-warning',
      text: 'no state data',
      color: '#FF9900'
    };
  } catch (e) {
    return {
      status: 'status-warning',
      text: 'no state data',
      color: '#FF9900'
    };
  }
};
