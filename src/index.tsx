import {useEffect, useReducer, useRef} from 'react';

export enum ECarouselDirection {
  LEFT,
  RIGHT
}

export interface ICarouselState {
  isTransitioning: boolean; // if carousel is currently transitioning
  current: number; // current slide index
  last: number; // last slide index
  desired: number; // next current slide index while it's transitioning
  direction: ECarouselDirection; // index direction (RIGHT/LEFT, depending on index update incrementing/decrementing)
}

// Get next slide index (in loop mode)
function getNextIndex(pLength: number, pCurrentIndex: number) {
  return (pCurrentIndex + 1) % pLength;
}

// Get prev slide index (in loop mode)
function getPrevIndex(pLength: number, pCurrentIndex: number) {
  return (pCurrentIndex - 1 + pLength) % pLength;
}

// Get real/safe slide index (not a duplicated one)
function getSafeIndex(pLength: number, pDesiredIndex: number) {
  return pDesiredIndex % pLength;
}

// Carousel default state
const defaultInitialCarouselState = {
  isTransitioning: false,
  desired: -1,
  current: 0,
  last: -1,
  direction: ECarouselDirection.LEFT
};

enum ECarouselAction {
  NEXT = 'next',
  PREV = 'prev',
  ON_TRANSITION_COMPLETE = 'onTransitionComplete',
  GO_TO = 'goTo'
}

export interface ICarouselNextAction {
  type: ECarouselAction.NEXT;
  length: number;
}

export interface ICarouselPrevAction {
  type: ECarouselAction.PREV;
  length: number;
}

export interface ICarouselGoToAction {
  type: ECarouselAction.GO_TO;
  length: number;
  desired: number;
}

export interface ICarouselTransitionCompleteAction {
  type: ECarouselAction.ON_TRANSITION_COMPLETE;
}

type ICarouselAction =
  | ICarouselNextAction
  | ICarouselPrevAction
  | ICarouselGoToAction
  | ICarouselTransitionCompleteAction;

// Reducer managing the carousel state, based on carousel actions
function carouselReducer(
  pState: ICarouselState,
  pAction: ICarouselAction
): ICarouselState {
  switch (pAction.type) {
    case ECarouselAction.PREV:
      return !pState.isTransitioning
        ? {
            ...pState,
            last: pState.current,
            desired: getPrevIndex(pAction.length, pState.current),
            direction: ECarouselDirection.LEFT,
            isTransitioning: true
          }
        : pState;
    case ECarouselAction.NEXT:
      return !pState.isTransitioning
        ? {
            ...pState,
            last: pState.current,
            desired: getNextIndex(pAction.length, pState.current),
            direction: ECarouselDirection.RIGHT,
            isTransitioning: true
          }
        : pState;
    case ECarouselAction.GO_TO:
      const safeDesired = getSafeIndex(pAction.length, pAction.desired);
      return !pState.isTransitioning && safeDesired !== pState.current
        ? {
            ...pState,
            desired: safeDesired,
            isTransitioning: true,
            direction:
              safeDesired > pState.current
                ? ECarouselDirection.RIGHT
                : ECarouselDirection.LEFT
          }
        : pState;
    case ECarouselAction.ON_TRANSITION_COMPLETE:
      return {
        ...pState,
        current: pState.desired,
        desired: -1,
        isTransitioning: false
      };
    default:
      return pState;
  }
}

/**
 * Simple Carousel Hook
 * @param pNumberOfSlides - Number of slides in Carousel
 * @param [pAutoPlayInterval - auto play interval in milliseconds. No auto play if set to 0 (default = 0)]
 * @param [pInitialIndex - carousel initial index (default = 0)]
 *
 * @returns{
 *   carouselState: ICarouselState,
 *   prev: ()=>void,
 *   next: ()=>void,
 *   goTo: (n)=>void,
 *   onTransitionComplete: ()=>void
 * }
 */
export const useSimpleCarousel = (
  pNumberOfSlides: number,
  pAutoPlayInterval: number = 0,
  pInitialIndex: number = 0
): {
  carouselState: ICarouselState,
  prev: () => void,
  next: () => void,
  goTo: (n: number) => void,
  onTransitionComplete: () => void
} => {
  // Carousel state
  const [state, dispatch] = useReducer(
    carouselReducer,
    Object.assign({}, defaultInitialCarouselState, {current: getSafeIndex(pNumberOfSlides, pInitialIndex)})
  );

  // Auto play timer ID
  const autoPlayDelayId = useRef<NodeJS.Timeout>();

  // Manage auto play
  useEffect(() => {
    // If a transition just completed
    // and their is an auto play interval
    if (!state.isTransitioning && pAutoPlayInterval) {
      autoPlayDelayId.current = setTimeout(() => {
        dispatch({type: ECarouselAction.NEXT, length: pNumberOfSlides});
      }, pAutoPlayInterval);

      return () => {
        if(autoPlayDelayId.current) {
          clearTimeout(autoPlayDelayId.current);
        }
      }
    }
    // If a transition just started
    // and their is a current auto play timeout
    // -> It means their is been a user interaction
    else if (state.isTransitioning && autoPlayDelayId.current) {
      // cancel the auto play timeout
      clearTimeout(autoPlayDelayId.current);
    }

    return undefined
  }, [state.isTransitioning, pNumberOfSlides]);

  return {
    carouselState: state,
    prev: () => dispatch({type: ECarouselAction.PREV, length: pNumberOfSlides}),
    next: () => dispatch({type: ECarouselAction.NEXT, length: pNumberOfSlides}),
    goTo: n => dispatch({type: ECarouselAction.GO_TO, length: pNumberOfSlides, desired: n}),
    onTransitionComplete: () => dispatch({type: ECarouselAction.ON_TRANSITION_COMPLETE}),
  };
};
