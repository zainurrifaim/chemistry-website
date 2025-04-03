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
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            formStatus.innerHTML = '<p style="color: #666;">Submitting your message...</p>';
            
            // Improved FormData collection
            const formData = new FormData(form);
            formData.append('timestamp', new Date().toString());
            
            // Replace with your deployed URL
            const scriptURL = 'https://script.google.com/macros/s/AKfycbxxK0v77WFONjgNyiw6kKREVthght3MtNnO6WR3BH5_c4Ukd-VBn65hn4FzgQf7Z3y-Rg/exec';
            
            fetch(scriptURL, { method: 'POST', body: formData })
              .then(response => response.json())
              .then(data => {
                if (data.result === 'success') {
                  formStatus.innerHTML = '<p style="color: green;">Thank you! Your message has been sent successfully.</p>';
                  form.reset();
                } else {
                  throw new Error(data.error);
                }
              })
              .catch(error => {
                console.error('Error!', error);
                formStatus.innerHTML = '<p style="color: red;">Something went wrong. Please try again later.</p>';
              })
              .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
                setTimeout(() => formStatus.innerHTML = '', 5000);
              });
          });
        });