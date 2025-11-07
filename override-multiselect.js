// Override script to force AO Leader dropdown to work
(function() {
  'use strict';
  
  console.log('Override multiselect script loaded');
  
  const aoLeaders = [
    'Aaron Benjamin', 'Abigail Johnson', 'Adrian Martinez', 'Aiden Thompson',
    'Alexandra Davis', 'Amanda Wilson', 'Andrew Brown', 'Angela White',
    'Anthony Lee', 'Ashley Harris', 'Benjamin Taylor', 'Brandon Moore',
    'Brittany Jackson', 'Caleb Anderson', 'Cameron Thomas', 'Caroline Garcia',
    'Christopher Martin', 'Daniel Rodriguez', 'David Lewis', 'Emily Walker',
    'Emma Hall', 'Ethan Young', 'Gabriel King', 'Grace Wright',
    'Hannah Lopez', 'Isabella Hill', 'Jacob Scott', 'James Green',
    'Jessica Adams', 'John Baker', 'Jonathan Nelson', 'Joshua Carter',
    'Justin Mitchell', 'Katherine Perez', 'Kevin Roberts', 'Laura Turner',
    'Lauren Phillips', 'Madison Campbell', 'Matthew Parker', 'Michael Evans',
    'Morgan Edwards', 'Nathan Collins', 'Nicholas Stewart', 'Olivia Sanchez',
    'Rachel Morris', 'Ryan Rogers', 'Samantha Reed', 'Sarah Cook',
    'Stephanie Morgan', 'Steven Bell', 'Taylor Murphy', 'Thomas Bailey',
    'Tyler Rivera', 'Victoria Cooper', 'William Richardson', 'Zachary Cox'
  ];
  
  function forceDropdown() {
    // Find multiselect container
    const multiselect = document.querySelector('.multiselect');
    if (!multiselect) {
      console.log('Multiselect not found');
      return;
    }
    
    const input = document.getElementById('select-user-ms-input');
    const tags = multiselect.querySelector('.multiselect__tags');
    
    if (!input || !tags) {
      console.log('Input or tags not found');
      return;
    }
    
    // Check if already initialized
    if (multiselect.hasAttribute('data-override-init')) {
      return;
    }
    multiselect.setAttribute('data-override-init', 'true');
    
    console.log('Initializing dropdown override');
    
    // Create dropdown
    let dropdown = multiselect.querySelector('.multiselect__content-wrapper');
    if (!dropdown) {
      dropdown = document.createElement('div');
      dropdown.className = 'multiselect__content-wrapper';
      dropdown.style.cssText = `
        position: absolute !important;
        top: 100% !important;
        left: 0 !important;
        right: 0 !important;
        background: white !important;
        border: 1px solid #ccc !important;
        border-radius: 4px !important;
        max-height: 300px !important;
        overflow-y: auto !important;
        z-index: 99999 !important;
        display: none !important;
        box-shadow: 0 3px 10px rgba(0,0,0,0.2) !important;
      `;
      
      const ul = document.createElement('ul');
      ul.className = 'multiselect__content';
      ul.style.cssText = 'list-style: none !important; margin: 0 !important; padding: 0 !important;';
      
      aoLeaders.forEach((leader, index) => {
        const li = document.createElement('li');
        li.className = 'multiselect__element';
        li.innerHTML = `<span class="multiselect__option">${leader}</span>`;
        li.style.cssText = 'padding: 10px 12px !important; cursor: pointer !important; border-bottom: 1px solid #f0f0f0 !important;';
        
        const span = li.querySelector('.multiselect__option');
        
        li.addEventListener('mouseenter', function() {
          this.style.backgroundColor = '#f0f0f0';
        });
        
        li.addEventListener('mouseleave', function() {
          this.style.backgroundColor = '';
        });
        
        li.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          console.log('Selected:', leader);
          input.value = leader;
          input.setAttribute('value', leader);
          
          // Update placeholder
          const placeholder = tags.querySelector('.multiselect__placeholder');
          if (placeholder) {
            placeholder.style.display = 'none';
          }
          
          // Create selected tag
          let singleLabel = tags.querySelector('.multiselect__single');
          if (!singleLabel) {
            singleLabel = document.createElement('span');
            singleLabel.className = 'multiselect__single';
            tags.insertBefore(singleLabel, tags.firstChild);
          }
          singleLabel.textContent = leader;
          singleLabel.style.display = 'block';
          
          dropdown.style.display = 'none';
        });
        
        ul.appendChild(li);
      });
      
      dropdown.appendChild(ul);
      multiselect.appendChild(dropdown);
      multiselect.style.position = 'relative';
    }
    
    // Add click handlers with high priority
    tags.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Tags clicked');
      const isHidden = dropdown.style.display === 'none' || dropdown.style.display === '';
      dropdown.style.display = isHidden ? 'block !important' : 'none !important';
      dropdown.setAttribute('style', dropdown.getAttribute('style').replace('display: none', 'display: block'));
    }, true);
    
    input.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Input clicked');
      dropdown.style.display = 'block';
      dropdown.setAttribute('style', dropdown.getAttribute('style').replace('display: none', 'display: block'));
    }, true);
    
    input.addEventListener('focus', function() {
      console.log('Input focused');
      dropdown.style.display = 'block';
      dropdown.setAttribute('style', dropdown.getAttribute('style').replace('display: none', 'display: block'));
    });
    
    // Filter on type
    input.addEventListener('input', function() {
      const search = this.value.toLowerCase();
      const items = dropdown.querySelectorAll('.multiselect__element');
      items.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(search) ? '' : 'none';
      });
      dropdown.style.display = 'block';
      dropdown.setAttribute('style', dropdown.getAttribute('style').replace('display: none', 'display: block'));
    });
    
    // Close when clicking outside
    document.addEventListener('click', function(e) {
      if (!multiselect.contains(e.target)) {
        dropdown.style.display = 'none';
      }
    });
    
    console.log('Dropdown initialized successfully');
  }
  
  // Initialize multiple times to ensure it works
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', forceDropdown);
  } else {
    forceDropdown();
  }
  
  window.addEventListener('load', forceDropdown);
  setTimeout(forceDropdown, 500);
  setTimeout(forceDropdown, 1000);
  setTimeout(forceDropdown, 2000);
  
  // Keep checking periodically
  setInterval(forceDropdown, 3000);
})();
