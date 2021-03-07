import { environment } from '../environments/environment';

const DEVELOPMENT_URL = 'http://localhost:8000';
const PRODUCTION_URL = '';

export const API_BASE_URL = environment.production
  ? PRODUCTION_URL
  : DEVELOPMENT_URL;
export const WEBSOCKET_URI = API_BASE_URL;
