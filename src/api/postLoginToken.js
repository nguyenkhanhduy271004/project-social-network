export const postLoginToken = async idToken => {
  const API_URL = process.env.REACT_APP_API_URL;
  const path = '/auth/login-oauth2';

  try {
    const response = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(idToken),
    });
    if (!response.ok) throw new Error('bad server condition');
    const data = await response.json();
    if (data.jwt) {
      localStorage.setItem("jwt", data.jwt);
    }
    return true;
  } catch (e) {
    console.error('postLoginToken Error: ', e.message);
    return false;
  }
};
