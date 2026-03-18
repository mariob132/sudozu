import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getPromoTheme } from '../promoThemes'
import './PromoPage.css'

const SERVICES = [
  {
    icon: '⚡',
    title: 'Servicio Rápido',
    description: 'Entregas en tiempo récord sin comprometer la calidad. Tu proyecto en manos expertas.',
  },
  {
    icon: '🎯',
    title: 'Soluciones a Medida',
    description: 'Cada cliente es único. Diseñamos propuestas adaptadas a tus necesidades específicas.',
  },
  {
    icon: '🛡️',
    title: 'Garantía de Calidad',
    description: 'Compromiso total con los estándares más altos. Tu satisfacción es nuestra prioridad.',
  },
]

const PORTFOLIO = [
  { id: 1, title: 'Proyecto Alpha', description: 'Cliente corporativo', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80' },
  { id: 2, title: 'Proyecto Beta', description: 'Rediseño integral', image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&q=80' },
  { id: 3, title: 'Proyecto Gamma', description: 'Estrategia digital', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80' },
  { id: 4, title: 'Proyecto Delta', description: 'Consultoría', image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80' },
]

const TESTIMONIALS = [
  { name: 'María García', role: 'Directora, Empresa XYZ', text: 'Excelente servicio y resultados superiores. Los recomiendo sin dudar.', rating: 5, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face' },
  { name: 'Carlos López', role: 'Emprendedor', text: 'Profesionales, puntuales y con un trato cercano. Repetiré.', rating: 5, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
  { name: 'Ana Martínez', role: 'Gerente de Proyectos', text: 'La mejor inversión que hemos hecho. Impacto visible desde el primer mes.', rating: 5, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
]

export const DEFAULT_PROMO_CONTENT = {
  logoName: 'MiNegocio',
  navItems: [
    { label: 'Nosotros', href: '#sobre-nosotros' },
    { label: 'Servicios', href: '#servicios' },
    { label: 'Portafolio', href: '#portafolio' },
    { label: 'Testimonios', href: '#testimonios' },
    { label: 'Ubicación', href: '#ubicacion' },
    { label: 'Contáctanos', href: '#contacto', cta: true }
  ],
  colors: {
    primary: '#0d9488',
    primaryDark: '#0f766e',
    bg: '#f8fafc',
    bgAlt: '#f1f5f9',
    card: '#ffffff',
    text: '#1e293b',
    textMuted: '#64748b',
    border: '#e2e8f0'
  },
  hero: { title: 'Soluciones que ', highlightWord: 'impulsan', titleEnd: ' tu negocio', description: 'Ofrecemos servicios profesionales adaptados a ti. Calidad, compromiso y resultados que marcan la diferencia.', ctaText: 'Contáctanos', ctaSecondaryText: 'Ver servicios', imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=85' },
  about: { title: 'Sobre Nosotros', subtitle: 'Conoce a las personas detrás de tu éxito', lead: 'Somos un equipo con más de 10 años de experiencia ayudando a empresas y particulares a alcanzar sus objetivos.', content: 'Nos especializamos en ofrecer soluciones a medida, con un trato cercano y un compromiso claro con la calidad. Creemos en la transparencia, la puntualidad y en construir relaciones a largo plazo con nuestros clientes.', values: [{ label: 'Experiencia', text: 'Años en el sector' }, { label: 'Compromiso', text: 'Tu proyecto es nuestro proyecto' }, { label: 'Transparencia', text: 'Sin sorpresas ni costes ocultos' }], imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80' },
  services: [...SERVICES],
  portfolio: PORTFOLIO.map((p) => ({ ...p, image: p.image || p.imageUrl })),
  testimonials: TESTIMONIALS.map((t) => ({ ...t, avatar: t.avatar || t.avatarUrl })),
  location: { address: 'Calle Principal 123, Local 4\n28001 Madrid, España', hours: 'Lunes a Viernes: 9:00 – 18:00\nSábados: 10:00 – 14:00', phone: '+34 912 345 678', mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3037.497430507072!2d-3.703790323357885!3d40.41677535928266!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd42287e23931a75%3A0x2e34a2d2f0a3e3e3!2sPuerta%20del%20Sol%2C%20Madrid!5e0!3m2!1ses!2ses!4v1635000000000!5m2!1ses!2ses' },
  contact: { phone: '+34 912 345 678', email: 'info@minegocio.com' }
}

function PromoPage({ themeId: themeIdProp, embedInEditor = false, content: contentProp, onSectionClick }) {
  const { themeId: themeIdParam } = useParams()
  const themeId = themeIdProp ?? themeIdParam ?? 'teal'
  const theme = getPromoTheme(themeId)
  const themeClass = `promo-page--${theme.theme}`
  const sectionRefs = useRef([])
  const [menuOpen, setMenuOpen] = useState(false)
  const content = contentProp || DEFAULT_PROMO_CONTENT
  const colors = content.colors || {}
  const hero = content.hero || {}
  const about = content.about || {}
  const services = content.services || SERVICES
  const portfolio = content.portfolio || PORTFOLIO
  const testimonials = content.testimonials || TESTIMONIALS
  const location = content.location || {}
  const contactData = content.contact || {}
  const styleVars = (colors.primary || colors.bg || colors.text) ? {
    '--promo-primary': colors.primary,
    '--promo-primary-dark': colors.primaryDark,
    '--promo-bg': colors.bg,
    '--promo-bg-alt': colors.bgAlt,
    '--promo-card': colors.card,
    '--promo-text': colors.text,
    '--promo-text-muted': colors.textMuted,
    '--promo-border': colors.border
  } : undefined

  const menuColors = content.menuColors || {}
  const heroColors = hero.colors || {}
  const aboutColors = about.colors || {}
  const servicesColors = content.servicesColors || {}
  const portfolioColors = content.portfolioColors || {}
  const testimonialsColors = content.testimonialsColors || {}
  const locationColors = location.colors || {}
  const contactColors = contactData.colors || {}
  const footerColors = content.footer?.colors || {}

  const menuStyle = {
    ...(menuColors.bg && { '--menu-bg': menuColors.bg }),
    ...(menuColors.text && { '--menu-text': menuColors.text }),
    ...(menuColors.logoColor && { '--menu-logo': menuColors.logoColor }),
    ...(menuColors.ctaBg && { '--menu-cta-bg': menuColors.ctaBg }),
    ...(menuColors.ctaText && { '--menu-cta-text': menuColors.ctaText }),
    ...(menuColors.border && { '--menu-border': menuColors.border })
  }
  const heroStyle = {
    ...(heroColors.bg && { '--hero-bg': heroColors.bg }),
    ...(heroColors.titleColor && { '--hero-title': heroColors.titleColor }),
    ...(heroColors.highlightColor && { '--hero-highlight': heroColors.highlightColor }),
    ...(heroColors.descColor && { '--hero-desc': heroColors.descColor }),
    ...(heroColors.ctaBg && { '--hero-cta-bg': heroColors.ctaBg }),
    ...(heroColors.ctaText && { '--hero-cta-text': heroColors.ctaText }),
    ...(heroColors.cta2Bg && { '--hero-cta2-bg': heroColors.cta2Bg }),
    ...(heroColors.cta2Text && { '--hero-cta2-text': heroColors.cta2Text })
  }
  const aboutStyle = {
    ...(aboutColors.bg && { '--about-bg': aboutColors.bg }),
    ...(aboutColors.titleColor && { '--about-title': aboutColors.titleColor }),
    ...(aboutColors.subtitleColor && { '--about-subtitle': aboutColors.subtitleColor }),
    ...(aboutColors.textColor && { '--about-text': aboutColors.textColor }),
    ...(aboutColors.accentColor && { '--about-accent': aboutColors.accentColor })
  }
  const servicesStyle = {
    ...(servicesColors.bg && { '--services-bg': servicesColors.bg }),
    ...(servicesColors.titleColor && { '--services-title': servicesColors.titleColor }),
    ...(servicesColors.subtitleColor && { '--services-subtitle': servicesColors.subtitleColor }),
    ...(servicesColors.cardBg && { '--services-card-bg': servicesColors.cardBg }),
    ...(servicesColors.cardTitleColor && { '--services-card-title': servicesColors.cardTitleColor }),
    ...(servicesColors.cardTextColor && { '--services-card-text': servicesColors.cardTextColor })
  }
  const portfolioStyle = {
    ...(portfolioColors.bg && { '--portfolio-bg': portfolioColors.bg }),
    ...(portfolioColors.titleColor && { '--portfolio-title': portfolioColors.titleColor }),
    ...(portfolioColors.subtitleColor && { '--portfolio-subtitle': portfolioColors.subtitleColor }),
    ...(portfolioColors.captionColor && { '--portfolio-caption': portfolioColors.captionColor })
  }
  const testimonialsStyle = {
    ...(testimonialsColors.bg && { '--testimonials-bg': testimonialsColors.bg }),
    ...(testimonialsColors.titleColor && { '--testimonials-title': testimonialsColors.titleColor }),
    ...(testimonialsColors.quoteColor && { '--testimonials-quote': testimonialsColors.quoteColor }),
    ...(testimonialsColors.authorColor && { '--testimonials-author': testimonialsColors.authorColor }),
    ...(testimonialsColors.starsColor && { '--testimonials-stars': testimonialsColors.starsColor })
  }
  const locationStyle = {
    ...(locationColors.bg && { '--location-bg': locationColors.bg }),
    ...(locationColors.titleColor && { '--location-title': locationColors.titleColor }),
    ...(locationColors.textColor && { '--location-text': locationColors.textColor })
  }
  const contactStyle = {
    ...(contactColors.bg && { '--contact-bg': contactColors.bg }),
    ...(contactColors.titleColor && { '--contact-title': contactColors.titleColor }),
    ...(contactColors.subtitleColor && { '--contact-subtitle': contactColors.subtitleColor }),
    ...(contactColors.labelColor && { '--contact-label': contactColors.labelColor }),
    ...(contactColors.inputBg && { '--contact-input-bg': contactColors.inputBg }),
    ...(contactColors.inputText && { '--contact-input-text': contactColors.inputText }),
    ...(contactColors.buttonBg && { '--contact-button-bg': contactColors.buttonBg }),
    ...(contactColors.buttonText && { '--contact-button-text': contactColors.buttonText })
  }
  const footerStyle = {
    ...(footerColors.bg && { '--footer-bg': footerColors.bg }),
    ...(footerColors.textColor && { '--footer-text': footerColors.textColor })
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('promo-visible')
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )
    sectionRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const scrollToContact = (e) => {
    e.preventDefault()
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToServices = (e) => {
    e.preventDefault()
    document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className={`promo-page ${themeClass} ${onSectionClick ? 'promo-page-editable' : ''}`} style={styleVars}>
      <header
        className="promo-header"
        onClick={() => onSectionClick?.('menu')}
        style={{ ...menuStyle, ...(onSectionClick ? { cursor: 'pointer' } : {}) }}
        role={onSectionClick ? 'button' : undefined}
      >
        <div className="promo-container promo-header-inner">
          {(content.logoHref && content.logoHref.startsWith('/')) ? (
            <Link to={content.logoHref} className="promo-logo" onClick={(e) => { if (onSectionClick) { e.preventDefault(); onSectionClick('menu'); } }}>{content.logoName || 'MiNegocio'}</Link>
          ) : (
            <a href={content.logoHref || '#'} className="promo-logo" onClick={(e) => { if (onSectionClick) { e.preventDefault(); onSectionClick('menu'); } }}>{content.logoName || 'MiNegocio'}</a>
          )}
          <nav className={`promo-nav ${menuOpen ? 'promo-nav-open' : ''}`} onClick={(e) => e.stopPropagation()}>
            {(content.navItems || [
              { label: 'Nosotros', href: '#sobre-nosotros' },
              { label: 'Servicios', href: '#servicios' },
              { label: 'Portafolio', href: '#portafolio' },
              { label: 'Testimonios', href: '#testimonios' },
              { label: 'Ubicación', href: '#ubicacion' },
              { label: 'Contáctanos', href: '#contacto', cta: true }
            ]).map((item, i) => {
              const href = item.href || '#'
              const isInternal = href.startsWith('/')
              const className = item.cta ? 'promo-nav-cta' : ''
              const onClick = (e) => { setMenuOpen(false); if (onSectionClick) e.preventDefault(); }
              return isInternal ? (
                <Link key={i} to={href} className={className} onClick={onClick}>{item.label}</Link>
              ) : (
                <a key={i} href={href} className={className} onClick={onClick}>{item.label}</a>
              )
            })}
          </nav>
          <button
            type="button"
            className={`promo-mobile-menu ${menuOpen ? 'promo-mobile-menu-open' : ''}`}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <main>
        {/* 1. Hero */}
        <section className="promo-hero" ref={(el) => (sectionRefs.current[0] = el)} onClick={(e) => !e.target.closest('a') && onSectionClick?.('hero')} style={{ ...heroStyle, ...(onSectionClick ? { cursor: 'pointer' } : {}) }} role={onSectionClick ? 'button' : undefined}>
          <div className="promo-hero-bg" />
          <div className="promo-container promo-hero-inner">
            <div className="promo-hero-content">
              <h1 className="promo-hero-title">
                {hero.title || 'Soluciones que '}<span className="promo-hero-highlight">{hero.highlightWord || 'impulsan'}</span>{hero.titleEnd || ' tu negocio'}
              </h1>
              <p className="promo-hero-desc">
                {hero.description || 'Ofrecemos servicios profesionales adaptados a ti. Calidad, compromiso y resultados que marcan la diferencia.'}
              </p>
              <div className="promo-hero-actions">
                {(hero.ctaHref && hero.ctaHref.startsWith('/')) ? (
                  <Link to={hero.ctaHref} className="promo-btn promo-btn-primary" onClick={() => onSectionClick?.('hero')}>
                    {hero.ctaText || 'Contáctanos'}
                  </Link>
                ) : (
                  <a href={hero.ctaHref || '#contacto'} onClick={(e) => { scrollToContact(e); onSectionClick?.('hero'); }} className="promo-btn promo-btn-primary">
                    {hero.ctaText || 'Contáctanos'}
                  </a>
                )}
                {(hero.ctaSecondaryHref && hero.ctaSecondaryHref.startsWith('/')) ? (
                  <Link to={hero.ctaSecondaryHref} className="promo-btn promo-btn-secondary" onClick={() => onSectionClick?.('hero')}>
                    {hero.ctaSecondaryText || 'Ver servicios'}
                  </Link>
                ) : (
                  <a href={hero.ctaSecondaryHref || '#servicios'} onClick={(e) => { scrollToServices(e); onSectionClick?.('hero'); }} className="promo-btn promo-btn-secondary">
                    {hero.ctaSecondaryText || 'Ver servicios'}
                  </a>
                )}
              </div>
            </div>
            <div className="promo-hero-media">
              <img
                src={hero.imageUrl || 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=85'}
                alt="Equipo trabajando"
                className="promo-hero-img"
              />
            </div>
          </div>
        </section>

        {/* 2. Sobre Nosotros */}
        <section id="sobre-nosotros" className="promo-section promo-about" ref={(el) => (sectionRefs.current[1] = el)} onClick={() => onSectionClick?.('about')} style={{ ...aboutStyle, ...(onSectionClick ? { cursor: 'pointer' } : {}) }} role={onSectionClick ? 'button' : undefined}>
          <div className="promo-container">
            <h2 className="promo-section-title">{about.title || 'Sobre Nosotros'}</h2>
            <p className="promo-section-subtitle">{about.subtitle || 'Conoce a las personas detrás de tu éxito'}</p>
            <div className="promo-about-grid">
              <div className="promo-about-text">
                <p className="promo-about-lead">{about.lead || 'Somos un equipo con más de 10 años de experiencia.'}</p>
                <p>{about.content || 'Nos especializamos en ofrecer soluciones a medida.'}</p>
                <ul className="promo-about-values">
                  {(about.values || []).map((v, i) => (
                    <li key={i}><strong>{v.label}</strong> — {v.text}</li>
                  ))}
                </ul>
              </div>
              <div className="promo-about-image">
                {about.imageUrl && <img src={about.imageUrl} alt="Equipo" />}
              </div>
            </div>
          </div>
        </section>

        {/* 3. Servicios */}
        <section id="servicios" className="promo-section promo-services" ref={(el) => (sectionRefs.current[2] = el)} onClick={() => onSectionClick?.('services')} style={{ ...servicesStyle, ...(onSectionClick ? { cursor: 'pointer' } : {}) }} role={onSectionClick ? 'button' : undefined}>
          <div className="promo-container">
            <h2 className="promo-section-title">Servicios</h2>
            <p className="promo-section-subtitle">Lo que podemos hacer por ti</p>
            <div className="promo-services-grid">
              {services.map((s, i) => (
                <article key={i} className="promo-service-card">
                  <div className="promo-service-icon">{s.icon || '⚡'}</div>
                  <h3>{s.title}</h3>
                  <p>{s.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Portafolio */}
        <section id="portafolio" className="promo-section promo-portfolio" ref={(el) => (sectionRefs.current[3] = el)} onClick={() => onSectionClick?.('portfolio')} style={{ ...portfolioStyle, ...(onSectionClick ? { cursor: 'pointer' } : {}) }} role={onSectionClick ? 'button' : undefined}>
          <div className="promo-container">
            <h2 className="promo-section-title">Portafolio</h2>
            <p className="promo-section-subtitle">Algunos de nuestros trabajos</p>
            <div className="promo-portfolio-grid">
              {portfolio.map((item, i) => (
                <div key={item.id || i} className="promo-portfolio-item">
                  <div className="promo-portfolio-image">
                    <img src={item.image || item.imageUrl} alt={item.title} />
                  </div>
                  <div className="promo-portfolio-caption">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Testimonios */}
        <section id="testimonios" className="promo-section promo-testimonials" ref={(el) => (sectionRefs.current[4] = el)} onClick={() => onSectionClick?.('testimonials')} style={{ ...testimonialsStyle, ...(onSectionClick ? { cursor: 'pointer' } : {}) }} role={onSectionClick ? 'button' : undefined}>
          <div className="promo-container">
            <h2 className="promo-section-title">Testimonios</h2>
            <p className="promo-section-subtitle">Lo que dicen nuestros clientes</p>
            <div className="promo-testimonials-grid">
              {testimonials.map((t, i) => (
                <blockquote key={t.name || i} className="promo-testimonial-card">
                  <div className="promo-testimonial-stars">
                    {Array.from({ length: t.rating || 5 }).map((_, j) => (<span key={j} aria-hidden>★</span>))}
                  </div>
                  <p className="promo-testimonial-text">"{t.text}"</p>
                  <footer className="promo-testimonial-footer">
                    {(t.avatar || t.avatarUrl) && <img src={t.avatar || t.avatarUrl} alt="" className="promo-testimonial-avatar" />}
                    <div>
                      <cite className="promo-testimonial-name">{t.name}</cite>
                      <span className="promo-testimonial-role">{t.role}</span>
                    </div>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Ubicación */}
        <section id="ubicacion" className="promo-section promo-location" ref={(el) => (sectionRefs.current[5] = el)} onClick={() => onSectionClick?.('location')} style={{ ...locationStyle, ...(onSectionClick ? { cursor: 'pointer' } : {}) }} role={onSectionClick ? 'button' : undefined}>
          <div className="promo-container">
            <h2 className="promo-section-title">Ubicación</h2>
            <p className="promo-section-subtitle">Visítanos o escríbenos</p>
            <div className="promo-location-grid">
              <div className="promo-location-info">
                <div className="promo-location-block">
                  <h3>Dirección</h3>
                  <p>{(location.address || 'Calle Principal 123, Madrid').split('\n').map((line, i) => (<span key={i}>{line}<br /></span>))}</p>
                </div>
                <div className="promo-location-block">
                  <h3>Horario</h3>
                  <p>{(location.hours || 'Lunes a Viernes: 9:00 – 18:00').split('\n').map((line, i) => (<span key={i}>{line}<br /></span>))}</p>
                </div>
                <div className="promo-location-block">
                  <h3>Teléfono</h3>
                  <p><a href={`tel:${location.phone || ''}`}>{location.phone || '+34 912 345 678'}</a></p>
                </div>
              </div>
              <div className="promo-location-map">
                <iframe
                  title="Mapa de ubicación"
                  src={location.mapEmbedUrl || content.location?.mapEmbedUrl || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3037.497430507072!2d-3.703790323357885!3d40.41677535928266!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd42287e23931a75%3A0x2e34a2d2f0a3e3e3!2sPuerta%20del%20Sol%2C%20Madrid!5e0!3m2!1ses!2ses!4v1635000000000!5m2!1ses!2ses'}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 7. Contacto */}
        <section id="contacto" className="promo-section promo-contact" ref={(el) => (sectionRefs.current[6] = el)} onClick={() => onSectionClick?.('contact')} style={{ ...contactStyle, ...(onSectionClick ? { cursor: 'pointer' } : {}) }} role={onSectionClick ? 'button' : undefined}>
          <div className="promo-container">
            <h2 className="promo-section-title">Contacto</h2>
            <p className="promo-section-subtitle">Cuéntanos tu proyecto</p>
            <div className="promo-contact-grid">
              <form className="promo-contact-form" onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="promo-name">Nombre</label>
                <input id="promo-name" type="text" name="nombre" placeholder="Tu nombre" required />
                <label htmlFor="promo-email">Email</label>
                <input id="promo-email" type="email" name="email" placeholder="tu@email.com" required />
                <label htmlFor="promo-message">Mensaje</label>
                <textarea id="promo-message" name="mensaje" rows={5} placeholder="¿En qué podemos ayudarte?" required />
                <button type="submit" className="promo-btn promo-btn-primary promo-btn-block">
                  Enviar mensaje
                </button>
              </form>
              <div className="promo-contact-details">
                <div className="promo-contact-item">
                  <span className="promo-contact-label">Teléfono</span>
                  <a href={`tel:${contactData.phone || ''}`}>{contactData.phone || '+34 912 345 678'}</a>
                </div>
                <div className="promo-contact-item">
                  <span className="promo-contact-label">Email</span>
                  <a href={`mailto:${contactData.email || ''}`}>{contactData.email || 'info@minegocio.com'}</a>
                </div>
                <div className="promo-contact-social">
                  <span className="promo-contact-label">Redes sociales</span>
                  <div className="promo-social-links">
                    <a href="#" aria-label="Facebook">f</a>
                    <a href="#" aria-label="Instagram">ig</a>
                    <a href="#" aria-label="LinkedIn">in</a>
                    <a href="#" aria-label="Twitter">tw</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="promo-footer" onClick={() => onSectionClick?.('footer')} style={{ ...footerStyle, ...(onSectionClick ? { cursor: 'pointer' } : {}) }} role={onSectionClick ? 'button' : undefined}>
        <div className="promo-container">
          <p>{content.footer?.text || `© ${new Date().getFullYear()} ${content.logoName || 'MiNegocio'}. Todos los derechos reservados.`}</p>
          {!embedInEditor && (content.footer?.secondaryLink ? (
            <Link to={content.footer.secondaryLink.to} className="promo-footer-templates">{content.footer.secondaryLink.text}</Link>
          ) : (
            <Link to="/promo" className="promo-footer-templates">Ver otros diseños</Link>
          ))}
        </div>
      </footer>
    </div>
  )
}

export default PromoPage
