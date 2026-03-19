import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { templates } from '../templates'
import PromoPage, { DEFAULT_PROMO_CONTENT } from './PromoPage'
import './Editor.css'
import './LandingPage.css'
import './PromoPage.css'

function slug(str) {
  if (!str) return ''
  return String(str).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

function Editor({ onLogout, templateListOnly = false }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedElement, setSelectedElement] = useState(null)
  const [showTemplates, setShowTemplates] = useState(!templateListOnly)
  const [templateLoaded, setTemplateLoaded] = useState(false)
  const [elements, setElements] = useState([])
  const [rightTab, setRightTab] = useState('contenido')
  const [isPromoPage, setIsPromoPage] = useState(false)
  const [promoTheme, setPromoTheme] = useState('teal')
  const [promoContent, setPromoContent] = useState(null)
  const [selectedPromoSection, setSelectedPromoSection] = useState('hero')
  const [rightTabPromo, setRightTabPromo] = useState('contenido')

  const handleElementClick = (element) => {
    setSelectedElement(element)
  }

  const updateElement = (id, updates) => {
    setElements(elements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    ))
    setSelectedElement(prev => prev && prev.id === id ? { ...prev, ...updates } : prev)
  }

  const handleImageUpload = (id, file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      updateElement(id, { src: e.target.result })
    }
    reader.readAsDataURL(file)
  }

  const handleLogoImageUpload = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      updateElement(selectedElement.id, { logoImage: e.target.result })
    }
    reader.readAsDataURL(file)
  }

  const updateCardInSection = (sectionId, cardId, updates) => {
    setElements(elements.map(el => {
      if (el.id !== sectionId || el.type !== 'cardSection') return el
      return { ...el, cards: (el.cards || []).map(c => c.id === cardId ? { ...c, ...updates } : c) }
    }))
    if (selectedElement?.id === sectionId) {
      setSelectedElement(prev => {
        if (!prev || prev.id !== sectionId) return prev
        return { ...prev, cards: (prev.cards || []).map(c => c.id === cardId ? { ...c, ...updates } : c) }
      })
    }
  }

  const updateSectionItem = (sectionId, itemKey, itemId, updates) => {
    setElements(elements.map(el => {
      if (el.id !== sectionId || !el[itemKey]) return el
      return { ...el, [itemKey]: el[itemKey].map(it => it.id === itemId ? { ...it, ...updates } : it) }
    }))
    if (selectedElement?.id === sectionId) {
      setSelectedElement(prev => {
        if (!prev || prev.id !== sectionId || !prev[itemKey]) return prev
        return { ...prev, [itemKey]: prev[itemKey].map(it => it.id === itemId ? { ...it, ...updates } : it) }
      })
    }
  }

  // Al entrar a /editor con una plantilla elegida en /templates, cargarla
  useEffect(() => {
    if (templateListOnly) return
    const templateFromState = location.state?.template
    if (!templateFromState) return
    loadTemplate(templateFromState)
    setShowTemplates(false)
    navigate('/editor', { replace: true, state: {} })
  }, [templateListOnly, location.state?.template])

  const loadTemplate = (template) => {
    if (template.templateType === 'promo') {
      setPromoTheme(template.theme || 'teal')
      setIsPromoPage(true)
      const base = template.promoContent || DEFAULT_PROMO_CONTENT
      setPromoContent(JSON.parse(JSON.stringify(base)))
      setSelectedPromoSection('hero')
      setElements([])
      setSelectedElement(null)
      setShowTemplates(false)
      setTemplateLoaded(true)
      setTimeout(() => setTemplateLoaded(false), 3000)
      return
    }
    // Generar nuevos IDs únicos para evitar conflictos
    let newElements = (template.elements || []).map((el, index) => ({
      ...el,
      id: Date.now() + index
    }))

    // Convertir bloque "features" (título + textos de cards) en un elemento cardSection editable
    const sectionTitleEl = newElements.find(el => el.type === 'text' && el.fontSize >= 36 && el.y > 500 && el.y < 700)
    const featureTextsEls = newElements.filter(el => el.type === 'text' && el.y >= 600 && el.y < 900)
    const cardTitles = featureTextsEls.filter(t => (t.fontSize || 0) >= 20 && (t.fontSize || 0) < 30)
    if (sectionTitleEl && cardTitles.length > 0) {
      const cards = cardTitles.map((title, idx) => {
        const desc = featureTextsEls.find(t => t.y > title.y && t.y < title.y + 100 && (t.fontSize || 0) < 20)
        const iconMatch = (title.content || '').match(/^([^\s\w]+)\s*/)
        const icon = iconMatch ? iconMatch[1] : '✨'
        const titleText = (title.content || '').replace(/^[^\s\w]+\s*/, '').trim()
        return {
          id: Date.now() + 1000 + idx,
          icon,
          title: titleText,
          description: desc ? desc.content : '',
          titleColor: title.color || '#60a5fa',
          descColor: desc ? (desc.color || '#cbd5e1') : '#cbd5e1'
        }
      })
      const cardSection = {
        id: Date.now() + 500,
        type: 'cardSection',
        y: sectionTitleEl.y,
        sectionTitle: sectionTitleEl.content || '¿Por qué elegir zudosu?',
        sectionTitleFontSize: sectionTitleEl.fontSize || 42,
        sectionTitleColor: sectionTitleEl.color || '#ffffff',
        cards
      }
      const idsToRemove = new Set([sectionTitleEl.id, ...featureTextsEls.map(t => t.id)])
      newElements = newElements.filter(el => !idsToRemove.has(el.id))
      newElements.push(cardSection)
    }

    // Calcular altura necesaria antes de renderizar
    let maxHeight = 1200
    if (newElements.length > 0) {
      const maxY = Math.max(...newElements.map(el => {
        let elementHeight = 50
        if (el.type === 'image') {
          elementHeight = el.height || 200
        } else if (el.type === 'cardSection') {
          const cardCount = (el.cards || []).length
          elementHeight = 200 + Math.ceil(cardCount / 3) * 280
        } else if (el.type === 'sectionAbout') {
          elementHeight = 450
        } else if (el.type === 'sectionPortfolio') {
          elementHeight = 400 + Math.ceil((el.items || []).length / 2) * 220
        } else if (el.type === 'sectionTestimonials') {
          elementHeight = 350 + (el.items || []).length * 180
        } else if (el.type === 'sectionLocation' || el.type === 'sectionContact') {
          elementHeight = 400
        } else if (el.type === 'text' || el.type === 'button') {
          const fontSize = el.fontSize || 16
          const lines = el.content ? Math.ceil(String(el.content).length / 50) : 1
          elementHeight = (el.type === 'button' ? 50 : fontSize * lines * 1.4)
        } else {
          const fontSize = el.fontSize || 16
          const lines = Math.ceil((el.content || '').length / 50) || 1
          elementHeight = fontSize * lines * 1.4
        }
        return (el.y || 0) + elementHeight
      }))
      maxHeight = Math.max(maxY + 200, 1200)
    }
    
    setIsPromoPage(false)
    setPromoContent(null)
    setElements(newElements)
    setSelectedElement(null)
    setShowTemplates(false)
    setTemplateLoaded(true)
    
    // Ocultar mensaje después de 3 segundos
    setTimeout(() => {
      setTemplateLoaded(false)
    }, 3000)
    
    // Ajustar altura del container y hacer scroll
    setTimeout(() => {
      const container = document.querySelector('.canvas-container')
      const canvas = document.querySelector('.editor-canvas')
      
      if (container) {
        container.style.minHeight = `${maxHeight}px`
      }
      
      // Scroll al inicio del canvas
      if (canvas) {
        canvas.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }, 100)
  }

  return (
    <div className="editor-page editor-simple">
      <header className="editor-header-simple">
        <div className="editor-header-inner">
          <span className="editor-page-label">{templateListOnly ? 'Elige tu plantilla' : 'Página Inicio'}</span>
          <div className="editor-header-actions">
            {!templateListOnly && (
            <button onClick={() => setShowTemplates(true)} className="editor-header-btn" title="Templates">
              📋 Templates
            </button>
            )}
            <button onClick={onLogout} className="editor-header-btn editor-header-btn-logout">Cerrar sesión</button>
          </div>
        </div>
      </header>

      {templateListOnly ? (
        <TemplateGallery
          templates={templates}
          onSelect={(template) => navigate('/editor', { state: { template } })}
          onClose={() => { onLogout(); navigate('/login') }}
        />
      ) : showTemplates ? (
        <TemplateGallery
          templates={templates}
          onSelect={loadTemplate}
          onClose={() => setShowTemplates(false)}
        />
      ) : null}

      {!templateListOnly && (
      <div className="editor-container">
        <main className="editor-canvas">
          {isPromoPage ? (
            <div className="editor-promo-wrap">
              <PromoPage themeId={promoTheme} embedInEditor content={promoContent || DEFAULT_PROMO_CONTENT} onSectionClick={setSelectedPromoSection} />
            </div>
          ) : (
          <div className="canvas-container">
            {elements.length === 0 ? (
              <div className="empty-canvas-simple">
                <p className="empty-canvas-title">Tu página está vacía</p>
                <p className="empty-canvas-hint">Elige un template para empezar. Luego podrás editar textos, colores e imágenes.</p>
                <button onClick={() => setShowTemplates(true)} className="empty-canvas-btn-simple">Ver templates</button>
              </div>
            ) : (
              <>
                <div className="landing-page editor-preview">
                  {(() => {
                    const header = elements.find(el => el.type === 'header')
                    const heroTexts = elements.filter(el => el.type === 'text' && el.y < 500)
                    const heroImage = elements.find(el => el.type === 'image' && el.y < 500)
                    const heroButtons = elements.filter(el => el.type === 'button' && el.y < 500)
                    const cardSections = elements.filter(el => el.type === 'cardSection').sort((a, b) => (a.y || 0) - (b.y || 0))
                    const sectionTitle = elements.find(el => el.type === 'text' && el.fontSize >= 36 && el.y > 500 && el.y < 700)
                    const featureTexts = elements.filter(el => el.type === 'text' && el.y >= 600 && el.y < 900)
                    const ctaTexts = elements.filter(el => el.type === 'text' && el.y >= 800)
                    const ctaButton = elements.find(el => el.type === 'button' && el.y >= 800)
                    const sectionAboutList = elements.filter(el => el.type === 'sectionAbout').sort((a, b) => (a.y || 0) - (b.y || 0))
                    const sectionPortfolioList = elements.filter(el => el.type === 'sectionPortfolio').sort((a, b) => (a.y || 0) - (b.y || 0))
                    const sectionTestimonialsList = elements.filter(el => el.type === 'sectionTestimonials').sort((a, b) => (a.y || 0) - (b.y || 0))
                    const sectionLocationList = elements.filter(el => el.type === 'sectionLocation').sort((a, b) => (a.y || 0) - (b.y || 0))
                    const sectionContactList = elements.filter(el => el.type === 'sectionContact').sort((a, b) => (a.y || 0) - (b.y || 0))
                    const navItems = header?.navItems || []
                    const heroId = slug(navItems[0] || 'inicio')
                    const ctaId = slug(navItems[navItems.length - 1] || 'contacto')
                    const cardSectionIds = cardSections.map(sec => slug(sec.sectionTitle || 'caracteristicas'))
                    const hasFallbackFeatures = cardSections.length === 0 && !!sectionTitle
                    const extraSectionIds = [
                      ...(sectionAboutList.length ? ['sobre-nosotros'] : []),
                      ...(sectionPortfolioList.length ? ['portafolio'] : []),
                      ...(sectionTestimonialsList.length ? ['testimonios'] : []),
                      ...(sectionLocationList.length ? ['ubicacion'] : []),
                      ...(sectionContactList.length ? ['contacto'] : [])
                    ]
                    const sectionIdsSet = new Set([heroId, ...cardSectionIds, ...(hasFallbackFeatures ? ['features'] : []), ctaId, ...extraSectionIds])
                    const navItemsToShow = navItems.filter(label => sectionIdsSet.has(slug(label)))
                    return (
                      <>
                        {header && (
                          <nav
                            className={`navbar ${selectedElement?.id === header.id ? 'selected' : ''}`}
                            onClick={() => handleElementClick(header)}
                            style={{ backgroundColor: header.backgroundColor || 'rgba(15, 23, 42, 0.95)', borderBottom: '1px solid rgba(59, 130, 246, 0.2)' }}
                          >
                            <div className="nav-container">
                              {header.logoImage ? (
                                <img src={header.logoImage} alt={header.logo || 'Logo'} className="logo logo-img" style={{ height: `${header.logoSize || 28}px`, objectFit: 'contain' }} />
                              ) : (
                                <h1 className="logo" style={{ background: header.logoColor ? `linear-gradient(135deg, ${header.logoColor} 0%, ${header.logoColor} 100%)` : 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontSize: `${header.logoSize || 28}px` }}>{header.logo || 'zudosu'}</h1>
                              )}
                              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                {navItemsToShow.map((label, idx) => (
                                  <a
                                    key={idx}
                                    href={`#${slug(label)}`}
                                    onClick={(e) => {
                                      e.preventDefault()
                                      document.getElementById(slug(label))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                                    }}
                                    className="btn-primary"
                                    style={{ fontSize: `${header.navSize || 14}px`, color: header.textColor || '#60a5fa', textDecoration: 'none', fontWeight: 600, padding: '0.5rem 1rem', background: 'transparent', border: `1px solid ${header.textColor || '#60a5fa'}`, borderRadius: '8px' }}
                                  >
                                    {label}
                                  </a>
                                ))}
                              </div>
                            </div>
                          </nav>
                        )}
                        {/* Hero */}
                        <section id={slug((header?.navItems || [])[0] || 'inicio')} className="hero">
                          <div className="hero-background-image"></div>
                          <div className="hero-content">
                            <div className="hero-text">
                              {heroTexts.map((text) => (
                                text.fontSize >= 40 ? (
                                  <h1 key={text.id} className={`hero-title ${selectedElement?.id === text.id ? 'selected' : ''}`} onClick={() => handleElementClick(text)} style={{ fontSize: `${text.fontSize}px`, color: text.color || '#ffffff', fontFamily: text.fontFamily || 'Arial', fontWeight: text.fontWeight || 'bold' }}>{text.content}</h1>
                                ) : (
                                  <p key={text.id} className={`hero-subtitle ${selectedElement?.id === text.id ? 'selected' : ''}`} onClick={() => handleElementClick(text)} style={{ fontSize: `${text.fontSize}px`, color: text.color || '#cbd5e1', fontFamily: text.fontFamily || 'Arial' }}>{text.content}</p>
                                )
                              ))}
                            </div>
                            {heroImage && (
                              <div className={`hero-image-container ${selectedElement?.id === heroImage.id ? 'selected' : ''}`} onClick={() => handleElementClick(heroImage)}>
                                <img src={heroImage.src} alt="Hero" className="hero-image" />
                              </div>
                            )}
                            {heroButtons.map((btn) => (
                              <button key={btn.id} className={`btn-primary ${selectedElement?.id === btn.id ? 'selected' : ''}`} onClick={() => handleElementClick(btn)} style={{ fontSize: `${btn.fontSize}px`, color: btn.color || '#fff', backgroundColor: btn.backgroundColor || '#3b82f6', borderRadius: `${btn.borderRadius || 14}px`, padding: btn.padding || '1rem 2rem' }}>{btn.content}</button>
                            ))}
                          </div>
                        </section>
                        {/* Card sections */}
                        {cardSections.map((sec) => (
                          <section key={sec.id} id={slug(sec.sectionTitle || 'caracteristicas')} className={`features ${selectedElement?.id === sec.id ? 'selected' : ''}`} onClick={() => handleElementClick(sec)}>
                            <div className="container">
                              <h2 className="section-title" style={{ fontSize: `${sec.sectionTitleFontSize || 42}px`, color: sec.sectionTitleColor || '#ffffff' }}>{sec.sectionTitle || 'Características'}</h2>
                              <div className="features-grid">
                                {(sec.cards || []).map(card => (
                                  <div key={card.id} className="feature-card">
                                    <div className="feature-icon">{card.icon && (card.icon.startsWith('http') || card.icon.startsWith('data:')) ? <img src={card.icon} alt="" style={{ width: 56, height: 56, objectFit: 'contain' }} /> : (card.icon || '✨')}</div>
                                    <h3 style={{ color: card.titleColor || '#ffffff' }}>{card.title}</h3>
                                    <p style={{ color: card.descColor || '#cbd5e1' }}>{card.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </section>
                        ))}
                        {/* Fallback features from loose texts (template without cardSection) */}
                        {cardSections.length === 0 && sectionTitle && (
                          <section id="features" className="features">
                            <div className="container">
                              <h2 className="section-title" style={{ fontSize: `${sectionTitle.fontSize}px`, color: sectionTitle.color || '#ffffff' }} onClick={() => handleElementClick(sectionTitle)}>{sectionTitle.content}</h2>
                              <div className="features-grid">
                                {featureTexts.filter(t => t.fontSize >= 20 && t.fontSize < 30).map((title) => {
                                  const desc = featureTexts.find(t => t.y > title.y && t.y < title.y + 100 && t.fontSize < 20)
                                  return (
                                    <div key={title.id} className="feature-card" onClick={() => handleElementClick(desc || title)}>
                                      <div className="feature-icon">{title.content.split(' ')[0]}</div>
                                      <h3 style={{ color: title.color || '#ffffff' }}>{title.content.replace(/^[🎨🖼️⚡🆓📱🚀]+\s*/, '')}</h3>
                                      {desc && <p style={{ color: desc.color || '#cbd5e1' }}>{desc.content}</p>}
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          </section>
                        )}
                        {/* CTA */}
                        <section id={slug((header?.navItems || [])[(header?.navItems || []).length - 1] || 'contacto')} className="cta-section">
                          <div className="container">
                            {ctaTexts.filter(t => t.fontSize >= 30).map(text => (
                              <h2 key={text.id} className={selectedElement?.id === text.id ? 'selected' : ''} onClick={() => handleElementClick(text)} style={{ fontSize: `${text.fontSize}px`, color: text.color || '#ffffff' }}>{text.content}</h2>
                            ))}
                            {ctaTexts.filter(t => t.fontSize < 30 && t.fontSize >= 16).map(text => (
                              <p key={text.id} className={selectedElement?.id === text.id ? 'selected' : ''} onClick={() => handleElementClick(text)} style={{ fontSize: `${text.fontSize}px`, color: text.color || '#cbd5e1' }}>{text.content}</p>
                            ))}
                            {ctaButton && (
                              <button className={`btn-cta-large ${selectedElement?.id === ctaButton.id ? 'selected' : ''}`} onClick={() => handleElementClick(ctaButton)} style={{ fontSize: `${ctaButton.fontSize}px`, color: ctaButton.color || '#ffffff', backgroundColor: ctaButton.backgroundColor || '#3b82f6', borderRadius: `${ctaButton.borderRadius || 14}px`, padding: ctaButton.padding || '1.375rem 3.5rem' }}>{ctaButton.content}</button>
                            )}
                          </div>
                        </section>
                        {/* Secciones adicionales (Nosotros, Portafolio, Testimonios, Ubicación, Contacto) */}
                        {sectionAboutList.map((sec) => (
                          <section key={sec.id} id="sobre-nosotros" className={`promo-section promo-about ${selectedElement?.id === sec.id ? 'selected' : ''}`} onClick={() => handleElementClick(sec)} style={sec.backgroundColor ? { backgroundColor: sec.backgroundColor } : undefined}>
                            <div className="promo-container">
                              <h2 className="promo-section-title" style={sec.titleColor ? { color: sec.titleColor } : undefined}>{sec.title || 'Sobre Nosotros'}</h2>
                              <p className="promo-section-subtitle" style={sec.subtitleColor ? { color: sec.subtitleColor } : undefined}>{sec.subtitle || ''}</p>
                              <div className="promo-about-grid">
                                <div className="promo-about-text" style={sec.textColor ? { color: sec.textColor } : undefined}>
                                  <p className="promo-about-lead">{sec.lead || ''}</p>
                                  <p>{sec.content || ''}</p>
                                  <ul className="promo-about-values" style={sec.accentColor ? { ['--values-accent']: sec.accentColor } : undefined}>
                                    {(sec.values || []).map((v) => (
                                      <li key={v.id}><strong style={sec.accentColor ? { color: sec.accentColor } : undefined}>{v.label}</strong> — {v.text}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div className="promo-about-image">
                                  {sec.imageUrl && <img src={sec.imageUrl} alt="" />}
                                </div>
                              </div>
                            </div>
                          </section>
                        ))}
                        {sectionPortfolioList.map((sec) => (
                          <section key={sec.id} id="portafolio" className={`promo-section promo-portfolio ${selectedElement?.id === sec.id ? 'selected' : ''}`} onClick={() => handleElementClick(sec)} style={sec.backgroundColor ? { backgroundColor: sec.backgroundColor } : undefined}>
                            <div className="promo-container">
                              <h2 className="promo-section-title" style={sec.titleColor ? { color: sec.titleColor } : undefined}>{sec.title || 'Portafolio'}</h2>
                              <p className="promo-section-subtitle" style={sec.subtitleColor ? { color: sec.subtitleColor } : undefined}>{sec.subtitle || ''}</p>
                              <div className="promo-portfolio-grid">
                                {(sec.items || []).map((item) => (
                                  <div key={item.id} className="promo-portfolio-item" style={sec.cardBgColor ? { backgroundColor: sec.cardBgColor } : undefined}>
                                    <div className="promo-portfolio-image">
                                      {item.imageUrl && <img src={item.imageUrl} alt={item.title} />}
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
                        ))}
                        {sectionTestimonialsList.map((sec) => (
                          <section key={sec.id} id="testimonios" className={`promo-section promo-testimonials ${selectedElement?.id === sec.id ? 'selected' : ''}`} onClick={() => handleElementClick(sec)} style={sec.backgroundColor ? { backgroundColor: sec.backgroundColor } : undefined}>
                            <div className="promo-container">
                              <h2 className="promo-section-title" style={sec.titleColor ? { color: sec.titleColor } : undefined}>{sec.title || 'Testimonios'}</h2>
                              <p className="promo-section-subtitle" style={sec.subtitleColor ? { color: sec.subtitleColor } : undefined}>{sec.subtitle || ''}</p>
                              <div className="promo-testimonials-grid">
                                {(sec.items || []).map((t) => (
                                  <blockquote key={t.id} className="promo-testimonial-card" style={sec.cardBgColor ? { backgroundColor: sec.cardBgColor } : undefined}>
                                    <div className="promo-testimonial-stars" style={sec.starColor ? { color: sec.starColor } : undefined}>
                                      {Array.from({ length: t.rating || 5 }).map((_, i) => (<span key={i} aria-hidden>★</span>))}
                                    </div>
                                    <p className="promo-testimonial-text">"{t.text}"</p>
                                    <footer className="promo-testimonial-footer">
                                      {t.avatarUrl && <img src={t.avatarUrl} alt="" className="promo-testimonial-avatar" />}
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
                        ))}
                        {sectionLocationList.map((sec) => (
                          <section key={sec.id} id="ubicacion" className={`promo-section promo-location ${selectedElement?.id === sec.id ? 'selected' : ''}`} onClick={() => handleElementClick(sec)} style={sec.backgroundColor ? { backgroundColor: sec.backgroundColor } : undefined}>
                            <div className="promo-container">
                              <h2 className="promo-section-title" style={sec.titleColor ? { color: sec.titleColor } : undefined}>{sec.title || 'Ubicación'}</h2>
                              <p className="promo-section-subtitle" style={sec.subtitleColor ? { color: sec.subtitleColor } : undefined}>{sec.subtitle || ''}</p>
                              <div className="promo-location-grid">
                                <div className="promo-location-info" style={sec.textColor ? { color: sec.textColor } : undefined}>
                                  <div className="promo-location-block">
                                    <h3>Dirección</h3>
                                    <p>{(sec.address || '').split('\n').map((line, i) => (<span key={i}>{line}<br /></span>))}</p>
                                  </div>
                                  <div className="promo-location-block">
                                    <h3>Horario</h3>
                                    <p>{(sec.hours || '').split('\n').map((line, i) => (<span key={i}>{line}<br /></span>))}</p>
                                  </div>
                                  <div className="promo-location-block">
                                    <h3>Teléfono</h3>
                                    <p><a href={`tel:${sec.phone || ''}`}>{sec.phone || ''}</a></p>
                                  </div>
                                </div>
                                <div className="promo-location-map">
                                  {sec.mapEmbedUrl && (
                                    <iframe title="Mapa" src={sec.mapEmbedUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </section>
                        ))}
                        {sectionContactList.map((sec) => (
                          <section key={sec.id} id="contacto" className={`promo-section promo-contact ${selectedElement?.id === sec.id ? 'selected' : ''}`} onClick={() => handleElementClick(sec)} style={sec.backgroundColor ? { backgroundColor: sec.backgroundColor } : undefined}>
                            <div className="promo-container">
                              <h2 className="promo-section-title" style={sec.titleColor ? { color: sec.titleColor } : undefined}>{sec.title || 'Contacto'}</h2>
                              <p className="promo-section-subtitle" style={sec.subtitleColor ? { color: sec.subtitleColor } : undefined}>{sec.subtitle || ''}</p>
                              <div className="promo-contact-grid" style={sec.textColor ? { color: sec.textColor } : undefined}>
                                <form className="promo-contact-form" onSubmit={(e) => e.preventDefault()}>
                                  <label>Nombre</label>
                                  <input type="text" placeholder="Tu nombre" readOnly style={{ cursor: 'default' }} />
                                  <label>Email</label>
                                  <input type="email" placeholder="tu@email.com" readOnly style={{ cursor: 'default' }} />
                                  <label>Mensaje</label>
                                  <textarea rows={5} placeholder="¿En qué podemos ayudarte?" readOnly style={{ cursor: 'default' }} />
                                  <button type="button" className="promo-btn promo-btn-primary promo-btn-block">Enviar mensaje</button>
                                </form>
                                <div className="promo-contact-details">
                                  <div className="promo-contact-item">
                                    <span className="promo-contact-label">Teléfono</span>
                                    <a href={`tel:${sec.phone || ''}`}>{sec.phone || ''}</a>
                                  </div>
                                  <div className="promo-contact-item">
                                    <span className="promo-contact-label">Email</span>
                                    <a href={`mailto:${sec.email || ''}`}>{sec.email || ''}</a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </section>
                        ))}
                      </>
                    )
                  })()}
                </div>
              </>
            )}
          </div>
          )}
        </main>

        <aside className="editor-right">
          <div className="quick-edit-header">Edición rápida</div>
          {selectedElement ? (
            <>
              <div className="quick-edit-tabs">
                <button type="button" className={rightTab === 'contenido' ? 'active' : ''} onClick={() => setRightTab('contenido')}>Textos</button>
                <button type="button" className={rightTab === 'estilo' ? 'active' : ''} onClick={() => setRightTab('estilo')}>Estilo</button>
              </div>
              <div className="quick-edit-content">
                {rightTab === 'contenido' && (
                  <div className="properties-content quick-edit-tab-content" data-section="textos">
                    <p className="quick-edit-section-label">Contenido y textos</p>
                    {selectedElement.type === 'text' && (
                      <div className="property-group"><label>Texto</label><textarea className="property-input" value={selectedElement.content} onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })} rows={3} placeholder="Escribe aquí..." /></div>
                    )}
                    {selectedElement.type === 'header' && (
                      <>
                        <div className="property-group"><label>Logo (texto o imagen)</label><input className="property-input" type="text" value={selectedElement.logo || ''} onChange={(e) => updateElement(selectedElement.id, { logo: e.target.value })} placeholder="Nombre del logo" /></div>
                        <div className="property-group"><label>Imagen del logo</label><ImageUploader onUpload={handleLogoImageUpload} /><input className="property-input" type="text" value={selectedElement.logoImage || ''} onChange={(e) => updateElement(selectedElement.id, { logoImage: e.target.value })} placeholder="O pega URL" style={{ marginTop: 6 }} /></div>
                        <div className="property-group"><label>Items del menú (separados por comas)</label><input className="property-input" type="text" value={(selectedElement.navItems || []).join(', ')} onChange={(e) => updateElement(selectedElement.id, { navItems: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} placeholder="Inicio, Servicios, Contacto" /></div>
                      </>
                    )}
                    {selectedElement.type === 'image' && (
                      <div className="property-group"><label>Cambiar imagen</label><ImageUploader onUpload={(file) => handleImageUpload(selectedElement.id, file)} /></div>
                    )}
                    {selectedElement.type === 'button' && (
                      <div className="property-group"><label>Texto del botón</label><input className="property-input" type="text" value={selectedElement.content} onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })} placeholder="Ej: Comenzar" /></div>
                    )}
                    {selectedElement.type === 'cardSection' && (
                      <>
                        <div className="property-group"><label>Título de la sección</label><input className="property-input" type="text" value={selectedElement.sectionTitle || ''} onChange={(e) => updateElement(selectedElement.id, { sectionTitle: e.target.value })} placeholder="Ej: Características" /></div>
                        {(selectedElement.cards || []).map((card, i) => (
                          <div key={card.id} className="card-edit-item">
                            <div className="card-edit-item-header"><span>Card {i + 1}</span></div>
                            <input className="property-input" value={card.icon || ''} onChange={(e) => updateCardInSection(selectedElement.id, card.id, { icon: e.target.value })} placeholder="Icono (emoji o URL)" />
                            <input className="property-input" value={card.title || ''} onChange={(e) => updateCardInSection(selectedElement.id, card.id, { title: e.target.value })} placeholder="Título" style={{ marginTop: 6 }} />
                            <textarea className="property-input" value={card.description || ''} onChange={(e) => updateCardInSection(selectedElement.id, card.id, { description: e.target.value })} placeholder="Descripción" rows={2} style={{ marginTop: 6 }} />
                          </div>
                        ))}
                      </>
                    )}
                    {selectedElement.type === 'sectionAbout' && (
                      <>
                        <div className="property-group"><label>Título</label><input className="property-input" value={selectedElement.title || ''} onChange={(e) => updateElement(selectedElement.id, { title: e.target.value })} placeholder="Sobre Nosotros" /></div>
                        <div className="property-group"><label>Subtítulo</label><input className="property-input" value={selectedElement.subtitle || ''} onChange={(e) => updateElement(selectedElement.id, { subtitle: e.target.value })} /></div>
                        <div className="property-group"><label>Párrafo destacado</label><textarea className="property-input" value={selectedElement.lead || ''} onChange={(e) => updateElement(selectedElement.id, { lead: e.target.value })} rows={2} /></div>
                        <div className="property-group"><label>Contenido</label><textarea className="property-input" value={selectedElement.content || ''} onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })} rows={3} /></div>
                        <div className="property-group"><label>Imagen</label><ImageUploader onUpload={(file) => { const r = new FileReader(); r.onload = (e) => updateElement(selectedElement.id, { imageUrl: e.target.result }); r.readAsDataURL(file); }} /><input className="property-input" value={selectedElement.imageUrl || ''} onChange={(e) => updateElement(selectedElement.id, { imageUrl: e.target.value })} placeholder="URL o subir arriba" style={{ marginTop: 6 }} /></div>
                        <div className="card-edit-item-header" style={{ marginTop: 10 }}>Valores</div>
                        {(selectedElement.values || []).map((v) => (
                          <div key={v.id} className="card-edit-item" style={{ marginTop: 6 }}>
                            <input className="property-input" value={v.label || ''} onChange={(e) => updateSectionItem(selectedElement.id, 'values', v.id, { label: e.target.value })} placeholder="Etiqueta" />
                            <input className="property-input" value={v.text || ''} onChange={(e) => updateSectionItem(selectedElement.id, 'values', v.id, { text: e.target.value })} placeholder="Texto" style={{ marginTop: 4 }} />
                          </div>
                        ))}
                      </>
                    )}
                    {selectedElement.type === 'sectionPortfolio' && (
                      <>
                        <div className="property-group"><label>Título</label><input className="property-input" value={selectedElement.title || ''} onChange={(e) => updateElement(selectedElement.id, { title: e.target.value })} /></div>
                        <div className="property-group"><label>Subtítulo</label><input className="property-input" value={selectedElement.subtitle || ''} onChange={(e) => updateElement(selectedElement.id, { subtitle: e.target.value })} /></div>
                        {(selectedElement.items || []).map((item, i) => (
                          <div key={item.id} className="card-edit-item" style={{ marginTop: 10 }}>
                            <div className="card-edit-item-header">Proyecto {i + 1}</div>
                            <input className="property-input" value={item.title || ''} onChange={(e) => updateSectionItem(selectedElement.id, 'items', item.id, { title: e.target.value })} placeholder="Título" />
                            <input className="property-input" value={item.description || ''} onChange={(e) => updateSectionItem(selectedElement.id, 'items', item.id, { description: e.target.value })} placeholder="Descripción" style={{ marginTop: 4 }} />
                            <div className="property-group"><label>Imagen</label><ImageUploader onUpload={(file) => { const r = new FileReader(); r.onload = (e) => updateSectionItem(selectedElement.id, 'items', item.id, { imageUrl: e.target.result }); r.readAsDataURL(file); }} /><input className="property-input" value={item.imageUrl || ''} onChange={(e) => updateSectionItem(selectedElement.id, 'items', item.id, { imageUrl: e.target.value })} placeholder="URL" style={{ marginTop: 4 }} /></div>
                          </div>
                        ))}
                      </>
                    )}
                    {selectedElement.type === 'sectionTestimonials' && (
                      <>
                        <div className="property-group"><label>Título</label><input className="property-input" value={selectedElement.title || ''} onChange={(e) => updateElement(selectedElement.id, { title: e.target.value })} /></div>
                        <div className="property-group"><label>Subtítulo</label><input className="property-input" value={selectedElement.subtitle || ''} onChange={(e) => updateElement(selectedElement.id, { subtitle: e.target.value })} /></div>
                        {(selectedElement.items || []).map((t, i) => (
                          <div key={t.id} className="card-edit-item" style={{ marginTop: 10 }}>
                            <div className="card-edit-item-header">Testimonio {i + 1}</div>
                            <input className="property-input" value={t.name || ''} onChange={(e) => updateSectionItem(selectedElement.id, 'items', t.id, { name: e.target.value })} placeholder="Nombre" />
                            <input className="property-input" value={t.role || ''} onChange={(e) => updateSectionItem(selectedElement.id, 'items', t.id, { role: e.target.value })} placeholder="Rol / Empresa" style={{ marginTop: 4 }} />
                            <textarea className="property-input" value={t.text || ''} onChange={(e) => updateSectionItem(selectedElement.id, 'items', t.id, { text: e.target.value })} placeholder="Comentario" rows={2} style={{ marginTop: 4 }} />
                            <div className="property-group"><label>Foto</label><ImageUploader onUpload={(file) => { const r = new FileReader(); r.onload = (e) => updateSectionItem(selectedElement.id, 'items', t.id, { avatarUrl: e.target.result }); r.readAsDataURL(file); }} /><input className="property-input" value={t.avatarUrl || ''} onChange={(e) => updateSectionItem(selectedElement.id, 'items', t.id, { avatarUrl: e.target.value })} placeholder="URL" style={{ marginTop: 4 }} /></div>
                          </div>
                        ))}
                      </>
                    )}
                    {selectedElement.type === 'sectionLocation' && (
                      <>
                        <div className="property-group"><label>Título</label><input className="property-input" value={selectedElement.title || ''} onChange={(e) => updateElement(selectedElement.id, { title: e.target.value })} /></div>
                        <div className="property-group"><label>Subtítulo</label><input className="property-input" value={selectedElement.subtitle || ''} onChange={(e) => updateElement(selectedElement.id, { subtitle: e.target.value })} /></div>
                        <div className="property-group"><label>Dirección</label><textarea className="property-input" value={selectedElement.address || ''} onChange={(e) => updateElement(selectedElement.id, { address: e.target.value })} rows={2} /></div>
                        <div className="property-group"><label>Horario</label><textarea className="property-input" value={selectedElement.hours || ''} onChange={(e) => updateElement(selectedElement.id, { hours: e.target.value })} rows={2} /></div>
                        <div className="property-group"><label>Teléfono</label><input className="property-input" value={selectedElement.phone || ''} onChange={(e) => updateElement(selectedElement.id, { phone: e.target.value })} /></div>
                        <div className="property-group"><label>URL iframe mapa (Google Maps embed)</label><input className="property-input" value={selectedElement.mapEmbedUrl || ''} onChange={(e) => updateElement(selectedElement.id, { mapEmbedUrl: e.target.value })} placeholder="https://..." /></div>
                      </>
                    )}
                    {selectedElement.type === 'sectionContact' && (
                      <>
                        <div className="property-group"><label>Título</label><input className="property-input" value={selectedElement.title || ''} onChange={(e) => updateElement(selectedElement.id, { title: e.target.value })} /></div>
                        <div className="property-group"><label>Subtítulo</label><input className="property-input" value={selectedElement.subtitle || ''} onChange={(e) => updateElement(selectedElement.id, { subtitle: e.target.value })} /></div>
                        <div className="property-group"><label>Teléfono</label><input className="property-input" value={selectedElement.phone || ''} onChange={(e) => updateElement(selectedElement.id, { phone: e.target.value })} /></div>
                        <div className="property-group"><label>Email</label><input className="property-input" type="email" value={selectedElement.email || ''} onChange={(e) => updateElement(selectedElement.id, { email: e.target.value })} /></div>
                      </>
                    )}
                  </div>
                )}
                {rightTab === 'estilo' && (
                  <div className="properties-content quick-edit-tab-content" data-section="estilo">
                    <p className="quick-edit-section-label">Colores y apariencia</p>
                    {selectedElement.type === 'text' && (
                      <>
                        <div className="property-row"><div className="property-group"><label>Tamaño</label><input className="property-input" type="number" value={selectedElement.fontSize} onChange={(e) => updateElement(selectedElement.id, { fontSize: parseInt(e.target.value) })} min="10" max="100" /></div><div className="property-group"><label>Peso</label><select className="property-input" value={selectedElement.fontWeight || 'normal'} onChange={(e) => updateElement(selectedElement.id, { fontWeight: e.target.value })}><option value="normal">Normal</option><option value="bold">Negrita</option></select></div></div>
                        <div className="property-group"><label>Fuente</label><select className="property-input" value={selectedElement.fontFamily} onChange={(e) => updateElement(selectedElement.id, { fontFamily: e.target.value })}><option value="Arial">Arial</option><option value="Georgia">Georgia</option><option value="Verdana">Verdana</option></select></div>
                        <div className="property-group"><label>Color</label><div className="color-input-wrapper"><input type="color" value={selectedElement.color} onChange={(e) => updateElement(selectedElement.id, { color: e.target.value })} className="color-picker" /><input type="text" className="color-hex-input" value={selectedElement.color} onChange={(e) => updateElement(selectedElement.id, { color: e.target.value })} /></div></div>
                      </>
                    )}
                    {selectedElement.type === 'header' && (
                      <div className="color-picker-group"><div className="color-picker-item"><label>Fondo</label><div className="color-input-wrapper"><input type="color" value={selectedElement.backgroundColor || '#0f172a'} onChange={(e) => updateElement(selectedElement.id, { backgroundColor: e.target.value })} className="color-picker" /><input type="text" className="color-hex-input" value={selectedElement.backgroundColor || '#0f172a'} onChange={(e) => updateElement(selectedElement.id, { backgroundColor: e.target.value })} /></div></div><div className="color-picker-item"><label>Texto menú</label><div className="color-input-wrapper"><input type="color" value={selectedElement.textColor || '#fff'} onChange={(e) => updateElement(selectedElement.id, { textColor: e.target.value })} className="color-picker" /></div></div></div>
                    )}
                    {selectedElement.type === 'image' && (
                      <div className="property-row"><div className="property-group"><label>Ancho</label><input className="property-input" type="number" value={selectedElement.width} onChange={(e) => updateElement(selectedElement.id, { width: parseInt(e.target.value) })} /></div><div className="property-group"><label>Alto</label><input className="property-input" type="number" value={selectedElement.height} onChange={(e) => updateElement(selectedElement.id, { height: parseInt(e.target.value) })} /></div></div>
                    )}
                    {selectedElement.type === 'button' && (
                      <><div className="property-group"><label>Color texto</label><input type="color" value={selectedElement.color || '#fff'} onChange={(e) => updateElement(selectedElement.id, { color: e.target.value })} className="color-picker" /></div><div className="property-group"><label>Fondo</label><input type="color" value={selectedElement.backgroundColor || '#3b82f6'} onChange={(e) => updateElement(selectedElement.id, { backgroundColor: e.target.value })} className="color-picker" /></div></>
                    )}
                    {selectedElement.type === 'cardSection' && (
                      <>
                        <div className="property-row"><div className="property-group"><label>Tamaño título sección</label><input className="property-input" type="number" value={selectedElement.sectionTitleFontSize || 42} onChange={(e) => updateElement(selectedElement.id, { sectionTitleFontSize: parseInt(e.target.value) || 42 })} /></div><div className="property-group"><label>Color título sección</label><input type="color" value={selectedElement.sectionTitleColor || '#fff'} onChange={(e) => updateElement(selectedElement.id, { sectionTitleColor: e.target.value })} className="color-picker" /></div></div>
                        <p className="quick-edit-subsection-label">Colores por card</p>
                        {(selectedElement.cards || []).map((card, i) => (
                          <div key={card.id} className="card-edit-item" style={{ marginTop: 8 }}>
                            <div className="card-edit-item-header">Card {i + 1}</div>
                            <div className="property-row">
                              <div className="property-group"><label>Color título</label><input type="color" value={card.titleColor || '#60a5fa'} onChange={(e) => updateCardInSection(selectedElement.id, card.id, { titleColor: e.target.value })} className="color-picker" /></div>
                              <div className="property-group"><label>Color texto</label><input type="color" value={card.descColor || '#cbd5e1'} onChange={(e) => updateCardInSection(selectedElement.id, card.id, { descColor: e.target.value })} className="color-picker" /></div>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                    {selectedElement.type === 'sectionAbout' && (
                      <div className="properties-content">
                        <div className="property-group"><label>Color título</label><div className="color-input-wrapper"><input type="color" value={selectedElement.titleColor || '#1e293b'} onChange={(e) => updateElement(selectedElement.id, { titleColor: e.target.value })} className="color-picker" /><input type="text" className="color-hex-input" value={selectedElement.titleColor || ''} onChange={(e) => updateElement(selectedElement.id, { titleColor: e.target.value })} placeholder="#" /></div></div>
                        <div className="property-group"><label>Color subtítulo</label><div className="color-input-wrapper"><input type="color" value={selectedElement.subtitleColor || '#64748b'} onChange={(e) => updateElement(selectedElement.id, { subtitleColor: e.target.value })} className="color-picker" /><input type="text" className="color-hex-input" value={selectedElement.subtitleColor || ''} onChange={(e) => updateElement(selectedElement.id, { subtitleColor: e.target.value })} /></div></div>
                        <div className="property-group"><label>Color texto</label><div className="color-input-wrapper"><input type="color" value={selectedElement.textColor || '#475569'} onChange={(e) => updateElement(selectedElement.id, { textColor: e.target.value })} className="color-picker" /><input type="text" className="color-hex-input" value={selectedElement.textColor || ''} onChange={(e) => updateElement(selectedElement.id, { textColor: e.target.value })} /></div></div>
                        <div className="property-group"><label>Color acento (valores)</label><div className="color-input-wrapper"><input type="color" value={selectedElement.accentColor || '#0d9488'} onChange={(e) => updateElement(selectedElement.id, { accentColor: e.target.value })} className="color-picker" /><input type="text" className="color-hex-input" value={selectedElement.accentColor || ''} onChange={(e) => updateElement(selectedElement.id, { accentColor: e.target.value })} /></div></div>
                        <div className="property-group"><label>Fondo sección</label><div className="color-input-wrapper"><input type="color" value={selectedElement.backgroundColor || '#ffffff'} onChange={(e) => updateElement(selectedElement.id, { backgroundColor: e.target.value })} className="color-picker" /><input type="text" className="color-hex-input" value={selectedElement.backgroundColor || ''} onChange={(e) => updateElement(selectedElement.id, { backgroundColor: e.target.value })} placeholder="#" /></div></div>
                      </div>
                    )}
                    {selectedElement.type === 'sectionPortfolio' && (
                      <div className="properties-content">
                        <div className="property-group"><label>Color título</label><div className="color-input-wrapper"><input type="color" value={selectedElement.titleColor || '#1e293b'} onChange={(e) => updateElement(selectedElement.id, { titleColor: e.target.value })} className="color-picker" /><input type="text" className="color-hex-input" value={selectedElement.titleColor || ''} onChange={(e) => updateElement(selectedElement.id, { titleColor: e.target.value })} /></div></div>
                        <div className="property-group"><label>Color subtítulo</label><div className="color-input-wrapper"><input type="color" value={selectedElement.subtitleColor || '#64748b'} onChange={(e) => updateElement(selectedElement.id, { subtitleColor: e.target.value })} className="color-picker" /><input type="text" className="color-hex-input" value={selectedElement.subtitleColor || ''} onChange={(e) => updateElement(selectedElement.id, { subtitleColor: e.target.value })} /></div></div>
                        <div className="property-group"><label>Fondo sección</label><div className="color-input-wrapper"><input type="color" value={selectedElement.backgroundColor || '#f1f5f9'} onChange={(e) => updateElement(selectedElement.id, { backgroundColor: e.target.value })} className="color-picker" /><input type="text" className="color-hex-input" value={selectedElement.backgroundColor || ''} onChange={(e) => updateElement(selectedElement.id, { backgroundColor: e.target.value })} /></div></div>
                        <div className="property-group"><label>Fondo tarjetas</label><div className="color-input-wrapper"><input type="color" value={selectedElement.cardBgColor || '#ffffff'} onChange={(e) => updateElement(selectedElement.id, { cardBgColor: e.target.value })} className="color-picker" /><input type="text" className="color-hex-input" value={selectedElement.cardBgColor || ''} onChange={(e) => updateElement(selectedElement.id, { cardBgColor: e.target.value })} /></div></div>
                      </div>
                    )}
                    {selectedElement.type === 'sectionTestimonials' && (
                      <div className="properties-content">
                        <div className="property-group"><label>Color título</label><div className="color-input-wrapper"><input type="color" value={selectedElement.titleColor || '#1e293b'} onChange={(e) => updateElement(selectedElement.id, { titleColor: e.target.value })} className="color-picker" /><input type="text" className="color-hex-input" value={selectedElement.titleColor || ''} onChange={(e) => updateElement(selectedElement.id, { titleColor: e.target.value })} /></div></div>
                        <div className="property-group"><label>Color subtítulo</label><div className="color-input-wrapper"><input type="color" value={selectedElement.subtitleColor || '#64748b'} onChange={(e) => updateElement(selectedElement.id, { subtitleColor: e.target.value })} className="color-picker" /><input type="text" className="color-hex-input" value={selectedElement.subtitleColor || ''} onChange={(e) => updateElement(selectedElement.id, { subtitleColor: e.target.value })} /></div></div>
                        <div className="property-group"><label>Color estrellas</label><div className="color-input-wrapper"><input type="color" value={selectedElement.starColor || '#f59e0b'} onChange={(e) => updateElement(selectedElement.id, { starColor: e.target.value })} className="color-picker" /><input type="text" className="color-hex-input" value={selectedElement.starColor || ''} onChange={(e) => updateElement(selectedElement.id, { starColor: e.target.value })} /></div></div>
                        <div className="property-group"><label>Fondo sección</label><div className="color-input-wrapper"><input type="color" value={selectedElement.backgroundColor || '#f1f5f9'} onChange={(e) => updateElement(selectedElement.id, { backgroundColor: e.target.value })} className="color-picker" /><input type="text" className="color-hex-input" value={selectedElement.backgroundColor || ''} onChange={(e) => updateElement(selectedElement.id, { backgroundColor: e.target.value })} /></div></div>
                        <div className="property-group"><label>Fondo tarjetas</label><div className="color-input-wrapper"><input type="color" value={selectedElement.cardBgColor || '#ffffff'} onChange={(e) => updateElement(selectedElement.id, { cardBgColor: e.target.value })} className="color-picker" /><input type="text" className="color-hex-input" value={selectedElement.cardBgColor || ''} onChange={(e) => updateElement(selectedElement.id, { cardBgColor: e.target.value })} /></div></div>
                      </div>
                    )}
                    {selectedElement.type === 'sectionLocation' && (
                      <div className="properties-content">
                        <div className="property-group"><label>Color título</label><div className="color-input-wrapper"><input type="color" value={selectedElement.titleColor || '#0d9488'} onChange={(e) => updateElement(selectedElement.id, { titleColor: e.target.value })} className="color-picker" /><input type="text" className="color-hex-input" value={selectedElement.titleColor || ''} onChange={(e) => updateElement(selectedElement.id, { titleColor: e.target.value })} /></div></div>
                        <div className="property-group"><label>Color subtítulo</label><div className="color-input-wrapper"><input type="color" value={selectedElement.subtitleColor || '#64748b'} onChange={(e) => updateElement(selectedElement.id, { subtitleColor: e.target.value })} className="color-picker" /><input type="text" className="color-hex-input" value={selectedElement.subtitleColor || ''} onChange={(e) => updateElement(selectedElement.id, { subtitleColor: e.target.value })} /></div></div>
                        <div className="property-group"><label>Color texto</label><div className="color-input-wrapper"><input type="color" value={selectedElement.textColor || '#475569'} onChange={(e) => updateElement(selectedElement.id, { textColor: e.target.value })} className="color-picker" /><input type="text" className="color-hex-input" value={selectedElement.textColor || ''} onChange={(e) => updateElement(selectedElement.id, { textColor: e.target.value })} /></div></div>
                        <div className="property-group"><label>Fondo sección</label><div className="color-input-wrapper"><input type="color" value={selectedElement.backgroundColor || '#ffffff'} onChange={(e) => updateElement(selectedElement.id, { backgroundColor: e.target.value })} className="color-picker" /><input type="text" className="color-hex-input" value={selectedElement.backgroundColor || ''} onChange={(e) => updateElement(selectedElement.id, { backgroundColor: e.target.value })} /></div></div>
                      </div>
                    )}
                    {selectedElement.type === 'sectionContact' && (
                      <div className="properties-content">
                        <div className="property-group"><label>Color título</label><div className="color-input-wrapper"><input type="color" value={selectedElement.titleColor || '#1e293b'} onChange={(e) => updateElement(selectedElement.id, { titleColor: e.target.value })} className="color-picker" /><input type="text" className="color-hex-input" value={selectedElement.titleColor || ''} onChange={(e) => updateElement(selectedElement.id, { titleColor: e.target.value })} /></div></div>
                        <div className="property-group"><label>Color subtítulo</label><div className="color-input-wrapper"><input type="color" value={selectedElement.subtitleColor || '#64748b'} onChange={(e) => updateElement(selectedElement.id, { subtitleColor: e.target.value })} className="color-picker" /><input type="text" className="color-hex-input" value={selectedElement.subtitleColor || ''} onChange={(e) => updateElement(selectedElement.id, { subtitleColor: e.target.value })} /></div></div>
                        <div className="property-group"><label>Color texto</label><div className="color-input-wrapper"><input type="color" value={selectedElement.textColor || '#1e293b'} onChange={(e) => updateElement(selectedElement.id, { textColor: e.target.value })} className="color-picker" /><input type="text" className="color-hex-input" value={selectedElement.textColor || ''} onChange={(e) => updateElement(selectedElement.id, { textColor: e.target.value })} /></div></div>
                        <div className="property-group"><label>Fondo sección</label><div className="color-input-wrapper"><input type="color" value={selectedElement.backgroundColor || '#f1f5f9'} onChange={(e) => updateElement(selectedElement.id, { backgroundColor: e.target.value })} className="color-picker" /><input type="text" className="color-hex-input" value={selectedElement.backgroundColor || ''} onChange={(e) => updateElement(selectedElement.id, { backgroundColor: e.target.value })} /></div></div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : isPromoPage ? (
            <div className="quick-edit-content">
              <p style={{ fontWeight: 600, marginBottom: 10, fontSize: '0.95rem' }}>Editar plantilla promocional</p>
              <div className="property-group">
                <label>Sección</label>
                <select
                  className="property-input"
                  value={selectedPromoSection}
                  onChange={(e) => setSelectedPromoSection(e.target.value)}
                >
                  <option value="menu">Menú</option>
                  <option value="hero">Hero</option>
                  <option value="about">Sobre nosotros</option>
                  <option value="services">Servicios</option>
                  <option value="portfolio">Portafolio</option>
                  <option value="testimonials">Testimonios</option>
                  <option value="location">Ubicación</option>
                  <option value="contact">Contacto</option>
                  <option value="footer">Pie de página</option>
                </select>
              </div>
              <div className="quick-edit-tabs">
                <button type="button" className={rightTabPromo === 'contenido' ? 'active' : ''} onClick={() => setRightTabPromo('contenido')}>Textos</button>
                <button type="button" className={rightTabPromo === 'estilo' ? 'active' : ''} onClick={() => setRightTabPromo('estilo')}>Estilo</button>
              </div>
              {rightTabPromo === 'contenido' && (
                <div className="properties-content quick-edit-tab-content" data-section="textos">
                  <p className="quick-edit-section-label">Contenido y textos</p>
                  {selectedPromoSection === 'menu' && (
                    <>
                      <div className="property-group"><label>Nombre / Logo (cabecera)</label><input className="property-input" value={promoContent?.logoName || ''} onChange={(e) => setPromoContent({ ...promoContent, logoName: e.target.value })} /></div>
                      <div className="property-group"><label>Items del menú (una línea por ítem: "Texto" o "Texto,#ancla" o "Texto,#ancla,cta")</label><textarea className="property-input" value={(promoContent?.navItems || []).map((it) => it.cta ? `${it.label},${it.href || '#'},cta` : `${it.label},${it.href || '#'}`).join('\n')} onChange={(e) => { const lines = e.target.value.split('\n').filter(Boolean); setPromoContent({ ...promoContent, navItems: lines.map((line) => { const parts = line.split(',').map((s) => s.trim()); const isCta = parts[parts.length - 1] === 'cta'; const href = isCta ? (parts[parts.length - 2] || '#') : (parts.length >= 2 ? parts[parts.length - 1] : '#'); const label = isCta ? parts.slice(0, -2).join(',').trim() || parts[0] : (parts.length >= 2 ? parts.slice(0, -1).join(',').trim() : parts[0]); return { label: label || 'Item', href: href || '#', ...(isCta && { cta: true }) }; }) }); }} rows={6} placeholder="Nosotros,#sobre-nosotros" /></div>
                    </>
                  )}
                  {selectedPromoSection === 'colors' && promoContent?.colors && (
                    <p className="quick-edit-subsection-label">Colores (tema) solo se editan en la pestaña Estilo.</p>
                  )}
                  {selectedPromoSection === 'hero' && promoContent?.hero && (
                    <>
                      <div className="property-group"><label>Nombre / Logo</label><input className="property-input" value={promoContent.logoName || ''} onChange={(e) => setPromoContent({ ...promoContent, logoName: e.target.value })} /></div>
                      <div className="property-group"><label>Título (inicio)</label><input className="property-input" value={promoContent.hero.title || ''} onChange={(e) => setPromoContent({ ...promoContent, hero: { ...promoContent.hero, title: e.target.value } })} /></div>
                      <div className="property-group"><label>Palabra destacada</label><input className="property-input" value={promoContent.hero.highlightWord || ''} onChange={(e) => setPromoContent({ ...promoContent, hero: { ...promoContent.hero, highlightWord: e.target.value } })} /></div>
                      <div className="property-group"><label>Título (final)</label><input className="property-input" value={promoContent.hero.titleEnd || ''} onChange={(e) => setPromoContent({ ...promoContent, hero: { ...promoContent.hero, titleEnd: e.target.value } })} /></div>
                      <div className="property-group"><label>Descripción</label><textarea className="property-input" value={promoContent.hero.description || ''} onChange={(e) => setPromoContent({ ...promoContent, hero: { ...promoContent.hero, description: e.target.value } })} rows={3} /></div>
                      <div className="property-group"><label>Botón principal</label><input className="property-input" value={promoContent.hero.ctaText || ''} onChange={(e) => setPromoContent({ ...promoContent, hero: { ...promoContent.hero, ctaText: e.target.value } })} /></div>
                      <div className="property-group"><label>Botón secundario</label><input className="property-input" value={promoContent.hero.ctaSecondaryText || ''} onChange={(e) => setPromoContent({ ...promoContent, hero: { ...promoContent.hero, ctaSecondaryText: e.target.value } })} /></div>
                      <div className="property-group"><label>Imagen hero</label><ImageUploader onUpload={(file) => { const r = new FileReader(); r.onload = (e) => setPromoContent({ ...promoContent, hero: { ...promoContent.hero, imageUrl: e.target.result } }); r.readAsDataURL(file); }} /><input className="property-input" value={promoContent.hero.imageUrl || ''} onChange={(e) => setPromoContent({ ...promoContent, hero: { ...promoContent.hero, imageUrl: e.target.value } })} placeholder="URL o subir arriba" style={{ marginTop: 6 }} /></div>
                    </>
                  )}
                  {selectedPromoSection === 'about' && promoContent?.about && (
                    <>
                      <div className="property-group"><label>Título</label><input className="property-input" value={promoContent.about.title || ''} onChange={(e) => setPromoContent({ ...promoContent, about: { ...promoContent.about, title: e.target.value } })} /></div>
                      <div className="property-group"><label>Subtítulo</label><input className="property-input" value={promoContent.about.subtitle || ''} onChange={(e) => setPromoContent({ ...promoContent, about: { ...promoContent.about, subtitle: e.target.value } })} /></div>
                      <div className="property-group"><label>Párrafo destacado</label><textarea className="property-input" value={promoContent.about.lead || ''} onChange={(e) => setPromoContent({ ...promoContent, about: { ...promoContent.about, lead: e.target.value } })} rows={2} /></div>
                      <div className="property-group"><label>Contenido</label><textarea className="property-input" value={promoContent.about.content || ''} onChange={(e) => setPromoContent({ ...promoContent, about: { ...promoContent.about, content: e.target.value } })} rows={3} /></div>
                      <div className="property-group"><label>Imagen</label><ImageUploader onUpload={(file) => { const r = new FileReader(); r.onload = (e) => setPromoContent({ ...promoContent, about: { ...promoContent.about, imageUrl: e.target.result } }); r.readAsDataURL(file); }} /><input className="property-input" value={promoContent.about.imageUrl || ''} onChange={(e) => setPromoContent({ ...promoContent, about: { ...promoContent.about, imageUrl: e.target.value } })} placeholder="URL o subir" style={{ marginTop: 6 }} /></div>
                    </>
                  )}
                  {selectedPromoSection === 'services' && promoContent?.services && (
                    <>
                      <p className="quick-edit-subsection-label">Servicios (hasta 3)</p>
                      {(promoContent.services || []).slice(0, 3).map((s, i) => (
                        <div key={i} className="card-edit-item" style={{ marginBottom: 10 }}>
                          <div className="card-edit-item-header">Servicio {i + 1}</div>
                          <input className="property-input" value={s.icon || ''} onChange={(e) => { const n = [...(promoContent.services || [])]; n[i] = { ...n[i], icon: e.target.value }; setPromoContent({ ...promoContent, services: n }); }} placeholder="Emoji" />
                          <input className="property-input" value={s.title || ''} onChange={(e) => { const n = [...(promoContent.services || [])]; n[i] = { ...n[i], title: e.target.value }; setPromoContent({ ...promoContent, services: n }); }} placeholder="Título" style={{ marginTop: 4 }} />
                          <textarea className="property-input" value={s.description || ''} onChange={(e) => { const n = [...(promoContent.services || [])]; n[i] = { ...n[i], description: e.target.value }; setPromoContent({ ...promoContent, services: n }); }} placeholder="Descripción" rows={2} style={{ marginTop: 4 }} />
                        </div>
                      ))}
                    </>
                  )}
                  {selectedPromoSection === 'portfolio' && promoContent?.portfolio && (
                    <>
                      {(promoContent.portfolio || []).map((item, i) => (
                        <div key={i} className="card-edit-item" style={{ marginBottom: 10 }}>
                          <div className="card-edit-item-header">Proyecto {i + 1}</div>
                          <input className="property-input" value={item.title || ''} onChange={(e) => { const n = [...(promoContent.portfolio || [])]; n[i] = { ...n[i], title: e.target.value }; setPromoContent({ ...promoContent, portfolio: n }); }} placeholder="Título" />
                          <input className="property-input" value={item.description || ''} onChange={(e) => { const n = [...(promoContent.portfolio || [])]; n[i] = { ...n[i], description: e.target.value }; setPromoContent({ ...promoContent, portfolio: n }); }} placeholder="Descripción" style={{ marginTop: 4 }} />
                          <div className="property-group"><label>Imagen</label><ImageUploader onUpload={(file) => { const r = new FileReader(); r.onload = (e) => { const n = [...(promoContent.portfolio || [])]; n[i] = { ...n[i], image: e.target.result, imageUrl: e.target.result }; setPromoContent({ ...promoContent, portfolio: n }); }; r.readAsDataURL(file); }} /><input className="property-input" value={item.image || item.imageUrl || ''} onChange={(e) => { const n = [...(promoContent.portfolio || [])]; n[i] = { ...n[i], image: e.target.value, imageUrl: e.target.value }; setPromoContent({ ...promoContent, portfolio: n }); }} placeholder="URL" style={{ marginTop: 4 }} /></div>
                        </div>
                      ))}
                    </>
                  )}
                  {selectedPromoSection === 'testimonials' && promoContent?.testimonials && (
                    <>
                      {(promoContent.testimonials || []).map((t, i) => (
                        <div key={i} className="card-edit-item" style={{ marginBottom: 10 }}>
                          <div className="card-edit-item-header">Testimonio {i + 1}</div>
                          <input className="property-input" value={t.name || ''} onChange={(e) => { const n = [...(promoContent.testimonials || [])]; n[i] = { ...n[i], name: e.target.value }; setPromoContent({ ...promoContent, testimonials: n }); }} placeholder="Nombre" />
                          <input className="property-input" value={t.role || ''} onChange={(e) => { const n = [...(promoContent.testimonials || [])]; n[i] = { ...n[i], role: e.target.value }; setPromoContent({ ...promoContent, testimonials: n }); }} placeholder="Rol" style={{ marginTop: 4 }} />
                          <textarea className="property-input" value={t.text || ''} onChange={(e) => { const n = [...(promoContent.testimonials || [])]; n[i] = { ...n[i], text: e.target.value }; setPromoContent({ ...promoContent, testimonials: n }); }} placeholder="Comentario" rows={2} style={{ marginTop: 4 }} />
                          <div className="property-group"><label>Foto</label><ImageUploader onUpload={(file) => { const r = new FileReader(); r.onload = (e) => { const n = [...(promoContent.testimonials || [])]; n[i] = { ...n[i], avatar: e.target.result, avatarUrl: e.target.result }; setPromoContent({ ...promoContent, testimonials: n }); }; r.readAsDataURL(file); }} /><input className="property-input" value={t.avatar || t.avatarUrl || ''} onChange={(e) => { const n = [...(promoContent.testimonials || [])]; n[i] = { ...n[i], avatar: e.target.value, avatarUrl: e.target.value }; setPromoContent({ ...promoContent, testimonials: n }); }} placeholder="URL" style={{ marginTop: 4 }} /></div>
                        </div>
                      ))}
                    </>
                  )}
                  {selectedPromoSection === 'location' && promoContent?.location && (
                    <>
                      <div className="property-group"><label>Dirección</label><textarea className="property-input" value={promoContent.location.address || ''} onChange={(e) => setPromoContent({ ...promoContent, location: { ...promoContent.location, address: e.target.value } })} rows={2} /></div>
                      <div className="property-group"><label>Horario</label><textarea className="property-input" value={promoContent.location.hours || ''} onChange={(e) => setPromoContent({ ...promoContent, location: { ...promoContent.location, hours: e.target.value } })} rows={2} /></div>
                      <div className="property-group"><label>Teléfono</label><input className="property-input" value={promoContent.location.phone || ''} onChange={(e) => setPromoContent({ ...promoContent, location: { ...promoContent.location, phone: e.target.value } })} /></div>
                      <div className="property-group"><label>URL iframe mapa</label><input className="property-input" value={promoContent.location.mapEmbedUrl || ''} onChange={(e) => setPromoContent({ ...promoContent, location: { ...promoContent.location, mapEmbedUrl: e.target.value } })} placeholder="https://..." /></div>
                    </>
                  )}
                  {selectedPromoSection === 'contact' && promoContent?.contact && (
                    <>
                      <div className="property-group"><label>Teléfono</label><input className="property-input" value={promoContent.contact.phone || ''} onChange={(e) => setPromoContent({ ...promoContent, contact: { ...promoContent.contact, phone: e.target.value } })} /></div>
                      <div className="property-group"><label>Email</label><input className="property-input" type="email" value={promoContent.contact.email || ''} onChange={(e) => setPromoContent({ ...promoContent, contact: { ...promoContent.contact, email: e.target.value } })} /></div>
                    </>
                  )}
                  {selectedPromoSection === 'footer' && (
                    <>
                      <div className="property-group"><label>Texto del pie (opcional)</label><input className="property-input" value={promoContent?.footer?.text ?? ''} onChange={(e) => setPromoContent({ ...promoContent, footer: { ...promoContent?.footer, text: e.target.value || undefined } })} placeholder="© 2025 MiNegocio. Todos los derechos reservados." /></div>
                      <p className="quick-edit-subsection-label">Si está vacío, se usará el nombre del logo y el año actual.</p>
                    </>
                  )}
                </div>
              )}
              {rightTabPromo === 'estilo' && (
                <div className="properties-content quick-edit-tab-content" data-section="estilo">
                  <p className="quick-edit-section-label">Colores y apariencia</p>
                  {selectedPromoSection === 'menu' && (
                    <>
                      <div className="property-group"><label>Fondo</label><div className="color-input-wrapper"><input type="color" value={(promoContent && promoContent.menuColors && promoContent.menuColors.bg) || '#ffffff'} onChange={(e) => setPromoContent({ ...promoContent, menuColors: { ...promoContent?.menuColors, bg: e.target.value } })} className="color-picker" /><input type="text" className="color-hex-input" value={(promoContent && promoContent.menuColors && promoContent.menuColors.bg) || ''} onChange={(e) => setPromoContent({ ...promoContent, menuColors: { ...promoContent?.menuColors, bg: e.target.value } })} /></div></div>
                      <div className="property-group"><label>Texto enlaces</label><div className="color-input-wrapper"><input type="color" value={(promoContent && promoContent.menuColors && promoContent.menuColors.text) || '#1e293b'} onChange={(e) => setPromoContent({ ...promoContent, menuColors: { ...promoContent?.menuColors, text: e.target.value } })} className="color-picker" /><input type="text" className="color-hex-input" value={(promoContent && promoContent.menuColors && promoContent.menuColors.text) || ''} onChange={(e) => setPromoContent({ ...promoContent, menuColors: { ...promoContent?.menuColors, text: e.target.value } })} /></div></div>
                      <div className="property-group"><label>Logo</label><div className="color-input-wrapper"><input type="color" value={(promoContent && promoContent.menuColors && promoContent.menuColors.logoColor) || '#0d9488'} onChange={(e) => setPromoContent({ ...promoContent, menuColors: { ...promoContent?.menuColors, logoColor: e.target.value } })} className="color-picker" /><input type="text" className="color-hex-input" value={(promoContent && promoContent.menuColors && promoContent.menuColors.logoColor) || ''} onChange={(e) => setPromoContent({ ...promoContent, menuColors: { ...promoContent?.menuColors, logoColor: e.target.value } })} /></div></div>
                      <div className="property-group"><label>Botón CTA fondo</label><div className="color-input-wrapper"><input type="color" value={(promoContent && promoContent.menuColors && promoContent.menuColors.ctaBg) || '#0d9488'} onChange={(e) => setPromoContent({ ...promoContent, menuColors: { ...promoContent?.menuColors, ctaBg: e.target.value } })} className="color-picker" /><input type="text" className="color-hex-input" value={(promoContent && promoContent.menuColors && promoContent.menuColors.ctaBg) || ''} onChange={(e) => setPromoContent({ ...promoContent, menuColors: { ...promoContent?.menuColors, ctaBg: e.target.value } })} /></div></div>
                      <div className="property-group"><label>Botón CTA texto</label><div className="color-input-wrapper"><input type="color" value={(promoContent && promoContent.menuColors && promoContent.menuColors.ctaText) || '#ffffff'} onChange={(e) => setPromoContent({ ...promoContent, menuColors: { ...promoContent?.menuColors, ctaText: e.target.value } })} className="color-picker" /><input type="text" className="color-hex-input" value={(promoContent && promoContent.menuColors && promoContent.menuColors.ctaText) || ''} onChange={(e) => setPromoContent({ ...promoContent, menuColors: { ...promoContent?.menuColors, ctaText: e.target.value } })} /></div></div>
                      <div className="property-group"><label>Borde inferior</label><div className="color-input-wrapper"><input type="color" value={(promoContent && promoContent.menuColors && promoContent.menuColors.border) || '#e2e8f0'} onChange={(e) => setPromoContent({ ...promoContent, menuColors: { ...promoContent?.menuColors, border: e.target.value } })} className="color-picker" /><input type="text" className="color-hex-input" value={(promoContent && promoContent.menuColors && promoContent.menuColors.border) || ''} onChange={(e) => setPromoContent({ ...promoContent, menuColors: { ...promoContent?.menuColors, border: e.target.value } })} /></div></div>
                    </>
                  )}
                  {selectedPromoSection === 'colors' && promoContent?.colors && (
                    <>
                      <p className="quick-edit-subsection-label">Colores globales de la plantilla</p>
                      <div className="property-group"><label>Color principal</label><div className="color-input-wrapper"><input type="color" value={promoContent.colors.primary || '#0d9488'} onChange={(e) => setPromoContent({ ...promoContent, colors: { ...promoContent.colors, primary: e.target.value } })} className="color-picker" /><input type="text" className="color-hex-input" value={promoContent.colors.primary || ''} onChange={(e) => setPromoContent({ ...promoContent, colors: { ...promoContent.colors, primary: e.target.value } })} /></div></div>
                      <div className="property-group"><label>Color principal (hover)</label><div className="color-input-wrapper"><input type="color" value={promoContent.colors.primaryDark || '#0f766e'} onChange={(e) => setPromoContent({ ...promoContent, colors: { ...promoContent.colors, primaryDark: e.target.value } })} className="color-picker" /><input type="text" className="color-hex-input" value={promoContent.colors.primaryDark || ''} onChange={(e) => setPromoContent({ ...promoContent, colors: { ...promoContent.colors, primaryDark: e.target.value } })} /></div></div>
                      <div className="property-group"><label>Fondo página</label><div className="color-input-wrapper"><input type="color" value={promoContent.colors.bg || '#f8fafc'} onChange={(e) => setPromoContent({ ...promoContent, colors: { ...promoContent.colors, bg: e.target.value } })} className="color-picker" /><input type="text" className="color-hex-input" value={promoContent.colors.bg || ''} onChange={(e) => setPromoContent({ ...promoContent, colors: { ...promoContent.colors, bg: e.target.value } })} /></div></div>
                      <div className="property-group"><label>Fondo alternativo</label><div className="color-input-wrapper"><input type="color" value={promoContent.colors.bgAlt || '#f1f5f9'} onChange={(e) => setPromoContent({ ...promoContent, colors: { ...promoContent.colors, bgAlt: e.target.value } })} className="color-picker" /><input type="text" className="color-hex-input" value={promoContent.colors.bgAlt || ''} onChange={(e) => setPromoContent({ ...promoContent, colors: { ...promoContent.colors, bgAlt: e.target.value } })} /></div></div>
                      <div className="property-group"><label>Fondo tarjetas</label><div className="color-input-wrapper"><input type="color" value={promoContent.colors.card || '#ffffff'} onChange={(e) => setPromoContent({ ...promoContent, colors: { ...promoContent.colors, card: e.target.value } })} className="color-picker" /><input type="text" className="color-hex-input" value={promoContent.colors.card || ''} onChange={(e) => setPromoContent({ ...promoContent, colors: { ...promoContent.colors, card: e.target.value } })} /></div></div>
                      <div className="property-group"><label>Texto principal</label><div className="color-input-wrapper"><input type="color" value={promoContent.colors.text || '#1e293b'} onChange={(e) => setPromoContent({ ...promoContent, colors: { ...promoContent.colors, text: e.target.value } })} className="color-picker" /><input type="text" className="color-hex-input" value={promoContent.colors.text || ''} onChange={(e) => setPromoContent({ ...promoContent, colors: { ...promoContent.colors, text: e.target.value } })} /></div></div>
                      <div className="property-group"><label>Texto secundario</label><div className="color-input-wrapper"><input type="color" value={promoContent.colors.textMuted || '#64748b'} onChange={(e) => setPromoContent({ ...promoContent, colors: { ...promoContent.colors, textMuted: e.target.value } })} className="color-picker" /><input type="text" className="color-hex-input" value={promoContent.colors.textMuted || ''} onChange={(e) => setPromoContent({ ...promoContent, colors: { ...promoContent.colors, textMuted: e.target.value } })} /></div></div>
                      <div className="property-group"><label>Bordes</label><div className="color-input-wrapper"><input type="color" value={promoContent.colors.border || '#e2e8f0'} onChange={(e) => setPromoContent({ ...promoContent, colors: { ...promoContent.colors, border: e.target.value } })} className="color-picker" /><input type="text" className="color-hex-input" value={promoContent.colors.border || ''} onChange={(e) => setPromoContent({ ...promoContent, colors: { ...promoContent.colors, border: e.target.value } })} /></div></div>
                    </>
                  )}
                  {selectedPromoSection === 'hero' && promoContent?.hero && (
                    <>
                      <div className="property-group"><label>Fondo</label><div className="color-input-wrapper"><input type="color" value={(promoContent.hero.colors && promoContent.hero.colors.bg) || '#f0fdfa'} onChange={(e) => setPromoContent({ ...promoContent, hero: { ...promoContent.hero, colors: { ...promoContent.hero.colors, bg: e.target.value } }})} className="color-picker" /><input type="text" className="color-hex-input" value={(promoContent.hero.colors && promoContent.hero.colors.bg) || ''} onChange={(e) => setPromoContent({ ...promoContent, hero: { ...promoContent.hero, colors: { ...promoContent.hero.colors, bg: e.target.value } }})} /></div></div>
                      <div className="property-group"><label>Título</label><div className="color-input-wrapper"><input type="color" value={(promoContent.hero.colors && promoContent.hero.colors.titleColor) || '#1e293b'} onChange={(e) => setPromoContent({ ...promoContent, hero: { ...promoContent.hero, colors: { ...promoContent.hero.colors, titleColor: e.target.value } }})} className="color-picker" /><input type="text" className="color-hex-input" value={(promoContent.hero.colors && promoContent.hero.colors.titleColor) || ''} onChange={(e) => setPromoContent({ ...promoContent, hero: { ...promoContent.hero, colors: { ...promoContent.hero.colors, titleColor: e.target.value } }})} /></div></div>
                      <div className="property-group"><label>Palabra destacada</label><div className="color-input-wrapper"><input type="color" value={(promoContent.hero.colors && promoContent.hero.colors.highlightColor) || '#0d9488'} onChange={(e) => setPromoContent({ ...promoContent, hero: { ...promoContent.hero, colors: { ...promoContent.hero.colors, highlightColor: e.target.value } }})} className="color-picker" /><input type="text" className="color-hex-input" value={(promoContent.hero.colors && promoContent.hero.colors.highlightColor) || ''} onChange={(e) => setPromoContent({ ...promoContent, hero: { ...promoContent.hero, colors: { ...promoContent.hero.colors, highlightColor: e.target.value } }})} /></div></div>
                      <div className="property-group"><label>Descripción</label><div className="color-input-wrapper"><input type="color" value={(promoContent.hero.colors && promoContent.hero.colors.descColor) || '#64748b'} onChange={(e) => setPromoContent({ ...promoContent, hero: { ...promoContent.hero, colors: { ...promoContent.hero.colors, descColor: e.target.value } }})} className="color-picker" /><input type="text" className="color-hex-input" value={(promoContent.hero.colors && promoContent.hero.colors.descColor) || ''} onChange={(e) => setPromoContent({ ...promoContent, hero: { ...promoContent.hero, colors: { ...promoContent.hero.colors, descColor: e.target.value } }})} /></div></div>
                      <div className="property-group"><label>Botón principal fondo</label><div className="color-input-wrapper"><input type="color" value={(promoContent.hero.colors && promoContent.hero.colors.ctaBg) || '#0d9488'} onChange={(e) => setPromoContent({ ...promoContent, hero: { ...promoContent.hero, colors: { ...promoContent.hero.colors, ctaBg: e.target.value } }})} className="color-picker" /><input type="text" className="color-hex-input" value={(promoContent.hero.colors && promoContent.hero.colors.ctaBg) || ''} onChange={(e) => setPromoContent({ ...promoContent, hero: { ...promoContent.hero, colors: { ...promoContent.hero.colors, ctaBg: e.target.value } }})} /></div></div>
                      <div className="property-group"><label>Botón principal texto</label><div className="color-input-wrapper"><input type="color" value={(promoContent.hero.colors && promoContent.hero.colors.ctaText) || '#ffffff'} onChange={(e) => setPromoContent({ ...promoContent, hero: { ...promoContent.hero, colors: { ...promoContent.hero.colors, ctaText: e.target.value } }})} className="color-picker" /><input type="text" className="color-hex-input" value={(promoContent.hero.colors && promoContent.hero.colors.ctaText) || ''} onChange={(e) => setPromoContent({ ...promoContent, hero: { ...promoContent.hero, colors: { ...promoContent.hero.colors, ctaText: e.target.value } }})} /></div></div>
                      <div className="property-group"><label>Botón secundario fondo</label><div className="color-input-wrapper"><input type="color" value={(promoContent.hero.colors && promoContent.hero.colors.cta2Bg) || '#ffffff'} onChange={(e) => setPromoContent({ ...promoContent, hero: { ...promoContent.hero, colors: { ...promoContent.hero.colors, cta2Bg: e.target.value } }})} className="color-picker" /><input type="text" className="color-hex-input" value={(promoContent.hero.colors && promoContent.hero.colors.cta2Bg) || ''} onChange={(e) => setPromoContent({ ...promoContent, hero: { ...promoContent.hero, colors: { ...promoContent.hero.colors, cta2Bg: e.target.value } }})} /></div></div>
                      <div className="property-group"><label>Botón secundario texto</label><div className="color-input-wrapper"><input type="color" value={(promoContent.hero.colors && promoContent.hero.colors.cta2Text) || '#0d9488'} onChange={(e) => setPromoContent({ ...promoContent, hero: { ...promoContent.hero, colors: { ...promoContent.hero.colors, cta2Text: e.target.value } }})} className="color-picker" /><input type="text" className="color-hex-input" value={(promoContent.hero.colors && promoContent.hero.colors.cta2Text) || ''} onChange={(e) => setPromoContent({ ...promoContent, hero: { ...promoContent.hero, colors: { ...promoContent.hero.colors, cta2Text: e.target.value } }})} /></div></div>
                    </>
                  )}
                  {selectedPromoSection === 'about' && promoContent?.about && (
                    <>
                      <div className="property-group"><label>Fondo</label><div className="color-input-wrapper"><input type="color" value={(promoContent.about.colors && promoContent.about.colors.bg) || '#ffffff'} onChange={(e) => setPromoContent({ ...promoContent, about: { ...promoContent.about, colors: { ...promoContent.about.colors, bg: e.target.value } }})} className="color-picker" /><input type="text" className="color-hex-input" value={(promoContent.about.colors && promoContent.about.colors.bg) || ''} onChange={(e) => setPromoContent({ ...promoContent, about: { ...promoContent.about, colors: { ...promoContent.about.colors, bg: e.target.value } }})} /></div></div>
                      <div className="property-group"><label>Título</label><div className="color-input-wrapper"><input type="color" value={(promoContent.about.colors && promoContent.about.colors.titleColor) || '#1e293b'} onChange={(e) => setPromoContent({ ...promoContent, about: { ...promoContent.about, colors: { ...promoContent.about.colors, titleColor: e.target.value } }})} className="color-picker" /><input type="text" className="color-hex-input" value={(promoContent.about.colors && promoContent.about.colors.titleColor) || ''} onChange={(e) => setPromoContent({ ...promoContent, about: { ...promoContent.about, colors: { ...promoContent.about.colors, titleColor: e.target.value } }})} /></div></div>
                      <div className="property-group"><label>Subtítulo</label><div className="color-input-wrapper"><input type="color" value={(promoContent.about.colors && promoContent.about.colors.subtitleColor) || '#64748b'} onChange={(e) => setPromoContent({ ...promoContent, about: { ...promoContent.about, colors: { ...promoContent.about.colors, subtitleColor: e.target.value } }})} className="color-picker" /><input type="text" className="color-hex-input" value={(promoContent.about.colors && promoContent.about.colors.subtitleColor) || ''} onChange={(e) => setPromoContent({ ...promoContent, about: { ...promoContent.about, colors: { ...promoContent.about.colors, subtitleColor: e.target.value } }})} /></div></div>
                      <div className="property-group"><label>Texto</label><div className="color-input-wrapper"><input type="color" value={(promoContent.about.colors && promoContent.about.colors.textColor) || '#64748b'} onChange={(e) => setPromoContent({ ...promoContent, about: { ...promoContent.about, colors: { ...promoContent.about.colors, textColor: e.target.value } }})} className="color-picker" /><input type="text" className="color-hex-input" value={(promoContent.about.colors && promoContent.about.colors.textColor) || ''} onChange={(e) => setPromoContent({ ...promoContent, about: { ...promoContent.about, colors: { ...promoContent.about.colors, textColor: e.target.value } }})} /></div></div>
                      <div className="property-group"><label>Acento (valores)</label><div className="color-input-wrapper"><input type="color" value={(promoContent.about.colors && promoContent.about.colors.accentColor) || '#0d9488'} onChange={(e) => setPromoContent({ ...promoContent, about: { ...promoContent.about, colors: { ...promoContent.about.colors, accentColor: e.target.value } }})} className="color-picker" /><input type="text" className="color-hex-input" value={(promoContent.about.colors && promoContent.about.colors.accentColor) || ''} onChange={(e) => setPromoContent({ ...promoContent, about: { ...promoContent.about, colors: { ...promoContent.about.colors, accentColor: e.target.value } }})} /></div></div>
                    </>
                  )}
                  {selectedPromoSection === 'services' && promoContent?.services && (
                    <>
                      <p className="quick-edit-subsection-label">Colores por sección</p>
                      <div className="property-group"><label>Fondo sección</label><div className="color-input-wrapper"><input type="color" value={(promoContent.servicesColors && promoContent.servicesColors.bg) || '#f1f5f9'} onChange={(e) => setPromoContent({ ...promoContent, servicesColors: { ...promoContent?.servicesColors, bg: e.target.value } })} className="color-picker" /><input type="text" className="color-hex-input" value={(promoContent.servicesColors && promoContent.servicesColors.bg) || ''} onChange={(e) => setPromoContent({ ...promoContent, servicesColors: { ...promoContent?.servicesColors, bg: e.target.value } })} /></div></div>
                      <div className="property-group"><label>Título</label><div className="color-input-wrapper"><input type="color" value={(promoContent.servicesColors && promoContent.servicesColors.titleColor) || '#1e293b'} onChange={(e) => setPromoContent({ ...promoContent, servicesColors: { ...promoContent?.servicesColors, titleColor: e.target.value } })} className="color-picker" /><input type="text" className="color-hex-input" value={(promoContent.servicesColors && promoContent.servicesColors.titleColor) || ''} onChange={(e) => setPromoContent({ ...promoContent, servicesColors: { ...promoContent?.servicesColors, titleColor: e.target.value } })} /></div></div>
                      <div className="property-group"><label>Subtítulo</label><div className="color-input-wrapper"><input type="color" value={(promoContent.servicesColors && promoContent.servicesColors.subtitleColor) || '#64748b'} onChange={(e) => setPromoContent({ ...promoContent, servicesColors: { ...promoContent?.servicesColors, subtitleColor: e.target.value } })} className="color-picker" /><input type="text" className="color-hex-input" value={(promoContent.servicesColors && promoContent.servicesColors.subtitleColor) || ''} onChange={(e) => setPromoContent({ ...promoContent, servicesColors: { ...promoContent?.servicesColors, subtitleColor: e.target.value } })} /></div></div>
                      <p className="quick-edit-subsection-label">Colores por card</p>
                      <div className="property-group"><label>Fondo tarjetas</label><div className="color-input-wrapper"><input type="color" value={(promoContent.servicesColors && promoContent.servicesColors.cardBg) || '#ffffff'} onChange={(e) => setPromoContent({ ...promoContent, servicesColors: { ...promoContent?.servicesColors, cardBg: e.target.value } })} className="color-picker" /><input type="text" className="color-hex-input" value={(promoContent.servicesColors && promoContent.servicesColors.cardBg) || ''} onChange={(e) => setPromoContent({ ...promoContent, servicesColors: { ...promoContent?.servicesColors, cardBg: e.target.value } })} /></div></div>
                      <div className="property-group"><label>Título tarjeta</label><div className="color-input-wrapper"><input type="color" value={(promoContent.servicesColors && promoContent.servicesColors.cardTitleColor) || '#1e293b'} onChange={(e) => setPromoContent({ ...promoContent, servicesColors: { ...promoContent?.servicesColors, cardTitleColor: e.target.value } })} className="color-picker" /><input type="text" className="color-hex-input" value={(promoContent.servicesColors && promoContent.servicesColors.cardTitleColor) || ''} onChange={(e) => setPromoContent({ ...promoContent, servicesColors: { ...promoContent?.servicesColors, cardTitleColor: e.target.value } })} /></div></div>
                      <div className="property-group"><label>Texto tarjeta</label><div className="color-input-wrapper"><input type="color" value={(promoContent.servicesColors && promoContent.servicesColors.cardTextColor) || '#64748b'} onChange={(e) => setPromoContent({ ...promoContent, servicesColors: { ...promoContent?.servicesColors, cardTextColor: e.target.value } })} className="color-picker" /><input type="text" className="color-hex-input" value={(promoContent.servicesColors && promoContent.servicesColors.cardTextColor) || ''} onChange={(e) => setPromoContent({ ...promoContent, servicesColors: { ...promoContent?.servicesColors, cardTextColor: e.target.value } })} /></div></div>
                    </>
                  )}
                  {selectedPromoSection === 'portfolio' && promoContent?.portfolio && (
                    <>
                      <div className="property-group"><label>Fondo</label><div className="color-input-wrapper"><input type="color" value={(promoContent.portfolioColors && promoContent.portfolioColors.bg) || '#ffffff'} onChange={(e) => setPromoContent({ ...promoContent, portfolioColors: { ...promoContent?.portfolioColors, bg: e.target.value } })} className="color-picker" /><input type="text" className="color-hex-input" value={(promoContent.portfolioColors && promoContent.portfolioColors.bg) || ''} onChange={(e) => setPromoContent({ ...promoContent, portfolioColors: { ...promoContent?.portfolioColors, bg: e.target.value } })} /></div></div>
                      <div className="property-group"><label>Título</label><div className="color-input-wrapper"><input type="color" value={(promoContent.portfolioColors && promoContent.portfolioColors.titleColor) || '#1e293b'} onChange={(e) => setPromoContent({ ...promoContent, portfolioColors: { ...promoContent?.portfolioColors, titleColor: e.target.value } })} className="color-picker" /><input type="text" className="color-hex-input" value={(promoContent.portfolioColors && promoContent.portfolioColors.titleColor) || ''} onChange={(e) => setPromoContent({ ...promoContent, portfolioColors: { ...promoContent?.portfolioColors, titleColor: e.target.value } })} /></div></div>
                      <div className="property-group"><label>Subtítulo</label><div className="color-input-wrapper"><input type="color" value={(promoContent.portfolioColors && promoContent.portfolioColors.subtitleColor) || '#64748b'} onChange={(e) => setPromoContent({ ...promoContent, portfolioColors: { ...promoContent?.portfolioColors, subtitleColor: e.target.value } })} className="color-picker" /><input type="text" className="color-hex-input" value={(promoContent.portfolioColors && promoContent.portfolioColors.subtitleColor) || ''} onChange={(e) => setPromoContent({ ...promoContent, portfolioColors: { ...promoContent?.portfolioColors, subtitleColor: e.target.value } })} /></div></div>
                      <div className="property-group"><label>Texto caption</label><div className="color-input-wrapper"><input type="color" value={(promoContent.portfolioColors && promoContent.portfolioColors.captionColor) || '#64748b'} onChange={(e) => setPromoContent({ ...promoContent, portfolioColors: { ...promoContent?.portfolioColors, captionColor: e.target.value } })} className="color-picker" /><input type="text" className="color-hex-input" value={(promoContent.portfolioColors && promoContent.portfolioColors.captionColor) || ''} onChange={(e) => setPromoContent({ ...promoContent, portfolioColors: { ...promoContent?.portfolioColors, captionColor: e.target.value } })} /></div></div>
                    </>
                  )}
                  {selectedPromoSection === 'testimonials' && promoContent?.testimonials && (
                    <>
                      <div className="property-group"><label>Fondo</label><div className="color-input-wrapper"><input type="color" value={(promoContent.testimonialsColors && promoContent.testimonialsColors.bg) || '#f1f5f9'} onChange={(e) => setPromoContent({ ...promoContent, testimonialsColors: { ...promoContent?.testimonialsColors, bg: e.target.value } })} className="color-picker" /><input type="text" className="color-hex-input" value={(promoContent.testimonialsColors && promoContent.testimonialsColors.bg) || ''} onChange={(e) => setPromoContent({ ...promoContent, testimonialsColors: { ...promoContent?.testimonialsColors, bg: e.target.value } })} /></div></div>
                      <div className="property-group"><label>Título</label><div className="color-input-wrapper"><input type="color" value={(promoContent.testimonialsColors && promoContent.testimonialsColors.titleColor) || '#1e293b'} onChange={(e) => setPromoContent({ ...promoContent, testimonialsColors: { ...promoContent?.testimonialsColors, titleColor: e.target.value } })} className="color-picker" /><input type="text" className="color-hex-input" value={(promoContent.testimonialsColors && promoContent.testimonialsColors.titleColor) || ''} onChange={(e) => setPromoContent({ ...promoContent, testimonialsColors: { ...promoContent?.testimonialsColors, titleColor: e.target.value } })} /></div></div>
                      <div className="property-group"><label>Cita</label><div className="color-input-wrapper"><input type="color" value={(promoContent.testimonialsColors && promoContent.testimonialsColors.quoteColor) || '#64748b'} onChange={(e) => setPromoContent({ ...promoContent, testimonialsColors: { ...promoContent?.testimonialsColors, quoteColor: e.target.value } })} className="color-picker" /><input type="text" className="color-hex-input" value={(promoContent.testimonialsColors && promoContent.testimonialsColors.quoteColor) || ''} onChange={(e) => setPromoContent({ ...promoContent, testimonialsColors: { ...promoContent?.testimonialsColors, quoteColor: e.target.value } })} /></div></div>
                      <div className="property-group"><label>Autor</label><div className="color-input-wrapper"><input type="color" value={(promoContent.testimonialsColors && promoContent.testimonialsColors.authorColor) || '#1e293b'} onChange={(e) => setPromoContent({ ...promoContent, testimonialsColors: { ...promoContent?.testimonialsColors, authorColor: e.target.value } })} className="color-picker" /><input type="text" className="color-hex-input" value={(promoContent.testimonialsColors && promoContent.testimonialsColors.authorColor) || ''} onChange={(e) => setPromoContent({ ...promoContent, testimonialsColors: { ...promoContent?.testimonialsColors, authorColor: e.target.value } })} /></div></div>
                      <div className="property-group"><label>Estrellas</label><div className="color-input-wrapper"><input type="color" value={(promoContent.testimonialsColors && promoContent.testimonialsColors.starsColor) || '#f59e0b'} onChange={(e) => setPromoContent({ ...promoContent, testimonialsColors: { ...promoContent?.testimonialsColors, starsColor: e.target.value } })} className="color-picker" /><input type="text" className="color-hex-input" value={(promoContent.testimonialsColors && promoContent.testimonialsColors.starsColor) || ''} onChange={(e) => setPromoContent({ ...promoContent, testimonialsColors: { ...promoContent?.testimonialsColors, starsColor: e.target.value } })} /></div></div>
                    </>
                  )}
                  {selectedPromoSection === 'location' && promoContent?.location && (
                    <>
                      <div className="property-group"><label>Fondo</label><div className="color-input-wrapper"><input type="color" value={(promoContent.location.colors && promoContent.location.colors.bg) || '#ffffff'} onChange={(e) => setPromoContent({ ...promoContent, location: { ...promoContent.location, colors: { ...promoContent.location.colors, bg: e.target.value } }})} className="color-picker" /><input type="text" className="color-hex-input" value={(promoContent.location.colors && promoContent.location.colors.bg) || ''} onChange={(e) => setPromoContent({ ...promoContent, location: { ...promoContent.location, colors: { ...promoContent.location.colors, bg: e.target.value } }})} /></div></div>
                      <div className="property-group"><label>Título</label><div className="color-input-wrapper"><input type="color" value={(promoContent.location.colors && promoContent.location.colors.titleColor) || '#1e293b'} onChange={(e) => setPromoContent({ ...promoContent, location: { ...promoContent.location, colors: { ...promoContent.location.colors, titleColor: e.target.value } }})} className="color-picker" /><input type="text" className="color-hex-input" value={(promoContent.location.colors && promoContent.location.colors.titleColor) || ''} onChange={(e) => setPromoContent({ ...promoContent, location: { ...promoContent.location, colors: { ...promoContent.location.colors, titleColor: e.target.value } }})} /></div></div>
                      <div className="property-group"><label>Texto</label><div className="color-input-wrapper"><input type="color" value={(promoContent.location.colors && promoContent.location.colors.textColor) || '#64748b'} onChange={(e) => setPromoContent({ ...promoContent, location: { ...promoContent.location, colors: { ...promoContent.location.colors, textColor: e.target.value } }})} className="color-picker" /><input type="text" className="color-hex-input" value={(promoContent.location.colors && promoContent.location.colors.textColor) || ''} onChange={(e) => setPromoContent({ ...promoContent, location: { ...promoContent.location, colors: { ...promoContent.location.colors, textColor: e.target.value } }})} /></div></div>
                    </>
                  )}
                  {selectedPromoSection === 'contact' && promoContent?.contact && (
                    <>
                      <div className="property-group"><label>Fondo</label><div className="color-input-wrapper"><input type="color" value={(promoContent.contact.colors && promoContent.contact.colors.bg) || '#f1f5f9'} onChange={(e) => setPromoContent({ ...promoContent, contact: { ...promoContent.contact, colors: { ...promoContent.contact.colors, bg: e.target.value } }})} className="color-picker" /><input type="text" className="color-hex-input" value={(promoContent.contact.colors && promoContent.contact.colors.bg) || ''} onChange={(e) => setPromoContent({ ...promoContent, contact: { ...promoContent.contact, colors: { ...promoContent.contact.colors, bg: e.target.value } }})} /></div></div>
                      <div className="property-group"><label>Título</label><div className="color-input-wrapper"><input type="color" value={(promoContent.contact.colors && promoContent.contact.colors.titleColor) || '#1e293b'} onChange={(e) => setPromoContent({ ...promoContent, contact: { ...promoContent.contact, colors: { ...promoContent.contact.colors, titleColor: e.target.value } }})} className="color-picker" /><input type="text" className="color-hex-input" value={(promoContent.contact.colors && promoContent.contact.colors.titleColor) || ''} onChange={(e) => setPromoContent({ ...promoContent, contact: { ...promoContent.contact, colors: { ...promoContent.contact.colors, titleColor: e.target.value } }})} /></div></div>
                      <div className="property-group"><label>Subtítulo</label><div className="color-input-wrapper"><input type="color" value={(promoContent.contact.colors && promoContent.contact.colors.subtitleColor) || '#64748b'} onChange={(e) => setPromoContent({ ...promoContent, contact: { ...promoContent.contact, colors: { ...promoContent.contact.colors, subtitleColor: e.target.value } }})} className="color-picker" /><input type="text" className="color-hex-input" value={(promoContent.contact.colors && promoContent.contact.colors.subtitleColor) || ''} onChange={(e) => setPromoContent({ ...promoContent, contact: { ...promoContent.contact, colors: { ...promoContent.contact.colors, subtitleColor: e.target.value } }})} /></div></div>
                      <div className="property-group"><label>Etiquetas</label><div className="color-input-wrapper"><input type="color" value={(promoContent.contact.colors && promoContent.contact.colors.labelColor) || '#1e293b'} onChange={(e) => setPromoContent({ ...promoContent, contact: { ...promoContent.contact, colors: { ...promoContent.contact.colors, labelColor: e.target.value } }})} className="color-picker" /><input type="text" className="color-hex-input" value={(promoContent.contact.colors && promoContent.contact.colors.labelColor) || ''} onChange={(e) => setPromoContent({ ...promoContent, contact: { ...promoContent.contact, colors: { ...promoContent.contact.colors, labelColor: e.target.value } }})} /></div></div>
                      <div className="property-group"><label>Fondo inputs</label><div className="color-input-wrapper"><input type="color" value={(promoContent.contact.colors && promoContent.contact.colors.inputBg) || '#ffffff'} onChange={(e) => setPromoContent({ ...promoContent, contact: { ...promoContent.contact, colors: { ...promoContent.contact.colors, inputBg: e.target.value } }})} className="color-picker" /><input type="text" className="color-hex-input" value={(promoContent.contact.colors && promoContent.contact.colors.inputBg) || ''} onChange={(e) => setPromoContent({ ...promoContent, contact: { ...promoContent.contact, colors: { ...promoContent.contact.colors, inputBg: e.target.value } }})} /></div></div>
                      <div className="property-group"><label>Texto inputs</label><div className="color-input-wrapper"><input type="color" value={(promoContent.contact.colors && promoContent.contact.colors.inputText) || '#1e293b'} onChange={(e) => setPromoContent({ ...promoContent, contact: { ...promoContent.contact, colors: { ...promoContent.contact.colors, inputText: e.target.value } }})} className="color-picker" /><input type="text" className="color-hex-input" value={(promoContent.contact.colors && promoContent.contact.colors.inputText) || ''} onChange={(e) => setPromoContent({ ...promoContent, contact: { ...promoContent.contact, colors: { ...promoContent.contact.colors, inputText: e.target.value } }})} /></div></div>
                      <div className="property-group"><label>Botón fondo</label><div className="color-input-wrapper"><input type="color" value={(promoContent.contact.colors && promoContent.contact.colors.buttonBg) || '#0d9488'} onChange={(e) => setPromoContent({ ...promoContent, contact: { ...promoContent.contact, colors: { ...promoContent.contact.colors, buttonBg: e.target.value } }})} className="color-picker" /><input type="text" className="color-hex-input" value={(promoContent.contact.colors && promoContent.contact.colors.buttonBg) || ''} onChange={(e) => setPromoContent({ ...promoContent, contact: { ...promoContent.contact, colors: { ...promoContent.contact.colors, buttonBg: e.target.value } }})} /></div></div>
                      <div className="property-group"><label>Botón texto</label><div className="color-input-wrapper"><input type="color" value={(promoContent.contact.colors && promoContent.contact.colors.buttonText) || '#ffffff'} onChange={(e) => setPromoContent({ ...promoContent, contact: { ...promoContent.contact, colors: { ...promoContent.contact.colors, buttonText: e.target.value } }})} className="color-picker" /><input type="text" className="color-hex-input" value={(promoContent.contact.colors && promoContent.contact.colors.buttonText) || ''} onChange={(e) => setPromoContent({ ...promoContent, contact: { ...promoContent.contact, colors: { ...promoContent.contact.colors, buttonText: e.target.value } }})} /></div></div>
                    </>
                  )}
                  {selectedPromoSection === 'footer' && (
                    <>
                      <div className="property-group"><label>Fondo</label><div className="color-input-wrapper"><input type="color" value={(promoContent && promoContent.footer && promoContent.footer.colors && promoContent.footer.colors.bg) || '#1e293b'} onChange={(e) => setPromoContent({ ...promoContent, footer: { ...promoContent?.footer, colors: { ...promoContent?.footer?.colors, bg: e.target.value } }})} className="color-picker" /><input type="text" className="color-hex-input" value={(promoContent && promoContent.footer && promoContent.footer.colors && promoContent.footer.colors.bg) || ''} onChange={(e) => setPromoContent({ ...promoContent, footer: { ...promoContent?.footer, colors: { ...promoContent?.footer?.colors, bg: e.target.value } }})} /></div></div>
                      <div className="property-group"><label>Texto</label><div className="color-input-wrapper"><input type="color" value={(promoContent && promoContent.footer && promoContent.footer.colors && promoContent.footer.colors.textColor) || '#cbd5e1'} onChange={(e) => setPromoContent({ ...promoContent, footer: { ...promoContent?.footer, colors: { ...promoContent?.footer?.colors, textColor: e.target.value } }})} className="color-picker" /><input type="text" className="color-hex-input" value={(promoContent && promoContent.footer && promoContent.footer.colors && promoContent.footer.colors.textColor) || ''} onChange={(e) => setPromoContent({ ...promoContent, footer: { ...promoContent?.footer, colors: { ...promoContent?.footer?.colors, textColor: e.target.value } }})} /></div></div>
                    </>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="quick-edit-empty">
              <p>Selecciona un elemento en la página para editarlo.</p>
            </div>
          )}
        </aside>
      </div>
      )}
    </div>
  )
}


function ImageUploader({ onUpload }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles[0]) {
        onUpload(acceptedFiles[0])
      }
    },
    multiple: false
  })

  return (
    <div {...getRootProps()} className="image-uploader">
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Suelta la imagen aquí...</p>
      ) : (
        <p>Arrastra una imagen o haz clic</p>
      )}
    </div>
  )
}

function TemplateGallery({ templates, onSelect, onClose }) {
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [previewTemplate, setPreviewTemplate] = useState(null)
  
  const categories = ['Todos', ...new Set(templates.map(t => t.category))]
  const filteredTemplates = selectedCategory === 'Todos' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory)

  return (
    <>
      {previewTemplate && (
        <TemplatePreview
          template={previewTemplate}
          onUse={() => {
            onSelect(previewTemplate)
            setPreviewTemplate(null)
          }}
          onClose={() => setPreviewTemplate(null)}
        />
      )}
      <div className="template-gallery-overlay" onClick={onClose}>
        <div className="template-gallery" onClick={(e) => e.stopPropagation()}>
          <div className="gallery-header">
            <h2>Templates Gratis</h2>
            <button onClick={onClose} className="close-gallery-btn">✕</button>
          </div>
          
          <div className="gallery-filters">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="gallery-grid">
            {filteredTemplates.map(template => (
              <div key={template.id} className="template-card">
                <div className="template-thumbnail">
                  <img src={template.thumbnail} alt={template.name} />
                  <div className="template-overlay">
                    <button 
                      onClick={() => setPreviewTemplate(template)}
                      className="preview-template-btn"
                    >
                      👁️ Vista Previa
                    </button>
                    <button 
                      onClick={() => onSelect(template)}
                      className="use-template-btn"
                    >
                      Usar Template
                    </button>
                  </div>
                </div>
                <div className="template-info">
                  <h3>{template.name}</h3>
                  <p>{template.description}</p>
                  <span className="template-category">{template.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

function TemplatePreview({ template, onUse, onClose }) {
  const elements = template.elements || []
  const isPromo = template.templateType === 'promo'

  if (isPromo) {
    return (
      <div className="template-preview-overlay" onClick={onClose}>
        <div className="template-preview-container template-preview-promo" onClick={(e) => e.stopPropagation()}>
          <div className="preview-header">
            <div>
              <h2>{template.name}</h2>
              <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
                {template.description}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button onClick={onUse} className="use-template-btn">Usar template</button>
              <button onClick={onClose} className="close-preview-btn">✕</button>
            </div>
          </div>
          <div className="preview-content preview-content-promo">
            <PromoPage themeId={template.theme} embedInEditor content={template.promoContent || DEFAULT_PROMO_CONTENT} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="template-preview-overlay" onClick={onClose}>
      <div className="template-preview-container" onClick={(e) => e.stopPropagation()}>
        <div className="preview-header">
          <div>
            <h2>{template.name}</h2>
            <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
              {template.description} • {elements.length} elementos
            </p>
          </div>
          <button onClick={onClose} className="close-preview-btn">✕</button>
        </div>
        
        <div className="preview-content">
          <div className="landing-page editor-preview" style={{ width: '100%', minHeight: '100vh' }}>
            {(() => {
              const header = elements.find(el => el.type === 'header')
              const heroTexts = elements.filter(el => el.type === 'text' && el.y < 500)
              const heroImage = elements.find(el => el.type === 'image' && el.y < 500)
              const heroButtons = elements.filter(el => el.type === 'button' && el.y < 500)
              const sectionTitle = elements.find(el => el.type === 'text' && el.fontSize >= 36 && el.y > 500 && el.y < 700)
              const featureTexts = elements.filter(el => el.type === 'text' && el.y >= 600 && el.y < 900)
              const ctaTexts = elements.filter(el => el.type === 'text' && el.y >= 800)
              const ctaButton = elements.find(el => el.type === 'button' && el.y >= 800)

              return (
                <>
                  {header && (
                    <nav
                      className="navbar"
                  style={{
                        backgroundColor: header.backgroundColor || 'rgba(15, 23, 42, 0.95)',
                        borderBottom: '1px solid rgba(59, 130, 246, 0.2)'
                      }}
                    >
                      <div className="nav-container">
                        {header.logoImage ? (
                          <img
                            src={header.logoImage}
                            alt={header.logo || 'Logo'}
                            className="logo logo-img"
                            style={{ height: `${header.logoSize || 28}px`, objectFit: 'contain' }}
                          />
                        ) : (
                          <h1 
                            className="logo"
                            style={{
                              background: header.logoColor ? `linear-gradient(135deg, ${header.logoColor} 0%, ${header.logoColor} 100%)` : 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              backgroundClip: 'text',
                              fontSize: `${header.logoSize || 28}px`
                            }}
                          >
                            {header.logo || 'zudosu'}
                          </h1>
                        )}
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                          {(header.navItems || ['Inicio', 'Servicios', 'Acerca', 'Contacto']).map((item, idx) => (
                            <a
                        key={idx}
                              href={`#${item.toLowerCase()}`}
                              className="btn-primary"
                        style={{
                                fontSize: `${header.navSize || 14}px`,
                                color: header.textColor || '#60a5fa',
                                textDecoration: 'none',
                                fontWeight: 600,
                                transition: 'color 0.3s ease',
                                padding: '0.5rem 1rem',
                                background: 'transparent',
                                border: `1px solid ${header.textColor || '#60a5fa'}`,
                                borderRadius: '8px'
                        }}
                      >
                        {item}
                            </a>
                    ))}
                </div>
                      </div>
                    </nav>
                  )}

                  <section className="hero">
                    <div className="hero-background-image"></div>
                    <div className="hero-content">
                      <div className="hero-text">
                        {heroTexts.map((text, idx) => (
                          text.fontSize >= 40 ? (
                            <h1 
                              key={text.id}
                              className="hero-title"
                  style={{
                                fontSize: `${text.fontSize}px`,
                                color: text.color || '#ffffff',
                                fontFamily: text.fontFamily || 'Arial',
                                fontWeight: text.fontWeight || 'bold'
                              }}
                            >
                              {text.content.split(' ').map((word, i) => {
                                if (word.toLowerCase().includes('página') || word.toLowerCase().includes('web') || word.toLowerCase().includes('aplicación')) {
                                  return <span key={i} className="highlight" style={{ color: text.color?.includes('60a5fa') || text.color?.includes('3b82f6') ? text.color : '#60a5fa' }}>{word} </span>
                                }
                                return word + ' '
                              })}
                            </h1>
                          ) : (
                            <p 
                              key={text.id}
                              className="hero-subtitle"
                      style={{
                                fontSize: `${text.fontSize}px`,
                                color: text.color || '#cbd5e1',
                                fontFamily: text.fontFamily || 'Arial',
                                maxWidth: text.maxWidth ? `${text.maxWidth}px` : '700px'
                              }}
                            >
                              {text.content}
                            </p>
                          )
                        ))}
                        <div className="hero-buttons">
                          {heroButtons.map(btn => (
                    <button
                              key={btn.id}
                              className="btn-cta"
                      style={{
                                fontSize: `${btn.fontSize}px`,
                                color: btn.color || '#ffffff',
                                backgroundColor: btn.backgroundColor || '#3b82f6',
                                borderRadius: `${btn.borderRadius || 12}px`,
                                padding: btn.padding || '1.125rem 2.75rem',
                                fontFamily: btn.fontFamily || 'Arial',
                                fontWeight: btn.fontWeight || 'bold',
                                boxShadow: btn.boxShadow || '0 4px 20px rgba(59, 130, 246, 0.4)'
                              }}
                            >
                              {btn.content}
                    </button>
                          ))}
                        </div>
                      </div>
                      {heroImage && (
                        <div className="hero-image-container">
                          <img 
                            src={heroImage.src}
                            alt="Hero" 
                            className="hero-image"
                          />
                        </div>
                      )}
                    </div>
                  </section>

                  {sectionTitle && (
                    <section id="features" className="features">
                      <div className="container">
                        <h2 
                          className="section-title"
                      style={{
                            fontSize: `${sectionTitle.fontSize}px`,
                            color: sectionTitle.color || '#ffffff',
                            fontFamily: sectionTitle.fontFamily || 'Arial',
                            fontWeight: sectionTitle.fontWeight || 'bold'
                          }}
                        >
                          {sectionTitle.content}
                        </h2>
                        <div className="features-grid">
                          {featureTexts.filter(t => t.fontSize >= 20 && t.fontSize < 30).map((title, idx) => {
                            const desc = featureTexts.find(t => t.y > title.y && t.y < title.y + 100 && t.fontSize < 20)
                            return (
                              <div 
                                key={title.id}
                                className="feature-card"
                              >
                                <div className="feature-icon">{title.content.split(' ')[0]}</div>
                                <h3 style={{ color: title.color || '#ffffff' }}>{title.content.replace(/^[🎨🖼️⚡🆓📱🚀]+\s*/, '')}</h3>
                                {desc && <p style={{ color: desc.color || '#cbd5e1' }}>{desc.content}</p>}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </section>
                  )}

                  {ctaTexts.length > 0 && (
                    <section className="cta-section">
                      <div className="container">
                        {ctaTexts.filter(t => t.fontSize >= 30).map(text => (
                          <h2 
                            key={text.id}
                            style={{
                              fontSize: `${text.fontSize}px`,
                              color: text.color || '#ffffff',
                              fontFamily: text.fontFamily || 'Arial',
                              fontWeight: text.fontWeight || 'bold'
                            }}
                          >
                            {text.content}
                          </h2>
                        ))}
                        {ctaTexts.filter(t => t.fontSize < 30 && t.fontSize >= 16).map(text => (
                          <p 
                            key={text.id}
                            style={{
                              fontSize: `${text.fontSize}px`,
                              color: text.color || '#cbd5e1',
                              fontFamily: text.fontFamily || 'Arial',
                              maxWidth: text.maxWidth ? `${text.maxWidth}px` : '600px'
                            }}
                          >
                            {text.content}
                          </p>
                        ))}
                        {ctaButton && (
                          <button
                            className="btn-cta-large"
                            style={{
                              fontSize: `${ctaButton.fontSize}px`,
                              color: ctaButton.color || '#ffffff',
                              backgroundColor: ctaButton.backgroundColor || '#3b82f6',
                              borderRadius: `${ctaButton.borderRadius || 14}px`,
                              padding: ctaButton.padding || '1.375rem 3.5rem',
                              fontFamily: ctaButton.fontFamily || 'Arial',
                              fontWeight: ctaButton.fontWeight || 'bold',
                              boxShadow: ctaButton.boxShadow || '0 8px 24px rgba(59, 130, 246, 0.5)'
                            }}
                          >
                            {ctaButton.content}
                          </button>
                  )}
                </div>
                    </section>
                  )}

                  <footer className="footer">
                    <div className="container">
                      <p>&copy; 2024 zudosu. Todos los derechos reservados.</p>
                    </div>
                  </footer>
                </>
              )
            })()}
          </div>
        </div>
        
        <div className="preview-actions">
          <button onClick={onClose} className="preview-cancel-btn">
            Cancelar
          </button>
          <button onClick={onUse} className="preview-use-btn">
            ✅ Usar Este Template
          </button>
        </div>
      </div>
    </div>
  )
}

export default Editor
