AOS.init({
  duration: 800,
  easing: 'ease-in-out',
  once: false,
  mirror: true,
  offset: 50
});

document.addEventListener('DOMContentLoaded', function() {
  const themeToggle = document.querySelector('.theme-toggle');
  const body = document.body;
  
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
      body.classList.add('dark-theme');
  }
  
  themeToggle.addEventListener('click', function() {
      body.classList.toggle('dark-theme');
      
      if (body.classList.contains('dark-theme')) {
          localStorage.setItem('theme', 'dark');
      } else {
          localStorage.setItem('theme', 'light');
      }
  });
  
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
          if (this.getAttribute('target') === '_blank') {
              return;
          }
          
          e.preventDefault();
          
          const targetId = this.getAttribute('href');
          const targetElement = document.querySelector(targetId);
          
          if (targetElement) {
              window.scrollTo({
                  top: targetElement.offsetTop -100, 
                  behavior: 'smooth'
              });
              
              document.querySelectorAll('.main-nav a').forEach(link => {
                  link.classList.remove('active');
              });
              this.classList.add('active');
          }
      });
  });
  
  const checkInitialActive = () => {
      const hash = window.location.hash;
      if (hash) {
          const activeNavLink = document.querySelector(`.main-nav a[href="${hash}"]`);
          if (activeNavLink) {
              document.querySelectorAll('.main-nav a').forEach(link => {
                  link.classList.remove('active');
              });
              activeNavLink.classList.add('active');
          }
      } else {
          highlightNavOnScroll();
      }
  };
  
  checkInitialActive();
  
  const iletisimLink = document.querySelector('.main-nav a[href="#iletisim"]');
  if (iletisimLink) {
      iletisimLink.addEventListener('click', function() {
          document.querySelectorAll('.main-nav a').forEach(link => {
              link.classList.remove('active');
          });
          this.classList.add('active');
      });
  }
  
  const projectCards = document.querySelectorAll('.experience-cards > a');
  
  projectCards.forEach((card, index) => {
      const cardElement = card.querySelector('.experience-card');
      if (cardElement) {
          cardElement.style.animationDelay = `${index * 0.1}s`;
      }
      
      card.addEventListener('mouseenter', function() {
          this.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
          
          this.style.transform = 'translateY(-6px)';
      });
      
      card.addEventListener('mouseleave', function() {
          this.style.boxShadow = 'none';
          this.style.transform = 'translateY(0)';
      });
  });
  
  const navLinks = document.querySelectorAll('.main-nav a');
  
  function highlightNavOnScroll() {
      let scrollPosition = window.scrollY + 200; 
      let currentActive = '';
      
      ['egitim', 'deneyim', 'iletisim'].forEach(id => {
          const section = document.getElementById(id);
          if (!section) return;
          
          const sectionTop = section.offsetTop;
          const sectionBottom = sectionTop + section.offsetHeight;
          
          if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
              currentActive = id;
          }
      });
      
      navLinks.forEach(link => {
          link.classList.remove('active');
          const href = link.getAttribute('href');
          if (href === `#${currentActive}`) {
              link.classList.add('active');
          }
      });
      
      if (!currentActive && (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
          navLinks.forEach(link => {
              if (link.getAttribute('href') === '#iletisim') {
                  link.classList.add('active');
              }
          });
      }
  }
  
  const style = document.createElement('style');
  style.textContent = `
      .main-nav a.active {
          color: var(--accent-color) !important;
          font-weight: 700;
      }
      
      .main-nav a.active::after {
          width: 100% !important;
      }
      
      /* Animated border effect for project cards */
      @keyframes borderPulse {
          0% { border-color: rgba(84, 119, 146, 0.1); }
          50% { border-color: rgba(84, 119, 146, 0.5); }
          100% { border-color: rgba(84, 119, 146, 0.1); }
      }
      
      .experience-card {
          animation: borderPulse 3s infinite;
      }
      
      /* Improve image loading */
      .photo-area {
          position: relative;
          overflow: hidden;
      }
      
      .photo-area img {
          transition: opacity 0.3s ease;
      }
  `;
  document.head.appendChild(style);
  
  window.addEventListener('scroll', highlightNavOnScroll);
});

document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('project-search');
  const filterSelect = document.getElementById('project-filter');
  const projectContainer = document.getElementById('project-container');
  const showMoreBtn = document.getElementById('show-more-btn');
  
  if(searchInput && filterSelect && projectContainer) {
      const allProjects = projectContainer.querySelectorAll('.project-link');
      const projectsPerPage = 6;
      let currentlyShown = Math.min(projectsPerPage, allProjects.length);
      
      allProjects.forEach((project, index) => {
          if (index >= projectsPerPage) {
              project.style.display = 'none';
          }
      });
      
      updateShowMoreButton();
      
      if(showMoreBtn) {
          showMoreBtn.addEventListener('click', function() {
              const hiddenProjects = projectContainer.querySelectorAll('.project-link[style*="display: none"]');
              const toShow = Math.min(projectsPerPage, hiddenProjects.length);
              
              for(let i = 0; i < toShow; i++) {
                  hiddenProjects[i].style.display = '';
              }
              
              updateShowMoreButton();
          });
      }
      
      searchInput.addEventListener('input', filterProjects);
      
      filterSelect.addEventListener('change', filterProjects);
      
      function filterProjects() {
          const searchTerm = searchInput.value.toLowerCase();
          const filterValue = filterSelect.value;
          
          allProjects.forEach(project => {
              const projectName = project.querySelector('h4').textContent.toLowerCase();
              const projectCategory = project.getAttribute('data-category');
              
              const matchesSearch = projectName.includes(searchTerm);
              const matchesFilter = filterValue === 'all' || projectCategory === filterValue;
              
              project.style.display = matchesSearch && matchesFilter ? '' : 'none';
          });
          
          updateShowMoreButton();
      }
      
      function updateShowMoreButton() {
          const hiddenProjects = projectContainer.querySelectorAll('.project-link[style*="display: none"]');
          
          if(showMoreBtn) {
              showMoreBtn.style.display = hiddenProjects.length > 0 ? 'inline-flex' : 'none';
          }
      }
  }
}); 
