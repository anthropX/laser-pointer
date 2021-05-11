const app = Vue.createApp({
  data() {
    return {
      canvasWidth: 0,
      canvasHeight: 0,
      ctx: null,
      points: [
        // {
        //   x, y, dob
        // }
      ],
      duration: 100,
      hueOffset: 0,
    }
  },
  computed: {

  },
  mounted() {
    const self = this;
    const canvas = self.$refs.myCanvas;
    self.canvasWidth = canvas.width = window.innerWidth;
    self.canvasHeight = canvas.height = window.innerHeight;
    if (canvas.getContext) {
      self.ctx  = canvas.getContext('2d');
      self.captureMouseMovements();
      self.createMouseTrail()
    }
  },
  methods: {
    createMouseTrail() {
      const self = this;
      self.paintBg();
      self.hueOffset = self.hueOffset + 1;
      self.points.forEach(function(point, index) {
        let currentTime = new Date();
        let doe = new Date(point.dob);
        doe.setMilliseconds(doe.getMilliseconds() + self.duration);
        if(currentTime > doe) {
          self.points.shift();
          return;
        }
        let previousPoint = point;
        if(index > 0) {
          previousPoint = self.points[index-1];
        }
        self.ctx.beginPath();
        console.log(currentTime, doe, doe - currentTime, self.duration)
        self.ctx.lineWidth = Math.sqrt((doe - currentTime)/self.duration*100);
        self.ctx.strokeStyle = `hsl(${self.hueOffset + (doe - currentTime)/self.duration * 90}, 100%, 50%)`;
        // ${(doe - currentTime)/self.duration * 100}%
        self.ctx.lineJoin = 'round';
        self.ctx.lineTo(previousPoint.x , previousPoint.y);
        self.ctx.lineTo(point.x, point.y);
        // self.ctx.arc(previousPoint.x, previousPoint.y, 50, 0, Math.PI);
        // self.ctx.arc(point.x, point.y, 50, 0, Math.PI);
        self.ctx.stroke();
        self.ctx.closePath();
      });
      requestAnimationFrame(self.createMouseTrail);
    },
    paintBg() {
      this.ctx.fillStyle = 'hsl(0, 0%, 0%)';
      this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    },
    captureMouseMovements() {
      const self = this;
        document.addEventListener('mousemove', function(event) {
          self.points.push({x: event.pageX, y: event.pageY, dob: new Date()});
        });
    }
  }
});

app.mount('.app');