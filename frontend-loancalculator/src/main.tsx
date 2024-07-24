import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MemberList from './pages/members/MemberList.tsx'
import MemberDetail from './pages/members/MemberDetail.tsx'
import LoanList from './pages/loans/LoanList.tsx'
import LoanDetail from './pages/loans/LoanDetail.tsx';
import { Toaster } from 'react-hot-toast'

const router = createBrowserRouter([{
  path: "/", element: <App />, children: [
    { path: '/members', element: <MemberList /> },
    { path: "/members/:memberid", element: <MemberDetail /> },
    { path: "/members/:memberid/loans", element: <LoanList /> },
    { path: "/members/:memberid/loans/:loanid", element: <LoanDetail /> }
  ]
}]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <><RouterProvider router={router} />
    <Toaster />
  </>
)
