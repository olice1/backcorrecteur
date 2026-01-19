// ================================
// JOWDEX Landing Page - Main JavaScript
// ================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // ================================
    // Form Validation & Submission
    // ================================
    const orderForm = document.getElementById('orderForm');
    
    if (orderForm) {
        orderForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Generate order reference
            const orderRef = 'JDX' + Date.now().toString().slice(-8);
            
            // Get form data
            const formData = {
                orderRef: orderRef,
                name: document.getElementById('name').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                email: document.getElementById('email').value.trim(),
                country: document.getElementById('country').value,
                city: document.getElementById('city').value.trim(),
                address: document.getElementById('address').value.trim(),
                size: document.getElementById('size').value,
                quantity: document.getElementById('quantity').value,
                notes: document.getElementById('notes').value.trim()
            };
            
            // Basic validation
            if (!formData.name || !formData.phone || !formData.country || !formData.city || !formData.address || !formData.size) {
                showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
                return;
            }
            
            // Phone validation (basic)
            const phoneRegex = /^[\d\s\+\-\(\)]+$/;
            if (!phoneRegex.test(formData.phone)) {
                showNotification('يرجى إدخال رقم هاتف صحيح', 'error');
                return;
            }
            
            // Email validation (if provided)
            if (formData.email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(formData.email)) {
                    showNotification('يرجى إدخال بريد إلكتروني صحيح', 'error');
                    return;
                }
            }
            
            // Disable submit button to prevent double submission
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.querySelector('.btn-text').textContent;
            submitBtn.disabled = true;
            submitBtn.querySelector('.btn-text').textContent = 'جاري الإرسال...';
            
            try {
                // Send to Google Sheets
                await sendToGoogleSheets(formData);
                
                // Track Facebook Pixel Lead Event
                if (typeof fbq !== 'undefined') {
                    fbq('track', 'Lead', {
                        value: CONFIG.LEAD_VALUE,
                        currency: CONFIG.CURRENCY,
                        content_name: 'Back Posture Corrector - ' + formData.size,
                        content_category: 'Health & Wellness'
                    });
                    console.log('✅ Facebook Pixel Lead event tracked');
                }
                
                // Track Google Analytics 4 Lead Event
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'generate_lead', {
                        currency: CONFIG.CURRENCY,
                        value: CONFIG.LEAD_VALUE,
                        items: [{
                            item_name: 'Back Posture Corrector',
                            item_category: 'Health & Wellness',
                            item_variant: formData.size,
                            quantity: parseInt(formData.quantity)
                        }]
                    });
                    console.log('✅ Google Analytics Lead event tracked');
                }
                
                // Store order ref for thank you page
                localStorage.setItem('lastOrderRef', orderRef);
                localStorage.setItem('lastOrderData', JSON.stringify(formData));
                
                // Show success and redirect
                showNotification('تم إرسال طلبك بنجاح! جاري التحويل...', 'success');
                
                // Redirect to thank you page after 1.5 seconds
                setTimeout(() => {
                    window.location.href = 'thank-you.html';
                }, 1500);
                
            } catch (error) {
                console.error('Error submitting form:', error);
                showNotification('حدث خطأ. يرجى المحاولة مرة أخرى', 'error');
                
                // Re-enable submit button
                submitBtn.disabled = false;
                submitBtn.querySelector('.btn-text').textContent = originalBtnText;
            }
        });
    }
    
    // ================================
    // Send Data to Google Sheets
    // ================================
    async function sendToGoogleSheets(data) {
        const url = CONFIG.GOOGLE_SHEET_URL;
        
        // If URL is not configured, skip
        if (!url || url.includes('YOUR_SCRIPT_ID')) {
            console.warn('⚠️ Google Sheets URL not configured');
            return;
        }
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                mode: 'no-cors', // Important for Google Apps Script
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            console.log('✅ Data sent to Google Sheets');
            return response;
        } catch (error) {
            console.error('❌ Error sending to Google Sheets:', error);
            throw error;
        }
    }
    
    // ================================
    // Smooth Scroll for Anchor Links
    // ================================
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ================================
    // Sticky CTA Show/Hide on Scroll
    // ================================
    const stickyCta = document.querySelector('.sticky-cta');
    const orderSection = document.querySelector('.order-section');
    
    if (stickyCta && orderSection) {
        window.addEventListener('scroll', function() {
            const orderSectionTop = orderSection.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            // Show sticky CTA if order section is not visible
            if (orderSectionTop > windowHeight) {
                stickyCta.style.display = 'block';
            } else {
                stickyCta.style.display = 'none';
            }
        });
    }
    
    // ================================
    // Scroll Tracking for Events
    // ================================
    let productGalleryTracked = false;
    let orderFormTracked = false;
    
    window.addEventListener('scroll', debounce(function() {
        // Track ViewContent when product gallery is viewed
        const productGallery = document.querySelector('.product-gallery');
        if (productGallery && !productGalleryTracked && isInViewport(productGallery)) {
            productGalleryTracked = true;
            
            // Facebook Pixel ViewContent
            if (typeof fbq !== 'undefined') {
                fbq('track', 'ViewContent', {
                    content_name: 'Back Posture Corrector',
                    content_category: 'Health & Wellness',
                    content_type: 'product'
                });
                console.log('✅ Facebook Pixel ViewContent tracked');
            }
            
            // GA4 view_item
            if (typeof gtag !== 'undefined') {
                gtag('event', 'view_item', {
                    items: [{
                        item_name: 'Back Posture Corrector',
                        item_category: 'Health & Wellness'
                    }]
                });
                console.log('✅ Google Analytics view_item tracked');
            }
        }
        
        // Track InitiateCheckout when order form is viewed
        if (orderSection && !orderFormTracked && isInViewport(orderSection)) {
            orderFormTracked = true;
            
            // Facebook Pixel InitiateCheckout
            if (typeof fbq !== 'undefined') {
                fbq('track', 'InitiateCheckout', {
                    content_name: 'Back Posture Corrector',
                    content_category: 'Health & Wellness'
                });
                console.log('✅ Facebook Pixel InitiateCheckout tracked');
            }
            
            // GA4 begin_checkout
            if (typeof gtag !== 'undefined') {
                gtag('event', 'begin_checkout', {
                    items: [{
                        item_name: 'Back Posture Corrector',
                        item_category: 'Health & Wellness'
                    }]
                });
                console.log('✅ Google Analytics begin_checkout tracked');
            }
        }
    }, 250));
    
    // ================================
    // Intersection Observer for Animations
    // ================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for fade-in animation
    const fadeElements = document.querySelectorAll('.feature-card, .detail-item, .lifestyle-text, .lifestyle-image');
    fadeElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
    
    // ================================
    // Input Focus Animation
    // ================================
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea, .form-group select');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
    
    // ================================
    // Notification System
    // ================================
    function showNotification(message, type = 'success') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            backgroundColor: type === 'success' ? '#10b981' : '#ef4444',
            color: 'white',
            fontSize: '1rem',
            fontWeight: '600',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
            zIndex: '9999',
            animation: 'slideInRight 0.3s ease',
            maxWidth: '90%',
            textAlign: 'center'
        });
        
        // Add to page
        document.body.appendChild(notification);
        
        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 4000);
    }
    
    // ================================
    // Add Notification Animations to CSS
    // ================================
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .form-group.focused label {
            color: var(--primary-orange);
        }
    `;
    document.head.appendChild(styleSheet);
    
    // ================================
    // Performance: Lazy Load Images
    // ================================
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
    }
    
    // ================================
    // Console Welcome Message
    // ================================
    console.log('%c🎯 JOWDEX Landing Page', 'color: #ff6b35; font-size: 20px; font-weight: bold;');
    console.log('%cالجودة التي تستحقونها. والتجربة التي تثقون بها', 'color: #1a2b4a; font-size: 14px;');
    
});

// ================================
// Helper Functions
// ================================

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}
