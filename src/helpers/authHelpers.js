import { AsyncStorage } from 'react-native';
import AuthSessionCustom from './AuthSessionCustom.js';
import getEnvVars from '../../environment.js';
import jwtDecode from 'jwt-decode';


const { auth0Domain, auth0ClientId } = getEnvVars();

const toQueryString = params => {
  return (
    '?' +
    Object.entries(params)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join('&')
  );
};

const setItem = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.log(`error storing ${key}`, e);
  }
};


const handleLogin = async (authSession, setUserCreds) => {

  const redirectUrl = "exp://127.0.0.1:19000/--/expo-auth-session";
  console.log(`Redirect URL: ${redirectUrl}`);

  // Structure the auth parameters and URL
  const queryParams = toQueryString({
    client_id: auth0ClientId,
    redirect_uri: redirectUrl,
    audience: 'https://family-staging.connectourkids.org/api/v1/',
    response_type: 'id_token token', // id_token will return a JWT token
    scope: 'openid profile email', // retrieve the user's profile
    nonce: 'nonce', // ideally, this will be a random value
  });
  const authUrl = `https://${auth0Domain}/authorize` + queryParams;

  console.log(`AuthURL: ${authUrl}`);

  // Perform the authentication
  const response = await AuthSessionCustom.startAsync({ authUrl });
  console.log('AUTH response', response);

  if (response.error) {
    Alert('Authentication error', response.error_description || 'something went wrong');
    return;
  }
  // if users cancels login process, terminate method
  else if (response.type === 'dismiss') return;

  // assume success

  // Retrieve the JWT token and decode it
  const jwtToken = response.params.id_token;
  const decoded = jwtDecode(jwtToken);

  console.log('DECODED ===>', decoded);

  const { name,email } = decoded;

  // SET THE TIME TOKEN EXPIRES IN ASYNC STORAGE
  const expiresAt = response.expires_in * 1000 + new Date().getTime();
  setItem('expiresAt', expiresAt);
  setItem('auth0Data', response);
  setUserCreds(decoded, response);
};

export default {
  toQueryString,
  setItem,
  handleLogin
};
