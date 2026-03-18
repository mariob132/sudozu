// Templates de página promocional: misma estructura, diseños diferentes.
// Cada uno se usa como /promo/:themeId

export const PROMO_TEMPLATES = [
  {
    id: 'teal',
    name: 'Promo Teal',
    category: 'promo',
    description: 'Diseño limpio con acento teal. Profesional y fresco.',
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
    theme: 'teal',
  },
  {
    id: 'coral',
    name: 'Promo Coral',
    category: 'promo',
    description: 'Cálido y cercano. Ideal para servicios personales o creativos.',
    thumbnail: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop',
    theme: 'coral',
  },
  {
    id: 'dark',
    name: 'Promo Dark',
    category: 'promo',
    description: 'Tema oscuro con acentos vibrantes. Moderno y tecnológico.',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    theme: 'dark',
  },
  {
    id: 'minimal',
    name: 'Promo Minimal',
    category: 'promo',
    description: 'Blanco y negro con toques de color. Elegante y minimalista.',
    thumbnail: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop',
    theme: 'minimal',
  },
  {
    id: 'hero-image',
    name: 'Promo Hero Imagen',
    category: 'promo',
    description: 'Hero con imagen de fondo a pantalla completa. Impactante y moderno.',
    thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
    theme: 'hero-image',
  },
  {
    id: 'circular',
    name: 'Promo Circular',
    category: 'promo',
    description: 'Imágenes y tarjetas con estilo circular. Suave y acogedor.',
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop',
    theme: 'circular',
  },
  {
    id: 'glass',
    name: 'Promo Glass',
    category: 'promo',
    description: 'Efecto cristal y transparencias con animaciones suaves. Moderno y ligero.',
    thumbnail: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=300&fit=crop',
    theme: 'glass',
  },
]

export function getPromoTheme(themeId) {
  return PROMO_TEMPLATES.find((t) => t.id === themeId) || PROMO_TEMPLATES[0]
}
