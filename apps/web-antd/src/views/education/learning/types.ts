import type { ArithmeticPairRule } from './arithmetic-pair';
import type { BnuAroundNumbersVisual } from './bnu-around-numbers';
import type { BnuBuildingVisual } from './bnu-building';
import type { BnuCaterpillarVisual } from './bnu-caterpillar';
import type { BnuFillGridVisual } from './bnu-fill-grid';
import type { BnuFinalClassificationVisual } from './bnu-final-classification';
import type { BnuFinalColorVisual } from './bnu-final-color';
import type { BnuFinalPositionVisual } from './bnu-final-position';
import type { BnuFinalSolidsVisual } from './bnu-final-solids';
import type { BnuHundredTableVisual } from './bnu-hundred-table';
import type { BnuHundredWeatherVisual } from './bnu-hundred-weather';
import type { BnuNumberReviewVisual } from './bnu-number-review';
import type { BnuPineconeLineVisual } from './bnu-pinecone-line';
import type { BnuSixCardGameVisual } from './bnu-six-card-game';
import type { BnuTwoJumpLineVisual } from './bnu-two-jump-line';
import type { BnuWholeTenLineVisual } from './bnu-whole-ten-line';
import type { BnuWrittenVisual } from './bnu-written';
import type { CardEquationRule } from './card-equation';
import type { CircularNumberArrayVisual } from './circular-number-array';
import type { ClassCapacityVisual } from './class-capacity';
import type { BnuDayClockVisual } from './clock';
import type { ClockCountingVisual } from './clock-counting';
import type { ColumnDigitsRule } from './column-digits';
import type { ComparisonBarsVisual } from './comparison-bars';
import type { ComparisonRowsVisual } from './comparison-rows';
import type { CrossBalanceModel } from './cross-balance';
import type { CubePairVisual } from './cube-pair';
import type { DigitCounterVisual } from './digit-counter';
import type { EmbeddedShapesVisual } from './embedded-shapes';
import type { EqualPairsRule } from './equal-pairs';
import type { EstimateDotsState, EstimateDotsVisual } from './estimate-dots';
import type { BookGroupsVisual, NumberLineGridVisual } from './final-counting';
import type { FinalPlaneCardsVisual } from './final-plane-cards';
import type { FinalStoriesVisual } from './final-stories';
import type { FruitMazeVisual } from './fruit-maze';
import type { HundredFragmentsVisual } from './hundred-fragments';
import type { MarkedNumberLineVisual } from './marked-number-line';
import type { MathStoryVisual } from './math-story';
import type { MonthCalendarVisual } from './month-calendar';
import type { MonthWeatherVisual } from './month-weather';
import type { MotionFramesVisual } from './motion-frames';
import type { MotionSequencesVisual } from './motion-sequences';
import type { NumberChainRule } from './number-chain';
import type { NumberFrameVisual } from './number-frame';
import type { NumberIntervalRule } from './number-interval';
import type { NumberPicksRule } from './number-picks';
import type { NumberStripVisual } from './number-strip';
import type { OcclusionViewsVisual } from './occlusion-views';
import type { ParadeFramesVisual } from './parade-frames';
import type { PartitionedSquareVisual } from './partitioned-square';
import type { PlaceCountersVisual } from './place-counters';
import type { QuarterCircleVisual } from './quarter-circle';
import type { RegroupSticksVisual } from './regroup-sticks';
import type { SemesterGridVisual } from './semester-grid';
import type { ShadowSizeVisual } from './shadow-size';
import type { SmallArithmeticVisual } from './small-arithmetic';
import type { SolidInstructionsVisual } from './solid-instructions';
import type { SolidPatternVisual } from './solid-pattern';
import type { SolidRecomposeVisual } from './solid-recompose';
import type { StockTableVisual } from './stock-table';
import type { TeenAdditionTableVisual } from './teen-addition-table';
import type { TeenArithmeticGridVisual } from './teen-arithmetic-grid';
import type { TeenLayoutVisual } from './teen-layout';
import type { TeenStairsVisual } from './teen-stairs';
import type { TenCellsVisual } from './ten-cells';
import type { TenTablesVisual } from './ten-tables';
import type { TriangleRowsVisual } from './triangle-rows';
import type { TwoPieceJoinVisual } from './two-piece-join';
import type { ViewpointHouseVisual } from './viewpoint-house';
import type { ViewpointJugVisual } from './viewpoint-jug';
import type { ZeroNumberChartVisual } from './zero-number-chart';

