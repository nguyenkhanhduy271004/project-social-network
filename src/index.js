import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './Store/Store';
import { ThemeProvider } from './theme/ThemeContext';
import { LoadingProvider } from './utils/LoadingContext';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <ThemeProvider>
          <LoadingProvider>
            <App />
          </LoadingProvider>
        </ThemeProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);