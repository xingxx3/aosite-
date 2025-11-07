// Form submission handler for AO Interview registration
(function() {
  'use strict';
  
  console.log('=== FORM HANDLER SCRIPT LOADED ===');
  
  // ============================================
  // DROPDOWN MENU - COMPLETELY NEW IMPLEMENTATION
  // ============================================
  
  const leaders = [
    'Aaron Benjamin',
    'Abigail Johnson',
    'Adrian Martinez',
    'Aiden Thompson',
    'Alexandra Davis',
    'Amanda Wilson',
    'Andrew Brown',
    'Angela White',
    'Anthony Lee',
    'Ashley Harris',
    'Benjamin Taylor',
    'Brandon Moore',
    'Brittany Jackson',
    'Caleb Anderson',
    'Cameron Thomas',
    'Caroline Garcia',
    'Christopher Martin',
    'Daniel Rodriguez',
    'David Lewis',
    'Emily Walker',
    'Emma Hall',
    'Ethan Young',
    'Gabriel King',
    'Grace Wright',
    'Hannah Lopez',
    'Isabella Hill',
    'Jacob Scott',
    'James Green',
    'Jessica Adams',
    'John Baker',
    'Jonathan Nelson',
    'Joshua Carter',
    'Justin Mitchell',
    'Katherine Perez',
    'Kevin Roberts',
    'Laura Turner',
    'Lauren Phillips',
    'Madison Campbell',
    'Matthew Parker',
    'Michael Evans',
    'Morgan Edwards',
    'Nathan Collins',
    'Nicholas Stewart',
    'Olivia Sanchez',
    'Rachel Morris',
    'Ryan Rogers',
    'Samantha Reed',
    'Sarah Cook',
    'Stephanie Morgan',
    'Steven Bell',
    'Taylor Murphy',
    'Thomas Bailey',
    'Tyler Rivera',
    'Victoria Cooper',
    'William Richardson',
    'Zachary Cox'
  ];
  
  // Global state - simple and clear
  let dropdown = null;
  let isOpen = false;
  let button = null;
  let valueSpan = null;
  let selectEl = null;
  let searchInput = null;
  let highlightedIdx = -1;
  let clickOutsideListener = null;
  
  // Create the dropdown element once
  function createDropdown() {
    if (dropdown) return dropdown;
    
    dropdown = document.createElement('div');
    dropdown.id = 'ao-leader-dropdown-container';
    dropdown.setAttribute('role', 'listbox');
    
    // Fixed positioning - stays in place
    dropdown.style.cssText = `
      position: absolute !important;
      top: 100% !important;
      left: 0 !important;
      width: 100% !important;
      background: #ffffff !important;
      border: 2px solid #000000 !important;
      border-top: none !important;
      z-index: 999999 !important;
      display: none !important;
      max-height: 400px !important;
      overflow: hidden !important;
      box-shadow: 0 8px 16px rgba(0,0,0,0.2) !important;
      margin-top: -1px !important;
    `;
    
    // Search input
    const search = document.createElement('input');
    search.type = 'text';
    search.id = 'ao-search-input';
    search.placeholder = 'Search leaders...';
    search.setAttribute('autocomplete', 'off');
    search.style.cssText = `
      width: 100% !important;
      padding: 12px 15px !important;
      border: none !important;
      border-bottom: 2px solid #000000 !important;
      font-size: 14px !important;
      outline: none !important;
      box-sizing: border-box !important;
      background: #ffffff !important;
      font-family: inherit !important;
    `;
    searchInput = search;
    
    // Items wrapper
    const itemsWrapper = document.createElement('div');
    itemsWrapper.id = 'ao-items-wrapper';
    itemsWrapper.style.cssText = `
      max-height: 320px !important;
      overflow-y: auto !important;
      overflow-x: hidden !important;
    `;
    
    // Create all items
    leaders.forEach((leader, idx) => {
      const item = document.createElement('div');
      item.className = 'ao-dropdown-item';
      item.setAttribute('data-leader', leader);
      item.setAttribute('data-index', idx);
      item.setAttribute('role', 'option');
      item.textContent = leader;
      item.style.cssText = `
        padding: 12px 15px !important;
        cursor: pointer !important;
        border-bottom: 1px solid #e5e5e5 !important;
        background: #ffffff !important;
        font-size: 14px !important;
        user-select: none !important;
      `;
      
      // Mouse hover
      item.addEventListener('mouseenter', function() {
        if (isOpen) {
          const visible = Array.from(itemsWrapper.querySelectorAll('.ao-dropdown-item'))
            .filter(i => i.style.display !== 'none');
          highlightedIdx = visible.indexOf(this);
          highlightItems();
        }
      });
      
      // Click to select
      item.addEventListener('click', function(event) {
        event.stopPropagation();
        event.preventDefault();
        selectLeader(leader);
      });
      
      itemsWrapper.appendChild(item);
    });
    
    dropdown.appendChild(search);
    dropdown.appendChild(itemsWrapper);
    
    // Search filtering
    search.addEventListener('input', function(event) {
      event.stopPropagation();
      const term = event.target.value.toLowerCase().trim();
      filterItems(term);
    });
    
    // Keyboard navigation in search
    search.addEventListener('keydown', function(event) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        event.stopPropagation();
      }
      handleKeyPress(event);
    });
    
    // Prevent dropdown clicks from closing
    dropdown.addEventListener('mousedown', function(event) {
      event.stopPropagation();
    });
    
    dropdown.addEventListener('click', function(event) {
      event.stopPropagation();
    });
    
    return dropdown;
  }
  
  // Filter items based on search
  function filterItems(searchTerm) {
    if (!dropdown) return;
    
    const itemsWrapper = dropdown.querySelector('#ao-items-wrapper');
    if (!itemsWrapper) return;
    
    const items = itemsWrapper.querySelectorAll('.ao-dropdown-item');
    
    items.forEach((item) => {
      const leader = item.getAttribute('data-leader').toLowerCase();
      const matches = !searchTerm || leader.includes(searchTerm);
      item.style.display = matches ? 'block' : 'none';
    });
    
    highlightedIdx = -1;
    highlightItems();
  }
  
  // Highlight items for keyboard navigation
  function highlightItems() {
    if (!dropdown) return;
    
    const itemsWrapper = dropdown.querySelector('#ao-items-wrapper');
    if (!itemsWrapper) return;
    
    const visibleItems = Array.from(itemsWrapper.querySelectorAll('.ao-dropdown-item'))
      .filter(item => item.style.display !== 'none');
    
    visibleItems.forEach((item, idx) => {
      if (idx === highlightedIdx) {
        item.style.backgroundColor = '#e5e7eb';
        item.style.fontWeight = '600';
      } else {
        item.style.backgroundColor = '#ffffff';
        item.style.fontWeight = 'normal';
      }
    });
  }
  
  // Keyboard navigation
  function handleKeyPress(event) {
    if (!isOpen || !dropdown) return;
    
    const itemsWrapper = dropdown.querySelector('#ao-items-wrapper');
    if (!itemsWrapper) return;
    
    const visibleItems = Array.from(itemsWrapper.querySelectorAll('.ao-dropdown-item'))
      .filter(item => item.style.display !== 'none');
    
    switch(event.key) {
      case 'ArrowDown':
        event.preventDefault();
        event.stopPropagation();
        highlightedIdx = (highlightedIdx < visibleItems.length - 1) ? highlightedIdx + 1 : 0;
        highlightItems();
        if (visibleItems[highlightedIdx]) {
          visibleItems[highlightedIdx].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
        break;
        
      case 'ArrowUp':
        event.preventDefault();
        event.stopPropagation();
        highlightedIdx = (highlightedIdx > 0) ? highlightedIdx - 1 : visibleItems.length - 1;
        highlightItems();
        if (visibleItems[highlightedIdx]) {
          visibleItems[highlightedIdx].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
        break;
        
      case 'Enter':
        event.preventDefault();
        event.stopPropagation();
        if (highlightedIdx >= 0 && visibleItems[highlightedIdx]) {
          const leader = visibleItems[highlightedIdx].getAttribute('data-leader');
          selectLeader(leader);
        }
        break;
        
      case 'Escape':
        event.preventDefault();
        event.stopPropagation();
        closeDropdown();
        break;
    }
  }
  
  // Select a leader
  function selectLeader(leaderName) {
    console.log('Selected leader:', leaderName);
    
    // Update value span
    if (valueSpan) {
      valueSpan.textContent = leaderName;
      valueSpan.style.color = '#000000';
      valueSpan.style.opacity = '1';
      valueSpan.style.fontWeight = '500';
    }
    
    // Update select element
    if (selectEl) {
      selectEl.innerHTML = '';
      const opt = document.createElement('option');
      opt.value = leaderName;
      opt.textContent = leaderName;
      selectEl.appendChild(opt);
      selectEl.value = leaderName;
      selectEl.dispatchEvent(new Event('change', { bubbles: true }));
    }
    
    // Update button
    if (button) {
      button.dataset.selectedLeader = leaderName;
      button.setAttribute('aria-expanded', 'false');
    }
    
    closeDropdown();
  }
  
  // Position dropdown relative to button
  function positionDropdown() {
    if (!dropdown || !button) return;
    
    const container = button.closest('[data-slot="mainWrapper"]') || 
                     button.parentElement ||
                     button.closest('div');
    
    if (container) {
      // Ensure container has relative positioning
      const computedStyle = window.getComputedStyle(container);
      if (computedStyle.position === 'static' || !computedStyle.position) {
        container.style.position = 'relative';
      }
      
      // If dropdown is already in the right container, don't move it
      if (container.contains(dropdown)) {
        return;
      }
      
      // Remove dropdown from any other parent first
      if (dropdown.parentElement) {
        dropdown.parentElement.removeChild(dropdown);
      }
      
      // Append to correct container
      container.appendChild(dropdown);
    }
  }
  
  // Open dropdown
  function openDropdown() {
    if (isOpen) return;
    
    console.log('Opening dropdown');
    
    // Create if needed
    if (!dropdown) {
      createDropdown();
    }
    
    // Reset state
    if (searchInput) {
      searchInput.value = '';
    }
    highlightedIdx = -1;
    filterItems('');
    
    // Position and show
    positionDropdown();
    dropdown.style.display = 'block';
    isOpen = true;
    
    // Focus search
    if (searchInput) {
      setTimeout(() => {
        searchInput.focus();
      }, 50);
    }
    
    // Update button
    if (button) {
      button.setAttribute('aria-expanded', 'true');
    }
    
    // Remove any existing click outside listener first
    if (clickOutsideListener) {
      document.removeEventListener('click', clickOutsideListener, true);
      clickOutsideListener = null;
    }
    
    // Add click outside listener
    clickOutsideListener = function(event) {
      // Don't close if clicking inside dropdown or button
      const clickedInDropdown = dropdown && dropdown.contains(event.target);
      const clickedInButton = button && (button.contains(event.target) || button === event.target);
      
      if (!clickedInDropdown && !clickedInButton && isOpen) {
        closeDropdown();
      }
    };
    
    // Use capture phase and delay to avoid immediate closure
    setTimeout(() => {
      document.addEventListener('click', clickOutsideListener, true);
    }, 150);
    
    // Remove any existing escape handler first
    if (dropdown && dropdown._escapeHandler) {
      window.removeEventListener('keydown', dropdown._escapeHandler);
      dropdown._escapeHandler = null;
    }
    
    // Escape key handler
    function escapeHandler(event) {
      if (event.key === 'Escape' && isOpen) {
        closeDropdown();
      }
    }
    
    window.addEventListener('keydown', escapeHandler);
    dropdown._escapeHandler = escapeHandler;
  }
  
  // Close dropdown
  function closeDropdown() {
    if (!isOpen) return;
    
    console.log('Closing dropdown');
    
    if (dropdown) {
      dropdown.style.display = 'none';
    }
    
    if (searchInput) {
      searchInput.value = '';
    }
    
    highlightedIdx = -1;
    isOpen = false;
    
    // Update button
    if (button) {
      button.setAttribute('aria-expanded', 'false');
    }
    
    // Remove click outside listener
    if (clickOutsideListener) {
      document.removeEventListener('click', clickOutsideListener, true);
      clickOutsideListener = null;
    }
    
    // Remove escape handler
    if (dropdown && dropdown._escapeHandler) {
      window.removeEventListener('keydown', dropdown._escapeHandler);
      dropdown._escapeHandler = null;
    }
  }
  
  // Initialize dropdown system
  function initDropdown() {
    console.log('Initializing dropdown...');
    
    // Find button
    const selectors = [
      'button#react-aria-\\:R25icv6jaH2\\:',
      'button[data-slot="trigger"]',
      'button[aria-haspopup="listbox"]'
    ];
    
    for (const sel of selectors) {
      button = document.querySelector(sel);
      if (button) {
        console.log('Found button:', sel);
        break;
      }
    }
    
    if (!button) {
      console.log('Button not found, retrying...');
      setTimeout(initDropdown, 500);
      return;
    }
    
    // Find value span
    valueSpan = document.querySelector('span#react-aria-\\:R25icv6jaH7\\:');
    if (!valueSpan && button) {
      valueSpan = button.querySelector('span[data-slot="value"]');
    }
    
    // Find select element
    selectEl = document.querySelector('select[name="select"]');
    if (!selectEl) {
      selectEl = document.querySelector('[data-testid="hidden-select-container"] select');
    }
    
    // Button click handler
    function buttonClick(event) {
      event.preventDefault();
      event.stopPropagation();
      
      if (isOpen) {
        closeDropdown();
      } else {
        openDropdown();
      }
    }
    
    // Add click handler to button
    button.addEventListener('click', buttonClick, false);
    button.style.cursor = 'pointer';
    button.style.pointerEvents = 'auto';
    
    // Make children clickable too
    const children = button.querySelectorAll('*');
    children.forEach(child => {
      child.style.pointerEvents = 'auto';
      child.style.cursor = 'pointer';
      child.addEventListener('click', buttonClick, false);
    });
    
    // Handle scroll/resize
    window.addEventListener('scroll', function() {
      if (isOpen) {
        positionDropdown();
      }
    }, true);
    
    window.addEventListener('resize', function() {
      if (isOpen) {
        positionDropdown();
      }
    });
    
    console.log('Dropdown initialized');
  }
  
  // Start initialization
  function startInit() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initDropdown, 100);
        setTimeout(initDropdown, 500);
        setTimeout(initDropdown, 1000);
      });
    } else {
      setTimeout(initDropdown, 100);
      setTimeout(initDropdown, 500);
      setTimeout(initDropdown, 1000);
    }
    
    // Watch for button creation
    const observer = new MutationObserver(function() {
      if (!button) {
        const btn = document.querySelector('button[data-slot="trigger"]') ||
                   document.querySelector('button[aria-haspopup="listbox"]');
        if (btn) {
          initDropdown();
        }
      }
  });
  
  observer.observe(document.body, {
    childList: true,
      subtree: true
  });
  }
  
  startInit();
  
  // ============================================
  // FORM SUBMISSION HANDLER
  // ============================================
  
  // Helper function to create a unique identifier from user data
  function createUserIdentifier(email, phone) {
    return `${email.toLowerCase().trim()}_${phone.trim().replace(/\s+/g, '')}`;
  }
  
  // Helper function to check if user already submitted
  function isDuplicateSubmission(email, phone) {
    try {
      const submittedUsers = JSON.parse(localStorage.getItem('submittedUsers') || '[]');
      const userIdentifier = createUserIdentifier(email, phone);
      return submittedUsers.includes(userIdentifier);
    } catch (error) {
      console.error('Error checking duplicate:', error);
      return false;
    }
  }
  
  // Helper function to store submitted user data
  function storeSubmittedUser(email, phone) {
    try {
      const submittedUsers = JSON.parse(localStorage.getItem('submittedUsers') || '[]');
      const userIdentifier = createUserIdentifier(email, phone);
      if (!submittedUsers.includes(userIdentifier)) {
        submittedUsers.push(userIdentifier);
        localStorage.setItem('submittedUsers', JSON.stringify(submittedUsers));
      }
    } catch (error) {
      console.error('Error storing submitted user:', error);
    }
  }
  
  // Helper function to clear form fields
  function clearFormFields(form) {
    // Clear text inputs
    const textInputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]');
    textInputs.forEach(input => {
      input.value = '';
    });
    
    // Clear AO Leader selection
    const button = form.querySelector('button[data-slot="trigger"]') || 
                   form.querySelector('button[aria-haspopup="listbox"]') ||
                   form.querySelector('button#react-aria-\\:R25icv6jaH2\\:');
    if (button) {
      button.dataset.selectedLeader = '';
    }
    
    const valueSpan = form.querySelector('span[data-slot="value"]') ||
                      form.querySelector('span#react-aria-\\:R25icv6jaH7\\:');
    if (valueSpan) {
      valueSpan.textContent = 'Choose one';
      valueSpan.style.color = '';
      valueSpan.style.opacity = '';
      valueSpan.style.fontWeight = '';
    }
    
    const selectEl = form.querySelector('select[name="select"]');
    if (!selectEl) {
      const selectElAlt = form.querySelector('[data-testid="hidden-select-container"] select');
      if (selectElAlt) {
        selectElAlt.value = '';
        selectElAlt.innerHTML = '<option value="">Choose one</option>';
      }
    } else {
      selectEl.value = '';
      selectEl.innerHTML = '<option value="">Choose one</option>';
    }
    
    // Reset form state
    form.reset();
  }
  
  // Form submission handler
  const form = document.querySelector('.reg-form');
  if (form) {
    form.setAttribute('novalidate', 'novalidate');
    
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      console.log('=== FORM SUBMISSION STARTED ===');
      
      const data = {};
      
      // Get all input fields directly
      const firstNameInput = form.querySelector('input[name="firstName"]') || 
                             Array.from(form.querySelectorAll('input[type="text"]'))[0];
      const lastNameInput = form.querySelector('input[name="lastName"]');
      const emailInput = form.querySelector('input[name="email"]') || 
                         form.querySelector('input[type="email"]');
      const phoneInput = form.querySelector('input[name="phone"]') || 
                        form.querySelector('input[type="tel"]');
      
      if (firstNameInput) data.firstName = firstNameInput.value.trim();
      if (lastNameInput) data.lastName = lastNameInput.value.trim();
      if (emailInput) data.email = emailInput.value.trim();
      if (phoneInput) data.phone = phoneInput.value.trim();
      
      // Get AO Leader - check multiple sources
      let aoLeaderValue = '';
      
      // Priority 1: Button dataset
      const button = form.querySelector('button[data-slot="trigger"]') || 
                     form.querySelector('button[aria-haspopup="listbox"]') ||
                     form.querySelector('button#react-aria-\\:R25icv6jaH2\\:');
      if (button && button.dataset.selectedLeader) {
        aoLeaderValue = button.dataset.selectedLeader;
        console.log('✓ Got leader from button dataset:', aoLeaderValue);
      }
      
      // Priority 2: Value span
      if (!aoLeaderValue) {
        const valueSp = form.querySelector('span[data-slot="value"]') ||
                        form.querySelector('span#react-aria-\\:R25icv6jaH7\\:');
        if (valueSp && valueSp.textContent && 
            valueSp.textContent.trim() !== 'Choose one' && 
            valueSp.textContent.trim() !== '') {
          aoLeaderValue = valueSp.textContent.trim();
          console.log('✓ Got leader from valueSpan:', aoLeaderValue);
        }
      }
      
      // Priority 3: Select element
      if (!aoLeaderValue) {
        let selectEl = form.querySelector('select[name="select"]');
        if (!selectEl) {
          selectEl = form.querySelector('[data-testid="hidden-select-container"] select');
        }
        if (selectEl && selectEl.value && selectEl.value.trim() !== '') {
          aoLeaderValue = selectEl.value.trim();
          console.log('✓ Got leader from selectElement:', aoLeaderValue);
        }
      }
      
      data.ao_leader = aoLeaderValue;
      
      console.log('=== FORM DATA ===');
      console.log('firstName:', data.firstName);
      console.log('lastName:', data.lastName);
      console.log('email:', data.email);
      console.log('phone:', data.phone);
      console.log('ao_leader:', data.ao_leader);
      
      // Validate (AO Leader is optional now)
      if (!data.firstName || !data.lastName || !data.email || !data.phone) {
        console.error('Validation failed:', {
          firstName: !!data.firstName,
          lastName: !!data.lastName,
          email: !!data.email,
          phone: !!data.phone,
          ao_leader: !!data.ao_leader
        });
        // Validation error - no alert popup
        return;
      }
      
      // Check for duplicate submission
      if (isDuplicateSubmission(data.email, data.phone)) {
        console.warn('Duplicate submission detected - same email and phone combination already submitted');
        alert('⚠️ You have already registered!\n\nThis email and phone number combination has already been submitted. If you need to update your information, please contact support.');
        return;
      }
      
      console.log('All fields valid, submitting...');
      
      try {
        const response = await fetch('/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });
        
        let result;
        try {
          result = await response.json();
        } catch (jsonError) {
          // If response is not JSON, create error object
          result = { 
            success: false, 
            error: response.status === 409 
              ? 'You have already registered! This email and phone number combination has already been registered.'
              : 'An error occurred while processing your registration.'
          };
        }
        
        // Check for duplicate error from server (409 Conflict status)
        if (response.status === 409 || (result.error && result.error.toLowerCase().includes('duplicate')) || (result.error && result.error.toLowerCase().includes('already registered'))) {
          console.warn('Duplicate submission detected by server:', result.error);
          alert('⚠️ You have already registered!\n\nThis email and phone number combination has already been registered. If you need to update your information, please contact support.');
          // Store even failed duplicate to prevent retries
          storeSubmittedUser(data.email, data.phone);
          return;
        }
        
        if (result.success) {
          console.log('Registration successful!');
          
          // Store submitted user data to prevent duplicates
          storeSubmittedUser(data.email, data.phone);
          
          // Clear form fields before redirect
          clearFormFields(form);
          
          // Small delay to ensure form is cleared, then redirect
          setTimeout(() => {
            window.location.href = '/success.html';
          }, 100);
        } else {
          console.error('Registration failed:', result.error);
          alert('Registration failed. Please try again or contact support if the problem persists.');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('An error occurred while submitting the form. Please check your connection and try again.');
      }

    });
  }
})();

