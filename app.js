// GSAP 플러그인 등록
gsap.registerPlugin(ScrollTrigger);


// ==========================================================================
// 로딩 애니메이션
// ==========================================================================
const playLoadingAnimation = () => {
    // Promise를 반환하여 애니메이션 종료 시점을 알려줌
    return new Promise(resolve => {
        const loadingText = Array.from(document.querySelectorAll('.c-loading__text span'));
        const topHalf = document.querySelector('.c-loading__top');
        const bottomHalf = document.querySelector('.c-loading__bottom');
        const loadingContainer = document.querySelector('.c-loading');
        
        // 텍스트 홀수/짝수 분리
        const oddTexts = loadingText.filter((_, i) => i % 2 === 0);
        const evenTexts = loadingText.filter((_, i) => i % 2 !== 0);

        // 초기 위치 설정
        gsap.set(oddTexts, { y: '-100%' });
        gsap.set(evenTexts, { y: '100%' });

        const tl = gsap.timeline({
            onComplete: () => {
                document.body.style.overflow = ''; // 스크롤 잠금 해제
                resolve(); // Promise 완료
            }
        });

        tl.to(loadingText, {
            y: '0%',
            duration: 1,
            ease: 'expo.inOut',
            stagger: 0.05
        }, 0.5)
        .to(oddTexts, {
            y: '-100%',
            duration: 1,
            ease: 'expo.inOut',
            stagger: 0.05
        }, '+=0.3')
        .to(evenTexts, {
            y: '100%',
            duration: 1,
            ease: 'expo.inOut',
            stagger: 0.05
        }, '<')
        .to(topHalf, {
            y: '-100%',
            ease: 'expo.inOut',
            duration: 1.2
        }, '-=0.8')
        .to(bottomHalf, {
            y: '100%',
            ease: 'expo.inOut',
            duration: 1.2
        }, '<')
        .set(loadingContainer, { display: 'none' });
    });
};

// ==========================================================================
// 전역 변수 및 헬퍼 함수
// ==========================================================================
let scrollerElement = null; // Lenis 스크롤 컨테이너
const MOBILE_BREAKPOINT = 767;
const isMobileDevice = "ontouchstart" in document.documentElement;

// 페이지 타이틀 애니메이션 (페이지 로드 시 실행)
const animatePageTitle = () => {
  const title1 = document.querySelectorAll("[data-page-title] .show");
  const title2 = document.querySelectorAll("[data-page-title02] .show");

  const tl = gsap.timeline();
  if (title1.length > 0) {
    tl.to(title1, { y: "0%", duration: 1.6, ease: "power4.out", stagger: { from: "start", each: 0.02 } }, 0);
  }
  if (title2.length > 0) {
    tl.to(title2, { y: "0%", duration: 1.6, ease: "power4.out", stagger: { from: "start", each: 0.02 } }, 0);
  }
};

// 네비게이션 현재 메뉴 활성화
const setActiveNavigation = () => {
    const currentPage = window.location.pathname.split('/').pop(); // e.g., "index.html", "about.html"
    let navKey = 'home'; // 기본값

    if (currentPage.includes('about')) {
        navKey = 'about';
    } else if (currentPage.includes('selected')) {
        navKey = 'selected';
    } else if (currentPage.includes('archive')) {
        navKey = 'archive';
    } else if (currentPage.includes('faint-film') || currentPage.includes('pf-version6')) {
        // 상세 페이지들은 'selected' 메뉴를 활성화
        navKey = 'selected';
    }

    const activeNav = document.querySelector(`.l-header__list[data-nav="${navKey}"]`);
    if (activeNav) {
        activeNav.classList.add('is-current');
    }
}

// ==========================================================================
// Lenis (부드러운 스크롤) 설정
// ==========================================================================
const initSmoothScroll = () => {
  const wrapper = document.querySelector(".lenis");
  if (!wrapper) return;

  const lenis = new Lenis({
    wrapper: wrapper,
    content: document.querySelector(".main"),
    duration: 1.1,
    wheelMultiplier: 0.6,
  });
  window.lenis = lenis;

  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);
  scrollerElement = wrapper;
};

// ==========================================================================
// 공통 애니메이션
// ==========================================================================
const initCommonAnimations = () => {
    if (!scrollerElement) return;

    // 푸터 텍스트 애니메이션
    const footerTexts = document.querySelectorAll("[data-footer-type] .show");
    if (footerTexts.length > 0) {
        gsap.to(footerTexts, {
            y: "0%",
            duration: 1.4,
            ease: "power4.out",
            scrollTrigger: {
                trigger: ".l-footer",
                scroller: scrollerElement,
                start: "top 80%", // 더 빨리 보이도록 조정
            },
            stagger: { from: "start", each: 0.03 },
        });
    }
};

// ==========================================================================
// 페이지별 애니메이션
// ==========================================================================

// --- 홈 (home) ---
const initHomeAnimations = () => {
  if (!scrollerElement) return;

  gsap.to(".p-home-mv__background img", {
    y: "30%",
    scrollTrigger: { trigger: document.body, start: "10px top", end: "+=1400px", scrub: true, scroller: scrollerElement },
  });
  gsap.to(".p-home-archive__background-inner", {
    y: "20%",
    scrollTrigger: { trigger: ".p-home-archive__background", start: "top 90%", end: "bottom 5%", scrub: true, scroller: scrollerElement },
  });

  document.querySelectorAll("[data-text-container]").forEach((container) => {
    gsap.to(container.querySelectorAll("[data-text-show]"), {
      y: "0%", duration: 1.4, ease: "power4.out",
      scrollTrigger: { trigger: container, scroller: scrollerElement, start: "top 80%" },
      stagger: { from: "start", each: 0.1 },
    });
  });
};

// --- 싱글 (single) ---
const initSinglePageAnimations = () => {
  if (!scrollerElement) return;
  
  gsap.to(".p-single-mv__background img", {
    y: "30%",
    scrollTrigger: { trigger: document.body, start: "10px top", end: "+=1400px", scrub: true, scroller: scrollerElement },
  });
  
  if (window.innerWidth > MOBILE_BREAKPOINT && !isMobileDevice) {
    document.querySelectorAll(".p-single-images__item").forEach((item) => {
      gsap.fromTo(item,
        { clipPath: "inset(0% 0% 100% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 3, ease: "power4.out",
          scrollTrigger: { trigger: item, start: "top 80%", scroller: scrollerElement }
        }
      );
    });
  }

  gsap.to(".p-single-next a span", {
    y: "0%", duration: 1.8, ease: "power4.out",
    scrollTrigger: { trigger: ".p-single-next", start: "top 80%", scroller: scrollerElement },
    stagger: { from: "start", each: 0.03 },
  });
};


// ==========================================================================
// 페이지 로드 시 실행
// ==========================================================================
document.addEventListener("DOMContentLoaded", async () => {
  await playLoadingAnimation(); // 0. 로딩 애니메이션 완료 대기
  
  setActiveNavigation(); // 1. 네비게이션 활성화
  initSmoothScroll();   // 2. 부드러운 스크롤 초기화
  animatePageTitle();   // 3. 페이지 타이틀 애니메이션
  initCommonAnimations(); // 4. 공통 애니메이션(푸터 등) 초기화

  // 5. 현재 페이지 ID에 따라 특정 애니메이션 실행
  const pageId = document.body.id;
  switch (pageId) {
    case "page-home":
      initHomeAnimations();
      break;
    case "page-single":
      initSinglePageAnimations();
      break;
  }
});