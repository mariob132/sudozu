// Templates promocionales (página completa, mismo contenido, distintos diseños)
export const templates = [
  {
    id: 'promo-teal',
    name: 'Promo Teal',
    category: 'promo',
    description: 'Página promocional. Diseño limpio con acento teal. Hero, Nosotros, Servicios, Portafolio, Testimonios, Ubicación, Contacto.',
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
    templateType: 'promo',
    theme: 'teal',
    elements: []
  },
  {
    id: 'promo-fishing-tours',
    name: 'Tours de Pesca',
    category: 'promo',
    description: 'Página para pescadores/guías que ofrecen tours. Ideal para reservas: rutas, equipo, precios, testimonios, ubicación y contacto.',
    thumbnail: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=400&h=300&fit=crop',
    templateType: 'promo',
    theme: 'teal',
    promoContent: {
      logoName: 'Pesca Tours',
      navItems: [
        { label: 'Sobre el guía', href: '#sobre-nosotros' },
        { label: 'Paquetes', href: '#servicios' },
        { label: 'Galería', href: '#portafolio' },
        { label: 'Reseñas', href: '#testimonios' },
        { label: 'Punto de salida', href: '#ubicacion' },
        { label: 'Reservar', href: '#contacto', cta: true }
      ],
      colors: {
        primary: '#0284c7',
        primaryDark: '#0369a1',
        bg: '#f0f9ff',
        bgAlt: '#e0f2fe',
        card: '#ffffff',
        text: '#0b1220',
        textMuted: '#334155',
        border: '#bae6fd'
      },
      menuColors: {
        bg: 'rgba(240, 249, 255, 0.85)',
        text: '#0b1220',
        logoColor: '#075985',
        border: 'rgba(2, 132, 199, 0.18)',
        ctaBg: '#0284c7',
        ctaText: '#ffffff'
      },
      hero: {
        title: 'Reserva tu tour de ',
        highlightWord: 'pesca',
        titleEnd: ' hoy',
        description: 'Salidas privadas y compartidas. Confirmación rápida por WhatsApp, guía local, spots por temporada y equipo a bordo. Cupos limitados.',
        animation: 'fishing',
        ctaText: 'Reservar por WhatsApp',
        ctaSecondaryText: 'Ver paquetes y precios',
        ctaHref: 'https://wa.me/34600000000',
        ctaSecondaryHref: '#servicios',
        colors: {
          bg: 'linear-gradient(160deg, rgba(11,59,90,0.22) 0%, rgba(7,89,133,0.18) 30%, rgba(14,165,233,0.14) 65%, rgba(224,242,254,1) 100%)',
          titleColor: '#071a2b',
          highlightColor: '#0284c7',
          descColor: '#334155',
          ctaBg: '#0284c7',
          ctaText: '#ffffff',
          cta2Bg: 'rgba(255,255,255,0.7)',
          cta2Text: '#075985'
        },
        imageUrl: 'https://images.unsplash.com/photo-1528154291023-a6525fabe5b4?w=800&q=85'
      },
      about: {
        title: 'Guía local certificado',
        subtitle: 'Reserva fácil, pesca real y 100% seguro',
        lead: 'Te llevo directo a los mejores spots según marea, viento y temporada. Ideal si es tu primera vez o si vienes por pesca deportiva.',
        content: 'Antes de salir confirmamos hora, punto de encuentro y condiciones del mar. Te ayudamos con la técnica (casting/jigging/trolling) y optimizamos el tour según el tipo de pesca que buscas. La prioridad es seguridad y una experiencia memorable.',
        colors: {
          bg: '#f0f9ff',
          titleColor: '#0b1220',
          subtitleColor: '#334155',
          textColor: '#334155',
          accentColor: '#0284c7'
        },
        values: [
          { label: 'Confirmación rápida', text: 'Reserva por WhatsApp en minutos' },
          { label: 'Todo listo', text: 'Equipo a bordo y guía durante el tour' },
          { label: 'Política clara', text: 'Reprogramación por clima sin estrés' }
        ],
        imageUrl: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=700&q=80'
      },
      servicesColors: {
        bg: '#e0f2fe',
        titleColor: '#0b1220',
        subtitleColor: '#334155',
        cardBg: '#ffffff',
        cardTitleColor: '#0b1220',
        cardTextColor: '#334155'
      },
      services: [
        { icon: '⏱️', title: 'Express 3h — desde €149', description: 'Perfecto para una primera salida. Incluye guía, chalecos, hielera, agua. 1–2 personas.' },
        { icon: '🚤', title: 'Aventura 5h — desde €249', description: 'Más tiempo en el agua y más spots. Ideal para pesca deportiva. 1–4 personas.' },
        { icon: '🌅', title: 'Sunrise 6h — desde €299', description: 'Salida al amanecer para mejores capturas. Recomendado para grupos. 1–4 personas.' }
      ],
      portfolioColors: {
        bg: '#f0f9ff',
        titleColor: '#0b1220',
        subtitleColor: '#334155',
        captionColor: '#334155'
      },
      portfolio: [
        { id: 1, title: 'Salida al amanecer', description: 'Mar calmado y buen pique', image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=700&q=80' },
        { id: 2, title: 'Pesca deportiva', description: 'Técnicas y asesoría en vivo', image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=700&q=80' },
        { id: 3, title: 'Embarcación equipada', description: 'Listos para zarpar', image: 'https://images.unsplash.com/photo-1528154291023-a6525fabe5b4?w=700&q=80' },
        { id: 4, title: 'Ruta costera', description: 'Paisajes y spots por temporada', image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=700&q=80' }
      ],
      testimonialsColors: {
        bg: '#e0f2fe',
        titleColor: '#0b1220',
        quoteColor: '#0b1220',
        authorColor: '#075985',
        starsColor: '#0284c7'
      },
      testimonials: [
        { name: 'Luis Fernández', role: 'Aventura 5h', text: 'Reserva rápida por WhatsApp y todo listo al llegar. Nos llevó a un spot perfecto y aprendimos jigging. Repetimos seguro.', rating: 5, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
        { name: 'Sofía Pérez', role: 'Familiar (Express 3h)', text: 'Fuimos con niños y fue increíble. Muy paciente y profesional. Nos explicó todo y fue súper seguro.', rating: 5, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face' },
        { name: 'Diego Ramírez', role: 'Sunrise 6h', text: 'Primera vez pescando en el mar y fue un éxito. Spots muy buenos, buen ambiente y fotos increíbles.', rating: 5, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' }
      ],
      location: {
        address: 'Puerto Deportivo\nPunto de encuentro: Muelle 3\nLlega 15 min antes',
        hours: 'Salidas diarias (con reserva)\nAmanecer y tarde',
        phone: '+34 600 000 000',
        mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3037.497430507072!2d-3.703790323357885!3d40.41677535928266!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd42287e23931a75%3A0x2e34a2d2f0a3e3e3!2sPuerta%20del%20Sol%2C%20Madrid!5e0!3m2!1ses!2ses!4v1635000000000!5m2!1ses!2ses'
      },
      locationColors: {
        bg: '#f0f9ff',
        titleColor: '#0b1220',
        textColor: '#334155'
      },
      contact: {
        phone: '+34 600 000 000',
        email: 'reservas@pescatours.com'
      },
      contactColors: {
        bg: '#e0f2fe',
        titleColor: '#0b1220',
        subtitleColor: '#334155',
        labelColor: '#0b1220',
        inputBg: '#ffffff',
        inputText: '#0b1220',
        buttonBg: '#0284c7',
        buttonText: '#ffffff'
      },
      footer: {
        text: `© ${new Date().getFullYear()} Pesca Tours. Reserva por WhatsApp: +34 600 000 000.`,
        colors: {
          bg: '#075985',
          textColor: '#e0f2fe'
        }
      }
    },
    elements: []
  },
  {
    id: 'promo-pos',
    name: 'Punto de Venta POS',
    category: 'promo',
    description: 'Template para sistema Punto de Venta: inventario, ventas, facturación, reportes y demo.',
    thumbnail: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=400&h=300&fit=crop',
    templateType: 'promo',
    theme: 'glass',
    promoContent: {
      logoName: 'VentaPro POS',
      navItems: [
        { label: 'Módulos', href: '#servicios' },
        { label: 'Funciones', href: '#portafolio' },
        { label: 'Clientes', href: '#testimonios' },
        { label: 'Planes', href: '#ubicacion' },
        { label: 'Demo', href: '#contacto', cta: true }
      ],
      colors: {
        primary: '#4f46e5',
        primaryDark: '#4338ca',
        bg: '#f8fafc',
        bgAlt: '#eef2ff',
        card: '#ffffff',
        text: '#111827',
        textMuted: '#475569',
        border: '#c7d2fe'
      },
      menuColors: {
        bg: 'rgba(248, 250, 252, 0.9)',
        text: '#111827',
        logoColor: '#312e81',
        border: 'rgba(79, 70, 229, 0.18)',
        ctaBg: '#4f46e5',
        ctaText: '#ffffff'
      },
      hero: {
        title: 'Controla tu ',
        highlightWord: 'Punto de Venta',
        titleEnd: ' en tiempo real',
        description: 'Vende rápido, controla inventario, genera facturas y revisa reportes desde cualquier dispositivo. Ideal para tiendas, restaurantes y minimarkets.',
        ctaText: 'Solicitar Demo',
        ctaSecondaryText: 'Ver módulos',
        ctaHref: '#contacto',
        ctaSecondaryHref: '#servicios',
        colors: {
          bg: 'linear-gradient(160deg, rgba(79,70,229,0.16) 0%, rgba(99,102,241,0.14) 40%, rgba(224,231,255,1) 100%)',
          titleColor: '#111827',
          highlightColor: '#4f46e5',
          descColor: '#475569',
          ctaBg: '#4f46e5',
          ctaText: '#ffffff',
          cta2Bg: '#ffffff',
          cta2Text: '#3730a3'
        },
        imageUrl: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=900&q=85'
      },
      about: {
        title: 'Hecho para vender más',
        subtitle: 'Rápido, simple y seguro',
        lead: 'Un POS pensado para negocios que necesitan rapidez en caja y control total del negocio.',
        content: 'Centraliza ventas, stock, compras y clientes en una sola plataforma. Configura productos, imprime tickets, controla usuarios y revisa márgenes en segundos.',
        values: [
          { label: 'Implementación rápida', text: 'Empieza a vender en el mismo día' },
          { label: 'Datos en la nube', text: 'Acceso seguro desde cualquier lugar' },
          { label: 'Soporte cercano', text: 'Te ayudamos en cada etapa' }
        ],
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=700&q=80'
      },
      servicesColors: {
        bg: '#eef2ff',
        titleColor: '#111827',
        subtitleColor: '#475569',
        cardBg: '#ffffff',
        cardTitleColor: '#111827',
        cardTextColor: '#475569'
      },
      services: [
        { icon: '🧾', title: 'Caja y facturación', description: 'Cobro rápido, tickets y facturas. Métodos de pago mixtos y cierre de caja automático.' },
        { icon: '📦', title: 'Inventario inteligente', description: 'Control por SKU, alertas de stock bajo, ajustes y movimientos entre sucursales.' },
        { icon: '📊', title: 'Reportes y analítica', description: 'Ventas por día/cajero/producto, utilidad, productos top y métricas en tiempo real.' }
      ],
      portfolioColors: {
        bg: '#f8fafc',
        titleColor: '#111827',
        subtitleColor: '#475569',
        captionColor: '#475569'
      },
      portfolio: [
        { id: 1, title: 'Pantalla de caja', description: 'Venta rápida y búsqueda por código', image: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=700&q=80' },
        { id: 2, title: 'Dashboard gerencial', description: 'KPIs y ventas en vivo', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=700&q=80' },
        { id: 3, title: 'Control de inventario', description: 'Stock y reposición automática', image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=700&q=80' },
        { id: 4, title: 'Multi-sucursal', description: 'Unifica todas tus tiendas', image: 'https://images.unsplash.com/photo-1556742393-d75f468bfcb0?w=700&q=80' }
      ],
      testimonialsColors: {
        bg: '#eef2ff',
        titleColor: '#111827',
        quoteColor: '#111827',
        authorColor: '#312e81',
        starsColor: '#4f46e5'
      },
      testimonials: [
        { name: 'Carla Mendoza', role: 'Tienda de abarrotes', text: 'Reducimos filas en caja y ahora tengo control de stock al instante. Muy fácil de usar.', rating: 5, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face' },
        { name: 'Juan Pérez', role: 'Restaurante', text: 'El módulo de reportes nos ayudó a ver horas pico y mejorar la operación del local.', rating: 5, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
        { name: 'Mónica Ruiz', role: 'Minimarket', text: 'La implementación fue rápida. En dos días ya estábamos facturando con el sistema.', rating: 5, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' }
      ],
      location: {
        address: 'Plan Inicial desde $29/mes\nPlan Pro desde $59/mes',
        hours: 'Demo en vivo\nLunes a Viernes: 9:00 – 18:00',
        phone: '+34 911 222 333',
        mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3037.497430507072!2d-3.703790323357885!3d40.41677535928266!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd42287e23931a75%3A0x2e34a2d2f0a3e3e3!2sPuerta%20del%20Sol%2C%20Madrid!5e0!3m2!1ses!2ses!4v1635000000000!5m2!1ses!2ses'
      },
      locationColors: {
        bg: '#f8fafc',
        titleColor: '#111827',
        textColor: '#475569'
      },
      contact: {
        phone: '+34 911 222 333',
        email: 'demo@ventapropost.com'
      },
      contactColors: {
        bg: '#eef2ff',
        titleColor: '#111827',
        subtitleColor: '#475569',
        labelColor: '#111827',
        inputBg: '#ffffff',
        inputText: '#111827',
        buttonBg: '#4f46e5',
        buttonText: '#ffffff'
      },
      footer: {
        text: `© ${new Date().getFullYear()} VentaPro POS. Solicita una demo personalizada.`,
        colors: {
          bg: '#1e1b4b',
          textColor: '#e0e7ff'
        }
      }
    },
    elements: []
  },
  {
    id: 'promo-hero-image',
    name: 'Promo Hero Imagen',
    category: 'promo',
    description: 'Página promocional. Hero con imagen de fondo a pantalla completa. Impactante y moderno.',
    thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
    templateType: 'promo',
    theme: 'hero-image',
    elements: []
  },
  {
    id: 'promo-circular',
    name: 'Promo Circular',
    category: 'promo',
    description: 'Página promocional. Imágenes y tarjetas con estilo circular. Suave y acogedor.',
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop',
    templateType: 'promo',
    theme: 'circular',
    elements: []
  },
  {
    id: 'promo-glass',
    name: 'Promo Glass',
    category: 'promo',
    description: 'Página promocional. Efecto cristal y transparencias con animaciones suaves. Moderno y ligero.',
    thumbnail: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=300&fit=crop',
    templateType: 'promo',
    theme: 'glass',
    elements: []
  }
]

export const getTemplateById = (id) => {
  return templates.find(t => t.id === id)
}

export const getTemplatesByCategory = (category) => {
  return templates.filter(t => t.category === category)
}