export type Subject = 'chinese' | 'ethics' | 'math';
export type Volume = 'lower' | 'upper';
export type CharacterReferenceKind =
  | 'radicals'
  | 'recognize'
  | 'strokes'
  | 'write';
export type Answer = (null | number)[] | number | string | string[];

export type Shape =
  | 'circle'
  | 'cube'
  | 'cuboid'
  | 'cylinder'
  | 'parallelogram'
  | 'rectangle'
  | 'sphere'
  | 'square'
  | 'triangle';

export type SolidShape = Extract<
  Shape,
  'cube' | 'cuboid' | 'cylinder' | 'sphere'
>;

/** Top to bottom; null cells are filled in row order from left to right. */
export type TowerRows = [
  [null | number],
  [null | number, null | number],
  [null | number, null | number, null | number],
];
/** Three rows from top to bottom; blanks follow row order left to right. */
export type MagicCells = [
  [null | number, null | number, null | number],
  [null | number, null | number, null | number],
  [null | number, null | number, null | number],
];
export interface MagicGridVisual {
  kind: 'magic-grid';
  cells: MagicCells;
}
export interface NumberTowerVisual {
  kind: 'number-tower';
  rows: TowerRows;
}

export interface ArithmeticGridVisual {
  kind: 'arithmetic-grid';
  mode:
    | 'bnu-subtract'
    | 'borrow-complete'
    | 'borrow-subtract'
    | 'carry-add'
    | 'sum-grid';
  /** Zero-based row/column positions, labelled in the supplied order. */
  hidden: [number, number][];
  marked?: number[];
}

export type FlagCode = 'A' | 'B' | 'C';
export interface PeriodicFlagsVisual {
  kind: 'periodic-flags';
  pattern: [FlagCode, FlagCode, FlagCode];
  total: number;
  shown: number;
}

export type PlaneShape = Extract<
  Shape,
  'circle' | 'rectangle' | 'square' | 'triangle'
>;
export interface CompositeShapesVisual {
  kind: 'composite-shapes';
  layout: 'rectangle-strip' | 'square-grid' | 'triangle-fan';
  divisions: 2 | 3 | 4;
}
export interface FoldCutJoinVisual {
  kind: 'fold-cut-join';
  width: 4 | 6;
  cut: 'corner' | 'diagonal';
  stage: 'creased' | 'cut' | 'folded' | 'joined';
}

export interface RectangleCutVisual {
  kind: 'rectangle-cut';
  /** Equally spaced intervals; height is always two intervals, not centimetres. */
  width: 4 | 6;
  cut: 'diagonal' | 'horizontal' | 'vertical';
}
export interface PlanePatch {
  shape: PlaneShape;
  width: number;
  height: number;
}
export interface ShapePatchVisual {
  kind: 'shape-patch';
  target: PlanePatch;
  candidates: PlanePatch[];
}
export interface PeriodicShapesVisual {
  kind: 'periodic-shapes';
  pattern: [
    { shape: PlaneShape; size: 1 | 2 },
    { shape: PlaneShape; size: 1 | 2 },
    { shape: PlaneShape; size: 1 | 2 },
  ];
  total: number;
  shown: number;
}
export interface ChildActivitiesVisual {
  kind: 'child-activities';
  variant: 'main' | 'review';
}

