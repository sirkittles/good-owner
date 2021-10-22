import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { DoggoContext } from '../../DoggoContext';
import { postFeedback, getStreak } from '../../services/auth.js';

const Feedback = () => {
  const {
    currentPet,
    activeUnit,
    setActiveUnit,
    mockFeedbackData,
    setTipData,
    tasks,
    setStreak,
  } = useContext(DoggoContext);

  async function handleClick(ev) {
    // modify the feedback val to move to next task or exit tasks
    const feedbackObj =
      mockFeedbackData[activeUnit.unit - 1][activeUnit.task - 1];

    const task = tasks[activeUnit.unit - 1].tasks[activeUnit.task - 1];

    const success = Boolean(Number(ev.target.value));
    const tip = task['tip'].filter(tip => tip.success === success).pop();

    const assessmentData = { task: task.id, pet: currentPet.id, success };
    postFeedback(assessmentData);

    setTipData(tip);

    if (success) {
      feedbackObj.great++;
    } else {
      feedbackObj.ruff++;
    }

    if (activeUnit.task < 4) activeUnit.task++;
    else {
      activeUnit.task = 1;
      const strk = await getStreak({ pet: currentPet.id, calculate: true });
      setStreak(strk.streak_value);
    }
    setActiveUnit(activeUnit);
  }

  return (
    <div className="feedback-page">
      <h1>
        How did  {currentPet ? currentPet.name : 'doggo'} do?
      </h1>
      <Link to="/tip">
        <button value="0" onClick={handleClick} className="ruffff">
          Ruffff
        </button>
        <button value="1" onClick={handleClick} className="great">
          Great
        </button>
      </Link>
    </div>
  );
};

export default Feedback;
