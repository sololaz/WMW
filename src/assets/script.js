var app = new Vue({
  el: '#app',
  data() {
    return {
      options: {
        dragThreshold: 50,
        initialIndex: 1,
        prevNextButtons: false,
        pageDots: false,
        wrapAround: false,
        hash: true,
        percentPosition: false,
      },
      itemsCount: 5,
      flkty: null,
    }
  },
  mounted: function () {
    this.flkty = new Flickity(`#${this.$el.id} .carousel`);
    this.flkty.on( 'dragStart', function() {
      console.log('dragStart');
    });
  }
})

Vue.config.devtools = false;
Vue.config.productionTip = false;