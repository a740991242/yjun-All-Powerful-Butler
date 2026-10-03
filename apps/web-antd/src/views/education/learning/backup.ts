import type { Answer, Backup, LibraryState, Question, Session } from './types';

import { isArithmeticGridVisual } from './arithmetic-grid';
import { isArithmeticPairRule } from './arithmetic-pair';
import { isAssemblyCandidatesVisual } from './assembly-candidates';
import { isBeadChainVisual } from './bead-chain';
import { isBlockCardsVisual } from './block-cards';
import { isBnuBuildingVisual } from './bnu-building';
import { isBnuCaterpillarVisual } from './bnu-caterpillar';
import { isBnuSixCardGameVisual } from './bnu-six-card-game';
import { isCardEquationRule } from './card-equation';
import { isCardGameState, isCardGameVisual, replayCardGame } from './card-game';
import { isChildActivitiesVisual } from './child-activities';
import { isCircularNumberArrayVisual } from './circular-number-array';
import { isClassCapacityVisual } from './class-capacity';
import { isClassificationRecordVisual } from './classification-record';
import { isBnuDayClockVisual, isClockVisual } from './clock';
import { isClockCountingVisual } from './clock-counting';
import { columnDigitBlankCount, isColumnDigitsRule } from './column-digits';
import { isComparisonBarsVisual } from './comparison-bars';
import { isComparisonRowsVisual } from './comparison-rows';
import { isCompositeShapesVisual } from './composite-shapes';
import { isCountGroupsVisual } from './count-groups';
import { isCrossBalanceModel } from './cross-balance';
import { isCubeColumnsVisual } from './cube-columns';
import { isCubePairVisual } from './cube-pair';
import { isCupCardsVisual } from './cup-cards';
import { isDigitCounterVisual } from './digit-counter';
import { isEmbeddedShapesVisual } from './embedded-shapes';
import { evaluate, MAX_REFLECTION_LENGTH, validAnswer } from './engine';
import { isEqualPairsRule } from './equal-pairs';
import { isEstimateDotsState, isEstimateDotsVisual } from './estimate-dots';
import { isBookGroupsVisual, isNumberLineGridVisual } from './final-counting';
import { isFinalPlaneCardsVisual } from './final-plane-cards';
import { isFinalStoriesVisual } from './final-stories';
import { fold } from './fold';
import { isFoldCutJoinVisual } from './fold-cut-join';
import { isFruitMazeVisual } from './fruit-maze';
import { isGeoboardShiftState, isGeoboardShiftVisual } from './geoboard-shift';
import { isGridPathsVisual } from './grid-paths';
import { isHundredFragmentsVisual } from './hundred-fragments';
import { isKnowledgeCard } from './knowledge-cards';
import {
  isMagicGridRule,
  isMagicGridVisual,
  magicBlankCount,
} from './magic-grid';
import { isMathStoryVisual } from './math-story';
import { isMonthCalendarVisual } from './month-calendar';
import { isMonthWeatherVisual } from './month-weather';
import { isMotionFramesVisual } from './motion-frames';
import { isMotionSequencesVisual } from './motion-sequences';
import { isNatureCardsVisual } from './nature-cards';
import { isNumberChainRule, numberChainBlankCount } from './number-chain';
import { isNumberFrameVisual } from './number-frame';
import { isNumberPicksRule } from './number-picks';
import { isNumberStripVisual } from './number-strip';
import {
  isNumberTowerVisual,
  isTowerRule,
  towerBlankCount,
} from './number-tower';
import { isOcclusionViewsVisual } from './occlusion-views';
import { isPaperFoldVisual } from './paper-fold';
import { isParadeFramesVisual } from './parade-frames';
import { isPartitionedSquareVisual } from './partitioned-square';
import { isPeriodicFlagsVisual } from './periodic-flags';
import { isPeriodicShapesVisual } from './periodic-shapes';
import { isPlaceValueState } from './place-value';
import { isPlaneCardsVisual } from './plane-cards';
import { isPoolSceneVisual } from './pool-scene';
import { isQuantityTableVisual } from './quantity-table';
import { isQuarterCircleVisual } from './quarter-circle';
import { isQueueVisual } from './queue';
import { isReadingTableVisual } from './reading-table';
import { isRectangleCutVisual } from './rectangle-cut';
import { isRegionPairVisual } from './region-pair';
import { isRegroupSticksVisual } from './regroup-sticks';
import { required } from './required';
import { isRotatingPatchVisual } from './rotating-patch';
import { isSeatGridVisual } from './seat-grid';
import { isSemesterGridVisual } from './semester-grid';
import { isShapeCollageVisual } from './shape-collage';
import { isShapeJoinState } from './shape-join';
import { isShapePatchVisual } from './shape-patch';
import { isSmallArithmeticVisual } from './small-arithmetic';
import { isSolidBuildVisual } from './solid-build';
import { isSolidFaceTracesVisual } from './solid-face-traces';
import { isSolidInstructionsVisual } from './solid-instructions';
import { isSolidPatternVisual } from './solid-pattern';
import { isSolidRecomposeVisual } from './solid-recompose';
import { isSolidRowVisual } from './solid-row';
import {
  isSquareMosaicState,
  isSquareMosaicVisual,
  matchingMosaicState,
} from './square-mosaic';
import { isStickOutlineVisual } from './stick-outline';
import { isStockTableVisual } from './stock-table';
import { isSumLinesVisual } from './sum-lines';
import {
  isSurveyTableState,
  isSurveyTableVisual,
  matchingSurveyState,
} from './survey-table';
import { isTeenArithmeticGridVisual } from './teen-arithmetic-grid';
import { isTeenLayoutVisual } from './teen-layout';
import { isTenCellsState, isTenCellsVisual } from './ten-cells';
import { isTenTablesVisual } from './ten-tables';
import { isThreePieceJoinState } from './three-piece-join';
import { isTileGridVisual } from './tile-grid';
import {
  isTriangleMosaicState,
  isTriangleMosaicVisual,
  isTriangleMoveVisual,
  matchingTriangleState,
} from './triangle-mosaic';
import { isTwoPieceJoinVisual } from './two-piece-join';
import { isViewpointHouseVisual } from './viewpoint-house';
import { isViewpointJugVisual } from './viewpoint-jug';
import { isZeroNumberChartVisual } from './zero-number-chart';

