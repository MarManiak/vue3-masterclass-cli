@@ -0,0 +1,66 @@
<template>
  <div class="flex-grid justify-center">
    <div class="col-2">
      <form @submit.prevent="register" class="card card-form">
        <h1 class="text-center">Register</h1>

        <div class="form-group">
          <label for="name">Full Name</label>
          <input v-model="form.name" id="name" type="text" class="form-input" />
        </div>

        <div class="form-group">
          <label for="username">Username</label>
          <input v-model="form.username" id="username" type="text" class="form-input" />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input v-model="form.email" id="email" type="email" class="form-input" />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input v-model="form.password" id="password" type="password" class="form-input" />
        </div>

        <div class="form-group">
          <AppAvatarImgEditor
            :src="avatarPreview"
            :processing="uploadingImage"
            withRandom
            alt="new user avatar preview"
            @change="handleAvatarChange"
          />
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-blue btn-block">Register</button>
        </div>
      </form>
      <div class="text-center push-top">
        <button @click="registerWithGoogle" class="btn-red btn-xsmall">
          <i class="fa fa-google fa-btn"></i>Sign up with Google
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { webresourceToBlobAsync } from '@/helpers';
export default {
  data() {
    return {
      uploadedFile: null,
      avatarPreview: '',
      uploadingImage: false,
      form: {
        name: '',
        username: '',
        email: '',
        password: '',
        avatar: '',
      },
    };
  },
  methods: {
    handleAvatarChange(e) {
      console.log('Register->handleAvatarChange', e);
      this.uploadedFile = e.file;
      this.avatarPreview = e.dataUrl || e.url;
    },
    async getAvatarData() {
      const randomAvatarGenerated = this.avatarPreview.includes('pixabay.com');
      this.uploadingImage = randomAvatarGenerated || this.uploadedFile != null;
      let avatar = null;
      if (this.uploadedFile != null) {
        avatar = this.uploadedFile;
      } else if (randomAvatarGenerated) {
        avatar = await webresourceToBlobAsync(this.avatarPreview);
      }
      this.form.avatar = avatar || this.form.avatar;
    },

    async register() {
      await this.getAvatarData();
      await this.$store.dispatch('auth/registerUserWithEmailAndPassword', {
        ...this.form,
        systemId: this.$route.query.systemId,
      });
      this.uploadingImage = false;
      this.successRedirect();
    },
    async registerWithGoogle() {
      await this.getAvatarData();
      await this.$store.dispatch('auth/signInWithGoogle', {
        ...this.form,
        systemId: this.$route.query.systemId,
      });
      this.uploadingImage = false;
      this.successRedirect();
    },
    // handleImageUpload(e) {
    //   this.form.avatar = e.target.files[0];
    //   const reader = new FileReader();
    //   reader.onload = (event) => {
    //     this.avatarPreview = event.target.result;
    //   };
    //   reader.readAsDataURL(this.form.avatar);
    // },
    successRedirect() {
      console.log('redirecting');
      const redirectTo = this.$route.query.redirectTo || { name: 'Home' };
      this.$router.push(redirectTo);
    },
  },
  created() {
    this.$emit('ready');
  },
};
</script>
