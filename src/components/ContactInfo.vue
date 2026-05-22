<template>
  <div class="contact-info-card">
    <div class="contact-content">
      <div class="contact-icon">
        <i class="fas fa-envelope"></i>
      </div>
      <div class="contact-details">
        <h3>Get in Touch</h3>
        <p>Have questions or feedback? We'd love to hear from you!</p>
        
        <div class="contact-methods">
          <a href="mailto:support@weatherapp.com" class="contact-item">
            <div class="contact-icon-small">
              <i class="fas fa-envelope"></i>
            </div>
            <div class="contact-text">
              <span class="contact-label">Email</span>
              <span class="contact-value">support@weatherapp.com</span>
            </div>
          </a>
          
          <a href="https://twitter.com/weatherapp" target="_blank" class="contact-item">
            <div class="contact-icon-small">
              <i class="fab fa-twitter"></i>
            </div>
            <div class="contact-text">
              <span class="contact-label">Twitter</span>
              <span class="contact-value">@weatherapp</span>
            </div>
          </a>
          
          <a href="https://github.com/weatherapp" target="_blank" class="contact-item">
            <div class="contact-icon-small">
              <i class="fab fa-github"></i>
            </div>
            <div class="contact-text">
              <span class="contact-label">GitHub</span>
              <span class="contact-value">github.com/weatherapp</span>
            </div>
          </a>
          
          <div class="contact-item">
            <div class="contact-icon-small">
              <i class="fas fa-map-marker-alt"></i>
            </div>
            <div class="contact-text">
              <span class="contact-label">Location</span>
              <span class="contact-value">Global Service</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContactInfo'
}
</script>

<style scoped>
.contact-info-card {
  padding: 1.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.contact-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  height: 100%;
}

.contact-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%);
  border-radius: 20px;
  margin: 0 auto;
  box-shadow: 0 8px 24px rgba(236, 72, 153, 0.3);
}

.contact-icon i {
  font-size: 2rem;
  color: white;
}

.contact-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: center;
}

.contact-details h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.contact-details p {
  margin: 0;
  color: var(--text-secondary, #64748b);
  line-height: 1.6;
  font-size: 0.95rem;
}

.contact-methods {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(236, 72, 153, 0.05);
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 1px solid rgba(236, 72, 153, 0.1);
}

.contact-item:hover {
  background: rgba(236, 72, 153, 0.1);
  transform: translateX(5px);
  border-color: rgba(236, 72, 153, 0.2);
}

.contact-icon-small {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%);
  border-radius: 10px;
  flex-shrink: 0;
}

.contact-icon-small i {
  color: white;
  font-size: 1.1rem;
}

.contact-text {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  text-align: left;
}

.contact-label {
  font-size: 0.75rem;
  color: var(--text-tertiary, #94a3b8);
  font-weight: 500;
}

.contact-value {
  font-size: 0.9rem;
  color: var(--text-primary, #334155);
  font-weight: 600;
}

@media (max-width: 480px) {
  .contact-info-card {
    padding: 1rem;
  }
  
  .contact-icon {
    width: 60px;
    height: 60px;
  }
  
  .contact-icon i {
    font-size: 1.5rem;
  }
  
  .contact-details h3 {
    font-size: 1.25rem;
  }
  
  .contact-item {
    padding: 0.75rem;
  }
}
</style>
