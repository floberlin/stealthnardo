import React from 'react'
import { default as NextHead } from 'next/head'

interface Props {
  title?: string
  description?: string
}

export function Head(props: Props) {
  return (
    <NextHead>
      <title>StealthSend</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </NextHead>
  )
}
