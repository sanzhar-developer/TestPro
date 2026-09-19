const API_URL = import.meta.env.VITE_API_URL;

export async function APIFetch(path, options = {}) {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (response.status === 401) {
    // Токен невалиден/истёк/удалён — сервер сам это сказал
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login'; // жёсткий редирект, работает вне React-компонентов
    // Бросаем ошибку, чтобы код после вызова не пытался работать с несуществующими данными
    throw new Error('Unauthorized');
  }

  return response;
}