export const MAX_BACKUP_BYTES = 8 * 1024 * 1024;

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function text(value: unknown, maximum = 16_000): value is string {
  return (
    typeof value === 'string' && value.length > 0 && value.length <= maximum
  );
}
function identifier(value: unknown): value is string {
  return typeof value === 'string' && /^[\w-]{1,120}$/.test(value);
}
function date(value: unknown): value is string {
  return text(value, 40) && Number.isFinite(Date.parse(value));
}
function integer(value: unknown, maximum = 100): value is number {
  return (
    typeof value === 'number' &&
    Number.isSafeInteger(value) &&
    value >= 0 &&
    value <= maximum
  );
}
function list(value: unknown, maximum: number): value is unknown[] {
  return Array.isArray(value) && value.length <= maximum;
}
function uniqueIds(value: { id?: unknown }[]) {
  return new Set(value.map((item) => item.id)).size === value.length;
}
function answer(value: unknown): value is Answer {
  return (
    (typeof value === 'string' && value.length <= 16_000) ||
    (typeof value === 'number' &&
      Number.isSafeInteger(value) &&
      Math.abs(value) <= 100_000) ||
    (list(value, 100) &&
      value.every(
        (item) =>
          (typeof item === 'string' && item.length <= 120) ||
          item === null ||
          (typeof item === 'number' &&
            Number.isSafeInteger(item) &&
            Math.abs(item) <= 100_000),
      ) &&
      (value.every((item) => typeof item === 'string') ||
        value.every((item) => item === null || typeof item === 'number')))
  );
}

function rule(value: unknown) {
  if (!record(value)) return false;
  switch (value.kind) {
    case 'equal-pairs': {
      return isEqualPairsRule(value);
    }
    case 'card-equation': {
      return isCardEquationRule(value);
    }
    case 'column-digits': {
      return isColumnDigitsRule(value);
    }
    case 'cross-balance': {
      return isCrossBalanceModel(value);
    }
    case 'number-picks': {
      return isNumberPicksRule(value);
    }
    case 'arithmetic-pair': {
      return isArithmeticPairRule(value);
    }
    case 'number-chain': {
      return isNumberChainRule(value);
    }
    case 'magic-grid': {
      return isMagicGridRule(value);
    }
    case 'tower': {
      return isTowerRule(value);
    }
    case 'manual': {
      return true;
    }
    case 'reflection': {
      return Object.keys(value).length === 1;
    }
    case 'number': {
      return integer(value.value, 100_000);
    }
    case 'choice': {
      return text(value.value, 120);
    }
    case 'text': {
      return (
        ['nfc', 'pinyin'].includes(String(value.normalize)) &&
        list(value.accepted, 50) &&
        value.accepted.length > 0 &&
        value.accepted.every((item) => text(item, 500))
      );
    }
    case 'steps': {
      return (
        list(value.values, 20) &&
        value.values.length > 0 &&
        value.values.every((item) => integer(item, 100_000))
      );
    }
    case 'sequence':
    case 'set': {
      return (
        list(value.values, 100) &&
        value.values.length > 0 &&
        value.values.every((item) => text(item, 120)) &&
        new Set(value.values).size === value.values.length
      );
    }
    case 'partition': {
      return (
        integer(value.total) &&
        integer(value.parts, 10) &&
        value.parts >= 2 &&
        integer(value.minimum) &&
        value.minimum * value.parts <= value.total
      );
    }
    default: {
      return false;
    }
  }
}

