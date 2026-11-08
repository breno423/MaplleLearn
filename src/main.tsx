
import React from 'react';
import ReactDOM from 'react-dom/client';
import { AwsRum, type AwsRumConfig } from 'aws-rum-web';

import App from './App';
import './index.css';

try {
  const config: AwsRumConfig = {
    sessionSampleRate: 0.2,
    identityPoolId: 'sa-east-1:0d310714-ba61-464f-b1b7-c3d814282c4c',
    endpoint: 'https://dataplane.rum.sa-east-1.amazonaws.com',
    telemetries: ['performance', 'errors', 'http'],
    allowCookies: false,
    enableXRay: false,
    signing: true,
  };

  const APPLICATION_ID = '72c2cb49-8cd2-481f-9d6c-091e7484cd56';
  const APPLICATION_VERSION = '1.0.0';
  const APPLICATION_REGION = 'sa-east-1';

  new AwsRum(
    APPLICATION_ID,
    APPLICATION_VERSION,
    APPLICATION_REGION,
    config
  );
} catch (error) {
  console.error('Erro ao inicializar CloudWatch RUM:', error);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
