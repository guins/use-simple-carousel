import React from 'react'

import {SimpleCarousel} from './components/simpleCarousel/SimpleCarousel'

const App = () => {
  return (
    <div>
      <SimpleCarousel
        items={['slide 1', 'slide 2', 'slide 3', 'slide 4', 'slide 5'].map((item, index) => {
          return <div
            className={`slide slide-${index}`}
            key={index}
          >
            {item}
          </div>
        })}
      />
    </div>
  )
}
export default App
