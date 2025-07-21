const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
    darkMode: 'class',
    theme: {
        fontFamily: {
            sans: ['Space Grotesk', ...defaultTheme.fontFamily.sans],
            mono: ['JetBrains Mono', 'IBM Plex Mono', ...defaultTheme.fontFamily.mono],
            code: ['JetBrains Mono', 'IBM Plex Mono', ...defaultTheme.fontFamily.mono],
            serif: ['Space Grotesk', ...defaultTheme.fontFamily.sans]
        },
        extend: {
            animation: {
                scroll: 'scroll 120s linear infinite'
            },
            keyframes: {
                scroll: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-50%)' }
                }
            },
            textColor: {
                main: 'var(--color-main)',
                secondary: 'var(--color-secondary)'
            },
            backgroundColor: {
                main: 'var(--color-main)',
                secondary: 'var(--color-secondary)'
            },
            borderColor: {
                main: 'var(--color-main)',
                secondary: 'var(--color-secondary)'
            },
            typography: (theme) => ({
                dante: {
                    css: {
                        '--tw-prose-body': 'var(--color-main)',
                        '--tw-prose-headings': 'var(--color-main)',
                        '--tw-prose-lead': 'var(--color-main)',
                        '--tw-prose-links': 'var(--color-secondary)',
                        '--tw-prose-bold': 'var(--color-main)',
                        '--tw-prose-counters': 'var(--color-secondary)',
                        '--tw-prose-bullets': 'var(--color-secondary)',
                        '--tw-prose-hr': 'var(--color-main)',
                        '--tw-prose-quotes': 'var(--color-main)',
                        '--tw-prose-quote-borders': 'var(--color-main)',
                        '--tw-prose-captions': 'var(--color-secondary)',
                        '--tw-prose-code': 'var(--color-secondary)',
                        '--tw-prose-pre-code': 'var(--color-main)',
                        '--tw-prose-pre-bg': 'var(--color-secondary)',
                        '--tw-prose-th-borders': 'var(--color-main)',
                        '--tw-prose-td-borders': 'var(--color-main)'
                    }
                },
                DEFAULT: {
                    css: {
                        a: {
                            fontWeight: 'normal',
                            textDecoration: 'underline',
                            textDecorationStyle: 'dashed',
                            textDecorationThickness: '1px',
                            textUnderlineOffset: '2px',
                            '&:hover': {
                                textDecorationStyle: 'solid'
                            }
                        },
                        'h1,h2,h3,h4,h5,h6': {
                            fontFamily: theme('fontFamily.sans'),
                            fontWeight: 600
                        },
                        'code': {
                            fontFamily: theme('fontFamily.mono'),
                            fontWeight: 500
                        },
                        'pre': {
                            fontFamily: theme('fontFamily.mono')
                        },
                        blockquote: {
                            border: 0,
                            fontFamily: theme('fontFamily.mono'),
                            fontSize: '1.3125em',
                            fontStyle: 'normal',
                            fontWeight: '400',
                            lineHeight: 1.4,
                            paddingLeft: 0,
                            '@media (min-width: theme("screens.sm"))': {
                                fontSize: '1.66667em',
                                lineHeight: 1.3
                            }
                        }
                    }
                },
                lg: {
                    css: {
                        blockquote: {
                            paddingLeft: 0
                        }
                    }
                }
            })
        }
    },
    plugins: [require('@tailwindcss/typography')]
};
