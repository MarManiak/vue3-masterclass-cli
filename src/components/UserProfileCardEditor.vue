<template>
  <div class="profile-card">
    <VeeForm @submit="save">
      <AppAvatarImgEditor
        :src="activeUser.avatar"
        :alt="`${user.name}'s avatar preview`"
        :processing="uploadingImage"
        withRandom
        @change="handleAvatarChange"
      />
      <AppFormField
        label="Username"
        name="username"
        v-model="activeUser.username"
        :rules="`required|unique:users,username,${user.username}`"
      />
      <AppFormField label="Full Name" name="name" v-model="activeUser.name" rules="required" />
      <AppFormField
        label="Bio"
        name="bio"
        as="textarea"
        v-model="activeUser.bio"
        placeholder="Write a few words about yourself."
      />
      <AppFormField label="Website" name="website" v-model="activeUser.website" rules="url" />
      <AppFormField
        label="Email"
        name="email"
        v-model="activeUser.email"
        :rules="`required|email|unique:users,email,${user.email}`"
      />
      <AppFormField
        label="Location"
        name="location"
        v-model="activeUser.location"
        list="locations"
        @mouseenter="loadLocationOptions"
      />
      <datalist id="locations">
        <option
          v-for="location in locationOptions"
          :value="location.name.common"
          :key="location.cca2"
        />
      </datalist>

      <div class="btn-group space-between">
        <button class="btn-ghost" @click.prevent="cancel">Cancel</button>
        <button type="submit" class="btn-blue">Save</button>
      </div>
    </VeeForm>
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
      locationOptions: [],
    };
  },
  methods: {
    ...mapActions('auth', ['uploadAvatar']),
    async loadLocationOptions() {
      if (this.locationOptions.length) return;
      const res = await fetch('https://restcountries.com/v3/all?fields=name,cca2,cca3');
      const locationResults = await res.json();
      locationResults.sort((a, b) => a.name.common.localeCompare(b.name.common));
      this.locationOptions = locationResults;
    },
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
