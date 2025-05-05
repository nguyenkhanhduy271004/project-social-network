export const getUserInfo = async () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const API_PREFIX = process.env.REACT_APP_API_PREFIX;
  const path = `/${API_PREFIX}/user/info`;

  try {
    const response = await fetch(`${API_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
    });
    if (!response.ok) throw new Error('bad server condition');
    return response.json();
  } catch (e) {
    console.error('getUserInfo Error: ', e.message);
    return false;
  }
};
