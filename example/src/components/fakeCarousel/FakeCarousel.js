import './FakeCarousel.css'
import React from 'react';
import { useEffect, useMemo } from 'react';

import { useSimpleCarousel } from '@guins/use-simple-carousel'

export function FakeCarousel() {
  const itemsLength = 5 // number of items in your carousel
  const autoPlayInterval = 0 // interval in milliseconds (no autoPlay if 0) [default = 0]
  const initialIndex = 0 // initial carousel index [default = 0]
  const {carouselState, next, prev, goTo, onTransitionComplete} = useSimpleCarousel(itemsLength, autoPlayInterval, initialIndex)

  // generate random carousel index
  let randomIndex = useMemo(() => {
    const indexMax = itemsLength - 1
    let index = Math.floor(Math.random()*indexMax)

    // Prevent random index to be same as current one
    if(index === carouselState.current) {
      // Keep index between 0 and indexMax (loop)
      index = index < itemsLength - 1
        ? carouselState.current + 1
        : 0
    }

    return index
  }, [carouselState])

  useEffect(() => {
    // your custom transition here
    if(carouselState.isTransitioning) {
      const timeoutId = setTimeout(() => {
        onTransitionComplete()
      }, 1000)

      return () => clearTimeout(timeoutId)
    }
  }, [carouselState, onTransitionComplete])

  return (
    <div className="MyCarousel">
      <div className="MyCarousel_output">
        {JSON.stringify(carouselState)}
      </div>
      <div className="MyCarousel_controls">
        <button
          className="MyCarousel_btn MyCarousel_btn-prev"
          onClick={prev}
        >
          prev
        </button>
        <button
          className="MyCarousel_btn MyCarousel_btn-next"
          onClick={next}
        >
          next
        </button>
        <button
          className="MyCarousel_btn MyCarousel_btn-goto"
          onClick={() => goTo(randomIndex)}
        >
          goTo random index ({randomIndex})
        </button>
      </div>
    </div>
  )
}
