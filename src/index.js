import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './index.css';
import FlipMove from 'react-flip-move';
import crown from './assets/crown.png';
import silverMedal from './assets/silver_medal.png';
import bronzeMedal from './assets/bronze_medal.png';

function rankingsSort(a, b) {
  if (a.score > b.score) {
    return -1;
  } else if (a.score < b.score) {
    return 1;
  }
  return 0;
}

function Leaderboard(props) {
  const [rankings, setRankings] = useState([]);
  const rankingsMap = useRef(new Map());

  React.useEffect(() => {
    const listItems = [];
    // we must make a copy of the contestants array to not mutate the parent state
    const contestantsCopy = props.contestants.slice();
    contestantsCopy.sort(rankingsSort).forEach((contestant, index) => {
      let previousIndex = -1;
      let styleName = '';
      if (rankingsMap.current.has(contestant.name)) {
        previousIndex = rankingsMap.current.get(contestant.name);
      }
      switch (previousIndex) {
        case 0:
          styleName = 'cell--first-place';
          break;
        case 1:
          styleName = 'cell--second-place';
          break;
        case 2:
          styleName = 'cell--third-place';
          break;
        default:
          switch (index) {
            case 0:
              styleName = 'cell--first-place';
              break;
            case 1:
              styleName = 'cell--second-place';
              break;
            case 2:
              styleName = 'cell--third-place';
              break;
            default:
              break;
          }
          break;
      }
      listItems.push(
        <Row
          contestant={contestant}
          key={contestant.name}
          style={styleName}
          place={index}
        ></Row>
      );
      rankingsMap.current.set(contestant.name, index);
    });
    setRankings(listItems);
  }, [props.contestants]);

  return (
    <div className="rankings-table">
      <FlipMove enterAnimation={false} delay={4000}>
        {rankings}
      </FlipMove>
    </div>
  );
}

const Row = React.forwardRef(function rowRender(props, ref) {
  const [score, setScore] = useState(props.contestant.score);
  const [styling, setStyling] = useState(props.style);
  const duration = 5000;

  // Use useRef for mutable variables that we want to persist
  // without triggering a re-render on their change
  const requestRef = React.useRef();
  const startTimeRef = React.useRef();
  const start = React.useRef();
  const end = React.useRef();

  const animate = (time) => {
    if (!startTimeRef.current) startTimeRef.current = time;
    const deltaTime = time - startTimeRef.current;
    const progress = Math.min(deltaTime / duration, 1);
    const newScore = Math.floor(
      progress * (end.current - start.current) + start.current
    );
    setScore(newScore); // Every call to setScore causes component to re-render
    if (progress < 1) {
      requestRef.current = window.requestAnimationFrame(animate);
    }
  };

  React.useLayoutEffect(() => {
    start.current = score;
    end.current = props.contestant.score;
    if (score !== props.contestant.score) {
      startTimeRef.current = null;
      requestRef.current = window.requestAnimationFrame(animate);
    }
    return () => window.cancelAnimationFrame(requestRef.current);
  }, [props.contestant.score]);

  const updateStyling = (place) => {
    classNames = 'cell ';
    switch (place) {
      case 0:
        setStyling('cell--first-place');
        break;
      case 1:
        setStyling('cell--second-place');
        break;
      case 2:
        setStyling('cell--third-place');
        break;
      default:
        setStyling('');
        break;
    }
  };

  React.useEffect(() => {
    setTimeout(updateStyling, 4000, props.place);
  }, [props.place]);

  let classNames = 'cell ';
  if (styling) {
    classNames += styling;
  }

  return (
    <div className={classNames} ref={ref}>
      <div className="cell__name">{props.contestant.name}</div>
      <img className="cell__medal crown" src={crown}></img>
      <img className="cell__medal silver" src={silverMedal}></img>
      <img className="cell__medal bronze" src={bronzeMedal}></img>
      <div className="cell__score">{score}</div>
    </div>
  );
});

Leaderboard.propTypes = {
  contestants: PropTypes.array
};

Row.propTypes = {
  contestant: PropTypes.object,
  setRef: PropTypes.func,
  animation: PropTypes.object,
  style: PropTypes.string,
  place: PropTypes.number
};

export { Leaderboard };
