        // ================================================
        // Hamburger
        // ================================================

document.addEventListener('DOMContentLoaded', function() {
    // Get references to the hamburger button and navigation menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    // Function to toggle the menu state
    function toggleMenu() {
        // Toggle classes for hamburger animation
        hamburger.classList.toggle('is-active');
        
        // Toggle class for navigation visibility
        navLinks.classList.toggle('is-open');
        
        // Manage aria attributes for accessibility
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !isExpanded);
    }
    
    // Add click event only to the hamburger button
    hamburger.addEventListener('click', function(e) {
        e.preventDefault();
        toggleMenu();
    });
    
    // Close menu when clicking elsewhere (optional)
    document.addEventListener('click', function(e) {
        // Only if menu is open and click is outside the nav and hamburger
        if (
            navLinks.classList.contains('is-open') && 
            !navLinks.contains(e.target) && 
            !hamburger.contains(e.target)
        ) {
            toggleMenu();
        }
    });
    
    // Add escape key support for accessibility
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
            toggleMenu();
        }
    });
});

        // ================================================
        // Togle menu
        // ================================================
        // Collapsible sections
    document.querySelectorAll('.subsection-header').forEach(button => {
        button.addEventListener('click', () => {
          const subsection = button.parentElement;
          const isExpanded = subsection.classList.toggle('active');
          const content = subsection.querySelector('.subsection-content');
          
          // Update ARIA attributes
          button.setAttribute('aria-expanded', isExpanded);
          
          // Toggle content
          if (isExpanded) {
            content.style.maxHeight = content.scrollHeight + "px";
          } else {
            content.style.maxHeight = null;
          }
        });
      });


            // ================================================
            //Sending messages to Spreadsheet
            //================================================
           
            document.addEventListener('DOMContentLoaded', function() {
              const form = document.getElementById('contactForm');
              const formStatus = document.getElementById('formStatus');
              const submitBtn = document.getElementById('submitBtn');
              
              form.addEventListener('submit', function(e) {
                  e.preventDefault();
                  const originalBtnText = submitBtn.textContent;
                  submitBtn.disabled = true;
                  submitBtn.innerHTML = '<span class="spinner"></span>Sending...';
                  formStatus.innerHTML = '<p style="color: #666;">Submitting your message...</p>';
          
                  // Convert FormData to URLSearchParams for better mobile compatibility
                  const formData = new URLSearchParams();
                  for(const [key, value] of new FormData(form)) {
                      formData.append(key, value);
                  }
                  formData.append('timestamp', new Date().toISOString());
          
                  fetch('https://script.google.com/macros/s/AKfycbxxK0v77WFONjgNyiw6kKREVthght3MtNnO6WR3BH5_c4Ukd-VBn65hn4FzgQf7Z3y-Rg/exec', {
                      method: 'POST',
                      body: formData,
                      headers: {
                          'Content-Type': 'application/x-www-form-urlencoded'
                      }
                  })
                  .then(response => {
                      if (!response.ok) throw new Error('Network response was not OK');
                      return response.json();
                  })
                  .then(data => {
                      if (data.result === 'success') {
                          formStatus.innerHTML = '<p style="color: green;">Thank you! Message sent successfully.</p>';
                          form.reset();
                      } else {
                          throw new Error(data.error || 'Server processing failed');
                      }
                  })
                  .catch(error => {
                      console.error('Submission Error:', error);
                      const errorMessage = navigator.onLine ? 
                          'Something went wrong. Please try again.' : 
                          'No internet connection. Please check your network.';
                      formStatus.innerHTML = `<p style="color: red;">${errorMessage}</p>`;
                  })
                  .finally(() => {
                      submitBtn.disabled = false;
                      submitBtn.innerHTML = originalBtnText;
                      // Clear messages after 5 seconds only on mobile
                      if(/Mobi|Android/i.test(navigator.userAgent)) {
                          setTimeout(() => formStatus.innerHTML = '', 5000);
                      }
                  });
              });
          });