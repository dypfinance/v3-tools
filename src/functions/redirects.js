import { Navigate  } from "react-router-dom"

export function RedirectPathToHomeOnly({ location }) {
    return <Navigate  to={{ ...location, pathname: '/' }} />
  }