export interface CupCardsVisual {
  kind: 'cup-cards';
  variant: 'main' | 'review';
}

export interface PoolSceneVisual {
  kind: 'pool-scene';
  variant: 'main' | 'review';
}

export interface NatureCardsVisual {
  kind: 'nature-cards';
  deck: 'leaves' | 'plants';
  variant: 'main' | 'review';
}

export interface BlockCardsVisual {
  kind: 'block-cards';
  cards: { shape: SolidShape; color: 'blue' | 'red' | 'yellow' }[];
}

export interface SurveyTableVisual {
  kind: 'survey-table';
  rows: {
    label: string;
    marks: null | { symbol: 'circle' | 'tick'; count: number };
    count: null | number;
  }[];
}
export interface SurveyTableState {
  counts: (null | number)[];
}

export interface ClassificationRecordVisual {
  kind: 'classification-record';
  rows: {
    label: string;
    mark: 'circle' | 'square' | 'tick' | 'triangle';
    count: number;
  }[];
}

export interface ShapeCollageVisual {
  kind: 'shape-collage';
  layout: 'garden' | 'robot' | 'rocket' | 'wagon';
  variant: 'main' | 'review';
}

export interface PlaneCardsVisual {
  kind: 'plane-cards';
  cards: { shape: PlaneShape; size: 1 | 2; turn: 0 | 45 | 90 | 135 | 180 }[];
}

export interface QuantityTableVisual {
  kind: 'quantity-table';
  columns: string[];
  parts: [string, string];
  values: [(null | number)[], (null | number)[], (null | number)[]];
}

export interface ClockVisual {
  kind: 'clock';
  hour: number;
  minute: 0 | 30;
}

export interface BeadChainVisual {
  kind: 'bead-chain';
  /** Each group has one A bead; B starts at firstB and increases by one. */
  firstB: 1 | 2;
  groups: 3 | 4;
  /** Inclusive, one-based indices of whole concealed groups. */
  hidden: [number, number];
}

export interface CardGameVisual {
  kind: 'card-game';
  mode: 'multi' | 'pair';
  decks: [number[], number[]];
}

export type CardGameAction =
  | { type: 'claim'; player: 0 | 1; ids: number[] }
  | { type: 'draw' }
  | { type: 'finish' };

export interface CardGameState {
  actions: CardGameAction[];
  selected: number[];
  claimer: 0 | 1;
}

export interface SumLinesVisual {
  kind: 'sum-lines';
  layout: 'cross' | 'triangle';
  given: [number, number, number];
}

export interface TileGridVisual {
  kind: 'tile-grid';
  cells: boolean[][];
}

export interface SolidRowVisual {
  kind: 'solid-row';
  shapes: SolidShape[];
}

export interface SolidBuildVisual {
  kind: 'solid-build';
  /** Fixed diagram slots: head, neck, body, two arms, two legs, two feet. */
  shapes: SolidShape[];
}

export interface Choice {
  id: string;
  label: string;
}

export interface CubeColumnsVisual {
  kind: 'cube-columns';
  heights: number[];
}

export interface CountGroupsVisual {
  kind: 'count-groups';
  groups: number[];
}

export interface ReadingTableVisual {
  kind: 'reading-table';
  /** Omitted in existing filled-table snapshots. Blank mode labels six input positions only. */
  display?: 'blanks';
  names: [string, string];
  days: [string, string, string];
  pages: [[number, number, number], [number, number, number]];
}

export interface QueueVisual {
  kind: 'queue';
  labels: string[];
  front: 'left' | 'right';
}

export interface GridPathsVisual {
  kind: 'grid-paths';
  /** Omitted in existing 5×3 snapshots. Final-review exploration uses 5×5. */
  grid?: '5x5';
  paths: { id: 'A' | 'B' | 'C'; points: [number, number][] }[];
}

export interface SeatGridVisual {
  kind: 'seat-grid';
  rows: string[][];
}

