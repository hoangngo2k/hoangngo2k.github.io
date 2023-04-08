// Một số bài hát có thể bị lỗi do liên kết bị hỏng. Vui lòng thay thế liên kết khác để có thể phát
// Some songs may be faulty due to broken links. Please replace another link so that it can be played

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'F8_KEY';

const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const btnPlay = $('.btn-toggle-play');
const play = $('.player');
const progress = $('#progress');
const btnNext = $('.btn-next');
const btnPrev = $('.btn-prev');
const btnRepeat = $('.btn-repeat');
const btnRandom = $('.btn-random');
const playlist = $('.playlist');

const app = { 
  currentIndex: 0, 
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  songs: [
    {
      name: "Đâu Còn Đây",
      singer: "Lee-Ken",
      path: "./assets/music/Dau-Con-Day-Lee-Ken-Nal.mp3",
      image: "./assets/image/dau_con_day.jpg"
    },
    {
      name: "Mộng Mơ",
      singer: "Masew-RedT",
      path: "./assets/music/Mong-Mo-Masew-RedT-Great.mp3",
      image: "./assets/image/mong_mo.jpg"
    },
    {
      name: "Răng Khôn",
      singer: "Phi Phuong Anh",
      path: "./assets/music/Rang-Khon-Phi-Phuong-Anh-RIN9.mp3",
      image: "./assets/image/rang_khon.jpg"
    },
    {
      name: "Yêu 5",
      singer: "Phi Phuong Anh",
      path: "./assets/music/Yeu-5-Rhymastic.mp3",
      image: "./assets/image/yeu_5.jpg"
    },
    {
      name: "Có Em Chờ",
      singer: "Min",
      path: "./assets/music/Co-Em-Cho-MIN-Mr-A.mp3",
      image: "./assets/image/co_em_cho.jpg"
    },
    {
      name: "Buồn Của Anh",
      singer: "DatG",
      path: "./assets/music/Buon-Cua-Anh-K-ICM-Dat-G-Masew.mp3",
      image: "./assets/image/buon_cua_anh.jpg"
    },
    {
      name: "Ánh Nắng Của Anh",
      singer: "Đức Phúc",
      path: "./assets/music/Anh-Nang-Cua-Anh-Cho-Em-Den-Ngay-Mai-OST-Duc-Phuc.mp3",
      image: "./assets/image/anh_nang_cua_anh.jpg"
    }
  ],
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.getItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
      <div class="song ${index === this.currentIndex ? 'active':''}" data-index="${index}">
        <div class="thumb" style="background-image: url('${song.image}');">
        </div>
        <div class="song">
          <h3 class="title">${song.name}</h3>
          <p class="author">${song.singer}</p>
        </div>
        <div class="option">
          <i class="fas fa-ellipsis-h"></i>
        </div>
      </div>
      `
    })
    $('.playlist').innerHTML = htmls.join('');
  },
  handleEvents: function () {    

    const cdWidth = cd.offsetWidth;

    // Xử lý CD
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newWidth = cdWidth - scrollTop;      
      cd.style.width = newWidth > 0 ? newWidth + "px": 0;
      cd.style.opacity = newWidth/cdWidth;
    }

    //Xử lý quay CD
    const cdThumbrotate = cdThumb.animate([
      {transform: 'rotate(360deg)'}
    ], {
      duration: 10000,
      iterations: Infinity
    })
    cdThumbrotate.pause();

    //Xử lý khi click play
    btnPlay.onclick = function () {
      if (app.isPlaying) {
        audio.pause();
      } else {        
        audio.play();
      }
    }

    //khi bài hát play
    audio.onplay = function () {
      app.isPlaying = true;
      play.classList.add('playing');
      cdThumbrotate.play();
    }

    //khi bài hát pause
    audio.onpause = function () {
      app.isPlaying = false;
      play.classList.remove('playing');
      cdThumbrotate.pause();
      
    }

    //xừ lý progress
    audio.ontimeupdate = function () {
      if(audio.duration) {
        const progresses = Math.floor(audio.currentTime / audio.duration * 100);
        progress.value = progresses;
        progress.style.background = 'linear-gradient(to right, #ec1f55 0%, #ec1f55 ' + progresses + '%, #d3d3d3 ' + progresses + '%, #d3d3d3 100%)';
      }
    }

    //xử lý khi tua
    progress.onclick = function (e) {
      const seekTime = audio.duration / 100 * e.target.value;
      audio.currentTime = seekTime;
    }

    //khi next bài hát
    btnNext.onclick = function () {
      if (app.isRandom) {
        app.randomSong();        
      } else {
        app.nextSong();
      }
      audio.play();
      app.render();
      app.scrollToActiveSong();
    }

    //Khi prev bài hát
    btnPrev.onclick = function () {
      if (app.isRandom) {
        app.randomSong();        
      } else {
        app.prevSong();
      }
      audio.play();
      app.render();
      app.scrollToActiveSong();
    }

    //khi random bài hát
    btnRandom.onclick = function (e) {
      app.isRandom = !app.isRandom;
      app.setConfig('isRandom', app.isRandom);
      btnRandom.classList.toggle('active', app.isRandom);
      app.render();

    }

    //khi kết thúc bài hát
    audio.onended = function () {
      if(app.isRepeat) {
        audio.play();
      } else {
        btnNext.click();
        app.render();
      }
    }

    //khi repeat bài hát
    btnRepeat.onclick = function () {
      app.isRepeat = !app.isRepeat;
      app.setConfig('isRepeat', app.isRepeat);
      btnRepeat.classList.toggle('active', app.isRepeat);
      app.render();

    }

    //khi click vào playlist
    playlist.onclick = function (e) {
      const songNode = e.target.closest('.song:not(.active)');
      if(songNode || (e.target.closest('.option'))) {
        if(songNode) {
          app.currentIndex = Number(songNode.dataset.index);
          app.loadCurrentSong();
          app.render();
          audio.play();
        }
      }
    }
  },
  defineProperties: function () {
    Object.defineProperty(this,'currentSong', {
      get: function () {
        return this.songs[this.currentIndex];
      }
    })
  },
  loadCurrentSong: function () {    
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;    
  },
  repeatSong: function () {
    
  },
  nextSong: function () {
    this.currentIndex++;
    if(this.currentIndex >= this.songs.length )
      this.currentIndex = 0;
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if(this.currentIndex < 0)
      this.currentIndex = this.songs.length - 1;
    this.loadCurrentSong();
  },
  randomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  scrollToActiveSong: function () {
    setTimeout(() => {
      $('.song.active').scrollIntoView({
        behavior: 'smoth',
        block: 'nearest'
      })
    }, 300);
  },
  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },
  start: function () {
    this.loadConfig();

    this.defineProperties();

    this.handleEvents();

    this.loadCurrentSong();

    this.render();
  }
}
app.start();