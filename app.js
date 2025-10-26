// GSAP 플러그인 등록
gsap.registerPlugin(ScrollTrigger);

// ==========================================================================
// 헬퍼 변수 및 함수
// ==========================================================================
const scrollerElement = document.querySelector(".lenis");

/**
 * 페이지 타이틀 등장 애니메이션 (페이지 로드 후 실행)
 */
const animatePageTitleOnLoad = () => {
    const titleElements = document.querySelectorAll("[data-page-title] .show");
    if (titleElements.length > 0) {
        gsap.to(titleElements, {
            y: "0%",
            duration: 1.6,
            ease: "power4.out",
            stagger: { from: "start", each: 0.02 }
        });
    }
};

/**
 * 스크롤에 따라 네비게이션 메뉴를 활성화하는 함수
 */
const initNavHighlightingOnScroll = () => {
    const navLinks = gsap.utils.toArray('.l-header__list');
    const sections = gsap.utils.toArray('section[id]');

    sections.forEach((section, i) => {
        ScrollTrigger.create({
            trigger: section,
            scroller: scrollerElement,
            start: "top center",
            end: "bottom center",
            // 섹션이 뷰포트 중앙에 들어오고 나갈 때마다 실행
            onToggle: (self) => {
                if (self.isActive) {
                    // 모든 메뉴에서 'is-current' 클래스 제거
                    navLinks.forEach(link => link.classList.remove('is-current'));
                    // 현재 섹션에 해당하는 메뉴에만 'is-current' 클래스 추가
                    // sections[i]는 현재 섹션, navLinks[i]는 순서가 같은 네비게이션 링크를 의미
                    if (navLinks[i]) {
                        navLinks[i].classList.add('is-current');
                    }
                }
            },
        });
    });
};

// ==========================================================================
// 애니메이션 초기화
// ==========================================================================

/**
 * 로딩 애니메이션
 * @returns {Promise} 애니메이션 완료 시 resolve되는 Promise
 */
const playLoadingAnimation = () => {
    return new Promise(resolve => {
        const loadingText = Array.from(document.querySelectorAll('.c-loading__text span'));
        const topHalf = document.querySelector('.c-loading__top');
        const bottomHalf = document.querySelector('.c-loading__bottom');
        const loadingContainer = document.querySelector('.c-loading');
        
        const oddTexts = loadingText.filter((_, i) => i % 2 === 0);
        const evenTexts = loadingText.filter((_, i) => i % 2 !== 0);

        gsap.set(oddTexts, { y: '-100%' });
        gsap.set(evenTexts, { y: '100%' });

        const tl = gsap.timeline({
            onComplete: () => {
                document.body.style.overflow = ''; // 스크롤 잠금 해제
                resolve(); // Promise 완료
            }
        });

        tl.to(loadingText, { y: '0%', duration: 1, ease: 'expo.inOut', stagger: 0.05 }, 0.5)
          .to(oddTexts, { y: '-100%', duration: 1, ease: 'expo.inOut', stagger: 0.05 }, '+=0.3')
          .to(evenTexts, { y: '100%', duration: 1, ease: 'expo.inOut', stagger: 0.05 }, '<')
          .to(topHalf, { y: '-100%', ease: 'expo.inOut', duration: 1.2 }, '-=0.8')
          .to(bottomHalf, { y: '100%', ease: 'expo.inOut', duration: 1.2 }, '<')
          .set(loadingContainer, { display: 'none' });
    });
};

/**
 * Lenis를 사용한 부드러운 스크롤 설정
 */
const initSmoothScroll = () => {
    if (!scrollerElement) return;

    const lenis = new Lenis({
        wrapper: scrollerElement,
        content: document.querySelector(".main"),
        duration: 1.1,
        wheelMultiplier: 0.6,
    });

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
};

/**
 * 스크롤 기반 공통 애니메이션 설정 (푸터, 텍스트 등장 등)
 */
const initScrollBasedAnimations = () => {
    if (!scrollerElement) return;

    // 2. 각 섹션의 텍스트가 아래에서 위로 등장하는 효과
    document.querySelectorAll("[data-text-container]").forEach((container) => {
        const textElements = container.querySelectorAll("[data-text-show]");
        if (textElements.length > 0) {
            gsap.to(textElements, {
                y: "0%",
                duration: 1.4,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: container,
                    scroller: scrollerElement,
                    start: "top 80%"
                },
                stagger: { from: "start", each: 0.1 },
            });
        }
    });

    // 3. 푸터 텍스트 애니메이션
    const footerTexts = document.querySelectorAll("[data-footer-type] .show");
    if (footerTexts.length > 0) {
        gsap.to(footerTexts, {
            y: "0%",
            duration: 1.4,
            ease: "power4.out",
            scrollTrigger: {
                trigger: ".l-footer",
                scroller: scrollerElement,
                start: "top 80%",
            },
            stagger: { from: "start", each: 0.03 },
        });
    }
};

// ==========================================================================
// 페이지 로드 시 실행 로직
// ==========================================================================
document.addEventListener("DOMContentLoaded", async () => {
    const pageId = document.body.id;

    // 홈페이지('page-home')일 경우에만 모든 스크립트 실행
    if (pageId === "page-home") {
        // 비디오 기본 컨트롤러 숨기기
        const bgVideo = document.querySelector('video#bgVideo');
        if(bgVideo) {
            bgVideo.controls = false;
        }

        // 1. 로딩 애니메이션을 실행하고 끝날 때까지 기다림
        await playLoadingAnimation();

        // 2. 로딩이 끝난 후 나머지 기능들을 순차적으로 초기화
        initSmoothScroll();
        animatePageTitleOnLoad();
        initScrollBasedAnimations();
        initNavHighlightingOnScroll();
    }
});