// Scoring utilities for all tests

export const URGENCY = {
  ROUTINE: 'routine',
  SOON: 'soon',
  URGENT: 'urgent',
  EMERGENCY: 'emergency',
};

export function scoreAcuity(results) {
  // results: { right: lastLineCorrect, left: lastLineCorrect }
  // Lines: 20/200, 20/100, 20/70, 20/50, 20/40, 20/30, 20/25, 20/20, 20/15
  const lines = [200, 100, 70, 50, 40, 30, 25, 20, 15];
  const score = (eyeResult) => {
    if (eyeResult === null || eyeResult === undefined) return { va: '20/200', pass: false };
    const va = lines[eyeResult] || 200;
    return {
      va: `20/${va}`,
      pass: va <= 40,
      warn: va > 40 && va <= 70,
      fail: va > 70,
    };
  };
  const right = score(results?.right);
  const left = score(results?.left);
  const worst = Math.max(
    lines[results?.right ?? 0] ?? 200,
    lines[results?.left ?? 0] ?? 200
  );
  return {
    right,
    left,
    status: worst <= 40 ? 'pass' : worst <= 70 ? 'warn' : 'fail',
    urgency: worst > 100 ? URGENCY.URGENT : worst > 40 ? URGENCY.SOON : URGENCY.ROUTINE,
  };
}

export function scoreColorVision(results) {
  // results: array of { plate, answer, correct }
  const total = results?.length || 1;
  const correct = results?.filter(r => r.correct).length || 0;
  const pct = correct / total;
  return {
    correct,
    total,
    status: pct >= 0.75 ? 'pass' : pct >= 0.5 ? 'warn' : 'fail',
    urgency: pct < 0.5 ? URGENCY.SOON : URGENCY.ROUTINE,
  };
}

export function scoreAstigmatism(results) {
  // results: { affectedLines: [], allSame: bool }
  if (results?.allSame) return { status: 'pass', urgency: URGENCY.ROUTINE };
  const affected = results?.affectedLines?.length || 0;
  return {
    affected,
    status: affected === 0 ? 'pass' : affected <= 2 ? 'warn' : 'fail',
    urgency: affected > 2 ? URGENCY.SOON : URGENCY.ROUTINE,
  };
}

export function scoreContrast(results) {
  // results: { lastLevel: 0-7 } (higher = better)
  const level = results?.lastLevel ?? 0;
  return {
    level,
    status: level >= 5 ? 'pass' : level >= 3 ? 'warn' : 'fail',
    urgency: level < 3 ? URGENCY.SOON : URGENCY.ROUTINE,
  };
}

export function scoreNearVision(results) {
  // results: { lastSize: index } smaller index = smaller text = better
  const size = results?.lastSize ?? 0;
  return {
    size,
    status: size >= 4 ? 'pass' : size >= 2 ? 'warn' : 'fail',
    urgency: size < 2 ? URGENCY.SOON : URGENCY.ROUTINE,
  };
}

export function scoreAmsler(results) {
  // results: { right: { wavy, missing }, left: { wavy, missing } }
  const rightIssues = (results?.right?.wavy || results?.right?.missing);
  const leftIssues = (results?.left?.wavy || results?.left?.missing);
  const hasIssues = rightIssues || leftIssues;
  return {
    rightIssues,
    leftIssues,
    status: hasIssues ? 'fail' : 'pass',
    urgency: hasIssues ? URGENCY.URGENT : URGENCY.ROUTINE,
  };
}

export function scorePeripheral(results) {
  // results: { missed: count, total: count }
  const missed = results?.missed ?? 0;
  const total = results?.total ?? 1;
  const pct = missed / total;
  return {
    missed,
    total,
    status: pct <= 0.1 ? 'pass' : pct <= 0.3 ? 'warn' : 'fail',
    urgency: pct > 0.3 ? URGENCY.URGENT : URGENCY.ROUTINE,
  };
}

export function scoreSymptoms(answers) {
  // answers: { [symptomId]: 'yes'|'no'|'unsure' }
  const urgentSymptoms = ['floaters', 'curtain', 'sudden_loss'];
  const urgentSymp = urgentSymptoms.some(s => answers?.[s] === 'yes');

  const soonSymptoms = ['eye_pain', 'halos', 'tunnel', 'blurring', 'diabetes'];
  const soonSymp = soonSymptoms.some(s => answers?.[s] === 'yes');

  return {
    hasUrgent: urgentSymptoms.filter(s => answers?.[s] === 'yes'),
    hasSoon: soonSymptoms.filter(s => answers?.[s] === 'yes'),
    status: urgentSymp ? 'fail' : soonSymp ? 'warn' : 'pass',
    urgency: urgentSymp ? URGENCY.EMERGENCY : soonSymp ? URGENCY.URGENT : URGENCY.ROUTINE,
  };
}

export function computeOverallUrgency(allScores) {
  const urgencies = Object.values(allScores).map(s => s.urgency).filter(Boolean);
  const rank = { routine: 0, soon: 1, urgent: 2, emergency: 3 };
  const max = Math.max(...urgencies.map(u => rank[u] ?? 0));
  return Object.keys(rank).find(k => rank[k] === max) || URGENCY.ROUTINE;
}

export function getStatusColor(status) {
  switch (status) {
    case 'pass': return '#27ae60';
    case 'warn': return '#f39c12';
    case 'fail': return '#e74c3c';
    default: return '#6b7280';
  }
}

export function getStatusLabel(status) {
  switch (status) {
    case 'pass': return 'Normal';
    case 'warn': return 'Check Needed';
    case 'fail': return 'See Doctor';
    default: return 'Not Tested';
  }
}