export interface RegionPairVisual {
  kind: 'region-pair';
  /** A and B share the lower-left corner and use the same grid spacing. */
  sizes: [[number, number], [number, number]];
}

export interface StickOutlineVisual {
  kind: 'stick-outline';
  layout:
    | 'rectangle'
    | 'six-sided'
    | 'slanted-four'
    | 'slanted-six'
    | 'square'
    | 'triangle'
    | 'twelve-rectangle'
    | 'twelve-slanted'
    | 'twelve-square'
    | 'twelve-triangle';
  turn: 0 | 90;
}

export interface PaperFoldVisual {
  kind: 'paper-fold';
  paper: 'rectangle' | 'square';
  method: 'cross' | 'diagonal' | 'parallel';
  stage: 0 | 1 | 2;
}

export interface SolidFaceTracesVisual {
  kind: 'solid-face-traces';
  solid: 'cube' | 'cuboid-distinct' | 'cuboid-square-end' | 'triangular-prism';
}

export interface RotatingPatch {
  patch: PlanePatch;
  turn: 0 | 45 | 90 | 135 | 180 | 225 | 270 | 315;
}
export interface RotatingPatchVisual {
  kind: 'rotating-patch';
  target: RotatingPatch;
  candidates: RotatingPatch[];
}

export interface TriangleMosaicPiece {
  x: number;
  y: number;
  turn: number;
}
export interface TriangleMosaicVisual {
  kind: 'triangle-mosaic';
  pieces: TriangleMosaicPiece[];
  seams: boolean;
}
export interface TriangleMosaicState {
  selected: number;
  pieces: TriangleMosaicPiece[];
}
export interface TriangleMoveVisual {
  kind: 'triangle-move';
  before: TriangleMosaicVisual;
  after: TriangleMosaicVisual;
}
export interface SquareMosaicVisual {
  kind: 'square-mosaic';
  cells: boolean[][];
  seams: boolean;
}
export interface SquareMosaicState {
  cells: boolean[][];
}
export interface AssemblyCandidatesVisual {
  kind: 'assembly-candidates';
  layout:
    | 'four-squares'
    | 'rect-triangle'
    | 'square-slant'
    | 'squares-triangle';
  variant: 'main' | 'review';
}
export interface GeoboardShiftState {
  width: 3 | 4;
  shift: -1 | 0 | 1 | 2;
}
export interface GeoboardShiftVisual extends GeoboardShiftState {
  kind: 'geoboard-shift';
}

export type AnswerRule =
  | ArithmeticPairRule
  | CardEquationRule
  | ColumnDigitsRule
  | CrossBalanceModel
  | EqualPairsRule
  | NumberChainRule
  | NumberIntervalRule
  | NumberPicksRule
  | { kind: 'choice'; value: string }
  | { kind: 'magic-grid'; cells: MagicCells }
  | { kind: 'manual' }
  | { kind: 'number'; value: number }
  | { kind: 'partition'; minimum: number; parts: number; total: number }
  | { kind: 'reflection' }
  | { kind: 'sequence'; values: string[] }
  | { kind: 'set'; values: string[] }
  | { kind: 'steps'; values: number[] }
  | { kind: 'text'; accepted: string[]; normalize: 'nfc' | 'pinyin' }
  | { kind: 'tower'; rows: TowerRows };

