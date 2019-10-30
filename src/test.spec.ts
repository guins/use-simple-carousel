import { renderHook, act } from '@testing-library/react-hooks'
import { useSimpleCarousel } from './'
import { ReactDOM } from 'react'

const defaultCarouselLength = 10

function testInitialState(initialIndex = 0, carouselLength = defaultCarouselLength) {
  const { result } = renderHook(() => useSimpleCarousel(carouselLength, 0, initialIndex))
  const realInitialIndex = initialIndex%carouselLength

  console.log('testInitialState', {carouselLength, initialIndex, realInitialIndex})

  expect(result.current.carouselState.current).toBe(realInitialIndex)
  expect(result.current.carouselState.last).toBe(-1)
  expect(result.current.carouselState.desired).toBe(-1)
  expect(result.current.carouselState.isTransitioning).toBe(false)
}

function testNext(initialIndex = 0, carouselLength = defaultCarouselLength) {
  const { result } = renderHook(() => useSimpleCarousel(carouselLength, 0, initialIndex))
  const realInitialIndex = initialIndex%carouselLength
  const nextIndex = (realInitialIndex+1)%carouselLength;

  console.log('testNext', {carouselLength, initialIndex, realInitialIndex, nextIndex})

  act(() => {
    result.current.next()
  })

  expect(result.current.carouselState.current).toBe(realInitialIndex)
  expect(result.current.carouselState.last).toBe(realInitialIndex)
  expect(result.current.carouselState.desired).toBe(nextIndex)
  expect(result.current.carouselState.isTransitioning).toBe(true)

  act(() => {
    result.current.onTransitionComplete()
  })

  expect(result.current.carouselState.current).toBe(nextIndex)
  expect(result.current.carouselState.last).toBe(realInitialIndex)
  expect(result.current.carouselState.desired).toBe(-1)
  expect(result.current.carouselState.isTransitioning).toBe(false)
}

function testPrev(initialIndex = 0, carouselLength = defaultCarouselLength) {
  const { result } = renderHook(() => useSimpleCarousel(carouselLength, 0, initialIndex))
  const realInitialIndex = initialIndex % carouselLength
  const prevIndex = (realInitialIndex - 1 + carouselLength) % carouselLength

  console.log('testPrev', {carouselLength, initialIndex, realInitialIndex, prevIndex})

  act(() => {
    result.current.prev()
  })

  expect(result.current.carouselState.current).toBe(realInitialIndex)
  expect(result.current.carouselState.last).toBe(realInitialIndex)
  expect(result.current.carouselState.desired).toBe(prevIndex)
  expect(result.current.carouselState.isTransitioning).toBe(true)

  act(() => {
    result.current.onTransitionComplete()
  })

  expect(result.current.carouselState.current).toBe(prevIndex)
  expect(result.current.carouselState.last).toBe(realInitialIndex)
  expect(result.current.carouselState.desired).toBe(-1)
  expect(result.current.carouselState.isTransitioning).toBe(false)
}

async function testAutoPlay(initialIndex = 0, carouselLength = defaultCarouselLength) {
  const { result, waitForNextUpdate } = renderHook(() => useSimpleCarousel(carouselLength, 500, initialIndex))
  const realInitialIndex = initialIndex%carouselLength
  const nextIndex = (realInitialIndex+1)%carouselLength;

  console.log('testAutoPlay', {carouselLength, initialIndex, realInitialIndex, nextIndex})

  await waitForNextUpdate()

  console.log('-> testAutoPlay', result.current.carouselState)

  expect(result.current.carouselState.current).toBe(realInitialIndex)
  expect(result.current.carouselState.last).toBe(realInitialIndex)
  expect(result.current.carouselState.desired).toBe(nextIndex)
  expect(result.current.carouselState.isTransitioning).toBe(true)

  act(() => {
    result.current.onTransitionComplete()
  })

  console.log('-> testAutoPlay', result.current.carouselState)

  expect(result.current.carouselState.current).toBe(nextIndex)
  expect(result.current.carouselState.last).toBe(realInitialIndex)
  expect(result.current.carouselState.desired).toBe(-1)
  expect(result.current.carouselState.isTransitioning).toBe(false)
}

describe('useSimpleCarousel', () => {
  test('should return object with keys: carouselState, next, prev, goTo, onTransitionComplete', () => {
    const { result } = renderHook(() => useSimpleCarousel(defaultCarouselLength))

    expect(result.current).toHaveProperty('carouselState')
    expect(result.current).toHaveProperty('next')
    expect(result.current).toHaveProperty('prev')
    expect(result.current).toHaveProperty('goTo')
    expect(result.current).toHaveProperty('onTransitionComplete')
  })

  test('test initial values with default properties', () => {
    testInitialState()
  })

  test('test initial values with initial index 13', () => {
    testInitialState(12)
  })

  test('test next with default settings', () => {
    testNext()
  })

  test('test next with initial index max', () => {
    testNext(defaultCarouselLength-1)
  })

  test('test next with initial index > carousel length', () => {
    testNext(defaultCarouselLength+2)
  })

  test('test prev with default setting', () => {
    testPrev()
  })

  test('test prev with initial index 1', () => {
    testPrev(1)
  })

  test('test next with initial index > carousel length', () => {
    testPrev(defaultCarouselLength+3)
  })

  test('test autoPlay', async () => {
    await testAutoPlay()
  })

  test('test autoPlay with initial index 5', async () => {
    await testAutoPlay(5)
  })

  test('test autoPlay with initial index > carousel length', async () => {
    await testAutoPlay(defaultCarouselLength*2+1)
  })
})
