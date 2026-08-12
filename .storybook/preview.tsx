import type { Preview } from '@storybook/nextjs-vite'
import { Lilita_One, Nunito } from 'next/font/google'
import localFont from 'next/font/local'
import '../app/globals.css'

const bodyFont = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800', '900'],
  variable: '--font-farm-body',
  display: 'swap',
})

const displayFont = Lilita_One({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-farm-display',
  display: 'swap',
})

const handFont = localFont({
  src: [
    { path: '../public/background-textures/Caveat-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../public/background-textures/Caveat-Bold.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-farm-hand',
  display: 'swap',
})

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
  decorators: [
    (Story) => <div className={`${bodyFont.variable} ${displayFont.variable} ${handFont.variable}`}><Story /></div>,
  ],
};

export default preview;
