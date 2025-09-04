// Original code from: https://github.com/vite-pwa/vite-plugin-pwa/blob/main/examples/react-router/src/ReloadPrompt.tsx
import React from 'react'
import {
  useRegisterSW
} from 'virtual:pwa-register/react'

function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // eslint-disable-next-line prefer-template
      console.log('SW Registered: ' + r)
    },
    onRegisterError(error) {
      console.log('SW registration error', error)
    },
  })

  const close = () => {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  return ( <
    div className = "fixed right-0 bottom-0 m-4 p-4 border rounded-md shadow-lg bg-background text-text-primary" >
    <
    div className = "z-20" > {
      (offlineReady || needRefresh) &&
        <
        div className = "flex flex-col gap-3" >
        <
        div className = "text-center" > {
          offlineReady ? < span > App ready to work offline < /span> : <span>New content available, click on reload button to update.</span >
        } <
        /div> <
        div className = "flex gap-3 justify-center" > {
          needRefresh && < button className = "px-3 py-1 bg-primary text-primary-foreground rounded-md"
          onClick = {
            () => updateServiceWorker(true)
          } > Reload < /button>} <
            button className = "px-3 py-1 bg-muted rounded-md"
          onClick = {
            () => close()
          } > Close < /button> <
            /div> <
            /div>
    } <
    /div> <
    /div>
  )
}

export default ReloadPrompt
