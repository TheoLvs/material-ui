import React from 'react';

function getScrollY(ref) {
  return (ref ? ref.pageYOffset || ref.scrollTop : null) || 0;
}

function defaultTrigger(event, store, options) {
  const { disableHysteresis = true, threshold = 100 } = options;
  const previous = store.current;
  store.current = getScrollY(event && event.currentTarget);

  if (disableHysteresis) {
    if (store.current < previous) {
      return false;
    }
    return store.current > previous && store.current > threshold;
  }

  return store.current > threshold;
}

const defaultTarget = typeof window !== 'undefined' ? window : null;

export default function useScrollTrigger(options = {}) {
  const { getTrigger = defaultTrigger, target = defaultTarget, ...other } = options;
  const store = React.useRef();
  const [trigger, setTrigger] = React.useState(() => getTrigger(null, store, other));

  React.useEffect(() => {
    const handleScroll = event => {
      setTrigger(getTrigger(event, store, other));
    };

    target.addEventListener('scroll', handleScroll);
    return () => {
      target.removeEventListener('scroll', handleScroll);
    };
    // See Option 3. https://github.com/facebook/react/issues/14476#issuecomment-471199055
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, getTrigger, JSON.stringify(other)]);

  return trigger;
}
