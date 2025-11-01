
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

  // Endless smooth typewriter (type, pause, delete, repeat)
  const stutorText = document.getElementById('stutor-text');
  const textToType = 'STUTOR.';
  let idx = 0;
  let deleting = false;
  function typeWriter() {
    if (!stutorText) return;
    stutorText.textContent = textToType.slice(0, idx);
    if (!deleting && idx < textToType.length) {
      idx++;
      setTimeout(typeWriter, 140); // slow typing
    } else if (deleting && idx > 0) {
      idx--;
      setTimeout(typeWriter, 90); // slightly faster delete
    } else {
      deleting = !deleting;
      setTimeout(typeWriter, deleting ? 1000 : 600); // hold before switching
    }
  }
  typeWriter();
    window.onload = function() {
      // Local assets; preload before swap and cross-fade
      const gifs = [
        './Prfi/physics2.gif',
        './Prfi/Graph%20Theory.gif',
        './Prfi/Dlfinal.gif',
        './Prfi/exams.gif',
        './Prfi/development.gif',
        './Prfi/devops.gif',
        './Prfi/0_2blaR2l8ZqJ-HAaV.gif',
        './Prfi/1_SazB8drLx74W-bFBqag9zA.gif'
      ];

      const gifElement = document.getElementById('random-gif');
      if (!gifElement) return;
      gifElement.style.opacity = 0;

      function preload(src) {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(src);
          img.onerror = reject;
          img.src = src;
        });
      }

      async function changeGif() {
        try {
          const next = gifs[Math.floor(Math.random() * gifs.length)];
          const src = await preload(next);
          // fade out
          gifElement.style.opacity = 0;
          setTimeout(() => {
            gifElement.src = src;
            // fade in
            requestAnimationFrame(() => {
              gifElement.style.opacity = 1;
            });
          }, 250);
        } catch {}
        // schedule next
        setTimeout(changeGif, 6000);
      }

  // Preload all for snappy swaps
      gifs.forEach((g) => { const i = new Image(); i.src = g; });
      // initial image from a random pick
      const initial = gifs[Math.floor(Math.random() * gifs.length)];
      preload(initial).then((src) => {
        gifElement.src = src;
        gifElement.style.opacity = 1;
        setTimeout(changeGif, 6000);
      }).catch(() => {
        gifElement.style.opacity = 1;
        setTimeout(changeGif, 6000);
      });
      // Force dark theme always
      document.body.classList.add('dark-theme');
    }