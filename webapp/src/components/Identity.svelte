<script>
  import box from '../stores/3box'
  export let profile;
  let src;
  $: if (profile.image){
    let url = profile.image[0].contentUrl["/"]
    src = `https://ipfs.io/ipfs/${url}`
  } else {
    src = "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/153/mage_1f9d9.png"
  }
</script>
<div>
    <img 
      class="mx-auto max-w-xs w-20 border border-blue-600"
      src={src} alt="profilePic">
</div>
