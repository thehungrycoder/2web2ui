import _ from 'lodash';

const initialState = {
  alerts: []
};

export default (state = initialState, { type, payload }) => {

  switch (type) {

    case 'SHOW_GLOBAL_ALERT': {
      const id = _.uniqueId('alert_');
      const alerts = _.uniqBy([
        ...state.alerts,
        { dedupeId: id, ...payload, id } // pass in 'dedupeId' to prevent multiples of the same alert
      ], 'dedupeId');

      if (alerts.length > state.alerts.length) {
        return { ...state, alerts };
      } else {
        return state;
      }
    }

    case 'CLEAR_GLOBAL_ALERT':
      return {
        ...state,
        alerts: state.alerts.filter(({ id }) => id !== payload.id)
      };

    default:
      return state;
  }

};
