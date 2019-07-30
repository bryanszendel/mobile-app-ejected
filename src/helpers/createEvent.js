import axios from 'axios';
import getEnvVars from '../../environment';

const { eventTrackingURL } = getEnvVars();

// possiblePersonIndex: 0
// emailIndex: 0
// phoneIndex: 0
// addressIndex: 2
// urlIndex: 0
// relationshipIndex: 0

export const sendUserInfo = emailAddress => {
  // console.log(emailAddress);
  axios.post(eventTrackingURL, { emailAddress });
};

export const sendEvent = (
  emailAddress,
  verb,
  noun,
  outcome = null,
  options = null
) => {
  if (emailAddress === null) {
    emailAddress = 'anonymous@unknown.org';
  }
  const bodyObject = {};

  bodyObject['event'] = `${verb}-${noun}`;

  if (outcome !== null) {
    bodyObject['event'] += `-${outcome}`;
  }

  bodyObject['emailAddress'] = emailAddress;

  if (options !== null) {
    bodyObject['options'] = options;
  }
  // console.log(bodyObject);
  return axios
    .post(eventTrackingURL, JSON.stringify(bodyObject))
    .then(res => {
      // console.log('EVENT TRACKING RES: ', res);
      return res;
    })
    .catch(err => {
      console.error('Event Tracking Error: ', err);
      return err;
    });
};

export const createOptions = (listLength, noun, index) => {
  // console.log('listLength', listLength, ' noun ', noun, ' index ', index);
  let options = {};
  if (listLength === null) {
    options[`${noun}Index`] = index;
    // console.log(options);
    return options;
  } else {
    options.possibleMatches = listLength;
    options.personMatch = listLength === 0;
    // console.log(options);
    return options;
  }
};
