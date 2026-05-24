const KEY = 'interviews_map';

export const getInterviewCache = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
};

export const saveInterview = (applicationID, interview) => {
  const cache = getInterviewCache();
  cache[applicationID] = interview;
  localStorage.setItem(KEY, JSON.stringify(cache));
};

export const getInterviewByApplication = (applicationID) => {
  const cache = getInterviewCache();
  return cache[applicationID] || null;
};

export const updateInterviewResult = (applicationID, result) => {
  const cache = getInterviewCache();
  if (cache[applicationID]) {
    cache[applicationID].status = 'COMPLETED';
    cache[applicationID].result = result;
    localStorage.setItem(KEY, JSON.stringify(cache));
  }
};