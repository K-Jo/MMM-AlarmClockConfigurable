/* global Module Log config moment MM */

/* Magic Mirror
 * Module: MMM-AlarmClock
 *
 * MIT Licensed.
 */

Module.register('MMM-AlarmClockConfigurable', {

    next: null,
    alarmFired: false,

    defaults: {
        sound: 'alarm.mp3',
        touch: true,
        volume: 1.0,
        format: 'ddd, h:mmA',
        timer: 60 * 1000 // one minute
    },

    getStyles() {
        return ['font-awesome.css', 'MMM-AlarmClockConfigurable.css'];
    },

    getScripts() {
        return ['moment.js'];
    },

    getTranslations() {
        return {
            en: 'translations/en.json',
            de: 'translations/de.json'
        };
    },

    start() {
        Log.info(`Starting module: ${this.name}`);
        setInterval(() => {
            this.checkAlarm();
        }, 1000);
        moment.locale(config.language);
    },

    checkAlarm() {
      if(!this.alarmFired){
        if(this.next && moment().diff(this.next.moment) >= 0){
          this.fireAlarm();
        } else {
          this.getNextAlarmTime();
        }
      }
    },

    getNextAlarmTime() {
      var self = this;
      var alarmRequest = new XMLHttpRequest();
      alarmRequest.open("GET", "http://bedroompi:8001/alarm/time/next", true);
      alarmRequest.onreadystatechange = function() {
        if (this.readyState === 4) {
          if (this.status === 200) {
            self.next = JSON.parse(this.response);
            self.next.moment = self.getMoment(JSON.parse(this.response));
            self.updateDom(300);
          } else {
            Log.info(self.name + " could not fetch alarm clock");
          }
        }
      };
      alarmRequest.send();
    },

    fireAlarm() {
      // const alert = {
      //     imageFA: 'bell-o',
      //     title: this.next.sender || this.next.title,
      //     message: this.next.message
      // };
      // if (!this.config.touch) {
      //     alert.timer = this.config.timer;
      // }
      // this.sendNotification('SHOW_ALERT', alert);
      this.alarmFired = true;
      this.updateDom(300);
      // this.timer = setTimeout(() => {
      //     this.resetAlarmClock();
      // }, this.config.timer);
      // if (this.config.touch) {
      //     MM.getModules().enumerate((module) => {
      //         if (module.name === 'alert') {
      //             module.alerts['MMM-AlarmClockConfigurable'].ntf.addEventListener('click', () => {
      //                 clearTimeout(this.timer);
      //                 this.resetAlarmClock();
      //             });
      //         }
      //     });
      // }
    },

    resetAlarmClock() {
        this.alarmFired = false;
        // if (this.config.touch) {
        //     this.sendNotification('HIDE_ALERT');
        // }
        this.getNextAlarmTime();
    },

    getDom() {
        const wrapper = document.createElement('div');
        const header = document.createElement('header');
        header.classList.add('align-left');

        const logo = document.createElement('i');
        logo.classList.add('fa', 'fa-bell-o', 'logo');
        header.appendChild(logo);

        const name = document.createElement('span');
        name.innerHTML = this.translate('ALARM_CLOCK');
        header.appendChild(name);
        wrapper.appendChild(header);

        if (!this.next) {
            const text = document.createElement('div');
            text.innerHTML = this.translate('LOADING');
            text.classList.add('dimmed', 'light');
            wrapper.appendChild(text);
        } else if (this.alarmFired) {
            const sound = document.createElement('audio');
            if (this.config.sound.match(/^http?:\/\//)) {
                sound.src = this.config.sound;
            } else {
                sound.src = this.file(`sounds/${this.config.sound}`);
            }
            sound.volume = this.config.volume;
            sound.setAttribute('autoplay', true);
            sound.setAttribute('loop', true);
            wrapper.appendChild(sound);

            const stopalarm = document.createElement('i');
            stopalarm.classList.add('fa', 'fa-bell-slash', 'logo');
            stopalarm.onclick = function ( this.resetAlarmClock(); );            
            wrapper.appendChild(stopalarm);
        } else {
            const alarm = document.createElement('div');
            alarm.classList.add('small');
            alarm.innerHTML = `${this.next.title}: ${this.next.moment.format(this.config.format)}`;
            wrapper.appendChild(alarm);
        }

        return wrapper;
    },

    getMoment(alarm) {
        const now = moment();
        let difference = Math.min();
        const hour = parseInt(alarm.time.split(':')[0]);
        const minute = parseInt(alarm.time.split(':')[1]);

        for (let i = 0; i < alarm.days.length; i += 1) {
            if (now.day() < alarm.days[i]) {
                difference = Math.min(alarm.days[i] - now.day(), difference);
            } else if (now.day() === alarm.days[i] && (parseInt(now.hour()) < hour ||
                (parseInt(now.hour()) === hour && parseInt(now.minute()) < minute))) {
                difference = Math.min(0, difference);
            } else if (now.day() === alarm.days[i]) {
                difference = Math.min(7, difference);
            } else {
                difference = Math.min((7 - now.day()) + alarm.days[i], difference);
            }
        }

        return moment().add(difference, 'days').set({
            hour,
            minute,
            second: 0,
            millisecond: 0
        });
    }
});
