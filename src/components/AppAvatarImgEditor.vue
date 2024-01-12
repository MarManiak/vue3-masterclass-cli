<template>
  <p class="text-center avatar-edit">
    <label for="avatar">
      <AppAvatarImg :src="avatar" alt="profile image" class="avatar-xlarge img-update" />
      <div class="avatar-upload-overlay">
        <AppSpinner v-if="uploadingImage" color="white" />
        <fa v-else icon="camera" size="3x" :style="{ color: 'white', opacity: '.8' }" />
      </div>
      <input v-show="false" type="file" id="avatar" accept="image/*" @change="handleAvatarUpload" />
    </label>
  </p>
  <AppAvatarImgEditorRandomAvatar @hit="onRandomAvatarHit" />
</template>
<script>
export default {
  emits: ['upload', 'random'],
  props: {
    avatar: {
      type: String,
      required: true,
    },
    uploadingImage: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {};
  },
  methods: {
    handleAvatarUpload(e) {
      const file = e.target.files[0];
      let dataUrl = '';
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        dataUrl = reader.result;
        this.$emit('upload', { file, dataUrl });
      });
      reader.readAsDataURL(file);
    },
    onRandomAvatarHit(e) {
      // console.log('onRandomAvatarHit', {
      //   userImageURL: e.eventData.userImageURL,
      //   previewURL: e.eventData.previewURL,
      //   e,
      // });
      this.$emit('random', {
        url: e.eventData.userImageURL || e.eventData.previewURL || e.eventData.webformatURL,
      });
    },
  },
};
</script>
