# @guins/use-simple-carousel

> Simple Carousel React Hook - Manage the state of sequential elements being associated as carousel without any markup constraint

[![NPM](https://img.shields.io/npm/v/@guins/use-simple-carousel.svg)](https://www.npmjs.com/package/@guins/use-simple-carousel) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save @guins/use-simple-carousel
```

## Usage

See complete examples [here](./example/src/App.js)

```tsx
import * as React from 'react'
import { useEffect } from 'react'

import { useSimpleCarousel } from '@guins/use-simple-carousel'

export function FakeCarousel() {
  const itemsLength = 5 // number of items in your carousel
  const autoPlayInterval = 1000 // interval in milliseconds (no autoPlay if 0) [default = 0]
  const initialIndex = 0 // initial carousel index [default = 0]
  const {carouselState, next, prev, goTo, onTransitionComplete} = useSimpleCarousel(itemsLength, autoPlayInterval, initialIndex)

  useEffect(() => {
    console.log('didUpdate', carouselState)

    if(carouselState.isTransitioning) {
      // custom transition here (don't forget to call `onTransitionComplete` callback after)
      onTransitionComplete()
    }
  }, [carouselState, onTransitionComplete])

  return null
}
```

## License

MIT © [guins](https://github.com/guins)

---

This hook is created using [create-react-hook](https://github.com/hermanya/create-react-hook).
