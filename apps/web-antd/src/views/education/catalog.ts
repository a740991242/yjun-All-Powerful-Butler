export const stages = [
  {
    id: 'kindergarten',
    icon: 'lucide:blocks',
    grades: ['junior', 'intermediate', 'senior'],
  },
  {
    id: 'primary',
    icon: 'lucide:pencil',
    grades: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'],
  },
  { id: 'middle', icon: 'lucide:book-open', grades: ['m1', 'm2', 'm3'] },
  { id: 'high', icon: 'lucide:graduation-cap', grades: ['h1', 'h2', 'h3'] },
  {
    id: 'university',
    icon: 'lucide:university',
    grades: ['u1', 'u2', 'u3', 'u4', 'other'],
  },
  {
    id: 'masters',
    icon: 'lucide:microscope',
    grades: ['r1', 'r2', 'r3', 'other'],
  },
  {
    id: 'doctorate',
    icon: 'lucide:telescope',
    grades: ['d1', 'd2', 'd3', 'd4', 'other'],
  },
];
export function selection(stage: unknown, grade: unknown) {
  const selectedStage = stages.find((item) => item.id === stage);
  return {
    stage: selectedStage,
    grade:
      typeof grade === 'string' && selectedStage?.grades.includes(grade)
        ? grade
        : undefined,
  };
}
