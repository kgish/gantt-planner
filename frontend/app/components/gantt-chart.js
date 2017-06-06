import Ember from 'ember';

import ganttAttachEvents from '../lib/gantt/attach-events';
import ganttConfig from '../lib/gantt/config';

export default Ember.Component.extend({
    classNames: ['gantt-chart'],
    cid: null,
    tasks: null,
    scale_units: [
        {
            scale_unit: 'Day',
            date_scale: '%j %F'
        },
        {
            scale_unit: 'Week',
            date_scale: 'Week %W'
        },
        {
            scale_unit: 'Quarter',
            date_scale: '%F %Y'
        },
        {
            scale_unit: 'Month',
            date_scale: '%F %Y'
        },
        {
            scale_unit: 'Year',
            date_scale: '%Y'
        }
    ],

    current_scale_unit: 'Day',

    filter_status: [
        'All',
        'Pending',
        'Started',
        'Completed'
    ],

    current_filter_status: 'All',

    didInsertElement() {
        this.set('cid', $('.gantt-chart').attr('id'));
        ganttConfig();
    },

    didRender() {
        if ($('#gantt_here').length === 0) {
            let cid = this.get('cid'),
                sel_gantt_chart = '#'+cid,
                gantt_chart = $(sel_gantt_chart),
                tasks = this.get('tasks');

            gantt_chart.append('<div id="gantt_here"></div>');

            gantt.init('gantt_here');
            gantt.parse(tasks);

            ganttAttachEvents(this);
        }
    },

    actions: {
        scale(unit) {
            this.set('current_scale_unit', unit.scale_unit);
            gantt.config.scale_unit = unit.scale_unit.toLowerCase();
            gantt.config.date_scale = unit.date_scale;
            gantt.parse(this.get('tasks'));
        },
        filter(status) {
            this.set('current_filter_status', status);
            gantt.parse(this.get('tasks'));
        },
        save() {

        }
    }
});
