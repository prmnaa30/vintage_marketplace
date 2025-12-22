<template>
  <UFooter
    class="bg-primary"
    :ui="{
      top: 'py-0 lg:py-0 pt-8 lg:pt-12'
    }"
  >
    <template #top>
      <UContainer>
        <UFooterColumns
          :columns="columns"
          :ui="{
            root: 'xl:grid-cols-2',
            label: 'text-white',
            link: 'text-neutral-100 hover:text-neutral-300 transition-colors duration-200',
            linkLabelExternalIcon: 'hidden'
          }"
        />

        <USeparator
          class="mt-8"
          size="md"
          :ui="{ border: 'border-neutral-300/50' }"
        />
      </UContainer>
    </template>

    <template #left>
      <div class="grid grid-cols-3 gap-6 mb-4">
        <NuxtLink
          v-for="(mediaItem, index) in socialMedia"
          :key="index"
          :to="mediaItem.to"
        >
          <UTooltip :text="mediaItem.tooltip">
            <img :src="mediaItem.icon" height="24" width="24" :alt="mediaItem.tooltip">
          </UTooltip>
        </NuxtLink>
      </div>
    </template>

    <template #right>
      <p class="text-sm text-white mb-4">
        © Vintage, {{ new Date().getFullYear() }}
      </p>
    </template>
  </UFooter>
</template>

<script setup lang="ts">
import type { FooterColumn } from '@nuxt/ui'
import whatsappIcon from '~/assets/icons/whatsapp.svg'
import instagramIcon from '~/assets/icons/instagram.svg'
import linkedinIcon from '~/assets/icons/linkedin.svg'

const columns: FooterColumn[] = [
  {
    label: 'Vintage',
    children: [
      {
        label: 'About',
        to: 'https://github.com/prmnaa30',
        target: '_blank'
      },
      {
        label: 'Sustainability',
        to: 'https://github.com/prmnaa30',
        target: '_blank'
      },
      {
        label: 'Blog',
        to: 'https://github.com/prmnaa30',
        target: '_blank'
      },
      {
        label: 'Advertising',
        to: 'https://github.com/prmnaa30',
        target: '_blank'
      }
    ]
  },
  {
    label: 'Discover',
    children: [
      {
        label: 'How It Works',
        to: 'https://github.com/prmnaa30',
        target: '_blank'
      },
      {
        label: 'Help Center',
        to: 'https://github.com/prmnaa30',
        target: '_blank'
      },
      {
        label: 'Info Board',
        to: 'https://github.com/prmnaa30',
        target: '_blank'
      },
      {
        label: 'Mobile Apps',
        to: 'https://github.com/prmnaa30',
        target: '_blank'
      }
    ]
  },
  {
    label: 'Help',
    children: [
      {
        label: 'Help Center',
        to: 'https://github.com/prmnaa30',
        target: '_blank'
      },
      {
        label: 'Buying',
        to: 'https://github.com/prmnaa30',
        target: '_blank'
      },
      {
        label: 'Trust & Safety',
        to: 'https://github.com/prmnaa30',
        target: '_blank'
      }
    ]
  },
  {
    label: 'Community',
    children: [
      {
        label: 'Forum',
        to: 'https://github.com/prmnaa30',
        target: '_blank'
      }
    ]
  }
]

const socialMedia = [
  {
    tooltip: 'Whatsapp',
    icon: whatsappIcon,
    to: '#'
  },
  {
    tooltip: 'Instagram',
    icon: instagramIcon,
    to: '#'
  },
  {
    tooltip: 'LinkedIn',
    icon: linkedinIcon,
    to: '#'
  }
]
</script>
