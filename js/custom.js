
  (function ($) {
  
  "use strict";

    // MENU
    $('.navbar-collapse a').on('click',function(){
      $(".navbar-collapse").collapse('hide');
    });
    
    // CUSTOM LINK
    $('.smoothscroll').click(function(){
      var el = $(this).attr('href');
      var elWrapped = $(el);
      var header_height = $('.navbar').height();
  
      scrollToDiv(elWrapped,header_height);
      return false;
  
      function scrollToDiv(element,navheight){
        var offset = element.offset();
        var offsetTop = offset.top;
        var totalScroll = offsetTop-0;
  
        $('body,html').animate({
        scrollTop: totalScroll
        }, 300);
      }
    });

    $('.owl-carousel').owlCarousel({
        center: true,
        loop: true,
        margin: 30,
        autoplay: true,
        responsiveClass: true,
        responsive:{
            0:{
                items: 2,
            },
            767:{
                items: 3,
            },
            1200:{
                items: 4,
            }
        }
    });
  
  })(window.jQuery);

  const stutorText = document.getElementById('stutor-text');
    const textToType = "STUTOR.";
    let charIndex = 0;
    let isDeleting = false;

    function typeWriter() {
        const currentText = textToType.substring(0, charIndex);
        
        if (!isDeleting && charIndex < textToType.length) {
            stutorText.textContent = currentText;
            charIndex++;
            setTimeout(typeWriter, 200); 
        } else if (isDeleting && charIndex > 0) {
            stutorText.textContent = currentText.slice(0, -1); // Remove last character smoothly
            charIndex--;
            setTimeout(typeWriter, 100); 
        } else {
            isDeleting = !isDeleting;
            stutorText.style.opacity = isDeleting ? 0 : 1; // Fade out/in for smoother transition
            setTimeout(typeWriter, 300); 
        }
    }

    typeWriter();
    window.onload = function() {
      const gifs = [
        'https://mir-s3-cdn-cf.behance.net/project_modules/disp/65626933112811.56a01870441f4.gif',
        'https://media.giphy.com/media/SWoSkN6DxTszqIKEqv/giphy.gif',
        'https://cdn.dribbble.com/users/1233499/screenshots/3900568/education.gif'
      ];

      const gifElement = document.getElementById('random-gif');

      function changeGif() {
        // Fade out the current GIF
        gifElement.style.opacity = 0;
      
        setTimeout(() => {
          const randomIndex = Math.floor(Math.random() * gifs.length);
          gifElement.src = gifs[randomIndex];
      
          // Fade in the new GIF after a short delay
          gifElement.style.opacity = 1;
      
          // Schedule the next GIF change after the transition completes
          setTimeout(changeGif, 5500); // 5000ms (GIF duration) + 500ms (transition duration)
        }, 500); // Transition duration
      }
      
      // Change GIF initially on page load
      changeGif();
    }