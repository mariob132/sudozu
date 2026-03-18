import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import './LandingPage.css'

function LandingPage() {
  const featureCardsRef = useRef([])

  useEffect(() => {
    // Smooth scroll behavior
    const handleSmoothScroll = (e) => {
      const href = e.target.getAttribute('href')
      if (href && href.startsWith('#')) {
        e.preventDefault()
        const targetId = href.substring(1)
        const targetElement = document.getElementById(targetId)
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', handleSmoothScroll)
    })

    // Intersection Observer for fade-in animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1'
          entry.target.style.transform = 'translateY(0)'
        }
      })
    }, observerOptions)

    featureCardsRef.current.forEach(card => {
      if (card) {
        card.style.opacity = '0'
        card.style.transform = 'translateY(30px)'
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease'
        observer.observe(card)
      }
    })

    return () => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', handleSmoothScroll)
      })
      observer.disconnect()
    }
  }, [])

  return (
    <div className="landing-page">
      <nav className="navbar">
        <div className="nav-container">
          <h1 className="logo">zudosu</h1>
          <Link to="/login" className="btn-primary">Iniciar Sesión</Link>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-background-image"></div>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Crea tu Propia <span className="highlight">Página Web</span> o <span className="highlight">Aplicación Web</span>
            </h1>
            <p className="hero-subtitle">
              Diseña y personaliza tu sitio web sin necesidad de conocimientos técnicos. 
              Edita templates, cambia imágenes y crea algo único en minutos.
            </p>
            <div className="hero-buttons">
              <Link to="/login" className="btn-cta">Comenzar Ahora</Link>
              <a href="#features" className="btn-secondary">Saber Más</a>
            </div>
          </div>
          <div className="hero-image-container">
            <img 
              src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80" 
              alt="Código de programación" 
              className="hero-image"
            />
          </div>
        </div>
      </section>

      <section id="features" className="features">
        <div className="container">
          <h2 className="section-title">¿Por qué elegir zudosu?</h2>
          <div className="features-grid">
            <div className="feature-card" ref={el => featureCardsRef.current[0] = el}>
              <div className="feature-icon">🎨</div>
              <h3>Editor Visual</h3>
              <p>Edita tus templates de forma visual. Arrastra, mueve y personaliza elementos con facilidad.</p>
            </div>
            <div className="feature-card" ref={el => featureCardsRef.current[1] = el}>
              <div className="feature-icon">🖼️</div>
              <h3>Gestión de Imágenes</h3>
              <p>Cambia imágenes fácilmente, ajusta su tamaño y posición con solo unos clics.</p>
            </div>
            <div className="feature-card" ref={el => featureCardsRef.current[2] = el}>
              <div className="feature-icon">⚡</div>
              <h3>Rápido y Fácil</h3>
              <p>Crea tu página web en minutos sin necesidad de escribir código.</p>
            </div>
            <div className="feature-card" ref={el => featureCardsRef.current[3] = el}>
              <div className="feature-icon">🆓</div>
              <h3>Templates Gratis</h3>
              <p>Accede a una colección de templates gratuitos listos para personalizar.</p>
            </div>
            <div className="feature-card" ref={el => featureCardsRef.current[4] = el}>
              <div className="feature-icon">📱</div>
              <h3>Responsive</h3>
              <p>Tus páginas se verán perfectas en cualquier dispositivo, móvil o desktop.</p>
            </div>
            <div className="feature-card" ref={el => featureCardsRef.current[5] = el}>
              <div className="feature-icon">🚀</div>
              <h3>Publicación Rápida</h3>
              <p>Publica tu sitio web en minutos y compártelo con el mundo.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>¿Listo para crear tu página web?</h2>
          <p>Únete a miles de usuarios que ya están creando sus sitios web con zudosu</p>
          <Link to="/login" className="btn-cta-large">Empezar Gratis</Link>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 zudosu. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
