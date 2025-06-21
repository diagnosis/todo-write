import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen.ts'
import './index.css'
import {TodoService} from "./webservices/TodoServices.js";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

// Create a new router instance
const router = createRouter({ routeTree })
const queryClient = new QueryClient()
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
      </QueryClientProvider>
  </React.StrictMode>,
)