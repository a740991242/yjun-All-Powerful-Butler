<script setup lang="ts">
import type { PlaceValueAction } from './place-value';
import type { JoinAction } from './shape-join';
import type { Visual, VisualState } from './types';

import { computed, ref, watch } from 'vue';

import { Button, Table } from 'ant-design-vue';

import { $t } from '#/locales';

import ArithmeticGrid from './ArithmeticGrid.vue';
import AssemblyCandidates from './AssemblyCandidates.vue';
import BeadChain from './BeadChain.vue';
import BlockCards from './BlockCards.vue';
import BnuBuilding from './BnuBuilding.vue';
import BnuCaterpillar from './BnuCaterpillar.vue';
import BnuFinalClassification from './BnuFinalClassification.vue';
import BnuFinalColor from './BnuFinalColor.vue';
import BnuFinalPosition from './BnuFinalPosition.vue';
import BnuFinalSolids from './BnuFinalSolids.vue';
import BnuSixCardGame from './BnuSixCardGame.vue';
import BookGroups from './BookGroups.vue';
import { breakTen } from './borrowing';
import CardEquation from './CardEquation.vue';
import CardGame from './CardGame.vue';
import ChildActivities from './ChildActivities.vue';
import CircularNumberArray from './CircularNumberArray.vue';
import ClassCapacity from './ClassCapacity.vue';
import ClassificationRecord from './ClassificationRecord.vue';
import Clock from './Clock.vue';
import ClockCounting from './ClockCounting.vue';
import ColumnDigits from './ColumnDigits.vue';
import ComparisonBars from './ComparisonBars.vue';
import ComparisonRows from './ComparisonRows.vue';
import CompositeShapes from './CompositeShapes.vue';
import CrossBalance from './CrossBalance.vue';
import CubeColumns from './CubeColumns.vue';
import CubePair from './CubePair.vue';
import CupCards from './CupCards.vue';
import DigitCounter from './DigitCounter.vue';
import EmbeddedShapes from './EmbeddedShapes.vue';
import EstimateDots from './EstimateDots.vue';
import FinalPlaneCards from './FinalPlaneCards.vue';
import FinalStories from './FinalStories.vue';
import FoldCutJoin from './FoldCutJoin.vue';
import FruitMaze from './FruitMaze.vue';
import GeoboardShift from './GeoboardShift.vue';
import GridPaths from './GridPaths.vue';
import { hundredPosition } from './hundred-chart';
import HundredFragments from './HundredFragments.vue';
import { knowledgeCards, selectedKnowledgeCard } from './knowledge-cards';
import MagicGrid from './MagicGrid.vue';
import MathStory from './MathStory.vue';
import MonthCalendar from './MonthCalendar.vue';
import MonthWeather from './MonthWeather.vue';
import MotionFrames from './MotionFrames.vue';
import MotionSequences from './MotionSequences.vue';
import NatureCards from './NatureCards.vue';
import NumberFrame from './NumberFrame.vue';
import NumberLineGrid from './NumberLineGrid.vue';
import NumberStrip from './NumberStrip.vue';
import NumberTower from './NumberTower.vue';
import OcclusionViews from './OcclusionViews.vue';
import PaperFold from './PaperFold.vue';
import ParadeFrames from './ParadeFrames.vue';
import PartitionedSquare from './PartitionedSquare.vue';
import PeriodicFlags from './PeriodicFlags.vue';
import PeriodicShapes from './PeriodicShapes.vue';
import { pinyinTone } from './pinyin-tone';
import { exchangePlaceValue, placeValue } from './place-value';
import PlaneCards from './PlaneCards.vue';
import PoolScene from './PoolScene.vue';
import QuantityTable from './QuantityTable.vue';
import QuarterCircle from './QuarterCircle.vue';
import ReadingTable from './ReadingTable.vue';
import RectangleCut from './RectangleCut.vue';
import RegionPair from './RegionPair.vue';
import RegroupSticks from './RegroupSticks.vue';
import { required } from './required';
import RotatingPatch from './RotatingPatch.vue';
import SeatGrid from './SeatGrid.vue';
import SemesterGrid from './SemesterGrid.vue';
import {
  initialShapeJoin,
  isShapeJoinState,
  joinedShape,
  moveTriangle,
  trianglePoints,
} from './shape-join';
import ShapeCollage from './ShapeCollage.vue';
import ShapePatch from './ShapePatch.vue';
import SmallArithmetic from './SmallArithmetic.vue';
import SolidBuild from './SolidBuild.vue';
import SolidFaceTraces from './SolidFaceTraces.vue';
import SolidInstructions from './SolidInstructions.vue';
import SolidPattern from './SolidPattern.vue';
import SolidRecompose from './SolidRecompose.vue';
import SolidRow from './SolidRow.vue';
import SquareMosaic from './SquareMosaic.vue';
import StickOutline from './StickOutline.vue';
import StockTable from './StockTable.vue';
import SumLines from './SumLines.vue';
import SurveyTable from './SurveyTable.vue';
import TeenAdditionTable from './TeenAdditionTable.vue';
import TeenArithmeticGrid from './TeenArithmeticGrid.vue';
import TeenLayout from './TeenLayout.vue';
import { toggleTenCell } from './ten-cells';
import TenTables from './TenTables.vue';
import ThreePieceJoin from './ThreePieceJoin.vue';
import TileGrid from './TileGrid.vue';
import TriangleMosaic from './TriangleMosaic.vue';
import TriangleMove from './TriangleMove.vue';
import TriangleRows from './TriangleRows.vue';
import TwoPieceJoin from './TwoPieceJoin.vue';
import ViewpointHouse from './ViewpointHouse.vue';
import ViewpointJug from './ViewpointJug.vue';
import ZeroNumberChart from './ZeroNumberChart.vue';

