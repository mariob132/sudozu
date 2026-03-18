import PromoPage from './PromoPage'
import { DEFAULT_PROMO_CONTENT } from './PromoPage'

const HOME_SERVICES = [
  { icon: '🎨', title: 'Editor Visual', description: 'Edita tus templates de forma visual. Arrastra, mueve y personaliza elementos con facilidad.' },
  { icon: '🖼️', title: 'Gestión de Imágenes', description: 'Cambia imágenes fácilmente, ajusta su tamaño y posición con solo unos clics.' },
  { icon: '⚡', title: 'Rápido y Fácil', description: 'Crea tu página web en minutos sin necesidad de escribir código.' },
  { icon: '🆓', title: 'Templates Gratis', description: 'Accede a una colección de templates gratuitos listos para personalizar.' },
  { icon: '📱', title: 'Responsive', description: 'Tus páginas se verán perfectas en cualquier dispositivo, móvil o desktop.' },
  { icon: '🚀', title: 'Publicación Rápida', description: 'Publica tu sitio web en minutos y compártelo con el mundo.' },
]

const HOME_PORTFOLIO = [
  { id: 1, title: 'Restaurante', description: 'Template para restaurantes', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80' },
  { id: 2, title: 'Agencia', description: 'Template para agencias creativas', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80' },
  { id: 3, title: 'Gimnasio', description: 'Template para fitness', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80' },
  { id: 4, title: 'Inmobiliaria', description: 'Template para propiedades', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80' },
]

const HOME_TESTIMONIALS = [
  { name: 'María García', role: 'Emprendedora', text: 'Creé mi página en una tarde. El editor es muy intuitivo y los templates son profesionales.', rating: 5, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face' },
  { name: 'Carlos López', role: 'Dueño de restaurante', text: 'Sin saber nada de diseño pude tener una web que me enorgullece. Totalmente recomendable.', rating: 5, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
  { name: 'Ana Martínez', role: 'Freelance', text: 'Los templates me ahorraron semanas de trabajo. Edité textos e imágenes y listo.', rating: 5, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
]

export const HOME_PROMO_CONTENT = {
  ...DEFAULT_PROMO_CONTENT,
  logoName: 'zudosu',
  logoHref: '/',
  navItems: [
    { label: 'Nosotros', href: '#sobre-nosotros' },
    { label: 'Servicios', href: '#servicios' },
    { label: 'Portafolio', href: '#portafolio' },
    { label: 'Testimonios', href: '#testimonios' },
    { label: 'Ubicación', href: '#ubicacion' },
    { label: 'Contáctanos', href: '#contacto', cta: true },
  ].slice(0, -1).concat({ label: 'Iniciar Sesión', href: '/login', cta: true }),
  colors: {
    primary: '#2563eb',
    primaryDark: '#1d4ed8',
    bg: '#f8fafc',
    bgAlt: '#f1f5f9',
    card: '#ffffff',
    text: '#1e293b',
    textMuted: '#64748b',
    border: '#e2e8f0',
  },
  hero: {
    title: 'Crea tu Propia ',
    highlightWord: 'Página Web',
    titleEnd: ' en minutos',
    description: 'Diseña y personaliza tu sitio web sin necesidad de conocimientos técnicos. Edita templates, cambia imágenes y crea algo único.',
    ctaText: 'Comenzar Ahora',
    ctaSecondaryText: 'Saber Más',
    ctaHref: '/login',
    ctaSecondaryHref: '#servicios',
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
  },
  about: {
    title: '¿Por qué zudosu?',
    subtitle: 'Todo lo que necesitas para tu web',
    lead: 'zudosu te permite crear y personalizar tu página web o aplicación web de forma visual, sin escribir código.',
    content: 'Elige un template profesional, edita textos e imágenes con el editor drag & drop, y publica en minutos. Ideal para negocios, portfolios y proyectos personales.',
    values: [
      { label: 'Sin código', text: 'Todo desde el navegador' },
      { label: 'Templates listos', text: 'Solo personaliza y publica' },
      { label: 'Rápido', text: 'Minutos, no semanas' },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80',
  },
  services: HOME_SERVICES,
  portfolio: HOME_PORTFOLIO,
  testimonials: HOME_TESTIMONIALS,
  location: {
    address: '100% online\nAccede desde cualquier lugar',
    hours: 'Cuando quieras\nSin horarios',
    phone: '',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3037.497430507072!2d-3.703790323357885!3d40.41677535928266!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd42287e23931a75%3A0x2e34a2d2f0a3e3e3!2sPuerta%20del%20Sol%2C%20Madrid!5e0!3m2!1ses!2ses!4v1635000000000!5m2!1ses!2ses',
  },
  contact: { phone: '', email: 'hola@zudosu.com' },
  footer: {
    text: `© ${new Date().getFullYear()} zudosu. Todos los derechos reservados.`,
    secondaryLink: { to: '/login', text: 'Iniciar Sesión' },
  },
}

function LandingPage() {
  return <PromoPage themeId="teal" content={HOME_PROMO_CONTENT} />
}

export default LandingPage
