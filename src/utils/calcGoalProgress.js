export const calcGoalProgress = (currentDistance = 0, totalDistance = 0) => {
    let progress = currentDistance ? (currentDistance / totalDistance) * 100 : 0;
    progress = progress > 100 ? 100 : progress;
    return progress
}