const props = defineProps<{
  visual: Visual;
  interactive?: boolean;
  state?: VisualState;
}>();
const emit = defineEmits<{ 'update:state': [state: VisualState] }>();
const timetableColumns = computed(() =>
  props.visual.kind === 'timetable'
    ? [
        {
          title: $t('educationLearning.timetablePeriod'),
          dataIndex: 'period',
          width: 100,
        },
        ...props.visual.days.map((day, index) => ({
          title: day,
          dataIndex: `day${index}`,
          width: 100,
        })),
      ]
    : [],
);
const timetableRows = computed(() =>
  props.visual.kind === 'timetable'
    ? props.visual.rows.map((row) => ({
        period: row.period,
        ...Object.fromEntries(
          row.subjects.map((subject, index) => [`day${index}`, subject]),
        ),
      }))
    : [],
);
const localState = ref<VisualState>({});
const knowledgeCard = computed(() =>
  selectedKnowledgeCard(toolState.value.knowledgeCard),
);
const toolState = computed(() => props.state ?? localState.value);
const touched = computed(() => toolState.value.touched ?? []);
const join = computed(() =>
  (() => {
    if (props.visual.kind === 'shape-join')
      return isShapeJoinState(toolState.value.shapeJoin)
        ? toolState.value.shapeJoin
        : initialShapeJoin();
    return null;
  })(),
);
const joined = computed(() => (join.value ? joinedShape(join.value) : null));
function canMoveJoin(action: JoinAction) {
  if (!join.value) return false;
  const before = required(join.value.pieces[join.value.selected]);
  const after = required(
    moveTriangle(join.value, action).pieces[join.value.selected],
  );
  return (
    before.x !== after.x || before.y !== after.y || before.turn !== after.turn
  );
}
function moveJoin(action: JoinAction) {
  if (join.value && props.interactive)
    change({ shapeJoin: moveTriangle(join.value, action) });
}
function selectJoinPiece(selected: number) {
  if (join.value && props.interactive)
    change({ shapeJoin: { ...structuredClone(join.value), selected } });
}
const bundles = computed(() =>
  props.visual.kind === 'place-value'
    ? placeValue(props.visual.value, toolState.value.placeValue)
    : null,
);
function exchange(action: PlaceValueAction) {
  if (props.visual.kind !== 'place-value') return;
  change({
    placeValue: exchangePlaceValue(
      props.visual.value,
      toolState.value.placeValue,
      action,
    ),
  });
}
const subtraction = computed(() =>
  props.visual.kind === 'break-ten'
    ? breakTen(props.visual.left, props.visual.right, toolState.value)
    : null,
);
const transferred = computed(() =>
  props.visual.kind === 'ten-frame'
    ? Math.max(
        0,
        Math.min(
          toolState.value.transferred ?? 0,
          10 - props.visual.left,
          props.visual.right,
        ),
      )
    : 0,
);
const position = computed(() =>
  props.visual.kind === 'number-line'
    ? Math.max(
        props.visual.minimum,
        Math.min(
          props.visual.maximum,
          toolState.value.position ?? props.visual.value,
        ),
      )
    : 0,
);
const directions = ['left', 'right', 'up', 'down'] as const;
const chart = computed(() =>
  props.visual.kind === 'hundred-chart'
    ? hundredPosition(
        Math.max(
          1,
          Math.min(100, toolState.value.position ?? props.visual.value),
        ),
      )
    : null,
);
function change(patch: VisualState) {
  const next = { ...toolState.value, ...patch };
  localState.value = next;
  emit('update:state', next);
}
watch(
  () => props.visual,
  () => {
    localState.value = {};
  },
);
const frames = computed(() =>
  props.visual.kind === 'ten-frame'
    ? [
        props.visual.left + transferred.value,
        props.visual.right - transferred.value,
      ]
    : [],
);
function toggle(index: number) {
  change({
    touched: touched.value.includes(index)
      ? touched.value.filter((value) => value !== index)
      : [...touched.value, index],
  });
}
function transfer() {
  if (props.visual.kind !== 'ten-frame') return;
  change({ transferred: Math.min(10 - props.visual.left, props.visual.right) });
}
const shapeDescription = computed(() =>
  props.visual.kind === 'shape'
    ? $t(`educationLearning.shape_${props.visual.shape}`)
    : '',
);
</script>

