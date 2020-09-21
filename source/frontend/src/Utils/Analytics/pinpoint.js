import { API } from 'aws-amplify';
import { v1 as uuid } from "uuid";


const headers = { "Content-Type": "application/json" };

const send = event => {
  const batchItemId = uuid();
  const eventId = uuid();

  const body = {
    BatchItem: {
      [batchItemId]: {
        Events: {
          [eventId]: event
        }
      }
    }
  };

  return API.post("pinpointApi", "", { body, headers });
};

export const sendLoginEvent = () => {
    
  const serializedTimeStamp = new Date().toISOString();

  return send({
    EventType: "login",
    Timestamp: serializedTimeStamp
  });
};

