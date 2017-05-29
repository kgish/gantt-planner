/* global gantt :true */
import Ember from 'ember';

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

        gantt.config.scale_unit = 'day';
        gantt.config.date_scale = '%j %F';

        gantt.attachEvent("onBeforeTaskDisplay", (id, task) => {
            let current_filter_status = this.get('current_filter_status');
            return (
                (current_filter_status === 'All') ||
                (current_filter_status === 'Pending' && task.progress === 0) ||
                (current_filter_status === 'Started' && task.progress > 0 && task.progress < 1) ||
                (current_filter_status === 'Completed' && task.progress === 1)
            );
        });
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