export type Visual =
  | ArithmeticGridVisual
  | AssemblyCandidatesVisual
  | BeadChainVisual
  | BlockCardsVisual
  | BnuAroundNumbersVisual
  | BnuBuildingVisual
  | BnuCaterpillarVisual
  | BnuDayClockVisual
  | BnuFillGridVisual
  | BnuFinalClassificationVisual
  | BnuFinalColorVisual
  | BnuFinalPositionVisual
  | BnuFinalSolidsVisual
  | BnuHundredTableVisual
  | BnuHundredWeatherVisual
  | BnuNumberReviewVisual
  | BnuPineconeLineVisual
  | BnuSixCardGameVisual
  | BnuTwoJumpLineVisual
  | BnuWholeTenLineVisual
  | BnuWrittenVisual
  | BookGroupsVisual
  | CardEquationRule
  | CardGameVisual
  | ChildActivitiesVisual
  | CircularNumberArrayVisual
  | ClassCapacityVisual
  | ClassificationRecordVisual
  | ClockCountingVisual
  | ClockVisual
  | ColumnDigitsRule
  | ComparisonBarsVisual
  | ComparisonRowsVisual
  | CompositeShapesVisual
  | CountGroupsVisual
  | CrossBalanceModel
  | CubeColumnsVisual
  | CubePairVisual
  | CupCardsVisual
  | DigitCounterVisual
  | EmbeddedShapesVisual
  | EstimateDotsVisual
  | FinalPlaneCardsVisual
  | FinalStoriesVisual
  | FoldCutJoinVisual
  | FruitMazeVisual
  | GeoboardShiftVisual
  | GridPathsVisual
  | HundredFragmentsVisual
  | MagicGridVisual
  | MarkedNumberLineVisual
  | MathStoryVisual
  | MonthCalendarVisual
  | MonthWeatherVisual
  | MotionFramesVisual
  | MotionSequencesVisual
  | NatureCardsVisual
  | NumberFrameVisual
  | NumberLineGridVisual
  | NumberStripVisual
  | NumberTowerVisual
  | OcclusionViewsVisual
  | PaperFoldVisual
  | ParadeFramesVisual
  | PartitionedSquareVisual
  | PeriodicFlagsVisual
  | PeriodicShapesVisual
  | PlaceCountersVisual
  | PlaneCardsVisual
  | PoolSceneVisual
  | QuantityTableVisual
  | QuarterCircleVisual
  | QueueVisual
  | ReadingTableVisual
  | RectangleCutVisual
  | RegionPairVisual
  | RegroupSticksVisual
  | RotatingPatchVisual
  | SeatGridVisual
  | SemesterGridVisual
  | ShadowSizeVisual
  | ShapeCollageVisual
  | ShapePatchVisual
  | SmallArithmeticVisual
  | SolidBuildVisual
  | SolidFaceTracesVisual
  | SolidInstructionsVisual
  | SolidPatternVisual
  | SolidRecomposeVisual
  | SolidRowVisual
  | SquareMosaicVisual
  | StickOutlineVisual
  | StockTableVisual
  | SumLinesVisual
  | SurveyTableVisual
  | TeenAdditionTableVisual
  | TeenArithmeticGridVisual
  | TeenLayoutVisual
  | TeenStairsVisual
  | TenCellsVisual
  | TenTablesVisual
  | TileGridVisual
  | TriangleMosaicVisual
  | TriangleMoveVisual
  | TriangleRowsVisual
  | TwoPieceJoinVisual
  | ViewpointHouseVisual
  | ViewpointJugVisual
  | ZeroNumberChartVisual
  | { kind: 'bars'; parts: number[]; unknown: number }
  | { kind: 'break-ten'; left: number; right: number }
  | { kind: 'characters'; characters: string[]; grid: 'pinyin' | 'tian' }
  | { kind: 'column'; left: number; operator: '+' | '-'; right: number }
  | { kind: 'count'; count: number; other?: number }
  | { kind: 'hundred-chart'; value: number }
  | { kind: 'knowledge-map' }
  | { kind: 'money'; cents: number[] }
  | { kind: 'nature-scene'; variant: 'garden' | 'hill' }
  | { kind: 'number-line'; maximum: number; minimum: number; value: number }
  | { kind: 'place-value'; value: number }
  | { kind: 'shape'; shape: Shape }
  | { kind: 'shape-join' }
  | { kind: 'ten-frame'; left: number; right: number }
  | { kind: 'three-piece-join' }
  | {
      kind: 'timetable';
      days: string[];
      rows: { period: string; subjects: string[] }[];
    };

