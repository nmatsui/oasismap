'use client'
import React, { useEffect, useState } from 'react'
import { Button, Typography, Grid } from '@mui/material'
import { signIn } from 'next-auth/react'

const Login: React.FC = () => {
  const [isValidBrowser, setIsValidBrowser] = useState(false)

  useEffect(() => {
    const userAgent = navigator.userAgent
    const isChrome = userAgent.includes('Chrome')
    const isSafari = userAgent.includes('Safari')
    const isValidBrowser = isChrome || isSafari
    setIsValidBrowser(isValidBrowser)
  }, [])

  return (
    <Grid container justifyContent="center" alignItems="center" sx={{ px: 2 }}>
      <Grid item xs={12} md={8}>
        <Typography variant="h5" align="center" sx={{ my: 6 }}>
          Well-Being可視化アプリ
        </Typography>
        {isValidBrowser ? (
          <>
            <Grid item xs={12} sx={{ p: 3, border: '1px solid' }}>
              <Typography variant="subtitle1" align="center">
                Googleアカウントでログイン
              </Typography>
              <Button
                variant="outlined"
                fullWidth
                sx={{ my: 2, textTransform: 'none' }}
                onClick={() =>
                  signIn(
                    'general-user-keycloak-client',
                    {
                      callbackUrl: '/happiness/me',
                    },
                    { prompt: 'login' }
                  )
                }
              >
                Google
              </Button>
            </Grid>
          </>
        ) : (
          <>
            <Typography variant="h5" align="center" sx={{ my: 6 }}>
              未対応ブラウザです。ChromeまたはSafariでアクセスしてください
            </Typography>
          </>
        )}
      </Grid>
    </Grid>
  )
}

export default Login
