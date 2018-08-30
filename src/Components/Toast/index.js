import React from 'react'
import style from './style'
import { ToastContainer as ToastifyContainer } from 'react-toastify'
export { toast } from 'react-toastify'

export const ToastContainer = props => (
  <React.Fragment>
    <ToastifyContainer {...props} />
    <style jsx global>
      {style}
    </style>
  </React.Fragment>
)
