import React from "react"
import useAuth from "./useAuth"

export default function Dashboard(props) {
  const accessToken = useAuth(props.code);
  return (
    <div>
      {props.code}
    </div>
  )
}
