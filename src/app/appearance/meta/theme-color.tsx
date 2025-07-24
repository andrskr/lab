export function ThemeColor() {
  return (
    <>
      <meta
        name="theme-color"
        media="(prefers-color-scheme: light) and (min-width: 1024px)"
        content="oklch(95% 0.25% 264)"
      />
      <meta
        name="theme-color"
        media="(prefers-color-scheme: dark) and (min-width: 1024px)"
        content="oklch(25% 1% 264)"
      />
      <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fff" />
      <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000" />
    </>
  );
}
