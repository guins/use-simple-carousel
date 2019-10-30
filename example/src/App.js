import React from 'react'

import {FakeCarousel} from './components/fakeCarousel/FakeCarousel'
import {SimpleCarousel} from './components/simpleCarousel/SimpleCarousel'

const App = () => {
  return (
    <div>
      <h1>useSimpleCarousel hook exemples</h1>

      <hr/>
      <h2>1/ FakeCarousel (print carousel hook state)</h2>
      <FakeCarousel />

      <hr/>
      <h2>2/ SimpleCarousel (functional carousel with all controls)</h2>
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
