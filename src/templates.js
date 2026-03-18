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
    id: 'promo-coral',
    name: 'Promo Coral',
    category: 'promo',
    description: 'Página promocional. Cálido y cercano. Ideal para servicios personales o creativos.',
    thumbnail: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop',
    templateType: 'promo',
    theme: 'coral',
    elements: []
  },
  {
    id: 'promo-dark',
    name: 'Promo Dark',
    category: 'promo',
    description: 'Página promocional. Tema oscuro con acentos vibrantes. Moderno y tecnológico.',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    templateType: 'promo',
    theme: 'dark',
    elements: []
  },
  {
    id: 'promo-minimal',
    name: 'Promo Minimal',
    category: 'promo',
    description: 'Página promocional. Blanco y negro, elegante y minimalista.',
    thumbnail: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop',
    templateType: 'promo',
    theme: 'minimal',
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