function visual(value: unknown) {
  if (!record(value)) return false;
  switch (value.kind) {
    case 'number-strip': {
      return isNumberStripVisual(value);
    }
    case 'bnu-building': {
      return isBnuBuildingVisual(value);
    }
    case 'bnu-six-card-game': {
      return isBnuSixCardGameVisual(value);
    }
    case 'bnu-caterpillar': {
      return isBnuCaterpillarVisual(value);
    }
    case 'shape-patch': {
      return isShapePatchVisual(value);
    }
    case 'periodic-shapes': {
      return isPeriodicShapesVisual(value);
    }
    case 'composite-shapes': {
      return isCompositeShapesVisual(value);
    }
    case 'fold-cut-join': {
      return isFoldCutJoinVisual(value);
    }
    case 'rectangle-cut': {
      return isRectangleCutVisual(value);
    }
    case 'plane-cards': {
      return isPlaneCardsVisual(value);
    }
    case 'periodic-flags': {
      return isPeriodicFlagsVisual(value);
    }
    case 'arithmetic-grid': {
      return isArithmeticGridVisual(value);
    }
    case 'quarter-circle': {
      return isQuarterCircleVisual(value);
    }
    case 'two-piece-join': {
      return isTwoPieceJoinVisual(value);
    }
    case 'book-groups': {
      return isBookGroupsVisual(value);
    }
    case 'number-line-grid': {
      return isNumberLineGridVisual(value);
    }
    case 'small-arithmetic': {
      return isSmallArithmeticVisual(value);
    }
    case 'magic-grid': {
      return isMagicGridVisual(value);
    }
    case 'number-tower': {
      return isNumberTowerVisual(value);
    }
    case 'region-pair': {
      return isRegionPairVisual(value);
    }
    case 'cube-columns': {
      return isCubeColumnsVisual(value);
    }
    case 'teen-arithmetic-grid': {
      return isTeenArithmeticGridVisual(value);
    }
    case 'semester-grid': {
      return isSemesterGridVisual(value);
    }
    case 'knowledge-map': {
      return Object.keys(value).length === 1;
    }
    case 'month-weather': {
      return isMonthWeatherVisual(value);
    }
    case 'teen-layout': {
      return isTeenLayoutVisual(value);
    }
    case 'count-groups': {
      return isCountGroupsVisual(value);
    }
    case 'grid-paths': {
      return isGridPathsVisual(value);
    }
    case 'seat-grid': {
      return isSeatGridVisual(value);
    }
    case 'quantity-table': {
      return isQuantityTableVisual(value);
    }
    case 'ten-tables': {
      return isTenTablesVisual(value);
    }
    case 'solid-recompose': {
      return isSolidRecomposeVisual(value);
    }
    case 'solid-pattern': {
      return isSolidPatternVisual(value);
    }
    case 'cube-pair': {
      return isCubePairVisual(value);
    }
    case 'solid-instructions': {
      return isSolidInstructionsVisual(value);
    }
    case 'solid-build': {
      return isSolidBuildVisual(value);
    }
    case 'bead-chain': {
      return isBeadChainVisual(value);
    }
    case 'final-stories': {
      return isFinalStoriesVisual(value);
    }
    case 'reading-table': {
      return isReadingTableVisual(value);
    }
    case 'bnu-day-clock': {
      return isBnuDayClockVisual(value);
    }
    case 'clock': {
      return isClockVisual(value);
    }
    case 'card-game': {
      return isCardGameVisual(value);
    }
    case 'sum-lines': {
      return isSumLinesVisual(value);
    }
    case 'tile-grid': {
      return isTileGridVisual(value);
    }
    case 'solid-row': {
      return isSolidRowVisual(value);
    }
    case 'queue': {
      return isQueueVisual(value);
    }
    case 'nature-scene': {
      return (
        Object.keys(value).length === 2 &&
        ['garden', 'hill'].includes(String(value.variant))
      );
    }
    case 'timetable': {
      const { days, rows } = value;
      if (
        Object.keys(value).length !== 3 ||
        !list(days, 7) ||
        days.length === 0 ||
        !days.every((day) => text(day, 40)) ||
        new Set(days).size !== days.length ||
        !list(rows, 6) ||
        rows.length === 0
      )
        return false;
      const periods = new Set<string>();
      for (const row of rows) {
        if (
          !record(row) ||
          Object.keys(row).length !== 2 ||
          !text(row.period, 40) ||
          periods.has(row.period) ||
          !list(row.subjects, 7) ||
          row.subjects.length !== days.length ||
          !row.subjects.every((subject) => text(subject, 40))
        )
          return false;
        periods.add(row.period);
      }
      return true;
    }
    case 'count': {
      return (
        integer(value.count) &&
        (value.other === undefined || integer(value.other))
      );
    }
    case 'ten-cells': {
      return isTenCellsVisual(value);
    }
    case 'ten-frame': {
      return integer(value.left, 10) && integer(value.right, 10);
    }
    case 'break-ten': {
      return (
        integer(value.left, 19) &&
        value.left >= 11 &&
        integer(value.right, 9) &&
        value.right > value.left % 10
      );
    }
    case 'place-value': {
      return integer(value.value);
    }
    case 'estimate-dots': {
      return isEstimateDotsVisual(value);
    }
    case 'regroup-sticks': {
      return isRegroupSticksVisual(value);
    }
    case 'occlusion-views': {
      return isOcclusionViewsVisual(value);
    }
    case 'math-story': {
      return isMathStoryVisual(value);
    }
    case 'class-capacity': {
      return isClassCapacityVisual(value);
    }
    case 'motion-sequences': {
      return isMotionSequencesVisual(value);
    }
    case 'embedded-shapes': {
      return isEmbeddedShapesVisual(value);
    }
    case 'parade-frames': {
      return isParadeFramesVisual(value);
    }
    case 'motion-frames': {
      return isMotionFramesVisual(value);
    }
    case 'viewpoint-jug': {
      return isViewpointJugVisual(value);
    }
    case 'viewpoint-house': {
      return isViewpointHouseVisual(value);
    }
    case 'comparison-bars': {
      return isComparisonBarsVisual(value);
    }
    case 'comparison-rows': {
      return isComparisonRowsVisual(value);
    }
    case 'stock-table': {
      return isStockTableVisual(value);
    }
    case 'cross-balance': {
      return isCrossBalanceModel(value);
    }
    case 'digit-counter': {
      return isDigitCounterVisual(value);
    }
    case 'month-calendar': {
      return isMonthCalendarVisual(value);
    }
    case 'clock-counting': {
      return isClockCountingVisual(value);
    }
    case 'circular-number-array': {
      return isCircularNumberArrayVisual(value);
    }
    case 'number-frame': {
      return isNumberFrameVisual(value);
    }
    case 'zero-number-chart': {
      return isZeroNumberChartVisual(value);
    }
    case 'column-digits': {
      return isColumnDigitsRule(value);
    }
    case 'hundred-fragments': {
      return isHundredFragmentsVisual(value);
    }
    case 'card-equation': {
      return isCardEquationRule(value);
    }
    case 'fruit-maze': {
      return isFruitMazeVisual(value);
    }
    case 'hundred-chart': {
      return integer(value.value, 100) && value.value >= 1;
    }
    case 'number-line': {
      return (
        integer(value.minimum) &&
        integer(value.maximum) &&
        integer(value.value) &&
        value.minimum < value.maximum &&
        value.value >= value.minimum &&
        value.value <= value.maximum
      );
    }
    case 'shape': {
      return [
        'circle',
        'cube',
        'cuboid',
        'cylinder',
        'parallelogram',
        'rectangle',
        'sphere',
        'square',
        'triangle',
      ].includes(String(value.shape));
    }
    case 'child-activities': {
      return isChildActivitiesVisual(value);
    }
    case 'cup-cards': {
      return isCupCardsVisual(value);
    }
    case 'pool-scene': {
      return isPoolSceneVisual(value);
    }
    case 'nature-cards': {
      return isNatureCardsVisual(value);
    }
    case 'block-cards': {
      return isBlockCardsVisual(value);
    }
    case 'survey-table': {
      return isSurveyTableVisual(value);
    }
    case 'classification-record': {
      return isClassificationRecordVisual(value);
    }
    case 'final-plane-cards': {
      return isFinalPlaneCardsVisual(value);
    }
    case 'shape-collage': {
      return isShapeCollageVisual(value);
    }
    case 'triangle-mosaic': {
      return isTriangleMosaicVisual(value);
    }
    case 'triangle-move': {
      return isTriangleMoveVisual(value);
    }
    case 'square-mosaic': {
      return isSquareMosaicVisual(value);
    }
    case 'partitioned-square': {
      return isPartitionedSquareVisual(value);
    }
    case 'assembly-candidates': {
      return isAssemblyCandidatesVisual(value);
    }
    case 'geoboard-shift': {
      return isGeoboardShiftVisual(value);
    }
    case 'rotating-patch': {
      return isRotatingPatchVisual(value);
    }
    case 'solid-face-traces': {
      return isSolidFaceTracesVisual(value);
    }
    case 'paper-fold': {
      return isPaperFoldVisual(value);
    }
    case 'stick-outline': {
      return isStickOutlineVisual(value);
    }
    case 'three-piece-join':
    case 'shape-join': {
      return Object.keys(value).length === 1;
    }
    case 'characters': {
      return (
        ['pinyin', 'tian'].includes(String(value.grid)) &&
        list(value.characters, 50) &&
        value.characters.every((item) => text(item, 20))
      );
    }
    case 'bars': {
      return (
        list(value.parts, 10) &&
        value.parts.every((item) => integer(item)) &&
        integer(value.unknown, value.parts.length)
      );
    }
    case 'column': {
      return (
        integer(value.left) &&
        integer(value.right) &&
        ['+', '-'].includes(String(value.operator))
      );
    }
    case 'money': {
      return (
        list(value.cents, 30) &&
        value.cents.every((item) => integer(item, 10_000))
      );
    }
    default: {
      return false;
    }
  }
}

