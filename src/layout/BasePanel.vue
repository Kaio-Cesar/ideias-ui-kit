<template>
  <div v-bind="$attrs" :class="cn(panel({ style }), className)">
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { tv } from 'tailwind-variants'

import { cn } from '@/lib/utils'

const panel = tv({
  base: 'rounded-lg border-2 border-zinc-300 dark:border-zinc-600',
  variants: {
    style: {
      primary: 'bg-zinc-100 dark:bg-zinc-900',
      glass: 'bg-neutral-200/30 backdrop-blur-md',
    },
  },
  defaultVariants: {
    style: 'primary',
  },
})

const { class: className, style } = defineProps<{
  class?: HTMLAttributes['class']
  style?: 'glass'
}>()
</script>
