import React from 'react';
import { useFirebase } from '../context/FirebaseContext';

export const FloatingWhatsAppButton: React.FC = () => {
  const { siteSettings } = useFirebase();

  const rawNumber = (siteSettings.whatsapp || siteSettings.phone || '918431569661').replace(
    /[^0-9]/g,
    ''
  );
  if (!rawNumber) return null;

  const prefilledText = encodeURIComponent(
    `Hello ${siteSettings.brandName}, I would like to inquire about a Vastu consultation.`
  );
  const whatsappUrl = `https://wa.me/${rawNumber}?text=${prefilledText}`;

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 group">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Chat with ${siteSettings.brandName} on WhatsApp`}
        className="flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] text-white shadow-lg hover:shadow-xl transition-transform duration-150 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#25D366]"
      >
        <svg
          viewBox="0 0 32 32"
          aria-hidden="true"
          className="w-7 h-7 fill-current"
        >
          <path d="M16.002 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.256.59 4.46 1.712 6.4L3.2 28.8l6.588-1.728a12.74 12.74 0 0 0 6.214 1.612h.005c7.06 0 12.8-5.74 12.8-12.8 0-3.42-1.332-6.634-3.752-9.052A12.715 12.715 0 0 0 16.002 3.2zm0 23.328h-.004a10.6 10.6 0 0 1-5.408-1.482l-.388-.23-3.91 1.026 1.044-3.812-.252-.402a10.586 10.586 0 0 1-1.622-5.628c0-5.854 4.764-10.618 10.624-10.618 2.838 0 5.504 1.106 7.51 3.114a10.553 10.553 0 0 1 3.108 7.508c-.002 5.856-4.766 10.624-10.62 10.624zm5.826-7.952c-.32-.16-1.888-.932-2.18-1.038-.292-.106-.504-.16-.716.16-.212.32-.822 1.038-1.008 1.25-.186.214-.372.24-.692.08-.32-.16-1.35-.498-2.572-1.588-.95-.848-1.592-1.894-1.778-2.214-.186-.32-.02-.492.14-.652.144-.144.32-.374.48-.56.16-.186.212-.32.32-.532.106-.214.054-.4-.026-.56-.08-.16-.716-1.726-.982-2.364-.258-.62-.522-.536-.716-.546l-.61-.01c-.212 0-.558.08-.85.4-.292.32-1.116 1.09-1.116 2.658 0 1.568 1.142 3.084 1.302 3.298.16.212 2.248 3.432 5.446 4.812.76.328 1.354.524 1.816.672.764.242 1.46.208 2.01.126.612-.092 1.888-.772 2.154-1.518.266-.746.266-1.384.186-1.518-.08-.132-.292-.212-.612-.372z" />
        </svg>
      </a>

      <span
        role="tooltip"
        className="hidden sm:block pointer-events-none absolute right-16 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-medium whitespace-nowrap shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-150"
      >
        Chat on WhatsApp
      </span>
    </div>
  );
};