function question(value: unknown): value is Question {
  if (
    !record(value) ||
    !identifier(value.id) ||
    !identifier(value.knowledge) ||
    !text(value.prompt) ||
    !text(value.hint) ||
    !text(value.explanation) ||
    !rule(value.rule)
  )
    return false;
  if (value.material !== undefined && !text(value.material)) return false;
  if (value.visual !== undefined && !visual(value.visual)) return false;
  if (value.choices !== undefined) {
    if (
      !list(value.choices, 30) ||
      !value.choices.every(
        (item) => record(item) && text(item.id, 120) && text(item.label, 500),
      )
    )
      return false;
    const choices = value.choices.filter((item) => record(item));
    if (!uniqueIds(choices)) return false;
    const answerRule = value.rule;
    if (
      record(answerRule) &&
      answerRule.kind === 'choice' &&
      !choices.some((item) => item.id === answerRule.value)
    )
      return false;
  }
  const answerRule = value.rule;
  if (
    isCardEquationRule(answerRule) &&
    (!isCardEquationRule(value.visual) ||
      JSON.stringify(answerRule.values) !== JSON.stringify(value.visual.values))
  )
    return false;
  if (
    isColumnDigitsRule(answerRule) &&
    (!isColumnDigitsRule(value.visual) ||
      answerRule.operator !== value.visual.operator ||
      JSON.stringify([answerRule.left, answerRule.right, answerRule.result]) !==
        JSON.stringify([
          value.visual.left,
          value.visual.right,
          value.visual.result,
        ]))
  )
    return false;
  if (
    record(answerRule) &&
    ['choice', 'sequence', 'set'].includes(String(answerRule.kind))
  ) {
    if (!Array.isArray(value.choices)) return false;
    const ids = new Set(
      value.choices.filter((item) => record(item)).map((choice) => choice.id),
    );
    const expected =
      answerRule.kind === 'choice' ? [answerRule.value] : answerRule.values;
    if (!Array.isArray(expected) || !expected.every((id) => ids.has(id)))
      return false;
  }
  if (
    isCrossBalanceModel(answerRule) &&
    (!isCrossBalanceModel(value.visual) ||
      JSON.stringify([...answerRule.values].toSorted((a, b) => a - b)) !==
        JSON.stringify([...value.visual.values].toSorted((a, b) => a - b)))
  )
    return false;
  if (
    isTowerRule(answerRule) &&
    (!isNumberTowerVisual(value.visual) ||
      JSON.stringify(answerRule.rows) !== JSON.stringify(value.visual.rows))
  )
    return false;
  if (
    isMagicGridRule(answerRule) &&
    (!isMagicGridVisual(value.visual) ||
      JSON.stringify(answerRule.cells) !== JSON.stringify(value.visual.cells))
  )
    return false;
  return true;
}

