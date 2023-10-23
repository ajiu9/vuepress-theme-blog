<script>
import { ensureExt, isExternal, isMailto, isTel } from '../components/util'

export default {
  props: {
    link: {
      required: true,
    },
  },

  computed: {
    normalizedlink() {
      return ensureExt(this.link)
    },

    exact() {
      if (this.$site.locales) {
        return Object.keys(this.$site.locales).includes(
          this.normalizedlink,
        )
      }
      return this.normalizedlink === '/'
    },
  },

  methods: {
    isExternal,
    isMailto,
    isTel,
  },
}
</script>

<template>
  <router-link
    v-if="!isExternal(normalizedlink)"
    class="nav-link"
    :to="normalizedlink"
    :exact="exact"
  >
    <slot />
  </router-link>
  <a
    v-else
    :href="normalizedlink"
    class="nav-link external"
    :target="
      isMailto(normalizedlink) || isTel(normalizedlink) ? null : '_blank'
    "
    :rel="
      isMailto(normalizedlink) || isTel(normalizedlink)
        ? null
        : 'noopener noreferrer'
    "
  >
    <slot />
  </a>
</template>

<style lang="stylus">
.nav-link
  color $darkTextColor

.nav-link
  &:hover, &.router-link-active
    color $accentColor
</style>
