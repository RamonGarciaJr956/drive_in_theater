import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: '0' },
          '50%': { opacity: '1' },
        },
        videoRevealTop: {
          '0%': {
            height: '50%'
          },
          '100%': {
            height: '0%'
          }
        },
        videoRevealBottom: {
          '0%': {
            transform: 'scaleY(1)',
            transformOrigin: 'bottom'
          },
          '100%': {
            transform: 'scaleY(0)',
            transformOrigin: 'bottom'
          }
        }
      },
      animation: {
        'twinkle': 'twinkle 2s infinite',
        'video-reveal-top': 'videoRevealTop 2s ease-out forwards',
        'video-reveal-bottom': 'videoRevealBottom 2s ease-out forwards'
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
        oswald: ['Oswald', ...fontFamily.sans],
        lexend: ['Lexend', ...fontFamily.sans],
        parkinsans: ['Parkinsans', ...fontFamily.sans],
      },
    },
  },
  plugins: [],
} satisfies Config;