function tools(value: unknown) {
  if (!record(value) || Object.keys(value).length > 200) return false;
  return Object.entries(value).every(([key, state]) => {
    if (!/^(?:step-\d{1,3}|question-[\w-]{1,120})$/.test(key) || !record(state))
      return false;
    if (
      !Object.keys(state).every((field) =>
        [
          'broken',
          'cardGame',
          'estimateDots',
          'geoboardShift',
          'knowledgeCard',
          'placeValue',
          'position',
          'removed',
          'shapeJoin',
          'squareMosaic',
          'surveyTable',
          'tenCells',
          'threePieceJoin',
          'touched',
          'transferred',
          'triangleMosaic',
        ].includes(field),
      )
    )
      return false;
    if (
      state.geoboardShift !== undefined &&
      !isGeoboardShiftState(state.geoboardShift)
    )
      return false;
    if (
      state.triangleMosaic !== undefined &&
      !isTriangleMosaicState(state.triangleMosaic)
    )
      return false;
    if (
      state.squareMosaic !== undefined &&
      !isSquareMosaicState(state.squareMosaic)
    )
      return false;
    if (
      state.surveyTable !== undefined &&
      !isSurveyTableState(state.surveyTable)
    )
      return false;
    if (
      state.estimateDots !== undefined &&
      !isEstimateDotsState(state.estimateDots)
    )
      return false;
    if (state.cardGame !== undefined && !isCardGameState(state.cardGame))
      return false;
    if (
      state.knowledgeCard !== undefined &&
      !isKnowledgeCard(state.knowledgeCard)
    )
      return false;
    if (state.tenCells !== undefined && !isTenCellsState(state.tenCells))
      return false;
    if (state.transferred !== undefined && !integer(state.transferred, 10))
      return false;
    if (state.position !== undefined && !integer(state.position, 100))
      return false;
    if (state.broken !== undefined && typeof state.broken !== 'boolean')
      return false;
    if (state.removed !== undefined && !integer(state.removed, 9)) return false;
    if (state.placeValue !== undefined && !isPlaceValueState(state.placeValue))
      return false;
    if (
      state.threePieceJoin !== undefined &&
      !isThreePieceJoinState(state.threePieceJoin)
    )
      return false;
    if (state.shapeJoin !== undefined && !isShapeJoinState(state.shapeJoin))
      return false;
    return (
      state.touched === undefined ||
      (list(state.touched, 200) &&
        state.touched.every((item) => integer(item, 200)) &&
        new Set(state.touched).size === state.touched.length)
    );
  });
}

