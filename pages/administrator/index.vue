<template>
  <div class="flex px-3 py-2 gap-2">
    <UPopover :popper="{ placement: 'bottom-start' }" class="">
      <UButton icon="i-heroicons-calendar-days-20-solid"
        class="bg-red-500 hover:bg-red-600 dark:bg-red-500 dark:hover:bg-red-600 dark:text-white">
        {{ format(selected.start, 'd MMM, yyy') }} - {{ format(selected.end, 'd MMM, yyy') }}
      </UButton>

      <template #panel="{ close }">
        <div class="flex items-center sm:divide-x divide-gray-200 dark:divide-gray-800">
          <div class="hidden sm:flex flex-col py-4">
            <UButton v-for="(range, index) in ranges" :key="index" :label="range.label" color="gray" variant="ghost"
              class="rounded-none px-6"
              :class="[isRangeSelected(range.duration) ? 'bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50']"
              truncate @click="selectRange(range.duration)" />
          </div>

          <DatePicker v-model="selected" @close="close" color="red" />
        </div>
      </template>
    </UPopover>
    <UDropdown :items="items">
      <UButton color="white" :label="selectedDropdown" trailing-icon="i-heroicons-chevron-down-20-solid" />
      <template #item="{ item }">
        <UButton class="w-full justify-between" size="sm" color="gray" variant="none" :label="item.label" trailing
          @click="selectedDropdown = item.label">
          <template #trailing v-if="item.label == selectedDropdown">
            <UIcon name="i-material-symbols-light-check" class="w-5 h-5 text-red-500" />
          </template>
        </UButton>
      </template>
    </UDropdown>
  </div>

  <UDivider orientation="horizontal" />
  <div class="w-full px-3">
    <h1 @click="te=shuffle(te)">helo</h1>
    {{ chartData }}{{ te }}
    <Bar id="my-chart-id" :options="chartOptions" :data="testData" />
  </div>

</template>

<script setup lang="ts">
import { shuffle } from 'lodash';
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { sub, format, isSameDay, type Duration } from 'date-fns'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
const colorMode = useColorMode()
const data = ref([30, 40, 60, 70, 5]);
const te=ref(['#77CEFF', '#0079AF', '#123E6B', '#97B0C4', '#A5C8ED'])
const testData = computed(() => ({
      labels: ['Paris', 'Nîmes', 'Toulon', 'Perpignan', 'Autre'],
      datasets: [
        {
          data: data.value,
          backgroundColor:te.value,
        },
      ],
    }));
const isDark = computed({
  get () {
    return colorMode.value === 'dark'
  },
  set () {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})
const chartData = ref({
  labels: ['January', 'February', 'March'],
  datasets: [{
    borderColor: te.value,
    backgroundColor: colorMode.value=='dark'?'#9BD0F5':'#fff', label: 'hello', data: [40, 20, 12]
  }, { label: 'hello1', data: [40, 20, 12] }]
})
const chartOptions = ref({
  responsive: true,

})
const props = defineProps(['title'])
const date = ref()
const ranges = [
  { label: 'Last 7 days', duration: { days: 7 } },
  { label: 'Last 14 days', duration: { days: 14 } },
  { label: 'Last 30 days', duration: { days: 30 } },
  { label: 'Last 3 months', duration: { months: 3 } },
  { label: 'Last 6 months', duration: { months: 6 } },
  { label: 'Last year', duration: { years: 1 } }
]
const selected = ref({ start: sub(new Date(), { days: 14 }), end: new Date() })

function isRangeSelected(duration: Duration) {
  return isSameDay(selected.value.start, sub(new Date(), duration)) && isSameDay(selected.value.end, new Date())
}

function selectRange(duration: Duration) {
  selected.value = { start: sub(new Date(), duration), end: new Date() }
}
const items = [[{
  label: 'Documentation',
  icon: 'i-heroicons-book-open'
}, {
  label: 'Changelog',
  icon: 'i-heroicons-megaphone'
}, {
  label: 'Status',
  icon: 'i-heroicons-signal'
}]
]
const selectedDropdown = ref(items[0][0].label)
</script>
