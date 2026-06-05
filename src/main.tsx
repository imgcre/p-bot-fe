import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import RestRank from './pages/rest-rank/index.tsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { jloader } from './utilities/jloader.ts'
import CheckIn from './pages/check-in/index.tsx'
import PicDetails from './pages/pic_details/index.tsx'
import AnimateTest from './pages/animate-test/index.tsx'
import MemberAchvs from './pages/member-achvs/index.tsx'
import RichList from './pages/rich-list/index.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },
  {
    path: 'rest-rank',
    element: <RestRank />,
    loader: jloader,
  },
  {
    path: 'check-in',
    element: <CheckIn />,
    loader: jloader,
  },
  {
    path: 'pic_details',
    element: <PicDetails />,
    loader: jloader,
  },
  {
    path: 'animate-test',
    element: <AnimateTest />,
    loader: jloader,
  },
  {
    path: 'member-achvs',
    element: <MemberAchvs />,
    loader: jloader,
  },
  {
    path: 'rich-list',
    element: <RichList />,
    loader: jloader,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