/** Bounded local tool state, stored separately from the reviewed diagram. */
export interface VisualState {
  knowledgeCard?: number;
  estimateDots?: EstimateDotsState;
  triangleMosaic?: TriangleMosaicState;
  surveyTable?: SurveyTableState;
  squareMosaic?: SquareMosaicState;
  geoboardShift?: GeoboardShiftState;
  cardGame?: CardGameState;
  broken?: boolean;
  removed?: number;
  touched?: number[];
  tenCells?: number[];
  transferred?: number;
  position?: number;
  placeValue?: { value: number; hundreds: number; tens: number };
  threePieceJoin?: {
    selected: number;
    pieces: [
      { x: number; y: number; turn: number },
      { x: number; y: number; turn: number },
      { x: number; y: number; turn: number },
    ];
  };
  shapeJoin?: {
    selected: number;
    pieces: [
      { x: number; y: number; turn: number },
      { x: number; y: number; turn: number },
    ];
  };
}

export interface Question {
  id: string;
  knowledge: string;
  prompt: string;
  material?: string;
  choices?: Choice[];
  visual?: Visual;
  rule: AnswerRule;
  hint: string;
  explanation: string;
}

export interface LearningStep {
  title: string;
  text: string;
  visual?: Visual;
  /** Original practical task. Completion is self/parent confirmed. */
  activity?: string;
}

export interface Lesson {
  reference?: CharacterReferenceKind;
  id: string;
  textbookTitle: string;
  title: string;
  page: number;
  goal: string;
  prerequisite: string;
  parentTip: string;
  version: number;
  status: 'available' | 'preparing';
  steps: LearningStep[];
  questions: Question[];
  /** Separate, reviewed tasks for same-skill review; not a reshuffle of first attempts. */
  reviewQuestions?: Question[];
  review: { date: string; notes: string; reviewer: string };
}

export interface Unit {
  id: string;
  title: string;
  page: number;
  lessons: Lesson[];
}

export interface Book {
  id: string;
  subject: Subject;
  volume: Volume;
  edition: 'bnu-2024' | 'pep-2024' | 'sujiao';
  title: string;
  source: string;
  verifiedAt: string;
  units: Unit[];
  /** Platform bridge packs, kept outside the official textbook unit list. */
  transitions?: Lesson[];
  /** Practice groups reuse authored tasks, separate from the official unit list. */
  specialties?: Lesson[];
}

export interface Profile {
  id: string;
  nickname: string;
  createdAt: string;
}

export interface Submission {
  answer: Answer;
  correct: boolean | null;
  assisted: boolean;
  /** Whether a parent read the task before this attempt; absent in legacy records. */
  readingHelp?: boolean;
  at: string;
}

export interface Response {
  questionId: string;
  draft: Answer | null;
  hintUsed: boolean;
  /** Monotonic per-question help flag; never rewrites previous submissions. */
  readingHelp?: boolean;
  skipped: boolean;
  submissions: Submission[];
}

export interface Session {
  id: string;
  profileId: string;
  bookId: string;
  lessonId: string;
  lessonVersion: number;
  lessonTitle: string;
  mode: 'lesson' | 'practice' | 'review' | 'transition';
  /** The original attempt is immutable; reviews are separate sessions. */
  originalSessionId?: string;
  seed: number;
  generatorVersion: number;
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
  phase: 'learn' | 'practice' | 'summary';
  step: number;
  questionIndex: number;
  questions: Question[];
  responses: Response[];
  activities: string[];
  tools?: Record<string, VisualState>;
}

export interface LibraryState {
  schemaVersion: 1;
  activeProfileId: string;
  profiles: Profile[];
  sessions: Session[];
}

export interface Backup {
  format: 'butler-grade-one';
  exportedAt: string;
  data: LibraryState;
}
