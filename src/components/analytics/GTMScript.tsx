/**
 * GTMScript — Server Component
 *
 * Conditionally loads Google Tag Manager script only if GTM_ID is set.
 * Uses next/script with strategy="afterInteractive".
 * GTM_ID comes from the gtmId setting in DB (passed as prop).
 */

import Script from 'next/script';

interface GTMScriptProps {
  gtmId: string;
}

export default function GTMScript({ gtmId }: GTMScriptProps) {
  if (!gtmId || !gtmId.trim()) return null;

  const sanitizedId = gtmId.trim();

  // Validate GTM ID format: GTM-XXXXXXX
  if (!/^GTM-[A-Z0-9]+$/.test(sanitizedId)) return null;

  return (
    <>
      {/* GTM Script — loads after page is interactive */}
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${sanitizedId}');
`,
        }}
      />
      {/* GTM noscript fallback — added to body via Script */}
      <Script
        id="gtm-noscript"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
(function(){
  var ns = document.createElement('noscript');
  var iframe = document.createElement('iframe');
  iframe.src = 'https://www.googletagmanager.com/ns.html?id=${sanitizedId}';
  iframe.height = '0';
  iframe.width = '0';
  iframe.style.display = 'none';
  iframe.style.visibility = 'hidden';
  ns.appendChild(iframe);
  document.body.insertBefore(ns, document.body.firstChild);
})();
`,
        }}
      />
    </>
  );
}