function session(value: unknown, profileIds: Set<string>): value is Session {
  if (
    !record(value) ||
    !identifier(value.id) ||
    !identifier(value.profileId) ||
    !profileIds.has(value.profileId) ||
    !identifier(value.bookId) ||
    !identifier(value.lessonId) ||
    !text(value.lessonTitle, 500)
  )
    return false;
  if (value.tools !== undefined && !tools(value.tools)) return false;
  if (
    !integer(value.lessonVersion, 10_000) ||
    value.lessonVersion === 0 ||
    !integer(value.generatorVersion, 10_000) ||
    value.generatorVersion === 0 ||
    !integer(value.seed, 2 ** 32 - 1)
  )
    return false;
  if (
    !date(value.startedAt) ||
    !date(value.updatedAt) ||
    (value.completedAt !== undefined && !date(value.completedAt)) ||
    Date.parse(value.updatedAt) < Date.parse(value.startedAt)
  )
    return false;
  if (
    value.originalSessionId !== undefined &&
    !identifier(value.originalSessionId)
  )
    return false;
  if (
    !['lesson', 'practice', 'review', 'transition'].includes(
      String(value.mode),
    ) ||
    !['learn', 'practice', 'summary'].includes(String(value.phase))
  )
    return false;
  if (
    !list(value.questions, 100) ||
    value.questions.length === 0 ||
    !value.questions.every((item) => question(item)) ||
    !uniqueIds(value.questions)
  )
    return false;
  if (
    !integer(value.step, 100) ||
    !integer(value.questionIndex, value.questions.length - 1) ||
    !list(value.activities, 100) ||
    !value.activities.every((item) => identifier(item))
  )
    return false;
  if (record(value.tools)) {
    for (const [key, state] of Object.entries(value.tools)) {
      if (
        record(state) &&
        state.tenCells !== undefined &&
        key.startsWith('question-')
      ) {
        const bound = value.questions.find(
          (q) => record(q) && key === `question-${q.id}`,
        );
        if (!bound || !isTenCellsVisual(bound.visual)) return false;
      }
      if (
        record(state) &&
        state.estimateDots !== undefined &&
        key.startsWith('question-')
      ) {
        const bound = value.questions.find(
          (q) => record(q) && key === `question-${q.id}`,
        );
        if (
          !bound ||
          !record(bound.rule) ||
          bound.rule.kind !== 'manual' ||
          !isEstimateDotsVisual(bound.visual) ||
          !isEstimateDotsState(state.estimateDots) ||
          state.estimateDots.variant !== bound.visual.variant
        )
          return false;
      }

      if (
        record(state) &&
        state.surveyTable !== undefined &&
        key.startsWith('question-')
      ) {
        const bound = value.questions.find(
          (q) => record(q) && key === `question-${q.id}`,
        );
        if (
          !bound ||
          !record(bound.rule) ||
          bound.rule.kind !== 'manual' ||
          !isSurveyTableVisual(bound.visual) ||
          !matchingSurveyState(state.surveyTable, bound.visual)
        )
          return false;
      }
      if (
        record(state) &&
        state.triangleMosaic !== undefined &&
        key.startsWith('question-')
      ) {
        const bound = value.questions.find(
          (q) => record(q) && key === `question-${q.id}`,
        );
        if (
          !bound ||
          !record(bound.rule) ||
          bound.rule.kind !== 'manual' ||
          !isTriangleMosaicVisual(bound.visual) ||
          !matchingTriangleState(state.triangleMosaic, bound.visual)
        )
          return false;
      }
      if (
        record(state) &&
        state.squareMosaic !== undefined &&
        key.startsWith('question-')
      ) {
        const bound = value.questions.find(
          (q) => record(q) && key === `question-${q.id}`,
        );
        if (
          !bound ||
          !record(bound.rule) ||
          bound.rule.kind !== 'manual' ||
          !isSquareMosaicVisual(bound.visual) ||
          !matchingMosaicState(state.squareMosaic, bound.visual)
        )
          return false;
      }
      if (
        record(state) &&
        state.threePieceJoin !== undefined &&
        key.startsWith('question-')
      ) {
        const bound = value.questions.find(
          (item) => key === `question-${item.id}`,
        );
        if (
          !bound ||
          !record(bound.visual) ||
          bound.visual.kind !== 'three-piece-join'
        )
          return false;
      }
      if (
        record(state) &&
        state.geoboardShift !== undefined &&
        key.startsWith('question-')
      ) {
        const bound = value.questions.find(
          (item) => key === `question-${item.id}`,
        );
        if (
          !bound ||
          !record(bound.rule) ||
          bound.rule.kind !== 'manual' ||
          !isGeoboardShiftVisual(bound.visual) ||
          !isGeoboardShiftState(state.geoboardShift) ||
          state.geoboardShift.width !== bound.visual.width
        )
          return false;
      }
      if (!record(state) || state.cardGame === undefined) continue;
      const current = value.questions.find(
        (item) => key === `question-${item.id}`,
      );
      if (
        !current ||
        !isCardGameVisual(current.visual) ||
        !replayCardGame(current.visual, state.cardGame)
      )
        return false;
    }
    for (const current of value.questions) {
      const state = value.tools[`question-${current.id}`];
      if (
        record(state) &&
        state.shapeJoin !== undefined &&
        (!record(current.visual) || current.visual.kind !== 'shape-join')
      )
        return false;
      if (
        record(state) &&
        state.placeValue !== undefined &&
        (!record(current.visual) ||
          current.visual.kind !== 'place-value' ||
          !isPlaceValueState(state.placeValue) ||
          state.placeValue.value !== current.visual.value)
      )
        return false;
    }
  }
  if (
    !list(value.responses, 100) ||
    value.responses.length !== value.questions.length
  )
    return false;
  for (const [index, response] of value.responses.entries()) {
    const current = value.questions[index];
    if (
      !current ||
      !record(response) ||
      response.questionId !== current.id ||
      typeof response.hintUsed !== 'boolean' ||
      (response.readingHelp !== undefined &&
        typeof response.readingHelp !== 'boolean') ||
      typeof response.skipped !== 'boolean'
    )
      return false;
    if (response.draft !== null && !answer(response.draft)) return false;
    if (
      current.rule.kind === 'reflection' &&
      response.draft !== null &&
      (typeof response.draft !== 'string' ||
        response.draft.length > MAX_REFLECTION_LENGTH)
    )
      return false;
    if (
      current.rule.kind === 'tower' &&
      response.draft !== null &&
      (!Array.isArray(response.draft) ||
        response.draft.length !== towerBlankCount(current.rule.rows) ||
        ![...response.draft].every(
          (item) =>
            item === null ||
            (typeof item === 'number' &&
              Number.isSafeInteger(item) &&
              Math.abs(item) <= 100_000),
        ))
    )
      return false;
    if (
      current.rule.kind === 'magic-grid' &&
      response.draft !== null &&
      (!Array.isArray(response.draft) ||
        response.draft.length !== magicBlankCount(current.rule.cells) ||
        ![...response.draft].every(
          (item) =>
            item === null ||
            (typeof item === 'number' &&
              Number.isSafeInteger(item) &&
              Math.abs(item) <= 100_000),
        ))
    )
      return false;
    if (
      (current.rule.kind === 'card-equation' ||
        current.rule.kind === 'equal-pairs') &&
      response.draft !== null &&
      (!Array.isArray(response.draft) ||
        response.draft.length !==
          (current.rule.kind === 'equal-pairs' ? 8 : 4) ||
        ![...response.draft].every(
          (n) =>
            n === null ||
            (typeof n === 'number' &&
              Number.isSafeInteger(n) &&
              Math.abs(n) <= 100_000),
        ))
    )
      return false;
    if (
      current.rule.kind === 'column-digits' &&
      response.draft !== null &&
      (!Array.isArray(response.draft) ||
        response.draft.length !== columnDigitBlankCount(current.rule) ||
        ![...response.draft].every(
          (item) =>
            item === null ||
            (typeof item === 'number' &&
              Number.isSafeInteger(item) &&
              Math.abs(item) <= 100_000),
        ))
    )
      return false;
    if (
      current.rule.kind === 'number-chain' &&
      response.draft !== null &&
      (!Array.isArray(response.draft) ||
        response.draft.length !== numberChainBlankCount(current.rule) ||
        ![...response.draft].every(
          (item) =>
            item === null ||
            (typeof item === 'number' &&
              Number.isSafeInteger(item) &&
              Math.abs(item) <= 100_000),
        ))
    )
      return false;
    if (
      (current.rule.kind === 'number-picks' ||
        current.rule.kind === 'arithmetic-pair' ||
        current.rule.kind === 'cross-balance') &&
      response.draft !== null &&
      (!Array.isArray(response.draft) ||
        response.draft.length !==
          (() => {
            if (current.rule.kind === 'arithmetic-pair') return 2;
            if (current.rule.kind === 'number-picks')
              return current.rule.fields.length;
            return current.rule.values.length;
          })() ||
        ![...response.draft].every(
          (item) =>
            item === null ||
            (typeof item === 'number' &&
              Number.isSafeInteger(item) &&
              Math.abs(item) <= 100_000),
        ))
    )
      return false;
    if (!list(response.submissions, 100)) return false;
    for (const submission of response.submissions) {
      if (
        !record(submission) ||
        !answer(submission.answer) ||
        !date(submission.at) ||
        typeof submission.assisted !== 'boolean' ||
        (submission.readingHelp !== undefined &&
          typeof submission.readingHelp !== 'boolean') ||
        !validAnswer(current.rule, submission.answer)
      )
        return false;
      if (submission.assisted && !response.hintUsed) return false;
      if (submission.readingHelp && !response.readingHelp) return false;
      if (evaluate(current.rule, submission.answer) !== submission.correct)
        return false;
    }
  }
  return value.phase === 'summary'
    ? date(value.completedAt) &&
        value.responses.every(
          (response) =>
            record(response) &&
            (response.skipped ||
              (Array.isArray(response.submissions) &&
                response.submissions.length > 0)),
        )
    : value.completedAt === undefined;
}

