import defaultArray from '../data';
// smaller array for debugging
// var defaultArray = ['pouch', 'punch', 'lucky', 'truck', 'snail'];

// getSolution is equivalent to fetchData, it's called everytime the user make a correct answer or when the game ends
const getSolution = () => {
  let solutionArray: string[] = [];

  // Get solutionHistory from localStorage
  let solutionHistory: string[] = JSON.parse(
    localStorage.getItem('solutionsList') || '[]'
  );

  if (solutionHistory.length == 0) {
    // If the user hasn't played before, put the entire solutions array inside local storage
    solutionArray = defaultArray;
    localStorage.setItem('solutionsList', JSON.stringify(solutionArray));
  } else {
    // If it's available, continue using the array
    // When a round ends, there'll be a function in GameOverScreen that remove the correct solution from the array
    // The array will get smaller and smaller the longer the player keep up his win streaks
    solutionArray = solutionHistory;
  }

  // Get a random word from the array and return it
  // But first check if it's already available in localStorage, this prevent the solution from changing when the user refresh the page
  let randomNumber = JSON.parse(localStorage.getItem('randint') || 'null');
  if (!randomNumber) {
    randomNumber = Math.floor(Math.random() * solutionArray.length);
    localStorage.setItem('randint', JSON.stringify(randomNumber)); // This entry will be removed when resetBoard is called.
  }
  const solution = solutionArray[randomNumber];

  return {
    word: solution,
    streak: defaultArray.length - solutionArray.length,
    quantity: defaultArray.length,
  };
};

export { getSolution };
