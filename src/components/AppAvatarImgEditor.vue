<template>
  <div class="form-group">
    <p class="text-center avatar-edit">
      <label for="avatar">
        <AppAvatarImg class="avatar-xlarge img-update" v-bind="$attrs" />
        <div class="avatar-upload-overlay">
          <AppSpinner v-if="processing" color="white" />
          <fa v-else icon="camera" size="3x" :style="{ color: 'white', opacity: '.8' }" />
        </div>
        <input
          v-show="false"
          type="file"
          id="avatar"
          accept="image/*"
          @change="handleAvatarUpload"
        />
      </label>
    </p>
    <AppAvatarImgEditorRandomAvatar v-if="withRandom" @hit="onRandomAvatarHit" />
  </div>
</template>
<script>
import { fileAsDataUrlAsync } from '@/helpers';
export default {
  emits: ['change'],
  props: {
    processing: {
      type: Boolean,
      default: false,
    },
    withRandom: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  methods: {
    async handleAvatarUpload(e) {
      try {
        const file = e.target.files[0];
        const dataUrl = await fileAsDataUrlAsync(file);
        this.$emit('change', { file, dataUrl });
      } catch (e) {
        console.error(e);
      } finally {
        this.pro;
      }
    },
    onRandomAvatarHit(e) {
      const randomImage = e.eventData || {};
      const url = randomImage.userImageURL || randomImage.previewURL || randomImage.webformatURL;
      if (url) this.$emit('change', { url });
    },
  },
};
</script>