export function isLibraryState(value: unknown): value is LibraryState {
  if (
    !record(value) ||
    value.schemaVersion !== 1 ||
    !identifier(value.activeProfileId) ||
    !list(value.profiles, 64) ||
    value.profiles.length === 0 ||
    !value.profiles.every(
      (item) =>
        record(item) &&
        identifier(item.id) &&
        text(item.nickname, 40) &&
        date(item.createdAt),
    )
  )
    return false;
  const profiles = value.profiles.filter((item) => record(item));
  if (!uniqueIds(profiles)) return false;
  const ids = new Set(profiles.map((item) => String(item.id)));
  if (
    !ids.has(value.activeProfileId) ||
    !list(value.sessions, 10_000) ||
    !value.sessions.every((item) => session(item, ids))
  )
    return false;
  if (!uniqueIds(value.sessions)) return false;
  const sessions = new Map(value.sessions.map((item) => [item.id, item]));
  return value.sessions.every(
    (item) =>
      !item.originalSessionId ||
      (item.originalSessionId !== item.id &&
        sessions.get(item.originalSessionId)?.profileId === item.profileId),
  );
}

export function parseBackup(source: string): Backup {
  if (new TextEncoder().encode(source).length > MAX_BACKUP_BYTES)
    throw new Error('educationLearning.backupTooLarge');
  let value: unknown;
  try {
    value = JSON.parse(source);
  } catch {
    throw new Error('educationLearning.invalidBackup');
  }
  if (record(value) && record(value.data) && value.data.schemaVersion !== 1)
    throw new Error('educationLearning.backupVersion');
  if (
    !record(value) ||
    value.format !== 'butler-grade-one' ||
    !date(value.exportedAt) ||
    !isLibraryState(value.data)
  )
    throw new Error('educationLearning.invalidBackup');
  return {
    format: 'butler-grade-one',
    exportedAt: value.exportedAt,
    data: value.data,
  };
}

