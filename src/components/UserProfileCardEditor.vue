<template>
  <div class="profile-card">
    <form @submit.prevent="save">
      <!-- <p class="text-center avatar-edit">
        <label for="avatar">
          <AppAvatarImg
            :src="activeUser.avatar"
            :alt="`${user.name} profile picture`"
            class="avatar-xlarge img-update"
          />
          <div class="avatar-upload-overlay">
            <AppSpinner v-if="uploadingImage" color="white" />
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
      <UserProfileCardEditorRandomAvatar @hit="onRandomAvatarHit" /> -->
      <AppAvatarImgEditor
        :avatar="activeUser.avatar"
        :uploadingImage="uploadingImage"
        @upload="handleUploadImage"
        @random="handleRandomImage"
      />
      <div class="form-group">
        <input
          v-model="activeUser.username"
          type="text"
          placeholder="Username"
          class="form-input text-lead text-bold"
        />
      </div>

      <div class="form-group">
        <input
          v-model="activeUser.name"
          type="text"
          placeholder="Full Name"
          class="form-input text-lead"
        />
      </div>

      <div class="form-group">
        <label for="user_bio">Bio</label>
        <textarea
          v-model="activeUser.bio"
          class="form-input"
          id="user_bio"
          placeholder="Write a few words about yourself."
        ></textarea>
      </div>

      <div class="stats">
        <span>{{ user.postsCount }} posts</span>
        <span>{{ user.threadsCount }} threads</span>
      </div>

      <hr />

      <div class="form-group">
        <label class="form-label" for="user_website">Website</label>
        <input
          v-model="activeUser.website"
          autocomplete="off"
          class="form-input"
          id="user_website"
        />
      </div>

      <div class="form-group">
        <label class="form-label" for="user_email">Email</label>
        <input v-model="activeUser.email" autocomplete="off" class="form-input" id="user_email" />
      </div>

      <div class="form-group">
        <label class="form-label" for="user_location">Location</label>
        <input
          v-model="activeUser.location"
          autocomplete="off"
          class="form-input"
          id="user_location"
        />
      </div>

      <div class="btn-group space-between">
        <button class="btn-ghost" @click.prevent="cancel">Cancel</button>
        <button type="submit" class="btn-blue">Save</button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
// import UserProfileCardEditorRandomAvatar from './UserProfileCardEditorRandomAvatar';
export default {
  // components: { UserProfileCardEditorRandomAvatar },
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      uploadingImage: false,
      uploadedFile: null,
      randomAvatarImageType: '',
      activeUser: { ...this.user },
    };
  },
  methods: {
    ...mapActions('auth', ['uploadAvatar']),
    handleUploadImage(e) {
      // this.uploadingImage = true;
      this.uploadedFile = e.file;
      this.activeUser.avatar = e.dataUrl;
    },
    handleRandomImage(e) {
      this.uploadedFile = null;
      this.activeUser.avatar = e.url;
    },
    async handleAvatarUpload() {
      const randomAvatarGenerated = this.activeUser.avatar.includes('pixabay.com');
      this.uploadingImage = randomAvatarGenerated || this.uploadedFile != null;
      let uploadedImage = null;
      if (this.uploadedFile != null) {
        uploadedImage = await this.uploadAvatar({ file: this.uploadedFile });
      } else if (randomAvatarGenerated) {
        const image = await fetch(this.activeUser.avatar);
        const blob = await image.blob();
        // console.log('handleRandomAvatarUpload', { image, blob });
        uploadedImage = await this.uploadAvatar({ file: blob, filename: 'avatar' });
      }
      this.activeUser.avatar = uploadedImage || this.activeUser.avatar;
      this.uploadingImage = false;
    },
    async save() {
      await this.handleAvatarUpload();
      this.$store.dispatch('users/updateUser', { ...this.activeUser });
      this.$router.push({ name: 'Profile' });
    },
    cancel() {
      this.$router.push({ name: 'Profile' });
    },
  },
};
</script>
