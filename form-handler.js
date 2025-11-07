// Form Handler for Telegram Bot Integration
(function() {
  'use strict';

  // API endpoint
  const API_URL = '/api/submit';
  
  // Redirect URL after successful registration
  const REDIRECT_URL = 'https://www.aointerview.com/webinar/1778979';
  
  // Add CSS to ensure country selector is active and clickable
  function addCountrySelectorStyles() {
    const styleId = 'country-selector-styles';
    if (document.getElementById(styleId)) {
      return; // Already added
    }
    
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* Ensure country selector is clickable and visible */
      .iti__selected-country,
      .iti__selected-flag,
      .iti__selected-country-primary {
        pointer-events: auto !important;
        cursor: pointer !important;
        user-select: none !important;
        z-index: 10 !important;
      }
      
      .iti__country-list {
        pointer-events: auto !important;
        z-index: 9999 !important;
        max-height: 300px !important;
        overflow-y: auto !important;
      }
      
      .iti__arrow {
        pointer-events: none !important;
      }
      
      /* Ensure dropdown is visible when opened */
      .iti--allow-dropdown .iti__flag-container:hover .iti__selected-flag {
        background-color: rgba(0, 0, 0, 0.05) !important;
      }
      
      /* Make sure all countries are accessible */
      .iti__country {
        pointer-events: auto !important;
        cursor: pointer !important;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Add styles immediately
  addCountrySelectorStyles();

  // Function to collect all form data
  function collectFormData(formElement) {
    const formData = {};
    
    // Get all input elements (including those outside forms)
    const allInputs = formElement ? formElement.querySelectorAll('input, textarea, select') : document.querySelectorAll('input, textarea, select');
    
    allInputs.forEach(input => {
      // Skip buttons and hidden inputs that are not needed
      if (input.type === 'button' || input.type === 'submit' || input.type === 'reset') {
        return;
      }
      
      // Skip hidden select elements (like the hidden select-user)
      if (input.tagName === 'SELECT' && (input.classList.contains('d-none') || input.classList.contains('sf-hidden'))) {
        // But check if there's a multiselect input that has the value
        const multiselectInput = document.getElementById('select-user-ms-input');
        if (multiselectInput && input.id === 'select-user') {
          // Use the multiselect input value instead
          const multiselectValue = multiselectInput.value || multiselectInput.getAttribute('value') || '';
          if (multiselectValue && multiselectValue.trim() !== '') {
            formData[input.name || 'user_id'] = multiselectValue.trim();
          }
          return;
        }
        return;
      }
      
      // Get field name (use name, id, or placeholder)
      let fieldName = input.name || input.id || input.placeholder || input.type;
      
      // Clean up field name (remove prefixes like "input-labelled-")
      if (fieldName && fieldName.includes('input-labelled-')) {
        // Try to get name from placeholder or use a generic name
        fieldName = input.name || input.placeholder || fieldName;
      }
      
      // Get field value
      let value = '';
      if (input.type === 'checkbox' || input.type === 'radio') {
        if (input.checked) {
          value = input.value || 'checked';
        } else {
          return; // Skip unchecked checkboxes/radios
        }
      } else if (input.tagName === 'SELECT') {
        value = input.options[input.selectedIndex]?.value || '';
      } else {
        value = input.value || '';
      }
      
      // Special handling for phone number with intl-tel-input
      if (input.type === 'tel' && input.intlTelInputInstance) {
        const iti = input.intlTelInputInstance;
        const phoneNumber = iti.getNumber();
        if (phoneNumber) {
          value = phoneNumber;
        }
      }
      
      // Only add if value exists
      if (value && value.trim() !== '') {
        formData[fieldName] = value.trim();
      }
    });
    
    // Also check for multiselect input (AO Leader dropdown)
    const multiselectInput = document.getElementById('select-user-ms-input');
    if (multiselectInput) {
      const leaderValue = multiselectInput.value || multiselectInput.getAttribute('value') || '';
      if (leaderValue && leaderValue.trim() !== '') {
        formData['user_id'] = leaderValue.trim();
        formData['ao_leader'] = leaderValue.trim(); // Also add as ao_leader for clarity
      }
    }
    
    return formData;
  }

  // Function to show notification
  function showNotification(message, isSuccess = true) {
    // Try to find existing notification element
    let notification = document.getElementById('telegram-notification');
    
    if (!notification) {
      notification = document.createElement('div');
      notification.id = 'telegram-notification';
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 10000;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        transition: opacity 0.3s;
      `;
      document.body.appendChild(notification);
    }
    
    notification.style.backgroundColor = isSuccess ? '#4CAF50' : '#f44336';
    notification.textContent = message;
    notification.style.opacity = '1';
    notification.style.display = 'block';
    
    // Hide after 5 seconds
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        notification.style.display = 'none';
      }, 300);
    }, 5000);
  }

  // Function to submit form data
  async function submitFormData(formData) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      
      if (result.success) {
        showNotification(result.message || 'Form submitted successfully!', true);
        return true;
      } else {
        showNotification(result.message || 'Failed to submit form', false);
        return false;
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      showNotification('Error: ' + error.message, false);
      return false;
    }
  }

  // Load intl-tel-input library if not already loaded
  function loadIntlTelInputLibrary(callback) {
    if (typeof intlTelInput !== 'undefined') {
      callback();
      return;
    }
    
    // Load CSS
    if (!document.getElementById('intl-tel-input-css')) {
      const link = document.createElement('link');
      link.id = 'intl-tel-input-css';
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/intl-tel-input@23.0.0/build/css/intlTelInput.css';
      document.head.appendChild(link);
    }
    
    // Load JS
    if (!document.getElementById('intl-tel-input-js')) {
      const script = document.createElement('script');
      script.id = 'intl-tel-input-js';
      script.src = 'https://cdn.jsdelivr.net/npm/intl-tel-input@23.0.0/build/js/intlTelInput.min.js';
      script.onload = callback;
      script.onerror = function() {
        console.error('Failed to load intl-tel-input library');
        // Try again after delay
        setTimeout(() => loadIntlTelInputLibrary(callback), 1000);
      };
      document.head.appendChild(script);
    } else {
      // Script already loading, wait for it
      setTimeout(callback, 500);
    }
  }

  // Initialize country selector (intl-tel-input) with all countries
  function initCountrySelector() {
    // Add styles first
    addCountrySelectorStyles();
    
    // European countries list with ISO codes (area codes included)
    const europeanCountries = [
      'al', // Albania +355
      'ad', // Andorra +376
      'at', // Austria +43
      'by', // Belarus +375
      'be', // Belgium +32
      'ba', // Bosnia and Herzegovina +387
      'bg', // Bulgaria +359
      'hr', // Croatia +385
      'cz', // Czech Republic +420
      'dk', // Denmark +45
      'ee', // Estonia +372
      'fi', // Finland +358
      'fr', // France +33
      'de', // Germany +49
      'gr', // Greece +30
      'hu', // Hungary +36
      'is', // Iceland +354
      'ie', // Ireland +353
      'it', // Italy +39
      'xk', // Kosovo +383 (unofficial code)
      'lv', // Latvia +371
      'li', // Liechtenstein +423
      'lt', // Lithuania +370
      'lu', // Luxembourg +352
      'md', // Moldova +373
      'mc', // Monaco +377
      'me', // Montenegro +382
      'nl', // Netherlands +31
      'mk', // North Macedonia +389
      'no', // Norway +47
      'pl', // Poland +48
      'pt', // Portugal +351
      'ro', // Romania +40
      'se', // Sweden +46
      'ch', // Switzerland +41
      'tr', // Turkey +90
      'gb', // United Kingdom +44
      'va'  // Vatican City +39
    ];
    
    // Find all phone input fields (including those that might already have intl-tel-input)
    const phoneInputs = document.querySelectorAll('input[type="tel"], input[type="text"], input.phone, input[data-phone], .phone-input, input[data-intl-tel-input-id]');
    
    // Also find inputs inside .iti containers (existing intl-tel-input instances)
    const itiContainers = document.querySelectorAll('.iti');
    itiContainers.forEach(container => {
      const input = container.querySelector('input');
      if (input && !phoneInputs.includes(input)) {
        phoneInputs.push(input);
      }
    });
    
    // Load library first, then initialize
    loadIntlTelInputLibrary(function() {
      phoneInputs.forEach(input => {
        try {
          // Check if intlTelInput is available
          if (typeof intlTelInput !== 'undefined') {
            // ALWAYS destroy existing instance first to ensure clean initialization
            try {
              if (input.intlTelInputInstance && input.intlTelInputInstance.destroy) {
                input.intlTelInputInstance.destroy();
              }
              // Also check for data attribute
              const existingId = input.getAttribute('data-intl-tel-input-id');
              if (existingId && window.intlTelInputGlobals && window.intlTelInputGlobals.instances) {
                const existingInstance = window.intlTelInputGlobals.instances[existingId];
                if (existingInstance && existingInstance.destroy) {
                  existingInstance.destroy();
                }
              }
            } catch (e) {
              // Ignore errors when destroying
            }
            
            // Remove any existing intl-tel-input wrapper
            const itiWrapper = input.closest('.iti');
            if (itiWrapper && itiWrapper !== input.parentElement) {
              // Move input out of wrapper temporarily
              const parent = itiWrapper.parentElement;
              parent.insertBefore(input, itiWrapper);
              itiWrapper.remove();
            }
            
            // Initialize with European countries prioritized + all others enabled
            const iti = intlTelInput(input, {
              initialCountry: 'us', // Default to US, but allow all countries
              preferredCountries: europeanCountries, // European countries shown first
              onlyCountries: [], // Empty array means no restrictions - ALL COUNTRIES ENABLED (including European ones)
              excludeCountries: [], // Empty array means no exclusions
              separateDialCode: false,
              utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input@23.0.0/build/js/utils.js',
              // Enable all countries
              allowDropdown: true,
              autoPlaceholder: 'aggressive',
              formatOnDisplay: true,
              nationalMode: false
            });
            
            // Store instance for later reference
            input.intlTelInputInstance = iti;
            
            // Force enable dropdown
            const flagContainer = input.closest('.iti')?.querySelector('.iti__flag-container');
            if (flagContainer) {
              flagContainer.style.pointerEvents = 'auto';
              flagContainer.style.cursor = 'pointer';
              flagContainer.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (iti._handleSelectedCountryClick) {
                  iti._handleSelectedCountryClick(e);
                }
              };
            }
          }
        } catch (error) {
          console.warn('Could not initialize intl-tel-input:', error);
        }
      });
      
      // After initialization, make sure all country selectors are clickable
      setTimeout(function() {
        const countrySelectors = document.querySelectorAll('.iti__selected-country-primary, .iti__flag-container, .iti__selected-country');
        countrySelectors.forEach(selector => {
          selector.style.pointerEvents = 'auto';
          selector.style.cursor = 'pointer';
          selector.style.zIndex = '9999';
          
          // Add click handler
          selector.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            const itiWrapper = selector.closest('.iti');
            if (itiWrapper) {
              const input = itiWrapper.querySelector('input');
              if (input && input.intlTelInputInstance) {
                const iti = input.intlTelInputInstance;
                if (iti._handleSelectedCountryClick) {
                  iti._handleSelectedCountryClick(e);
                }
              }
            }
          };
        });
      }, 500);
    });
    
    // If intlTelInput is not loaded yet, try again after a delay
    if (typeof intlTelInput === 'undefined') {
      setTimeout(initCountrySelector, 500);
    }
  }

  // Initialize AO Leaders multiselect dropdown
  function initAOLeadersDropdown() {
    // List of AO Leaders
    const aoLeaders = [
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
    
    // Find the multiselect input
    const multiselectInput = document.getElementById('select-user-ms-input');
    if (!multiselectInput) {
      // Try to find by placeholder
      const inputs = document.querySelectorAll('input[placeholder*="AO Leader"], input[placeholder*="Leader"]');
      if (inputs.length > 0) {
        inputs.forEach(input => {
          initMultiselectForInput(input, aoLeaders);
        });
      }
      return;
    }
    
    initMultiselectForInput(multiselectInput, aoLeaders);
  }
  
  // Initialize multiselect for a specific input
  function initMultiselectForInput(input, options) {
    // Check if multiselect is already initialized
    if (input.multiselectInitialized) {
      return;
    }
    
    // Find the multiselect container
    const multiselectContainer = input.closest('.multiselect');
    if (!multiselectContainer) {
      return;
    }
    
    // Create dropdown list if it doesn't exist
    let dropdownList = multiselectContainer.querySelector('.multiselect__content-wrapper, .multiselect__options, ul');
    
    if (!dropdownList) {
      // Create dropdown wrapper
      const wrapper = document.createElement('div');
      wrapper.className = 'multiselect__content-wrapper';
      wrapper.style.cssText = 'position: absolute; top: 100%; left: 0; right: 0; background: white; border: 1px solid #ccc; border-radius: 4px; max-height: 300px; overflow-y: auto; z-index: 1000; display: none;';
      
      const ul = document.createElement('ul');
      ul.className = 'multiselect__options';
      ul.setAttribute('role', 'listbox');
      ul.id = 'listbox-' + input.id;
      
      // Add options
      options.forEach((leader, index) => {
        const li = document.createElement('li');
        li.className = 'multiselect__option';
        li.setAttribute('role', 'option');
        li.id = input.id + '-' + index;
        li.textContent = leader;
        li.style.cssText = 'padding: 8px 12px; cursor: pointer; list-style: none;';
        
        // Hover effect
        li.addEventListener('mouseenter', function() {
          this.style.backgroundColor = '#f0f0f0';
        });
        li.addEventListener('mouseleave', function() {
          this.style.backgroundColor = '';
        });
        
        // Click handler
        li.addEventListener('click', function() {
          input.value = leader;
          input.setAttribute('value', leader);
          // Trigger change event
          const event = new Event('change', { bubbles: true });
          input.dispatchEvent(event);
          // Hide dropdown
          wrapper.style.display = 'none';
        });
        
        ul.appendChild(li);
      });
      
      wrapper.appendChild(ul);
      multiselectContainer.style.position = 'relative';
      multiselectContainer.appendChild(wrapper);
      dropdownList = wrapper;
    }
    
    // Add click handler to input to show dropdown
    input.addEventListener('focus', function() {
      if (dropdownList) {
        dropdownList.style.display = 'block';
      }
    });
    
    // Add click handler to multiselect container
    const multiselectTags = multiselectContainer.querySelector('.multiselect__tags');
    if (multiselectTags) {
      multiselectTags.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (dropdownList) {
          const isHidden = dropdownList.style.display === 'none' || !dropdownList.style.display;
          dropdownList.style.display = isHidden ? 'block' : 'none';
        }
        input.focus();
      });
      
      // Also add click to placeholder
      const placeholder = multiselectTags.querySelector('.multiselect__placeholder');
      if (placeholder) {
        placeholder.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          if (dropdownList) {
            dropdownList.style.display = 'block';
          }
          input.focus();
        });
      }
    }
    
    // Also add click to entire multiselect container (with capture to override existing handlers)
    multiselectContainer.addEventListener('click', function(e) {
      if (!dropdownList || e.target.closest('.multiselect__option')) {
        return;
      }
      if (dropdownList) {
        dropdownList.style.display = 'block';
      }
      input.focus();
    }, true); // Use capture phase to fire before other handlers
    
    // Force show dropdown when clicking directly on multiselect__tags
    if (multiselectTags) {
      multiselectTags.style.cursor = 'pointer';
      multiselectTags.style.userSelect = 'none';
    }
    
    // Filter options on input
    input.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase();
      const options = dropdownList.querySelectorAll('.multiselect__option, li');
      
      options.forEach(option => {
        const text = option.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
          option.style.display = '';
        } else {
          option.style.display = 'none';
        }
      });
      
      if (dropdownList) {
        dropdownList.style.display = 'block';
      }
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
      if (!multiselectContainer.contains(e.target)) {
        if (dropdownList) {
          dropdownList.style.display = 'none';
        }
      }
    });
    
    input.multiselectInitialized = true;
  }

  // Initialize when DOM is ready
  function init() {
    // Initialize country selector
    initCountrySelector();
    
    // Initialize AO Leaders dropdown
    initAOLeadersDropdown();
    
    // Find all forms on the page
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      // Add submit event listener
      form.addEventListener('submit', async function(e) {
        e.preventDefault(); // Prevent default form submission
        
        // Collect form data
        const formData = collectFormData(form);
        
        // Check if we have any data
        if (Object.keys(formData).length === 0) {
          showNotification('Please fill in at least one field', false);
          return;
        }
        
        // Show loading state
        const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
        const originalText = submitButton ? submitButton.textContent || submitButton.value : '';
        if (submitButton) {
          submitButton.disabled = true;
          if (submitButton.textContent !== undefined) {
            submitButton.textContent = 'Submitting...';
          } else {
            submitButton.value = 'Submitting...';
          }
        }
        
        // Submit to backend
        const success = await submitFormData(formData);
        
        // Restore button state
        if (submitButton) {
          submitButton.disabled = false;
          if (submitButton.textContent !== undefined) {
            submitButton.textContent = originalText;
          } else {
            submitButton.value = originalText;
          }
        }
        
        // If successful, redirect to webinar page
        if (success) {
          // Show success message briefly, then redirect
          setTimeout(() => {
            window.location.href = REDIRECT_URL;
          }, 1000); // Wait 1 second to show success message
        }
      });
    });

    // Also handle standalone input fields (if they have a submit button nearby)
    const submitButtons = document.querySelectorAll('button[type="submit"], input[type="submit"]');
    submitButtons.forEach(button => {
      if (!button.closest('form')) {
        // Button is not in a form, find nearest form or create a wrapper
        button.addEventListener('click', async function(e) {
          e.preventDefault();
          
          // Find all inputs in the same container
          const container = button.closest('div, section, article') || document.body;
          const inputs = container.querySelectorAll('input, textarea, select');
          
          const formData = {};
          inputs.forEach(input => {
            if (input.type === 'button' || input.type === 'submit' || input.type === 'reset') {
              return;
            }
            
            let fieldName = input.name || input.id || input.placeholder || input.type;
            let value = '';
            
            if (input.type === 'checkbox' || input.type === 'radio') {
              if (input.checked) {
                value = input.value || 'checked';
              } else {
                return;
              }
            } else if (input.tagName === 'SELECT') {
              value = input.options[input.selectedIndex]?.value || '';
            } else {
              value = input.value || '';
            }
            
            if (value && value.trim() !== '') {
              formData[fieldName] = value.trim();
            }
          });
          
          if (Object.keys(formData).length > 0) {
            const success = await submitFormData(formData);
            // If successful, redirect to webinar page
            if (success) {
              setTimeout(() => {
                window.location.href = REDIRECT_URL;
              }, 1000); // Wait 1 second to show success message
            }
          }
        });
      }
    });

    // Handle register buttons specifically (by text content or ID)
    const registerButtons = document.querySelectorAll(
      'button, input[type="button"], a.button, .register-button, [id*="register"], [class*="register"]'
    );
    
    registerButtons.forEach(button => {
      const buttonText = (button.textContent || button.value || button.innerText || '').toLowerCase();
      const buttonId = (button.id || '').toLowerCase();
      const buttonClass = (button.className || '').toLowerCase();
      
      // Check if this is a register button
      if (buttonText.includes('register') || buttonId.includes('register') || buttonClass.includes('register')) {
        // Only handle if not already handled by form submission
        if (!button.closest('form') || button.type !== 'submit') {
          button.addEventListener('click', async function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Find the form this button belongs to, or find all inputs on the page
            let formElement = button.closest('form');
            let formData = {};
            
            if (formElement) {
              formData = collectFormData(formElement);
            } else {
              // Collect all form data from the page
              const allInputs = document.querySelectorAll('input, textarea, select');
              allInputs.forEach(input => {
                if (input.type === 'button' || input.type === 'submit' || input.type === 'reset') {
                  return;
                }
                
                let fieldName = input.name || input.id || input.placeholder || input.type;
                let value = '';
                
                if (input.type === 'checkbox' || input.type === 'radio') {
                  if (input.checked) {
                    value = input.value || 'checked';
                  } else {
                    return;
                  }
                } else if (input.tagName === 'SELECT') {
                  value = input.options[input.selectedIndex]?.value || '';
                } else {
                  value = input.value || '';
                }
                
                if (value && value.trim() !== '') {
                  formData[fieldName] = value.trim();
                }
              });
            }
            
            // Check if we have form data
            if (Object.keys(formData).length === 0) {
              showNotification('Please fill in at least one field', false);
              return;
            }
            
            // Show loading state
            const originalText = button.textContent || button.value || button.innerText;
            button.disabled = true;
            if (button.textContent !== undefined) {
              button.textContent = 'Submitting...';
            } else if (button.value !== undefined) {
              button.value = 'Submitting...';
            }
            
            // Submit to backend
            const success = await submitFormData(formData);
            
            // Restore button state
            button.disabled = false;
            if (button.textContent !== undefined) {
              button.textContent = originalText;
            } else if (button.value !== undefined) {
              button.value = originalText;
            }
            
            // If successful, redirect to webinar page
            if (success) {
              setTimeout(() => {
                window.location.href = REDIRECT_URL;
              }, 1000); // Wait 1 second to show success message
            }
          });
        }
      }
    });
    
    // Re-initialize country selector after forms are set up
    setTimeout(initCountrySelector, 1000);
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Also try to initialize country selector and AO Leaders when window loads
  window.addEventListener('load', function() {
    setTimeout(initCountrySelector, 500);
    setTimeout(initAOLeadersDropdown, 1000);
  });
  
  // Re-initialize AO Leaders dropdown periodically (more aggressively)
  setInterval(function() {
    initAOLeadersDropdown();
  }, 500);
  
  // Make country selector clickable if it exists
  function makeCountrySelectorClickable() {
    const countrySelectors = document.querySelectorAll('.iti__selected-country, .iti__selected-flag, .iti__country-list');
    countrySelectors.forEach(selector => {
      selector.style.pointerEvents = 'auto';
      selector.style.cursor = 'pointer';
      selector.style.userSelect = 'none';
    });
  }
  
  // Run periodically to ensure country selector is clickable
  setInterval(makeCountrySelectorClickable, 1000);
})();