function backupSource(data: LibraryState, now: string, pretty = false) {
  return JSON.stringify(
    { format: 'butler-grade-one', exportedAt: now, data } satisfies Backup,
    null,
    pretty ? 2 : undefined,
  );
}
function byteLength(source: string) {
  return new TextEncoder().encode(source).length;
}
function validateExport(data: LibraryState, now: string) {
  if (!isLibraryState(data) || !date(now))
    throw new Error('educationLearning.invalidRecord');
}
/** Single-file callers never receive a file the importer would reject. */
export function exportBackup(
  data: LibraryState,
  now = new Date().toISOString(),
) {
  validateExport(data, now);
  const pretty = backupSource(data, now, true);
  if (byteLength(pretty) <= MAX_BACKUP_BYTES) return pretty;
  const compact = backupSource(data, now);
  if (byteLength(compact) <= MAX_BACKUP_BYTES) return compact;
  throw new Error('educationLearning.backupNeedsParts');
}

/** Every part includes the profiles and all ancestor attempts referenced by its
 * reviews. Parts can be imported in any order; duplicate IDs merge unchanged.
 * No session is truncated or mutated to make an oversized record fit.
 */
export function exportBackupFiles(
  data: LibraryState,
  now = new Date().toISOString(),
): string[] {
  validateExport(data, now);
  const compact = backupSource(data, now);
  if (byteLength(compact) <= MAX_BACKUP_BYTES) return [exportBackup(data, now)];
  const empty = { ...data, sessions: [] };
  const baseBytes = byteLength(backupSource(empty, now));
  const all = new Map(data.sessions.map((session) => [session.id, session]));
  const costs = new Map(
    data.sessions.map((session) => [
      session.id,
      byteLength(JSON.stringify(session)),
    ]),
  );
  const output: string[] = [];
  let selected = new Map<string, Session>();
  let sessionBytes = 0;
  const ancestors = (session: Session) => {
    const chain = new Map<string, Session>();
    let current: Session | undefined = session;
    while (current && !chain.has(current.id)) {
      chain.set(current.id, current);
      current = current.originalSessionId
        ? all.get(current.originalSessionId)
        : undefined;
    }
    return chain;
  };
  const flush = () => {
    if (selected.size === 0) return;
    output.push(
      backupSource({ ...data, sessions: [...selected.values()] }, now),
    );
    selected = new Map();
    sessionBytes = 0;
  };
  for (const session of data.sessions) {
    const chain = ancestors(session);
    let additions = [...chain.values()].filter(
      (item) => !selected.has(item.id),
    );
    let cost = fold(
      additions,
      0,
      (sum, item) => sum + required(costs.get(item.id)),
    );
    let count = selected.size + additions.length;
    if (
      baseBytes + sessionBytes + cost + Math.max(0, count - 1) >
      MAX_BACKUP_BYTES
    ) {
      flush();
      additions = [...chain.values()];
      cost = fold(
        additions,
        0,
        (sum, item) => sum + required(costs.get(item.id)),
      );
      count = additions.length;
      if (baseBytes + cost + Math.max(0, count - 1) > MAX_BACKUP_BYTES)
        throw new Error('educationLearning.backupRecordTooLarge');
    }
    for (const item of additions) selected.set(item.id, item);
    sessionBytes += cost;
  }
  flush();
  return output;
}

/** Existing records win. An import never overwrites a local attempt or nickname. */
export function previewMerge(current: LibraryState, incoming: LibraryState) {
  if (!isLibraryState(current) || !isLibraryState(incoming))
    throw new Error('educationLearning.invalidBackup');
  const profileIds = new Set(current.profiles.map((item) => item.id));
  const sessionIds = new Set(current.sessions.map((item) => item.id));
  const profiles = incoming.profiles.filter((item) => !profileIds.has(item.id));
  const sessions = incoming.sessions.filter((item) => !sessionIds.has(item.id));
  const result: LibraryState = {
    schemaVersion: 1,
    activeProfileId: current.activeProfileId,
    profiles: [...current.profiles, ...profiles],
    sessions: [...current.sessions, ...sessions],
  };
  if (!isLibraryState(result))
    throw new Error('educationLearning.invalidBackup');
  return {
    profiles: profiles.length,
    sessions: sessions.length,
    duplicates: incoming.sessions.length - sessions.length,
    result: structuredClone(result),
  };
}
