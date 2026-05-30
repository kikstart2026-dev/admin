import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "react-hot-toast";

// import 'bootstrap/dist/css/bootstrap.min.css';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(


    <QueryClientProvider client={queryClient}>
      
      <App />

      {/* Toast Notification */}
      <Toaster
        position="top-right"
        reverseOrder={false}
      />

    </QueryClientProvider>


);

reportWebVitals();