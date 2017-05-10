/* global gantt :true */
import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['gantt-chart'],
    cid: null,
    tasks: null,
    scale_units: null,

    didInsertElement() {
        this.set('cid', $('.gantt-chart').attr('id'));
    },

    didRender() {
        let cid = this.get('cid'),
            sel_gantt_chart = '#'+cid,
            gantt_chart = $(sel_gantt_chart);
            // gantt_here = $('div').attr('id', 'gantt_here');

        gantt_chart.css({
            width: '100%',
            height: '80%'
        });

        gantt_chart.append('<div id="gantt_here" style="width:100%;height:80%"></div>');

        //gantt.init(this.get('cid'));
        gantt.init('gantt_here');
        gantt.parse(this.get('tasks'));
    },

    actions: {
        scale(unit) {
            gantt.config.scale_unit = unit;
        }
    }
});
