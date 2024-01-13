<template>
  <div class="profile-card">
    <form @submit.prevent="save">
      <AppAvatarImgEditor
        :src="activeUser.avatar"
        :alt="`${user.name}'s avatar preview`"
        :processing="uploadingImage"
        withRandom
        @change="handleAvatarChange"
      />
      <div class="form-group">
        <label for="username">Username</label>
        <input
          v-model="activeUser.username"
          id="username"
          type="text"
          placeholder="Username"
          class="form-input text-lead text-bold"
        />
      </div>

      <div class="form-group">
        <label for="name">Name</label>
        <input
          id="name"
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
import { webresourceToBlobAsync } from '@/helpers';

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
    handleAvatarChange(e) {
      console.log('UserProfileEdit->handleAvatarChange', e);
      this.uploadedFile = e.file;
      this.activeUser.avatar = e.dataUrl || e.url;
    },
    async handleAvatarUpload() {
      const randomAvatarGenerated = this.activeUser.avatar.includes('pixabay.com');
      this.uploadingImage = randomAvatarGenerated || this.uploadedFile != null;
      let uploadedImage = null;
      if (this.uploadedFile != null) {
        uploadedImage = await this.uploadAvatar({ file: this.uploadedFile });
      } else if (randomAvatarGenerated) {
        uploadedImage = await this.uploadAvatar({
          file: await webresourceToBlobAsync(this.activeUser.avatar),
        });
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
