import './SimpleCarousel.css'
import React from 'react';
import { useLayoutEffect, useRef } from 'react';
import { TimelineLite }  from "gsap/all";
import { useSimpleCarousel, ECarouselDirection } from '@guins/use-simple-carousel'

// Carousel Animation
function createSlideTransition(
  pCurrentSlideRef,
  pNextSlideRef,
  pTransitionDirection,
  pOnTransitionComplete // callback when transition is completed
) {
  const timeline = new TimelineLite({onComplete: pOnTransitionComplete});

  timeline.to(pCurrentSlideRef, 0.5, {
    autoAlpha: 0,
    x: pTransitionDirection === ECarouselDirection.RIGHT ? -100 : 100
  });

  timeline.fromTo(
    pNextSlideRef,
    0.5,
    {
      x: pTransitionDirection === ECarouselDirection.RIGHT ? 100 : -100
    },
    {
      autoAlpha: 1,
      x: 0
    }
  );

  return () => timeline.kill()
}

const component = 'SimpleCarousel'

export function SimpleCarousel({items}) {
  const {carouselState, next, prev, goTo, onTransitionComplete} = useSimpleCarousel(items.length)
  const itemsRef = useRef([]);

  // carousel didUpdate
  useLayoutEffect(() => {
    // if the carousel should be transitioning
    if (carouselState.isTransitioning) {
      // do the animation
      const cancelTransition = createSlideTransition(
        itemsRef.current[carouselState.current],
        itemsRef.current[carouselState.desired],
        carouselState.direction,
        onTransitionComplete
      );

      return ()=> cancelTransition()
    }
  }, [carouselState, onTransitionComplete]);

  return (
    <div className={`${component}`}>
      <div className={`${component}_controls`}>
        <span
          className={[
            `${component}_controlBtn`,
            carouselState.isTransitioning && 'is-disabled'
          ]
            .filter(v => v)
            .join(' ')}
          onClick={prev}
        >
          Prev
        </span>
        <span
          className={[
            `${component}_controlBtn`,
            carouselState.isTransitioning && 'is-disabled'
          ]
            .filter(v => v)
            .join(' ')}
          onClick={next}
        >
          Next
        </span>
      </div>
      <div className={`${component}_nav`}>
        {items.map((item, i) => {
          return (
            <span
              key={i}
              className={[
                `${component}_navItem`,
                carouselState.current === i && 'is-active',
                carouselState.isTransitioning && 'is-disabled'
              ]
                .filter(v => v)
                .join(' ')}
              onClick={() => goTo(i)}
            >
              {i+1}
            </span>
          );
        })}
      </div>
      <ul className={`${component}_slidesContainer`}>
        {items.map((item, i) => {
          return (
            <li
              ref={r => (itemsRef.current[i] = r)}
              key={i}
              className={`${component}_slide`}
            >
              {item}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