<template>
  <figure
    class="learning-visual my-4 rounded-xl border border-border bg-muted/30 p-4"
    :aria-label="$t('educationLearning.diagram')"
  >
    <section v-if="visual.kind === 'knowledge-map'" data-knowledge-map>
      <p class="mb-3 text-muted-foreground">
        {{ $t('educationLearning.knowledgeCardsNotice') }}
      </p>
      <div
        class="grid grid-cols-1 gap-3 sm:grid-cols-2"
        :aria-label="$t('educationLearning.knowledgeCardsLabel')"
      >
        <Button
          v-for="(card, index) in knowledgeCards"
          :key="card.topic"
          class="knowledge-card-button !h-auto !min-h-11 min-w-0 w-full"
          :type="card === knowledgeCard ? 'primary' : 'default'"
          :aria-pressed="card === knowledgeCard"
          @click="change({ knowledgeCard: index })"
        >
          {{ $t(`educationLearning.knowledgeCards.${card.topic}.title`) }}
        </Button>
      </div>
      <div class="mt-4" aria-live="polite" aria-atomic="true">
        <h3 class="text-lg font-semibold">
          {{
            $t(`educationLearning.knowledgeCards.${knowledgeCard.topic}.title`)
          }}
        </h3>
        <Visual :visual="knowledgeCard.visual" />
        <p class="break-words text-lg font-semibold">
          {{ knowledgeCard.equation }}
        </p>
        <p class="mt-3">
          {{
            $t(`educationLearning.knowledgeCards.${knowledgeCard.topic}.text`)
          }}
        </p>
      </div>
    </section>
    <QuarterCircle
      v-else-if="visual.kind === 'quarter-circle'"
      :visual="visual"
    />
    <TwoPieceJoin
      v-else-if="visual.kind === 'two-piece-join'"
      :visual="visual"
    />
    <BookGroups v-else-if="visual.kind === 'book-groups'" :visual="visual" />
    <BnuFinalClassification
      v-else-if="visual.kind === 'bnu-final-classification'"
      :visual="visual"
    />
    <BnuFinalPosition
      v-else-if="visual.kind === 'bnu-final-position'"
      :visual="visual"
    />
    <BnuFinalSolids
      v-else-if="visual.kind === 'bnu-final-solids'"
      :visual="visual"
    />
    <BnuFinalColor
      v-else-if="visual.kind === 'bnu-final-color'"
      :visual="visual"
    />
    <TriangleRows
      v-else-if="visual.kind === 'triangle-rows'"
      :visual="visual"
    />
    <NumberStrip v-else-if="visual.kind === 'number-strip'" :visual="visual" />
    <NumberLineGrid
      v-else-if="visual.kind === 'number-line-grid'"
      :visual="visual"
    />
    <BnuBuilding v-else-if="visual.kind === 'bnu-building'" :visual="visual" />
    <BnuCaterpillar v-else-if="visual.kind === 'bnu-caterpillar'" />
    <BnuSixCardGame v-else-if="visual.kind === 'bnu-six-card-game'" />
    <FruitMaze v-else-if="visual.kind === 'fruit-maze'" :visual="visual" />
    <CardEquation
      v-else-if="visual.kind === 'card-equation'"
      :visual="visual"
    />
    <ColumnDigits
      v-else-if="visual.kind === 'column-digits'"
      :visual="visual"
    />
    <CubeColumns v-else-if="visual.kind === 'cube-columns'" :visual="visual" />
    <PeriodicFlags
      v-else-if="visual.kind === 'periodic-flags'"
      :visual="visual"
    />
    <ShapePatch v-else-if="visual.kind === 'shape-patch'" :visual="visual" />
    <PeriodicShapes
      v-else-if="visual.kind === 'periodic-shapes'"
      :visual="visual"
    />
    <CompositeShapes
      v-else-if="visual.kind === 'composite-shapes'"
      :visual="visual"
    />
    <FoldCutJoin v-else-if="visual.kind === 'fold-cut-join'" :visual="visual" />
    <RectangleCut
      v-else-if="visual.kind === 'rectangle-cut'"
      :visual="visual"
    />
    <PlaneCards v-else-if="visual.kind === 'plane-cards'" :visual="visual" />
    <PartitionedSquare
      v-else-if="visual.kind === 'partitioned-square'"
      :visual="visual"
    />
    <SmallArithmetic
      v-else-if="visual.kind === 'small-arithmetic'"
      :visual="visual"
    />
    <ArithmeticGrid
      v-else-if="visual.kind === 'arithmetic-grid'"
      :visual="visual"
    />
    <TeenAdditionTable
      v-else-if="visual.kind === 'teen-addition-table'"
      :visual="visual"
    />
    <TenTables v-else-if="visual.kind === 'ten-tables'" :visual="visual" />
    <SolidRecompose
      v-else-if="visual.kind === 'solid-recompose'"
      :visual="visual"
    />
    <SolidPattern
      v-else-if="visual.kind === 'solid-pattern'"
      :visual="visual"
    />
    <CubePair v-else-if="visual.kind === 'cube-pair'" :visual="visual" />
    <SemesterGrid
      v-else-if="visual.kind === 'semester-grid'"
      :visual="visual"
    />
    <SolidInstructions
      v-else-if="visual.kind === 'solid-instructions'"
      :visual="visual"
    />
    <SolidBuild v-else-if="visual.kind === 'solid-build'" :visual="visual" />
    <BeadChain v-else-if="visual.kind === 'bead-chain'" :visual="visual" />
    <FinalStories
      v-else-if="visual.kind === 'final-stories'"
      :visual="visual"
    />
    <ReadingTable
      v-else-if="visual.kind === 'reading-table'"
      :visual="visual"
    />
    <MagicGrid v-else-if="visual.kind === 'magic-grid'" :visual="visual" />
    <NumberTower v-else-if="visual.kind === 'number-tower'" :visual="visual" />
    <QuantityTable
      v-else-if="visual.kind === 'quantity-table'"
      :visual="visual"
    />
    <Clock
      v-else-if="visual.kind === 'clock' || visual.kind === 'bnu-day-clock'"
      :visual="visual"
    />
    <CardGame
      v-else-if="visual.kind === 'card-game'"
      :visual="visual"
      :state="toolState.cardGame"
      :interactive="interactive"
      @change="(cardGame) => change({ cardGame })"
    />
    <SumLines v-else-if="visual.kind === 'sum-lines'" :visual="visual" />
    <TileGrid v-else-if="visual.kind === 'tile-grid'" :visual="visual" />
    <SolidRow v-else-if="visual.kind === 'solid-row'" :visual="visual" />
    <RegionPair v-else-if="visual.kind === 'region-pair'" :visual="visual" />
    <GridPaths v-else-if="visual.kind === 'grid-paths'" :visual="visual" />
    <SeatGrid v-else-if="visual.kind === 'seat-grid'" :visual="visual" />
    <TeenArithmeticGrid
      v-else-if="visual.kind === 'teen-arithmetic-grid'"
      :visual="visual"
    />
    <MonthWeather
      v-else-if="visual.kind === 'month-weather'"
      :visual="visual"
    />
    <TeenLayout v-else-if="visual.kind === 'teen-layout'" :visual="visual" />
    <div v-else-if="visual.kind === 'count-groups'" class="flex flex-col gap-4">
      <p class="text-base text-muted-foreground">
        {{ $t('educationLearning.countGroupsInstruction') }}
      </p>
      <div class="grid gap-3 sm:grid-cols-2">
        <section
          v-for="(count, group) in visual.groups"
          :key="group"
          class="rounded-lg border-2 border-border p-3"
          :aria-label="$t('educationLearning.group', { number: group + 1 })"
        >
          <p class="mb-3 text-base font-semibold">
            {{ $t('educationLearning.group', { number: group + 1 }) }}
          </p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="dot in count"
              :key="dot"
              class="flex size-9 items-center justify-center text-2xl text-primary"
              role="img"
              :aria-label="
                $t('educationLearning.object', {
                  number: dot,
                  group: group + 1,
                })
              "
            >
              ●
            </span>
            <span v-if="count === 0" class="text-muted-foreground">
              {{ $t('educationLearning.none') }}
            </span>
          </div>
        </section>
      </div>
    </div>
    <div v-else-if="visual.kind === 'count'" class="flex flex-col gap-4">
      <div
        v-for="(count, group) in visual.other === undefined
          ? [visual.count]
          : [visual.count, visual.other]"
        :key="group"
        class="flex flex-wrap gap-2"
        :aria-label="$t('educationLearning.group', { number: group + 1 })"
      >
        <p
          v-if="visual.other !== undefined"
          class="basis-full text-base font-semibold"
        >
          {{ $t('educationLearning.group', { number: group + 1 }) }}
        </p>
        <Button
          v-for="dot in count"
          :key="dot"
          class="!h-11 !w-11 !p-0"
          :type="touched.includes(group * 100 + dot) ? 'primary' : 'default'"
          :aria-pressed="touched.includes(group * 100 + dot)"
          :aria-label="
            $t('educationLearning.object', { number: dot, group: group + 1 })
          "
          @click="toggle(group * 100 + dot)"
        >
          <span class="text-2xl" aria-hidden="true">
            {{ touched.includes(group * 100 + dot) ? '✓' : '●' }}
          </span>
        </Button>
        <span v-if="count === 0" class="text-muted-foreground">
          {{ $t('educationLearning.none') }}
        </span>
      </div>
      <p class="text-sm text-muted-foreground">
        {{ $t('educationLearning.touchCount') }}
      </p>
      <Button class="!min-h-11 self-start" @click="change({ touched: [] })">
        {{ $t('educationLearning.resetVisual') }}
      </Button>
    </div>
    <div
      v-else-if="visual.kind === 'break-ten' && subtraction"
      class="flex flex-col gap-4"
    >
      <p class="text-xl font-medium">{{ visual.left }} − {{ visual.right }}</p>
      <p>{{ $t('educationLearning.breakTenInstruction') }}</p>
      <div class="grid gap-4 sm:grid-cols-2">
        <div class="rounded border border-border p-3">
          <p class="mb-3 font-medium">{{ $t('educationLearning.oneTen') }}</p>
          <div v-if="!subtraction.broken" class="text-3xl text-primary">▥</div>
          <div v-else class="grid grid-cols-5 gap-2">
            <span
              v-for="dot in 10"
              :key="dot"
              class="flex min-h-11 items-center justify-center rounded border border-border text-xl"
              :class="
                dot <= subtraction.removed
                  ? 'text-muted-foreground line-through'
                  : 'bg-primary/15 text-primary'
              "
            >
              {{ dot <= subtraction.removed ? '×' : '●' }}
            </span>
          </div>
        </div>
        <div class="rounded border border-border p-3">
          <p class="mb-3 font-medium">
            {{ $t('educationLearning.originalOnes') }}
          </p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="dot in subtraction.originalOnes"
              :key="dot"
              class="flex size-11 items-center justify-center rounded border border-border bg-primary/15 text-xl text-primary"
            >
              ●
            </span>
          </div>
        </div>
      </div>
      <p aria-live="polite">
        {{
          $t('educationLearning.removalProgress', {
            removed: subtraction.removed,
            target: visual.right,
          })
        }}
      </p>
      <p v-if="subtraction.complete" class="text-xl font-medium">
        {{ subtraction.tenRemaining }} + {{ subtraction.originalOnes }} =
        {{ subtraction.remaining }}
      </p>
      <div v-if="interactive" class="flex flex-wrap gap-2">
        <Button
          class="!min-h-11"
          :disabled="subtraction.broken"
          @click="change({ broken: true, removed: 0 })"
        >
          {{ $t('educationLearning.breakOneTen') }}
        </Button>
        <Button
          class="!min-h-11"
          :disabled="!subtraction.broken || subtraction.complete"
          @click="change({ removed: subtraction.removed + 1 })"
        >
          {{ $t('educationLearning.removeOne') }}
        </Button>
        <Button
          class="!min-h-11"
          :disabled="subtraction.removed === 0"
          @click="change({ removed: subtraction.removed - 1 })"
        >
          {{ $t('educationLearning.returnOne') }}
        </Button>
        <Button
          class="!min-h-11"
          @click="change({ broken: false, removed: 0 })"
        >
          {{ $t('educationLearning.resetVisual') }}
        </Button>
      </div>
    </div>
    <div v-else-if="visual.kind === 'ten-cells'" class="flex flex-col gap-4">
      <p class="text-xl">{{ $t('educationLearning.tenCellsInstruction') }}</p>
      <div
        class="grid w-full max-w-sm grid-cols-5 gap-2"
        :aria-label="$t('educationLearning.tenCellsBoard')"
      >
        <Button
          v-for="cell in 10"
          :key="cell"
          class="!min-h-11 !min-w-11 !p-0 !text-xl"
          :type="toolState.tenCells?.includes(cell - 1) ? 'primary' : 'default'"
          :aria-label="$t('educationLearning.tenCellsCell', { number: cell })"
          :aria-pressed="toolState.tenCells?.includes(cell - 1) ?? false"
          :disabled="!interactive"
          @click="
            change({
              tenCells: toggleTenCell(toolState.tenCells ?? [], cell - 1),
            })
          "
        >
          {{ toolState.tenCells?.includes(cell - 1) ? '●' : '○' }}
        </Button>
      </div>
      <Button
        v-if="interactive"
        class="!min-h-11 self-start"
        @click="change({ tenCells: [] })"
      >
        {{ $t('educationLearning.resetVisual') }}
      </Button>
    </div>
    <div v-else-if="visual.kind === 'ten-frame'" class="flex flex-col gap-4">
      <div
        v-for="(count, group) in frames"
        :key="group"
        class="grid w-full max-w-sm grid-cols-5 gap-2"
        :aria-label="$t('educationLearning.tenFrame', { number: group + 1 })"
      >
        <div
          v-for="cell in 10"
          :key="cell"
          class="flex min-h-11 items-center justify-center rounded border border-border text-xl"
          :class="cell <= count ? 'bg-primary/15 text-primary' : ''"
        >
          {{ cell <= count ? '●' : '·' }}
        </div>
      </div>
      <div v-if="interactive" class="flex flex-wrap gap-2">
        <Button class="!min-h-11" @click="transfer">
          {{ $t('educationLearning.makeTen') }}
        </Button>
        <Button class="!min-h-11" @click="change({ transferred: 0 })">
          {{ $t('educationLearning.resetVisual') }}
        </Button>
      </div>
    </div>
    <div
      v-else-if="visual.kind === 'place-value' && bundles"
      class="flex flex-col gap-4"
    >
      <p v-if="interactive" class="text-xl font-medium" aria-live="polite">
        {{
          $t('educationLearning.bundleQuantity', {
            value: bundles.value,
            hundreds: bundles.hundreds,
            tens: bundles.tens,
            ones: bundles.ones,
          })
        }}
      </p>
      <p v-else class="text-sm text-muted-foreground">
        {{ $t('educationLearning.bundleObserve') }}
      </p>
      <div class="grid grid-cols-3 gap-2">
        <div
          v-for="(number, place) in [
            bundles.hundreds,
            bundles.tens,
            bundles.ones,
          ]"
          :key="place"
          class="min-w-0 rounded border border-border p-2 text-center"
        >
          <p class="mb-3 font-medium">
            {{
              $t(
                `educationLearning.${['hundredUnits', 'tenUnits', 'oneUnits'][place]}`,
              )
            }}
          </p>
          <div
            class="flex flex-wrap justify-center gap-1"
            role="img"
            :aria-label="
              $t('educationLearning.bundleGroup', {
                number,
                unit: place === 0 ? 100 : place === 1 ? 10 : 1,
              })
            "
          >
            <svg
              v-for="n in number"
              :key="n"
              :viewBox="
                place === 0
                  ? '0 0 66 66'
                  : place === 1
                    ? '0 0 36 44'
                    : '0 0 8 44'
              "
              :class="
                place === 0
                  ? 'h-16 w-16'
                  : place === 1
                    ? 'h-11 w-9'
                    : 'h-11 w-2'
              "
              class="text-primary"
              aria-hidden="true"
            >
              <g v-if="place === 0" stroke="currentColor" stroke-width="2">
                <path
                  v-for="stick in 100"
                  :key="stick"
                  :d="`M${4 + ((stick - 1) % 10) * 6} ${3 + Math.floor((stick - 1) / 10) * 6} v4`"
                />
              </g>
              <g v-else-if="place === 1" stroke="currentColor" stroke-width="2">
                <path
                  v-for="stick in 10"
                  :key="stick"
                  :d="`M${3 + (stick - 1) * 3.3} 3 v38`"
                />
                <path d="M1 21 H35 M1 24 H35" class="text-foreground" />
              </g>
              <path
                v-else
                d="M4 3 v38"
                stroke="currentColor"
                stroke-width="3"
              />
            </svg>
            <span v-if="!number">0</span>
          </div>
        </div>
      </div>
      <p v-if="interactive" class="text-muted-foreground">
        {{ $t('educationLearning.bundleInstruction') }}
      </p>
      <p v-if="interactive" class="font-medium">
        {{
          $t('educationLearning.canonicalPlaces', {
            value: bundles.value,
            hundreds: Math.floor(bundles.value / 100),
            tens: Math.floor(bundles.value / 10) % 10,
            ones: bundles.value % 10,
          })
        }}
      </p>
      <div v-if="interactive" class="flex flex-wrap gap-3">
        <Button
          class="!min-h-11"
          :disabled="!bundles.canBundleTen"
          @click="exchange('bundle-ten')"
        >
          {{ $t('educationLearning.bundleTen') }}
        </Button>
        <Button
          class="!min-h-11"
          :disabled="!bundles.canSplitTen"
          @click="exchange('split-ten')"
        >
          {{ $t('educationLearning.splitTen') }}
        </Button>
        <Button
          v-if="bundles.value === 100"
          class="!min-h-11"
          :disabled="!bundles.canBundleHundred"
          @click="exchange('bundle-hundred')"
        >
          {{ $t('educationLearning.bundleHundred') }}
        </Button>
        <Button
          v-if="bundles.value === 100"
          class="!min-h-11"
          :disabled="!bundles.canSplitHundred"
          @click="exchange('split-hundred')"
        >
          {{ $t('educationLearning.splitHundred') }}
        </Button>
        <Button
          class="!min-h-11"
          @click="
            change({
              placeValue: {
                value: bundles.value,
                hundreds: Math.floor(bundles.value / 100),
                tens: Math.floor(bundles.value / 10) % 10,
              },
            })
          "
        >
          {{ $t('educationLearning.resetVisual') }}
        </Button>
      </div>
    </div>
    <HundredFragments
      v-else-if="visual.kind === 'hundred-fragments'"
      :visual="visual"
    />
    <div
      v-else-if="visual.kind === 'hundred-chart' && chart"
      class="flex flex-col gap-4"
    >
      <p class="text-xl font-medium" aria-live="polite">
        {{
          $t('educationLearning.chartPosition', {
            number: chart.value,
            row: chart.row,
            column: chart.column,
          })
        }}
      </p>
      <p class="text-sm text-muted-foreground">
        {{ $t('educationLearning.chartInstructions') }}
      </p>
      <div
        class="max-w-full overflow-x-auto pb-2"
        tabindex="0"
        :aria-label="$t('educationLearning.hundredChart')"
      >
        <div class="grid w-max grid-cols-10 gap-1">
          <Button
            v-for="value in 100"
            :key="value"
            class="!h-11 !w-11 !p-0"
            :type="chart.value === value ? 'primary' : 'default'"
            :aria-pressed="chart.value === value"
            :aria-label="$t('educationLearning.chartNumber', { number: value })"
            :disabled="!interactive"
            @click="change({ position: value })"
          >
            {{ value }}
          </Button>
        </div>
      </div>
      <div v-if="interactive" class="flex flex-wrap gap-2">
        <Button
          v-for="direction in directions"
          :key="direction"
          class="!min-h-11"
          :disabled="chart[direction] === null"
          @click="change({ position: chart[direction] ?? chart.value })"
        >
          {{ $t(`educationLearning.chart_${direction}`) }}
        </Button>
        <Button class="!min-h-11" @click="change({ position: visual.value })">
          {{ $t('educationLearning.resetVisual') }}
        </Button>
      </div>
    </div>
    <div v-else-if="visual.kind === 'queue'" class="flex flex-col gap-2">
      <div class="overflow-x-auto">
        <div
          :style="{
            minWidth:
              visual.labels.length > 5 ? `${visual.labels.length * 64}px` : '0',
          }"
        >
          <div class="flex justify-between text-sm text-muted-foreground">
            <span>
              {{
                $t(
                  visual.front === 'left'
                    ? 'educationLearning.queueFront'
                    : 'educationLearning.queueRear',
                )
              }}
            </span>
            <span aria-hidden="true">
              {{ visual.front === 'left' ? '→' : '←' }}
            </span>
            <span>
              {{
                $t(
                  visual.front === 'right'
                    ? 'educationLearning.queueFront'
                    : 'educationLearning.queueRear',
                )
              }}
            </span>
          </div>
          <svg
            :viewBox="`0 0 ${Math.max(360, visual.labels.length * 64)} 90`"
            class="block w-full"
            role="img"
            :aria-label="
              $t('educationLearning.queueLabels', {
                labels: visual.labels.join('、'),
              })
            "
          >
            <g
              v-for="(label, index) in visual.labels"
              :key="label"
              :transform="`translate(${((index + 0.5) * Math.max(360, visual.labels.length * 64)) / visual.labels.length}, 0)`"
              stroke="currentColor"
              class="text-primary"
            >
              <circle cx="0" cy="25" r="10" fill="none" stroke-width="2" />
              <path
                d="M0 35 V64 M-16 48 H16 M0 64 L-13 82 M0 64 L13 82"
                fill="none"
                stroke-width="2"
                stroke-linecap="round"
              />
            </g>
          </svg>
          <div
            class="grid text-sm text-primary sm:text-base"
            :style="{
              gridTemplateColumns: `repeat(${visual.labels.length}, minmax(0, 1fr))`,
            }"
          >
            <span
              v-for="label in visual.labels"
              :key="label"
              class="break-all text-center"
            >
              {{ label }}
            </span>
          </div>
        </div>
      </div>
      <span
        v-if="visual.labels.length > 5"
        class="text-sm text-muted-foreground"
      >
        {{ $t('educationLearning.queueScroll') }}
      </span>
      <span class="text-sm text-muted-foreground">
        {{ $t('educationLearning.queueInstruction') }}
      </span>
    </div>
    <svg
      v-else-if="visual.kind === 'nature-scene'"
      viewBox="0 0 420 250"
      class="mx-auto block w-full max-w-lg"
      role="img"
      :aria-label="$t(`educationLearning.scene_${visual.variant}`)"
    >
      <rect
        x="1"
        y="1"
        width="418"
        height="248"
        rx="16"
        fill="hsl(var(--primary) / 0.08)"
        stroke="hsl(var(--border))"
      />
      <path
        d="M2 190 Q110 125 220 178 Q320 130 418 185 V232 Q418 248 402 248 H18 Q2 248 2 232 Z"
        fill="hsl(var(--primary) / 0.16)"
      />
      <g
        :transform="
          visual.variant === 'hill' ? 'translate(0 0)' : 'translate(210 8)'
        "
        fill="hsl(var(--muted-foreground) / 0.3)"
        stroke="hsl(var(--muted-foreground))"
      >
        <path
          d="M45 65 C24 64 24 42 46 43 C43 17 81 19 82 39 C99 25 120 43 108 60 C130 65 121 78 105 78 H49 C40 78 33 71 45 65Z"
        />
      </g>
      <path
        v-if="visual.variant === 'hill'"
        d="M270 157 L326 89 L380 170"
        fill="hsl(var(--primary) / 0.12)"
        stroke="hsl(var(--border))"
      />
      <g v-else stroke="hsl(var(--primary) / 0.6)" stroke-width="4" fill="none">
        <path
          d="M310 199 V143 M310 164 Q283 134 281 153 Q283 174 310 171 M310 175 Q340 140 341 163 Q340 180 310 182"
        />
      </g>
      <g
        v-for="x in visual.variant === 'hill' ? [167, 212] : [84, 145]"
        :key="x"
        :transform="`translate(${x} 134)`"
        fill="none"
        stroke="hsl(var(--foreground))"
        stroke-width="4"
        stroke-linecap="round"
      >
        <circle cx="0" cy="0" r="9" />
        <path d="M0 10 V40 M-16 24 L0 15 L16 24 M0 40 L-13 61 M0 40 L13 61" />
      </g>
      <g fill="hsl(var(--card))" stroke="hsl(var(--primary))" stroke-width="2">
        <circle
          :cx="visual.variant === 'hill' ? 138 : 54"
          :cy="visual.variant === 'hill' ? 58 : 158"
          r="15"
        />
        <circle
          :cx="visual.variant === 'hill' ? 95 : 350"
          :cy="visual.variant === 'hill' ? 210 : 69"
          r="15"
        />
        <circle
          :cx="visual.variant === 'hill' ? 245 : 232"
          :cy="visual.variant === 'hill' ? 156 : 214"
          r="15"
        />
      </g>
      <g
        fill="hsl(var(--foreground))"
        font-size="18"
        font-weight="600"
        text-anchor="middle"
        dominant-baseline="central"
      >
        <text
          :x="visual.variant === 'hill' ? 138 : 54"
          :y="visual.variant === 'hill' ? 58 : 158"
        >
          1
        </text>
        <text
          :x="visual.variant === 'hill' ? 95 : 350"
          :y="visual.variant === 'hill' ? 210 : 69"
        >
          2
        </text>
        <text
          :x="visual.variant === 'hill' ? 245 : 232"
          :y="visual.variant === 'hill' ? 156 : 214"
        >
          3
        </text>
      </g>
    </svg>
    <div v-else-if="visual.kind === 'characters'" class="flex flex-wrap gap-3">
      <div
        v-for="(character, index) in visual.characters"
        :key="index"
        class="flex flex-col items-center gap-2"
      >
        <div
          class="character-grid relative flex h-20 items-center justify-center border border-border text-4xl"
          :class="
            visual.grid === 'pinyin' ? 'pinyin-grid min-w-20 px-2' : 'w-20'
          "
        >
          <span class="relative">{{ character }}</span>
        </div>
        <svg
          v-if="visual.grid === 'pinyin' && pinyinTone(character)"
          viewBox="0 0 72 40"
          class="h-10 w-20 text-primary"
          role="img"
          :aria-label="
            $t('educationLearning.toneDirection', {
              tone: pinyinTone(character)?.number,
            })
          "
        >
          <path
            :d="pinyinTone(character)?.path"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
          />
        </svg>
      </div>
    </div>
    <div
      v-else-if="visual.kind === 'column'"
      class="mx-auto w-fit min-w-32 font-mono text-3xl leading-relaxed tracking-[0.3em]"
      :aria-label="
        $t('educationLearning.columnDiagram', {
          left: visual.left,
          operator: visual.operator,
          right: visual.right,
        })
      "
    >
      <div class="text-right">{{ visual.left }}</div>
      <div class="flex justify-between gap-3 border-b-2 border-current">
        <span>{{ visual.operator }}</span>
        <span>{{ visual.right }}</span>
      </div>
      <div class="text-right">?</div>
    </div>
    <div v-else-if="visual.kind === 'money'" class="flex flex-wrap gap-3">
      <div
        v-for="(cents, index) in visual.cents"
        :key="index"
        class="rounded-lg border border-border bg-primary/10 p-4 text-lg"
      >
        {{
          $t('educationLearning.moneyCard', {
            yuan: Math.floor(cents / 100),
            jiao: Math.floor(cents / 10) % 10,
            fen: cents % 10,
          })
        }}
      </div>
    </div>
    <MathStory v-else-if="visual.kind === 'math-story'" :visual="visual" />
    <ClassCapacity
      v-else-if="visual.kind === 'class-capacity'"
      :visual="visual"
    />
    <OcclusionViews
      v-else-if="visual.kind === 'occlusion-views'"
      :visual="visual"
    />
    <MotionSequences
      v-else-if="visual.kind === 'motion-sequences'"
      :visual="visual"
    />
    <EmbeddedShapes
      v-else-if="visual.kind === 'embedded-shapes'"
      :visual="visual"
    />
    <ParadeFrames
      v-else-if="visual.kind === 'parade-frames'"
      :visual="visual"
    />
    <MotionFrames
      v-else-if="visual.kind === 'motion-frames'"
      :visual="visual"
    />
    <ViewpointJug
      v-else-if="visual.kind === 'viewpoint-jug'"
      :visual="visual"
    />
    <ViewpointHouse
      v-else-if="visual.kind === 'viewpoint-house'"
      :visual="visual"
    />
    <ComparisonBars
      v-else-if="visual.kind === 'comparison-bars'"
      :visual="visual"
    />
    <ComparisonRows
      v-else-if="visual.kind === 'comparison-rows'"
      :visual="visual"
    />
    <div v-else-if="visual.kind === 'bars'" class="flex flex-col gap-3">
      <div class="flex gap-1">
        <div
          v-for="(part, index) in visual.parts"
          :key="index"
          class="min-w-11 rounded border border-border bg-primary/15 p-3 text-center"
          :style="{ flexGrow: part }"
        >
          {{ visual.unknown === index ? '?' : part }}
        </div>
      </div>
      <div class="rounded border border-border p-3 text-center">
        {{ $t('educationLearning.total') }}:
        {{
          visual.unknown === visual.parts.length
            ? '?'
            : visual.parts.reduce((sum, part) => sum + part, 0)
        }}
      </div>
    </div>
    <div v-else-if="visual.kind === 'number-line'" class="flex flex-col gap-4">
      <p v-if="interactive" class="text-xl font-medium" aria-live="polite">
        {{ $t('educationLearning.currentNumber', { number: position }) }}
      </p>
      <div
        class="max-w-full overflow-x-auto pb-2"
        :aria-label="$t('educationLearning.numberLine')"
        tabindex="0"
      >
        <div class="flex w-max gap-1 border-b-2 border-current pb-2">
          <Button
            v-for="n in visual.maximum - visual.minimum + 1"
            :key="n"
            class="!h-11 !min-w-11 !p-0 !text-xl !leading-8"
            :type="n + visual.minimum - 1 === position ? 'primary' : 'default'"
            :aria-pressed="n + visual.minimum - 1 === position"
            :disabled="!interactive"
            @click="change({ position: n + visual.minimum - 1 })"
          >
            {{ n + visual.minimum - 1 }}
          </Button>
        </div>
      </div>
      <div v-if="interactive" class="flex flex-wrap gap-2">
        <Button
          class="!min-h-11"
          :disabled="position <= visual.minimum"
          @click="change({ position: position - 1 })"
        >
          {{ $t('educationLearning.previousNumber') }}
        </Button>
        <Button
          class="!min-h-11"
          :disabled="position >= visual.maximum"
          @click="change({ position: position + 1 })"
        >
          {{ $t('educationLearning.nextNumber') }}
        </Button>
        <Button class="!min-h-11" @click="change({ position: visual.value })">
          {{ $t('educationLearning.resetVisual') }}
        </Button>
      </div>
    </div>
    <div v-else-if="visual.kind === 'timetable'" class="min-w-0">
      <p class="mb-3 text-muted-foreground">
        {{ $t('educationLearning.timetableOriginal') }}
      </p>
      <Table
        :columns="timetableColumns"
        :data-source="timetableRows"
        row-key="period"
        :pagination="false"
        :scroll="{ x: 100 * (visual.days.length + 1) }"
        size="small"
        bordered
        :aria-label="$t('educationLearning.timetableLabel')"
      />
    </div>
    <EstimateDots
      v-else-if="visual.kind === 'estimate-dots'"
      :visual="visual"
      :interactive="interactive"
      :state="toolState.estimateDots"
      @change="(estimateDots) => change({ estimateDots })"
    />
    <RegroupSticks
      v-else-if="visual.kind === 'regroup-sticks'"
      :visual="visual"
    />
    <StockTable v-else-if="visual.kind === 'stock-table'" :visual="visual" />
    <CrossBalance
      v-else-if="visual.kind === 'cross-balance'"
      :visual="visual"
    />
    <DigitCounter
      v-else-if="visual.kind === 'digit-counter'"
      :visual="visual"
    />
    <MonthCalendar
      v-else-if="visual.kind === 'month-calendar'"
      :visual="visual"
    />
    <ClockCounting v-else-if="visual.kind === 'clock-counting'" />
    <CircularNumberArray
      v-else-if="visual.kind === 'circular-number-array'"
      :visual="visual"
    />
    <NumberFrame v-else-if="visual.kind === 'number-frame'" :visual="visual" />
    <ZeroNumberChart
      v-else-if="visual.kind === 'zero-number-chart'"
      :visual="visual"
    />
    <ChildActivities
      v-else-if="visual.kind === 'child-activities'"
      :visual="visual"
    />
    <CupCards v-else-if="visual.kind === 'cup-cards'" :visual="visual" />
    <PoolScene v-else-if="visual.kind === 'pool-scene'" :visual="visual" />
    <NatureCards v-else-if="visual.kind === 'nature-cards'" :visual="visual" />
    <BlockCards v-else-if="visual.kind === 'block-cards'" :visual="visual" />
    <SurveyTable
      v-else-if="visual.kind === 'survey-table'"
      :visual="visual"
      :interactive="interactive"
      :state="toolState.surveyTable"
      @change="(surveyTable) => change({ surveyTable })"
    />
    <ClassificationRecord
      v-else-if="visual.kind === 'classification-record'"
      :visual="visual"
    />
    <FinalPlaneCards
      v-else-if="visual.kind === 'final-plane-cards'"
      :visual="visual"
    />
    <ShapeCollage
      v-else-if="visual.kind === 'shape-collage'"
      :visual="visual"
    />
    <TriangleMosaic
      v-else-if="visual.kind === 'triangle-mosaic'"
      :visual="visual"
      :interactive="interactive"
      :state="toolState.triangleMosaic"
      @change="(triangleMosaic) => change({ triangleMosaic })"
    />
    <TriangleMove
      v-else-if="visual.kind === 'triangle-move'"
      :visual="visual"
    />
    <SquareMosaic
      v-else-if="visual.kind === 'square-mosaic'"
      :visual="visual"
      :interactive="interactive"
      :state="toolState.squareMosaic"
      @change="(squareMosaic) => change({ squareMosaic })"
    />
    <AssemblyCandidates
      v-else-if="visual.kind === 'assembly-candidates'"
      :visual="visual"
    />
    <GeoboardShift
      v-else-if="visual.kind === 'geoboard-shift'"
      :visual="visual"
      :interactive="interactive"
      :state="toolState.geoboardShift"
      @change="(geoboardShift) => change({ geoboardShift })"
    />
    <RotatingPatch
      v-else-if="visual.kind === 'rotating-patch'"
      :visual="visual"
    />
    <SolidFaceTraces
      v-else-if="visual.kind === 'solid-face-traces'"
      :visual="visual"
    />
    <PaperFold v-else-if="visual.kind === 'paper-fold'" :visual="visual" />
    <StickOutline
      v-else-if="visual.kind === 'stick-outline'"
      :visual="visual"
    />
    <ThreePieceJoin
      v-else-if="visual.kind === 'three-piece-join'"
      :interactive="interactive"
      :state="toolState.threePieceJoin"
      @change="(threePieceJoin) => change({ threePieceJoin })"
    />
    <div
      v-else-if="visual.kind === 'shape-join' && join"
      class="flex flex-col gap-4"
    >
      <p class="font-medium" aria-live="polite">
        {{
          joined
            ? $t('educationLearning.joinedShape', {
                shape: $t(`educationLearning.joinShape_${joined}`),
              })
            : $t('educationLearning.notJoinedShape')
        }}
      </p>
      <svg
        viewBox="-0.25 -0.25 6.5 4.5"
        class="mx-auto w-full max-w-xl rounded border border-border"
        role="img"
        :aria-label="$t('educationLearning.joinBoard')"
      >
        <g stroke="hsl(var(--border))" stroke-width="0.02">
          <path v-for="x in 5" :key="`x-${x}`" :d="`M${x} 0 V4`" />
          <path v-for="y in 3" :key="`y-${y}`" :d="`M0 ${y} H6`" />
        </g>
        <g v-for="(piece, index) in join.pieces" :key="index">
          <polygon
            :points="
              trianglePoints(piece)
                .map((point) => `${point.x},${point.y}`)
                .join(' ')
            "
            fill="hsl(var(--primary))"
            :fill-opacity="index === 0 ? 0.2 : 0.45"
            stroke="hsl(var(--primary))"
            :stroke-width="join.selected === index ? 0.08 : 0.04"
          />
          <text
            :x="
              trianglePoints(piece).reduce((sum, point) => sum + point.x, 0) / 3
            "
            :y="
              trianglePoints(piece).reduce((sum, point) => sum + point.y, 0) /
                3 +
              0.12
            "
            text-anchor="middle"
            font-size="0.4"
            fill="hsl(var(--foreground))"
          >
            {{ index + 1 }}
          </text>
        </g>
      </svg>
      <p class="text-muted-foreground">
        {{ $t('educationLearning.joinInstruction') }}
      </p>
      <div v-if="interactive" class="flex flex-wrap gap-3">
        <Button
          v-for="index in 2"
          :key="index"
          class="!min-h-11"
          :type="join.selected === index - 1 ? 'primary' : 'default'"
          :aria-pressed="join.selected === index - 1"
          @click="selectJoinPiece(index - 1)"
        >
          {{ $t('educationLearning.selectTriangle', { number: index }) }}
        </Button>
      </div>
      <div v-if="interactive" class="flex flex-wrap gap-3">
        <Button
          class="!min-h-11"
          :disabled="!canMoveJoin('left')"
          @click="moveJoin('left')"
        >
          {{ $t('educationLearning.moveLeft') }}
        </Button>
        <Button
          class="!min-h-11"
          :disabled="!canMoveJoin('right')"
          @click="moveJoin('right')"
        >
          {{ $t('educationLearning.moveRight') }}
        </Button>
        <Button
          class="!min-h-11"
          :disabled="!canMoveJoin('up')"
          @click="moveJoin('up')"
        >
          {{ $t('educationLearning.moveUp') }}
        </Button>
        <Button
          class="!min-h-11"
          :disabled="!canMoveJoin('down')"
          @click="moveJoin('down')"
        >
          {{ $t('educationLearning.moveDown') }}
        </Button>
        <Button
          class="!min-h-11"
          :disabled="!canMoveJoin('rotate')"
          @click="moveJoin('rotate')"
        >
          {{ $t('educationLearning.rotateTriangle') }}
        </Button>
        <Button
          class="!min-h-11"
          @click="change({ shapeJoin: initialShapeJoin() })"
        >
          {{ $t('educationLearning.resetVisual') }}
        </Button>
      </div>
    </div>
    <div
      v-else-if="visual.kind === 'shape'"
      class="mx-auto flex max-w-sm flex-col items-center gap-3"
    >
      <svg
        viewBox="0 0 240 170"
        class="h-40 w-full text-primary"
        role="img"
        :aria-label="shapeDescription"
      >
        <g
          fill="hsl(var(--primary) / 0.12)"
          stroke="currentColor"
          stroke-width="3"
          stroke-linejoin="round"
        >
          <circle v-if="visual.shape === 'circle'" cx="120" cy="85" r="65" />
          <rect
            v-else-if="visual.shape === 'square'"
            x="55"
            y="20"
            width="130"
            height="130"
          />
          <rect
            v-else-if="visual.shape === 'rectangle'"
            x="25"
            y="40"
            width="190"
            height="90"
          />
          <path
            v-else-if="visual.shape === 'triangle'"
            d="M120 20 L215 150 H25 Z"
          />
          <path
            v-else-if="visual.shape === 'parallelogram'"
            d="M65 30 H220 L175 140 H20 Z"
          />
          <g v-else-if="visual.shape === 'cube' || visual.shape === 'cuboid'">
            <path
              :d="
                visual.shape === 'cube'
                  ? 'M50 50 H150 V145 H50 Z M50 50 L90 15 H190 L150 50 M150 145 L190 110 V15'
                  : 'M20 55 H170 V140 H20 Z M20 55 L65 20 H215 L170 55 M170 140 L215 105 V20'
              "
            />
          </g>
          <g v-else-if="visual.shape === 'cylinder'">
            <path d="M55 40 V130 C55 160 185 160 185 130 V40" />
            <ellipse cx="120" cy="40" rx="65" ry="22" />
          </g>
          <g v-else>
            <circle cx="120" cy="85" r="65" />
            <ellipse cx="120" cy="85" rx="65" ry="18" stroke-dasharray="5 4" />
            <path d="M120 20 C75 45 75 125 120 150" fill="none" />
          </g>
        </g>
      </svg>
    </div>
  </figure>
</template>

<style scoped>
.knowledge-card-button :deep(span) {
  overflow-wrap: anywhere;
  white-space: normal;
}

.character-grid::before,
.character-grid::after {
  position: absolute;
  content: '';
  border-color: hsl(var(--border));
}

.character-grid::before {
  inset: 50% 0 auto;
  border-top: 1px dashed hsl(var(--border));
}

.character-grid::after {
  inset: 0 auto 0 50%;
  border-left: 1px dashed hsl(var(--border));
}

.pinyin-grid::before {
  top: 33%;
  bottom: 33%;
  border-bottom: 1px dashed hsl(var(--border));
}

.pinyin-grid::after {
  display: none;
}
</style>
